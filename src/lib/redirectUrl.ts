/**
 * Get the correct public-facing origin URL.
 * In the Lovable preview iframe, window.location.origin returns an internal
 * lovableproject.com URL that isn't directly accessible in a browser.
 * This helper converts it to the publicly accessible lovable.app preview URL.
 */
export function getPublicOrigin(): string {
  const origin = window.location.origin;
  if (origin.includes('.lovableproject.com')) {
    const projectId = origin.replace('https://', '').replace('.lovableproject.com', '');
    return `https://id-preview--${projectId}.lovable.app`;
  }
  return origin;
}
