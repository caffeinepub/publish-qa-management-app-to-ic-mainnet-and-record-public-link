export interface ValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
}

export function validateAndNormalizeUrl(input: string): ValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a URL',
    };
  }

  // Check if it starts with http:// or https://
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return {
      isValid: false,
      error: 'URL must start with http:// or https://',
    };
  }

  try {
    const url = new URL(trimmed);

    // Check if hostname exists
    if (!url.hostname || url.hostname.length === 0) {
      return {
        isValid: false,
        error: 'Invalid URL: missing hostname',
      };
    }

    // Check if hostname has at least one dot (basic domain validation)
    if (!url.hostname.includes('.') && url.hostname !== 'localhost') {
      return {
        isValid: false,
        error: 'Invalid URL: hostname must be a valid domain',
      };
    }

    return {
      isValid: true,
      normalizedUrl: url.toString(),
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format',
    };
  }
}
