# Product-Verification

Minimal product verification utilities.

## Verification Rules

A product is considered verified when:

- `product_id`, `name`, `manufacturer`, `manufacture_date`, and `expiry_date` are present
- `product_id` is 8-20 uppercase alphanumeric characters
- `manufacture_date` and `expiry_date` are valid `YYYY-MM-DD` dates
- `expiry_date` is not before `manufacture_date`
- the product is not expired

## Run Tests

```bash
python -m unittest discover -s tests
```
