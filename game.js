import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


/* =========================================================
   SCENE
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x86b8dc);

scene.fog = new THREE.Fog(
  0x86b8dc,
  90,
  420
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

camera.position.set(0, 5.5, 15);


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
  Math.min(window.devicePixelRatio, 1.25)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

document.body.appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
========================================================= */

const hemi = new THREE.HemisphereLight(
  0xbfe5ff,
  0x40502f,
  2.2
);

scene.add(hemi);


const sun = new THREE.DirectionalLight(
  0xfff1d0,
  4
);

sun.position.set(
  -80,
  120,
  70
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
   GROUND
========================================================= */

const groundGeometry =
  new THREE.PlaneGeometry(
    600,
    600,
    80,
    80
  );

const groundPosition =
  groundGeometry.attributes.position;

for (
  let i = 0;
  i < groundPosition.count;
  i++
) {

  const x =
    groundPosition.getX(i);

  const y =
    groundPosition.getY(i);

  const height =
    Math.sin(x * 0.035) * 1.2 +
    Math.cos(y * 0.045) * 1.0;

  groundPosition.setZ(i, height);
}

groundGeometry.computeVertexNormals();


const groundMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x52784a,
    roughness: 1,
    metalness: 0
  });


const ground =
  new THREE.Mesh(
    groundGeometry,
    groundMaterial
  );

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   ROAD
========================================================= */

const roadMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x81745e,
    roughness: 1
  });

const road =
  new THREE.Mesh(
    new THREE.PlaneGeometry(
      16,
      250
    ),
    roadMaterial
  );

road.rotation.x = -Math.PI / 2;

road.position.set(
  0,
  0.03,
  -80
);

scene.add(road);


/* =========================================================
   WATER
========================================================= */

const waterMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x3b8eaa,
    transparent: true,
    opacity: 0.72,
    roughness: 0.15,
    metalness: 0.05
  });

const lake =
  new THREE.Mesh(
    new THREE.PlaneGeometry(
      100,
      80
    ),
    waterMaterial
  );

lake.rotation.x = -Math.PI / 2;

lake.position.set(
  75,
  0.15,
  -45
);

scene.add(lake);


/* =========================================================
   MOUNTAINS
========================================================= */

function createMountain(
  x,
  z,
  scale
) {

  const mountain =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        30,
        65,
        9
      ),
      new THREE.MeshStandardMaterial({
        color: 0x53665a,
        roughness: 1
      })
    );

  mountain.position.set(
    x,
    30,
    z
  );

  mountain.scale.setScalar(scale);

  mountain.castShadow = true;
  mountain.receiveShadow = true;

  scene.add(mountain);
}


createMountain(-115, -150, 1.7);
createMountain(-65, -190, 2.2);
createMountain(0, -220, 2.7);
createMountain(70, -190, 2.0);
createMountain(125, -150, 1.8);


/* =========================================================
   CASTLE
========================================================= */

function createCastle() {

  const castle =
    new THREE.Group();

  castle.position.set(
    0,
    0,
    -105
  );


  const stone =
    new THREE.MeshStandardMaterial({
      color: 0x77777b,
      roughness: 0.9
    });


  const darkStone =
    new THREE.MeshStandardMaterial({
      color: 0x55565b,
      roughness: 1
    });


  const main =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        55,
        30,
        30
      ),
      stone
    );

  main.position.y = 15;

  main.castShadow = true;
  main.receiveShadow = true;

  castle.add(main);


  function tower(x, z) {

    const t =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          7,
          8,
          38,
          12
        ),
        darkStone
      );

    t.position.set(
      x,
      19,
      z
    );

    t.castShadow = true;
    t.receiveShadow = true;

    castle.add(t);


    const roof =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          9,
          13,
          12
        ),
        new THREE.MeshStandardMaterial({
          color: 0x303846,
          roughness: 0.8
        })
      );

    roof.position.set(
      x,
      44,
      z
    );

    roof.castShadow = true;

    castle.add(roof);
  }


  tower(-28, -14);
  tower(28, -14);
  tower(-28, 14);
  tower(28, 14);


  const door =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        7,
        12,
        1
      ),
      new THREE.MeshStandardMaterial({
        color: 0x251c18,
        roughness: 0.9
      })
    );

  door.position.set(
    0,
    6,
    15.3
  );

  castle.add(door);


  for (
    let x = -20;
    x <= 20;
    x += 10
  ) {

    const window =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          3,
          5,
          0.7
        ),
        new THREE.MeshStandardMaterial({
          color: 0x92c9df,
          emissive: 0x224455,
          emissiveIntensity: 0.5
        })
      );

    window.position.set(
      x,
      17,
      15.5
    );

    castle.add(window);
  }


  scene.add(castle);
}

createCastle();


/* =========================================================
   REAL 3D TREE
========================================================= */

let realTree = null;

const loader =
  new GLTFLoader();


loader.load(

  "./assets/tree.glb",

  function(gltf) {

    realTree = gltf.scene;

    realTree.traverse(
      function(object) {

        if (
          object.isMesh
        ) {

          object.castShadow = true;
          object.receiveShadow = true;

          object.frustumCulled = true;

        }

      }
    );


    /*
      The downloaded model may have a different
      original size, so calculate its dimensions.
    */

    const box =
      new THREE.Box3()
        .setFromObject(realTree);

    const size =
      new THREE.Vector3();

    box.getSize(size);


    if (size.y > 0) {

      const desiredHeight = 14;

      const scale =
        desiredHeight / size.y;

      realTree.scale.setScalar(
        scale
      );
    }


    /*
      Put the real tree beside
      the player.
    */

    realTree.position.set(
      -13,
      0,
      2
    );


    scene.add(realTree);


    /*
      Second tree far away.
      We use only two copies to
      protect mobile performance.
    */

    const secondTree =
      realTree.clone(true);

    secondTree.position.set(
      18,
      0,
      -35
    );

    secondTree.scale.copy(
      realTree.scale
    );

    scene.add(secondTree);

  },

  undefined,

  function(error) {

    console.error(
      "TREE LOAD ERROR:",
      error
    );

    showMessage(
      "Tree model could not load"
    );

  }
);


/* =========================================================
   FALLBACK SMALL TREES
========================================================= */

function createFallbackTree(
  x,
  z,
  scale = 1
) {

  const group =
    new THREE.Group();


  const trunk =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.45,
        0.7,
        4,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x60452e,
        roughness: 1
      })
    );

  trunk.position.y = 2;

  trunk.castShadow = true;

  group.add(trunk);


  const leaves =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        2.8,
        10,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x315f32,
        roughness: 1
      })
    );

  leaves.position.y = 5;

  leaves.castShadow = true;

  group.add(leaves);


  group.position.set(
    x,
    0,
    z
  );

  group.scale.setScalar(
    scale
  );

  scene.add(group);
}


/*
  Distant fallback vegetation.
  These remain until we later replace
  the whole environment with real assets.
*/

createFallbackTree(-35, -45, 2);
createFallbackTree(35, -60, 2);
createFallbackTree(-50, -80, 2.5);
createFallbackTree(48, -95, 2.3);


/* =========================================================
   ROCKS
========================================================= */

function createRock(
  x,
  z,
  scale
) {

  const rock =
    new THREE.Mesh(
      new THREE.DodecahedronGeometry(
        2,
        1
      ),
      new THREE.MeshStandardMaterial({
        color: 0x62665f,
        roughness: 1
      })
    );

  rock.position.set(
    x,
    1,
    z
  );

  rock.scale.set(
    scale * 1.4,
    scale,
    scale
  );

  rock.rotation.y =
    Math.random() * Math.PI;

  rock.castShadow = true;
  rock.receiveShadow = true;

  scene.add(rock);
}


createRock(-8, -18, 1.5);
createRock(10, -30, 1.2);
createRock(-20, -55, 2);
createRock(20, -75, 1.5);


/* =========================================================
   WIZARD
========================================================= */

const player =
  new THREE.Group();


player.position.set(
  0,
  0,
  15
);


/* legs */

const legMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x242832,
    roughness: 0.9
  });


const leftLeg =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.28,
      0.32,
      2.2,
      8
    ),
    legMaterial
  );

leftLeg.position.set(
  -0.45,
  1.1,
  0
);

leftLeg.castShadow = true;

player.add(leftLeg);


const rightLeg =
  leftLeg.clone();

rightLeg.position.x = 0.45;

player.add(rightLeg);


/* robe */

const robe =
  new THREE.Mesh(
    new THREE.ConeGeometry(
      1.45,
      3.8,
      16
    ),
    new THREE.MeshStandardMaterial({
      color: 0x243b6b,
      roughness: 0.85
    })
  );

robe.position.y = 3.1;

robe.castShadow = true;

player.add(robe);


/* head */

const head =
  new THREE.Mesh(
    new THREE.SphereGeometry(
      0.75,
      16,
      12
    ),
    new THREE.MeshStandardMaterial({
      color: 0xd4a07b,
      roughness: 0.8
    })
  );

head.position.y = 5.5;

head.castShadow = true;

player.add(head);


/* hair */

const hair =
  new THREE.Mesh(
    new THREE.SphereGeometry(
      0.8,
      16,
      10
    ),
    new THREE.MeshStandardMaterial({
      color: 0x211b19,
      roughness: 1
    })
  );

hair.position.set(
  0,
  5.85,
  -0.05
);

hair.scale.set(
  1,
  0.65,
  1
);

hair.castShadow = true;

player.add(hair);


/* hat */

const hat =
  new THREE.Mesh(
    new THREE.ConeGeometry(
      0.9,
      1.8,
      16
    ),
    new THREE.MeshStandardMaterial({
      color: 0x33275a,
      roughness: 0.8
    })
  );

hat.position.y = 6.65;

hat.castShadow = true;

player.add(hat);


/* hat rim */

const rim =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.25,
      1.25,
      0.15,
      16
    ),
    new THREE.MeshStandardMaterial({
      color: 0x33275a,
      roughness: 0.8
    })
  );

rim.position.y = 5.95;

rim.castShadow = true;

player.add(rim);


/* wand */

const wand =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.05,
      0.08,
      2.2,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: 0x5b3921,
      roughness: 0.9
    })
  );

wand.rotation.z =
  -Math.PI / 3;

wand.position.set(
  1.25,
  3.7,
  -0.2
);

wand.castShadow = true;

player.add(wand);


scene.add(player);


/* =========================================================
   PLAYER STATE
========================================================= */

let hp = 100;
let magic = 100;
let xp = 0;

let velocityY = 0;
let onGround = true;

const speed = 0.18;

let moveX = 0;
let moveZ = 0;


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


function updateJoystick(
  clientX,
  clientY
) {

  const rect =
    joystickBase.getBoundingClientRect();

  const centerX =
    rect.left + rect.width / 2;

  const centerY =
    rect.top + rect.height / 2;

  let dx =
    clientX - centerX;

  let dy =
    clientY - centerY;


  const max =
    rect.width * 0.32;

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (distance > max) {

    dx =
      dx / distance * max;

    dy =
      dy / distance * max;
  }


  joystickStick.style.transform =
    `translate(${dx}px, ${dy}px)`;


  moveX =
    dx / max;

  moveZ =
    dy / max;
}


function resetJoystick() {

  joystickActive = false;

  moveX = 0;
  moveZ = 0;

  joystickStick.style.transform =
    "translate(0px, 0px)";
}


joystickBase.addEventListener(
  "pointerdown",
  function(e) {

    joystickActive = true;

    joystickBase.setPointerCapture(
      e.pointerId
    );

    updateJoystick(
      e.clientX,
      e.clientY
    );
  }
);


joystickBase.addEventListener(
  "pointermove",
  function(e) {

    if (!joystickActive) return;

    updateJoystick(
      e.clientX,
      e.clientY
    );
  }
);


joystickBase.addEventListener(
  "pointerup",
  resetJoystick
);


joystickBase.addEventListener(
  "pointercancel",
  resetJoystick
);


/* =========================================================
   KEYBOARD
========================================================= */

const keys = {};

window.addEventListener(
  "keydown",
  e => {
    keys[e.key.toLowerCase()] = true;
  }
);

window.addEventListener(
  "keyup",
  e => {
    keys[e.key.toLowerCase()] = false;
  }
);


/* =========================================================
   JUMP
========================================================= */

document
  .getElementById("jumpBtn")
  .addEventListener(
    "pointerdown",
    jump
  );


function jump() {

  if (!onGround) return;

  velocityY = 0.38;

  onGround = false;
}


/* =========================================================
   SPELL
========================================================= */

document
  .getElementById("spellBtn")
  .addEventListener(
    "pointerdown",
    castSpell
  );


function castSpell() {

  if (magic < 10) {

    showMessage(
      "Not enough magic!"
    );

    return;
  }


  magic -= 10;

  xp += 5;

  updateHUD();


  const spell =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.22,
        10,
        10
      ),
      new THREE.MeshBasicMaterial({
        color: 0x9eeaff
      })
    );


  spell.position.copy(
    player.position
  );

  spell.position.y += 4;


  scene.add(spell);


  let life = 0;


  const timer =
    setInterval(
      () => {

        spell.position.z -= 1.2;

        life++;


        if (life > 35) {

          clearInterval(timer);

          scene.remove(
            spell
          );
        }

      },
      16
    );


  showMessage(
    "✨ Spell cast!"
  );
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

  document.getElementById(
    "hpBar"
  ).style.width =
    `${hp}%`;

  document.getElementById(
    "magicBar"
  ).style.width =
    `${magic}%`;

  document.getElementById(
    "hpText"
  ).textContent =
    Math.round(hp);

  document.getElementById(
    "magicText"
  ).textContent =
    Math.round(magic);

  document.getElementById(
    "xpText"
  ).textContent =
    xp;
}


function showMessage(
  text
) {

  const message =
    document.getElementById(
      "message"
    );

  message.textContent =
    text;

  setTimeout(
    () => {
      message.textContent = "";
    },
    1800
  );
}


/* =========================================================
   CAMERA SWIPE
========================================================= */

let cameraYaw = 0;

let swipeActive = false;
let lastX = 0;


renderer.domElement.addEventListener(
  "pointerdown",
  e => {

    swipeActive = true;

    lastX = e.clientX;
  }
);


renderer.domElement.addEventListener(
  "pointermove",
  e => {

    if (!swipeActive) return;

    const dx =
      e.clientX - lastX;

    cameraYaw -=
      dx * 0.004;

    lastX = e.clientX;
  }
);


renderer.domElement.addEventListener(
  "pointerup",
  () => {
    swipeActive = false;
  }
);


/* =========================================================
   GAME LOOP
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


  let inputX = moveX;
  let inputZ = moveZ;


  if (keys["a"])
    inputX = -1;

  if (keys["d"])
    inputX = 1;

  if (keys["w"])
    inputZ = -1;

  if (keys["s"])
    inputZ = 1;


  /*
    Player movement
  */

  player.position.x +=
    inputX * speed;

  player.position.z +=
    inputZ * speed;


  /*
    Keep player inside world
  */

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -110,
      110
    );

  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -240,
      40
    );


  /*
    Jump physics
  */

  velocityY -=
    0.018;

  player.position.y +=
    velocityY;


  if (
    player.position.y <= 0
  ) {

    player.position.y = 0;

    velocityY = 0;

    onGround = true;
  }


  /*
    Rotate wizard toward movement
  */

  if (
    Math.abs(inputX) +
    Math.abs(inputZ) > 0.1
  ) {

    const target =
      Math.atan2(
        inputX,
        inputZ
      );

    player.rotation.y =
      THREE.MathUtils.lerp(
        player.rotation.y,
        target,
        0.12
      );
  }


  /*
    Camera follows player
  */

  const cameraDistance = 13;

  const cameraHeight = 6;


  const desiredX =
    player.position.x +
    Math.sin(cameraYaw) *
    cameraDistance;

  const desiredZ =
    player.position.z +
    Math.cos(cameraYaw) *
    cameraDistance;


  camera.position.x =
    THREE.MathUtils.lerp(
      camera.position.x,
      desiredX,
      0.08
    );


  camera.position.z =
    THREE.MathUtils.lerp(
      camera.position.z,
      desiredZ,
      0.08
    );


  camera.position.y =
    THREE.MathUtils.lerp(
      camera.position.y,
      player.position.y +
      cameraHeight,
      0.08
    );


  camera.lookAt(
    player.position.x,
    player.position.y + 3,
    player.position.z
  );


  renderer.render(
    scene,
    camera
  );
}


/* =========================================================
   WINDOW RESIZE
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


/*
  Give the GLB a little time to load,
  then remove loading screen.
*/

setTimeout(
  () => {

    document
      .getElementById("loading")
      .classList.add("hidden");

  },
  1800
);
