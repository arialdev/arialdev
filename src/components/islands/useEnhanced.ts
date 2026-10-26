import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// Preserve the server fallback through hydration, then expose working controls.
export function useEnhanced(): boolean {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
