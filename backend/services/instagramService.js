const { instagramGetUrl } = require('instagram-url-direct');
const { extractShortcode } = require('../utils/helpers');

class InstagramService {
  async downloadInstagramMedia(url, options = {}) {
    try {
      const shortcode = extractShortcode(url);
      if (!shortcode) {
        return {
          error: 'Invalid Instagram URL or shortcode not found',
          code: 'INVALID_SHORTCODE'
        };
      }

      console.log(`🔍 Processing Instagram URL: ${url}`);

      // Get media data using instagram-url-direct
      const data = await instagramGetUrl(url);
      
      if (!data || !data.url_list || data.url_list.length === 0) {
        return {
          error: 'No media found in this Instagram post',
          code: 'NO_MEDIA_FOUND'
        };
      }

      console.log(`📊 Found ${data.results_number} media files`);
      console.log(`👤 Post by: ${data.post_info?.owner_username || 'Unknown'}`);

      if (options.infoOnly) {
        return {
          info: {
            mediaCount: data.results_number || data.url_list.length,
            type: data.media_details?.[0]?.type || 'unknown',
            shortcode: shortcode,
            owner: data.post_info?.owner_username,
            likes: data.post_info?.likes
          }
        };
      }

      // Process media URLs for direct download
      const mediaFiles = await this.processMediaUrls(data, shortcode);
      
      if (mediaFiles.length === 0) {
        return {
          error: 'Failed to process any media files',
          code: 'PROCESSING_FAILED'
        };
      }

      return {
        mediaFiles: mediaFiles,
        success: true,
        postInfo: {
          owner: data.post_info?.owner_username,
          likes: data.post_info?.likes,
          isVerified: data.post_info?.is_verified
        }
      };

    } catch (error) {
      console.error('Instagram service error:', error);
      
      if (error.message?.includes('private')) {
        return {
          error: 'This Instagram account or post is private',
          code: 'PRIVATE_ACCOUNT'
        };
      }
      
      if (error.message?.includes('not found')) {
        return {
          error: 'Instagram post not found or may have been deleted',
          code: 'POST_NOT_FOUND'
        };
      }

      return {
        error: 'Failed to process Instagram media',
        code: 'PROCESSING_ERROR'
      };
    }
  }

  async processMediaUrls(data, shortcode) {
    const mediaFiles = [];
    const timestamp = Date.now();

    for (let i = 0; i < data.url_list.length; i++) {
      const mediaUrl = data.url_list[i];
      const mediaDetail = data.media_details?.[i];
      
      try {
        // Determine file type and extension
        const mediaType = mediaDetail?.type || 'image';
        const isVideo = mediaType === 'video';
        const extension = isVideo ? 'mp4' : 'jpg';
        
        // Generate filename
        const filename = `${shortcode}_${timestamp}_${i + 1}.${extension}`;

        // For Vercel deployment, we'll provide direct download URLs
        mediaFiles.push({
          id: i + 1,
          type: mediaType,
          filename: filename,
          size: 'Unknown', // Size will be determined on download
          contentType: isVideo ? 'video/mp4' : 'image/jpeg',
          downloadUrl: mediaUrl, // Direct Instagram URL
          dimensions: mediaDetail?.dimensions,
          thumbnail: mediaDetail?.thumbnail,
          originalUrl: mediaUrl
        });

        console.log(`✅ Processed ${mediaType}: ${filename}`);

      } catch (error) {
        console.error(`❌ Failed to process media ${i + 1}:`, error.message);
      }
    }

    return mediaFiles;
  }
}

// Export singleton instance
const instagramService = new InstagramService();

module.exports = {
  downloadInstagramMedia: (url, options) => instagramService.downloadInstagramMedia(url, options)
};