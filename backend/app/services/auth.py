from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.crud.user import get_user_by_username_or_email
from app.models.user import User


def authenticate_user(db: Session, username_or_email: str, password: str) -> User | None:
    user = get_user_by_username_or_email(db, username_or_email)
    if user is None:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user
