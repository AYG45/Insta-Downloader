/**
 * Extract shortcode from Instagram URL
 * @param {string} url - Instagram URL
 * @returns {string|null} - Extracted shortcode or null
 */
function extractShortcode(url) {
  try {
    // Clean URL and remove query parameters
    const cleanUrl = url.split('?')[0].trim();
    
    // Multiple patterns to catch different URL formats
    const patterns = [
      /instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)\//,
      /instagram\.com\/stories\/[^\/]+\/([A-Za-z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting shortcode:', error);
    return null;
  }
}

module.exports = {
  extractShortcode
};