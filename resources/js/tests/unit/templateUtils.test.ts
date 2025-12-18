// tests/unit/templateUtils.test.js
import { describe, it, expect } from 'vitest';
import { validateTemplate } from '@/utils/validateTemplate';
import { normalizeTemplateForCanvas } from '@/utils/normalizeTemplateForCanvas';
import { createTemplateFromCanvas as createFromCanvas } from '@/utils/createTemplateFromCanvas';

// Mock Fabric.js canvas
function mockCanvasWithObjects(objects) {
  return {
    getObjects: () => objects,
    getWidth: () => 216,
    getHeight: () => 216,
  };
}

describe('Template Validation & Normalization', () => {
  it('validates and normalizes a basic illuminated cabinet template', () => {
    const raw = {
      face: { width: 72, height: 36 },
      cabinet: { width: 75, height: 39, borderWidthInches: 1.5, depth: 8 },
      lighting: { type: 'led', count: 2 },
    };

    const validation = validateTemplate(raw);
    expect(validation.ok).toBe(true);
    expect(validation.errors).toHaveLength(0);

    const normalized = normalizeTemplateForCanvas(raw);
    expect(normalized.face.width).toBe(72);
    expect(normalized.face.height).toBe(36);
    expect(normalized.cabinet?.depth).toBe(8);
    expect(normalized.lighting?.count).toBe(2);
    expect(normalized.signType).toBe('custom');
  });

  it('normalizes even an incomplete template', () => {
    const raw = { face: {} };

    const validation = validateTemplate(raw);
    expect(validation.ok).toBe(true);
    expect(validation.warnings.length).toBeGreaterThan(0);

    const normalized = normalizeTemplateForCanvas(raw);
    expect(normalized.face.shape).toBe('flat');
    expect(normalized.face.width).toBe(0);
    expect(normalized.face.height).toBe(0);
  });
});

describe('Create Template From Canvas', () => {
  it('should create a valid template from canvas objects', () => {
    const canvas = mockCanvasWithObjects([
      { type: 'rect', width: 72, height: 36, selectable: false, fill: '#ccc' },
      { type: 'rect', width: 24, height: 72, selectable: false, fill: '#444' },
      { type: 'rect', width: 60, height: 4, fill: '#ffcc00' },
      { type: 'rect', width: 60, height: 4, fill: '#ffcc00' },
    ]);

    const template = createFromCanvas(canvas);

    expect(template.face).toBeTruthy();
    expect(template.cabinet).toBeTruthy();
    expect(template.post).toBeTruthy();
    expect(template.lighting.count).toBe(2);
  });
});
