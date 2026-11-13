.section .result,"aw"
.globl observed
observed: .word 0, 0, 0, 0

.text
.globl demo
demo:
    la t0, observed
    addi x0, x0, 15
    addi t1, x0, -1
    addi t2, t1, 1
    bne t2, x0, fail
    li t2, -128
    sb t2, 12(t0)
    lb t3, 12(t0)
    lbu t4, 12(t0)
    sw t3, 0(t0)
    sw t4, 4(t0)
    lui t5, 0x80000
    slt t6, t5, x0
    sltu t4, t5, x0
    beq t6, t4, fail
    srai t6, t5, 31
    srli t5, t5, 31
    xor t6, t6, t5
    sw t6, 8(t0)
    li a0, 42
    ret
fail:
    li a0, 99
    ret
