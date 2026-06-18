from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class TryonJob(Base):
    __tablename__ = "tryon_jobs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="pending", server_default="pending", index=True, nullable=False)

    person_asset_id: Mapped[int | None] = mapped_column(ForeignKey("assets.id", ondelete="SET NULL"), nullable=True)
    top_asset_id: Mapped[int | None] = mapped_column(ForeignKey("assets.id", ondelete="SET NULL"), nullable=True)
    bottom_asset_id: Mapped[int | None] = mapped_column(ForeignKey("assets.id", ondelete="SET NULL"), nullable=True)
    result_asset_id: Mapped[int | None] = mapped_column(ForeignKey("assets.id", ondelete="SET NULL"), nullable=True)

    style: Mapped[str] = mapped_column(String(50), default="原生风格", server_default="原生风格", nullable=False)
    focus: Mapped[str] = mapped_column(String(50), default="服装", server_default="服装", nullable=False)
    ratio: Mapped[str] = mapped_column(String(30), default="自动", server_default="自动", nullable=False)
    size: Mapped[str] = mapped_column(String(20), default="2K", server_default="2K", nullable=False)
    model_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    prompt_snapshot: Mapped[str | None] = mapped_column(Text, nullable=True)

    cost_credits: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    error_code: Mapped[str | None] = mapped_column(String(80), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
    )
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="tryon_jobs")
    person_asset = relationship("Asset", foreign_keys=[person_asset_id])
    top_asset = relationship("Asset", foreign_keys=[top_asset_id])
    bottom_asset = relationship("Asset", foreign_keys=[bottom_asset_id])
    result_asset = relationship("Asset", foreign_keys=[result_asset_id])
    credit_transactions = relationship("CreditTransaction", back_populates="job")
