/* =====================================================
   WIZARDING WORLD 3D
   STAGE 1
   COMPLETE 3D TEST
===================================================== */


/* =====================================================
   CHECK THREE.JS
===================================================== */

if (typeof THREE === "undefined") {

    document.body.innerHTML = `

        <div style="
            width:100%;
            height:100vh;
            background:#070b18;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            font-family:Arial;
            padding:30px;
        ">

            <div>

                <h2>
                    3D Engine Could Not Load
                </h2>

                <p style="margin-top:15px;">
                    Please check your internet connection
                    and reload the page.
                </p>

            </div>

        </div>

    `;

    throw new Error(
        "Three.js did not load."
    );

}


/* =====================================================
   SCENE
===================================================== */

const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x78b5df
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


camera.position.set(

    0,

    7,

    14

);


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
    new THREE.AmbientLight(

        0xffffff,

        2

    );


scene.add(
    ambientLight
);


const sunlight =
    new THREE.DirectionalLight(

        0xffffff,

        3

    );


sunlight.position.set(

    20,

    30,

    10

);


scene.add(
    sunlight
);


/* =====================================================
   GROUND
===================================================== */

const groundGeometry =
    new THREE.PlaneGeometry(

        200,

        200

    );


const groundMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x3d7835,

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


ground.position.y =
    0;


scene.add(
    ground
);


/* =====================================================
   PATH
===================================================== */

const pathGeometry =
    new THREE.PlaneGeometry(

        7,

        100

    );


const pathMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x9b8062

    });


const path =
    new THREE.Mesh(

        pathGeometry,

        pathMaterial

    );


path.rotation.x =
    -Math.PI / 2;


path.position.set(

    0,

    0.01,

    -35

);


scene.add(
    path
);


/* =====================================================
   CASTLE BUILDING
===================================================== */

const castleGeometry =
    new THREE.BoxGeometry(

        24,

        17,

        13

    );


const castleMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x777777,

        roughness:
            0.9

    });


const castle =
    new THREE.Mesh(

        castleGeometry,

        castleMaterial

    );


castle.position.set(

    0,

    8.5,

    -50

);


scene.add(
    castle
);


/* =====================================================
   CASTLE DOOR
===================================================== */

const doorGeometry =
    new THREE.BoxGeometry(

        3,

        5,

        0.5

    );


const doorMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x301d12

    });


const door =
    new THREE.Mesh(

        doorGeometry,

        doorMaterial

    );


door.position.set(

    0,

    2.5,

    -43.3

);


scene.add(
    door
);


/* =====================================================
   CASTLE WINDOWS
===================================================== */

function createWindow(

    x,
    y,
    z

) {

    const geometry =
        new THREE.BoxGeometry(

            1.5,

            2.5,

            0.3

        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                0x9edfff

        });


    const window =
        new THREE.Mesh(

            geometry,

            material

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


createWindow(
    -7,
    8,
    -43.3
);


createWindow(
    7,
    8,
    -43.3
);


createWindow(
    -7,
    12,
    -43.3
);


createWindow(
    7,
    12,
    -43.3
);


/* =====================================================
   TOWER FUNCTION
===================================================== */

function createTower(

    x,
    z

) {


    const towerGeometry =
        new THREE.CylinderGeometry(

            3.5,

            3.5,

            27,

            12

        );


    const towerMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x686868

        });


    const tower =
        new THREE.Mesh(

            towerGeometry,

            towerMaterial

        );


    tower.position.set(

        x,

        13.5,

        z

    );


    scene.add(
        tower
    );


    /* Roof */

    const roofGeometry =
        new THREE.ConeGeometry(

            4.5,

            8,

            12

        );


    const roofMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x292238

        });


    const roof =
        new THREE.Mesh(

            roofGeometry,

            roofMaterial

        );


    roof.position.set(

        x,

        31,

        z

    );


    scene.add(
        roof
    );


}


/* Create towers */

createTower(
    -15,
    -50
);


createTower(
    15,
    -50
);


/* =====================================================
   TREE FUNCTION
===================================================== */

function createTree(

    x,
    z,
    scale = 1

) {


    /* Trunk */

    const trunkGeometry =
        new THREE.CylinderGeometry(

            0.4 * scale,

            0.6 * scale,

            3 * scale,

            8

        );


    const trunkMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x58351d

        });


    const trunk =
        new THREE.Mesh(

            trunkGeometry,

            trunkMaterial

        );


    trunk.position.set(

        x,

        1.5 * scale,

        z

    );


    scene.add(
        trunk
    );


    /* Leaves */

    const leavesGeometry =
        new THREE.SphereGeometry(

            2.2 * scale,

            12,

            12

        );


    const leavesMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x215c2a

        });


    const leaves =
        new THREE.Mesh(

            leavesGeometry,

            leavesMaterial

        );


    leaves.position.set(

        x,

        4.2 * scale,

        z

    );


    scene.add(
        leaves
    );

}


/* =====================================================
   TREES
===================================================== */

createTree(
    -12,
    -8,
    1
);


createTree(
    12,
    -8,
    1
);


createTree(
    -18,
    -18,
    1.2
);


createTree(
    18,
    -18,
    1.2
);


createTree(
    -14,
    8,
    0.9
);


createTree(
    14,
    8,
    0.9
);


createTree(
    -25,
    -30,
    1.3
);


createTree(
    25,
    -30,
    1.3
);


/* =====================================================
   PLAYER
===================================================== */

const player =
    new THREE.Group();


/* =====================================================
   PLAYER BODY
===================================================== */

const bodyGeometry =
    new THREE.CylinderGeometry(

        0.7,

        0.85,

        2,

        16

    );


const bodyMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x38205c

    });


const body =
    new THREE.Mesh(

        bodyGeometry,

        bodyMaterial

    );


body.position.y =
    2;


player.add(
    body
);


/* =====================================================
   PLAYER HEAD
===================================================== */

const headGeometry =
    new THREE.SphereGeometry(

        0.65,

        20,

        20

    );


const headMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0xffc39e

    });


const head =
    new THREE.Mesh(

        headGeometry,

        headMaterial

    );


head.position.y =
    3.5;


player.add(
    head
);


/* =====================================================
   WIZARD HAT
===================================================== */

const hatGeometry =
    new THREE.ConeGeometry(

        0.95,

        1.8,

        16

    );


const hatMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x28114a

    });


const hat =
    new THREE.Mesh(

        hatGeometry,

        hatMaterial

    );


hat.position.y =
    4.7;


player.add(
    hat
);


/* =====================================================
   HAT BRIM
===================================================== */

const brimGeometry =
    new THREE.CylinderGeometry(

        1.1,

        1.1,

        0.15,

        16

    );


const brim =
    new THREE.Mesh(

        brimGeometry,

        hatMaterial

    );


brim.position.y =
    4;


player.add(
    brim
);


/* =====================================================
   WAND
===================================================== */

const wandGeometry =
    new THREE.CylinderGeometry(

        0.06,

        0.08,

        2.2,

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

    1.2,

    2.5,

    -0.3

);


player.add(
    wand
);


/* =====================================================
   PLAYER START
===================================================== */

player.position.set(

    0,

    0,

    8

);


scene.add(
    player
);


/* =====================================================
   MOVEMENT
===================================================== */

const keys = {

    up: false,

    down: false,

    left: false,

    right: false

};


const playerSpeed =
    0.22;


/* =====================================================
   BUTTON SETUP
===================================================== */

function setupButton(

    id,
    direction

) {

    const button =
        document.getElementById(
            id
        );


    if (!button) {
        return;
    }


    button.addEventListener(

        "touchstart",

        function(event) {

            event.preventDefault();

            keys[direction] =
                true;

        },

        {
            passive: false
        }

    );


    button.addEventListener(

        "touchend",

        function(event) {

            event.preventDefault();

            keys[direction] =
                false;

        },

        {
            passive: false
        }

    );


    button.addEventListener(

        "touchcancel",

        function() {

            keys[direction] =
                false;

        }

    );


    button.addEventListener(

        "mousedown",

        function() {

            keys[direction] =
                true;

        }

    );


    button.addEventListener(

        "mouseup",

        function() {

            keys[direction] =
                false;

        }

    );


    button.addEventListener(

        "mouseleave",

        function() {

            keys[direction] =
                false;

        }

    );

}


/* Buttons */

setupButton(
    "up",
    "up"
);


setupButton(
    "down",
    "down"
);


setupButton(
    "left",
    "left"
);


setupButton(
    "right",
    "right"
);


/* =====================================================
   KEYBOARD
===================================================== */

window.addEventListener(

    "keydown",

    function(event) {

        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            keys.up = true;

        }


        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            keys.down = true;

        }


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            keys.left = true;

        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            keys.right = true;

        }

    }

);


window.addEventListener(

    "keyup",

    function(event) {

        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            keys.up = false;

        }


        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            keys.down = false;

        }


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            keys.left = false;

        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            keys.right = false;

        }

    }

);


/* =====================================================
   SPELL
===================================================== */

const spellButton =
    document.getElementById(
        "spell"
    );


spellButton.addEventListener(

    "click",

    castSpell

);


function castSpell() {


    const spellGeometry =
        new THREE.SphereGeometry(

            0.3,

            16,

            16

        );


    const spellMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffff00

        });


    const spell =
        new THREE.Mesh(

            spellGeometry,

            spellMaterial

        );


    spell.position.set(

        player.position.x,

        player.position.y + 2.5,

        player.position.z - 1

    );


    scene.add(
        spell
    );


    let distance =
        0;


    function moveSpell() {


        spell.position.z -=
            0.8;


        distance +=
            0.8;


        if (
            distance < 60
        ) {

            requestAnimationFrame(
                moveSpell
            );

        }
        else {

            scene.remove(
                spell
            );

        }

    }


    moveSpell();

}


/* =====================================================
   CAMERA
===================================================== */

function updateCamera() {


    camera.position.x =
        player.position.x;


    camera.position.y =
        7;


    camera.position.z =
        player.position.z + 14;


    camera.lookAt(

        player.position.x,

        2.5,

        player.position.z - 5

    );

}


/* =====================================================
   GAME LOOP
===================================================== */

function animate() {


    requestAnimationFrame(
        animate
    );


    /* Player movement */

    if (keys.up) {

        player.position.z -=
            playerSpeed;

    }


    if (keys.down) {

        player.position.z +=
            playerSpeed;

    }


    if (keys.left) {

        player.position.x -=
            playerSpeed;

    }


    if (keys.right) {

        player.position.x +=
            playerSpeed;

    }


    /* World boundaries */

    player.position.x =
        Math.max(

            -80,

            Math.min(

                80,

                player.position.x

            )

        );


    player.position.z =
        Math.max(

            -90,

            Math.min(

                40,

                player.position.z

            )

        );


    /* Camera */

    updateCamera();


    /* Render */

    renderer.render(

        scene,

        camera

    );

}


/* =====================================================
   RESIZE
===================================================== */

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


/* =====================================================
   START
===================================================== */

updateCamera();

animate();
