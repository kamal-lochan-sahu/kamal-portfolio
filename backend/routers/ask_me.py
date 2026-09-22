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
    "What can you build for my clinic?",
    "How do you automate WhatsApp reminders?",
    "Show me the retail system",
    "How does a project with you work?",
    "Which AI projects have you built?",
    "What's your tech stack?",
    "Tell me about NEXUS",
    "Tell me about BioSignal",
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
