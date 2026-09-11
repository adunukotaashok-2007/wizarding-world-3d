/* =========================================================
   WIZARDING WORLD 3D
   PLAYER + CAMERA + MOVEMENT + IDLE + WALK + JUMP + SPELL
   Mobile / GitHub Pages
   ========================================================= */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

/* =========================================================
   BASIC SETUP
   ========================================================= */

const game = document.getElementById("game");
const loading = document.getElementById("loading");

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.touchAction = "none";
game.style.touchAction = "none";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87a8bd);

scene.fog = new THREE.Fog(
    0x87a8bd,
    40,
    220
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
    4,
    8
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;

game.appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight = new THREE.HemisphereLight(
    0xffffff,
    0x405060,
    2.2
);

scene.add(hemiLight);


const sun = new THREE.DirectionalLight(
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

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


/* =========================================================
   SIMPLE WORLD
   ========================================================= */

function createTree(x, z, scale = 1) {

    const group = new THREE.Group();

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

    trunk.position.y = 2 * scale;
    trunk.castShadow = true;

    group.add(trunk);


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

    leaves.position.y = 5 * scale;
    leaves.castShadow = true;

    group.add(leaves);


    group.position.set(
        x,
        0,
        z
    );

    scene.add(group);
}


for (let i = 0; i < 35; i++) {

    const angle =
        Math.random() * Math.PI * 2;

    const distance =
        25 + Math.random() * 80;

    createTree(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        0.7 + Math.random() * 0.8
    );
}


/* =========================================================
   PLAYER
   ========================================================= */

let player = null;

const playerBones = {};

const originalRotations = new Map();

let rightHand = null;


/* =========================================================
   DRACO LOADER
   ========================================================= */

const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);


/* =========================================================
   GLTF LOADER
   ========================================================= */

const loader = new GLTFLoader();

loader.setDRACOLoader(
    dracoLoader
);


/* =========================================================
   LOAD CHARACTER
   ========================================================= */

loader.load(

    "./assets/player/aren_valen.glb",

    function (gltf) {

        player = gltf.scene;

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


        player.traverse(function (object) {

            if (object.isMesh) {

                object.castShadow = true;
                object.receiveShadow = true;

            }

            if (object.isBone) {

                playerBones[object.name] = object;

                originalRotations.set(
                    object.name,
                    {
                        x: object.rotation.x,
                        y: object.rotation.y,
                        z: object.rotation.z
                    }
                );

            }

        });


        rightHand =
            playerBones["RightHand"] ||
            playerBones["RightHandIndex1"];


        scene.add(player);


        createWand();


        /* IMPORTANT:
           Immediately put character into normal pose.
        */

        resetAnimatedBones();
        applyStandingPose();


        loading.style.display = "none";


        console.log(
            "Aren Valen loaded successfully"
        );

        console.log(
            "Bones:",
            Object.keys(playerBones)
        );

    },

    function (xhr) {

        if (xhr.total > 0) {

            const percent =
                (xhr.loaded / xhr.total) * 100;

            console.log(
                "Loading player:",
                percent.toFixed(0) + "%"
            );

        }

    },

    function (error) {

        console.error(
            "PLAYER LOAD ERROR:",
            error
        );

        loading.innerHTML =
            "Player could not be loaded.";

    }

);


/* =========================================================
   BONE HELPERS
   ========================================================= */

function getBone(name) {

    return playerBones[name] || null;

}


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
   RESET ANIMATED BONES
   ========================================================= */

function resetAnimatedBones() {

    originalRotations.forEach(
        (rotation, name) => {

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
   ========================================================= */

/*
   The original model is a T-pose.

   These rotations bring the arms down beside
   the body.

   The exact skeleton was checked, so these
   names match Aren's model.
*/

function applyStandingPose() {

    /* -------------------------
       SHOULDERS
       ------------------------- */

    setBoneOffset(
        "LeftShoulder",
        0,
        0,
        0.10
    );

    setBoneOffset(
        "RightShoulder",
        0,
        0,
        -0.10
    );


    /* -------------------------
       LEFT ARM
       ------------------------- */

    setBoneOffset(
        "LeftArm",
        0,
        0,
        1.05
    );

    setBoneOffset(
        "LeftForeArm",
        0.15,
        0,
        0.35
    );


    /* -------------------------
       RIGHT ARM
       ------------------------- */

    setBoneOffset(
        "RightArm",
        0,
        0,
        -1.05
    );

    setBoneOffset(
        "RightForeArm",
        0.15,
        0,
        -0.35
    );


    /* -------------------------
       ELBOW / EXTRA FOREARM
       ------------------------- */

    setBoneOffset(
        "LeftForeArm1",
        0.08,
        0,
        0.08
    );

    setBoneOffset(
        "RightForeArm1",
        0.08,
        0,
        -0.08
    );


    /* -------------------------
       BODY
       ------------------------- */

    setBoneOffset(
        "Spine",
        0,
        0,
        0
    );

}


/* =========================================================
   WAND
   ========================================================= */

let wand = null;


function createWand() {

    if (!rightHand) return;


    const group =
        new THREE.Group();


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


    group.add(handle);


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

    group.add(tip);


    wand = group;

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


let moveX = 0;
let moveZ = 0;


const moveSpeed = 5.5;


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


function updateJoystick(
    clientX,
    clientY
) {

    if (!joystickBase) return;

    const rect =
        joystickBase.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;


    let dx =
        clientX - centerX;

    let dy =
        clientY - centerY;


    const radius =
        rect.width / 2;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance > radius) {

        dx =
            (dx / distance) *
            radius;

        dy =
            (dy / distance) *
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


function resetJoystick() {

    joystickX = 0;
    joystickY = 0;

    joystickActive = false;


    if (joystickStick) {

        joystickStick.style.transform =
            "translate(0px, 0px)";

    }

}


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
        { passive: false }
    );


    joystickBase.addEventListener(
        "touchmove",
        function (event) {

            if (!joystickActive) return;

            const touch =
                event.touches[0];

            updateJoystick(
                touch.clientX,
                touch.clientY
            );

            event.preventDefault();

        },
        { passive: false }
    );


    joystickBase.addEventListener(
        "touchend",
        resetJoystick
    );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

window.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "w" ||
            event.key === "ArrowUp"
        ) {

            keys.forward = true;

        }

        if (
            event.key === "s" ||
            event.key === "ArrowDown"
        ) {

            keys.backward = true;

        }

        if (
            event.key === "a" ||
            event.key === "ArrowLeft"
        ) {

            keys.left = true;

        }

        if (
            event.key === "d" ||
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
            event.key === "ArrowUp"
        ) {

            keys.forward = false;

        }

        if (
            event.key === "s" ||
            event.key === "ArrowDown"
        ) {

            keys.backward = false;

        }

        if (
            event.key === "a" ||
            event.key === "ArrowLeft"
        ) {

            keys.left = false;

        }

        if (
            event.key === "d" ||
            event.key === "ArrowRight"
        ) {

            keys.right = false;

        }

    }
);


/* =========================================================
   CAMERA ROTATION
   ========================================================= */

let cameraYaw = 0;
let cameraPitch = 0.25;

let cameraTouching = false;

let lastTouchX = 0;
let lastTouchY = 0;


/*
   Only rotate camera when touching outside
   the joystick/buttons.
*/

renderer.domElement.addEventListener(
    "touchstart",
    function (event) {

        if (event.touches.length !== 1)
            return;

        const touch =
            event.touches[0];

        cameraTouching = true;

        lastTouchX =
            touch.clientX;

        lastTouchY =
            touch.clientY;

    },
    { passive: true }
);


renderer.domElement.addEventListener(
    "touchmove",
    function (event) {

        if (!cameraTouching)
            return;

        if (event.touches.length !== 1)
            return;

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
    { passive: true }
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


const jumpBtn =
    document.getElementById(
        "jumpBtn"
    );


function jump() {

    if (!player) return;

    if (isJumping) return;

    velocityY =
        jumpPower;

    isJumping = true;

}


if (jumpBtn) {

    jumpBtn.addEventListener(
        "touchstart",
        function (event) {

            jump();

            event.preventDefault();

        },
        { passive: false }
    );

    jumpBtn.addEventListener(
        "click",
        jump
    );

}


/* =========================================================
   SPELL SYSTEM
   ========================================================= */

let isCasting = false;

let castTimer = 0;

const castDuration = 0.65;


const spellBtn =
    document.getElementById(
        "spellBtn"
    );


function castSpell() {

    if (!player) return;

    if (isCasting) return;

    isCasting = true;

    castTimer = 0;


    createSpellProjectile();

}


if (spellBtn) {

    spellBtn.addEventListener(
        "touchstart",
        function (event) {

            castSpell();

            event.preventDefault();

        },
        { passive: false }
    );

    spellBtn.addEventListener(
        "click",
        castSpell
    );

}


/* =========================================================
   SPELL PROJECTILE
   ========================================================= */

function createSpellProjectile() {

    if (!player) return;


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


    function animateProjectile(
        delta
    ) {

        life += delta;


        projectile.position.add(
            direction.clone()
                .multiplyScalar(
                    22 * delta
                )
        );


        if (life > 2) {

            scene.remove(
                projectile
            );

            return;

        }


        requestAnimationFrame(
            () => animateProjectile(
                1 / 60
            )
        );

    }


    animateProjectile(
        1 / 60
    );

}


/* =========================================================
   WALKING ANIMATION
   ========================================================= */

let walkTime = 0;


function applyWalkingAnimation(
    delta,
    speedAmount
) {

    walkTime +=
        delta *
        (7 + speedAmount * 2);


    const swing =
        Math.sin(walkTime);


    const swingOpposite =
        Math.sin(
            walkTime + Math.PI
        );


    const amount =
        THREE.MathUtils.clamp(
            speedAmount,
            0,
            1
        );


    /* -------------------------
       LEGS
       ------------------------- */

    setBoneOffset(
        "LeftUpLeg",
        swing * 0.55 * amount,
        0,
        0
    );

    setBoneOffset(
        "RightUpLeg",
        swingOpposite * 0.55 * amount,
        0,
        0
    );


    setBoneOffset(
        "LeftLeg",
        Math.max(
            0,
            -swing
        ) * 0.45 * amount,
        0,
        0
    );

    setBoneOffset(
        "RightLeg",
        Math.max(
            0,
            -swingOpposite
        ) * 0.45 * amount,
        0,
        0
    );


    setBoneOffset(
        "LeftFoot",
        Math.max(
            0,
            swing
        ) * 0.20 * amount,
        0,
        0
    );

    setBoneOffset(
        "RightFoot",
        Math.max(
            0,
            swingOpposite
        ) * 0.20 * amount,
        0,
        0
    );


    /* -------------------------
       ARMS
       ------------------------- */

    setBoneOffset(
        "LeftArm",
        0,
        0,
        1.05 +
        swingOpposite *
        0.25 *
        amount
    );


    /*
       Right arm stays closer to the
       body because it holds the wand.
    */

    setBoneOffset(
        "RightArm",
        0,
        0,
        -1.05 +
        swing *
        0.12 *
        amount
    );


    setBoneOffset(
        "LeftForeArm",
        0.15,
        0,
        0.35 +
        swingOpposite *
        0.12 *
        amount
    );


    setBoneOffset(
        "RightForeArm",
        0.15,
        0,
        -0.35 +
        swing *
        0.08 *
        amount
    );


    /* -------------------------
       BODY BOB
       ------------------------- */

    setBoneOffset(
        "Spine",
        Math.abs(swing) *
        0.025 *
        amount,
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

    applyStandingPose();


    const breathing =
        Math.sin(
            elapsed * 2
        );


    const gentle =
        Math.sin(
            elapsed * 1.2
        );


    setBoneOffset(
        "Spine",
        breathing * 0.008,
        0,
        gentle * 0.008
    );


    setBoneOffset(
        "Head",
        0,
        gentle * 0.015,
        0
    );

}


/* =========================================================
   JUMP POSE
   ========================================================= */

function applyJumpAnimation() {

    applyStandingPose();


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


    setBoneOffset(
        "LeftArm",
        -0.20,
        0,
        1.15
    );

    setBoneOffset(
        "RightArm",
        -0.20,
        0,
        -1.15
    );

}


/* =========================================================
   CASTING POSE
   ========================================================= */

function applyCastingAnimation() {

    applyStandingPose();


    /*
       Raise wand arm forward.
    */

    setBoneOffset(
        "RightArm",
        -0.45,
        0,
        -1.20
    );


    setBoneOffset(
        "RightForeArm",
        -0.35,
        0,
        -0.40
    );


    setBoneOffset(
        "RightForeArm1",
        -0.15,
        0,
        -0.10
    );


    setBoneOffset(
        "Spine",
        -0.04,
        0,
        0
    );

}


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function updatePlayer(
    delta,
    elapsed
) {

    if (!player)
        return;


    /* -------------------------
       INPUT
       ------------------------- */

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


    /* -------------------------
       CAMERA RELATIVE MOVEMENT
       ------------------------- */

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
        forward.clone()
            .multiplyScalar(-inputZ)
    );


    movement.add(
        right.clone()
            .multiplyScalar(inputX)
    );


    const moving =
        movement.lengthSq() > 0.001;


    if (moving) {

        movement.normalize();


        const speed =
            moveSpeed;


        player.position.add(
            movement.clone()
                .multiplyScalar(
                    speed * delta
                )
        );


        /* -------------------------
           TURN PLAYER
           ------------------------- */

        const targetAngle =
            Math.atan2(
                movement.x,
                movement.z
            );


        let angleDifference =
            targetAngle -
            player.rotation.y;


        angleDifference =
            Math.atan2(
                Math.sin(angleDifference),
                Math.cos(angleDifference)
            );


        player.rotation.y +=
            angleDifference *
            Math.min(
                1,
                delta * 10
            );

    }


    /* -------------------------
       JUMP PHYSICS
       ------------------------- */

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


    /* -------------------------
       ANIMATION
       ------------------------- */

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
            Math.min(
                inputLength,
                1
            )
        );

    }
    else {

        applyIdleAnimation(
            elapsed
        );

    }


    /* -------------------------
       CAST TIMER
       ------------------------- */

    if (isCasting) {

        castTimer += delta;


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
                Math.sin(cameraPitch) * 3,
            Math.cos(cameraYaw) *
                distance
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
    "Wizarding World 3D started"
);

console.log(
    "Controls: joystick = move"
);

console.log(
    "Drag screen = camera"
);

console.log(
    "Jump = jump"
);

console.log(
    "Spell = cast"
);
