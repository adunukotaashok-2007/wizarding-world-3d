/* =========================================================
   AETHERIA ACADEMY
   STEP 1 - FULL ACADEMY WORLD

   PLAYER
   + STANDING POSE
   + WALKING
   + JUMP
   + WAND
   + SPELL
   + CAMERA
   + JOYSTICK
   + ACADEMY CASTLE
   + COURTYARD
   + PATH
   + TOWERS
   + GATE
   + TORCHES
   + TREES
   + QUEST MARKER
   ========================================================= */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";


/* =========================================================
   HTML ELEMENTS
   ========================================================= */

const game =
    document.getElementById("game");

const loading =
    document.getElementById("loading");

const joystickBase =
    document.getElementById("joystickBase");

const joystickStick =
    document.getElementById("joystickStick");

const jumpBtn =
    document.getElementById("jumpBtn");

const spellBtn =
    document.getElementById("spellBtn");


/* =========================================================
   MOBILE
   ========================================================= */

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.touchAction = "none";

if (game) {
    game.style.touchAction = "none";
}


/* =========================================================
   SCENE
   ========================================================= */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(0x718b98);

scene.fog =
    new THREE.Fog(
        0x718b98,
        35,
        240
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
    4,
    10
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

if (game) {
    game.appendChild(
        renderer.domElement
    );
}


/* =========================================================
   LIGHTING
   ========================================================= */

const hemisphere =
    new THREE.HemisphereLight(
        0xdcecff,
        0x344332,
        2
    );

scene.add(hemisphere);


const sun =
    new THREE.DirectionalLight(
        0xfff4dc,
        3
    );

sun.position.set(
    -60,
    90,
    40
);

sun.castShadow = true;

sun.shadow.mapSize.width =
    2048;

sun.shadow.mapSize.height =
    2048;

sun.shadow.camera.left =
    -150;

sun.shadow.camera.right =
    150;

sun.shadow.camera.top =
    150;

sun.shadow.camera.bottom =
    -150;

scene.add(sun);


/* =========================================================
   GROUND
   ========================================================= */

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            500,
            500
        ),
        new THREE.MeshStandardMaterial({
            color: 0x536b4d,
            roughness: 1
        })
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   MATERIALS
   ========================================================= */

const stoneMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x777b7a,
        roughness: 0.92
    });


const darkStoneMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x4e5252,
        roughness: 0.95
    });


const roofMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x30333a,
        roughness: 0.8
    });


const woodMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x39261a,
        roughness: 0.8
    });


const pathMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x77736a,
        roughness: 1
    });


const grassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x536f49,
        roughness: 1
    });


/* =========================================================
   ACADEMY GROUP
   ========================================================= */

const academy =
    new THREE.Group();

scene.add(academy);


/* =========================================================
   BOX HELPER
   ========================================================= */

function box(
    width,
    height,
    depth,
    material,
    x,
    y,
    z
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

    mesh.castShadow = true;

    mesh.receiveShadow = true;

    academy.add(mesh);

    return mesh;
}


/* =========================================================
   CYLINDER HELPER
   ========================================================= */

function cylinder(
    radiusTop,
    radiusBottom,
    height,
    material,
    x,
    y,
    z,
    segments = 24
) {

    const mesh =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                radiusTop,
                radiusBottom,
                height,
                segments
            ),
            material
        );

    mesh.position.set(
        x,
        y,
        z
    );

    mesh.castShadow = true;

    mesh.receiveShadow = true;

    academy.add(mesh);

    return mesh;
}


/* =========================================================
   CONE ROOF
   ========================================================= */

function towerRoof(
    x,
    y,
    z,
    radius,
    height
) {

    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                radius,
                height,
                32
            ),
            roofMaterial
        );

    roof.position.set(
        x,
        y,
        z
    );

    roof.castShadow = true;

    academy.add(roof);

    return roof;
}


/* =========================================================
   MAIN CASTLE BODY
   ========================================================= */

function createMainCastle() {

    /* -----------------------------------------
       CENTRAL BUILDING
       ----------------------------------------- */

    box(
        42,
        24,
        28,
        stoneMaterial,
        0,
        12,
        -30
    );


    /* -----------------------------------------
       SECOND FLOOR
       ----------------------------------------- */

    box(
        30,
        10,
        22,
        darkStoneMaterial,
        0,
        29,
        -30
    );


    /* -----------------------------------------
       CENTRAL FRONT SECTION
       ----------------------------------------- */

    box(
        18,
        30,
        10,
        stoneMaterial,
        0,
        15,
        -14
    );


    /* -----------------------------------------
       CENTRAL HIGH TOWER
       ----------------------------------------- */

    cylinder(
        6,
        7,
        40,
        stoneMaterial,
        0,
        20,
        -34,
        32
    );


    towerRoof(
        0,
        43,
        -34,
        8,
        13
    );


    /* -----------------------------------------
       LEFT FRONT WING
       ----------------------------------------- */

    box(
        15,
        18,
        24,
        stoneMaterial,
        -25,
        9,
        -29
    );


    /* -----------------------------------------
       RIGHT FRONT WING
       ----------------------------------------- */

    box(
        15,
        18,
        24,
        stoneMaterial,
        25,
        9,
        -29
    );

}


/* =========================================================
   TOWERS
   ========================================================= */

function createTower(
    x,
    z,
    height = 30
) {

    cylinder(
        6,
        7,
        height,
        stoneMaterial,
        x,
        height / 2,
        z,
        32
    );


    /* Tower top */

    cylinder(
        6.7,
        6.7,
        1.5,
        darkStoneMaterial,
        x,
        height + 0.75,
        z,
        32
    );


    /* Roof */

    towerRoof(
        x,
        height + 7,
        z,
        8,
        13
    );


    /* Small roof tip */

    cylinder(
        0.18,
        0.18,
        3,
        darkStoneMaterial,
        x,
        height + 14,
        z,
        8
    );

}


/* Four academy towers */

createTower(
    -35,
    -22,
    30
);

createTower(
    35,
    -22,
    30
);

createTower(
    -35,
    -55,
    34
);

createTower(
    35,
    -55,
    34
);


/* =========================================================
   CASTLE FRONT WALLS
   ========================================================= */

function createFrontWalls() {

    /* Left wall */

    box(
        25,
        15,
        5,
        stoneMaterial,
        -28,
        7.5,
        -13
    );


    /* Right wall */

    box(
        25,
        15,
        5,
        stoneMaterial,
        28,
        7.5,
        -13
    );


    /* Above gate */

    box(
        12,
        13,
        5,
        stoneMaterial,
        0,
        21,
        -13
    );

}


/* =========================================================
   MAIN GATE
   ========================================================= */

function createMainGate() {

    /* Gate arch sides */

    box(
        5,
        14,
        4,
        darkStoneMaterial,
        -6,
        7,
        -16
    );


    box(
        5,
        14,
        4,
        darkStoneMaterial,
        6,
        7,
        -16
    );


    /* Gate top */

    box(
        17,
        5,
        4,
        darkStoneMaterial,
        0,
        14,
        -16
    );


    /* Wooden doors */

    const leftDoor =
        box(
            4.5,
            11,
            0.8,
            woodMaterial,
            -2.35,
            5.5,
            -18
        );


    const rightDoor =
        box(
            4.5,
            11,
            0.8,
            woodMaterial,
            2.35,
            5.5,
            -18
        );


    /* Door handles */

    cylinder(
        0.12,
        0.12,
        0.5,
        new THREE.MeshStandardMaterial({
            color: 0xb58a3c,
            metalness: 0.7,
            roughness: 0.3
        }),
        -0.5,
        5.5,
        -18.5,
        12
    ).rotation.x =
        Math.PI / 2;


    cylinder(
        0.12,
        0.12,
        0.5,
        new THREE.MeshStandardMaterial({
            color: 0xb58a3c,
            metalness: 0.7,
            roughness: 0.3
        }),
        0.5,
        5.5,
        -18.5,
        12
    ).rotation.x =
        Math.PI / 2;

}


/* =========================================================
   COURTYARD
   ========================================================= */

function createCourtyard() {

    const courtyard =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                65,
                0.3,
                55
            ),
            new THREE.MeshStandardMaterial({
                color: 0x77756c,
                roughness: 1
            })
        );


    courtyard.position.set(
        0,
        0.12,
        18
    );


    courtyard.receiveShadow = true;

    academy.add(courtyard);


    /* Central circular plaza */

    const circle =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                10,
                10,
                0.4,
                48
            ),
            darkStoneMaterial
        );


    circle.position.set(
        0,
        0.35,
        8
    );


    circle.receiveShadow = true;

    academy.add(circle);


    /* Fountain */

    const fountainBase =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                4,
                4.5,
                1,
                32
            ),
            stoneMaterial
        );


    fountainBase.position.set(
        0,
        0.9,
        8
    );

    fountainBase.castShadow = true;

    academy.add(fountainBase);


    const water =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                3.6,
                3.6,
                0.15,
                32
            ),
            new THREE.MeshStandardMaterial({
                color: 0x4f9db3,
                metalness: 0.2,
                roughness: 0.1
            })
        );


    water.position.set(
        0,
        1.45,
        8
    );

    academy.add(water);


    /* Fountain pillar */

    cylinder(
        0.8,
        1.1,
        4,
        stoneMaterial,
        0,
        2.8,
        8,
        24
    );


    /* Fountain top */

    cylinder(
        1.5,
        1.2,
        0.5,
        stoneMaterial,
        0,
        5,
        8,
        24
    );

}


/* =========================================================
   PATH TO ACADEMY
   ========================================================= */

function createPath() {

    const path =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                12,
                75
            ),
            pathMaterial
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


    /* Path stones */

    for (
        let z = 5;
        z < 75;
        z += 5
    ) {

        const stone =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    10,
                    0.15,
                    3.5
                ),
                pathMaterial
            );


        stone.position.set(
            0,
            0.12,
            z
        );


        stone.receiveShadow = true;

        scene.add(stone);

    }

}


/* =========================================================
   TORCH
   ========================================================= */

function createTorch(
    x,
    y,
    z
) {

    const group =
        new THREE.Group();


    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.12,
                0.18,
                2.5,
                10
            ),
            woodMaterial
        );


    pole.position.y =
        1.25;

    pole.castShadow = true;

    group.add(pole);


    const flame =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.3,
                12,
                12
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffa42b
            })
        );


    flame.position.y =
        2.65;

    group.add(flame);


    const light =
        new THREE.PointLight(
            0xff9a3c,
            2,
            12
        );


    light.position.y =
        2.7;

    group.add(light);


    group.position.set(
        x,
        y,
        z
    );


    scene.add(group);

}


/* Gate torches */

createTorch(
    -9,
    0,
    -17
);

createTorch(
    9,
    0,
    -17
);


/* Courtyard torches */

createTorch(
    -28,
    0,
    5
);

createTorch(
    28,
    0,
    5
);

createTorch(
    -28,
    0,
    28
);

createTorch(
    28,
    0,
    28
);


/* =========================================================
   TREES
   ========================================================= */

function createTree(
    x,
    z,
    scale = 1
) {

    const group =
        new THREE.Group();


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.35 * scale,
                0.5 * scale,
                4 * scale,
                12
            ),
            woodMaterial
        );


    trunk.position.y =
        2 * scale;

    trunk.castShadow = true;

    group.add(trunk);


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.3 * scale,
                16,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x315c35,
                roughness: 1
            })
        );


    leaves.position.y =
        5 * scale;

    leaves.castShadow = true;

    group.add(leaves);


    group.position.set(
        x,
        0,
        z
    );


    scene.add(group);

}


/* Forest around academy */

const treePositions = [

    [-55, 15],
    [-65, 35],
    [-55, 55],
    [-72, 70],

    [55, 15],
    [65, 35],
    [55, 55],
    [72, 70],

    [-80, 5],
    [-90, 25],
    [-82, 50],

    [80, 5],
    [90, 25],
    [82, 50],

    [-45, 90],
    [-20, 105],
    [20, 105],
    [45, 90]

];


treePositions.forEach(
    function (position) {

        createTree(
            position[0],
            position[1],
            0.8 +
            Math.random() * 0.7
        );

    }
);


/* =========================================================
   BUILD ACADEMY
   ========================================================= */

createMainCastle();

createFrontWalls();

createMainGate();

createCourtyard();

createPath();


/* =========================================================
   QUEST MARKER
   ========================================================= */

const questGroup =
    new THREE.Group();


const marker =
    new THREE.Mesh(
        new THREE.TorusGeometry(
            1.2,
            0.12,
            12,
            32
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffd75a
        })
    );


marker.rotation.x =
    Math.PI / 2;

marker.position.y =
    0.4;

questGroup.add(marker);


const markerBeam =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.08,
            0.08,
            4,
            10
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffd75a,
            transparent: true,
            opacity: 0.5
        })
    );


markerBeam.position.y =
    2;

questGroup.add(markerBeam);


questGroup.position.set(
    0,
    0,
    -18
);


scene.add(questGroup);


/* =========================================================
   PLAYER
   ========================================================= */

let player = null;

const playerBones = {};

const originalRotations =
    new Map();

let rightHand = null;

let wand = null;


/* =========================================================
   DRACO
   ========================================================= */

const dracoLoader =
    new DRACOLoader();

dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);


/* =========================================================
   GLTF
   ========================================================= */

const loader =
    new GLTFLoader();

loader.setDRACOLoader(
    dracoLoader
);


/* =========================================================
   LOAD AREN
   ========================================================= */

loader.load(

    "./assets/player/aren_valen.glb",

    function (gltf) {

        player =
            gltf.scene;


        /* Spawn outside academy */

        player.position.set(
            0,
            0,
            70
        );


        player.scale.set(
            1,
            1,
            1
        );


        player.traverse(
            function (object) {

                if (object.isMesh) {

                    object.castShadow = true;

                    object.receiveShadow = true;

                }


                if (object.isBone) {

                    playerBones[
                        object.name
                    ] = object;


                    originalRotations.set(
                        object.name,
                        {
                            x: object.rotation.x,
                            y: object.rotation.y,
                            z: object.rotation.z
                        }
                    );

                }

            }
        );


        rightHand =
            playerBones[
                "RightHand"
            ] ||
            null;


        scene.add(player);


        createWand();


        resetAnimatedBones();

        applyStandingPose();


        if (loading) {

            loading.style.display =
                "none";

        }


        console.log(
            "AREN VALEN READY"
        );

    },


    function (xhr) {

        if (
            xhr.total &&
            xhr.total > 0
        ) {

            const percent =
                xhr.loaded /
                xhr.total *
                100;

            console.log(
                "Loading Aren:",
                percent.toFixed(0) +
                "%"
            );

        }

    },


    function (error) {

        console.error(
            "AREN LOAD ERROR:",
            error
        );


        if (loading) {

            loading.innerHTML =
                "Player failed to load.";

        }

    }

);


/* =========================================================
   BONE HELPERS
   ========================================================= */

function getBone(name) {

    return playerBones[name] ||
        null;

}


function setBoneOffset(
    name,
    x = 0,
    y = 0,
    z = 0
) {

    const bone =
        getBone(name);

    if (!bone) return;


    const original =
        originalRotations.get(name);

    if (!original) return;


    bone.rotation.x =
        original.x + x;

    bone.rotation.y =
        original.y + y;

    bone.rotation.z =
        original.z + z;

}


/* =========================================================
   RESET BONES
   ========================================================= */

function resetAnimatedBones() {

    originalRotations.forEach(
        function (
            rotation,
            name
        ) {

            const bone =
                getBone(name);

            if (!bone) return;


            bone.rotation.set(
                rotation.x,
                rotation.y,
                rotation.z
            );

        }
    );

}


/* =========================================================
   STANDING POSE
   ========================================================= */

function applyStandingPose() {

    /* Shoulders */

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


    /* Arms */

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


    /* Forearms */

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


    /* Extra bones */

    setBoneOffset(
        "LeftForeArm1",
        0.04,
        0,
        0
    );


    setBoneOffset(
        "RightForeArm1",
        0.04,
        0,
        0
    );

}


/* =========================================================
   WAND
   ========================================================= */

function createWand() {

    if (!rightHand)
        return;


    wand =
        new THREE.Group();


    const handle =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.045,
                0.06,
                0.75,
                10
            ),
            woodMaterial
        );


    handle.rotation.z =
        Math.PI / 2;


    wand.add(handle);


    const tip =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.025,
                0.045,
                0.5,
                10
            ),
            woodMaterial
        );


    tip.position.x =
        0.6;


    tip.rotation.z =
        Math.PI / 2;


    wand.add(tip);


    rightHand.add(wand);


    wand.position.set(
        0,
        -0.02,
        0
    );

}


/* =========================================================
   MOVEMENT
   ========================================================= */

const keys = {

    forward: false,
    backward: false,
    left: false,
    right: false

};


let joystickX = 0;

let joystickY = 0;


const moveSpeed = 5.5;


/* =========================================================
   JOYSTICK
   ========================================================= */

let joystickActive = false;


function updateJoystick(
    clientX,
    clientY
) {

    if (!joystickBase)
        return;


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


    const radius =
        rect.width / 2;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance > radius) {

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


    if (joystickStick) {

        joystickStick.style.transform =
            `translate(${dx}px, ${dy}px)`;

    }

}


function resetJoystick() {

    joystickX = 0;

    joystickY = 0;

    joystickActive = false;


    if (joystickStick) {

        joystickStick.style.transform =
            "translate(0px, 0px)";

    }

}


if (joystickBase) {

    joystickBase.addEventListener(
        "touchstart",
        function (event) {

            joystickActive = true;


            const touch =
                event.touches[0];


            updateJoystick(
                touch.clientX,
                touch.clientY
            );


            event.preventDefault();

        },
        {
            passive: false
        }
    );


    joystickBase.addEventListener(
        "touchmove",
        function (event) {

            if (!joystickActive)
                return;


            const touch =
                event.touches[0];


            updateJoystick(
                touch.clientX,
                touch.clientY
            );


            event.preventDefault();

        },
        {
            passive: false
        }
    );


    joystickBase.addEventListener(
        "touchend",
        resetJoystick
    );


    joystickBase.addEventListener(
        "touchcancel",
        resetJoystick
    );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

window.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "w" ||
            event.key === "W" ||
            event.key === "ArrowUp"
        ) {

            keys.forward = true;

        }


        if (
            event.key === "s" ||
            event.key === "S" ||
            event.key === "ArrowDown"
        ) {

            keys.backward = true;

        }


        if (
            event.key === "a" ||
            event.key === "A" ||
            event.key === "ArrowLeft"
        ) {

            keys.left = true;

        }


        if (
            event.key === "d" ||
            event.key === "D" ||
            event.key === "ArrowRight"
        ) {

            keys.right = true;

        }

    }
);


window.addEventListener(
    "keyup",
    function (event) {

        if (
            event.key === "w" ||
            event.key === "W" ||
            event.key === "ArrowUp"
        ) {

            keys.forward = false;

        }


        if (
            event.key === "s" ||
            event.key === "S" ||
            event.key === "ArrowDown"
        ) {

            keys.backward = false;

        }


        if (
            event.key === "a" ||
            event.key === "A" ||
            event.key === "ArrowLeft"
        ) {

            keys.left = false;

        }


        if (
            event.key === "d" ||
            event.key === "D" ||
            event.key === "ArrowRight"
        ) {

            keys.right = false;

        }

    }
);


/* =========================================================
   CAMERA
   ========================================================= */

let cameraYaw = 0;

let cameraPitch = 0.25;

let cameraTouching = false;

let lastTouchX = 0;

let lastTouchY = 0;


/* =========================================================
   TOUCH CAMERA
   ========================================================= */

renderer.domElement.addEventListener(
    "touchstart",
    function (event) {

        if (
            event.touches.length !== 1
        )
            return;


        const touch =
            event.touches[0];


        cameraTouching = true;


        lastTouchX =
            touch.clientX;


        lastTouchY =
            touch.clientY;

    },
    {
        passive: true
    }
);


renderer.domElement.addEventListener(
    "touchmove",
    function (event) {

        if (!cameraTouching)
            return;


        if (
            event.touches.length !== 1
        )
            return;


        const touch =
            event.touches[0];


        const dx =
            touch.clientX -
            lastTouchX;


        const dy =
            touch.clientY -
            lastTouchY;


        lastTouchX =
            touch.clientX;


        lastTouchY =
            touch.clientY;


        cameraYaw -=
            dx * 0.006;


        cameraPitch -=
            dy * 0.004;


        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -0.15,
                0.85
            );

    },
    {
        passive: true
    }
);


renderer.domElement.addEventListener(
    "touchend",
    function () {

        cameraTouching = false;

    }
);


/* =========================================================
   JUMP
   ========================================================= */

let velocityY = 0;

let isJumping = false;


const gravity = -20;

const jumpPower = 8;


function jump() {

    if (!player)
        return;


    if (isJumping)
        return;


    velocityY =
        jumpPower;


    isJumping = true;

}


if (jumpBtn) {

    jumpBtn.addEventListener(
        "touchstart",
        function (event) {

            jump();

            event.preventDefault();

        },
        {
            passive: false
        }
    );


    jumpBtn.addEventListener(
        "click",
        jump
    );

}


/* =========================================================
   SPELL
   ========================================================= */

let isCasting = false;

let castTimer = 0;

const castDuration = 0.65;


function castSpell() {

    if (!player)
        return;


    if (isCasting)
        return;


    isCasting = true;

    castTimer = 0;


    createSpellProjectile();

}


if (spellBtn) {

    spellBtn.addEventListener(
        "touchstart",
        function (event) {

            castSpell();

            event.preventDefault();

        },
        {
            passive: false
        }
    );


    spellBtn.addEventListener(
        "click",
        castSpell
    );

}


/* =========================================================
   SPELL PROJECTILE
   ========================================================= */

function createSpellProjectile() {

    if (!player)
        return;


    const projectile =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.14,
                16,
                16
            ),
            new THREE.MeshBasicMaterial({
                color: 0x8fd8ff
            })
        );


    const start =
        new THREE.Vector3();


    player.getWorldPosition(
        start
    );


    start.y += 1.5;


    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );


    direction.applyQuaternion(
        player.quaternion
    );


    projectile.position.copy(
        start
    );


    scene.add(projectile);


    let life = 0;


    function projectileLoop() {

        const delta =
            1 / 60;


        life += delta;


        projectile.position.add(
            direction
                .clone()
                .multiplyScalar(
                    22 * delta
                )
        );


        if (life >= 2) {

            scene.remove(
                projectile
            );


            projectile.geometry.dispose();

            projectile.material.dispose();

            return;

        }


        requestAnimationFrame(
            projectileLoop
        );

    }


    projectileLoop();

}


/* =========================================================
   WALKING
   ========================================================= */

let walkTime = 0;


function applyWalkingAnimation(
    delta,
    amount
) {

    walkTime +=
        delta *
        8;


    const swing =
        Math.sin(
            walkTime
        );


    const opposite =
        Math.sin(
            walkTime +
            Math.PI
        );


    const strength =
        THREE.MathUtils.clamp(
            amount,
            0,
            1
        );


    /* Legs */

    setBoneOffset(
        "LeftUpLeg",
        swing *
        0.55 *
        strength,
        0,
        0
    );


    setBoneOffset(
        "RightUpLeg",
        opposite *
        0.55 *
        strength,
        0,
        0
    );


    setBoneOffset(
        "LeftLeg",
        Math.max(
            0,
            -swing
        ) *
        0.45 *
        strength,
        0,
        0
    );


    setBoneOffset(
        "RightLeg",
        Math.max(
            0,
            -opposite
        ) *
        0.45 *
        strength,
        0,
        0
    );


    /* Arms */

    setBoneOffset(
        "LeftArm",
        Math.PI / 2 +
        opposite *
        0.18 *
        strength,
        0,
        0
    );


    setBoneOffset(
        "RightArm",
        Math.PI / 2 +
        swing *
        0.08 *
        strength,
        0,
        0
    );


    /* Body */

    setBoneOffset(
        "Spine",
        Math.abs(swing) *
        0.025 *
        strength,
        0,
        0
    );

}


/* =========================================================
   IDLE
   ========================================================= */

function applyIdleAnimation(
    elapsed
) {

    applyStandingPose();


    const breathing =
        Math.sin(
            elapsed * 2
        );


    const gentle =
        Math.sin(
            elapsed * 1.2
        );


    setBoneOffset(
        "Spine",
        breathing *
        0.008,
        0,
        gentle *
        0.008
    );


    setBoneOffset(
        "Head",
        0,
        gentle *
        0.015,
        0
    );

}


/* =========================================================
   JUMP POSE
   ========================================================= */

function applyJumpAnimation() {

    applyStandingPose();


    setBoneOffset(
        "LeftUpLeg",
        -0.20,
        0,
        0
    );


    setBoneOffset(
        "RightUpLeg",
        -0.20,
        0,
        0
    );


    setBoneOffset(
        "LeftLeg",
        0.45,
        0,
        0
    );


    setBoneOffset(
        "RightLeg",
        0.45,
        0,
        0
    );

}


/* =========================================================
   CASTING POSE
   ========================================================= */

function applyCastingAnimation() {

    applyStandingPose();


    setBoneOffset(
        "RightArm",
        Math.PI / 2 -
        0.75,
        0,
        0
    );


    setBoneOffset(
        "RightForeArm",
        -0.30,
        0,
        0
    );


    setBoneOffset(
        "RightForeArm1",
        -0.10,
        0,
        0
    );


    setBoneOffset(
        "Spine",
        -0.04,
        0,
        0
    );

}


/* =========================================================
   PLAYER UPDATE
   ========================================================= */

function updatePlayer(
    delta,
    elapsed
) {

    if (!player)
        return;


    let inputX =
        joystickX;


    let inputZ =
        joystickY;


    if (keys.left)
        inputX -= 1;


    if (keys.right)
        inputX += 1;


    if (keys.forward)
        inputZ -= 1;


    if (keys.backward)
        inputZ += 1;


    const inputLength =
        Math.sqrt(
            inputX * inputX +
            inputZ * inputZ
        );


    if (inputLength > 1) {

        inputX /=
            inputLength;

        inputZ /=
            inputLength;

    }


    /* -----------------------------------------
       CAMERA RELATIVE MOVEMENT
       ----------------------------------------- */

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


    const movement =
        new THREE.Vector3();


    movement.add(
        forward
            .clone()
            .multiplyScalar(
                -inputZ
            )
    );


    movement.add(
        right
            .clone()
            .multiplyScalar(
                inputX
            )
    );


    const moving =
        movement.lengthSq() >
        0.001;


    /* -----------------------------------------
       MOVE
       ----------------------------------------- */

    if (moving) {

        movement.normalize();


        player.position.add(
            movement
                .clone()
                .multiplyScalar(
                    moveSpeed *
                    delta
                )
        );


        /* Turn player */

        const targetAngle =
            Math.atan2(
                movement.x,
                movement.z
            );


        let difference =
            targetAngle -
            player.rotation.y;


        difference =
            Math.atan2(
                Math.sin(difference),
                Math.cos(difference)
            );


        player.rotation.y +=
            difference *
            Math.min(
                1,
                delta * 10
            );

    }


    /* -----------------------------------------
       JUMP
       ----------------------------------------- */

    if (isJumping) {

        player.position.y +=
            velocityY *
            delta;


        velocityY +=
            gravity *
            delta;


        if (
            player.position.y <= 0
        ) {

            player.position.y = 0;

            velocityY = 0;

            isJumping = false;

        }

    }


    /* -----------------------------------------
       ANIMATION
       ----------------------------------------- */

    resetAnimatedBones();


    if (isCasting) {

        applyCastingAnimation();

    }
    else if (isJumping) {

        applyJumpAnimation();

    }
    else if (moving) {

        applyStandingPose();


        applyWalkingAnimation(
            delta,
            inputLength
        );

    }
    else {

        applyIdleAnimation(
            elapsed
        );

    }


    /* -----------------------------------------
       SPELL TIMER
       ----------------------------------------- */

    if (isCasting) {

        castTimer +=
            delta;


        if (
            castTimer >=
            castDuration
        ) {

            isCasting = false;

        }

    }

}


/* =========================================================
   CAMERA FOLLOW
   ========================================================= */

function updateCamera(
    delta
) {

    if (!player)
        return;


    const distance = 8;

    const height = 3.5;


    const target =
        player.position.clone();


    target.y += 1.5;


    const offset =
        new THREE.Vector3(
            Math.sin(cameraYaw) *
            distance,

            height +
            Math.sin(cameraPitch) *
            3,

            Math.cos(cameraYaw) *
            distance
        );


    const desired =
        target.clone()
            .add(offset);


    const smoothing =
        1 -
        Math.pow(
            0.001,
            delta
        );


    camera.position.lerp(
        desired,
        smoothing
    );


    camera.lookAt(
        target
    );

}


/* =========================================================
   ANIMATE QUEST MARKER
   ========================================================= */

function updateQuestMarker(
    elapsed
) {

    marker.rotation.z =
        elapsed * 1.5;


    marker.position.y =
        0.4 +
        Math.sin(
            elapsed * 2
        ) * 0.15;


    markerBeam.material.opacity =
        0.35 +
        Math.sin(
            elapsed * 3
        ) * 0.15;

}


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    function () {

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
   GAME CLOCK
   ========================================================= */

const clock =
    new THREE.Clock();


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


    updatePlayer(
        delta,
        elapsed
    );


    updateCamera(
        delta
    );


    updateQuestMarker(
        elapsed
    );


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
    "===================================="
);

console.log(
    "AETHERIA ACADEMY"
);

console.log(
    "STEP 1 - ACADEMY WORLD LOADED"
);

console.log(
    "Joystick = Move"
);

console.log(
    "Screen drag = Camera"

);

console.log(
    "Jump = Jump"
);

console.log(
    "Spell = Cast"
);

console.log(
    "===================================="
);
