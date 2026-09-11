import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================
   SCENE
========================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87a6b5);

scene.fog = new THREE.Fog(
    0x87a6b5,
    30,
    160
);


/* =========================
   CAMERA
========================= */

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(
    0,
    4,
    9
);


/* =========================
   RENDERER
========================= */

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


/* =========================
   GAME CONTAINER
========================= */

const game =
    document.getElementById("game");

game.innerHTML = "";

game.appendChild(
    renderer.domElement
);


/* =========================
   LIGHTING
========================= */

const hemi =
    new THREE.HemisphereLight(
        0xffffff,
        0x304020,
        2.5
    );

scene.add(hemi);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sun.position.set(
    20,
    40,
    20
);

scene.add(sun);


/* =========================
   GROUND
========================= */

const ground =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            200,
            200
        ),

        new THREE.MeshStandardMaterial({
            color: 0x526b4c,
            roughness: 1
        })

    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);


/* =========================
   CASTLE
========================= */

const castle =
    new THREE.Mesh(

        new THREE.BoxGeometry(
            30,
            20,
            20
        ),

        new THREE.MeshStandardMaterial({
            color: 0x777777,
            roughness: 0.9
        })

    );

castle.position.set(
    0,
    10,
    -35
);

scene.add(castle);


/* =========================
   PLAYER
========================= */

let player = null;

const loader =
    new GLTFLoader();


loader.load(

    "./assets/player/aren_valen.glb",

    function(gltf) {

        console.log(
            "AREN VALEN LOADED"
        );

        player =
            gltf.scene;


        /* Calculate size */

        const box =
            new THREE.Box3()
                .setFromObject(
                    player
                );

        const size =
            box.getSize(
                new THREE.Vector3()
            );


        /* Scale */

        if (size.y > 0) {

            const desiredHeight =
                3.2;

            const scale =
                desiredHeight /
                size.y;

            player.scale.setScalar(
                scale
            );
        }


        /* Recalculate bottom */

        const scaledBox =
            new THREE.Box3()
                .setFromObject(
                    player
                );

        player.position.y =
            -scaledBox.min.y;


        player.position.x = 0;

        player.position.z = 8;


        /* Shadows */

        player.traverse(
            function(child) {

                if (child.isMesh) {

                    child.castShadow = true;

                    child.receiveShadow = true;

                }

            }
        );


        scene.add(player);


        /* Animation */

        if (
            gltf.animations &&
            gltf.animations.length > 0
        ) {

            const mixer =
                new THREE.AnimationMixer(
                    player
                );

            const action =
                mixer.clipAction(
                    gltf.animations[0]
                );

            action.play();


            player.userData.mixer =
                mixer;
        }


        /* Hide loading */

        const loading =
            document.getElementById(
                "loading"
            );

        if (loading) {

            loading.style.display =
                "none";

        }


        const message =
            document.getElementById(
                "message"
            );

        if (message) {

            message.textContent =
                "Aren Valen has entered Aetheria.";

        }

    },


    function(progress) {

        console.log(
            "Loading Aren Valen..."
        );

    },


    function(error) {

        console.error(
            "PLAYER LOAD ERROR:",
            error
        );


        const text =
            document.querySelector(
                ".loading-text"
            );

        if (text) {

            text.textContent =
                "Character loading failed.";

        }

    }

);


/* =========================
   CAMERA
========================= */

function updateCamera() {

    if (!player)
        return;


    const target =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 4,
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


/* =========================
   LOOP
========================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    if (
        player &&
        player.userData.mixer
    ) {

        player.userData.mixer.update(
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


/* =========================
   RESIZE
========================= */

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
