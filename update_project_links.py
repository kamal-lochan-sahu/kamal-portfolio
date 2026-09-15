#!/usr/bin/env python3
"""
update_project_links.py
Fills in real GitHub repo URLs (confirmed to exist) and fixes NEXUS/CORTEX
status to 'soon' since they're not finished/deployed yet.

Run from ~/projects/kamal-portfolio/
"""

import os
import sys

HOME = os.path.expanduser("~")
PROJECT_ROOT = os.path.join(HOME, "projects", "kamal-portfolio")
CONSTANTS_PATH = os.path.join(PROJECT_ROOT, "frontend", "lib", "constants.ts")

GH = "https://github.com/kamal-lochan-sahu"

# (old_line, new_line) pairs — exact match required
REPLACEMENTS = [
    (
        "    id: 'nexus', title: 'NEXUS', tier: 1, status: 'demo',",
        "    id: 'nexus', title: 'NEXUS', tier: 1, status: 'soon',",
    ),
    (
        "    metric: '6 AI Modules', github: '#', demo: '#',",
        f"    metric: '6 AI Modules', github: '{GH}/nexus', demo: '#',",
    ),
    (
        "    id: 'cortex', title: 'CORTEX', tier: 1, status: 'live',",
        "    id: 'cortex', title: 'CORTEX', tier: 1, status: 'soon',",
    ),
    (
        "    metric: '6 AI Agents', github: '#', demo: '#',",
        f"    metric: '6 AI Agents', github: '{GH}/cortex', demo: '#',",
    ),
    (
        "    metric: 'AUC >85%', github: '#', demo: '#',",
        f"    metric: 'AUC >85%', github: '{GH}/biosignal', demo: '#',",
    ),
    (
        "    metric: '24hr Forecast', github: '#', demo: 'https://gridsense-eight.vercel.app',",
        f"    metric: '24hr Forecast', github: '{GH}/gridsense', demo: 'https://gridsense-eight.vercel.app',",
    ),
    (
        "    metric: '50yr Data', github: '#', demo: '#',",
        f"    metric: '50yr Data', github: '{GH}/earthwatch', demo: '#',",
    ),
    (
        "    metric: 'Text + Vision', github: '#', demo: '#',",
        f"    metric: 'Text + Vision', github: '{GH}/truthlens', demo: '#',",
    ),
    (
        "    metric: '99.32% Accuracy', github: '#', demo: 'https://cropsense-39bz.onrender.com',",
        f"    metric: '99.32% Accuracy', github: '{GH}/cropsense', demo: 'https://cropsense-39bz.onrender.com',",
    ),
]


def main():
    if not os.path.exists(CONSTANTS_PATH):
        print(f"ERROR: {CONSTANTS_PATH} not found.")
        sys.exit(1)

    with open(CONSTANTS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    applied, skipped = 0, 0
    for old, new in REPLACEMENTS:
        if old in content:
            content = content.replace(old, new)
            applied += 1
            print(f"  ✓ {old.strip()[:50]}...")
        else:
            skipped += 1
            print(f"  ⚠ not found (already changed?): {old.strip()[:50]}...")

    with open(CONSTANTS_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"\nApplied {applied} replacements, skipped {skipped}.")
    print("\nStill '#' (no live demo yet): NEXUS, CORTEX, BioSignal, EarthWatch, TruthLens demo links.")
    print("Send me the real demo URLs for BioSignal / EarthWatch / TruthLens")
    print("whenever they're deployed, and I'll give you a one-line fix each time.")


if __name__ == "__main__":
    main()
