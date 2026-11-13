from .prices import price as base_price


def total():
    return base_price()


def run():
    return total()


class Invoice:
    def calculate(self):
        return self._calculate_subtotal()

    def _calculate_subtotal(self):
        return Invoice.with_tax(total())

    @staticmethod
    def with_tax(amount):
        return amount + 1

    @classmethod
    def example(cls):
        return cls.with_tax(1)
