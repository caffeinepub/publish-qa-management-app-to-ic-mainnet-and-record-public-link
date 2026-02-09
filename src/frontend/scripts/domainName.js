#!/usr/bin/env node

/**
 * Domain Name Validator and Normalizer
 * 
 * Validates and normalizes domain/app names to meet IC mainnet publishing constraints:
 * - Must be between 5 and 50 characters
 * - Can only contain letters, numbers, and hyphens
 * - Cannot start or end with a hyphen
 * 
 * Usage:
 *   const { validateAndNormalize } = require('./domainName');
 *   const result = validateAndNormalize('My App Name');
 */

/**
 * Validates and normalizes a domain/app name
 * @param {string} name - The raw app/domain name
 * @returns {{ valid: boolean, normalized?: string, error?: string, example?: string }}
 */
function validateAndNormalize(name) {
  if (!name || typeof name !== 'string') {
    return {
      valid: false,
      error: 'Domain name is required',
      example: 'qa-testing-app'
    };
  }

  // Normalize: lowercase, replace spaces and underscores with hyphens
  let normalized = name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Remove consecutive hyphens
  normalized = normalized.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  normalized = normalized.replace(/^-+|-+$/g, '');

  // Check length constraints
  if (normalized.length < 5) {
    return {
      valid: false,
      error: 'Domain name must be at least 5 characters long (after normalization)',
      normalized,
      example: 'qa-testing-app'
    };
  }

  if (normalized.length > 50) {
    return {
      valid: false,
      error: 'Domain name must be at most 50 characters long (after normalization)',
      normalized: normalized.substring(0, 50),
      example: 'qa-testing-app'
    };
  }

  // Final validation: only letters, numbers, and hyphens
  if (!/^[a-z0-9-]+$/.test(normalized)) {
    return {
      valid: false,
      error: 'Domain name can only contain letters, numbers, and hyphens',
      normalized,
      example: 'qa-testing-app'
    };
  }

  // Cannot start or end with hyphen (should be caught above, but double-check)
  if (normalized.startsWith('-') || normalized.endsWith('-')) {
    return {
      valid: false,
      error: 'Domain name cannot start or end with a hyphen',
      normalized,
      example: 'qa-testing-app'
    };
  }

  return {
    valid: true,
    normalized
  };
}

/**
 * Prints validation result to console
 * @param {string} name - The raw app/domain name
 * @returns {boolean} - Whether the name is valid
 */
function validateAndPrint(name) {
  const result = validateAndNormalize(name);

  if (result.valid) {
    console.log('✅ Valid domain name:', result.normalized);
    return true;
  } else {
    console.error('❌ Invalid domain name');
    console.error('');
    console.error('Error:', result.error);
    if (result.normalized && result.normalized !== name) {
      console.error('Normalized to:', result.normalized);
    }
    console.error('');
    console.error('Domain name requirements:');
    console.error('  • Must be between 5 and 50 characters');
    console.error('  • Can only contain letters, numbers, and hyphens');
    console.error('  • Cannot start or end with a hyphen');
    console.error('');
    console.error('Example valid name:', result.example);
    return false;
  }
}

// CLI usage
if (require.main === module) {
  const name = process.argv[2];
  
  if (!name) {
    console.error('Usage: node domainName.js <app-name>');
    console.error('');
    console.error('Example:');
    console.error('  node domainName.js "QA Testing App"');
    process.exit(1);
  }

  const isValid = validateAndPrint(name);
  process.exit(isValid ? 0 : 1);
}

module.exports = {
  validateAndNormalize,
  validateAndPrint
};
