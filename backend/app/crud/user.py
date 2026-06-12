from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.schemas.user import UserUpdate


def get_user(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def get_user_by_username_or_email(db: Session, value: str) -> User | None:
    stmt = select(User).where(or_(User.username == value, User.email == value))
    return db.scalar(stmt)


def list_users(db: Session, skip: int = 0, limit: int = 50) -> list[User]:
    stmt = select(User).offset(skip).limit(limit).order_by(User.id)
    return list(db.scalars(stmt).all())


def create_user(db: Session, payload: RegisterRequest) -> User:
    user = User(
        username=payload.username,
        email=str(payload.email),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: User, payload: UserUpdate) -> User:
    updates = payload.model_dump(exclude_unset=True)
    if "password" in updates:
        user.password_hash = hash_password(updates.pop("password"))
    for field, value in updates.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()
