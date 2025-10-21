export enum ComparisonMode {
  Split = 'split',
  Fade = 'fade',
  Difference = 'difference',
  // FIX: Add missing enum members for 'Onion' and 'SideBySide' modes.
  Onion = 'onion',
  SideBySide = 'side-by-side',
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}