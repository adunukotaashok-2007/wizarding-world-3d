/* =====================================================
   WIZARDING WORLD 3D
   STAGE 3

   ORIGINAL FANTASY WIZARD ADVENTURE

   FEATURES

   ✓ Third-person camera
   ✓ Mobile joystick
   ✓ Swipe camera
   ✓ Jump
   ✓ Castle
   ✓ Castle gate
   ✓ Courtyard
   ✓ Village
   ✓ Forest
   ✓ Lake
   ✓ Mountains
   ✓ NPC-style wizard
   ✓ Enemy creatures
   ✓ Magic projectiles
   ✓ HP
   ✓ Magic
   ✓ XP
   ✓ Magic regeneration
   ✓ Enemy damage
   ✓ Quest system
===================================================== */


/* =====================================================
   THREE.JS CHECK
===================================================== */

if (typeof THREE === "undefined") {

    document.body.innerHTML = `

        <div style="
            width:100%;
            height:100vh;
            background:#08101d;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            font-family:Arial;
            padding:30px;
        ">

            <div>

                <h2>3D Engine Error</h2>

                <p style="margin-top:12px;">
                    Three.js could not load.
                </p>

                <p style="margin-top:8px;">
                    Check your internet connection
                    and reload the game.
                </p>

            </div>

        </div>

    `;

    throw new Error(
        "Three.js unavailable"
    );

}


/* =====================================================
   SCENE
===================================================== */

const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x79b7dc
    );


scene.fog =
    new THREE.Fog(

        0x79b7dc,

        90,

        220

    );


/* =====================================================
   CAMERA
===================================================== */

const camera =
    new THREE.PerspectiveCamera(

        60,

        window.innerWidth /
        window.innerHeight,

        0.1,

        500

    );


let cameraYaw = 0;

let cameraPitch = 0.25;

let cameraDistance = 11;


/* =====================================================
   RENDERER
===================================================== */

const renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        powerPreference:
            "high-performance"

    });


renderer.setPixelRatio(

    Math.min(

        window.devicePixelRatio,
        1.5

    )

);


renderer.setSize(

    window.innerWidth,
    window.innerHeight

);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


document
    .getElementById("game")
    .appendChild(
        renderer.domElement
    );


/* =====================================================
   LIGHTING
===================================================== */

const skyLight =
    new THREE.HemisphereLight(

        0xd7edff,

        0x355c38,

        2.2

    );


scene.add(
    skyLight
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


scene.add(
    sun
);


/* =====================================================
   MATERIAL HELPERS
===================================================== */

function material(
    color
) {

    return new THREE.MeshStandardMaterial({

        color: color,

        roughness: 0.85

    });

}


/* =====================================================
   GROUND
===================================================== */

const ground =
    new THREE.Mesh(

        new THREE.PlaneGeometry(

            220,
            220

        ),

        material(
            0x3f793c
        )

    );


ground.rotation.x =
    -Math.PI / 2;


ground.position.y =
    0;


scene.add(
    ground
);


/* =====================================================
   PATH
===================================================== */

function createPath(

    x,
    z,
    width,
    length,
    rotation = 0

) {

    const path =
        new THREE.Mesh(

            new THREE.PlaneGeometry(

                width,
                length

            ),

            material(
                0x9b8063
            )

        );


    path.rotation.x =
        -Math.PI / 2;


    path.rotation.z =
        rotation;


    path.position.set(

        x,
        0.025,
        z

    );


    scene.add(
        path
    );

}


/* Main road */

createPath(
    0,
    -5,
    7,
    110
);


/* Village road */

createPath(
    34,
    -30,
    7,
    60
);


/* Castle road */

createPath(
    0,
    -55,
    10,
    45
);


/* =====================================================
   LAKE
===================================================== */

const lake =
    new THREE.Mesh(

        new THREE.CircleGeometry(

            18,
            40

        ),

        new THREE.MeshStandardMaterial({

            color:
                0x2780a0,

            transparent:
                true,

            opacity:
                0.85,

            roughness:
                0.2

        })

    );


lake.rotation.x =
    -Math.PI / 2;


lake.position.set(

    -48,
    0.04,
    -25

);


scene.add(
    lake
);


/* =====================================================
   CASTLE
===================================================== */

function createCastle() {


    /*
       Instead of one giant wall,
       build the castle from several
       sections so the entrance is visible.
    */


    /* ---------------------------------
       LEFT WING
    --------------------------------- */

    const leftWing =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                17,
                18,
                14

            ),

            material(
                0x70747a
            )

        );


    leftWing.position.set(

        -13,
        9,
        -78

    );


    scene.add(
        leftWing
    );


    /* ---------------------------------
       RIGHT WING
    --------------------------------- */

    const rightWing =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                17,
                18,
                14

            ),

            material(
                0x70747a
            )

        );


    rightWing.position.set(

        13,
        9,
        -78

    );


    scene.add(
        rightWing
    );


    /* ---------------------------------
       CENTRAL BACK BUILDING
    --------------------------------- */

    const center =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                16,
                15,
                10

            ),

            material(
                0x7b7f84
            )

        );


    center.position.set(

        0,
        7.5,
        -88

    );


    scene.add(
        center
    );


    /* ---------------------------------
       GATE BUILDING
    --------------------------------- */

    const gateTop =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                8,
                8,
                6

            ),

            material(
                0x686c72
            )

        );


    gateTop.position.set(

        0,
        16,
        -78

    );


    scene.add(
        gateTop
    );


    /* ---------------------------------
       GATE
    --------------------------------- */

    const gate =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                5,
                8,
                1

            ),

            material(
                0x382418
            )

        );


    gate.position.set(

        0,
        4,
        -74.7

    );


    scene.add(
        gate
    );


    /* ---------------------------------
       COURTYARD WALLS
    --------------------------------- */

    const courtyardLeft =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                2,
                5,
                30

            ),

            material(
                0x62666b
            )

        );


    courtyardLeft.position.set(

        -22,
        2.5,
        -66

    );


    scene.add(
        courtyardLeft
    );


    const courtyardRight =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                2,
                5,
                30

            ),

            material(
                0x62666b
            )

        );


    courtyardRight.position.set(

        22,
        2.5,
        -66

    );


    scene.add(
        courtyardRight
    );


    /* ---------------------------------
       TOWERS
    --------------------------------- */

    createTower(
        -23,
        -79
    );


    createTower(
        23,
        -79
    );


    createTower(
        -17,
        -96
    );


    createTower(
        17,
        -96
    );


    /* ---------------------------------
       WINDOWS
    --------------------------------- */

    for (
        let x = -13;
        x <= 13;
        x += 5
    ) {

        if (
            Math.abs(x) < 3
        ) {

            continue;

        }


        for (
            let y = 6;
            y <= 14;
            y += 4
        ) {

            createWindow(

                x,
                y,
                -70.9

            );

        }

    }


    /* ---------------------------------
       FLAGS
    --------------------------------- */

    createFlag(
        -23,
        38,
        -79
    );


    createFlag(
        23,
        38,
        -79
    );


}


function createTower(

    x,
    z

) {


    const tower =
        new THREE.Mesh(

            new THREE.CylinderGeometry(

                4,
                4,
                30,
                12

            ),

            material(
                0x666a70
            )

        );


    tower.position.set(

        x,
        15,
        z

    );


    scene.add(
        tower
    );


    const roof =
        new THREE.Mesh(

            new THREE.ConeGeometry(

                5.3,
                9,
                12

            ),

            material(
                0x32234b
            )

        );


    roof.position.set(

        x,
        34.5,
        z

    );


    scene.add(
        roof
    );

}


function createWindow(

    x,
    y,
    z

) {


    const window =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                1.4,
                2.4,
                0.25

            ),

            new THREE.MeshBasicMaterial({

                color:
                    0xb9e9ff

            })

        );


    window.position.set(

        x,
        y,
        z

    );


    scene.add(
        window
    );

}


function createFlag(

    x,
    y,
    z

) {


    const pole =
        new THREE.Mesh(

            new THREE.CylinderGeometry(

                0.08,
                0.08,
                8,
                8

            ),

            material(
                0x3d2818
            )

        );


    pole.position.set(

        x,
        y - 4,
        z

    );


    scene.add(
        pole
    );


    const flag =
        new THREE.Mesh(

            new THREE.PlaneGeometry(

                3,
                2

            ),

            new THREE.MeshStandardMaterial({

                color:
                    0x542b73,

                side:
                    THREE.DoubleSide

            })

        );


    flag.position.set(

        x + 1.4,
        y,
        z

    );


    scene.add(
        flag
    );

}


createCastle();


/* =====================================================
   VILLAGE
===================================================== */

function createHouse(

    x,
    z,
    scale = 1

) {


    const body =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                8 * scale,
                5 * scale,
                7 * scale

            ),

            material(
                0x866a50
            )

        );


    body.position.set(

        x,
        2.5 * scale,
        z

    );


    scene.add(
        body
    );


    const roof =
        new THREE.Mesh(

            new THREE.ConeGeometry(

                6 * scale,
                5 * scale,
                4

            ),

            material(
                0x542f3a
            )

        );


    roof.rotation.y =
        Math.PI / 4;


    roof.position.set(

        x,
        7 * scale,
        z

    );


    scene.add(
        roof
    );


    const door =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                1.5 * scale,
                2.5 * scale,
                0.25 * scale

            ),

            material(
                0x382016
            )

        );


    door.position.set(

        x,
        1.25 * scale,
        z -
        3.55 * scale

    );


    scene.add(
        door
    );

}


createHouse(
    34,
    -22,
    1
);


createHouse(
    48,
    -30,
    0.9
);


createHouse(
    35,
    -43,
    1.1
);


createHouse(
    51,
    -47,
    0.8
);


createHouse(
    -31,
    -38,
    0.9
);


/* =====================================================
   TREES
===================================================== */

function createTree(

    x,
    z,
    scale = 1

) {


    const trunk =
        new THREE.Mesh(

            new THREE.CylinderGeometry(

                0.45 * scale,
                0.65 * scale,
                3.5 * scale,
                8

            ),

            material(
                0x59351e
            )

        );


    trunk.position.set(

        x,
        1.75 * scale,
        z

    );


    scene.add(
        trunk
    );


    const leaves =
        new THREE.Mesh(

            new THREE.SphereGeometry(

                2.4 * scale,
                12,
                12

            ),

            material(
                0x215e2c
            )

        );


    leaves.position.set(

        x,
        4.6 * scale,
        z

    );


    scene.add(
        leaves
    );

}


const trees = [

    [-25, -5, 1],
    [-35, -10, 1.2],
    [-45, -5, 1],
    [-58, -10, 1.3],

    [-30, 8, 0.9],
    [-42, 12, 1.3],
    [-55, 8, 1],

    [25, 5, 1],
    [35, 8, 1.2],
    [52, 5, 1],
    [66, 10, 1.3],

    [-28, -28, 1.1],
    [-37, -42, 1.3],
    [-52, -43, 1],

    [25, -58, 1],
    [37, -63, 1.2],
    [53, -61, 1],

    [-65, -60, 1.4],
    [-75, -40, 1.1],
    [72, -42, 1.2]

];


trees.forEach(

    t => {

        createTree(
            t[0],
            t[1],
            t[2]
        );

    }

);


/* =====================================================
   MOUNTAINS
===================================================== */

function createMountain(

    x,
    z,
    height,
    radius

) {


    const mountain =
        new THREE.Mesh(

            new THREE.ConeGeometry(

                radius,
                height,
                6

            ),

            material(
                0x5c6c70
            )

        );


    mountain.position.set(

        x,
        height / 2,
        z

    );


    scene.add(
        mountain
    );

}


createMountain(
    -90,
    -75,
    60,
    38
);


createMountain(
    90,
    -78,
    70,
    42
);


createMountain(
    -88,
    10,
    45,
    32
);


createMountain(
    88,
    15,
    52,
    35
);


/* =====================================================
   PLAYER
===================================================== */

const player =
    new THREE.Group();


/* Body */

const robe =
    new THREE.Mesh(

        new THREE.CylinderGeometry(

            0.75,
            1.0,
            2.4,
            16

        ),

        material(
            0x38205c
        )

    );


robe.position.y =
    2.1;


player.add(
    robe
);


/* Head */

const head =
    new THREE.Mesh(

        new THREE.SphereGeometry(

            0.68,
            20,
            20

        ),

        material(
            0xffc39e
        )

    );


head.position.y =
    3.75;


player.add(
    head
);


/* Hat */

const hat =
    new THREE.Mesh(

        new THREE.ConeGeometry(

            1.0,
            1.9,
            16

        ),

        material(
            0x281044
        )

    );


hat.position.y =
    5.05;


player.add(
    hat
);


/* Hat brim */

const brim =
    new THREE.Mesh(

        new THREE.CylinderGeometry(

            1.15,
            1.15,
            0.16,
            16

        ),

        material(
            0x281044
        )

    );


brim.position.y =
    4.25;


player.add(
    brim
);


/* =====================================================
   ARMS
===================================================== */

function createArm(
    side
) {


    const arm =
        new THREE.Mesh(

            new THREE.CylinderGeometry(

                0.18,
                0.22,
                1.7,
                10

            ),

            material(
                0x38205c
            )

        );


    arm.rotation.z =
        side * 0.45;


    arm.position.set(

        side * 0.9,
        2.5,
        0

    );


    player.add(
        arm
    );


    return arm;

}


const leftArm =
    createArm(-1);


const rightArm =
    createArm(1);


/* =====================================================
   WAND
===================================================== */

const wand =
    new THREE.Mesh(

        new THREE.CylinderGeometry(

            0.06,
            0.08,
            2.4,
            8

        ),

        material(
            0x512d18
        )

    );


wand.rotation.z =
    Math.PI / 2;


wand.position.set(

    1.25,
    2.55,
    -0.25

);


player.add(
    wand
);


/* =====================================================
   PLAYER POSITION
===================================================== */

/*
   Start far enough away from the castle.
*/

player.position.set(

    0,
    0,
    20

);


scene.add(
    player
);


/* =====================================================
   PLAYER STATS
===================================================== */

let hp =
    100;


let magic =
    100;


let xp =
    0;


const hpElement =
    document.getElementById(
        "hp"
    );


const magicElement =
    document.getElementById(
        "magic"
    );


const xpElement =
    document.getElementById(
        "xp"
    );


function updateHUD() {

    hpElement.textContent =
        Math.max(
            0,
            Math.round(hp)
        );


    magicElement.textContent =
        Math.round(magic);


    xpElement.textContent =
        Math.round(xp);

}


/* =====================================================
   PHYSICS
===================================================== */

let velocityY =
    0;


let onGround =
    true;


const gravity =
    -0.018;


const jumpPower =
    0.42;


/* =====================================================
   JOYSTICK
===================================================== */

const joystickBase =
    document.getElementById(
        "joystickBase"
    );


const joystickKnob =
    document.getElementById(
        "joystickKnob"
    );


let joystickActive =
    false;


let joystickX =
    0;


let joystickY =
    0;


const joystickRadius =
    40;


function updateJoystick(

    clientX,
    clientY

) {


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


    const distance =
        Math.sqrt(

            dx * dx +
            dy * dy

        );


    if (
        distance >
        joystickRadius
    ) {

        dx =
            dx /
            distance *
            joystickRadius;


        dy =
            dy /
            distance *
            joystickRadius;

    }


    joystickX =
        dx /
        joystickRadius;


    joystickY =
        dy /
        joystickRadius;


    joystickKnob.style.transform =

        `translate(
            calc(-50% + ${dx}px),
            calc(-50% + ${dy}px)
        )`;

}


function resetJoystick() {

    joystickActive =
        false;


    joystickX =
        0;


    joystickY =
        0;


    joystickKnob.style.transform =
        "translate(-50%,-50%)";

}


/* Touch start */

joystickBase.addEventListener(

    "touchstart",

    event => {

        event.preventDefault();


        joystickActive =
            true;


        const touch =
            event.touches[0];


        updateJoystick(

            touch.clientX,
            touch.clientY

        );

    },

    {
        passive: false
    }

);


/* Touch move */

joystickBase.addEventListener(

    "touchmove",

    event => {

        event.preventDefault();


        if (
            !joystickActive
        ) {

            return;

        }


        const touch =
            event.touches[0];


        updateJoystick(

            touch.clientX,
            touch.clientY

        );

    },

    {
        passive: false
    }

);


/* Touch end */

joystickBase.addEventListener(

    "touchend",

    resetJoystick

);


joystickBase.addEventListener(

    "touchcancel",

    resetJoystick

);


/* =====================================================
   KEYBOARD
===================================================== */

const keys = {

    forward: false,

    backward: false,

    left: false,

    right: false

};


window.addEventListener(

    "keydown",

    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            keys.forward =
                true;

        }


        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            keys.backward =
                true;

        }


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            keys.left =
                true;

        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            keys.right =
                true;

        }


        if (
            event.key === " "
        ) {

            jump();

        }


        if (
            key === "e"
        ) {

            castSpell();

        }

    }

);


window.addEventListener(

    "keyup",

    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            keys.forward =
                false;

        }


        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            keys.backward =
                false;

        }


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            keys.left =
                false;

        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            keys.right =
                false;

        }

    }

);


/* =====================================================
   JUMP
===================================================== */

document
    .getElementById("jump")
    .addEventListener(

        "click",

        jump

    );


function jump() {

    if (
        !onGround
    ) {

        return;

    }


    velocityY =
        jumpPower;


    onGround =
        false;

}


/* =====================================================
   CAMERA TOUCH
===================================================== */

let cameraTouch =
    false;


let lastTouchX =
    0;


let lastTouchY =
    0;


renderer.domElement.addEventListener(

    "touchstart",

    event => {

        if (
            event.touches.length !== 1
        ) {

            return;

        }


        cameraTouch =
            true;


        lastTouchX =
            event.touches[0].clientX;


        lastTouchY =
            event.touches[0].clientY;

    },

    {
        passive: true
    }

);


renderer.domElement.addEventListener(

    "touchmove",

    event => {

        if (
            !cameraTouch ||
            event.touches.length !== 1
        ) {

            return;

        }


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
            Math.max(

                -0.15,

                Math.min(

                    0.7,

                    cameraPitch

                )

            );

    },

    {
        passive: true
    }

);


renderer.domElement.addEventListener(

    "touchend",

    () => {

        cameraTouch =
            false;

    }

);


/* =====================================================
   ENEMIES
===================================================== */

const enemies = [];


function createEnemy(

    x,
    z

) {


    const enemy =
        new THREE.Group();


    /* Body */

    const body =
        new THREE.Mesh(

            new THREE.SphereGeometry(

                0.9,
                14,
                14

            ),

            material(
                0x542e52
            )

        );


    body.scale.y =
        1.2;


    body.position.y =
        1.0;


    enemy.add(
        body
    );


    /* Head */

    const head =
        new THREE.Mesh(

            new THREE.SphereGeometry(

                0.65,
                14,
                14

            ),

            material(
                0x67405f
            )

        );


    head.position.y =
        2.3;


    enemy.add(
        head
    );


    /* Eyes */

    const eyeMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xff4444

        });


    const eye1 =
        new THREE.Mesh(

            new THREE.SphereGeometry(

                0.09,
                8,
                8

            ),

            eyeMaterial

        );


    eye1.position.set(

        -0.22,
        2.35,
        -0.58

    );


    enemy.add(
        eye1
    );


    const eye2 =
        eye1.clone();


    eye2.position.x =
        0.22;


    enemy.add(
        eye2
    );


    enemy.position.set(

        x,
        0,
        z

    );


    scene.add(
        enemy
    );


    enemies.push({

        mesh: enemy,

        hp: 30,

        alive: true,

        attackTimer: 0

    });

}


createEnemy(
    -12,
    -30
);


createEnemy(
    15,
    -35
);


createEnemy(
    -25,
    -55
);


createEnemy(
    28,
    -55
);


/* =====================================================
   SPELLS
===================================================== */

const spells = [];


document
    .getElementById("spell")
    .addEventListener(

        "click",

        castSpell

    );


function castSpell() {


    if (
        magic < 10
    ) {

        showMessage(
            "Not enough magic!"
        );

        return;

    }


    magic -= 10;


    updateHUD();


    const spell =
        new THREE.Mesh(

            new THREE.SphereGeometry(

                0.28,
                16,
                16

            ),

            new THREE.MeshBasicMaterial({

                color:
                    0xffff55

            })

        );


    /* Glow */

    const glow =
        new THREE.Mesh(

            new THREE.SphereGeometry(

                0.6,
                12,
                12

            ),

            new THREE.MeshBasicMaterial({

                color:
                    0xffff00,

                transparent:
                    true,

                opacity:
                    0.22

            })

        );


    spell.add(
        glow
    );


    const direction =
        new THREE.Vector3(

            0,
            0,
            -1

        );


    direction.applyQuaternion(

        player.quaternion

    );


    spell.position.copy(
        player.position
    );


    spell.position.y +=
        2.8;


    spell.position.add(

        direction
            .clone()
            .multiplyScalar(1.5)

    );


    scene.add(
        spell
    );


    spells.push({

        mesh: spell,

        direction:
            direction.clone(),

        distance: 0

    });


    rightArm.rotation.z =
        -0.9;


    setTimeout(

        () => {

            rightArm.rotation.z =
                0.45;

        },

        150

    );

}


/* =====================================================
   SPELL UPDATE
===================================================== */

function updateSpells() {


    for (
        let i = spells.length - 1;
        i >= 0;
        i--
    ) {


        const spell =
            spells[i];


        spell.mesh.position.add(

            spell.direction
                .clone()
                .multiplyScalar(0.9)

        );


        spell.mesh.rotation.x +=
            0.15;


        spell.mesh.rotation.y +=
            0.18;


        spell.distance +=
            0.9;


        /* Enemy collision */

        enemies.forEach(

            enemy => {

                if (
                    !enemy.alive
                ) {

                    return;

                }


                const distance =
                    spell.mesh.position
                        .distanceTo(
                            enemy.mesh.position
                        );


                if (
                    distance < 1.8
                ) {

                    enemy.hp -=
                        15;


                    showMessage(
                        "✨ Spell hit!"
                    );


                    scene.remove(
                        spell.mesh
                    );


                    const index =
                        spells.indexOf(
                            spell
                        );


                    if (
                        index !== -1
                    ) {

                        spells.splice(
                            index,
                            1
                        );

                    }


                    if (
                        enemy.hp <= 0
                    ) {

                        enemy.alive =
                            false;


                        enemy.mesh.visible =
                            false;


                        xp +=
                            25;


                        updateHUD();


                        showMessage(
                            "⭐ Enemy defeated! +25 XP"
                        );

                    }

                }

            }

        );


        if (
            spell.distance > 75
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


/* =====================================================
   ENEMY AI
===================================================== */

function updateEnemies() {


    enemies.forEach(

        enemy => {

            if (
                !enemy.alive
            ) {

                return;

            }


            const distance =
                enemy.mesh.position
                    .distanceTo(
                        player.position
                    );


            /* Move toward player */

            if (
                distance < 25 &&
                distance > 2.5
            ) {

                const direction =
                    new THREE.Vector3(

                        player.position.x -
                        enemy.mesh.position.x,

                        0,

                        player.position.z -
                        enemy.mesh.position.z

                    );


                direction.normalize();


                enemy.mesh.position.add(

                    direction
                        .multiplyScalar(0.035)

                );


                enemy.mesh.rotation.y =
                    Math.atan2(

                        direction.x,
                        direction.z

                    );

            }


            /* Attack */

            enemy.attackTimer -=
                1;


            if (
                distance < 2.5 &&
                enemy.attackTimer <= 0
            ) {

                hp -=
                    8;


                hp =
                    Math.max(
                        0,
                        hp
                    );


                enemy.attackTimer =
                    90;


                updateHUD();


                showMessage(
                    "⚠️ You were attacked!"
                );


                if (
                    hp <= 0
                ) {

                    respawn();

                }

            }

        }

    );

}


/* =====================================================
   RESPAWN
===================================================== */

function respawn() {


    hp =
        100;


    magic =
        100;


    player.position.set(

        0,
        0,
        20

    );


    cameraYaw =
        0;


    updateHUD();


    showMessage(
        "You returned to the valley."
    );

}


/* =====================================================
   MOVEMENT
===================================================== */

const moveDirection =
    new THREE.Vector3();


function updatePlayer() {


    let forward =
        -joystickY;


    let sideways =
        joystickX;


    if (
        keys.forward
    ) {

        forward = 1;

    }


    if (
        keys.backward
    ) {

        forward = -1;

    }


    if (
        keys.left
    ) {

        sideways = -1;

    }


    if (
        keys.right
    ) {

        sideways = 1;

    }


    const moving =
        Math.abs(forward) > 0.05 ||
        Math.abs(sideways) > 0.05;


    if (
        moving
    ) {


        const angle =
            cameraYaw;


        const forwardX =
            -Math.sin(angle);


        const forwardZ =
            -Math.cos(angle);


        const rightX =
            Math.cos(angle);


        const rightZ =
            -Math.sin(angle);


        moveDirection.set(

            forwardX * forward +
            rightX * sideways,

            0,

            forwardZ * forward +
            rightZ * sideways

        );


        if (
            moveDirection.length() > 1
        ) {

            moveDirection.normalize();

        }


        const speed =
            0.19;


        player.position.x +=
            moveDirection.x *
            speed;


        player.position.z +=
            moveDirection.z *
            speed;


        /* Turn wizard */

        const targetRotation =
            Math.atan2(

                moveDirection.x,
                moveDirection.z

            );


        player.rotation.y =
            targetRotation;


        /* Walking animation */

        const walk =
            Math.sin(

                performance.now() *
                0.012

            ) * 0.13;


        leftArm.rotation.z =
            -0.45 - walk;


        rightArm.rotation.z =
            0.45 + walk;

    }


    /* Gravity */

    velocityY +=
        gravity;


    player.position.y +=
        velocityY;


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


    /* World boundary */

    player.position.x =
        Math.max(

            -92,

            Math.min(

                92,

                player.position.x

            )

        );


    player.position.z =
        Math.max(

            -105,

            Math.min(

                35,

                player.position.z

            )

        );

}


/* =====================================================
   CAMERA
===================================================== */

function updateCamera() {


    const target =
        new THREE.Vector3(

            player.position.x,

            player.position.y + 2.8,

            player.position.z

        );


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


    const cameraX =
        player.position.x -
        Math.sin(cameraYaw) *
        horizontal;


    const cameraZ =
        player.position.z -
        Math.cos(cameraYaw) *
        horizontal;


    camera.position.set(

        cameraX,

        player.position.y +
        4.2 +
        vertical,

        cameraZ

    );


    camera.lookAt(
        target
    );

}


/* =====================================================
   MAGIC REGENERATION
===================================================== */

let magicTimer =
    0;


function regenerateMagic() {


    magicTimer +=
        1;


    if (
        magicTimer >= 30
    ) {

        magicTimer =
            0;


        if (
            magic < 100
        ) {

            magic +=
                1;


            magic =
                Math.min(
                    100,
                    magic
                );


            updateHUD();

        }

    }

}


/* =====================================================
   QUEST
===================================================== */

const questText =
    document.getElementById(
        "questText"
    );


function updateQuest() {


    const distanceToCastle =
        player.position.distanceTo(

            new THREE.Vector3(

                0,
                0,
                -74

            )

        );


    if (
        distanceToCastle < 12
    ) {

        questText.textContent =
            "Enter the ancient castle";

    }
    else if (
        player.position.z < -40
    ) {

        questText.textContent =
            "Explore the castle courtyard";

    }
    else {

        questText.textContent =
            "Explore the magical valley";

    }

}


/* =====================================================
   MESSAGE
===================================================== */

let messageTimer;


function showMessage(
    text
) {


    const message =
        document.getElementById(
            "message"
        );


    message.textContent =
        text;


    message.style.opacity =
        "1";


    clearTimeout(
        messageTimer
    );


    messageTimer =
        setTimeout(

            () => {

                message.style.opacity =
                    "0";

            },

            2200

        );

}


/* =====================================================
   DAY/NIGHT
===================================================== */

let worldTime =
    0;


function updateWorld() {


    worldTime +=
        0.00018;


    const cycle =
        (
            Math.sin(
                worldTime
            ) + 1
        ) / 2;


    const sky =
        new THREE.Color();


    sky.setHSL(

        0.56,

        0.45,

        0.46 +
        cycle * 0.12

    );


    scene.background =
        sky;


    scene.fog.color.copy(
        sky
    );

}


/* =====================================================
   RESIZE
===================================================== */

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


/* =====================================================
   GAME LOOP
===================================================== */

function animate() {


    requestAnimationFrame(
        animate
    );


    updatePlayer();


    updateCamera();


    updateSpells();


    updateEnemies();


    regenerateMagic();


    updateQuest();


    updateWorld();


    renderer.render(

        scene,
        camera

    );

}


/* =====================================================
   START
===================================================== */

updateHUD();


updateCamera();


showMessage(
    "✨ Welcome to the magical valley!"
);


animate();
