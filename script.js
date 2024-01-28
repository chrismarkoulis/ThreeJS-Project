import * as THREE from './three.js/build/three.module.js';

let camera, scene, renderer, ground, samCharacter;
const textureLoader = new THREE.TextureLoader();
const raycaster = new THREE.Raycaster();
const clickableObjects = [];

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

    const samTexture = textureLoader.load('./assets/explorer.jpg');

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

   
    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }

    animate();
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


function handleClick(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);

    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        clickedObject.raycast();
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


const createClickableObject = function (texturePath, x, y, z, domain, onClick) {
    const geometry = new THREE.PlaneGeometry(1, 1, 1);
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const clickableObject = new THREE.Mesh(geometry, material);

    clickableObject.position.set(x, y, z);

    
    clickableObject.onClick = onClick;
    clickableObject.domain = domain;

    let raycastEnabled = true;
   
    clickableObject.raycast = function () {
        console.log('Calling raycast');
        if (!raycastEnabled || !raycaster) {
            console.log('Raycast disabled or raycaster not defined');
            return;
        }
        const intersects = raycaster.intersectObject(clickableObject);
        if (intersects.length > 0) {
            alert(`Κλικ στο ${this.domain}`);
            this.onClick();
            raycastEnabled = false;
        }
    };

   
    if (domain !== "Sam") {
        clickableObjects.push(clickableObject);
        clickableObject.addEventListener('click', clickableObject.raycast);
    }

    return clickableObject;
}





const addObjectsToScene = function (levelTitle, samCharacter) {
    
    scene.children.forEach(object => {
        if (object !== camera && object !== ground) {
            scene.remove(object);
        }
    });

    switch (levelTitle) {
        case 'Επίπεδο 1 - Εξερεύνηση του Διαδικτύου':
            const youtubeLogo = createClickableObject('./assets/youtube_logo.png', -5, 1, -10, 'https://www.youtube.com/', () => {
                window.open('https://www.youtube.com/', '_blank');
            });

            const googleLogo = createClickableObject('./assets/google_logo.jpg', 5, 1, -15, 'https://www.google.com/', () => {
                window.open('https://www.google.com/', '_blank');
            });

            scene.add(samCharacter);
            scene.add(youtubeLogo);
            scene.add(googleLogo);
            break;
        case 'Επίπεδο 2 - Ασφαλείς Ιστοσελίδες':
           
            const loader = new THREE.FontLoader();

            loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', function (font) {
                const googleTextGeometry = new THREE.TextGeometry('google.com', {
                    font: font,
                    size: 2,
                    height: 0.2,
                });

                const googleTextMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                const googleText = new THREE.Mesh(googleTextGeometry, googleTextMaterial);
                googleText.position.set(0, 1, -5);
                scene.add(googleText);

                const secureTextGeometry = new THREE.TextGeometry('https', {
                    font: font,
                    size: 1,
                    height: 0.2,
                });

                const secureTextMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const secureText = new THREE.Mesh(secureTextGeometry, secureTextMaterial);
                secureText.position.set(0, 0.5, -5);
                scene.add(secureText);

                const descriptionText = new THREE.TextGeometry('Αυτή είναι μια ασφαλής ιστοσελίδα.', {
                    font: font,
                    size: 0.5,
                    height: 0.2,
                });

                const descriptionMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const description = new THREE.Mesh(descriptionText, descriptionMaterial);
                description.position.set(0, 0, -5);
                scene.add(description);
            });

            scene.add(samCharacter);
            break;
        case 'Επίπεδο 3 - Αναγνώριση και Αποφυγή του διαδικτυακού εκφοβιστή':
            const cyberBully = createClickableObject('./assets/cyber_bully.jpg', 1, 1, -5, 'Κακές Λέξεις, Προσβλητικά Σχόλια', () => {
                console.log('Κακές Λέξεις, Προσβλητικά Σχόλια');
                scene.remove(cyberBully);
            });
            
            scene.add(cyberBully);
            scene.add(samCharacter);
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
            });
        
            
            unsafePasswords.forEach((password, index) => {
                const passwordObject = createDraggableObject(password.text, 3, 1, index * 2, password.isSafe);
                passwordObjects.push(passwordObject);
                scene.add(passwordObject);
            });
        
            scene.add(samCharacter);            
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