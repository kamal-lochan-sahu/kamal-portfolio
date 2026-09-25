from typing import Literal

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
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


class HistoryTurn(BaseModel):
    role: Literal["user", "kamal"]
    text: str = Field(max_length=500)


class AskRequest(BaseModel):
    question: str
    # Prior turns from this same chat session, oldest first. Capped so a
    # visitor can't balloon the prompt (and the token bill) from the client.
    history: list[HistoryTurn] = Field(default_factory=list, max_length=6)


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
        history = [h.model_dump() for h in req.history]
        answer = await ask_kamal(req.question, history=history)
        return AskResponse(answer=answer, question=req.question)
    except Exception as e:
        logger.error(f"ask_kamal failed: {e}")
        raise HTTPException(500, "Something went wrong generating a response. Please try again.")
