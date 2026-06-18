from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class CreditAccount(Base):
    __tablename__ = "credit_accounts"
    __table_args__ = (UniqueConstraint("user_id", name="uq_credit_accounts_user_id"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    balance: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    lifetime_granted: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    lifetime_spent: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    lifetime_refunded: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship("User", back_populates="credit_account")
    transactions = relationship("CreditTransaction", back_populates="account")


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    account_id: Mapped[int] = mapped_column(ForeignKey("credit_accounts.id", ondelete="CASCADE"), index=True, nullable=False)
    job_id: Mapped[int | None] = mapped_column(ForeignKey("tryon_jobs.id", ondelete="SET NULL"), index=True, nullable=True)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    balance_after: Mapped[int] = mapped_column(Integer, nullable=False)
    transaction_type: Mapped[str] = mapped_column(String(40), index=True, nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    external_id: Mapped[str | None] = mapped_column(String(120), index=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship("User", back_populates="credit_transactions")
    account = relationship("CreditAccount", back_populates="transactions")
    job = relationship("TryonJob", back_populates="credit_transactions")
