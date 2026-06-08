const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elementi
const mainMenu = document.getElementById('mainMenu');
const settingsMenu = document.getElementById('settingsMenu');
const scoreMenu = document.getElementById('scoreMenu');
const campaignMenu = document.getElementById('campaignMenu');
const menuBackground = document.getElementById('menuBackground'); 
const campaignUI = document.getElementById('campaignUI'); 

const campaignGameOverMenu = document.getElementById('campaignGameOverMenu');
const levelCompleteMenu = document.getElementById('levelCompleteMenu');
const bossIntroUI = document.getElementById('bossIntroUI');
const bossOutroUI = document.getElementById('bossOutroUI');

const bossIntroLevelText = document.getElementById('bossIntroLevelText');
const bossIntroTitleText = document.getElementById('bossIntroTitleText');

const startBtn = document.getElementById('startBtn');
const openCampaignBtn = document.getElementById('openCampaignBtn');
const closeCampaignBtn = document.getElementById('closeCampaignBtn');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const openScoreBtn = document.getElementById('openScoreBtn');
const closeScoreBtn = document.getElementById('closeScoreBtn');

const retryCampaignBtn = document.getElementById('retryCampaignBtn');
const campaignToMenuBtn = document.getElementById('campaignToMenuBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const victoryToMenuBtn = document.getElementById('victoryToMenuBtn');

const campaignProgressText = document.getElementById('campaignProgressText');
const bestScoreDisplay = document.getElementById('bestScoreDisplay');
const currentScoreContainer = document.getElementById('currentScoreContainer');
const lastScore = document.getElementById('lastScore');

const musicVolMinus = document.getElementById('musicVolMinus');
const musicVolPlus = document.getElementById('musicVolPlus');
const musicVolumeValue = document.getElementById('musicVolumeValue');

const sfxVolMinus = document.getElementById('sfxVolMinus');
const sfxVolPlus = document.getElementById('sfxVolPlus');
const sfxVolumeValue = document.getElementById('sfxVolumeValue');

const worldTitle = document.getElementById('worldTitle');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageIndicator = document.getElementById('pageIndicator');

// Nalaganje tekstur
const birdImg = new Image();
birdImg.src = 'assets/textures/bird.png';

const pipeImg = new Image();
pipeImg.src = 'assets/textures/pipe.png';

const pipe2Img = new Image();
pipe2Img.src = 'assets/textures/pipe2.png'; 

const pipe3Img = new Image();
pipe3Img.src = 'assets/textures/pipe3.png'; 

const floorImg = new Image();
floorImg.src = 'assets/backgrounds/floor.png';

const floor2Img = new Image();
floor2Img.src = 'assets/backgrounds/floor2.png'; 

const floor3Img = new Image();
floor3Img.src = 'assets/backgrounds/floor3.png';

const backgroundImg = new Image();
backgroundImg.src = 'assets/backgrounds/background.png';

const coinImg = new Image();
coinImg.src = 'assets/textures/coin.png';

const lvl1BgImg = new Image();
lvl1BgImg.src = 'assets/backgrounds/level1.png';

const lvl2BgImg = new Image();
lvl2BgImg.src = 'assets/backgrounds/level2.png';

const lvl3BgImg = new Image();
lvl3BgImg.src = 'assets/backgrounds/level3.png';

const lvl4BgImg = new Image();
lvl4BgImg.src = 'assets/backgrounds/level4.png'; 

const lvl5BgImg = new Image();
lvl5BgImg.src = 'assets/backgrounds/level5.png'; 

const lvl6BgImg = new Image();
lvl6BgImg.src = 'assets/backgrounds/level6.png'; 

const lvl7BgImg = new Image();
lvl7BgImg.src = 'assets/backgrounds/level7.png';

const birdBossImg = new Image();
birdBossImg.src = 'assets/textures/birdboss.png';

const fishBossImg = new Image();
fishBossImg.src = 'assets/textures/fishboss.png';

const waterImg = new Image();
waterImg.src = 'assets/textures/water.png';

const jellyfishImg = new Image();
jellyfishImg.src = 'assets/textures/jellyfish.png';

const bulletImg = new Image();
bulletImg.src = 'assets/textures/bullet.png';

const flameImg = new Image();
flameImg.src = 'assets/textures/flame.png';

// Nalaganje vizualnih efektov
const seaweedImg = new Image();
seaweedImg.src = 'assets/textures/seaweed.png'; 

// Nalaganje zvokov
const flapSound = new Audio('assets/sounds/flap.wav');
const scoreSound = new Audio('assets/sounds/score.wav'); 
const hitSound = new Audio('assets/sounds/hit.wav');
const gameOverSound = new Audio('assets/sounds/gameover.wav'); 
const victorySound = new Audio('assets/sounds/winner.wav'); 

// Glasba
const bgMusic = new Audio('assets/sounds/music.wav');
bgMusic.loop = true;

const endlessMusic = new Audio('assets/sounds/endless.wav');
endlessMusic.loop = true;

const surfaceMusic = new Audio('assets/sounds/surface.wav');
surfaceMusic.loop = true;

const underwaterMusic = new Audio('assets/sounds/underwater.wav');
underwaterMusic.loop = true;

const lavaMusic = new Audio('assets/sounds/lava.wav');
lavaMusic.loop = true;

const boss1Music = new Audio('assets/sounds/boss1.wav');
boss1Music.loop = true;

const boss2Music = new Audio('assets/sounds/boss2.wav');
boss2Music.loop = true;

const storage = {
    get: function(key) {
        try { return localStorage.getItem(key); } 
        catch (e) { return null; }
    },
    set: function(key, value) {
        try { localStorage.setItem(key, value); } 
        catch (e) {}
    }
};

// --- SPREMENLJIVKE IGRE ---
let frames = 0;
let gameState = 'MENU'; 
let gameMode = 'ENDLESS'; 
let currentLevel = 0; 

let score = 0;
let bestScore = storage.get('bestScore') || 0;
bestScoreDisplay.innerText = bestScore;

let flashAlpha = 0; 
let blackFadeAlpha = 0; 

let gameSpeed = 2; 
let pipeSpawnTimer = 0; 
const maxGameSpeed = 4.2; 

let distanceTraveled = 0;
let currentLevelLength = 6000; 
let coinsSpawned = 0;
let coinsCollectedCurrent = [false, false, false]; 

let savedMusicVolume = storage.get('musicVolume');
let currentMusicVolume = savedMusicVolume !== null ? parseFloat(savedMusicVolume) : 0.5;

let savedSfxVolume = storage.get('sfxVolume');
let currentSfxVolume = savedSfxVolume !== null ? parseFloat(savedSfxVolume) : 0.5;

let currentFadeInterval = null;

function getHitGroundY() {
    if (gameMode === 'CAMPAIGN' && (currentLevel === 3 || currentLevel === 6)) {
        return canvas.height; 
    }
    return canvas.height * 0.75; 
}

function updateVolumeDisplays() {
    musicVolumeValue.innerText = Math.round(currentMusicVolume * 100);
    sfxVolumeValue.innerText = Math.round(currentSfxVolume * 100);
}

function updateVolumes() {
    flapSound.volume = currentSfxVolume;
    scoreSound.volume = currentSfxVolume;
    hitSound.volume = currentSfxVolume;
    gameOverSound.volume = currentSfxVolume; 
    victorySound.volume = currentSfxVolume; 
    
    if (!currentFadeInterval) {
        bgMusic.volume = (gameState === 'MENU') ? currentMusicVolume : 0;
        
        if (gameState === 'PLAYING' || gameState === 'READY' || gameState === 'BOSS_INTRO' || gameState === 'BOSS_OUTRO') {
            if (gameMode === 'ENDLESS') {
                endlessMusic.volume = currentMusicVolume;
                surfaceMusic.volume = 0;
                boss1Music.volume = 0;
                boss2Music.volume = 0;
                underwaterMusic.volume = 0;
                lavaMusic.volume = 0;
            } else if (gameMode === 'CAMPAIGN') {
                if (currentLevel >= 1 && currentLevel <= 2) {
                    surfaceMusic.volume = currentMusicVolume;
                    boss1Music.volume = 0;
                    boss2Music.volume = 0;
                    underwaterMusic.volume = 0;
                    lavaMusic.volume = 0;
                    endlessMusic.volume = 0;
                } else if (currentLevel === 3) {
                    boss1Music.volume = currentMusicVolume;
                    surfaceMusic.volume = 0;
                    boss2Music.volume = 0;
                    underwaterMusic.volume = 0;
                    lavaMusic.volume = 0;
                    endlessMusic.volume = 0;
                } else if (currentLevel === 4 || currentLevel === 5) {
                    underwaterMusic.volume = currentMusicVolume;
                    surfaceMusic.volume = 0;
                    boss1Music.volume = 0;
                    boss2Music.volume = 0;
                    lavaMusic.volume = 0;
                    endlessMusic.volume = 0;
                } else if (currentLevel === 6) {
                    boss2Music.volume = currentMusicVolume;
                    underwaterMusic.volume = 0;
                    surfaceMusic.volume = 0;
                    boss1Music.volume = 0;
                    lavaMusic.volume = 0;
                    endlessMusic.volume = 0;
                } else if (currentLevel >= 7) {
                    lavaMusic.volume = currentMusicVolume;
                    surfaceMusic.volume = 0;
                    boss1Music.volume = 0;
                    boss2Music.volume = 0;
                    underwaterMusic.volume = 0;
                    endlessMusic.volume = 0;
                }
            }
        } else {
            endlessMusic.volume = 0;
            surfaceMusic.volume = 0;
            boss1Music.volume = 0;
            boss2Music.volume = 0;
            underwaterMusic.volume = 0;
            lavaMusic.volume = 0;
        }
    }
}

function crossfadeMusic(fadeOutAudio, fadeInAudio) {
    if (currentFadeInterval) clearInterval(currentFadeInterval);
    
    if (fadeInAudio) {
        fadeInAudio.volume = 0;
        fadeInAudio.play().catch(()=>{});
    }
    
    let fadeStep = 0.05; 
    
    currentFadeInterval = setInterval(() => {
        let fadeComplete = true;
        
        if (fadeOutAudio && fadeOutAudio.volume > 0) {
            let newVol = fadeOutAudio.volume - fadeStep;
            fadeOutAudio.volume = newVol < 0 ? 0 : newVol;
            fadeComplete = false;
        } else if (fadeOutAudio && fadeOutAudio.volume === 0 && !fadeOutAudio.paused) {
            fadeOutAudio.pause();
        }
        
        if (fadeInAudio && fadeInAudio.volume < currentMusicVolume) {
            let newVol = fadeInAudio.volume + fadeStep;
            fadeInAudio.volume = newVol > currentMusicVolume ? currentMusicVolume : newVol;
            fadeComplete = false;
        }
        
        if (fadeComplete) {
            clearInterval(currentFadeInterval);
            currentFadeInterval = null;
        }
    }, 50);
}

updateVolumeDisplays();
updateVolumes();

// --- UI NAVIGACIJA ---
openSettingsBtn.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    settingsMenu.style.display = 'flex';
});
closeSettingsBtn.addEventListener('click', () => {
    settingsMenu.style.display = 'none';
    mainMenu.style.display = 'flex';
});
openScoreBtn.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    scoreMenu.style.display = 'flex';
});
closeScoreBtn.addEventListener('click', () => {
    scoreMenu.style.display = 'none';
    mainMenu.style.display = 'flex';
});

function backToMainMenu() {
    gameState = 'MENU'; 
    bird.reset();       
    pipes.reset();
    coins.reset();
    backgroundLayer.x = 0;
    boss.reset();
    bullets.reset();
    boss2.reset();
    boss2Projectiles.reset();
    currents.reset();
    horizontalBubbles.reset();
    ambientBubbles.reset();
    seaweed.reset();
    fireballs.reset();
    
    const menus = [campaignGameOverMenu, levelCompleteMenu, campaignMenu, bossIntroUI, bossOutroUI];
    menus.forEach(m => {
        if(m) m.style.display = 'none';
    });
    
    menuBackground.className = 'retro-bg bg-surface';
    menuBackground.style.backgroundColor = ''; 
    menuBackground.style.display = 'none';
    
    mainMenu.style.transition = 'none';
    mainMenu.style.opacity = '0';
    mainMenu.style.display = 'flex';
    
    requestAnimationFrame(() => {
        mainMenu.style.transition = 'opacity 0.8s ease-in-out';
        mainMenu.style.opacity = '1';
    });
    
    crossfadeMusic(null, bgMusic);
}

campaignToMenuBtn.addEventListener('click', backToMainMenu);
victoryToMenuBtn.addEventListener('click', backToMainMenu);

retryCampaignBtn.addEventListener('click', () => {
    resetGame('CAMPAIGN', currentLevel);
});

nextLevelBtn.addEventListener('click', () => {
    resetGame('CAMPAIGN', currentLevel + 1);
});

// --- CAMPAIGN PROGRESS LOGIKA ---
let defaultProgress = {
    1: { unlocked: true,  coins: [false, false, false] }, 
    2: { unlocked: true, coins: [false, false, false] },
    3: { unlocked: true, coins: [false, false, false] },
    4: { unlocked: true, coins: [false, false, false] },
    5: { unlocked: false, coins: [false, false, false] },
    6: { unlocked: false, coins: [false, false, false] },
    7: { unlocked: false, coins: [false, false, false] },
    8: { unlocked: false, coins: [false, false, false] },
    9: { unlocked: false, coins: [false, false, false] }
};

let savedProgress = storage.get('campaignProgress');
let campaignProgress = savedProgress ? JSON.parse(savedProgress) : defaultProgress;

const campaignPages = [
    { title: "SURFACE", bgClass: "bg-surface", levels: ["LEVEL 1", "LEVEL 2", "BOSS 3"] },
    { title: "UNDERWATER", bgClass: "bg-water", levels: ["LEVEL 4", "LEVEL 5", "BOSS 6"] },
    { title: "LAVA CASTLE", bgClass: "bg-lava", levels: ["LEVEL 7", "LEVEL 8", "BOSS 9"] }
];
let currentCampaignPage = 0;

function updateCampaignUI() {
    const pageData = campaignPages[currentCampaignPage];
    
    worldTitle.innerText = pageData.title;
    menuBackground.className = `retro-bg ${pageData.bgClass}`;
    pageIndicator.innerText = `${currentCampaignPage + 1}/${campaignPages.length}`;

    prevPageBtn.disabled = currentCampaignPage === 0;
    nextPageBtn.disabled = currentCampaignPage === campaignPages.length - 1;

    const baseLevel = currentCampaignPage * 3; 

    for (let i = 0; i < 3; i++) {
        const levelNum = baseLevel + i + 1; 
        const btn = document.getElementById(`lvlBtn${i+1}`);
        const coinContainer = document.getElementById(`coins${i+1}`);
        const prog = campaignProgress[levelNum];

        btn.innerText = pageData.levels[i];

        if (prog.unlocked) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }

        if (i === 2 && prog.unlocked) {
            btn.classList.add('boss-btn');
        } else {
            btn.classList.remove('boss-btn');
        }

        const coinDivs = coinContainer.querySelectorAll('.coin');
        for (let c = 0; c < 3; c++) {
            if (prog.coins[c]) {
                coinDivs[c].classList.add('collected');
            } else {
                coinDivs[c].classList.remove('collected');
            }
        }
    }
}

openCampaignBtn.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    campaignMenu.style.display = 'flex';
    menuBackground.style.display = 'block'; 
    currentCampaignPage = 0; 
    updateCampaignUI();
});

closeCampaignBtn.addEventListener('click', () => {
    campaignMenu.style.display = 'none';
    mainMenu.style.display = 'flex';
    menuBackground.style.display = 'none'; 
});

prevPageBtn.addEventListener('click', () => {
    if (currentCampaignPage > 0) {
        currentCampaignPage--;
        updateCampaignUI();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentCampaignPage < campaignPages.length - 1) {
        currentCampaignPage++;
        updateCampaignUI();
    }
});

function applyMusicVolumeChange() {
    currentMusicVolume = Math.round(currentMusicVolume * 10) / 10;
    updateVolumeDisplays();
    updateVolumes();
    storage.set('musicVolume', currentMusicVolume);
}

musicVolMinus.addEventListener('click', () => {
    currentMusicVolume -= 0.1;
    if (currentMusicVolume < 0) currentMusicVolume = 0;
    applyMusicVolumeChange();
});
musicVolPlus.addEventListener('click', () => {
    currentMusicVolume += 0.1;
    if (currentMusicVolume > 1) currentMusicVolume = 1;
    applyMusicVolumeChange();
});

function applySfxVolumeChange() {
    currentSfxVolume = Math.round(currentSfxVolume * 10) / 10;
    updateVolumeDisplays();
    updateVolumes();
    storage.set('sfxVolume', currentSfxVolume);
    if (flapSound.paused) {
        flapSound.currentTime = 0;
        flapSound.play().catch(()=>{});
    }
}
sfxVolMinus.addEventListener('click', () => {
    currentSfxVolume -= 0.1;
    if (currentSfxVolume < 0) currentSfxVolume = 0;
    applySfxVolumeChange();
});
sfxVolPlus.addEventListener('click', () => {
    currentSfxVolume += 0.1;
    if (currentSfxVolume > 1) currentSfxVolume = 1;
    applySfxVolumeChange();
});

function tryPlayMusic() {
    if (gameState === 'MENU') {
        bgMusic.volume = currentMusicVolume;
        bgMusic.play().catch(() => {
            document.addEventListener('click', () => {
                if (gameState === 'MENU') {
                    bgMusic.volume = currentMusicVolume;
                    bgMusic.play().catch(() => {});
                }
            }, { once: true });
        });
    }
}
tryPlayMusic();

// --- SCROLLING OBJEKTI ---
const scaledBgWidth = Math.round((1920 / 1085) * 512); 
const scaledLvl1BgWidth = Math.round((576 / 324) * 512); 

const backgroundLayer = {
    x: 0,
    y: 0,
    
    draw: function() {
        let imgToDraw = backgroundImg;
        let w = scaledBgWidth;
        
        if (gameMode === 'CAMPAIGN') {
            if (currentLevel >= 1 && currentLevel <= 7) {
                if (currentLevel >= 1 && currentLevel <= 4) {
                    w = scaledLvl1BgWidth;
                    if (currentLevel === 1) imgToDraw = lvl1BgImg;
                    else if (currentLevel === 2) imgToDraw = lvl2BgImg;
                    else if (currentLevel === 3) imgToDraw = lvl3BgImg;
                    else if (currentLevel === 4) imgToDraw = lvl4BgImg;
                } else if (currentLevel === 5) {
                    w = scaledBgWidth; 
                    imgToDraw = lvl5BgImg;
                } else if (currentLevel === 6) {
                    w = scaledLvl1BgWidth; 
                    imgToDraw = lvl6BgImg;
                } else if (currentLevel === 7) {
                    w = scaledLvl1BgWidth; 
                    imgToDraw = lvl7BgImg;
                }
            }
        }

        let drawX = Math.floor(this.x);
        let sW = imgToDraw.naturalWidth;
        let sH = imgToDraw.naturalHeight;
        
        if (sW > 2 && sH > 0) {
            ctx.drawImage(imgToDraw, 1, 0, sW - 2, sH, drawX, this.y, w, 512);
            ctx.drawImage(imgToDraw, 1, 0, sW - 2, sH, drawX + w - 1, this.y, w, 512);
            ctx.drawImage(imgToDraw, 1, 0, sW - 2, sH, drawX + w * 2 - 2, this.y, w, 512);
        } else {
            ctx.drawImage(imgToDraw, drawX, this.y, w, 512);
            ctx.drawImage(imgToDraw, drawX + w - 1, this.y, w, 512);
            ctx.drawImage(imgToDraw, drawX + w * 2 - 2, this.y, w, 512);
        }
    },
    update: function() {
        if (gameState === 'PLAYING' || gameState === 'MENU' || gameState === 'READY' || gameState === 'BOSS_INTRO' || gameState === 'BOSS_OUTRO') {
            let currentDx = (gameState === 'PLAYING' || gameState === 'BOSS_INTRO' || gameState === 'BOSS_OUTRO') ? gameSpeed * 0.25 : 0.5;
            this.x -= currentDx;
            
            let w = scaledBgWidth;
            if (gameMode === 'CAMPAIGN' && ((currentLevel >= 1 && currentLevel <= 4) || currentLevel === 6 || currentLevel >= 7)) {
                w = scaledLvl1BgWidth;
            }

            if (this.x <= -w) {
                this.x += w; 
            }
        }
    }
};

const floorLayer = {
    x: 0,
    y: 0, 
    width: scaledBgWidth, 
    height: 512,
    
    draw: function() {
        if (gameMode === 'CAMPAIGN' && (currentLevel === 3 || currentLevel === 6)) return;

        let imgToDraw = floorImg;

        if (gameMode === 'CAMPAIGN') {
            if (currentLevel >= 4 && currentLevel <= 6) {
                imgToDraw = (floor2Img.complete && floor2Img.naturalWidth !== 0) ? floor2Img : floorImg;
            } else if (currentLevel >= 7) {
                imgToDraw = (floor3Img.complete && floor3Img.naturalWidth !== 0) ? floor3Img : floorImg;
            }
        }

        let drawX = Math.floor(this.x);
        let sW = imgToDraw.naturalWidth;
        let sH = imgToDraw.naturalHeight;

        if (sW > 2 && sH > 0) {
            ctx.drawImage(imgToDraw, 1, 0, sW - 2, sH, drawX, this.y, this.width, 512);
            ctx.drawImage(imgToDraw, 1, 0, sW - 2, sH, drawX + this.width - 1, this.y, this.width, 512);
            ctx.drawImage(imgToDraw, 1, 0, sW - 2, sH, drawX + this.width * 2 - 2, this.y, this.width, 512);
        } else {
            ctx.drawImage(imgToDraw, drawX, this.y, this.width, 512);
            ctx.drawImage(imgToDraw, drawX + this.width - 1, this.y, this.width, 512);
            ctx.drawImage(imgToDraw, drawX + this.width * 2 - 2, this.y, this.width, 512);
        }
    },
    update: function() {
        if (gameState === 'PLAYING' || gameState === 'MENU' || gameState === 'READY' || gameState === 'BOSS_INTRO' || gameState === 'BOSS_OUTRO') {
            let currentDx = (gameState === 'PLAYING' || gameState === 'BOSS_INTRO' || gameState === 'BOSS_OUTRO') ? gameSpeed : 2;
            this.x -= currentDx;
            if (this.x <= -this.width) {
                this.x += this.width;
            }
        }
        
        if (gameState === 'PLAYING' || gameState === 'GAMEOVER') {
            let hitGroundY = getHitGroundY(); 

            const bh = bird.getHitbox();
            if (bh.y + bh.h >= hitGroundY) {
                gameOver();
            }
        }
    }
};

// --- VISUAL EFFECTS LAYER ---
const underwaterEffects = {
    drawTint: function() {
        if (gameMode !== 'CAMPAIGN' || currentLevel < 4 || currentLevel > 6) return;
        
        ctx.fillStyle = 'rgba(10, 50, 120, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let cx = canvas.width / 2;
        let cy = canvas.height / 2;
        let rMax = Math.max(cx, cy) * 1.5;
        let grad = ctx.createRadialGradient(cx, cy, rMax * 0.3, cx, cy, rMax);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(0, 20, 60, 0.6)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    
    drawGodRays: function() {
        if (gameMode !== 'CAMPAIGN' || currentLevel < 4 || currentLevel > 6) return;
        
        ctx.save();
        ctx.globalCompositeOperation = 'overlay'; 
        
        let pulse = Math.sin(frames * 0.01) * 0.5 + 0.5; 
        let alpha = 0.05 + pulse * 0.1; 
        
        let startX = 50 + Math.sin(frames * 0.005) * 50; 
        
        let grad = ctx.createLinearGradient(startX, 0, startX + 150, canvas.height);
        
        if (currentLevel === 5) {
            grad.addColorStop(0, `rgba(100, 255, 150, ${alpha * 0.8})`);
            grad.addColorStop(1, 'rgba(100, 255, 150, 0)');
        } else {
            grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX + 100, 0);
        ctx.lineTo(startX + 250, canvas.height);
        ctx.lineTo(startX - 50, canvas.height);
        ctx.fill();

        ctx.restore();
    }
};

const ambientBubbles = {
    items: [],
    
    draw: function() {
        if (gameMode !== 'CAMPAIGN' || currentLevel < 4 || currentLevel > 6) return;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let b of this.items) {
            let actualX = b.x + Math.sin(frames * 0.02 + b.phase) * b.wobbleAmp;
            ctx.beginPath();
            ctx.arc(actualX, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    update: function() {
        if (gameState === 'BOSS_OUTRO') {
            for (let b of this.items) b.x -= gameSpeed;
            return;
        }
        
        if (gameState !== 'PLAYING' || gameMode !== 'CAMPAIGN' || currentLevel < 4 || currentLevel > 6) return;

        if (Math.random() < 0.1) {
            this.items.push({
                x: canvas.width + Math.random() * 100 - 50, 
                y: canvas.height + 10,
                radius: 1 + Math.random() * 3,
                speedY: 0.5 + Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2,
                wobbleAmp: 5 + Math.random() * 15
            });
        }

        for (let i = 0; i < this.items.length; i++) {
            let b = this.items[i];
            b.x -= gameSpeed * 0.8; 
            b.y -= b.speedY;        

            if (b.y + b.radius < 0 || b.x < -50) {
                this.items.splice(i, 1);
                i--;
            }
        }
    },
    
    reset: function() {
        this.items = [];
    }
};

// PROCEDURAL PIXEL BUNCH SEAWEED
const seaweed = {
    items: [],
    spriteSize: 16,
    framesCount: 3,
    colorCount: 4,
    animationSpeed: 10,

    init: function() {
        this.items = [];
        for (let i = 0; i < 6; i++) {
            this.items.push(this.createBunch(Math.random() * 400));
        }
    },
    createBunch: function(xPos) {
        let colorIndex = Math.floor(Math.random() * this.colorCount);
        let baseScale = 2.0 + Math.random() * 1.5; 
        let bunch = {
            x: xPos,
            colorIndex: colorIndex,
            baseScale: baseScale,
            sprites: []
        };
        let clusterCount = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < clusterCount; j++) {
            let spriteOffset = {
                x: (j - (clusterCount - 1) / 2) * (this.spriteSize * baseScale * 0.6), 
                y: - (j * (this.spriteSize * baseScale * 0.4)), 
                scale: baseScale * (0.8 + Math.random() * 0.4),
                phase: Math.random() * Math.PI * 2, 
                wobbleAmp: 3 + Math.random() * 5
            };
            bunch.sprites.push(spriteOffset);
        }
        return bunch;
    },
    draw: function() {
        if (gameMode !== 'CAMPAIGN' || currentLevel < 4 || currentLevel > 6 || currentLevel === 6) return;
        if (!seaweedImg.complete || seaweedImg.naturalWidth === 0) return; 

        let hitGroundY = getHitGroundY(); 

        for (let i = 0; i < this.items.length; i++) {
            let bunch = this.items[i];
            
            for(let sprite of bunch.sprites) {
                let framePhase = (frames * 0.1) + sprite.phase; 
                let currentFrame = Math.floor(framePhase % this.framesCount);
                
                let sway = Math.sin(frames * 0.05 + sprite.phase) * sprite.wobbleAmp;
                
                let sx = currentFrame * this.spriteSize;
                let sy = bunch.colorIndex * this.spriteSize;
                
                let drawWidth = this.spriteSize * sprite.scale;
                let drawHeight = this.spriteSize * sprite.scale;
                
                let dx = bunch.x + sprite.x + sway;
                let dy = hitGroundY - drawHeight + sprite.y + 10; 

                ctx.drawImage(
                    seaweedImg,
                    sx, sy, this.spriteSize, this.spriteSize, 
                    dx, dy, drawWidth, drawHeight 
                );
            }
        }
    },
    update: function() {
        if (gameState === 'BOSS_OUTRO') {
            for (let i = 0; i < this.items.length; i++) this.items[i].x -= gameSpeed * 1.5;
            return;
        }

        if (gameState !== 'PLAYING' || gameMode !== 'CAMPAIGN' || currentLevel < 4 || currentLevel > 6 || currentLevel === 6) return;
        
        for (let i = 0; i < this.items.length; i++) {
            let bunch = this.items[i];
            bunch.x -= gameSpeed * 1.5; 
            
            if (bunch.x + 200 < 0) {
                let colorIndex = Math.floor(Math.random() * this.colorCount);
                let baseScale = 2.0 + Math.random() * 1.5; 
                bunch.colorIndex = colorIndex;
                bunch.baseScale = baseScale;
                bunch.sprites = [];
                let clusterCount = Math.floor(Math.random() * 3) + 3;
                for (let j = 0; j < clusterCount; j++) {
                    let spriteOffset = {
                        x: (j - (clusterCount - 1) / 2) * (this.spriteSize * baseScale * 0.6), 
                        y: - (j * (this.spriteSize * baseScale * 0.4)), 
                        scale: baseScale * (0.8 + Math.random() * 0.4),
                        phase: Math.random() * Math.PI * 2, 
                        wobbleAmp: 3 + Math.random() * 5
                    };
                    bunch.sprites.push(spriteOffset);
                }
                bunch.x = canvas.width + 200 + Math.random() * 100;
            }
        }
    },
    reset: function() {
        this.init(); 
    }
};
seaweed.reset(); 

// Ptič
const bird = {
    x: 50,
    y: 150,
    width: 60,  
    height: 42, 
    hitboxW: 30, 
    hitboxH: 20,
    velocity: 0,
    gravity: 0.25,
    jump: -4.5,
    
    getHitbox: function() {
        return {
            x: this.x + (this.width - this.hitboxW) / 2, 
            y: this.y + (this.height - this.hitboxH) / 2,
            w: this.hitboxW,
            h: this.hitboxH
        };
    },

    draw: function() {
        let rotation = 0;
        if (gameState === 'GAMEOVER' && this.velocity === 0) {
            rotation = Math.PI / 2;
        } else if (this.velocity > 0) {
            rotation = Math.min(Math.PI / 2, this.velocity * 0.1); 
        } else {
            rotation = -25 * Math.PI / 180; 
        }

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(rotation);
        ctx.drawImage(birdImg, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    },
    update: function() {
        if (gameState === 'MENU' || gameState === 'READY' || gameState === 'BOSS_INTRO') {
            this.y = 150 + Math.sin(Date.now() / 200) * 5;
        } 
        else if (gameState === 'BOSS_OUTRO') {
            this.y += Math.sin(frames * 0.1) * 1.5; 
        }
        else if (gameState === 'PLAYING' || gameState === 'GAMEOVER') {
            this.velocity += this.gravity;
            this.y += this.velocity;
            
            if (gameState === 'PLAYING' && gameMode === 'CAMPAIGN' && currentLevel === 3) {
                if (boss.windActive) {
                    this.x -= 1.5; 
                    if (this.x < 10) this.x = 10; 
                } else if (this.x < 50) {
                    this.x += 1; 
                    if (this.x > 50) this.x = 50;
                }
            }

            let hitGroundY = getHitGroundY();
            
            const bh = this.getHitbox();
            if (bh.y + bh.h >= hitGroundY) {
                this.y = hitGroundY - (this.height + this.hitboxH) / 2;
                this.velocity = 0; 
            }
        }
    },
    flap: function() {
        if (gameState === 'PLAYING') {
            this.velocity = this.jump;
            flapSound.currentTime = 0;
            flapSound.play().catch(e => {}); 
        }
    },
    reset: function() {
        this.x = 50; 
        this.y = 150;
        this.velocity = 0;
        
        if (gameMode === 'CAMPAIGN' && currentLevel >= 4 && currentLevel <= 6) {
            this.gravity = 0.12; 
            this.jump = -3.2; 
        } else {
            this.gravity = 0.25; 
            this.jump = -4.5; 
        }
    }
};

// --- REDESIGNED BUBBLES (Level 4) ---
const currents = {
    items: [],
    
    draw: function() {
        if (gameMode !== 'CAMPAIGN' || currentLevel !== 4) return;

        for (let b of this.items) {
            let actualX = b.x + Math.sin(frames * 0.05 + b.wobblePhase) * 20;
            
            if (!b.popped) {
                ctx.beginPath();
                ctx.arc(actualX, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.stroke();

                // Bubble highlight
                ctx.beginPath();
                ctx.arc(actualX - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fill();
            } else if (b.popFrames < 10) {
                // Draw pop animation
                ctx.beginPath();
                ctx.arc(actualX, b.y, b.radius + b.popFrames * 2, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - b.popFrames/10})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    },
    update: function() {
        if (gameState === 'BOSS_OUTRO') {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].x -= gameSpeed;
            }
            return;
        }

        if (gameState !== 'PLAYING' || gameMode !== 'CAMPAIGN' || currentLevel !== 4) return;

        for (let i = 0; i < this.items.length; i++) {
            let b = this.items[i];
            b.x -= gameSpeed;
            
            if (!b.popped) {
                b.y += b.speedY; // Float up
                let actualX = b.x + Math.sin(frames * 0.05 + b.wobblePhase) * 20;

                const bh = bird.getHitbox();
                
                let testX = actualX;
                let testY = b.y;

                if (actualX < bh.x) testX = bh.x;
                else if (actualX > bh.x + bh.w) testX = bh.x + bh.w;

                if (b.y < bh.y) testY = bh.y;
                else if (b.y > bh.y + bh.h) testY = bh.y + bh.h;

                let distX = actualX - testX;
                let distY = b.y - testY;
                let distance = Math.sqrt((distX*distX) + (distY*distY));

                if (distance <= b.radius) {
                    b.popped = true;
                    b.popFrames = 0;
                    bird.velocity = -3.5; 
                    flapSound.currentTime = 0;
                    flapSound.play().catch(e => {});
                }
            } else {
                b.popFrames++;
            }
            
            if (b.x + b.radius * 2 < 0 || (b.popped && b.popFrames >= 10)) {
                this.items.splice(i, 1);
                i--;
            }
        }
    },
    reset: function() {
        this.items = [];
    }
};

// --- HORIZONTAL BUBBLES (Level 6) ---
const horizontalBubbles = {
    items: [],
    draw: function() {
        if (gameMode !== 'CAMPAIGN' || currentLevel !== 6) return;
        
        for (let b of this.items) {
            let actualY = b.y + Math.sin(frames * 0.05 + b.wobblePhase) * 20;

            if (!b.popped) {
                ctx.beginPath();
                ctx.arc(b.x, actualY, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(b.x - b.radius * 0.3, actualY - b.radius * 0.3, b.radius * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fill();
            } else if (b.popFrames < 10) {
                ctx.beginPath();
                ctx.arc(b.x, actualY, b.radius + b.popFrames * 2, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - b.popFrames/10})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    },
    update: function() {
        if (gameState === 'BOSS_OUTRO') {
            for (let b of this.items) b.x -= gameSpeed;
            return;
        }

        if (gameState !== 'PLAYING' || gameMode !== 'CAMPAIGN' || currentLevel !== 6) return;

        if (Math.random() < 0.025) { 
            this.items.push({
                x: canvas.width + 50,
                y: Math.random() * canvas.height, 
                radius: 12 + Math.random() * 12,
                speedX: -(2 + Math.random() * 2), 
                wobblePhase: Math.random() * Math.PI * 2,
                popped: false,
                popFrames: 0
            });
        }

        for (let i = 0; i < this.items.length; i++) {
            let b = this.items[i];
            b.x += b.speedX - gameSpeed * 0.5; 

            let actualY = b.y + Math.sin(frames * 0.05 + b.wobblePhase) * 20;

            if (!b.popped) {
                const bh = bird.getHitbox();
                
                let testX = b.x;
                let testY = actualY;

                if (b.x < bh.x) testX = bh.x;
                else if (b.x > bh.x + bh.w) testX = bh.x + bh.w;

                if (actualY < bh.y) testY = bh.y;
                else if (actualY > bh.y + bh.h) testY = bh.y + bh.h;

                let distX = b.x - testX;
                let distY = actualY - testY;
                let distance = Math.sqrt((distX*distX) + (distY*distY));

                if (distance <= b.radius) {
                    b.popped = true;
                    b.popFrames = 0;
                    bird.velocity = -3.5; 
                    flapSound.currentTime = 0;
                    flapSound.play().catch(e => {});
                }
            } else {
                b.popFrames++;
            }
            
            if (b.x + b.radius < 0 || (b.popped && b.popFrames >= 10)) {
                this.items.splice(i, 1);
                i--;
            }
        }
    },
    reset: function() {
        this.items = [];
    }
};

// --- LEVEL 7 FIREBALLS MECHANIC ---
const fireballs = {
    items: [],
    draw: function() {
        if (gameMode !== 'CAMPAIGN' || currentLevel < 7) return;
        for (let b of this.items) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ff4d00'; 
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(b.x, b.y + b.radius*0.2, b.radius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = '#ffcc00'; 
            ctx.fill();
        }
    },
    update: function() {
        if (gameState === 'BOSS_OUTRO') {
            for (let b of this.items) b.x -= gameSpeed;
            return;
        }
        if (gameState !== 'PLAYING' || gameMode !== 'CAMPAIGN' || currentLevel < 7) return;

        if (Math.random() < 0.015) {
            this.items.push({
                x: canvas.width + Math.random() * 100,
                y: getHitGroundY() + 20,
                vx: -gameSpeed + (Math.random() * 2 - 1),
                vy: -(6 + Math.random() * 3.5), 
                radius: 12 + Math.random() * 6,
                gravity: 0.18
            });
        }

        for (let i = 0; i < this.items.length; i++) {
            let b = this.items[i];
            b.x += b.vx;
            b.vy += b.gravity;
            b.y += b.vy;

            const bh = bird.getHitbox();
            let distX = b.x - (bh.x + bh.w/2);
            let distY = b.y - (bh.y + bh.h/2);
            let distance = Math.sqrt(distX*distX + distY*distY);
            
            if (distance < b.radius + Math.min(bh.w, bh.h)/2 - 5) {
                gameOver();
            }

            if (b.y > canvas.height + 50 || b.x < -50) {
                this.items.splice(i, 1);
                i--;
            }
        }
    },
    reset: function() { this.items = []; }
};

// --- BOSS OBJEKTI (LEVEL 3) ---
const boss = {
    active: false,
    x: 0,
    y: 0,
    width: 140, 
    height: 140,
    windTimer: 0,
    windActive: false,
    shootTimer: 0,
    rotation: 0, 
    
    draw: function() {
        if (!this.active || (gameState !== 'PLAYING' && gameState !== 'BOSS_INTRO' && gameState !== 'BOSS_OUTRO')) return;

        if (this.windActive && gameState !== 'BOSS_OUTRO') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            for (let i = 0; i < 8; i++) {
                let lx = canvas.width - ((frames * 18 + i * 87) % canvas.width);
                let ly = (i * 45 + frames * 2) % (canvas.height);
                ctx.fillRect(lx, ly, 50 + Math.random() * 40, 2);
            }
        }

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        if (gameState === 'BOSS_OUTRO') {
            this.rotation = (this.rotation || 0) + 0.05;
            ctx.rotate(this.rotation);
        }
        ctx.drawImage(birdBossImg, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    },
    update: function() {
        if (gameMode !== 'CAMPAIGN' || currentLevel !== 3) return;
        
        if (gameState === 'BOSS_OUTRO') {
            this.y += 6; 
            this.x += 1;
            return;
        }

        if (gameState !== 'PLAYING' && gameState !== 'BOSS_INTRO') return;
        
        if (gameState === 'BOSS_INTRO') {
            this.active = true;
            this.x = canvas.width - this.width - 10;
            let hitGroundY = getHitGroundY();
            let centerY = hitGroundY / 2 - this.height / 2;
            this.y = centerY + Math.sin(frames * 0.04) * 80;
            return;
        }

        if (distanceTraveled < currentLevelLength) {
            this.active = true;
            
            this.x = canvas.width - this.width - 10;
            let hitGroundY = getHitGroundY();
            let centerY = hitGroundY / 2 - this.height / 2;
            this.y = centerY + Math.sin(frames * 0.04) * 80;

            this.windTimer++;
            if (this.windTimer > 250) { 
                this.windActive = true;
                if (this.windTimer > 350) { 
                    this.windActive = false;
                    this.windTimer = 0;
                }
            }

            this.shootTimer++;
            if (this.shootTimer > 120) { 
                bullets.items.push({
                    x: this.x + 20,
                    y: this.y + this.height / 2 - 15, 
                    width: 55, 
                    height: 30
                });
                this.shootTimer = 0;
            }
        } else {
            this.active = false;
            this.windActive = false;
        }
    },
    reset: function() {
        this.active = false;
        this.windTimer = 0;
        this.windActive = false;
        this.shootTimer = 0;
        this.rotation = 0;
    }
};

const bullets = {
    items: [],
    draw: function() {
        for (let b of this.items) {
            ctx.drawImage(bulletImg, b.x, b.y, b.width, b.height);
        }
    },
    update: function() {
        if (gameState === 'BOSS_OUTRO') {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].x -= (gameSpeed + 3);
            }
            return;
        }

        if (gameState !== 'PLAYING') return;

        for (let i = 0; i < this.items.length; i++) {
            let b = this.items[i];
            b.x -= (gameSpeed + 3); 

            const bh = bird.getHitbox();
            if (bh.x < b.x + b.width &&
                bh.x + bh.w > b.x &&
                bh.y < b.y + b.height &&
                bh.h + bh.y > b.y) {
                gameOver();
            }

            if (b.x + b.width < 0) {
                this.items.shift();
                i--;
            }
        }
    },
    reset: function() {
        this.items = [];
    }
};


// --- BOSS OBJEKTI (LEVEL 6) ---
const boss2 = {
    active: false,
    x: 0,
    y: 0,
    width: 140, 
    height: 70, 
    shootTimer: 0,
    attackCount: 0,
    state: 'IDLE', 
    stateTimer: 0,
    rotation: 0,
    targetY: 0,

    draw: function() {
        if (!this.active || (gameState !== 'PLAYING' && gameState !== 'BOSS_INTRO' && gameState !== 'BOSS_OUTRO')) return;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        if (gameState === 'BOSS_OUTRO') {
            this.rotation += 0.05;
            ctx.rotate(this.rotation);
        } else {
            ctx.rotate(this.rotation);
        }

        ctx.drawImage(fishBossImg, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    },
    
    update: function() {
        if (gameMode !== 'CAMPAIGN' || currentLevel !== 6) return;

        if (gameState === 'BOSS_OUTRO') {
            this.y += 6;
            this.x += 1;
            return;
        }

        if (gameState !== 'PLAYING' && gameState !== 'BOSS_INTRO') return;

        if (gameState === 'BOSS_INTRO') {
            this.active = true;
            this.x = canvas.width - this.width + 20; 
            this.y = canvas.height / 2 - this.height / 2 + Math.sin(frames * 0.04) * 80;
            return;
        }

        if (distanceTraveled < currentLevelLength) {
            this.active = true;

            if (this.state === 'IDLE') {
                this.x = canvas.width - this.width + 20; 
                this.y = canvas.height / 2 - this.height / 2 + Math.sin(frames * 0.04) * 80;
                this.rotation = 0;
                this.shootTimer++;

                if (this.shootTimer > 90) {
                    this.shootTimer = 0;
                    this.attackCount++;

                    let isNextJelly = (this.attackCount % 3 === 0);

                    if (Math.random() < 0.25 && this.attackCount > 2 && !isNextJelly) {
                        this.state = 'SPINNING';
                        this.stateTimer = 0;
                        this.targetY = bird.y - this.height / 2;
                    } else if (isNextJelly) {
                        this.state = 'PREPARE_JELLY'; // Preklopimo na tell/telegrafiranje napada
                        this.stateTimer = 0;
                    } else {
                        this.shootWater();
                    }
                }
            } else if (this.state === 'PREPARE_JELLY') {
                this.stateTimer++;
                this.rotation = -0.5; // Riba se nagne močno navzgor
                this.y = canvas.height / 2 - this.height / 2 + Math.sin(frames * 0.04) * 80; 
                
                // Počaka pol sekunde v tej pozi in nato izstreli
                if (this.stateTimer > 35) { 
                    this.shootJelly();
                    this.state = 'IDLE';
                    this.rotation = 0;
                }
            } else if (this.state === 'SPINNING') {
                this.stateTimer++;
                this.rotation -= 0.15; 
                
                if (this.y < this.targetY) this.y += 2;
                if (this.y > this.targetY) this.y -= 2;

                if (this.stateTimer > 45) {
                    this.state = 'DASHING';
                    this.rotation = 0; 
                }
            } else if (this.state === 'DASHING') {
                this.x -= 10;
                if (this.x < -this.width) {
                    this.state = 'RETURNING';
                    this.x = canvas.width + 50;
                }
            } else if (this.state === 'RETURNING') {
                this.x -= 2;
                this.y = canvas.height / 2 - this.height / 2 + Math.sin(frames * 0.04) * 80;
                if (this.x <= canvas.width - this.width + 20) {
                    this.x = canvas.width - this.width + 20;
                    this.state = 'IDLE';
                }
            }

            if (this.state === 'DASHING') {
                const bh = bird.getHitbox();
                let paddingX = 35; 
                let paddingY = 20;
                
                if (bh.x < this.x + this.width - paddingX && bh.x + bh.w > this.x + paddingX &&
                    bh.y < this.y + this.height - paddingY && bh.h + bh.y > this.y + paddingY) {
                    gameOver();
                }
            }

        } else {
            this.active = false;
        }
    },
    
    shootWater: function() {
        let spawnX = this.x + 10; 
        let spawnY = this.y + this.height / 2;

        let dx = bird.x - spawnX;
        let dy = bird.y - spawnY;
        let angle = Math.atan2(dy, dx);
        let speed = 4.5;

        boss2Projectiles.items.push({
            x: spawnX,
            y: spawnY,
            vx: Math.cos(angle) * (speed + 1),
            vy: Math.sin(angle) * (speed + 1),
            type: 'water',
            width: 32,
            height: 32,
            gravity: 0
        });
    },

    shootJelly: function() {
        let spawnX = this.x + 10;
        let spawnY = this.y + this.height / 2;

        // Meduze izstreljene z različnimi "vy" ustvarijo razdaljo in se po loku gibljejo navzdol
        let trajectories = [
            { vx: -4, vy: -3 },   // leti najdlje (nizek lok)
            { vx: -4.5, vy: -6.5 }, // vmesna višina
            { vx: -5, vy: -10 }   // leti zelo visoko in pade nazaj
        ];

        for (let t of trajectories) {
            boss2Projectiles.items.push({
                x: spawnX,
                y: spawnY,
                vx: t.vx,
                vy: t.vy,
                type: 'jellyfish',
                width: 32,
                height: 32,
                gravity: 0.15 
            });
        }
    },
    
    reset: function() {
        this.active = false;
        this.shootTimer = 0;
        this.attackCount = 0;
        this.state = 'IDLE';
        this.stateTimer = 0;
        this.rotation = 0;
    }
};

const boss2Projectiles = {
    items: [],
    draw: function() {
        for(let p of this.items) {
            let img = p.type === 'water' ? waterImg : jellyfishImg;
            ctx.drawImage(img, p.x, p.y, p.width, p.height);
        }
    },
    update: function() {
        if (gameState === 'BOSS_OUTRO') {
            for(let p of this.items) p.x -= gameSpeed;
            return;
        }
        if (gameState !== 'PLAYING') return;

        for(let i = 0; i < this.items.length; i++) {
            let p = this.items[i];
            p.x += p.vx;
            p.y += p.vy;

            if(p.type === 'jellyfish') {
                // Gravitacija povzroči gladko padanje, kar ustvari arc / lok
                p.vy += p.gravity;
            }

            p.x -= gameSpeed * 0.5;

            const bh = bird.getHitbox();
            
            const hitBoxPadding = 12; 
            if (bh.x < p.x + p.width - hitBoxPadding && bh.x + bh.w > p.x + hitBoxPadding &&
                bh.y < p.y + p.height - hitBoxPadding && bh.h + bh.y > p.y + hitBoxPadding) {
                gameOver();
            }

            if (p.x + p.width < 0 || p.x > canvas.width + 50 || p.y > canvas.height + 50 || p.y < -50) {
                this.items.splice(i, 1);
                i--;
            }
        }
    },
    reset: function() { this.items = []; }
};


// KOVANCI
const coins = {
    items: [],
    size: 30, 
    
    draw: function() {
        for (let i = 0; i < this.items.length; i++) {
            let c = this.items[i];
            if (!c.collected) {
                let actualY = c.baseY;
                
                if (gameMode === 'CAMPAIGN' && currentLevel === 2 && !c.isBossCoin) {
                    actualY += Math.sin(frames * 0.05 + c.pipeBobPhase) * 45;
                } else if (c.isBiting && !c.isBossCoin) {
                    actualY += Math.sin(frames * c.moveSpeed + c.movePhase) * 35;
                    actualY += Math.sin(frames * 0.1 + c.coinBobPhase) * 4;
                } else {
                    actualY += Math.sin(frames * 0.1 + c.coinBobPhase) * 8;
                }

                ctx.drawImage(coinImg, c.x, actualY, this.size, this.size);
            }
        }
    },
    update: function() {
        if (gameState === 'BOSS_OUTRO') {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].x -= gameSpeed;
            }
            return;
        }

        if (gameState !== 'PLAYING') return;

        if (gameMode === 'CAMPAIGN' && (currentLevel === 3 || currentLevel === 6)) {
            if (coinsSpawned < 3) {
                let spawnOffset = canvas.width - bird.x; 
                let triggerDistances = [
                    (currentLevelLength * 0.25) - spawnOffset,
                    (currentLevelLength * 0.50) - spawnOffset,
                    (currentLevelLength * 0.75) - spawnOffset
                ];

                if (distanceTraveled >= triggerDistances[coinsSpawned]) {
                    let hitGroundY = getHitGroundY();
                    this.items.push({
                        x: canvas.width + 50, 
                        baseY: Math.random() * (hitGroundY - 150) + 50,
                        coinBobPhase: Math.random() * Math.PI * 2, 
                        collected: false,
                        isBossCoin: true,
                        id: coinsSpawned 
                    });
                    coinsSpawned++;
                }
            }
        }

        for (let i = 0; i < this.items.length; i++) {
            let c = this.items[i];
            c.x -= gameSpeed;

            if (!c.collected) {
                const bh = bird.getHitbox();
                let actualY = c.baseY;
                
                if (gameMode === 'CAMPAIGN' && currentLevel === 2 && !c.isBossCoin) {
                    actualY += Math.sin(frames * 0.05 + c.pipeBobPhase) * 45;
                } else if (c.isBiting && !c.isBossCoin) {
                    actualY += Math.sin(frames * c.moveSpeed + c.movePhase) * 35;
                    actualY += Math.sin(frames * 0.1 + c.coinBobPhase) * 4;
                } else {
                    actualY += Math.sin(frames * 0.1 + c.coinBobPhase) * 8;
                }
                
                if (bh.x < c.x + this.size &&
                    bh.x + bh.w > c.x &&
                    bh.y < actualY + this.size &&
                    bh.h + bh.y > actualY) {
                    
                    c.collected = true;
                    coinsCollectedCurrent[c.id] = true;
                    
                    document.getElementById(`uiCoin${c.id}`).classList.add('collected');
                    
                    scoreSound.currentTime = 0;
                    scoreSound.play().catch(e => {});
                }
            }

            if (c.x + this.size <= 0) {
                this.items.shift();
                i--;
            }
        }
    },
    reset: function() {
        this.items = [];
    }
}

// Cevi
const pipes = {
    items: [],
    width: 52,
    gap: 120, 
    
    draw: function() {
        let drawImgTop = pipeImg;
        let drawImgBottom = pipeImg;

        if (gameMode === 'CAMPAIGN') {
            if (currentLevel >= 4 && currentLevel <= 6) {
                drawImgTop = (pipe2Img.complete && pipe2Img.naturalWidth !== 0) ? pipe2Img : pipeImg; 
                drawImgBottom = (pipe2Img.complete && pipe2Img.naturalWidth !== 0) ? pipe2Img : pipeImg;
            } else if (currentLevel >= 7) {
                drawImgTop = (pipe3Img.complete && pipe3Img.naturalWidth !== 0) ? pipe3Img : pipeImg; 
                drawImgBottom = (pipe3Img.complete && pipe3Img.naturalWidth !== 0) ? pipe3Img : pipeImg;
            }
        }

        let topPipeHeight = drawImgTop.naturalWidth > 0 ? drawImgTop.naturalHeight * (this.width / drawImgTop.naturalWidth) : 320;
        let bottomPipeHeight = drawImgBottom.naturalWidth > 0 ? drawImgBottom.naturalHeight * (this.width / drawImgBottom.naturalWidth) : 320;

        for (let i = 0; i < this.items.length; i++) {
            let p = this.items[i];
            
            let currentY = p.baseY;
            if (gameMode === 'CAMPAIGN' && currentLevel === 2) {
                currentY += Math.sin(frames * 0.05 + p.bobPhase) * 45;
            }

            let topPipeY = currentY;
            let bottomPipeY = currentY + this.gap;

            if (p.isBiting) {
                let gapMod = Math.sin(frames * p.biteSpeed + p.bitePhase) * 20; 
                let shiftMod = Math.sin(frames * p.moveSpeed + p.movePhase) * 35;
                
                topPipeY = currentY + shiftMod - gapMod;
                bottomPipeY = currentY + this.gap + shiftMod + gapMod;
            }

            if (!p.type || p.type === 'normal' || p.type === 'top_only') {
                ctx.save();
                ctx.translate(p.x, topPipeY); 
                ctx.scale(1, -1); 
                ctx.drawImage(drawImgTop, 0, 0, this.width, topPipeHeight);
                ctx.restore();
            }

            if (!p.type || p.type === 'normal' || p.type === 'bottom_only') {
                ctx.drawImage(drawImgBottom, p.x, bottomPipeY, this.width, bottomPipeHeight);
            }

            // Draw Flame Mechanic for Level 7 Half-Pipes
            if (p.hasFlame) {
                let fx = p.x + 5;
                let fw = this.width - 10;
                let fy, fh;

                if (p.type === 'top_only') {
                    fy = topPipeY; 
                    fh = getHitGroundY() - 140 - topPipeY; // Guarantees 140px safe zone
                } else if (p.type === 'bottom_only') {
                    fy = 140; 
                    fh = bottomPipeY - 140;
                }

                if (p.flameState === 'warning') {
                    let alpha = (Math.floor(frames / 10) % 2 === 0) ? 0.6 : 0.2;
                    ctx.fillStyle = `rgba(255, 50, 0, ${alpha})`;
                    ctx.fillRect(fx, fy, fw, fh);
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha + 0.3})`;
                    ctx.textAlign = 'center';
                    ctx.font = '20px "Press Start 2P"';
                    ctx.fillText('!', fx + fw/2, fy + fh/2 + 10);
                    ctx.textAlign = 'start';
                } else if (p.flameState === 'firing') {
                    if (flameImg.complete && flameImg.naturalWidth > 0) {
                        ctx.drawImage(flameImg, fx, fy, fw, fh);
                    } else {
                        ctx.fillStyle = 'rgba(255, 50, 0, 0.9)';
                        ctx.fillRect(fx, fy, fw, fh);
                    }
                }
            }
        }
    },
    update: function() {
        if (gameState === 'BOSS_OUTRO') {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].x -= gameSpeed;
            }
            return;
        }

        if (gameState !== 'PLAYING') return; 

        if (gameMode === 'CAMPAIGN' && (currentLevel === 3 || currentLevel === 6)) return;

        let stopSpawning = false;
        if (gameMode === 'CAMPAIGN' && distanceTraveled > currentLevelLength - 300) {
            stopSpawning = true;
        }

        let spawnThreshold = (gameMode === 'CAMPAIGN' && currentLevel >= 7) ? 350 : 220; 
        pipeSpawnTimer += gameSpeed; 
        
        if (pipeSpawnTimer >= spawnThreshold && !stopSpawning) {
            pipeSpawnTimer = 0; 
            
            let hitGroundY = getHitGroundY(); 
            let minPipeHeight = 50; 
            
            let amplitude = (gameMode === 'CAMPAIGN' && currentLevel === 2) ? 45 : 0;
            let isBiting = (gameMode === 'CAMPAIGN' && currentLevel === 5);
            let bitePadding = isBiting ? 55 : 0; 

            let minY = minPipeHeight + amplitude + bitePadding;
            let maxY = hitGroundY - this.gap - minPipeHeight - amplitude - bitePadding; 
            
            let randomY = Math.random() * (maxY - minY) + minY;
            let pBobPhase = Math.random() * Math.PI * 2; 

            let biteSpeed = isBiting ? (Math.random() * 0.03 + 0.02) : 0;
            let bitePhase = isBiting ? (Math.random() * Math.PI * 2) : 0;
            let moveSpeed = isBiting ? (Math.random() * 0.02 + 0.015) : 0;
            let movePhase = isBiting ? (Math.random() * Math.PI * 2) : 0;

            let pipeType = 'normal';
            let hasFlame = false;
            
            if (gameMode === 'CAMPAIGN' && currentLevel >= 7) {
                let r = Math.random();
                if (r < 0.3) {
                    pipeType = 'top_only';
                    hasFlame = true;
                } else if (r < 0.6) {
                    pipeType = 'bottom_only';
                    hasFlame = true;
                }
            }
            
            this.items.push({
                x: canvas.width,
                baseY: randomY, 
                bobPhase: pBobPhase,
                passed: false,
                isBiting: isBiting,
                biteSpeed: biteSpeed,
                bitePhase: bitePhase,
                moveSpeed: moveSpeed,
                movePhase: movePhase,
                type: pipeType,
                hasFlame: hasFlame,
                flameState: 'idle',
                flameTimer: 0
            });

            if (gameMode === 'CAMPAIGN' && currentLevel === 4) {
                if (Math.random() > 0.3) { 
                    let numBubbles = Math.floor(Math.random() * 3) + 1; 
                    for(let j = 0; j < numBubbles; j++) {
                        currents.items.push({
                            x: canvas.width + 80 + Math.random() * 60, 
                            y: canvas.height + 20 + Math.random() * 80, 
                            radius: 12 + Math.random() * 12,
                            speedY: -(1 + Math.random() * 1.5), 
                            wobblePhase: Math.random() * Math.PI * 2,
                            popped: false,
                            popFrames: 0
                        });
                    }
                }
            }

            if (gameMode === 'CAMPAIGN' && coinsSpawned < 3) {
                let spawnOffset = canvas.width - bird.x; 

                let triggerDistances = [
                    (currentLevelLength * 0.25) - spawnOffset,
                    (currentLevelLength * 0.50) - spawnOffset,
                    (currentLevelLength * 0.75) - spawnOffset
                ];

                if (distanceTraveled >= triggerDistances[coinsSpawned]) {
                    coins.items.push({
                        x: canvas.width + this.width / 2 - coins.size / 2, 
                        baseY: randomY + this.gap / 2 - coins.size / 2, 
                        pipeBobPhase: pBobPhase, 
                        coinBobPhase: Math.random() * Math.PI * 2, 
                        collected: false,
                        isBossCoin: false,
                        id: coinsSpawned,
                        isBiting: isBiting,
                        moveSpeed: moveSpeed,
                        movePhase: movePhase
                    });
                    coinsSpawned++;
                }
            }
        }

        for (let i = 0; i < this.items.length; i++) {
            let p = this.items[i];
            p.x -= gameSpeed; 

            let currentY = p.baseY;
            if (gameMode === 'CAMPAIGN' && currentLevel === 2) {
                currentY += Math.sin(frames * 0.05 + p.bobPhase) * 45;
            }

            let topPipeY = currentY;
            let bottomPipeY = currentY + this.gap;

            if (p.isBiting) {
                let gapMod = Math.sin(frames * p.biteSpeed + p.bitePhase) * 20;
                let shiftMod = Math.sin(frames * p.moveSpeed + p.movePhase) * 35;
                
                topPipeY = currentY + shiftMod - gapMod;
                bottomPipeY = currentY + this.gap + shiftMod + gapMod;
            }

            const bh = bird.getHitbox(); 

            if (bh.x + bh.w > p.x && bh.x < p.x + this.width) {
                if (p.type === 'normal' && (bh.y < topPipeY || bh.y + bh.h > bottomPipeY)) {
                    gameOver();
                } else if (p.type === 'top_only' && bh.y < topPipeY) {
                    gameOver();
                } else if (p.type === 'bottom_only' && bh.y + bh.h > bottomPipeY) {
                    gameOver();
                }
            }

            if (p.hasFlame) {
                p.flameTimer++;
                if (p.flameState === 'idle' && p.flameTimer > 45) {
                    p.flameState = 'warning'; p.flameTimer = 0;
                } else if (p.flameState === 'warning' && p.flameTimer > 60) {
                    p.flameState = 'firing'; p.flameTimer = 0;
                } else if (p.flameState === 'firing' && p.flameTimer > 90) {
                    p.flameState = 'cooldown'; p.flameTimer = 0;
                } else if (p.flameState === 'cooldown' && p.flameTimer > 45) {
                    p.flameState = 'idle'; p.flameTimer = 0;
                }

                if (p.flameState === 'firing') {
                    let fx = p.x + 10;
                    let fw = this.width - 20;
                    let fy, fh;
                    if (p.type === 'top_only') {
                        fy = topPipeY; 
                        fh = getHitGroundY() - 140 - topPipeY;
                    } else if (p.type === 'bottom_only') {
                        fy = 140;
                        fh = bottomPipeY - 140;
                    }
                    if (bh.x < fx + fw && bh.x + bh.w > fx &&
                        bh.y < fy + fh && bh.y + bh.h > fy) {
                        gameOver();
                    }
                }
            }

            if (p.x + this.width < bird.x && !p.passed) {
                score++;
                p.passed = true; 
                if (gameMode === 'ENDLESS') {
                    scoreSound.currentTime = 0;
                    scoreSound.play().catch(e => {});
                }
            }

            if (p.x + this.width <= 0) {
                this.items.shift();
                i--;
            }
        }
    },
    reset: function() {
        this.items = [];
    }
};

function levelComplete() {
    if (gameState === 'GAMEOVER' || gameState === 'VICTORY' || gameState === 'BOSS_OUTRO') return; 

    for (let i = 0; i < 3; i++) {
        if (coinsCollectedCurrent[i]) {
            campaignProgress[currentLevel].coins[i] = true;
        }
        
        const vCoin = document.getElementById(`victoryCoin${i}`);
        if (coinsCollectedCurrent[i]) vCoin.classList.add('collected');
        else vCoin.classList.remove('collected');
    }
    
    if (currentLevel < 9) {
        campaignProgress[currentLevel + 1].unlocked = true;
        nextLevelBtn.style.display = 'block';
    } else {
        nextLevelBtn.style.display = 'none'; 
    }
    
    storage.set('campaignProgress', JSON.stringify(campaignProgress));
    
    surfaceMusic.pause();
    surfaceMusic.currentTime = 0;
    boss1Music.pause();
    boss1Music.currentTime = 0;
    boss2Music.pause();
    boss2Music.currentTime = 0;
    underwaterMusic.pause();
    underwaterMusic.currentTime = 0;
    lavaMusic.pause();
    lavaMusic.currentTime = 0;

    if (gameMode === 'CAMPAIGN' && (currentLevel === 3 || currentLevel === 6)) {
        gameState = 'BOSS_OUTRO';
        bossOutroUI.style.display = 'flex';
        
        hitSound.currentTime = 0;
        hitSound.play().catch(e => {});
        
        setTimeout(() => {
            bossOutroUI.style.display = 'none';
            triggerVictoryFade();
        }, 3500); 
    } else {
        gameState = 'VICTORY';
        setTimeout(() => {
            triggerVictoryFade();
        }, 1000); 
    }
}

function triggerVictoryFade() {
    gameState = 'VICTORY';
    let fadeInterval = setInterval(() => {
        blackFadeAlpha += 0.05;
        
        if (blackFadeAlpha >= 1) {
            clearInterval(fadeInterval);
            
            bird.reset();
            pipes.reset();
            coins.reset();
            boss.reset();
            bullets.reset();
            boss2.reset();
            boss2Projectiles.reset();
            currents.reset();
            horizontalBubbles.reset();
            ambientBubbles.reset();
            seaweed.reset();
            fireballs.reset();
            
            campaignUI.style.display = 'none';
            
            menuBackground.className = 'retro-bg';
            menuBackground.style.backgroundColor = '#b08d13'; 
            menuBackground.style.display = 'block'; 
            
            levelCompleteMenu.style.transition = 'none';
            levelCompleteMenu.style.opacity = '0';
            levelCompleteMenu.style.display = 'flex';
            
            updateCampaignUI(); 
            
            victorySound.currentTime = 0;
            victorySound.play().catch(e => {});
            
            requestAnimationFrame(() => {
                levelCompleteMenu.style.transition = 'opacity 0.8s ease-in-out';
                levelCompleteMenu.style.opacity = '1';
                blackFadeAlpha = 0; 
            });
        }
    }, 30);
}

function gameOver() {
    if (gameState === 'GAMEOVER' || gameState === 'VICTORY') return; 
    gameState = 'GAMEOVER';

    hitSound.play().catch(e => {});
    
    flashAlpha = 1; 
    
    if(currentFadeInterval) clearInterval(currentFadeInterval);
    endlessMusic.pause();
    endlessMusic.currentTime = 0;
    surfaceMusic.pause();
    surfaceMusic.currentTime = 0;
    boss1Music.pause();
    boss1Music.currentTime = 0;
    boss2Music.pause();
    boss2Music.currentTime = 0;
    underwaterMusic.pause();
    underwaterMusic.currentTime = 0;
    lavaMusic.pause();
    lavaMusic.currentTime = 0;
    
    if (gameMode === 'ENDLESS') {
        if (score > bestScore) {
            bestScore = score;
            storage.set('bestScore', bestScore); 
            bestScoreDisplay.innerText = bestScore;
        }
        lastScore.innerText = score;
        currentScoreContainer.style.display = 'block'; 
    }
    
    setTimeout(() => {
        let fadeInterval = setInterval(() => {
            blackFadeAlpha += 0.05;
            
            if (blackFadeAlpha >= 1) {
                clearInterval(fadeInterval);
                
                bird.reset();
                pipes.reset();
                coins.reset();
                boss.reset();
                bullets.reset();
                boss2.reset();
                boss2Projectiles.reset();
                currents.reset();
                horizontalBubbles.reset();
                ambientBubbles.reset();
                seaweed.reset();
                fireballs.reset();
                gameState = 'MENU';
                
                campaignUI.style.display = 'none';
                menuBackground.style.display = 'none'; 
                
                let targetMenu = mainMenu;
                
                if(gameMode === 'CAMPAIGN') {
                    targetMenu = campaignGameOverMenu;
                    menuBackground.style.display = 'block'; 
                    let progressPercent = Math.min((distanceTraveled / currentLevelLength) * 100, 100).toFixed(0);
                    campaignProgressText.innerText = `${progressPercent}%`;
                }

                targetMenu.style.transition = 'none';
                targetMenu.style.opacity = '0';
                targetMenu.style.display = 'flex';
                
                if (gameMode === 'CAMPAIGN') {
                    gameOverSound.currentTime = 0;
                    gameOverSound.play().catch(e => {});
                }
                
                requestAnimationFrame(() => {
                    targetMenu.style.transition = 'opacity 0.8s ease-in-out';
                    targetMenu.style.opacity = '1';
                    blackFadeAlpha = 0; 
                });
                
                if (gameMode === 'ENDLESS') {
                    crossfadeMusic(null, bgMusic);
                }
            }
        }, 30);
    }, 1200);
}

function resetGame(mode, level = 0) {
    gameMode = mode;
    currentLevel = level;
    
    bird.reset();
    pipes.reset();
    coins.reset();
    boss.reset();
    bullets.reset();
    boss2.reset();
    boss2Projectiles.reset();
    currents.reset();
    horizontalBubbles.reset();
    ambientBubbles.reset();
    seaweed.reset();
    fireballs.reset();
    
    score = 0;
    frames = 0;
    distanceTraveled = 0;
    
    if (gameMode === 'CAMPAIGN') {
        gameSpeed = 2.5; 
        coinsSpawned = 0;
        coinsCollectedCurrent = [false, false, false];
        
        document.getElementById('progressFill').style.width = '0%';
        for(let i=0; i<3; i++) {
            document.getElementById(`uiCoin${i}`).classList.remove('collected');
        }
    } else {
        gameSpeed = 2; 
    }
    
    pipeSpawnTimer = 0;
    flashAlpha = 0;
    blackFadeAlpha = 0; 
    gameState = 'READY'; 
    
    const menus = [menuBackground, mainMenu, settingsMenu, scoreMenu, campaignMenu, campaignGameOverMenu, levelCompleteMenu, bossIntroUI, bossOutroUI];
    menus.forEach(menu => {
        if(menu) {
            menu.style.transition = 'opacity 0.4s ease';
            menu.style.opacity = '0';
        }
    });

    setTimeout(() => {
        menus.forEach(menu => {
            if(menu) {
                menu.style.display = 'none';
                menu.style.opacity = '1'; 
                menu.style.transition = 'none';
            }
        });
        
        if (gameMode === 'CAMPAIGN') {
            campaignUI.style.display = 'flex';
            if (currentLevel === 3 || currentLevel === 6) {
                
                bossIntroLevelText.innerText = `LEVEL ${currentLevel}`;
                if(currentLevel === 3) {
                    bossIntroTitleText.innerText = 'THE FEATHERED FRIEND';
                    crossfadeMusic(bgMusic, boss1Music);
                } else if(currentLevel === 6) {
                    bossIntroTitleText.innerText = 'THE AQUA PREDATOR';
                    crossfadeMusic(bgMusic, boss2Music);
                }

                gameState = 'BOSS_INTRO';
                bossIntroUI.style.display = 'flex';
                
                setTimeout(() => {
                    bossIntroUI.style.display = 'none';
                    gameState = 'PLAYING';
                }, 3500); 

            } else if (currentLevel >= 4 && currentLevel <= 5) {
                crossfadeMusic(bgMusic, underwaterMusic);
                gameState = 'PLAYING';
            } else if (currentLevel >= 7) {
                crossfadeMusic(bgMusic, lavaMusic);
                gameState = 'PLAYING';
            } else {
                crossfadeMusic(bgMusic, surfaceMusic);
                gameState = 'PLAYING';
            }
        } else {
            crossfadeMusic(bgMusic, endlessMusic);
            gameState = 'PLAYING';
        }
        
    }, 400); 
}

const fps = 60;
const fpsInterval = 1000 / fps;
let then = performance.now();

function draw(now) {
    requestAnimationFrame(draw);

    let elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // --- LAYER 1: Background ---
        backgroundLayer.update();
        backgroundLayer.draw();

        // --- LAYER 2: Deep Water Atmosphere ---
        underwaterEffects.drawTint();
        underwaterEffects.drawGodRays();
        ambientBubbles.update();
        ambientBubbles.draw();

        // --- LAYER 3: Gameplay Entities ---
        currents.update();
        currents.draw();

        horizontalBubbles.update();
        horizontalBubbles.draw();

        pipes.update();
        pipes.draw();
        
        boss.update();
        boss.draw();
        bullets.update();
        bullets.draw();

        boss2.update();
        boss2.draw();
        boss2Projectiles.update();
        boss2Projectiles.draw();
        
        fireballs.update();
        fireballs.draw();

        coins.update();
        coins.draw();

        floorLayer.update();
        floorLayer.draw();

        bird.update();
        bird.draw();

        // --- LAYER 4: Parallax Foreground ---
        seaweed.update();
        seaweed.draw();

        if (gameState === 'PLAYING' || gameState === 'GAMEOVER' || gameState === 'VICTORY' || gameState === 'READY' || gameState === 'BOSS_INTRO' || gameState === 'BOSS_OUTRO') {
            if (gameState === 'PLAYING' || gameState === 'BOSS_INTRO' || gameState === 'BOSS_OUTRO') {
                frames++;
            }
            if (gameState === 'PLAYING') {
                distanceTraveled += gameSpeed; 
                
                if (gameMode === 'ENDLESS' && gameSpeed < maxGameSpeed) {
                    gameSpeed += 0.0002; 
                }

                if (gameMode === 'CAMPAIGN') {
                    let progressPercent = Math.min((distanceTraveled / currentLevelLength) * 100, 100).toFixed(2);
                    
                    // APPLY PROGRESS TO UI
                    document.getElementById('progressFill').style.width = progressPercent + '%';

                    if (distanceTraveled >= currentLevelLength) {
                        levelComplete();
                    }
                }
            }

            if (gameMode === 'ENDLESS') {
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 4;
                ctx.font = '30px "Press Start 2P"'; 
                ctx.textAlign = 'center'; 
                ctx.strokeText(score, canvas.width / 2, 70);
                ctx.fillText(score, canvas.width / 2, 70);
                ctx.textAlign = 'start'; 
            }
        }

        if (flashAlpha > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            flashAlpha -= 0.05; 
        }

        if (blackFadeAlpha > 0) {
            let fadeColor = gameState === 'VICTORY' ? '255, 255, 255' : '0, 0, 0';
            ctx.fillStyle = `rgba(${fadeColor}, ${blackFadeAlpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
}

canvas.addEventListener('mousedown', () => {
    bird.flap();
});
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') bird.flap();
});

startBtn.addEventListener('click', () => resetGame('ENDLESS'));

for (let i = 1; i <= 3; i++) {
    document.getElementById(`lvlBtn${i}`).addEventListener('click', () => {
        let levelToLaunch = currentCampaignPage * 3 + i;
        resetGame('CAMPAIGN', levelToLaunch);
    });
}

let assetsLoaded = 0;
const imagesToLoad = [
    birdImg, pipeImg, pipe2Img, pipe3Img, floorImg, floor2Img, floor3Img,
    backgroundImg, coinImg, lvl1BgImg, lvl2BgImg, lvl3BgImg, lvl4BgImg, lvl5BgImg, lvl6BgImg, lvl7BgImg,
    birdBossImg, fishBossImg, waterImg, jellyfishImg, bulletImg, seaweedImg, flameImg 
];
const totalAssets = imagesToLoad.length; 

function checkAssets() {
    assetsLoaded++;
    if (assetsLoaded === totalAssets) {
        requestAnimationFrame(function(time) {
            then = time;
            draw(time);
        });
    }
}

imagesToLoad.forEach(img => {
    if (img.complete && img.naturalWidth !== 0) {
        checkAssets();
    } else {
        img.onload = checkAssets;
        img.onerror = () => {
            console.error("Napaka pri nalaganju slike: ", img.src);
            checkAssets(); 
        };
    }
});