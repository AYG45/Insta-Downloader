const { instagramGetUrl } = require('instagram-url-direct');

// Validate Instagram URL format
function validateInstagramUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  const patterns = [
    /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/,
    /^https?:\/\/(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?/,
    /^https?:\/\/(www\.)?instagram\.com\/tv\/[A-Za-z0-9_-]+\/?/,
    /^https?:\/\/(www\.)?instagram\.com\/stories\/[A-Za-z0-9_.]+\/[A-Za-z0-9_-]+\/?/
  ];
  return patterns.some(pattern => pattern.test(url));
}

// Extract shortcode from Instagram URL
function extractShortcode(url) {
  try {
    const cleanUrl = url.split('?')[0].trim();
    const patterns = [
      /instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/stories\/[^\/]+\/([A-Za-z0-9_-]+)/
    ];
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) return match[1];
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Process media URLs
function processMediaUrls(data, shortcode) {
  const mediaFiles = [];
  const timestamp = Date.now();

  for (let i = 0; i < data.url_list.length; i++) {
    const mediaUrl = data.url_list[i];
    const mediaDetail = data.media_details?.[i];
    const mediaType = mediaDetail?.type || 'image';
    const isVideo = mediaType === 'video';
    const extension = isVideo ? 'mp4' : 'jpg';
    const filename = `${shortcode}_${timestamp}_${i + 1}.${extension}`;

    mediaFiles.push({
      id: i + 1,
      type: mediaType,
      filename: filename,
      contentType: isVideo ? 'video/mp4' : 'image/jpeg',
      downloadUrl: mediaUrl,
      dimensions: mediaDetail?.dimensions,
      originalUrl: mediaUrl
    });
  }
  return mediaFiles;
}


// Download Instagram media
async function downloadInstagramMedia(url) {
  try {
    const shortcode = extractShortcode(url);
    if (!shortcode) {
      return { error: 'Invalid Instagram URL or shortcode not found', code: 'INVALID_SHORTCODE' };
    }

    console.log(`🔍 Processing Instagram URL: ${url}`);
    const data = await instagramGetUrl(url);
    
    if (!data || !data.url_list || data.url_list.length === 0) {
      return { error: 'No media found in this Instagram post', code: 'NO_MEDIA_FOUND' };
    }

    console.log(`📊 Found ${data.results_number} media files`);
    const mediaFiles = processMediaUrls(data, shortcode);
    
    if (mediaFiles.length === 0) {
      return { error: 'Failed to process any media files', code: 'PROCESSING_FAILED' };
    }

    return { mediaFiles, success: true };
  } catch (error) {
    console.error('Instagram service error:', error);
    if (error.message?.includes('private')) {
      return { error: 'This Instagram account or post is private', code: 'PRIVATE_ACCOUNT' };
    }
    if (error.message?.includes('not found')) {
      return { error: 'Instagram post not found or may have been deleted', code: 'POST_NOT_FOUND' };
    }
    return { error: 'Failed to process Instagram media', code: 'PROCESSING_ERROR' };
  }
}

// Vercel serverless function handler
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Instagram URL is required', code: 'MISSING_URL' });
    }

    if (!validateInstagramUrl(url)) {
      return res.status(400).json({ error: 'Invalid Instagram URL format', code: 'INVALID_URL' });
    }

    console.log(`📥 Download request for: ${url}`);
    const result = await downloadInstagramMedia(url);

    if (result.error) {
      return res.status(400).json({ error: result.error, code: result.code });
    }

    console.log(`✅ Successfully processed ${result.mediaFiles.length} files`);
    return res.json({
      success: true,
      mediaFiles: result.mediaFiles,
      metadata: { totalFiles: result.mediaFiles.length, downloadedAt: new Date().toISOString(), url }
    });

  } catch (error) {
    console.error('❌ Download error:', error);
    return res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
};
