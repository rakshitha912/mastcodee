/**
 * Asset configuration
 * Use local paths (not Lovable cloud URLs)
 */

// Logo and branding
export const ASSETS = {
  // Logo
  LOGO: "/og/mast_code_logo_2_corrected.png",

  // CEO/Founder
  CEO_PHOTO: "/og/ceo-rakshitha.png",

  // Social/OG
  OG_IMAGE: "/og/mastcode-og.png",
} as const;

/**
 * Fallback configuration if assets are not found
 * These are placeholder descriptions for SEO/accessibility
 */
export const ASSET_ALT_TEXT = {
  LOGO: "MastCode professional logo",
  CEO_PHOTO: "Rakshitha S, Founder & CEO of MastCode",
  OG_IMAGE: "MastCode - Learn. Build. Launch Your Tech Career",
} as const;
