/* =========================================================
   WIZARDING WORLD 3D
   CHARACTER LOADING TEST
   Player: Aren Valen
   ========================================================= */

import * as THREE from "three";

import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";


/* =========================================================
   BASIC SETUP
   ========================================================= */

const game = document.getElementById("game");

const loading = document.getElementById("loading");

const loadingText =
    document.querySelector(".loading-text");

const loadingStatus =
    document.querySelector(".loading-status");

const message =
    document.getElementById("message");


/* =========================================================
   SCENE
   ========================================================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x718b9a);

scene.fog =
    new THREE.Fog(
        0x718b9a,
        35,
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

camera.position.set(
    0,
    4,
    10
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance"
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


/* Add canvas */

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

const groundGeometry =
    new THREE.PlaneGeometry(
        200,
        200
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

ground.position.y = 0;

scene.add(
    ground
);


/* =========================================================
   CASTLE TEST BUILDING
   ========================================================= */

const castleGeometry =
    new THREE.BoxGeometry(
        30,
        20,
        20
    );


const castleMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x707070,
        roughness: 0.9
    });


const castle =
    new THREE.Mesh(
        castleGeometry,
        castleMaterial
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

let player = null;

let mixer = null;

let playerReady = false;


/* =========================================================
   GLTF LOADER
   ========================================================= */

const loader =
    new GLTFLoader();


/* =========================================================
   CHARACTER PATH
   ========================================================= */

const PLAYER_PATH =
    "./assets/player/aren_valen.glb";


console.log(
    "Trying to load character:"
);

console.log(
    PLAYER_PATH
);


/* =========================================================
   UPDATE LOADING MESSAGE
   ========================================================= */

function setLoadingText(
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
   LOAD AREN VALEN
   ========================================================= */

loader.load(

    PLAYER_PATH,


    /* =====================================================
       SUCCESS
       ===================================================== */

    function(gltf) {

        console.log(
            "================================"
        );

        console.log(
            "AREN VALEN LOADED SUCCESSFULLY"
        );

        console.log(
            "================================"
        );


        player =
            gltf.scene;


        /* ================================================
           CHECK MODEL SIZE
           ================================================ */

        const originalBox =
            new THREE.Box3()
                .setFromObject(
                    player
                );


        const originalSize =
            originalBox.getSize(
                new THREE.Vector3()
            );


        console.log(
            "Original character size:",
            originalSize
        );


        /* ================================================
           SCALE CHARACTER
           ================================================ */

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


        /* ================================================
           POSITION CHARACTER
           ================================================ */

        const scaledBox =
            new THREE.Box3()
                .setFromObject(
                    player
                );


        player.position.y =
            -scaledBox.min.y;


        player.position.x =
            0;


        player.position.z =
            8;


        /* ================================================
           CHARACTER MATERIALS / SHADOWS
           ================================================ */

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


        /* ================================================
           ADD PLAYER
           ================================================ */

        scene.add(
            player
        );


        /* ================================================
           ANIMATION
           ================================================ */

        if (
            gltf.animations &&
            gltf.animations.length > 0
        ) {

            console.log(
                "Animations found:",
                gltf.animations.length
            );


            mixer =
                new THREE.AnimationMixer(
                    player
                );


            const action =
                mixer.clipAction(
                    gltf.animations[0]
                );


            action.play();


        } else {

            console.log(
                "No animations found."
            );

        }


        /* ================================================
           PLAYER READY
           ================================================ */

        playerReady =
            true;


        /* ================================================
           HIDE LOADING SCREEN
           ================================================ */

        if (loading) {

            loading.style.display =
                "none";

        }


        /* ================================================
           MESSAGE
           ================================================ */

        if (message) {

            message.textContent =
                "Aren Valen has entered Aetheria.";

        }


        console.log(
            "Player is now visible."
        );

    },


    /* =====================================================
       PROGRESS
       ===================================================== */

    function(progress) {

        if (
            progress.total > 0
        ) {

            const percent =
                (
                    progress.loaded /
                    progress.total
                ) * 100;


            console.log(
                "Character loading:",
                percent.toFixed(1) + "%"
            );


            setLoadingText(
                "Loading magical world...",
                "Loading Aren Valen... " +
                percent.toFixed(0) +
                "%"
            );

        } else {

            setLoadingText(
                "Loading magical world...",
                "Loading Aren Valen..."
            );

        }

    },


    /* =====================================================
       ERROR
       ===================================================== */

    function(error) {

        console.error(
            "================================"
        );

        console.error(
            "CHARACTER LOAD ERROR"
        );

        console.error(
            error
        );

        console.error(
            "Character path:",
            PLAYER_PATH
        );

        console.error(
            "================================"
        );


        playerReady =
            false;


        setLoadingText(
            "Character loading failed.",
            "The game could not load Aren Valen."
        );


        if (message) {

            message.textContent =
                "Character file could not be loaded.";

        }

    }

);


/* =========================================================
   CAMERA FOLLOW
   ========================================================= */

function updateCamera() {

    if (!player) {
        return;
    }


    const targetCameraPosition =
        new THREE.Vector3(

            player.position.x,

            player.position.y + 4.2,

            player.position.z + 8

        );


    camera.position.lerp(
        targetCameraPosition,
        0.08
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
   ANIMATION LOOP
   ========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    /* Player animation */

    if (
        mixer
    ) {

        mixer.update(
            delta
        );

    }


    /* Camera */

    updateCamera();


    /* Render */

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
   BASIC JOYSTICK TEST
   ========================================================= */

const joystickBase =
    document.getElementById(
        "joystickBase"
    );


const joystickStick =
    document.getElementById(
        "joystickStick"
    );


let joystickActive =
    false;


if (
    joystickBase &&
    joystickStick
) {

    joystickBase.addEventListener(
        "pointerdown",
        function(event) {

            joystickActive =
                true;

            joystickBase.setPointerCapture(
                event.pointerId
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


            const rect =
                joystickBase.getBoundingClientRect();


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
                32;


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
                `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;


            /* Move player */

            if (
                player
            ) {

                player.position.x +=
                    dx * 0.0025;


                player.position.z +=
                    dy * 0.0025;

            }

        }
    );


    function resetJoystick() {

        joystickActive =
            false;


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
   JUMP BUTTON
   ========================================================= */

const jumpBtn =
    document.getElementById(
        "jumpBtn"
    );


if (
    jumpBtn
) {

    jumpBtn.addEventListener(
        "click",
        function() {

            if (
                player
            ) {

                player.position.y +=
                    0.5;


                setTimeout(
                    function() {

                        if (
                            player
                        ) {

                            player.position.y =
                                0;

                        }

                    },
                    250
                );

            }

        }
    );

}


/* =========================================================
   SPELL BUTTON
   ========================================================= */

const spellBtn =
    document.getElementById(
        "spellBtn"
    );


if (
    spellBtn
) {

    spellBtn.addEventListener(
        "click",
        function() {

            if (
                message
            ) {

                message.textContent =
                    "✨ Spell cast!";

            }


            /* Temporary magical flash */

            const flash =
                new THREE.PointLight(
                    0x88bbff,
                    8,
                    15
                );


            if (
                player
            ) {

                flash.position.copy(
                    player.position
                );

                flash.position.y +=
                    1.5;

                scene.add(
                    flash
                );


                setTimeout(
                    function() {

                        scene.remove(
                            flash
                        );

                    },
                    250
                );

            }

        }
    );

}


/* =========================================================
   DEBUG INFORMATION
   ========================================================= */

console.log(
    "Wizarding World 3D started."
);

console.log(
    "Player file:",
    PLAYER_PATH
);

console.log(
    "Waiting for Aren Valen..."
);
