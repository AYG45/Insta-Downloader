/**
 * Validate Instagram URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid Instagram URL
 */
function validateInstagramUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Instagram URL patterns
  const patterns = [
    /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/,
    /^https?:\/\/(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?/,
    /^https?:\/\/(www\.)?instagram\.com\/tv\/[A-Za-z0-9_-]+\/?/,
    /^https?:\/\/(www\.)?instagram\.com\/stories\/[A-Za-z0-9_.]+\/[A-Za-z0-9_-]+\/?/
  ];

  return patterns.some(pattern => pattern.test(url));
}

/**
 * Validate request body for required fields
 * @param {object} body - Request body
 * @param {array} requiredFields - Array of required field names
 * @returns {object} - Validation result
 */
function validateRequiredFields(body, requiredFields) {
  const missing = [];
  
  for (const field of requiredFields) {
    if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
      missing.push(field);
    }
  }

  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
}

/**
 * Sanitize string input
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 2048); // Limit length
}

module.exports = {
  validateInstagramUrl,
  validateRequiredFields,
  sanitizeString
};