export const SECTIONS = [
  { id: 'hero',     label: 'Home'     },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'process',  label: 'How I Work' },
  { id: 'skills',   label: 'Stack'    },
  { id: 'about',    label: 'About'    },
  { id: 'github',   label: 'GitHub'   },
  { id: 'contact',  label: 'Contact'  },
]

export const STATS = [
  { value: '8',    label: 'Business Systems', href: '#projects' },
  { value: '7',    label: 'Open-Source AI/ML' },
  { value: 'AWS',  label: 'Cloud Certified'    },
]

export const TAGLINE  = "I build systems that think, predict, and act."
export const SUB_LINE = "Full Stack & ML Engineer · AI · Robotics · Autonomous Systems"
export const EMAIL    = "kamallochansahu.dev@gmail.com"
export const GITHUB   = "https://github.com/kamal-lochan-sahu"
export const LINKEDIN = "https://www.linkedin.com/in/kamallochansahu"

export const SKILLS: Record<string, string[]> = {
  'AI / ML':    ['Python','Machine Learning','PyTorch','TensorFlow','Scikit-Learn','NumPy','Pandas','LightGBM','XGBoost','Prophet','MLOps'],
  'Robotics':   ['ROS2','Gazebo','MediaPipe','YOLOv8','CLIP','Reinforcement Learning','CrewAI'],
  'Backend':    ['FastAPI','Node.js','Express','Flask','REST APIs','PostgreSQL','MongoDB','Redis','Docker','SQL'],
  'Frontend':   ['React.js','Next.js','TypeScript','JavaScript','Tailwind CSS','Framer Motion','D3.js','Three.js'],
  'Cloud':      ['AWS','Git','DevOps','Systems Design','Computer Networks'],
}

export const PROJECTS = [
  {
    id: 'nexus', title: 'NEXUS', tier: 1, group: 'rnd', status: 'soon',
    subtitle: 'Industry 5.0 Robotics Platform',
    tagline: 'Where humans and robots truly collaborate.',
    tags: ['ROS2','Phi-3-mini','CLIP','YOLOv8','Gazebo','FastAPI'],
    metric: '6 AI Modules', github: 'https://github.com/kamal-lochan-sahu/nexus', demo: '#',
    desc: '6 AI modules on a Unitree Go2 robot dog — NL control, digital twin, safety AI, RL nav, multi-robot coordination, VLA.',
  },
  {
    id: 'cortex', title: 'CORTEX', tier: 1, group: 'rnd', status: 'soon',
    subtitle: 'Autonomous Factory Intelligence',
    tagline: 'Six AI minds. One factory brain.',
    tags: ['CrewAI','FastAPI','PostgreSQL','Redis','LSTM','XGBoost'],
    metric: '6 AI Agents', github: 'https://github.com/kamal-lochan-sahu/cortex', demo: '#',
    desc: '6 autonomous agents continuously monitor, predict, optimize, secure, supply and report — zero human intervention.',
  },
  {
    id: 'biosignal', title: 'BioSignal', tier: 2, group: 'rnd', status: 'opensource',
    subtitle: 'ICU Patient Deterioration Prediction',
    tagline: 'Six hours earlier. The difference between life and death.',
    tags: ['LightGBM','SHAP','MIMIC-IV','FastAPI','Next.js','D3.js'],
    metric: 'AUC >85%', github: 'https://github.com/kamal-lochan-sahu/biosignal', demo: '#',
    desc: 'Predicts ICU patient deterioration 6 hours before it occurs. Built on the prestigious MIMIC-IV clinical dataset.',
  },
  {
    id: 'gridsense', title: 'GridSense', tier: 2, group: 'rnd', status: 'live',
    subtitle: 'Real-Time EU Energy Intelligence',
    tagline: 'Predict the grid before it fails.',
    tags: ['Prophet','XGBoost','ENTSO-E API','FastAPI','Next.js','WebSocket'],
    metric: '24hr Forecast', github: 'https://github.com/kamal-lochan-sahu/gridsense', demo: 'https://gridsense-eight.vercel.app',
    desc: 'Live EU energy platform — real ENTSO-E data, 24hr ML forecasting, anomaly detection, CO2 tracking.',
  },
  {
    id: 'earthwatch', title: 'EarthWatch', tier: 2, group: 'rnd', status: 'opensource',
    subtitle: 'Climate Anomaly Detection',
    tagline: 'The planet is sending signals. EarthWatch is listening.',
    tags: ['Isolation Forest','NASA API','NOAA','Globe.gl','FastAPI','D3.js'],
    metric: '50yr Data', github: 'https://github.com/kamal-lochan-sahu/earthwatch', demo: '#',
    desc: '3D globe climate intelligence — live NASA/NOAA data, ML anomaly detection, 50+ year trend analysis.',
  },
  {
    id: 'truthlens', title: 'TruthLens', tier: 2, group: 'rnd', status: 'opensource',
    subtitle: 'Multimodal Misinformation Detection',
    tagline: 'Fake news hides in text AND images. TruthLens sees both.',
    tags: ['RoBERTa','CLIP','BeautifulSoup','FastAPI','Next.js','NewsAPI'],
    metric: 'Text + Vision', github: 'https://github.com/kamal-lochan-sahu/truthlens', demo: '#',
    desc: 'RoBERTa + CLIP multimodal detection — text, image consistency, source credibility, live fact-check APIs.',
  },
  {
    id: 'cropsense', title: 'CropSense', tier: 3, group: 'rnd', status: 'live',
    subtitle: 'AI Crop Recommendation',
    tagline: 'Tell the soil what to grow — before you plant a single seed.',
    tags: ['Random Forest','SHAP','Flask','Python','Scikit-Learn'],
    metric: '99.32% Accuracy', github: 'https://github.com/kamal-lochan-sahu/cropsense', demo: 'https://cropsense-39bz.onrender.com',
    desc: '99.32% accurate crop recommendation from 7 soil/climate parameters — built for 140M+ Indian farmers.',
  },
]

export const GROUPS = [
  { key: 'business', label: '💼 Business Systems' },
  { key: 'websites', label: '🌐 Website Concepts' },
  { key: 'rnd',      label: '🧠 AI/ML & Robotics R&D' },
]

export const SERVICES = [
  { icon: '🧩', title: 'Custom Business Software',
    desc: 'Web systems built around how your business actually runs, not a template you have to bend to.',
    points: ['Dashboards, billing & inventory', 'Booking and record management', 'Role-based logins for your team'] },
  { icon: '⚙️', title: 'Workflow Automation',
    desc: 'Replace repetitive manual work with systems that run on their own and flag only what needs you.',
    points: ['WhatsApp / email reminders', 'Auto-generated reports', 'Data entry and sync between tools'] },
  { icon: '🤖', title: 'AI Integration',
    desc: 'Practical AI added to your existing process: assistants, extraction and predictions that earn their place.',
    points: ['Chat assistants on your own data', 'Document and data extraction', 'ML-based forecasting'] },
]

export const PROCESS = [
  { n: '01', title: 'You describe the problem', desc: 'Tell me what is slow, manual or error-prone. No technical language needed.' },
  { n: '02', title: 'We agree on scope', desc: 'I reply with a clear plan of what gets built first, so you know what to expect.' },
  { n: '03', title: 'I build in small steps', desc: 'You see working progress early and can correct direction before it gets expensive.' },
  { n: '04', title: 'Handover and support', desc: 'You get a running system, plus me for fixes and the next improvement.' },
]
