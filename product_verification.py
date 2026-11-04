"""Utilities for verifying product metadata."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
import re
from typing import Any, Mapping


PRODUCT_ID_PATTERN = re.compile(r"^[A-Z0-9]{8,20}$")
REQUIRED_FIELDS = (
    "product_id",
    "name",
    "manufacturer",
    "manufacture_date",
    "expiry_date",
)


@dataclass(frozen=True)
class VerificationResult:
    is_verified: bool
    errors: tuple[str, ...]


def _parse_date(raw: Any, field_name: str, errors: list[str]) -> date | None:
    if not isinstance(raw, str):
        errors.append(f"{field_name} must be an ISO date string (YYYY-MM-DD).")
        return None

    try:
        return date.fromisoformat(raw)
    except ValueError:
        errors.append(f"{field_name} must be in YYYY-MM-DD format.")
        return None


def verify_product(product: Mapping[str, Any], *, today: date | None = None) -> VerificationResult:
    """Validate a product payload and return verification details."""
    errors: list[str] = []
    if today is None:
        today = date.today()

    for field in REQUIRED_FIELDS:
        value = product.get(field)
        if not isinstance(value, str) or not value.strip():
            errors.append(f"{field} is required.")

    product_id = product.get("product_id")
    if isinstance(product_id, str) and product_id and not PRODUCT_ID_PATTERN.fullmatch(product_id):
        errors.append("product_id must be 8-20 uppercase letters or digits.")

    manufacture_date = _parse_date(product.get("manufacture_date"), "manufacture_date", errors)
    expiry_date = _parse_date(product.get("expiry_date"), "expiry_date", errors)

    if manufacture_date and expiry_date and expiry_date < manufacture_date:
        errors.append("expiry_date must be on or after manufacture_date.")

    if expiry_date and expiry_date < today:
        errors.append("product has expired.")

    return VerificationResult(is_verified=not errors, errors=tuple(errors))


def is_product_verified(product: Mapping[str, Any], *, today: date | None = None) -> bool:
    """Return True when the product passes verification checks."""
    return verify_product(product, today=today).is_verified
