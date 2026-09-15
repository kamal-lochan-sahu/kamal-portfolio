import { Howl } from 'howler';

type SoundName = 'click' | 'hover' | 'success' | 'boot' | 'open' | 'close';

let muted = false;
let sounds: Record<SoundName, Howl> | null = null;

function getSounds(): Record<SoundName, Howl> {
  if (!sounds) {
    sounds = {
      click: new Howl({ src: ['/sounds/click.wav'], volume: 0.3 }),
      hover: new Howl({ src: ['/sounds/hover.wav'], volume: 0.12 }),
      success: new Howl({ src: ['/sounds/success.wav'], volume: 0.4 }),
      boot: new Howl({ src: ['/sounds/boot.wav'], volume: 0.3 }),
      open: new Howl({ src: ['/sounds/open.wav'], volume: 0.25 }),
      close: new Howl({ src: ['/sounds/close.wav'], volume: 0.25 }),
    };
  }
  return sounds;
}

export function playSound(name: SoundName) {
  if (muted) return;
  try {
    getSounds()[name]?.play();
  } catch {
    // ignore if file missing — non-fatal
  }
}

export function toggleMute(): boolean {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}
