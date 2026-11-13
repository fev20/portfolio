OUTPUT_ARCH(riscv)
ENTRY(_start)
PHDRS {
  text PT_LOAD FLAGS(5);
  data PT_LOAD FLAGS(6);
}
SECTIONS {
  . = 0x10000;
  .text : { *(.text.start) *(.text .text.*) } :text
  .rodata : { *(.rodata .rodata.*) *(.srodata .srodata.*) } :text
  . = 0x12000;
  .result : { KEEP(*(.result)) } :data
  .data : { *(.data .data.*) *(.sdata .sdata.*) } :data
  .bss (NOLOAD) : { *(.bss .bss.*) *(.sbss .sbss.*) *(COMMON) } :data
  . = 0x1f000;
  .stack (NOLOAD) : { . += 0x1000; } :data
}
