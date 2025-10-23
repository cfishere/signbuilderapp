// resources/js/templates/signTemplates.js

export const signTemplates = {
  "Wall Sign Illuminated Cabinet": {
    template: "wall_illuminated",
    illuminated: true,
    face: {
      width: 72,
      height: 36,
      shape: "flat",
      material: "polycarbonate",
    },
    cabinet: {
      width: 72,
      height: 36,
      depth: 8,
      borderWidthInches: 1.5,
      material: "aluminum",
      fill: "#e6e6e6",
    },
    lighting: {
      type: "led",
      length: 72,
      uom: "inches",
      structure: "strand",
      count: 2,
    },
    post: {
      height: 3,
      mount: "bottom",
      color: "#444444",
    },
  },

  "Wall Sign Printed": {
    template: "wall_printed",
    illuminated: false,
    face: {
      width: 72,
      height: 36,
      shape: "flat",
      material: "vinyl",
    },
    cabinet: null,
    lighting: null,
    post: null,
  },

  "Pylon Illuminated Cabinet": {
    template: "pylon_illuminated",
    illuminated: true,
    face: {
      width: 96,
      height: 48,
      shape: "flat",
      material: "polycarbonate",
    },
    cabinet: {
      width: 96,
      height: 48,
      depth: 8,
      borderWidthInches: 1.5,
      material: "aluminum",
      fill: "#dddddd",
    },
    lighting: {
      type: "led",
      length: 96,
      uom: "inches",
      structure: "strand",
      count: 3,
    },
    post: {
      height: 10,
      mount: "bottom",
      color: "#444444",
    },
  },

  "Pylon Dark Cabinet": {
    template: "pylon_dark",
    illuminated: false,
    face: {
      width: 96, 
      height: 48,
      shape: "flat",
      material: "aluminum",
    },
    cabinet: {
      width: 96,
      height: 48,
      depth: 8,
      mount: "post",
      borderWidthInches: 1.5,
      material: "steel",
      fill: "#333333",
    },
    lighting: null,
    post: {
      height: 120,
      mount: "bottom",
      color: "#444444",
    },
  },

  "Monument Illuminated Cabinet": {
    template: "monument_illuminated",
    illuminated: true,
    face: {
      width: 72,
      height: 36,
      shape: "flat",
      material: "polycarbonate",
    },
    cabinet: {
      width: 72,
      height: 36,
      depth: 8,
      borderWidthInches: 1.5,
      material: "aluminum",
      fill: "#eeeeee",
    },
    lighting: {
      type: "neon tube",
      length: 36,
      uom: "inches",
      structure: "tube",
      count: 2,
    },
    post: {
      height: 3,
      mount: "bottom",
      color: "#444444",
    },
  },

  "Monument Dark Cabinet": {
    template: "monument_dark",
    illuminated: false,
    face: {
      width: 72,
      height: 36,
      shape: "flat",
      material: "aluminum",
    },
    cabinet: {
      width: 72,
      height: 36,
      depth: 8,
      borderWidthInches: 1.5,
      material: "steel",
      fill: "#333333",
    },
    lighting: null,
    post: {
      height: 3,
      mount: "bottom",
      color: "#444444",
    },
  },

  "Channel Letters": {
    template: "channel_letters",
    illuminated: true,
    face: null,
    cabinet: null,
    lighting: {
      type: "led",
      length: 48,
      uom: "inches",
      structure: "strand",
      count: 3,
    },
    post: null,
  },

  "Face Replacement": {
    template: "face_replacement",
    illuminated: false,
    face: {
      width: 72,
      height: 36,
      shape: "custom",
      material: "polycarbonate",
    },
    cabinet: null,
    lighting: null,
    post: null,
  },
};
