# Patent Expiration Calculator - Netlify Version

Professional patent term calculator with tabbed interface for calculating expiration dates and maintenance fee schedules.

## Features

- Tabbed interface for organized information access
- Calculate patent expiration for utility, design, and plant patents
- Comprehensive maintenance fee scheduling
- Terminal disclaimer support
- Educational content about patent terms
- Professional service integration
- SEO optimized with unique content

## Deployment to Netlify

### Option 1: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
cd patent-calculator-netlify
netlify deploy --prod
```

### Option 2: Git-based Deployment

1. Push to GitHub/GitLab/Bitbucket
2. Connect repository in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Option 3: Drag and Drop

1. Build locally: `npm run build`
2. Drag the `dist` folder to Netlify dashboard

## Development

```bash
npm install
npm run dev
```

## SEO Strategy

This version features:
- Different meta descriptions and titles from Vercel version
- Unique content organization (tabbed interface)
- Different color scheme (purple/brand vs blue)
- Alternative phrasing and CTAs
- Links to patentwerks.ai and ipservices.us
- Schema.org markup
- Educational content tabs

## Technologies

- React 18
- Vite
- Tailwind CSS
- Lucide React icons
- Responsive tabbed interface
