export const BASE_SIGN_PRICES: Record<string, number> = {
  'Wall Sign Exterior': 350,
  'Wall Sign Interior': 375,
  'Wall Sign Illuminated': 650,
  'Pylon Non-Illuminated': 1200,
  'Pylon Illuminated Cabinet': 1800,
  'Monument': 950,
  'Monument Illuminated': 1400,
  'Channel Letters': 2200,
  'Cut Letters Interior': 500,
  'Cut Letters Exterior': 650,
  'Face Replacement': 400,
  'Face Replacement Illuminated': 600,
};

export function getBasePriceForSignType(signType?: string | null): number {
  if (!signType) return 500;
  return BASE_SIGN_PRICES[signType] ?? 500;
}
