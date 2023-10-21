from django.db import models


class Order(models.Model):
    productName = models.CharField(max_length=255)
    pstatus = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        indexes = [
            models.Index(fields=['productName'], name='product_name_idx'),
            models.Index(fields=['pstatus'], name='pstatus_idx'),
            models.Index(fields=['quantity'], name='quantity_idx'),
            models.Index(fields=['price'], name='price_idx'),
        ]

