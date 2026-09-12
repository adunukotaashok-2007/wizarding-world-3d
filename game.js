/* =========================================================
   AETHERIA ACADEMY
   STEP 5 — MOBILE CONTROL + CAMERA FIX
========================================================= */

import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { GLTFLoader } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

import { DRACOLoader } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js";


/* =========================================================
   SCENE
========================================================= */

const scene =
new THREE.Scene();

scene.background =
new THREE.Color(0x07111c);

scene.fog =
new THREE.Fog(
    0x07111c,
    70,
    220
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
        window.devicePixelRatio,
        1.8
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
1.15;


/* =========================================================
   PUT CANVAS INSIDE #game
========================================================= */

const gameElement =
document.getElementById("game");

if (gameElement) {

    gameElement.appendChild(
        renderer.domElement
    );

} else {

    document.body.appendChild(
        renderer.domElement
    );

}


/* =========================================================
   CLOCK
========================================================= */

const clock =
new THREE.Clock();


/* =========================================================
   LIGHTING
========================================================= */

const hemiLight =
new THREE.HemisphereLight(
    0x9db7d8,
    0x182014,
    1.8
);

scene.add(
    hemiLight
);


const sun =
new THREE.DirectionalLight(
    0xffffff,
    3
);

sun.position.set(
    40,
    80,
    30
);

sun.castShadow =
true;

sun.shadow.mapSize.width =
2048;

sun.shadow.mapSize.height =
2048;

sun.shadow.camera.left =
-100;

sun.shadow.camera.right =
100;

sun.shadow.camera.top =
100;

sun.shadow.camera.bottom =
-100;

scene.add(
    sun
);


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


const waterMat =
new THREE.MeshStandardMaterial({
    color: 0x0877bb,
    metalness: 0.15,
    roughness: 0.15
});


/* =========================================================
   COLLISION
========================================================= */

const collisionBoxes = [];

const treeColliders = [];

const playerRadius =
0.7;


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
    material,
    collision = false
) {

    const mesh =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            height,
            depth
        ),
        material
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

    scene.add(
        mesh
    );


    if (collision) {

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


    return mesh;
}


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

ground.receiveShadow =
true;

scene.add(
    ground
);


/* =========================================================
   CASTLE
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
   TOWERS
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

    roof.castShadow =
    true;

    scene.add(
        roof
    );

}


createTower(-25, -29);
createTower(25, -29);
createTower(-18, -48);
createTower(18, -48);


/* =========================================================
   GATE
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

courtyard.receiveShadow =
true;

scene.add(
    courtyard
);


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

fountainBase.castShadow =
true;

fountainBase.receiveShadow =
true;

scene.add(
    fountainBase
);


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

scene.add(
    fountainWater
);


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

scene.add(
    fountainPillar
);


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

scene.add(
    fountainTop
);


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

    trunk.position.y =
    3.5;

    trunk.castShadow =
    true;

    group.add(
        trunk
    );


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

    leaves.position.y =
    8;

    leaves.castShadow =
    true;

    group.add(
        leaves
    );


    group.position.set(
        x,
        0,
        z
    );

    scene.add(
        group
    );


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
    p =>
        createTree(
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

    handle.position.y =
    1.5;

    group.add(
        handle
    );


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

    flame.position.y =
    3.25;

    group.add(
        flame
    );


    const light =
    new THREE.PointLight(
        0xff8a20,
        5,
        15
    );

    light.position.y =
    3.5;

    group.add(
        light
    );


    group.position.set(
        x,
        0,
        z
    );

    scene.add(
        group
    );


    torches.push({

        flame,
        light,
        phase:
            Math.random() * 10

    });

}


createTorch(-8, -13);
createTorch(8, -13);


/* =========================================================
   PLAYER
========================================================= */

let player =
null;

let playerModel =
null;

let wand =
null;

const bones = {};


/* =========================================================
   PLAYER STATE
========================================================= */

let isJumping =
false;

let verticalVelocity =
0;

let isMoving =
false;

let isRunning =
false;

let casting =
false;


const moveInput =
new THREE.Vector2(
    0,
    0
);


const lastMoveDirection =
new THREE.Vector3(
    0,
    0,
    -1
);


/* =========================================================
   CAMERA STATE
========================================================= */

let cameraYaw =
0;

let cameraPitch =
0.15;

const cameraDistance =
9;


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
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            jump();

        }


        if (
            event.key.toLowerCase()
            === "f"
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

    const element =
    document.getElementById(
        "loading"
    );

    if (!element)
        return;

    element.style.opacity =
    "0";

    setTimeout(
        () => {

            element.style.display =
            "none";

        },
        500
    );

}


/* =========================================================
   FIND BONES
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

    if (!bone)
        return;

    bone.rotation.x =
    x;

    bone.rotation.y =
    y;

    bone.rotation.z =
    z;

}


/* =========================================================
   STANDING POSE
========================================================= */

function applyStandingPose() {

    if (!playerModel)
        return;


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
   IDLE
========================================================= */

function applyIdleAnimation(
    time
) {

    if (!playerModel)
        return;


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
   WALK / RUN
========================================================= */

function applyWalkingAnimation(
    time,
    running
) {

    if (!playerModel)
        return;


    applyStandingPose();


    const speed =
    running
        ? 10
        : 7;


    const amount =
    running
        ? 0.75
        : 0.5;


    const swing =
    Math.sin(
        time * speed
    ) * amount;


    setBoneOffset(
        "LeftUpLeg",
        swing,
        0,
        0
    );

    setBoneOffset(
        "RightUpLeg",
        -swing,
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


    setBoneOffset(
        "LeftArm",
        Math.PI / 2 -
        swing * 0.35,
        0,
        0
    );

    setBoneOffset(
        "RightArm",
        Math.PI / 2 +
        swing * 0.35,
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

    if (!playerModel)
        return;


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
        Math.sin(
            time * 3
        ) * 0.03,
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

    if (!playerModel)
        return;


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


    if (
        bones.RightHand
    ) {

        bones.RightHand.add(
            wand
        );

    } else {

        playerModel.add(
            wand
        );

    }

}


/* =========================================================
   LOAD AREN
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
            "AREN LOADED"
        );

    },


    undefined,


    error => {

        console.error(
            "PLAYER ERROR:",
            error
        );

        hideLoadingScreen();

    }

);


/* =========================================================
   KEYBOARD INPUT
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
   COLLISION
========================================================= */

function canMoveTo(
    x,
    z
) {

    for (
        const b of collisionBoxes
    ) {

        const closestX =
        Math.max(
            b.minX,
            Math.min(
                x,
                b.maxX
            )
        );


        const closestZ =
        Math.max(
            b.minZ,
            Math.min(
                z,
                b.maxZ
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
   MOVEMENT
========================================================= */

function updateMovement(
    delta
) {

    if (!player)
        return;


    const keyboard =
    getKeyboardInput();


    let inputX =
    moveInput.x;

    let inputY =
    moveInput.y;


    if (
        keyboard.x !== 0 ||
        keyboard.y !== 0
    ) {

        inputX =
        keyboard.x;

        inputY =
        keyboard.y;

    }


    const length =
    Math.sqrt(
        inputX * inputX +
        inputY * inputY
    );


    isMoving =
    length > 0.08;


    if (!isMoving) {

        isRunning =
        false;

        return;

    }


    if (
        length > 1
    ) {

        inputX /=
        length;

        inputY /=
        length;

    }


    isRunning =
    keys["shift"] ||
    length > 0.95;


    const speed =
    isRunning
        ? 9
        : 5.5;


    /*
       FORWARD = -Z

       LEFT = -X
       RIGHT = +X
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


    const up =
    new THREE.Vector3(
        0,
        1,
        0
    );


    forward.applyAxisAngle(
        up,
        cameraYaw
    );


    right.applyAxisAngle(
        up,
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


        const distance =
        speed * delta;


        const nextX =
        player.position.x +
        direction.x *
        distance;


        const nextZ =
        player.position.z +
        direction.z *
        distance;


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


        const angle =
        Math.atan2(
            direction.x,
            direction.z
        );


        player.rotation.y =
        THREE.MathUtils.lerp(
            player.rotation.y,
            angle,
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

    if (!player)
        return;


    if (isJumping)
        return;


    if (
        player.position.y >
        0.05
    ) {

        return;

    }


    isJumping =
    true;

    verticalVelocity =
    11;

}


/* =========================================================
   JUMP PHYSICS
========================================================= */

function updateJump(
    delta
) {

    if (!player)
        return;


    if (!isJumping) {

        /*
           Ground safety
        */

        if (
            Math.abs(
                player.position.y
            ) > 0.001
        ) {

            player.position.y =
            0;

        }

        return;

    }


    verticalVelocity -=
    25 * delta;


    player.position.y +=
    verticalVelocity * delta;


    /*
       LANDING
    */

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
           CRITICAL FIX

           Reset every body bone
           immediately.
        */

        applyStandingPose();

    }

}


/* =========================================================
   SPELL
========================================================= */

function castSpell() {

    if (!player)
        return;


    if (casting)
        return;


    casting =
    true;


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

            casting =
            false;

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

    const projectile =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.3,
            16,
            16
        ),

        new THREE.MeshBasicMaterial({
            color: 0x8de9ff
        })

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


    function updateProjectile() {

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


        life +=
        delta;


        if (
            life > 2.5
        ) {

            scene.remove(
                projectile
            );

            return;

        }


        requestAnimationFrame(
            updateProjectile
        );

    }


    updateProjectile();

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

    if (!joystick)
        return;


    const rect =
    joystick.getBoundingClientRect();


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
            )
                return;


            if (
                event.pointerId !==
                joystickPointerId
            )
                return;


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

    jumpButton.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            event.stopPropagation();

            jump();

        }
    );

}


/* =========================================================
   SPELL BUTTON
   FIXED ID
========================================================= */

const spellButton =
document.getElementById(
    "spellButton"
);


if (spellButton) {

    spellButton.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            event.stopPropagation();

            castSpell();

        }
    );

}


/* =========================================================
   MOBILE CAMERA
   ========================================================

   IMPORTANT:

   Camera is controlled from the right/middle screen.

   Drag LEFT  -> camera turns left
   Drag RIGHT -> camera turns right
   Drag UP    -> camera looks up
   Drag DOWN  -> camera looks down
========================================================= */

const cameraTouchArea =
document.getElementById(
    "cameraTouchArea"
);


let cameraDragging =
false;

let cameraPointerId =
null;

let cameraLastX =
0;

let cameraLastY =
0;


if (cameraTouchArea) {

    cameraTouchArea.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            cameraDragging =
            true;

            cameraPointerId =
            event.pointerId;


            cameraLastX =
            event.clientX;

            cameraLastY =
            event.clientY;


            try {

                cameraTouchArea.setPointerCapture(
                    event.pointerId
                );

            } catch {}

        }
    );


    cameraTouchArea.addEventListener(
        "pointermove",
        event => {

            if (
                !cameraDragging
            )
                return;


            if (
                event.pointerId !==
                cameraPointerId
            )
                return;


            event.preventDefault();


            const dx =
            event.clientX -
            cameraLastX;


            const dy =
            event.clientY -
            cameraLastY;


            cameraLastX =
            event.clientX;


            cameraLastY =
            event.clientY;


            /*
               Horizontal camera
            */

            cameraYaw -=
            dx * 0.008;


            /*
               Vertical camera
            */

            cameraPitch -=
            dy * 0.006;


            cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -0.45,
                0.65
            );

        }
    );


    function stopCamera() {

        cameraDragging =
        false;

        cameraPointerId =
        null;

    }


    cameraTouchArea.addEventListener(
        "pointerup",
        stopCamera
    );


    cameraTouchArea.addEventListener(
        "pointercancel",
        stopCamera
    );


    cameraTouchArea.addEventListener(
        "lostpointercapture",
        stopCamera
    );

}


/* =========================================================
   NPC
========================================================= */

let npc =
null;


function createNPC() {

    npc =
    new THREE.Group();


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

    npc.add(
        robe
    );


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

    npc.add(
        head
    );


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

    npc.add(
        hat
    );


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

    npc.add(
        staff
    );


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
   QUEST
========================================================= */

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
   DIALOGUE
========================================================= */

const dialogueBox =
document.getElementById(
    "dialogueBox"
);


const interactButton =
document.getElementById(
    "interactButton"
);


function showDialogue(
    text
) {

    if (!dialogueBox)
        return;

    dialogueBox.textContent =
    text;

    dialogueBox.style.display =
    "block";

}


function hideDialogue() {

    if (!dialogueBox)
        return;

    dialogueBox.style.display =
    "none";

}


/* =========================================================
   NPC TALK
========================================================= */

if (interactButton) {

    interactButton.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (!player || !npc)
                return;


            const distance =
            player.position.distanceTo(
                npc.position
            );


            if (
                distance > 7
            )
                return;


            showDialogue(
                "Professor Aelion: The ancient academy marker lies beyond the great gate. Find it and return."
            );


            setTimeout(
                hideDialogue,
                5000
            );

        }
    );

}


/* =========================================================
   NPC INTERACTION
========================================================= */

function updateNPCInteraction() {

    if (
        !player ||
        !npc ||
        !interactButton
    )
        return;


    const distance =
    player.position.distanceTo(
        npc.position
    );


    if (
        distance < 7
    ) {

        interactButton.style.display =
        "block";

    } else {

        interactButton.style.display =
        "none";

    }

}


/* =========================================================
   QUEST
========================================================= */

function updateQuest() {

    if (!player)
        return;


    if (
        questState !==
        QUEST_MARKER
    )
        return;


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
        distance < 7
    ) {

        questState =
        QUEST_COMPLETE;


        questMarker.visible =
        false;


        showDialogue(
            "You found the Ancient Academy Marker!"
        );


        const questText =
        document.getElementById(
            "questText"
        );


        if (questText) {

            questText.textContent =
            "Quest Complete!";

        }


        addXP(
            100
        );


        setTimeout(
            hideDialogue,
            4000
        );

    }

}


/* =========================================================
   XP
========================================================= */

let xp = 0;


function addXP(
    amount
) {

    xp +=
    amount;


    const xpText =
    document.getElementById(
        "xpText"
    );


    if (xpText) {

        xpText.textContent =
        "XP " + xp;

    }

}


/* =========================================================
   QUEST MARKER ANIMATION
========================================================= */

function updateQuestMarker(
    time
) {

    if (
        !questMarker.visible
    )
        return;


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
            1.4 + flicker;


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

    if (!player)
        return;


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


    const desired =
    new THREE.Vector3(

        target.x +
        Math.sin(
            cameraYaw
        ) *
        horizontal,

        target.y +
        vertical,

        target.z +
        Math.cos(
            cameraYaw
        ) *
        horizontal

    );


    camera.position.lerp(
        desired,
        Math.min(
            1,
            delta * 8
        )
    );


    camera.lookAt(
        target
    );

}


/* =========================================================
   PLAYER ANIMATION
========================================================= */

function updatePlayerAnimation(
    time
) {

    if (!playerModel)
        return;


    /*
       PRIORITY

       1. JUMP
       2. CAST
       3. RUN/WALK
       4. IDLE
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


if (landscapeButton) {

    landscapeButton.addEventListener(
        "click",
        async event => {

            event.preventDefault();

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


    const time =
    performance.now() *
    0.001;


    updateMovement(
        delta
    );


    updateJump(
        delta
    );


    updatePlayerAnimation(
        time
    );


    updateNPCInteraction();


    updateQuest();


    updateQuestMarker(
        time
    );


    updateTorches(
        time
    );


    updateCamera(
        delta
    );


    renderer.render(
        scene,
        camera
    );

}


animate();


console.log(
    "AETHERIA ACADEMY READY"
);

console.log(
    "Joystick = movement"
);

console.log(
    "Right side drag = 3D camera"
);

console.log(
    "Jump button = jump"
);

console.log(
    "Cast button = magic"
);

console.log(
    "WASD = movement"
);

console.log(
    "SPACE = jump"
);

console.log(
    "F = cast"
);
