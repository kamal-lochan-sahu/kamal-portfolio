import json
import logging

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from services.gemini import plan_tour

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/tour", tags=["Guided Tour"])
limiter = Limiter(key_func=get_remote_address)

# The only sections a tour step may ever point at. This is the actual
# allowlist enforcement — the LLM's output is filtered against this set
# server-side before it ever reaches the frontend, so a step can never
# target a section that doesn't exist (or, worse, arbitrary injected text).
SECTIONS = {
    "hero":     "Landing intro",
    "services": "3 services offered: custom software, automation, AI integration",
    "projects": "Project showcase across business systems, websites and AI/robotics R&D",
    "process":  "How working with Kamal works, step by step",
    "skills":   "Interactive tech-stack visualization",
    "about":    "Background on who Kamal is",
    "github":   "Live GitHub contribution activity",
    "contact":  "Contact form, email and WhatsApp",
}

FALLBACK_STEPS = [
    {"id": "hero",     "title": "Welcome",  "message": "Hey, I'm Kamal's assistant — let me show you around."},
    {"id": "services", "title": "Services", "message": "Here's what Kamal builds: custom software, automation, and AI integration."},
    {"id": "projects", "title": "Projects", "message": "A mix of business systems, websites, and AI/robotics R&D."},
    {"id": "process",  "title": "Process",  "message": "This is how a project with Kamal actually runs, start to finish."},
    {"id": "skills",   "title": "Stack",    "message": "The tools Kamal works with day to day."},
    {"id": "github",   "title": "GitHub",   "message": "Live activity, pulled straight from GitHub."},
    {"id": "contact",  "title": "Contact",  "message": "That's the tour — reach out here whenever you're ready."},
]


class TourRequest(BaseModel):
    interest: str = Field(default="", max_length=200)


class TourStep(BaseModel):
    id: str
    title: str
    message: str


class TourResponse(BaseModel):
    steps: list[TourStep]


def _validate_steps(raw: list[dict]) -> list[TourStep]:
    steps: list[TourStep] = []
    for item in raw:
        sid = str(item.get("id", ""))
        if sid not in SECTIONS:
            continue  # drop anything outside the allowlist, no exceptions
        title = str(item.get("title", SECTIONS[sid]))[:40]
        message = str(item.get("message", ""))[:220]
        if not message:
            continue
        steps.append(TourStep(id=sid, title=title, message=message))
        if len(steps) >= 8:
            break
    return steps


@router.post("/", response_model=TourResponse)
@limiter.limit("5/minute")
async def tour(request: Request, req: TourRequest):
    try:
        raw = await plan_tour(req.interest.strip(), SECTIONS)
        steps = _validate_steps(raw)
    except Exception as e:
        logger.error(f"plan_tour failed: {e}")
        steps = []
    if len(steps) < 2:  # too little to be a real tour — use the known-good script
        steps = [TourStep(**s) for s in FALLBACK_STEPS]
    return TourResponse(steps=steps)
