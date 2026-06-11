import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
model = genai.GenerativeModel("gemini-2.5-flash")

KAMAL_PROFILE = """

=== KAMAL LOCHAN SAHU — COMPLETE PROFILE ===

PERSONAL:
- Name: Kamal Lochan Sahu | Age: 22 | Location: Berhampur, Odisha, India
- Goal: FIAE Ausbildung in Germany by 2027
- Long-term: Senior Robotics AI Engineer at KUKA / Siemens / Fraunhofer
- Email: kamallochansahu.dev@gmail.com
- GitHub: github.com/kamal-lochan-sahu
- LinkedIn: linkedin.com/in/kamallochansahu

BACKGROUND:
- Self-taught developer since 2021, no formal CS degree
- Class 10: 81.3% (top district scorer) | Class 12: 80% Science stream
- Started self-learning Full Stack in 2021
- 2023: Independent Developer and Open Source contributor
- Feb 2025: Freelance — delivered 10+ production systems
- Currently building NEXUS and CORTEX

LANGUAGES:
- German: C1 (Goethe certified) | English: Professional
- Hindi: Native | Odia: Native | Italian: Elementary (A2)

CERTIFICATIONS:
- AWS Cloud Practitioner (2025)
- MIMIC-IV CITI Ethics Certification — PhysioNet (2025)
- Goethe C1 German (2026)

SKILLS:
- AI/ML: Python, PyTorch, TensorFlow, Scikit-Learn, LightGBM, XGBoost, Prophet, MLOps
- Robotics: ROS2 Jazzy, Gazebo Harmonic, MediaPipe, YOLOv8, CLIP, PPO RL, CrewAI
- Backend: FastAPI, Flask, Node.js, PostgreSQL, Redis, Docker, WebSocket
- Frontend: React.js, Next.js 14, TypeScript, Tailwind, Framer Motion, D3.js, Three.js
- Cloud: AWS (EC2, S3, Lambda), Vercel, Render.com, HuggingFace

FLAGSHIP PROJECTS:

1. NEXUS — Industry 5.0 Robotics Platform
- 6 integrated AI modules on Unitree Go2 quadruped robot simulation
- NL2RC: Natural language to robot commands via fine-tuned Phi-3-mini + Whisper STT
- CognitiveTwin: Live 3D digital twin, LSTM predicts joint failures
- CoboSense: MediaPipe 33-point pose detection, LSTM predicts human intent
  (>3m = 100% speed, 2-3m = 60% speed, <1m = STOP — <100ms response)
- RoboRL: PPO reinforcement learning, 500k episodes, >85% success rate
- FlexCell: Multi-robot LLM coordination, 2x Go2 robots, conflict resolution
- EmbodiedGPT: Vision-Language-Action, CLIP+Phi-3-mini+YOLOv8
- Stack: ROS2 Jazzy, Gazebo, Phi-3-mini QLoRA, CLIP, YOLOv8, Stable-Baselines3, FastAPI
- Status: Frontend + demo video deployed on Vercel

2. CORTEX — Autonomous Factory Intelligence
- 6 autonomous AI agents via CrewAI hierarchical orchestration
- SENTINEL: 14 sensor streams, Isolation Forest + LSTM Autoencoder
- ORACLE: XGBoost failure prediction (>85% AUC) + Prophet demand forecast
- OPTIMUS: Live ENTSO-E EU energy optimization, throughput analysis
- GUARDIAN: Cybersecurity, LSTM on network traffic (UNSW-NB15 dataset)
- HERMES: Supply chain LLM reasoning, auto-reorder, supplier risk scoring
- SCRIBE: Natural language factory reports, Factory Health Score 0-100, PDF export
- Stack: CrewAI, FastAPI, PostgreSQL, Redis, LSTM, XGBoost, Prophet, Phi-3-mini
- Status: Fully deployed (Vercel + Render + Redis Cloud)
- NEXUS + CORTEX = Complete Autonomous Factory (body + brain)

3. BioSignal — ICU Patient Deterioration Prediction
- Predicts deterioration 6 hours before it occurs
- Dataset: MIMIC-IV (PhysioNet) — accessed with CITI ethics certification
- 47 engineered features from 6 vitals (HR, BP, SpO2, Temp, Resp, GCS)
- LightGBM: AUC >85%, Recall >80% | SHAP explainability
- Color-coded risk: Green/Yellow/Red | Stack: LightGBM, SHAP, FastAPI, Next.js

4. GridSense — Real-Time EU Energy Intelligence
- Live ENTSO-E API (real European grid data)
- 24hr forecast: Prophet + XGBoost ensemble | Isolation Forest anomaly detection
- CO2 intensity tracker, weather correlation, WebSocket live updates
- Directly relevant to German Energiewende
- Stack: Next.js, FastAPI, Prophet, XGBoost, WebSocket | Live: gridsense-eight.vercel.app

5. EarthWatch — Climate Anomaly Detection
- 5 APIs: NASA POWER, Open-Meteo, Global Carbon Project, NOAA CDO, ReliefWeb
- Interactive 3D globe (Globe.gl) with glowing anomaly hotspots
- 50+ years historical data, statistical significance scoring
- Stack: Next.js, FastAPI, Globe.gl, Isolation Forest, NASA API, NOAA

6. TruthLens — Multimodal Misinformation Detection
- RoBERTa for text + CLIP for image-text consistency
- Source credibility scoring + Google Fact Check API + ClaimBuster API
- Stack: RoBERTa, CLIP, BeautifulSoup, FastAPI, Next.js, NewsAPI

7. CropSense — AI Crop Recommendation
- 99.32% accuracy Random Forest | 22 crops | 7 soil/climate parameters
- SHAP explainability | Built for 140M+ Indian farmers
- Stack: Random Forest, SHAP, Flask | Live: cropsense-39bz.onrender.com

FREELANCE WORK:
- E-commerce webapp with payment flows and inventory
- Integration Hub: business automation platform
- Medical Clinic, School/Coaching, Retail Store management systems
- OTT Platform (Netflix-style)
- 10+ systems delivered end-to-end: architecture, dev, deployment, handoff
- Stack: React, Node.js, Python, AWS, MySQL

WHY GERMANY:
- Global leader in Industry 4.0 and robotics (KUKA, Siemens, Bosch, BMW)
- FIAE Ausbildung: earn while learning (1200+ EUR/month)
- Structured engineering training aligns with self-taught path
- Path: FIAE -> FernUniversitat Hagen B.Sc. -> TU Munich M.Sc. Robotics
- C1 German certified — ready to work in German

TARGET COMPANIES: KUKA AG (Augsburg, top), Siemens, BMW, Bosch, Fraunhofer

CURRENT STATUS (May 2026):
- NEXUS: Complete, deployed with demo video
- CORTEX: Final testing, deploying very soon
- Applying for FIAE Ausbildung September 2027 intake
- 673 LinkedIn followers, daily posts about progress
- Open to: Full-time remote, freelance, FIAE Ausbildung Germany
"""

ASK_ME_SYSTEM = """
You are Kamal Lochan Sahu's AI portfolio assistant.
You speak AS Kamal in first person — warm, confident, direct.
Answer questions about Kamal using ONLY the profile provided.
Keep answers concise (2-4 sentences) unless user asks for detail.
For project questions, mention key technology and real-world impact.
NEVER invent facts not in the profile.
Respond in the same language the user writes in (English or German).
"""

JD_SYSTEM = """
You are an expert recruiter analyzing job fit for Kamal Lochan Sahu.
Analyze the job description and match it against Kamal's profile.
Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "match_score": <0-100 integer>,
  "summary": "<2 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "highlighted_projects": ["<most relevant project>", "<second relevant>"],
  "recommendation": "<1 sentence hire recommendation>"
}
"""

async def ask_kamal(question: str) -> str:
    prompt = f"You are Kamal's AI assistant.\n\n{ASK_ME_SYSTEM}\n\nKAMAL'S PROFILE:\n{KAMAL_PROFILE}\n\nUSER QUESTION: {question}\n\nAnswer as Kamal in first person:"
    response = model.generate_content(prompt)
    return response.text.strip()

async def match_jd(jd_text: str) -> dict:
    prompt = f"{JD_SYSTEM}\n\nKAMAL'S PROFILE:\n{KAMAL_PROFILE}\n\nJOB DESCRIPTION:\n{jd_text}\n\nReturn JSON:"
    response = model.generate_content(prompt)
    text = response.text.strip()
    if "```" in text:
        parts = text.split("```")
        text = parts[1] if len(parts) > 1 else text
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())
