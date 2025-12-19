// resources/js/materials/materialTypes.js

export const materials = {
  "PVC": {
    outdoor: true,
    durability: 6,
    code: "pvc",
    length: 120,
    width: 48,
    thicknessOptions: [0.75, 1.5, 2.25],
    colorOptions: ["white", "black", "red", "blue", "green"]
  },
  "Polycarbonate": {
    outdoor: true,
    durability: 18,
    code: "pcarb",
    length: 120,
    width: 48,
    thicknessOptions: [0.375, 0.75, 1.5],
    colorOptions: ["clear", "white", "black"]
  },
  "Acrylic": {
    outdoor: true,
    durability: 4,
    code: "acr",
    length: 96,
    width: 48,
    thicknessUnit: "in",
    thicknessOptions: [0.25, 0.375, 0.5, 0.75, 1, 1.5],
    colorOptions: ["clear"]
},
  "Aluminum": {
    outdoor: true,
    durability: 16,
    code: "alm",
    length: 120,
    width: 48,
    thicknessUnit: "mm",
    thicknessOptions: [0.4, 0.63],
    colorOptions: ["silver", "gold", "black", "white"]
},
 "Steel": {
    outdoor: true,
    durability: 20,
    code: "stl",
    length: 120,
    width: 48,
    thicknessUnit: "mm",
    thicknessOptions: [0.4, 0.63],
    colorOptions: ["silver", "gold", "black", "white"]
},
  "Wood": {
    outdoor: false,
    code: "wd",
    durability: 20,
    length: 96,
    width: 48,
    thicknessUnit: "in",
    thicknessOptions: [0.25, 0.5, 1, 1.5],
    colorOptions: ["pine", "oak", "maple"]
},
  "MDO": {
    outdoor: true,
    durability: 1,
    code: "mdo",
    length: 96,
    width: 48,
    thicknessUnit: "in",
    thicknessOptions: [0.5, 1, 1.5],
    colorOptions: ["brown", "natural"],
},
"DIBOND": {
    outdoor: true,
    durability: 16,
    code: "dibo",
    length: 96,
    width: 48,
    thicknessUnit: "mm",
    thicknessOptions: [3, 4, 6, 10],
    colorOptions: ["silver", "gold", "black", "white"]
},
"FoamCore": {
    outdoor: true,
    durability: 16,
    code: "fcor",
    length: 96,
    width: 48,
    thicknessUnit: "in",
    thicknessOptions: [0.25, 4, 6, 10],
    colorOptions: ["silver", "gold", "black", "white"]
},
"Corroplast": {
    outdoor: true,
    durability: 3,
    code: "cor",
    length: 96,
    width: 48,
    thicknessUnit: "mm",
    thicknessOptions: [4, 6],
    colorOptions: ["silver", "gold", "black", "white"],
},
"Application": {
    illum: {"Polycarbonate": true, "Acrylic": true, "PVC": false, "Aluminum": false, "Steel": false, "Wood": false, "MDO": false, "DIBOND": false, "FoamCore": false, "Corroplast": false},
    back_illum: {"PVC": true, "Aluminum": true, "Steel": true, "Wood": false, "MDO": false, "DIBOND": true, "FoamCore": true, "Corroplast": false,},
    ext_printed: {"PVC": true, "Aluminum": true, "Steel": true, "Wood": false, "MDO": true, "DIBOND": true, "FoamCore": true, "Corroplast": true},
    int_printed: {"PVC": true, "Aluminum": true, "Steel": true, "Wood": true, "MDO": true, "DIBOND": true, "FoamCore": true, "Corroplast": true, "Polycarbonate": true, "Acrylic": true},
    ext_cutltr: {"PVC": true, "Aluminum": true, "Steel": true, "Wood": false, "MDO": false, "DIBOND": true, "FoamCore": true, "Corroplast": false},
    int_cutltr: {"PVC": true, "Aluminum": true, "Steel": true, "Wood": true, "MDO": true, "DIBOND": true, "FoamCore": true, "Corroplast": true}
}
};
