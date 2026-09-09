/* =========================================================
   WIZARDING WORLD 3D
   REALISTIC FANTASY VALLEY
   MOBILE WEBGL VERSION
========================================================= */

const THREE = window.THREE;

/* =========================================================
   BASIC SETUP
========================================================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x9db6c9);

scene.fog =
    new THREE.FogExp2(
        0x91a6b2,
        0.0045
    );


const camera =
    new THREE.PerspectiveCamera(
        65,
        window.innerWidth /
        window.innerHeight,
        0.1,
        900
    );

camera.position.set(
    0,
    5,
    15
);


const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
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

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
    1.05;

document
    .getElementById("game")
    .appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
========================================================= */

const hemi =
    new THREE.HemisphereLight(
        0xc7e2ff,
        0x31452e,
        1.8
    );

scene.add(hemi);


const sun =
    new THREE.DirectionalLight(
        0xffe7c1,
        3.0
    );

sun.position.set(
    -80,
    120,
    50
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -150;
sun.shadow.camera.right = 150;
sun.shadow.camera.top = 150;
sun.shadow.camera.bottom = -150;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 400;

scene.add(sun);


/* =========================================================
   MATERIAL HELPERS
========================================================= */

function mat(
    color,
    roughness = 0.8,
    metalness = 0
) {

    return new THREE.MeshStandardMaterial({

        color,

        roughness,

        metalness
    });
}


/* =========================================================
   TERRAIN
========================================================= */

const terrainGeo =
    new THREE.PlaneGeometry(
        600,
        600,
        120,
        120
    );

terrainGeo.rotateX(
    -Math.PI / 2
);

const vertices =
    terrainGeo.attributes.position;

for (
    let i = 0;
    i < vertices.count;
    i++
) {

    const x =
        vertices.getX(i);

    const z =
        vertices.getZ(i);

    const wave1 =
        Math.sin(x * 0.035) * 3;

    const wave2 =
        Math.cos(z * 0.045) * 2;

    const wave3 =
        Math.sin(
            (x + z) * 0.025
        ) * 3;

    const distance =
        Math.sqrt(
            x * x +
            z * z
        );

    const valley =
        Math.max(
            0,
            1 -
            distance / 280
        );

    const height =
        (
            wave1 +
            wave2 +
            wave3
        ) * .35;

    vertices.setY(
        i,
        height * valley
    );
}

terrainGeo.computeVertexNormals();

const terrain =
    new THREE.Mesh(
        terrainGeo,
        new THREE.MeshStandardMaterial({

            color: 0x385c35,

            roughness: 1,

            metalness: 0
        })
    );

terrain.receiveShadow = true;

scene.add(terrain);


/* =========================================================
   PATH
========================================================= */

const path =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            12,
            250
        ),

        new THREE.MeshStandardMaterial({

            color: 0x695b4b,

            roughness: 1
        })
    );

path.rotation.x =
    -Math.PI / 2;

path.position.y =
    0.08;

scene.add(path);


/* =========================================================
   WATER
========================================================= */

const waterGeo =
    new THREE.CircleGeometry(
        48,
        96
    );

waterGeo.rotateX(
    -Math.PI / 2
);

const waterMat =
    new THREE.MeshPhysicalMaterial({

        color: 0x24566a,

        roughness: 0.08,

        metalness: 0.05,

        transparent: true,

        opacity: 0.82,

        transmission: 0.1
    });

const water =
    new THREE.Mesh(
        waterGeo,
        waterMat
    );

water.position.set(
    75,
    0.18,
    -55
);

scene.add(water);


/* =========================================================
   CASTLE
========================================================= */

function createCastle() {

    const castle =
        new THREE.Group();

    const stone =
        mat(
            0x777b7b,
            0.9
        );

    const darkStone =
        mat(
            0x45494a,
            0.95
        );

    const roofMat =
        mat(
            0x25292c,
            0.75
        );

    /* Main building */

    const main =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                44,
                30,
                28
            ),

            stone
        );

    main.position.y = 15;

    main.castShadow = true;
    main.receiveShadow = true;

    castle.add(main);


    /* Side wings */

    for (
        let side of [-1, 1]
    ) {

        const wing =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    18,
                    22,
                    24
                ),

                stone
            );

        wing.position.set(
            side * 30,
            11,
            1
        );

        wing.castShadow = true;
        wing.receiveShadow = true;

        castle.add(wing);
    }


    /* Towers */

    const towerPositions = [

        [-32, 0],
        [32, 0],
        [-20, -18],
        [20, -18]

    ];

    towerPositions.forEach(
        p => {

            const tower =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        6,
                        7,
                        34,
                        16
                    ),

                    darkStone
                );

            tower.position.set(
                p[0],
                17,
                p[1]
            );

            tower.castShadow = true;
            tower.receiveShadow = true;

            castle.add(tower);


            const roof =
                new THREE.Mesh(

                    new THREE.ConeGeometry(
                        7.5,
                        10,
                        16
                    ),

                    roofMat
                );

            roof.position.set(
                p[0],
                39,
                p[1]
            );

            roof.castShadow = true;

            castle.add(roof);
        }
    );


    /* Main roof */

    const roof =
        new THREE.Mesh(

            new THREE.ConeGeometry(
                25,
                16,
                4
            ),

            roofMat
        );

    roof.position.y = 38;

    roof.rotation.y =
        Math.PI / 4;

    roof.castShadow = true;

    castle.add(roof);


    /* Windows */

    for (
        let x = -15;
        x <= 15;
        x += 10
    ) {

        for (
            let y = 10;
            y <= 25;
            y += 7
        ) {

            const window =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        2.2,
                        4,
                        .3
                    ),

                    new THREE.MeshStandardMaterial({

                        color: 0x8bc6e8,

                        emissive: 0x32698a,

                        emissiveIntensity: 0.6,

                        roughness: .15
                    })
                );

            window.position.set(
                x,
                y,
                -14.15
            );

            castle.add(window);
        }
    }


    castle.position.set(
        0,
        0,
        -125
    );

    scene.add(castle);
}

createCastle();


/* =========================================================
   TREES
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
                .55,
                .9,
                8,
                8
            ),

            mat(
                0x4a3020,
                1
            )
        );

    trunk.position.y = 4;

    trunk.castShadow = true;

    tree.add(trunk);


    const leafMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x173d25,

            roughness: 1
        });


    const levels = [

        [2.8, 8],
        [4.8, 7],
        [6.8, 5.5],
        [8.4, 4]

    ];


    levels.forEach(
        level => {

            const leaves =
                new THREE.Mesh(

                    new THREE.ConeGeometry(
                        level[1],
                        6,
                        10
                    ),

                    leafMaterial
                );

            leaves.position.y =
                level[0] + 3;

            leaves.castShadow = true;

            tree.add(leaves);
        }
    );


    tree.position.set(
        x,
        0,
        z
    );

    tree.scale.setScalar(
        scale
    );

    scene.add(tree);
}


/* Forest */

for (
    let i = 0;
    i < 75;
    i++
) {

    const side =
        Math.random() > .5
            ? 1
            : -1;

    const x =
        side *
        (18 + Math.random() * 110);

    const z =
        -140 +
        Math.random() * 260;

    const scale =
        .7 +
        Math.random() * .8;

    createTree(
        x,
        z,
        scale
    );
}


/* =========================================================
   ROCKS
========================================================= */

function createRock(
    x,
    z,
    scale
) {

    const rock =
        new THREE.Mesh(

            new THREE.DodecahedronGeometry(
                2.5,
                1
            ),

            mat(
                0x5d625e,
                1
            )
        );

    rock.position.set(
        x,
        1,
        z
    );

    rock.scale.set(
        scale * 1.3,
        scale,
        scale * .8
    );

    rock.rotation.y =
        Math.random() * 5;

    rock.castShadow = true;
    rock.receiveShadow = true;

    scene.add(rock);
}


for (
    let i = 0;
    i < 40;
    i++
) {

    createRock(

        (Math.random() - .5) * 240,

        (Math.random() - .5) * 250,

        .5 +
        Math.random() * 1.5
    );
}


/* =========================================================
   MOUNTAINS
========================================================= */

function createMountain(
    x,
    z,
    height,
    radius
) {

    const mountain =
        new THREE.Mesh(

            new THREE.ConeGeometry(
                radius,
                height,
                12
            ),

            mat(
                0x45504b,
                1
            )
        );

    mountain.position.set(
        x,
        height / 2 - 2,
        z
    );

    mountain.castShadow = true;

    scene.add(mountain);


    const snow =
        new THREE.Mesh(

            new THREE.ConeGeometry(
                radius * .28,
                height * .3,
                8
            ),

            mat(
                0xc8d2d3,
                .9
            )
        );

    snow.position.set(
        x,
        height * .83,
        z
    );

    scene.add(snow);
}


createMountain(
    -150,
    -160,
    100,
    65
);

createMountain(
    150,
    -180,
    130,
    80
);

createMountain(
    -170,
    20,
    80,
    60
);

createMountain(
    170,
    20,
    90,
    65
);


/* =========================================================
   WIZARD
========================================================= */

const player =
    new THREE.Group();


/* legs */

const legMat =
    mat(
        0x20242a,
        .9
    );

const robeMat =
    mat(
        0x252b3b,
        .8
    );

const skinMat =
    mat(
        0xc58d72,
        .8
    );


const leg1 =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            .45,
            .55,
            2.5,
            10
        ),
        legMat
    );

leg1.position.set(
    -.45,
    1.25,
    0
);

player.add(leg1);


const leg2 =
    leg1.clone();

leg2.position.x =
    .45;

player.add(leg2);


/* robe */

const robe =
    new THREE.Mesh(

        new THREE.ConeGeometry(
            1.6,
            3.8,
            16
        ),

        robeMat
    );

robe.position.y =
    3.2;

robe.castShadow = true;

player.add(robe);


/* head */

const head =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            1,
            24,
            16
        ),

        skinMat
    );

head.position.y =
    5.7;

head.castShadow = true;

player.add(head);


/* hair */

const hair =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            1.06,
            20,
            12
        ),

        mat(
            0x191512,
            1
        )
    );

hair.scale.y =
    .75;

hair.position.y =
    6.15;

player.add(hair);


/* hat */

const hat =
    new THREE.Mesh(

        new THREE.ConeGeometry(
            1.35,
            2.8,
            24
        ),

        mat(
            0x171827,
            .8
        )
    );

hat.position.y =
    7.7;

hat.rotation.z =
    -.08;

hat.castShadow = true;

player.add(hat);


/* hat rim */

const rim =
    new THREE.Mesh(

        new THREE.CylinderGeometry(
            1.65,
            1.65,
            .2,
            24
        ),

        mat(
            0x171827,
            .8
        )
    );

rim.position.y =
    6.55;

player.add(rim);


/* wand */

const wand =
    new THREE.Mesh(

        new THREE.CylinderGeometry(
            .06,
            .09,
            2.7,
            8
        ),

        mat(
            0x4b2818,
            .9
        )
    );

wand.rotation.z =
    -.8;

wand.position.set(
    1.4,
    4,
    -.4
);

player.add(wand);


/* wand glow */

const wandLight =
    new THREE.PointLight(
        0x7f8cff,
        1.5,
        10
    );

wandLight.position.set(
    2.3,
    4.9,
    -.7
);

player.add(wandLight);


player.position.set(
    0,
    0,
    10
);

scene.add(player);


/* =========================================================
   CONTROLS
========================================================= */

const keys = {};

window.addEventListener(
    "keydown",
    e => {

        keys[e.key.toLowerCase()] = true;

        if (
            e.key === " " ||
            e.key === "ArrowUp"
        ) {

            jump();
        }

        if (
            e.key.toLowerCase() === "f"
        ) {

            castSpell();
        }
    }
);


window.addEventListener(
    "keyup",
    e => {

        keys[e.key.toLowerCase()] =
            false;
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

let joystickX = 0;
let joystickY = 0;

let joystickActive = false;


joystickBase.addEventListener(
    "pointerdown",
    e => {

        joystickActive = true;

        joystickBase.setPointerCapture(
            e.pointerId
        );

        updateJoystick(e);
    }
);


joystickBase.addEventListener(
    "pointermove",
    e => {

        if (
            joystickActive
        ) {

            updateJoystick(e);
        }
    }
);


joystickBase.addEventListener(
    "pointerup",
    resetJoystick
);

joystickBase.addEventListener(
    "pointercancel",
    resetJoystick
);


function updateJoystick(e) {

    const rect =
        joystickBase.getBoundingClientRect();

    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;

    let dx =
        e.clientX -
        centerX;

    let dy =
        e.clientY -
        centerY;

    const max =
        35;

    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    if (
        length > max
    ) {

        dx =
            dx / length *
            max;

        dy =
            dy / length *
            max;
    }

    joystickX =
        dx / max;

    joystickY =
        dy / max;

    joystickStick.style.transform =
        `translate(${dx}px, ${dy}px)`;
}


function resetJoystick() {

    joystickActive = false;

    joystickX = 0;
    joystickY = 0;

    joystickStick.style.transform =
        "translate(0,0)";
}


/* =========================================================
   CAMERA
========================================================= */

let cameraYaw = 0;

let cameraPitch = -.18;

let lookStartX = 0;
let lookStartY = 0;

let looking = false;


renderer.domElement.addEventListener(
    "pointerdown",
    e => {

        if (
            e.clientX <
            window.innerWidth * .65
        ) {

            looking = true;

            lookStartX =
                e.clientX;

            lookStartY =
                e.clientY;
        }
    }
);


renderer.domElement.addEventListener(
    "pointermove",
    e => {

        if (!looking)
            return;

        const dx =
            e.clientX -
            lookStartX;

        const dy =
            e.clientY -
            lookStartY;

        cameraYaw -=
            dx * .004;

        cameraPitch -=
            dy * .003;

        cameraPitch =
            Math.max(
                -.8,
                Math.min(
                    .45,
                    cameraPitch
                )
            );

        lookStartX =
            e.clientX;

        lookStartY =
            e.clientY;
    }
);


renderer.domElement.addEventListener(
    "pointerup",
    () => {

        looking = false;
    }
);


/* =========================================================
   JUMP
========================================================= */

let velocityY = 0;

let grounded = true;


function jump() {

    if (
        grounded
    ) {

        velocityY =
            12;

        grounded =
            false;
    }
}


document
    .getElementById("jumpBtn")
    .addEventListener(
        "pointerdown",
        jump
    );


/* =========================================================
   MAGIC
========================================================= */

let magic = 100;

let xp = 0;


function castSpell() {

    if (
        magic < 10
    ) {

        showMessage(
            "Not enough magic"
        );

        return;
    }

    magic -= 10;

    updateHUD();


    const spell =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                .28,
                16,
                16
            ),

            new THREE.MeshBasicMaterial({

                color:
                    0x8f7cff
            })
        );


    const light =
        new THREE.PointLight(
            0x8c75ff,
            5,
            12
        );


    spell.add(light);


    const worldPos =
        new THREE.Vector3();

    wand.getWorldPosition(
        worldPos
    );

    spell.position.copy(
        worldPos
    );


    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    direction.applyQuaternion(
        player.quaternion
    );

    spell.userData.velocity =
        direction.multiplyScalar(
            35
        );


    scene.add(spell);

    spells.push(spell);
}


document
    .getElementById("spellBtn")
    .addEventListener(
        "pointerdown",
        castSpell
    );


const spells = [];


/* =========================================================
   ENEMIES
========================================================= */

const enemies = [];


function createEnemy(
    x,
    z
) {

    const enemy =
        new THREE.Group();


    const body =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                1.3,
                16,
                12
            ),

            mat(
                0x351f30,
                .9
            )
        );

    body.position.y =
        1.5;

    body.scale.y =
        1.2;

    body.castShadow = true;

    enemy.add(body);


    const eyeMat =
        new THREE.MeshBasicMaterial({
            color: 0xff3344
        });


    for (
        let side of [-.35, .35]
    ) {

        const eye =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    .12,
                    8,
                    8
                ),

                eyeMat
            );

        eye.position.set(
            side,
            1.8,
            -1.1
        );

        enemy.add(eye);
    }


    enemy.position.set(
        x,
        0,
        z
    );

    scene.add(enemy);

    enemies.push(enemy);
}


createEnemy(
    20,
    -30
);

createEnemy(
    -25,
    -60
);

createEnemy(
    30,
    -100
);


/* =========================================================
   HUD
========================================================= */

let hp = 100;

const hpBar =
    document.getElementById(
        "hpBar"
    );

const magicBar =
    document.getElementById(
        "magicBar"
    );

const hpText =
    document.getElementById(
        "hpText"
    );

const magicText =
    document.getElementById(
        "magicText"
    );

const xpText =
    document.getElementById(
        "xpText"
    );


function updateHUD() {

    hp =
        Math.max(
            0,
            Math.min(
                100,
                hp
            )
        );

    magic =
        Math.max(
            0,
            Math.min(
                100,
                magic
            )
        );

    hpBar.style.width =
        hp + "%";

    magicBar.style.width =
        magic + "%";

    hpText.textContent =
        Math.round(hp);

    magicText.textContent =
        Math.round(magic);

    xpText.textContent =
        xp;
}


/* =========================================================
   MESSAGE
========================================================= */

let messageTimer = null;


function showMessage(
    text
) {

    const el =
        document.getElementById(
            "message"
        );

    el.textContent =
        text;

    el.style.opacity =
        "1";

    clearTimeout(
        messageTimer
    );

    messageTimer =
        setTimeout(
            () => {

                el.style.opacity =
                    "0";

            },
            1800
        );
}


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

const clock =
    new THREE.Clock();


function movePlayer(
    dt
) {

    let forward = 0;
    let strafe = 0;


    forward =
        -joystickY;

    strafe =
        joystickX;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        forward += 1;
    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        forward -= 1;
    }

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        strafe -= 1;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        strafe += 1;
    }


    const length =
        Math.sqrt(
            forward * forward +
            strafe * strafe
        );


    if (
        length > 1
    ) {

        forward /= length;
        strafe /= length;
    }


    const speed =
        16;


    const sin =
        Math.sin(
            cameraYaw
        );

    const cos =
        Math.cos(
            cameraYaw
        );


    player.position.x +=
        (
            strafe * cos -
            forward * sin
        ) *
        speed *
        dt;


    player.position.z +=
        (
            strafe * sin +
            forward * cos
        ) *
        speed *
        dt;


    /* animation */

    if (
        length > .1
    ) {

        player.rotation.y =
            Math.atan2(
                -(
                    strafe * cos -
                    forward * sin
                ),
                -(
                    strafe * sin +
                    forward * cos
                )
            );

        player.position.y +=
            Math.sin(
                performance.now() *
                .012
            ) *
            .008;
    }
}


/* =========================================================
   PHYSICS
========================================================= */

function physics(
    dt
) {

    velocityY -=
        30 * dt;

    player.position.y +=
        velocityY * dt;


    if (
        player.position.y <= 0
    ) {

        player.position.y =
            0;

        velocityY =
            0;

        grounded =
            true;
    }
}


/* =========================================================
   SPELL UPDATE
========================================================= */

function updateSpells(
    dt
) {

    for (
        let i = spells.length - 1;
        i >= 0;
        i--
    ) {

        const spell =
            spells[i];


        spell.position.add(
            spell.userData.velocity
                .clone()
                .multiplyScalar(dt)
        );


        let remove = false;


        for (
            const enemy of enemies
        ) {

            if (
                spell.position.distanceTo(
                    enemy.position
                ) < 2.5
            ) {

                scene.remove(
                    enemy
                );

                const index =
                    enemies.indexOf(
                        enemy
                    );

                if (
                    index !== -1
                ) {

                    enemies.splice(
                        index,
                        1
                    );
                }

                xp += 25;

                showMessage(
                    "+25 XP"
                );

                updateHUD();

                remove = true;

                break;
            }
        }


        if (
            spell.position.length() >
            400
        ) {

            remove = true;
        }


        if (
            remove
        ) {

            scene.remove(
                spell
            );

            spells.splice(
                i,
                1
            );
        }
    }
}


/* =========================================================
   ENEMY AI
========================================================= */

let damageCooldown = 0;


function updateEnemies(
    dt
) {

    damageCooldown -= dt;


    enemies.forEach(
        enemy => {

            const direction =
                new THREE.Vector3()
                    .subVectors(
                        player.position,
                        enemy.position
                    );


            const distance =
                direction.length();


            if (
                distance < 35
            ) {

                direction.normalize();


                enemy.position.x +=
                    direction.x *
                    dt *
                    2.5;


                enemy.position.z +=
                    direction.z *
                    dt *
                    2.5;


                enemy.lookAt(
                    player.position.x,
                    enemy.position.y,
                    player.position.z
                );
            }


            if (
                distance < 3
                &&
                damageCooldown <= 0
            ) {

                hp -= 8;

                damageCooldown =
                    1;

                updateHUD();

                showMessage(
                    "You were attacked!"
                );
            }
        }
    );
}


/* =========================================================
   CAMERA FOLLOW
========================================================= */

function updateCamera() {

    const distance =
        11;

    const height =
        6;


    const target =
        new THREE.Vector3(
            player.position.x,
            player.position.y +
            4.5,
            player.position.z
        );


    const cameraX =
        player.position.x -
        Math.sin(
            cameraYaw
        ) *
        distance *
        Math.cos(
            cameraPitch
        );


    const cameraZ =
        player.position.z -
        Math.cos(
            cameraYaw
        ) *
        distance *
        Math.cos(
            cameraPitch
        );


    const cameraY =
        player.position.y +
        height +
        Math.sin(
            cameraPitch
        ) *
        distance;


    camera.position.lerp(
        new THREE.Vector3(
            cameraX,
            cameraY,
            cameraZ
        ),
        .12
    );


    camera.lookAt(
        target
    );
}


/* =========================================================
   DAY / NIGHT
========================================================= */

let worldTime = 0;


function updateLighting(
    dt
) {

    worldTime +=
        dt * .025;


    const cycle =
        Math.sin(
            worldTime
        );


    sun.position.y =
        80 +
        cycle * 50;


    const daylight =
        Math.max(
            .25,
            .65 +
            cycle * .35
        );


    sun.intensity =
        2.2 *
        daylight;


    hemi.intensity =
        1.2 *
        daylight;


    if (
        cycle < -.2
    ) {

        scene.background
            .lerp(
                new THREE.Color(
                    0x101827
                ),
                .01
            );

        scene.fog.color.lerp(
            new THREE.Color(
                0x111827
            ),
            .01
        );

    } else {

        scene.background
            .lerp(
                new THREE.Color(
                    0x9db6c9
                ),
                .01
            );

        scene.fog.color.lerp(
            new THREE.Color(
                0x91a6b2
            ),
            .01
        );
    }
}


/* =========================================================
   WATER ANIMATION
========================================================= */

function animateWater() {

    water.position.y =
        .18 +
        Math.sin(
            performance.now() *
            .0015
        ) *
        .05;

    water.rotation.z =
        Math.sin(
            performance.now() *
            .0003
        ) *
        .015;
}


/* =========================================================
   MAGIC REGEN
========================================================= */

let regenTimer = 0;


function regenerateMagic(
    dt
) {

    regenTimer += dt;

    if (
        regenTimer > .5
    ) {

        regenTimer = 0;

        magic += 1;

        updateHUD();
    }
}


/* =========================================================
   MAIN LOOP
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const dt =
        Math.min(
            clock.getDelta(),
            .05
        );


    movePlayer(
        dt
    );

    physics(
        dt
    );

    updateSpells(
        dt
    );

    updateEnemies(
        dt
    );

    updateCamera();

    updateLighting(
        dt
    );

    regenerateMagic(
        dt
    );

    animateWater();


    renderer.render(
        scene,
        camera
    );
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
   START
========================================================= */

updateHUD();

showMessage(
    "Explore the enchanted valley"
);

animate();
