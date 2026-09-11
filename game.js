/* =========================================================
   AETHERIA ACADEMY
   STEP 4A — PLAYER ANIMATION FIX

   FIXED:
   ✓ Jump pose resets after landing
   ✓ Idle pose
   ✓ Walk pose
   ✓ Run pose
   ✓ Jump pose
   ✓ Casting pose
   ✓ Joystick direction
   ✓ Forward spell direction
   ✓ Castle collision
   ✓ Tree collision
   ✓ NPC
   ✓ Dialogue
   ✓ Quest
   ✓ Camera
   ✓ Mobile landscape
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

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x07111c);

scene.fog =
    new THREE.FogExp2(
        0x07111c,
        0.004
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

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        1.8
    )
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
    1.15;

document
    .getElementById("game")
    .appendChild(
        renderer.domElement
    );


/* =========================================================
   LIGHTING
   ========================================================= */

const hemisphere =
    new THREE.HemisphereLight(
        0x9fc5ff,
        0x182015,
        1.5
    );

scene.add(
    hemisphere
);

const sun =
    new THREE.DirectionalLight(
        0xd9e7ff,
        1.7
    );

sun.position.set(
    80,
    120,
    70
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

scene.add(
    sun
);


/* =========================================================
   MATERIALS
   ========================================================= */

const groundMat =
    new THREE.MeshStandardMaterial({
        color: 0x304b2f,
        roughness: 1
    });

const stoneMat =
    new THREE.MeshStandardMaterial({
        color: 0x626872,
        roughness: 0.9
    });

const darkStoneMat =
    new THREE.MeshStandardMaterial({
        color: 0x343943,
        roughness: 0.95
    });

const roofMat =
    new THREE.MeshStandardMaterial({
        color: 0x20232a,
        roughness: 0.85
    });

const woodMat =
    new THREE.MeshStandardMaterial({
        color: 0x4a2a16,
        roughness: 0.9
    });

const goldMat =
    new THREE.MeshStandardMaterial({
        color: 0xc9a84e,
        metalness: 0.7,
        roughness: 0.35
    });

const waterMat =
    new THREE.MeshStandardMaterial({
        color: 0x397fa2,
        roughness: 0.25,
        metalness: 0.15
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

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            500,
            500
        ),
        groundMat
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(
    ground
);


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

    /* Central tower */

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

    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                12,
                18,
                6
            ),
            roofMat
        );

    roof.position.set(
        0,
        47,
        -30
    );

    roof.castShadow = true;

    scene.add(
        roof
    );

    createTower(
        -38,
        -32
    );

    createTower(
        38,
        -32
    );

    createTower(
        -38,
        -5
    );

    createTower(
        38,
        -5
    );

}


function createTower(
    x,
    z
) {

    box(
        12,
        28,
        12,
        x,
        14,
        z,
        stoneMat,
        true
    );

    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                9,
                14,
                6
            ),
            roofMat
        );

    roof.position.set(
        x,
        35,
        z
    );

    roof.castShadow = true;

    scene.add(
        roof
    );

}

createMainCastle();


/* =========================================================
   GATE
   ========================================================= */

function createGate() {

    box(
        6,
        20,
        8,
        -9,
        10,
        -18,
        darkStoneMat,
        true
    );

    box(
        6,
        20,
        8,
        9,
        10,
        -18,
        darkStoneMat,
        true
    );

    box(
        24,
        5,
        8,
        0,
        20,
        -18,
        stoneMat,
        true
    );

    /* Doors are decorative */

    box(
        8,
        15,
        1.2,
        -4,
        7.5,
        -13.7,
        woodMat,
        false
    );

    box(
        8,
        15,
        1.2,
        4,
        7.5,
        -13.7,
        woodMat,
        false
    );

    const ring =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.3,
                0.18,
                12,
                32
            ),
            goldMat
        );

    ring.rotation.x =
        Math.PI / 2;

    ring.position.set(
        0,
        9,
        -12.9
    );

    scene.add(
        ring
    );

}

createGate();


/* =========================================================
   COURTYARD
   ========================================================= */

const courtyard =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            26,
            26,
            0.4,
            64
        ),
        new THREE.MeshStandardMaterial({
            color: 0x55545a,
            roughness: 0.95
        })
    );

courtyard.position.set(
    0,
    0.2,
    18
);

courtyard.receiveShadow = true;

scene.add(
    courtyard
);


/* =========================================================
   FOUNTAIN
   ========================================================= */

function createFountain() {

    const base =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                8,
                8,
                1,
                48
            ),
            stoneMat
        );

    base.position.set(
        0,
        0.6,
        18
    );

    base.castShadow = true;

    scene.add(
        base
    );

    const water =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                6.8,
                6.8,
                0.25,
                48
            ),
            waterMat
        );

    water.position.set(
        0,
        1.15,
        18
    );

    scene.add(
        water
    );

    const pillar =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.2,
                1.5,
                6,
                24
            ),
            stoneMat
        );

    pillar.position.set(
        0,
        4,
        18
    );

    pillar.castShadow = true;

    scene.add(
        pillar
    );

    const top =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.7,
                24,
                24
            ),
            waterMat
        );

    top.position.set(
        0,
        7,
        18
    );

    scene.add(
        top
    );

}

createFountain();


/* =========================================================
   PATH
   ========================================================= */

box(
    12,
    0.2,
    90,
    0,
    0.1,
    35,
    new THREE.MeshStandardMaterial({
        color: 0x625d58,
        roughness: 1
    }),
    false
);


/* =========================================================
   TREES
   ========================================================= */

function createTree(
    x,
    z
) {

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.7,
                1,
                8,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x4b2d1b,
                roughness: 1
            })
        );

    trunk.position.set(
        x,
        4,
        z
    );

    trunk.castShadow = true;

    scene.add(
        trunk
    );

    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                4.5,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0x183d25,
                roughness: 1
            })
        );

    leaves.position.set(
        x,
        9,
        z
    );

    leaves.castShadow = true;

    scene.add(
        leaves
    );

    treeColliders.push({
        x: x,
        z: z,
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
    position => {

        createTree(
            position[0],
            position[1]
        );

    }
);


/* =========================================================
   TORCHES
   ========================================================= */

const torches = [];

function createTorch(
    x,
    y,
    z
) {

    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.15,
                0.22,
                3,
                10
            ),
            woodMat
        );

    pole.position.set(
        x,
        y + 1.5,
        z
    );

    pole.castShadow = true;

    scene.add(
        pole
    );

    const flame =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.6,
                12,
                12
            ),
            new THREE.MeshBasicMaterial({
                color: 0xff8c24
            })
        );

    flame.position.set(
        x,
        y + 3.2,
        z
    );

    scene.add(
        flame
    );

    const light =
        new THREE.PointLight(
            0xff8a32,
            3,
            15
        );

    light.position.set(
        x,
        y + 3,
        z
    );

    scene.add(
        light
    );

    return {
        flame,
        light
    };

}

torches.push(
    createTorch(
        -8,
        0,
        -13
    )
);

torches.push(
    createTorch(
        8,
        0,
        -13
    )
);


/* =========================================================
   NPC
   ========================================================= */

let npc = null;
let npcHead = null;
let npcStaff = null;
let npcCrystal = null;

const npcPosition =
    new THREE.Vector3(
        14,
        0,
        15
    );


function createNPC() {

    npc =
        new THREE.Group();

    const robe =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.25,
                1.8,
                4.5,
                20
            ),
            new THREE.MeshStandardMaterial({
                color: 0x30264d,
                roughness: 0.8
            })
        );

    robe.position.y =
        2.4;

    robe.castShadow = true;

    npc.add(
        robe
    );

    const shoulders =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.45,
                20,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x493c68,
                roughness: 0.8
            })
        );

    shoulders.scale.y =
        0.6;

    shoulders.position.y =
        4.1;

    shoulders.castShadow = true;

    npc.add(
        shoulders
    );

    npcHead =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.85,
                24,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: 0xc88e70,
                roughness: 0.8
            })
        );

    npcHead.position.y =
        5.4;

    npcHead.castShadow = true;

    npc.add(
        npcHead
    );

    const hat =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                1.15,
                2.2,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: 0x171522,
                roughness: 0.9
            })
        );

    hat.position.y =
        6.8;

    hat.castShadow = true;

    npc.add(
        hat
    );

    const hatRim =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.3,
                1.3,
                0.25,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: 0x171522,
                roughness: 0.9
            })
        );

    hatRim.position.y =
        6;

    npc.add(
        hatRim
    );

    npcStaff =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.08,
                0.12,
                5,
                10
            ),
            woodMat
        );

    npcStaff.position.set(
        1.2,
        2.5,
        0
    );

    npcStaff.rotation.z =
        -0.12;

    npcStaff.castShadow = true;

    npc.add(
        npcStaff
    );

    npcCrystal =
        new THREE.Mesh(
            new THREE.OctahedronGeometry(
                0.28
            ),
            new THREE.MeshBasicMaterial({
                color: 0x83d9ff
            })
        );

    npcCrystal.position.set(
        1.2,
        5.15,
        0
    );

    npc.add(
        npcCrystal
    );

    const crystalLight =
        new THREE.PointLight(
            0x55caff,
            1.4,
            8
        );

    crystalLight.position.set(
        1.2,
        5.15,
        0
    );

    npc.add(
        crystalLight
    );

    npc.position.copy(
        npcPosition
    );

    npc.rotation.y =
        Math.PI * 0.65;

    scene.add(
        npc
    );

}

createNPC();


/* =========================================================
   QUEST MARKER
   ========================================================= */

let questMarker = null;


function createQuestMarker(
    position
) {

    const group =
        new THREE.Group();

    const ring =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.2,
                0.12,
                12,
                32
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffd84a
            })
        );

    ring.rotation.x =
        Math.PI / 2;

    group.add(
        ring
    );

    const crystal =
        new THREE.Mesh(
            new THREE.OctahedronGeometry(
                0.65
            ),
            new THREE.MeshBasicMaterial({
                color: 0xfff2a0
            })
        );

    crystal.position.y =
        1.4;

    group.add(
        crystal
    );

    group.position.copy(
        position
    );

    scene.add(
        group
    );

    return group;

}


questMarker =
    createQuestMarker(
        new THREE.Vector3(
            npcPosition.x,
            7.5,
            npcPosition.z
        )
    );


/* =========================================================
   QUEST STATE
   ========================================================= */

let questState =
    "TALK_TO_AELION";

let dialogueOpen =
    false;


/* =========================================================
   HUD
   ========================================================= */

const questText =
    document.getElementById(
        "questText"
    );

const dialogueBox =
    document.getElementById(
        "dialogueBox"
    );


function setQuestText(
    text
) {

    if (questText) {

        questText.textContent =
            text;

    }

}


function showDialogue(
    text
) {

    dialogueOpen =
        true;

    if (dialogueBox) {

        dialogueBox.style.display =
            "block";

        dialogueBox.textContent =
            text;

    }

}


function hideDialogue() {

    dialogueOpen =
        false;

    if (dialogueBox) {

        dialogueBox.style.display =
            "none";

    }

}


setQuestText(
    "Quest: Talk to Professor Aelion"
);


/* =========================================================
   TALK BUTTON
   ========================================================= */

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

    document.body.appendChild(
        interactButton
    );

}

interactButton.style.position =
    "fixed";

interactButton.style.right =
    "175px";

interactButton.style.bottom =
    "35px";

interactButton.style.zIndex =
    "100";

interactButton.style.padding =
    "15px 22px";

interactButton.style.border =
    "2px solid rgba(255,255,255,.4)";

interactButton.style.borderRadius =
    "18px";

interactButton.style.background =
    "rgba(25,20,45,.9)";

interactButton.style.color =
    "white";

interactButton.style.fontWeight =
    "bold";

interactButton.style.display =
    "none";

interactButton.addEventListener(
    "click",
    interactWithNPC
);


/* =========================================================
   NPC INTERACTION
   ========================================================= */

function interactWithNPC() {

    if (!player)
        return;

    const distance =
        player.position.distanceTo(
            npcPosition
        );

    if (
        distance > 7
    ) {

        showDialogue(
            "Professor Aelion is nearby. Move closer."
        );

        setTimeout(
            hideDialogue,
            2500
        );

        return;

    }

    if (
        questState ===
        "TALK_TO_AELION"
    ) {

        questState =
            "FIND_ANCIENT_MARKER";

        if (questMarker) {

            scene.remove(
                questMarker
            );

        }

        questMarker =
            createQuestMarker(
                new THREE.Vector3(
                    0,
                    5,
                    -18
                )
            );

        setQuestText(
            "Quest: Find the Ancient Academy Marker"
        );

        showDialogue(
            "Aelion: Welcome to Aetheria Academy. Your first task is to find the Ancient Academy Marker at the main gate."
        );

        setTimeout(
            hideDialogue,
            5000
        );

        return;

    }

    if (
        questState ===
        "FIND_ANCIENT_MARKER"
    ) {

        showDialogue(
            "Aelion: Follow the golden marker to the ancient gate."
        );

        setTimeout(
            hideDialogue,
            3500
        );

    }

}


/* =========================================================
   PLAYER
   ========================================================= */

let player = null;

let rightHand = null;

let wand = null;

const playerBones = {};


/* =========================================================
   LOADER
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

    const elements = [
        "loading",
        "loadingScreen",
        "loadingOverlay"
    ];

    elements.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );

            if (element) {

                element.style.opacity =
                    "0";

                element.style.pointerEvents =
                    "none";

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
   LOAD AREN
   ========================================================= */

loader.load(

    "./assets/player/aren_valen.glb",

    gltf => {

        console.log(
            "Aren GLB loaded successfully."
        );

        player =
            gltf.scene;

        player.scale.set(
            1,
            1,
            1
        );

        player.position.set(
            0,
            0,
            70
        );

        player.traverse(
            object => {

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
                    ] =
                        object;

                }

            }
        );

        rightHand =
            playerBones[
                "RightHand"
            ];

        createWand();

        scene.add(
            player
        );

        applyStandingPose();

        hideLoadingScreen();

    },

    progress => {

        if (
            progress &&
            progress.total > 0
        ) {

            const percent =
                Math.round(
                    progress.loaded /
                    progress.total *
                    100
                );

            console.log(
                "Loading Aren:",
                percent + "%"
            );

        }

    },

    error => {

        console.error(
            "FAILED TO LOAD AREN:",
            error
        );

        hideLoadingScreen();

        showDialogue(
            "Unable to load the player model. Please refresh the game."
        );

    }

);


/* =========================================================
   WAND
   ========================================================= */

function createWand() {

    if (!rightHand)
        return;

    wand =
        new THREE.Group();

    const stick =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.045,
                0.07,
                1.5,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x7a4c2a,
                roughness: 0.75
            })
        );

    stick.rotation.z =
        -Math.PI / 2;

    wand.add(
        stick
    );

    const tip =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.12,
                10,
                10
            ),
            new THREE.MeshBasicMaterial({
                color: 0x8fe8ff
            })
        );

    tip.position.x =
        0.75;

    wand.add(
        tip
    );

    wand.position.set(
        0.15,
        0,
        0
    );

    rightHand.add(
        wand
    );

}


/* =========================================================
   BONE HELPERS
   ========================================================= */

function bone(
    name
) {

    return playerBones[
        name
    ];

}


function setBoneRotation(
    name,
    x,
    y,
    z
) {

    const b =
        bone(name);

    if (!b)
        return;

    b.rotation.x =
        x;

    b.rotation.y =
        y;

    b.rotation.z =
        z;

}


/* =========================================================
   NORMAL POSE
   ========================================================= */

function applyStandingPose() {

    setBoneRotation(
        "LeftArm",
        Math.PI / 2,
        0,
        0
    );

    setBoneRotation(
        "RightArm",
        Math.PI / 2,
        0,
        0
    );

    setBoneRotation(
        "LeftForeArm",
        0.12,
        0,
        0
    );

    setBoneRotation(
        "RightForeArm",
        0.12,
        0,
        0
    );

    setBoneRotation(
        "LeftShoulder",
        0,
        0,
        0.05
    );

    setBoneRotation(
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

    if (!player)
        return;

    applyStandingPose();

    const spine =
        bone("Spine");

    const spine1 =
        bone("Spine1");

    const head =
        bone("Head");

    if (spine) {

        spine.rotation.x =
            Math.sin(
                time * 1.5
            ) * 0.015;

    }

    if (spine1) {

        spine1.rotation.x =
            Math.sin(
                time * 1.5
            ) * 0.01;

    }

    if (head) {

        head.rotation.y =
            Math.sin(
                time * 0.7
            ) * 0.02;

    }

}


/* =========================================================
   WALK / RUN
   ========================================================= */

function applyWalkingAnimation(
    time,
    amount,
    running
) {

    if (!player)
        return;

    applyStandingPose();

    const speed =
        running
            ? 12
            : 8;

    const swing =
        Math.sin(
            time * speed
        ) * amount;

    const leftLeg =
        bone("LeftUpLeg");

    const rightLeg =
        bone("RightUpLeg");

    const leftArm =
        bone("LeftArm");

    const rightArm =
        bone("RightArm");

    if (leftLeg) {

        leftLeg.rotation.x =
            swing;

    }

    if (rightLeg) {

        rightLeg.rotation.x =
            -swing;

    }

    if (leftArm) {

        leftArm.rotation.x +=
            -swing * 0.35;

    }

    if (rightArm) {

        rightArm.rotation.x +=
            swing * 0.35;

    }

}


/* =========================================================
   JUMP POSE
   ========================================================= */

function applyJumpAnimation() {

    if (!player)
        return;

    /*
       Arms slightly raised
       Legs slightly bent
    */

    setBoneRotation(
        "LeftArm",
        Math.PI / 2 - 0.35,
        0,
        0
    );

    setBoneRotation(
        "RightArm",
        Math.PI / 2 - 0.35,
        0,
        0
    );

    setBoneRotation(
        "LeftForeArm",
        0.15,
        0,
        0
    );

    setBoneRotation(
        "RightForeArm",
        0.15,
        0,
        0
    );

    setBoneRotation(
        "LeftUpLeg",
        -0.25,
        0,
        0
    );

    setBoneRotation(
        "RightUpLeg",
        -0.25,
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

    if (!player)
        return;

    /*
       Start from a known normal pose
       so casting cannot permanently
       leave the body in a strange pose.
    */

    applyStandingPose();

    const rightArm =
        bone("RightArm");

    const rightFore =
        bone("RightForeArm");

    if (rightArm) {

        rightArm.rotation.x =
            Math.PI / 2 -
            0.65;

        rightArm.rotation.z =
            -0.15;

    }

    if (rightFore) {

        rightFore.rotation.x =
            -0.65 +
            Math.sin(
                time * 8
            ) * 0.08;

    }

}


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
   MOVEMENT
   ========================================================= */

const moveInput =
    new THREE.Vector2();

const lastMoveDirection =
    new THREE.Vector3(
        0,
        0,
        1
    );

let isJumping =
    false;

let verticalVelocity =
    0;

const gravity =
    -22;

const jumpPower =
    9;


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


function joystickMove(
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
        clientX -
        centerX;

    let dy =
        clientY -
        centerY;

    const max =
        rect.width * 0.32;

    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    if (
        length > max
    ) {

        dx =
            dx / length *
            max;

        dy =
            dy / length *
            max;

    }

    moveInput.x =
        dx / max;

    /*
       IMPORTANT FIX:

       Screen Y is opposite
       to game Z movement.
    */

    moveInput.y =
        -dy / max;

    if (joystickKnob) {

        joystickKnob.style.transform =
            `translate(${dx}px, ${dy}px)`;

    }

}


if (joystick) {

    joystick.addEventListener(
        "pointerdown",
        event => {

            joystickActive =
                true;

            joystick.setPointerCapture(
                event.pointerId
            );

            joystickMove(
                event.clientX,
                event.clientY
            );

        }
    );

    joystick.addEventListener(
        "pointermove",
        event => {

            if (
                joystickActive
            ) {

                joystickMove(
                    event.clientX,
                    event.clientY
                );

            }

        }
    );

    joystick.addEventListener(
        "pointerup",
        () => {

            joystickActive =
                false;

            moveInput.set(
                0,
                0
            );

            if (joystickKnob) {

                joystickKnob.style.transform =
                    "translate(0px,0px)";

            }

        }
    );

    joystick.addEventListener(
        "pointercancel",
        () => {

            joystickActive =
                false;

            moveInput.set(
                0,
                0
            );

            if (joystickKnob) {

                joystickKnob.style.transform =
                    "translate(0px,0px)";

            }

        }
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

            if (
                player &&
                !isJumping
            ) {

                isJumping =
                    true;

                verticalVelocity =
                    jumpPower;

                /*
                   Immediately show jump pose.
                */

                applyJumpAnimation();

            }

        }
    );

}


/* =========================================================
   SPELL
   ========================================================= */

const spellButton =
    document.getElementById(
        "spellButton"
    );

let casting =
    false;

let castTimer =
    0;


if (spellButton) {

    spellButton.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            if (player) {

                castSpell();

            }

        }
    );

}


/* =========================================================
   PROJECTILES
   ========================================================= */

const projectiles = [];


function castSpell() {

    if (
        !player ||
        casting
    )
        return;

    casting =
        true;

    castTimer =
        0.45;

    /*
       Use the actual last movement
       direction.

       This avoids guessing the GLB
       forward axis.
    */

    const direction =
        lastMoveDirection
            .clone()
            .normalize();

    const projectile =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.16,
                12,
                12
            ),
            new THREE.MeshBasicMaterial({
                color: 0x75ddff
            })
        );

    let start =
        player.position.clone();

    if (rightHand) {

        rightHand.getWorldPosition(
            start
        );

    }

    /*
       Move projectile slightly
       forward from hand.
    */

    start.add(
        direction
            .clone()
            .multiplyScalar(0.5)
    );

    projectile.position.copy(
        start
    );

    scene.add(
        projectile
    );

    projectiles.push({

        mesh:
            projectile,

        velocity:
            direction
                .multiplyScalar(
                    22
                ),

        life:
            2.5

    });

}


/* =========================================================
   PROJECTILE UPDATE
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

        const p =
            projectiles[i];

        p.mesh.position.add(
            p.velocity
                .clone()
                .multiplyScalar(
                    delta
                )
        );

        p.life -=
            delta;

        if (
            p.life <= 0
        ) {

            scene.remove(
                p.mesh
            );

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

function blockedAt(
    x,
    z
) {

    for (
        const box of
        collisionBoxes
    ) {

        if (

            x + playerRadius >
                box.minX &&

            x - playerRadius <
                box.maxX &&

            z + playerRadius >
                box.minZ &&

            z - playerRadius <
                box.maxZ

        ) {

            return true;

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
            tree.radius +
            playerRadius
        ) {

            return true;

        }

    }

    return false;

}


/* =========================================================
   CAMERA
   ========================================================= */

let cameraYaw =
    0;

let cameraPitch =
    0.38;

let cameraDragging =
    false;

let previousX =
    0;

let previousY =
    0;


renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        cameraDragging =
            true;

        previousX =
            event.clientX;

        previousY =
            event.clientY;

    }
);


renderer.domElement.addEventListener(
    "pointermove",
    event => {

        if (
            !cameraDragging
        )
            return;

        const dx =
            event.clientX -
            previousX;

        const dy =
            event.clientY -
            previousY;

        previousX =
            event.clientX;

        previousY =
            event.clientY;

        cameraYaw -=
            dx * 0.006;

        cameraPitch +=
            dy * 0.004;

        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                0.1,
                0.9
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
   MOVEMENT UPDATE
   ========================================================= */

function updateMovement(
    delta
) {

    if (!player)
        return;

    let x =
        moveInput.x;

    let z =
        moveInput.y;

    if (
        keys["w"] ||
        keys["arrowup"]
    )
        z += 1;

    if (
        keys["s"] ||
        keys["arrowdown"]
    )
        z -= 1;

    if (
        keys["a"] ||
        keys["arrowleft"]
    )
        x -= 1;

    if (
        keys["d"] ||
        keys["arrowright"]
    )
        x += 1;

    const input =
        new THREE.Vector2(
            x,
            z
        );

    if (
        input.length() > 1
    )
        input.normalize();

    if (
        input.lengthSq() >
        0.001
    ) {

        const forward =
            new THREE.Vector3(
                0,
                0,
                1
            );

        const right =
            new THREE.Vector3(
                1,
                0,
                0
            );

        forward.applyAxisAngle(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            cameraYaw
        );

        right.applyAxisAngle(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            cameraYaw
        );

        const direction =
            new THREE.Vector3();

        direction.addScaledVector(
            forward,
            input.y
        );

        direction.addScaledVector(
            right,
            input.x
        );

        direction.normalize();

        /*
           Remember actual direction
           for spell casting.
        */

        lastMoveDirection.copy(
            direction
        );

        const running =
            input.length() >
            0.75;

        const speed =
            running
                ? 9
                : 5.5;

        const movement =
            direction
                .clone()
                .multiplyScalar(
                    speed * delta
                );

        const newX =
            player.position.x +
            movement.x;

        const newZ =
            player.position.z +
            movement.z;

        /*
           Separate X/Z collision.
        */

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

        /*
           Character faces movement direction.
        */

        const targetRotation =
            Math.atan2(
                direction.x,
                direction.z
            );

        let difference =
            targetRotation -
            player.rotation.y;

        difference =
            Math.atan2(
                Math.sin(
                    difference
                ),
                Math.cos(
                    difference
                )
            );

        player.rotation.y +=
            difference *
            Math.min(
                1,
                delta * 10
            );

        /*
           Do not overwrite jump pose
           while airborne.
        */

        if (!isJumping) {

            if (casting) {

                applyCastingAnimation(
                    performance.now() *
                    0.001
                );

            } else {

                applyWalkingAnimation(
                    performance.now() *
                    0.001,
                    running
                        ? 0.95
                        : 0.65,
                    running
                );

            }

        }

    } else {

        /*
           No movement.
        */

        if (!isJumping) {

            if (casting) {

                applyCastingAnimation(
                    performance.now() *
                    0.001
                );

            } else {

                applyIdleAnimation(
                    performance.now() *
                    0.001
                );

            }

        }

    }

}


/* =========================================================
   JUMP UPDATE — IMPORTANT FIX
   ========================================================= */

function updateJump(
    delta
) {

    if (!player)
        return;

    if (isJumping) {

        verticalVelocity +=
            gravity * delta;

        player.position.y +=
            verticalVelocity * delta;

        /*
           Still in air.
        */

        if (
            player.position.y > 0
        ) {

            applyJumpAnimation();

            return;

        }

        /*
           ==========================
           LANDING
           ==========================
        */

        player.position.y =
            0;

        verticalVelocity =
            0;

        isJumping =
            false;

        /*
           THIS IS THE IMPORTANT FIX.

           Reset the entire character
           to the normal standing pose
           immediately after landing.
        */

        applyStandingPose();

        /*
           Reset legs too.
        */

        setBoneRotation(
            "LeftUpLeg",
            0,
            0,
            0
        );

        setBoneRotation(
            "RightUpLeg",
            0,
            0,
            0
        );

        /*
           Reset spine/head.
        */

        setBoneRotation(
            "Spine",
            0,
            0,
            0
        );

        setBoneRotation(
            "Spine1",
            0,
            0,
            0
        );

        setBoneRotation(
            "Head",
            0,
            0,
            0
        );

    }

}


/* =========================================================
   QUEST UPDATE
   ========================================================= */

function updateQuest() {

    if (!player)
        return;

    const distance =
        player.position.distanceTo(
            npcPosition
        );

    if (
        distance < 7 &&
        questState !==
        "COMPLETED"
    ) {

        interactButton.style.display =
            "block";

    } else {

        interactButton.style.display =
            "none";

    }

    if (
        questState ===
        "FIND_ANCIENT_MARKER"
    ) {

        const gate =
            new THREE.Vector3(
                0,
                0,
                -18
            );

        const distanceToGate =
            player.position.distanceTo(
                gate
            );

        if (
            distanceToGate < 7
        ) {

            questState =
                "COMPLETED";

            if (questMarker) {

                scene.remove(
                    questMarker
                );

                questMarker =
                    null;

            }

            setQuestText(
                "✓ Quest Complete — Welcome to Aetheria Academy!"
            );

            showDialogue(
                "Aelion: Excellent work. Your magical journey begins now."
            );

            setTimeout(
                hideDialogue,
                5000
            );

        }

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

    npc.position.y =
        Math.sin(
            time * 1.8
        ) * 0.03;

    if (npcHead) {

        npcHead.rotation.y =
            Math.sin(
                time * 0.7
            ) * 0.04;

    }

    if (npcStaff) {

        npcStaff.rotation.z =
            -0.12 +
            Math.sin(
                time * 1.5
            ) * 0.03;

    }

    if (npcCrystal) {

        npcCrystal.rotation.y +=
            0.025;

        npcCrystal.position.y =
            5.15 +
            Math.sin(
                time * 2
            ) * 0.12;

    }

    if (questMarker) {

        questMarker.rotation.y +=
            0.025;

        questMarker.position.y =
            7.5 +
            Math.sin(
                time * 2
            ) * 0.35;

    }

}


/* =========================================================
   TORCH ANIMATION
   ========================================================= */

function updateTorches(
    time
) {

    torches.forEach(
        (torch, index) => {

            const wave =
                Math.sin(
                    time * 12 +
                    index
                );

            torch.flame.scale.set(
                1 +
                    wave * 0.08,

                1 +
                    wave * 0.18,

                1 +
                    wave * 0.08
            );

            torch.light.intensity =
                2.5 +
                wave * 0.7;

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

    const offset =
        new THREE.Vector3(
            0,
            4.5,
            9
        );

    offset.applyEuler(
        new THREE.Euler(
            cameraPitch,
            cameraYaw,
            0,
            "YXZ"
        )
    );

    const target =
        player.position
            .clone()
            .add(offset);

    camera.position.lerp(
        target,
        1 -
        Math.pow(
            0.001,
            delta
        )
    );

    const lookTarget =
        player.position
            .clone();

    lookTarget.y +=
        2.5;

    camera.lookAt(
        lookTarget
    );

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

}

window.addEventListener(
    "resize",
    resize
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

            } catch (error) {

                console.log(
                    "Fullscreen unavailable",
                    error
                );

            }

            try {

                if (
                    screen.orientation &&
                    screen.orientation.lock
                ) {

                    await screen.orientation.lock(
                        "landscape"
                    );

                }

            } catch (error) {

                console.log(
                    "Landscape lock unavailable",
                    error
                );

            }

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
        performance.now() *
        0.001;

    updateMovement(
        delta
    );

    updateJump(
        delta
    );

    if (casting) {

        applyCastingAnimation(
            time
        );

        castTimer -=
            delta;

        if (
            castTimer <= 0
        ) {

            casting =
                false;

            /*
               Restore the correct pose
               immediately after casting.
            */

            if (!isJumping) {

                if (
                    moveInput.lengthSq() >
                    0.001
                ) {

                    applyWalkingAnimation(
                        time,
                        0.65,
                        false
                    );

                } else {

                    applyIdleAnimation(
                        time
                    );

                }

            }

        }

    }

    updateProjectiles(
        delta
    );

    updateQuest();

    updateNPC(
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
