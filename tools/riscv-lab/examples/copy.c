volatile unsigned observed[4] __attribute__((section(".result")));
volatile unsigned char source[] = {0x52, 0x56, 0x33, 0x32, 0x49, 0x21};

int demo(void)
{
    volatile unsigned char *target = (volatile unsigned char *)observed;
    for (unsigned i = 0; i < sizeof(source); i++) {
        target[i] = source[i];
    }
    return (int)sizeof(source);
}
