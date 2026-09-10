/* =========================================================
   WIZARDING WORLD 3D — V4 REALISTIC ENVIRONMENT
   Three.js + PBR Ground + PBR Castle
   Mobile Friendly
   ========================================================= */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================================================
   BASIC SETUP
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x91b8d2);

scene.fog = new THREE.FogExp2(
  0x91b8d2,
  0.006
);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);

camera.position.set(
  0,
  6,
  14
);

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

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

document.body.appendChild(renderer.domElement);


/* =========================================================
   LOADING SCREEN
   ========================================================= */

const loading =
  document.getElementById("loading");

if (loading) {
  loading.innerText =
    "Loading magical world...";
}


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight =
  new THREE.HemisphereLight(
    0xd9edff,
    0x41523b,
    2.0
  );

scene.add(hemiLight);


const sun =
  new THREE.DirectionalLight(
    0xfff4dc,
    4.0
  );

sun.position.set(
  -40,
  70,
  35
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -80;
sun.shadow.camera.right = 80;
sun.shadow.camera.top = 80;
sun.shadow.camera.bottom = -80;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 180;

sun.shadow.bias = -0.0003;

scene.add(sun);


/* =========================================================
   TEXTURE LOADER
   ========================================================= */

const textureLoader =
  new THREE.TextureLoader();


function loadTexture(
  path,
  colorTexture = false
) {

  const texture =
    textureLoader.load(
      path,
      undefined,
      undefined,
      () => {
        console.warn(
          "Texture failed:",
          path
        );
      }
    );

  texture.wrapS =
    THREE.RepeatWrapping;

  texture.wrapT =
    THREE.RepeatWrapping;

  texture.anisotropy =
    Math.min(
      renderer.capabilities.getMaxAnisotropy(),
      8
    );

  if (colorTexture) {
    texture.colorSpace =
      THREE.SRGBColorSpace;
  }

  return texture;
}


/* =========================================================
   REALISTIC GROUND
   ========================================================= */

const groundDiffuse =
  loadTexture(
    "./assets/ground/diffuse.jpg",
    true
  );

const groundNormal =
  loadTexture(
    "./assets/ground/normal.jpg"
  );

const groundRough =
  loadTexture(
    "./assets/ground/rough.jpg"
  );

const groundDisp =
  loadTexture(
    "./assets/ground/disp.png"
  );


groundDiffuse.repeat.set(
  18,
  18
);

groundNormal.repeat.set(
  18,
  18
);

groundRough.repeat.set(
  18,
  18
);

groundDisp.repeat.set(
  18,
  18
);


/*
   Large geometry with moderate subdivisions.
   Enough for subtle displacement without
   destroying mobile performance.
*/

const groundGeometry =
  new THREE.PlaneGeometry(
    180,
    180,
    120,
    120
  );

groundGeometry.rotateX(
  -Math.PI / 2
);


/* =========================================================
   GROUND MATERIAL
   ========================================================= */

const groundMaterial =
  new THREE.MeshStandardMaterial({

    map: groundDiffuse,

    normalMap: groundNormal,

    roughnessMap: groundRough,

    displacementMap: groundDisp,

    displacementScale: 0.12,

    roughness: 0.92,

    metalness: 0.0
  });


const ground =
  new THREE.Mesh(
    groundGeometry,
    groundMaterial
  );

ground.position.y = -0.15;

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   CASTLE PBR TEXTURES
   ========================================================= */

const castleDiffuse =
  loadTexture(
    "./assets/castle/diffuse.jpg",
    true
  );

const castleNormal =
  loadTexture(
    "./assets/castle/normal.jpg"
  );

const castleRough =
  loadTexture(
    "./assets/castle/rough.jpg"
  );

const castleAO =
  loadTexture(
    "./assets/castle/ao.jpg"
  );

const castleDisp =
  loadTexture(
    "./assets/castle/disp.png"
  );


castleDiffuse.repeat.set(
  2,
  2
);

castleNormal.repeat.set(
  2,
  2
);

castleRough.repeat.set(
  2,
  2
);

castleAO.repeat.set(
  2,
  2
);

castleDisp.repeat.set(
  2,
  2
);


/* =========================================================
   CASTLE MATERIAL
   ========================================================= */

const castleMaterial =
  new THREE.MeshStandardMaterial({

    map: castleDiffuse,

    normalMap: castleNormal,

    roughnessMap: castleRough,

    aoMap: castleAO,

    displacementMap: castleDisp,

    displacementScale: 0.025,

    roughness: 0.82,

    metalness: 0.0
  });


/* =========================================================
   CASTLE GROUP
   ========================================================= */

const castle =
  new THREE.Group();

castle.position.set(
  0,
  0,
  -65
);

scene.add(castle);


/* =========================================================
   CASTLE MAIN BUILDING
   ========================================================= */

const castleBodyGeometry =
  new THREE.BoxGeometry(
    30,
    18,
    16,
    2,
    2,
    2
  );

const castleBody =
  new THREE.Mesh(
    castleBodyGeometry,
    castleMaterial
  );

castleBody.position.y = 9;

castleBody.castShadow = true;
castleBody.receiveShadow = true;

castle.add(castleBody);


/* =========================================================
   CASTLE TOWERS
   ========================================================= */

function createTower(
  x,
  z,
  height = 30
) {

  const towerGroup =
    new THREE.Group();

  const towerGeometry =
    new THREE.CylinderGeometry(
      4.2,
      5,
      height,
      16,
      3
    );

  const tower =
    new THREE.Mesh(
      towerGeometry,
      castleMaterial
    );

    tower.position.y =
      height / 2;

    tower.castShadow = true;
    tower.receiveShadow = true;

    towerGroup.add(tower);


    /* Tower roof */

    const roofGeometry =
      new THREE.ConeGeometry(
        5.8,
        8,
        16
      );

    const roofMaterial =
      new THREE.MeshStandardMaterial({

        color: 0x20262d,

        roughness: 0.75,

        metalness: 0.05
      });

    const roof =
      new THREE.Mesh(
        roofGeometry,
        roofMaterial
      );

    roof.position.y =
      height + 4;

    roof.castShadow = true;

    towerGroup.add(roof);


    towerGroup.position.set(
      x,
      0,
      z
    );

    castle.add(
      towerGroup
    );
}


/* Four large towers */

createTower(
  -14,
  -5,
  31
);

createTower(
  14,
  -5,
  31
);

createTower(
  -14,
  8,
  27
);

createTower(
  14,
  8,
  27
);


/* =========================================================
   CASTLE CENTRAL ROOF
   ========================================================= */

const mainRoofGeometry =
  new THREE.ConeGeometry(
    17,
    12,
    4
  );

const mainRoofMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x242a32,

    roughness: 0.7,

    metalness: 0.08
  });

const mainRoof =
  new THREE.Mesh(
    mainRoofGeometry,
    mainRoofMaterial
  );

mainRoof.position.set(
  0,
  25,
  -65
);

mainRoof.rotation.y =
  Math.PI / 4;

mainRoof.castShadow = true;

scene.add(mainRoof);


/* =========================================================
   CASTLE WINDOWS
   ========================================================= */

const windowMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x87c9df,

    emissive: 0x244e60,

    emissiveIntensity: 0.7,

    roughness: 0.3,

    metalness: 0.1
  });


function addWindow(
  x,
  y,
  z
) {

  const geometry =
    new THREE.BoxGeometry(
      1.6,
      3,
      0.25
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      windowMaterial
    );

  mesh.position.set(
    x,
    y,
    z
  );

  castle.add(mesh);
}


/* Front windows */

for (
  let x = -10;
  x <= 10;
  x += 5
) {

  addWindow(
    x,
    10,
    -73.1
  );

  addWindow(
    x,
    15,
    -73.1
  );
}


/* =========================================================
   MOUNTAINS
   ========================================================= */

function createMountain(
  x,
  z,
  height,
  width
) {

  const geometry =
    new THREE.ConeGeometry(
      width,
      height,
      32,
      4
    );

  const material =
    new THREE.MeshStandardMaterial({

      color: 0x596b62,

      roughness: 0.95,

      metalness: 0.0
    });

  const mountain =
    new THREE.Mesh(
      geometry,
      material
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
  -65,
  -95,
  70,
  40
);

createMountain(
  65,
  -105,
  85,
  45
);

createMountain(
  -90,
  -150,
  110,
  60
);

createMountain(
  90,
  -170,
  120,
  65
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

  const geometry =
    new THREE.DodecahedronGeometry(
      scale,
      1
    );

  const material =
    new THREE.MeshStandardMaterial({

      color: 0x59605a,

      roughness: 0.92,

      metalness: 0
    });

  const rock =
    new THREE.Mesh(
      geometry,
      material
    );

  rock.position.set(
    x,
    y,
    z
  );

  rock.rotation.set(
    Math.random(),
    Math.random(),
    Math.random()
  );

  rock.castShadow = true;

  rock.receiveShadow = true;

  scene.add(rock);
}


/* Natural scattered rocks */

for (
  let i = 0;
  i < 35;
  i++
) {

  const side =
    Math.random() < 0.5
      ? -1
      : 1;

  const x =
    side *
    (20 + Math.random() * 55);

  const z =
    -10 -
    Math.random() * 130;

  createRock(
    x,
    0.4,
    z,
    0.5 +
    Math.random() * 1.3
  );
}


/* =========================================================
   WATER
   ========================================================= */

const waterGeometry =
  new THREE.PlaneGeometry(
    95,
    70,
    32,
    32
  );

waterGeometry.rotateX(
  -Math.PI / 2
);


const waterMaterial =
  new THREE.MeshPhysicalMaterial({

    color: 0x285d75,

    roughness: 0.16,

    metalness: 0.08,

    transparent: true,

    opacity: 0.72,

    transmission: 0.05,

    clearcoat: 0.8,

    clearcoatRoughness: 0.15
  });


const water =
  new THREE.Mesh(
    waterGeometry,
    waterMaterial
  );

water.position.set(
  0,
  -0.05,
  -30
);

water.receiveShadow = true;

scene.add(water);


/* =========================================================
   REAL TREE MODEL
   ========================================================= */

const gltfLoader =
  new GLTFLoader();

let realTree = null;


gltfLoader.load(
  "./assets/tree.glb",

  (gltf) => {

    realTree =
      gltf.scene;

    realTree.scale.set(
      3.5,
      3.5,
      3.5
    );

    realTree.position.set(
      -18,
      0,
      -20
    );

    realTree.traverse(
      (object) => {

        if (
          object.isMesh
        ) {

          object.castShadow =
            true;

          object.receiveShadow =
            true;
        }
      }
    );

    scene.add(
      realTree
    );


    /* Additional trees */

    const treePositions = [

      [18, -28, 4],
      [-28, -45, 4.5],
      [32, -55, 5],
      [-42, -70, 5],
      [40, -85, 5.5],
      [-52, -105, 6],
      [55, -125, 6]
    ];


    treePositions.forEach(
      (pos) => {

        const clone =
          realTree.clone(
            true
          );

        clone.position.set(
          pos[0],
          0,
          pos[1]
        );

        const s =
          pos[2] / 4;

        clone.scale.set(
          s,
          s,
          s
        );

        scene.add(
          clone
        );
      }
    );


    if (loading) {
      loading.style.display =
        "none";
    }
  },

  undefined,

  (error) => {

    console.error(
      "Tree loading error:",
      error
    );

    if (loading) {
      loading.innerText =
        "World loaded";
    }
  }
);


/* =========================================================
   PLAYER / WIZARD
   ========================================================= */

const player =
  new THREE.Group();

player.position.set(
  0,
  0,
  8
);

scene.add(player);


/* Body */

const bodyGeometry =
  new THREE.CylinderGeometry(
    0.7,
    0.9,
    2.2,
    16
  );

const robeMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x171c2b,

    roughness: 0.85,

    metalness: 0.0
  });

const body =
  new THREE.Mesh(
    bodyGeometry,
    robeMaterial
  );

body.position.y = 1.1;

body.castShadow = true;

player.add(body);


/* Head */

const headGeometry =
  new THREE.SphereGeometry(
    0.48,
    20,
    20
  );

const skinMaterial =
  new THREE.MeshStandardMaterial({

    color: 0xb87959,

    roughness: 0.75
  });

const head =
  new THREE.Mesh(
    headGeometry,
    skinMaterial
  );

head.position.y = 2.65;

head.castShadow = true;

player.add(head);


/* Hat */

const hatMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x10121b,

    roughness: 0.9
  });

const hatGeometry =
  new THREE.ConeGeometry(
    0.65,
    1.25,
    20
  );

const hat =
  new THREE.Mesh(
    hatGeometry,
    hatMaterial
  );

hat.position.y = 3.55;

hat.castShadow = true;

player.add(hat);


/* =========================================================
   STAFF
   ========================================================= */

const staffGeometry =
  new THREE.CylinderGeometry(
    0.055,
    0.08,
    2.8,
    10
  );

const staffMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x4d2d18,

    roughness: 0.9
  });

const staff =
  new THREE.Mesh(
    staffGeometry,
    staffMaterial
  );

staff.position.set(
  0.9,
  1.5,
  0
);

staff.rotation.z =
  -0.15;

staff.castShadow = true;

player.add(staff);


/* =========================================================
   MAGIC ORB
   ========================================================= */

const orbGeometry =
  new THREE.SphereGeometry(
    0.13,
    16,
    16
  );

const orbMaterial =
  new THREE.MeshBasicMaterial({

    color: 0x8ddcff
  });

const orb =
  new THREE.Mesh(
    orbGeometry,
    orbMaterial
  );

orb.position.set(
  0.9,
  2.9,
  0
);

player.add(orb);


/* =========================================================
   ENEMY
   ========================================================= */

const enemies = [];


function createEnemy(
  x,
  z
) {

  const enemy =
    new THREE.Group();

  enemy.position.set(
    x,
    0,
    z
  );


  const bodyGeo =
    new THREE.CylinderGeometry(
      0.7,
      0.85,
      2,
      12
    );

  const enemyMat =
    new THREE.MeshStandardMaterial({

      color: 0x351b22,

      roughness: 0.95
    });

  const enemyBody =
    new THREE.Mesh(
      bodyGeo,
      enemyMat
    );

  enemyBody.position.y = 1;

  enemyBody.castShadow = true;

  enemy.add(enemyBody);


  const headGeo =
    new THREE.SphereGeometry(
      0.45,
      16,
      16
    );

  const enemyHead =
    new THREE.Mesh(
      headGeo,
      enemyMat
    );

  enemyHead.position.y =
    2.35;

  enemyHead.castShadow = true;

  enemy.add(enemyHead);


  scene.add(enemy);

  enemies.push(enemy);
}


createEnemy(
  -10,
  -12
);

createEnemy(
  12,
  -25
);

createEnemy(
  -16,
  -42
);


/* =========================================================
   SPELL PROJECTILES
   ========================================================= */

const spells = [];


function castSpell() {

  const geometry =
    new THREE.SphereGeometry(
      0.18,
      16,
      16
    );

  const material =
    new THREE.MeshBasicMaterial({

      color: 0x72d7ff
    });

  const spell =
    new THREE.Mesh(
      geometry,
      material
    );


  const direction =
    new THREE.Vector3(
      0,
      0,
      -1
    );

  direction.applyQuaternion(
    player.quaternion
  );


  spell.position.copy(
    player.position
  );

  spell.position.y +=
    2.2;


  scene.add(spell);


  spells.push({
    mesh: spell,
    velocity:
      direction.multiplyScalar(
        0.8
      ),
    life: 180
  });
}


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

const keys = {};

window.addEventListener(
  "keydown",
  (event) => {

    keys[event.key.toLowerCase()] =
      true;

    if (
      event.key === " "
    ) {

      jump();
    }

    if (
      event.key.toLowerCase() ===
      "f"
    ) {

      castSpell();
    }
  }
);


window.addEventListener(
  "keyup",
  (event) => {

    keys[event.key.toLowerCase()] =
      false;
  }
);


/* =========================================================
   JUMP
   ========================================================= */

let verticalVelocity = 0;

let isGrounded = true;


function jump() {

  if (
    !isGrounded
  ) {
    return;
  }

  verticalVelocity =
    0.42;

  isGrounded =
    false;
}


const jumpButton =
  document.getElementById(
    "jumpBtn"
  );

if (jumpButton) {

  jumpButton.addEventListener(
    "touchstart",
    (event) => {

      event.preventDefault();

      jump();
    },
    {
      passive: false
    }
  );

  jumpButton.addEventListener(
    "click",
    jump
  );
}


/* =========================================================
   SPELL BUTTON
   ========================================================= */

const spellButton =
  document.getElementById(
    "spellBtn"
  );

if (spellButton) {

  spellButton.addEventListener(
    "touchstart",
    (event) => {

      event.preventDefault();

      castSpell();
    },
    {
      passive: false
    }
  );

  spellButton.addEventListener(
    "click",
    castSpell
  );
}


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


let joystickX = 0;
let joystickY = 0;

let joystickActive =
  false;


if (
  joystickBase &&
  joystickStick
) {

  joystickBase.addEventListener(
    "touchstart",
    (event) => {

      joystickActive =
        true;
    },
    {
      passive: true
    }
  );


  joystickBase.addEventListener(
    "touchmove",
    (event) => {

      if (
        !joystickActive
      ) {
        return;
      }

      const touch =
        event.touches[0];

      const rect =
        joystickBase.getBoundingClientRect();

      const centerX =
        rect.left +
        rect.width / 2;

      const centerY =
        rect.top +
        rect.height / 2;

      let dx =
        touch.clientX -
        centerX;

      let dy =
        touch.clientY -
        centerY;


      const radius =
        rect.width / 2;


      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      if (
        distance > radius
      ) {

        dx =
          dx /
          distance *
          radius;

        dy =
          dy /
          distance *
          radius;
      }


      joystickX =
        dx / radius;

      joystickY =
        dy / radius;


      joystickStick.style.transform =
        `translate(${dx}px, ${dy}px)`;
    },
    {
      passive: true
    }
  );


  joystickBase.addEventListener(
    "touchend",
    () => {

      joystickActive =
        false;

      joystickX = 0;
      joystickY = 0;

      joystickStick.style.transform =
        "translate(0px, 0px)";
    }
  );
}


/* =========================================================
   CAMERA
   ========================================================= */

let cameraYaw = 0;

let cameraPitch = 0.15;

let swipeActive =
  false;

let lastTouchX = 0;
let lastTouchY = 0;


window.addEventListener(
  "touchstart",
  (event) => {

    if (
      event.touches.length !== 1
    ) {
      return;
    }

    const target =
      event.target;

    if (
      target.closest(
        "#joystickBase"
      ) ||
      target.closest(
        "#jumpBtn"
      ) ||
      target.closest(
        "#spellBtn"
      )
    ) {
      return;
    }

    swipeActive = true;

    lastTouchX =
      event.touches[0].clientX;

    lastTouchY =
      event.touches[0].clientY;
  },
  {
    passive: true
  }
);


window.addEventListener(
  "touchmove",
  (event) => {

    if (
      !swipeActive
    ) {
      return;
    }

    const touch =
      event.touches[0];

    const dx =
      touch.clientX -
      lastTouchX;

    const dy =
      touch.clientY -
      lastTouchY;

    cameraYaw -=
      dx * 0.004;

    cameraPitch -=
      dy * 0.003;

    cameraPitch =
      THREE.MathUtils.clamp(
        cameraPitch,
        -0.1,
        0.65
      );

    lastTouchX =
      touch.clientX;

    lastTouchY =
      touch.clientY;
  },
  {
    passive: true
  }
);


window.addEventListener(
  "touchend",
  () => {

    swipeActive = false;
  }
);


/* =========================================================
   HUD
   ========================================================= */

let hp = 100;

let magic = 100;

let xp = 0;


function updateHUD() {

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


  if (hpBar) {

    hpBar.style.width =
      hp + "%";
  }

  if (magicBar) {

    magicBar.style.width =
      magic + "%";
  }

  if (hpText) {

    hpText.innerText =
      "HP " +
      Math.round(hp);
  }

  if (magicText) {

    magicText.innerText =
      "Magic " +
      Math.round(magic);
  }

  if (xpText) {

    xpText.innerText =
      "XP " +
      Math.round(xp);
  }
}


/* =========================================================
   PLAYER UPDATE
   ========================================================= */

function updatePlayer() {

  let moveX =
    joystickX;

  let moveZ =
    joystickY;


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


  const movement =
    new THREE.Vector3(
      moveX,
      0,
      moveZ
    );


  if (
    movement.length() > 1
  ) {

    movement.normalize();
  }


  const speed =
    0.18;


  /* Camera-relative movement */

  const forward =
    new THREE.Vector3(
      -Math.sin(cameraYaw),
      0,
      -Math.cos(cameraYaw)
    );

  const right =
    new THREE.Vector3(
      Math.cos(cameraYaw),
      0,
      -Math.sin(cameraYaw)
    );


  const finalMovement =
    new THREE.Vector3();


  finalMovement.addScaledVector(
    right,
    movement.x
  );

  finalMovement.addScaledVector(
    forward,
    -movement.z
  );


  if (
    finalMovement.length() > 0
  ) {

    finalMovement.normalize();

    player.position.addScaledVector(
      finalMovement,
      speed
    );


    player.rotation.y =
      Math.atan2(
        finalMovement.x,
        finalMovement.z
      );
  }


  /* Gravity */

  verticalVelocity -=
    0.018;

  player.position.y +=
    verticalVelocity;


  if (
    player.position.y <= 0
  ) {

    player.position.y = 0;

    verticalVelocity = 0;

    isGrounded = true;
  }


  /* World boundaries */

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -75,
      75
    );

  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -150,
      25
    );
}


/* =========================================================
   ENEMY UPDATE
   ========================================================= */

function updateEnemies() {

  enemies.forEach(
    (enemy) => {

      const distance =
        enemy.position.distanceTo(
          player.position
        );


      if (
        distance < 20
      ) {

        const direction =
          new THREE.Vector3()
            .subVectors(
              player.position,
              enemy.position
            )
            .normalize();

        direction.y = 0;


        enemy.position.addScaledVector(
          direction,
          0.025
        );


        enemy.lookAt(
          player.position.x,
          enemy.position.y,
          player.position.z
        );
      }
    }
  );
}


/* =========================================================
   SPELL UPDATE
   ========================================================= */

function updateSpells() {

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

    spell.life--;


    /* Enemy collision */

    enemies.forEach(
      (enemy) => {

        if (
          spell.mesh.position.distanceTo(
            enemy.position
          ) < 1.4
        ) {

          enemy.position.y =
            -100;

          xp += 10;

          spell.life = 0;
        }
      }
    );


    if (
      spell.life <= 0
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
   CAMERA FOLLOW
   ========================================================= */

function updateCamera() {

  const distance = 10;

  const height = 5.5;


  const offset =
    new THREE.Vector3(
      Math.sin(cameraYaw) *
        distance,

      height +
        cameraPitch * 4,

      Math.cos(cameraYaw) *
        distance
    );


  const desiredPosition =
    player.position
      .clone()
      .add(offset);


  camera.position.lerp(
    desiredPosition,
    0.12
  );


  const target =
    player.position
      .clone();

  target.y += 2;


  camera.lookAt(
    target
  );
}


/* =========================================================
   MAGIC REGENERATION
   ========================================================= */

function updateMagic() {

  magic += 0.035;

  if (
    magic > 100
  ) {
    magic = 100;
  }
}


/* =========================================================
   ANIMATION
   ========================================================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const delta =
    clock.getDelta();


  updatePlayer();

  updateEnemies();

  updateSpells();

  updateCamera();

  updateMagic();

  updateHUD();


  /* Magic orb animation */

  orb.position.y =
    2.9 +
    Math.sin(
      performance.now() *
      0.004
    ) *
    0.08;


  /* Very subtle water movement */

  water.rotation.z =
    Math.sin(
      performance.now() *
      0.0002
    ) *
    0.002;


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
   START
   ========================================================= */

updateHUD();

animate();
