const STORAGE_KEY = "joyacards-error-review";

export function readErrorReviewEnabled(storage) {
  try {
    const preferenceStorage = storage || window.localStorage;
    const savedPreference = preferenceStorage.getItem(STORAGE_KEY);

    if (savedPreference === "true" || savedPreference === "false") {
      return savedPreference === "true";
    }
  } catch {
    // Use the default when browser storage is unavailable.
  }

  return true;
}

export function saveErrorReviewEnabled(enabled, storage) {
  try {
    const preferenceStorage = storage || window.localStorage;
    preferenceStorage.setItem(STORAGE_KEY, String(Boolean(enabled)));
  } catch {
    // The feature remains usable when browser storage is unavailable.
  }
}
