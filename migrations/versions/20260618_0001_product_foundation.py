"""Add product foundation tables.

Revision ID: 20260618_0001
Revises: 0001_create_users
Create Date: 2026-06-18
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260618_0001"
down_revision: Union[str, None] = "0001_create_users"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _has_table(table_name: str) -> bool:
    return table_name in sa.inspect(op.get_bind()).get_table_names()


def _create_users_if_missing() -> None:
    if _has_table("users"):
        return
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_username", "users", ["username"], unique=True)
    op.create_index("ix_users_email", "users", ["email"], unique=True)


def upgrade() -> None:
    _create_users_if_missing()

    if not _has_table("assets"):
        op.create_table(
            "assets",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("kind", sa.String(length=40), nullable=False),
            sa.Column("storage_provider", sa.String(length=50), server_default="external", nullable=False),
            sa.Column("storage_key", sa.String(length=1024), nullable=True),
            sa.Column("url", sa.Text(), nullable=True),
            sa.Column("original_filename", sa.String(length=255), nullable=True),
            sa.Column("mime_type", sa.String(length=100), nullable=True),
            sa.Column("width", sa.Integer(), nullable=True),
            sa.Column("height", sa.Integer(), nullable=True),
            sa.Column("file_size", sa.Integer(), nullable=True),
            sa.Column("checksum", sa.String(length=128), nullable=True),
            sa.Column("is_deleted", sa.Boolean(), server_default=sa.text("0"), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_assets_id", "assets", ["id"])
        op.create_index("ix_assets_user_id", "assets", ["user_id"])
        op.create_index("ix_assets_kind", "assets", ["kind"])
        op.create_index("ix_assets_checksum", "assets", ["checksum"])

    if not _has_table("tryon_jobs"):
        op.create_table(
            "tryon_jobs",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("status", sa.String(length=30), server_default="pending", nullable=False),
            sa.Column("person_asset_id", sa.Integer(), nullable=True),
            sa.Column("top_asset_id", sa.Integer(), nullable=True),
            sa.Column("bottom_asset_id", sa.Integer(), nullable=True),
            sa.Column("result_asset_id", sa.Integer(), nullable=True),
            sa.Column("style", sa.String(length=50), server_default="原生风格", nullable=False),
            sa.Column("focus", sa.String(length=50), server_default="服装", nullable=False),
            sa.Column("ratio", sa.String(length=30), server_default="自动", nullable=False),
            sa.Column("size", sa.String(length=20), server_default="2K", nullable=False),
            sa.Column("model_name", sa.String(length=100), nullable=True),
            sa.Column("prompt_snapshot", sa.Text(), nullable=True),
            sa.Column("cost_credits", sa.Integer(), server_default="0", nullable=False),
            sa.Column("error_code", sa.String(length=80), nullable=True),
            sa.Column("error_message", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(["bottom_asset_id"], ["assets.id"], ondelete="SET NULL"),
            sa.ForeignKeyConstraint(["person_asset_id"], ["assets.id"], ondelete="SET NULL"),
            sa.ForeignKeyConstraint(["result_asset_id"], ["assets.id"], ondelete="SET NULL"),
            sa.ForeignKeyConstraint(["top_asset_id"], ["assets.id"], ondelete="SET NULL"),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_tryon_jobs_id", "tryon_jobs", ["id"])
        op.create_index("ix_tryon_jobs_user_id", "tryon_jobs", ["user_id"])
        op.create_index("ix_tryon_jobs_status", "tryon_jobs", ["status"])

    if not _has_table("credit_accounts"):
        op.create_table(
            "credit_accounts",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("balance", sa.Integer(), server_default="0", nullable=False),
            sa.Column("lifetime_granted", sa.Integer(), server_default="0", nullable=False),
            sa.Column("lifetime_spent", sa.Integer(), server_default="0", nullable=False),
            sa.Column("lifetime_refunded", sa.Integer(), server_default="0", nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("user_id", name="uq_credit_accounts_user_id"),
        )
        op.create_index("ix_credit_accounts_id", "credit_accounts", ["id"])

    if not _has_table("credit_transactions"):
        op.create_table(
            "credit_transactions",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("account_id", sa.Integer(), nullable=False),
            sa.Column("job_id", sa.Integer(), nullable=True),
            sa.Column("amount", sa.Integer(), nullable=False),
            sa.Column("balance_after", sa.Integer(), nullable=False),
            sa.Column("transaction_type", sa.String(length=40), nullable=False),
            sa.Column("reason", sa.Text(), nullable=True),
            sa.Column("external_id", sa.String(length=120), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.ForeignKeyConstraint(["account_id"], ["credit_accounts.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["job_id"], ["tryon_jobs.id"], ondelete="SET NULL"),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_credit_transactions_id", "credit_transactions", ["id"])
        op.create_index("ix_credit_transactions_user_id", "credit_transactions", ["user_id"])
        op.create_index("ix_credit_transactions_account_id", "credit_transactions", ["account_id"])
        op.create_index("ix_credit_transactions_job_id", "credit_transactions", ["job_id"])
        op.create_index("ix_credit_transactions_transaction_type", "credit_transactions", ["transaction_type"])
        op.create_index("ix_credit_transactions_external_id", "credit_transactions", ["external_id"])


def downgrade() -> None:
    for table_name in ("credit_transactions", "credit_accounts", "tryon_jobs", "assets"):
        if _has_table(table_name):
            op.drop_table(table_name)
