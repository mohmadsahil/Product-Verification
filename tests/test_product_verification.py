from datetime import date
import unittest

from product_verification import is_product_verified, verify_product


class ProductVerificationTests(unittest.TestCase):
    def test_verify_product_accepts_valid_product(self) -> None:
        result = verify_product(
            {
                "product_id": "ABCD1234",
                "name": "Widget",
                "manufacturer": "Acme Inc",
                "manufacture_date": "2026-01-01",
                "expiry_date": "2027-01-01",
            },
            today=date(2026, 6, 1),
        )

        self.assertTrue(result.is_verified)
        self.assertEqual(result.errors, ())
        self.assertTrue(
            is_product_verified(
                {
                    "product_id": "ABCD1234",
                    "name": "Widget",
                    "manufacturer": "Acme Inc",
                    "manufacture_date": "2026-01-01",
                    "expiry_date": "2027-01-01",
                },
                today=date(2026, 6, 1),
            )
        )

    def test_verify_product_reports_validation_errors(self) -> None:
        result = verify_product(
            {
                "product_id": "bad",
                "name": "",
                "manufacturer": "Acme Inc",
                "manufacture_date": "2027-01-01",
                "expiry_date": "2026-01-01",
            },
            today=date(2026, 6, 1),
        )

        self.assertFalse(result.is_verified)
        self.assertIn("name is required.", result.errors)
        self.assertIn("product_id must be 8-20 uppercase letters or digits.", result.errors)
        self.assertIn("expiry_date must be on or after manufacture_date.", result.errors)
        self.assertIn("product has expired.", result.errors)


if __name__ == "__main__":
    unittest.main()
