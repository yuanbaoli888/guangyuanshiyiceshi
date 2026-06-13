from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.tryon import generate_tryon

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


@router.post("/generate", response_model=TryonResponse)
def generate(payload: TryonRequest) -> TryonResponse:
    if not payload.top_image and not payload.bottom_image:
        raise HTTPException(status_code=400, detail="至少需要一件服装（主服装或下装）")
    try:
        image_url = generate_tryon(
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
    return TryonResponse(image_url=image_url)
