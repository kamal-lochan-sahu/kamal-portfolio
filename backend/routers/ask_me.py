from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini import ask_kamal

router = APIRouter(prefix="/api/ask", tags=["Ask Me"])

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
async def ask(req: AskRequest):
    if not req.question.strip():
        raise HTTPException(400, "Question cannot be empty")
    if len(req.question) > 500:
        raise HTTPException(400, "Too long (max 500 chars)")
    try:
        answer = await ask_kamal(req.question)
        return AskResponse(answer=answer, question=req.question)
    except Exception as e:
        raise HTTPException(500, f"AI error: {str(e)}")
