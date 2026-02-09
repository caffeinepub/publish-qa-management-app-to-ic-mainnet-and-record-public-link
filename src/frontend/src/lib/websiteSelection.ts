const SELECTED_WEBSITE_KEY = 'selectedWebsiteId';

export function getSelectedWebsiteId(): bigint | null {
  if (typeof window === 'undefined') return null;
  
  // Try URL params first
  const params = new URLSearchParams(window.location.search);
  const urlWebsiteId = params.get('websiteId');
  if (urlWebsiteId) {
    try {
      return BigInt(urlWebsiteId);
    } catch {
      // Invalid bigint in URL
    }
  }

  // Fall back to localStorage
  const stored = localStorage.getItem(SELECTED_WEBSITE_KEY);
  if (stored) {
    try {
      return BigInt(stored);
    } catch {
      // Invalid bigint in storage
      localStorage.removeItem(SELECTED_WEBSITE_KEY);
    }
  }

  return null;
}

export function setSelectedWebsiteId(websiteId: bigint | null): void {
  if (typeof window === 'undefined') return;

  if (websiteId === null) {
    localStorage.removeItem(SELECTED_WEBSITE_KEY);
    // Remove from URL
    const params = new URLSearchParams(window.location.search);
    params.delete('websiteId');
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  } else {
    localStorage.setItem(SELECTED_WEBSITE_KEY, websiteId.toString());
    // Update URL
    const params = new URLSearchParams(window.location.search);
    params.set('websiteId', websiteId.toString());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }
}
