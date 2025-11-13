// resources/js/utils/validateTemplate.js

function isFiniteNumber(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

export function validateTemplate(t) {
  const warnings = [];
  const errors = [];

  if (!t) {
    errors.push('Template is null/undefined.');
    return { ok: false, warnings, errors };
  }

  // Face is recommended for most sign types
  if (!t.face) {
    warnings.push('face missing; defaults will be applied during normalization');
  } else {
    if (!isFiniteNumber(t.face.width)) {
      warnings.push('face.width missing; defaulting to 0');
    }
    if (!isFiniteNumber(t.face.height)) {
      warnings.push('face.height missing; defaulting to 0');
    }
  }

  // Illuminated signs: lighting is optional but recommended
  if (t.category === 'illuminated' && !t.lighting) {
    warnings.push('lighting missing for illuminated sign; defaults will apply');
  }

  // Cabinet present but incomplete
  if (t.cabinet && (!isFiniteNumber(t.cabinet.width) || !isFiniteNumber(t.cabinet.height))) {
    warnings.push('cabinet width/height incomplete; defaulting to face dimensions');
  }

  return { ok: errors.length === 0, warnings, errors };
}
