from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.tryon_job import TryonJob
from app.models.user import User
from app.services.tryon import describe_tryon_request, generate_tryon


def _now() -> datetime:
    return datetime.now(timezone.utc)


def reserve_tryon_credits(db: Session, *, user: User, job: TryonJob) -> None:
    """Reserved hook for future credit charging before generation starts.

    The real credit policy is intentionally not implemented yet. When the
    product rules are finalized, add balance checks, credit holds, and
    transaction rows here.
    """
    _ = (db, user, job)


def refund_tryon_credits(db: Session, *, user: User, job: TryonJob, reason: str) -> None:
    """Reserved hook for future credit refunding when generation fails."""
    _ = (db, user, job, reason)


def create_tryon_job(
    db: Session,
    *,
    user: User,
    style: str,
    focus: str,
    ratio: str,
    size: str,
    has_top: bool,
    has_bottom: bool,
) -> TryonJob:
    model_name, prompt_snapshot = describe_tryon_request(
        has_top=has_top,
        has_bottom=has_bottom,
        style=style,
        focus=focus,
        ratio=ratio,
        size=size,
    )
    job = TryonJob(
        user_id=user.id,
        status="pending",
        style=style,
        focus=focus,
        ratio=ratio,
        size=size,
        model_name=model_name,
        prompt_snapshot=prompt_snapshot,
        cost_credits=0,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def mark_job_processing(db: Session, job: TryonJob) -> TryonJob:
    job.status = "processing"
    job.started_at = _now()
    db.commit()
    db.refresh(job)
    return job


def mark_job_succeeded(db: Session, *, user: User, job: TryonJob, image_url: str) -> TryonJob:
    result_asset = Asset(
        user_id=user.id,
        kind="result",
        storage_provider="external",
        url=image_url,
    )
    db.add(result_asset)
    db.flush()

    job.status = "succeeded"
    job.result_asset_id = result_asset.id
    job.finished_at = _now()
    db.commit()
    db.refresh(job)
    return job


def mark_job_failed(db: Session, *, user: User, job: TryonJob, error: RuntimeError) -> TryonJob:
    message = str(error)
    job.status = "failed"
    job.error_code = "model_error"
    job.error_message = message[:2000]
    job.finished_at = _now()
    refund_tryon_credits(db, user=user, job=job, reason=message)
    db.commit()
    db.refresh(job)
    return job


def run_tryon_generation(
    db: Session,
    *,
    user: User,
    person_image: str,
    top_image: str | None,
    bottom_image: str | None,
    style: str,
    focus: str,
    ratio: str,
    size: str,
) -> tuple[str, TryonJob]:
    """Create a tracked job and run the current synchronous generation flow."""
    job = create_tryon_job(
        db,
        user=user,
        style=style,
        focus=focus,
        ratio=ratio,
        size=size,
        has_top=bool(top_image),
        has_bottom=bool(bottom_image),
    )
    reserve_tryon_credits(db, user=user, job=job)
    mark_job_processing(db, job)

    try:
        image_url = generate_tryon(
            person_image=person_image,
            top_image=top_image,
            bottom_image=bottom_image,
            style=style,
            focus=focus,
            ratio=ratio,
            size=size,
        )
    except RuntimeError as exc:
        mark_job_failed(db, user=user, job=job, error=exc)
        raise

    mark_job_succeeded(db, user=user, job=job, image_url=image_url)
    return image_url, job
