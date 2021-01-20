import * as THREE from "../node_modules/three/build/three.module.js";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js"
import * as MOOVE from "./Revenge_of_humanity_movement.js"
import * as INIT from "./init_and_utils.js"
//variable globale
let star_ship;
let star_ship_bs, vaisseau_bs;
let star, star_geo, stars;
const fire_ball = [];
let fireball_material;
var point = 0;
let play = false,
    status = false;
// scene
const scene = INIT.scene;
// camera
const camera = INIT.camera;
camera.position.set(0, 20, -500);
scene.add(camera);
const helper = new THREE.CameraHelper(camera);
scene.add(helper);
// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// light
const light = new THREE.DirectionalLight(0xa4161a, 10);
light.position.set(0, 1000, 0);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0xFFFFF, 10);
scene.add(ambientLight);
const plight = new THREE.PointLight(0xFFFFFF, 2);
const plighthelp = new THREE.PointLightHelper(plight);
scene.add(plight);
scene.add(plighthelp);
//orbit control
const controls = new OrbitControls(camera, renderer.domElement);
/**
 * stars creation and initialisation
 */
function stars_creat() {
    star_geo = new THREE.Geometry();
    for (let i = 0; i < 10000; i++) {
        star = new THREE.Vector3(
            INIT.getRandomInt(-window.innerWidth, window.innerWidth),
            INIT.getRandomInt(-window.innerHeight, window.innerHeight),
            Math.random() * 1000 - 500
        );
        star.velocity = 0;
        star.acceleration = 1.5;
        star_geo.vertices.push(star);
    }
    let sprite = new THREE.TextureLoader().load('../loader/star.png');
    let star_material = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 1,
        map: sprite
    });
    stars = new THREE.Points(star_geo, star_material);
    scene.add(stars);
}
//load fireball
function loading_fireball() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../loader/fireball.jpg');
    fireball_material = new THREE.MeshToonMaterial({
        color: 0xaaaaaa,
        map: texture
    });
}
/**
 * generate 3D object
 * @param {*} geometry 
 * @param {*} material 
 */
function generate_WALL_Objects(material) {
    for (let k = 0; k < 400; k++) {
        const geometry = new THREE.SphereBufferGeometry(INIT.getRandomInt(10, 60), INIT.getRandomInt(5, 45), INIT.getRandomInt(5, 45));
        geometry.computeBoundingSphere();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(INIT.getRandomInt(-window.innerWidth, window.innerWidth), INIT.getRandomInt(-window.innerHeight, window.innerHeight), INIT.getRandomInt(1000, 3000));
        mesh.rotation.set(Math.random(), Math.random(), 0);
        mesh.visible = false;
        scene.add(mesh);
        fire_ball.push(mesh);
    }
}
/**
 * loading starships
 */
function starship_loader() {
    const loading = new GLTFLoader();
    // Load a glTF resource
    loading.load(
        '../loader/vaisseau_starwars.gltf',
        function(gltf) {
            star_ship = gltf.scene.children[0];
            star_ship.scale.set(0.05, 0.05, 0.05);
            star_ship.rotateX(Math.PI * 3);
            star_ship.rotateZ(Math.PI * 3);
            scene.add(star_ship);
            requestAnimationFrame(render);
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened');
        }
    );
}
/**
 * starship bounding shpere initialisation 
 */
function starship_bs_creation() {
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    const geometry = new THREE.SphereGeometry(25, 15, 15)
    geometry.computeBoundingSphere();
    star_ship_bs = new THREE.Mesh(geometry, material);
    star_ship_bs.visible = false
    scene.add(star_ship_bs);
    vaisseau_bs = new THREE.Sphere(new THREE.Vector3(0, 0, 0), geometry.boundingSphere.radius);
}
//bounding spheres init
const fire_ball_bs = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 0);

var button_play = document.getElementById("play");
button_play.addEventListener("click", start, false);
var button_continue = document.getElementById("wait");
button_continue.addEventListener("click", wait_restart, false);
var button_restart = document.getElementById("restart");
button_restart.addEventListener("click", game_restart, false);

function game_restart() {
    let loose = document.getElementById("loose_menu");
    loose.hidden = true;
    document.location.reload();

}

function start() {
    let text = document.getElementById("text-box");
    text.hidden = true;
    play = true;
    render();
}

function wait_restart() {
    let text = document.getElementById("waiting_menu");
    text.hidden = true;
    play = true;
    requestAnimationFrame(render);
}

function wait_menu() {
    if (play) {
        let text = document.getElementById("waiting_menu");
        text.hidden = false;
        play = false;
    }
}

function loose() {
    document.getElementById('score').innerHTML = point;
    let text = document.getElementById("loose_menu");
    text.hidden = false;
    play = false;
}
window.addEventListener('resize', INIT.onResize);
INIT.onResize();
starship_loader();
stars_creat();
loading_fireball();
generate_WALL_Objects(fireball_material);
starship_bs_creation();
/**
 * make the animation
 */
function render() {
    if (play) {
        fire_ball.forEach(m => {
            m.visible = true;
        });
    }
    //deplace les spheres
    fire_ball.forEach(m => {
        m.position.z -= 5;
        m.position.x += 0.2;
        m.rotation.x += 0.1;
        if (m.position.z < -400) {
            m.position.set(INIT.getRandomInt(window.innerWidth, -window.innerWidth), INIT.getRandomInt(window.innerHeight, -window.innerHeight), 5000);
            point += 0.01;
        }
    });
    //déplacement des vertices
    star_geo.vertices.forEach(p => {
        p.velocity += p.acceleration
        p.z -= p.velocity;
        if (p.z < -400) {
            p.z = 500;
            p.velocity = 0;
        }
    });
    star_geo.verticesNeedUpdate = true;

    // collision
    vaisseau_bs.center = star_ship_bs.position;
    fire_ball.forEach(e => {
            fire_ball_bs.center = e.position;
            fire_ball_bs.radius = e.geometry.boundingSphere.radius;
            if (vaisseau_bs.intersectsSphere(fire_ball_bs)) loose();
        })
        // mouvement
    if (MOOVE.forward == true) MOOVE.move_forward();
    if (MOOVE.backward == true) MOOVE.move_backward();
    if (MOOVE.left == true) MOOVE.move_left();
    if (MOOVE.right == true) MOOVE.move_right();

    //deplacement de lumiere
    star_ship_bs.position.set(star_ship.position.x, star_ship.position.y, star_ship.position.z);
    plight.position.set(star_ship.position.x, star_ship.position.y + 200, star_ship.position.z);
    controls.update();
    // rendu
    renderer.render(scene, camera);
    //passer pause a false et rappeler render;
    if (play) {
        requestAnimationFrame(render);
    }
}

export { star_ship, renderer, wait_menu };