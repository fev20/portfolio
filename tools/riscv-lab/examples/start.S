.section .text.start,"ax"
.globl _start
_start:
    lui sp, 0x20
    jal ra, demo
    mv s0, a0
    li a0, 1
    la a1, observed
    li a2, 16
    li a7, 64
    ecall
    mv a0, s0
    li a7, 93
    ecall
