/* =========================================================
   WIZARDING WORLD 3D
   REALISTIC WORLD V2
   BRIGHT DAY / CASTLE / FOREST / LAKE
========================================================= */

const scene = new THREE.Scene();

/* =========================================================
   SKY
========================================================= */

scene.background = new THREE.Color(0x87b7d8);

scene.fog = new THREE.Fog(
    0x9bbbc9,
    100,
    420
);


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    700
);

camera.position.set(
    0,
    6,
    18
);


/* =========================================================
   RENDERER
========================================================= */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
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

renderer.toneMappingExposure =
    1.35;

document
    .getElementById("game")
    .appendChild(renderer.domElement);


/* =========================================================
   LIGHTING
========================================================= */

/* Bright sky light */

const skyLight =
    new THREE.HemisphereLight(
        0xd8efff,
        0x49623e,
        2.8
    );

scene.add(skyLight);


/* Sun */

const sun =
    new THREE.DirectionalLight(
        0xfff1d2,
        4.5
    );

sun.position.set(
    -80,
    140,
    70
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -180;
sun.shadow.camera.right = 180;
sun.shadow.camera.top = 180;
sun.shadow.camera.bottom = -180;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 450;

scene.add(sun);


/* soft fill */

const fill =
    new THREE.DirectionalLight(
        0x9fc8ff,
        0.8
    );

fill.position.set(
    100,
    70,
    100
);

scene.add(fill);


/* =========================================================
   MATERIALS
========================================================= */

function material(
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

const terrainGeometry =
    new THREE.PlaneGeometry(
        600,
        600,
        100,
        100
    );

terrainGeometry.rotateX(
    -Math.PI / 2
);

const positions =
    terrainGeometry.attributes.position;

for (
    let i = 0;
    i < positions.count;
    i++
) {

    const x =
        positions.getX(i);

    const z =
        positions.getZ(i);

    let y = 0;

    y +=
        Math.sin(x * 0.035) *
        2.2;

    y +=
        Math.cos(z * 0.04) *
        1.8;

    y +=
        Math.sin(
            (x + z) * 0.025
        ) *
        2;

    const distance =
        Math.sqrt(
            x * x +
            z * z
        );

    if (
        distance < 100
    ) {

        y *=
            distance / 100;
    }

    positions.setY(
        i,
        y * 0.35
    );
}

terrainGeometry.computeVertexNormals();


const terrain =
    new THREE.Mesh(
        terrainGeometry,

        material(
            0x426b3d,
            1
        )
    );

terrain.receiveShadow = true;

scene.add(terrain);


/* =========================================================
   GRASS PATCHES
========================================================= */

function createGrassPatch(
    x,
    z
) {

    const group =
        new THREE.Group();

    const grassMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x4e7e3f,
            roughness: 1
        });

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const blade =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    0.08,
                    0.8,
                    4
                ),
                grassMaterial
            );

        blade.position.set(
            (Math.random() - .5) * 2,
            .4,
            (Math.random() - .5) * 2
        );

        blade.rotation.z =
            (Math.random() - .5) * .4;

        group.add(blade);
    }

    group.position.set(
        x,
        0,
        z
    );

    scene.add(group);
}


for (
    let i = 0;
    i < 180;
    i++
) {

    const x =
        (Math.random() - .5) *
        250;

    const z =
        (Math.random() - .5) *
        280;

    createGrassPatch(
        x,
        z
    );
}


/* =========================================================
   MAIN ROAD
========================================================= */

const road =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            14,
            270
        ),

        material(
            0x806b55,
            1
        )
    );

road.rotation.x =
    -Math.PI / 2;

road.position.y =
    0.15;

scene.add(road);


/* =========================================================
   CASTLE
========================================================= */

function createCastle() {

    const castle =
        new THREE.Group();


    const stone =
        material(
            0x858b8d,
            .9
        );

    const stoneDark =
        material(
            0x62686a,
            .95
        );

    const roof =
        material(
            0x343b42,
            .75
        );


    /* Main building */

    const main =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                52,
                28,
                30
            ),
            stone
        );

    main.position.y =
        14;

    main.castShadow = true;
    main.receiveShadow = true;

    castle.add(main);


    /* Side buildings */

    for (
        const side of [-1, 1]
    ) {

        const building =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    20,
                    23,
                    28
                ),
                stoneDark
            );

        building.position.set(
            side * 34,
            11.5,
            0
        );

        building.castShadow = true;

        castle.add(building);
    }


    /* Towers */

    const towers = [

        [-38, -2],
        [38, -2],
        [-24, -19],
        [24, -19]

    ];


    towers.forEach(
        position => {

            const tower =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        7,
                        8,
                        38,
                        20
                    ),

                    stoneDark
                );

            tower.position.set(
                position[0],
                19,
                position[1]
            );

            tower.castShadow = true;
            tower.receiveShadow = true;

            castle.add(tower);


            const towerRoof =
                new THREE.Mesh(

                    new THREE.ConeGeometry(
                        9,
                        13,
                        20
                    ),

                    roof
                );

            towerRoof.position.set(
                position[0],
                44,
                position[1]
            );

            towerRoof.castShadow =
                true;

            castle.add(
                towerRoof
            );
        }
    );


    /* Main roof */

    const mainRoof =
        new THREE.Mesh(

            new THREE.ConeGeometry(
                31,
                17,
                4
            ),

            roof
        );

    mainRoof.position.y =
        36;

    mainRoof.rotation.y =
        Math.PI / 4;

    mainRoof.castShadow =
        true;

    castle.add(
        mainRoof
    );


    /* Windows */

    const windowMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xbdeaff,

            emissive: 0x4286aa,

            emissiveIntensity: 1,

            roughness: .15
        });


    for (
        let x = -20;
        x <= 20;
        x += 10
    ) {

        for (
            let y = 8;
            y <= 23;
            y += 7
        ) {

            const window =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        2.4,
                        4.5,
                        .25
                    ),

                    windowMaterial
                );

            window.position.set(
                x,
                y,
                -15.15
            );

            castle.add(
                window
            );
        }
    }


    /* Entrance */

    const door =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                7,
                10,
                .7
            ),

            material(
                0x281a13,
                .9
            )
        );

    door.position.set(
        0,
        5,
        15.3
    );

    castle.add(
        door
    );


    /* Entrance arch */

    const arch =
        new THREE.Mesh(

            new THREE.TorusGeometry(
                4,
                .55,
                10,
                32,
                Math.PI
            ),

            stoneDark
        );

    arch.position.set(
        0,
        10,
        15.5
    );

    arch.rotation.x =
        Math.PI / 2;

    castle.add(
        arch
    );


    /* Castle position */

    castle.position.set(
        0,
        0,
        -95
    );

    scene.add(
        castle
    );
}

createCastle();


/* =========================================================
   CASTLE TORCHES
========================================================= */

function createTorch(
    x,
    z
) {

    const group =
        new THREE.Group();


    const stick =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                .12,
                .16,
                3,
                8
            ),

            material(
                0x382217,
                1
            )
        );

    stick.position.y =
        1.5;

    group.add(
        stick
    );


    const flame =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                .35,
                12,
                12
            ),

            new THREE.MeshStandardMaterial({

                color: 0xffb32b,

                emissive: 0xff6a00,

                emissiveIntensity: 3
            })
        );

    flame.position.y =
        3.2;

    group.add(
        flame
    );


    const light =
        new THREE.PointLight(
            0xff8a32,
            3,
            15
        );

    light.position.y =
        3.2;

    group.add(
        light
    );


    group.position.set(
        x,
        0,
        z
    );

    scene.add(
        group
    );
}


createTorch(
    -7,
    -78
);

createTorch(
    7,
    -78
);


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
                .45,
                .8,
                7,
                10
            ),

            material(
                0x493021,
                1
            )
        );

    trunk.position.y =
        3.5;

    trunk.castShadow =
        true;

    tree.add(
        trunk
    );


    const leaves =
        material(
            0x214b2a,
            1
        );


    const foliage = [

        [3.5, 7],
        [5.5, 6],
        [7.2, 4.8],
        [8.5, 3.5]

    ];


    foliage.forEach(
        item => {

            const cone =
                new THREE.Mesh(

                    new THREE.ConeGeometry(
                        item[1],
                        5,
                        12
                    ),

                    leaves
                );

            cone.position.y =
                item[0] + 2;

            cone.castShadow =
                true;

            tree.add(
                cone
            );
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

    scene.add(
        tree
    );
}


/* Forest on both sides */

for (
    let i = 0;
    i < 110;
    i++
) {

    const side =
        Math.random() > .5
            ? 1
            : -1;

    const x =
        side *
        (
            18 +
            Math.random() * 115
        );

    const z =
        -160 +
        Math.random() * 280;

    createTree(
        x,
        z,
        .7 +
        Math.random() * .8
    );
}


/* =========================================================
   ROCKS
========================================================= */

function createRock(
    x,
    z,
    size
) {

    const rock =
        new THREE.Mesh(

            new THREE.DodecahedronGeometry(
                2.5,
                1
            ),

            material(
                0x626766,
                .95
            )
        );

    rock.position.set(
        x,
        size,
        z
    );

    rock.scale.set(
        size * 1.4,
        size,
        size * .8
    );

    rock.rotation.set(
        Math.random(),
        Math.random(),
        Math.random()
    );

    rock.castShadow =
        true;

    rock.receiveShadow =
        true;

    scene.add(
        rock
    );
}


for (
    let i = 0;
    i < 45;
    i++
) {

    createRock(

        (Math.random() - .5) *
        250,

        -150 +
        Math.random() *
        300,

        .5 +
        Math.random() * 1.7
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
                18
            ),

            material(
                0x53615e,
                1
            )
        );

    mountain.position.set(
        x,
        height / 2 - 3,
        z
    );

    mountain.castShadow =
        true;

    scene.add(
        mountain
    );


    /* snow cap */

    const snow =
        new THREE.Mesh(

            new THREE.ConeGeometry(
                radius * .28,
                height * .25,
                12
            ),

            material(
                0xe1e8e8,
                .9
            )
        );

    snow.position.set(
        x,
        height * .86,
        z
    );

    scene.add(
        snow
    );
}


createMountain(
    -145,
    -180,
    120,
    70
);

createMountain(
    145,
    -190,
    145,
    85
);

createMountain(
    -180,
    -20,
    85,
    65
);

createMountain(
    180,
    -40,
    100,
    70
);


/* =========================================================
   LAKE
========================================================= */

const waterGeometry =
    new THREE.CircleGeometry(
        43,
        80
    );

waterGeometry.rotateX(
    -Math.PI / 2
);


const waterMaterial =
    new THREE.MeshPhysicalMaterial({

        color: 0x28718b,

        roughness: .12,

        metalness: .05,

        transparent: true,

        opacity: .8,

        transmission: .15
    });


const water =
    new THREE.Mesh(
        waterGeometry,
        waterMaterial
    );

water.position.set(
    65,
    .25,
    -35
);

scene.add(
    water
);


/* =========================================================
   WIZARD
========================================================= */

const player =
    new THREE.Group();


const skin =
    material(
        0xc99176,
        .8
    );

const robe =
    material(
        0x26344b,
        .85
    );

const dark =
    material(
        0x171b24,
        .9
    );


/* legs */

const legGeometry =
    new THREE.CylinderGeometry(
        .38,
        .5,
        2.5,
        12
    );


const leg1 =
    new THREE.Mesh(
        legGeometry,
        dark
    );

leg1.position.set(
    -.42,
    1.25,
    0
);

player.add(
    leg1
);


const leg2 =
    leg1.clone();

leg2.position.x =
    .42;

player.add(
    leg2
);


/* robe */

const robeBody =
    new THREE.Mesh(

        new THREE.ConeGeometry(
            1.55,
            4.1,
            20
        ),

        robe
    );

robeBody.position.y =
    3.3;

robeBody.castShadow =
    true;

player.add(
    robeBody
);


/* belt */

const belt =
    new THREE.Mesh(

        new THREE.TorusGeometry(
            .92,
            .13,
            8,
            20
        ),

        material(
            0x6f4b25,
            .8
        )
    );

belt.position.y =
    3.9;

belt.rotation.x =
    Math.PI / 2;

player.add(
    belt
);


/* head */

const head =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            1.02,
            24,
            18
        ),

        skin
    );

head.position.y =
    5.8;

head.castShadow =
    true;

player.add(
    head
);


/* hair */

const hair =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            1.08,
            20,
            14
        ),

        dark
    );

hair.scale.y =
    .75;

hair.position.y =
    6.2;

player.add(
    hair
);


/* hat */

const hat =
    new THREE.Mesh(

        new THREE.ConeGeometry(
            1.35,
            2.8,
            24
        ),

        dark
    );

hat.position.y =
    7.7;

hat.rotation.z =
    -.08;

hat.castShadow =
    true;

player.add(
    hat
);


/* hat rim */

const hatRim =
    new THREE.Mesh(

        new THREE.CylinderGeometry(
            1.65,
            1.65,
            .2,
            24
        ),

        dark
    );

hatRim.position.y =
    6.55;

player.add(
    hatRim
);


/* wand */

const wand =
    new THREE.Mesh(

        new THREE.CylinderGeometry(
            .055,
            .09,
            2.8,
            8
        ),

        material(
            0x4b2b19,
            .9
        )
    );

wand.rotation.z =
    -.85;

wand.position.set(
    1.35,
    4.1,
    -.3
);

player.add(
    wand
);


/* wand light */

const wandLight =
    new THREE.PointLight(
        0x8877ff,
        1.5,
        10
    );

wandLight.position.set(
    2,
    5,
    -.5
);

player.add(
    wandLight
);


player.position.set(
    0,
    0,
    15
);

scene.add(
    player
);


/* =========================================================
   INPUT
========================================================= */

const keys = {};

window.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;

        if (
            event.key === " "
        ) {
            jump();
        }

        if (
            event.key.toLowerCase() === "f"
        ) {
            castSpell();
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;
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
    event => {

        joystickActive = true;

        joystickBase.setPointerCapture(
            event.pointerId
        );

        updateJoystick(
            event
        );
    }
);


joystickBase.addEventListener(
    "pointermove",
    event => {

        if (
            joystickActive
        ) {

            updateJoystick(
                event
            );
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


function updateJoystick(
    event
) {

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
        `translate(${dx}px,${dy}px)`;
}


function resetJoystick() {

    joystickActive =
        false;

    joystickX =
        0;

    joystickY =
        0;

    joystickStick.style.transform =
        "translate(0,0)";
}


/* =========================================================
   CAMERA LOOK
========================================================= */

let cameraYaw = 0;

let cameraPitch = -.15;

let looking = false;

let previousX = 0;

let previousY = 0;


renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        if (
            event.clientX >
            window.innerWidth * .3
        ) {

            looking = true;

            previousX =
                event.clientX;

            previousY =
                event.clientY;
        }
    }
);


renderer.domElement.addEventListener(
    "pointermove",
    event => {

        if (
            !looking
        ) return;

        const dx =
            event.clientX -
            previousX;

        const dy =
            event.clientY -
            previousY;

        cameraYaw -=
            dx * .004;

        cameraPitch -=
            dy * .003;

        cameraPitch =
            Math.max(
                -.7,
                Math.min(
                    .4,
                    cameraPitch
                )
            );

        previousX =
            event.clientX;

        previousY =
            event.clientY;
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
   SPELL
========================================================= */

let magic = 100;

let xp = 0;

const spells = [];


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
                color: 0x9c7cff
            })
        );


    const light =
        new THREE.PointLight(
            0x765cff,
            5,
            14
        );

    spell.add(
        light
    );


    const start =
        new THREE.Vector3();

    wand.getWorldPosition(
        start
    );

    spell.position.copy(
        start
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
            38
        );


    scene.add(
        spell
    );

    spells.push(
        spell
    );
}


document
    .getElementById("spellBtn")
    .addEventListener(
        "pointerdown",
        castSpell
    );


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
                18,
                14
            ),

            material(
                0x3b2538,
                .9
            )
        );

    body.scale.y =
        1.25;

    body.position.y =
        1.5;

    body.castShadow =
        true;

    enemy.add(
        body
    );


    const eyeMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xff3030
        });


    for (
        const xOffset of [-.35, .35]
    ) {

        const eye =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    .13,
                    10,
                    10
                ),

                eyeMaterial
            );

        eye.position.set(
            xOffset,
            1.8,
            -1.1
        );

        enemy.add(
            eye
        );
    }


    enemy.position.set(
        x,
        0,
        z
    );

    scene.add(
        enemy
    );

    enemies.push(
        enemy
    );
}


createEnemy(
    25,
    -25
);

createEnemy(
    -25,
    -50
);

createEnemy(
    30,
    -70
);


/* =========================================================
   HUD
========================================================= */

let hp = 100;

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


    document.getElementById(
        "hpBar"
    ).style.width =
        hp + "%";


    document.getElementById(
        "magicBar"
    ).style.width =
        magic + "%";


    document.getElementById(
        "hpText"
    ).textContent =
        Math.round(hp);


    document.getElementById(
        "magicText"
    ).textContent =
        Math.round(magic);


    document.getElementById(
        "xpText"
    ).textContent =
        xp;
}


/* =========================================================
   MESSAGE
========================================================= */

let messageTimeout;


function showMessage(
    text
) {

    const element =
        document.getElementById(
            "message"
        );

    element.textContent =
        text;

    element.style.opacity =
        "1";


    clearTimeout(
        messageTimeout
    );


    messageTimeout =
        setTimeout(
            () => {

                element.style.opacity =
                    "0";

            },
            1800
        );
}


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function movePlayer(
    dt
) {

    let forward =
        -joystickY;

    let strafe =
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

        forward /=
            length;

        strafe /=
            length;
    }


    const speed =
        15;


    const sin =
        Math.sin(
            cameraYaw
        );

    const cos =
        Math.cos(
            cameraYaw
        );


    const moveX =
        strafe * cos -
        forward * sin;

    const moveZ =
        strafe * sin +
        forward * cos;


    player.position.x +=
        moveX *
        speed *
        dt;


    player.position.z +=
        moveZ *
        speed *
        dt;


    /* Keep player in world */

    player.position.x =
        Math.max(
            -260,
            Math.min(
                260,
                player.position.x
            )
        );


    player.position.z =
        Math.max(
            -260,
            Math.min(
                260,
                player.position.z
            )
        );


    if (
        length > .1
    ) {

        player.rotation.y =
            Math.atan2(
                -moveX,
                -moveZ
            );
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


        let remove =
            false;


        for (
            let j = enemies.length - 1;
            j >= 0;
            j--
        ) {

            const enemy =
                enemies[j];


            if (
                spell.position.distanceTo(
                    enemy.position
                ) < 3
            ) {

                scene.remove(
                    enemy
                );

                enemies.splice(
                    j,
                    1
                );


                xp += 25;

                showMessage(
                    "+25 XP"
                );

                updateHUD();

                remove =
                    true;

                break;
            }
        }


        if (
            spell.position.length() >
            400
        ) {

            remove =
                true;
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

let damageTimer = 0;


function updateEnemies(
    dt
) {

    damageTimer -= dt;


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
                distance < 45
            ) {

                direction.normalize();


                enemy.position.x +=
                    direction.x *
                    dt *
                    2.2;


                enemy.position.z +=
                    direction.z *
                    dt *
                    2.2;


                enemy.lookAt(
                    player.position.x,
                    enemy.position.y,
                    player.position.z
                );
            }


            if (
                distance < 3 &&
                damageTimer <= 0
            ) {

                hp -= 8;

                damageTimer =
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
        12;

    const horizontal =
        distance *
        Math.cos(
            cameraPitch
        );


    const target =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 4.5,
            player.position.z
        );


    const desired =
        new THREE.Vector3(

            player.position.x -
            Math.sin(cameraYaw) *
            horizontal,

            player.position.y +
            6 +
            Math.sin(cameraPitch) *
            distance,

            player.position.z -
            Math.cos(cameraYaw) *
            horizontal
        );


    camera.position.lerp(
        desired,
        .1
    );


    camera.lookAt(
        target
    );
}


/* =========================================================
   WATER
========================================================= */

function animateWater() {

    const t =
        performance.now() *
        .001;


    water.position.y =
        .25 +
        Math.sin(t * 1.5) *
        .035;


    water.rotation.z =
        Math.sin(t * .25) *
        .01;
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
        regenTimer >= .5
    ) {

        regenTimer = 0;

        magic =
            Math.min(
                100,
                magic + 1
            );

        updateHUD();
    }
}


/* =========================================================
   MAIN LOOP
========================================================= */

const clock =
    new THREE.Clock();


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

    animateWater();

    regenerateMagic(
        dt
    );


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
    "Welcome to the Enchanted Valley"
);

animate();
