# Instagram Downloader

A React web application for downloading Instagram media (videos and images) from posts, reels, and IGTV.

## Features

- ✅ Download Instagram videos and images
- ✅ Support for posts, reels, and IGTV
- ✅ Modern React UI with animations
- ✅ Responsive design
- ✅ Real-time download progress
- ✅ Multiple file downloads

## Tech Stack

- **Frontend**: React 18, Framer Motion, React Icons
- **Backend**: Node.js, Express, instagram-url-direct
- **Deployment**: Vercel (Serverless Functions)

## Deployment

### Deploy to Vercel

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import this project
4. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/instagram-downloader)

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Instagram_React_App
```

2. Install dependencies:
```bash
npm install
cd backend && npm install && cd ..
```

3. Start development servers:
```bash
# Frontend (port 3000)
npm start

# Backend (port 5000)
cd backend && npm run dev
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/download` - Download Instagram media

## Usage

1. Open the application
2. Paste an Instagram URL (post, reel, or IGTV)
3. Click "Download"
4. Download individual files or all at once

## Supported URLs

- `https://www.instagram.com/p/[shortcode]/`
- `https://www.instagram.com/reel/[shortcode]/`
- `https://www.instagram.com/tv/[shortcode]/`

## Limitations

- Only public Instagram content
- No support for Stories
- Rate limited to prevent abuse

## License

MIT License