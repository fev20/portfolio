'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {Machine, hex, decode} = require('./engine.cjs');

const artifacts = path.resolve(process.argv[2] ?? 'build');
const qemu = process.env.RISCV_QEMU || 'qemu-riscv32';
const expected = {
  sum: [21, '15000000000000000000000000000000'],
  stack: [29, '1d000000000000000000000000000000'],
  copy: [6, '52563332492100000000000000000000'],
  edges: [42, '80ffffff80000000feffffff80000000'],
};

function readTrace(filename) {
  const states = [];
  for (const line of fs.readFileSync(filename, 'utf8').split('\n')) {
    const pc = /^\s*pc\s+([0-9a-f]+)\s*$/.exec(line);
    if (pc) states.push({pc: parseInt(pc[1], 16), regs: []});
    for (const reg of line.matchAll(/x(\d+)\/\w+\s+([0-9a-f]+)/g)) {
      states.at(-1).regs[Number(reg[1])] = parseInt(reg[2], 16);
    }
  }
  return states;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'riscv-verify-'));
try {
  const cases = JSON.parse(fs.readFileSync(path.join(artifacts, 'programs.json'), 'utf8'));
  for (const program of cases) {
    const log = path.join(tmp, `${program.id}.log`);
    const reference = spawnSync(qemu, ['-one-insn-per-tb', '-d', 'cpu', '-D', log, path.join(artifacts, `${program.id}.elf`)]);
    if (reference.error) throw reference.error;
    const [result, memory] = expected[program.id];
    assert.equal(reference.status, result, `${program.id} QEMU exit`);
    assert.equal(reference.stdout.toString('hex'), memory, `${program.id} QEMU memory`);
    const trace = readTrace(log);
    const machine = new Machine(program);
    let step = 0;
    for (const snapshot of trace) {
      assert.equal(snapshot.regs.length, 32, `${program.id} trace register count`);
      assert.equal(machine.pc, snapshot.pc, `${program.id} step ${step} PC`);
      const actual = Array.from(machine.registers);
      // QEMU provides an OS initial stack. Both states must agree after the
      // first instruction sets sp to the lab's deterministic stack address.
      if (step === 0) snapshot.regs[2] = actual[2];
      assert.deepEqual(actual, snapshot.regs, `${program.id} step ${step} PC 0x${hex(machine.pc)}`);
      assert(machine.step(), `${program.id} step ${step} stopped early`);
      assert.equal(machine.trap, null, `${program.id} step ${step} trap`);
      step++;
    }
    assert.equal(machine.exit, reference.status, `${program.id} browser engine exit`);
    assert.deepEqual(Buffer.from(machine.stdout), reference.stdout, `${program.id} browser engine output`);
    assert.deepEqual(Buffer.from(machine.memory.slice(0x12000, 0x12010)), reference.stdout, `${program.id} result buffer`);
    console.log(`${program.id}: ${step} PCs, ${step * 32 - 1} register values, 16 memory bytes, exit ${result}`);
  }

  const badPrograms = [
    [0x00000000, /지원하지 않는 명령/],
    [0x00100073, /EBREAK/],
    [0x002000ef, /정렬되지 않은 점프/],
    [0x00102083, /정렬되지 않은 주소/],
    [0x00002083, /접근할 수 없는 주소/],
    [0x00000073, /지원하지 않는 시스템 호출/],
  ];
  for (const [word, trap] of badPrograms) {
    const bytes = Buffer.alloc(4);
    bytes.writeUInt32LE(word);
    const machine = new Machine({entry: 0x10000, segments: [{address: 0x10000, size: 4, flags: 5, bytes: bytes.toString('hex')}]});
    machine.step();
    assert.match(machine.trap, trap);
    assert.equal(machine.count, 0);
    assert.equal(machine.registers[1], 0);
    assert.equal(machine.step(), null);
  }
  assert.equal(decode(0x02000033), null, 'reject MUL outside RV32I');
  console.log('Traps: 6 cases passed. MUL rejected.');
} finally {
  fs.rmSync(tmp, {recursive: true, force: true});
}
