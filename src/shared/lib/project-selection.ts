export interface StoredProjectSelection {
  id: string;
  title: string;
}

const PROJECT_SELECTION_STORAGE_KEY = 'youtube-automation-ai:selected-project';

function canUseStorage() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

export function getStoredProjectSelection(): StoredProjectSelection | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(PROJECT_SELECTION_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<StoredProjectSelection>;
    if (!parsed.id || !parsed.title) {
      return null;
    }

    return {
      id: parsed.id,
      title: parsed.title,
    };
  } catch {
    return null;
  }
}

export function setStoredProjectSelection(selection: StoredProjectSelection) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    PROJECT_SELECTION_STORAGE_KEY,
    JSON.stringify(selection)
  );
}

export function clearStoredProjectSelection() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(PROJECT_SELECTION_STORAGE_KEY);
}
