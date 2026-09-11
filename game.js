/* =========================================================
   WIZARDING WORLD 3D
   AREN VALEN - FULL MOBILE PLAYER SYSTEM
   =========================================================

   FEATURES
   ---------------------------------------------------------
   • Continuous joystick movement
   • Character turns toward movement
   • Procedural walking animation
   • Procedural running animation
   • Procedural jump
   • Wand attached to right hand
   • Spell casting animation
   • Spell projectile
   • Third-person camera
   • Touch camera rotation
   • Camera zoom
   • Keyboard controls for testing
   • DRACO GLB support
   • Mobile optimized
   ========================================================= */


import * as THREE from "three";

import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";

import {
    DRACOLoader
} from "three/addons/loaders/DRACOLoader.js";


/* =========================================================
   HTML ELEMENTS
   ========================================================= */

const game =
    document.getElementById("game");

const loading =
    document.getElementById("loading");

const loadingText =
    document.querySelector(".loading-text");

const loadingStatus =
    document.querySelector(".loading-status");

const message =
    document.getElementById("message");

const joystickBase =
    document.getElementById("joystickBase");

const joystickStick =
    document.getElementById("joystickStick");

const jumpBtn =
    document.getElementById("jumpBtn");

const spellBtn =
    document.getElementById("spellBtn");


/* =========================================================
   SCENE
   ========================================================= */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(0x718b9a);

scene.fog =
    new THREE.Fog(
        0x718b9a,
        40,
        180
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


/*
 * Camera orbit values
 */

let cameraYaw =
    0;

let cameraPitch =
    0.18;

let cameraDistance =
    8;

const CAMERA_MIN_DISTANCE =
    4.5;

const CAMERA_MAX_DISTANCE =
    12;


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: false,
        powerPreference:
            "high-performance"
    });


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        1.5
    )
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
    1.1;


/*
 * Prevent mobile browser gestures
 * from taking over the game canvas.
 */

renderer.domElement.style.touchAction =
    "none";


game.innerHTML = "";

game.appendChild(
    renderer.domElement
);


/* =========================================================
   LIGHTING
   ========================================================= */

const hemisphereLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x304020,
        2.5
    );

scene.add(
    hemisphereLight
);


const sunlight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sunlight.position.set(
    20,
    40,
    20
);

scene.add(
    sunlight
);


/* =========================================================
   GROUND
   ========================================================= */

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            200,
            200
        ),
        new THREE.MeshStandardMaterial({
            color: 0x536b4d,
            roughness: 1
        })
    );

ground.rotation.x =
    -Math.PI / 2;

ground.position.y =
    0;

scene.add(
    ground
);


/* =========================================================
   CASTLE
   ========================================================= */

const castle =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            30,
            20,
            20
        ),
        new THREE.MeshStandardMaterial({
            color: 0x707070,
            roughness: 0.9
        })
    );

castle.position.set(
    0,
    10,
    -35
);

scene.add(
    castle
);


/* =========================================================
   CASTLE TOWERS
   ========================================================= */

function createTower(
    x,
    z
) {

    const tower =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                4,
                5,
                25,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x626262,
                roughness: 0.9
            })
        );

    tower.position.set(
        x,
        12.5,
        z
    );

    scene.add(
        tower
    );


    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                5,
                7,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0x343434,
                roughness: 0.8
            })
        );

    roof.position.set(
        x,
        28,
        z
    );

    scene.add(
        roof
    );
}


createTower(
    -18,
    -35
);

createTower(
    18,
    -35
);


/* =========================================================
   PLAYER
   ========================================================= */

let player =
    null;


/* =========================================================
   PLAYER SKELETON BONES
   ========================================================= */

let bones = {};


/*
 * These names come from the Aren Valen
 * skeleton.
 */

function findPlayerBones() {

    if (!player) {
        return;
    }


    bones =
        {};


    player.traverse(
        function(object) {

            if (
                !object.isBone
            ) {
                return;
            }


            const name =
                object.name;


            bones[name] =
                object;
        }
    );


    console.log(
        "Player bones found:",
        Object.keys(bones)
    );
}


/* =========================================================
   SAVE ORIGINAL BONE ROTATIONS
   ========================================================= */

const originalBoneRotations =
    new Map();


function saveBoneRotations() {

    Object.keys(bones)
        .forEach(function(name) {

            const bone =
                bones[name];


            originalBoneRotations.set(
                name,
                {
                    x:
                        bone.rotation.x,

                    y:
                        bone.rotation.y,

                    z:
                        bone.rotation.z
                }
            );
        });
}


/* =========================================================
   GET BONE
   ========================================================= */

function getBone(
    name
) {

    return bones[name] ||
        null;
}


/* =========================================================
   SET BONE OFFSET
   ========================================================= */

function setBoneOffset(
    name,
    x,
    y,
    z
) {

    const bone =
        getBone(name);


    if (!bone) {
        return;
    }


    const original =
        originalBoneRotations.get(
            name
        );


    if (!original) {
        return;
    }


    bone.rotation.x =
        original.x + x;

    bone.rotation.y =
        original.y + y;

    bone.rotation.z =
        original.z + z;
}


/* =========================================================
   GLTF + DRACO
   ========================================================= */

const loader =
    new GLTFLoader();


const dracoLoader =
    new DRACOLoader();


dracoLoader.setDecoderPath(
    "https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/"
);

dracoLoader.setDecoderConfig({
    type: "js"
});


loader.setDRACOLoader(
    dracoLoader
);


/* =========================================================
   PLAYER FILE
   ========================================================= */

const PLAYER_PATH =
    "./assets/player/aren_valen.glb";


/* =========================================================
   LOADING
   ========================================================= */

function setLoading(
    title,
    status
) {

    if (loadingText) {

        loadingText.textContent =
            title;
    }


    if (loadingStatus) {

        loadingStatus.textContent =
            status;
    }
}


/* =========================================================
   LOAD PLAYER
   ========================================================= */

loader.load(

    PLAYER_PATH,

    function(gltf) {

        console.log(
            "AREN VALEN LOADED"
        );


        player =
            gltf.scene;


        /* -------------------------------------------------
           SCALE
           ------------------------------------------------- */

        const originalBox =
            new THREE.Box3()
                .setFromObject(
                    player
                );


        const originalSize =
            originalBox.getSize(
                new THREE.Vector3()
            );


        if (
            originalSize.y > 0
        ) {

            const desiredHeight =
                3.2;


            const scale =
                desiredHeight /
                originalSize.y;


            player.scale.setScalar(
                scale
            );
        }


        /* -------------------------------------------------
           POSITION
           ------------------------------------------------- */

        const box =
            new THREE.Box3()
                .setFromObject(
                    player
                );


        player.position.y =
            -box.min.y;


        player.position.x =
            0;


        player.position.z =
            8;


        /* -------------------------------------------------
           MATERIALS
           ------------------------------------------------- */

        player.traverse(
            function(object) {

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

                        object.material
                            .needsUpdate =
                            true;
                    }
                }
            }
        );


        /* -------------------------------------------------
           ADD PLAYER
           ------------------------------------------------- */

        scene.add(
            player
        );


        /* -------------------------------------------------
           FIND BONES
           ------------------------------------------------- */

        findPlayerBones();

        saveBoneRotations();


        /* -------------------------------------------------
           CREATE WAND
           ------------------------------------------------- */

        createWand();


        /* -------------------------------------------------
           HIDE LOADING
           ------------------------------------------------- */

        if (loading) {

            loading.style.display =
                "none";
        }


        if (message) {

            message.textContent =
                "Aren Valen has entered Aetheria.";
        }


        console.log(
            "PLAYER READY"
        );
    },


    function(progress) {

        if (
            progress.total > 0
        ) {

            const percent =
                (
                    progress.loaded /
                    progress.total
                ) * 100;


            setLoading(
                "Loading magical world...",
                "Loading Aren Valen... " +
                percent.toFixed(0) +
                "%"
            );

        } else {

            setLoading(
                "Loading magical world...",
                "Loading Aren Valen..."
            );
        }
    },


    function(error) {

        console.error(
            "AREN VALEN ERROR:",
            error
        );


        setLoading(
            "Character loading failed.",
            "Could not load Aren Valen."
        );


        if (message) {

            message.textContent =
                "Aren Valen could not be loaded.";
        }
    }
);


/* =========================================================
   WAND
   ========================================================= */

let wand =
    null;


function createWand() {

    const hand =
        getBone(
            "RightHand"
        );


    if (!hand) {

        console.warn(
            "RightHand bone not found"
        );

        return;
    }


    wand =
        new THREE.Group();


    /*
     * Wooden handle
     */

    const handle =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.055,
                0.07,
                0.75,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x24140b,
                roughness: 0.8
            })
        );


    /*
     * Magic tip
     */

    const tip =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.085,
                8,
                8
            ),
            new THREE.MeshBasicMaterial({
                color: 0xbfdcff
            })
        );


    tip.position.y =
        0.40;


    wand.add(
        handle
    );

    wand.add(
        tip
    );


    /*
     * Position wand in hand.
     *
     * These values are deliberately
     * small because the wand is attached
     * to the skeleton.
     */

    wand.position.set(
        0,
        0.18,
        0
    );


    wand.rotation.set(
        0,
        0,
        -Math.PI / 2
    );


    hand.add(
        wand
    );


    console.log(
        "WAND ATTACHED TO RIGHT HAND"
    );
}


/* =========================================================
   MOVEMENT
   ========================================================= */

let joystickX =
    0;

let joystickY =
    0;


let joystickActive =
    false;


const MOVE_SPEED =
    4.5;


/* =========================================================
   KEYBOARD
   ========================================================= */

const keys =
    {};


window.addEventListener(
    "keydown",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = true;
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
   JOYSTICK UPDATE
   ========================================================= */

function updateJoystick(
    clientX,
    clientY
) {

    if (
        !joystickBase ||
        !joystickStick
    ) {

        return;
    }


    const rect =
        joystickBase
            .getBoundingClientRect();


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


    const maxDistance =
        45;


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
            dx /
            distance *
            maxDistance;


        dy =
            dy /
            distance *
            maxDistance;
    }


    joystickStick.style.transform =
        `translate(
            calc(-50% + ${dx}px),
            calc(-50% + ${dy}px)
        )`;


    joystickX =
        dx /
        maxDistance;


    joystickY =
        dy /
        maxDistance;
}


/* =========================================================
   JOYSTICK EVENTS
   ========================================================= */

if (
    joystickBase
) {

    joystickBase.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            joystickActive =
                true;


            joystickBase.setPointerCapture(
                event.pointerId
            );


            updateJoystick(
                event.clientX,
                event.clientY
            );
        }
    );


    joystickBase.addEventListener(
        "pointermove",
        function(event) {

            if (
                !joystickActive
            ) {

                return;
            }


            event.preventDefault();


            updateJoystick(
                event.clientX,
                event.clientY
            );
        }
    );


    function resetJoystick() {

        joystickActive =
            false;


        joystickX =
            0;


        joystickY =
            0;


        joystickStick.style.transform =
            "translate(-50%, -50%)";
    }


    joystickBase.addEventListener(
        "pointerup",
        resetJoystick
    );


    joystickBase.addEventListener(
        "pointercancel",
        resetJoystick
    );
}


/* =========================================================
   CAMERA TOUCH CONTROL
   ========================================================= */

let cameraTouching =
    false;


let cameraPointerId =
    null;


let lastCameraX =
    0;


let lastCameraY =
    0;


renderer.domElement.addEventListener(
    "pointerdown",
    function(event) {

        /*
         * Camera control starts when the user
         * touches/drags the actual game area.
         */

        cameraTouching =
            true;


        cameraPointerId =
            event.pointerId;


        lastCameraX =
            event.clientX;


        lastCameraY =
            event.clientY;


        renderer.domElement.setPointerCapture(
            event.pointerId
        );
    }
);


renderer.domElement.addEventListener(
    "pointermove",
    function(event) {

        if (
            !cameraTouching ||
            event.pointerId !==
            cameraPointerId
        ) {

            return;
        }


        const dx =
            event.clientX -
            lastCameraX;


        const dy =
            event.clientY -
            lastCameraY;


        lastCameraX =
            event.clientX;


        lastCameraY =
            event.clientY;


        /*
         * Horizontal = camera rotation
         */

        cameraYaw -=
            dx * 0.008;


        /*
         * Vertical = camera height
         */

        cameraPitch -=
            dy * 0.006;


        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -0.15,
                0.65
            );


        event.preventDefault();
    }
);


renderer.domElement.addEventListener(
    "pointerup",
    function() {

        cameraTouching =
            false;

        cameraPointerId =
            null;
    }
);


renderer.domElement.addEventListener(
    "pointercancel",
    function() {

        cameraTouching =
            false;

        cameraPointerId =
            null;
    }
);


/* =========================================================
   MOUSE WHEEL CAMERA ZOOM
   ========================================================= */

renderer.domElement.addEventListener(
    "wheel",
    function(event) {

        cameraDistance +=
            event.deltaY * 0.01;


        cameraDistance =
            THREE.MathUtils.clamp(
                cameraDistance,
                CAMERA_MIN_DISTANCE,
                CAMERA_MAX_DISTANCE
            );
    },
    {
        passive: true
    }
);


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

let moving =
    false;


let movementStrength =
    0;


let movementDirection =
    new THREE.Vector3();


function updatePlayerMovement(
    delta
) {

    if (!player) {

        return;
    }


    let inputX =
        joystickX;


    let inputY =
        joystickY;


    /* -----------------------------------------------------
       KEYBOARD
       ----------------------------------------------------- */

    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        inputY =
            -1;
    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        inputY =
            1;
    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        inputX =
            -1;
    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        inputX =
            1;
    }


    movementStrength =
        Math.sqrt(
            inputX * inputX +
            inputY * inputY
        );


    if (
        movementStrength <
        0.05
    ) {

        moving =
            false;

        return;
    }


    moving =
        true;


    if (
        movementStrength >
        1
    ) {

        inputX /=
            movementStrength;

        inputY /=
            movementStrength;
    }


    /*
     * Movement relative to camera.
     *
     * This makes joystick UP mean
     * "move toward where camera faces".
     */

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


    movementDirection
        .set(0, 0, 0)
        .addScaledVector(
            right,
            inputX
        )
        .addScaledVector(
            forward,
            -inputY
        );


    movementDirection.normalize();


    /*
     * Move Aren.
     */

    player.position.x +=
        movementDirection.x *
        MOVE_SPEED *
        delta *
        Math.min(
            movementStrength,
            1
        );


    player.position.z +=
        movementDirection.z *
        MOVE_SPEED *
        delta *
        Math.min(
            movementStrength,
            1
        );


    /*
     * Turn character toward
     * movement direction.
     */

    const targetRotation =
        Math.atan2(
            movementDirection.x,
            -movementDirection.z
        );


    let difference =
        targetRotation -
        player.rotation.y;


    while (
        difference > Math.PI
    ) {

        difference -=
            Math.PI * 2;
    }


    while (
        difference < -Math.PI
    ) {

        difference +=
            Math.PI * 2;
    }


    player.rotation.y +=
        difference *
        Math.min(
            1,
            delta * 10
        );
}


/* =========================================================
   PROCEDURAL WALKING
   ========================================================= */

let walkTime =
    0;


function updateWalkingAnimation(
    delta
) {

    if (!player) {

        return;
    }


    /*
     * Smooth movement value.
     */

    const target =
        moving
            ? movementStrength
            : 0;


    const speed =
        moving
            ? 8
            : 5;


    walkTime +=
        delta *
        speed;


    /*
     * Main walking wave.
     */

    const wave =
        Math.sin(
            walkTime
        );


    const oppositeWave =
        Math.sin(
            walkTime +
            Math.PI
        );


    /*
     * LEG SWING
     */

    setBoneOffset(
        "LeftUpLeg",
        wave * 0.45 * target,
        0,
        0
    );


    setBoneOffset(
        "RightUpLeg",
        oppositeWave * 0.45 * target,
        0,
        0
    );


    setBoneOffset(
        "LeftLeg",
        oppositeWave * 0.30 * target,
        0,
        0
    );


    setBoneOffset(
        "RightLeg",
        wave * 0.30 * target,
        0,
        0
    );


    /*
     * FOOT MOVEMENT
     */

    setBoneOffset(
        "LeftFoot",
        wave * 0.18 * target,
        0,
        0
    );


    setBoneOffset(
        "RightFoot",
        oppositeWave * 0.18 * target,
        0,
        0
    );


    /*
     * ARM SWING
     */

    setBoneOffset(
        "LeftArm",
        oppositeWave * 0.28 * target,
        0,
        0
    );


    /*
     * Right arm holds the wand,
     * so its movement is smaller.
     */

    if (!casting) {

        setBoneOffset(
            "RightArm",
            wave * 0.12 * target,
            0,
            0
        );

        setBoneOffset(
            "RightForeArm",
            wave * 0.10 * target,
            0,
            0
        );
    }


    /*
     * BODY BOB
     */

    const bob =
        moving
            ? Math.abs(
                Math.sin(
                    walkTime * 2
                )
            ) *
              0.035 *
              target
            : 0;


    setBoneOffset(
        "Spine",
        0,
        0,
        bob
    );


    /*
     * HEAD movement.
     */

    if (
        !casting
    ) {

        setBoneOffset(
            "Head",
            0,
            wave *
            0.025 *
            target,
            0
        );
    }
}


/* =========================================================
   JUMP SYSTEM
   ========================================================= */

let verticalVelocity =
    0;


let grounded =
    true;


let jumpTime =
    0;


const GRAVITY =
    20;


const JUMP_POWER =
    7.5;


function jump() {

    if (
        !player ||
        !grounded
    ) {

        return;
    }


    grounded =
        false;


    verticalVelocity =
        JUMP_POWER;


    jumpTime =
        0;


    if (message) {

        message.textContent =
            "Aren Valen jumps!";
    }
}


/* =========================================================
   JUMP BUTTON
   ========================================================= */

if (
    jumpBtn
) {

    jumpBtn.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            jump();
        }
    );
}


/* =========================================================
   UPDATE JUMP
   ========================================================= */

function updateJump(
    delta
) {

    if (!player) {

        return;
    }


    if (
        !grounded
    ) {

        jumpTime +=
            delta;


        verticalVelocity -=
            GRAVITY *
            delta;


        player.position.y +=
            verticalVelocity *
            delta;


        /*
         * Jump body pose.
         */

        const jumpAmount =
            THREE.MathUtils.clamp(
                Math.abs(
                    verticalVelocity
                ) /
                JUMP_POWER,
                0,
                1
            );


        setBoneOffset(
            "LeftUpLeg",
            -0.20 *
            jumpAmount,
            0,
            0
        );


        setBoneOffset(
            "RightUpLeg",
            -0.20 *
            jumpAmount,
            0,
            0
        );


        setBoneOffset(
            "LeftLeg",
            0.35 *
            jumpAmount,
            0,
            0
        );


        setBoneOffset(
            "RightLeg",
            0.35 *
            jumpAmount,
            0,
            0
        );


        if (
            player.position.y <= 0
        ) {

            player.position.y =
                0;


            verticalVelocity =
                0;


            grounded =
                true;


            if (message) {

                message.textContent =
                    "Aren Valen landed.";
            }
        }
    }
}


/* =========================================================
   CASTING
   ========================================================= */

let casting =
    false;


let castTime =
    0;


let spellCooldown =
    0;


function castSpell() {

    if (
        !player ||
        casting ||
        spellCooldown > 0
    ) {

        return;
    }


    casting =
        true;


    castTime =
        0;


    spellCooldown =
        0.6;


    if (message) {

        message.textContent =
            "✨ Aren Valen casts a spell!";
    }


    /*
     * Create magic projectile
     */

    createSpellProjectile();
}


/* =========================================================
   SPELL BUTTON
   ========================================================= */

if (
    spellBtn
) {

    spellBtn.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            castSpell();
        }
    );
}


/* =========================================================
   CASTING ANIMATION
   ========================================================= */

function updateCasting(
    delta
) {

    if (!player) {

        return;
    }


    if (
        !casting
    ) {

        return;
    }


    castTime +=
        delta;


    /*
     * Raise right arm.
     */

    const progress =
        THREE.MathUtils.clamp(
            castTime /
            0.35,
            0,
            1
        );


    /*
     * Smooth curve.
     */

    const armRaise =
        Math.sin(
            progress *
            Math.PI /
            2
        );


    setBoneOffset(
        "RightArm",
        -1.15 *
        armRaise,
        0,
        -0.35 *
        armRaise
    );


    setBoneOffset(
        "RightForeArm",
        -0.75 *
        armRaise,
        0,
        0
    );


    setBoneOffset(
        "RightHand",
        0,
        0,
        -0.25 *
        armRaise
    );


    /*
     * Head looks slightly toward
     * wand direction.
     */

    setBoneOffset(
        "Head",
        -0.10 *
        armRaise,
        0,
        0
    );


    /*
     * Casting finishes.
     */

    if (
        castTime >
        0.55
    ) {

        casting =
            false;
    }
}


/* =========================================================
   SPELL PROJECTILE
   ========================================================= */

const spells =
    [];


function createSpellProjectile() {

    if (!player) {

        return;
    }


    /*
     * Create glowing orb.
     */

    const orb =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.14,
                10,
                10
            ),
            new THREE.MeshBasicMaterial({
                color: 0x9fdcff
            })
        );


    /*
     * Add glow.
     */

    const glow =
        new THREE.PointLight(
            0x77bbff,
            5,
            8
        );


    orb.add(
        glow
    );


    /*
     * Start slightly in front
     * of Aren.
     */

    const start =
        new THREE.Vector3(
            0,
            1.8,
            -1.0
        );


    start.applyAxisAngle(
        new THREE.Vector3(
            0,
            1,
            0
        ),
        player.rotation.y
    );


    orb.position.copy(
        player.position
    );


    orb.position.add(
        start
    );


    scene.add(
        orb
    );


    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );


    direction.applyAxisAngle(
        new THREE.Vector3(
            0,
            1,
            0
        ),
        player.rotation.y
    );


    spells.push({
        mesh: orb,
        direction:
            direction.normalize(),
        life: 0
    });
}


/* =========================================================
   UPDATE SPELLS
   ========================================================= */

function updateSpells(
    delta
) {

    for (
        let i =
            spells.length - 1;
        i >= 0;
        i--
    ) {

        const spell =
            spells[i];


        spell.mesh.position.addScaledVector(
            spell.direction,
            16 *
            delta
        );


        spell.life +=
            delta;


        /*
         * Remove after 2 seconds.
         */

        if (
            spell.life >
            2
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


/* =========================================================
   CAMERA
   ========================================================= */

const cameraTarget =
    new THREE.Vector3();


function updateCamera(
    delta
) {

    if (!player) {

        return;
    }


    /*
     * Camera orbit position.
     */

    const horizontalDistance =
        Math.cos(
            cameraPitch
        ) *
        cameraDistance;


    const verticalDistance =
        Math.sin(
            cameraPitch
        ) *
        cameraDistance;


    const cameraX =
        player.position.x +
        Math.sin(
            cameraYaw
        ) *
        horizontalDistance;


    const cameraZ =
        player.position.z +
        Math.cos(
            cameraYaw
        ) *
        horizontalDistance;


    const cameraY =
        player.position.y +
        2.4 +
        verticalDistance;


    cameraTarget.set(
        cameraX,
        cameraY,
        cameraZ
    );


    /*
     * Smooth camera.
     */

    camera.position.lerp(
        cameraTarget,
        Math.min(
            1,
            delta * 8
        )
    );


    /*
     * Look slightly above
     * Aren's body.
     */

    const lookTarget =
        new THREE.Vector3(
            player.position.x,
            player.position.y +
            1.45,
            player.position.z
        );


    camera.lookAt(
        lookTarget
    );
}


/* =========================================================
   CAMERA INITIAL POSITION
   ========================================================= */

camera.position.set(
    0,
    4,
    16
);


/* =========================================================
   GAME CLOCK
   ========================================================= */

const clock =
    new THREE.Clock();


/* =========================================================
   MAIN GAME LOOP
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


    /*
     * Cooldown
     */

    if (
        spellCooldown > 0
    ) {

        spellCooldown -=
            delta;
    }


    /*
     * Movement
     */

    updatePlayerMovement(
        delta
    );


    /*
     * Walking body animation
     */

    updateWalkingAnimation(
        delta
    );


    /*
     * Jump

     */

    updateJump(
        delta
    );


    /*
     * Spell casting
     */

    updateCasting(
        delta
    );


    /*
     * Spell projectiles
     */

    updateSpells(
        delta
    );


    /*
     * Camera

     */

    updateCamera(
        delta
    );


    /*
     * Render

     */

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
   DEBUG
   ========================================================= */

console.log(
    "======================================"
);

console.log(
    "WIZARDING WORLD 3D"
);

console.log(
    "AREN VALEN FULL PLAYER SYSTEM"
);

console.log(
    "Movement: ON"
);

console.log(
    "Procedural walking: ON"
);

console.log(
    "Procedural jumping: ON"
);

console.log(
    "Wand: ON"
);

console.log(
    "Spell casting: ON"
);

console.log(
    "Touch camera: ON"
);

console.log(
    "Third-person camera: ON"
);

console.log(
    "DRACO: ON"
);

console.log(
    "======================================"
);
