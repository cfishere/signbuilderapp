export function validateTemplate(template) {
  if (typeof template !== 'object' || !template) return false;

  const validated = { ...template };

  // 🔹 Validate `face` (required unless type is neon or channel letters)
  if (validated.face) {
    validated.face.width = Number(validated.face.width) || 72;
    validated.face.height = Number(validated.face.height) || 36;
    validated.face.shape = ['flat', 'pan-formed', 'custom'].includes(validated.face.shape)
      ? validated.face.shape
      : 'flat';
  }

  // 🔹 Validate `cabinet` (optional)
  if (validated.cabinet) {
    validated.cabinet.width = Number(validated.cabinet.width) || 72;
    validated.cabinet.height = Number(validated.cabinet.height) || 36;
    validated.cabinet.depth = Number(validated.cabinet.depth) || 8;
  }

  // 🔹 Validate `post` (optional)
  if (validated.post) {
    validated.post.height = Number(validated.post.height) || 3;
    validated.post.mount = ['bottom', 'side'].includes(validated.post.mount)
      ? validated.post.mount
      : 'bottom';
    validated.post.color = validated.post.color || '#444444';
  }

  // 🔹 Validate `lighting` (optional)
  if (validated.lighting) {
    const lt = validated.lighting;
    lt.type = ['led', 'neon tube', 'neon strand', 'flourescent tube'].includes(lt.type)
      ? lt.type
      : 'led';
    lt.length = Number(lt.length) || 24;
    lt.uom = ['inches', 'feet'].includes(lt.uom) ? lt.uom : 'inches';
    lt.structure = ['tube', 'strand'].includes(lt.structure) ? lt.structure : 'tube';
    lt.count = Number(lt.count) || 1;
  }

  return validated;
}
