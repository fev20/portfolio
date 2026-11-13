volatile unsigned observed[4] __attribute__((section(".result")));
volatile int numbers[] = {7, -3, 12, 5};

int demo(void)
{
    int sum = 0;
    volatile unsigned length = 4;
    for (unsigned i = 0; i < length; i++) {
        sum += numbers[i];
    }
    observed[0] = (unsigned)sum;
    return sum;
}
