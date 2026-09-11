/* =========================================================
   AETHERIA ACADEMY - 3D WIZARDING WORLD
   AREN VALEN PLAYER SYSTEM

   Features:
   - Aren Valen GLB
   - Natural standing pose
   - Procedural walking
   - Running-style movement
   - Jump
   - Wand
   - Spell casting
   - Third-person camera
   - Touch camera rotation
   - Mobile joystick
   - Keyboard controls
   - DRACO GLB support
   ========================================================= */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";


/* =========================================================
   GAME ELEMENTS
   ========================================================= */

const game = document.getElementById("game");
const loading = document.getElementById("loading");

const joystickBase =
    document.getElementById("joystickBase");

const joystickStick =
    document.getElementById("joystickStick");

const jumpBtn =
    document.getElementById("jumpBtn");

const spellBtn =
    document.getElementById("spellBtn");


/* =========================================================
   MOBILE SETTINGS
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

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x87a8bd);

scene.fog =
    new THREE.Fog(
        0x87a8bd,
        40,
        220
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

camera.position.set(
    0,
    3.5,
    8
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
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

const hemiLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x405060,
        2.2
    );

scene.add(hemiLight);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sun.position.set(
    30,
    60,
    20
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;

scene.add(sun);


/* =========================================================
   GROUND
   ========================================================= */

const groundGeometry =
    new THREE.PlaneGeometry(
        400,
        400
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x536b4d,
        roughness: 1
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   SIMPLE TREES
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
                0.35 * scale,
                0.5 * scale,
                4 * scale,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x5a3925,
                roughness: 1
            })
        );

    trunk.position.y =
        2 * scale;

    trunk.castShadow = true;

    tree.add(trunk);


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.2 * scale,
                16,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x315d32,
                roughness: 1
            })
        );

    leaves.position.y =
        5 * scale;

    leaves.castShadow = true;

    tree.add(leaves);


    tree.position.set(
        x,
        0,
        z
    );

    scene.add(tree);
}


for (let i = 0; i < 35; i++) {

    const angle =
        Math.random() *
        Math.PI *
        2;

    const distance =
        25 +
        Math.random() * 80;

    createTree(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        0.7 +
        Math.random() * 0.8
    );
}


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

loader.load(

    "./assets/player/aren_valen.glb",

    function (gltf) {

        player =
            gltf.scene;


        player.position.set(
            0,
            0,
            0
        );


        player.scale.set(
            1,
            1,
            1
        );


        /* -----------------------------------------
           FIND ALL BONES
           ----------------------------------------- */

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


        /* -----------------------------------------
           FIND RIGHT HAND
           ----------------------------------------- */

        rightHand =
            playerBones["RightHand"] ||
            null;


        scene.add(player);


        /* -----------------------------------------
           CREATE WAND
           ----------------------------------------- */

        createWand();


        /* -----------------------------------------
           IMPORTANT:
           START IN NORMAL STANDING POSE
           ----------------------------------------- */

        resetAnimatedBones();

        applyStandingPose();


        if (loading) {
            loading.style.display = "none";
        }


        console.log(
            "================================="
        );

        console.log(
            "AREN VALEN LOADED"
        );

        console.log(
            "Bones:",
            Object.keys(playerBones)
        );

        console.log(
            "================================="
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
                "Player loading:",
                percent.toFixed(0) + "%"
            );

        }

    },


    function (error) {

        console.error(
            "PLAYER ERROR:",
            error
        );


        if (loading) {

            loading.innerHTML =
                "Player failed to load.";

        }

    }

);


/* =========================================================
   BONE FUNCTIONS
   ========================================================= */

function getBone(name) {

    return playerBones[name] ||
        null;

}


/* =========================================================
   SET BONE OFFSET
   ========================================================= */

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
   NATURAL STANDING POSE
   =========================================================

   IMPORTANT:

   Your GLB is originally a T-pose.

   The arm direction of this particular
   skeleton requires X-axis rotation.

   LeftArm  = +90 degrees X
   RightArm = +90 degrees X

   This is the main correction.
   ========================================================= */

function applyStandingPose() {

    /* -----------------------------------------
       SHOULDERS
       ----------------------------------------- */

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


    /* -----------------------------------------
       LEFT ARM
       ----------------------------------------- */

    setBoneOffset(
        "LeftArm",
        Math.PI / 2,
        0,
        0
    );


    /* -----------------------------------------
       RIGHT ARM
       ----------------------------------------- */

    setBoneOffset(
        "RightArm",
        Math.PI / 2,
        0,
        0
    );


    /* -----------------------------------------
       FOREARMS
       ----------------------------------------- */

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


    /* -----------------------------------------
       EXTRA FOREARM BONES
       ----------------------------------------- */

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

    if (!rightHand) {

        console.warn(
            "Right hand not found."
        );

        return;

    }


    wand =
        new THREE.Group();


    /* -----------------------------------------
       WAND HANDLE
       ----------------------------------------- */

    const handle =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.045,
                0.06,
                0.75,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x21150c,
                roughness: 0.7
            })
        );


    handle.rotation.z =
        Math.PI / 2;


    wand.add(handle);


    /* -----------------------------------------
       WAND TIP
       ----------------------------------------- */

    const tip =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.025,
                0.045,
                0.5,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x3b2415,
                roughness: 0.7
            })
        );


    tip.position.x =
        0.6;

    tip.rotation.z =
        Math.PI / 2;


    wand.add(tip);


    /* -----------------------------------------
       ATTACH WAND TO HAND
       ----------------------------------------- */

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


/* =========================================================
   RESET JOYSTICK
   ========================================================= */

function resetJoystick() {

    joystickX = 0;
    joystickY = 0;

    joystickActive = false;


    if (joystickStick) {

        joystickStick.style.transform =
            "translate(0px, 0px)";

    }

}


/* =========================================================
   JOYSTICK TOUCH START
   ========================================================= */

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
   KEYBOARD CONTROLS
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
        ) {

            return;

        }


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
   MOUSE CAMERA
   ========================================================= */

let mouseDown = false;


window.addEventListener(
    "mousedown",
    function (event) {

        mouseDown = true;

        lastTouchX =
            event.clientX;

        lastTouchY =
            event.clientY;

    }
);


window.addEventListener(
    "mousemove",
    function (event) {

        if (!mouseDown)
            return;


        const dx =
            event.clientX -
            lastTouchX;


        const dy =
            event.clientY -
            lastTouchY;


        lastTouchX =
            event.clientX;


        lastTouchY =
            event.clientY;


        cameraYaw -=
            dx * 0.005;


        cameraPitch -=
            dy * 0.003;


        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -0.15,
                0.85
            );

    }
);


window.addEventListener(
    "mouseup",
    function () {

        mouseDown = false;

    }
);


/* =========================================================
   JUMP
   ========================================================= */

let velocityY = 0;

let isJumping = false;


const gravity = -20;

const jumpPower = 8;


/* =========================================================
   JUMP FUNCTION
   ========================================================= */

function jump() {

    if (!player)
        return;


    if (isJumping)
        return;


    velocityY =
        jumpPower;


    isJumping = true;

}


/* =========================================================
   JUMP BUTTON
   ========================================================= */

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
        function () {

            jump();

        }
    );

}


/* =========================================================
   SPELL
   ========================================================= */

let isCasting = false;

let castTimer = 0;

const castDuration = 0.65;


/* =========================================================
   SPELL BUTTON
   ========================================================= */

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
        function () {

            castSpell();

        }
    );

}


/* =========================================================
   CAST SPELL
   ========================================================= */

function castSpell() {

    if (!player)
        return;


    if (isCasting)
        return;


    isCasting = true;

    castTimer = 0;


    createSpellProjectile();

}


/* =========================================================
   SPELL PROJECTILE
   ========================================================= */

function createSpellProjectile() {

    if (!player)
        return;


    const geometry =
        new THREE.SphereGeometry(
            0.12,
            12,
            12
        );


    const material =
        new THREE.MeshBasicMaterial({
            color: 0x8fd8ff
        });


    const projectile =
        new THREE.Mesh(
            geometry,
            material
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


    scene.add(
        projectile
    );


    let life = 0;


    function updateProjectile() {

        const delta = 1 / 60;

        life += delta;


        projectile.position.add(
            direction
                .clone()
                .multiplyScalar(
                    22 * delta
                )
        );


        if (life > 2) {

            scene.remove(
                projectile
            );

            projectile.geometry.dispose();
            projectile.material.dispose();

            return;

        }


        requestAnimationFrame(
            updateProjectile
        );

    }


    updateProjectile();

}


/* =========================================================
   WALK ANIMATION
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


    /* -----------------------------------------
       LEGS
       ----------------------------------------- */

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


    /* -----------------------------------------
       LOWER LEGS
       ----------------------------------------- */

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


    /* -----------------------------------------
       FEET
       ----------------------------------------- */

    setBoneOffset(
        "LeftFoot",
        Math.max(
            0,
            swing
        ) *
        0.18 *
        strength,
        0,
        0
    );


    setBoneOffset(
        "RightFoot",
        Math.max(
            0,
            opposite
        ) *
        0.18 *
        strength,
        0,
        0
    );


    /* -----------------------------------------
       LEFT ARM
       ----------------------------------------- */

    setBoneOffset(
        "LeftArm",
        Math.PI / 2 +
        opposite *
        0.18 *
        strength,
        0,
        0
    );


    /* -----------------------------------------
       RIGHT ARM
       ----------------------------------------- */

    setBoneOffset(
        "RightArm",
        Math.PI / 2 +
        swing *
        0.08 *
        strength,
        0,
        0
    );


    /* -----------------------------------------
       FOREARMS
       ----------------------------------------- */

    setBoneOffset(
        "LeftForeArm",
        0.12 +
        opposite *
        0.08 *
        strength,
        0,
        0
    );


    setBoneOffset(
        "RightForeArm",
        0.12 +
        swing *
        0.04 *
        strength,
        0,
        0
    );


    /* -----------------------------------------
       BODY BOB
       ----------------------------------------- */

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
   IDLE ANIMATION
   ========================================================= */

function applyIdleAnimation(
    elapsed
) {

    /* Start from normal standing */
    applyStandingPose();


    const breathing =
        Math.sin(
            elapsed * 2
        );


    const gentle =
        Math.sin(
            elapsed * 1.2
        );


    /* Small breathing motion */

    setBoneOffset(
        "Spine",
        breathing *
        0.008,
        0,
        gentle *
        0.008
    );


    /* Small natural head movement */

    setBoneOffset(
        "Head",
        0,
        gentle *
        0.015,
        0
    );

}


/* =========================================================
   JUMP ANIMATION
   ========================================================= */

function applyJumpAnimation() {

    applyStandingPose();


    /* Legs bend */

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


    /* Arms slightly raised */

    setBoneOffset(
        "LeftArm",
        Math.PI / 2 -
        0.15,
        0,
        0
    );


    setBoneOffset(
        "RightArm",
        Math.PI / 2 -
        0.15,
        0,
        0
    );

}


/* =========================================================
   CASTING ANIMATION
   ========================================================= */

function applyCastingAnimation() {

    applyStandingPose();


    /* -----------------------------------------
       WAND ARM RAISES
       ----------------------------------------- */

    setBoneOffset(
        "RightArm",
        Math.PI / 2 -
        0.75,
        0,
        0
    );


    setBoneOffset(
        "RightForeArm",
        0.12 -
        0.45,
        0,
        0
    );


    setBoneOffset(
        "RightForeArm1",
        0.04 -
        0.15,
        0,
        0
    );


    /* Body leans slightly */

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


    /* =====================================================
       INPUT
       ===================================================== */

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


    /* =====================================================
       CAMERA RELATIVE MOVEMENT
       ===================================================== */

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


    /* =====================================================
       MOVE PLAYER
       ===================================================== */

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


        /* -----------------------------------------
           TURN PLAYER
           ----------------------------------------- */

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


    /* =====================================================
       JUMP PHYSICS
       ===================================================== */

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


    /* =====================================================
       ANIMATION
       ===================================================== */

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


    /* =====================================================
       SPELL TIMER
       ===================================================== */

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


    const distance = 7;

    const height = 3.2;


    const target =
        player.position.clone();


    target.y += 1.4;


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


    const desiredPosition =
        target.clone()
            .add(offset);


    const smoothing =
        1 -
        Math.pow(
            0.001,
            delta
        );


    camera.position.lerp(
        desiredPosition,
        smoothing
    );


    camera.lookAt(
        target
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
   CLOCK
   ========================================================= */

const clock =
    new THREE.Clock();


/* =========================================================
   GAME LOOP
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


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================================
   DEBUG
   ========================================================= */

console.log(
    "Aetheria Academy 3D started"
);

console.log(
    "Joystick = Move"
);

console.log(
    "Drag screen = Camera"
);

console.log(
    "Jump = Jump"
);

console.log(
    "Spell = Cast"
);
