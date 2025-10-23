/*single source of truth for the font families we want to expose.*/
// resources/js/utils/fonts.ts
export type FontFamily = {
  family: string               // Google Fonts family name
  weights?: number[]           // which weights we’ll request
  style?: 'normal' | 'italic'
  disallowForChannelLetter?: boolean  // restrict in that mode
}

// Add or remove fonts. The loader will fail gracefully if a family can’t be fetched.
export const FONT_CATALOG: FontFamily[] = [
  { family: 'Bebas Neue', weights: [400], style: 'normal' },
  { family: 'Cossette Titre', weights: [400, 700] },
  { family: 'Manufacturing Consent', weights: [400], disallowForChannelLetter: true },
  { family: 'Story Script', weights: [400], disallowForChannelLetter: true },
  { family: 'Playfair Display', weights: [400, 700] },
  { family: 'Lora', weights: [400, 700] },
  { family: 'Anton', weights: [400] },
  { family: 'Archivo Black', weights: [400] },
  { family: 'Bungee', weights: [400] },
  { family: 'Lobster', weights: [400], disallowForChannelLetter: true },           // cursive
  { family: 'Alfa Slab One', weights: [400] },
  { family: 'DM Serif Display', weights: [400] },
  { family: 'Caveat', weights: [400, 700], disallowForChannelLetter: true },      // hand
  { family: 'Change One', weights: [400] },
  { family: 'Luckiest Guy', weights: [400], disallowForChannelLetter: true },
  { family: 'Marcellus', weights: [400] },
  { family: 'Oleo Script', weights: [400], disallowForChannelLetter: true },      // cursive
  { family: 'Titan One', weights: [400] },
  { family: 'Amatic SC', weights: [400, 700], disallowForChannelLetter: true },   // very thin
  { family: 'Delius', weights: [400], disallowForChannelLetter: true },
  { family: 'Courgette', weights: [400], disallowForChannelLetter: true },
  { family: 'Gloria Hallelujah', weights: [400], disallowForChannelLetter: true },
  { family: 'Rubik Distressed', weights: [400], disallowForChannelLetter: true },
  { family: 'Berkshire Swash', weights: [400], disallowForChannelLetter: true },
  { family: 'Special Elite', weights: [400] },
  { family: 'Averia Serif Libre', weights: [400, 700] },
  { family: 'Boogaloo', weights: [400] },
  { family: 'Julee', weights: [400], disallowForChannelLetter: true },
  { family: 'Limelight', weights: [400] },
  { family: 'Protest Revolution', weights: [400], disallowForChannelLetter: true },
  { family: 'Mouse Memoirs', weights: [400] },
  // Add more as you verify availability on Google Fonts
]

export function isAllowedForChannelLetters(font: FontFamily) {
  return !font.disallowForChannelLetter
}
