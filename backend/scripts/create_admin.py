from getpass import getpass

from sqlalchemy.exc import IntegrityError

from app.crud.user import create_user
from app.db.session import SessionLocal
from app.schemas.auth import RegisterRequest


def main() -> None:
    username = input("Admin username: ").strip()
    email = input("Admin email: ").strip()
    password = getpass("Admin password: ")

    db = SessionLocal()
    try:
        user = create_user(db, RegisterRequest(username=username, email=email, password=password))
        print(f"Created user #{user.id}: {user.username}")
    except IntegrityError:
        db.rollback()
        print("Username or email already exists.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
