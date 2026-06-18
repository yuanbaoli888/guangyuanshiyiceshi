"""虚拟试穿服务：调用 vveai（OpenAI 兼容）的图像编辑模型 nano-banana，
把人物图 + 服装图合成"上身图"。同步返回结果图 URL。
"""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.request

from app.core.config import settings

# 风格 -> 追加到提示词的描述
STYLE_HINTS = {
    "原生风格": "整体尽量自然真实、最接近原图。",
    "日常真实": "呈现自然、生活化的日常穿着质感。",
    "电商展示": "干净、清晰的商品展示效果，突出服装本身。",
    "时尚大片": "更强的时尚大片氛围感与质感。",
}

# 关注点 -> 提示词侧重
FOCUS_HINTS = {
    "服装": "重点保证服装的颜色、图案、版型尽量准确还原。",
    "我": "重点保证人物本人的五官和样貌尽量不变。",
}


def _build_prompt(*, has_top: bool, has_bottom: bool, style: str, focus: str, ratio: str) -> str:
    """根据是否有上/下装、风格、关注点、比例拼装提示词。"""
    lines = ["这是一个虚拟试穿任务。第一张图是人物。"]
    idx = 2
    if has_top:
        lines.append(f"第{['二', '三'][idx - 2]}张图是一件上衣。")
        idx += 1
    if has_bottom:
        lines.append(f"第{['二', '三'][idx - 2]}张图是一件下装。")
        idx += 1

    wear = []
    if has_top:
        wear.append("上衣")
    if has_bottom:
        wear.append("下装")
    lines.append(
        "请生成一张新的写实照片：让第一张图里的同一个人穿上提供的"
        + "和".join(wear)
        + "。"
    )
    lines.append(
        "严格保持人物的脸、发型、身材、姿势和背景完全不变，"
        "只替换对应部位的衣服，忠实保留每件衣服的颜色、图案、纹理和款式。"
    )
    lines.append(STYLE_HINTS.get(style, ""))
    lines.append(FOCUS_HINTS.get(focus, ""))
    if ratio and ratio != "自动":
        lines.append(f"输出画面的宽高比例尽量接近 {ratio}。")
    lines.append("自然光照，合身自然，照片级真实感。只输出最终图片。")
    return "".join(line for line in lines if line)


def _model_for_size(size: str) -> str:
    """1K/2K 用 2k 档模型，4K 用 4k 档模型。"""
    if size == "4K":
        return settings.ai_model_4k
    return settings.ai_model_2k


def describe_tryon_request(
    *,
    has_top: bool,
    has_bottom: bool,
    style: str,
    focus: str,
    ratio: str,
    size: str,
) -> tuple[str, str]:
    """Return the model and prompt snapshot used for a generation request."""
    return (
        _model_for_size(size),
        _build_prompt(has_top=has_top, has_bottom=has_bottom, style=style, focus=focus, ratio=ratio),
    )


def _extract_image_url(content: str) -> str | None:
    """从返回内容里解析结果图 URL（markdown 链接或裸 URL）。"""
    m = re.search(r"!\[[^\]]*\]\((https?://[^\s)]+)\)", content)
    if m:
        return m.group(1)
    m = re.search(r"https?://[^\s\"'<>)]+", content)
    return m.group(0) if m else None


def generate_tryon(
    *,
    person_image: str,
    top_image: str | None,
    bottom_image: str | None,
    style: str,
    focus: str,
    ratio: str,
    size: str,
) -> str:
    """调用模型生成试穿图，返回结果图 URL。入参图片均为 data URI 或 http URL。"""
    if not settings.ai_api_key or not settings.ai_api_base_url:
        raise RuntimeError("未配置 AI_API_KEY / AI_API_BASE_URL，请检查 backend/.env")

    prompt = _build_prompt(
        has_top=bool(top_image),
        has_bottom=bool(bottom_image),
        style=style,
        focus=focus,
        ratio=ratio,
    )
    parts = [{"type": "text", "text": prompt}]
    for img in (person_image, top_image, bottom_image):
        if img:
            parts.append({"type": "image_url", "image_url": {"url": img}})

    payload = {
        "model": _model_for_size(size),
        "messages": [{"role": "user", "content": parts}],
    }
    url = settings.ai_api_base_url.rstrip("/") + "/v1/chat/completions"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {settings.ai_api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            body = resp.read().decode()
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"模型接口返回错误 {e.code}: {e.read().decode()[:300]}") from e
    except Exception as e:  # noqa: BLE001
        raise RuntimeError(f"调用模型接口失败: {e}") from e

    data = json.loads(body)
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    image_url = _extract_image_url(content)
    if not image_url:
        raise RuntimeError(f"未从返回中解析到结果图: {content[:300]}")
    return image_url
