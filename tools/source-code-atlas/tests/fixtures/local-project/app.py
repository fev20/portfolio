import shop.sales as sales
from shop.audit import total as audit_total


def main(callback, invoice_type, method_name):
    invoice = sales.Invoice()
    return (
        sales.run(),
        audit_total(),
        invoice.calculate(),
        callback(),
        getattr(invoice_type, method_name)(),
    )


if __name__ == "__main__":
    main(lambda: 0, sales.Invoice, "example")
