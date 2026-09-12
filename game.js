/* =========================================================
   AETHERIA ACADEMY
   STEP 1 — WORLD ENVIRONMENT UPGRADE
   ---------------------------------------------------------
   • 3D academy courtyard
   • Grass
   • Trees
   • Rocks
   • Bushes
   • Paths
   • Fountain
   • Torches + fire
   • NPC + quest
   • Aren player GLB
   • Movement / run / jump
   • Camera
   • Magic spell
   • Mobile joystick
   ========================================================= */

import * as THREE from "three";
import { GLTFLoader } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

import { DRACOLoader } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js";


/* =========================================================
   BASIC SETUP
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87b9d8);

scene.fog = new THREE.Fog(
    0x87b9d8,
    70,
    260
);


const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);


const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.1;

document.body.appendChild(
    renderer.domElement
);


/* =========================================================
   LOADING
   ========================================================= */

const loadingScreen =
    document.getElementById("loadingScreen");

const loadingText =
    document.getElementById("loadingText");


function setLoading(text) {

    if (loadingText) {
        loadingText.textContent = text;
    }

}


function hideLoading() {

    if (!loadingScreen) return;

    loadingScreen.style.opacity = "0";

    setTimeout(() => {

        loadingScreen.style.display =
            "none";

    }, 700);

}


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight =
    new THREE.HemisphereLight(
        0xbfe8ff,
        0x526342,
        1.8
    );

scene.add(hemiLight);


const sun =
    new THREE.DirectionalLight(
        0xfff3d1,
        3
    );

sun.position.set(
    60,
    100,
    40
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -120;
sun.shadow.camera.right = 120;
sun.shadow.camera.top = 120;
sun.shadow.camera.bottom = -120;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 300;

scene.add(sun);


/* =========================================================
   WORLD GROUPS
   ========================================================= */

const world =
    new THREE.Group();

scene.add(world);


const environment =
    new THREE.Group();

world.add(environment);


const decorations =
    new THREE.Group();

world.add(decorations);


const effects =
    new THREE.Group();

scene.add(effects);


/* =========================================================
   MATERIALS
   ========================================================= */

const grassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3e7138,
        roughness: 1
    });


const grassLightMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x64964d,
        roughness: 1
    });


const dirtMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x80633d,
        roughness: 1
    });


const stoneMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x777b76,
        roughness: 0.95
    });


const stoneDarkMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x4f514e,
        roughness: 1
    });


const woodMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x4a2d18,
        roughness: 1
    });


const leafMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x285d31,
        roughness: 1
    });


const leafLightMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3d7d42,
        roughness: 1
    });


const flowerMaterials = [

    new THREE.MeshStandardMaterial({
        color: 0xb05d86
    }),

    new THREE.MeshStandardMaterial({
        color: 0xc98b3c
    }),

    new THREE.MeshStandardMaterial({
        color: 0x8c6bb1
    }),

    new THREE.MeshStandardMaterial({
        color: 0xd8d1b1
    })

];


/* =========================================================
   GROUND
   ========================================================= */

const groundGeometry =
    new THREE.PlaneGeometry(
        300,
        300,
        80,
        80
    );


const ground =
    new THREE.Mesh(
        groundGeometry,
        grassMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

environment.add(ground);


/* =========================================================
   GRASS PATCH
   ========================================================= */

function createGrassPatch(
    x,
    z,
    radius = 3,
    count = 30
) {

    const group =
        new THREE.Group();

    group.position.set(
        x,
        0.03,
        z
    );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const blade =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    0.035,
                    THREE.MathUtils.randFloat(
                        0.25,
                        0.6
                    ),
                    3
                ),
                i % 2 === 0
                    ? grassLightMaterial
                    : grassMaterial
            );

        const angle =
            Math.random() *
            Math.PI * 2;

        const distance =
            Math.sqrt(Math.random()) *
            radius;

        blade.position.x =
            Math.cos(angle) *
            distance;

        blade.position.z =
            Math.sin(angle) *
            distance;

        blade.position.y =
            0.25;

        blade.rotation.y =
            Math.random() *
            Math.PI;

        blade.rotation.z =
            THREE.MathUtils.randFloat(
                -0.25,
                0.25
            );

        blade.castShadow = true;

        group.add(blade);
    }

    decorations.add(group);
}


/* =========================================================
   MANY GRASS PATCHES
   ========================================================= */

for (
    let i = 0;
    i < 100;
    i++
) {

    const x =
        THREE.MathUtils.randFloat(
            -110,
            110
        );

    const z =
        THREE.MathUtils.randFloat(
            -110,
            110
        );

    createGrassPatch(
        x,
        z,
        THREE.MathUtils.randFloat(2, 5),
        THREE.MathUtils.randInt(15, 35)
    );
}


/* =========================================================
   PATH
   ========================================================= */

function createPath(
    width,
    length,
    x,
    z
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            0.12,
            length
        );

    const mesh =
        new THREE.Mesh(
            geometry,
            dirtMaterial
        );

    mesh.position.set(
        x,
        0.06,
        z
    );

    mesh.receiveShadow = true;

    environment.add(mesh);

    return mesh;
}


/* Main academy path */

createPath(
    12,
    170,
    0,
    -35
);


/* Cross path */

const crossPath =
    createPath(
        150,
        10,
        0,
        20
    );


/* =========================================================
   STONE PATH BLOCKS
   ========================================================= */

function createPathStone(
    x,
    y,
    z,
    scaleX = 1,
    scaleZ = 1
) {

    const stone =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                scaleX,
                0.18,
                scaleZ
            ),
            stoneMaterial
        );

    stone.position.set(
        x,
        y,
        z
    );

    stone.rotation.y =
        THREE.MathUtils.randFloat(
            -0.05,
            0.05
        );

    stone.castShadow = true;
    stone.receiveShadow = true;

    decorations.add(stone);
}


/* =========================================================
   COURTYARD
   ========================================================= */

const courtyard =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            38,
            38,
            0.25,
            64
        ),
        stoneMaterial
    );

courtyard.position.set(
    0,
    0.13,
    15
);

courtyard.receiveShadow = true;

environment.add(courtyard);


/* =========================================================
   FOUNTAIN
   ========================================================= */

function createFountain() {

    const group =
        new THREE.Group();

    group.position.set(
        0,
        0.2,
        15
    );


    const base =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                8,
                8.5,
                0.7,
                48
            ),
            stoneMaterial
        );

    base.castShadow = true;
    base.receiveShadow = true;

    group.add(base);


    const water =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                6.8,
                6.8,
                0.12,
                48
            ),
            new THREE.MeshStandardMaterial({
                color: 0x4ba6c6,
                roughness: 0.1,
                metalness: 0.15,
                transparent: true,
                opacity: 0.85
            })
        );

    water.position.y =
        0.42;

    group.add(water);


    const pillar =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.2,
                1.6,
                4,
                24
            ),
            stoneMaterial
        );

    pillar.position.y =
        2.1;

    pillar.castShadow = true;

    group.add(pillar);


    const bowl =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                4,
                2.5,
                0.7,
                32
            ),
            stoneMaterial
        );

    bowl.position.y =
        4.1;

    bowl.castShadow = true;

    group.add(bowl);


    const crystal =
        new THREE.Mesh(
            new THREE.OctahedronGeometry(
                1.1,
                1
            ),
            new THREE.MeshStandardMaterial({
                color: 0x75d9ff,
                emissive: 0x247da0,
                emissiveIntensity: 1.5
            })
        );

    crystal.position.y =
        5.4;

    group.add(crystal);


    const light =
        new THREE.PointLight(
            0x69dfff,
            2,
            20
        );

    light.position.y =
        5;

    group.add(light);


    decorations.add(group);
}


createFountain();


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
                THREE.MathUtils.randFloat(
                    0.5,
                    1.4
                ),
                1
            ),
            Math.random() > 0.5
                ? stoneMaterial
                : stoneDarkMaterial
        );

    rock.position.set(
        x,
        0.45 * scale,
        z
    );

    rock.scale.set(
        scale,
        scale *
        THREE.MathUtils.randFloat(
            0.6,
            1
        ),
        scale
    );

    rock.rotation.set(
        Math.random(),
        Math.random(),
        Math.random()
    );

    rock.castShadow = true;
    rock.receiveShadow = true;

    decorations.add(rock);
}


/* =========================================================
   ROCK GROUPS
   ========================================================= */

for (
    let i = 0;
    i < 45;
    i++
) {

    const x =
        THREE.MathUtils.randFloat(
            -100,
            100
        );

    const z =
        THREE.MathUtils.randFloat(
            -100,
            100
        );


    if (
        Math.abs(x) < 45 &&
        Math.abs(z - 15) < 35
    ) {
        continue;
    }


    createRock(
        x,
        z,
        THREE.MathUtils.randFloat(
            0.5,
            1.5
        )
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

    tree.position.set(
        x,
        0,
        z
    );

    tree.scale.setScalar(
        scale
    );


    /* trunk */

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.55,
                0.8,
                6,
                10
            ),
            woodMaterial
        );

    trunk.position.y =
        3;

    trunk.castShadow = true;

    tree.add(trunk);


    /* main crown */

    const crown1 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                3.1,
                12,
                10
            ),
            leafMaterial
        );

    crown1.position.y =
        6.2;

    crown1.castShadow = true;

    tree.add(crown1);


    /* second crown */

    const crown2 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.3,
                12,
                10
            ),
            leafLightMaterial
        );

    crown2.position.set(
        1.8,
        7,
        0
    );

    crown2.castShadow = true;

    tree.add(crown2);


    const crown3 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.2,
                12,
                10
            ),
            leafMaterial
        );

    crown3.position.set(
        -1.8,
        6.8,
        0.4
    );

    crown3.castShadow = true;

    tree.add(crown3);


    decorations.add(tree);

    return tree;
}


/* =========================================================
   TREE PLACEMENT
   ========================================================= */

const treePositions = [

    [-42, -42],
    [42, -42],

    [-48, -15],
    [48, -15],

    [-52, 25],
    [52, 25],

    [-43, 55],
    [43, 55],

    [-75, -55],
    [75, -55],

    [-85, 10],
    [85, 10],

    [-72, 70],
    [72, 70],

    [-95, 55],
    [95, 55],

    [-20, 80],
    [20, 80]

];


for (
    const position of treePositions
) {

    createTree(
        position[0],
        position[1],
        THREE.MathUtils.randFloat(
            0.85,
            1.25
        )
    );
}


/* =========================================================
   BUSH
   ========================================================= */

function createBush(
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


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const bush =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    THREE.MathUtils.randFloat(
                        0.7,
                        1.3
                    ),
                    10,
                    8
                ),
                leafLightMaterial
            );

        bush.position.set(
            THREE.MathUtils.randFloat(
                -1.2,
                1.2
            ),
            THREE.MathUtils.randFloat(
                0.5,
                1.2
            ),
            THREE.MathUtils.randFloat(
                -1.2,
                1.2
            )
        );

        bush.castShadow = true;

        group.add(bush);
    }


    decorations.add(group);
}


/* =========================================================
   BUSH PLACEMENT
   ========================================================= */

for (
    let i = 0;
    i < 45;
    i++
) {

    createBush(
        THREE.MathUtils.randFloat(
            -85,
            85
        ),
        THREE.MathUtils.randFloat(
            -80,
            85
        ),
        THREE.MathUtils.randFloat(
            0.7,
            1.3
        )
    );
}


/* =========================================================
   FLOWERS
   ========================================================= */

function createFlower(
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


    const stem =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.025,
                0.025,
                0.45,
                5
            ),
            new THREE.MeshStandardMaterial({
                color: 0x477a38
            })
        );

    stem.position.y =
        0.22;

    group.add(stem);


    const flower =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.12,
                8,
                8
            ),
            flowerMaterials[
                Math.floor(
                    Math.random() *
                    flowerMaterials.length
                )
            ]
        );

    flower.position.y =
        0.5;

    group.add(flower);

    decorations.add(group);
}


for (
    let i = 0;
    i < 100;
    i++
) {

    createFlower(
        THREE.MathUtils.randFloat(
            -70,
            70
        ),
        THREE.MathUtils.randFloat(
            -70,
            80
        )
    );
}


/* =========================================================
   ACADEMY CASTLE
   ========================================================= */

function createAcademy() {

    const castle =
        new THREE.Group();

    castle.position.set(
        0,
        0,
        -75
    );


    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x686a68,
            roughness: 0.9
        });


    /* Main building */

    const main =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                58,
                24,
                22
            ),
            wallMaterial
        );

    main.position.y =
        12;

    main.castShadow = true;
    main.receiveShadow = true;

    castle.add(main);


    /* Central tower */

    const tower =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                8,
                9,
                38,
                8
            ),
            wallMaterial
        );

    tower.position.set(
        0,
        19,
        0
    );

    tower.castShadow = true;

    castle.add(tower);


    /* Tower roof */

    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                10,
                10,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x292d39,
                roughness: 0.8
            })
        );

    roof.position.set(
        0,
        43,
        0
    );

    roof.castShadow = true;

    castle.add(roof);


    /* Side towers */

    const sidePositions = [
        [-25, 0],
        [25, 0]
    ];


    for (
        const p of sidePositions
    ) {

        const sideTower =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    5,
                    6,
                    30,
                    8
                ),
                wallMaterial
            );

        sideTower.position.set(
            p[0],
            15,
            p[1]
        );

        sideTower.castShadow = true;

        castle.add(sideTower);


        const sideRoof =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    7,
                    8,
                    8
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x292d39
                })
            );

        sideRoof.position.set(
            p[0],
            34,
            p[1]
        );

        sideRoof.castShadow = true;

        castle.add(sideRoof);
    }


    /* Entrance */

    const entrance =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                14,
                13,
                4
            ),
            stoneDarkMaterial
        );

    entrance.position.set(
        0,
        6.5,
        11.5
    );

    castle.add(entrance);


    /* Magical doorway */

    const doorway =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                7,
                10,
                0.5
            ),
            new THREE.MeshStandardMaterial({
                color: 0x17202c,
                emissive: 0x183c52,
                emissiveIntensity: 1
            })
        );

    doorway.position.set(
        0,
        5,
        13.7
    );

    castle.add(doorway);


    /* Windows */

    for (
        let x = -20;
        x <= 20;
        x += 10
    ) {

        const window =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    2.4,
                    4,
                    0.3
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x8dd9ed,
                    emissive: 0x256b83,
                    emissiveIntensity: 0.7
                })
            );

        window.position.set(
            x,
            11,
            11.2
        );

        castle.add(window);
    }


    environment.add(castle);
}


createAcademy();


/* =========================================================
   TORCH
   ========================================================= */

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


    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.12,
                0.15,
                2.8,
                8
            ),
            woodMaterial
        );

    pole.position.y =
        1.4;

    pole.castShadow = true;

    group.add(pole);


    const fire =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.45,
                10,
                10
            ),
            new THREE.MeshBasicMaterial({
                color: 0xff8a21
            })
        );

    fire.scale.y =
        1.6;

    fire.position.y =
        3;

    group.add(fire);


    const flame =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.28,
                1.2,
                8
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffd15a
            })
        );

    flame.position.y =
        3.5;

    group.add(flame);


    const light =
        new THREE.PointLight(
            0xff8a32,
            2.5,
            14
        );

    light.position.y =
        3;

    group.add(light);


    effects.add(group);

    return {
        group,
        fire,
        flame,
        light
    };
}


/* =========================================================
   TORCHES
   ========================================================= */

const torches = [];

torches.push(
    createTorch(-10, 8)
);

torches.push(
    createTorch(10, 8)
);

torches.push(
    createTorch(-18, -4)
);

torches.push(
    createTorch(18, -4)
);


/* =========================================================
   PLAYER
   ========================================================= */

let player = null;

let playerModel = null;

let mixer = null;

let playerBones = {};

let playerReady = false;


const playerStart =
    new THREE.Vector3(
        0,
        0,
        50
    );


/* =========================================================
   COLLISION OBJECTS
   ========================================================= */

const collisionObjects = [];


/* Trees as collision */

for (
    const p of treePositions
) {

    collisionObjects.push({
        x: p[0],
        z: p[1],
        radius: 2.2
    });

}


/* Rocks */

for (
    let i = 0;
    i < 20;
    i++
) {

    /* decorative collision approximation */

}


/* =========================================================
   PLAYER GROUP
   ========================================================= */

player =
    new THREE.Group();

player.position.copy(
    playerStart
);

scene.add(player);


/* =========================================================
   DRACO LOADER
   ========================================================= */

const dracoLoader =
    new DRACOLoader();

dracoLoader.setDecoderPath(
    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/"
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
   LOAD AREN
   ========================================================= */

setLoading(
    "Loading Aetheria Academy..."
);


loader.load(

    "assets/player/aren_valen.glb",

    function(gltf) {

        playerModel =
            gltf.scene;

        player.add(
            playerModel
        );


        playerModel.traverse(
            function(object) {

                if (
                    object.isMesh
                ) {

                    object.castShadow = true;
                    object.receiveShadow = true;

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


        /* =================================================
           AUTO SCALE
           ================================================= */

        const box =
            new THREE.Box3()
                .setFromObject(
                    playerModel
                );

        const size =
            new THREE.Vector3();

        box.getSize(size);


        const desiredHeight =
            3.4;


        if (
            size.y > 0
        ) {

            const scale =
                desiredHeight /
                size.y;

            playerModel.scale.setScalar(
                scale
            );

        }


        applyStandingPose();


        playerReady = true;


        setLoading(
            "Aetheria Academy ready..."
        );


        setTimeout(
            hideLoading,
            500
        );

    },

    function(xhr) {

        if (
            xhr.total
        ) {

            const percent =
                Math.round(
                    xhr.loaded /
                    xhr.total *
                    100
                );

            setLoading(
                `Loading character ${percent}%`
            );

        }

    },

    function(error) {

        console.error(
            "Player loading error:",
            error
        );

        createFallbackPlayer();

        setLoading(
            "Aetheria Academy ready..."
        );

        setTimeout(
            hideLoading,
            500
        );

    }

);


/* =========================================================
   FALLBACK PLAYER
   ========================================================= */

function createFallbackPlayer() {

    playerModel =
        new THREE.Group();


    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.55,
                1.5,
                8,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x241d36
            })
        );

    body.position.y =
        1.25;

    body.castShadow = true;

    playerModel.add(body);


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.45,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0xc99070
            })
        );

    head.position.y =
        2.6;

    head.castShadow = true;

    playerModel.add(head);


    player.add(
        playerModel
    );

    playerReady = true;
}


/* =========================================================
   BONE HELPERS
   ========================================================= */

function setBoneOffset(
    name,
    x,
    y,
    z
) {

    const bone =
        playerBones[name];

    if (!bone) return;

    bone.rotation.x += x;
    bone.rotation.y += y;
    bone.rotation.z += z;
}


/* =========================================================
   STANDING POSE
   ========================================================= */

function applyStandingPose() {

    if (!playerModel) return;


    if (
        playerBones["LeftArm"]
    ) {

        playerBones[
            "LeftArm"
        ].rotation.x =
            Math.PI / 2;

    }


    if (
        playerBones["RightArm"]
    ) {

        playerBones[
            "RightArm"
        ].rotation.x =
            Math.PI / 2;

    }


    if (
        playerBones["LeftForeArm"]
    ) {

        playerBones[
            "LeftForeArm"
        ].rotation.x =
            0;

    }


    if (
        playerBones["RightForeArm"]
    ) {

        playerBones[
            "RightForeArm"
        ].rotation.x =
            0;

    }


    if (
        playerBones["LeftShoulder"]
    ) {

        playerBones[
            "LeftShoulder"
        ].rotation.z =
            -0.12;

    }


    if (
        playerBones["RightShoulder"]
    ) {

        playerBones[
            "RightShoulder"
        ].rotation.z =
            0.12;

    }

}


/* =========================================================
   MOVEMENT
   ========================================================= */

let moveX = 0;
let moveY = 0;

let isMoving = false;

let isRunning = false;

const moveSpeed = 8;

const runSpeed = 13;

const lastMoveDirection =
    new THREE.Vector3(
        0,
        0,
        -1
    );


let cameraYaw = 0;

let cameraPitch = 0.28;

let cameraDistance = 8;


/* =========================================================
   KEYBOARD
   ========================================================= */

const keys = {};


window.addEventListener(
    "keydown",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = true;


        if (
            event.key === " "
        ) {

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
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =========================================================
   UPDATE MOVEMENT
   ========================================================= */

function updateMovement(
    delta
) {

    let inputX =
        moveX;

    let inputY =
        moveY;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        inputY -= 1;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        inputY += 1;

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        inputX -= 1;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        inputX += 1;

    }


    const length =
        Math.sqrt(
            inputX * inputX +
            inputY * inputY
        );


    isMoving =
        length > 0.05;


    if (!isMoving) {

        return;

    }


    inputX /= length;
    inputY /= length;


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
        new THREE.Vector3(0,1,0),
        cameraYaw
    );

    right.applyAxisAngle(
        new THREE.Vector3(0,1,0),
        cameraYaw
    );


    const direction =
        new THREE.Vector3();


    direction
        .add(
            forward.multiplyScalar(
                -inputY
            )
        )
        .add(
            right.multiplyScalar(
                inputX
            )
        );


    direction.normalize();


    lastMoveDirection.copy(
        direction
    );


    isRunning =
        keys["shift"] ||
        Math.abs(moveX) +
        Math.abs(moveY) > 1.5;


    const speed =
        isRunning
            ? runSpeed
            : moveSpeed;


    player.position.add(
        direction
            .clone()
            .multiplyScalar(
                speed * delta
            )
    );


    /* Player rotation */

    const targetRotation =
        Math.atan2(
            direction.x,
            direction.z
        );


    player.rotation.y =
        THREE.MathUtils.lerp(
            player.rotation.y,
            targetRotation,
            0.18
        );


    /* World boundaries */

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -135,
            135
        );

    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -130,
            130
        );


    checkTreeCollision();

}


/* =========================================================
   TREE COLLISION
   ========================================================= */

function checkTreeCollision() {

    for (
        const tree of collisionObjects
    ) {

        const dx =
            player.position.x -
            tree.x;

        const dz =
            player.position.z -
            tree.z;

        const distance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );


        const minimum =
            tree.radius;


        if (
            distance < minimum
        ) {

            const angle =
                Math.atan2(
                    dz,
                    dx
                );


            player.position.x =
                tree.x +
                Math.cos(angle) *
                minimum;

            player.position.z =
                tree.z +
                Math.sin(angle) *
                minimum;

        }

    }

}


/* =========================================================
   JUMP
   ========================================================= */

let isJumping = false;

let verticalVelocity = 0;

const gravity = 24;

const jumpPower = 10;


function jump() {

    if (
        isJumping
    ) return;

    isJumping = true;

    verticalVelocity =
        jumpPower;

}


/* =========================================================
   JUMP UPDATE
   ========================================================= */

function updateJump(
    delta
) {

    if (
        !isJumping
    ) return;


    player.position.y +=
        verticalVelocity *
        delta;


    verticalVelocity -=
        gravity *
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
   IDLE ANIMATION
   ========================================================= */

function applyIdleAnimation(
    time
) {

    if (!playerModel) return;


    const breathing =
        Math.sin(time * 2.2) *
        0.015;


    playerModel.position.y =
        breathing;


    applyStandingPose();

}


/* =========================================================
   WALKING ANIMATION
   ========================================================= */

function applyWalkingAnimation(
    time
) {

    if (!playerModel) return;


    const speed =
        isRunning
            ? 9
            : 6;


    const swing =
        Math.sin(
            time * speed
        ) *
        0.35;


    const leftLeg =
        playerBones["LeftLeg"];

    const rightLeg =
        playerBones["RightLeg"];

    const leftArm =
        playerBones["LeftArm"];

    const rightArm =
        playerBones["RightArm"];


    if (leftLeg) {

        leftLeg.rotation.x =
            swing;

    }


    if (rightLeg) {

        rightLeg.rotation.x =
            -swing;

    }


    if (leftArm) {

        leftArm.rotation.x =
            Math.PI / 2 -
            swing * 0.5;

    }


    if (rightArm) {

        rightArm.rotation.x =
            Math.PI / 2 +
            swing * 0.5;

    }


    playerModel.position.y =
        Math.abs(
            Math.sin(
                time * speed
            )
        ) * 0.025;

}


/* =========================================================
   JUMP ANIMATION
   ========================================================= */

function applyJumpAnimation() {

    if (!playerModel) return;


    const leftArm =
        playerBones["LeftArm"];

    const rightArm =
        playerBones["RightArm"];


    if (leftArm) {

        leftArm.rotation.x =
            Math.PI / 2 -
            0.5;

    }


    if (rightArm) {

        rightArm.rotation.x =
            Math.PI / 2 -
            0.5;

    }


    const leftLeg =
        playerBones["LeftLeg"];

    const rightLeg =
        playerBones["RightLeg"];


    if (leftLeg) {

        leftLeg.rotation.x =
            -0.25;

    }


    if (rightLeg) {

        rightLeg.rotation.x =
            0.25;

    }

}


/* =========================================================
   SPELL SYSTEM
   ========================================================= */

let casting = false;

let castCooldown = 0;


/* =========================================================
   CAST SPELL
   ========================================================= */

function castSpell() {

    if (
        castCooldown > 0 ||
        casting
    ) return;


    casting = true;

    castCooldown =
        0.7;


    createSpellProjectile();


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

function createSpellProjectile() {

    const group =
        new THREE.Group();


    const core =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.25,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x8be9ff,
                emissive: 0x1bbce8,
                emissiveIntensity: 3
            })
        );


    group.add(core);


    const glow =
        new THREE.PointLight(
            0x43d9ff,
            5,
            12
        );


    group.add(glow);


    const direction =
        lastMoveDirection
            .clone()
            .normalize();


    const position =
        player.position.clone();


    position.y += 1.7;


    position.add(
        direction
            .clone()
            .multiplyScalar(
                1.5
            )
    );


    group.position.copy(
        position
    );


    group.userData.velocity =
        direction
            .clone()
            .multiplyScalar(
                18
            );


    group.userData.life =
        2;


    effects.add(group);

}


/* =========================================================
   SPELL UPDATE
   ========================================================= */

function updateSpells(
    delta
) {

    for (
        let i =
            effects.children.length -
            1;

        i >= 0;

        i--
    ) {

        const object =
            effects.children[i];


        if (
            !object.userData.velocity
        ) {

            continue;

        }


        object.position.add(
            object.userData.velocity
                .clone()
                .multiplyScalar(
                    delta
                )
        );


        object.userData.life -=
            delta;


        if (
            object.userData.life <= 0
        ) {

            effects.remove(
                object
            );

        }

    }

}


/* =========================================================
   CAST ANIMATION
   ========================================================= */

function applyCastingAnimation(
    time
) {

    if (!playerModel) return;


    const rightArm =
        playerBones["RightArm"];


    const leftArm =
        playerBones["LeftArm"];


    if (rightArm) {

        rightArm.rotation.x =
            Math.PI / 2 -
            0.7;

        rightArm.rotation.z =
            -0.15;

    }


    if (leftArm) {

        leftArm.rotation.x =
            Math.PI / 2 +
            0.1;

    }


    if (rightArm) {

        rightArm.rotation.z +=
            Math.sin(
                time * 15
            ) *
            0.02;

    }

}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera(
    delta
) {

    if (!player) return;


    const target =
        player.position.clone();

    target.y += 1.5;


    const horizontalDistance =
        cameraDistance *
        Math.cos(
            cameraPitch
        );


    const verticalDistance =
        cameraDistance *
        Math.sin(
            cameraPitch
        );


    const offset =
        new THREE.Vector3(
            Math.sin(cameraYaw) *
            horizontalDistance,

            verticalDistance,

            Math.cos(cameraYaw) *
            horizontalDistance
        );


    const desiredPosition =
        target.clone()
            .add(offset);


    camera.position.lerp(
        desiredPosition,
        1 -
        Math.pow(
            0.001,
            delta
        )
    );


    camera.lookAt(
        target
    );

}


/* =========================================================
   CAMERA TOUCH DRAG
   ========================================================= */

let draggingCamera = false;

let previousPointerX = 0;

let previousPointerY = 0;


renderer.domElement.addEventListener(
    "pointerdown",
    function(event) {

        if (
            event.target !==
            renderer.domElement
        ) {
            return;
        }


        draggingCamera = true;

        previousPointerX =
            event.clientX;

        previousPointerY =
            event.clientY;

    }
);


window.addEventListener(
    "pointermove",
    function(event) {

        if (
            !draggingCamera
        ) return;


        const dx =
            event.clientX -
            previousPointerX;

        const dy =
            event.clientY -
            previousPointerY;


        previousPointerX =
            event.clientX;

        previousPointerY =
            event.clientY;


        cameraYaw -=
            dx * 0.006;


        cameraPitch -=
            dy * 0.004;


        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -0.1,
                0.8
            );

    }
);


window.addEventListener(
    "pointerup",
    function() {

        draggingCamera = false;

    }
);


/* =========================================================
   MOBILE JOYSTICK
   ========================================================= */

const joystick =
    document.getElementById(
        "joystick"
    );

const joystickKnob =
    document.getElementById(
        "joystickKnob"
    );


if (
    joystick &&
    joystickKnob
) {

    let joystickActive =
        false;


    function handleJoystick(
        event
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
            event.clientX -
            centerX;


        let dy =
            event.clientY -
            centerY;


        const maxDistance =
            rect.width * 0.34;


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
                dx / distance *
                maxDistance;

            dy =
                dy / distance *
                maxDistance;

        }


        joystickKnob.style.transform =
            `translate(${dx}px, ${dy}px)`;


        moveX =
            dx / maxDistance;


        moveY =
            dy / maxDistance;

    }


    joystick.addEventListener(
        "pointerdown",
        function(event) {

            joystickActive = true;

            joystick.setPointerCapture(
                event.pointerId
            );

            handleJoystick(
                event
            );

        }
    );


    joystick.addEventListener(
        "pointermove",
        function(event) {

            if (
                joystickActive
            ) {

                handleJoystick(
                    event
                );

            }

        }
    );


    joystick.addEventListener(
        "pointerup",
        function() {

            joystickActive = false;

            moveX = 0;
            moveY = 0;

            joystickKnob.style.transform =
                "translate(0px, 0px)";

        }
    );

}


/* =========================================================
   ACTION BUTTONS
   ========================================================= */

const jumpButton =
    document.getElementById(
        "jumpButton"
    );


if (jumpButton) {

    jumpButton.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            jump();

        }
    );

}


const castButton =
    document.getElementById(
        "castButton"
    );


if (castButton) {

    castButton.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            castSpell();

        }
    );

}


/* =========================================================
   QUEST SYSTEM
   ========================================================= */

let questState =
    "TALK_TO_AELION";


let xp =
    0;


/* =========================================================
   NPC
   ========================================================= */

const npc =
    new THREE.Group();

npc.position.set(
    8,
    0,
    10
);

scene.add(npc);


/* NPC body */

const npcBody =
    new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.55,
            1.6,
            8,
            12
        ),
        new THREE.MeshStandardMaterial({
            color: 0x30284c
        })
    );

npcBody.position.y =
    1.3;

npcBody.castShadow = true;

npc.add(npcBody);


/* NPC head */

const npcHead =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.45,
            16,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xc79574
        })
    );

npcHead.position.y =
    2.7;

npcHead.castShadow = true;

npc.add(npcHead);


/* NPC magical crystal */

const npcCrystal =
    new THREE.Mesh(
        new THREE.OctahedronGeometry(
            0.22
        ),
        new THREE.MeshStandardMaterial({
            color: 0x70eaff,
            emissive: 0x35cfff,
            emissiveIntensity: 2
        })
    );

npcCrystal.position.set(
    0,
    3.25,
    0
);

npc.add(npcCrystal);


const npcLight =
    new THREE.PointLight(
        0x48dfff,
        1.5,
        8
    );

npcLight.position.y =
    3;

npc.add(npcLight);


/* =========================================================
   QUEST UI
   ========================================================= */

const questText =
    document.getElementById(
        "questText"
    );

const xpText =
    document.getElementById(
        "xpText"
    );


function updateQuestUI() {

    if (!questText) return;


    if (
        questState ===
        "TALK_TO_AELION"
    ) {

        questText.textContent =
            "Quest: Talk to Professor Aelion";

    }


    if (
        questState ===
        "FIND_ANCIENT_MARKER"
    ) {

        questText.textContent =
            "Quest: Find the Ancient Marker";

    }


    if (
        questState ===
        "COMPLETED"
    ) {

        questText.textContent =
            "Quest Complete: Ancient Marker";

    }


    if (xpText) {

        xpText.textContent =
            `XP: ${xp}`;

    }

}


updateQuestUI();


/* =========================================================
   DIALOGUE
   ========================================================= */

const dialogue =
    document.getElementById(
        "dialogue"
    );


const dialogueText =
    document.getElementById(
        "dialogueText"
    );


const talkButton =
    document.getElementById(
        "talkButton"
    );


function showDialogue(
    text
) {

    if (!dialogue) return;


    dialogue.style.display =
        "block";


    if (dialogueText) {

        dialogueText.textContent =
            text;

    }

}


function hideDialogue() {

    if (!dialogue) return;

    dialogue.style.display =
        "none";

}


/* =========================================================
   TALK TO NPC
   ========================================================= */

function talkToNPC() {

    const distance =
        player.position.distanceTo(
            npc.position
        );


    if (
        distance > 6
    ) {

        showDialogue(
            "Professor Aelion is nearby. Move closer."
        );

        setTimeout(
            hideDialogue,
            2200
        );

        return;

    }


    if (
        questState ===
        "TALK_TO_AELION"
    ) {

        questState =
            "FIND_ANCIENT_MARKER";


        xp += 50;


        showDialogue(
            "Aelion: An ancient magical marker lies somewhere in the academy grounds. Find it."
        );


        updateQuestUI();

        return;

    }


    if (
        questState ===
        "FIND_ANCIENT_MARKER"
    ) {

        showDialogue(
            "Aelion: Explore the courtyard. The old marker is waiting to be discovered."
        );

        return;

    }


    showDialogue(
        "Aelion: The academy remembers every student who walks these grounds."
    );

}


/* =========================================================
   TALK BUTTON
   ========================================================= */

if (talkButton) {

    talkButton.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            talkToNPC();

        }
    );

}


/* =========================================================
   ANCIENT MARKER
   ========================================================= */

const marker =
    new THREE.Group();

marker.position.set(
    -25,
    0,
    -5
);

scene.add(marker);


/* marker stone */

const markerStone =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.2,
            3.5,
            0.8
        ),
        stoneDarkMaterial
    );

markerStone.position.y =
    1.75;

markerStone.rotation.z =
    -0.08;

markerStone.castShadow = true;

marker.add(markerStone);


/* magical symbol */

const markerCrystal =
    new THREE.Mesh(
        new THREE.OctahedronGeometry(
            0.45
        ),
        new THREE.MeshStandardMaterial({
            color: 0x9e78ff,
            emissive: 0x5b27d8,
            emissiveIntensity: 2
        })
    );

markerCrystal.position.y =
    2.4;

marker.add(markerCrystal);


const markerLight =
    new THREE.PointLight(
        0x855dff,
        2,
        12
    );

markerLight.position.y =
    2.5;

marker.add(markerLight);


/* =========================================================
   MARKER QUEST CHECK
   ========================================================= */

function updateQuestMarker() {

    if (
        questState !==
        "FIND_ANCIENT_MARKER"
    ) return;


    const distance =
        player.position.distanceTo(
            marker.position
        );


    if (
        distance < 5
    ) {

        questState =
            "COMPLETED";


        xp += 150;


        showDialogue(
            "You discovered the Ancient Marker! Aetheria's magic awakens around you."
        );


        updateQuestUI();

    }

}


/* =========================================================
   MARKER ANIMATION
   ========================================================= */

function animateMarker(
    time
) {

    markerCrystal.rotation.y =
        time * 1.5;


    markerCrystal.position.y =
        2.4 +
        Math.sin(
            time * 3
        ) *
        0.15;

}


/* =========================================================
   TORCH ANIMATION
   ========================================================= */

function animateTorches(
    time
) {

    for (
        const torch of torches
    ) {

        torch.fire.scale.x =
            0.9 +
            Math.sin(
                time * 14
            ) *
            0.1;


        torch.fire.scale.y =
            1.5 +
            Math.sin(
                time * 17
            ) *
            0.15;


        torch.flame.rotation.z =
            Math.sin(
                time * 13
            ) *
            0.12;


        torch.light.intensity =
            2.1 +
            Math.sin(
                time * 12
            ) *
            0.5;

    }

}


/* =========================================================
   NPC ANIMATION
   ========================================================= */

function animateNPC(
    time
) {

    npc.position.y =
        Math.sin(
            time * 2
        ) *
        0.025;


    npcCrystal.rotation.y =
        time * 1.8;


    npcCrystal.position.y =
        3.25 +
        Math.sin(
            time * 3
        ) *
        0.12;

}


/* =========================================================
   DAY/NIGHT LIGHT
   ========================================================= */

let worldTime = 0;


/* Keep it mostly daytime for now */

function updateSky(
    delta
) {

    worldTime +=
        delta * 0.015;


    const cycle =
        Math.sin(
            worldTime
        );


    sun.intensity =
        THREE.MathUtils.lerp(
            1.5,
            3,
            (cycle + 1) / 2
        );

}


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    function() {

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

function checkOrientation() {

    const portrait =
        window.innerHeight >
        window.innerWidth;


    const overlay =
        document.getElementById(
            "portraitOverlay"
        );


    if (!overlay) return;


    overlay.style.display =
        portrait
            ? "flex"
            : "none";

}


window.addEventListener(
    "resize",
    checkOrientation
);

checkOrientation();


/* =========================================================
   FULLSCREEN
   ========================================================= */

document.addEventListener(
    "dblclick",
    function() {

        if (
            !document.fullscreenElement
        ) {

            document.documentElement
                .requestFullscreen()
                .catch(() => {});

        }

    }
);


/* =========================================================
   CLOCK
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
        performance.now() /
        1000;


    if (
        castCooldown > 0
    ) {

        castCooldown -=
            delta;

    }


    updateMovement(
        delta
    );


    updateJump(
        delta
    );


    updateSpells(
        delta
    );


    updateCamera(
        delta
    );


    updateQuestMarker();


    updateSky(
        delta
    );


    animateMarker(
        elapsed
    );


    animateTorches(
        elapsed
    );


    animateNPC(
        elapsed
    );


    if (
        isJumping
    ) {

        applyJumpAnimation();

    }
    else if (
        casting
    ) {

        applyCastingAnimation(
            elapsed
        );

    }
    else if (
        isMoving
    ) {

        applyWalkingAnimation(
            elapsed
        );

    }
    else {

        applyIdleAnimation(
            elapsed
        );

    }


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================================
   INITIAL CAMERA
   ========================================================= */

camera.position.set(
    0,
    5,
    58
);

camera.lookAt(
    0,
    1.5,
    50
);


/* =========================================================
   READY
   ========================================================= */

console.log(
    "Aetheria Academy loaded."
);

console.log(
    "Environment upgrade active."
);

console.log(
    "Player:",
    player
);
