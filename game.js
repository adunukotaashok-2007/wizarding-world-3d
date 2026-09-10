/* =========================================================
   WIZARDING WORLD 3D
   REAL PLAYER GLB VERSION
   Mobile / Tablet
   ========================================================= */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================================================
   BASIC SETUP
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87b8dc);

scene.fog = new THREE.FogExp2(
  0x87b8dc,
  0.0035
);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);

camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({
  antialias: false,
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
renderer.toneMappingExposure = 1.05;

document.body.appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight = new THREE.HemisphereLight(
  0xbfdfff,
  0x405040,
  2.0
);

scene.add(hemiLight);


const sun = new THREE.DirectionalLight(
  0xffffff,
  3.0
);

sun.position.set(
  50,
  80,
  30
);

sun.castShadow = true;

sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 200;

sun.shadow.camera.left = -70;
sun.shadow.camera.right = 70;
sun.shadow.camera.top = 70;
sun.shadow.camera.bottom = -70;

scene.add(sun);


/* =========================================================
   GAME VARIABLES
   ========================================================= */

let player = null;
let playerMixer = null;
let playerAnimations = [];

let currentAction = null;

let hp = 100;
let magic = 100;
let xp = 0;

let velocityY = 0;
let onGround = true;

let spellCooldown = 0;

const clock = new THREE.Clock();


/* =========================================================
   PLAYER POSITION
   ========================================================= */

const playerPosition = new THREE.Vector3(
  0,
  0,
  8
);


/* =========================================================
   GROUND
   ========================================================= */

const textureLoader = new THREE.TextureLoader();

const groundTexture =
  textureLoader.load("./assets/ground/diffuse.jpg");

const groundNormal =
  textureLoader.load("./assets/ground/normal.jpg");

const groundRough =
  textureLoader.load("./assets/ground/rough.jpg");

groundTexture.colorSpace =
  THREE.SRGBColorSpace;

groundTexture.wrapS =
  THREE.RepeatWrapping;

groundTexture.wrapT =
  THREE.RepeatWrapping;

groundNormal.wrapS =
  THREE.RepeatWrapping;

groundNormal.wrapT =
  THREE.RepeatWrapping;

groundRough.wrapS =
  THREE.RepeatWrapping;

groundRough.wrapT =
  THREE.RepeatWrapping;

groundTexture.repeat.set(35, 35);
groundNormal.repeat.set(35, 35);
groundRough.repeat.set(35, 35);


const groundMaterial =
  new THREE.MeshStandardMaterial({

    map: groundTexture,

    normalMap: groundNormal,

    roughnessMap: groundRough,

    roughness: 1,

    metalness: 0

  });


const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(
    220,
    220,
    1,
    1
  ),
  groundMaterial
);

ground.rotation.x = -Math.PI / 2;

ground.position.y = 0;

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   CASTLE MATERIAL
   ========================================================= */

const castleDiffuse =
  textureLoader.load(
    "./assets/castle/diffuse.jpg"
  );

const castleNormal =
  textureLoader.load(
    "./assets/castle/normal.jpg"
  );

const castleRough =
  textureLoader.load(
    "./assets/castle/rough.jpg"
  );

const castleAO =
  textureLoader.load(
    "./assets/castle/ao.jpg"
  );

castleDiffuse.colorSpace =
  THREE.SRGBColorSpace;

castleDiffuse.wrapS =
  THREE.RepeatWrapping;

castleDiffuse.wrapT =
  THREE.RepeatWrapping;

castleNormal.wrapS =
  THREE.RepeatWrapping;

castleNormal.wrapT =
  THREE.RepeatWrapping;

castleRough.wrapS =
  THREE.RepeatWrapping;

castleRough.wrapT =
  THREE.RepeatWrapping;

castleAO.wrapS =
  THREE.RepeatWrapping;

castleAO.wrapT =
  THREE.RepeatWrapping;

castleDiffuse.repeat.set(5, 4);
castleNormal.repeat.set(5, 4);
castleRough.repeat.set(5, 4);
castleAO.repeat.set(5, 4);


const castleMaterial =
  new THREE.MeshStandardMaterial({

    map: castleDiffuse,

    normalMap: castleNormal,

    roughnessMap: castleRough,

    aoMap: castleAO,

    roughness: 0.9,

    metalness: 0

  });


/* =========================================================
   CASTLE
   ========================================================= */

function createCastle() {

  const castle = new THREE.Group();

  castle.position.set(
    0,
    0,
    -45
  );

  scene.add(castle);


  /* Main building */

  const mainBuilding =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        38,
        25,
        18
      ),

      castleMaterial

    );

  mainBuilding.position.y = 12.5;

  mainBuilding.castShadow = true;
  mainBuilding.receiveShadow = true;

  castle.add(mainBuilding);


  /* Towers */

  const towerPositions = [

    [-23, 0, -5],
    [23, 0, -5],
    [-23, 0, 5],
    [23, 0, 5]

  ];


  towerPositions.forEach(
    position => {

      const tower =
        new THREE.Mesh(

          new THREE.CylinderGeometry(
            5,
            6,
            32,
            12
          ),

          castleMaterial

        );

      tower.position.set(
        position[0],
        16,
        position[2]
      );

      tower.castShadow = true;
      tower.receiveShadow = true;

      castle.add(tower);


      /* Tower roof */

      const roof =
        new THREE.Mesh(

          new THREE.ConeGeometry(
            7,
            9,
            12
          ),

          new THREE.MeshStandardMaterial({
            color: 0x252a30,
            roughness: 0.8
          })

        );

      roof.position.set(
        position[0],
        36.5,
        position[2]
      );

      roof.castShadow = true;

      castle.add(roof);

    }
  );


  /* Main roof */

  const roof =
    new THREE.Mesh(

      new THREE.ConeGeometry(
        25,
        14,
        4
      ),

      new THREE.MeshStandardMaterial({
        color: 0x292d32,
        roughness: 0.85
      })

    );

  roof.rotation.y =
    Math.PI / 4;

  roof.position.y = 32;

  roof.scale.set(
    1,
    1,
    0.65
  );

  roof.castShadow = true;

  castle.add(roof);


  /* Entrance */

  const entrance =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        7,
        12,
        2
      ),

      new THREE.MeshStandardMaterial({
        color: 0x15191d,
        roughness: 0.8
      })

    );

  entrance.position.set(
    0,
    6,
    9.2
  );

  castle.add(entrance);


  /* Windows */

  for (
    let row = 0;
    row < 2;
    row++
  ) {

    for (
      let i = -3;
      i <= 3;
      i += 2
    ) {

      const window =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            1.5,
            3,
            0.3
          ),

          new THREE.MeshStandardMaterial({
            color: 0x73bfff,
            emissive: 0x164d7a,
            emissiveIntensity: 0.5
          })

        );

      window.position.set(
        i * 4,
        8 + row * 9,
        9.25
      );

      castle.add(window);

    }

  }

}

createCastle();


/* =========================================================
   WATER
   ========================================================= */

const waterGeometry =
  new THREE.PlaneGeometry(
    70,
    45,
    30,
    20
  );

const waterMaterial =
  new THREE.MeshPhysicalMaterial({

    color: 0x245d80,

    transparent: true,

    opacity: 0.58,

    roughness: 0.12,

    metalness: 0.05,

    transmission: 0.08

  });


const water =
  new THREE.Mesh(
    waterGeometry,
    waterMaterial
  );

water.rotation.x =
  -Math.PI / 2;

water.position.set(
  35,
  0.08,
  -10
);

water.receiveShadow = true;

scene.add(water);


/* =========================================================
   WATER ANIMATION
   ========================================================= */

const waterPositions =
  water.geometry.attributes.position;

function animateWater(time) {

  for (
    let i = 0;
    i < waterPositions.count;
    i++
  ) {

    const x =
      waterPositions.getX(i);

    const y =
      waterPositions.getY(i);

    const wave =
      Math.sin(
        x * 0.35 +
        time * 1.5
      ) * 0.08;

    const wave2 =
      Math.cos(
        y * 0.45 +
        time * 1.2
      ) * 0.06;

    waterPositions.setZ(
      i,
      wave + wave2
    );

  }

  waterPositions.needsUpdate = true;

}


/* =========================================================
   MOUNTAINS
   ========================================================= */

function createMountain(
  x,
  y,
  z,
  scale
) {

  const mountain =
    new THREE.Mesh(

      new THREE.ConeGeometry(
        22,
        45,
        7
      ),

      new THREE.MeshStandardMaterial({

        color: 0x56636a,

        roughness: 1

      })

    );

  mountain.position.set(
    x,
    y,
    z
  );

  mountain.scale.set(
    scale,
    scale,
    scale
  );

  mountain.castShadow = true;
  mountain.receiveShadow = true;

  scene.add(mountain);

}


createMountain(
  -65,
  18,
  -75,
  2.2
);

createMountain(
  55,
  20,
  -90,
  2.5
);

createMountain(
  90,
  15,
  -40,
  2
);

createMountain(
  -100,
  20,
  -20,
  2.4
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
        2.5,
        1
      ),

      new THREE.MeshStandardMaterial({

        color: 0x4c5558,

        roughness: 1

      })

    );

  rock.position.set(
    x,
    y,
    z
  );

  rock.scale.setScalar(scale);

  rock.rotation.set(
    Math.random(),
    Math.random(),
    Math.random()
  );

  rock.castShadow = true;
  rock.receiveShadow = true;

  scene.add(rock);

}


[
  [-12, 1, -10],
  [15, 1, -5],
  [-25, 1, 15],
  [28, 1, 15],
  [50, 1, 12],
  [-48, 1, 8],
  [65, 1, -35],
  [-60, 1, -45]
].forEach(
  p => createRock(
    p[0],
    p[1],
    p[2],
    0.8 + Math.random()
  )
);


/* =========================================================
   TREES
   ========================================================= */

const gltfLoader =
  new GLTFLoader();

let treeModel = null;


gltfLoader.load(

  "./assets/tree.glb",

  gltf => {

    treeModel =
      gltf.scene;

    treeModel.traverse(
      object => {

        if (
          object.isMesh
        ) {

          object.castShadow = true;

          object.receiveShadow = true;

        }

      }
    );


    const treePositions = [

      [-20, -15],
      [-32, -8],
      [-42, -20],
      [-52, -5],
      [18, 5],
      [27, -5],
      [45, 8],
      [55, 20],
      [-65, 20],
      [70, -15],
      [-75, -35],
      [80, -50],
      [-85, 0],
      [10, -25],
      [25, -35],
      [-10, -30],
      [40, -30],
      [60, -5]

    ];


    treePositions.forEach(
      p => {

        const tree =
          treeModel.clone(true);

        tree.position.set(
          p[0],
          0,
          p[1]
        );

        const scale =
          1.8 +
          Math.random() * 1.0;

        tree.scale.setScalar(
          scale
        );

        tree.rotation.y =
          Math.random() *
          Math.PI *
          2;

        scene.add(tree);

      }
    );

  },

  undefined,

  error => {

    console.error(
      "Tree loading error:",
      error
    );

  }

);


/* =========================================================
   REAL PLAYER — AREN VALEN
   ========================================================= */

function loadPlayer() {

  gltfLoader.load(

    "./assets/player/aren_valen.glb",

    gltf => {

      console.log(
        "AREN VALEN LOADED",
        gltf
      );


      player =
        gltf.scene;


      player.position.copy(
        playerPosition
      );


      /*
       * Change this value if your
       * MetaPerson model is extremely
       * large or extremely small.
       */

      player.scale.setScalar(
        1
      );


      player.rotation.y =
        Math.PI;


      player.traverse(
        object => {

          if (
            object.isMesh
          ) {

            object.castShadow = true;

            object.receiveShadow = true;

            if (
              object.material
            ) {

              object.material.side =
                THREE.FrontSide;

            }

          }

        }
      );


      scene.add(player);


      /* =====================================================
         ANIMATIONS
         ===================================================== */

      if (
        gltf.animations &&
        gltf.animations.length > 0
      ) {

        playerMixer =
          new THREE.AnimationMixer(
            player
          );

        playerAnimations =
          gltf.animations;


        console.log(
          "Player animations:",
          playerAnimations.map(
            animation =>
              animation.name
          )
        );


        /*
         * Start first animation.
         */

        playAnimation(
          playerAnimations[0].name
        );

      }


      /*
       * Hide loading screen.
       */

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
        700
      );

    },

    progress => {

      if (
        progress.total > 0
      ) {

        const percent =
          Math.round(
            progress.loaded /
            progress.total *
            100
          );

        const loadingText =
          document.querySelector(
            ".loading-text"
          );

        if (loadingText) {

          loadingText.textContent =
            "Loading Aren Valen... " +
            percent +
            "%";

        }

      }

    },

    error => {

      console.error(
        "AREN VALEN GLB ERROR:",
        error
      );


      const loadingText =
        document.querySelector(
          ".loading-text"
        );

      if (loadingText) {

        loadingText.textContent =
          "Could not load Aren Valen. Check assets/player/aren_valen.glb";

      }

    }

  );

}

loadPlayer();


/* =========================================================
   ANIMATION HELPER
   ========================================================= */

function playAnimation(
  animationName
) {

  if (
    !playerMixer
  ) return;


  const clip =
    THREE.AnimationClip.findByName(
      playerAnimations,
      animationName
    );


  if (!clip) {

    console.log(
      "Animation not found:",
      animationName
    );

    return;

  }


  const action =
    playerMixer.clipAction(
      clip
    );


  if (
    currentAction &&
    currentAction !== action
  ) {

    currentAction.fadeOut(
      0.15
    );

  }


  action.reset();

  action.fadeIn(
    0.15
  );

  action.play();

  currentAction =
    action;

}


/* =========================================================
   FIND ANIMATION
   ========================================================= */

function findAnimation(
  words
) {

  if (
    !playerAnimations.length
  ) return null;


  const lower =
    words.map(
      word =>
        word.toLowerCase()
    );


  for (
    const animation
    of playerAnimations
  ) {

    const name =
      animation.name.toLowerCase();


    if (
      lower.some(
        word =>
          name.includes(word)
      )
    ) {

      return animation.name;

    }

  }


  return null;

}


/* =========================================================
   ENEMIES
   ========================================================= */

const enemies = [];


function createEnemy(
  x,
  z,
  type
) {

  const enemy =
    new THREE.Group();


  enemy.position.set(
    x,
    0,
    z
  );


  /* Body */

  const body =
    new THREE.Mesh(

      new THREE.CapsuleGeometry(
        0.75,
        1.7,
        5,
        8
      ),

      new THREE.MeshStandardMaterial({

        color:
          type === "mage"
            ? 0x25163b
            : 0x17191c,

        roughness: 0.9

      })

    );

  body.position.y =
    1.6;

  body.castShadow = true;

  enemy.add(body);


  /* Head */

  const head =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.62,
        12,
        8
      ),

      new THREE.MeshStandardMaterial({

        color: 0x5a3e32,

        roughness: 0.9

      })

    );

  head.position.y =
    3.15;

  head.castShadow = true;

  enemy.add(head);


  /* Eyes */

  [-0.22, 0.22].forEach(
    eyeX => {

      const eye =
        new THREE.Mesh(

          new THREE.SphereGeometry(
            0.09,
            8,
            6
          ),

          new THREE.MeshBasicMaterial({
            color: 0xff2222
          })

        );

      eye.position.set(
        eyeX,
        3.18,
        0.55
      );

      enemy.add(eye);

    }
  );


  /* Horns */

  if (
    type !== "mage"
  ) {

    [-0.35, 0.35].forEach(
      hornX => {

        const horn =
          new THREE.Mesh(

            new THREE.ConeGeometry(
              0.12,
              0.75,
              6
            ),

            new THREE.MeshStandardMaterial({
              color: 0x252525,
              roughness: 1
            })

          );

        horn.position.set(
          hornX,
          3.75,
          0
        );

        horn.rotation.z =
          hornX > 0
            ? -0.35
            : 0.35;

        enemy.add(horn);

      }
    );

  }


  /* Health bar */

  const healthBackground =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        1.6,
        0.16
      ),

      new THREE.MeshBasicMaterial({
        color: 0x222222
      })

    );

  healthBackground.position.y =
    4.3;

  enemy.add(
    healthBackground
  );


  const healthBar =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        1.5,
        0.10
      ),

      new THREE.MeshBasicMaterial({
        color: 0xff3030
      })

    );

  healthBar.position.set(
    0,
    4.3,
    0.02
  );

  enemy.add(
    healthBar
  );


  enemy.userData = {

    type,

    hp: 100,

    healthBar,

    attackTimer:
      Math.random() * 2

  };


  scene.add(enemy);

  enemies.push(
    enemy
  );

}


/* =========================================================
   ENEMY POSITIONS
   ========================================================= */

createEnemy(
  7,
  1,
  "shadow"
);

createEnemy(
  -9,
  -3,
  "shadow"
);

createEnemy(
  15,
  -8,
  "mage"
);

createEnemy(
  -17,
  3,
  "shadow"
);


/* =========================================================
   SPELLS
   ========================================================= */

const spells = [];


function castSpell() {

  if (
    !player
  ) return;


  if (
    magic < 10
  ) {

    showMessage(
      "Not enough magic!"
    );

    return;

  }


  if (
    spellCooldown > 0
  ) return;


  magic -= 10;

  spellCooldown =
    0.35;


  const direction =
    new THREE.Vector3(
      0,
      0,
      -1
    );


  direction.applyQuaternion(
    player.quaternion
  );


  const start =
    player.position.clone();


  start.y += 2.2;


  const orb =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.18,
        10,
        10
      ),

      new THREE.MeshBasicMaterial({
        color: 0xb86cff
      })

    );


  orb.position.copy(
    start
  );


  const glow =
    new THREE.PointLight(
      0xb86cff,
      2,
      6
    );


  orb.add(
    glow
  );


  scene.add(
    orb
  );


  spells.push({

    mesh: orb,

    velocity:
      direction.multiplyScalar(
        28
      ),

    life: 2

  });

}


/* =========================================================
   SPELL UPDATE
   ========================================================= */

function updateSpells(
  delta
) {

  for (
    let i = spells.length - 1;
    i >= 0;
    i--
  ) {

    const spell =
      spells[i];


    spell.mesh.position.addScaledVector(
      spell.velocity,
      delta
    );


    spell.life -=
      delta;


    for (
      let j = enemies.length - 1;
      j >= 0;
      j--
    ) {

      const enemy =
        enemies[j];


      if (
        spell.mesh.position.distanceTo(
          enemy.position
        ) < 2.0
      ) {

        enemy.userData.hp -=
          35;


        const health =
          Math.max(
            enemy.userData.hp,
            0
          ) / 100;


        enemy.userData.healthBar.scale.x =
          health;


        xp += 10;


        scene.remove(
          spell.mesh
        );


        spells.splice(
          i,
          1
        );


        if (
          enemy.userData.hp <= 0
        ) {

          scene.remove(
            enemy
          );

          enemies.splice(
            j,
            1
          );

        }


        break;

      }

    }


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
   ENEMY AI
   ========================================================= */

function updateEnemies(
  delta
) {

  if (
    !player
  ) return;


  enemies.forEach(
    enemy => {

      const distance =
        enemy.position.distanceTo(
          player.position
        );


      if (
        distance > 2.7
      ) {

        const direction =
          new THREE.Vector3()
            .subVectors(
              player.position,
              enemy.position
            )
            .normalize();


        enemy.position.addScaledVector(
          direction,
          delta * 1.5
        );


        enemy.lookAt(
          player.position.x,
          enemy.position.y,
          player.position.z
        );

      } else {

        enemy.userData.attackTimer -=
          delta;


        if (
          enemy.userData.attackTimer <= 0
        ) {

          hp -= 5;

          enemy.userData.attackTimer =
            1.5;


          showMessage(
            "You were attacked!"
          );

        }

      }

    }
  );

}


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

let joystickX = 0;
let joystickY = 0;


function updatePlayer(
  delta
) {

  if (
    !player
  ) return;


  const speed =
    6;


  if (
    Math.abs(joystickX) > 0.05 ||
    Math.abs(joystickY) > 0.05
  ) {

    const move =
      new THREE.Vector3(
        joystickX,
        0,
        joystickY
      );


    move.normalize();


    /*
     * Camera-relative movement
     */

    const cameraDirection =
      new THREE.Vector3();

    camera.getWorldDirection(
      cameraDirection
    );

    cameraDirection.y = 0;

    cameraDirection.normalize();


    const forward =
      cameraDirection.clone();


    const right =
      new THREE.Vector3(
        forward.z,
        0,
        -forward.x
      );


    const finalMove =
      new THREE.Vector3();


    finalMove.addScaledVector(
      right,
      move.x
    );

    finalMove.addScaledVector(
      forward,
      -move.z
    );


    finalMove.normalize();


    player.position.addScaledVector(
      finalMove,
      speed * delta
    );


    /*
     * Rotate character toward movement.
     */

    const targetRotation =
      Math.atan2(
        finalMove.x,
        finalMove.z
      );


    player.rotation.y =
      THREE.MathUtils.lerp(
        player.rotation.y,
        targetRotation,
        0.15
      );


    /*
     * Try to use walking animation
     * if the GLB contains one.
     */

    const walk =
      findAnimation([
        "walk",
        "run",
        "locomotion"
      ]);


    if (
      walk &&
      currentAction &&
      currentAction._clip &&
      currentAction._clip.name !== walk
    ) {

      playAnimation(
        walk
      );

    }

  }


  /* Gravity */

  if (
    !onGround
  ) {

    velocityY -=
      18 * delta;

    player.position.y +=
      velocityY * delta;


    if (
      player.position.y <= 0
    ) {

      player.position.y =
        0;

      velocityY =
        0;

      onGround =
        true;

    }

  }

}


/* =========================================================
   JUMP
   ========================================================= */

function jump() {

  if (
    !player ||
    !onGround
  ) return;


  velocityY =
    8;

  onGround =
    false;


  const jumpAnimation =
    findAnimation([
      "jump"
    ]);


  if (
    jumpAnimation
  ) {

    playAnimation(
      jumpAnimation
    );

  }

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


let joystickPointer = null;


function updateJoystick(
  event
) {

  if (
    !joystickBase
  ) return;


  const rect =
    joystickBase.getBoundingClientRect();


  const centerX =
    rect.left +
    rect.width / 2;


  const centerY =
    rect.top +
    rect.height / 2;


  let dx =
    event.clientX -
    centerX;


  let dy =
    event.clientY -
    centerY;


  const maxDistance =
    rect.width / 2 -
    30;


  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (
    distance > maxDistance
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
    `translate(${dx}px, ${dy}px)`;

}


if (
  joystickBase
) {

  joystickBase.addEventListener(
    "pointerdown",
    event => {

      joystickPointer =
        event.pointerId;

      joystickBase.setPointerCapture(
        event.pointerId
      );

      updateJoystick(
        event
      );

    }
  );


  joystickBase.addEventListener(
    "pointermove",
    event => {

      if (
        event.pointerId ===
        joystickPointer
      ) {

        updateJoystick(
          event
        );

      }

    }
  );


  function resetJoystick() {

    joystickPointer =
      null;

    joystickX =
      0;

    joystickY =
      0;

    joystickStick.style.transform =
      "translate(0px, 0px)";

  }


  joystickBase.addEventListener(
    "pointerup",
    resetJoystick
  );

  joystickBase.addEventListener(
    "pointercancel",
    resetJoystick
  );

}


/* =========================================================
   BUTTONS
   ========================================================= */

const jumpBtn =
  document.getElementById(
    "jumpBtn"
  );

const spellBtn =
  document.getElementById(
    "spellBtn"
  );


if (
  jumpBtn
) {

  jumpBtn.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      jump();

    }
  );

}


if (
  spellBtn
) {

  spellBtn.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      castSpell();

    }
  );

}


/* =========================================================
   CAMERA
   ========================================================= */

let cameraAngle =
  0;

let cameraDistance =
  9;

let cameraHeight =
  4.5;


let cameraPointer = null;
let previousCameraX = 0;


renderer.domElement.addEventListener(
  "pointerdown",
  event => {

    cameraPointer =
      event.pointerId;

    previousCameraX =
      event.clientX;

  }
);


renderer.domElement.addEventListener(
  "pointermove",
  event => {

    if (
      cameraPointer !==
      event.pointerId
    ) return;


    const dx =
      event.clientX -
      previousCameraX;


    previousCameraX =
      event.clientX;


    cameraAngle -=
      dx * 0.008;

  }
);


renderer.domElement.addEventListener(
  "pointerup",
  () => {

    cameraPointer =
      null;

  }
);


function updateCamera() {

  if (
    !player
  ) return;


  const target =
    player.position.clone();


  target.y +=
    2.0;


  const cameraX =
    player.position.x +
    Math.sin(
      cameraAngle
    ) *
    cameraDistance;


  const cameraZ =
    player.position.z +
    Math.cos(
      cameraAngle
    ) *
    cameraDistance;


  const desired =
    new THREE.Vector3(
      cameraX,
      player.position.y +
      cameraHeight,
      cameraZ
    );


  camera.position.lerp(
    desired,
    0.08
  );


  camera.lookAt(
    target
  );

}


/* =========================================================
   HUD
   ========================================================= */

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
      Math.max(
        hp,
        0
      ) +
      "%";

  }


  if (magicBar) {

    magicBar.style.width =
      Math.max(
        magic,
        0
      ) +
      "%";

  }


  if (hpText) {

    hpText.textContent =
      Math.round(
        hp
      );

  }


  if (magicText) {

    magicText.textContent =
      Math.round(
        magic
      );

  }


  if (xpText) {

    xpText.textContent =
      xp;

  }

}


/* =========================================================
   MESSAGE
   ========================================================= */

let messageTimer =
  0;


function showMessage(
  text
) {

  const message =
    document.getElementById(
      "message"
    );


  if (!message)
    return;


  message.textContent =
    text;


  messageTimer =
    2;

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


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        1.5
      )
    );

  }
);


/* =========================================================
   MAIN LOOP
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


  const elapsed =
    clock.elapsedTime;


  /* Water */

  animateWater(
    elapsed
  );


  /* Player animation */

  if (
    playerMixer
  ) {

    playerMixer.update(
      delta
    );

  }


  /* Player */

  updatePlayer(
    delta
  );


  /* Enemies */

  updateEnemies(
    delta
  );


  /* Spells */

  updateSpells(
    delta
  );


  /* Camera */

  updateCamera();


  /* Magic regeneration */

  magic =
    Math.min(
      100,
      magic +
      delta * 3
    );


  /* Spell cooldown */

  spellCooldown =
    Math.max(
      0,
      spellCooldown -
      delta
    );


  /* Message */

  if (
    messageTimer > 0
  ) {

    messageTimer -=
      delta;

    if (
      messageTimer <= 0
    ) {

      const message =
        document.getElementById(
          "message"
        );

      if (message) {

        message.textContent =
          "";

      }

    }

  }


  /* HUD */

  updateHUD();


  renderer.render(
    scene,
    camera
  );

}

animate();


/* =========================================================
   STARTUP MESSAGE
   ========================================================= */

setTimeout(
  () => {

    if (!player) {

      const loadingText =
        document.querySelector(
          ".loading-text"
        );

      if (loadingText) {

        loadingText.textContent =
          "Loading 3D character...";

      }

    }

  },
  500
);
