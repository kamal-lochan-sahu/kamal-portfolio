from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from services.gemini import match_jd
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/jd", tags=["JD Matcher"])
limiter = Limiter(key_func=get_remote_address)

class JDRequest(BaseModel):
    jd_text: str

class JDResponse(BaseModel):
    match_score: int
    summary: str
    strengths: list[str]
    gaps: list[str]
    highlighted_projects: list[str]
    recommendation: str

@router.post("/match", response_model=JDResponse)
@limiter.limit("5/minute")
async def match(request: Request, req: JDRequest):
    if not req.jd_text.strip():
        raise HTTPException(400, "JD text cannot be empty")
    if len(req.jd_text) > 5000:
        raise HTTPException(400, "Too long (max 5000 chars)")
    try:
        result = await match_jd(req.jd_text)
        return JDResponse(**result)
    except Exception as e:
        logger.error(f"match_jd failed: {e}")
        raise HTTPException(500, "Something went wrong analyzing the job description. Please try again.")
