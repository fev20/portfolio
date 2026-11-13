# RISC-V 실행 실험실

정적 배포 주소는 `/riscv-lab/`이다. `client/public/riscv-lab/index.html`을 단독으로 열어도 동작한다. 방문자는 배열 합계, 함수 호출과 스택, 바이트 복사, 명령어 경계값 예제를 선택할 수 있다. 실행 상태는 페이지 메모리에 유지되고 새로고침 시 초기화된다.

## 다시 빌드하고 검증하기

Python 3, Node.js, GNU RISC-V GCC와 binutils, QEMU 사용자 모드가 필요하다. Debian에서는 `gcc-riscv64-linux-gnu`, `binutils-riscv64-linux-gnu`, `qemu-user` 패키지를 사용했다. 검증 버전은 GCC 14.2.0, GNU Binutils 2.44, QEMU 10.0.13이다. 포트폴리오의 GitHub Pages 빌드는 이미 생성된 HTML을 복사한다.

이 디렉터리에서 다음을 실행한다.

```sh
python3 build.py --output ../../client/public/riscv-lab/index.html --artifacts build
node verify.cjs build
```

`build/`에 ELF32 실행 파일, objdump 디스어셈블리, 브라우저에 넣은 각 ELF의 세그먼트와 소스 매핑이 생성된다. 필요한 경우 `RISCV_GCC`, `RISCV_OBJDUMP`, `RISCV_QEMU`로 도구 경로를 지정할 수 있다. 명령어는 `-march=rv32i -mabi=ilp32`로 컴파일한다. 4개 예제의 기계어는 `build.py`가 ELF 프로그램 헤더에서 읽어 HTML에 포함한다.

`verify.cjs`는 `qemu-riscv32 -one-insn-per-tb -d cpu -D <trace> <ELF>`를 실행한다. 매 명령 직전 PC와 레지스터 32개를 비교하고, 프로그램 시작 시 OS가 설정하는 `sp`는 첫 명령이 덮어쓰기 때문에 첫 비교에서만 제외한다. 예제의 `_start`는 결과 버퍼 16바이트를 stdout으로 쓰고, `demo()`의 반환값을 종료 값으로 사용한다. 결과 버퍼와 종료 값을 양쪽에서 대조했다.

| 예제 | PC 비교 | 레지스터 값 비교 | 결과 메모리 | 종료 값 |
| --- | ---: | ---: | ---: | ---: |
| 배열 합계 | 56 | 1,791 | 16바이트 | 21 |
| 함수 호출과 스택 | 54 | 1,727 | 16바이트 | 29 |
| 바이트 복사 | 67 | 2,143 | 16바이트 | 6 |
| 명령어 경계값 | 34 | 1,087 | 16바이트 | 42 |
| 합계 | 211 | 6,748 | 64바이트 | |

경계값 예제는 x0의 불변성, 음수 즉시값, 32비트 정수의 래핑, 부호 확장, 부호 유무에 따른 비교, 분기와 시프트를 확인한다. 별도 테스트에서 잘못된 명령어, EBREAK, 정렬되지 않은 점프와 메모리 주소, 접근 불가 주소, 미지원 시스템 호출에 대한 트랩을 확인했다.

배열 합계의 초기 빌드에서는 GCC가 반복을 펼쳐 화면에 분기 명령이 나타나지 않았다. 반복 횟수를 `volatile` 값으로 읽도록 바꾸고 디스어셈블리와 QEMU 추적을 다시 확인했다.

Chromium 150에서 데스크톱 1365×1000과 모바일 390×844로 한 단계 실행, 연속 실행, 일시 정지, 초기화, 예제 선택, 메모리 보기, 새로고침을 확인했다. HTML을 파일로 열어 동작시켰으며 외부 리소스 요청은 없었다.

## 실행 범위

RV32I 정수 연산, 분기와 점프, 읽기와 쓰기를 구현했다. 리틀엔디언 메모리에서 자연 정렬을 요구한다. 단일 하트에서 메모리 접근을 순서대로 처리하므로 FENCE는 별도 동작을 수행하지 않는다. ECALL은 예제에서 쓰는 stdout 출력과 종료를 제공하고, EBREAK는 중단한다. 운영체제, 주변장치, 압축 명령, 추가 ISA 확장, 사용자 바이너리 업로드는 지원 범위 밖이다. QEMU 비교는 제공하는 예제의 실행 경로와 결과 버퍼를 다룬다.

- [RISC-V RV32I 공식 명세](https://docs.riscv.org/reference/isa/v20240411/unpriv/rv32.html)
