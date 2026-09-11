/* =========================================================
   WIZARDING WORLD 3D
   AREN VALEN - PLAYER MOVEMENT VERSION
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

const game = document.getElementById("game");
const loading = document.getElementById("loading");
const loadingText = document.querySelector(".loading-text");
const loadingStatus = document.querySelector(".loading-status");
const message = document.getElementById("message");

const joystickBase = document.getElementById("joystickBase");
const joystickStick = document.getElementById("joystickStick");

const jumpBtn = document.getElementById("jumpBtn");
const spellBtn = document.getElementById("spellBtn");


/* =========================================================
   SCENE
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x718b9a);

scene.fog = new THREE.Fog(
    0x718b9a,
    35,
    180
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
    10
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.1;

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

ground.position.y = 0;

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

function createTower(x, z) {

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

let player = null;

let mixer = null;

let idleAction = null;

let walkAction = null;

let runAction = null;

let currentAction = null;


/* =========================================================
   GLTF + DRACO LOADER
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
   LOADING TEXT
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

    function (gltf) {

        console.log(
            "AREN VALEN GLB LOADED"
        );

        player =
            gltf.scene;


        /* -------------------------------------------------
           SCALE PLAYER
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


        if (originalSize.y > 0) {

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
           PUT PLAYER ON GROUND
           ------------------------------------------------- */

        const scaledBox =
            new THREE.Box3()
                .setFromObject(
                    player
                );

        player.position.y =
            -scaledBox.min.y;

        player.position.x = 0;

        player.position.z = 8;


        /* -------------------------------------------------
           PLAYER MATERIALS
           ------------------------------------------------- */

        player.traverse(
            function (object) {

                if (object.isMesh) {

                    object.castShadow =
                        true;

                    object.receiveShadow =
                        true;

                    if (object.material) {

                        object.material
                            .needsUpdate = true;
                    }
                }
            }
        );


        /* -------------------------------------------------
           ANIMATIONS
           ------------------------------------------------- */

        if (
            gltf.animations &&
            gltf.animations.length > 0
        ) {

            console.log(
                "Animations:",
                gltf.animations
            );

            mixer =
                new THREE.AnimationMixer(
                    player
                );

            /*
             * Your current Aren model appears
             * to have no animation clips, so
             * movement will still work.
             */

            const clips =
                gltf.animations;


            for (
                let i = 0;
                i < clips.length;
                i++
            ) {

                const name =
                    clips[i].name
                        .toLowerCase();

                if (
                    name.includes("idle")
                ) {

                    idleAction =
                        mixer.clipAction(
                            clips[i]
                        );
                }

                if (
                    name.includes("walk")
                ) {

                    walkAction =
                        mixer.clipAction(
                            clips[i]
                        );
                }

                if (
                    name.includes("run")
                ) {

                    runAction =
                        mixer.clipAction(
                            clips[i]
                        );
                }
            }


            /*
             * Fallback
             */

            if (
                !idleAction &&
                clips.length > 0
            ) {

                idleAction =
                    mixer.clipAction(
                        clips[0]
                    );
            }


            if (idleAction) {

                idleAction.play();

                currentAction =
                    idleAction;
            }
        }


        /* -------------------------------------------------
           ADD PLAYER
           ------------------------------------------------- */

        scene.add(
            player
        );


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


    /* -----------------------------------------------------
       LOADING PROGRESS
       ----------------------------------------------------- */

    function (progress) {

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


    /* -----------------------------------------------------
       ERROR
       ----------------------------------------------------- */

    function (error) {

        console.error(
            "AREN VALEN LOAD ERROR",
            error
        );

        setLoading(
            "Character loading failed.",
            "Error loading Aren Valen GLB."
        );

        if (message) {

            message.textContent =
                "Aren Valen could not be loaded.";
        }
    }
);


/* =========================================================
   MOVEMENT VARIABLES
   ========================================================= */

let joystickX = 0;

let joystickY = 0;

let joystickActive = false;


/*
 * Movement speed.
 *
 * Increase this if Aren is too slow.
 */

const MOVE_SPEED = 5.0;


/* =========================================================
   JOYSTICK
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
            (dx / distance) *
            maxDistance;

        dy =
            (dy / distance) *
            maxDistance;
    }


    /* -------------------------------------------------
       VISUAL JOYSTICK
       ------------------------------------------------- */

    joystickStick.style.transform =
        `translate(
            calc(-50% + ${dx}px),
            calc(-50% + ${dy}px)
        )`;


    /* -------------------------------------------------
       NORMALIZED MOVEMENT
       ------------------------------------------------- */

    joystickX =
        dx / maxDistance;

    joystickY =
        dy / maxDistance;
}


/* =========================================================
   POINTER DOWN
   ========================================================= */

if (
    joystickBase
) {

    joystickBase.addEventListener(
        "pointerdown",
        function (event) {

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


    /* -----------------------------------------------------
       POINTER MOVE
       ----------------------------------------------------- */

    joystickBase.addEventListener(
        "pointermove",
        function (event) {

            if (!joystickActive) {

                return;
            }

            updateJoystick(
                event.clientX,
                event.clientY
            );
        }
    );


    /* -----------------------------------------------------
       POINTER UP
       ----------------------------------------------------- */

    joystickBase.addEventListener(
        "pointerup",
        function () {

            joystickActive =
                false;

            joystickX = 0;

            joystickY = 0;

            joystickStick.style.transform =
                "translate(-50%, -50%)";
        }
    );


    joystickBase.addEventListener(
        "pointercancel",
        function () {

            joystickActive =
                false;

            joystickX = 0;

            joystickY = 0;

            joystickStick.style.transform =
                "translate(-50%, -50%)";
        }
    );
}


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

const keys = {};


window.addEventListener(
    "keydown",
    function (event) {

        keys[event.key.toLowerCase()] =
            true;
    }
);


window.addEventListener(
    "keyup",
    function (event) {

        keys[event.key.toLowerCase()] =
            false;
    }
);


/* =========================================================
   UPDATE PLAYER MOVEMENT
   ========================================================= */

function updatePlayerMovement(
    delta
) {

    if (!player) {

        return;
    }


    let moveX =
        joystickX;

    let moveZ =
        joystickY;


    /* -------------------------------------------------
       KEYBOARD SUPPORT
       ------------------------------------------------- */

    if (keys["w"] || keys["arrowup"]) {

        moveZ = -1;
    }

    if (keys["s"] || keys["arrowdown"]) {

        moveZ = 1;
    }

    if (keys["a"] || keys["arrowleft"]) {

        moveX = -1;
    }

    if (keys["d"] || keys["arrowright"]) {

        moveX = 1;
    }


    /* -------------------------------------------------
       MOVEMENT MAGNITUDE
       ------------------------------------------------- */

    const magnitude =
        Math.sqrt(
            moveX * moveX +
            moveZ * moveZ
        );


    if (
        magnitude <
        0.05
    ) {

        switchAnimation(
            "idle"
        );

        return;
    }


    /* -------------------------------------------------
       NORMALIZE
       ------------------------------------------------- */

    if (
        magnitude > 1
    ) {

        moveX /=
            magnitude;

        moveZ /=
            magnitude;
    }


    /* -------------------------------------------------
       MOVE PLAYER
       ------------------------------------------------- */

    player.position.x +=
        moveX *
        MOVE_SPEED *
        delta;

    player.position.z +=
        moveZ *
        MOVE_SPEED *
        delta;


    /* -------------------------------------------------
       CHARACTER ROTATION
       ------------------------------------------------- */

    const targetRotation =
        Math.atan2(
            moveX,
            -moveZ
        );


    let rotationDifference =
        targetRotation -
        player.rotation.y;


    while (
        rotationDifference >
        Math.PI
    ) {

        rotationDifference -=
            Math.PI * 2;
    }


    while (
        rotationDifference <
        -Math.PI
    ) {

        rotationDifference +=
            Math.PI * 2;
    }


    player.rotation.y +=
        rotationDifference *
        Math.min(
            1,
            delta * 10
        );


    /* -------------------------------------------------
       WALK / RUN ANIMATION
       ------------------------------------------------- */

    if (
        magnitude > 0.7
    ) {

        switchAnimation(
            "run"
        );

    } else {

        switchAnimation(
            "walk"
        );
    }
}


/* =========================================================
   ANIMATION SWITCHER
   ========================================================= */

function switchAnimation(
    type
) {

    let nextAction = null;


    if (
        type === "idle"
    ) {

        nextAction =
            idleAction;
    }


    if (
        type === "walk"
    ) {

        nextAction =
            walkAction ||
            idleAction;
    }


    if (
        type === "run"
    ) {

        nextAction =
            runAction ||
            walkAction ||
            idleAction;
    }


    if (
        !nextAction ||
        nextAction === currentAction
    ) {

        return;
    }


    nextAction.reset();

    nextAction.fadeIn(
        0.2
    );

    nextAction.play();


    if (currentAction) {

        currentAction.fadeOut(
            0.2
        );
    }


    currentAction =
        nextAction;
}


/* =========================================================
   JUMP
   ========================================================= */

let verticalVelocity = 0;

let isGrounded = true;

const GRAVITY = 18;

const JUMP_POWER = 7;


if (
    jumpBtn
) {

    jumpBtn.addEventListener(
        "click",
        function () {

            if (
                !player ||
                !isGrounded
            ) {

                return;
            }


            verticalVelocity =
                JUMP_POWER;

            isGrounded =
                false;
        }
    );
}


/* =========================================================
   PLAYER PHYSICS
   ========================================================= */

function updatePhysics(
    delta
) {

    if (!player) {

        return;
    }


    if (
        !isGrounded
    ) {

        verticalVelocity -=
            GRAVITY *
            delta;

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

            isGrounded =
                true;
        }
    }
}


/* =========================================================
   SPELL
   ========================================================= */

if (
    spellBtn
) {

    spellBtn.addEventListener(
        "click",
        function () {

            if (message) {

                message.textContent =
                    "✨ Aren casts a spell!";
            }


            if (!player) {

                return;
            }


            const flash =
                new THREE.PointLight(
                    0x88bbff,
                    8,
                    15
                );


            flash.position.copy(
                player.position
            );

            flash.position.y +=
                1.5;


            scene.add(
                flash
            );


            setTimeout(
                function () {

                    scene.remove(
                        flash
                    );

                },
                250
            );
        }
    );
}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera(
    delta
) {

    if (!player) {

        return;
    }


    /*
     * Camera stays behind Aren.
     */

    const cameraDistance =
        8;


    const cameraHeight =
        4.2;


    const targetX =
        player.position.x +
        Math.sin(
            player.rotation.y
        ) *
        cameraDistance;


    const targetZ =
        player.position.z +
        Math.cos(
            player.rotation.y
        ) *
        cameraDistance;


    const target =
        new THREE.Vector3(
            targetX,
            player.position.y +
                cameraHeight,
            targetZ
        );


    camera.position.lerp(
        target,
        Math.min(
            1,
            delta * 5
        )
    );


    camera.lookAt(
        player.position.x,
        player.position.y + 1.5,
        player.position.z
    );
}


/* =========================================================
   CLOCK
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


    /* PLAYER MOVEMENT */

    updatePlayerMovement(
        delta
    );


    /* PLAYER PHYSICS */

    updatePhysics(
        delta
    );


    /* ANIMATION */

    if (mixer) {

        mixer.update(
            delta
        );
    }


    /* CAMERA */

    updateCamera(
        delta
    );


    /* RENDER */

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
   DEBUG
   ========================================================= */

console.log(
    "================================="
);

console.log(
    "WIZARDING WORLD 3D"
);

console.log(
    "Aren Valen movement system: ON"
);

console.log(
    "DRACO support: ENABLED"
);

console.log(
    "Player:",
    PLAYER_PATH
);

console.log(
    "================================="
);
