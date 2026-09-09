// =====================================================
// WIZARDING WORLD 3D
// STAGE 1 - WORKING 3D TEST
// =====================================================


// =====================================================
// SCENE
// =====================================================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x75a9d6);


// =====================================================
// CAMERA
// =====================================================

const camera =
    new THREE.PerspectiveCamera(
        60,
        window.innerWidth /
        window.innerHeight,
        0.1,
        1000
    );

camera.position.set(
    0,
    6,
    12
);


// =====================================================
// RENDERER
// =====================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document
    .getElementById("game")
    .appendChild(renderer.domElement);


// =====================================================
// LIGHT
// =====================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambientLight);


const sunlight =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

sunlight.position.set(
    10,
    20,
    10
);

scene.add(sunlight);


// =====================================================
// GROUND
// =====================================================

const groundGeometry =
    new THREE.PlaneGeometry(
        200,
        200
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x356b32
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);


// =====================================================
// CASTLE
// =====================================================

function createBuilding(
    x,
    z,
    width,
    height,
    depth
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x777777
        });

    const building =
        new THREE.Mesh(
            geometry,
            material
        );

    building.position.set(
        x,
        height / 2,
        z
    );

    scene.add(building);
}


// Main castle

createBuilding(
    0,
    -30,
    24,
    16,
    12
);


// =====================================================
// CASTLE TOWERS
// =====================================================

function createTower(
    x,
    z
) {

    const towerGeometry =
        new THREE.CylinderGeometry(
            3,
            3,
            25,
            12
        );

    const towerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x666666
        });

    const tower =
        new THREE.Mesh(
            towerGeometry,
            towerMaterial
        );

    tower.position.set(
        x,
        12.5,
        z
    );

    scene.add(tower);


    // Roof

    const roofGeometry =
        new THREE.ConeGeometry(
            4,
            7,
            12
        );

    const roofMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x29233b
        });

    const roof =
        new THREE.Mesh(
            roofGeometry,
            roofMaterial
        );

    roof.position.set(
        x,
        28,
        z
    );

    scene.add(roof);
}


createTower(
    -14,
    -30
);

createTower(
    14,
    -30
);


// =====================================================
// TREES
// =====================================================

function createTree(
    x,
    z
) {

    const trunkGeometry =
        new THREE.CylinderGeometry(
            0.35,
            0.5,
            3,
            8
        );

    const trunkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x5b351d
        });

    const trunk =
        new THREE.Mesh(
            trunkGeometry,
            trunkMaterial
        );

    trunk.position.set(
        x,
        1.5,
        z
    );

    scene.add(trunk);


    const leavesGeometry =
        new THREE.SphereGeometry(
            2,
            10,
            10
        );

    const leavesMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x1f5e28
        });

    const leaves =
        new THREE.Mesh(
            leavesGeometry,
            leavesMaterial
        );

    leaves.position.set(
        x,
        4,
        z
    );

    scene.add(leaves);
}


createTree(-10, -5);
createTree(10, -8);
createTree(-15, 8);
createTree(15, 5);
createTree(-20, -15);
createTree(20, -18);


// =====================================================
// PLAYER
// =====================================================

const player =
    new THREE.Group();


// Body

const bodyGeometry =
    new THREE.CylinderGeometry(
        0.7,
        0.8,
        2,
        12
    );

const bodyMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x352052
    });

const body =
    new THREE.Mesh(
        bodyGeometry,
        bodyMaterial
    );

body.position.y = 2;

player.add(body);


// Head

const headGeometry =
    new THREE.SphereGeometry(
        0.65,
        16,
        16
    );

const headMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xffc29d
    });

const head =
    new THREE.Mesh(
        headGeometry,
        headMaterial
    );

head.position.y = 3.5;

player.add(head);


// Hat

const hatGeometry =
    new THREE.ConeGeometry(
        0.9,
        1.6,
        16
    );

const hatMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x251044
    });

const hat =
    new THREE.Mesh(
        hatGeometry,
        hatMaterial
    );

hat.position.y = 4.7;

player.add(hat);


// Wand

const wandGeometry =
    new THREE.CylinderGeometry(
        0.06,
        0.08,
        2.2,
        8
    );

const wandMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x542e18
    });

const wand =
    new THREE.Mesh(
        wandGeometry,
        wandMaterial
    );

wand.rotation.z =
    Math.PI / 2;

wand.position.set(
    1.1,
    2.5,
    -0.2
);

player.add(wand);


// Player position

player.position.set(
    0,
    0,
    5
);

scene.add(player);


// =====================================================
// MOVEMENT
// =====================================================

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

const speed = 0.2;


// =====================================================
// MOBILE BUTTONS
// =====================================================

function setupButton(
    id,
    direction
) {

    const button =
        document.getElementById(id);


    button.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            keys[direction] = true;

        },
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchend",
        function(event) {

            event.preventDefault();

            keys[direction] = false;

        },
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchcancel",
        function() {

            keys[direction] = false;

        }
    );


    button.addEventListener(
        "mousedown",
        function() {

            keys[direction] = true;

        }
    );


    button.addEventListener(
        "mouseup",
        function() {

            keys[direction] = false;

        }
    );


    button.addEventListener(
        "mouseleave",
        function() {

            keys[direction] = false;

        }
    );
}


setupButton("up", "up");

setupButton("down", "down");

setupButton("left", "left");

setupButton("right", "right");


// =====================================================
// KEYBOARD
// =====================================================

window.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w"
        ) {
            keys.up = true;
        }

        if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {
            keys.down = true;
        }

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {
            keys.left = true;
        }

        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {
            keys.right = true;
        }
    }
);


window.addEventListener(
    "keyup",
    function(event) {

        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w"
        ) {
            keys.up = false;
        }

        if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {
            keys.down = false;
        }

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {
            keys.left = false;
        }

        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {
            keys.right = false;
        }
    }
);


// =====================================================
// SPELL
// =====================================================

document
    .getElementById("spell")
    .addEventListener(
        "click",
        castSpell
    );


function castSpell() {

    const geometry =
        new THREE.SphereGeometry(
            0.3,
            16,
            16
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0xffff00
        });

    const spell =
        new THREE.Mesh(
            geometry,
            material
        );


    spell.position.copy(
        player.position
    );

    spell.position.y += 2.5;

    spell.position.z -= 1;


    scene.add(spell);


    let distance = 0;


    function moveSpell() {

        spell.position.z -= 0.7;

        distance += 0.7;


        if (distance < 60) {

            requestAnimationFrame(
                moveSpell
            );

        } else {

            scene.remove(
                spell
            );
        }
    }


    moveSpell();
}


// =====================================================
// GAME LOOP
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    // Player movement

    if (keys.up) {
        player.position.z -= speed;
    }

    if (keys.down) {
        player.position.z += speed;
    }

    if (keys.left) {
        player.position.x -= speed;
    }

    if (keys.right) {
        player.position.x += speed;
    }


    // Keep player inside world

    player.position.x =
        Math.max(
            -90,
            Math.min(
                90,
                player.position.x
            )
        );


    player.position.z =
        Math.max(
            -90,
            Math.min(
                90,
                player.position.z
            )
        );


    // Camera follows player

    camera.position.x =
        player.position.x;

    camera.position.z =
        player.position.z + 12;

    camera.position.y = 6;


    camera.lookAt(
        player.position.x,
        2,
        player.position.z
    );


    // Render

    renderer.render(
        scene,
        camera
    );
}


// =====================================================
// RESIZE
// =====================================================

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


// =====================================================
// START GAME
// =====================================================

animate();
