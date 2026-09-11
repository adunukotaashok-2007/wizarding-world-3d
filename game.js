import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

/* =========================================================
   BASIC SETUP
   ========================================================= */

const container = document.getElementById("game");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x8ea0b5);

scene.fog = new THREE.Fog(
  0x8ea0b5,
  90,
  330
);


/* =========================================================
   CAMERA
   ========================================================= */

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  600
);

camera.position.set(0, 5, 78);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio || 1, 1.75)
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.05;

container.appendChild(renderer.domElement);


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

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -180;
sun.shadow.camera.right = 180;
sun.shadow.camera.top = 180;
sun.shadow.camera.bottom = -180;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 400;

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
  material(0x59616b, 0.9);

const darkStoneMat =
  material(0x303841, 0.95);

const roofMat =
  material(0x202832, 0.9);

const woodMat =
  material(0x4b2f20, 0.85);

const woodDarkMat =
  material(0x281812, 0.9);

const grassMat =
  material(0x40583c, 1);

const pathMat =
  material(0x77786f, 1);

const goldMat =
  new THREE.MeshStandardMaterial({
    color: 0xd8b45d,
    emissive: 0x4a350c,
    emissiveIntensity: 0.35,
    roughness: 0.45
  });


/* =========================================================
   COLLISION SYSTEM
   ========================================================= */

const collisionBoxes = [];
const treeColliders = [];

const playerRadius = 0.7;


/* =========================================================
   COLLISION BOX
   ========================================================= */

function addCollisionBox(
  x,
  z,
  width,
  depth
) {
  collisionBoxes.push({
    minX: x - width / 2,
    maxX: x + width / 2,
    minZ: z - depth / 2,
    maxZ: z + depth / 2
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

  mesh.castShadow = true;
  mesh.receiveShadow = true;

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

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  return mesh;
}


/* =========================================================
   TOWER ROOF
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

  mesh.castShadow = true;

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

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   MAIN CASTLE
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

  /*
   * Front section.
   * Entrance opening remains usable.
   */

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

  /*
   * Decorative doors.
   * They do not block the player.
   */

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

  plaza.receiveShadow = true;

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

  path.receiveShadow = true;

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

  leaves.castShadow = true;
  leaves.receiveShadow = true;

  scene.add(leaves);

  treeColliders.push({
    x,
    z,
    r: 2.2 * scale
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

marker.position.y = 0.2;

questMarker.add(marker);

const markerLight =
  new THREE.PointLight(
    0xffc857,
    2,
    10
  );

markerLight.position.y = 1;

questMarker.add(markerLight);

questMarker.position.set(
  0,
  0,
  -18
);

scene.add(questMarker);


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

    player = gltf.scene;

    player.position.set(
      0,
      0,
      70
    );

    player.scale.setScalar(1);

    player.traverse(
      (object) => {

        if (object.isMesh) {

          object.castShadow = true;
          object.receiveShadow = true;
        }

        if (object.isBone) {

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

    scene.add(player);

    applyStandingPose();

    createWand();

    document.getElementById(
      "loading"
    ).style.display =
      "none";
  },

  (progress) => {

    if (progress.total) {

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

  rightHand.add(wand);
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

  if (!bone || !original)
    return;

  bone.rotation.set(
    original.x + x,
    original.y + y,
    original.z + z
  );
}


function resetAnimatedBones() {

  for (
    const name in originalRotations
  ) {

    const bone =
      playerBones[name];

    const rotation =
      originalRotations[name];

    if (bone && rotation) {

      bone.rotation.copy(
        rotation
      );
    }
  }
}


/* =========================================================
   STANDING / IDLE BASE POSE
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
   IMPROVED IDLE
   ========================================================= */

function applyIdleAnimation(
  time
) {

  applyStandingPose();

  /*
   * Breathing
   */

  const breathing =
    Math.sin(time * 1.7) *
    0.025;

  setBoneOffset(
    "Spine",
    breathing,
    0,
    Math.sin(time * 1.3) *
      0.018
  );


  /*
   * Small head movement
   */

  setBoneOffset(
    "Head",
    Math.sin(time * 1.1) *
      0.018,
    Math.sin(time * 0.8) *
      0.035,
    0
  );


  /*
   * Small shoulder movement
   */

  setBoneOffset(
    "LeftShoulder",
    0,
    0,
    0.05 +
      Math.sin(time * 1.7) *
      0.015
  );

  setBoneOffset(
    "RightShoulder",
    0,
    0,
    -0.05 -
      Math.sin(time * 1.7) *
      0.015
  );
}


/* =========================================================
   IMPROVED WALK / RUN
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
    Math.min(amount, 1);


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


  /*
   * Legs
   */

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


  /*
   * Arms
   */

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


  /*
   * Body bounce
   */

  setBoneOffset(
    "Spine",
    0,
    0,
    Math.sin(
      time *
      animationSpeed *
      2
    ) *
    (running ? 0.035 : 0.02)
  );


  /*
   * Head movement
   */

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
   JUMP ANIMATION
   ========================================================= */

function applyJumpAnimation() {

  applyStandingPose();

  /*
   * Slightly bend legs
   */

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


  /*
   * Arms lift naturally
   */

  setBoneOffset(
    "LeftArm",
    Math.PI / 2 - 0.25
  );

  setBoneOffset(
    "RightArm",
    Math.PI / 2 + 0.25
  );


  /*
   * Slight body lean
   */

  setBoneOffset(
    "Spine",
    -0.08,
    0,
    0
  );
}


/* =========================================================
   SPELL CASTING ANIMATION
   ========================================================= */

function applyCastingAnimation(
  time
) {

  applyStandingPose();

  /*
   * Right arm raises wand
   */

  setBoneOffset(
    "RightArm",
    Math.PI / 2 - 0.95
  );

  setBoneOffset(
    "RightForeArm",
    -0.45
  );


  /*
   * Left arm balances body
   */

  setBoneOffset(
    "LeftArm",
    Math.PI / 2 + 0.12
  );


  /*
   * Small casting movement
   */

  setBoneOffset(
    "RightArm",
    Math.PI / 2 -
      0.95 +
      Math.sin(time * 18) *
      0.06
  );


  /*
   * Body leans forward
   */

  setBoneOffset(
    "Spine",
    -0.08,
    0,
    0
  );


  /*
   * Head follows wand
   */

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


/*
 * Step 2:
 * walking + running
 */

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

    cameraDragging = true;

    lastPointerX =
      event.clientX;

    lastPointerY =
      event.clientY;
  }
);


renderer.domElement.addEventListener(
  "pointermove",
  (event) => {

    if (!cameraDragging)
      return;

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

    cameraDragging = false;
  }
);


renderer.domElement.addEventListener(
  "pointercancel",
  () => {

    cameraDragging = false;
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

let joystickActive = false;

let joystickPointerId = null;


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

    joystickActive = true;

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

  joystickActive = false;

  joystickPointerId = null;

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

document.getElementById(
  "jumpBtn"
).addEventListener(
  "pointerdown",
  (event) => {

    event.preventDefault();

    if (
      player &&
      grounded
    ) {

      velocityY =
        jumpPower;

      grounded = false;
    }
  }
);


/* =========================================================
   SPELL SYSTEM
   ========================================================= */

let casting = false;

let castTimer = 0;

const castDuration = 0.65;

let spellCooldown = 0;

const projectiles = [];


/*
 * Last movement direction.
 * This is used for spell direction.
 */

const lastMoveDirection =
  new THREE.Vector3(
    0,
    0,
    1
  );


document.getElementById(
  "spellBtn"
).addEventListener(
  "pointerdown",
  (event) => {

    event.preventDefault();

    castSpell();
  }
);


/* =========================================================
   CAST SPELL
   ========================================================= */

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


  /*
   * Use the player's last
   * actual movement direction.
   *
   * This avoids guessing the
   * GLB forward axis.
   */

  const forward =
    lastMoveDirection.clone();

  forward.y = 0;

  if (
    forward.lengthSq() <
    0.001
  ) {

    forward.set(
      Math.sin(player.rotation.y),
      0,
      Math.cos(player.rotation.y)
    );
  }

  forward.normalize();


  /* =====================================================
     PROJECTILE
     ===================================================== */

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


  /*
   * Spawn from wand hand.
   */

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


  /*
   * Projectile velocity
   */

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
   COLLISION CHECK
   ========================================================= */

function canMoveTo(
  x,
  z
) {

  /*
   * Castle collision
   */

  for (
    const box of collisionBoxes
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


  /*
   * Tree collision
   */

  for (
    const tree of treeColliders
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


  /*
   * Keyboard
   */

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


  /*
   * Camera-relative forward
   */

  const cameraForward =
    new THREE.Vector3(
      -Math.sin(cameraYaw),
      0,
      -Math.cos(cameraYaw)
    );


  const cameraRight =
    new THREE.Vector3(
      Math.cos(cameraYaw),
      0,
      -Math.sin(cameraYaw)
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


    /*
     * Save actual movement
     * direction for spells.
     */

    lastMoveDirection.copy(
      direction
    );


    /*
     * Walk / Run
     */

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
          currentSpeed * delta
        );


    const newX =
      player.position.x +
      movement.x;

    const newZ =
      player.position.z +
      movement.z;


    /*
     * X collision
     */

    if (
      canMoveTo(
        newX,
        player.position.z
      )
    ) {

      player.position.x =
        newX;
    }


    /*
     * Z collision
     */

    if (
      canMoveTo(
        player.position.x,
        newZ
      )
    ) {

      player.position.z =
        newZ;
    }


    /*
     * Rotate Aren
     */

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


  /*
   * World limits
   */

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


  /* =====================================================
     GRAVITY
     ===================================================== */

  velocityY +=
    gravity * delta;

  player.position.y +=
    velocityY * delta;


  if (
    player.position.y <= 0
  ) {

    player.position.y = 0;

    velocityY = 0;

    grounded = true;
  }


  /* =====================================================
     ANIMATION STATE
     ===================================================== */

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


  /* =====================================================
     CASTING TIMER
     ===================================================== */

  if (casting) {

    castTimer -=
      delta;

    if (
      castTimer <= 0
    ) {

      casting = false;
    }
  }


  /*
   * Spell cooldown
   */

  if (
    spellCooldown > 0
  ) {

    spellCooldown -=
      delta;
  }
}


/* =========================================================
   CAMERA UPDATE
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
    Math.cos(cameraPitch);


  const desiredPosition =
    new THREE.Vector3(

      target.x +
      Math.sin(cameraYaw) *
      horizontalDistance,

      target.y +
      Math.sin(cameraPitch) *
      cameraDistance,

      target.z +
      Math.cos(cameraYaw) *
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
   QUEST
   ========================================================= */

let questStage = 0;

let questCompleted = false;

const questElement =
  document.getElementById(
    "quest"
  );

const messageElement =
  document.getElementById(
    "message"
  );


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


function updateQuest() {

  if (
    !player ||
    questCompleted
  ) {
    return;
  }


  const dx =
    player.position.x;

  const dz =
    player.position.z + 18;


  const distance =
    Math.sqrt(
      dx * dx +
      dz * dz
    );


  if (
    questStage === 0 &&
    distance < 6
  ) {

    questStage = 1;

    questCompleted = true;


    questElement.textContent =
      "Quest Complete: Reach the academy gate";


    showMessage(
      "Welcome to Aetheria Academy!"
    );


    questMarker.visible =
      false;
  }
}


/* =========================================================
   QUEST MARKER UPDATE
   ========================================================= */

function updateQuestMarker(
  elapsed
) {

  if (
    !questMarker.visible
  ) {
    return;
  }


  questMarker.position.y =
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
   MAIN GAME LOOP
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


  updatePlayer(
    delta,
    elapsed
  );

  updateCamera(
    delta
  );

  updateProjectiles(
    delta
  );

  updateQuest();

  updateQuestMarker(
    elapsed
  );


  renderer.render(
    scene,
    camera
  );
}


animate();
