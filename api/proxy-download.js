const https = require('https');
const http = require('http');
const { instagramGetUrl } = require('instagram-url-direct');

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

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, filename, index, postUrl } = req.query;

    // If postUrl is provided, fetch fresh URLs from Instagram
    if (postUrl) {
      console.log(`🔄 Fetching fresh URL for: ${postUrl}`);
      
      const decodedPostUrl = decodeURIComponent(postUrl);
      const fileIndex = parseInt(index) || 0;
      const downloadFilename = filename ? decodeURIComponent(filename) : 'download';

      try {
        // Get fresh media URLs from Instagram
        console.log(`Fetching Instagram data for: ${decodedPostUrl}`);
        const data = await instagramGetUrl(decodedPostUrl);
        
        console.log(`Instagram API response:`, {
          hasData: !!data,
          urlListLength: data?.url_list?.length,
          resultsNumber: data?.results_number
        });
        
        if (!data || !data.url_list || data.url_list.length === 0) {
          console.error('No media found in Instagram response');
          return res.status(404).json({ error: 'No media found' });
        }

        if (fileIndex >= data.url_list.length) {
          console.error(`Index ${fileIndex} out of range (max: ${data.url_list.length - 1})`);
          return res.status(404).json({ error: 'Media index out of range' });
        }

        const freshMediaUrl = data.url_list[fileIndex];
        console.log(`✅ Got fresh URL for index ${fileIndex}`);
        console.log(`Fresh URL: ${freshMediaUrl.substring(0, 100)}...`);

        // Now download with the fresh URL
        const protocol = freshMediaUrl.startsWith('https') ? https : http;

        protocol.get(freshMediaUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Referer': 'https://www.instagram.com/',
            'Accept-Encoding': 'identity',
            'Connection': 'keep-alive'
          }
        }, (proxyRes) => {
          console.log(`Instagram response status: ${proxyRes.statusCode}`);
          console.log(`Response headers:`, proxyRes.headers);
          
          if (proxyRes.statusCode === 302 || proxyRes.statusCode === 301) {
            // Handle redirect
            const redirectUrl = proxyRes.headers.location;
            console.log(`Following redirect to: ${redirectUrl}`);
            
            const redirectProtocol = redirectUrl.startsWith('https') ? https : http;
            redirectProtocol.get(redirectUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Referer': 'https://www.instagram.com/',
                'Accept-Encoding': 'identity'
              }
            }, (redirectRes) => {
              if (redirectRes.statusCode !== 200) {
                console.error(`❌ Redirect failed: ${redirectRes.statusCode}`);
                return res.status(redirectRes.statusCode).json({ error: 'Failed to fetch media after redirect' });
              }
              
              const contentType = redirectRes.headers['content-type'] || 'application/octet-stream';
              const contentLength = redirectRes.headers['content-length'];

              res.setHeader('Content-Type', contentType);
              res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
              res.setHeader('Cache-Control', 'no-cache');
              
              if (contentLength) {
                res.setHeader('Content-Length', contentLength);
              }

              redirectRes.pipe(res);
              console.log(`✅ Successfully downloaded after redirect: ${downloadFilename}`);
            }).on('error', (error) => {
              console.error('❌ Redirect request error:', error);
              if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to download media after redirect' });
              }
            });
            return;
          }
          
          if (proxyRes.statusCode !== 200) {
            console.error(`❌ Failed to fetch media: ${proxyRes.statusCode}`);
            return res.status(proxyRes.statusCode).json({ error: `Failed to fetch media from Instagram (status: ${proxyRes.statusCode})` });
          }

          const contentType = proxyRes.headers['content-type'] || 'application/octet-stream';
          const contentLength = proxyRes.headers['content-length'];

          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
          res.setHeader('Cache-Control', 'no-cache');
          
          if (contentLength) {
            res.setHeader('Content-Length', contentLength);
          }

          proxyRes.pipe(res);
          console.log(`✅ Successfully downloaded: ${downloadFilename}`);
        }).on('error', (error) => {
          console.error('❌ Download error:', error.message);
          console.error('Error stack:', error.stack);
          if (!res.headersSent) {
            res.status(500).json({ error: `Failed to download media: ${error.message}` });
          }
        });

      } catch (error) {
        console.error('❌ Failed to fetch fresh URL:', error);
        return res.status(500).json({ error: 'Failed to get fresh media URL' });
      }
      
    } else if (url) {
      // Fallback: try to use the provided URL directly
      const mediaUrl = decodeURIComponent(url);
      const downloadFilename = filename ? decodeURIComponent(filename) : 'download';

      console.log(`📥 Direct proxy download: ${downloadFilename}`);

      const protocol = mediaUrl.startsWith('https') ? https : http;

      protocol.get(mediaUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Referer': 'https://www.instagram.com/',
          'Accept-Encoding': 'identity',
          'Connection': 'keep-alive'
        }
      }, (proxyRes) => {
        if (proxyRes.statusCode !== 200) {
          console.error(`❌ Failed to fetch media: ${proxyRes.statusCode}`);
          return res.status(proxyRes.statusCode).json({ error: 'Failed to fetch media from Instagram' });
        }

        const contentType = proxyRes.headers['content-type'] || 'application/octet-stream';
        const contentLength = proxyRes.headers['content-length'];

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
        
        if (contentLength) {
          res.setHeader('Content-Length', contentLength);
        }

        proxyRes.pipe(res);
        console.log(`✅ Successfully proxied: ${downloadFilename}`);
      }).on('error', (error) => {
        console.error('❌ Proxy error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download media' });
        }
      });
    } else {
      return res.status(400).json({ error: 'Either url or postUrl parameter is required' });
    }

  } catch (error) {
    console.error('❌ Proxy download error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
