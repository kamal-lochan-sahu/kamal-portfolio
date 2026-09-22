from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from routers import ask_me, jd_matcher, health, github
from dotenv import load_dotenv

load_dotenv()

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Kamal Portfolio API",
    description="AI-powered backend for Kamal Lochan Sahu's portfolio",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ask_me.router)
app.include_router(jd_matcher.router)
app.include_router(health.router)
app.include_router(github.router)

@app.get("/")
def root():
    return {"name": "Kamal Portfolio API", "status": "online", "version": "1.0.0"}

@app.get("/api/ping")
def ping():
    return {"pong": True}
