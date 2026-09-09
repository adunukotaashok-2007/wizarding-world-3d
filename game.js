/* =====================================================
   WIZARDING WORLD 3D
   STAGE 2

   Mobile 3D Adventure Prototype

   Features:
   - Third person wizard
   - Joystick movement
   - Camera swipe
   - Jump
   - Castle
   - Village
   - Forest
   - Lake
   - Mountains
   - Magic projectile
===================================================== */


/* =====================================================
   THREE.JS CHECK
===================================================== */

if (typeof THREE === "undefined") {

    document.body.innerHTML = `

        <div style="
            height:100vh;
            background:#07101f;
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

                <p style="margin-top:15px;">
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
        "Three.js failed to load."
    );

}


/* =====================================================
   SCENE
===================================================== */

const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x78b4d8
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

        1000

    );


let cameraYaw = 0;

let cameraPitch = 0.25;

const cameraDistance = 10;


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

const ambientLight =
    new THREE.HemisphereLight(

        0xcfe8ff,

        0x35552f,

        2.2

    );


scene.add(
    ambientLight
);


const sun =
    new THREE.DirectionalLight(

        0xffffff,

        3

    );


sun.position.set(

    40,
    60,
    20

);


scene.add(
    sun
);


/* =====================================================
   GROUND
===================================================== */

const groundGeometry =
    new THREE.PlaneGeometry(

        220,
        220

    );


const groundMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x3d7438,

        roughness:
            1

    });


const ground =
    new THREE.Mesh(

        groundGeometry,
        groundMaterial

    );


ground.rotation.x =
    -Math.PI / 2;


scene.add(
    ground
);


/* =====================================================
   PATH CREATOR
===================================================== */

function createPath(

    x,
    z,
    width,
    length,
    rotation = 0

) {

    const geometry =
        new THREE.PlaneGeometry(

            width,
            length

        );


    const material =
        new THREE.MeshStandardMaterial({

            color:
                0x9a8062

        });


    const path =
        new THREE.Mesh(

            geometry,
            material

        );


    path.rotation.x =
        -Math.PI / 2;


    path.rotation.z =
        rotation;


    path.position.set(

        x,
        0.02,
        z

    );


    scene.add(
        path
    );

}


/* Main road */

createPath(
    0,
    -25,
    8,
    120
);


/* Village road */

createPath(
    35,
    -30,
    7,
    65
);


/* =====================================================
   LAKE
===================================================== */

const lakeGeometry =
    new THREE.CircleGeometry(

        18,
        40

    );


const lakeMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x2d7fa0,

        transparent:
            true,

        opacity:
            0.85,

        roughness:
            0.2

    });


const lake =
    new THREE.Mesh(

        lakeGeometry,
        lakeMaterial

    );


lake.rotation.x =
    -Math.PI / 2;


lake.position.set(

    -45,
    0.05,
    -30

);


scene.add(
    lake
);


/* =====================================================
   CASTLE
===================================================== */

function createCastle() {


    /* Main building */

    const buildingGeometry =
        new THREE.BoxGeometry(

            30,
            20,
            15

        );


    const buildingMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x777777,

            roughness:
                0.9

        });


    const building =
        new THREE.Mesh(

            buildingGeometry,
            buildingMaterial

        );


    building.position.set(

        0,
        10,
        -65

    );


    scene.add(
        building
    );


    /* Central entrance */

    const entranceGeometry =
        new THREE.BoxGeometry(

            6,
            9,
            2

        );


    const entranceMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x382317

        });


    const entrance =
        new THREE.Mesh(

            entranceGeometry,
            entranceMaterial

        );


    entrance.position.set(

        0,
        4.5,
        -56.8

    );


    scene.add(
        entrance
    );


    /* Castle windows */

    for (
        let x = -10;
        x <= 10;
        x += 5
    ) {

        for (
            let y = 7;
            y <= 15;
            y += 4
        ) {

            if (
                Math.abs(x) < 3 &&
                y < 12
            ) {

                continue;

            }


            const geometry =
                new THREE.BoxGeometry(

                    1.5,
                    2.4,
                    0.25

                );


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        0xb8e7ff

                });


            const window =
                new THREE.Mesh(

                    geometry,
                    material

                );


            window.position.set(

                x,
                y,
                -57.6

            );


            scene.add(
                window
            );

        }

    }


    /* Towers */

    createTower(
        -19,
        -65
    );

    createTower(
        19,
        -65
    );

    createTower(
        -13,
        -58
    );

    createTower(
        13,
        -58
    );

}


function createTower(

    x,
    z

) {


    const geometry =
        new THREE.CylinderGeometry(

            4,
            4,
            30,
            12

        );


    const material =
        new THREE.MeshStandardMaterial({

            color:
                0x666666

        });


    const tower =
        new THREE.Mesh(

            geometry,
            material

        );


    tower.position.set(

        x,
        15,
        z

    );


    scene.add(
        tower
    );


    /* Roof */

    const roofGeometry =
        new THREE.ConeGeometry(

            5,
            9,
            12

        );


    const roofMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x30243e

        });


    const roof =
        new THREE.Mesh(

            roofGeometry,
            roofMaterial

        );


    roof.position.set(

        x,
        34,
        z

    );


    scene.add(
        roof
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


    /* House body */

    const bodyGeometry =
        new THREE.BoxGeometry(

            8 * scale,
            5 * scale,
            7 * scale

        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x8c6d52

        });


    const body =
        new THREE.Mesh(

            bodyGeometry,
            bodyMaterial

        );


    body.position.set(

        x,
        2.5 * scale,
        z

    );


    scene.add(
        body
    );


    /* Roof */

    const roofGeometry =
        new THREE.ConeGeometry(

            6 * scale,
            5 * scale,
            4

        );


    const roofMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x4b2934

        });


    const roof =
        new THREE.Mesh(

            roofGeometry,
            roofMaterial

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


    /* Door */

    const doorGeometry =
        new THREE.BoxGeometry(

            1.5 * scale,
            2.5 * scale,
            0.3 * scale

        );


    const doorMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x3a2115

        });


    const door =
        new THREE.Mesh(

            doorGeometry,
            doorMaterial

        );


    door.position.set(

        x,
        1.25 * scale,
        z - 3.55 * scale

    );


    scene.add(
        door
    );

}


createHouse(
    32,
    -22,
    1
);


createHouse(
    47,
    -30,
    0.9
);


createHouse(
    32,
    -42,
    1.1
);


createHouse(
    50,
    -45,
    0.8
);


/* =====================================================
   TREE
===================================================== */

function createTree(

    x,
    z,
    scale = 1

) {


    /* Trunk */

    const trunkGeometry =
        new THREE.CylinderGeometry(

            0.45 * scale,
            0.65 * scale,
            3.5 * scale,
            8

        );


    const trunkMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x59351e

        });


    const trunk =
        new THREE.Mesh(

            trunkGeometry,
            trunkMaterial

        );


    trunk.position.set(

        x,
        1.75 * scale,
        z

    );


    scene.add(
        trunk
    );


    /* Leaves */

    const leavesGeometry =
        new THREE.SphereGeometry(

            2.4 * scale,
            12,
            12

        );


    const leavesMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x225c2c

        });


    const leaves =
        new THREE.Mesh(

            leavesGeometry,
            leavesMaterial

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


/* =====================================================
   FOREST
===================================================== */

const forestPositions = [

    [-25, -5, 1],
    [-35, -10, 1.2],
    [-45, -5, 1],
    [-55, -12, 1.4],
    [-65, -5, 1.1],

    [-30, 8, 0.9],
    [-42, 12, 1.3],
    [-55, 8, 1],
    [-68, 15, 1.2],

    [25, 5, 1],
    [35, 8, 1.2],
    [50, 5, 1],
    [65, 10, 1.3],

    [-25, -30, 1.1],
    [-30, -40, 1.3],
    [-40, -45, 1],
    [-55, -42, 1.4],

    [25, -60, 1],
    [35, -65, 1.2],
    [50, -60, 1],
    [60, -70, 1.3]

];


forestPositions.forEach(

    position => {

        createTree(

            position[0],
            position[1],
            position[2]

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


    const geometry =
        new THREE.ConeGeometry(

            radius,
            height,
            6

        );


    const material =
        new THREE.MeshStandardMaterial({

            color:
                0x56666b

        });


    const mountain =
        new THREE.Mesh(

            geometry,
            material

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
    -85,
    -70,
    55,
    35
);


createMountain(
    85,
    -75,
    65,
    40
);


createMountain(
    -80,
    10,
    45,
    30
);


createMountain(
    80,
    15,
    50,
    35
);


/* =====================================================
   PLAYER
===================================================== */

const player =
    new THREE.Group();


/* =====================================================
   PLAYER BODY
===================================================== */

const robeGeometry =
    new THREE.CylinderGeometry(

        0.75,
        1.0,
        2.4,
        16

    );


const robeMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x38205c

    });


const robe =
    new THREE.Mesh(

        robeGeometry,
        robeMaterial

    );


robe.position.y =
    2.1;


player.add(
    robe
);


/* =====================================================
   HEAD
===================================================== */

const headGeometry =
    new THREE.SphereGeometry(

        0.68,
        20,
        20

    );


const skinMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0xffc39e

    });


const head =
    new THREE.Mesh(

        headGeometry,
        skinMaterial

    );


head.position.y =
    3.75;


player.add(
    head
);


/* =====================================================
   HAT
===================================================== */

const hatMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x281044

    });


const hatGeometry =
    new THREE.ConeGeometry(

        1.0,
        1.9,
        16

    );


const hat =
    new THREE.Mesh(

        hatGeometry,
        hatMaterial

    );


hat.position.y =
    5.05;


player.add(
    hat
);


/* Hat brim */

const brimGeometry =
    new THREE.CylinderGeometry(

        1.15,
        1.15,
        0.16,
        16

    );


const brim =
    new THREE.Mesh(

        brimGeometry,
        hatMaterial

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


    const geometry =
        new THREE.CylinderGeometry(

            0.18,
            0.22,
            1.7,
            10

        );


    const material =
        new THREE.MeshStandardMaterial({

            color:
                0x38205c

        });


    const arm =
        new THREE.Mesh(

            geometry,
            material

        );


    arm.rotation.z =
        side *
        0.45;


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

const wandGeometry =
    new THREE.CylinderGeometry(

        0.06,
        0.08,
        2.4,
        8

    );


const wandMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x512d18

    });


const wand =
    new THREE.Mesh(

        wandGeometry,
        wandMaterial

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

player.position.set(

    0,
    0,
    15

);


scene.add(
    player
);


/* =====================================================
   PLAYER PHYSICS
===================================================== */

let velocityY = 0;

let onGround = true;

const gravity = -0.018;

const jumpPower = 0.42;


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


/* Touch */

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


joystickBase.addEventListener(

    "touchmove",

    event => {

        event.preventDefault();

        if (!joystickActive) {
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


joystickBase.addEventListener(

    "touchend",

    resetJoystick

);


joystickBase.addEventListener(

    "touchcancel",

    resetJoystick

);


/* =====================================================
   KEYBOARD SUPPORT
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
            key === " "
        ) {

            jump();

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

    if (!onGround) {
        return;
    }


    velocityY =
        jumpPower;


    onGround =
        false;

}


/* =====================================================
   MAGIC
===================================================== */

let magic =
    100;


const magicElement =
    document.getElementById(
        "magic"
    );


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


    magicElement.textContent =
        Math.round(magic);


    /* Spell orb */

    const geometry =
        new THREE.SphereGeometry(

            0.3,
            16,
            16

        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                0xffff66

        });


    const orb =
        new THREE.Mesh(

            geometry,
            material

        );


    /* Glow */

    const glowGeometry =
        new THREE.SphereGeometry(

            0.6,
            12,
            12

        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffff00,

            transparent:
                true,

            opacity:
                0.25

        });


    const glow =
        new THREE.Mesh(

            glowGeometry,
            glowMaterial

        );


    orb.add(
        glow
    );


    /* Starting position */

    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );


    direction.applyQuaternion(
        player.quaternion
    );


    orb.position.copy(
        player.position
    );


    orb.position.y +=
        2.8;


    orb.position.add(

        direction.clone()
            .multiplyScalar(1.5)

    );


    scene.add(
        orb
    );


    let distance =
        0;


    function moveSpell() {


        orb.position.add(

            direction
                .clone()
                .multiplyScalar(0.9)

        );


        distance +=
            0.9;


        orb.rotation.x +=
            0.15;


        orb.rotation.y +=
            0.2;


        if (
            distance < 70
        ) {

            requestAnimationFrame(
                moveSpell
            );

        }
        else {

            scene.remove(
                orb
            );

        }

    }


    moveSpell();

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

            2500

        );

}


/* =====================================================
   CAMERA TOUCH CONTROL
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

                    0.8,

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
   MOVEMENT
===================================================== */

const moveDirection =
    new THREE.Vector3();


function updatePlayer() {


    let forward =
        -joystickY;


    let sideways =
        joystickX;


    if (keys.forward) {
        forward = 1;
    }

    if (keys.backward) {
        forward = -1;
    }

    if (keys.left) {
        sideways = -1;
    }

    if (keys.right) {
        sideways = 1;
    }


    if (
        Math.abs(forward) > 0.05 ||
        Math.abs(sideways) > 0.05
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
            0.18;


        player.position.x +=
            moveDirection.x *
            speed;


        player.position.z +=
            moveDirection.z *
            speed;


        /* Rotate wizard */

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
            ) *
            0.12;


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


    /* World boundaries */

    player.position.x =
        Math.max(

            -95,

            Math.min(

                95,

                player.position.x

            )

        );


    player.position.z =
        Math.max(

            -100,

            Math.min(

                45,

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
            player.position.y + 2.7,
            player.position.z

        );


    const horizontalDistance =
        cameraDistance *
        Math.cos(cameraPitch);


    const verticalDistance =
        cameraDistance *
        Math.sin(cameraPitch);


    const cameraX =
        player.position.x -
        Math.sin(cameraYaw) *
        horizontalDistance;


    const cameraZ =
        player.position.z -
        Math.cos(cameraYaw) *
        horizontalDistance;


    camera.position.set(

        cameraX,

        player.position.y +
        4.5 +
        verticalDistance,

        cameraZ

    );


    camera.lookAt(
        target
    );

}


/* =====================================================
   DAY/NIGHT ATMOSPHERE
===================================================== */

let worldTime =
    0;


function updateWorld() {


    worldTime +=
        0.00025;


    const cycle =
        (Math.sin(worldTime) + 1) / 2;


    const skyColor =
        new THREE.Color();


    skyColor.setHSL(

        0.56,

        0.45,

        0.45 +
        cycle * 0.18

    );


    scene.background =
        skyColor;

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


    updateWorld();


    renderer.render(

        scene,
        camera

    );

}


/* =====================================================
   START
===================================================== */

updateCamera();

showMessage(
    "Explore Hogwarts Valley!"
);

animate();
