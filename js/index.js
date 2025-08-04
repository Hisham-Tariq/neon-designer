// Theme management
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle.querySelector('i');

    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        icon.className = 'fas fa-moon';
        document.querySelector('.logo').src = './assets/logo-dark.png';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
        document.querySelector('.logo').src = './assets/logo-light.png';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        const themeToggle = document.querySelector('.theme-toggle');
        const icon = themeToggle.querySelector('i');
        icon.className = 'fas fa-sun';
    }
}

// Helper to close all dropdowns
function closeAllDropdowns(current) {
    document.querySelectorAll('.select-items').forEach(el => {
        if (el.previousElementSibling !== current) {
            el.classList.add('select-hide');
        }
    });
    document.querySelectorAll('.select-selected').forEach(el => {
        if (el !== current) {
            el.classList.remove('select-arrow-active');
        }
    });
}

window.onload = function () {
    loadTheme();
    populateColors();
    populateBackgrounds();
    preloadFonts();
    preloadBackgroundImages();
    preloadMaterialTextures(); // Preload material textures
    updatePreview();
    initCustomSelect();
    initMaterialSelection();
    document.getElementById('neonBtn').addEventListener('click', () => toggleSignType('neon'));
    document.getElementById('materialBtn').addEventListener('click', () => toggleSignType('material'));
};

// --- Global State and Data ---
let selectedColor = '#ff00ff';
let multiColorInterval;
const colors = ["#ff00ff", "#00e1ffff", "#ffe600ff", "#00ff00", "#ff0000", "#dee2e6", "#ff6200", "#a020f0", "#ff1493", "#32cd32"];
const backgrounds = ['assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg'];
let selectedBackground = backgrounds[1];
let isNeonSign = true;
let selectedMaterial = 'forex-10mm';
let selectedFont = 'Handsome';
let currentDimensionLineColor = 'rgba(0,0,0,0.95)';

const materialThickness = {
    'forex-10mm': 10, 'forex-5mm': 5, 'forex-3mm': 3,
    'mdf-3mm': 3, 'mdf-5mm': 5, 'mdf-9mm': 9,
    'silver-mirror-2mm': 2, 'gold-mirror-2mm': 2,
    'stainlesssteel-1mm': 1,
    'acrylic-3mm': 3, 'acrylic-black-3mm': 3, 'acrylic-8mm': 8, 'acrylic-10mm': 10
};

// Caching for images to improve performance
let preloadedImages = new Map();
let preloadedMaterialTextures = new Map();

// --- Preloading Functions ---
function preloadImage(src, cache) {
    if (!cache.has(src)) {
        const img = new Image();
        img.onload = () => {
            cache.set(src, img);
            console.log(`Image ${src} preloaded`);
        };
        img.onerror = () => {
            console.error(`Failed to preload image: ${src}`);
        };
        img.src = src;
    }
}

function preloadBackgroundImages() {
    preloadImage(selectedBackground, preloadedImages); // Prioritize current
    setTimeout(() => {
        backgrounds.forEach(bg => {
            if (bg !== selectedBackground) {
                preloadImage(bg, preloadedImages);
            }
        });
    }, 1000);
}

function preloadMaterialTextures() {
    const materialNames = Object.keys(materialThickness);
    materialNames.forEach(name => {
        // Assuming material textures are JPG files in an 'assets/materials/' folder
        const src = `assets/materials/${name}.jpg`;
        preloadImage(src, preloadedMaterialTextures);
    });
}

function preloadFonts() {
    const fonts = [
        'Autoguard', 'Barcelony', 'Bayshore', 'Beon', 'Better Together Demo',
        'Boho Baby', 'Conquera Fine', 'Core Mellow', 'Gruenewald VA',
        'Hamillton Demo', 'Handsome', 'Hesterica', 'Kiona',
        'Kloegirl New York ITC Std', 'Local Brewery Two', 'Love Conchetta',
        'Marquee Moon', 'NEON GLOW-Light', 'NEON LED Light', 'Neon Sans',
        'Nickainley Normal', 'Quinzey', 'Roboto Lt', 'Rocket Clouds DEMO',
        'Socialist', 'Vegas Nova Light', 'Velvet Script', 'Westey'
    ];

    fonts.forEach(font => {
        document.fonts.load(`16px "${font}"`).catch(err => {
            console.log(`Font ${font} failed to load:`, err);
        });
    });
}

// --- UI Population and Selection Handlers ---
function populateColors() {
    const colorContainer = document.getElementById('colorOptions');
    colorContainer.innerHTML = '';
    colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorBox.onclick = () => selectColor(colorBox, color);
        if (color === selectedColor) {
            colorBox.classList.add('active');
        }
        colorContainer.appendChild(colorBox);
    });
    const multiColorBox = document.createElement('div');
    multiColorBox.className = 'color-box multi-color';
    multiColorBox.onclick = () => selectColor(multiColorBox, 'multi');
    colorContainer.appendChild(multiColorBox);
}

function populateBackgrounds() {
    const backgroundContainer = document.getElementById('backgroundSelector');
    backgroundContainer.innerHTML = '';
    backgrounds.forEach(bg => {
        const bgThumb = document.createElement('div');
        bgThumb.className = 'bg-thumb';
        bgThumb.style.backgroundImage = `url(${bg})`;
        bgThumb.onclick = () => selectBackground(bgThumb, bg);
        if (bg === selectedBackground) {
            bgThumb.classList.add('active');
        }
        backgroundContainer.appendChild(bgThumb);
    });
}

function selectColor(element, color) {
    document.querySelectorAll('.color-box').forEach(box => box.classList.remove('active'));
    element.classList.add('active');
    
    if (multiColorInterval) {
        clearInterval(multiColorInterval);
        multiColorInterval = null;
    }

    if (color === 'multi') {
        let colorIndex = 0;
        multiColorInterval = setInterval(() => {
            selectedColor = colors[colorIndex];
            updatePreview();
            colorIndex = (colorIndex + 1) % colors.length;
        }, 1000);
    } else {
        selectedColor = color;
        updatePreview();
    }
}

function selectBackground(element, bg) {
    document.querySelectorAll('.bg-thumb').forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
    selectedBackground = bg;
    preloadImage(bg, preloadedImages);
    updatePreview();
}

function toggleSignType(type) {
    isNeonSign = (type === 'neon');
    document.getElementById('neonBtn').classList.toggle('active', isNeonSign);
    document.getElementById('materialBtn').classList.toggle('active', !isNeonSign);
    document.getElementById('colorOptionsGroup').style.display = isNeonSign ? 'block' : 'none';
    document.getElementById('materialOptions').style.display = isNeonSign ? 'none' : 'block';
    updatePreview();
}

function initMaterialSelection() {
    document.querySelectorAll('.material-thumb').forEach(thumb => {
        thumb.addEventListener('click', function () {
            document.querySelectorAll('.material-thumb').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            selectedMaterial = this.dataset.material;
            updatePreview();
        });
    });
    // Set default active material
    document.querySelector(`.material-thumb[data-material="${selectedMaterial}"]`).classList.add('active');
}

function initCustomSelect() {
    const selectSelected = document.querySelector('.select-selected');
    const selectItems = document.querySelector('.select-items');
    const options = Array.from(selectItems.querySelectorAll('div'));

    selectSelected.addEventListener('click', e => {
        e.stopPropagation();
        closeAllDropdowns(selectSelected);
        selectItems.classList.toggle('select-hide');
        selectSelected.classList.toggle('select-arrow-active');
        if (!selectItems.classList.contains('select-hide')) {
            selectItems.focus();
        }
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.getAttribute('data-value');
            selectSelected.textContent = value;
            selectSelected.className = 'select-selected ' + option.className;
            selectedFont = value;
            options.forEach(opt => opt.classList.remove('same-as-selected'));
            option.classList.add('same-as-selected');
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
            updatePreview();
        });
    });
    
    document.addEventListener('click', () => {
        selectItems.classList.add('select-hide');
        selectSelected.classList.remove('select-arrow-active');
    });

    options[0].classList.add('same-as-selected');
}

// --- Canvas Drawing and Rendering Logic ---

async function updatePreview() {
    const text = document.getElementById('textInput').value || "Farhan";
    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');
    const loadingOverlay = document.getElementById('loadingOverlay');

    loadingOverlay.style.display = 'flex';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bgImg = preloadedImages.get(selectedBackground);
    if (!bgImg) {
        setTimeout(updatePreview, 200); // Wait for image to load
        return;
    }
    
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // **FIX:** Determine contrast color AFTER drawing the background
    currentDimensionLineColor = determineDimensionLineColor(ctx);

    const baseFontSize = 70;
    const responsiveFontSize = Math.max(40, Math.min(90, (canvas.width / 400) * baseFontSize));
    
    try {
        await document.fonts.load(`bold ${responsiveFontSize}px "${selectedFont}"`);
        
        let fontSize = responsiveFontSize;
        const maxTextWidth = canvas.width * 0.9;
        ctx.font = `bold ${fontSize}px "${selectedFont}"`;
        let textMetrics = ctx.measureText(text);
        
        while (textMetrics.width > maxTextWidth && fontSize > 20) {
            fontSize -= 2;
            ctx.font = `bold ${fontSize}px "${selectedFont}"`;
            textMetrics = ctx.measureText(text);
        }

        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        const textX = canvas.width / 2;
        const textY = canvas.height * 0.4;
        
        if (isNeonSign) {
            drawNeonTextOnCanvas(ctx, text, selectedFont, fontSize, selectedColor, textX, textY);
            
            const sizeSelect = document.getElementById('sizeSelect');
            const selectedSizeOption = sizeSelect.options[sizeSelect.selectedIndex];
            const widthInCm = selectedSizeOption.dataset.width;
            const heightInCm = selectedSizeOption.dataset.height;
            
            drawDimensionLine(ctx, textX - textWidth / 2, textY + textHeight / 2 + 30, textX + textWidth / 2, textY + textHeight / 2 + 30, `${widthInCm}cm`, responsiveFontSize);
            drawDimensionLineVertical(ctx, textX - textWidth / 2 - 30, textY - textHeight / 2, textX - textWidth / 2 - 30, textY + textHeight / 2, `${heightInCm}cm`, responsiveFontSize);
        } else { // Material Sign
            const materialSrc = `assets/materials/${selectedMaterial}.jpg`;
            const materialImg = preloadedMaterialTextures.get(materialSrc);

            if (materialImg) {
                drawMaterialText(ctx, text, selectedFont, fontSize, canvas.width, textY, materialImg, selectedMaterial);
                drawMaterialDimensions(ctx, textWidth, textHeight, canvas.width, textY, fontSize, selectedMaterial);
            } else {
                ctx.fillStyle = 'grey';
                ctx.fillText(text, textX, textY);
                console.log("Material texture not found, drawing fallback text.");
            }
        }
    } catch (err) {
        console.error("Error during preview update:", err);
        ctx.font = `bold ${responsiveFontSize}px Arial`;
        ctx.fillStyle = 'red';
        ctx.fillText("Error Loading Font", canvas.width / 2, canvas.height * 0.4);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

function getBrightnessAt(x, y, ctx) {
    try {
        x = Math.max(0, Math.min(x, ctx.canvas.width - 1));
        y = Math.max(0, Math.min(y, ctx.canvas.height - 1));
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        if (pixel[3] === 0) return 128; // Treat transparency as medium gray
        return Math.round(0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2]);
    } catch (e) {
        console.warn("Could not get brightness, possibly due to CORS.", e);
        return 128; // Fallback brightness
    }
}

function determineDimensionLineColor(ctx) {
    const points = [
        { x: ctx.canvas.width * 0.25, y: ctx.canvas.height * 0.5 },
        { x: ctx.canvas.width * 0.75, y: ctx.canvas.height * 0.5 },
        { x: ctx.canvas.width * 0.5,  y: ctx.canvas.height * 0.3 },
        { x: ctx.canvas.width * 0.5,  y: ctx.canvas.height * 0.7 }
    ];
    let totalBrightness = 0;
    points.forEach(p => {
        totalBrightness += getBrightnessAt(Math.floor(p.x), Math.floor(p.y), ctx);
    });
    const avgBrightness = totalBrightness / points.length;

    // **FIX:** Lowered threshold for better contrast detection.
    return avgBrightness > 140 ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)';
}

function getNeonColorMapping(color) {
    const hexColorMappings = {
        '#ff00ff': { primary: '#ff40a0' }, '#00e1ffff': { primary: '#00ffff' },
        '#ffe600ff': { primary: '#ffff00' }, '#00ff00': { primary: '#00ff40' },
        '#ff0000': { primary: '#ff0040' }, '#dee2e6': { primary: '#ffffff' },
        '#ff6200': { primary: '#ff981a' }, '#a020f0': { primary: '#9d5eff' },
        '#ff1493': { primary: '#ff40a0' }, '#32cd32': { primary: '#00ff40' }
    };
    return hexColorMappings[color] || { primary: color };
}

function drawNeonTextOnCanvas(ctx, text, font, fontSize, color, x, y) {
    const { primary } = getNeonColorMapping(color);
    ctx.font = `bold ${fontSize}px "${font}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Create the glow effect
    ctx.shadowColor = primary;
    ctx.fillStyle = primary;
    ctx.shadowBlur = 20; ctx.fillText(text, x, y);
    ctx.shadowBlur = 10; ctx.fillText(text, x, y);

    // Draw the bright inner text
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#fff';
    ctx.fillText(text, x, y);
}

function drawMaterialText(ctx, text, font, fontSize, canvasWidth, yPos, materialImg, material) {
    const thickness = materialThickness[material] || 3;
    const pattern = ctx.createPattern(materialImg, 'repeat');
    
    ctx.font = `bold ${fontSize}px "${font}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const xPos = canvasWidth / 2;

    // Draw 3D-effect shadow
    ctx.save();
    ctx.fillStyle = '#666'; // Shadow color
    for (let i = 0; i < thickness; i++) {
        ctx.fillText(text, xPos + i * 0.5, yPos + i * 0.5);
    }
    ctx.restore();

    // Draw main text with material texture
    ctx.fillStyle = pattern;
    ctx.fillText(text, xPos, yPos);
    
    // Add a subtle gradient for lighting effect
    const gradient = ctx.createLinearGradient(0, yPos - fontSize / 2, 0, yPos + fontSize / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = gradient;
    ctx.fillText(text, xPos, yPos);
}

// --- Dimension Line Drawing ---
function drawDimensionLine(ctx, x1, y1, x2, y2, text, fontSize) {
    const dimensionFontSize = Math.max(12, Math.min(18, fontSize * 0.2));
    ctx.font = `bold ${dimensionFontSize}px Poppins`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    
    const lineColor = currentDimensionLineColor;
    ctx.lineWidth = 2;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1 - 8);
    ctx.lineTo(x1, y1 + 8);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2 - 8);
    ctx.lineTo(x2, y2 + 8);
    ctx.stroke();

    ctx.fillText(text, (x1 + x2) / 2, y1 - 10);
}

function drawDimensionLineVertical(ctx, x1, y1, x2, y2, text, fontSize) {
    const dimensionFontSize = Math.max(12, Math.min(18, fontSize * 0.2));
    ctx.font = `bold ${dimensionFontSize}px Poppins`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lineColor = currentDimensionLineColor;
    ctx.lineWidth = 2;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1 - 8, y1);
    ctx.lineTo(x1 + 8, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2 - 8, y2);
    ctx.lineTo(x2 + 8, y2);
    ctx.stroke();

    ctx.save();
    ctx.translate(x1 - 15, (y1 + y2) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

function drawMaterialDimensions(ctx, textWidth, textHeight, canvasWidth, yPos, fontSize, material) {
    const thickness = materialThickness[material] || 3;
    const textX = canvasWidth / 2;
    
    // Approximate size calculation for display
    const widthCm = Math.round(textWidth / 3.5);
    const heightCm = Math.round(textHeight / 3.5);

    drawDimensionLine(ctx, textX - textWidth / 2, yPos + textHeight / 2 + 20 + thickness, textX + textWidth / 2, yPos + textHeight / 2 + 20 + thickness, `${widthCm}cm`, fontSize);
    drawDimensionLineVertical(ctx, textX - textWidth / 2 - 20 - thickness, yPos - textHeight / 2, textX - textWidth / 2 - 20 - thickness, yPos + textHeight / 2, `${heightCm}cm`, fontSize);
    drawDimensionLineVertical(ctx, textX + textWidth / 2 + 20, yPos + textHeight / 2 - thickness, textX + textWidth / 2 + 20, yPos + textHeight / 2, `${thickness}mm`, fontSize);
}

// --- Image Download ---
document.getElementById('priceDisplay').addEventListener('click', () => {
    downloadCanvasImage('png');
});

function downloadCanvasImage(format = 'png') {
    const canvas = document.getElementById('previewCanvas');
    const link = document.createElement('a');
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const fileExt = format === 'jpg' ? 'jpg' : 'png';
    link.download = `alfarhan-sign-preview.${fileExt}`;
    link.href = canvas.toDataURL(mimeType, 1.0);
    link.click();
}