#!/usr/bin/env python3
"""
generate_sounds.py
Synthesizes 6 short UI sound effects using only Python's stdlib (math + wave)
— no downloads, no external assets, no copyright concerns. Writes .wav files
directly into frontend/public/sounds/.

Run from anywhere; it finds the project via PROJECT_ROOT below.
"""

import math
import os
import struct
import wave

HOME = os.path.expanduser("~")
PROJECT_ROOT = os.path.join(HOME, "projects", "kamal-portfolio")
SOUNDS_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "sounds")

SAMPLE_RATE = 44100


def envelope(i, n, attack=0.1, release=0.3):
    """Simple attack/release envelope, 0..1 fraction through the sample."""
    t = i / n
    if t < attack:
        return t / attack
    if t > 1 - release:
        return (1 - t) / release
    return 1.0


def tone(freq, duration, volume=0.3, wave_type="sine", sweep_to=None):
    n = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(n):
        t = i / SAMPLE_RATE
        f = freq if sweep_to is None else freq + (sweep_to - freq) * (i / n)
        if wave_type == "sine":
            val = math.sin(2 * math.pi * f * t)
        elif wave_type == "triangle":
            val = 2 * abs(2 * ((f * t) % 1) - 1) - 1
        else:
            val = math.sin(2 * math.pi * f * t)
        val *= volume * envelope(i, n)
        samples.append(val)
    return samples


def chime(notes, note_dur, volume=0.3):
    """Sequence of tones played one after another (a little chime)."""
    out = []
    for freq in notes:
        out.extend(tone(freq, note_dur, volume=volume))
    return out


def write_wav(path, samples):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "w") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        frames = b"".join(
            struct.pack("<h", int(max(-1.0, min(1.0, s)) * 32767)) for s in samples
        )
        f.writeframes(frames)
    print(f"  ✓ {path.replace(HOME, '~')}")


def main():
    print("Generating synthesized UI sounds...")

    write_wav(os.path.join(SOUNDS_DIR, "click.wav"), tone(880, 0.06, volume=0.25))
    write_wav(os.path.join(SOUNDS_DIR, "hover.wav"), tone(1400, 0.035, volume=0.12))
    write_wav(
        os.path.join(SOUNDS_DIR, "success.wav"),
        chime([523.25, 659.25, 783.99], 0.09, volume=0.28),  # C5-E5-G5
    )
    write_wav(
        os.path.join(SOUNDS_DIR, "boot.wav"),
        tone(220, 0.5, volume=0.25, sweep_to=880),
    )
    write_wav(os.path.join(SOUNDS_DIR, "open.wav"), tone(600, 0.12, volume=0.22, sweep_to=900))
    write_wav(os.path.join(SOUNDS_DIR, "close.wav"), tone(700, 0.12, volume=0.22, sweep_to=400))

    print("\nDone. Now update frontend/lib/sounds.ts to use .wav instead of .mp3:")
    print("  (the script below does this automatically)")

    sounds_ts_path = os.path.join(PROJECT_ROOT, "frontend", "lib", "sounds.ts")
    if os.path.exists(sounds_ts_path):
        with open(sounds_ts_path, "r", encoding="utf-8") as f:
            content = f.read()
        new_content = content.replace(".mp3", ".wav")
        if new_content != content:
            with open(sounds_ts_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"  ✓ patched {sounds_ts_path.replace(HOME, '~')} to reference .wav files")
        else:
            print("  (skip) sounds.ts already references .wav or pattern not found")
    else:
        print(f"  ⚠ {sounds_ts_path} not found — update it manually")


if __name__ == "__main__":
    main()
