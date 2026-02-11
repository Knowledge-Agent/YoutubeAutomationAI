const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

const siteUrlWithScheme = configuredSiteUrl
  ? /^https?:\/\//i.test(configuredSiteUrl)
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`
  : "http://localhost:3000";

export const siteUrl = siteUrlWithScheme.replace(/\/$/, "");
