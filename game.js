/* =========================================================
   AETHERIA ACADEMY
   VERSION 3 — WAND + VISIBLE MAGIC + BETTER WORLD
   ========================================================= */

import * as THREE from "three";

import {
    GLTFLoader
} from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

import {
    DRACOLoader
} from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js";


/* =========================================================
   SCENE
   ========================================================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x83b6d2);

scene.fog =
    new THREE.Fog(
        0x83b6d2,
        90,
        280
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
        500
    );


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        1.75
    )
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

document.body.appendChild(
    renderer.domElement
);


/* =========================================================
   LOADING
   ========================================================= */

const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );

const loadingText =
    document.getElementById(
        "loadingText"
    );

const loadingProgress =
    document.getElementById(
        "loadingProgress"
    );


function setLoading(text) {

    if (loadingText) {
        loadingText.textContent =
            text;
    }

}


function setProgress(value) {

    if (loadingProgress) {

        loadingProgress.style.width =
            `${value}%`;

    }

}


function hideLoading() {

    if (!loadingScreen) return;

    loadingScreen.classList.add(
        "hidden"
    );

    setTimeout(() => {

        loadingScreen.style.display =
            "none";

    }, 800);

}


/* =========================================================
   LIGHTING
   ========================================================= */

const hemisphere =
    new THREE.HemisphereLight(
        0xc7edff,
        0x33452d,
        1.8
    );

scene.add(
    hemisphere
);


const sun =
    new THREE.DirectionalLight(
        0xfff2d1,
        3
    );

sun.position.set(
    60,
    110,
    50
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

sun.shadow.camera.near =
    1;

sun.shadow.camera.far =
    350;

scene.add(
    sun
);


/* =========================================================
   WORLD
   ========================================================= */

const world =
    new THREE.Group();

scene.add(
    world
);


const environment =
    new THREE.Group();

world.add(
    environment
);


const decorations =
    new THREE.Group();

world.add(
    decorations
);


const magicEffects =
    new THREE.Group();

scene.add(
    magicEffects
);


/* =========================================================
   MATERIALS
   ========================================================= */

const grassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3f7439,
        roughness: 1
    });


const grassLight =
    new THREE.MeshStandardMaterial({
        color: 0x679451,
        roughness: 1
    });


const dirtMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x705538,
        roughness: 1
    });


const stoneMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x777a78,
        roughness: 0.95
    });


const darkStoneMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x414642,
        roughness: 1
    });


const woodMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x452814,
        roughness: 0.9
    });


const leafMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x24572c,
        roughness: 1
    });


const leafLight =
    new THREE.MeshStandardMaterial({
        color: 0x478043,
        roughness: 1
    });


/* =========================================================
   GROUND
   ========================================================= */

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            300,
            300,
            80,
            80
        ),
        grassMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

environment.add(
    ground
);


/* =========================================================
   GROUND TEXTURE
   ========================================================= */

const textureLoader =
    new THREE.TextureLoader();


textureLoader.load(
    "assets/ground/diffuse.jpg",
    function(texture) {

        texture.wrapS =
            THREE.RepeatWrapping;

        texture.wrapT =
            THREE.RepeatWrapping;

        texture.repeat.set(
            35,
            35
        );

        texture.colorSpace =
            THREE.SRGBColorSpace;

        ground.material =
            new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 1
            });

    },
    undefined,
    function() {

        console.log(
            "Ground texture unavailable; using procedural grass."
        );

    }
);


/* =========================================================
   GRASS PATCH
   ========================================================= */

function createGrassPatch(
    x,
    z,
    radius = 4,
    count = 25
) {

    const group =
        new THREE.Group();

    group.position.set(
        x,
        0,
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
                        0.2,
                        0.55
                    ),
                    3
                ),
                i % 2
                    ? grassMaterial
                    : grassLight
            );


        const angle =
            Math.random() *
            Math.PI * 2;


        const distance =
            Math.sqrt(
                Math.random()
            ) * radius;


        blade.position.set(
            Math.cos(angle) *
            distance,

            0.25,

            Math.sin(angle) *
            distance
        );


        blade.rotation.y =
            Math.random() *
            Math.PI;


        blade.rotation.z =
            THREE.MathUtils.randFloat(
                -0.25,
                0.25
            );


        blade.castShadow = true;

        group.add(
            blade
        );

    }


    decorations.add(
        group
    );

}


for (
    let i = 0;
    i < 80;
    i++
) {

    createGrassPatch(
        THREE.MathUtils.randFloat(
            -120,
            120
        ),
        THREE.MathUtils.randFloat(
            -120,
            120
        ),
        THREE.MathUtils.randFloat(
            2,
            5
        ),
        THREE.MathUtils.randInt(
            15,
            30
        )
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

    const path =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                0.12,
                length
            ),
            dirtMaterial
        );

    path.position.set(
        x,
        0.05,
        z
    );

    path.receiveShadow = true;

    environment.add(
        path
    );

}


createPath(
    12,
    170,
    0,
    -35
);


createPath(
    150,
    10,
    0,
    20
);


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

environment.add(
    courtyard
);


/* =========================================================
   FOUNTAIN
   ========================================================= */

function createFountain() {

    const fountain =
        new THREE.Group();

    fountain.position.set(
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

    fountain.add(
        base
    );


    const water =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                6.7,
                6.7,
                0.1,
                48
            ),
            new THREE.MeshStandardMaterial({
                color: 0x48aaca,
                roughness: 0.08,
                metalness: 0.2,
                transparent: true,
                opacity: 0.82
            })
        );

    water.position.y =
        0.42;

    fountain.add(
        water
    );


    const pillar =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.1,
                1.5,
                4,
                24
            ),
            stoneMaterial
        );

    pillar.position.y =
        2.2;

    pillar.castShadow = true;

    fountain.add(
        pillar
    );


    const bowl =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                4,
                2.5,
                0.65,
                32
            ),
            stoneMaterial
        );

    bowl.position.y =
        4.25;

    fountain.add(
        bowl
    );


    const crystal =
        new THREE.Mesh(
            new THREE.OctahedronGeometry(
                1.1,
                1
            ),
            new THREE.MeshStandardMaterial({
                color: 0x80eaff,
                emissive: 0x248cae,
                emissiveIntensity: 2
            })
        );

    crystal.position.y =
        5.5;

    fountain.add(
        crystal
    );


    const light =
        new THREE.PointLight(
            0x56dfff,
            2.2,
            20
        );

    light.position.y =
        5;

    fountain.add(
        light
    );


    decorations.add(
        fountain
    );

}


createFountain();


/* =========================================================
   TREE
   ========================================================= */

function createProceduralTree(
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


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.5,
                0.8,
                6,
                10
            ),
            woodMaterial
        );

    trunk.position.y =
        3;

    trunk.castShadow = true;

    tree.add(
        trunk
    );


    const crown1 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                3.1,
                14,
                10
            ),
            leafMaterial
        );

    crown1.position.y =
        6.3;

    crown1.castShadow = true;

    tree.add(
        crown1
    );


    const crown2 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.3,
                14,
                10
            ),
            leafLight
        );

    crown2.position.set(
        1.7,
        7,
        0
    );

    crown2.castShadow = true;

    tree.add(
        crown2
    );


    const crown3 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.2,
                14,
                10
            ),
            leafMaterial
        );

    crown3.position.set(
        -1.6,
        6.7,
        0.3
    );

    crown3.castShadow = true;

    tree.add(
        crown3
    );


    decorations.add(
        tree
    );

    return tree;

}


/* =========================================================
   REAL TREE GLB
   ========================================================= */

let realTreeTemplate =
    null;


const treeLoader =
    new GLTFLoader();


const treeDraco =
    new DRACOLoader();

treeDraco.setDecoderPath(
    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/"
);

treeLoader.setDRACOLoader(
    treeDraco
);


treeLoader.load(
    "assets/tree.glb",

    function(gltf) {

        realTreeTemplate =
            gltf.scene;

        realTreeTemplate.traverse(
            object => {

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


        console.log(
            "Real tree asset loaded."
        );

    },

    undefined,

    function() {

        console.log(
            "tree.glb unavailable; procedural trees used."
        );

    }
);


/* =========================================================
   TREE POSITIONS
   ========================================================= */

const treePositions = [

    [-45, -45],
    [45, -45],

    [-50, -15],
    [50, -15],

    [-55, 25],
    [55, 25],

    [-45, 55],
    [45, 55],

    [-78, -55],
    [78, -55],

    [-90, 10],
    [90, 10],

    [-75, 70],
    [75, 70],

    [-100, 55],
    [100, 55],

    [-20, 85],
    [20, 85]

];


for (
    const position of treePositions
) {

    createProceduralTree(
        position[0],
        position[1],
        THREE.MathUtils.randFloat(
            0.9,
            1.25
        )
    );

}


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
                1,
                1
            ),
            Math.random() > 0.5
                ? stoneMaterial
                : darkStoneMaterial
        );

    rock.position.set(
        x,
        scale * 0.45,
        z
    );

    rock.scale.set(
        scale,
        scale *
        THREE.MathUtils.randFloat(
            0.55,
            0.9
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

    decorations.add(
        rock
    );

}


for (
    let i = 0;
    i < 35;
    i++
) {

    createRock(
        THREE.MathUtils.randFloat(
            -110,
            110
        ),
        THREE.MathUtils.randFloat(
            -105,
            100
        ),
        THREE.MathUtils.randFloat(
            0.4,
            1.4
        )
    );

}


/* =========================================================
   BUSHES
   ========================================================= */

function createBush(
    x,
    z,
    scale
) {

    const bushGroup =
        new THREE.Group();

    bushGroup.position.set(
        x,
        0,
        z
    );

    bushGroup.scale.setScalar(
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
                    12,
                    8
                ),
                leafLight
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

        bushGroup.add(
            bush
        );

    }


    decorations.add(
        bushGroup
    );

}


for (
    let i = 0;
    i < 35;
    i++
) {

    createBush(
        THREE.MathUtils.randFloat(
            -95,
            95
        ),
        THREE.MathUtils.randFloat(
            -80,
            85
        ),
        THREE.MathUtils.randFloat(
            0.7,
            1.25
        )
    );

}


/* =========================================================
   CASTLE
   ========================================================= */

function createAcademy() {

    const castle =
        new THREE.Group();

    castle.position.set(
        0,
        0,
        -75
    );


    const wall =
        new THREE.MeshStandardMaterial({
            color: 0x646967,
            roughness: 0.95
        });


    const roof =
        new THREE.MeshStandardMaterial({
            color: 0x252a32,
            roughness: 0.85
        });


    const main =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                58,
                24,
                22
            ),
            wall
        );

    main.position.y =
        12;

    main.castShadow = true;
    main.receiveShadow = true;

    castle.add(
        main
    );


    /* Central tower */

    const tower =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                8,
                9,
                38,
                10
            ),
            wall
        );

    tower.position.set(
        0,
        19,
        0
    );

    tower.castShadow = true;

    castle.add(
        tower
    );


    const towerRoof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                10,
                10,
                10
            ),
            roof
        );

    towerRoof.position.y =
        43;

    towerRoof.castShadow = true;

    castle.add(
        towerRoof
    );


    /* Side towers */

    for (
        const x of [-25, 25]
    ) {

        const sideTower =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    5,
                    6,
                    30,
                    10
                ),
                wall
            );

        sideTower.position.set(
            x,
            15,
            0
        );

        sideTower.castShadow = true;

        castle.add(
            sideTower
        );


        const sideRoof =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    7,
                    8,
                    10
                ),
                roof
            );

        sideRoof.position.set(
            x,
            34,
            0
        );

        castle.add(
            sideRoof
        );

    }


    /* Entrance */

    const doorway =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                8,
                11,
                0.5
            ),
            new THREE.MeshStandardMaterial({
                color: 0x07111b,
                emissive: 0x14384d,
                emissiveIntensity: 1.2
            })
        );

    doorway.position.set(
        0,
        5.5,
        11.5
    );

    castle.add(
        doorway
    );


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
                    0.25
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x94dff0,
                    emissive: 0x247a91,
                    emissiveIntensity: 0.7
                })
            );

        window.position.set(
            x,
            11,
            11.2
        );

        castle.add(
            window
        );

    }


    environment.add(
        castle
    );

}


createAcademy();


/* =========================================================
   TORCH
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


    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.12,
                0.16,
                2.8,
                8
            ),
            woodMaterial
        );

    pole.position.y =
        1.4;

    pole.castShadow = true;

    group.add(
        pole
    );


    const orange =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.43,
                12,
                12
            ),
            new THREE.MeshBasicMaterial({
                color: 0xff791b
            })
        );

    orange.position.y =
        3;

    orange.scale.y =
        1.5;

    group.add(
        orange
    );


    const yellow =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.28,
                1.1,
                10
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffdf65
            })
        );

    yellow.position.y =
        3.45;

    group.add(
        yellow
    );


    const light =
        new THREE.PointLight(
            0xff852d,
            3,
            15
        );

    light.position.y =
        3;

    group.add(
        light
    );


    magicEffects.add(
        group
    );


    return {
        group,
        orange,
        yellow,
        light
    };

}


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

const player =
    new THREE.Group();

player.position.set(
    0,
    0,
    50
);

scene.add(
    player
);


let playerModel =
    null;

let playerBones = {};

let playerReady =
    false;

let wand =
    null;


/* =========================================================
   LOAD AREN
   ========================================================= */

const playerLoader =
    new GLTFLoader();


const playerDraco =
    new DRACOLoader();

playerDraco.setDecoderPath(
    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/"
);

playerLoader.setDRACOLoader(
    playerDraco
);


setLoading(
    "Entering Aetheria Academy..."
);

setProgress(
    5
);


playerLoader.load(

    "assets/player/aren_valen.glb",

    function(gltf) {

        playerModel =
            gltf.scene;

        player.add(
            playerModel
        );


        playerModel.traverse(
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
                    ] = object;

                }

            }
        );


        /* Scale */

        const box =
            new THREE.Box3()
                .setFromObject(
                    playerModel
                );

        const size =
            new THREE.Vector3();

        box.getSize(
            size
        );


        if (
            size.y > 0
        ) {

            const scale =
                3.4 /
                size.y;

            playerModel.scale.setScalar(
                scale
            );

        }


        applyStandingPose();


        /* WAND */

        createWand();


        playerReady =
            true;


        setProgress(
            100
        );

        setLoading(
            "Aetheria Academy ready!"
        );


        setTimeout(
            hideLoading,
            400
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

            setProgress(
                Math.max(
                    10,
                    percent
                )
            );

            setLoading(
                `Loading Aren ${percent}%`
            );

        }

    },

    function(error) {

        console.error(
            "Aren loading failed:",
            error
        );


        createFallbackPlayer();


        setProgress(
            100
        );


        setLoading(
            "Academy ready"
        );


        setTimeout(
            hideLoading,
            400
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
                color: 0x241b39
            })
        );

    body.position.y =
        1.3;

    body.castShadow = true;

    playerModel.add(
        body
    );


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
        2.65;

    head.castShadow = true;

    playerModel.add(
        head
    );


    player.add(
        playerModel
    );


    createFallbackWand();


    playerReady =
        true;

}


/* =========================================================
   WAND
   ========================================================= */

function createWand() {

    const hand =
        playerBones[
            "RightHand"
        ];


    if (!hand) {

        console.warn(
            "RightHand bone not found."
        );

        createFallbackWand();

        return;

    }


    wand =
        new THREE.Group();


    /* Wooden handle */

    const handle =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.045,
                0.07,
                0.75,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x5a3219,
                roughness: 0.7
            })
        );


    handle.position.y =
        -0.2;


    wand.add(
        handle
    );


    /* Metal/magical section */

    const shaft =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.025,
                0.045,
                0.5,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x8b7b62,
                metalness: 0.5,
                roughness: 0.4
            })
        );


    shaft.position.y =
        0.42;


    wand.add(
        shaft
    );


    /* Magical tip */

    const tip =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.09,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x9ff5ff,
                emissive: 0x31dfff,
                emissiveIntensity: 4
            })
        );


    tip.position.y =
        0.69;


    wand.add(
        tip
    );


    /* Tip glow */

    const glow =
        new THREE.PointLight(
            0x49ddff,
            2.2,
            5
        );


    glow.position.y =
        0.7;


    wand.add(
        glow
    );


    /*
     * Attach to Aren's hand.
     */

    hand.add(
        wand
    );


    /*
     * These offsets make the wand visible
     * in front of the hand.
     */

    wand.position.set(
        0.02,
        -0.08,
        0.12
    );


    wand.rotation.set(
        0,
        0,
        -0.12
    );


    console.log(
        "Wand attached to RightHand."
    );

}


/* =========================================================
   FALLBACK WAND
   ========================================================= */

function createFallbackWand() {

    wand =
        new THREE.Group();


    const handle =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.05,
                0.08,
                0.8,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x573018
            })
        );

    handle.position.y =
        -0.3;

    wand.add(
        handle
    );


    const tip =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.12,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x9ffaff,
                emissive: 0x32dfff,
                emissiveIntensity: 4
            })
        );

    tip.position.y =
        0.25;

    wand.add(
        tip
    );


    player.add(
        wand
    );


    wand.position.set(
        0.7,
        1.9,
        0
    );

}


/* =========================================================
   STANDING POSE
   ========================================================= */

function applyStandingPose() {

    if (!playerModel) return;


    const leftArm =
        playerBones[
            "LeftArm"
        ];


    const rightArm =
        playerBones[
            "RightArm"
        ];


    if (leftArm) {

        leftArm.rotation.x =
            Math.PI / 2;

    }


    if (rightArm) {

        rightArm.rotation.x =
            Math.PI / 2;

    }


    const leftShoulder =
        playerBones[
            "LeftShoulder"
        ];


    const rightShoulder =
        playerBones[
            "RightShoulder"
        ];


    if (leftShoulder) {

        leftShoulder.rotation.z =
            -0.12;

    }


    if (rightShoulder) {

        rightShoulder.rotation.z =
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

let cameraYaw = 0;

let cameraPitch = 0.28;

let cameraDistance = 8;

const moveSpeed = 8;

const runSpeed = 13;

const lastMoveDirection =
    new THREE.Vector3(
        0,
        0,
        -1
    );


const keys = {};


window.addEventListener(
    "keydown",
    event => {

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
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =========================================================
   MOVEMENT UPDATE
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


    inputX /=
        length;

    inputY /=
        length;


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


    direction.add(
        forward.multiplyScalar(
            -inputY
        )
    );


    direction.add(
        right.multiplyScalar(
            inputX
        )
    );


    direction.normalize();


    lastMoveDirection.copy(
        direction
    );


    isRunning =
        keys["shift"];


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
        const tree of treePositions
    ) {

        const dx =
            player.position.x -
            tree[0];

        const dz =
            player.position.z -
            tree[1];

        const distance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );


        if (
            distance < 2.5
        ) {

            const angle =
                Math.atan2(
                    dz,
                    dx
                );


            player.position.x =
                tree[0] +
                Math.cos(angle) *
                2.5;


            player.position.z =
                tree[1] +
                Math.sin(angle) *
                2.5;

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


    isJumping =
        true;

    verticalVelocity =
        jumpPower;

}


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
   ANIMATIONS
   ========================================================= */

function applyIdleAnimation(
    time
) {

    if (!playerModel) return;


    playerModel.position.y =
        Math.sin(
            time * 2.2
        ) *
        0.015;


    applyStandingPose();

}


function applyWalkingAnimation(
    time
) {

    if (!playerModel) return;


    const swing =
        Math.sin(
            time *
            (
                isRunning
                    ? 9
                    : 6
            )
        ) *
        0.35;


    const leftLeg =
        playerBones[
            "LeftLeg"
        ];


    const rightLeg =
        playerBones[
            "RightLeg"
        ];


    const leftArm =
        playerBones[
            "LeftArm"
        ];


    const rightArm =
        playerBones[
            "RightArm"
        ];


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
                time *
                (
                    isRunning
                        ? 9
                        : 6
                )
            )
        ) * 0.025;

}


function applyJumpAnimation() {

    if (!playerModel) return;


    const leftArm =
        playerBones[
            "LeftArm"
        ];


    const rightArm =
        playerBones[
            "RightArm"
        ];


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

}


/* =========================================================
   MAGIC
   ========================================================= */

let casting =
    false;

let castCooldown =
    0;


/* =========================================================
   CAST
   ========================================================= */

function castSpell() {

    if (
        castCooldown > 0 ||
        casting
    ) {

        return;

    }


    casting =
        true;

    castCooldown =
        0.8;


    createSpell();


    setTimeout(
        () => {

            casting =
                false;

        },
        550
    );

}


/* =========================================================
   WAND TIP POSITION
   ========================================================= */

function getWandTipPosition() {

    const position =
        new THREE.Vector3();


    if (
        wand
    ) {

        wand.updateWorldMatrix(
            true,
            true
        );


        /*
         * Our wand tip is approximately
         * 0.7 local Y.
         */

        const tip =
            new THREE.Vector3(
                0,
                0.7,
                0
            );


        wand.localToWorld(
            tip
        );


        position.copy(
            tip
        );


        return position;

    }


    position.copy(
        player.position
    );


    position.y +=
        1.7;


    return position;

}


/* =========================================================
   SPELL CREATION
   ========================================================= */

function createSpell() {

    const spell =
        new THREE.Group();


    const core =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.32,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0xaef8ff,
                emissive: 0x28dfff,
                emissiveIntensity: 5
            })
        );


    spell.add(
        core
    );


    const inner =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.13,
                12,
                12
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );


    spell.add(
        inner
    );


    /* Outer glow */

    const glow =
        new THREE.PointLight(
            0x40dcff,
            6,
            18
        );


    spell.add(
        glow
    );


    /* =====================================================
       MAGICAL TRAIL
       ===================================================== */

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const particle =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    THREE.MathUtils.randFloat(
                        0.035,
                        0.09
                    ),
                    8,
                    8
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x8df3ff,
                    transparent: true,
                    opacity: 0.85
                })
            );


        particle.position.set(
            THREE.MathUtils.randFloat(
                -0.25,
                0.25
            ),
            THREE.MathUtils.randFloat(
                -0.25,
                0.25
            ),
            THREE.MathUtils.randFloat(
                -0.25,
                0.25
            )
        );


        spell.add(
            particle
        );

    }


    /* =====================================================
       DIRECTION
       ===================================================== */

    const direction =
        lastMoveDirection
            .clone()
            .normalize();


    /*
     * IMPORTANT:
     * The spell uses movement direction.
     * This prevents it from travelling backward
     * because of the GLB's internal forward axis.
     */


    const start =
        getWandTipPosition();


    /*
     * If the player is not moving,
     * use the direction the player faces.
     */

    if (
        direction.lengthSq() <
        0.01
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


    start.add(
        direction
            .clone()
            .multiplyScalar(
                0.35
            )
    );


    spell.position.copy(
        start
    );


    spell.userData.velocity =
        direction
            .clone()
            .multiplyScalar(
                20
            );


    spell.userData.life =
        2.5;


    spell.userData.spin =
        THREE.MathUtils.randFloat(
            4,
            9
        );


    magicEffects.add(
        spell
    );


    /* =====================================================
       WAND FLASH
       ===================================================== */

    createWandFlash(
        start
    );

}


/* =========================================================
   WAND FLASH
   ========================================================= */

function createWandFlash(
    position
) {

    const flash =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.38,
                12,
                12
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 1
            })
        );


    flash.position.copy(
        position
    );


    flash.userData.life =
        0.18;


    magicEffects.add(
        flash
    );

}


/* =========================================================
   MAGIC UPDATE
   ========================================================= */

function updateMagic(
    delta
) {

    for (
        let i =
            magicEffects.children.length -
            1;

        i >= 0;

        i--
    ) {

        const object =
            magicEffects.children[i];


        if (
            object.userData.velocity
        ) {

            object.position.add(
                object.userData.velocity
                    .clone()
                    .multiplyScalar(
                        delta
                    )
            );


            object.rotation.y +=
                object.userData.spin *
                delta;


            object.userData.life -=
                delta;


            if (
                object.userData.life <= 0
            ) {

                magicEffects.remove(
                    object
                );

            }

        }


        if (
            object.userData.life !==
            undefined &&
            !object.userData.velocity
        ) {

            object.userData.life -=
                delta;


            if (
                object.material
            ) {

                object.material.opacity =
                    Math.max(
                        0,
                        object.userData.life /
                        0.18
                    );

            }


            if (
                object.userData.life <=
                0
            ) {

                magicEffects.remove(
                    object
                );

            }

        }

    }

}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera(
    delta
) {

    const target =
        player.position.clone();


    target.y +=
        1.5;


    const horizontal =
        cameraDistance *
        Math.cos(
            cameraPitch
        );


    const vertical =
        cameraDistance *
        Math.sin(
            cameraPitch
        );


    const offset =
        new THREE.Vector3(
            Math.sin(
                cameraYaw
            ) *
            horizontal,

            vertical,

            Math.cos(
                cameraYaw
            ) *
            horizontal
        );


    const desired =
        target.clone()
            .add(
                offset
            );


    camera.position.lerp(
        desired,
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
   CAMERA DRAG
   ========================================================= */

let draggingCamera =
    false;

let previousX =
    0;

let previousY =
    0;


renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        draggingCamera =
            true;

        previousX =
            event.clientX;

        previousY =
            event.clientY;

    }
);


window.addEventListener(
    "pointermove",
    event => {

        if (
            !draggingCamera
        ) return;


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
    () => {

        draggingCamera =
            false;

    }
);


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


if (
    joystick &&
    joystickKnob
) {

    let active =
        false;


    function moveJoystick(
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


        const max =
            rect.width * 0.34;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance > max
        ) {

            dx =
                dx / distance *
                max;

            dy =
                dy / distance *
                max;

        }


        joystickKnob.style.transform =
            `translate(${dx}px, ${dy}px)`;


        moveX =
            dx / max;


        moveY =
            dy / max;

    }


    joystick.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            active =
                true;

            joystick.setPointerCapture(
                event.pointerId
            );

            moveJoystick(
                event
            );

        }
    );


    joystick.addEventListener(
        "pointermove",
        event => {

            if (
                active
            ) {

                moveJoystick(
                    event
                );

            }

        }
    );


    joystick.addEventListener(
        "pointerup",
        () => {

            active =
                false;

            moveX =
                0;

            moveY =
                0;

            joystickKnob.style.transform =
                "translate(0px, 0px)";

        }
    );

}


/* =========================================================
   BUTTONS
   ========================================================= */

const jumpButton =
    document.getElementById(
        "jumpButton"
    );


if (
    jumpButton
) {

    jumpButton.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            jump();

        }
    );

}


const castButton =
    document.getElementById(
        "castButton"
    );


if (
    castButton
) {

    castButton.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            castSpell();

        }
    );

}


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

scene.add(
    npc
);


const npcBody =
    new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.55,
            1.6,
            8,
            12
        ),
        new THREE.MeshStandardMaterial({
            color: 0x30264c
        })
    );

npcBody.position.y =
    1.3;

npcBody.castShadow = true;

npc.add(
    npcBody
);


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

npc.add(
    npcHead
);


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

npcCrystal.position.y =
    3.25;

npc.add(
    npcCrystal
);


const npcLight =
    new THREE.PointLight(
        0x48dfff,
        1.5,
        8
    );

npcLight.position.y =
    3;

npc.add(
    npcLight
);


/* =========================================================
   QUEST
   ========================================================= */

let questState =
    "TALK_TO_AELION";

let xp =
    0;


const questText =
    document.getElementById(
        "questText"
    );

const xpText =
    document.getElementById(
        "xpText"
    );


function updateQuestUI() {

    if (
        questText
    ) {

        if (
            questState ===
            "TALK_TO_AELION"
        ) {

            questText.textContent =
                "Quest: Talk to Professor Aelion";

        }
        else if (
            questState ===
            "FIND_ANCIENT_MARKER"
        ) {

            questText.textContent =
                "Quest: Find the Ancient Marker";

        }
        else {

            questText.textContent =
                "Quest Complete: Ancient Marker";

        }

    }


    if (
        xpText
    ) {

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


function showDialogue(
    text
) {

    if (
        dialogue
    ) {

        dialogue.style.display =
            "block";

    }


    if (
        dialogueText
    ) {

        dialogueText.textContent =
            text;

    }

}


function hideDialogue() {

    if (
        dialogue
    ) {

        dialogue.style.display =
            "none";

    }

}


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
            2000
        );

        return;

    }


    if (
        questState ===
        "TALK_TO_AELION"
    ) {

        questState =
            "FIND_ANCIENT_MARKER";

        xp +=
            50;


        showDialogue(
            "Aelion: An ancient magical marker lies somewhere in the academy grounds. Find it."
        );


        updateQuestUI();

        return;

    }


    showDialogue(
        "Aelion: Explore the academy grounds. The old magic is awakening."
    );

}


const talkButton =
    document.getElementById(
        "talkButton"
    );


if (
    talkButton
) {

    talkButton.addEventListener(
        "pointerdown",
        event => {

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

scene.add(
    marker
);


const markerStone =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.2,
            3.5,
            0.8
        ),
        darkStoneMaterial
    );

markerStone.position.y =
    1.75;

markerStone.rotation.z =
    -0.08;

markerStone.castShadow = true;

marker.add(
    markerStone
);


const markerCrystal =
    new THREE.Mesh(
        new THREE.OctahedronGeometry(
            0.45
        ),
        new THREE.MeshStandardMaterial({
            color: 0xa27aff,
            emissive: 0x5b27d8,
            emissiveIntensity: 2
        })
    );

markerCrystal.position.y =
    2.4;

marker.add(
    markerCrystal
);


const markerLight =
    new THREE.PointLight(
        0x855dff,
        2,
        12
    );

markerLight.position.y =
    2.5;

marker.add(
    markerLight
);


function updateQuestMarker() {

    if (
        questState !==
        "FIND_ANCIENT_MARKER"
    ) {

        return;

    }


    const distance =
        player.position.distanceTo(
            marker.position
        );


    if (
        distance < 5
    ) {

        questState =
            "COMPLETED";

        xp +=
            150;


        showDialogue(
            "You discovered the Ancient Marker! Ancient magic awakens around you."
        );


        updateQuestUI();

    }

}


/* =========================================================
   ANIMATION EFFECTS
   ========================================================= */

function animateWorld(
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


    for (
        const torch of torches
    ) {

        torch.orange.scale.x =
            0.9 +
            Math.sin(
                time * 13
            ) *
            0.1;


        torch.orange.scale.y =
            1.5 +
            Math.sin(
                time * 17
            ) *
            0.15;


        torch.yellow.rotation.z =
            Math.sin(
                time * 15
            ) *
            0.12;


        torch.light.intensity =
            2.5 +
            Math.sin(
                time * 12
            ) *
            0.6;

    }

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
   PORTRAIT
   ========================================================= */

function checkOrientation() {

    const overlay =
        document.getElementById(
            "portraitOverlay"
        );


    if (
        !overlay
    ) return;


    overlay.style.display =
        window.innerHeight >
        window.innerWidth
            ? "flex"
            : "none";

}


window.addEventListener(
    "resize",
    checkOrientation
);

checkOrientation();


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


    updateMagic(
        delta
    );


    updateCamera(
        delta
    );


    updateQuestMarker();


    animateWorld(
        time
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
            time
        );

    }
    else if (
        isMoving
    ) {

        applyWalkingAnimation(
            time
        );

    }
    else {

        applyIdleAnimation(
            time
        );

    }


    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   CASTING ANIMATION
   ========================================================= */

function applyCastingAnimation(
    time
) {

    if (!playerModel) return;


    const rightArm =
        playerBones[
            "RightArm"
        ];


    const leftArm =
        playerBones[
            "LeftArm"
        ];


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


    /*
     * Wand tip pulses while casting.
     */

    if (
        wand
    ) {

        const tip =
            wand.children.find(
                object =>
                    object.isMesh &&
                    object.geometry &&
                    object.geometry.type ===
                    "SphereGeometry"
            );


        if (tip) {

            const pulse =
                1 +
                Math.sin(
                    time * 25
                ) *
                0.25;

            tip.scale.setScalar(
                pulse
            );

        }

    }

}


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
   START
   ========================================================= */

animate();


console.log(
    "Aetheria Academy — Version 3 loaded."
);

console.log(
    "Visible wand + visible magic enabled."
);
