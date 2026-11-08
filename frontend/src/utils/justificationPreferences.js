const STORAGE_KEY = "joyacards-justifications";

export function readJustificationsEnabled(storage) {
  try {
    const preferenceStorage = storage || window.localStorage;
    return preferenceStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

export function saveJustificationsEnabled(enabled, storage) {
  try {
    const preferenceStorage = storage || window.localStorage;
    preferenceStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // La función sigue disponible si el navegador no permite persistir.
  }
}
