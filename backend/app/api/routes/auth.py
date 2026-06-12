from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, revoked_token_ids
from app.core.security import create_access_token, decode_access_token
from app.crud.user import create_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, MessageResponse, RegisterRequest, TokenResponse
from app.schemas.user import UserRead
from app.services.auth import authenticate_user

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> User:
    try:
        return create_user(db, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already exists",
        ) from exc


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = authenticate_user(db, payload.username_or_email, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
        )
    token, _ = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=token)


@router.post("/logout", response_model=MessageResponse)
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)) -> MessageResponse:
    try:
        payload = decode_access_token(credentials.credentials)
    except ValueError:
        return MessageResponse(message="Already logged out")
    token_id = payload.get("jti")
    if token_id:
        revoked_token_ids.add(token_id)
    return MessageResponse(message="Logged out")


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
