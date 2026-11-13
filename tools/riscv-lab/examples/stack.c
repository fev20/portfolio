volatile unsigned observed[4] __attribute__((section(".result")));
volatile unsigned input = 5;

__attribute__((noinline)) unsigned add_frame(unsigned value)
{
    volatile unsigned saved = value + 2;
    return saved + 7;
}

__attribute__((noinline)) unsigned add_twice(unsigned value)
{
    unsigned first = add_frame(value);
    return first + add_frame(value + 1);
}

int demo(void)
{
    unsigned result = add_twice(input);
    observed[0] = result;
    return (int)result;
}
