import * as THREE from "three";
import {
  GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";

import {
  DRACOLoader
} from "three/addons/loaders/DRACOLoader.js";


/* =========================================================
   BASIC SETUP
   ========================================================= */

const container =
  document.getElementById("game");

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(0x8ea0b5);

scene.fog =
  new THREE.Fog(
    0x8ea0b5,
    90,
    330
);


/* =========================================================
   CAMERA
   ========================================================= */

const camera =
  new THREE.PerspectiveCamera(
    60,
    window.innerWidth /
      window.innerHeight,
    0.1,
    600
  );

camera.position.set(
  0,
  5,
  78
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
  new THREE.WebGLRenderer({
    antialias: true,
    powerPreference:
      "high-performance"
  });

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio || 1,
    1.75
  )
);

renderer.shadowMap.enabled =
  true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
  1.05;

container.appendChild(
  renderer.domElement
);


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight =
  new THREE.HemisphereLight(
    0xbfd3e8,
    0x39412f,
    2.0
  );

scene.add(hemiLight);


const sun =
  new THREE.DirectionalLight(
    0xfff4df,
    3.2
  );

sun.position.set(
  80,
  130,
  60
);

sun.castShadow =
  true;

sun.shadow.mapSize.width =
  2048;

sun.shadow.mapSize.height =
  2048;

sun.shadow.camera.left =
  -180;

sun.shadow.camera.right =
  180;

sun.shadow.camera.top =
  180;

sun.shadow.camera.bottom =
  -180;

sun.shadow.camera.near =
  1;

sun.shadow.camera.far =
  400;

scene.add(sun);


/* =========================================================
   MATERIALS
   ========================================================= */

function material(
  color,
  roughness = 0.8,
  metalness = 0
) {

  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness
  });
}


const stoneMat =
  material(
    0x59616b,
    0.9
  );

const darkStoneMat =
  material(
    0x303841,
    0.95
  );

const roofMat =
  material(
    0x202832,
    0.9
  );

const woodMat =
  material(
    0x4b2f20,
    0.85
  );

const woodDarkMat =
  material(
    0x281812,
    0.9
  );

const grassMat =
  material(
    0x40583c,
    1
  );

const pathMat =
  material(
    0x77786f,
    1
  );


const goldMat =
  new THREE.MeshStandardMaterial({
    color: 0xd8b45d,
    emissive: 0x4a350c,
    emissiveIntensity: 0.35,
    roughness: 0.45
  });


/* =========================================================
   COLLISION
   ========================================================= */

const collisionBoxes = [];

const treeColliders = [];

const playerRadius = 0.7;


function addCollisionBox(
  x,
  z,
  width,
  depth
) {

  collisionBoxes.push({

    minX:
      x - width / 2,

    maxX:
      x + width / 2,

    minZ:
      z - depth / 2,

    maxZ:
      z + depth / 2

  });
}


/* =========================================================
   BOX
   ========================================================= */

function box(
  width,
  height,
  depth,
  x,
  y,
  z,
  mat = stoneMat,
  collision = false
) {

  const geometry =
    new THREE.BoxGeometry(
      width,
      height,
      depth
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      mat
    );

  mesh.position.set(
    x,
    y,
    z
  );

  mesh.castShadow =
    true;

  mesh.receiveShadow =
    true;

  scene.add(mesh);


  if (collision) {

    addCollisionBox(
      x,
      z,
      width,
      depth
    );
  }


  return mesh;
}


/* =========================================================
   CYLINDER
   ========================================================= */

function cylinder(
  radius,
  height,
  x,
  y,
  z,
  mat = stoneMat,
  segments = 24
) {

  const geometry =
    new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      segments
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      mat
    );

  mesh.position.set(
    x,
    y,
    z
  );

  mesh.castShadow =
    true;

  mesh.receiveShadow =
    true;

  scene.add(mesh);

  return mesh;
}


/* =========================================================
   ROOF
   ========================================================= */

function towerRoof(
  radius,
  height,
  x,
  y,
  z
) {

  const geometry =
    new THREE.ConeGeometry(
      radius,
      height,
      24
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      roofMat
    );

  mesh.position.set(
    x,
    y,
    z
  );

  mesh.castShadow =
    true;

  scene.add(mesh);

  return mesh;
}


/* =========================================================
   GROUND
   ========================================================= */

const ground =
  new THREE.Mesh(
    new THREE.PlaneGeometry(
      500,
      500
    ),
    grassMat
  );

ground.rotation.x =
  -Math.PI / 2;

ground.receiveShadow =
  true;

scene.add(ground);


/* =========================================================
   CASTLE
   ========================================================= */

function createMainCastle() {

  box(
    42,
    24,
    28,
    0,
    12,
    -30,
    stoneMat,
    true
  );


  box(
    30,
    10,
    22,
    0,
    29,
    -30,
    darkStoneMat,
    true
  );


  box(
    18,
    30,
    10,
    0,
    15,
    -14,
    stoneMat,
    false
  );


  box(
    15,
    18,
    24,
    -25,
    9,
    -29,
    stoneMat,
    true
  );


  box(
    15,
    18,
    24,
    25,
    9,
    -29,
    stoneMat,
    true
  );


  box(
    14,
    6,
    25,
    0,
    20,
    -46,
    darkStoneMat,
    true
  );
}


/* =========================================================
   CENTRAL TOWER
   ========================================================= */

function createCentralTower() {

  cylinder(
    6,
    40,
    0,
    20,
    -34,
    darkStoneMat
  );

  towerRoof(
    7,
    10,
    0,
    45,
    -34
  );

  cylinder(
    3.2,
    1.5,
    0,
    40,
    -34,
    stoneMat
  );

  addCollisionBox(
    0,
    -34,
    12,
    12
  );
}


/* =========================================================
   OUTER TOWERS
   ========================================================= */

function createTower(
  x,
  z
) {

  cylinder(
    5,
    32,
    x,
    16,
    z,
    stoneMat
  );

  towerRoof(
    6,
    8,
    x,
    36,
    z
  );

  cylinder(
    3.8,
    2,
    x,
    30,
    z,
    darkStoneMat
  );

  addCollisionBox(
    x,
    z,
    10,
    10
  );
}


/* =========================================================
   FRONT WALLS
   ========================================================= */

function createFrontWalls() {

  box(
    25,
    15,
    5,
    -28,
    7.5,
    -13,
    stoneMat,
    true
  );

  box(
    25,
    15,
    5,
    28,
    7.5,
    -13,
    stoneMat,
    true
  );

  box(
    12,
    13,
    5,
    0,
    21,
    -13,
    stoneMat,
    true
  );
}


/* =========================================================
   MAIN GATE
   ========================================================= */

function createMainGate() {

  box(
    3,
    14,
    6,
    -7,
    7,
    -16,
    darkStoneMat,
    true
  );

  box(
    3,
    14,
    6,
    7,
    7,
    -16,
    darkStoneMat,
    true
  );

  box(
    17,
    3,
    6,
    0,
    14,
    -16,
    darkStoneMat,
    true
  );


  box(
    4.7,
    11,
    0.8,
    -2.35,
    5.5,
    -18,
    woodDarkMat,
    false
  );

  box(
    4.7,
    11,
    0.8,
    2.35,
    5.5,
    -18,
    woodDarkMat,
    false
  );


  box(
    0.7,
    0.7,
    1.2,
    -4.5,
    5.5,
    -18.7,
    goldMat
  );

  box(
    0.7,
    0.7,
    1.2,
    4.5,
    5.5,
    -18.7,
    goldMat
  );
}


/* =========================================================
   COURTYARD
   ========================================================= */

function createCourtyard() {

  box(
    65,
    0.3,
    55,
    0,
    0.12,
    18,
    pathMat
  );


  const plaza =
    new THREE.Mesh(
      new THREE.CircleGeometry(
        10,
        48
      ),
      stoneMat
    );

  plaza.rotation.x =
    -Math.PI / 2;

  plaza.position.set(
    0,
    0.35,
    8
  );

  plaza.receiveShadow =
    true;

  scene.add(plaza);
}


/* =========================================================
   FOUNTAIN
   ========================================================= */

function createFountain() {

  cylinder(
    7,
    0.8,
    0,
    0.8,
    8,
    darkStoneMat,
    48
  );

  cylinder(
    5.5,
    0.8,
    0,
    1.3,
    8,
    stoneMat,
    48
  );

  cylinder(
    1.5,
    4,
    0,
    3.2,
    8,
    stoneMat,
    32
  );


  const water =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        5.2,
        5.2,
        0.15,
        48
      ),

      new THREE.MeshStandardMaterial({
        color: 0x5d8ca0,
        transparent: true,
        opacity: 0.75,
        roughness: 0.2
      })
    );

  water.position.set(
    0,
    1.8,
    8
  );

  scene.add(water);
}


/* =========================================================
   PATH
   ========================================================= */

function createPath() {

  const path =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        12,
        75
      ),
      pathMat
    );

  path.rotation.x =
    -Math.PI / 2;

  path.position.set(
    0,
    0.03,
    43
  );

  path.receiveShadow =
    true;

  scene.add(path);


  for (
    let z = 12;
    z < 80;
    z += 5
  ) {

    box(
      10,
      0.15,
      3.5,
      0,
      0.12,
      z,
      stoneMat
    );
  }
}


/* =========================================================
   TORCH
   ========================================================= */

function createTorch(
  x,
  z
) {

  cylinder(
    0.15,
    3,
    x,
    2,
    z,
    woodDarkMat,
    12
  );


  const flame =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.45,
        12,
        10
      ),

      new THREE.MeshStandardMaterial({
        color: 0xffb347,
        emissive: 0xff6600,
        emissiveIntensity: 2
      })
    );


  flame.position.set(
    x,
    3.8,
    z
  );

  scene.add(flame);


  const light =
    new THREE.PointLight(
      0xff9b45,
      1.7,
      12
    );

  light.position.set(
    x,
    3.5,
    z
  );

  scene.add(light);
}


/* =========================================================
   TREE
   ========================================================= */

function createTree(
  x,
  z,
  scale = 1
) {

  cylinder(
    0.7 * scale,
    5 * scale,
    x,
    2.5 * scale,
    z,
    woodMat,
    10
  );


  const leaves =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        3.5 * scale,
        12,
        10
      ),

      new THREE.MeshStandardMaterial({
        color: 0x28482e,
        roughness: 1
      })
    );


  leaves.position.set(
    x,
    7 * scale,
    z
  );

  leaves.castShadow =
    true;

  leaves.receiveShadow =
    true;

  scene.add(leaves);


  treeColliders.push({

    x,

    z,

    r:
      2.2 * scale

  });
}


/* =========================================================
   BUILD WORLD
   ========================================================= */

createMainCastle();

createCentralTower();

createTower(-35, -22);
createTower(35, -22);

createTower(-35, 34);
createTower(35, 34);

createFrontWalls();

createMainGate();

createCourtyard();

createFountain();

createPath();


/* =========================================================
   TORCHES
   ========================================================= */

createTorch(-8, -19);
createTorch(8, -19);

createTorch(-15, 5);
createTorch(15, 5);

createTorch(-15, 30);
createTorch(15, 30);


/* =========================================================
   TREES
   ========================================================= */

const treePositions = [

  [-60, 5, 1.4],
  [-70, 30, 1.2],
  [-55, 55, 1.5],

  [60, 5, 1.4],
  [70, 30, 1.2],
  [55, 55, 1.5],

  [-85, -20, 1.5],
  [85, -20, 1.5],

  [-90, 60, 1.6],
  [90, 60, 1.6],

  [-45, 80, 1.2],
  [45, 80, 1.2]

];


for (
  const [x, z, scale]
  of treePositions
) {

  createTree(
    x,
    z,
    scale
  );
}


/* =========================================================
   QUEST MARKER
   ========================================================= */

const questMarker =
  new THREE.Group();


const marker =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.7,
      0.7,
      0.15,
      24
    ),
    goldMat
  );

marker.position.y =
  0.2;

questMarker.add(marker);


const markerLight =
  new THREE.PointLight(
    0xffc857,
    2,
    10
  );

markerLight.position.y =
  1;

questMarker.add(
  markerLight
);


/*
 * NPC location
 */

const npcPosition =
  new THREE.Vector3(
    0,
    0,
    -5
  );


questMarker.position.copy(
  npcPosition
);

scene.add(
  questMarker
);


/* =========================================================
   NPC
   ========================================================= */

let npc = null;

let npcHead = null;

let npcBody = null;


function createNPC() {

  npc =
    new THREE.Group();


  /*
   * Robe
   */

  const robe =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.85,
        1.15,
        2.8,
        16
      ),

      new THREE.MeshStandardMaterial({
        color: 0x26334d,
        roughness: 0.9
      })
    );

  robe.position.y =
    1.4;

  robe.castShadow =
    true;

  npc.add(robe);

  npcBody = robe;


  /*
   * Head
   */

  npcHead =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.48,
        20,
        16
      ),

      new THREE.MeshStandardMaterial({
        color: 0xb88968,
        roughness: 0.8
      })
    );

  npcHead.position.y =
    3.35;

  npcHead.castShadow =
    true;

  npc.add(npcHead);


  /*
   * Hat
   */

  const hat =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        0.7,
        1.15,
        20
      ),

      new THREE.MeshStandardMaterial({
        color: 0x171c2b,
        roughness: 0.85
      })
    );

  hat.position.y =
    4.15;

  hat.castShadow =
    true;

  npc.add(hat);


  /*
   * Left arm
   */

  const leftArm =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.18,
        1.2,
        6,
        10
      ),

      new THREE.MeshStandardMaterial({
        color: 0x26334d,
        roughness: 0.9
      })
    );

  leftArm.position.set(
    -0.85,
    1.8,
    0
  );

  leftArm.rotation.z =
    -0.35;

  leftArm.castShadow =
    true;

  npc.add(leftArm);


  /*
   * Right arm
   */

  const rightArm =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.18,
        1.2,
        6,
        10
      ),

      new THREE.MeshStandardMaterial({
        color: 0x26334d,
        roughness: 0.9
      })
    );

  rightArm.position.set(
    0.85,
    1.8,
    0
  );

  rightArm.rotation.z =
    0.35;

  rightArm.castShadow =
    true;

  npc.add(rightArm);


  /*
   * Staff
   */

  const staff =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.055,
        0.08,
        2.8,
        10
      ),

      new THREE.MeshStandardMaterial({
        color: 0x3a2113,
        roughness: 0.8
      })
    );

  staff.position.set(
    1.0,
    1.45,
    0.15
  );

  staff.rotation.z =
    -0.05;

  staff.castShadow =
    true;

  npc.add(staff);


  npc.position.copy(
    npcPosition
  );


  scene.add(npc);
}


createNPC();


/* =========================================================
   PLAYER
   ========================================================= */

let player = null;

const playerBones = {};

const originalRotations = {};

let rightHand = null;


const loader =
  new GLTFLoader();


const dracoLoader =
  new DRACOLoader();


dracoLoader.setDecoderPath(
  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/"
);


loader.setDRACOLoader(
  dracoLoader
);


loader.load(

  "./assets/player/aren_valen.glb",

  (gltf) => {

    player =
      gltf.scene;


    player.position.set(
      0,
      0,
      70
    );


    player.scale.setScalar(
      1
    );


    player.traverse(
      (object) => {

        if (
          object.isMesh
        ) {

          object.castShadow =
            true;

          object.receiveShadow =
            true;
        }


        if (
          object.isBone
        ) {

          playerBones[
            object.name
          ] = object;


          originalRotations[
            object.name
          ] =
            object.rotation.clone();


          if (
            object.name ===
            "RightHand"
          ) {

            rightHand =
              object;
          }
        }

      }
    );


    scene.add(
      player
    );


    applyStandingPose();

    createWand();


    const loading =
      document.getElementById(
        "loading"
      );

    if (loading) {

      loading.style.display =
        "none";
    }

  },


  (progress) => {

    if (
      progress.total
    ) {

      const percent =
        Math.round(
          progress.loaded /
          progress.total *
          100
        );


      const bar =
        document.querySelector(
          ".loading-progress"
        );


      if (bar) {

        bar.style.width =
          percent + "%";
      }
    }

  },


  (error) => {

    console.error(
      "PLAYER LOAD ERROR:",
      error
    );
  }

);


/* =========================================================
   WAND
   ========================================================= */

function createWand() {

  if (!rightHand)
    return;


  const wand =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.045,
        0.07,
        1.6,
        8
      ),

      new THREE.MeshStandardMaterial({
        color: 0x1b1008,
        roughness: 0.7
      })
    );


  wand.rotation.z =
    Math.PI / 2;


  wand.position.set(
    0.3,
    0,
    0
  );


  rightHand.add(
    wand
  );
}


/* =========================================================
   ANIMATION HELPERS
   ========================================================= */

function setBoneOffset(
  name,
  x = 0,
  y = 0,
  z = 0
) {

  const bone =
    playerBones[name];

  const original =
    originalRotations[name];


  if (
    !bone ||
    !original
  ) {
    return;
  }


  bone.rotation.set(
    original.x + x,
    original.y + y,
    original.z + z
  );
}


function resetAnimatedBones() {

  for (
    const name in
    originalRotations
  ) {

    const bone =
      playerBones[name];

    const rotation =
      originalRotations[name];


    if (
      bone &&
      rotation
    ) {

      bone.rotation.copy(
        rotation
      );
    }
  }
}


/* =========================================================
   STANDING POSE
   ========================================================= */

function applyStandingPose() {

  if (!player)
    return;


  resetAnimatedBones();


  setBoneOffset(
    "LeftArm",
    Math.PI / 2,
    0,
    0
  );


  setBoneOffset(
    "RightArm",
    Math.PI / 2,
    0,
    0
  );


  setBoneOffset(
    "LeftForeArm",
    0.12,
    0,
    0
  );


  setBoneOffset(
    "RightForeArm",
    0.12,
    0,
    0
  );


  setBoneOffset(
    "LeftShoulder",
    0,
    0,
    0.05
  );


  setBoneOffset(
    "RightShoulder",
    0,
    0,
    -0.05
  );
}


/* =========================================================
   IDLE
   ========================================================= */

function applyIdleAnimation(
  time
) {

  applyStandingPose();


  const breathing =
    Math.sin(
      time * 1.7
    ) * 0.025;


  setBoneOffset(
    "Spine",
    breathing,
    0,
    Math.sin(
      time * 1.3
    ) * 0.018
  );


  setBoneOffset(
    "Head",
    Math.sin(
      time * 1.1
    ) * 0.018,
    Math.sin(
      time * 0.8
    ) * 0.035,
    0
  );


  setBoneOffset(
    "LeftShoulder",
    0,
    0,
    0.05 +
      Math.sin(
        time * 1.7
      ) * 0.015
  );


  setBoneOffset(
    "RightShoulder",
    0,
    0,
    -0.05 -
      Math.sin(
        time * 1.7
      ) * 0.015
  );
}


/* =========================================================
   WALK / RUN
   ========================================================= */

function applyWalkingAnimation(
  time,
  amount
) {

  applyStandingPose();


  const running =
    amount > 0.75;


  const animationSpeed =
    running ? 13 : 9;


  const legAmount =
    running ? 0.65 : 0.42;


  const armAmount =
    running ? 0.38 : 0.25;


  const intensity =
    Math.min(
      amount,
      1
    );


  const legSwing =
    Math.sin(
      time * animationSpeed
    ) *
    legAmount *
    intensity;


  const armSwing =
    Math.sin(
      time * animationSpeed
    ) *
    armAmount *
    intensity;


  setBoneOffset(
    "LeftUpLeg",
    legSwing
  );


  setBoneOffset(
    "RightUpLeg",
    -legSwing
  );


  setBoneOffset(
    "LeftLeg",
    -legSwing * 0.55
  );


  setBoneOffset(
    "RightLeg",
    legSwing * 0.55
  );


  setBoneOffset(
    "LeftArm",
    Math.PI / 2 +
      armSwing
  );


  setBoneOffset(
    "RightArm",
    Math.PI / 2 -
      armSwing
  );


  setBoneOffset(
    "Spine",
    0,
    0,
    Math.sin(
      time *
      animationSpeed *
      2
    ) *
    (
      running
        ? 0.035
        : 0.02
    )
  );


  setBoneOffset(
    "Head",
    Math.sin(
      time *
      animationSpeed
    ) * 0.018,
    0,
    0
  );
}


/* =========================================================
   JUMP
   ========================================================= */

function applyJumpAnimation() {

  applyStandingPose();


  setBoneOffset(
    "LeftUpLeg",
    -0.28
  );

  setBoneOffset(
    "RightUpLeg",
    -0.28
  );


  setBoneOffset(
    "LeftLeg",
    0.25
  );

  setBoneOffset(
    "RightLeg",
    0.25
  );


  setBoneOffset(
    "LeftArm",
    Math.PI / 2 - 0.25
  );


  setBoneOffset(
    "RightArm",
    Math.PI / 2 + 0.25
  );


  setBoneOffset(
    "Spine",
    -0.08,
    0,
    0
  );
}


/* =========================================================
   CASTING
   ========================================================= */

function applyCastingAnimation(
  time
) {

  applyStandingPose();


  setBoneOffset(
    "RightArm",
    Math.PI / 2 -
      0.95
  );


  setBoneOffset(
    "RightForeArm",
    -0.45
  );


  setBoneOffset(
    "LeftArm",
    Math.PI / 2 +
      0.12
  );


  setBoneOffset(
    "RightArm",
    Math.PI / 2 -
      0.95 +
      Math.sin(
        time * 18
      ) * 0.06
  );


  setBoneOffset(
    "Spine",
    -0.08,
    0,
    0
  );


  setBoneOffset(
    "Head",
    -0.08,
    0,
    0
  );
}


/* =========================================================
   MOVEMENT
   ========================================================= */

const keys = {};


window.addEventListener(
  "keydown",
  (event) => {

    keys[
      event.key.toLowerCase()
    ] = true;
  }
);


window.addEventListener(
  "keyup",
  (event) => {

    keys[
      event.key.toLowerCase()
    ] = false;
  }
);


let joystickX = 0;

let joystickY = 0;

let velocityY = 0;

let grounded = true;


const walkSpeed = 5.5;

const runSpeed = 9.0;

const gravity = -20;

const jumpPower = 8;


/* =========================================================
   CAMERA
   ========================================================= */

let cameraYaw = 0;

let cameraPitch = 0.25;

const cameraDistance = 8;

const cameraHeight = 3.5;

let cameraDragging = false;

let lastPointerX = 0;

let lastPointerY = 0;


renderer.domElement.addEventListener(
  "pointerdown",
  (event) => {

    if (
      event.target !==
      renderer.domElement
    ) {

      return;
    }


    cameraDragging =
      true;


    lastPointerX =
      event.clientX;

    lastPointerY =
      event.clientY;
  }
);


renderer.domElement.addEventListener(
  "pointermove",
  (event) => {

    if (
      !cameraDragging
    ) {

      return;
    }


    const dx =
      event.clientX -
      lastPointerX;


    const dy =
      event.clientY -
      lastPointerY;


    lastPointerX =
      event.clientX;


    lastPointerY =
      event.clientY;


    cameraYaw -=
      dx * 0.006;


    cameraPitch -=
      dy * 0.004;


    cameraPitch =
      THREE.MathUtils.clamp(
        cameraPitch,
        -0.15,
        0.75
      );
  }
);


renderer.domElement.addEventListener(
  "pointerup",
  () => {

    cameraDragging =
      false;
  }
);


renderer.domElement.addEventListener(
  "pointercancel",
  () => {

    cameraDragging =
      false;
  }
);


/* =========================================================
   JOYSTICK
   ========================================================= */

const joystickBase =
  document.getElementById(
    "joystickBase"
  );


const joystickStick =
  document.getElementById(
    "joystickStick"
  );


let joystickActive =
  false;

let joystickPointerId =
  null;


function updateJoystick(
  clientX,
  clientY
) {

  const rect =
    joystickBase.getBoundingClientRect();


  const centerX =
    rect.left +
    rect.width / 2;


  const centerY =
    rect.top +
    rect.height / 2;


  let dx =
    clientX - centerX;


  let dy =
    clientY - centerY;


  const maxDistance =
    rect.width * 0.34;


  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (
    distance >
    maxDistance
  ) {

    dx =
      dx / distance *
      maxDistance;


    dy =
      dy / distance *
      maxDistance;
  }


  joystickX =
    dx / maxDistance;


  joystickY =
    dy / maxDistance;


  joystickStick.style.transform =
    `translate(
      calc(-50% + ${dx}px),
      calc(-50% + ${dy}px)
    )`;
}


function resetJoystick() {

  joystickX = 0;

  joystickY = 0;


  joystickStick.style.transform =
    "translate(-50%, -50%)";
}


joystickBase.addEventListener(
  "pointerdown",
  (event) => {

    event.preventDefault();


    joystickActive =
      true;


    joystickPointerId =
      event.pointerId;


    joystickBase.setPointerCapture(
      event.pointerId
    );


    updateJoystick(
      event.clientX,
      event.clientY
    );
  }
);


joystickBase.addEventListener(
  "pointermove",
  (event) => {

    if (
      !joystickActive ||
      event.pointerId !==
      joystickPointerId
    ) {

      return;
    }


    updateJoystick(
      event.clientX,
      event.clientY
    );
  }
);


function endJoystick() {

  joystickActive =
    false;

  joystickPointerId =
    null;

  resetJoystick();
}


joystickBase.addEventListener(
  "pointerup",
  endJoystick
);


joystickBase.addEventListener(
  "pointercancel",
  endJoystick
);


/* =========================================================
   JUMP
   ========================================================= */

document
  .getElementById("jumpBtn")
  .addEventListener(
    "pointerdown",
    (event) => {

      event.preventDefault();


      if (
        player &&
        grounded
      ) {

        velocityY =
          jumpPower;

        grounded =
          false;
      }
    }
  );


/* =========================================================
   SPELL
   ========================================================= */

let casting = false;

let castTimer = 0;

const castDuration = 0.65;

let spellCooldown = 0;

const projectiles = [];


const lastMoveDirection =
  new THREE.Vector3(
    0,
    0,
    1
  );


document
  .getElementById("spellBtn")
  .addEventListener(
    "pointerdown",
    (event) => {

      event.preventDefault();

      castSpell();
    }
  );


function castSpell() {

  if (
    !player ||
    casting ||
    spellCooldown > 0
  ) {

    return;
  }


  casting = true;

  castTimer =
    castDuration;

  spellCooldown =
    0.25;


  const forward =
    lastMoveDirection.clone();


  forward.y = 0;


  if (
    forward.lengthSq() <
    0.001
  ) {

    forward.set(
      Math.sin(
        player.rotation.y
      ),
      0,
      Math.cos(
        player.rotation.y
      )
    );
  }


  forward.normalize();


  const projectile =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.16,
        12,
        12
      ),

      new THREE.MeshStandardMaterial({
        color: 0x9fdcff,
        emissive: 0x3a9cff,
        emissiveIntensity: 3
      })
    );


  const origin =
    new THREE.Vector3();


  if (rightHand) {

    rightHand.getWorldPosition(
      origin
    );

  } else {

    origin.copy(
      player.position
    );

    origin.y += 2.1;
  }


  projectile.position.copy(
    origin
  );


  projectile.position.add(
    forward.clone()
      .multiplyScalar(0.8)
  );


  projectile.userData.velocity =
    forward.clone()
      .multiplyScalar(22);


  projectile.userData.life =
    2;


  scene.add(
    projectile
  );


  projectiles.push(
    projectile
  );
}


/* =========================================================
   PROJECTILES
   ========================================================= */

function updateProjectiles(
  delta
) {

  for (
    let i =
      projectiles.length - 1;

    i >= 0;

    i--
  ) {

    const projectile =
      projectiles[i];


    projectile.position.addScaledVector(
      projectile.userData.velocity,
      delta
    );


    projectile.userData.life -=
      delta;


    if (
      projectile.userData.life <=
      0
    ) {

      scene.remove(
        projectile
      );


      projectile.geometry.dispose();

      projectile.material.dispose();


      projectiles.splice(
        i,
        1
      );
    }
  }
}


/* =========================================================
   COLLISION
   ========================================================= */

function canMoveTo(
  x,
  z
) {

  for (
    const box of
    collisionBoxes
  ) {

    const closestX =
      THREE.MathUtils.clamp(
        x,
        box.minX,
        box.maxX
      );


    const closestZ =
      THREE.MathUtils.clamp(
        z,
        box.minZ,
        box.maxZ
      );


    const dx =
      x - closestX;


    const dz =
      z - closestZ;


    const distanceSquared =
      dx * dx +
      dz * dz;


    if (
      distanceSquared <
      playerRadius *
      playerRadius
    ) {

      return false;
    }
  }


  for (
    const tree of
    treeColliders
  ) {

    const dx =
      x - tree.x;


    const dz =
      z - tree.z;


    const distance =
      Math.sqrt(
        dx * dx +
        dz * dz
      );


    if (
      distance <
      tree.r +
      playerRadius
    ) {

      return false;
    }
  }


  return true;
}


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function updatePlayer(
  delta,
  elapsed
) {

  if (!player)
    return;


  let inputX =
    joystickX;


  let inputY =
    -joystickY;


  if (
    keys["a"] ||
    keys["arrowleft"]
  ) {

    inputX -= 1;
  }


  if (
    keys["d"] ||
    keys["arrowright"]
  ) {

    inputX += 1;
  }


  if (
    keys["w"] ||
    keys["arrowup"]
  ) {

    inputY += 1;
  }


  if (
    keys["s"] ||
    keys["arrowdown"]
  ) {

    inputY -= 1;
  }


  const input =
    new THREE.Vector2(
      inputX,
      inputY
    );


  if (
    input.lengthSq() > 1
  ) {

    input.normalize();
  }


  const cameraForward =
    new THREE.Vector3(
      -Math.sin(
        cameraYaw
      ),
      0,
      -Math.cos(
        cameraYaw
      )
    );


  const cameraRight =
    new THREE.Vector3(
      Math.cos(
        cameraYaw
      ),
      0,
      -Math.sin(
        cameraYaw
      )
    );


  const direction =
    new THREE.Vector3();


  direction
    .addScaledVector(
      cameraForward,
      input.y
    )
    .addScaledVector(
      cameraRight,
      input.x
    );


  const moving =
    direction.lengthSq() >
    0.001;


  if (moving) {

    direction.normalize();


    lastMoveDirection.copy(
      direction
    );


    const inputAmount =
      Math.min(
        input.length(),
        1
      );


    const currentSpeed =
      inputAmount > 0.75
        ? runSpeed
        : walkSpeed;


    const movement =
      direction.clone()
        .multiplyScalar(
          currentSpeed *
          delta
        );


    const newX =
      player.position.x +
      movement.x;


    const newZ =
      player.position.z +
      movement.z;


    if (
      canMoveTo(
        newX,
        player.position.z
      )
    ) {

      player.position.x =
        newX;
    }


    if (
      canMoveTo(
        player.position.x,
        newZ
      )
    ) {

      player.position.z =
        newZ;
    }


    const targetRotation =
      Math.atan2(
        direction.x,
        direction.z
      );


    let rotationDifference =
      targetRotation -
      player.rotation.y;


    rotationDifference =
      Math.atan2(
        Math.sin(
          rotationDifference
        ),
        Math.cos(
          rotationDifference
        )
      );


    player.rotation.y +=
      rotationDifference *
      Math.min(
        1,
        delta * 10
      );
  }


  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -220,
      220
    );


  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -220,
      220
    );


  velocityY +=
    gravity * delta;


  player.position.y +=
    velocityY * delta;


  if (
    player.position.y <= 0
  ) {

    player.position.y =
      0;

    velocityY =
      0;

    grounded =
      true;
  }


  if (!grounded) {

    applyJumpAnimation();

  } else if (casting) {

    applyCastingAnimation(
      elapsed
    );

  } else if (moving) {

    applyWalkingAnimation(
      elapsed,
      input.length()
    );

  } else {

    applyIdleAnimation(
      elapsed
    );
  }


  if (casting) {

    castTimer -=
      delta;


    if (
      castTimer <= 0
    ) {

      casting =
        false;
    }
  }


  if (
    spellCooldown > 0
  ) {

    spellCooldown -=
      delta;
  }
}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera(
  delta
) {

  if (!player)
    return;


  const target =
    new THREE.Vector3();


  target.copy(
    player.position
  );


  target.y +=
    cameraHeight;


  const horizontalDistance =
    cameraDistance *
    Math.cos(
      cameraPitch
    );


  const desiredPosition =
    new THREE.Vector3(

      target.x +
      Math.sin(
        cameraYaw
      ) *
      horizontalDistance,

      target.y +
      Math.sin(
        cameraPitch
      ) *
      cameraDistance,

      target.z +
      Math.cos(
        cameraYaw
      ) *
      horizontalDistance

    );


  camera.position.lerp(
    desiredPosition,

    1 -
    Math.pow(
      0.001,
      delta
    )
  );


  camera.lookAt(
    target
  );
}


/* =========================================================
   QUEST + NPC SYSTEM
   ========================================================= */

let questStage = 0;

let questCompleted = false;

let dialogueOpen = false;

let dialogueIndex = 0;

let xp = 0;


const questElement =
  document.getElementById(
    "quest"
  );


const messageElement =
  document.getElementById(
    "message"
  );


const talkBtn =
  document.getElementById(
    "talkBtn"
  );


const dialogueBox =
  document.getElementById(
    "dialogueBox"
  );


const dialogueText =
  document.getElementById(
    "dialogueText"
  );


const dialogueName =
  document.getElementById(
    "dialogueName"
  );


const dialogueNext =
  document.getElementById(
    "dialogueNext"
  );


const npcName =
  document.getElementById(
    "npcName"
  );


const xpValue =
  document.getElementById(
    "xpValue"
  );


/* =========================================================
   DIALOGUE
   ========================================================= */

const dialogueLines = [

  "Welcome to Aetheria Academy, young wizard.",

  "I am the Academy Guide. Your magical journey begins here.",

  "Inside these walls you will learn spells, explore ancient places and face dangerous challenges.",

  "Complete your training and discover what lies beyond the academy.",

  "Your first lesson awaits you. Good luck, Aren."

];


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(
  text
) {

  if (!messageElement)
    return;


  messageElement.textContent =
    text;


  messageElement.style.opacity =
    "1";


  setTimeout(
    () => {

      messageElement.style.opacity =
        "0";

    },
    2500
  );
}


/* =========================================================
   XP
   ========================================================= */

function addXP(
  amount
) {

  xp += amount;


  if (xpValue) {

    xpValue.textContent =
      xp;
  }
}


/* =========================================================
   OPEN DIALOGUE
   ========================================================= */

function openDialogue() {

  if (
    !player ||
    !npc
  ) {

    return;
  }


  const distance =
    player.position.distanceTo(
      npc.position
    );


  if (
    distance > 6
  ) {

    return;
  }


  dialogueOpen =
    true;


  dialogueIndex =
    0;


  dialogueBox.classList.add(
    "visible"
  );


  dialogueName.textContent =
    "Academy Guide";


  dialogueText.textContent =
    dialogueLines[
      dialogueIndex
    ];


  /*
   * Stop movement while
   * dialogue is open.
   */

  joystickX = 0;

  joystickY = 0;

  resetJoystick();
}


/* =========================================================
   NEXT DIALOGUE
   ========================================================= */

function nextDialogue() {

  if (
    !dialogueOpen
  ) {

    return;
  }


  dialogueIndex++;


  if (
    dialogueIndex >=
    dialogueLines.length
  ) {

    closeDialogue();

    completeGuideQuest();

    return;
  }


  dialogueText.textContent =
    dialogueLines[
      dialogueIndex
    ];
}


/* =========================================================
   CLOSE DIALOGUE
   ========================================================= */

function closeDialogue() {

  dialogueOpen =
    false;


  dialogueBox.classList.remove(
    "visible"
  );
}


/* =========================================================
   COMPLETE QUEST
   ========================================================= */

function completeGuideQuest() {

  if (
    questCompleted
  ) {

    return;
  }


  questStage =
    1;


  questCompleted =
    true;


  questElement.textContent =
    "Quest Complete: Meet the Academy Guide";


  questMarker.visible =
    false;


  addXP(100);


  showMessage(
    "Quest Complete! +100 XP"
  );


  /*
   * Hide talk controls.
   */

  talkBtn.style.display =
    "none";


  npcName.style.opacity =
    "0";
}


/* =========================================================
   TALK BUTTON
   ========================================================= */

talkBtn.addEventListener(
  "pointerdown",
  (event) => {

    event.preventDefault();

    openDialogue();
  }
);


dialogueNext.addEventListener(
  "pointerdown",
  (event) => {

    event.preventDefault();

    nextDialogue();
  }
);


/* =========================================================
   NPC INTERACTION
   ========================================================= */

function updateNPCInteraction() {

  if (
    !player ||
    !npc
  ) {

    return;
  }


  /*
   * If dialogue is open,
   * hide interaction button.
   */

  if (dialogueOpen) {

    talkBtn.style.display =
      "none";

    npcName.style.opacity =
      "0";

    return;
  }


  const distance =
    player.position.distanceTo(
      npc.position
    );


  /*
   * Face NPC toward Aren
   */

  if (
    distance < 12
  ) {

    const direction =
      new THREE.Vector3()
        .subVectors(
          player.position,
          npc.position
        );


    direction.y = 0;


    if (
      direction.lengthSq() >
      0.001
    ) {

      const target =
        Math.atan2(
          direction.x,
          direction.z
        );


      npc.rotation.y =
        THREE.MathUtils.lerp(
          npc.rotation.y,
          target,
          0.08
        );
    }
  }


  /*
   * Close enough to talk.
   */

  if (
    distance < 6 &&
    !questCompleted
  ) {

    talkBtn.style.display =
      "flex";

    npcName.style.opacity =
      "1";

  } else {

    talkBtn.style.display =
      "none";

    npcName.style.opacity =
      "0";
  }
}


/* =========================================================
   QUEST MARKER
   ========================================================= */

function updateQuestMarker(
  elapsed
) {

  if (
    !questMarker.visible
  ) {

    return;
  }


  /*
   * Keep marker above NPC.
   */

  questMarker.position.y =
    4.9 +
    Math.sin(
      elapsed * 3
    ) *
    0.25;


  questMarker.rotation.y =
    elapsed * 2;


  markerLight.intensity =
    1.5 +
    Math.sin(
      elapsed * 4
    ) *
    0.5;
}


/* =========================================================
   NPC ANIMATION
   ========================================================= */

function updateNPC(
  elapsed
) {

  if (!npc)
    return;


  /*
   * Gentle breathing.
   */

  if (npcBody) {

    npcBody.scale.y =
      1 +
      Math.sin(
        elapsed * 1.5
      ) *
      0.015;
  }


  /*
   * Small head movement.
   */

  if (npcHead) {

    npcHead.rotation.y =
      Math.sin(
        elapsed * 0.8
      ) *
      0.08;

    npcHead.rotation.x =
      Math.sin(
        elapsed * 1.1
      ) *
      0.025;
  }
}


/* =========================================================
   RESIZE
   ========================================================= */

function resize() {

  camera.aspect =
    window.innerWidth /
    window.innerHeight;


  camera.updateProjectionMatrix();


  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      1.75
    )
  );
}


window.addEventListener(
  "resize",
  resize
);


window.addEventListener(
  "orientationchange",
  () => {

    setTimeout(
      resize,
      150
    );
  }
);


/* =========================================================
   MAIN LOOP
   ========================================================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );


  const elapsed =
    clock.elapsedTime;


  /*
   * Player
   */

  if (!dialogueOpen) {

    updatePlayer(
      delta,
      elapsed
    );
  }


  /*
   * Camera
   */

  updateCamera(
    delta
  );


  /*
   * Spells
   */

  updateProjectiles(
    delta
  );


  /*
   * NPC
   */

  updateNPCInteraction();

  updateNPC(
    elapsed
  );


  /*
   * Quest
   */

  updateQuestMarker(
    elapsed
  );


  renderer.render(
    scene,
    camera
  );
}


animate();
