from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.tryon_job import TryonJob
from app.models.user import User
from app.services.tryon_jobs import run_tryon_generation

router = APIRouter()


class TryonRequest(BaseModel):
    person_image: str = Field(..., description="人物图，data URI 或 http URL")
    top_image: str | None = Field(default=None, description="主服装图")
    bottom_image: str | None = Field(default=None, description="下装图")
    style: str = "原生风格"
    focus: str = "服装"
    ratio: str = "自动"
    size: str = "1K"


class TryonResponse(BaseModel):
    image_url: str
    job_id: int


class TryonJobRead(BaseModel):
    id: int
    status: str
    style: str
    focus: str
    ratio: str
    size: str
    model_name: str | None
    cost_credits: int
    error_code: str | None
    error_message: str | None
    result_image_url: str | None
    created_at: str
    started_at: str | None
    finished_at: str | None


def _job_to_read(job: TryonJob) -> TryonJobRead:
    return TryonJobRead(
        id=job.id,
        status=job.status,
        style=job.style,
        focus=job.focus,
        ratio=job.ratio,
        size=job.size,
        model_name=job.model_name,
        cost_credits=job.cost_credits,
        error_code=job.error_code,
        error_message=job.error_message,
        result_image_url=job.result_asset.url if job.result_asset else None,
        created_at=job.created_at.isoformat(),
        started_at=job.started_at.isoformat() if job.started_at else None,
        finished_at=job.finished_at.isoformat() if job.finished_at else None,
    )


@router.post("/generate", response_model=TryonResponse)
def generate(
    payload: TryonRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TryonResponse:
    if not payload.top_image and not payload.bottom_image:
        raise HTTPException(status_code=400, detail="至少需要一件服装（主服装或下装）")
    try:
        image_url, job = run_tryon_generation(
            db,
            user=current_user,
            person_image=payload.person_image,
            top_image=payload.top_image,
            bottom_image=payload.bottom_image,
            style=payload.style,
            focus=payload.focus,
            ratio=payload.ratio,
            size=payload.size,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    return TryonResponse(image_url=image_url, job_id=job.id)


@router.get("/jobs", response_model=list[TryonJobRead])
def list_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[TryonJobRead]:
    jobs = db.scalars(
        select(TryonJob).where(TryonJob.user_id == current_user.id).order_by(TryonJob.created_at.desc())
    ).all()
    return [_job_to_read(job) for job in jobs]


@router.get("/jobs/{job_id}", response_model=TryonJobRead)
def read_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TryonJobRead:
    job = db.get(TryonJob, job_id)
    if job is None or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="试衣任务不存在")
    return _job_to_read(job)
