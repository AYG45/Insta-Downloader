const { downloadInstagramMedia } = require('../backend/services/instagramService');
const { validateInstagramUrl } = require('../backend/utils/validators');

// Vercel serverless function
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    // Validate input
    if (!url) {
      console.log('❌ Missing URL in request');
      return res.status(400).json({
        error: 'Instagram URL is required',
        code: 'MISSING_URL'
      });
    }

    // Validate Instagram URL format
    if (!validateInstagramUrl(url)) {
      console.log('❌ Invalid URL format:', url);
      return res.status(400).json({
        error: 'Invalid Instagram URL format',
        code: 'INVALID_URL'
      });
    }

    console.log(`📥 Download request for: ${url}`);

    // Download media
    const result = await downloadInstagramMedia(url);

    if (result.error) {
      console.log('❌ Download failed:', result.error);
      return res.status(400).json({
        error: result.error,
        code: result.code || 'DOWNLOAD_ERROR'
      });
    }

    console.log(`✅ Successfully processed ${result.mediaFiles.length} files`);

    res.json({
      success: true,
      mediaFiles: result.mediaFiles,
      metadata: {
        totalFiles: result.mediaFiles.length,
        downloadedAt: new Date().toISOString(),
        url: url
      }
    });

  } catch (error) {
    console.error('❌ Download error:', error);
    
    res.status(500).json({
      error: 'Internal server error occurred while processing your request',
      code: 'INTERNAL_ERROR'
    });
  }
};