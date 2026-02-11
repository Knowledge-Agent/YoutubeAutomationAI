# YoutubeAutomation

## Static SEO site

This project is configured for static export with Next.js App Router.

### Local development

```bash
npm install
npm run dev
```

### Build static files

```bash
npm run build
```

Static files are generated in `out/`.

### Important SEO setting

Set your production domain before build, otherwise sitemap and canonical links default to `http://localhost:3000`.

```bash
export NEXT_PUBLIC_SITE_URL="https://your-domain.com"
npm run build
```

### Branding assets

Generated logo and social assets are in `public/`:

- `logo.svg`
- `logo-mark.svg`
- `logo-512.png`
- `favicon.ico`
- `apple-touch-icon.png`
- `og-image.png`
