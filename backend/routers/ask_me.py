from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from services.gemini import ask_kamal
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ask", tags=["Ask Me"])
limiter = Limiter(key_func=get_remote_address)

SUGGESTIONS = [
    "Tell me about NEXUS",
    "Tell me about CORTEX",
    "Why do you want to work in Germany?",
    "What is your strongest skill?",
    "Tell me about BioSignal",
    "How did you learn programming?",
    "What is your career goal?",
    "Tell me about GridSense",
    "Are you open to FIAE Ausbildung?",
    "What makes you unique as a candidate?",
]

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    answer: str
    question: str

@router.get("/suggestions")
async def suggestions():
    return {"questions": SUGGESTIONS}

@router.post("/", response_model=AskResponse)
@limiter.limit("10/minute")
async def ask(request: Request, req: AskRequest):
    if not req.question.strip():
        raise HTTPException(400, "Question cannot be empty")
    if len(req.question) > 500:
        raise HTTPException(400, "Too long (max 500 chars)")
    try:
        answer = await ask_kamal(req.question)
        return AskResponse(answer=answer, question=req.question)
    except Exception as e:
        logger.error(f"ask_kamal failed: {e}")
        raise HTTPException(500, "Something went wrong generating a response. Please try again.")
