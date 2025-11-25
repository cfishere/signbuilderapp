// resources/js/utils/canvasDrawUtils.js
import * as fabric from 'fabric';

export function drawPost(canvas, post) {
  const rect = new fabric.Rect({
    width: 6,
    height: post.height * 24,
    fill: post.color || '#444',
    left: canvas.getWidth() / 2 - 3,
    top: canvas.getHeight() - post.height * 24,
    selectable: true,
    lockMovementX: false,
    lockMovementY: true,
    hasControls: true,
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  /*rect.sendToBack();*/
  canvas.requestRenderAll();
}

//template = named signTemplates property.
export function drawCabinet(canvas, template, dimensions) {
  let post = false;
  let postW = 0;
  let postHt = 0; //since the grid is 24 pixel increments to represent 1 ft. Inches/12*24 sets it in context to the grid
  let cabinetW = dimensions.width /12 * 24;
  let cabinetHt = dimensions.height /12 * 24;
  let cabinetTopY = 10;

  //use the template just to calc intitial post dimensions.
  if(typeof template.post != 'undefined') {   
    postHt = Number(template.post.height) /12 * 24; // =  post.height /12 * 24
    postW = Number(template.post.width) /12 * 24;
  }

  if(template.cabinet.mount == 'post'){    
      cabinetTopY = canvas.getHeight() - postHt + cabinetHt;
  }

  const rect = new fabric.Rect({
    width: cabinetW,
    height: cabinetHt,
    fill: template.cabinet.fill || '#fff',
    stroke: 'black',
    strokeWidth: template.cabinet.borderWidthInches || 1,
    originX: 'center',
    originY: cabinetTopY,
    left: canvas.getWidth() / 2,
    top: cabinetTopY || canvas.getHeight() - cabinetHt / 2,
  });

  canvas.add(rect);  
    canvas.requestRenderAll();
}


/*export function drawCabinet(canvas, cabinet) {
  const rect = new fabric.Rect({
    width: cabinet.width,
    height: cabinet.height,
    fill: cabinet.color || '#ccc',
    left: canvas.getWidth() / 2 - cabinet.width / 2,
    top: canvas.getHeight() / 2 - cabinet.height / 2,
    selectable: true,
  });
  canvas.add(rect);
}*/

export function drawFace(canvas, face) {
  const rect = new fabric.Rect({
    width: face.width,
    height: face.height,
    fill: '#ffffff',
    stroke: '#000',
    strokeWidth: 1,
    left: canvas.getWidth() / 2 - face.width / 2,
    top: canvas.getHeight() / 2 - face.height / 2,
    selectable: true,
  });
  canvas.add(rect);
}

export function drawLighting(canvas, lighting) {
  const unitLength = lighting.uom === 'feet' ? lighting.length * 12 : lighting.length;
  for (let i = 0; i < lighting.count; i++) {
    const line = new fabric.Rect({
      width: unitLength,
      height: 4,
      fill: '#ffcc00',
      left: canvas.getWidth() / 2 - unitLength / 2,
      top: 60 + i * 12,
      selectable: false,
    });
    canvas.add(line);
  }
}
