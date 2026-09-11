/* =========================================================
   AETHERIA ACADEMY
   STEP 4 — PLAYER MOVEMENT + JUMP FIX
   =========================================================

   Includes:
   ✓ Aren GLB
   ✓ Draco loading
   ✓ Academy environment
   ✓ Castle
   ✓ Trees
   ✓ Collision
   ✓ NPC Professor Aelion
   ✓ Dialogue
   ✓ First quest
   ✓ Quest marker
   ✓ Joystick
   ✓ Jump
   ✓ Cast
   ✓ Idle animation
   ✓ Walk animation
   ✓ Run animation
   ✓ Jump animation
   ✓ Casting animation
   ✓ Camera
   ✓ Torches
   ✓ Mobile landscape support
   ✓ FIXED jump landing
   ✓ FIXED player forward direction
   ========================================================= */

import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { GLTFLoader } from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

import { DRACOLoader } from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js";


/* =========================================================
   BASIC SETUP
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x07111c);

scene.fog = new THREE.Fog(
  0x07111c,
  70,
  220
);


/* =========================================================
   CAMERA
   ========================================================= */

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(
  0,
  6,
  82
);


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
  Math.min(window.devicePixelRatio, 1.8)
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

document.body.appendChild(renderer.domElement);


/* =========================================================
   CLOCK
   ========================================================= */

const clock = new THREE.Clock();


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight =
  new THREE.HemisphereLight(
    0x9db7d8,
    0x182014,
    1.8
  );

scene.add(hemiLight);


const sun =
  new THREE.DirectionalLight(
    0xffffff,
    3.0
  );

sun.position.set(
  40,
  80,
  30
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;

scene.add(sun);


/* =========================================================
   MATERIALS
   ========================================================= */

const groundMat =
  new THREE.MeshStandardMaterial({
    color: 0x172d26,
    roughness: 0.95
  });


const stoneMat =
  new THREE.MeshStandardMaterial({
    color: 0x354258,
    roughness: 0.85
  });


const darkStoneMat =
  new THREE.MeshStandardMaterial({
    color: 0x1d2739,
    roughness: 0.9
  });


const roofMat =
  new THREE.MeshStandardMaterial({
    color: 0x101a2c,
    roughness: 0.75
  });


const woodMat =
  new THREE.MeshStandardMaterial({
    color: 0x4b2919,
    roughness: 0.8
  });


const goldMat =
  new THREE.MeshStandardMaterial({
    color: 0xc9a646,
    metalness: 0.65,
    roughness: 0.3
  });


const waterMat =
  new THREE.MeshStandardMaterial({
    color: 0x0877bb,
    metalness: 0.15,
    roughness: 0.15,
    transparent: true,
    opacity: 0.9
  });


/* =========================================================
   HELPERS
   ========================================================= */

function box(
  width,
  height,
  depth,
  x,
  y,
  z,
  material,
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
      material
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

    collisionBoxes.push({
      minX: x - width / 2,
      maxX: x + width / 2,

      minZ: z - depth / 2,
      maxZ: z + depth / 2
    });

  }

  return mesh;
}


/* =========================================================
   COLLISION
   ========================================================= */

const collisionBoxes = [];

const treeColliders = [];

const playerRadius = 0.7;


/* =========================================================
   GROUND
   ========================================================= */

const ground =
  new THREE.Mesh(
    new THREE.PlaneGeometry(
      240,
      240
    ),
    groundMat
  );

ground.rotation.x =
  -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   ACADEMY CASTLE
   ========================================================= */

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

box(
  16,
  38,
  16,
  0,
  19,
  -30,
  stoneMat,
  true
);


/* =========================================================
   CASTLE TOWERS
   ========================================================= */

function createTower(
  x,
  z
) {

  box(
    9,
    34,
    9,
    x,
    17,
    z,
    stoneMat,
    true
  );

  const roof =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        7,
        12,
        8
      ),
      roofMat
    );

  roof.position.set(
    x,
    40,
    z
  );

  roof.castShadow = true;

  scene.add(roof);
}


createTower(
  -25,
  -29
);

createTower(
  25,
  -29
);

createTower(
  -18,
  -48
);

createTower(
  18,
  -48
);


/* =========================================================
   CASTLE GATE
   ========================================================= */

box(
  3,
  14,
  3,
  -9,
  7,
  -18,
  stoneMat,
  true
);

box(
  3,
  14,
  3,
  9,
  7,
  -18,
  stoneMat,
  true
);

box(
  22,
  4,
  3,
  0,
  14,
  -18,
  darkStoneMat,
  true
);


/* =========================================================
   GATE DOORS
   ========================================================= */

const doorLeft =
  box(
    8,
    12,
    0.8,
    -4,
    6,
    -17.7,
    woodMat,
    false
  );

const doorRight =
  box(
    8,
    12,
    0.8,
    4,
    6,
    -17.7,
    woodMat,
    false
  );


/* =========================================================
   COURTYARD
   ========================================================= */

const courtyard =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      30,
      30,
      0.4,
      64
    ),
    stoneMat
  );

courtyard.position.set(
  0,
  0.2,
  18
);

courtyard.receiveShadow = true;

scene.add(courtyard);


/* =========================================================
   FOUNTAIN
   ========================================================= */

const fountainBase =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      10,
      11,
      1.2,
      64
    ),
    stoneMat
  );

fountainBase.position.set(
  0,
  0.6,
  18
);

fountainBase.castShadow = true;
fountainBase.receiveShadow = true;

scene.add(fountainBase);


const fountainWater =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      8.8,
      8.8,
      0.25,
      64
    ),
    waterMat
  );

fountainWater.position.set(
  0,
  1.25,
  18
);

scene.add(fountainWater);


const fountainPillar =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.4,
      1.8,
      8,
      32
    ),
    stoneMat
  );

fountainPillar.position.set(
  0,
  4.5,
  18
);

fountainPillar.castShadow = true;

scene.add(fountainPillar);


const fountainTop =
  new THREE.Mesh(
    new THREE.SphereGeometry(
      2.8,
      32,
      32
    ),
    new THREE.MeshStandardMaterial({
      color: 0x075b9c,
      metalness: 0.25,
      roughness: 0.2
    })
  );

fountainTop.position.set(
  0,
  9,
  18
);

fountainTop.castShadow = true;

scene.add(fountainTop);


/* =========================================================
   PATH
   ========================================================= */

box(
  18,
  0.3,
  70,
  0,
  0.15,
  35,
  stoneMat,
  false
);


/* =========================================================
   TREES
   ========================================================= */

function createTree(
  x,
  z
) {

  const group =
    new THREE.Group();

  const trunk =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.7,
        1,
        7,
        16
      ),
      woodMat
    );

  trunk.position.y = 3.5;

  trunk.castShadow = true;

  group.add(trunk);


  const leaves =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        4.5,
        24,
        20
      ),
      new THREE.MeshStandardMaterial({
        color: 0x073b23,
        roughness: 0.9
      })
    );

  leaves.position.y = 8;

  leaves.castShadow = true;

  group.add(leaves);


  group.position.set(
    x,
    0,
    z
  );

  scene.add(group);


  treeColliders.push({
    x,
    z,
    radius: 2.2
  });
}


[
  [-45, 35],
  [-55, 55],
  [-42, 75],

  [45, 35],
  [55, 55],
  [42, 75],

  [-70, 20],
  [70, 20],

  [-75, 70],
  [75, 70]
].forEach(
  p => createTree(
    p[0],
    p[1]
  )
);


/* =========================================================
   TORCHES
   ========================================================= */

const torches = [];


function createTorch(
  x,
  z
) {

  const group =
    new THREE.Group();

  const handle =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.18,
        0.25,
        3,
        12
      ),
      woodMat
    );

  handle.position.y = 1.5;

  handle.castShadow = true;

  group.add(handle);


  const flame =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.65,
        16,
        16
      ),
      new THREE.MeshBasicMaterial({
        color: 0xff9b28
      })
    );

  flame.scale.set(
    0.7,
    1.4,
    0.7
  );

  flame.position.y = 3.25;

  group.add(flame);


  const light =
    new THREE.PointLight(
      0xff8a20,
      5,
      15
    );

  light.position.y = 3.5;

  group.add(light);


  group.position.set(
    x,
    0,
    z
  );

  scene.add(group);


  torches.push({
    flame,
    light,
    phase: Math.random() * 10
  });
}


createTorch(
  -8,
  -13
);

createTorch(
  8,
  -13
);


/* =========================================================
   PLAYER
   ========================================================= */

let player = null;

let playerModel = null;

let wand = null;

const bones = {};


/* =========================================================
   PLAYER STATE
   ========================================================= */

let isJumping = false;

let verticalVelocity = 0;

let isMoving = false;

let isRunning = false;

let casting = false;

let moveInput =
  new THREE.Vector2(
    0,
    0
  );

let lastMoveDirection =
  new THREE.Vector3(
    0,
    0,
    -1
  );


/* =========================================================
   CAMERA STATE
   ========================================================= */

let cameraYaw = 0;

let cameraPitch = 0.15;

let cameraDistance = 9;


/* =========================================================
   KEYBOARD
   ========================================================= */

const keys = {};

window.addEventListener(
  "keydown",
  event => {

    keys[
      event.key.toLowerCase()
    ] = true;

    if (
      event.code === "Space"
    ) {

      jump();

    }

    if (
      event.key.toLowerCase() === "f"
    ) {

      castSpell();

    }

  }
);


window.addEventListener(
  "keyup",
  event => {

    keys[
      event.key.toLowerCase()
    ] = false;

  }
);


/* =========================================================
   GLB LOADER
   ========================================================= */

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


/* =========================================================
   LOADING SCREEN
   ========================================================= */

function hideLoadingScreen() {

  const ids = [
    "loading",
    "loadingScreen",
    "loadingOverlay"
  ];

  ids.forEach(
    id => {

      const element =
        document.getElementById(id);

      if (element) {

        element.style.opacity = "0";

        setTimeout(
          () => {

            element.style.display =
              "none";

          },
          500
        );

      }

    }
  );
}


/* =========================================================
   PLAYER BONE SEARCH
   ========================================================= */

function findBones(
  object
) {

  object.traverse(
    child => {

      if (
        child.isBone
      ) {

        bones[
          child.name
        ] = child;

      }

    }
  );

}


/* =========================================================
   BONE OFFSET
   ========================================================= */

function setBoneOffset(
  name,
  x = 0,
  y = 0,
  z = 0
) {

  const bone =
    bones[name];

  if (!bone) return;

  bone.rotation.x =
    x;

  bone.rotation.y =
    y;

  bone.rotation.z =
    z;
}


/* =========================================================
   STANDING POSE
   IMPORTANT:
   This resets the arms/legs after jump.
   ========================================================= */

function applyStandingPose() {

  if (!playerModel) return;


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


  setBoneOffset(
    "LeftUpLeg",
    0,
    0,
    0
  );

  setBoneOffset(
    "RightUpLeg",
    0,
    0,
    0
  );

  setBoneOffset(
    "LeftLeg",
    0,
    0,
    0
  );

  setBoneOffset(
    "RightLeg",
    0,
    0,
    0
  );

}


/* =========================================================
   IDLE ANIMATION
   ========================================================= */

function applyIdleAnimation(
  time
) {

  if (!playerModel) return;

  applyStandingPose();


  const breathing =
    Math.sin(
      time * 2
    ) * 0.025;


  setBoneOffset(
    "Spine",
    breathing,
    0,
    0
  );


  setBoneOffset(
    "Spine1",
    breathing * 0.7,
    0,
    0
  );


  setBoneOffset(
    "Head",
    Math.sin(
      time * 1.3
    ) * 0.015,
    0,
    0
  );

}


/* =========================================================
   WALK / RUN ANIMATION
   ========================================================= */

function applyWalkingAnimation(
  time,
  speed,
  running
) {

  if (!playerModel) return;

  applyStandingPose();


  const swing =
    Math.sin(
      time * speed
    ) * (
      running
        ? 0.75
        : 0.5
    );


  const opposite =
    -swing;


  /* Legs */

  setBoneOffset(
    "LeftUpLeg",
    swing,
    0,
    0
  );

  setBoneOffset(
    "RightUpLeg",
    opposite,
    0,
    0
  );


  setBoneOffset(
    "LeftLeg",
    Math.max(
      0,
      -swing * 0.35
    ),
    0,
    0
  );

  setBoneOffset(
    "RightLeg",
    Math.max(
      0,
      swing * 0.35
    ),
    0,
    0
  );


  /* Arms */

  setBoneOffset(
    "LeftArm",
    Math.PI / 2 + opposite * 0.35,
    0,
    0
  );

  setBoneOffset(
    "RightArm",
    Math.PI / 2 + swing * 0.35,
    0,
    0
  );


  /* Body */

  setBoneOffset(
    "Spine",
    Math.sin(
      time * speed * 2
    ) * 0.025,
    0,
    0
  );

}


/* =========================================================
   JUMP ANIMATION
   ========================================================= */

function applyJumpAnimation(
  time
) {

  if (!playerModel) return;


  /* Arms raised */

  setBoneOffset(
    "LeftArm",
    Math.PI / 2 - 0.35,
    0,
    0
  );

  setBoneOffset(
    "RightArm",
    Math.PI / 2 - 0.35,
    0,
    0
  );


  setBoneOffset(
    "LeftForeArm",
    -0.2,
    0,
    0
  );

  setBoneOffset(
    "RightForeArm",
    -0.2,
    0,
    0
  );


  /* Legs bent */

  setBoneOffset(
    "LeftUpLeg",
    -0.35,
    0,
    0
  );

  setBoneOffset(
    "RightUpLeg",
    0.35,
    0,
    0
  );


  setBoneOffset(
    "LeftLeg",
    -0.45,
    0,
    0
  );

  setBoneOffset(
    "RightLeg",
    -0.45,
    0,
    0
  );


  setBoneOffset(
    "Spine",
    Math.sin(time * 3) * 0.03,
    0,
    0
  );

}


/* =========================================================
   CASTING ANIMATION
   ========================================================= */

function applyCastingAnimation(
  time
) {

  if (!playerModel) return;

  applyStandingPose();


  setBoneOffset(
    "RightArm",
    Math.PI / 2 - 0.9,
    0,
    0
  );


  setBoneOffset(
    "RightForeArm",
    -0.8,
    0,
    0
  );


  setBoneOffset(
    "LeftArm",
    Math.PI / 2 + 0.15,
    0,
    0
  );


  setBoneOffset(
    "RightHand",
    0,
    0,
    0
  );


  setBoneOffset(
    "Spine",
    Math.sin(
      time * 5
    ) * 0.04,
    0,
    0
  );

}


/* =========================================================
   WAND
   ========================================================= */

function createWand() {

  const geometry =
    new THREE.CylinderGeometry(
      0.08,
      0.12,
      2.4,
      12
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: 0x4a2818,
      roughness: 0.65
    });

  wand =
    new THREE.Mesh(
      geometry,
      material
    );

  wand.rotation.z =
    Math.PI / 2;

  wand.position.set(
    0,
    -0.1,
    0
  );


  if (
    bones.RightHand
  ) {

    bones.RightHand.add(
      wand
    );

  } else if (
    playerModel
  ) {

    playerModel.add(
      wand
    );

  }

}


/* =========================================================
   LOAD PLAYER
   ========================================================= */

loader.load(
  "./assets/player/aren_valen.glb",

  gltf => {

    player =
      new THREE.Group();

    player.position.set(
      0,
      0,
      70
    );

    scene.add(
      player
    );


    playerModel =
      gltf.scene;


    /* Scale */

    playerModel.scale.set(
      1,
      1,
      1
    );


    playerModel.traverse(
      child => {

        if (
          child.isMesh
        ) {

          child.castShadow =
            true;

          child.receiveShadow =
            true;

        }

      }
    );


    player.add(
      playerModel
    );


    findBones(
      playerModel
    );


    applyStandingPose();

    createWand();


    hideLoadingScreen();


    console.log(
      "Aren loaded successfully."
    );

    console.log(
      "Bones:",
      Object.keys(bones)
    );

  },

  progress => {

    if (
      progress.total
    ) {

      const percent =
        (
          progress.loaded /
          progress.total
        ) * 100;

      console.log(
        "Aren loading:",
        percent.toFixed(0) + "%"
      );

    }

  },

  error => {

    console.error(
      "Aren GLB loading error:",
      error
    );

    hideLoadingScreen();

  }
);


/* =========================================================
   MOVEMENT INPUT
   ========================================================= */

function getKeyboardInput() {

  let x = 0;
  let y = 0;


  if (
    keys["a"] ||
    keys["arrowleft"]
  ) {

    x -= 1;

  }

  if (
    keys["d"] ||
    keys["arrowright"]
  ) {

    x += 1;

  }

  if (
    keys["w"] ||
    keys["arrowup"]
  ) {

    y += 1;

  }

  if (
    keys["s"] ||
    keys["arrowdown"]
  ) {

    y -= 1;

  }


  return {
    x,
    y
  };

}


/* =========================================================
   COLLISION TEST
   ========================================================= */

function canMoveTo(
  x,
  z
) {

  /* Castle boxes */

  for (
    const boxData of collisionBoxes
  ) {

    const closestX =
      Math.max(
        boxData.minX,
        Math.min(
          x,
          boxData.maxX
        )
      );

    const closestZ =
      Math.max(
        boxData.minZ,
        Math.min(
          z,
          boxData.maxZ
        )
      );


    const dx =
      x - closestX;

    const dz =
      z - closestZ;


    if (
      dx * dx +
      dz * dz <
      playerRadius *
      playerRadius
    ) {

      return false;

    }

  }


  /* Trees */

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
      tree.radius +
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

function updateMovement(
  delta
) {

  if (!player) return;


  const keyboard =
    getKeyboardInput();


  let inputX =
    moveInput.x;

  let inputY =
    moveInput.y;


  /* Keyboard overrides joystick */

  if (
    keyboard.x !== 0 ||
    keyboard.y !== 0
  ) {

    inputX =
      keyboard.x;

    inputY =
      keyboard.y;

  }


  const inputLength =
    Math.sqrt(
      inputX * inputX +
      inputY * inputY
    );


  isMoving =
    inputLength >
    0.08;


  if (!isMoving) {

    return;

  }


  if (
    inputLength > 1
  ) {

    inputX /=
      inputLength;

    inputY /=
      inputLength;

  }


  /* Shift = run */

  isRunning =
    keys["shift"] ||
    inputLength > 0.95;


  const speed =
    isRunning
      ? 9
      : 5.5;


  /*
     IMPORTANT FIX

     Camera is behind the player at +Z.

     Therefore player forward is -Z.
  */

  const forward =
    new THREE.Vector3(
      0,
      0,
      -1
    );


  const right =
    new THREE.Vector3(
      1,
      0,
      0
    );


  const upAxis =
    new THREE.Vector3(
      0,
      1,
      0
    );


  forward.applyAxisAngle(
    upAxis,
    cameraYaw
  );

  right.applyAxisAngle(
    upAxis,
    cameraYaw
  );


  const direction =
    new THREE.Vector3();


  direction.addScaledVector(
    forward,
    inputY
  );


  direction.addScaledVector(
    right,
    inputX
  );


  if (
    direction.lengthSq() >
    0.0001
  ) {

    direction.normalize();

    lastMoveDirection.copy(
      direction
    );


    const moveDistance =
      speed * delta;


    const nextX =
      player.position.x +
      direction.x *
      moveDistance;


    const nextZ =
      player.position.z +
      direction.z *
      moveDistance;


    if (
      canMoveTo(
        nextX,
        player.position.z
      )
    ) {

      player.position.x =
        nextX;

    }


    if (
      canMoveTo(
        player.position.x,
        nextZ
      )
    ) {

      player.position.z =
        nextZ;

    }


    /* Face movement direction */

    const targetAngle =
      Math.atan2(
        direction.x,
        direction.z
      );


    player.rotation.y =
      THREE.MathUtils.lerp(
        player.rotation.y,
        targetAngle,
        Math.min(
          1,
          delta * 10
        )
      );

  }

}


/* =========================================================
   JUMP
   ========================================================= */

function jump() {

  if (!player) return;

  /* Do not double jump */

  if (isJumping) return;


  /* Must be on ground */

  if (
    player.position.y >
    0.05
  ) {

    return;

  }


  isJumping = true;

  verticalVelocity = 11;


  console.log(
    "Jump!"
  );

}


/* =========================================================
   JUMP PHYSICS
   ========================================================= */

function updateJump(
  delta
) {

  if (!player) return;


  if (!isJumping) {

    /*
       Extra safety:

       Never allow the player to remain
       slightly above the ground.
    */

    if (
      player.position.y !== 0
    ) {

      player.position.y =
        0;

    }

    return;

  }


  /* Gravity */

  verticalVelocity -=
    25 * delta;


  player.position.y +=
    verticalVelocity * delta;


  /* LANDING */

  if (
    player.position.y <= 0
  ) {

    player.position.y =
      0;

    verticalVelocity =
      0;

    isJumping =
      false;


    /*
       IMPORTANT FIX:

       Reset the complete body pose
       immediately after landing.
    */

    applyStandingPose();


    console.log(
      "Landed — animation reset."
    );

  }

}


/* =========================================================
   SPELL
   ========================================================= */

function castSpell() {

  if (!player) return;

  if (casting) return;


  casting = true;


  applyCastingAnimation(
    performance.now() * 0.001
  );


  const direction =
    lastMoveDirection.clone();


  if (
    direction.lengthSq() <
    0.001
  ) {

    direction.set(
      0,
      0,
      -1
    );

    direction.applyQuaternion(
      player.quaternion
    );

    direction.normalize();

  }


  createSpellProjectile(
    player.position.clone(),
    direction
  );


  setTimeout(
    () => {

      casting = false;

    },
    500
  );

}


/* =========================================================
   SPELL PROJECTILE
   ========================================================= */

function createSpellProjectile(
  start,
  direction
) {

  const geometry =
    new THREE.SphereGeometry(
      0.3,
      16,
      16
    );


  const material =
    new THREE.MeshBasicMaterial({
      color: 0x8de9ff
    });


  const projectile =
    new THREE.Mesh(
      geometry,
      material
    );


  projectile.position.copy(
    start
  );


  projectile.position.y +=
    1.6;


  scene.add(
    projectile
  );


  const light =
    new THREE.PointLight(
      0x66ddff,
      4,
      12
    );


  projectile.add(
    light
  );


  const velocity =
    direction
      .clone()
      .multiplyScalar(25);


  let life = 0;


  function updateSpell() {

    const delta =
      Math.min(
        clock.getDelta(),
        0.05
      );

    projectile.position.add(
      velocity
        .clone()
        .multiplyScalar(
          delta
        )
    );


    life += delta;


    if (
      life > 2.5
    ) {

      scene.remove(
        projectile
      );

      return;

    }


    requestAnimationFrame(
      updateSpell
    );

  }


  updateSpell();

}


/* =========================================================
   JOYSTICK
   ========================================================= */

const joystick =
  document.getElementById(
    "joystick"
  );

const joystickKnob =
  document.getElementById(
    "joystickKnob"
  );


let joystickActive =
  false;

let joystickPointerId =
  null;


function updateJoystick(
  clientX,
  clientY
) {

  if (!joystick) return;


  const rect =
    joystick.getBoundingClientRect();


  const centerX =
    rect.left +
    rect.width / 2;


  const centerY =
    rect.top +
    rect.height / 2;


  let dx =
    clientX -
    centerX;


  let dy =
    clientY -
    centerY;


  const maxDistance =
    rect.width * 0.32;


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
      dx /
      distance *
      maxDistance;

    dy =
      dy /
      distance *
      maxDistance;

  }


  moveInput.x =
    dx / maxDistance;


  /*
     Screen Y is opposite to game Y.

     Moving joystick UP:

     dy = negative

     therefore:

     moveInput.y = positive
  */

  moveInput.y =
    -dy / maxDistance;


  if (joystickKnob) {

    joystickKnob.style.transform =
      `translate(${dx}px, ${dy}px)`;

  }

}


function resetJoystick() {

  joystickActive =
    false;

  joystickPointerId =
    null;


  moveInput.set(
    0,
    0
  );


  if (joystickKnob) {

    joystickKnob.style.transform =
      "translate(0px, 0px)";

  }

}


if (joystick) {

  joystick.style.touchAction =
    "none";


  joystick.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      joystickActive =
        true;

      joystickPointerId =
        event.pointerId;


      try {

        joystick.setPointerCapture(
          event.pointerId
        );

      } catch {}


      updateJoystick(
        event.clientX,
        event.clientY
      );

    }
  );


  joystick.addEventListener(
    "pointermove",
    event => {

      if (
        !joystickActive
      ) return;


      if (
        event.pointerId !==
        joystickPointerId
      ) return;


      event.preventDefault();


      updateJoystick(
        event.clientX,
        event.clientY
      );

    }
  );


  joystick.addEventListener(
    "pointerup",
    resetJoystick
  );


  joystick.addEventListener(
    "pointercancel",
    resetJoystick
  );


  joystick.addEventListener(
    "lostpointercapture",
    resetJoystick
  );

}


/* =========================================================
   JUMP BUTTON
   ========================================================= */

const jumpButton =
  document.getElementById(
    "jumpButton"
  );


if (jumpButton) {

  jumpButton.style.touchAction =
    "none";


  jumpButton.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      jump();

    }
  );

}


/* =========================================================
   CAST BUTTON
   ========================================================= */

const castButton =
  document.getElementById(
    "castButton"
  );


if (castButton) {

  castButton.style.touchAction =
    "none";


  castButton.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      castSpell();

    }
  );

}


/* =========================================================
   CAMERA DRAG
   ========================================================= */

let cameraDragging =
  false;

let lastPointerX = 0;

let lastPointerY = 0;


renderer.domElement.style.touchAction =
  "none";


renderer.domElement.addEventListener(
  "pointerdown",
  event => {

    /*
       Don't start camera drag
       over UI controls.
    */

    if (
      event.target.closest &&
      (
        event.target.closest(
          "#joystick"
        ) ||
        event.target.closest(
          "#jumpButton"
        ) ||
        event.target.closest(
          "#castButton"
        ) ||
        event.target.closest(
          "#interactButton"
        )
      )
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
  event => {

    if (
      !cameraDragging
    ) return;


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
        -0.35,
        0.65
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
   NPC
   ========================================================= */

let npc = null;

let npcTalking =
  false;


/* =========================================================
   CREATE NPC
   ========================================================= */

function createNPC() {

  npc =
    new THREE.Group();


  /* Body */

  const robe =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        1.4,
        1.8,
        4.5,
        24
      ),
      new THREE.MeshStandardMaterial({
        color: 0x17152d,
        roughness: 0.8
      })
    );

  robe.position.y =
    2.25;

  robe.castShadow =
    true;

  npc.add(
    robe
  );


  /* Head */

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.8,
        24,
        20
      ),
      new THREE.MeshStandardMaterial({
        color: 0xd2a47e,
        roughness: 0.8
      })
    );

  head.position.y =
    5.1;

  head.castShadow =
    true;

  npc.add(
    head
  );


  /* Hat */

  const hat =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        1.25,
        2.4,
        24
      ),
      new THREE.MeshStandardMaterial({
        color: 0x21163b,
        roughness: 0.75
      })
    );

  hat.position.y =
    6.55;

  hat.castShadow =
    true;

  npc.add(
    hat
  );


  /* Staff */

  const staff =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.12,
        0.16,
        6,
        12
      ),
      woodMat
    );

  staff.position.set(
    1.5,
    2.5,
    0
  );

  staff.rotation.z =
    -0.1;

  staff.castShadow =
    true;

  npc.add(
    staff
  );


  /* Crystal */

  const crystal =
    new THREE.Mesh(
      new THREE.OctahedronGeometry(
        0.35
      ),
      new THREE.MeshStandardMaterial({
        color: 0x66dfff,
        emissive: 0x1a8fff,
        emissiveIntensity: 2
      })
    );

  crystal.position.set(
    1.5,
    5.7,
    0
  );

  npc.add(
    crystal
  );


  npc.position.set(
    14,
    0,
    15
  );


  scene.add(
    npc
  );

}


createNPC();


/* =========================================================
   QUEST SYSTEM
   ========================================================= */

const QUEST_TALK =
  "TALK_TO_AELION";

const QUEST_MARKER =
  "FIND_ANCIENT_MARKER";

const QUEST_COMPLETE =
  "COMPLETED";


let questState =
  QUEST_MARKER;


/* =========================================================
   QUEST MARKER
   ========================================================= */

const questMarker =
  new THREE.Group();


const markerRing =
  new THREE.Mesh(
    new THREE.TorusGeometry(
      1.5,
      0.15,
      16,
      40
    ),
    new THREE.MeshBasicMaterial({
      color: 0xffd85c
    })
  );


markerRing.rotation.x =
  Math.PI / 2;


questMarker.add(
  markerRing
);


const markerLight =
  new THREE.PointLight(
    0xffd85c,
    5,
    12
  );


markerLight.position.y =
  1;


questMarker.add(
  markerLight
);


questMarker.position.set(
  0,
  2,
  -18
);


scene.add(
  questMarker
);


/* =========================================================
   DIALOGUE UI
   ========================================================= */

let dialogueBox =
  document.getElementById(
    "dialogue"
  );


let dialogueText =
  document.getElementById(
    "dialogueText"
  );


let interactButton =
  document.getElementById(
    "interactButton"
  );


if (!interactButton) {

  interactButton =
    document.createElement(
      "button"
    );

  interactButton.id =
    "interactButton";

  interactButton.textContent =
    "TALK";

  interactButton.style.position =
    "fixed";

  interactButton.style.bottom =
    "110px";

  interactButton.style.left =
    "50%";

  interactButton.style.transform =
    "translateX(-50%)";

  interactButton.style.zIndex =
    "50";

  interactButton.style.display =
    "none";

  document.body.appendChild(
    interactButton
  );

}


function showDialogue(
  text
) {

  if (
    dialogueBox
  ) {

    dialogueBox.style.display =
      "block";

  }


  if (
    dialogueText
  ) {

    dialogueText.textContent =
      text;

  }

}


function hideDialogue() {

  if (
    dialogueBox
  ) {

    dialogueBox.style.display =
      "none";

  }

}


/* =========================================================
   NPC INTERACTION
   ========================================================= */

function updateNPCInteraction() {

  if (
    !player ||
    !npc
  ) return;


  const distance =
    player.position.distanceTo(
      npc.position
    );


  if (
    distance < 7 &&
    questState === QUEST_MARKER
  ) {

    interactButton.style.display =
      "block";

  } else {

    interactButton.style.display =
      "none";

  }

}


interactButton.addEventListener(
  "click",
  () => {

    if (
      !player ||
      !npc
    ) return;


    const distance =
      player.position.distanceTo(
        npc.position
      );


    if (
      distance > 7
    ) return;


    npcTalking =
      true;


    showDialogue(
      "Professor Aelion: The ancient academy marker lies beyond the great gate. Find it and return."
    );


    setTimeout(
      () => {

        npcTalking =
          false;

        hideDialogue();

      },
      5000
    );

  }
);


/* =========================================================
   QUEST UPDATE
   ========================================================= */

function updateQuest() {

  if (!player) return;


  if (
    questState ===
    QUEST_MARKER
  ) {

    const dx =
      player.position.x -
      0;

    const dz =
      player.position.z -
      (-18);


    const distance =
      Math.sqrt(
        dx * dx +
        dz * dz
      );


    if (
      distance < 7
    ) {

      questState =
        QUEST_COMPLETE;


      questMarker.visible =
        false;


      showDialogue(
        "You found the Ancient Academy Marker!"
      );


      setTimeout(
        () => {

          hideDialogue();

        },
        4000
      );


      updateQuestUI();

    }

  }

}


/* =========================================================
   QUEST UI
   ========================================================= */

function updateQuestUI() {

  const questElement =
    document.getElementById(
      "questText"
    );


  if (!questElement) return;


  if (
    questState ===
    QUEST_MARKER
  ) {

    questElement.textContent =
      "Quest: Find the Ancient Academy Marker";

  }


  if (
    questState ===
    QUEST_COMPLETE
  ) {

    questElement.textContent =
      "Quest Complete!";

  }

}


updateQuestUI();


/* =========================================================
   XP
   ========================================================= */

let xp = 0;


function addXP(
  amount
) {

  xp += amount;


  const xpElement =
    document.getElementById(
      "xpText"
    );


  if (
    xpElement
  ) {

    xpElement.textContent =
      "XP " + xp;

  }

}


/* =========================================================
   MARKER ANIMATION
   ========================================================= */

function updateQuestMarker(
  time
) {

  if (
    !questMarker.visible
  ) return;


  markerRing.rotation.z =
    time * 1.5;


  markerRing.position.y =
    Math.sin(
      time * 2
    ) * 0.3;


  markerLight.intensity =
    4 +
    Math.sin(
      time * 4
    ) * 1.5;

}


/* =========================================================
   TORCH ANIMATION
   ========================================================= */

function updateTorches(
  time
) {

  torches.forEach(
    torch => {

      const flicker =
        Math.sin(
          time * 10 +
          torch.phase
        ) * 0.15;


      torch.flame.scale.x =
        0.7 + flicker;


      torch.flame.scale.z =
        0.7 - flicker;


      torch.flame.scale.y =
        1.4 +
        flicker;


      torch.light.intensity =
        5 +
        Math.sin(
          time * 12 +
          torch.phase
        ) * 1.5;

    }
  );

}


/* =========================================================
   CAMERA FOLLOW
   ========================================================= */

function updateCamera(
  delta
) {

  if (!player) return;


  const target =
    player.position.clone();


  target.y +=
    2.4;


  const horizontal =
    Math.cos(
      cameraPitch
    ) *
    cameraDistance;


  const vertical =
    Math.sin(
      cameraPitch
    ) *
    cameraDistance;


  const desiredPosition =
    new THREE.Vector3(
      target.x +
        Math.sin(cameraYaw) *
        horizontal,

      target.y +
        vertical,

      target.z +
        Math.cos(cameraYaw) *
        horizontal
    );


  camera.position.lerp(
    desiredPosition,
    Math.min(
      1,
      delta * 7
    )
  );


  camera.lookAt(
    target
  );

}


/* =========================================================
   ANIMATION STATE
   ========================================================= */

function updatePlayerAnimation(
  time
) {

  if (!playerModel)
    return;


  /*
     IMPORTANT PRIORITY

     1. Jump
     2. Cast
     3. Walk / Run
     4. Idle

     This prevents a jump pose from
     staying after landing.
  */

  if (
    isJumping
  ) {

    applyJumpAnimation(
      time
    );

    return;

  }


  if (
    casting
  ) {

    applyCastingAnimation(
      time
    );

    return;

  }


  if (
    isMoving
  ) {

    applyWalkingAnimation(
      time,
      isRunning
        ? 10
        : 7,
      isRunning
    );

    return;

  }


  applyIdleAnimation(
    time
  );

}


/* =========================================================
   LANDSCAPE BUTTON
   ========================================================= */

const landscapeButton =
  document.getElementById(
    "landscapeButton"
  );


if (
  landscapeButton
) {

  landscapeButton.addEventListener(
    "click",
    async () => {

      try {

        if (
          document.documentElement
            .requestFullscreen
        ) {

          await document
            .documentElement
            .requestFullscreen();

        }

      } catch {}


      try {

        if (
          screen.orientation &&
          screen.orientation.lock
        ) {

          await screen.orientation.lock(
            "landscape"
          );

        }

      } catch {}

    }
  );

}


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* =========================================================
   MAIN GAME LOOP
   ========================================================= */

function animate() {

  requestAnimationFrame(
    animate
  );


  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );


  const time =
    performance.now() *
    0.001;


  /* Movement */

  updateMovement(
    delta
  );


  /* Jump physics */

  updateJump(
    delta
  );


  /*
     Player animation happens
     AFTER jump physics.

     Therefore once landing occurs,
     isJumping becomes false and the
     standing/walk animation is used.
  */

  updatePlayerAnimation(
    time
  );


  /* NPC */

  updateNPCInteraction();


  /* Quest */

  updateQuest();


  /* Marker */

  updateQuestMarker(
    time
  );


  /* Torches */

  updateTorches(
    time
  );


  /* Camera */

  updateCamera(
    delta
  );


  renderer.render(
    scene,
    camera
  );

}


/* =========================================================
   START
   ========================================================= */

animate();


console.log(
  "Aetheria Academy started."
);

console.log(
  "W/A/S/D = movement"
);

console.log(
  "SHIFT = run"
);

console.log(
  "SPACE = jump"
);

console.log(
  "F = cast"
);
