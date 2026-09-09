// =====================================================
// WIZARDING WORLD 3D
// STAGE 1
// Basic 3D Wizard World
// =====================================================


// =====================================================
// SCENE
// =====================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);


// =====================================================
// CAMERA
// =====================================================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


// =====================================================
// RENDERER
// =====================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

document
    .getElementById("game")
    .appendChild(renderer.domElement);


// =====================================================
// LIGHTING
// =====================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambientLight);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

sun.position.set(
    20,
    40,
    20
);

scene.add(sun);


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
        color: 0x315c2b
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

ground.position.y = 0;

scene.add(ground);


// =====================================================
// CASTLE
// =====================================================

function createTower(
    x,
    z,
    height,
    radius
) {

    const towerGeometry =
        new THREE.CylinderGeometry(
            radius,
            radius,
            height,
            8
        );

    const towerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x777777
        });

    const tower =
        new THREE.Mesh(
            towerGeometry,
            towerMaterial
        );

    tower.position.set(
        x,
        height / 2,
        z
    );

    scene.add(tower);


    // Roof

    const roofGeometry =
        new THREE.ConeGeometry(
            radius * 1.25,
            height * 0.35,
            8
        );

    const roofMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x333333
        });

    const roof =
        new THREE.Mesh(
            roofGeometry,
            roofMaterial
        );

    roof.position.set(
        x,
        height + height * 0.175,
        z
    );

    scene.add(roof);
}


// Main castle building

const castleGeometry =
    new THREE.BoxGeometry(
        22,
        18,
        14
    );

const castleMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x777777
    });

const castle =
    new THREE.Mesh(
        castleGeometry,
        castleMaterial
    );

castle.position.set(
    0,
    9,
    -35
);

scene.add(castle);


// Towers

createTower(
    -13,
    -35,
    28,
    4
);

createTower(
    13,
    -35,
    28,
    4
);

createTower(
    -9,
    -28,
    24,
    3
);

createTower(
    9,
    -28,
    24,
    3
);


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
        color: 0x24133d
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
        color: 0xffc59c
    });

const head =
    new THREE.Mesh(
        headGeometry,
        headMaterial
    );

head.position.y = 3.5;

player.add(head);


// Wizard hat

const hatGeometry =
    new THREE.ConeGeometry(
        0.9,
        1.7,
        16
    );

const hatMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x30104f
    });

const hat =
    new THREE.Mesh(
        hatGeometry,
        hatMaterial
    );

hat.position.y = 4.7;

player.add(hat);


// Hat brim

const brimGeometry =
    new THREE.CylinderGeometry(
        1.05,
        1.05,
        0.15,
        16
    );

const brim =
    new THREE.Mesh(
        brimGeometry,
        hatMaterial
    );

brim.position.y = 3.95;

player.add(brim);


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
        color: 0x4b2a16
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
    0
);

player.add(wand);


// Player starting position

player.position.set(
    0,
    0,
    5
);

scene.add(player);


// =====================================================
// CAMERA
// =====================================================

camera.position.set(
    0,
    6,
    12
);


// =====================================================
// MOVEMENT
// =====================================================

const keys = {

    up: false,
    down: false,
    left: false,
    right: false

};


const speed = 0.18;


// =====================================================
// BUTTON CONTROL
// =====================================================

function setupButton(
    id,
    key
) {

    const button =
        document.getElementById(id);


    button.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            keys[key] = true;

        },
        {
            passive: false
        }
    );


    button.addEventListener(
        "touchend",
        function(event) {

            event.preventDefault();

            keys[key] = false;

        },
        {
            passive: false
        }
    );


    button.addEventListener(
        "mousedown",
        function() {

            keys[key] = true;

        }
    );


    button.addEventListener(
        "mouseup",
        function() {

            keys[key] = false;

        }
    );


    button.addEventListener(
        "mouseleave",
        function() {

            keys[key] = false;

        }
    );
}


setupButton("up", "up");

setupButton("down", "down");

setupButton("left", "left");

setupButton("right", "right");


// =====================================================
// KEYBOARD SUPPORT
// =====================================================

window.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowUp" ||
            event.key === "w"
        ) {

            keys.up = true;

        }

        if (
            event.key === "ArrowDown" ||
            event.key === "s"
        ) {

            keys.down = true;

        }

        if (
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {

            keys.left = true;

        }

        if (
            event.key === "ArrowRight" ||
            event.key === "d"
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
            event.key === "w"
        ) {

            keys.up = false;

        }

        if (
            event.key === "ArrowDown" ||
            event.key === "s"
        ) {

            keys.down = false;

        }

        if (
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {

            keys.left = false;

        }

        if (
            event.key === "ArrowRight" ||
            event.key === "d"
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

    const spellGeometry =
        new THREE.SphereGeometry(
            0.25,
            12,
            12
        );

    const spellMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffff00
        });

    const spell =
        new THREE.Mesh(
            spellGeometry,
            spellMaterial
        );

    spell.position.copy(
        player.position
    );

    spell.position.y += 2.5;

    spell.position.z -= 1;

    scene.add(spell);


    let distance = 0;


    function moveSpell() {

        spell.position.z -= 0.8;

        distance += 0.8;


        if (distance < 50) {

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


    // Movement

    if (keys.up) {

        player.position.z -= speed;

    }

    if (keys.down) {

        player.position.z += speed;

    }

    if (keys.left) {

        player.position.x -= speed;

        player.rotation.y =
            Math.PI / 2;

    }

    if (keys.right) {

        player.position.x += speed;

        player.rotation.y =
            -Math.PI / 2;

    }


    // Camera follows player

    const cameraTarget =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 5,
            player.position.z + 10
        );


    camera.position.lerp(
        cameraTarget,
        0.08
    );


    camera.lookAt(
        player.position.x,
        player.position.y + 2,
        player.position.z
    );


    renderer.render(
        scene,
        camera
    );

}


// =====================================================
// SCREEN RESIZE
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


// Start

animate();
