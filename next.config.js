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
    NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN: process.env.MAPBOX_PUBLIC_TOKEN,
  },
  images: {
    domains: ["routes-by-you.s3.eu-central-1.amazonaws.com"],
  },
  async redirects() {
    return [
      {
        source: "/user/:userId",
        destination: "/user/:userId/routes",
        permanent: true,
      },
      {
        source: "/location/:locationId",
        destination: "/location/:locationId/active",
        permanent: true,
      },
      {
        source: "/collection/:collectionId",
        destination: "/collection/:collectionId/list",
        permanent: true,
      },
    ];
  },
  basePath,
};
