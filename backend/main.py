from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ask_me, jd_matcher, health
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Kamal Portfolio API",
    description="AI-powered backend for kamallochan.dev",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://kamallochan.dev",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ask_me.router)
app.include_router(jd_matcher.router)
app.include_router(health.router)

@app.get("/")
def root():
    return {"name": "Kamal Portfolio API", "status": "online", "version": "1.0.0"}

@app.get("/api/ping")
def ping():
    return {"pong": True}
