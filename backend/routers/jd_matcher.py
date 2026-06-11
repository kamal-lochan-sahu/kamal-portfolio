from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini import match_jd

router = APIRouter(prefix="/api/jd", tags=["JD Matcher"])

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
async def match(req: JDRequest):
    if not req.jd_text.strip():
        raise HTTPException(400, "JD text cannot be empty")
    if len(req.jd_text) > 5000:
        raise HTTPException(400, "Too long (max 5000 chars)")
    try:
        result = await match_jd(req.jd_text)
        return JDResponse(**result)
    except Exception as e:
        raise HTTPException(500, f"AI error: {str(e)}")
