type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted'|'dismissed'; platform: string }>;
};

let deferredPrompt: BIPEvent | null = null;

window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  deferredPrompt = e as BIPEvent;
  document.dispatchEvent(new CustomEvent('pwa:can-install'));
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  document.dispatchEvent(new CustomEvent('pwa:installed'));
});

export function canPromptInstall() {
  return deferredPrompt !== null;
}

export async function promptInstall(): Promise<'accepted'|'dismissed'> {
  if (!deferredPrompt) throw new Error('No hay evento beforeinstallprompt disponible.');
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome;
}

export function isStandalone(): boolean {
  const iOSStandalone = typeof window !== 'undefined' && window.navigator && (window.navigator as any).standalone;
  const displayStandalone = window.matchMedia?.('(display-mode: standalone)').matches;
  return Boolean(iOSStandalone || displayStandalone);
}
