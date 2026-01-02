
export interface TextSettings {
  text: string;
  size: number;
  height: number;
  curveSegments: number;
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelOffset: number;
  bevelSegments: number;
  letterSpacing: number;
  lineHeight: number;
  align: 'left' | 'center' | 'right';
  targetLength: number;
  lockThickness: boolean;
  invertHoles: boolean;
}

export interface MaterialSettings {
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  emissive: string;
  emissiveIntensity: number;
  map?: string;
  normalMap?: string;
  roughnessMap?: string;
  metalnessMap?: string;
  repeatX: number;
  repeatY: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export interface FontData {
  family: string;
  url: string;
  source: 'google' | 'upload';
  variants?: string[];
}

export interface MaterialPreset {
  id: string;
  name: string;
  category: string;
  settings: Partial<MaterialSettings>;
  thumbnail?: string;
}
