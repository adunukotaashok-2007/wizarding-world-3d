/* =========================================================
   WIZARDING WORLD 3D — V5
   HERO + ENEMIES + WATER + SPELLS
   MOBILE / TABLET VERSION
   ========================================================= */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================================================
   BASIC SETUP
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x8fb8d4);

scene.fog = new THREE.FogExp2(
  0x8fb8d4,
  0.008
);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  800
);

camera.position.set(0, 6, 12);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 1.5)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

renderer.domElement.style.position = "fixed";
renderer.domElement.style.left = "0";
renderer.domElement.style.top = "0";
renderer.domElement.style.zIndex = "0";

document.body.appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight = new THREE.HemisphereLight(
  0xd9efff,
  0x33452f,
  1.7
);

scene.add(hemiLight);


const sun = new THREE.DirectionalLight(
  0xfff1d0,
  3.2
);

sun.position.set(
  -100,
  150,
  80
);

sun.castShadow = true;

sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;

sun.shadow.camera.left = -120;
sun.shadow.camera.right = 120;
sun.shadow.camera.top = 120;
sun.shadow.camera.bottom = -120;

scene.add(sun);


/* =========================================================
   VARIABLES
   ========================================================= */

const clock = new THREE.Clock();

const loader = new THREE.TextureLoader();

const gltfLoader = new GLTFLoader();

const player = {
  x: 0,
  y: 0,
  z: 8,

  velocityY: 0,

  speed: 0.16,

  hp: 100,
  magic: 100,
  xp: 0,

  yaw: 0,

  grounded: true
};

let wizard;

const enemies = [];

const spells = [];

const effects = [];

let treeModel = null;

let joystickActive = false;

let joystickX = 0;
let joystickY = 0;

let cameraYaw = 0;

let cameraPitch = 0.18;

let lastSpellTime = 0;


/* =========================================================
   TEXTURE HELPER
   ========================================================= */

function loadTexture(path) {
  const texture = loader.load(path);

  texture.colorSpace = THREE.SRGBColorSpace;

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.anisotropy =
    renderer.capabilities.getMaxAnisotropy();

  return texture;
}


/* =========================================================
   GROUND
   ========================================================= */

const groundDiffuse = loadTexture(
  "./assets/ground/diffuse.jpg"
);

const groundNormal = loader.load(
  "./assets/ground/normal.jpg"
);

const groundRough = loader.load(
  "./assets/ground/rough.jpg"
);

const groundDisp = loader.load(
  "./assets/ground/disp.png"
);

groundDiffuse.repeat.set(18, 18);
groundNormal.repeat.set(18, 18);
groundRough.repeat.set(18, 18);
groundDisp.repeat.set(18, 18);


const groundMaterial = new THREE.MeshStandardMaterial({
  map: groundDiffuse,
  normalMap: groundNormal,
  roughnessMap: groundRough,

  roughness: 0.95,

  displacementMap: groundDisp,
  displacementScale: 0.35
});


const groundGeometry =
  new THREE.PlaneGeometry(
    500,
    500,
    100,
    100
  );

groundGeometry.rotateX(-Math.PI / 2);


const ground = new THREE.Mesh(
  groundGeometry,
  groundMaterial
);

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   WATER / LAKE
   ========================================================= */

const waterGeometry =
  new THREE.PlaneGeometry(
    150,
    90,
    80,
    50
  );

waterGeometry.rotateX(-Math.PI / 2);


const waterMaterial =
  new THREE.MeshPhysicalMaterial({

    color: 0x287c9c,

    metalness: 0.05,

    roughness: 0.18,

    transmission: 0.05,

    transparent: true,

    opacity: 0.78,

    clearcoat: 0.7,

    clearcoatRoughness: 0.12
  });


const water = new THREE.Mesh(
  waterGeometry,
  waterMaterial
);

water.position.set(
  65,
  0.08,
  -55
);

water.receiveShadow = true;

scene.add(water);


/* =========================================================
   WATER RIPPLE MATERIAL
   ========================================================= */

const rippleGeometry =
  new THREE.PlaneGeometry(
    150,
    90,
    30,
    20
  );

rippleGeometry.rotateX(-Math.PI / 2);


const rippleMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x75c8df,

    transparent: true,

    opacity: 0.12,

    blending: THREE.AdditiveBlending,

    depthWrite: false
  });


const ripple =
  new THREE.Mesh(
    rippleGeometry,
    rippleMaterial
  );

ripple.position.set(
  65,
  0.13,
  -55
);

scene.add(ripple);


/* =========================================================
   CASTLE
   ========================================================= */

const castleDiffuse = loadTexture(
  "./assets/castle/diffuse.jpg"
);

const castleNormal = loader.load(
  "./assets/castle/normal.jpg"
);

const castleRough = loader.load(
  "./assets/castle/rough.jpg"
);

const castleAO = loader.load(
  "./assets/castle/ao.jpg"
);

castleDiffuse.repeat.set(2, 3);
castleNormal.repeat.set(2, 3);
castleRough.repeat.set(2, 3);
castleAO.repeat.set(2, 3);


const castleMaterial =
  new THREE.MeshStandardMaterial({

    map: castleDiffuse,

    normalMap: castleNormal,

    roughnessMap: castleRough,

    aoMap: castleAO,

    roughness: 0.82
  });


/* Main castle */

const castleBody =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      45,
      28,
      32
    ),
    castleMaterial
  );

castleBody.position.set(
  0,
  14,
  -35
);

castleBody.castShadow = true;
castleBody.receiveShadow = true;

scene.add(castleBody);


/* =========================================================
   CASTLE TOWERS
   ========================================================= */

function createTower(x, z) {

  const tower =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        7,
        8,
        42,
        16
      ),
      castleMaterial
    );

  tower.position.set(
    x,
    21,
    z
  );

  tower.castShadow = true;
  tower.receiveShadow = true;

  scene.add(tower);


  const roof =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        9,
        11,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0x30343b,

        roughness: 0.72,

        metalness: 0.05
      })
    );

  roof.position.set(
    x,
    47,
    z
  );

  roof.castShadow = true;

  scene.add(roof);
}


createTower(-25, -48);
createTower(25, -48);
createTower(-25, -22);
createTower(25, -22);


/* =========================================================
   CASTLE WINDOWS
   ========================================================= */

const windowMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x91d7ff,

    emissive: 0x245b83,

    emissiveIntensity: 1.2,

    roughness: 0.25
  });


for (let row = 0; row < 3; row++) {

  for (let col = 0; col < 5; col++) {

    const win =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          3,
          5,
          0.25
        ),
        windowMaterial
      );

    win.position.set(
      -12 + col * 6,
      7 + row * 7,
      -51
    );

    scene.add(win);
  }
}


/* =========================================================
   MOUNTAINS
   ========================================================= */

function createMountain(
  x,
  z,
  height,
  radius
) {

  const mountain =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        radius,
        height,
        9
      ),
      new THREE.MeshStandardMaterial({
        color: 0x4c5755,

        roughness: 1
      })
    );

  mountain.position.set(
    x,
    height / 2 - 1,
    z
  );

  mountain.castShadow = true;

  mountain.receiveShadow = true;

  scene.add(mountain);
}


createMountain(
  -100,
  -130,
  90,
  70
);

createMountain(
  0,
  -145,
  115,
  90
);

createMountain(
  110,
  -130,
  85,
  65
);

createMountain(
  160,
  -70,
  70,
  55
);

createMountain(
  -150,
  -55,
  75,
  60
);


/* =========================================================
   ROCKS
   ========================================================= */

function createRock(
  x,
  y,
  z,
  scale
) {

  const rock =
    new THREE.Mesh(
      new THREE.DodecahedronGeometry(
        1,
        1
      ),
      new THREE.MeshStandardMaterial({
        color: 0x626967,

        roughness: 0.92
      })
    );

  rock.position.set(
    x,
    y,
    z
  );

  rock.scale.set(
    scale * 1.5,
    scale,
    scale * 1.2
  );

  rock.rotation.y =
    Math.random() * Math.PI;

  rock.castShadow = true;

  rock.receiveShadow = true;

  scene.add(rock);
}


for (let i = 0; i < 35; i++) {

  const x =
    (Math.random() - 0.5) * 240;

  const z =
    (Math.random() - 0.5) * 180;

  if (
    Math.abs(x) < 35 &&
    z < 5 &&
    z > -65
  ) {
    continue;
  }

  createRock(
    x,
    1,
    z,
    1 + Math.random() * 2.5
  );
}


/* =========================================================
   TREE GLB
   ========================================================= */

gltfLoader.load(
  "./assets/tree.glb",

  (gltf) => {

    treeModel = gltf.scene;

    treeModel.scale.set(
      2.5,
      2.5,
      2.5
    );

    treeModel.traverse(
      (child) => {

        if (child.isMesh) {

          child.castShadow = true;

          child.receiveShadow = true;
        }
      }
    );


    for (let i = 0; i < 35; i++) {

      const tree =
        treeModel.clone(true);

      const angle =
        Math.random() * Math.PI * 2;

      const distance =
        40 + Math.random() * 120;

      tree.position.set(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      );

      tree.scale.setScalar(
        1.5 + Math.random() * 1.8
      );

      scene.add(tree);
    }
  },

  undefined,

  (error) => {

    console.warn(
      "Tree model could not be loaded:",
      error
    );
  }
);


/* =========================================================
   WIZARD HERO
   ========================================================= */

function createWizard() {

  const group =
    new THREE.Group();


  /* -------------------------
     LEGS
     ------------------------- */

  const legMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x17191d,
      roughness: 0.72
    });


  const leftLeg =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.42,
        0.48,
        2.3,
        10
      ),
      legMaterial
    );

  leftLeg.position.set(
    -0.32,
    1.15,
    0
  );

  leftLeg.castShadow = true;

  group.add(leftLeg);


  const rightLeg =
    leftLeg.clone();

  rightLeg.position.x = 0.32;

  group.add(rightLeg);


  /* -------------------------
     BOOTS
     ------------------------- */

  const bootMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x211711,
      roughness: 0.7
    });


  const leftBoot =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.55,
        12,
        8
      ),
      bootMaterial
    );

  leftBoot.scale.set(
    1.2,
    0.65,
    1.6
  );

  leftBoot.position.set(
    -0.32,
    0.25,
    -0.15
  );

  leftBoot.castShadow = true;

  group.add(leftBoot);


  const rightBoot =
    leftBoot.clone();

  rightBoot.position.x = 0.32;

  group.add(rightBoot);


  /* -------------------------
     ROBE
     ------------------------- */

  const robeMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x242b49,

      roughness: 0.78,

      metalness: 0.02
    });


  const robe =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        1.65,
        3.7,
        16
      ),
      robeMaterial
    );

  robe.position.y = 3.15;

  robe.castShadow = true;

  robe.receiveShadow = true;

  group.add(robe);


  /* -------------------------
     ROBE BELT
     ------------------------- */

  const belt =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        1.08,
        1.08,
        0.18,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0x4a2d17,
        roughness: 0.65
      })
    );

  belt.rotation.z =
    Math.PI / 2;

  belt.position.y = 3.25;

  group.add(belt);


  /* -------------------------
     SHIRT / CHEST
     ------------------------- */

  const chest =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.8,
        0.95,
        1.3,
        12
      ),
      new THREE.MeshStandardMaterial({
        color: 0x30384e,
        roughness: 0.7
      })
    );

  chest.position.y = 4.65;

  chest.castShadow = true;

  group.add(chest);


  /* -------------------------
     HEAD
     ------------------------- */

  const skinMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xc98f6d,
      roughness: 0.75
    });


  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.75,
        20,
        16
      ),
      skinMaterial
    );

  head.position.y = 5.9;

  head.castShadow = true;

  group.add(head);


  /* -------------------------
     HAIR
     ------------------------- */

  const hair =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.79,
        16,
        12
      ),
      new THREE.MeshStandardMaterial({
        color: 0x16120f,
        roughness: 0.82
      })
    );

  hair.scale.set(
    1,
    0.72,
    1
  );

  hair.position.y = 6.25;

  hair.castShadow = true;

  group.add(hair);


  /* -------------------------
     EYES
     ------------------------- */

  const eyeMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xffffff,

      emissive: 0x111111
    });


  const pupilMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x101010
    });


  for (const side of [-1, 1]) {

    const eye =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.09,
          8,
          8
        ),
        eyeMaterial
      );

    eye.position.set(
      side * 0.27,
      6.02,
      -0.67
    );

    group.add(eye);


    const pupil =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.045,
          8,
          8
        ),
        pupilMaterial
      );

    pupil.position.set(
      side * 0.27,
      6.02,
      -0.745
    );

    group.add(pupil);
  }


  /* -------------------------
     NOSE
     ------------------------- */

  const nose =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        0.12,
        0.35,
        8
      ),
      skinMaterial
    );

  nose.rotation.x =
    -Math.PI / 2;

  nose.position.set(
    0,
    5.82,
    -0.75
  );

  group.add(nose);


  /* -------------------------
     ARMS
     ------------------------- */

  const sleeveMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x202844,
      roughness: 0.8
    });


  const leftArm =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.28,
        0.34,
        2.4,
        10
      ),
      sleeveMaterial
    );

  leftArm.rotation.z =
    -0.35;

  leftArm.position.set(
    -1.0,
    4.1,
    0
  );

  leftArm.castShadow = true;

  group.add(leftArm);


  const rightArm =
    leftArm.clone();

  rightArm.rotation.z =
    0.35;

  rightArm.position.x = 1.0;

  group.add(rightArm);


  /* -------------------------
     HANDS
     ------------------------- */

  const leftHand =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.3,
        10,
        8
      ),
      skinMaterial
    );

  leftHand.position.set(
    -1.4,
    3.1,
    0
  );

  group.add(leftHand);


  const rightHand =
    leftHand.clone();

  rightHand.position.x = 1.4;

  group.add(rightHand);


  /* -------------------------
     WAND
     ------------------------- */

  const wand =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.055,
        0.08,
        2.5,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x56351c,
        roughness: 0.7
      })
    );

  wand.rotation.z =
    -0.15;

  wand.rotation.x =
    Math.PI / 2;

  wand.position.set(
    1.65,
    3.2,
    -0.25
  );

  wand.castShadow = true;

  group.add(wand);


  /* -------------------------
     WAND TIP
     ------------------------- */

  const wandTip =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.11,
        8,
        8
      ),
      new THREE.MeshBasicMaterial({
        color: 0x91eaff
      })
    );

  wandTip.position.set(
    2.85,
    3.2,
    -0.25
  );

  group.add(wandTip);


  /* -------------------------
     CAPE
     ------------------------- */

  const cape =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        2.7,
        3.8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x101426,

        side: THREE.DoubleSide,

        roughness: 0.9
      })
    );

  cape.position.set(
    0,
    3.5,
    0.75
  );

  cape.rotation.x =
    0.08;

  cape.castShadow = true;

  group.add(cape);


  /* -------------------------
     WIZARD HAT
     ------------------------- */

  const hatMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x171a32,
      roughness: 0.82
    });


  const hatBase =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        1.05,
        1.05,
        0.18,
        16
      ),
      hatMaterial
    );

  hatBase.position.y = 6.55;

  group.add(hatBase);


  const hat =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        0.7,
        1.8,
        16
      ),
      hatMaterial
    );

  hat.position.y = 7.45;

  hat.rotation.z = -0.12;

  hat.castShadow = true;

  group.add(hat);


  /* -------------------------
     MAGIC GLOW
     ------------------------- */

  const glow =
    new THREE.PointLight(
      0x55baff,
      1.2,
      5
    );

  glow.position.set(
    1.6,
    3.2,
    -0.2
  );

  group.add(glow);


  /* FINAL POSITION */

  group.position.set(
    player.x,
    0,
    player.z
  );

  group.rotation.y =
    player.yaw;

  scene.add(group);

  return group;
}


wizard = createWizard();


/* =========================================================
   ENEMY CREATURE
   ========================================================= */

function createEnemy(
  x,
  z,
  type = 0
) {

  const group =
    new THREE.Group();


  const bodyColors = [
    0x46383b,
    0x263f38,
    0x403b52
  ];


  const bodyMaterial =
    new THREE.MeshStandardMaterial({
      color: bodyColors[type],
      roughness: 0.92
    });


  /* BODY */

  const body =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        1.25,
        14,
        12
      ),
      bodyMaterial
    );

  body.scale.set(
    1,
    1.25,
    0.8
  );

  body.position.y = 1.6;

  body.castShadow = true;

  group.add(body);


  /* HEAD */

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.9,
        14,
        12
      ),
      bodyMaterial
    );

  head.position.y = 3.25;

  head.castShadow = true;

  group.add(head);


  /* EYES */

  const eyeMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xff3b30
    });


  for (const side of [-1, 1]) {

    const eye =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.13,
          8,
          8
        ),
        eyeMaterial
      );

    eye.position.set(
      side * 0.32,
      3.35,
      -0.75
    );

    group.add(eye);
  }


  /* HORNS */

  if (type !== 1) {

    for (const side of [-1, 1]) {

      const horn =
        new THREE.Mesh(
          new THREE.ConeGeometry(
            0.2,
            1.0,
            8
          ),
          new THREE.MeshStandardMaterial({
            color: 0x171719,
            roughness: 0.9
          })
        );

      horn.position.set(
        side * 0.48,
        4.05,
        0
      );

      horn.rotation.z =
        side * -0.35;

      horn.castShadow = true;

      group.add(horn);
    }
  }


  /* ARMS */

  for (const side of [-1, 1]) {

    const arm =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.25,
          0.34,
          1.8,
          9
        ),
        bodyMaterial
      );

    arm.position.set(
      side * 1.25,
      1.9,
      0
    );

    arm.rotation.z =
      side * 0.65;

    arm.castShadow = true;

    group.add(arm);
  }


  /* LEGS */

  for (const side of [-1, 1]) {

    const leg =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.3,
          0.38,
          1.6,
          9
        ),
        bodyMaterial
      );

    leg.position.set(
      side * 0.48,
      0.55,
      0
    );

    leg.castShadow = true;

    group.add(leg);
  }


  /* HEALTH BAR */

  const healthGroup =
    new THREE.Group();

  healthGroup.position.y = 4.7;


  const healthBack =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        2.3,
        0.22
      ),
      new THREE.MeshBasicMaterial({
        color: 0x151515
      })
    );

  healthGroup.add(healthBack);


  const health =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        2.1,
        0.14
      ),
      new THREE.MeshBasicMaterial({
        color: 0xe63946
      })
    );

  health.position.z = 0.01;

  healthGroup.add(health);

  group.add(healthGroup);


  /* ENEMY DATA */

  group.position.set(
    x,
    0,
    z
  );

  scene.add(group);


  enemies.push({

    mesh: group,

    hp: 100,

    healthMesh: health,

    speed:
      0.025 +
      Math.random() * 0.018,

    attackTimer: 0,

    type
  });
}


/* =========================================================
   CREATE ENEMIES
   ========================================================= */

createEnemy(
  18,
  -5,
  0
);

createEnemy(
  -20,
  15,
  1
);

createEnemy(
  30,
  -30,
  2
);

createEnemy(
  -35,
  -5,
  0
);

createEnemy(
  45,
  12,
  1);


/* =========================================================
   SPELL CREATION
   ========================================================= */

function castSpell() {

  const now =
    performance.now();

  if (
    now - lastSpellTime < 450
  ) {
    return;
  }

  if (player.magic < 10) {

    showMessage(
      "Not enough magic!"
    );

    return;
  }

  lastSpellTime = now;

  player.magic -= 10;


  const spell =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.22,
        12,
        12
      ),
      new THREE.MeshBasicMaterial({
        color: 0x78d9ff
      })
    );


  const light =
    new THREE.PointLight(
      0x55ccff,
      3,
      6
    );

  spell.add(light);


  const direction =
    new THREE.Vector3(
      0,
      0,
      -1
    );

  direction.applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    player.yaw
  );


  spell.position.set(
    player.x +
      direction.x * 1.4,

    3.5,

    player.z +
      direction.z * 1.4
  );


  scene.add(spell);


  spells.push({

    mesh: spell,

    velocity:
      direction.multiplyScalar(0.75),

    life: 0,

    damage: 25
  });


  updateHUD();
}


/* =========================================================
   SPELL IMPACT
   ========================================================= */

function createImpact(position) {

  const ring =
    new THREE.Mesh(
      new THREE.RingGeometry(
        0.1,
        0.6,
        20
      ),
      new THREE.MeshBasicMaterial({
        color: 0x79e7ff,

        transparent: true,

        opacity: 0.9,

        side: THREE.DoubleSide
      })
    );

  ring.rotation.x =
    -Math.PI / 2;

  ring.position.copy(position);

  scene.add(ring);


  effects.push({

    mesh: ring,

    life: 0,

    maxLife: 25
  });
}


/* =========================================================
   ENEMY AI
   ========================================================= */

function updateEnemies(delta) {

  for (const enemy of enemies) {

    const mesh =
      enemy.mesh;


    const dx =
      player.x - mesh.position.x;

    const dz =
      player.z - mesh.position.z;

    const distance =
      Math.sqrt(
        dx * dx +
        dz * dz
      );


    /* FACE PLAYER */

    mesh.rotation.y =
      Math.atan2(
        dx,
        dz
      );


    /* CHASE */

    if (
      distance < 35 &&
      distance > 3
    ) {

      mesh.position.x +=
        (dx / distance) *
        enemy.speed *
        delta *
        60;

      mesh.position.z +=
        (dz / distance) *
        enemy.speed *
        delta *
        60;
    }


    /* ATTACK */

    if (
      distance < 3.5
    ) {

      enemy.attackTimer -=
        delta;

      if (
        enemy.attackTimer <= 0
      ) {

        player.hp -= 5;

        enemy.attackTimer = 1.5;

        showMessage(
          "A creature attacked you!"
        );

        updateHUD();

        if (
          player.hp <= 0
        ) {

          player.hp = 100;

          player.x = 0;
          player.z = 8;

          showMessage(
            "You were defeated. You return to the castle."
          );

          updateHUD();
        }
      }
    }


    /* FLOATING HEALTH BAR */

    enemy.healthMesh.scale.x =
      Math.max(
        0,
        enemy.hp / 100
      );

    enemy.healthMesh.position.x =
      -(2.1 *
        (1 -
          enemy.hp / 100)) /
      2;
  }
}


/* =========================================================
   UPDATE SPELLS
   ========================================================= */

function updateSpells(delta) {

  for (
    let i = spells.length - 1;
    i >= 0;
    i--
  ) {

    const spell =
      spells[i];

    spell.mesh.position.add(
      spell.velocity
    );

    spell.life += delta;


    let hit = false;


    for (
      const enemy of enemies
    ) {

      if (
        enemy.hp <= 0
      ) {
        continue;
      }


      const distance =
        spell.mesh.position.distanceTo(
          enemy.mesh.position
        );


      if (
        distance < 2.3
      ) {

        enemy.hp -=
          spell.damage;

        createImpact(
          enemy.mesh.position.clone()
        );

        hit = true;


        if (
          enemy.hp <= 0
        ) {

          player.xp += 25;

          showMessage(
            "+25 XP — Creature defeated!"
          );

          updateHUD();

          enemy.mesh.visible =
            false;
        }

        break;
      }
    }


    if (
      spell.life > 3 ||
      hit
    ) {

      scene.remove(
        spell.mesh
      );

      spells.splice(
        i,
        1
      );
    }
  }
}


/* =========================================================
   EFFECTS
   ========================================================= */

function updateEffects() {

  for (
    let i = effects.length - 1;
    i >= 0;
    i--
  ) {

    const effect =
      effects[i];

    effect.life++;

    effect.mesh.scale.multiplyScalar(
      1.04
    );

    effect.mesh.material.opacity =
      Math.max(
        0,
        1 -
          effect.life /
            effect.maxLife
      );


    if (
      effect.life >=
      effect.maxLife
    ) {

      scene.remove(
        effect.mesh
      );

      effects.splice(
        i,
        1
      );
    }
  }
}


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function updatePlayer() {

  let moveX = joystickX;
  let moveZ = joystickY;


  /* KEYBOARD */

  if (
    keys["w"] ||
    keys["arrowup"]
  ) {
    moveZ -= 1;
  }

  if (
    keys["s"] ||
    keys["arrowdown"]
  ) {
    moveZ += 1;
  }

  if (
    keys["a"] ||
    keys["arrowleft"]
  ) {
    moveX -= 1;
  }

  if (
    keys["d"] ||
    keys["arrowright"]
  ) {
    moveX += 1;
  }


  const length =
    Math.sqrt(
      moveX * moveX +
      moveZ * moveZ
    );


  if (
    length > 1
  ) {

    moveX /= length;
    moveZ /= length;
  }


  const movement =
    new THREE.Vector3(
      moveX,
      0,
      moveZ
    );


  movement.applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    cameraYaw
  );


  player.x +=
    movement.x *
    player.speed;

  player.z +=
    movement.z *
    player.speed;


  /* FACE MOVEMENT */

  if (
    length > 0.1
  ) {

    player.yaw =
      Math.atan2(
        movement.x,
        movement.z
      );
  }


  /* GRAVITY */

  player.velocityY -=
    0.018;

  player.y +=
    player.velocityY;


  if (
    player.y <= 0
  ) {

    player.y = 0;

    player.velocityY = 0;

    player.grounded = true;
  }


  /* UPDATE WIZARD */

  if (wizard) {

    wizard.position.set(
      player.x,
      player.y,
      player.z
    );

    wizard.rotation.y =
      player.yaw;


    /* WALK ANIMATION */

    if (
      length > 0.1
    ) {

      const time =
        performance.now() *
        0.008;

      wizard.position.y =
        player.y +
        Math.abs(
          Math.sin(time)
        ) *
        0.08;
    }
  }
}


/* =========================================================
   JUMP
   ========================================================= */

function jump() {

  if (
    player.grounded
  ) {

    player.velocityY =
      0.34;

    player.grounded =
      false;
  }
}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera() {

  const distance = 12;

  const height = 6;


  const offset =
    new THREE.Vector3(
      Math.sin(cameraYaw) *
        distance,

      height +
        cameraPitch * 5,

      Math.cos(cameraYaw) *
        distance
    );


  const target =
    new THREE.Vector3(
      player.x,
      player.y + 3.0,
      player.z
    );


  camera.position.lerp(
    new THREE.Vector3(
      player.x + offset.x,
      player.y + offset.y,
      player.z + offset.z
    ),
    0.12
  );


  camera.lookAt(
    target
  );
}


/* =========================================================
   KEYBOARD
   ========================================================= */

const keys = {};

window.addEventListener(
  "keydown",
  (event) => {

    keys[
      event.key.toLowerCase()
    ] = true;

    if (
      event.key === " "
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
  (event) => {

    keys[
      event.key.toLowerCase()
    ] = false;
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


function moveJoystick(
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
    clientX -
    centerX;

  let dy =
    clientY -
    centerY;


  const maxDistance =
    rect.width * 0.34;


  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (
    distance > maxDistance
  ) {

    dx =
      (dx / distance) *
      maxDistance;

    dy =
      (dy / distance) *
      maxDistance;
  }


  joystickX =
    dx / maxDistance;

  joystickY =
    dy / maxDistance;


  joystickStick.style.transform =
    `translate(${dx}px, ${dy}px)`;
}


function resetJoystick() {

  joystickX = 0;
  joystickY = 0;

  joystickStick.style.transform =
    "translate(0px, 0px)";
}


joystickBase.addEventListener(
  "pointerdown",
  (event) => {

    joystickActive = true;

    joystickBase.setPointerCapture(
      event.pointerId
    );

    moveJoystick(
      event.clientX,
      event.clientY
    );
  }
);


joystickBase.addEventListener(
  "pointermove",
  (event) => {

    if (
      joystickActive
    ) {

      moveJoystick(
        event.clientX,
        event.clientY
      );
    }
  }
);


joystickBase.addEventListener(
  "pointerup",
  () => {

    joystickActive = false;

    resetJoystick();
  }
);


joystickBase.addEventListener(
  "pointercancel",
  () => {

    joystickActive = false;

    resetJoystick();
  }
);


/* =========================================================
   BUTTONS
   ========================================================= */

document
  .getElementById("jumpBtn")
  .addEventListener(
    "pointerdown",
    (event) => {

      event.preventDefault();

      jump();
    }
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


/* =========================================================
   CAMERA TOUCH SWIPE
   ========================================================= */

let cameraTouchX = 0;

let cameraTouchY = 0;

let cameraDragging = false;


renderer.domElement.addEventListener(
  "pointerdown",
  (event) => {

    cameraTouchX =
      event.clientX;

    cameraTouchY =
      event.clientY;

    cameraDragging = true;
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
      cameraTouchX;

    const dy =
      event.clientY -
      cameraTouchY;


    cameraYaw -=
      dx * 0.006;

    cameraPitch -=
      dy * 0.003;


    cameraPitch =
      THREE.MathUtils.clamp(
        cameraPitch,
        -0.1,
        0.8
      );


    cameraTouchX =
      event.clientX;

    cameraTouchY =
      event.clientY;
  }
);


renderer.domElement.addEventListener(
  "pointerup",
  () => {

    cameraDragging = false;
  }
);


/* =========================================================
   HUD
   ========================================================= */

const hpBar =
  document.getElementById(
    "hpBar"
  );

const magicBar =
  document.getElementById(
    "magicBar"
  );

const hpText =
  document.getElementById(
    "hpText"
  );

const magicText =
  document.getElementById(
    "magicText"
  );

const xpText =
  document.getElementById(
    "xpText"
  );


function updateHUD() {

  hpBar.style.width =
    `${player.hp}%`;

  magicBar.style.width =
    `${player.magic}%`;

  hpText.textContent =
    Math.round(player.hp);

  magicText.textContent =
    Math.round(player.magic);

  xpText.textContent =
    player.xp;
}


/* =========================================================
   MESSAGE
   ========================================================= */

let messageTimer = null;


function showMessage(text) {

  const message =
    document.getElementById(
      "message"
    );

  message.textContent =
    text;


  clearTimeout(
    messageTimer
  );


  messageTimer =
    setTimeout(
      () => {

        message.textContent =
          "";

      },
      2500
    );
}


/* =========================================================
   MAGIC REGENERATION
   ========================================================= */

let magicTimer = 0;

function regenerateMagic(
  delta
) {

  magicTimer += delta;

  if (
    magicTimer > 0.5
  ) {

    magicTimer = 0;

    if (
      player.magic < 100
    ) {

      player.magic =
        Math.min(
          100,
          player.magic + 1
        );

      updateHUD();
    }
  }
}


/* =========================================================
   WATER ANIMATION
   ========================================================= */

function animateWater(time) {

  if (
    !water.geometry.attributes.position
  ) {
    return;
  }


  const positions =
    water.geometry.attributes.position;


  for (
    let i = 0;
    i < positions.count;
    i++
  ) {

    const x =
      positions.getX(i);

    const z =
      positions.getZ(i);


    const y =
      Math.sin(
        x * 0.12 +
        time * 0.0015
      ) *
      0.035 +

      Math.sin(
        z * 0.16 +
        time * 0.001
      ) *
      0.025;


    positions.setY(
      i,
      y
    );
  }


  positions.needsUpdate = true;


  ripple.material.opacity =
    0.08 +
    Math.sin(
      time * 0.001
    ) *
    0.025;
}


/* =========================================================
   GAME LOOP
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
    performance.now();


  updatePlayer();

  updateEnemies(delta);

  updateSpells(delta);

  updateEffects();

  regenerateMagic(delta);

  updateCamera();

  animateWater(time);


  renderer.render(
    scene,
    camera
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
   INITIAL HUD
   ========================================================= */

updateHUD();


/* =========================================================
   LOADING SCREEN
   ========================================================= */

setTimeout(
  () => {

    const loading =
      document.getElementById(
        "loading"
      );

    if (loading) {

      loading.classList.add(
        "hidden"
      );
    }

  },
  1200
);


/* =========================================================
   START
   ========================================================= */

showMessage(
  "Welcome, young wizard!"
);

animate();
