// resources/js/utils/createTemplateFromCanvas.js

export function createTemplateFromCanvas(canvas) {
  const objects = canvas.getObjects();

  let face = null;
  let cabinet = null;
  let lighting = null;
  let post = null;

  for (const obj of objects) {
    if (obj.type === 'rect') {
      const { width, height, left, top, fill, stroke } = obj;

      if (width > 60 && height > 20 && !obj.selectable) {
        // Likely a background cabinet
        cabinet = {
          width: width,
          height: height,
          depth: 8, // default fallback
          fill: fill || '#cccccc',
          borderWidthInches: 1.5,
          material: 'aluminum',
        };
      } else if (width === 24 && !obj.selectable) {
        // Likely a post (vertical bar)
        post = {
          height: Math.round(height / 24),
          mount: 'bottom',
          color: fill || '#444444',
        };
      } else {
        // Possible sign face
        face = {
          width: width || 72,
          height: height || 36,
          shape: 'flat',
          material: 'polycarbonate',
        };
      }
    } else if (obj.type === 'text') {
      // Could add in logic for face text later
    }
  }

  // Dummy detection of lighting for now
  const lightElements = objects.filter(
    o => o.type === 'rect' && o.height <= 5 && o.fill === '#ffcc00'
  );
  if (lightElements.length) {
    lighting = {
      type: 'led',
      length: lightElements[0].width,
      uom: 'inches',
      structure: 'strand',
      count: lightElements.length,
    };
  }

  return {
    template: 'user_generated',
    illuminated: !!lighting,
    face,
    cabinet,
    lighting,
    post,
  };
}