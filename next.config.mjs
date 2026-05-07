/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Allow SVGs from /public (e.g. /exp1.svg, /b1.svg, /next.svg).
    // We control the SVG sources, but the CSP below blocks any inline scripts
    // and external loads even if a malicious SVG were ever uploaded.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline'",
  },
};

export default nextConfig;
