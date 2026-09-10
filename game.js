/* =========================================================
   WIZARDING WORLD 3D
   V6 - VISIBILITY + HERO + ENEMIES + WATER
   ========================================================= */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================================================
   BASIC SETUP
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87a9b8);

scene.fog = new THREE.FogExp2(
    0x87a9b8,
    0.008
);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
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

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

renderer.domElement.style.position = "fixed";
renderer.domElement.style.left = "0";
renderer.domElement.style.top = "0";
renderer.domElement.style.zIndex = "0";

document.body.appendChild(renderer.domElement);


/* =========================================================
   WORLD
   ========================================================= */

const clock = new THREE.Clock();

const world = new THREE.Group();

scene.add(world);


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight = new THREE.HemisphereLight(
    0xcfe8ff,
    0x34452f,
    2.2
);

scene.add(hemiLight);


const sun = new THREE.DirectionalLight(
    0xfff1d2,
    4
);

sun.position.set(
    80,
    120,
    60
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -150;
sun.shadow.camera.right = 150;
sun.shadow.camera.top = 150;
sun.shadow.camera.bottom = -150;

scene.add(sun);


/* =========================================================
   GROUND
   ========================================================= */

const groundLoader = new THREE.TextureLoader();

const groundDiffuse =
    groundLoader.load("./assets/ground/diffuse.jpg");

const groundNormal =
    groundLoader.load("./assets/ground/normal.jpg");

const groundRough =
    groundLoader.load("./assets/ground/rough.jpg");

groundDiffuse.wrapS =
groundDiffuse.wrapT =
THREE.RepeatWrapping;

groundNormal.wrapS =
groundNormal.wrapT =
THREE.RepeatWrapping;

groundRough.wrapS =
groundRough.wrapT =
THREE.RepeatWrapping;

groundDiffuse.repeat.set(18, 18);
groundNormal.repeat.set(18, 18);
groundRough.repeat.set(18, 18);


const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundDiffuse,
    normalMap: groundNormal,
    roughnessMap: groundRough,
    roughness: 0.92,
    metalness: 0
});


const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
        300,
        300,
        100,
        100
    ),
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

world.add(ground);


/* =========================================================
   STONE PATH
   ========================================================= */

const pathMaterial = new THREE.MeshStandardMaterial({
    color: 0x77766f,
    roughness: 0.95
});

const path = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 180),
    pathMaterial
);

path.rotation.x = -Math.PI / 2;

path.position.set(
    0,
    0.025,
    -50
);

path.receiveShadow = true;

world.add(path);


/* =========================================================
   CASTLE
   ========================================================= */

function createCastle() {

    const castle = new THREE.Group();

    castle.position.set(
        0,
        0,
        -70
    );

    world.add(castle);


    const castleDiffuse =
        groundLoader.load("./assets/castle/diffuse.jpg");

    const castleNormal =
        groundLoader.load("./assets/castle/normal.jpg");

    const castleRough =
        groundLoader.load("./assets/castle/rough.jpg");

    castleDiffuse.wrapS =
    castleDiffuse.wrapT =
    THREE.RepeatWrapping;

    castleNormal.wrapS =
    castleNormal.wrapT =
    THREE.RepeatWrapping;

    castleRough.wrapS =
    castleRough.wrapT =
    THREE.RepeatWrapping;

    castleDiffuse.repeat.set(5, 5);
    castleNormal.repeat.set(5, 5);
    castleRough.repeat.set(5, 5);


    const wallMaterial =
        new THREE.MeshStandardMaterial({

            map: castleDiffuse,

            normalMap: castleNormal,

            roughnessMap: castleRough,

            roughness: 0.82,

            metalness: 0

        });


    /* MAIN CASTLE */

    const main = new THREE.Mesh(

        new THREE.BoxGeometry(
            50,
            30,
            28
        ),

        wallMaterial

    );

    main.position.y = 15;

    main.castShadow = true;
    main.receiveShadow = true;

    castle.add(main);


    /* CASTLE ROOF */

    const roofMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x242832,
            roughness: 0.75
        });


    const roof = new THREE.Mesh(

        new THREE.ConeGeometry(
            32,
            14,
            4
        ),

        roofMaterial

    );

    roof.rotation.y = Math.PI / 4;

    roof.position.y = 37;

    roof.castShadow = true;

    castle.add(roof);


    /* TOWERS */

    const towerPositions = [

        [-25, -13],
        [25, -13],
        [-25, 13],
        [25, 13]

    ];


    towerPositions.forEach(pos => {

        const tower = new THREE.Mesh(

            new THREE.CylinderGeometry(
                7,
                8,
                40,
                20
            ),

            wallMaterial

        );

        tower.position.set(
            pos[0],
            20,
            pos[1]
        );

        tower.castShadow = true;
        tower.receiveShadow = true;

        castle.add(tower);


        const towerRoof = new THREE.Mesh(

            new THREE.ConeGeometry(
                9,
                13,
                20
            ),

            roofMaterial

        );

        towerRoof.position.set(
            pos[0],
            46,
            pos[1]
        );

        towerRoof.castShadow = true;

        castle.add(towerRoof);

    });


    /* WINDOWS */

    const windowMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x9edfff,

            emissive: 0x2b7fb0,

            emissiveIntensity: 2

        });


    for (
        let x = -18;
        x <= 18;
        x += 9
    ) {

        const window = new THREE.Mesh(

            new THREE.BoxGeometry(
                2.2,
                5,
                0.5
            ),

            windowMaterial

        );

        window.position.set(
            x,
            15,
            -14.3
        );

        castle.add(window);

    }


    /* DOOR */

    const doorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x19120d,
            roughness: 0.65
        });


    const door = new THREE.Mesh(

        new THREE.BoxGeometry(
            7,
            11,
            1
        ),

        doorMaterial

    );

    door.position.set(
        0,
        5.5,
        -14.5
    );

    castle.add(door);


    return castle;
}

createCastle();


/* =========================================================
   WATER - LARGE AND CLOSE TO SPAWN
   ========================================================= */

let water;

function createWater() {

    const geometry =
        new THREE.PlaneGeometry(
            65,
            50,
            40,
            30
        );


    const material =
        new THREE.MeshPhysicalMaterial({

            color: 0x176b83,

            roughness: 0.18,

            metalness: 0.08,

            transmission: 0.05,

            transparent: true,

            opacity: 0.88

        });


    water = new THREE.Mesh(
        geometry,
        material
    );

    water.rotation.x = -Math.PI / 2;


    /* IMPORTANT:
       PUT WATER CLOSE TO PLAYER */

    water.position.set(
        34,
        0.12,
        -10
    );


    water.receiveShadow = true;

    world.add(water);

}

createWater();


/* =========================================================
   WATER SHORE
   ========================================================= */

function createShoreRocks() {

    const rockMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x57544d,
            roughness: 0.9
        });


    for (let i = 0; i < 18; i++) {

        const rock = new THREE.Mesh(

            new THREE.DodecahedronGeometry(
                0.7 + Math.random() * 1.4,
                1
            ),

            rockMaterial

        );


        rock.position.set(

            7 + Math.random() * 50,

            0.5,

            -30 + Math.random() * 40

        );


        rock.scale.y =
            0.5 + Math.random() * 0.7;


        rock.rotation.set(

            Math.random(),

            Math.random(),

            Math.random()

        );


        rock.castShadow = true;

        world.add(rock);

    }

}

createShoreRocks();


/* =========================================================
   MOUNTAINS
   ========================================================= */

function createMountains() {

    const mountainMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x59645e,
            roughness: 1
        });


    const positions = [

        [-90, -70],
        [90, -70],
        [-110, 10],
        [110, 10],
        [-100, 90],
        [100, 90]

    ];


    positions.forEach(pos => {

        const mountain = new THREE.Mesh(

            new THREE.ConeGeometry(
                35 + Math.random() * 20,
                70 + Math.random() * 40,
                8
            ),

            mountainMaterial

        );


        mountain.position.set(
            pos[0],
            30,
            pos[1]
        );

        mountain.castShadow = true;

        world.add(mountain);

    });

}

createMountains();


/* =========================================================
   TREES
   ========================================================= */

const gltfLoader =
    new GLTFLoader();

let treeModel = null;


gltfLoader.load(

    "./assets/tree.glb",

    function(gltf) {

        treeModel = gltf.scene;

        treeModel.scale.setScalar(5);

        treeModel.traverse(obj => {

            if (obj.isMesh) {

                obj.castShadow = true;
                obj.receiveShadow = true;

            }

        });


        createTrees();

    },

    undefined,

    function(error) {

        console.log(
            "Tree loading failed:",
            error
        );

    }

);


function createTrees() {

    if (!treeModel) return;


    const treePositions = [

        [-18, 5],
        [-25, -8],
        [-32, 4],
        [-40, -15],

        [15, 5],
        [20, -2],
        [27, 10],
        [45, 8],

        [-18, -25],
        [-28, -30],

        [55, -20],
        [65, -30],

        [-55, 15],
        [-65, -5],

        [18, -35],
        [-20, -45],

        [70, 0],
        [-70, -25],

        [35, -45],
        [-45, -50]

    ];


    treePositions.forEach(pos => {

        const tree =
            treeModel.clone(true);


        tree.position.set(
            pos[0],
            0,
            pos[1]
        );


        const scale =
            4.2 + Math.random() * 1.5;

        tree.scale.setScalar(scale);


        tree.rotation.y =
            Math.random() * Math.PI * 2;


        world.add(tree);

    });

}


/* =========================================================
   PLAYER
   ========================================================= */

const player = {

    position: new THREE.Vector3(
        0,
        0,
        8
    ),

    velocityY: 0,

    speed: 0.16,

    hp: 100,

    magic: 100,

    xp: 0,

    grounded: true,

    group: null

};


/* =========================================================
   WIZARD HERO
   ========================================================= */

function createWizard() {

    const wizard =
        new THREE.Group();


    wizard.name = "PLAYER_WIZARD";


    /* =====================================================
       LEGS
       ===================================================== */

    const darkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x161822,
            roughness: 0.8
        });


    const bootMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x0b0b0d,
            roughness: 0.6
        });


    const robeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x202c4d,
            roughness: 0.72
        });


    const beltMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x6b4325,
            roughness: 0.7
        });


    const skinMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xc98d6d,
            roughness: 0.75
        });


    const hairMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2b1a12,
            roughness: 0.8
        });


    const hatMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x151c35,
            roughness: 0.72
        });


    /* LEGS */

    const leftLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.55,
            0.6,
            2.4,
            12
        ),
        darkMaterial
    );

    leftLeg.position.set(
        -0.65,
        1.2,
        0
    );

    leftLeg.castShadow = true;

    wizard.add(leftLeg);


    const rightLeg = leftLeg.clone();

    rightLeg.position.x = 0.65;

    wizard.add(rightLeg);


    /* BOOTS */

    const leftBoot = new THREE.Mesh(
        new THREE.BoxGeometry(
            1.1,
            0.6,
            1.8
        ),
        bootMaterial
    );

    leftBoot.position.set(
        -0.65,
        0.25,
        -0.25
    );

    leftBoot.castShadow = true;

    wizard.add(leftBoot);


    const rightBoot = leftBoot.clone();

    rightBoot.position.x = 0.65;

    wizard.add(rightBoot);


    /* =====================================================
       ROBE
       ===================================================== */

    const robe = new THREE.Mesh(
        new THREE.ConeGeometry(
            2.35,
            4.2,
            16
        ),
        robeMaterial
    );

    robe.position.y = 3.2;

    robe.castShadow = true;

    wizard.add(robe);


    /* CHEST */

    const chest = new THREE.Mesh(
        new THREE.CylinderGeometry(
            1.35,
            1.5,
            2.2,
            16
        ),
        robeMaterial
    );

    chest.position.y = 5.2;

    chest.castShadow = true;

    wizard.add(chest);


    /* BELT */

    const belt = new THREE.Mesh(
        new THREE.TorusGeometry(
            1.35,
            0.12,
            8,
            24
        ),
        beltMaterial
    );

    belt.rotation.x = Math.PI / 2;

    belt.position.y = 4.5;

    wizard.add(belt);


    /* =====================================================
       HEAD
       ===================================================== */

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(
            1.25,
            24,
            18
        ),
        skinMaterial
    );

    head.position.y = 7.2;

    head.castShadow = true;

    wizard.add(head);


    /* HAIR */

    const hair = new THREE.Mesh(
        new THREE.SphereGeometry(
            1.3,
            24,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55
        ),
        hairMaterial
    );

    hair.position.y = 7.65;

    hair.scale.set(
        1.05,
        0.85,
        1.05
    );

    wizard.add(hair);


    /* EYES */

    const eyeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x111111
        });


    const pupilMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x111111
        });


    [-0.42, 0.42].forEach(x => {

        const eye = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.18,
                12,
                12
            ),
            eyeMaterial
        );

        eye.position.set(
            x,
            7.3,
            -1.12
        );

        wizard.add(eye);


        const pupil = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.09,
                10,
                10
            ),
            pupilMaterial
        );

        pupil.position.set(
            x,
            7.3,
            -1.28
        );

        wizard.add(pupil);

    });


    /* NOSE */

    const nose = new THREE.Mesh(
        new THREE.ConeGeometry(
            0.15,
            0.45,
            8
        ),
        skinMaterial
    );

    nose.rotation.x = -Math.PI / 2;

    nose.position.set(
        0,
        7.0,
        -1.22
    );

    wizard.add(nose);


    /* =====================================================
       ARMS
       ===================================================== */

    const armMaterial = robeMaterial;


    const leftArm = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.38,
            0.45,
            2.8,
            12
        ),
        armMaterial
    );

    leftArm.position.set(
        -1.65,
        4.8,
        0
    );

    leftArm.rotation.z = 0.25;

    leftArm.castShadow = true;

    wizard.add(leftArm);


    const rightArm = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.38,
            0.45,
            2.8,
            12
        ),
        armMaterial
    );

    rightArm.position.set(
        1.65,
        4.8,
        -0.35
    );

    rightArm.rotation.z = -0.35;

    rightArm.castShadow = true;

    wizard.add(rightArm);


    /* HAND */

    const hand = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.42,
            14,
            14
        ),
        skinMaterial
    );

    hand.position.set(
        2.1,
        3.5,
        -0.75
    );

    wizard.add(hand);


    /* =====================================================
       WAND
       ===================================================== */

    const wandMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x4a2815,
            roughness: 0.6
        });


    const wand = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.08,
            0.13,
            3.8,
            10
        ),
        wandMaterial
    );

    wand.position.set(
        2.35,
        4.4,
        -1.15
    );

    wand.rotation.z = -0.15;

    wand.rotation.x = 0.35;

    wand.castShadow = true;

    wizard.add(wand);


    /* MAGIC TIP */

    const magicTip =
        new THREE.PointLight(
            0x6ddcff,
            7,
            10
        );

    magicTip.position.set(
        2.45,
        6.25,
        -1.5
    );

    wizard.add(magicTip);


    const tipSphere = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.22,
            16,
            16
        ),
        new THREE.MeshBasicMaterial({
            color: 0x8fffff
        })
    );

    tipSphere.position.copy(
        magicTip.position
    );

    wizard.add(tipSphere);


    /* =====================================================
       WIZARD HAT
       ===================================================== */

    const hat = new THREE.Mesh(
        new THREE.ConeGeometry(
            1.45,
            2.8,
            24
        ),
        hatMaterial
    );

    hat.position.y = 9.2;

    hat.castShadow = true;

    wizard.add(hat);


    const hatBrim = new THREE.Mesh(
        new THREE.CylinderGeometry(
            1.85,
            1.85,
            0.25,
            24
        ),
        hatMaterial
    );

    hatBrim.position.y = 8.05;

    wizard.add(hatBrim);


    /* =====================================================
       CAPE
       ===================================================== */

    const capeMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x11182c,

            roughness: 0.8,

            side: THREE.DoubleSide

        });


    const cape = new THREE.Mesh(
        new THREE.PlaneGeometry(
            4.5,
            6
        ),
        capeMaterial
    );

    cape.position.set(
        0,
        4,
        1.15
    );

    cape.rotation.x =
        -Math.PI / 2.3;

    wizard.add(cape);


    /* =====================================================
       HERO MAGIC AURA
       ===================================================== */

    const aura = new THREE.Mesh(

        new THREE.SphereGeometry(
            3.8,
            20,
            20
        ),

        new THREE.MeshBasicMaterial({

            color: 0x5ddcff,

            transparent: true,

            opacity: 0.055,

            depthWrite: false

        })

    );

    aura.position.y = 4.5;

    wizard.add(aura);


    /* =====================================================
       SHADOW CIRCLE
       ===================================================== */

    const shadow = new THREE.Mesh(

        new THREE.CircleGeometry(
            2.2,
            32
        ),

        new THREE.MeshBasicMaterial({

            color: 0x000000,

            transparent: true,

            opacity: 0.32

        })

    );

    shadow.rotation.x =
        -Math.PI / 2;

    shadow.position.y = 0.05;

    wizard.add(shadow);


    /* =====================================================
       FINAL SCALE / POSITION
       ===================================================== */

    wizard.scale.setScalar(1.15);

    wizard.position.copy(
        player.position
    );

    wizard.position.y = 0;


    return wizard;
}


player.group =
    createWizard();


world.add(player.group);


/* =========================================================
   ENEMIES
   ========================================================= */

const enemies = [];


function createEnemy(
    x,
    z,
    type = "Shadow Beast"
) {

    const enemy =
        new THREE.Group();


    enemy.name = type;


    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x351b45,
            roughness: 0.8
        });


    const darkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x120d18,
            roughness: 0.9
        });


    const eyeMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xff3344,

            emissive: 0xff0011,

            emissiveIntensity: 4

        });


    /* BODY */

    const body = new THREE.Mesh(
        new THREE.SphereGeometry(
            1.6,
            18,
            18
        ),
        bodyMaterial
    );

    body.scale.set(
        1,
        1.35,
        0.9
    );

    body.position.y = 2.1;

    body.castShadow = true;

    enemy.add(body);


    /* HEAD */

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(
            1.15,
            18,
            18
        ),
        bodyMaterial
    );

    head.position.set(
        0,
        4,
        -0.1
    );

    head.castShadow = true;

    enemy.add(head);


    /* EYES */

    [-0.4, 0.4].forEach(x => {

        const eye = new THREE.Mesh(
            new THREE.SphereGeometry(
                0.18,
                12,
                12
            ),
            eyeMaterial
        );

        eye.position.set(
            x,
            4.1,
            -1.05
        );

        enemy.add(eye);

    });


    /* HORNS */

    [-0.65, 0.65].forEach(x => {

        const horn = new THREE.Mesh(
            new THREE.ConeGeometry(
                0.25,
                1.3,
                10
            ),
            darkMaterial
        );

        horn.position.set(
            x,
            5.05,
            0
        );

        horn.rotation.z =
            x > 0 ? -0.35 : 0.35;

        horn.castShadow = true;

        enemy.add(horn);

    });


    /* ARMS */

    [-1.8, 1.8].forEach(x => {

        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.3,
                0.45,
                2.5,
                10
            ),
            bodyMaterial
        );

        arm.position.set(
            x,
            2.3,
            0
        );

        arm.rotation.z =
            x > 0 ? -0.8 : 0.8;

        enemy.add(arm);

    });


    /* LEGS */

    [-0.65, 0.65].forEach(x => {

        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.38,
                0.48,
                2.2,
                10
            ),
            darkMaterial
        );

        leg.position.set(
            x,
            0.75,
            0
        );

        enemy.add(leg);

    });


    /* GLOW */

    const glow =
        new THREE.PointLight(
            0xff1744,
            5,
            9
        );

    glow.position.y = 3.5;

    enemy.add(glow);


    /* HEALTH BAR */

    const healthGroup =
        new THREE.Group();


    const barBack =
        new THREE.Mesh(

            new THREE.PlaneGeometry(
                3.2,
                0.3
            ),

            new THREE.MeshBasicMaterial({
                color: 0x200000
            })

        );


    const barFront =
        new THREE.Mesh(

            new THREE.PlaneGeometry(
                3,
                0.22
            ),

            new THREE.MeshBasicMaterial({
                color: 0xff3333
            })

        );


    barFront.position.z = 0.02;


    healthGroup.add(barBack);
    healthGroup.add(barFront);


    healthGroup.position.y = 6.3;


    enemy.add(healthGroup);


    /* =====================================================
       POSITION
       ===================================================== */

    enemy.position.set(
        x,
        0,
        z
    );


    enemy.userData = {

        hp: 100,

        maxHp: 100,

        speed: 0.035,

        attackCooldown: 0,

        healthBar: barFront,

        healthGroup: healthGroup,

        dead: false

    };


    enemy.traverse(obj => {

        if (obj.isMesh) {

            obj.castShadow = true;
            obj.receiveShadow = true;

        }

    });


    world.add(enemy);

    enemies.push(enemy);

    return enemy;

}


/* =========================================================
   IMPORTANT:
   ENEMIES ARE VERY CLOSE TO START
   ========================================================= */

createEnemy(
    9,
    0,
    "Shadow Beast"
);

createEnemy(
    -9,
    -4,
    "Dark Creature"
);

createEnemy(
    12,
    -14,
    "Forest Demon"
);

createEnemy(
    -14,
    -16,
    "Night Beast"
);


/* =========================================================
   SPELLS
   ========================================================= */

const spells = [];


function castSpell() {

    if (player.magic < 10) {

        showMessage(
            "Not enough magic!"
        );

        return;

    }


    player.magic -= 10;


    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );


    direction.applyQuaternion(
        player.group.quaternion
    );


    const spell =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.35,
                16,
                16
            ),

            new THREE.MeshBasicMaterial({

                color: 0x64e8ff

            })

        );


    spell.position.copy(
        player.group.position
    );


    spell.position.y += 5.5;


    spell.userData = {

        velocity:
            direction.multiplyScalar(0.8),

        life: 3

    };


    const light =
        new THREE.PointLight(
            0x59e9ff,
            6,
            8
        );


    spell.add(light);


    world.add(spell);

    spells.push(spell);

}


/* =========================================================
   SPELL IMPACT
   ========================================================= */

function createImpact(position) {

    const ring =
        new THREE.Mesh(

            new THREE.RingGeometry(
                0.2,
                1.5,
                32
            ),

            new THREE.MeshBasicMaterial({

                color: 0x8fffff,

                transparent: true,

                opacity: 0.9,

                side: THREE.DoubleSide

            })

        );


    ring.rotation.x =
        -Math.PI / 2;

    ring.position.copy(
        position
    );

    ring.position.y += 0.2;


    world.add(ring);


    let scale = 0.3;


    function animateRing() {

        scale += 0.08;

        ring.scale.setScalar(
            scale
        );

        ring.material.opacity -=
            0.04;


        if (
            ring.material.opacity <= 0
        ) {

            world.remove(ring);

            return;

        }


        requestAnimationFrame(
            animateRing
        );

    }


    animateRing();

}


/* =========================================================
   ENEMY UPDATE
   ========================================================= */

function updateEnemies(delta) {

    enemies.forEach(enemy => {

        if (
            enemy.userData.dead
        ) return;


        const distance =
            enemy.position.distanceTo(
                player.group.position
            );


        /* LOOK AT PLAYER */

        enemy.lookAt(
            player.group.position.x,
            enemy.position.y,
            player.group.position.z
        );


        /* CHASE */

        if (
            distance < 35 &&
            distance > 3
        ) {

            const direction =
                new THREE.Vector3()
                    .subVectors(
                        player.group.position,
                        enemy.position
                    )
                    .normalize();


            enemy.position.x +=
                direction.x *
                enemy.userData.speed *
                delta *
                60;


            enemy.position.z +=
                direction.z *
                enemy.userData.speed *
                delta *
                60;


        }


        /* ATTACK */

        if (
            distance < 3.5
        ) {

            enemy.userData.attackCooldown -=
                delta;


            if (
                enemy.userData.attackCooldown <= 0
            ) {

                player.hp -= 5;

                enemy.userData.attackCooldown =
                    1.2;

                showMessage(
                    "The Shadow Beast attacked!"
                );

            }

        }


        /* FLOATING ANIMATION */

        enemy.position.y =
            Math.sin(
                clock.elapsedTime * 3 +
                enemy.position.x
            ) * 0.12;


        /* HEALTH BAR FACE CAMERA */

        enemy.userData.healthGroup.quaternion.copy(
            camera.quaternion
        );

    });

}


/* =========================================================
   SPELL UPDATE
   ========================================================= */

function updateSpells(delta) {

    for (
        let i = spells.length - 1;
        i >= 0;
        i--
    ) {

        const spell =
            spells[i];


        spell.position.add(
            spell.userData.velocity
        );


        spell.userData.life -=
            delta;


        let hit = false;


        enemies.forEach(enemy => {

            if (
                enemy.userData.dead
            ) return;


            const distance =
                spell.position.distanceTo(
                    enemy.position
                );


            if (
                distance < 3
            ) {

                enemy.userData.hp -= 35;

                hit = true;


                createImpact(
                    enemy.position
                );


                player.xp += 25;


                if (
                    enemy.userData.hp <= 0
                ) {

                    enemy.userData.dead =
                        true;


                    enemy.visible = false;


                    player.xp += 50;


                    showMessage(
                        "Enemy defeated! +75 XP"
                    );

                }


                else {

                    showMessage(
                        "Spell hit!"
                    );

                }

            }

        });


        if (
            hit ||
            spell.userData.life <= 0
        ) {

            world.remove(spell);

            spells.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

const keys = {

    forward: false,

    backward: false,

    left: false,

    right: false

};


let joystickX = 0;
let joystickY = 0;


function updatePlayer(delta) {

    const movement =
        new THREE.Vector3(
            joystickX,
            0,
            joystickY
        );


    if (keys.forward)
        movement.z -= 1;

    if (keys.backward)
        movement.z += 1;

    if (keys.left)
        movement.x -= 1;

    if (keys.right)
        movement.x += 1;


    if (
        movement.length() > 0
    ) {

        movement.normalize();


        /* CAMERA RELATIVE */

        movement.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            cameraYaw
        );


        player.position.x +=
            movement.x *
            player.speed *
            delta *
            60;


        player.position.z +=
            movement.z *
            player.speed *
            delta *
            60;


        /* WIZARD FACES MOVEMENT */

        const targetRotation =
            Math.atan2(
                movement.x,
                movement.z
            );


        player.group.rotation.y =
            THREE.MathUtils.lerp(
                player.group.rotation.y,
                targetRotation,
                0.15
            );

    }


    /* GRAVITY */

    if (!player.grounded) {

        player.velocityY -=
            0.018 *
            delta *
            60;

        player.position.y +=
            player.velocityY *
            delta *
            60;


        if (
            player.position.y <= 0
        ) {

            player.position.y = 0;

            player.velocityY = 0;

            player.grounded = true;

        }

    }


    player.group.position.copy(
        player.position
    );


    /* MAGIC REGEN */

    player.magic +=
        4 * delta;


    player.magic =
        Math.min(
            100,
            player.magic
        );

}


/* =========================================================
   JUMP
   ========================================================= */

function jump() {

    if (
        player.grounded
    ) {

        player.grounded =
            false;

        player.velocityY =
            0.32;

    }

}


/* =========================================================
   CAMERA
   ========================================================= */

let cameraYaw = 0;

let cameraPitch = 0.15;


function updateCamera() {

    const distance = 15;


    const height = 7;


    const offset =
        new THREE.Vector3(
            Math.sin(cameraYaw) * distance,
            height,
            Math.cos(cameraYaw) * distance
        );


    camera.position.lerp(

        new THREE.Vector3()
            .copy(player.group.position)
            .add(offset),

        0.1

    );


    camera.lookAt(

        player.group.position.x,

        player.group.position.y + 4,

        player.group.position.z

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


let joystickActive = false;


if (
    joystickBase &&
    joystickStick
) {

    joystickBase.addEventListener(
        "pointerdown",
        e => {

            joystickActive = true;

            joystickBase.setPointerCapture(
                e.pointerId
            );

            updateJoystick(e);

        }
    );


    joystickBase.addEventListener(
        "pointermove",
        e => {

            if (
                joystickActive
            ) {

                updateJoystick(e);

            }

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

}


function updateJoystick(e) {

    const rect =
        joystickBase.getBoundingClientRect();


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
            dx /
            length *
            max;

        dy =
            dy /
            length *
            max;

    }


    joystickStick.style.transform =
        `translate(${dx}px, ${dy}px)`;


    joystickX =
        dx / max;


    joystickY =
        dy / max;

}


function resetJoystick() {

    joystickActive = false;

    joystickX = 0;

    joystickY = 0;


    joystickStick.style.transform =
        "translate(0px, 0px)";

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


if (jumpBtn) {

    jumpBtn.addEventListener(
        "pointerdown",
        e => {

            e.preventDefault();

            jump();

        }
    );

}


if (spellBtn) {

    spellBtn.addEventListener(
        "pointerdown",
        e => {

            e.preventDefault();

            castSpell();

        }
    );

}


/* =========================================================
   CAMERA TOUCH
   ========================================================= */

let cameraTouch = false;

let lastTouchX = 0;


renderer.domElement.addEventListener(
    "pointerdown",
    e => {

        cameraTouch = true;

        lastTouchX =
            e.clientX;

    }
);


renderer.domElement.addEventListener(
    "pointermove",
    e => {

        if (!cameraTouch)
            return;


        const dx =
            e.clientX -
            lastTouchX;


        cameraYaw -=
            dx * 0.008;


        lastTouchX =
            e.clientX;

    }
);


renderer.domElement.addEventListener(
    "pointerup",
    () => {

        cameraTouch = false;

    }
);


/* =========================================================
   HUD
   ========================================================= */

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


function updateHUD() {

    if (hpBar) {

        hpBar.style.width =
            `${Math.max(
                0,
                player.hp
            )}%`;

    }


    if (magicBar) {

        magicBar.style.width =
            `${player.magic}%`;

    }


    if (hpText) {

        hpText.textContent =
            Math.max(
                0,
                Math.floor(player.hp)
            );

    }


    if (magicText) {

        magicText.textContent =
            Math.floor(
                player.magic
            );

    }


    if (xpText) {

        xpText.textContent =
            player.xp;

    }

}


/* =========================================================
   MESSAGE
   ========================================================= */

const message =
    document.getElementById(
        "message"
    );


let messageTimer = 0;


function showMessage(text) {

    if (!message)
        return;


    message.textContent =
        text;


    message.style.opacity =
        "1";


    messageTimer = 2;

}


/* =========================================================
   DEBUG START MESSAGE
   ========================================================= */

setTimeout(() => {

    showMessage(
        "🧙 Welcome! Your wizard is ready."
    );

}, 1500);


/* =========================================================
   ANIMATION
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


    updatePlayer(delta);

    updateEnemies(delta);

    updateSpells(delta);

    updateCamera();

    updateHUD();


    /* WATER ANIMATION */

    if (water) {

        const positions =
            water.geometry.attributes.position;


        for (
            let i = 0;
            i < positions.count;
            i++
        ) {

            const x =
                positions.getX(i);

            const z =
                positions.getZ(i);


            positions.setY(

                i,

                Math.sin(
                    x * 0.18 +
                    clock.elapsedTime * 1.5
                ) * 0.15 +

                Math.cos(
                    z * 0.2 +
                    clock.elapsedTime
                ) * 0.1

            );

        }


        positions.needsUpdate = true;

    }


    /* HERO MAGIC AURA */

    if (
        player.group
    ) {

        const aura =
            player.group.children.find(
                obj =>
                    obj.geometry &&
                    obj.geometry.type ===
                    "SphereGeometry" &&
                    obj.material &&
                    obj.material.transparent
            );


        if (aura) {

            const pulse =
                1 +
                Math.sin(
                    clock.elapsedTime * 3
                ) * 0.06;


            aura.scale.setScalar(
                pulse
            );

        }

    }


    /* MESSAGE TIMER */

    if (
        messageTimer > 0
    ) {

        messageTimer -=
            delta;


        if (
            messageTimer <= 0 &&
            message
        ) {

            message.style.opacity =
                "0";

        }

    }


    renderer.render(
        scene,
        camera
    );

}


animate();


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
   KEYBOARD SUPPORT
   ========================================================= */

window.addEventListener(
    "keydown",
    e => {

        if (e.key === "w")
            keys.forward = true;

        if (e.key === "s")
            keys.backward = true;

        if (e.key === "a")
            keys.left = true;

        if (e.key === "d")
            keys.right = true;

        if (e.key === " ")
            jump();

        if (e.key === "f")
            castSpell();

    }
);


window.addEventListener(
    "keyup",
    e => {

        if (e.key === "w")
            keys.forward = false;

        if (e.key === "s")
            keys.backward = false;

        if (e.key === "a")
            keys.left = false;

        if (e.key === "d")
            keys.right = false;

    }
);


/* =========================================================
   LOADING SCREEN
   ========================================================= */

const loading =
    document.getElementById(
        "loading"
    );


setTimeout(() => {

    if (loading) {

        loading.style.opacity =
            "0";


        setTimeout(() => {

            loading.style.display =
                "none";

        }, 500);

    }

}, 1000);


/* =========================================================
   FINAL
   ========================================================= */

console.log(
    "WIZARDING WORLD 3D V6 LOADED"
);

console.log(
    "Wizard:",
    player.group
);

console.log(
    "Enemies:",
    enemies.length
);

console.log(
    "Water:",
    water
);
