// resources/js/utils/normalizeTemplateForCanvas.js
// Fallbacks for sign elements if not properly defined by the user 
// to enforce minimus dimensional standards across sign elements.

export function normalizeTemplateForCanvas(template) {
  if (!template || typeof template !== 'object') return {};

  const normalized = {};
  const faceDefaults = template.face || {};

  // Normalize post
  if (template.post) {
    normalized.post = {
      height: template.post.height || 3,
      mount: ['bottom', 'side'].includes(template.post.mount)
        ? template.post.mount
        : 'bottom',
      color: template.post.color || '#444444',
    };
  }

 if (template.cabinet) {
    normalized.cabinet = {
      height: template.post.height || 3,
      mount: ['bottom', 'side'].includes(template.post.mount)
        ? template.post.mount
        : 'bottom',
      color: template.post.color || '#444444',
    };
  }

  // Normalize cabinet
  if (template.cabinet) {
    normalized.cabinet = {
      width: template.cabinet.width || 72,
      height: template.cabinet.height || 36,
      depth: template.cabinet.depth || 8,
      fill: template.cabinet.fill || '#cccccc',
      borderWidthInches: template.cabinet.borderWidthInches || 1.5,
      material: template.cabinet.material || 'aluminum',
    };
  }

  // Normalize lighting
  if (template.lighting) {
    normalized.lighting = {
      type: template.lighting.type || 'led',
      length: template.lighting.length || 24,
      uom: template.lighting.uom || 'inches',
      structure: template.lighting.structure || 'tube',
      count: template.lighting.count || 1,
    };
  }

  // Normalize face
  if (template.face) {
    normalized.face = {
      width: faceDefaults.width || template.cabinet.width-1.5,
      height: faceDefaults.height || template.cabinet.height-1.5,
      //add a border to mark "design area" inside retainer.
      borderWidthInches: template.cabinet.borderWidthInches || 0.5,
      fill: template.cabinet.fill || '#FFFFFFF',
      borderColor: '#FF0000',
      shape: faceDefaults.shape || 'flat',
      material: faceDefaults.material || 'polycarbonate',
    };
  }

  // Include template name and flags
  if (template.template) {
    normalized.template = template.template;
  }
  if ('illuminated' in template) {
    normalized.illuminated = template.illuminated;
  }

  return normalized;
}
