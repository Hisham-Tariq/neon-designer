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
    updatePreview();
    initCustomSelect();
    initMaterialSelection();
    document.getElementById('neonBtn').addEventListener('click', () => toggleSignType('neon'));
    document.getElementById('materialBtn').addEventListener('click', () => toggleSignType('material'));
};

// Preload background images for better performance
function preloadBackgroundImages() {
    // Preload current background first
    preloadImage(selectedBackground);
    
    // Preload other backgrounds with slight delay to prioritize current one
    setTimeout(() => {
        backgrounds.forEach(bg => {
            if (bg !== selectedBackground) {
                preloadImage(bg);
            }
        });
    }, 1000);
}

function preloadImage(src) {
    if (!preloadedImages.has(src)) {
        const img = new Image();
        img.onload = () => {
            preloadedImages.set(src, img);
            console.log(`Background image ${src} preloaded`);
        };
        img.onerror = () => {
            console.error(`Failed to preload image: ${src}`);
        };
        img.src = src;
    }
}

// Preload all fonts to ensure they're available
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
        document.fonts.load(`16px "${font}"`).then(() => {
            console.log(`Font ${font} loaded successfully`);
        }).catch(err => {
            console.log(`Font ${font} failed to load:`, err);
        });
    });
}

let selectedColor = '#ff00ff';
let multiColorInterval;
const colors = ["#ff00ff", "#00e1ffff", "#ffe600ff", "#00ff00", "#ff0000", "#dee2e6", "#ff6200", "#a020f0", "#ff1493", "#32cd32"];
const backgrounds = [
    'assets/1.jpg',
    'assets/2.jpg',
    'assets/3.jpg',
    'assets/4.jpg',
    'assets/5.jpg'
];
let selectedBackground = backgrounds[1];
let preloadedImages = new Map();
let isNeonSign = true;
let selectedMaterial = 'forex-10mm';
const materialThickness = {
    'forex-10mm': 10,
    'forex-5mm': 5,
    'forex-3mm':3,
    'mdf-3mm': 3,
    'mdf-5mm':5,
    'mdf-9mm': 9,
    'silver-mirror-2mm':2,
    'gold-mirror-2mm':2,
    'stainlesssteel-1mm':1,
    'acrylic-3mm': 3,
    'acrylic-black-3mm': 3,
    'acrylic-8mm':8,
    'acrylic-10mm': 10
};

function populateColors() {
    const colorContainer = document.getElementById('colorOptions');
    colorContainer.innerHTML = '';
    colors.forEach((color, index) => {
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
    backgrounds.forEach((bg, index) => {
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
    selectedColor = color;

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
        updatePreview();
    }
}

function selectBackground(element, bg) {
    document.querySelectorAll('.bg-thumb').forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
    selectedBackground = bg;
    
    // Preload the selected background if not already loaded
    if (!preloadedImages.has(bg)) {
        preloadImage(bg);
    }
    
    updatePreview();
}

function toggleSignType(type) {
    isNeonSign = (type === 'neon');
    document.getElementById('neonBtn').classList.toggle('active', isNeonSign);
    document.getElementById('materialBtn').classList.toggle('active', !isNeonSign);
    document.getElementById('colorOptions').style.display = isNeonSign ? 'flex' : 'none';
    document.getElementById('colorOptionsGroup').style.display = isNeonSign ? 'unset' : 'none';
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
    document.querySelector('.material-thumb').classList.add('active');
}

function drawDimensionLine(ctx, x1, y1, x2, y2, text, fontSize) {
    const isLightBackground = selectedBackground.includes('light-background');
    const lineColor = isLightBackground ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
    const textColor = isLightBackground ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1 - 5);
    ctx.lineTo(x1, y1 + 5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2 - 5);
    ctx.lineTo(x2, y2 + 5);
    ctx.stroke();

    ctx.fillStyle = textColor;
    const dimensionFontSize = Math.max(8, Math.min(16, fontSize * 0.15));
    ctx.font = `${dimensionFontSize}px Poppins`;
    ctx.textAlign = 'center';
    ctx.fillText(text, (x1 + x2) / 2, y1 - 10);
}

function drawDimensionLineVertical(ctx, x1, y1, x2, y2, text, fontSize) {
    const isLightBackground = selectedBackground.includes('light-background');
    const lineColor = isLightBackground ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
    const textColor = isLightBackground ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1 - 5, y1);
    ctx.lineTo(x1 + 5, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2 - 5, y2);
    ctx.lineTo(x2 + 5, y2);
    ctx.stroke();

    ctx.save();
    ctx.translate(x1 - 10, (y1 + y2) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = textColor;
    const dimensionFontSize = Math.max(8, Math.min(16, fontSize * 0.15));
    ctx.font = `${dimensionFontSize}px Poppins`;
    ctx.textAlign = 'center';
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

let selectedFont = 'Handsome';

function initCustomSelect() {
    const selectSelected = document.querySelector('.select-selected');
    const selectItems      = document.querySelector('.select-items');
    const options          = Array.from(selectItems.querySelectorAll('div'));

    /* ---------- open / close list ---------- */
    selectSelected.addEventListener('click', e => {
        e.stopPropagation();
        closeAllDropdowns(selectSelected);
        selectItems.classList.toggle('select-hide');
        selectSelected.classList.toggle('select-arrow-active');
        if (!selectItems.classList.contains('select-hide')) {
            selectItems.focus();
        }
    });

    /* ---------- mouse selection ---------- */
    options.forEach(option => {
        option.addEventListener('click', () => {
            const value     = option.getAttribute('data-value');
            const className = option.className;

            selectSelected.textContent       = value;
            selectSelected.className         = 'select-selected ' + className;
            selectedFont                     = value;

            options.forEach(opt => opt.classList.remove('same-as-selected'));
            option.classList.add('same-as-selected');

            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
            updatePreview();
        });
    });

    /* ---------- keyboard navigation ---------- */
    selectSelected.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            selectSelected.click();
        }
    });

    selectItems.addEventListener('keydown', e => {
        const activeItem = selectItems.querySelector('.same-as-selected');
        let index        = activeItem ? options.indexOf(activeItem) : 0;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            index = (index + 1) % options.length;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            index = (index - 1 + options.length) % options.length;
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            options[index].click();
            return;
        } else if (e.key === 'Escape') {
            e.preventDefault();
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
            selectSelected.focus();
            return;
        }

        options.forEach(opt => opt.classList.remove('same-as-selected'));
        options[index].classList.add('same-as-selected');
        options[index].scrollIntoView({ block: 'nearest' });
    });

    /* initial highlight */
    options[0].classList.add('same-as-selected');
}

// function initCustomSelect() {
//     const selectSelected = document.querySelector('.select-selected');
//     const selectItems = document.querySelector('.select-items');
//     const options = selectItems.querySelectorAll('div');

//     selectSelected.addEventListener('click', function (e) {
//         e.stopPropagation();
//         selectItems.classList.toggle('select-hide');
//         selectSelected.classList.toggle('select-arrow-active');
//     });

//     options.forEach(option => {
//         option.addEventListener('click', function () {
//             const value = this.getAttribute('data-value');
//             const className = this.className;

//             selectSelected.textContent = value;
//             selectSelected.className = 'select-selected ' + className;
//             selectedFont = value;

//             options.forEach(opt => opt.classList.remove('same-as-selected'));
//             this.classList.add('same-as-selected');

//             selectItems.classList.add('select-hide');
//             selectSelected.classList.remove('select-arrow-active');

//             updatePreview();
//         });
//     });

//     document.addEventListener('click', function () {
//         selectItems.classList.add('select-hide');
//         selectSelected.classList.remove('select-arrow-active');
//     });

//     options[0].classList.add('same-as-selected');
// }

function updatePreview() {
    const text = document.getElementById('textInput').value || "Farhan";
    const font = selectedFont;
    const sizeSelect = document.getElementById('sizeSelect');
    const selectedSizeOption = sizeSelect.options[sizeSelect.selectedIndex];
    const backing = document.getElementById('backingSelect').value;
    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Show loading if image is not preloaded
    if (!preloadedImages.has(selectedBackground)) {
        loadingOverlay.style.display = 'flex';
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background and hide loading overlay
    if (isNeonSign) {
        canvas.style.backgroundImage = `url(${selectedBackground})`;
    } else {
        canvas.style.backgroundImage = `url(${selectedBackground})`;
    }
    
    // Hide loading overlay after background is set
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 100);

    const baseFontSize = 70;
    const minFontSize = 40;
    const maxFontSize = 90;
    const responsiveFontSize = Math.max(minFontSize, Math.min(maxFontSize, (canvas.width / 400) * baseFontSize));

    document.fonts.load(`bold ${responsiveFontSize}px "${font}"`).then(function () {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let fontSize = responsiveFontSize;
        const maxTextWidth = canvas.width * 0.9;
        ctx.font = `bold ${fontSize}px "${font}"`;
        let textWidth = ctx.measureText(text).width;

        while (textWidth > maxTextWidth && fontSize > 20) {
            fontSize -= 2;
            ctx.font = `bold ${fontSize}px "${font}"`;
            textWidth = ctx.measureText(text).width;
        }

        const textHeight = fontSize;

        if (isNeonSign) {
            const textHeight = fontSize;
            const textX = canvas.width / 2;
            const textY = canvas.height * 0.4;
            const rectX = (canvas.width - textWidth) / 2 - 20;
            const rectY = canvas.height * 0.4 - textHeight / 2 - 20;
            const rectWidth = textWidth + 40;
            const rectHeight = textHeight + 40;

            if (backing === 'rectangle' || backing === 'standing') {
                // Create gradient for acrylic backing
                const gradient = ctx.createLinearGradient(0, rectY, 0, rectY + rectHeight);
                gradient.addColorStop(0, 'rgba(223, 223, 223, 0.1)');
                gradient.addColorStop(1, 'rgba(112, 112, 112, 0.06)');
                ctx.fillStyle = gradient;
                ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

                if (backing === 'standing') {
                    // Add stand with gradient
                    const standGradient = ctx.createLinearGradient(0, textY + textHeight / 2 + 20, 0, textY + textHeight / 2 + 50);
                    standGradient.addColorStop(0, 'rgba(223, 223, 223, 0.1)');
                    standGradient.addColorStop(1, 'rgba(112, 112, 112, 0.06)');
                    ctx.fillStyle = standGradient;
                    ctx.fillRect(textX - 20, textY + textHeight / 2 + 20, 40, 30);
                }
            } else if (backing === 'letter') {
                ctx.lineWidth = 15;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.strokeText(text, canvas.width / 2, canvas.height * 0.4);
            }

            let displayColor = selectedColor;
            if (selectedColor === 'multi') {
                const gradient = ctx.createLinearGradient(0, 0, textWidth, 0);
                colors.forEach((color, index) => {
                    gradient.addColorStop(index / colors.length, color);
                });
                displayColor = gradient;
            }

            // Apply CSS text-shadow technique to canvas neon rendering
            const centerX = canvas.width / 2;
            const centerY = canvas.height * 0.4;
            
            // Get color mapping for the selected color
            const neonColors = getNeonColorMapping(displayColor);
            
            // Layer 1: Outer shadow (40px blur)
            ctx.shadowColor = neonColors.primary;
            ctx.shadowBlur = 40;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = neonColors.primary;
            ctx.globalAlpha = 0.3;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 2: 32px blur
            ctx.shadowBlur = 32;
            ctx.globalAlpha = 0.4;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 3: 28px blur
            ctx.shadowBlur = 28;
            ctx.globalAlpha = 0.5;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 4: 24px blur
            ctx.shadowBlur = 24;
            ctx.globalAlpha = 0.6;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 5: 20px blur
            ctx.shadowBlur = 20;
            ctx.globalAlpha = 0.7;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 6: 16px blur
            ctx.shadowBlur = 16;
            ctx.globalAlpha = 0.8;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 7: 13px blur
            ctx.shadowBlur = 13;
            ctx.globalAlpha = 0.85;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 8: 10px blur
            ctx.shadowBlur = 10;
            ctx.globalAlpha = 0.9;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 9: 6px blur
            ctx.shadowBlur = 6;
            ctx.globalAlpha = 0.95;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 10: 3px blur with darker color
            ctx.shadowColor = neonColors.darker;
            ctx.shadowBlur = 3;
            ctx.globalAlpha = 1;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 11: Drop shadow (1px offset)
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 1;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 12: Core text (no shadow)
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = neonColors.primary;
            ctx.globalAlpha = 1;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 13: Bright center
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(text, centerX, centerY);
            
            // Reset alpha for other elements
            ctx.globalAlpha = 1;
            
            // Hide CSS neon text since we're using canvas
            document.getElementById('neonText').style.display = 'none';
        } else {
            // Hide neon text for material signs
            document.getElementById('neonText').style.display = 'none';
            
            const materialImg = new Image();
            materialImg.src = `assets/materials/${selectedMaterial}.jpg`;
            materialImg.onload = function () {
                drawMaterialText(ctx, text, font, fontSize, canvas.width, canvas.height, materialImg, selectedMaterial);
                drawMaterialDimensions(ctx, textWidth, textHeight, canvas.width, canvas.height, fontSize, selectedMaterial);
            };
        }

        const widthInCm = selectedSizeOption.dataset.width;
        const heightInCm = selectedSizeOption.dataset.height;
        const textX = canvas.width / 2;
        const textY = canvas.height * 0.4;

        if (isNeonSign) {
            drawDimensionLine(ctx, textX - textWidth / 2, textY + textHeight / 2 + 20, textX + textWidth / 2, textY + textHeight / 2 + 20, `${widthInCm}cm`, responsiveFontSize);
            drawDimensionLineVertical(ctx, textX - textWidth / 2 - 20, textY - textHeight / 2, textX - textWidth / 2 - 20, textY + textHeight / 2, `${heightInCm}cm`, responsiveFontSize);
        }
    }).catch(function () {
        console.log('Font loading failed, using fallback');
        ctx.font = `bold ${responsiveFontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = responsiveFontSize;

        if (isNeonSign) {
            const textHeight = fontSize;
            const textX = canvas.width / 2;
            const textY = canvas.height * 0.4;
            const rectX = (canvas.width - textWidth) / 2 - 20;
            const rectY = canvas.height * 0.4 - textHeight / 2 - 20;
            const rectWidth = textWidth + 40;
            const rectHeight = textHeight + 40;

            if (backing === 'rectangle' || backing === 'standing') {
                // Create gradient for acrylic backing
                const gradient = ctx.createLinearGradient(0, rectY, 0, rectY + rectHeight);
                gradient.addColorStop(0, 'rgba(223, 223, 223, 0.1)');
                gradient.addColorStop(1, 'rgba(112, 112, 112, 0.06)');
                ctx.fillStyle = gradient;
                ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

                if (backing === 'standing') {
                    // Add stand with gradient
                    const standGradient = ctx.createLinearGradient(0, textY + textHeight / 2 + 20, 0, textY + textHeight / 2 + 50);
                    standGradient.addColorStop(0, 'rgba(223, 223, 223, 0.1)');
                    standGradient.addColorStop(1, 'rgba(112, 112, 112, 0.06)');
                    ctx.fillStyle = standGradient;
                    ctx.fillRect(textX - 20, textY + textHeight / 2 + 20, 40, 30);
                }
            } else if (backing === 'letter') {
                ctx.lineWidth = 15;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.strokeText(text, canvas.width / 2, canvas.height * 0.4);
            }

            let displayColor = selectedColor;
            if (selectedColor === 'multi') {
                const gradient = ctx.createLinearGradient(0, 0, textWidth, 0);
                colors.forEach((color, index) => {
                    gradient.addColorStop(index / colors.length, color);
                });
                displayColor = gradient;
            }

            // Apply CSS text-shadow technique to canvas neon rendering
            const centerX = canvas.width / 2;
            const centerY = canvas.height * 0.4;
            
            // Get color mapping for the selected color
            const neonColors = getNeonColorMapping(displayColor);
            
            // Layer 1: Outer shadow (40px blur)
            ctx.shadowColor = neonColors.primary;
            ctx.shadowBlur = 40;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = neonColors.primary;
            ctx.globalAlpha = 0.3;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 2: 32px blur
            ctx.shadowBlur = 32;
            ctx.globalAlpha = 0.4;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 3: 28px blur
            ctx.shadowBlur = 28;
            ctx.globalAlpha = 0.5;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 4: 24px blur
            ctx.shadowBlur = 24;
            ctx.globalAlpha = 0.6;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 5: 20px blur
            ctx.shadowBlur = 20;
            ctx.globalAlpha = 0.7;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 6: 16px blur
            ctx.shadowBlur = 16;
            ctx.globalAlpha = 0.8;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 7: 13px blur
            ctx.shadowBlur = 13;
            ctx.globalAlpha = 0.85;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 8: 10px blur
            ctx.shadowBlur = 10;
            ctx.globalAlpha = 0.9;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 9: 6px blur
            ctx.shadowBlur = 6;
            ctx.globalAlpha = 0.95;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 10: 3px blur with darker color
            ctx.shadowColor = neonColors.darker;
            ctx.shadowBlur = 3;
            ctx.globalAlpha = 1;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 11: Drop shadow (1px offset)
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 1;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 12: Core text (no shadow)
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = neonColors.primary;
            ctx.globalAlpha = 1;
            ctx.fillText(text, centerX, centerY);
            
            // Layer 13: Bright center
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(text, centerX, centerY);
            
            // Reset alpha for other elements
            ctx.globalAlpha = 1;
            
            // Hide CSS neon text since we're using canvas
            document.getElementById('neonText').style.display = 'none';
        } else {
            // Hide neon text for material signs
            document.getElementById('neonText').style.display = 'none';
            
            const materialImg = new Image();
            materialImg.src = `assets/materials/${selectedMaterial}.jpg`;
            materialImg.onload = function () {
                drawMaterialText(ctx, text, font, fontSize, canvas.width, canvas.height, materialImg, selectedMaterial);
                drawMaterialDimensions(ctx, textWidth, textHeight, canvas.width, canvas.height, fontSize, selectedMaterial);
            };
        }
    });
}

function drawMaterialText(ctx, text, font, fontSize, canvasWidth, canvasHeight, materialImg, material) {
    const thickness = materialThickness[material] || 3;
    const pattern = ctx.createPattern(materialImg, 'repeat');

    ctx.save();
    ctx.fillStyle = '#888';
    for (let i = 0; i < thickness; i++) {
        ctx.fillText(text, canvasWidth / 2 + i * 0.7, canvasHeight * 0.4 + i * 0.7);
    }
    ctx.restore();

    ctx.fillStyle = pattern;
    ctx.font = `bold ${fontSize}px "${font}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvasWidth / 2, canvasHeight * 0.4);

    const gradient = ctx.createLinearGradient(0, canvasHeight * 0.4 - fontSize / 2, 0, canvasHeight * 0.4 + fontSize / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(canvasWidth / 2 - ctx.measureText(text).width / 2, canvasHeight * 0.4 - fontSize / 2, ctx.measureText(text).width, fontSize);
}

function drawMaterialDimensions(ctx, textWidth, textHeight, canvasWidth, canvasHeight, fontSize, material) {
    const thickness = materialThickness[material] || 3;
    const textX = canvasWidth / 2;
    const textY = canvasHeight * 0.4;

    drawDimensionLine(
        ctx,
        textX - textWidth / 2,
        textY + textHeight / 2 + 20 + thickness,
        textX + textWidth / 2,
        textY + textHeight / 2 + 20 + thickness,
        `${Math.round(textWidth / canvasWidth * 100)}cm`,
        fontSize
    );

    drawDimensionLineVertical(
        ctx,
        textX - textWidth / 2 - 20 - thickness,
        textY - textHeight / 2,
        textX - textWidth / 2 - 20 - thickness,
        textY + textHeight / 2,
        `${Math.round(textHeight / canvasHeight * 25)}cm`,
        fontSize
    );

    drawDimensionLineVertical(
        ctx,
        textX + textWidth / 2 + 20,
        textY - textHeight / 2,
        textX + textWidth / 2 + 20,
        textY - textHeight / 2 + thickness,
        `${thickness}mm`,
        fontSize
    );
}

document.getElementById('priceDisplay').addEventListener('click', () => {
    downloadCanvasImage('png');
    setTimeout(() => downloadCanvasImage('jpg'), 500);
});

function downloadCanvasImage(format = 'png') {
    const canvas = document.getElementById('previewCanvas');
    const link = document.createElement('a');
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const fileExt = format === 'jpg' ? 'jpg' : 'png';

    link.download = `alfarhan-logo.${fileExt}`;
    link.href = canvas.toDataURL(mimeType, 1.0);
    link.click();
}

function updateNeonText(text, font, fontSize, color) {
    const neonTextElement = document.getElementById('neonText');
    
    // Update text content
    neonTextElement.textContent = text;
    
    // Update font
    neonTextElement.style.fontFamily = `'${font}', Arial, sans-serif`;
    neonTextElement.style.fontSize = `${fontSize}px`;
    
    // Generate dynamic text-shadow based on color
    let primaryColor = color;
    let darkerColor = color;
    
    // Convert color names to hex for shadow generation
    const colorMap = {
        'red': '#ff0000',
        'blue': '#0000ff',
        'green': '#00ff00',
        'yellow': '#ffff00',
        'purple': '#800080',
        'pink': '#ff69b4',
        'orange': '#ff981a',
        'white': '#ffffff',
        'cyan': '#00ffff'
    };
    
    if (colorMap[color]) {
        primaryColor = colorMap[color];
        darkerColor = darkenColor(primaryColor, 0.3);
    }
    
    // Create layered text-shadow effect
    const textShadow = `
        ${darkerColor} 0px 0px 3px,
        rgba(0, 0, 0, 0.3) 1px 1px 1px,
        ${primaryColor} 0px 0px 6px,
        ${primaryColor} 0px 0px 10px,
        ${primaryColor} 0px 0px 13px,
        ${primaryColor} 0px 0px 16px,
        ${primaryColor} 0px 0px 20px,
        ${primaryColor} 0px 0px 24px,
        ${primaryColor} 0px 0px 28px,
        ${primaryColor} 0px 0px 32px,
        ${primaryColor} 0px 0px 40px
    `;
    
    neonTextElement.style.textShadow = textShadow;
    neonTextElement.style.color = primaryColor;
    neonTextElement.style.display = 'block';
}

function getNeonColorMapping(color) {
    // Handle gradient objects
    if (typeof color === 'object') {
        return { primary: '#ff981a', darker: '#c16a01' }; // Default orange for gradients
    }
    
    // Map hex colors to neon color pairs (based on your CSS text-shadow example)
    const hexColorMappings = {
        '#ff00ff': { primary: '#ff40a0', darker: '#cc3380' }, // Magenta/Pink
        '#00e1ffff': { primary: '#00ffff', darker: '#00cccc' }, // Cyan
        '#ffe600ff': { primary: '#ffff00', darker: '#cccc00' }, // Yellow
        '#00ff00': { primary: '#00ff40', darker: '#00cc33' }, // Green
        '#ff0000': { primary: '#ff0040', darker: '#cc0033' }, // Red
        '#dee2e6': { primary: '#ffffff', darker: '#cccccc' }, // White/Gray
        '#ff6200': { primary: '#ff981a', darker: '#c16a01' }, // Orange
        '#a020f0': { primary: '#8040ff', darker: '#6633cc' }, // Purple
        '#ff1493': { primary: '#ff40a0', darker: '#cc3380' }, // Deep Pink
        '#32cd32': { primary: '#00ff40', darker: '#00cc33' }  // Lime Green
    };
    
    // Return specific mapping or create one based on the color
    if (hexColorMappings[color]) {
        return hexColorMappings[color];
    }
    
    // For any other hex color, create a darker version for the 3px shadow
    if (color.startsWith('#')) {
        return {
            primary: color,
            darker: darkenColor(color, 0.3)
        };
    }
    
    // Default fallback
    return { primary: '#ff981a', darker: '#c16a01' };
}

function darkenColor(hex, factor) {
    // Convert hex to rgb
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Darken by factor
    const newR = Math.floor(r * (1 - factor));
    const newG = Math.floor(g * (1 - factor));
    const newB = Math.floor(b * (1 - factor));
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}