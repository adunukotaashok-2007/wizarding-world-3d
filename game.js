/* =========================================================
   AETHERIA ACADEMY
   3D MAGIC SCHOOL
   VERSION 20

   Features:
   - Real Aren GLB character
   - Procedural animation
   - Visible wand
   - Visible spells
   - Castle
   - Trees
   - Grass
   - Rocks
   - Torches
   - Fountain
   - NPC
   - Quest
   - Mobile joystick
   - Jump
   - Camera control
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

scene.background = new THREE.Color(0x9fc9e3);

scene.fog = new THREE.FogExp2(
    0x9fc9e3,
    0.006
);


/* =========================================================
   CAMERA
   ========================================================= */

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(
    0,
    5,
    9
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
    Math.min(window.devicePixelRatio, 1.5)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

document.body.appendChild(renderer.domElement);


/* =========================================================
   PLAYER VARIABLES
   ========================================================= */

let player = null;
let playerModel = null;

let rightHandBone = null;
let leftHandBone = null;

let wand = null;
let wandTip = null;

let isMoving = false;
let isJumping = false;
let casting = false;

let verticalVelocity = 0;

const gravity = -18;
const jumpPower = 7;

let cameraYaw = 0;

const lastMoveDirection =
    new THREE.Vector3(0, 0, -1);


/* =========================================================
   WORLD GROUPS
   ========================================================= */

const world = new THREE.Group();

scene.add(world);

const environment = new THREE.Group();

world.add(environment);

const effects = new THREE.Group();

scene.add(effects);


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight =
    new THREE.HemisphereLight(
        0xddeeff,
        0x526047,
        2.2
    );

scene.add(hemiLight);


const sun =
    new THREE.DirectionalLight(
        0xfff3d5,
        3.0
    );

sun.position.set(
    -30,
    45,
    25
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -80;
sun.shadow.camera.right = 80;
sun.shadow.camera.top = 80;
sun.shadow.camera.bottom = -80;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 150;

scene.add(sun);


/* =========================================================
   MOON / AMBIENT MAGICAL LIGHT
   ========================================================= */

const magicalLight =
    new THREE.PointLight(
        0x86aaff,
        4,
        35
    );

magicalLight.position.set(
    0,
    8,
    -10
);

scene.add(magicalLight);


/* =========================================================
   MATERIAL HELPERS
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


/* =========================================================
   GROUND
   ========================================================= */

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x496b42,
        roughness: 1
    });

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            180,
            180
        ),
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

environment.add(ground);


/* =========================================================
   GRASS PATCHES
   ========================================================= */

function createGrassPatch(
    x,
    z,
    size = 5
) {

    const group =
        new THREE.Group();

    const grassMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3f743b,
            roughness: 1
        });

    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const height =
            0.25 +
            Math.random() * 0.45;

        const blade =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    0.025,
                    height,
                    4
                ),
                grassMaterial
            );

        blade.position.set(
            (Math.random() - 0.5) * size,
            height / 2,
            (Math.random() - 0.5) * size
        );

        blade.rotation.y =
            Math.random() * Math.PI;

        group.add(blade);
    }

    group.position.set(
        x,
        0,
        z
    );

    environment.add(group);
}


for (
    let i = 0;
    i < 180;
    i++
) {

    createGrassPatch(
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150,
        3
    );
}


/* =========================================================
   STONE PATH
   ========================================================= */

const pathMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x777873,
        roughness: 0.95
    });

const path =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            9,
            70
        ),
        pathMaterial
    );

path.rotation.x =
    -Math.PI / 2;

path.position.set(
    0,
    0.015,
    -15
);

path.receiveShadow = true;

environment.add(path);


/* =========================================================
   STONE TILES
   ========================================================= */

for (
    let z = 15;
    z > -55;
    z -= 2.2
) {

    const tile =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                7.5,
                0.12,
                1.8
            ),
            material(
                0x777777,
                0.9
            )
        );

    tile.position.set(
        0,
        0.08,
        z
    );

    tile.rotation.y =
        (Math.random() - 0.5) * 0.04;

    tile.receiveShadow = true;

    environment.add(tile);
}


/* =========================================================
   ROCK
   ========================================================= */

function createRock(
    x,
    z,
    scale = 1
) {

    const rock =
        new THREE.Mesh(
            new THREE.DodecahedronGeometry(
                0.7,
                1
            ),
            material(
                0x65665e,
                1
            )
        );

    rock.position.set(
        x,
        0.45 * scale,
        z
    );

    rock.scale.set(
        scale * 1.2,
        scale * 0.7,
        scale
    );

    rock.rotation.y =
        Math.random() * Math.PI;

    rock.castShadow = true;
    rock.receiveShadow = true;

    environment.add(rock);
}


/* =========================================================
   ROCKS
   ========================================================= */

for (
    let i = 0;
    i < 40;
    i++
) {

    createRock(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 90,
        0.4 + Math.random() * 0.9
    );
}


/* =========================================================
   TREE
   ========================================================= */

function createTree(
    x,
    z,
    scale = 1
) {

    const tree =
        new THREE.Group();

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.35,
                0.5,
                3.2,
                8
            ),
            material(
                0x4b3020,
                1
            )
        );

    trunk.position.y =
        1.6;

    trunk.castShadow = true;

    tree.add(trunk);


    const leavesMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x245c32,
            roughness: 1
        });


    const crown1 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.8,
                10,
                8
            ),
            leavesMaterial
        );

    crown1.position.set(
        0,
        3.8,
        0
    );

    crown1.scale.set(
        1.3,
        1,
        1.1
    );

    crown1.castShadow = true;

    tree.add(crown1);


    const crown2 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.4,
                10,
                8
            ),
            leavesMaterial
        );

    crown2.position.set(
        1,
        4.5,
        0.3
    );

    crown2.castShadow = true;

    tree.add(crown2);


    const crown3 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.2,
                10,
                8
            ),
            leavesMaterial
        );

    crown3.position.set(
        -1,
        4.4,
        -0.2
    );

    crown3.castShadow = true;

    tree.add(crown3);


    tree.position.set(
        x,
        0,
        z
    );

    tree.scale.setScalar(
        scale
    );

    environment.add(tree);

    return tree;
}


/* =========================================================
   TREES
   ========================================================= */

for (
    let i = 0;
    i < 35;
    i++
) {

    let x =
        (Math.random() - 0.5) * 120;

    let z =
        (Math.random() - 0.5) * 100;

    if (
        Math.abs(x) < 14 &&
        z < 25 &&
        z > -45
    ) {
        x +=
            x >= 0
                ? 18
                : -18;
    }

    createTree(
        x,
        z,
        0.8 + Math.random() * 0.7
    );
}


/* =========================================================
   CASTLE
   ========================================================= */

const castle =
    new THREE.Group();

castle.position.set(
    0,
    0,
    -42
);

environment.add(castle);


/* =========================================================
   CASTLE BODY
   ========================================================= */

const castleStone =
    new THREE.MeshStandardMaterial({
        color: 0x74766d,
        roughness: 0.9
    });

const castleBody =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            28,
            16,
            12
        ),
        castleStone
    );

castleBody.position.y =
    8;

castleBody.castShadow = true;
castleBody.receiveShadow = true;

castle.add(castleBody);


/* =========================================================
   CASTLE ROOF
   ========================================================= */

const roofMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x20242b,
        roughness: 0.7
    });


function createTower(
    x,
    z,
    height = 24
) {

    const tower =
        new THREE.Group();

    const body =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                3.2,
                3.6,
                height,
                12
            ),
            castleStone
        );

    body.position.y =
        height / 2;

    body.castShadow = true;

    tower.add(body);


    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                4.3,
                7,
                12
            ),
            roofMaterial
        );

    roof.position.y =
        height + 3.5;

    roof.castShadow = true;

    tower.add(roof);


    tower.position.set(
        x,
        0,
        z
    );

    castle.add(tower);
}


/* =========================================================
   CASTLE TOWERS
   ========================================================= */

createTower(
    -13,
    -4,
    23
);

createTower(
    13,
    -4,
    23
);

createTower(
    -13,
    -80,
    27
);

createTower(
    13,
    -80,
    27
);


/* =========================================================
   CASTLE WINDOWS
   ========================================================= */

function createWindow(
    x,
    y,
    z
) {

    const windowMesh =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.2,
                2.2,
                0.15
            ),
            new THREE.MeshStandardMaterial({
                color: 0x91d8e8,
                emissive: 0x285b68,
                emissiveIntensity: 1.4
            })
        );

    windowMesh.position.set(
        x,
        y,
        z
    );

    castle.add(windowMesh);
}


for (
    let x = -10;
    x <= 10;
    x += 5
) {

    createWindow(
        x,
        9,
        -48.05
    );
}


/* =========================================================
   CASTLE DOOR
   ========================================================= */

const door =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            4,
            6,
            0.5
        ),
        new THREE.MeshStandardMaterial({
            color: 0x172f3b,
            roughness: 0.5
        })
    );

door.position.set(
    0,
    3,
    -48.2
);

castle.add(door);


/* =========================================================
   FOUNTAIN
   ========================================================= */

const fountain =
    new THREE.Group();

const basin =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            5,
            5.5,
            0.7,
            32
        ),
        material(
            0x8b908b,
            0.75
        )
    );

basin.position.y =
    0.35;

basin.receiveShadow = true;

fountain.add(basin);


const water =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            4.4,
            4.4,
            0.15,
            32
        ),
        new THREE.MeshStandardMaterial({
            color: 0x52b9d5,
            transparent: true,
            opacity: 0.75,
            roughness: 0.1,
            metalness: 0.1
        })
    );

water.position.y =
    0.75;

fountain.add(water);


const fountainColumn =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.6,
            0.9,
            3,
            16
        ),
        material(
            0x858985
        )
    );

fountainColumn.position.y =
    2.1;

fountain.add(fountainColumn);


fountain.position.set(
    0,
    0,
    8
);

environment.add(fountain);


/* =========================================================
   TORCH
   ========================================================= */

function createTorch(
    x,
    z
) {

    const torch =
        new THREE.Group();


    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.09,
                0.12,
                2.8,
                8
            ),
            material(
                0x3c2416
            )
        );

    pole.position.y =
        1.4;

    pole.castShadow = true;

    torch.add(pole);


    const flame =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.42,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffa21a,
                emissive: 0xff4d00,
                emissiveIntensity: 4,
                roughness: 0.3
            })
        );

    flame.scale.set(
        0.75,
        1.5,
        0.75
    );

    flame.position.y =
        3.1;

    torch.add(flame);


    const light =
        new THREE.PointLight(
            0xff8a24,
            4,
            12
        );

    light.position.y =
        3;

    torch.add(light);


    torch.position.set(
        x,
        0,
        z
    );

    environment.add(torch);

    return flame;
}


const flames = [];


[
    [-8, 4],
    [8, 4],
    [-8, -18],
    [8, -18],
    [-8, -38],
    [8, -38],
    [-8, -55],
    [8, -55]
].forEach(
    p => {
        flames.push(
            createTorch(
                p[0],
                p[1]
            )
        );
    }
);


/* =========================================================
   PLAYER
   ========================================================= */

function createFallbackPlayer() {

    const group =
        new THREE.Group();

    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.65,
                1.6,
                6,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x33215c
            })
        );

    body.position.y =
        1.2;

    body.castShadow = true;

    group.add(body);


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.5,
                20,
                20
            ),
            material(
                0xc99165
            )
        );

    head.position.y =
        2.65;

    head.castShadow = true;

    group.add(head);


    group.position.set(
        0,
        0,
        15
    );

    scene.add(group);

    return group;
}


/* =========================================================
   DRACO LOADER
   ========================================================= */

const dracoLoader =
    new DRACOLoader();

dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);


/* =========================================================
   GLTF LOADER
   ========================================================= */

const loader =
    new GLTFLoader();

loader.setDRACOLoader(
    dracoLoader
);


/* =========================================================
   LOAD PLAYER
   ========================================================= */

function loadPlayer() {

    const url =
        "assets/player/aren_valen.glb?v=20";


    loader.load(

        url,

        function(gltf) {

            if (player) {
                scene.remove(player);
            }


            playerModel =
                gltf.scene;


            player =
                new THREE.Group();


            player.add(
                playerModel
            );


            player.position.set(
                0,
                0,
                15
            );


            scene.add(player);


            /* -----------------------------------------
               SCALE CHARACTER
               ----------------------------------------- */

            const box =
                new THREE.Box3()
                .setFromObject(
                    playerModel
                );

            const size =
                box.getSize(
                    new THREE.Vector3()
                );

            const height =
                size.y;

            if (
                height > 0
            ) {

                const targetHeight =
                    3.1;

                const scale =
                    targetHeight /
                    height;

                playerModel.scale.setScalar(
                    scale
                );
            }


            /* -----------------------------------------
               SHADOWS
               ----------------------------------------- */

            playerModel.traverse(
                object => {

                    if (
                        object.isMesh
                    ) {

                        object.castShadow =
                            true;

                        object.receiveShadow =
                            true;

                        if (
                            object.material
                        ) {

                            object.material.roughness =
                                Math.min(
                                    object.material.roughness ?? 0.8,
                                    0.9
                                );
                        }
                    }
                }
            );


            /* -----------------------------------------
               BONES
               ----------------------------------------- */

            rightHandBone =
                findBone(
                    playerModel,
                    "RightHand"
                );

            leftHandBone =
                findBone(
                    playerModel,
                    "LeftHand"
                );


            /* -----------------------------------------
               STANDING POSE
               ----------------------------------------- */

            applyStandingPose();


            /* -----------------------------------------
               WAND
               ----------------------------------------- */

            createWand();


            console.log(
                "Aren Valen loaded successfully."
            );

        },

        function(xhr) {

            if (xhr.total) {

                const percent =
                    Math.round(
                        xhr.loaded /
                        xhr.total *
                        100
                    );

                console.log(
                    "Player loading:",
                    percent + "%"
                );
            }
        },

        function(error) {

            console.error(
                "Aren GLB failed:",
                error
            );

            player =
                createFallbackPlayer();

            createFallbackWand();
        }
    );
}


/* =========================================================
   FIND BONE
   ========================================================= */

function findBone(
    root,
    name
) {

    let result = null;

    root.traverse(
        object => {

            if (
                object.isBone &&
                object.name === name
            ) {

                result =
                    object;
            }
        }
    );

    return result;
}


/* =========================================================
   BONE OFFSET
   ========================================================= */

function setBoneOffset(
    name,
    x,
    y,
    z
) {

    const bone =
        findBone(
            playerModel,
            name
        );

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
        0,
        0,
        0
    );

    setBoneOffset(
        "RightForeArm",
        0,
        0,
        0
    );


    setBoneOffset(
        "LeftShoulder",
        0,
        0,
        0
    );

    setBoneOffset(
        "RightShoulder",
        0,
        0,
        0
    );
}


/* =========================================================
   WAND
   ========================================================= */

function createWand() {

    if (!rightHandBone)
        return;


    if (wand) {

        rightHandBone.remove(
            wand
        );
    }


    wand =
        new THREE.Group();


    /* -----------------------------------------
       HANDLE
       ----------------------------------------- */

    const handle =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.055,
                0.075,
                0.9,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x4b2415,
                roughness: 0.65
            })
        );


    handle.rotation.z =
        -Math.PI / 2;


    handle.position.x =
        0.45;


    handle.castShadow =
        true;


    wand.add(handle);


    /* -----------------------------------------
       GOLDEN CORE
       ----------------------------------------- */

    const core =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.035,
                0.035,
                0.25,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffd45a,
                emissive: 0xff8a00,
                emissiveIntensity: 2
            })
        );


    core.rotation.z =
        -Math.PI / 2;

    core.position.x =
        0.88;


    wand.add(core);


    /* -----------------------------------------
       WAND GLOW
       ----------------------------------------- */

    const glow =
        new THREE.PointLight(
            0xffcc66,
            1.5,
            3
        );

    glow.position.x =
        0.95;

    wand.add(glow);


    /* -----------------------------------------
       ATTACH
       ----------------------------------------- */

    rightHandBone.add(
        wand
    );


    /*
       These values position the wand
       in the character's hand.
    */

    wand.position.set(
        0.0,
        0.0,
        0.0
    );


    wand.rotation.set(
        0,
        0,
        0
    );


    wandTip =
        new THREE.Object3D();

    wandTip.position.set(
        1.02,
        0,
        0
    );

    wand.add(
        wandTip
    );


    console.log(
        "Wand attached to RightHand"
    );
}


/* =========================================================
   FALLBACK WAND
   ========================================================= */

function createFallbackWand() {

    if (!player)
        return;


    wand =
        new THREE.Group();


    const stick =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.05,
                0.08,
                1.2,
                8
            ),
            material(
                0x542815
            )
        );


    stick.rotation.z =
        -Math.PI / 2;

    stick.position.x =
        0.9;

    wand.add(
        stick
    );


    player.add(
        wand
    );


    wand.position.set(
        0.7,
        1.7,
        0
    );


    wandTip =
        new THREE.Object3D();

    wandTip.position.x =
        1.5;

    wand.add(
        wandTip
    );
}


/* =========================================================
   INPUT
   ========================================================= */

const keys = {};

window.addEventListener(
    "keydown",
    e => {

        keys[e.key.toLowerCase()] =
            true;

        if (
            e.code === "Space"
        ) {

            jump();
        }

        if (
            e.key.toLowerCase() === "f"
        ) {

            castSpell();
        }
    }
);


window.addEventListener(
    "keyup",
    e => {

        keys[e.key.toLowerCase()] =
            false;
    }
);


/* =========================================================
   JOYSTICK
   ========================================================= */

let joystickActive =
    false;

let joystickX = 0;
let joystickY = 0;

const joystick =
    document.getElementById(
        "joystick"
    );

if (joystick) {

    joystick.addEventListener(
        "pointerdown",
        e => {

            joystickActive =
                true;

            joystick.setPointerCapture(
                e.pointerId
            );
        }
    );


    joystick.addEventListener(
        "pointermove",
        e => {

            if (
                !joystickActive
            )
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
                e.clientX -
                centerX;


            let dy =
                e.clientY -
                centerY;


            const max =
                rect.width *
                0.32;


            dx =
                THREE.MathUtils.clamp(
                    dx,
                    -max,
                    max
                );


            dy =
                THREE.MathUtils.clamp(
                    dy,
                    -max,
                    max
                );


            joystickX =
                dx / max;

            joystickY =
                dy / max;
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
}


function resetJoystick() {

    joystickActive =
        false;

    joystickX =
        0;

    joystickY =
        0;
}


/* =========================================================
   MOVEMENT
   ========================================================= */

function updateMovement(
    delta
) {

    if (!player)
        return;


    let x =
        joystickX;

    let y =
        joystickY;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        y = -1;
    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        y = 1;
    }

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        x = -1;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        x = 1;
    }


    const input =
        new THREE.Vector2(
            x,
            y
        );


    if (
        input.lengthSq() > 0.01
    ) {

        input.normalize();

        isMoving = true;


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
            -input.y
        );


        direction.addScaledVector(
            right,
            input.x
        );


        if (
            direction.lengthSq() > 0
        ) {

            direction.normalize();


            lastMoveDirection.copy(
                direction
            );


            const speed =
                keys["shift"]
                    ? 7
                    : 4.2;


            player.position.add(
                direction.clone()
                .multiplyScalar(
                    speed * delta
                )
            );


            player.rotation.y =
                Math.atan2(
                    direction.x,
                    direction.z
                );
        }

    } else {

        isMoving = false;
    }


    /* -----------------------------------------
       WORLD BOUNDS
       ----------------------------------------- */

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -75,
            75
        );

    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -85,
            35
        );


    /* -----------------------------------------
       GROUND
       ----------------------------------------- */

    if (
        player.position.y < 0
    ) {

        player.position.y =
            0;
    }
}


/* =========================================================
   JUMP
   ========================================================= */

function jump() {

    if (
        !player ||
        isJumping
    )
        return;


    isJumping =
        true;

    verticalVelocity =
        jumpPower;
}


function updateJump(
    delta
) {

    if (
        !player
    )
        return;


    if (
        isJumping
    ) {

        verticalVelocity +=
            gravity * delta;


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
}


/* =========================================================
   PLAYER ANIMATION
   ========================================================= */

function updateAnimation(
    time
) {

    if (
        !playerModel
    )
        return;


    if (
        isJumping
    ) {

        applyJumpAnimation();
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
            time
        );

        return;
    }


    applyIdleAnimation(
        time
    );
}


/* =========================================================
   IDLE
   ========================================================= */

function applyIdleAnimation(
    time
) {

    const breathing =
        Math.sin(
            time * 2
        ) * 0.025;


    setBoneOffset(
        "LeftArm",
        Math.PI / 2 +
        breathing,
        0,
        0
    );


    setBoneOffset(
        "RightArm",
        Math.PI / 2 -
        breathing,
        0,
        0
    );
}


/* =========================================================
   WALK
   ========================================================= */

function applyWalkingAnimation(
    time
) {

    const swing =
        Math.sin(
            time * 9
        ) * 0.35;


    setBoneOffset(
        "LeftArm",
        Math.PI / 2 +
        swing,
        0,
        0
    );


    setBoneOffset(
        "RightArm",
        Math.PI / 2 -
        swing,
        0,
        0
    );


    const leftLeg =
        findBone(
            playerModel,
            "LeftUpLeg"
        );

    const rightLeg =
        findBone(
            playerModel,
            "RightUpLeg"
        );


    if (
        leftLeg
    ) {

        leftLeg.rotation.x =
            -swing;
    }


    if (
        rightLeg
    ) {

        rightLeg.rotation.x =
            swing;
    }
}


/* =========================================================
   JUMP ANIMATION
   ========================================================= */

function applyJumpAnimation() {

    setBoneOffset(
        "LeftArm",
        Math.PI / 2 -
        0.3,
        0,
        0
    );


    setBoneOffset(
        "RightArm",
        Math.PI / 2 +
        0.3,
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

    const pulse =
        Math.sin(
            time * 8
        ) * 0.12;


    setBoneOffset(
        "RightArm",
        Math.PI / 2 -
        0.75 +
        pulse,
        0,
        0
    );


    setBoneOffset(
        "RightForeArm",
        -0.35,
        0,
        0
    );


    setBoneOffset(
        "LeftArm",
        Math.PI / 2,
        0,
        0
    );
}


/* =========================================================
   SPELL
   ========================================================= */

function castSpell() {

    if (
        !player ||
        casting
    )
        return;


    casting =
        true;


    setTimeout(
        () => {

            launchSpell();

        },
        220
    );


    setTimeout(
        () => {

            casting =
                false;

        },
        650
    );
}


/* =========================================================
   LAUNCH SPELL
   ========================================================= */

function launchSpell() {

    if (!player)
        return;


    const spell =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.18,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0x8be9ff,
                emissive: 0x26b9ff,
                emissiveIntensity: 8,
                roughness: 0.1
            })
        );


    spell.castShadow =
        true;


    const light =
        new THREE.PointLight(
            0x45cfff,
            5,
            7
        );


    spell.add(
        light
    );


    /* -----------------------------------------
       DIRECTION

       IMPORTANT:
       Use player's actual movement/facing
       direction instead of model axis.
       ----------------------------------------- */

    const direction =
        lastMoveDirection
        .clone()
        .normalize();


    let start =
        player.position.clone();


    if (
        wandTip
    ) {

        const worldTip =
            new THREE.Vector3();

        wandTip.getWorldPosition(
            worldTip
        );

        start.copy(
            worldTip
        );

    } else {

        start.y += 1.8;

        start.add(
            direction.clone()
            .multiplyScalar(
                1.1
            )
        );
    }


    spell.position.copy(
        start
    );


    spell.userData.velocity =
        direction
        .clone()
        .multiplyScalar(
            18
        );


    spell.userData.life =
        0;


    effects.add(
        spell
    );


    /* -----------------------------------------
       TRAIL
       ----------------------------------------- */

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const trail =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.07,
                    8,
                    8
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x9defff,
                    emissive: 0x35cfff,
                    emissiveIntensity: 5,
                    transparent: true,
                    opacity: 0.7
                })
            );


        trail.position.copy(
            start
        );


        trail.userData.velocity =
            direction
            .clone()
            .multiplyScalar(
                14 + i
            );


        trail.userData.life =
            i * 0.035;


        effects.add(
            trail
        );
    }
}


/* =========================================================
   UPDATE SPELLS
   ========================================================= */

function updateSpells(
    delta
) {

    const remove = [];


    effects.children.forEach(
        spell => {

            if (
                !spell.userData.velocity
            )
                return;


            spell.userData.life +=
                delta;


            spell.position.add(
                spell.userData.velocity
                .clone()
                .multiplyScalar(
                    delta
                )
            );


            spell.scale.multiplyScalar(
                0.997
            );


            if (
                spell.userData.life >
                1.8
            ) {

                remove.push(
                    spell
                );
            }
        }
    );


    remove.forEach(
        object => {

            effects.remove(
                object
            );

            object.traverse(
                child => {

                    if (
                        child.geometry
                    ) {

                        child.geometry.dispose();
                    }

                    if (
                        child.material
                    ) {

                        child.material.dispose();
                    }
                }
            );
        }
    );
}


/* =========================================================
   FIRE ANIMATION
   ========================================================= */

function updateFire(
    time
) {

    flames.forEach(
        (flame, index) => {

            const pulse =
                1 +
                Math.sin(
                    time * 9 +
                    index
                ) *
                0.12;


            flame.scale.set(
                0.75 * pulse,
                1.5 * pulse,
                0.75 * pulse
            );


            flame.rotation.y =
                time * 2 +
                index;
        }
    );
}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera(
    delta
) {

    if (!player)
        return;


    const distance =
        8.5;

    const height =
        4.5;


    const desired =
        new THREE.Vector3(
            0,
            height,
            distance
        );


    desired.applyAxisAngle(
        new THREE.Vector3(
            0,
            1,
            0
        ),
        cameraYaw
    );


    desired.add(
        player.position
    );


    camera.position.lerp(
        desired,
        1 -
        Math.pow(
            0.001,
            delta
        )
    );


    const target =
        player.position.clone();


    target.y +=
        1.6;


    camera.lookAt(
        target
    );
}


/* =========================================================
   CAMERA TOUCH DRAG
   ========================================================= */

let cameraDragging =
    false;

let lastPointerX =
    0;


renderer.domElement.addEventListener(
    "pointerdown",
    e => {

        cameraDragging =
            true;

        lastPointerX =
            e.clientX;
    }
);


renderer.domElement.addEventListener(
    "pointermove",
    e => {

        if (
            !cameraDragging
        )
            return;


        const dx =
            e.clientX -
            lastPointerX;


        lastPointerX =
            e.clientX;


        cameraYaw -=
            dx * 0.006;
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
   BUTTONS
   ========================================================= */

const jumpButton =
    document.getElementById(
        "jumpButton"
    );

if (jumpButton) {

    jumpButton.addEventListener(
        "pointerdown",
        jump
    );
}


const castButton =
    document.getElementById(
        "castButton"
    );

if (castButton) {

    castButton.addEventListener(
        "pointerdown",
        castSpell
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
   LOADING SCREEN
   ========================================================= */

function hideLoading() {

    const loading =
        document.getElementById(
            "loading"
        );

    if (loading) {

        loading.style.opacity =
            "0";

        setTimeout(
            () => {

                loading.style.display =
                    "none";

            },
            600
        );
    }
}


/* =========================================================
   QUEST
   ========================================================= */

let questText =
    "Talk to Professor Aelion";

let xp = 0;


function updateQuestUI() {

    const quest =
        document.getElementById(
            "questText"
        );

    const xpElement =
        document.getElementById(
            "xp"
        );


    if (quest) {

        quest.textContent =
            "Quest: " +
            questText;
    }


    if (xpElement) {

        xpElement.textContent =
            "XP: " +
            xp;
    }
}


updateQuestUI();


/* =========================================================
   NPC
   ========================================================= */

function createNPC() {

    const npc =
        new THREE.Group();


    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.55,
                1.5,
                6,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x26304a,
                roughness: 0.8
            })
        );

    body.position.y =
        1.2;

    body.castShadow = true;

    npc.add(body);


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.48,
                20,
                20
            ),
            material(
                0xc68d61
            )
        );

    head.position.y =
        2.55;

    head.castShadow = true;

    npc.add(head);


    const hat =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.7,
                1.4,
                16
            ),
            material(
                0x191326
            )
        );

    hat.position.y =
        3.35;

    npc.add(hat);


    npc.position.set(
        3,
        0,
        5
    );


    environment.add(
        npc
    );
}


createNPC();


/* =========================================================
   ANIMATION LOOP
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


    updateAnimation(
        time
    );


    updateSpells(
        delta
    );


    updateFire(
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


/* =========================================================
   START
   ========================================================= */

loadPlayer();

setTimeout(
    hideLoading,
    1200
);

animate();


console.log(
    "AETHERIA ACADEMY v20 STARTED"
);
