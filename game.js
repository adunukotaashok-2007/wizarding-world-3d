/* =========================================================
   AETHERIA ACADEMY
   COMPLETE 3D MOBILE GAME
========================================================= */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { GLTFLoader } from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

import { DRACOLoader } from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js";


/* =========================================================
   DOM
========================================================= */

const game =
    document.getElementById("game");

const loading =
    document.getElementById("loading");

const joystick =
    document.getElementById("joystick");

const joystickKnob =
    document.getElementById("joystickKnob");

const jumpButton =
    document.getElementById("jumpButton");

const spellButton =
    document.getElementById("spellButton");

const questText =
    document.getElementById("questText");

const xpElement =
    document.getElementById("xp");

const dialogueBox =
    document.getElementById("dialogueBox");

let interactButton =
    document.getElementById("interactButton");


/* =========================================================
   LOADING
========================================================= */

function hideLoadingScreen() {

    if (!loading) return;

    loading.style.opacity = "0";

    setTimeout(() => {

        loading.style.display =
            "none";

    }, 600);

}


/* =========================================================
   ERROR LOG
========================================================= */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "Aetheria error:",
            event.error ||
            event.message
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "Aetheria promise error:",
            event.reason
        );

    }
);


/* =========================================================
   SCENE
========================================================= */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x07111c
    );

scene.fog =
    new THREE.Fog(
        0x07111c,
        45,
        230
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
    5,
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
        window.devicePixelRatio || 1,
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


renderer.domElement.style.touchAction =
    "none";


game.appendChild(
    renderer.domElement
);


/* =========================================================
   LIGHTING
========================================================= */

const hemisphere =
    new THREE.HemisphereLight(
        0xbfdcff,
        0x263018,
        2.2
    );

scene.add(
    hemisphere
);


const sun =
    new THREE.DirectionalLight(
        0xfff2d0,
        3
    );

sun.position.set(
    50,
    100,
    40
);

sun.castShadow =
    true;

sun.shadow.mapSize.width =
    2048;

sun.shadow.mapSize.height =
    2048;

sun.shadow.camera.left =
    -120;

sun.shadow.camera.right =
    120;

sun.shadow.camera.top =
    120;

sun.shadow.camera.bottom =
    -120;

sun.shadow.camera.near =
    1;

sun.shadow.camera.far =
    300;

scene.add(
    sun
);


/* =========================================================
   MATERIALS
========================================================= */

const groundMat =
    new THREE.MeshStandardMaterial({

        color: 0x33452f,

        roughness: 1

    });


const grassMat =
    new THREE.MeshStandardMaterial({

        color: 0x526b3b,

        roughness: 1

    });


const stoneMat =
    new THREE.MeshStandardMaterial({

        color: 0x6c7077,

        roughness: 0.92,

        metalness: 0.05

    });


const darkStoneMat =
    new THREE.MeshStandardMaterial({

        color: 0x333740,

        roughness: 0.95

    });


const roofMat =
    new THREE.MeshStandardMaterial({

        color: 0x242832,

        roughness: 0.9

    });


const woodMat =
    new THREE.MeshStandardMaterial({

        color: 0x4b3020,

        roughness: 0.9

    });


const goldMat =
    new THREE.MeshStandardMaterial({

        color: 0xb9964c,

        metalness: 0.7,

        roughness: 0.3

    });


const waterMat =
    new THREE.MeshStandardMaterial({

        color: 0x327eaa,

        transparent: true,

        opacity: 0.75,

        roughness: 0.1

    });


/* =========================================================
   COLLISION
========================================================= */

const collisionBoxes = [];

const treeColliders = [];

const playerRadius = 0.7;


function addCollisionBox(
    x,
    y,
    z,
    width,
    height,
    depth
) {

    collisionBoxes.push({

        minX:
            x - width / 2,

        maxX:
            x + width / 2,

        minY:
            y - height / 2,

        maxY:
            y + height / 2,

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


    mesh.castShadow =
        true;

    mesh.receiveShadow =
        true;


    scene.add(
        mesh
    );


    if (collision) {

        addCollisionBox(
            x,
            y,
            z,
            width,
            height,
            depth
        );

    }


    return mesh;

}


/* =========================================================
   GROUND
========================================================= */

box(
    240,
    1,
    240,
    0,
    -0.5,
    25,
    groundMat,
    false
);


/* =========================================================
   GRASS
========================================================= */

function createGrassPatch(
    x,
    z
) {

    const geometry =
        new THREE.PlaneGeometry(
            14,
            14
        );


    const mesh =
        new THREE.Mesh(
            geometry,
            grassMat
        );


    mesh.rotation.x =
        -Math.PI / 2;


    mesh.position.set(
        x,
        0.01,
        z
    );


    mesh.receiveShadow =
        true;


    scene.add(
        mesh
    );

}


for (
    let x = -100;
    x <= 100;
    x += 20
) {

    for (
        let z = -20;
        z <= 120;
        z += 20
    ) {

        createGrassPatch(
            x,
            z
        );

    }

}


/* =========================================================
   ACADEMY
========================================================= */

function createAcademy() {

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
        44,
        6,
        30,
        0,
        27,
        -30,
        roofMat,
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


    /* Gate */

    box(
        4,
        16,
        5,
        -10,
        8,
        -17,
        stoneMat,
        true
    );


    box(
        4,
        16,
        5,
        10,
        8,
        -17,
        stoneMat,
        true
    );


    box(
        24,
        5,
        5,
        0,
        16,
        -17,
        stoneMat,
        true
    );


    const door =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                18,
                14,
                1.2
            ),
            woodMat
        );


    door.position.set(
        0,
        7,
        -16
    );


    door.castShadow =
        true;


    scene.add(
        door
    );


    const crest =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                3,
                3,
                0.5,
                32
            ),
            goldMat
        );


    crest.rotation.x =
        Math.PI / 2;


    crest.position.set(
        0,
        12,
        -16.5
    );


    scene.add(
        crest
    );

}


createAcademy();


/* =========================================================
   COURTYARD
========================================================= */

const courtyard =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            18,
            18,
            0.25,
            64
        ),
        stoneMat
    );


courtyard.position.set(
    0,
    0.12,
    18
);


courtyard.receiveShadow =
    true;


scene.add(
    courtyard
);


/* =========================================================
   PATH
========================================================= */

box(
    14,
    0.15,
    110,
    0,
    0.08,
    40,
    stoneMat,
    false
);


/* =========================================================
   FOUNTAIN
========================================================= */

function createFountain() {

    const base =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                8,
                9,
                1,
                48
            ),
            stoneMat
        );


    base.position.set(
        0,
        0.5,
        18
    );


    base.castShadow =
        true;

    base.receiveShadow =
        true;


    scene.add(
        base
    );


    const water =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                7.3,
                7.3,
                0.35,
                48
            ),
            waterMat
        );


    water.position.set(
        0,
        1.1,
        18
    );


    scene.add(
        water
    );


    const pillar =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.2,
                1.6,
                6,
                32
            ),
            stoneMat
        );


    pillar.position.set(
        0,
        3.5,
        18
    );


    pillar.castShadow =
        true;


    scene.add(
        pillar
    );


    const top =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                3,
                2.2,
                0.8,
                32
            ),
            stoneMat
        );


    top.position.set(
        0,
        6.7,
        18
    );


    top.castShadow =
        true;


    scene.add(
        top
    );

}


createFountain();


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


    group.position.set(
        x,
        0,
        z
    );


    group.scale.setScalar(
        scale
    );


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.8,
                1.15,
                7,
                12
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


    const leafMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x29452b,

            roughness: 1

        });


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                4.2,
                16,
                12
            ),
            leafMaterial
        );


    leaves.position.y =
        8;


    leaves.scale.set(
        1.25,
        1.15,
        1.25
    );


    leaves.castShadow =
        true;


    group.add(
        leaves
    );


    const leaves2 =
        leaves.clone();


    leaves2.position.set(
        -2.5,
        10,
        0.5
    );


    leaves2.scale.setScalar(
        0.7
    );


    group.add(
        leaves2
    );


    const leaves3 =
        leaves.clone();


    leaves3.position.set(
        2.4,
        10.5,
        -0.4
    );


    leaves3.scale.setScalar(
        0.7
    );


    group.add(
        leaves3
    );


    scene.add(
        group
    );


    treeColliders.push({

        x,
        z,

        radius:
            2.2 * scale

    });

}


const treePositions = [

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

];


for (
    const [x, z]
    of treePositions
) {

    createTree(
        x,
        z,
        1 +
        Math.random() * 0.25
    );

}


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


    group.position.set(
        x,
        0,
        z
    );


    const stick =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.15,
                0.2,
                3,
                10
            ),
            woodMat
        );


    stick.position.y =
        1.5;


    stick.castShadow =
        true;


    group.add(
        stick
    );


    const flame =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.65,
                16,
                16
            ),
            new THREE.MeshBasicMaterial({

                color: 0xff9f32,

                transparent: true,

                opacity: 0.95

            })
        );


    flame.position.y =
        3.3;


    flame.scale.set(
        0.65,
        1.4,
        0.65
    );


    group.add(
        flame
    );


    const light =
        new THREE.PointLight(
            0xff9b3d,
            3,
            13
        );


    light.position.y =
        3.2;


    group.add(
        light
    );


    scene.add(
        group
    );


    torches.push({

        flame,
        light,

        base:
            Math.random() * 10

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

let playerBones = {};

let rightHandBone = null;

let wand = null;


/* =========================================================
   PLAYER STATE
========================================================= */

let isJumping = false;

let verticalVelocity = 0;

let isMoving = false;

let isRunning = false;

let casting = false;

let castTimer = 0;

let xp = 0;

let lastMoveDirection =
    new THREE.Vector3(
        0,
        0,
        -1
    );


/* =========================================================
   BONE ROTATIONS
========================================================= */

const baseBoneQuaternions =
    new Map();


function saveBoneRotation(
    bone
) {

    if (
        !baseBoneQuaternions.has(
            bone.name
        )
    ) {

        baseBoneQuaternions.set(
            bone.name,
            bone.quaternion.clone()
        );

    }

}


function setBoneOffset(
    name,
    x = 0,
    y = 0,
    z = 0
) {

    const bone =
        playerBones[name];


    if (!bone) return;


    saveBoneRotation(
        bone
    );


    const base =
        baseBoneQuaternions.get(
            name
        );


    bone.quaternion.copy(
        base
    );


    const offset =
        new THREE.Quaternion();


    offset.setFromEuler(
        new THREE.Euler(
            x,
            y,
            z,
            "XYZ"
        )
    );


    bone.quaternion.multiply(
        offset
    );

}


/* =========================================================
   STANDING
========================================================= */

function applyStandingPose() {

    if (!player) return;


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


    const breathe =
        Math.sin(
            time * 2
        ) * 0.025;


    setBoneOffset(
        "Spine",
        breathe,
        0,
        0
    );


    setBoneOffset(
        "Head",
        Math.sin(
            time * 0.8
        ) * 0.025,
        Math.sin(
            time * 0.6
        ) * 0.03,
        0
    );

}


/* =========================================================
   WALK
========================================================= */

function applyWalkingAnimation(
    time,
    speed,
    running
) {

    applyStandingPose();


    const swing =
        Math.sin(
            time *
            speed *
            7
        ) *
        (
            running
                ? 0.65
                : 0.45
        );


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
            -swing
        ) * 0.45,
        0,
        0
    );


    setBoneOffset(
        "RightLeg",
        Math.max(
            0,
            swing
        ) * 0.45,
        0,
        0
    );


    setBoneOffset(
        "LeftArm",
        Math.PI / 2,
        0,
        -swing * 0.45
    );


    setBoneOffset(
        "RightArm",
        Math.PI / 2,
        0,
        swing * 0.45
    );

}


/* =========================================================
   JUMP
========================================================= */

function applyJumpAnimation() {

    applyStandingPose();


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
        "LeftUpLeg",
        -0.35,
        0,
        0
    );


    setBoneOffset(
        "RightUpLeg",
        -0.35,
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

    applyStandingPose();


    const progress =
        Math.min(
            1,
            castTimer /
            0.55
        );


    const raise =
        Math.sin(
            progress *
            Math.PI
        );


    setBoneOffset(
        "RightArm",
        Math.PI / 2 -
        1.1 * raise,
        0,
        -0.35 * raise
    );


    setBoneOffset(
        "RightForeArm",
        -0.8 * raise,
        0,
        0
    );


    setBoneOffset(
        "Head",
        0,
        Math.sin(
            time * 4
        ) * 0.03,
        0
    );

}


/* =========================================================
   WAND
========================================================= */

function createWand() {

    if (!rightHandBone)
        return;


    const geometry =
        new THREE.CylinderGeometry(
            0.055,
            0.08,
            1.5,
            10
        );


    const material =
        new THREE.MeshStandardMaterial({

            color: 0x382217,

            roughness: 0.7

        });


    wand =
        new THREE.Mesh(
            geometry,
            material
        );


    wand.rotation.z =
        -Math.PI / 2;


    rightHandBone.add(
        wand
    );

}


/* =========================================================
   LOAD AREN
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


loader.load(

    "./assets/player/aren_valen.glb",

    function (gltf) {

        player =
            gltf.scene;


        player.position.set(
            0,
            0,
            70
        );


        player.traverse(
            function (object) {

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

                }

            }
        );


        const bounds =
            new THREE.Box3()
                .setFromObject(
                    player
                );


        const size =
            new THREE.Vector3();


        bounds.getSize(
            size
        );


        if (size.y > 0) {

            const desiredHeight =
                2.8;


            const scale =
                desiredHeight /
                size.y;


            player.scale.setScalar(
                scale
            );

        }


        scene.add(
            player
        );


        rightHandBone =
            playerBones[
                "RightHand"
            ] ||
            null;


        if (
            rightHandBone
        ) {

            createWand();

        }


        applyStandingPose();


        hideLoadingScreen();

    },


    function (xhr) {

        if (xhr.total) {

            console.log(
                "Player loading:",
                Math.round(
                    xhr.loaded /
                    xhr.total *
                    100
                ) + "%"
            );

        }

    },


    function (error) {

        console.error(
            "Aren GLB error:",
            error
        );


        createFallbackPlayer();

        hideLoadingScreen();

    }

);


/* =========================================================
   FALLBACK PLAYER
========================================================= */

function createFallbackPlayer() {

    const group =
        new THREE.Group();


    group.position.set(
        0,
        0,
        70
    );


    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.55,
                1.2,
                8,
                16
            ),
            new THREE.MeshStandardMaterial({

                color: 0x25263a,

                roughness: 0.8

            })
        );


    body.position.y =
        1.25;


    body.castShadow =
        true;


    group.add(
        body
    );


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.42,
                20,
                16
            ),
            new THREE.MeshStandardMaterial({

                color: 0xb78362,

                roughness: 0.8

            })
        );


    head.position.y =
        2.25;


    head.castShadow =
        true;


    group.add(
        head
    );


    const hat =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.55,
                0.9,
                20
            ),
            new THREE.MeshStandardMaterial({

                color: 0x201a35,

                roughness: 0.8

            })
        );


    hat.position.y =
        2.9;


    group.add(
        hat
    );


    scene.add(
        group
    );


    player =
        group;

}


/* =========================================================
   NPC
========================================================= */

let npc = null;

let npcCrystal = null;


function createNPC() {

    npc =
        new THREE.Group();


    npc.position.set(
        14,
        0,
        15
    );


    const robe =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.9,
                2.5,
                20
            ),
            new THREE.MeshStandardMaterial({

                color: 0x30264b,

                roughness: 0.9

            })
        );


    robe.position.y =
        1.25;


    robe.castShadow =
        true;


    npc.add(
        robe
    );


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.38,
                20,
                16
            ),
            new THREE.MeshStandardMaterial({

                color: 0xb98261,

                roughness: 0.8

            })
        );


    head.position.y =
        2.85;


    npc.add(
        head
    );


    const hat =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.55,
                0.85,
                20
            ),
            new THREE.MeshStandardMaterial({

                color: 0x161421,

                roughness: 0.9

            })
        );


    hat.position.y =
        3.5;


    npc.add(
        hat
    );


    const staff =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.07,
                0.09,
                3.3,
                10
            ),
            woodMat
        );


    staff.position.set(
        1,
        1.6,
        0
    );


    npc.add(
        staff
    );


    npcCrystal =
        new THREE.Mesh(
            new THREE.OctahedronGeometry(
                0.25
            ),
            new THREE.MeshStandardMaterial({

                color: 0x8d6cff,

                emissive: 0x4820aa,

                emissiveIntensity: 2

            })
        );


    npcCrystal.position.set(
        1,
        3.3,
        0
    );


    npc.add(
        npcCrystal
    );


    scene.add(
        npc
    );

}


createNPC();


/* =========================================================
   QUEST
========================================================= */

const QUEST_TALK =
    "TALK_TO_AELION";

const QUEST_MARKER =
    "FIND_ANCIENT_MARKER";

const QUEST_COMPLETE =
    "COMPLETED";


let questState =
    QUEST_TALK;


function updateQuestUI() {

    if (questState === QUEST_TALK) {

        questText.textContent =
            "Quest: Meet the Academy Guide";

    }


    if (questState === QUEST_MARKER) {

        questText.textContent =
            "Quest: Find the Ancient Marker";

    }


    if (questState === QUEST_COMPLETE) {

        questText.textContent =
            "Quest Complete: The First Secret";

    }


    xpElement.textContent =
        "XP " + xp;

}


updateQuestUI();


/* =========================================================
   DIALOGUE
========================================================= */

function showDialogue(
    text
) {

    dialogueBox.textContent =
        text;


    dialogueBox.style.display =
        "block";


    clearTimeout(
        showDialogue.timer
    );


    showDialogue.timer =
        setTimeout(
            function () {

                dialogueBox.style.display =
                    "none";

            },
            4500
        );

}


/* =========================================================
   TALK
========================================================= */

if (!interactButton) {

    interactButton =
        document.createElement(
            "button"
        );


    interactButton.id =
        "interactButton";


    interactButton.textContent =
        "TALK";


    document.body.appendChild(
        interactButton
    );

}


interactButton.addEventListener(
    "click",
    interactWithNPC
);


function interactWithNPC() {

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


    if (distance > 7) {

        return;

    }


    if (
        questState ===
        QUEST_TALK
    ) {

        questState =
            QUEST_MARKER;


        xp += 50;


        updateQuestUI();


        showDialogue(
            "Professor Aelion: Welcome to Aetheria Academy. An ancient magical marker waits beyond the courtyard."
        );


        return;

    }


    if (
        questState ===
        QUEST_MARKER
    ) {

        showDialogue(
            "Professor Aelion: Search near the great academy gate."
        );


        return;

    }


    showDialogue(
        "Professor Aelion: The academy has many secrets."
    );

}


/* =========================================================
   ANCIENT MARKER
========================================================= */

const markerGroup =
    new THREE.Group();


markerGroup.position.set(
    0,
    0,
    -18
);


const markerBase =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            1.2,
            1.5,
            2.4,
            8
        ),
        darkStoneMat
    );


markerBase.position.y =
    1.2;


markerBase.castShadow =
    true;


markerGroup.add(
    markerBase
);


const markerCrystal =
    new THREE.Mesh(
        new THREE.OctahedronGeometry(
            0.65
        ),
        new THREE.MeshStandardMaterial({

            color: 0x7c8cff,

            emissive: 0x2630aa,

            emissiveIntensity: 2

        })
    );


markerCrystal.position.y =
    2.8;


markerGroup.add(
    markerCrystal
);


scene.add(
    markerGroup
);


/* =========================================================
   JOYSTICK
========================================================= */

const joystickInput = {

    x: 0,

    y: 0

};


let joystickActive =
    false;

let joystickPointerId =
    null;


function updateJoystick(
    clientX,
    clientY
) {

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


    const radius =
        rect.width * 0.5;


    const knobRadius =
        rect.width * 0.24;


    const maxDistance =
        radius -
        knobRadius;


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


    joystickInput.x =
        dx /
        maxDistance;


    joystickInput.y =
        dy /
        maxDistance;


    joystickKnob.style.transform =
        `translate(${dx}px, ${dy}px)`;

}


function resetJoystick() {

    joystickActive =
        false;


    joystickPointerId =
        null;


    joystickInput.x =
        0;


    joystickInput.y =
        0;


    joystickKnob.style.transform =
        "translate(0px, 0px)";

}


joystick.addEventListener(
    "pointerdown",
    function (event) {

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

    },
    {
        passive: false
    }
);


joystick.addEventListener(
    "pointermove",
    function (event) {

        if (
            !joystickActive ||
            event.pointerId !==
                joystickPointerId
        ) {

            return;

        }


        event.preventDefault();


        updateJoystick(
            event.clientX,
            event.clientY
        );

    },
    {
        passive: false
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


/* =========================================================
   KEYBOARD
========================================================= */

const keys = {};


window.addEventListener(
    "keydown",
    function (event) {

        keys[event.code] =
            true;


        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            jump();

        }


        if (
            event.code ===
            "KeyF"
        ) {

            castSpell();

        }

    }
);


window.addEventListener(
    "keyup",
    function (event) {

        keys[event.code] =
            false;

    }
);


/* =========================================================
   CAMERA
========================================================= */

let cameraYaw =
    0;

let cameraPitch =
    0.18;

let cameraDragging =
    false;

let cameraPointerId =
    null;

let cameraLastX =
    0;

let cameraLastY =
    0;


function isControlElement(
    target
) {

    if (!target)
        return false;


    return (
        target.closest &&
        target.closest(
            "#joystick, #jumpButton, #spellButton, #interactButton, #landscapeButton"
        )
    );

}


renderer.domElement.addEventListener(
    "pointerdown",
    function (event) {

        if (
            isControlElement(
                event.target
            )
        ) {

            return;

        }


        cameraDragging =
            true;


        cameraPointerId =
            event.pointerId;


        cameraLastX =
            event.clientX;


        cameraLastY =
            event.clientY;


        try {

            renderer.domElement.setPointerCapture(
                event.pointerId
            );

        } catch {}


        event.preventDefault();

    },
    {
        passive: false
    }
);


renderer.domElement.addEventListener(
    "pointermove",
    function (event) {

        if (
            !cameraDragging ||
            event.pointerId !==
                cameraPointerId
        ) {

            return;

        }


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


        cameraYaw -=
            dx * 0.006;


        cameraPitch -=
            dy * 0.004;


        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -0.35,
                0.75
            );


        event.preventDefault();

    },
    {
        passive: false
    }
);


function stopCameraDrag() {

    cameraDragging =
        false;


    cameraPointerId =
        null;

}


renderer.domElement.addEventListener(
    "pointerup",
    stopCameraDrag
);


renderer.domElement.addEventListener(
    "pointercancel",
    stopCameraDrag
);


renderer.domElement.addEventListener(
    "lostpointercapture",
    stopCameraDrag
);


/* =========================================================
   DIRECTIONS
========================================================= */

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


/* =========================================================
   COLLISION
========================================================= */

function blockedAt(
    x,
    z
) {

    for (
        const boxData
        of collisionBoxes
    ) {

        if (

            x + playerRadius >
                boxData.minX &&

            x - playerRadius <
                boxData.maxX &&

            z + playerRadius >
                boxData.minZ &&

            z - playerRadius <
                boxData.maxZ

        ) {

            return true;

        }

    }


    for (
        const tree
        of treeColliders
    ) {

        const dx =
            x -
            tree.x;


        const dz =
            z -
            tree.z;


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

            return true;

        }

    }


    return false;

}


/* =========================================================
   INPUT
========================================================= */

function getMovementInput() {

    let x =
        joystickInput.x;


    let y =
        joystickInput.y;


    if (
        keys["KeyA"] ||
        keys["ArrowLeft"]
    ) {

        x -= 1;

    }


    if (
        keys["KeyD"] ||
        keys["ArrowRight"]
    ) {

        x += 1;

    }


    if (
        keys["KeyW"] ||
        keys["ArrowUp"]
    ) {

        y -= 1;

    }


    if (
        keys["KeyS"] ||
        keys["ArrowDown"]
    ) {

        y += 1;

    }


    const length =
        Math.sqrt(
            x * x +
            y * y
        );


    if (length > 1) {

        x /= length;

        y /= length;

    }


    return {
        x,
        y
    };

}


/* =========================================================
   MOVEMENT
========================================================= */

function updateMovement(
    delta
) {

    if (!player)
        return;


    const input =
        getMovementInput();


    const magnitude =
        Math.sqrt(
            input.x *
                input.x +
            input.y *
                input.y
        );


    isMoving =
        magnitude >
        0.08;


    isRunning =
        isMoving &&
        (
            keys["ShiftLeft"] ||
            keys["ShiftRight"] ||
            magnitude > 0.85
        );


    if (!isMoving)
        return;


    const speed =
        isRunning
            ? 9
            : 5.5;


    forward.set(
        0,
        0,
        -1
    );


    right.set(
        1,
        0,
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


    direction.copy(
        forward
    );


    direction.multiplyScalar(
        -input.y
    );


    direction.add(
        right
            .clone()
            .multiplyScalar(
                input.x
            )
    );


    if (
        direction.lengthSq() >
        0.001
    ) {

        direction.normalize();


        lastMoveDirection.copy(
            direction
        );


        const targetAngle =
            Math.atan2(
                direction.x,
                direction.z
            );


        let difference =
            targetAngle -
            player.rotation.y;


        while (
            difference >
            Math.PI
        ) {

            difference -=
                Math.PI * 2;

        }


        while (
            difference <
            -Math.PI
        ) {

            difference +=
                Math.PI * 2;

        }


        player.rotation.y +=
            difference *
            Math.min(
                1,
                delta * 10
            );

    }


    const move =
        direction
            .clone()
            .multiplyScalar(
                speed *
                delta
            );


    const newX =
        player.position.x +
        move.x;


    const newZ =
        player.position.z +
        move.z;


    if (
        !blockedAt(
            newX,
            player.position.z
        )
    ) {

        player.position.x =
            newX;

    }


    if (
        !blockedAt(
            player.position.x,
            newZ
        )
    ) {

        player.position.z =
            newZ;

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


    isJumping =
        true;


    verticalVelocity =
        8.5;

}


jumpButton.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        jump();

    },
    {
        passive: false
    }
);


jumpButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

    }
);


/* =========================================================
   UPDATE JUMP
========================================================= */

function updateJump(
    delta
) {

    if (!player)
        return;


    if (!isJumping)
        return;


    verticalVelocity -=
        20 *
        delta;


    player.position.y +=
        verticalVelocity *
        delta;


    if (
        player.position.y <= 0
    ) {

        player.position.y =
            0;


        verticalVelocity =
            0;


        isJumping =
            false;

    }

}


/* =========================================================
   SPELL
========================================================= */

const spellParticles = [];


function castSpell() {

    if (!player)
        return;


    if (casting)
        return;


    casting =
        true;


    castTimer =
        0;


    createSpellEffect();

}


/* =========================================================
   CAST BUTTON
========================================================= */

spellButton.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        castSpell();

    },
    {
        passive: false
    }
);


spellButton.addEventListener(
    "pointerup",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

    },
    {
        passive: false
    }
);


spellButton.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

    },
    {
        passive: false
    }
);


spellButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

    }
);


/* =========================================================
   SPELL EFFECT
   IMPORTANT:
   SPELL NOW GOES FORWARD
========================================================= */

function createSpellEffect() {

    if (!player)
        return;


    /*
       Aren's forward direction is
       +Z in this model setup.
    */

    const direction =
        new THREE.Vector3(
            0,
            0,
            1
        );


    direction.applyQuaternion(
        player.quaternion
    );


    direction.normalize();


    /*
       Start slightly in front
       of the character.
    */

    const position =
        player.position
            .clone();


    position.y +=
        1.7;


    position.add(
        direction
            .clone()
            .multiplyScalar(
                1.3
            )
    );


    const geometry =
        new THREE.SphereGeometry(
            0.14,
            16,
            16
        );


    const material =
        new THREE.MeshBasicMaterial({

            color: 0x91a8ff,

            transparent: true,

            opacity: 1

        });


    const particle =
        new THREE.Mesh(
            geometry,
            material
        );


    particle.position.copy(
        position
    );


    particle.userData.velocity =
        direction
            .clone()
            .multiplyScalar(
                16
            );


    particle.userData.life =
        1.2;


    scene.add(
        particle
    );


    spellParticles.push(
        particle
    );

}


/* =========================================================
   SPELL PARTICLES
========================================================= */

function updateSpellParticles(
    delta
) {

    for (
        let i =
            spellParticles.length -
            1;

        i >= 0;

        i--
    ) {

        const particle =
            spellParticles[i];


        particle.position.add(
            particle.userData.velocity
                .clone()
                .multiplyScalar(
                    delta
                )
        );


        particle.userData.life -=
            delta;


        particle.scale.multiplyScalar(
            0.97
        );


        particle.material.opacity =
            Math.max(
                0,
                particle.userData.life
            );


        if (
            particle.userData.life <=
            0
        ) {

            scene.remove(
                particle
            );


            particle.geometry.dispose();

            particle.material.dispose();


            spellParticles.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   CAST UPDATE
========================================================= */

function updateCasting(
    delta
) {

    if (!casting)
        return;


    castTimer +=
        delta;


    if (
        castTimer >=
        0.8
    ) {

        casting =
            false;


        castTimer =
            0;

    }

}


/* =========================================================
   QUEST UPDATE
========================================================= */

function updateQuest() {

    if (!player)
        return;


    if (
        questState ===
        QUEST_MARKER
    ) {

        const distance =
            player.position.distanceTo(
                markerGroup.position
            );


        if (
            distance < 5
        ) {

            questState =
                QUEST_COMPLETE;


            xp += 150;


            updateQuestUI();


            showDialogue(
                "You discovered an ancient magical marker. Aetheria has awakened."
            );

        }

    }

}


/* =========================================================
   TALK BUTTON VISIBILITY
========================================================= */

function updateInteractButton() {

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
   CAMERA FOLLOW
========================================================= */

const desiredCameraPosition =
    new THREE.Vector3();


const cameraTarget =
    new THREE.Vector3();


function updateCamera(
    delta
) {

    if (!player)
        return;


    const distance =
        9;


    const horizontal =
        Math.cos(
            cameraPitch
        ) *
        distance;


    const vertical =
        Math.sin(
            cameraPitch
        ) *
        distance;


    const offset =
        new THREE.Vector3(
            0,
            vertical + 3.2,
            horizontal
        );


    offset.applyAxisAngle(
        up,
        cameraYaw
    );


    desiredCameraPosition
        .copy(
            player.position
        )
        .add(
            offset
        );


    camera.position.lerp(
        desiredCameraPosition,
        Math.min(
            1,
            delta * 8
        )
    );


    cameraTarget
        .copy(
            player.position
        );


    cameraTarget.y +=
        1.6;


    camera.lookAt(
        cameraTarget
    );

}


/* =========================================================
   TORCH ANIMATION
========================================================= */

function updateTorches(
    time
) {

    for (
        const torch
        of torches
    ) {

        const wave =
            Math.sin(
                time * 8 +
                torch.base
            );


        torch.flame.scale.x =
            0.65 +
            wave * 0.12;


        torch.flame.scale.z =
            0.65 -
            wave * 0.08;


        torch.flame.scale.y =
            1.4 +
            wave * 0.18;


        torch.light.intensity =
            2.6 +
            wave * 0.7;

    }

}


/* =========================================================
   NPC ANIMATION
========================================================= */

function updateNPC(
    time
) {

    if (!npc)
        return;


    npcCrystal.rotation.y =
        time * 1.5;


    npcCrystal.position.y =
        3.3 +
        Math.sin(
            time * 2
        ) *
        0.12;

}


/* =========================================================
   MARKER ANIMATION
========================================================= */

function updateMarker(
    time
) {

    markerCrystal.rotation.y =
        time * 1.3;


    markerCrystal.position.y =
        2.8 +
        Math.sin(
            time * 2
        ) *
        0.15;

}


/* =========================================================
   PLAYER ANIMATION
========================================================= */

function updatePlayerAnimation(
    time
) {

    if (!player)
        return;


    if (isJumping) {

        applyJumpAnimation();

        return;

    }


    if (casting) {

        applyCastingAnimation(
            time
        );

        return;

    }


    if (isMoving) {

        applyWalkingAnimation(
            time,
            isRunning
                ? 0.95
                : 0.65,
            isRunning
        );

        return;

    }


    applyIdleAnimation(
        time
    );

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
   LANDSCAPE
========================================================= */

const landscapeButton =
    document.getElementById(
        "landscapeButton"
    );


if (landscapeButton) {

    landscapeButton.addEventListener(
        "click",
        async function () {

            try {

                if (
                    document
                        .documentElement
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


    const time =
        clock.elapsedTime;


    updateMovement(
        delta
    );


    updateJump(
        delta
    );


    updateCasting(
        delta
    );


    updateQuest();


    updateInteractButton();


    updateCamera(
        delta
    );


    updatePlayerAnimation(
        time
    );


    updateSpellParticles(
        delta
    );


    updateTorches(
        time
    );


    updateNPC(
        time
    );


    updateMarker(
        time
    );


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================================
   START
========================================================= */

console.log(
    "Aetheria Academy loaded."
);
