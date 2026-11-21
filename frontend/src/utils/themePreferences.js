const STORAGE_KEY = "joyacards-theme";

export function readThemePreference(storage) {
  try {
    const preferenceStorage = storage || window.localStorage;
    const savedTheme = preferenceStorage.getItem(STORAGE_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
  } catch {
    // The theme remains usable when browser storage is unavailable.
  }

  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export function saveThemePreference(theme, storage) {
  try {
    const preferenceStorage = storage || window.localStorage;
    preferenceStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The theme remains usable when browser storage is unavailable.
  }
}
