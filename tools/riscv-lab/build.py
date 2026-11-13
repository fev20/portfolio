"""Compile fixed RV32I examples and build the standalone lab page."""
import argparse
import json
import os
from pathlib import Path
import re
import struct
import subprocess

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'examples'
EXAMPLES = {
    'sum': ('배열 합계', '배열을 한 칸씩 읽고 누적합을 구한다. 최종 결과는 21이다.'),
    'stack': ('함수 호출과 스택', '두 번의 함수 호출에서 반환 주소와 지역 변수가 스택에 어떻게 저장되는지 확인한다.'),
    'copy': ('바이트 복사', '6바이트를 결과 버퍼로 복사한다. 메모리에서 RV32I!가 만들어지는 과정을 확인할 수 있다.'),
    'edges': ('명령어 경계값', 'x0 쓰기, 32비트 오버플로, 부호 확장, 분기와 시프트를 확인하는 어셈블리 예제.'),
}


def load_elf(path):
    data = path.read_bytes()
    if data[:7] != b'\x7fELF\x01\x01\x01' or struct.unpack_from('<H', data, 18)[0] != 243:
        raise ValueError(f'expected little-endian RISC-V ELF32: {path}')
    entry, offset = struct.unpack_from('<II', data, 24)
    size, count = struct.unpack_from('<HH', data, 42)
    segments = []
    for index in range(count):
        kind, start, address, _, file_size, mem_size, flags, _ = struct.unpack_from('<8I', data, offset + index * size)
        if kind == 1:
            segments.append(dict(address=address, bytes=data[start:start + file_size].hex(), size=mem_size, flags=flags))
    return entry, segments


def build(output, artifacts):
    compiler = os.getenv('RISCV_GCC', 'riscv64-linux-gnu-gcc')
    objdump = os.getenv('RISCV_OBJDUMP', 'riscv64-linux-gnu-objdump')
    artifacts.mkdir(parents=True, exist_ok=True)
    programs = []
    for name, (title, description) in EXAMPLES.items():
        source = SOURCE / f'{name}.{ "S" if name == "edges" else "c"}'
        elf = artifacts / f'{name}.elf'
        command = [compiler, '-march=rv32i', '-mabi=ilp32', '-O1', '-g', '-ffreestanding', '-fno-pie',
                   '-fno-stack-protector', '-fno-asynchronous-unwind-tables', '-msmall-data-limit=0', '-nostdlib',
                   '-static', '-no-pie', '-Wl,--build-id=none,--no-relax,-T,examples/layout.ld', 'examples/start.S',
                   str(source.relative_to(ROOT)), '-o', str(elf)]
        subprocess.run(command, cwd=ROOT, check=True)
        entry, segments = load_elf(elf)
        listing = subprocess.check_output([objdump, '-d', '-M', 'no-aliases', str(elf)], text=True)
        (artifacts / f'{name}.disasm').write_text(listing, encoding='utf-8')
        instructions = [int(match[1], 16) for match in re.finditer(r'^\s*([0-9a-f]+):\s+[0-9a-f]{8}\s', listing, re.M)]
        addresses = subprocess.check_output([objdump, '-dl', str(elf)], text=True)
        lines = {}
        line_number = None
        for line in addresses.splitlines():
            if line.endswith('>:'):
                line_number = None
            if match := re.search(r'/([^/]+):([0-9]+)', line):
                line_number = int(match[2]) if match[1] == source.name else None
            if (match := re.match(r'^\s*([0-9a-f]+):\s+[0-9a-f]{8}\s', line)) and line_number:
                lines[int(match[1], 16)] = line_number
        programs.append(dict(id=name, title=title, description=description, filename=source.name,
                             source=source.read_text(), entry=entry, segments=segments, instructions=instructions, lines=lines))
    (artifacts / 'programs.json').write_text(json.dumps(programs, ensure_ascii=False, indent=2), encoding='utf-8')
    template = (ROOT / 'page.html').read_text(encoding='utf-8')
    values = {'<!-- STYLE -->': (ROOT / 'style.css').read_text(encoding='utf-8'),
              '/* ENGINE */': (ROOT / 'engine.cjs').read_text(encoding='utf-8'),
              '/* INTERFACE */': (ROOT / 'interface.js').read_text(encoding='utf-8'),
              '__PROGRAMS__': json.dumps(programs, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')}
    for token, value in values.items():
        template = template.replace(token, value)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(template, encoding='utf-8')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--artifacts', type=Path, required=True)
    args = parser.parse_args()
    build(args.output.resolve(), args.artifacts.resolve())
