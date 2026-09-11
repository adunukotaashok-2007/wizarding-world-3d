/* =========================================================
   WIZARDING WORLD 3D
   AREN VALEN - REAL 3D PLAYER
   MOBILE OPTIMIZED
   ========================================================= */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { GLTFLoader } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";


/* =========================================================
   BASIC SETUP
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87a6b5);

scene.fog = new THREE.Fog(
    0x87a6b5,
    45,
    180
);


const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);


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

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.05;


const game = document.getElementById("game");

if (game) {
    game.innerHTML = "";
    game.appendChild(renderer.domElement);
}


/* =========================================================
   LIGHTING
   ========================================================= */

const hemiLight = new THREE.HemisphereLight(
    0xcfe8ff,
    0x304020,
    2.0
);

scene.add(hemiLight);


const sun = new THREE.DirectionalLight(
    0xffffff,
    3.0
);

sun.position.set(
    35,
    60,
    25
);

sun.castShadow = true;

sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;

sun.shadow.camera.left = -80;
sun.shadow.camera.right = 80;
sun.shadow.camera.top = 80;
sun.shadow.camera.bottom = -80;

scene.add(sun);


/* =========================================================
   GROUND
   ========================================================= */

const textureLoader = new THREE.TextureLoader();

const groundDiffuse =
    textureLoader.load(
        "./assets/ground/diffuse.jpg"
    );

const groundNormal =
    textureLoader.load(
        "./assets/ground/normal.jpg"
    );

const groundRough =
    textureLoader.load(
        "./assets/ground/rough.jpg"
    );


groundDiffuse.wrapS =
    THREE.RepeatWrapping;

groundDiffuse.wrapT =
    THREE.RepeatWrapping;

groundNormal.wrapS =
    THREE.RepeatWrapping;

groundNormal.wrapT =
    THREE.RepeatWrapping;

groundRough.wrapS =
    THREE.RepeatWrapping;

groundRough.wrapT =
    THREE.RepeatWrapping;


groundDiffuse.repeat.set(30, 30);
groundNormal.repeat.set(30, 30);
groundRough.repeat.set(30, 30);


const groundGeometry =
    new THREE.PlaneGeometry(
        300,
        300
    );


const groundMaterial =
    new THREE.MeshStandardMaterial({

        map: groundDiffuse,

        normalMap: groundNormal,

        roughnessMap: groundRough,

        roughness: 1.0,

        metalness: 0.0
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
   CASTLE
   ========================================================= */

function createCastle() {

    const diffuse =
        textureLoader.load(
            "./assets/castle/diffuse.jpg"
        );

    const normal =
        textureLoader.load(
            "./assets/castle/normal.jpg"
        );

    const rough =
        textureLoader.load(
            "./assets/castle/rough.jpg"
        );

    const ao =
        textureLoader.load(
            "./assets/castle/ao.jpg"
        );


    diffuse.wrapS =
        THREE.RepeatWrapping;

    diffuse.wrapT =
        THREE.RepeatWrapping;

    normal.wrapS =
        THREE.RepeatWrapping;

    normal.wrapT =
        THREE.RepeatWrapping;

    rough.wrapS =
        THREE.RepeatWrapping;

    rough.wrapT =
        THREE.RepeatWrapping;


    diffuse.repeat.set(8, 5);
    normal.repeat.set(8, 5);
    rough.repeat.set(8, 5);


    const material =
        new THREE.MeshStandardMaterial({

            map: diffuse,

            normalMap: normal,

            roughnessMap: rough,

            aoMap: ao,

            roughness: 0.9,

            metalness: 0.0
        });


    const main =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                32,
                22,
                20
            ),
            material
        );


    main.position.set(
        0,
        11,
        -55
    );

    main.castShadow = true;
    main.receiveShadow = true;

    scene.add(main);


    /* Towers */

    const towerPositions = [
        [-19, -55],
        [19, -55],
        [-19, -39],
        [19, -39]
    ];


    for (const [x, z] of towerPositions) {

        const tower =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    5,
                    6,
                    28,
                    12
                ),

                material
            );


        tower.position.set(
            x,
            14,
            z
        );

        tower.castShadow = true;
        tower.receiveShadow = true;

        scene.add(tower);


        const roof =
            new THREE.Mesh(

                new THREE.ConeGeometry(
                    7,
                    9,
                    12
                ),

                new THREE.MeshStandardMaterial({
                    color: 0x25252b,
                    roughness: 0.8
                })
            );


        roof.position.set(
            x,
            32,
            z
        );

        roof.castShadow = true;

        scene.add(roof);
    }


    /* Castle entrance */

    const door =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                6,
                10,
                1
            ),

            new THREE.MeshStandardMaterial({
                color: 0x17110d,
                roughness: 0.7
            })
        );


    door.position.set(
        0,
        5,
        -65.2
    );

    scene.add(door);
}


createCastle();


/* =========================================================
   ROCKS
   ========================================================= */

function createRock(x, y, z, scale) {

    const geometry =
        new THREE.DodecahedronGeometry(
            2,
            1
        );


    const material =
        new THREE.MeshStandardMaterial({

            color: 0x55575b,

            roughness: 1.0
        });


    const rock =
        new THREE.Mesh(
            geometry,
            material
        );


    rock.position.set(
        x,
        y,
        z
    );


    rock.scale.setScalar(scale);

    rock.rotation.y =
        Math.random() * Math.PI;

    rock.castShadow = true;
    rock.receiveShadow = true;

    scene.add(rock);
}


for (let i = 0; i < 35; i++) {

    const angle =
        Math.random() *
        Math.PI * 2;

    const radius =
        35 +
        Math.random() * 70;

    createRock(

        Math.cos(angle) * radius,

        1,

        Math.sin(angle) * radius - 20,

        0.6 +
        Math.random() * 1.5
    );
}


/* =========================================================
   TREES
   ========================================================= */

const treeLoader =
    new GLTFLoader();

let treeModel = null;


treeLoader.load(

    "./assets/tree.glb",

    (gltf) => {

        treeModel =
            gltf.scene;

        treeModel.traverse(
            (child) => {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            }
        );


        for (let i = 0; i < 25; i++) {

            const tree =
                treeModel.clone(true);


            const angle =
                Math.random() *
                Math.PI * 2;

            const radius =
                30 +
                Math.random() * 75;


            tree.position.set(

                Math.cos(angle) * radius,

                0,

                Math.sin(angle) * radius - 20

            );


            const scale =
                0.8 +
                Math.random() * 0.7;

            tree.scale.setScalar(scale);

            tree.rotation.y =
                Math.random() * Math.PI * 2;

            scene.add(tree);
        }

    },

    undefined,

    (error) => {

        console.warn(
            "Tree loading failed:",
            error
        );

    }
);


/* =========================================================
   WATER
   ========================================================= */

const waterGeometry =
    new THREE.PlaneGeometry(
        45,
        45,
        20,
        20
    );


const waterMaterial =
    new THREE.MeshPhysicalMaterial({

        color: 0x244e63,

        transparent: true,

        opacity: 0.65,

        roughness: 0.15,

        metalness: 0.05,

        transmission: 0.05
    });


const water =
    new THREE.Mesh(
        waterGeometry,
        waterMaterial
    );


water.rotation.x =
    -Math.PI / 2;


water.position.set(
    32,
    0.15,
    -8
);


water.receiveShadow = true;

scene.add(water);


/* =========================================================
   PLAYER
   ========================================================= */

let player = null;

let mixer = null;

let currentAction = null;

const playerAnimations = {};


const playerLoader =
    new GLTFLoader();


function playAnimation(name) {

    if (!mixer) return;

    const action =
        playerAnimations[name];

    if (!action) return;

    if (currentAction === action)
        return;

    if (currentAction) {

        currentAction.fadeOut(0.2);

    }

    action.reset();

    action.fadeIn(0.2);

    action.play();

    currentAction = action;
}


playerLoader.load(

    "./assets/player/aren_valen.glb",

    (gltf) => {

        console.log(
            "AREN VALEN LOADED",
            gltf
        );


        player =
            gltf.scene;


        /* -----------------------------------------
           Find model size
           ----------------------------------------- */

        const box =
            new THREE.Box3()
                .setFromObject(player);


        const size =
            box.getSize(
                new THREE.Vector3()
            );


        const height =
            size.y;


        console.log(
            "Character height:",
            height
        );


        /* -----------------------------------------
           Automatic scaling
           ----------------------------------------- */

        if (height > 0) {

            const desiredHeight = 3.2;

            const scale =
                desiredHeight / height;

            player.scale.setScalar(scale);
        }


        /* -----------------------------------------
           Recalculate position
           ----------------------------------------- */

        const scaledBox =
            new THREE.Box3()
                .setFromObject(player);


        const bottom =
            scaledBox.min.y;


        player.position.y -= bottom;


        /* -----------------------------------------
           Place player
           ----------------------------------------- */

        player.position.x = 0;

        player.position.z = 12;


        /* -----------------------------------------
           Shadows
           ----------------------------------------- */

        player.traverse(
            (child) => {

                if (child.isMesh) {

                    child.castShadow = true;

                    child.receiveShadow = true;

                    if (child.material) {

                        child.material.needsUpdate =
                            true;

                    }
                }

            }
        );


        scene.add(player);


        /* -----------------------------------------
           Animations
           ----------------------------------------- */

        if (
            gltf.animations &&
            gltf.animations.length > 0
        ) {

            mixer =
                new THREE.AnimationMixer(
                    player
                );


            for (
                const clip
                of gltf.animations
            ) {

                const action =
                    mixer.clipAction(
                        clip
                    );


                const name =
                    clip.name.toLowerCase();


                if (
                    name.includes("idle")
                ) {

                    playerAnimations.idle =
                        action;

                }
                else if (
                    name.includes("walk")
                ) {

                    playerAnimations.walk =
                        action;

                }
                else if (
                    name.includes("run")
                ) {

                    playerAnimations.run =
                        action;

                }
                else if (
                    name.includes("jump")
                ) {

                    playerAnimations.jump =
                        action;

                }
            }


            if (
                playerAnimations.idle
            ) {

                playAnimation("idle");

            }
            else {

                const first =
                    gltf.animations[0];

                currentAction =
                    mixer.clipAction(
                        first
                    );

                currentAction.play();
            }
        }


        /* -----------------------------------------
           Hide loading screen
           ----------------------------------------- */

        const loading =
            document.getElementById(
                "loading"
            );


        if (loading) {

            loading.style.opacity = "0";

            setTimeout(
                () => {

                    loading.style.display =
                        "none";

                },
                500
            );
        }


        updateMessage(
            "Aren Valen has entered Aetheria."
        );

    },

    undefined,

    (error) => {

        console.error(
            "AREN VALEN GLB ERROR:",
            error
        );


        updateMessage(
            "Could not load Aren Valen. Check assets/player/aren_valen.glb"
        );


        const loadingText =
            document.querySelector(
                "#loading p"
            );


        if (loadingText) {

            loadingText.textContent =
                "Could not load Aren Valen. Check the character file.";

        }
    }
);


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

const velocity =
    new THREE.Vector3();


const direction =
    new THREE.Vector3();


let moving = false;

let jumpVelocity = 0;

let grounded = true;


const moveSpeed = 7;


/* =========================================================
   JOYSTICK
   ========================================================= */

const joystick =
    document.getElementById(
        "joystick"
    );


const stick =
    document.getElementById(
        "stick"
    );


let joystickX = 0;

let joystickY = 0;

let joystickActive = false;


if (joystick && stick) {

    function updateJoystick(
        event
    ) {

        const rect =
            joystick.getBoundingClientRect();


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


        const max =
            rect.width / 2 -
            25;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance > max) {

            dx =
                dx / distance *
                max;

            dy =
                dy / distance *
                max;
        }


        joystickX =
            dx / max;


        joystickY =
            dy / max;


        stick.style.transform =
            `translate(${dx}px, ${dy}px)`;

        joystickActive = true;

        moving =
            Math.abs(joystickX) > 0.1 ||
            Math.abs(joystickY) > 0.1;
    }


    joystick.addEventListener(
        "pointerdown",
        (event) => {

            joystick.setPointerCapture(
                event.pointerId
            );

            updateJoystick(event);
        }
    );


    joystick.addEventListener(
        "pointermove",
        (event) => {

            if (joystickActive) {

                updateJoystick(event);

            }

        }
    );


    joystick.addEventListener(
        "pointerup",
        resetJoystick
    );


    joystick.addEventListener(
        "pointercancel",
        resetJoystick
    );


    function resetJoystick() {

        joystickX = 0;

        joystickY = 0;

        joystickActive = false;

        moving = false;

        stick.style.transform =
            "translate(0px, 0px)";

        if (player) {

            playAnimation("idle");

        }
    }
}


/* =========================================================
   JUMP
   ========================================================= */

const jumpButton =
    document.getElementById(
        "jump"
    );


if (jumpButton) {

    jumpButton.addEventListener(
        "pointerdown",
        () => {

            if (!player) return;

            if (!grounded) return;

            jumpVelocity = 9;

            grounded = false;

            playAnimation("jump");

        }
    );
}


/* =========================================================
   SPELL
   ========================================================= */

const spellButton =
    document.getElementById(
        "spell"
    );


let magic = 100;

let xp = 0;


if (spellButton) {

    spellButton.addEventListener(
        "pointerdown",
        castSpell
    );
}


function castSpell() {

    if (!player) return;

    if (magic < 10) {

        updateMessage(
            "Not enough magic!"
        );

        return;
    }


    magic -= 10;


    const orb =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.22,
                12,
                12
            ),

            new THREE.MeshBasicMaterial({
                color: 0x66ccff
            })
        );


    orb.position.copy(
        player.position
    );


    orb.position.y += 2;


    const target =
        new THREE.Vector3(
            player.position.x,
            2,
            player.position.z - 18
        );


    const velocity =
        target
            .sub(orb.position)
            .normalize()
            .multiplyScalar(22);


    orb.userData.velocity =
        velocity;


    scene.add(orb);


    updateMessage(
        "Aren Valen casts a spell!"
    );
}


/* =========================================================
   SPELL UPDATE
   ========================================================= */

const spellObjects = [];


function updateSpells(delta) {

    for (
        let i = scene.children.length - 1;
        i >= 0;
        i--
    ) {

        const object =
            scene.children[i];


        if (
            object.userData &&
            object.userData.velocity
        ) {

            object.position.addScaledVector(
                object.userData.velocity,
                delta
            );


            object.userData.life =
                (object.userData.life || 0) +
                delta;


            if (
                object.userData.life > 2
            ) {

                scene.remove(object);

            }
        }
    }
}


/* =========================================================
   ENEMIES
   ========================================================= */

const enemies = [];


function createEnemy(
    x,
    z,
    type
) {

    const group =
        new THREE.Group();


    /* Body */

    const body =
        new THREE.Mesh(

            new THREE.CapsuleGeometry(
                0.65,
                1.4,
                5,
                10
            ),

            new THREE.MeshStandardMaterial({

                color:
                    type === "mage"
                    ? 0x321b45
                    : 0x24252b,

                roughness: 0.85
            })
        );


    body.position.y = 1.4;

    body.castShadow = true;

    group.add(body);


    /* Head */

    const head =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.55,
                12,
                12
            ),

            new THREE.MeshStandardMaterial({

                color: 0x8a7060,

                roughness: 0.9
            })
        );


    head.position.y = 2.65;

    head.castShadow = true;

    group.add(head);


    /* Eyes */

    for (
        const side of [-1, 1]
    ) {

        const eye =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.07,
                    8,
                    8
                ),

                new THREE.MeshBasicMaterial({
                    color: 0xff2222
                })
            );


        eye.position.set(
            side * 0.2,
            2.72,
            -0.48
        );


        group.add(eye);
    }


    group.position.set(
        x,
        0,
        z
    );


    scene.add(group);


    enemies.push({

        mesh: group,

        health: 100,

        speed:
            type === "mage"
            ? 1.5
            : 2.0

    });
}


createEnemy(-8, -5, "shadow");
createEnemy(8, -5, "shadow");
createEnemy(-14, -20, "mage");
createEnemy(14, -20, "shadow");


/* =========================================================
   ENEMY AI
   ========================================================= */

function updateEnemies(delta) {

    if (!player) return;


    for (
        const enemy
        of enemies
    ) {

        const distance =
            enemy.mesh.position.distanceTo(
                player.position
            );


        if (
            distance > 3 &&
            distance < 35
        ) {

            direction
                .subVectors(
                    player.position,
                    enemy.mesh.position
                )
                .normalize();


            enemy.mesh.position.addScaledVector(
                direction,
                enemy.speed * delta
            );


            enemy.mesh.lookAt(
                player.position.x,
                enemy.mesh.position.y,
                player.position.z
            );
        }
    }
}


/* =========================================================
   CAMERA
   ========================================================= */

const cameraTarget =
    new THREE.Vector3();


function updateCamera(delta) {

    if (!player) return;


    const desired =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 5,
            player.position.z + 9
        );


    camera.position.lerp(
        desired,
        1 -
        Math.pow(
            0.001,
            delta
        )
    );


    cameraTarget.set(

        player.position.x,

        player.position.y + 1.5,

        player.position.z

    );


    camera.lookAt(
        cameraTarget
    );
}


/* =========================================================
   PLAYER UPDATE
   ========================================================= */

function updatePlayer(delta) {

    if (!player) return;


    if (joystickActive) {

        const forward =
            new THREE.Vector3(
                0,
                0,
                -joystickY
            );


        const sideways =
            new THREE.Vector3(
                joystickX,
                0,
                0
            );


        direction
            .copy(forward)
            .add(sideways);


        if (direction.length() > 1) {

            direction.normalize();

        }


        player.position.addScaledVector(
            direction,
            moveSpeed * delta
        );


        if (
            direction.lengthSq() > 0.01
        ) {

            const angle =
                Math.atan2(
                    direction.x,
                    direction.z
                );


            player.rotation.y =
                angle + Math.PI;


            if (
                playerAnimations.run
            ) {

                playAnimation("run");

            }
            else if (
                playerAnimations.walk
            ) {

                playAnimation("walk");

            }
        }

    }
    else {

        if (
            playerAnimations.idle
        ) {

            playAnimation("idle");

        }
    }


    /* Jump */

    if (!grounded) {

        jumpVelocity -=
            22 * delta;

        player.position.y +=
            jumpVelocity * delta;


        if (
            player.position.y <= 0
        ) {

            player.position.y = 0;

            jumpVelocity = 0;

            grounded = true;

            playAnimation("idle");
        }
    }
}


/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {

    const hp =
        document.getElementById(
            "hp"
        );


    const magicBar =
        document.getElementById(
            "magic"
        );


    const xpBar =
        document.getElementById(
            "xp"
        );


    if (magicBar) {

        magicBar.style.width =
            `${magic}%`;

    }


    if (xpBar) {

        xpBar.style.width =
            `${Math.min(xp, 100)}%`;

    }


    if (hp) {

        hp.style.width =
            "100%";

    }
}


function updateMessage(text) {

    const message =
        document.getElementById(
            "message"
        );


    if (message) {

        message.textContent =
            text;

    }
}


/* =========================================================
   WATER ANIMATION
   ========================================================= */

let waterTime = 0;


function updateWater(delta) {

    waterTime += delta;


    const position =
        water.geometry.attributes.position;


    for (
        let i = 0;
        i < position.count;
        i++
    ) {

        const x =
            position.getX(i);

        const y =
            position.getY(i);


        position.setZ(
            i,
            Math.sin(
                x * 0.3 +
                waterTime * 1.5
            ) *
            0.12 +
            Math.cos(
                y * 0.25 +
                waterTime
            ) *
            0.08
        );
    }


    position.needsUpdate = true;
}


/* =========================================================
   MAGIC REGENERATION
   ========================================================= */

let magicTimer = 0;


function regenerateMagic(delta) {

    magicTimer += delta;


    if (
        magicTimer > 0.15
    ) {

        magic += 0.5;

        magic =
            Math.min(
                magic,
                100
            );

        magicTimer = 0;
    }
}


/* =========================================================
   RESIZE
   ========================================================= */

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


/* =========================================================
   GAME LOOP
   ========================================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    if (mixer) {

        mixer.update(delta);

    }


    updatePlayer(delta);

    updateEnemies(delta);

    updateSpells(delta);

    updateWater(delta);

    regenerateMagic(delta);

    updateHUD();

    updateCamera(delta);


    renderer.render(
        scene,
        camera
    );
}


animate();


/* =========================================================
   START MESSAGE
   ========================================================= */

updateMessage(
    "Entering Aetheria Academy..."
);
