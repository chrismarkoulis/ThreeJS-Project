import * as THREE from 'three';
import explorerPath from './assets/explorer.jpg';
import googleLogoPath from './assets/google_logo.jpg';
import youtubeLogoPath from './assets/youtube_logo.png';
import cyberBullyPath from './assets/cyber_bully.jpg';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let camera, scene, renderer, ground, samCharacter;
const textureLoader = new THREE.TextureLoader();
const raycaster = new THREE.Raycaster();
const clickableObjects = [];
const levelObjects = [];

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const samCharacterRadius = 1;
    const samGeometry = new THREE.CircleGeometry(samCharacterRadius, 32);

    const samTexture = textureLoader.load(explorerPath);

    const samMaterial = new THREE.MeshBasicMaterial({
        map: samTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 2.0,
        color: "#fff"
    });

    samCharacter = new THREE.Mesh(samGeometry, samMaterial);
    samCharacter.position.y = 1;
    scene.add(samCharacter);


    camera.position.z = 5;
    camera.position.y = 2;


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    document.addEventListener('mousemove', onMouseMove);

    initializeEventListeners();

    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }

    animate();
}

function initializeEventListeners() {
    clickableObjects.forEach(object => {
        object.addEventListener('click', (event) => {
            handleClick(object, event);
        });
    });
}



function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);

    raycaster.set(camera.position, vector.sub(camera.position).normalize());
    const intersects = raycaster.intersectObject(ground);

    if (intersects.length > 0) {
        samCharacter.position.x = intersects[0].point.x;
        samCharacter.position.z = intersects[0].point.z;
    }
}


function handleClick(clickedObject, event) {
    if (!camera) {
        console.error('Camera not initialized');
        return;
    }

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(clickedObject);

    if (intersects.length > 0) {
        if (clickedObject.onClick) {
            clickedObject.onClick();
        }
    }
}





let explorationStarted = false;
let score = 0;

const startButton = document.querySelector('button');

startButton.addEventListener('click', function () {
    this.style.display = 'none';
    window.startExploration();
});


const updateScore = function (points = 10) {
    score += points;
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}


const showScore = function () {
    const scoreContainer = document.getElementById('score-container');
    if (scoreContainer) {
        scoreContainer.style.display = 'block';
    }
}


function createClickableObject(texturePath, x, y, z, domain, onClick) {
    const geometry = new THREE.PlaneGeometry(2, 2, 1);
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const clickableObject = new THREE.Mesh(geometry, material);

    clickableObject.position.set(x, y, z);
    clickableObject.onClick = onClick;
    clickableObject.domain = domain;

    if (domain !== "Sam") {
        clickableObjects.push(clickableObject);
        initializeEventListeners();
    }

    return clickableObject;
}


function createClickableText(text, x, y, z, domain) {
    const loader = new FontLoader();
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    return new Promise((resolve, reject) => {
        loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', function (font) {
            const geometry = new TextGeometry(text, {
                font: font,
                size: 3.5,
                height: 0.2
            });

            const textMesh = new THREE.Mesh(geometry, material);

            textMesh.position.set(x, y, z);

            textMesh.onClick = () => {
                alert(`Κλικ στο ${domain}`);
                window.open(domain, '_blank');
            };

            textMesh.raycast = function () {
                const intersects = raycaster.intersectObject(textMesh);
                if (intersects.length > 0) {
                    textMesh.onClick();
                }
            };

            clickableObjects.push(textMesh);

            resolve(textMesh);
        }, undefined, function (error) {
            reject(error);
        });
    });
}





const addObjectsToScene = function (levelTitle, samCharacter) {

    levelObjects.forEach(object => scene.remove(object));
    levelObjects.length = 0;

    switch (levelTitle) {
        case 'Επίπεδο 1 - Εξερεύνηση του Διαδικτύου':
            const youtubeLogo = createClickableObject(youtubeLogoPath, -5, 1, -10, 'https://www.youtube.com/', () => {
                window.open('https://www.youtube.com/', '_blank');
            });

            const googleLogo = createClickableObject(googleLogoPath, 8, 1, -15, 'https://www.google.com/', () => {
                window.open('https://www.google.com/', '_blank');
            });

            //const youtubeLabel = createClickableText('Youtube', -8, 0, -9, 'https://www.youtube.com/');
            // createClickableText('Youtube', -8, 0, -9, 'https://www.youtube.com/')
            //     .then(textMesh => {
            //         scene.add(textMesh); // Add the text mesh to the scene after it's resolved
            //     })
            //     .catch(error => {
            //         console.error('Error creating clickable text:', error);
            //     });


            // createClickableText('Google', 5, 0, -14, 'https://www.google.com/')
            //     .then(textMesh => {
            //         scene.add(textMesh); // Add the text mesh to the scene after it's resolved
            //     })
            //     .catch(error => {
            //         console.error('Error creating clickable text:', error);
            //     });

            //const googleLabel = createClickableText('Google', 5, 0, -14, 'https://www.google.com/');

            scene.add(youtubeLogo, googleLogo, samCharacter);
            levelObjects.push(youtubeLogo, googleLogo, samCharacter);

            break;
        case 'Επίπεδο 2 - Ασφαλείς Ιστοσελίδες':

            const loader = new FontLoader();

            loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', function (font) {
                const googleTextGeometry = new TextGeometry('https://google.com', {
                    font: font,
                    size: 1.5,
                    height: 0.2,
                });

                const googleTextMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                const googleText = new THREE.Mesh(googleTextGeometry, googleTextMaterial);
                googleText.position.set(-8, 1, -3);
                scene.add(googleText);

                const secureTextGeometry = new TextGeometry('https', {
                    font: font,
                    size: 1,
                    height: 0.2,
                });

                const secureTextMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const secureText = new THREE.Mesh(secureTextGeometry, secureTextMaterial);
                secureText.position.set(0, -1, -5);
                scene.add(secureText);

                const descriptionText = new TextGeometry('Αυτή είναι μια ασφαλής ιστοσελίδα.', {
                    font: font,
                    size: 0.5,
                    height: 0.2,
                });

                const descriptionMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const description = new THREE.Mesh(descriptionText, descriptionMaterial);
                description.position.set(0, -2, -5);
                scene.add(description);


                scene.add(samCharacter);
                levelObjects.push(googleText, secureText, description, samCharacter);
            });


            break;
        case 'Επίπεδο 3 - Αναγνώριση και Αποφυγή του διαδικτυακού εκφοβιστή':
            const cyberBully = createClickableObject(cyberBullyPath, 1, 1, -5, 'Κακές Λέξεις, Προσβλητικά Σχόλια', () => {
                console.log('Κακές Λέξεις, Προσβλητικά Σχόλια');
                scene.remove(cyberBully);
            });

            scene.add(cyberBully, samCharacter);
            levelObjects.push(cyberBully, samCharacter)
            break;
        case 'Επίπεδο 4 - Ταίριασμα Ασφαλών Κωδικών Πρόσβασης':
            const safePasswords = [
                { text: 'f_sdqRT34#$5O93Jlf', isSafe: true },
                { text: 'gR78dR@#$sdff34', isSafe: true }
            ];

            const unsafePasswords = [
                { text: 'password123', isSafe: false },
                { text: '123456', isSafe: false }
            ];

            const passwordObjects = [];


            safePasswords.forEach((password, index) => {
                const passwordObject = createDraggableObject(password.text, -3, 1, index * 2, password.isSafe);
                passwordObjects.push(passwordObject);
                scene.add(passwordObject);
                levelObjects.push(passwordObject)
            });


            unsafePasswords.forEach((password, index) => {
                const passwordObject = createDraggableObject(password.text, 3, 1, index * 2, password.isSafe);
                passwordObjects.push(passwordObject);
                scene.add(passwordObject);
                levelObjects.push(passwordObject)
            });

            scene.add(samCharacter);
            levelObjects.push(samCharacter)
            break;
        default:
            console.error('Μη έγκυρος τίτλος επιπέδου:', levelTitle);
            break;
    }
}

function createDraggableObject(text, x, y, z, isSafe) {
    const geometry = new THREE.BoxGeometry(1, 0.2, 0.5);
    const materialColor = isSafe ? 0x00ff00 : 0xff0000;
    const material = new THREE.MeshBasicMaterial({ color: materialColor });
    const passwordObject = new THREE.Mesh(geometry, material);

    passwordObject.position.set(x, y, z);


    passwordObject.text = text;
    passwordObject.isSafe = isSafe;


    makeDraggable(passwordObject);

    return passwordObject;
}

function makeDraggable(object) {
    let isDragging = false;
    const offset = new THREE.Vector3();

    object.addEventListener('mousedown', (event) => {
        isDragging = true;

        const { x, y } = event.data.global;
        const { x: objectX, y: objectY } = object.position;

        offset.x = x - objectX;
        offset.y = y - objectY;
    });

    object.addEventListener('mouseup', () => {
        isDragging = false;
    });

    object.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const { x, y } = event.data.global;
            object.position.x = x - offset.x;
            object.position.y = y - offset.y;
        }
    });
}




window.startExploration = function () {
    const modalContainer = document.getElementById('modal-container');
    const startButton = document.getElementById('startButton');
    const currentLevel = document.getElementById('current-level');
    const titleElement = document.querySelector('.container h1');
    const descriptionElement = document.querySelector('.container p');

    currentLevel.textContent = 'Επίπεδο 1';
    currentLevel.style.display = 'block';

    titleElement.textContent = 'Επίπεδο 1 - Εξερεύνηση του Διαδικτύου';
    descriptionElement.innerHTML = `
        Ασφαλείς τρόποι εξερεύνησης του Διαδικτύου, αναγνώριση ασφαλών ιστοσελίδων.
    `;

    showScore();
    addObjectsToScene(titleElement.textContent, samCharacter);

    if (!explorationStarted) {
        modalContainer.style.display = 'flex';
        explorationStarted = true;
        startButton.style.backgroundColor = '#FF4500';

        const closeModalButton = document.getElementById('close-modal');
        closeModalButton.addEventListener('click', () => {
            closeModal();
        });
    }
}

window.closeModal = function () {
    const modalContainer = document.getElementById('modal-container');
    const startButton = document.getElementById('startButton');

    modalContainer.style.display = 'none';
    explorationStarted = false;
    startButton.style.backgroundColor = '#4caf50';
}

window.selectLevel = function (level) {
    const currentLevel = document.getElementById('current-level');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const titleElement = document.querySelector('.container h1');
    const descriptionElement = document.querySelector('.container p');

    currentLevel.textContent = `Επίπεδο ${level}`;
    currentLevel.style.display = 'block';

    sidebarLinks.forEach(link => {
        link.classList.remove('selected');
    });

    sidebarLinks[level - 1].classList.add('selected');

    switch (level) {
        case 1:
            titleElement.textContent = 'Επίπεδο 1 - Εξερεύνηση του Διαδικτύου';
            descriptionElement.innerHTML = `
                Ασφαλείς τρόποι εξερεύνησης του Διαδικτύου, αναγνώριση ασφαλών ιστοσελίδων.
            `;
            break;
        case 2:
            titleElement.textContent = 'Επίπεδο 2 - Ασφαλείς Ιστοσελίδες';
            descriptionElement.innerHTML = `
                Αναγνώριση ασφαλών ιστοσελίδων, πρακτικές ασφαλούς πλοήγησης.
            `;
            break;
        case 3:
            titleElement.textContent = 'Επίπεδο 3 - Αναγνώριση και Αποφυγή του διαδικτυακού εκφοβιστή';
            descriptionElement.innerHTML = `
                Αναγνώριση του διαδικτυακού εκφοβιστή, πρακτικές φιλικής συμπεριφοράς στο Διαδίκτυο.
            `;
            break;
        case 4:
            titleElement.textContent = 'Επίπεδο 4 - Ταίριασμα Ασφαλών Κωδικών Πρόσβασης';
            descriptionElement.innerHTML = `
                Ασφαλείς κωδικοί πρόσβασης, πρακτικές προστασίας των προσωπικών πληροφοριών.
            `;
            break;
        default:
            alert('Μη έγκυρο επίπεδο επιλέχθηκε');
            return;
    }


    const sidebarElements = document.querySelectorAll('.sidebar a');
    sidebarElements.forEach(element => {
        element.classList.remove('active');
        if (element.getAttribute('onclick').includes(level)) {
            element.classList.add('active');
        }
    });

    alert(`Επιλέξατε το Επίπεδο ${level}`);
    updateScore();
    addObjectsToScene(titleElement.textContent, samCharacter);
}


window.onload = initThreeJS;
