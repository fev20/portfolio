'use strict';

const ABI = 'zero ra sp gp tp t0 t1 t2 s0 s1 a0 a1 a2 a3 a4 a5 a6 a7 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 t3 t4 t5 t6'.split(' ');
const hex = (value, digits = 8) => (value >>> 0).toString(16).padStart(digits, '0');
const signed = (value, width) => (value << (32 - width)) >> (32 - width);

function decode(word) {
  const opcode = word & 0x7f;
  const rd = (word >>> 7) & 31;
  const fn = (word >>> 12) & 7;
  const rs1 = (word >>> 15) & 31;
  const rs2 = (word >>> 20) & 31;
  const high = word >>> 25;
  let name;
  let immediate = signed(word >>> 20, 12);
  let format;
  switch (opcode) {
    case 0x37: case 0x17:
      name = opcode === 0x37 ? 'lui' : 'auipc';
      immediate = word & 0xfffff000;
      format = 'upper';
      break;
    case 0x6f:
      name = 'jal';
      immediate = signed(((word >>> 31) << 20) | (((word >>> 12) & 255) << 12) |
        (((word >>> 20) & 1) << 11) | (((word >>> 21) & 1023) << 1), 21);
      format = 'jump';
      break;
    case 0x67:
      if (fn === 0) name = 'jalr';
      format = 'load';
      break;
    case 0x63:
      name = ['beq', 'bne', null, null, 'blt', 'bge', 'bltu', 'bgeu'][fn];
      immediate = signed(((word >>> 31) << 12) | (((word >>> 7) & 1) << 11) |
        (((word >>> 25) & 63) << 5) | (((word >>> 8) & 15) << 1), 13);
      format = 'branch';
      break;
    case 0x03:
      name = ['lb', 'lh', 'lw', null, 'lbu', 'lhu'][fn];
      format = 'load';
      break;
    case 0x23:
      name = ['sb', 'sh', 'sw'][fn];
      immediate = signed((high << 5) | rd, 12);
      format = 'store';
      break;
    case 0x13:
      name = ['addi', 'slli', 'slti', 'sltiu', 'xori', 'srli', 'ori', 'andi'][fn];
      if (fn === 1 || fn === 5) {
        immediate = rs2;
        if (fn === 5 && high === 32) name = 'srai';
        else if (high !== 0) name = undefined;
      }
      format = 'immediate';
      break;
    case 0x33:
      if (high === 0) name = ['add', 'sll', 'slt', 'sltu', 'xor', 'srl', 'or', 'and'][fn];
      if (high === 32) name = {0: 'sub', 5: 'sra'}[fn];
      format = 'register';
      break;
    case 0x0f:
      if (fn === 0) name = 'fence';
      break;
    case 0x73:
      if (word === 0x73) name = 'ecall';
      if (word === 0x00100073) name = 'ebreak';
      break;
  }
  if (!name) return null;
  return {word, name, rd, rs1, rs2, immediate, format};
}

function assembly(instruction, address) {
  if (!instruction) return '지원하지 않는 명령';
  const {name, format, rd, rs1, rs2, immediate} = instruction;
  const [dest, left, right] = [rd, rs1, rs2].map(index => ABI[index]);
  const target = `0x${hex(address + immediate)}`;
  const operands = {
    upper: `${dest}, 0x${hex(immediate >>> 12, 1)}`,
    jump: `${dest}, ${target}`,
    branch: `${left}, ${right}, ${target}`,
    load: `${dest}, ${immediate}(${left})`,
    store: `${right}, ${immediate}(${left})`,
    immediate: `${dest}, ${left}, ${immediate}`,
    register: `${dest}, ${left}, ${right}`,
  }[format];
  return operands ? `${name} ${operands}` : name;
}

const LOADS = {lb: [1, true], lh: [2, true], lw: [4, false], lbu: [1, false], lhu: [2, false]};
const STORES = {sb: 1, sh: 2, sw: 4};
const BRANCHES = {
  beq: (a, b) => a === b, bne: (a, b) => a !== b,
  blt: (a, b) => (a | 0) < (b | 0), bge: (a, b) => (a | 0) >= (b | 0),
  bltu: (a, b) => a < b, bgeu: (a, b) => a >= b,
};
const ALU = {
  add: (a, b) => a + b, sub: (a, b) => a - b, sll: (a, b) => a << b,
  slt: (a, b) => Number((a | 0) < (b | 0)), sltu: (a, b) => Number(a < (b >>> 0)),
  xor: (a, b) => a ^ b, srl: (a, b) => a >>> b, sra: (a, b) => (a | 0) >> b,
  or: (a, b) => a | b, and: (a, b) => a & b,
};
const IMMEDIATE_OPS = {addi: 'add', slli: 'sll', slti: 'slt', sltiu: 'sltu', xori: 'xor', srli: 'srl', srai: 'sra', ori: 'or', andi: 'and'};

class Machine {
  constructor(program) {
    this.segments = program.segments;
    this.registers = new Uint32Array(32);
    this.memory = new Uint8Array(0x20000);
    this.view = new DataView(this.memory.buffer);
    for (const segment of this.segments) {
      for (let index = 0; index < segment.bytes.length; index += 2) {
        this.memory[segment.address + index / 2] = Number.parseInt(segment.bytes.slice(index, index + 2), 16);
      }
    }
    this.pc = program.entry;
    this.count = 0;
    this.exit = null;
    this.trap = null;
    this.last = null;
    this.stdout = [];
  }

  check(address, length, flag, alignment = 1) {
    if (address % alignment !== 0) throw new Error(`정렬되지 않은 주소 0x${hex(address)}`);
    const allowed = this.segments.some(segment => (segment.flags & flag) === flag &&
      address >= segment.address && address + length <= segment.address + segment.size);
    if (!allowed || address + length > this.memory.length) throw new Error(`접근할 수 없는 주소 0x${hex(address)}`);
  }

  fetch(address) {
    this.check(address, 4, 1, 4);
    return this.view.getUint32(address, true);
  }

  load(address, size, sign) {
    this.check(address, size, 4, size);
    if (size === 1) return sign ? this.view.getInt8(address) : this.view.getUint8(address);
    if (size === 2) return sign ? this.view.getInt16(address, true) : this.view.getUint16(address, true);
    return this.view.getUint32(address, true);
  }

  store(address, size, value) {
    this.check(address, size, 2, size);
    if (size === 1) this.view.setUint8(address, value);
    if (size === 2) this.view.setUint16(address, value, true);
    if (size === 4) this.view.setUint32(address, value, true);
  }

  step() {
    if (this.trap !== null || this.exit !== null) return null;
    const pc = this.pc;
    const event = {pc, nextPc: pc, instruction: null, register: null, memory: null, note: ''};
    try {
      const word = this.fetch(pc);
      const instruction = decode(word);
      if (!instruction) throw new Error(`지원하지 않는 명령 0x${hex(word)}`);
      event.instruction = instruction;
      const {name, rd, rs1, rs2, immediate} = instruction;
      const [a, b] = [this.registers[rs1], this.registers[rs2]];
      let result;
      let nextPc = (pc + 4) >>> 0;
      let jump;
      if (name === 'lui' || name === 'auipc') {
        result = (name === 'auipc' ? pc : 0) + immediate;
      } else if (name === 'jal' || name === 'jalr') {
        jump = name === 'jal' ? pc + immediate : (a + immediate) & ~1;
        result = nextPc;
        event.note = '점프';
      } else if (Object.hasOwn(BRANCHES, name)) {
        if (BRANCHES[name](a, b)) {
          jump = pc + immediate;
          event.note = '분기 조건 충족';
        } else {
          event.note = '다음 명령으로 진행';
        }
      } else if (Object.hasOwn(LOADS, name) || Object.hasOwn(STORES, name)) {
        const address = (a + immediate) >>> 0;
        const isLoad = Object.hasOwn(LOADS, name);
        const size = isLoad ? LOADS[name][0] : STORES[name];
        if (isLoad) result = this.load(address, size, LOADS[name][1]);
        else this.store(address, size, b);
        event.memory = {address, size, kind: isLoad ? '읽기' : '쓰기'};
      } else if (Object.hasOwn(ALU, name)) {
        result = ALU[name](a, b);
      } else if (Object.hasOwn(IMMEDIATE_OPS, name)) {
        result = ALU[IMMEDIATE_OPS[name]](a, immediate);
      } else if (name === 'ecall') {
        const [arg0, arg1, arg2, syscall] = [10, 11, 12, 17].map(index => this.registers[index]);
        if (syscall === 93) {
          this.exit = arg0;
          nextPc = pc;
          event.note = '예제 실행 완료';
        } else if (syscall === 64 && arg0 === 1) {
          this.check(arg1, arg2, 4);
          this.stdout.push(...this.memory.slice(arg1, arg1 + arg2));
          this.writeRegister(10, arg2, event);
          event.note = '결과 버퍼 출력';
        } else {
          throw new Error(`지원하지 않는 시스템 호출 ${syscall}`);
        }
      } else if (name === 'ebreak') {
        throw new Error('EBREAK 중단점');
      }
      if (jump !== undefined) {
        nextPc = jump >>> 0;
        if (nextPc % 4 !== 0) throw new Error(`정렬되지 않은 점프 주소 0x${hex(nextPc)}`);
      }
      if (result !== undefined && rd !== 0) this.writeRegister(rd, result, event);
      event.nextPc = nextPc;
      this.pc = nextPc;
      this.count++;
    } catch (error) {
      this.trap = error.message;
      event.note = this.trap;
    }
    this.last = event;
    return event;
  }

  writeRegister(index, value, event) {
    const before = this.registers[index];
    this.registers[index] = value;
    if (before !== this.registers[index]) event.register = {index, before, value: this.registers[index]};
  }
}

if (typeof module !== 'undefined') module.exports = {ABI, hex, decode, assembly, Machine};
