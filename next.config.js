const {
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITLAB_COMMIT_SHA,
  VERCEL_BITBUCKET_COMMIT_SHA,
} = process.env;

const COMMIT_SHA =
  VERCEL_GITHUB_COMMIT_SHA ||
  VERCEL_GITLAB_COMMIT_SHA ||
  VERCEL_BITBUCKET_COMMIT_SHA;

const basePath = "";

module.exports = {
  productionBrowserSourceMaps: true,
  env: {
    NEXT_PUBLIC_COMMIT_SHA: COMMIT_SHA,
    NEXT_PUBLIC_PUBLIC_URL: process.env.PUBLIC_URL,
    NEXT_PUBLIC_SUPABASE_API_URL: process.env.SUPABASE_API_URL,
    NEXT_PUBLIC_SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
  },
  images: {
    domains: ["routes-by-you.s3.eu-central-1.amazonaws.com"],
  },
  basePath,
};
