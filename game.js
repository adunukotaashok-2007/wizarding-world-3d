/* =========================================================
   WIZARDING WORLD 3D
   AREN VALEN - DRACO GLB LOADER
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


/* =========================================================
   ADD CANVAS
   ========================================================= */

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
   PLAYER VARIABLES
   ========================================================= */

let player =
    null;

let mixer =
    null;


/* =========================================================
   GLTF LOADER
   ========================================================= */

const loader =
    new GLTFLoader();


/* =========================================================
   DRACO LOADER
   =========================================================

   IMPORTANT:
   Aren Valen GLB uses
   KHR_draco_mesh_compression.

   This decoder allows Three.js to
   decompress the character model.
   ========================================================= */

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


console.log(
    "================================"
);

console.log(
    "WIZARDING WORLD 3D"
);

console.log(
    "Loading player:"
);

console.log(
    PLAYER_PATH
);

console.log(
    "DRACO decoder enabled."
);

console.log(
    "================================"
);


/* =========================================================
   LOADING MESSAGE
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
   LOAD CHARACTER
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
            "AREN VALEN LOADED!"
        );

        console.log(
            "================================"
        );


        player =
            gltf.scene;


        /* =================================================
           FIND MODEL SIZE
           ================================================= */

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
            "Original size:",
            originalSize
        );


        /* =================================================
           SCALE
           ================================================= */

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


        /* =================================================
           CORRECT POSITION
           ================================================= */

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


        /* =================================================
           CHARACTER MATERIALS
           ================================================= */

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


        /* =================================================
           ADD CHARACTER
           ================================================= */

        scene.add(
            player
        );


        /* =================================================
           ANIMATIONS
           ================================================= */

        if (
            gltf.animations &&
            gltf.animations.length > 0
        ) {

            console.log(
                "Animations:",
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
                "No animations in GLB."
            );

        }


        /* =================================================
           HIDE LOADING
           ================================================= */

        if (
            loading
        ) {

            loading.style.display =
                "none";

        }


        /* =================================================
           MESSAGE
           ================================================= */

        if (
            message
        ) {

            message.textContent =
                "Aren Valen has entered Aetheria.";

        }


        console.log(
            "Character successfully added to scene."
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


            const text =
                "Loading Aren Valen... " +
                percent.toFixed(0) +
                "%";


            console.log(
                text
            );


            setLoading(
                "Loading magical world...",
                text
            );

        } else {

            setLoading(
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
            "AREN VALEN LOAD ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================"
        );


        setLoading(
            "Character loading failed.",
            "Error loading Aren Valen GLB."
        );


        if (
            message
        ) {

            message.textContent =
                "Aren Valen could not be loaded.";

        }

    }

);


/* =========================================================
   CAMERA FOLLOW
   ========================================================= */

function updateCamera() {

    if (
        !player
    ) {

        return;

    }


    const target =
        new THREE.Vector3(

            player.position.x,

            player.position.y + 4.2,

            player.position.z + 8

        );


    camera.position.lerp(
        target,
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
   MAIN LOOP
   ========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    if (
        mixer
    ) {

        mixer.update(
            delta
        );

    }


    updateCamera();


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
                joystickBase
                    .getBoundingClientRect();


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
                `translate(
                    calc(-50% + ${dx}px),
                    calc(-50% + ${dy}px)
                )`;


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
   JUMP
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

                const originalY =
                    player.position.y;


                player.position.y +=
                    0.6;


                setTimeout(
                    function() {

                        if (
                            player
                        ) {

                            player.position.y =
                                originalY;

                        }

                    },
                    250
                );

            }

        }
    );

}


/* =========================================================
   SPELL
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


            if (
                player
            ) {

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
   FINAL DEBUG
   ========================================================= */

console.log(
    "Game initialized."
);

console.log(
    "Aren Valen path:",
    PLAYER_PATH
);

console.log(
    "DRACO support: ENABLED"
);
