// --- Variables Globales ---
const display = document.getElementById('display');
const jumpscareImageDiv = document.getElementById('jumpscareImage');
const allButtons = document.querySelectorAll('.btn');
const calculatorDiv = document.querySelector('.calculator');
let currentInput = '0';
let imageIsShowing = false;

// --- Variables para Colores Locos ---
let crazyColorsInterval; 

// --- Variables para Popups ---
let allPopups = document.querySelectorAll('.popup-ad');
let popupPhysics = []; 
let popupInterval;

// --- Funciones para Colores Locos ---
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function startCrazyColors() {
    if (crazyColorsInterval) return;
    crazyColorsInterval = setInterval(() => {
        document.body.style.backgroundColor = getRandomColor();
        allButtons.forEach(button => {
            button.style.backgroundColor = getRandomColor();
        });
    }, 50);
}

function stopCrazyColors() {
    clearInterval(crazyColorsInterval);
    crazyColorsInterval = null; 
    document.body.style.backgroundColor = '#f0f0f0';
    allButtons.forEach(button => {
        button.style.backgroundColor = ''; 
    });
}

// --- NUEVA FUNCIÓN: CERRAR ANUNCIO Y CREAR MÁS ---
function closeAd(event) {
    event.stopPropagation(); // Evita que el clic active otras cosas
    const adToRemove = event.target.closest('.popup-ad');
    
    if (adToRemove) {
        // 1. Eliminar el anuncio del array de física
        popupPhysics = popupPhysics.filter(p => p.el !== adToRemove);
        
        // 2. Eliminar el anuncio del DOM
        adToRemove.remove();
        
        // 3. ¡Crear 7 nuevos anuncios!
        spawnAds(7);
    }
}

// --- Funciones para Popups (MODIFICADAS) ---
function initializePopups() {
    popupPhysics = []; // Limpia el array
    allPopups.forEach(popup => {
        const maxW = window.innerWidth - popup.offsetWidth;
        const maxH = window.innerHeight - popup.offsetHeight;
        
        // ¡NUEVO! Añade el listener para el botón 'X' (que es el h3)
        popup.querySelector('h3').addEventListener('click', closeAd);

        popupPhysics.push({
            el: popup,
            x: Math.random() * maxW, 
            y: Math.random() * maxH, 
            vx: (Math.random() - 0.5) * 6, 
            vy: (Math.random() - 0.5) * 6  
        });
    });
}

function startPopupAnimation() {
    if (popupInterval) return;
    popupInterval = setInterval(() => {
        const maxW = window.innerWidth;
        const maxH = window.innerHeight;
        
        popupPhysics.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || (p.x + p.el.offsetWidth) > maxW) p.vx *= -1;
            if (p.y < 0 || (p.y + p.el.offsetHeight) > maxH) p.vy *= -1;

            // Asegurarse de que el elemento todavía existe antes de moverlo
            if(p.el) {
                p.el.style.left = p.x + 'px';
                p.el.style.top = p.y + 'px';
            }
        });
    }, 20); 
}

function stopPopupAnimation() {
    clearInterval(popupInterval);
    popupInterval = null;
}

// --- Función del Jumpscare ---
function triggerJumpscare() {
    if (imageIsShowing) return; 

    imageIsShowing = true;
    stopCrazyColors(); 
    stopPopupAnimation(); 
    jumpscareImageDiv.classList.remove('hidden'); 

    setTimeout(() => {
        jumpscareImageDiv.classList.add('hidden'); 
        imageIsShowing = false;
        
        if (calculatorDiv) {
            calculatorDiv.classList.add('rotate-animation');
            calculatorDiv.addEventListener('animationend', function handler() {
                calculatorDiv.classList.remove('rotate-animation');
                calculatorDiv.removeEventListener('animationend', handler);
            });
        }

        startCrazyColors(); 
        startPopupAnimation(); 
    }, 500); 
}

// --- Funciones de la Calculadora ---
function appendValue(value) {
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    try {
        let result = eval(currentInput.replace(/[^0-9+\-*/().]/g, ''));
        if (result === Infinity || isNaN(result)) {
            currentInput = 'Error';
        } else {
            currentInput = String(result);
        }
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            currentInput = '0';
            updateDisplay();
        }, 1500);
    }
}

function updateDisplay() {
    display.textContent = currentInput;
}

// --- Activadores de Eventos ---
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        triggerJumpscare(); 
    });
});

// --- Funciones de Apocalipsis de Anuncios (MODIFICADAS) ---

function spawnAds(amount) {
    const adTemplates = [
        { h: '¡¡¡ERROR!!!', p: '¡Tu sistema está en peligro!', b: '¡Arreglar YA!' },
        { h: '¡FELICIDADES!', p: '¡Haz clic para ganar un auto!', b: '¡Reclamar!' },
        { h: '¡ALERTA DE VIRUS!', p: '¡Descarga nuestro antivirus!', b: 'Descargar' },
        { h: 'SPIN TO WIN', p: '¡Gira la ruleta de la suerte!', b: 'GIRAR' }
    ];
    
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;

    for (let i = 0; i < amount; i++) {
        const template = adTemplates[Math.floor(Math.random() * adTemplates.length)];
        
        const ad = document.createElement('div');
        ad.classList.add('popup-ad');
        ad.id = 'new-ad-' + Math.random(); // ID aleatorio
        
        ad.innerHTML = `
            <h3>${template.h} (${Math.floor(Math.random() * 100)})</h3>
            <p>${template.p}</p>
            <button>${template.b}</button>
        `;
        
        document.body.appendChild(ad); // Añadir al DOM

        // ¡NUEVO! Añadir listener al nuevo anuncio
        ad.querySelector('h3').addEventListener('click', closeAd);

        // ¡NUEVO! Añadir a la simulación de física
        popupPhysics.push({
            el: ad,
            x: Math.random() * (maxW - 250), // 250 es el ancho del ad
            y: Math.random() * (maxH - 150), // 150 es el alto aprox.
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6
        });
    }

    allPopups = document.querySelectorAll('.popup-ad'); // Actualiza la lista
    
    if (!popupInterval) {
        startPopupAnimation(); // Asegurarse de que la animación esté corriendo
    }
}

function triggerAdApocalypse() {
    stopPopupAnimation();
    allPopups.forEach(popup => {
        popup.remove();
    });
    popupPhysics = []; // Limpia el array de física

    setTimeout(() => {
        spawnAds(40);
    }, 2000); 
}

// --- Iniciar ---
updateDisplay();
initializePopups(); 
startCrazyColors(); 
startPopupAnimation();