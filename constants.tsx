import { TextSettings, MaterialSettings, MaterialPreset } from './types';

/**
 * SOURCE OF TRUTH FOR EMBEDDING
 * This must be exactly your production URL.
 */
export const PUBLIC_EMBED_URL = "https://3d-text-exporter-pro.pages.dev";

export const INITIAL_TEXT_SETTINGS: TextSettings = {
  text: "Hire me",
  size: 1,
  height: 0.3,
  curveSegments: 24,
  bevelEnabled: true,
  bevelThickness: 0.08,
  bevelSize: 0.06,
  bevelOffset: 0,
  bevelSegments: 8,
  letterSpacing: 0.02,
  lineHeight: 1.2,
  align: 'center',
  targetLength: 8,
  lockThickness: true,
  invertHoles: false
};

export const INITIAL_MATERIAL_SETTINGS: MaterialSettings = {
  color: "#0066ff",
  metalness: 0.1,
  roughness: 0.1,
  envMapIntensity: 2.0,
  emissive: "#000000",
  emissiveIntensity: 0,
  repeatX: 1,
  repeatY: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0
};

export const MATERIAL_PRESETS: MaterialPreset[] = [];

const GITHUB_FONT_BASE = "https://cdn.jsdelivr.net/gh/google/fonts@master";

export const GOOGLE_FONTS = [
  { family: 'Righteous', url: `${GITHUB_FONT_BASE}/ofl/righteous/Righteous-Regular.ttf` },
  { family: 'Bangers', url: `${GITHUB_FONT_BASE}/ofl/bangers/Bangers-Regular.ttf` },
  { family: 'Montserrat', url: `${GITHUB_FONT_BASE}/ofl/montserrat/static/Montserrat-Bold.ttf` },
  { family: 'Lobster', url: `${GITHUB_FONT_BASE}/ofl/lobster/Lobster-Regular.ttf` },
  { family: 'Oswald', url: `${GITHUB_FONT_BASE}/ofl/oswald/static/Oswald-Bold.ttf` },
  { family: 'Permanent Marker', url: `${GITHUB_FONT_BASE}/ofl/permanentmarker/PermanentMarker-Regular.ttf` },
  { family: 'Roboto', url: `${GITHUB_FONT_BASE}/ofl/roboto/static/Roboto-Bold.ttf` },
  { family: 'Syncopate', url: `${GITHUB_FONT_BASE}/apache/syncopate/Syncopate-Bold.ttf` },
  { family: 'Inter', url: `${GITHUB_FONT_BASE}/ofl/inter/static/Inter-Bold.ttf` },
];