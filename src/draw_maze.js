import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';

let scene, renderer, camera;

const mazeLevels = 4;
const mazeRows = 5;
const mazeCols = 5;

function init() {
    // Get a reference to the container element that will hold our scene
    const container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xFEFEFE);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    // Sets orbit control to move the camera around
    const orbit = new OrbitControls(camera, renderer.domElement);

    // Camera positioning
    camera.position.set(6, 8, 14);
    orbit.update();

    // Sets a 12 by 12 gird helper
    const gridHelper = new THREE.GridHelper(12, 12);
    scene.add(gridHelper);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    for (let i = 0; i < mazeLevels; i++) {
        const planeG = new THREE.PlaneGeometry(mazeCols, mazeRows);
        const planeM = new THREE.MeshStandardMaterial({
            color: 0x7AC8EB,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        const plane = new THREE.Mesh(planeG, planeM);
        plane.rotation.x = -0.5 * Math.PI
        plane.position.y = i;
        scene.add(plane);

        if (i % 2 == 0) {
            for (let j = 0; j < mazeCols + 1; j++) {
                const wallG = new THREE.PlaneGeometry(mazeRows, 1);
                const wallM = new THREE.MeshStandardMaterial({
                    color: 0x0000ff,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                });
                const wall = new THREE.Mesh(wallG, wallM);
                wall.rotation.y = -0.5 * Math.PI
                wall.position.y = i + 0.5;
                wall.position.x = j - (mazeCols / 2);
                scene.add(wall);
            }
        } else {
            for (let j = 0; j < mazeRows + 1; j++) {
                const wallG = new THREE.PlaneGeometry(mazeCols, 1);
                const wallM = new THREE.MeshStandardMaterial({
                    color: 0x00ffFF,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5
                });
                const wall = new THREE.Mesh(wallG, wallM);
                wall.position.z = j - (mazeRows / 2);
                wall.position.y = i + 0.5;
                scene.add(wall);
            }
        }
    }

    // axis
    create_line([-(mazeCols / 2), 0, (mazeRows / 2)], [3 - (mazeCols / 2), 0, (mazeRows / 2)], "blue");
    create_line([-(mazeCols / 2), 0, (mazeRows / 2)], [-(mazeCols / 2), 0, (mazeRows / 2) - 3], "green");
    create_line([-(mazeCols / 2), 0, (mazeRows / 2)], [-(mazeCols / 2), 3, (mazeRows / 2)], "red");
}

function create_line(p1, p2, col) {
    const points = [];
    points.push(...p1);
    points.push(...p2);

    const geometry = new LineGeometry();
    geometry.setPositions(points);

    const material = new LineMaterial({
        color: col,
        linewidth: 0.062, // px
        worldUnits: true,
        alphaToCoverage: true,
        depthTest: true,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight) // resolution of the viewport
    });
    const line = new Line2(geometry, material);
    scene.add(line);
}

let pathLine = null;
let pathLineEnd = null;

function draw_maze_path(pathPoints) {
    scene.remove(pathLine);
    scene.remove(pathLineEnd);

    let points = [];
    if (pathPoints[0].level % 2 == 1) {
        points.push(pathPoints[0].column - 3.0, pathPoints[0].level - 0.5, -pathPoints[0].row + 4);
    } else {
        points.push(pathPoints[0].column - 3.0, pathPoints[0].level - 0.5, -pathPoints[0].row + 3);
    }

    for (var i = 1; i < pathPoints.length; i++) {
        points.push(pathPoints[i].column - 3.0, pathPoints[i - 1].level - 0.5, -pathPoints[i].row + 3.0);
        points.push(pathPoints[i].column - 3.0, pathPoints[i].level - 0.5, -pathPoints[i].row + 3.0);
    }

    const geometry = new LineGeometry();
    geometry.setPositions(points);

    const material = new LineMaterial({
        color: "red",
        linewidth: 0.125, // px
        worldUnits: true,
        alphaToCoverage: true,
        depthTest: true,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight) // resolution of the viewport
    });
    pathLine = new Line2(geometry, material);



    const x = points[points.length - 3];
    const y = points[points.length - 2];
    const z = points[points.length - 1];
    points = [x, y, z];
    const last = pathPoints.length - 1;
    if (pathPoints[last].level % 2 == 1) {
        points.push(pathPoints[last].column - 3.0, pathPoints[last].level - 0.5, -pathPoints[last].row + 4.0);
    } else {
        points.push(pathPoints[last].column - 4.0, pathPoints[last].level - 0.5, -pathPoints[last].row + 3.0);
    }

    const geometryEnd = new LineGeometry();
    geometryEnd.setPositions(points);

    const materialEnd = new LineMaterial({
        color: "green",
        linewidth: 0.125, // px
        worldUnits: true,
        alphaToCoverage: true,
        depthTest: true,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight) // resolution of the viewport
    });

    pathLineEnd = new Line2(geometryEnd, materialEnd);

    scene.add(pathLine);
    scene.add(pathLineEnd);
}

init();

let pathTimer = 0;
function animate() {
    if (pathLine == null && pathTimer > 60) {
        window.parent.dispatchEvent(new Event('getFirstPath'));
        pathTimer = 0;
    }
    pathTimer++;

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('newPath', function (e) {
    draw_maze_path(e.detail.points);
    const info = document.getElementById("info");
    const mes = `no: ${e.detail.pathNbr}, length3d: ${e.detail.lengthFull}, holes: ${e.detail.holes}, spin: ${e.detail.spin.toFixed(3)}, freq: ${e.detail.totalFreq}`;
    info.innerHTML = mes;
});
