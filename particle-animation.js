// 5-Stage Organic Animation System - Sophisticated and Soulful
const ANIMATION_STATES = {
    CONVERGING: 'converging',      // Stage 1: Particle Convergence to X
    X_BREATHING: 'breathing',      // Stage 2: Particle Breathing
    ACTIVATION: 'activation',      // Stage 3: Particle Activation
    MORPHING: 'morphing',         // Stage 4: Particle Transformation
    DISSIPATING: 'dissipating'    // Stage 5: Particle Dissipation
};

// Stage Durations for Organic Flow - FASTER AND SMOOTHER
const STAGE_DURATIONS = {
    CONVERGING: 2000,    // 2 seconds for convergence
    X_BREATHING: 1500,   // 1.5 seconds of breathing
    ACTIVATION: 1000,    // 1 second of activation
    MORPHING: 2000,      // 2 seconds for transformation
    DISSIPATING: 2500    // 2.5 seconds for more elegant dissipation
};

// Advanced Organic Easing Functions - The Soul of Animation
const organicEasing = {
    // Ultra-smooth transition - Seven-degree Hermite interpolation
    ultraSmooth: (t) => {
        return t * t * t * (t * (t * 6 - 15) + 10);
    },

    // Liquid flow - Simulates mercury or water flow
    liquidFlow: (t) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5
            ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },

    // Organic bounce - Natural elastic movement
    organicBounce: (t) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c4 = (2 * Math.PI) / 3;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },

    // Breathing curve - Natural in-out rhythm
    breathingCurve: (t) => {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    },

    // Spiral convergence - Organic inward flow (enhanced for smoother convergence)
    spiralFlow: (t) => {
        // Use a more gradual cubic ease-in-out as base
        const baseEase = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        // Gentler spiral with reduced amplitude for smoother convergence
        const spiral = Math.sin(t * Math.PI * 2) * (1 - t * t) * 0.15;
        return Math.min(1, baseEase + spiral);
    },

    // Energy pulse - For activation phase
    energyPulse: (t) => {
        const baseEase = t * t * t * (t * (t * 6 - 15) + 10); // ultraSmooth inline
        const pulse = Math.sin(t * Math.PI * 8) * Math.exp(-t * 3) * 0.3;
        return baseEase + pulse;
    },

    // Morphing flow - Smooth transformation
    morphingFlow: (t) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        const baseEase = t < 0.5
            ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
        const flow = Math.sin(t * Math.PI * 2) * (1 - t) * 0.1;
        return baseEase + flow;
    },

    // Dissipation fade - Natural fade away
    dissipationFade: (t) => {
        return 1 - Math.pow(t, 3) * (1 + Math.sin(t * Math.PI * 4) * 0.1);
    },

    // Advanced Physics-Based Easing Functions - Based on 2024 research
    
    // Spring animation with damping - More natural than traditional elastic
    springDamped: (t, tension = 0.7, friction = 0.8) => {
        const dampingRatio = friction / (2 * Math.sqrt(tension));
        if (dampingRatio < 1) {
            const dampedFreq = Math.sqrt(1 - dampingRatio * dampingRatio);
            return 1 - Math.exp(-dampingRatio * t) * Math.cos(dampedFreq * t);
        }
        return 1 - Math.exp(-dampingRatio * t);
    },

    // Momentum-based easing - Simulates realistic physics
    momentumEasing: (t, velocity = 1.2, drag = 0.05) => {
        const momentum = velocity * (1 - Math.exp(-drag * t));
        return Math.min(1, momentum);
    },

    // Anticipation easing - Pulls back before moving forward
    anticipationEasing: (t, anticipationStrength = 0.15) => {
        if (t < 0.2) {
            // Anticipation phase: pull back
            const anticipationT = t / 0.2;
            return -anticipationStrength * Math.sin(anticipationT * Math.PI);
        } else {
            // Main movement with overshoot
            const mainT = (t - 0.2) / 0.8;
            const overshoot = 1 + anticipationStrength * Math.exp(-mainT * 3) * Math.sin(mainT * Math.PI * 2);
            return Math.min(1, overshoot * organicEasing.ultraSmooth(mainT));
        }
    },

    // Follow-through easing - Continues past target then settles
    followThroughEasing: (t, followStrength = 0.08) => {
        if (t < 0.8) {
            // Main movement
            const mainT = t / 0.8;
            return organicEasing.ultraSmooth(mainT);
        } else {
            // Follow-through phase
            const followT = (t - 0.8) / 0.2;
            const overshoot = 1 + followStrength * Math.sin(followT * Math.PI) * Math.exp(-followT * 2);
            return Math.min(1, overshoot);
        }
    },

    // Ultra-smooth Bézier with multiple control points - 2024 standard
    ultraBezier: (t, p0 = 0, p1 = 0.25, p2 = 0.75, p3 = 1) => {
        const invT = 1 - t;
        const t2 = t * t;
        const t3 = t2 * t;
        const invT2 = invT * invT;
        const invT3 = invT2 * invT;
        
        return invT3 * p0 + 3 * invT2 * t * p1 + 3 * invT * t2 * p2 + t3 * p3;
    },

    // Compound easing - Combines multiple easing functions for ultra-smooth results
    compoundSmooth: (t, ...easings) => {
        if (easings.length === 0) return organicEasing.ultraSmooth(t);
        
        const weight = 1 / easings.length;
        return easings.reduce((acc, easing) => {
            return acc + easing(t) * weight;
        }, 0);
    },

    // Staggered timing function - Better distribution for particle groups
    staggeredTiming: (t, particleIndex, totalParticles, staggerAmount = 0.3) => {
        const staggerDelay = (particleIndex / totalParticles) * staggerAmount;
        const adjustedT = Math.max(0, Math.min(1, (t - staggerDelay) / (1 - staggerAmount)));
        return organicEasing.ultraSmooth(adjustedT);
    }
};

// Enhanced Organic Curve Generation - Creates natural particle paths with variations
function generateOrganicCurve(start, end, progress, curvature = 0.3, seed = 0, variation = 0.1) {
    const t = organicEasing.ultraSmooth(progress);

    // Multiple control points for more complex curves
    const midX = (start.x + end.x) / 2 + Math.sin(seed * Math.PI * 2) * curvature;
    const midY = (start.y + end.y) / 2 + Math.cos(seed * Math.PI * 2) * curvature;
    const midZ = (start.z + end.z) / 2 + Math.sin(seed * Math.PI * 3) * curvature * 0.5;

    // Add variation for unique paths
    const varX = Math.sin(seed * Math.PI * 4.1) * variation;
    const varY = Math.cos(seed * Math.PI * 3.7) * variation;
    const varZ = Math.sin(seed * Math.PI * 5.3) * variation * 0.3;

    // Cubic Bezier curve for more organic movement
    const invT = 1 - t;
    const t2 = t * t;
    const t3 = t2 * t;
    const invT2 = invT * invT;
    const invT3 = invT2 * invT;

    return {
        x: invT3 * start.x + 3 * invT2 * t * (midX + varX) + 3 * invT * t2 * (midX - varX) + t3 * end.x,
        y: invT3 * start.y + 3 * invT2 * t * (midY + varY) + 3 * invT * t2 * (midY - varY) + t3 * end.y,
        z: invT3 * start.z + 3 * invT2 * t * (midZ + varZ) + 3 * invT * t2 * (midZ - varZ) + t3 * end.z
    };
}

// Noise function for organic movement
function perlinNoise(x, y, seed = 0) {
    const hash = (x, y) => {
        let h = seed + x * 374761393 + y * 668265263;
        h = (h ^ (h >>> 13)) * 1274126177;
        return (h ^ (h >>> 16)) / 2147483648.0;
    };
    
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const x1 = x0 + 1, y1 = y0 + 1;
    const sx = x - x0, sy = y - y0;
    
    const n0 = hash(x0, y0);
    const n1 = hash(x1, y0);
    const n2 = hash(x0, y1);
    const n3 = hash(x1, y1);
    
    const a = n0 + sx * (n1 - n0);
    const b = n2 + sx * (n3 - n2);
    
    return a + sy * (b - a);
}

// Fluid dynamics for particle interaction
function calculateFluidForce(particlePos, neighborPos, distance, restDistance = 0.1) {
    if (distance === 0) return { x: 0, y: 0, z: 0 };
    
    const springForce = (distance - restDistance) * 0.001;
    const dampingForce = 0.95;
    
    const dirX = (neighborPos.x - particlePos.x) / distance;
    const dirY = (neighborPos.y - particlePos.y) / distance;
    const dirZ = (neighborPos.z - particlePos.z) / distance;
    
    return {
        x: dirX * springForce * dampingForce,
        y: dirY * springForce * dampingForce,
        z: dirZ * springForce * dampingForce
    };
}

class ParticleAnimation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleCount = 2000; // Further reduce for smoothness
        
        // Position arrays (preserved X shapes)
        this.positions1 = [];
        this.positions2 = [];
        this.spreadPositions = [];
        
        // Enhanced particle properties
        this.particleVelocities = [];
        this.particleSizes = [];
        this.particleOpacities = [];
        this.particlePhases = [];
        this.particleTrails = [];
        
        // Interactive controls
        this.mouse = { x: 0, y: 0, isDown: false };
        this.mouseForce = { x: 0, y: 0, strength: 0 };
        this.attractionMode = false;
        this.interactionRadius = 2.0;
        this.forceStrength = 0.02;
        
        // Physics enhancement
        this.gravity = { x: 0, y: 0, z: 0 };
        this.windForce = { x: 0, y: 0, z: 0 };
        this.turbulence = 0.005;
        
        // Camera controls
        this.cameraTarget = { x: 0, y: 0, z: 5 };
        this.cameraSpeed = 0.05;
        this.zoomLevel = 1.0;
        
        // Audio reactive features
        this.audioContext = null;
        this.analyser = null;
        this.audioData = null;
        this.audioEnabled = false;
        this.bassFrequency = 0;
        this.midFrequency = 0;
        this.trebleFrequency = 0;
        
        // Particle emission system
        this.emissionPoints = [];
        this.maxEmissionParticles = 500;
        this.emissionRate = 5;
        this.emissionEnabled = false;
        
        // Performance optimization
        this.frameCount = 0;
        this.qualityLevel = 'high'; // 'low', 'medium', 'high'
        this.performanceMode = false;
        
        // Color schemes
        this.colorScheme = 'twilight';
        this.colorSchemes = {
            twilight: [[0.2, 0.3, 0.8], [0.4, 0.2, 0.7]],
            neon: [[0.0, 1.0, 1.0], [1.0, 0.0, 1.0]],
            fire: [[1.0, 0.3, 0.0], [1.0, 0.8, 0.0]],
            forest: [[0.0, 0.8, 0.3], [0.2, 0.6, 0.1]],
            ocean: [[0.0, 0.4, 0.8], [0.1, 0.7, 0.9]]
        };
        
        // Organic Animation System - 5 Stages
        this.currentState = ANIMATION_STATES.CONVERGING; // Start with convergence
        this.stateProgress = 0;
        this.globalTime = 0;
        this.phaseStartTime = 0;  // Track when current phase started
        this.isAnimating = false;
        this.loadingComplete = false;
        
        // Current particle positions for smooth transitions
        this.currentPositions = [];  // Track actual current positions

        // Enhanced Individual Particle Personality for Organic Motion
        this.particleDelays = [];      // Individual emergence delays
        this.particleSeeds = [];       // Unique random seeds
        this.particleCurvatures = [];  // Individual curve preferences
        this.particleEnergies = [];    // Individual energy levels
        this.particleLifePhases = [];  // Individual life cycle phases
        this.particleNoiseOffsets = [];// Individual noise offsets for organic motion
        this.particleFluidVelocities = []; // Fluid dynamics velocities
        this.particleNeighbors = [];   // Nearby particles for interaction
        this.particleTemperatures = [];// Individual temperature for heat-based motion
        this.particleMasses = [];      // Individual masses for physics
        this.particleFrictions = [];   // Individual friction coefficients
        this.particleSpringConstants = []; // Individual spring constants
        this.particleOrganicSeeds = []; // Multiple seeds for different organic behaviors
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.loadImages();
        this.setupEventListeners();
        this.animate();
    }
    
    createScene() {
        // 创建场景
        this.scene = new THREE.Scene();
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        document.getElementById('canvasContainer').appendChild(this.renderer.domElement);
        
        // 处理窗口大小调整
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    loadImages() {
        const imageCanvas = document.getElementById('imageCanvas');
        const ctx = imageCanvas.getContext('2d', { willReadFrequently: true });
        
        // 加载第一张图片
        const img1 = new Image();
        img1.onload = () => {
            console.log('Image 1 loaded successfully');
            this.positions1 = this.extractParticlePositions(img1, ctx);
            this.loadSecondImage();
        };
        img1.onerror = (e) => {
            console.error('Failed to load image 1:', e);
            alert('Failed to load first image. Please check if pic1.png exists.');
        };
        img1.src = 'pic1.png';
    }
    
    loadSecondImage() {
        const imageCanvas = document.getElementById('imageCanvas');
        const ctx = imageCanvas.getContext('2d', { willReadFrequently: true });
        
        // 加载第二张图片
        const img2 = new Image();
        img2.onload = () => {
            console.log('Image 2 loaded successfully');
            this.positions2 = this.extractParticlePositions(img2, ctx);
            this.createParticles();
        };
        img2.onerror = (e) => {
            console.error('Failed to load image 2:', e);
            alert('Failed to load second image. Please check if pic2.png exists.');
        };
        img2.src = 'pic2.png';
    }
    
    extractParticlePositions(img, ctx) {
        const canvas = ctx.canvas;
        const size = 512;
        canvas.width = size;
        canvas.height = size;
        
        // 清空画布
        ctx.clearRect(0, 0, size, size);
        
        // 绘制图片
        ctx.drawImage(img, 0, 0, size, size);
        
        // 获取图像数据
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        const positions = [];
        const stride = 3; // 调整采样密度
        
        console.log('Image loaded, size:', img.width, 'x', img.height);
        
        for (let y = 0; y < size; y += stride) {
            for (let x = 0; x < size; x += stride) {
                const index = (y * size + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                
                // 检查是否是白色/灰色区域（X形状和圆环）
                // 更宽松的阈值以捕获更多像素
                if (a > 50 && (r > 50 || g > 50 || b > 50)) {
                    // 将像素坐标转换为3D坐标
                    const x3d = (x / size - 0.5) * 8;
                    const y3d = -(y / size - 0.5) * 8;
                    const z3d = 0;
                    
                    positions.push(x3d, y3d, z3d);
                }
            }
        }
        
        console.log('Extracted positions:', positions.length / 3, 'particles');
        
        // 改进的手动X形状生成 - 避免聚集
        if (positions.length < 300) {
            console.log('Not enough particles detected, creating improved X shape');
            return this.createImprovedXShape();
        }
        
        return positions;
    }
    
    generateSpreadPositions() {
        this.spreadPositions = [];
        for (let i = 0; i < this.particleCount; i++) {
            // Generate random sphere distribution with organic variations
            const radius = 8 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            // Add organic noise for more natural distribution
            const noiseScale = 0.3;
            const noiseX = perlinNoise(i * 0.1, 0, 123) * noiseScale;
            const noiseY = perlinNoise(i * 0.1, 100, 456) * noiseScale;
            const noiseZ = perlinNoise(i * 0.1, 200, 789) * noiseScale;
            
            const x = radius * Math.sin(phi) * Math.cos(theta) + noiseX;
            const y = radius * Math.sin(phi) * Math.sin(theta) + noiseY;
            const z = radius * Math.cos(phi) + noiseZ;
            
            this.spreadPositions.push(x, y, z);
        }
    }
    
    initializeEnhancedParticleProperties() {
        // Initialize enhanced particle personality arrays
        this.particleDelays = [];
        this.particleSeeds = [];
        this.particleCurvatures = [];
        this.particleEnergies = [];
        this.particleLifePhases = [];
        this.particleNoiseOffsets = [];
        this.particleFluidVelocities = [];
        this.particleNeighbors = [];
        this.particleTemperatures = [];
        this.particleMasses = [];
        this.particleFrictions = [];
        this.particleSpringConstants = [];
        this.particleOrganicSeeds = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            // Multiple seeds for different organic behaviors
            const seed1 = Math.random();
            const seed2 = Math.random();
            const seed3 = Math.random();
            const seed4 = Math.random();
            
            // Enhanced particle personality
            this.particleDelays.push(seed1 * 0.4); // Staggered timing
            this.particleSeeds.push(seed1);
            this.particleCurvatures.push(0.1 + seed2 * 0.5); // More variation in curves
            this.particleEnergies.push(0.3 + seed3 * 0.7); // Wider energy range
            this.particleLifePhases.push(seed4 * Math.PI * 2);
            
            // Organic motion properties
            this.particleNoiseOffsets.push({
                x: seed1 * 1000,
                y: seed2 * 1000,
                z: seed3 * 1000,
                time: seed4 * 1000
            });
            
            // Fluid dynamics properties
            this.particleFluidVelocities.push({ x: 0, y: 0, z: 0 });
            this.particleNeighbors.push([]);
            this.particleTemperatures.push(0.5 + seed1 * 0.5);
            this.particleMasses.push(0.8 + seed2 * 0.4);
            this.particleFrictions.push(0.95 + seed3 * 0.04);
            this.particleSpringConstants.push(0.001 + seed4 * 0.002);
            this.particleOrganicSeeds.push([seed1, seed2, seed3, seed4]);
        }
    }
    
    // Fluid dynamics helper methods
    updateParticleNeighbors() {
        const neighborRadius = 0.5;
        const maxNeighbors = 8;
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particleNeighbors[i] = [];
            const currentPos = {
                x: this.currentPositions[i * 3] || this.spreadPositions[i * 3],
                y: this.currentPositions[i * 3 + 1] || this.spreadPositions[i * 3 + 1],
                z: this.currentPositions[i * 3 + 2] || this.spreadPositions[i * 3 + 2]
            };
            
            for (let j = 0; j < this.particleCount && this.particleNeighbors[i].length < maxNeighbors; j++) {
                if (i === j) continue;
                
                const neighborPos = {
                    x: this.currentPositions[j * 3] || this.spreadPositions[j * 3],
                    y: this.currentPositions[j * 3 + 1] || this.spreadPositions[j * 3 + 1],
                    z: this.currentPositions[j * 3 + 2] || this.spreadPositions[j * 3 + 2]
                };
                
                const distance = Math.sqrt(
                    Math.pow(currentPos.x - neighborPos.x, 2) +
                    Math.pow(currentPos.y - neighborPos.y, 2) +
                    Math.pow(currentPos.z - neighborPos.z, 2)
                );
                
                if (distance < neighborRadius) {
                    this.particleNeighbors[i].push({ index: j, distance: distance });
                }
            }
        }
    }
    
    calculateFluidInfluence(particleIndex) {
        const neighbors = this.particleNeighbors[particleIndex];
        let force = { x: 0, y: 0, z: 0 };
        
        if (!neighbors || neighbors.length === 0) return force;
        
        const currentPos = {
            x: this.currentPositions[particleIndex * 3] || this.spreadPositions[particleIndex * 3],
            y: this.currentPositions[particleIndex * 3 + 1] || this.spreadPositions[particleIndex * 3 + 1],
            z: this.currentPositions[particleIndex * 3 + 2] || this.spreadPositions[particleIndex * 3 + 2]
        };
        
        for (const neighbor of neighbors) {
            const neighborPos = {
                x: this.currentPositions[neighbor.index * 3] || this.spreadPositions[neighbor.index * 3],
                y: this.currentPositions[neighbor.index * 3 + 1] || this.spreadPositions[neighbor.index * 3 + 1],
                z: this.currentPositions[neighbor.index * 3 + 2] || this.spreadPositions[neighbor.index * 3 + 2]
            };
            
            const fluidForce = calculateFluidForce(currentPos, neighborPos, neighbor.distance);
            force.x += fluidForce.x;
            force.y += fluidForce.y;
            force.z += fluidForce.z;
        }
        
        return force;
    }
    
    calculateThermalMotion(particleIndex, temperature, time) {
        const noiseOffset = this.particleNoiseOffsets[particleIndex];
        const intensity = temperature * 0.01;
        
        return {
            x: perlinNoise(time * 2 + noiseOffset.x, noiseOffset.y, 123) * intensity,
            y: perlinNoise(time * 2 + noiseOffset.y, noiseOffset.z, 456) * intensity,
            z: perlinNoise(time * 2 + noiseOffset.z, noiseOffset.x, 789) * intensity * 0.5
        };
    }
    
    createParticles() {
        if (this.positions1.length === 0 || this.positions2.length === 0) {
            console.error('No particle positions found');
            return;
        }
        
        // 确保两个位置数组长度一致 (preserve X shapes)
        const maxLength = Math.max(this.positions1.length, this.positions2.length);
        this.particleCount = maxLength / 3;
        
        // 改进的填充逻辑 - 使用更均匀的分布
        this.fillArrayEvenly(this.positions1, maxLength);
        this.fillArrayEvenly(this.positions2, maxLength);
        
        // Generate spread positions and initialize enhanced properties
        this.generateSpreadPositions();
        this.initializeEnhancedParticleProperties();
        
        // Initialize enhanced particle properties
        this.particleVelocities = [];
        this.particleSizes = [];
        this.particleOpacities = [];
        this.particlePhases = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particleVelocities.push(0, 0, 0); // vx, vy, vz
            this.particleSizes.push(0.3 + Math.random() * 0.2); // smaller, more elegant sizes
            this.particleOpacities.push(1.0);
            this.particlePhases.push(Math.random() * Math.PI * 2); // for breathing

            // Organic Particle Personality - Each particle is a unique individual
            const particleSeed = Math.random();
            const particleId = i / this.particleCount; // Normalized ID for patterns

            this.particleDelays.push(particleSeed * 0.8 + particleId * 0.3); // Staggered emergence
            this.particleSeeds.push(particleSeed); // Unique random seed
            this.particleCurvatures.push(0.2 + particleSeed * 0.4); // Individual curve preference
            this.particleEnergies.push(0.5 + particleSeed * 0.5); // Individual energy level
            this.particleLifePhases.push(particleSeed * Math.PI * 2); // Individual life cycle phase
        }
        
        // 创建粒子几何体
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        // 初始化粒子位置（从spread状态开始）
        for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] = this.spreadPositions[i * 3];
            positions[i * 3 + 1] = this.spreadPositions[i * 3 + 1];
            positions[i * 3 + 2] = this.spreadPositions[i * 3 + 2];
            
            // 设置粒子颜色 - 暮光深蓝紫色
            const twilightVariation = Math.random();
            if (twilightVariation < 0.6) {
                // Deep blue twilight
                colors[i * 3] = 0.2 + Math.random() * 0.3; // r: 0.2-0.5
                colors[i * 3 + 1] = 0.3 + Math.random() * 0.4; // g: 0.3-0.7
                colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // b: 0.8-1.0
            } else {
                // Deep purple twilight
                colors[i * 3] = 0.4 + Math.random() * 0.4; // r: 0.4-0.8
                colors[i * 3 + 1] = 0.2 + Math.random() * 0.3; // g: 0.2-0.5
                colors[i * 3 + 2] = 0.7 + Math.random() * 0.3; // b: 0.7-1.0
            }
            
            sizes[i] = this.particleSizes[i];
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // 移除复杂的shader属性，回到简单版本
        
        // 创建高级粒子材质 - 回到原始版本保证流畅性
        const vertexShader = `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vSize;
            varying vec3 vPosition;
            varying float vDistance;
            varying float vPulse;
            varying float vAlpha;
            varying vec3 vVelocity;
            varying float vColorTheme;

            uniform float time;
            uniform vec2 uOrigin;

            void main() {
                vColor = color;
                vSize = size;
                vPosition = position;
                vDistance = length(position.xy);
                vAlpha = 1.0;

                // Use position-based hash for theme selection instead of gl_VertexID
                float hash = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);
                vColorTheme = floor(hash * 4.0); // Cycle through 4 themes

                // Calculate velocity based on position changes over time
                float deltaTime = 0.016; // Assume 60fps
                vec3 futurePos = position + vec3(sin(time + position.x) * 0.1, cos(time + position.y) * 0.1, 0.0);
                vVelocity = (futurePos - position) / deltaTime;

                // Pulse animation
                float pulseTime = time * 0.57;
                float rawPulse = sin(pulseTime + position.x * 6.28) * 0.5 + 0.5;
                vPulse = rawPulse;

                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;

                // 保持原始大小设置
                gl_PointSize = size * 150.0 / -mvPosition.z;
            }
        `;
        
        const fragmentShader = `
            varying vec3 vColor;
            varying float vSize;
            varying vec3 vPosition;
            varying float vDistance;
            varying float vPulse;
            varying float vAlpha;
            varying vec3 vVelocity;
            varying float vColorTheme;
            uniform float time;

            // 精致噪声函数 - 控制强度，保持优雅
            float smoothNoise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f); // 更平滑的插值

                float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
                float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
                float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
                float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);

                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            // 优雅的有机形状生成 - 精致而不失自然
            float createElegantShape(vec2 uv, float time, vec3 position) {
                float radialDist = length(uv);

                // 基础圆形，精致的边界
                float baseRadius = 0.45;

                // 非常微妙的有机变形，保持优雅
                vec2 noiseCoord = uv * 2.0 + vec2(time * 0.05, time * 0.08);
                float organicNoise = smoothNoise(noiseCoord) * 0.06; // 大幅降低噪声强度

                // 轻微的旋转变形，创造自然感
                float angle = atan(uv.y, uv.x);
                float organicVariation = sin(angle * 3.0 + time * 0.3) * 0.03;

                // 速度影响的轻微拖尾，优雅而不过度
                float velocityLength = length(vVelocity);
                float velocityStretch = velocityLength * 0.1; // 降低速度影响
                vec2 velocityDir = normalize(vVelocity.xy);
                float directionInfluence = dot(uv, velocityDir) * velocityStretch * 0.5;

                // 组合变形，保持整体优雅
                float dynamicRadius = baseRadius + organicNoise + organicVariation + directionInfluence;

                // 极其柔和的边界过渡
                float softEdge = 0.12;
                return 1.0 - smoothstep(dynamicRadius - softEdge, dynamicRadius + softEdge * 0.5, radialDist);
            }

            // 科学调色板 - 基于色彩理论的优雅配色
            vec3 elegantColorPalette(float t, float theme, float warmth) {
                t = clamp(t, 0.0, 1.0);

                if (theme < 0.5) {
                    // 主题0：优雅蓝色系 - 现代科技美学
                    vec3 deepBlue = vec3(0.08, 0.12, 0.35); // 深海蓝
                    vec3 royalBlue = vec3(0.15, 0.35, 0.75); // 皇家蓝
                    vec3 skyBlue = vec3(0.35, 0.65, 0.95); // 天空蓝
                    vec3 iceBlue = vec3(0.75, 0.90, 1.0); // 冰蓝
                    vec3 pureWhite = vec3(1.0, 1.0, 1.0); // 纯白

                    if (t < 0.25) {
                        return mix(deepBlue, royalBlue, t * 4.0);
                    } else if (t < 0.5) {
                        return mix(royalBlue, skyBlue, (t - 0.25) * 4.0);
                    } else if (t < 0.75) {
                        return mix(skyBlue, iceBlue, (t - 0.5) * 4.0);
                    } else {
                        return mix(iceBlue, pureWhite, (t - 0.75) * 4.0);
                    }
                } else if (theme < 1.5) {
                    // 主题1：优雅橙金系 - 温暖奢华美学
                    vec3 deepAmber = vec3(0.25, 0.15, 0.05); // 深琥珀
                    vec3 richGold = vec3(0.8, 0.5, 0.15); // 富金色
                    vec3 warmGold = vec3(1.0, 0.75, 0.3); // 温金色
                    vec3 lightGold = vec3(1.0, 0.9, 0.7); // 浅金色
                    vec3 warmWhite = vec3(1.0, 0.98, 0.9); // 暖白色

                    if (t < 0.25) {
                        return mix(deepAmber, richGold, t * 4.0);
                    } else if (t < 0.5) {
                        return mix(richGold, warmGold, (t - 0.25) * 4.0);
                    } else if (t < 0.75) {
                        return mix(warmGold, lightGold, (t - 0.5) * 4.0);
                    } else {
                        return mix(lightGold, warmWhite, (t - 0.75) * 4.0);
                    }
                } else if (theme < 2.5) {
                    // 主题2：优雅紫色系 - 神秘奢华美学
                    vec3 deepPurple = vec3(0.15, 0.08, 0.25); // 深紫色
                    vec3 royalPurple = vec3(0.4, 0.15, 0.6); // 皇家紫
                    vec3 lavender = vec3(0.7, 0.4, 0.8); // 薰衣草色
                    vec3 lightLavender = vec3(0.9, 0.7, 0.95); // 浅薰衣草
                    vec3 crystalWhite = vec3(1.0, 0.95, 1.0); // 水晶白

                    if (t < 0.25) {
                        return mix(deepPurple, royalPurple, t * 4.0);
                    } else if (t < 0.5) {
                        return mix(royalPurple, lavender, (t - 0.25) * 4.0);
                    } else if (t < 0.75) {
                        return mix(lavender, lightLavender, (t - 0.5) * 4.0);
                    } else {
                        return mix(lightLavender, crystalWhite, (t - 0.75) * 4.0);
                    }
                } else {
                    // 主题3: 暮光星云 (Twilight Nebula) - 高级感蓝紫色
                    vec3 deepSpacePurple = vec3(0.1, 0.05, 0.2); // 深空紫
                    vec3 stardustBlue = vec3(0.2, 0.3, 0.6); // 星尘蓝
                    vec3 twilightViolet = vec3(0.5, 0.4, 0.9); // 暮光紫 (主色)
                    vec3 electricBlue = vec3(0.7, 0.8, 1.0); // 电光蓝
                    vec3 stellarWhite = vec3(0.95, 0.98, 1.0); // 恒星白

                    if (t < 0.2) {
                        return mix(deepSpacePurple, stardustBlue, t * 5.0);
                    } else if (t < 0.45) {
                        return mix(stardustBlue, twilightViolet, (t - 0.2) * 4.0);
                    } else if (t < 0.75) {
                        return mix(twilightViolet, electricBlue, (t - 0.45) * 3.33);
                    } else {
                        return mix(electricBlue, stellarWhite, (t - 0.75) * 4.0);
                    }
                }
            }

            // 精致的光晕效果 - 轻微增强亮度
            float createElegantGlow(float radialDist, float intensity) {
                // 三层光晕结构
                float innerGlow = 1.0 - smoothstep(0.0, 0.15, radialDist);
                float midGlow = 1.0 - smoothstep(0.15, 0.35, radialDist);
                float outerGlow = 1.0 - smoothstep(0.35, 0.5, radialDist);

                // 精致的权重分配 - 轻微增强
                return innerGlow * 1.1 + midGlow * 0.7 + outerGlow * 0.3;
            }
            
            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                center *= 2.0; // 标准化到 [-1, 1]

                // === 优雅形状生成 ===
                float elegantMask = createElegantShape(center, time, vPosition);

                if(elegantMask < 0.01) discard;
                
                // === 优雅颜色系统 ===
                // 基于距离的优雅颜色映射
                float centerDistance = clamp(vDistance / 5.0, 0.0, 1.0);
                float particleSeed = sin(vPosition.x * 8.0 + vPosition.y * 6.0) * 0.5 + 0.5;

                // 轻微的时间变化，保持稳定性
                float timeVariation = sin(time * 0.5 + vPosition.x * 2.0) * 0.15 + 0.85;

                // 颜色映射参数
                float colorT = centerDistance * 0.8 + particleSeed * 0.2;
                colorT = mix(colorT, colorT * timeVariation, 0.3);
                colorT = clamp(colorT, 0.0, 1.0);

                // 使用优雅调色板
                vec3 baseColor = elegantColorPalette(colorT, vColorTheme, 0.8);

                // 轻微的速度颜色效果
                float velocityInfluence = length(vVelocity) * 0.3;
                if (velocityInfluence > 0.3) {
                    vec3 velocityColor = mix(baseColor, vec3(1.0, 0.95, 0.9), velocityInfluence * 0.2);
                    baseColor = velocityColor;
                }

                // === 精致的强度和光晕系统 ===
                float radialDist = length(center);
                float glowIntensity = createElegantGlow(radialDist, 1.2);
                glowIntensity *= elegantMask;

                // 内核高亮效果 - 精致而不过度，轻微增强
                float coreHighlight = 1.0 - smoothstep(0.0, 0.08, radialDist);
                vec3 coreColor = mix(baseColor, vec3(1.0, 0.98, 0.95), coreHighlight * 0.35);

                // === 最终颜色合成 ===
                vec3 finalColor = coreColor * glowIntensity;

                // 优雅的亮度调整 - 轻微提升整体亮度
                finalColor *= (1.0 + vPulse * 0.25);

                // === 精致的透明度系统 ===
                float alpha = glowIntensity * 0.95;

                // 距离衰减
                float distanceFade = clamp(1.0 - vDistance * 0.06, 0.3, 1.0);
                alpha *= distanceFade;

                // 动画透明度
                alpha *= vAlpha;

                // 脉冲效果
                alpha *= (0.85 + vPulse * 0.15);

                // 确保内核可见
                alpha = max(alpha, coreHighlight * 0.6);
                alpha = clamp(alpha, 0.0, 1.0);

                gl_FragColor = vec4(finalColor, alpha);
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                time: { value: 0.0 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false
        });
        
        // 创建粒子系统
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // 隐藏开始按钮并开始新的动画序列
        document.getElementById('startButton').style.display = 'none';
        
        // 开始新的动画序列
        setTimeout(() => {
            this.startNewAnimationSequence();
        }, 500);
    }
    
    startNewAnimationSequence() {
        if (this.isAnimating || !this.particles) return;
        
        // 重置粒子可见性
        this.particles.visible = true;
        
        // 重置粒子到初始扩散状态
        this.resetParticlesToSpread();
        
        this.isAnimating = true;
        this.currentState = ANIMATION_STATES.CONVERGING;
        this.stateProgress = 0;
        this.globalTime = 0;
        
        console.log('Starting new animation sequence: Converging to X');
        this.animateState();
    }
    
    // 重置粒子到初始扩散状态
    resetParticlesToSpread() {
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // 重置到扩散位置
            positions[index] = this.spreadPositions[index];
            positions[index + 1] = this.spreadPositions[index + 1];
            positions[index + 2] = this.spreadPositions[index + 2];
            
            // 重置颜色到初始状态
            colors[index] = 0.2;
            colors[index + 1] = 0.2;
            colors[index + 2] = 0.8;
            
            // 重置大小
            sizes[i] = this.particleSizes[i];
        }
        
        // 更新几何体
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
    }
    
    animateState() {
        if (!this.particles) return;
        
        this.globalTime += 16; // ~60fps
        
        switch (this.currentState) {
            case ANIMATION_STATES.CONVERGING:
                this.updateConvergingState();
                break;
            case ANIMATION_STATES.X_BREATHING:
                this.updateBreathingState();
                break;
            case ANIMATION_STATES.ACTIVATION:
                this.updateActivationState();
                break;
            case ANIMATION_STATES.MORPHING:
                this.updateMorphingState();
                break;
            case ANIMATION_STATES.DISSIPATING:
                this.updateDissipatingState();
                break;
        }
        
        if (this.isAnimating) {
            requestAnimationFrame(() => this.animateState());
        }
    }
    
    // Stage 1: Enhanced Organic Particle Convergence to X Shape
    updateConvergingState() {
        const duration = STAGE_DURATIONS.CONVERGING;
        const phaseTime = this.globalTime - (this.phaseStartTime || 0);
        this.stateProgress = Math.min(phaseTime / duration, 1);
        
        // 暂时禁用fluid dynamics以提高性能
        // this.updateParticleNeighbors();

        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;

        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;

            // Get enhanced particle personality
            const particleDelay = this.particleDelays[i];
            const particleSeed = this.particleSeeds[i];
            const curvature = this.particleCurvatures[i];
            const energy = this.particleEnergies[i];
            const lifePhase = this.particleLifePhases[i];
            const noiseOffset = this.particleNoiseOffsets[i];
            const mass = this.particleMasses[i];
            const friction = this.particleFrictions[i];
            const temperature = this.particleTemperatures[i];
            const organicSeeds = this.particleOrganicSeeds[i];
            
            // Apply organic noise for natural movement
            const time = this.globalTime * 0.001;
            const noiseX = perlinNoise(time + noiseOffset.x, noiseOffset.y, 123) * 0.02;
            const noiseY = perlinNoise(time + noiseOffset.y, noiseOffset.z, 456) * 0.02;
            const noiseZ = perlinNoise(time + noiseOffset.z, noiseOffset.x, 789) * 0.01;
            
            // Calculate fluid dynamics influence
            const fluidForce = this.calculateFluidInfluence(i);
            
            // Apply temperature-based motion
            const thermalMotion = this.calculateThermalMotion(i, temperature, time);

            // Enhanced individual particle timing with staggered delays
            const adjustedDelay = particleDelay * 0.7; // Reduce delay impact for smoother overall flow
            const individualProgress = Math.max(0, Math.min(1, (this.stateProgress - adjustedDelay) / (1 - adjustedDelay)));
            
            // 使用最简单的缓动函数
            const organicProgress = individualProgress * individualProgress * (3 - 2 * individualProgress); // smoothstep

            // Start and target positions
            const start = {
                x: this.spreadPositions[index],
                y: this.spreadPositions[index + 1],
                z: this.spreadPositions[index + 2]
            };
            const target = {
                x: this.positions1[index],
                y: this.positions1[index + 1],
                z: this.positions1[index + 2]
            };

            // Generate organic curved path instead of straight line
            const dynamicCurvature = curvature * (1 - organicProgress * 0.8); // Reduce curvature as particle approaches target
            const currentPos = generateOrganicCurve(start, target, organicProgress, dynamicCurvature, particleSeed);

            // Add organic breathing motion during convergence
            const breathingTime = this.globalTime * 0.001 + lifePhase;
            const distanceToTarget = Math.sqrt(
                Math.pow(currentPos.x - target.x, 2) + 
                Math.pow(currentPos.y - target.y, 2) + 
                Math.pow(currentPos.z - target.z, 2)
            );
            const breathingIntensity = Math.min(0.08, distanceToTarget * 0.02); // Breathing based on distance
            const breathingX = Math.sin(breathingTime * 2.0 + particleSeed) * breathingIntensity;
            const breathingY = Math.cos(breathingTime * 2.3 + particleSeed) * breathingIntensity;
            const breathingZ = Math.sin(breathingTime * 1.7 + particleSeed) * breathingIntensity * 0.5;

            // Apply position with organic breathing
            positions[index] = currentPos.x + breathingX;
            positions[index + 1] = currentPos.y + breathingY;
            positions[index + 2] = currentPos.z + breathingZ;

            // Gradual color awakening with smoother transition
            const colorIntensity = organicEasing.ultraSmooth(organicProgress);
            const energyGlow = energy * colorIntensity;

            // Individual color personality based on particle seed
            const baseColor = this.getOrganicColor(particleSeed, energyGlow);
            colors[index] = baseColor.r;
            colors[index + 1] = baseColor.g;
            colors[index + 2] = baseColor.b;

            // Organic size growth - particles grow as they gain life
            const sizeGrowth = organicEasing.organicBounce(organicProgress);
            sizes[i] = this.particleSizes[i] * (0.3 + sizeGrowth * 0.7) * energy;
        }

        // Update geometry
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;

        // Smooth transition to breathing with buffer
        if (this.stateProgress >= 0.95) {  // Start transition earlier
            if (this.currentState === ANIMATION_STATES.CONVERGING) {
                console.log('Organic convergence complete, starting breathing phase');
                this.transitionToState(ANIMATION_STATES.X_BREATHING);
            }
        }
    }

    // Helper function for organic color generation
    getOrganicColor(seed, intensity) {
        // Generate organic color based on particle personality
        const hue = seed * 360; // Full spectrum based on seed
        const saturation = 0.6 + seed * 0.4; // 60-100% saturation
        const lightness = 0.3 + intensity * 0.5; // 30-80% lightness based on energy

        // Convert HSL to RGB for organic color variation
        const h = hue / 60;
        const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const x = c * (1 - Math.abs((h % 2) - 1));
        const m = lightness - c / 2;

        let r, g, b;
        if (h < 1) { r = c; g = x; b = 0; }
        else if (h < 2) { r = x; g = c; b = 0; }
        else if (h < 3) { r = 0; g = c; b = x; }
        else if (h < 4) { r = 0; g = x; b = c; }
        else if (h < 5) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        return {
            r: Math.max(0.1, Math.min(1.0, r + m)),
            g: Math.max(0.1, Math.min(1.0, g + m)),
            b: Math.max(0.3, Math.min(1.0, b + m)) // Ensure some blue for twilight feel
        };
    }

    // Stage 2: Organic Particle Breathing - Living X Shape
    updateBreathingState() {
        const duration = STAGE_DURATIONS.X_BREATHING; // Use consistent timing
        const phaseTime = this.globalTime - (this.phaseStartTime || 0);
        this.stateProgress = Math.min(phaseTime / duration, 1);
        
        const positions = this.particles.geometry.attributes.position.array;
        const sizes = this.particles.geometry.attributes.size.array;
        const colors = this.particles.geometry.attributes.color.array;
        
        // 简化呼吸参数
        const waveSpeed = 0.003;  // 减慢速度
        const waveIntensity = 0.08;  // 减少强度
        const sizeWaveIntensity = 0.03;
        
        // 只使用主要波形
        const primaryWave = this.globalTime * waveSpeed;
        
        // Smooth transition blending for first 20% of breathing phase
        const isEarlyBreathing = this.stateProgress < 0.2;
        const blendFactor = isEarlyBreathing ? this.stateProgress / 0.2 : 1.0;
        
        // Apply ultra-elegant wave propagation
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Enhanced distance calculations - use current positions for continuity
            const centerX = 0;
            const centerY = 0;
            const baseX = this.currentPositions.length > 0 ? this.currentPositions[index] : this.positions1[index];
            const baseY = this.currentPositions.length > 0 ? this.currentPositions[index + 1] : this.positions1[index + 1];
            const baseZ = this.currentPositions.length > 0 ? this.currentPositions[index + 2] : this.positions1[index + 2];
            const particleX = baseX;
            const particleY = baseY;
            const distanceFromCenter = Math.sqrt(
                (particleX - centerX) * (particleX - centerX) + 
                (particleY - centerY) * (particleY - centerY)
            );
            
            // Radial component for wave patterns
            const radialPhase = distanceFromCenter * 0.6;
            const individualPhase = this.particlePhases[i];
            
            // 简化波形计算
            const wave1 = Math.sin(primaryWave + radialPhase);
            const normalizedWave = wave1;
            
            // 最简单的波形处理
            const smoothedWave = normalizedWave;
            
            // Distance-based intensity modulation
            const intensityMultiplier = Math.max(0.2, 1 - distanceFromCenter * 0.12);
            const finalIntensity = smoothedWave * waveIntensity * intensityMultiplier * blendFactor;
            
            // Enhanced radial breathing with spiral component
            const angle = Math.atan2(particleY - centerY, particleX - centerX);
            const spiralOffset = Math.sin(primaryWave * 3 + radialPhase) * 0.02;
            const radialX = Math.cos(angle + spiralOffset);
            const radialY = Math.sin(angle + spiralOffset);
            
            // Apply breathing movement with micro-variations
            const microVariationX = Math.sin(individualPhase + primaryWave * 2) * 0.005 * blendFactor;
            const microVariationY = Math.cos(individualPhase + primaryWave * 2) * 0.005 * blendFactor;
            
            positions[index] = baseX + radialX * finalIntensity + microVariationX;
            positions[index + 1] = baseY + radialY * finalIntensity + microVariationY;
            positions[index + 2] = baseZ + finalIntensity * 0.25;
            
            // Enhanced size breathing with smooth pulsing
            const sizePhase = primaryWave + radialPhase * 0.4 + individualPhase;
            const sizeWave = Math.sin(sizePhase) * sizeWaveIntensity;
            const smoothSizeWave = this.ultraSmoothEasing((sizeWave + sizeWaveIntensity) / (sizeWaveIntensity * 2)) * sizeWaveIntensity * 2 - sizeWaveIntensity;
            sizes[i] = this.particleSizes[i] + smoothSizeWave;
            
            // Subtle color breathing for extra life
            const colorIntensity = Math.abs(finalIntensity) * 0.1;
            const baseColor = i % 2 === 0 ? [0.3, 0.4, 0.9] : [0.5, 0.3, 0.8];
            colors[index] = baseColor[0] + colorIntensity;
            colors[index + 1] = baseColor[1] + colorIntensity * 0.7;
            colors[index + 2] = baseColor[2] + colorIntensity * 0.3;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        
        // Smooth transition to activation with buffer
        if (this.stateProgress >= 0.95) {  // Start transition earlier
            if (this.currentState === ANIMATION_STATES.X_BREATHING) {
                console.log('Ultra-smooth breathing complete, starting activation');
                this.loadingComplete = true;
                this.transitionToState(ANIMATION_STATES.ACTIVATION);
            }
        }
    }
    
    // Stage 3: Organic Particle Activation - Energizing the X
    updateActivationState() {
        const duration = STAGE_DURATIONS.ACTIVATION;
        const phaseTime = this.globalTime - (this.phaseStartTime || 0);
        this.stateProgress = Math.min(phaseTime / duration, 1);

        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // 重新设计：简单而优雅的激活效果
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // 获取基础位置
            const baseX = this.currentPositions.length > 0 ? this.currentPositions[index] : this.positions1[index];
            const baseY = this.currentPositions.length > 0 ? this.currentPositions[index + 1] : this.positions1[index + 1];
            const baseZ = this.currentPositions.length > 0 ? this.currentPositions[index + 2] : this.positions1[index + 2];
            
            // 计算距离中心的距离
            const distanceFromCenter = Math.sqrt(baseX * baseX + baseY * baseY);
            const normalizedDistance = Math.min(distanceFromCenter / 4, 1);
            
            // 简化的激活效果：从内向外的温和波动
            const activationWave = Math.sin(this.stateProgress * Math.PI * 2 - normalizedDistance * 3) * 0.5 + 0.5;
            const intensity = activationWave * (1 - this.stateProgress * 0.3); // 逐渐减弱
            
            // 优雅的颜色渐变：从深紫到亮蓝
            const colorProgress = this.stateProgress * (1 - normalizedDistance * 0.2);
            colors[index] = 0.3 + intensity * 0.4 + colorProgress * 0.2;     // 红：深紫到亮紫
            colors[index + 1] = 0.2 + intensity * 0.3 + colorProgress * 0.5; // 绿：低到中等
            colors[index + 2] = 0.8 + intensity * 0.2;                      // 蓝：保持深蓝基调
            
            // 温和的位置变化：轻微的呼吸效果
            const breathingIntensity = intensity * 0.02;
            const angle = Math.atan2(baseY, baseX);
            positions[index] = baseX + Math.cos(angle) * breathingIntensity;
            positions[index + 1] = baseY + Math.sin(angle) * breathingIntensity;
            positions[index + 2] = baseZ;
            
            // 温和的大小变化
            sizes[i] = this.particleSizes[i] + intensity * 0.03;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        if (this.stateProgress >= 0.95) {
            if (this.currentState === ANIMATION_STATES.ACTIVATION) {
                console.log('Smooth activation complete, starting morphing');
                this.transitionToState(ANIMATION_STATES.MORPHING);
            }
        }
    }
    
    updateMorphingState() {
        const duration = STAGE_DURATIONS.MORPHING; // Faster morphing
        const phaseTime = this.globalTime - (this.phaseStartTime || 0);
        this.stateProgress = Math.min(phaseTime / duration, 1);
        
        // 回到原始的JavaScript morphing方式
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // Ultra-elegant morphing phases with smooth transitions
        const phase1Duration = 0.15; // Quick anticipation (0-15%)
        const phase2Duration = 0.25; // Preparation wave (15-25%)
        const phase3Duration = 0.80; // Main transformation (25-80%)
        const phase4Duration = 1.0;  // Final settlement (80-100%)
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Calculate transformation vectors and distances - use current positions
            const startX = this.currentPositions.length > 0 ? this.currentPositions[index] : this.positions1[index];
            const startY = this.currentPositions.length > 0 ? this.currentPositions[index + 1] : this.positions1[index + 1];
            const startZ = this.currentPositions.length > 0 ? this.currentPositions[index + 2] : this.positions1[index + 2];
            const endX = this.positions2[index];
            const endY = this.positions2[index + 1];
            const endZ = this.positions2[index + 2];
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaZ = endZ - startZ;
            const transformDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
            
            // Enhanced distance calculations for wave effects
            const particleX = startX;
            const particleY = startY;
            const distanceFromCenter = Math.sqrt(particleX * particleX + particleY * particleY);
            const normalizedDistance = Math.min(distanceFromCenter / 5, 1);
            const angle = Math.atan2(particleY, particleX);
            
            // Individual particle characteristics for organic variation
            const particlePhase = this.particlePhases[i];
            const particleVariation = (Math.sin(particlePhase) + 1) * 0.5; // 0-1
            
            if (this.stateProgress <= phase1Duration) {
                // Phase 1: Subtle Anticipation - Ultra-gentle preparation
                const phase1Progress = this.stateProgress / phase1Duration;
                const anticipationCurve = this.ultraSmoothEasing(phase1Progress);
                
                // Micro-compression toward transformation direction
                const anticipationIntensity = anticipationCurve * 0.03;
                const directionX = deltaX / Math.max(transformDistance, 0.01);
                const directionY = deltaY / Math.max(transformDistance, 0.01);
                
                positions[index] = startX - directionX * anticipationIntensity;
                positions[index + 1] = startY - directionY * anticipationIntensity;
                positions[index + 2] = startZ;
                
                // Subtle energy gathering glow
                const energyGlow = anticipationCurve * 0.15;
                colors[index] = 0.3 + energyGlow;
                colors[index + 1] = 0.3 + energyGlow * 0.7;
                colors[index + 2] = 0.8 + energyGlow * 0.3;
                
                sizes[i] = this.particleSizes[i] + energyGlow * 0.01;
                
            } else if (this.stateProgress <= phase2Duration) {
                // Phase 2: Preparation Wave - Energy flows through the formation
                const phase2Progress = (this.stateProgress - phase1Duration) / (phase2Duration - phase1Duration);
                
                // Create a beautiful wave that flows from center outward
                const waveSpeed = 3.0;
                const wavePosition = phase2Progress * waveSpeed;
                const waveInfluence = Math.max(0, 1 - Math.abs(normalizedDistance - wavePosition) * 2);
                const waveIntensity = Math.sin(waveInfluence * Math.PI) * 0.4;
                
                // Anticipation movement with wave
                const anticipationFactor = 0.05 * waveIntensity;
                const directionX = deltaX / Math.max(transformDistance, 0.01);
                const directionY = deltaY / Math.max(transformDistance, 0.01);
                
                positions[index] = startX - directionX * anticipationFactor;
                positions[index + 1] = startY - directionY * anticipationFactor;
                positions[index + 2] = startZ + waveIntensity * 0.1;
                
                // Dynamic color wave
                const waveColor = waveIntensity * 0.5;
                colors[index] = 0.3 + waveColor;
                colors[index + 1] = 0.3 + waveColor * 0.8;
                colors[index + 2] = 0.8 + waveColor * 0.4;
                
                // Size pulsing with wave
                sizes[i] = this.particleSizes[i] + waveIntensity * 0.03;
                
            } else if (this.stateProgress <= phase3Duration) {
                // Phase 3: Main Transformation - Ultra-smooth morphing with advanced curves
                const phase3Progress = (this.stateProgress - phase2Duration) / (phase3Duration - phase2Duration);
                
                // Staggered start times based on distance and individual characteristics
                const delayFactor = normalizedDistance * 0.2 + particleVariation * 0.1;
                const adjustedProgress = Math.max(0, Math.min(1, (phase3Progress - delayFactor) / (1 - delayFactor * 0.8)));
                
                // Ultra-smooth easing for the main transformation
                const smoothProgress = this.ultraSmoothEasing(adjustedProgress);
                
                // Advanced Bézier curve with multiple control points for organic paths
                const controlPoint1X = startX + deltaX * 0.3 + Math.sin(angle + Math.PI * 0.5) * transformDistance * 0.15;
                const controlPoint1Y = startY + deltaY * 0.3 + Math.cos(angle + Math.PI * 0.5) * transformDistance * 0.15;
                const controlPoint1Z = startZ + Math.sin(smoothProgress * Math.PI) * 0.4;
                
                const controlPoint2X = startX + deltaX * 0.7 + Math.sin(angle - Math.PI * 0.3) * transformDistance * 0.1;
                const controlPoint2Y = startY + deltaY * 0.7 + Math.cos(angle - Math.PI * 0.3) * transformDistance * 0.1;
                const controlPoint2Z = startZ + deltaZ * 0.7 + Math.sin(smoothProgress * Math.PI * 1.5) * 0.2;
                
                // Cubic Bézier interpolation for ultra-smooth paths
                const currentPos = this.cubicBezierInterpolation(
                    { x: startX, y: startY, z: startZ },
                    { x: controlPoint1X, y: controlPoint1Y, z: controlPoint1Z },
                    { x: controlPoint2X, y: controlPoint2Y, z: controlPoint2Z },
                    { x: endX, y: endY, z: endZ },
                    smoothProgress
                );
                
                // Add organic flow effects
                const flowPhase = smoothProgress * Math.PI * 2 + particlePhase;
                const flowIntensity = Math.sin(flowPhase) * 0.05 * (1 - smoothProgress);
                const flowDirection = angle + Math.PI * 0.5;
                
                positions[index] = currentPos.x + Math.cos(flowDirection) * flowIntensity;
                positions[index + 1] = currentPos.y + Math.sin(flowDirection) * flowIntensity;
                positions[index + 2] = currentPos.z;
                
                // Advanced color transformation with smooth gradients
                const colorProgress = smoothProgress;
                const energyIntensity = Math.sin(colorProgress * Math.PI) * 0.6;
                
                // Color journey: Twilight -> Bright Energy -> Destination Twilight
                if (colorProgress <= 0.3) {
                    // Initial energy buildup
                    const buildupProgress = colorProgress / 0.3;
                    colors[index] = 0.3 + buildupProgress * 0.4 + energyIntensity * 0.3;
                    colors[index + 1] = 0.3 + buildupProgress * 0.3 + energyIntensity * 0.4;
                    colors[index + 2] = 0.8 + buildupProgress * 0.2;
                } else if (colorProgress <= 0.7) {
                    // Peak energy phase
                    const peakProgress = (colorProgress - 0.3) / 0.4;
                    const peakIntensity = Math.sin(peakProgress * Math.PI) * 0.8;
                    colors[index] = 0.6 + peakIntensity * 0.4;
                    colors[index + 1] = 0.5 + peakIntensity * 0.5;
                    colors[index + 2] = 1.0;
                } else {
                    // Gentle transition to final colors
                    const finalProgress = (colorProgress - 0.7) / 0.3;
                    const finalEase = this.ultraSmoothEasing(finalProgress);
                    const targetColor = i % 2 === 0 ? [0.3, 0.4, 0.9] : [0.5, 0.3, 0.8];
                    
                    colors[index] = THREE.MathUtils.lerp(0.8, targetColor[0], finalEase);
                    colors[index + 1] = THREE.MathUtils.lerp(0.8, targetColor[1], finalEase);
                    colors[index + 2] = THREE.MathUtils.lerp(1.0, targetColor[2], finalEase);
                }
                
                // Dynamic size with organic pulsing
                const sizePulse = Math.sin(colorProgress * Math.PI * 3 + particlePhase) * 0.02;
                sizes[i] = this.particleSizes[i] + energyIntensity * 0.04 + sizePulse;
                
            } else {
                // Phase 4: Final Settlement - Perfect arrival
                const phase4Progress = (this.stateProgress - phase3Duration) / (phase4Duration - phase3Duration);
                const settlementEase = this.ultraSmoothEasing(phase4Progress);
                
                // Perfect final positioning
                positions[index] = endX;
                positions[index + 1] = endY;
                positions[index + 2] = endZ;
                
                // Gentle restoration to final twilight palette
                const finalColor = i % 2 === 0 ? [0.3, 0.4, 0.9] : [0.5, 0.3, 0.8];
                colors[index] = THREE.MathUtils.lerp(colors[index], finalColor[0], settlementEase * 0.8);
                colors[index + 1] = THREE.MathUtils.lerp(colors[index + 1], finalColor[1], settlementEase * 0.8);
                colors[index + 2] = THREE.MathUtils.lerp(colors[index + 2], finalColor[2], settlementEase * 0.8);
                
                // Size normalization
                sizes[i] = THREE.MathUtils.lerp(sizes[i], this.particleSizes[i], settlementEase);
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        if (this.stateProgress >= 0.95) {  // Start transition earlier
            if (this.currentState === ANIMATION_STATES.MORPHING) {
                console.log('Ultra-elegant morphing complete, starting dissipation');
                this.transitionToState(ANIMATION_STATES.DISSIPATING);
            }
        }
    }
    
    // Enhanced easing function for elegant transformations
    elegantEasing(t) {
        // Combination of cubic and sine easing for very smooth, natural movement
        const cubic = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const sine = Math.sin(t * Math.PI * 0.5);
        return (cubic * 0.7 + sine * 0.3); // Blend for optimal elegance
    }
    
    // Ultra-smooth easing for the most elegant transitions - FASTER RESPONSE
    ultraSmoothEasing(t) {
        // Faster, more responsive easing
        const smoothstep = t * t * (3 - 2 * t);
        const smootherstep = t * t * t * (t * (t * 6 - 15) + 10);
        
        // More responsive blend
        return smoothstep * 0.6 + smootherstep * 0.4;
    }
    
    // Cubic Bézier interpolation for organic particle paths
    cubicBezierInterpolation(p0, p1, p2, p3, t) {
        const oneMinusT = 1 - t;
        const oneMinusT2 = oneMinusT * oneMinusT;
        const oneMinusT3 = oneMinusT2 * oneMinusT;
        const t2 = t * t;
        const t3 = t2 * t;
        
        return {
            x: oneMinusT3 * p0.x + 3 * oneMinusT2 * t * p1.x + 3 * oneMinusT * t2 * p2.x + t3 * p3.x,
            y: oneMinusT3 * p0.y + 3 * oneMinusT2 * t * p1.y + 3 * oneMinusT * t2 * p2.y + t3 * p3.y,
            z: oneMinusT3 * p0.z + 3 * oneMinusT2 * t * p1.z + 3 * oneMinusT * t2 * p2.z + t3 * p3.z
        };
    }
    
    updateDissipatingState() {
        const duration = STAGE_DURATIONS.DISSIPATING;
        const phaseTime = this.globalTime - (this.phaseStartTime || 0);
        this.stateProgress = Math.min(phaseTime / duration, 1);
        
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // 优雅的多阶段消散效果 - 更加从容的节奏
        const phase1Duration = 0.35; // 先向中心收缩 (0-35%)
        const phase2Duration = 0.65; // 能量爆发扩散 (35-65%)
        const phase3Duration = 1.0;  // 最终消散 (65-100%)
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // 获取基础位置
            const baseX = this.currentPositions.length > 0 ? this.currentPositions[index] : this.positions2[index];
            const baseY = this.currentPositions.length > 0 ? this.currentPositions[index + 1] : this.positions2[index + 1];
            const baseZ = this.currentPositions.length > 0 ? this.currentPositions[index + 2] : this.positions2[index + 2];
            
            // 计算粒子特征
            const distanceFromCenter = Math.sqrt(baseX * baseX + baseY * baseY);
            const normalizedDistance = Math.min(distanceFromCenter / 4, 1);
            const angle = Math.atan2(baseY, baseX);
            const particleSeed = this.particleSeeds[i];
            
            // 错开时间：内部粒子先开始消散 - 更温和的错开
            const staggerDelay = (1 - normalizedDistance) * 0.2;
            const staggeredProgress = Math.max(0, Math.min(1, 
                (this.stateProgress - staggerDelay) / (1 - staggerDelay * 0.3)
            ));
            
            if (staggeredProgress <= phase1Duration) {
                // Phase 1: 收缩聚集 - 所有粒子先向中心收缩
                const phase1Progress = staggeredProgress / phase1Duration;
                const contractProgress = organicEasing.anticipationEasing(phase1Progress);
                
                // 向中心收缩
                const contractionForce = contractProgress * 0.4;
                positions[index] = baseX * (1 - contractionForce);
                positions[index + 1] = baseY * (1 - contractionForce);
                positions[index + 2] = baseZ * (1 - contractionForce);
                
                // 颜色逐渐变亮，准备爆发
                const energyBuildup = contractProgress * 0.6;
                colors[index] = 0.5 + energyBuildup * 0.4;     // 红色增强
                colors[index + 1] = 0.3 + energyBuildup * 0.5; // 绿色增强
                colors[index + 2] = 0.9 + energyBuildup * 0.1; // 蓝色保持
                
                // 大小先稍微增大
                sizes[i] = this.particleSizes[i] * (1 + energyBuildup * 0.2);
                
            } else if (staggeredProgress <= phase2Duration) {
                // Phase 2: 能量爆发 - 粒子向外优雅扩散
                const phase2Progress = (staggeredProgress - phase1Duration) / (phase2Duration - phase1Duration);
                const explosionProgress = organicEasing.springDamped(phase2Progress);
                
                // 多方向扩散：基础径向 + 螺旋 + 随机
                const radialForce = explosionProgress * 1.5;
                const spiralAngle = angle + explosionProgress * Math.PI * 0.5;
                const randomOffset = Math.sin(particleSeed * 43758.5453) * 0.3;
                
                positions[index] = baseX + Math.cos(spiralAngle) * radialForce + randomOffset * explosionProgress;
                positions[index + 1] = baseY + Math.sin(spiralAngle) * radialForce + Math.cos(particleSeed * 12.9898) * randomOffset * explosionProgress;
                positions[index + 2] = baseZ + Math.sin(explosionProgress * Math.PI * 2 + particleSeed * 6.28) * 0.8;
                
                // 绚烂的颜色变化：从亮白到彩虹再到深紫
                const colorPhase = explosionProgress * Math.PI * 2;
                const intensity = Math.sin(explosionProgress * Math.PI) * 0.8;
                
                colors[index] = 0.9 + Math.sin(colorPhase) * intensity * 0.3;
                colors[index + 1] = 0.7 + Math.sin(colorPhase + 2.09) * intensity * 0.4;
                colors[index + 2] = 0.9 + Math.sin(colorPhase + 4.19) * intensity * 0.2;
                
                // 大小变化：先增大后缩小
                const sizePhase = explosionProgress * Math.PI;
                sizes[i] = this.particleSizes[i] * (1 + Math.sin(sizePhase) * 0.5);
                
            } else {
                // Phase 3: 最终消散 - 粒子优雅消失
                const phase3Progress = (staggeredProgress - phase2Duration) / (phase3Duration - phase2Duration);
                const fadeProgress = organicEasing.followThroughEasing(phase3Progress);
                
                // 继续缓慢扩散
                const finalExpansion = 1.5 + fadeProgress * 0.5;
                const finalAngle = angle + 0.5 * Math.PI + fadeProgress * Math.PI * 0.3;
                
                positions[index] = baseX * finalExpansion + Math.cos(finalAngle) * fadeProgress * 0.3;
                positions[index + 1] = baseY * finalExpansion + Math.sin(finalAngle) * fadeProgress * 0.3;
                positions[index + 2] = baseZ + Math.sin(fadeProgress * Math.PI + particleSeed * 3.14) * 0.4;
                
                // 颜色渐变：从彩虹色渐变到深紫再到透明
                const fadeAmount = organicEasing.dissipationFade(fadeProgress);
                const finalColorIntensity = fadeAmount * 0.8;
                
                colors[index] = (0.6 + Math.sin(fadeProgress * Math.PI) * 0.3) * finalColorIntensity;
                colors[index + 1] = (0.4 + Math.cos(fadeProgress * Math.PI) * 0.3) * finalColorIntensity;
                colors[index + 2] = (0.8 + Math.sin(fadeProgress * Math.PI * 0.5) * 0.2) * finalColorIntensity;
                
                // 大小逐渐缩小到0
                sizes[i] = this.particleSizes[i] * fadeAmount;
            }
        }
        
        // 更新几何体
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        // 检查是否完成
        if (this.stateProgress >= 1) {
            console.log('Elegant dissipation complete - all particles vanished');
            this.isAnimating = false;
            
            // 完全隐藏粒子
            this.particles.visible = false;
            
            // 重新显示开始按钮
            setTimeout(() => {
                const startButton = document.getElementById('startButton');
                if (startButton) {
                    startButton.style.display = 'block';
                    startButton.textContent = 'Start Again';
                }
            }, 1000);
        }
    }
    
    transitionToState(newState) {
        // Capture current particle positions before transition
        this.captureCurrentPositions();
        
        this.currentState = newState;
        this.stateProgress = 0;
        
        // Track phase start times for continuous transitions
        const currentTime = this.globalTime;
        switch(newState) {
            case ANIMATION_STATES.CONVERGING:
                this.phaseStartTime = currentTime;
                break;
            case ANIMATION_STATES.X_BREATHING:
                this.phaseStartTime = currentTime;
                break;
            case ANIMATION_STATES.ACTIVATION:
                this.phaseStartTime = currentTime;
                break;
            case ANIMATION_STATES.MORPHING:
                this.phaseStartTime = currentTime;
                break;
            case ANIMATION_STATES.DISSIPATING:
                this.phaseStartTime = currentTime;
                break;
        }
    }
    
    captureCurrentPositions() {
        if (!this.particles || !this.particles.geometry) return;
        const positions = this.particles.geometry.attributes.position.array;
        this.currentPositions = [];
        for (let i = 0; i < positions.length; i++) {
            this.currentPositions[i] = positions[i];
        }
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    setupEventListeners() {
        const startButton = document.getElementById('startButton');
        const infoToggle = document.getElementById('infoToggle');
        const controls = document.getElementById('controls');
        const canvas = this.renderer.domElement;
        
        startButton.addEventListener('click', () => {
            this.startNewAnimationSequence();
        });
        
        // Info toggle functionality
        infoToggle.addEventListener('click', () => {
            controls.classList.toggle('visible');
        });
        
        // Mouse/touch interaction
        const updateMousePosition = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        };
        
        // Mouse events
        canvas.addEventListener('mousemove', (e) => {
            updateMousePosition(e.clientX, e.clientY);
            this.updateMouseForce();
        });
        
        canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDown = true;
            updateMousePosition(e.clientX, e.clientY);
            
            // Add emission point when clicking
            if (this.emissionEnabled) {
                const worldX = this.mouse.x * 4;
                const worldY = this.mouse.y * 4;
                this.addEmissionPoint(worldX, worldY, 0);
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
            this.mouseForce.strength = 0;
        });
        
        // Touch events for mobile
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            updateMousePosition(touch.clientX, touch.clientY);
            this.updateMouseForce();
        });
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.mouse.isDown = true;
            const touch = e.touches[0];
            updateMousePosition(touch.clientX, touch.clientY);
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.mouse.isDown = false;
            this.mouseForce.strength = 0;
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'a':
                    this.attractionMode = !this.attractionMode;
                    console.log('Attraction mode:', this.attractionMode ? 'ON' : 'OFF');
                    break;
                case '1':
                    this.setColorScheme('twilight');
                    break;
                case '2':
                    this.setColorScheme('neon');
                    break;
                case '3':
                    this.setColorScheme('fire');
                    break;
                case '4':
                    this.setColorScheme('forest');
                    break;
                case '5':
                    this.setColorScheme('ocean');
                    break;
                case 'r':
                    this.resetAnimation();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'm':
                    this.toggleAudio();
                    break;
                case 'e':
                    this.toggleEmission();
                    break;
                case 'p':
                    this.togglePerformanceMode();
                    break;
            }
        });
        
        // Mouse wheel for zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoomLevel += e.deltaY * -0.001;
            this.zoomLevel = Math.max(0.5, Math.min(3.0, this.zoomLevel));
            this.camera.position.z = 5 / this.zoomLevel;
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.frameCount++;
        
        // Apply interactive forces and physics when particles exist
        if (this.particles) {
            // Update shader uniforms for time-based effects
            if (this.particles.material.uniforms) {
                this.particles.material.uniforms.time.value = performance.now() * 0.001;
            }
            
            // 大幅减少更新频率
            const shouldUpdate = !this.performanceMode || this.frameCount % 5 === 0;
            
            if (shouldUpdate) {
                // 暂时禁用这些特效以提高性能
                // this.applyInteractiveForces();
                // this.applyAudioReactive();
                // this.updateEmissionSystem();
            }
            
            // 暂时禁用physics以提高性能
            // if (this.currentState === ANIMATION_STATES.DISSIPATING ||
            //     !this.isAnimating) {
            //     if (shouldUpdate) {
            //         this.applyPhysics();
            //     }
            // }
        }
        
        // Update camera for smooth movement
        this.updateCamera();
        
        this.renderer.render(this.scene, this.camera);
    }

    // 新增：改进的数组填充方法
    fillArrayEvenly(array, targetLength) {
        if (array.length >= targetLength) return;
        
        const originalLength = array.length;
        const needed = targetLength - originalLength;
        const step = originalLength / needed;
        
        for (let i = 0; i < needed; i++) {
            const baseIndex = Math.floor(i * step) * 3;
            const offset = (i * step - Math.floor(i * step)) * 3;
            
            // 使用线性插值创建新位置
            const nextIndex = Math.min(baseIndex + 3, originalLength - 3);
            const t = offset / 3;
            
            const x = THREE.MathUtils.lerp(
                array[baseIndex], 
                array[nextIndex], 
                t
            );
            const y = THREE.MathUtils.lerp(
                array[baseIndex + 1], 
                array[nextIndex + 1], 
                t
            );
            const z = THREE.MathUtils.lerp(
                array[baseIndex + 2], 
                array[nextIndex + 2], 
                t
            );
            
            // 添加小的随机偏移，避免完全重叠
            const randomOffset = 0.02;
            array.push(
                x + (Math.random() - 0.5) * randomOffset,
                y + (Math.random() - 0.5) * randomOffset,
                z + (Math.random() - 0.5) * randomOffset
            );
        }
    }

    // 新增：改进的X形状生成方法
    createImprovedXShape() {
        const positions = [];
        const segments = 50; // 减少段数，避免过度密集
        
        // 创建X形状的两条线，使用更均匀的分布
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * 2 - 1; // -1 to 1
            
            // 第一条对角线 (左上到右下)
            const x1 = t * 3;
            const y1 = t * 3;
            positions.push(x1, y1, 0);
            
            // 第二条对角线 (右上到左下)
            const x2 = t * 3;
            const y2 = -t * 3;
            positions.push(x2, y2, 0);
        }
        
        // 添加一些随机点来增加密度，但避免聚集
        const randomPoints = 100;
        for (let i = 0; i < randomPoints; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 1 + Math.random() * 2; // 1-3的半径范围
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // 确保点不会太靠近X的中心
            if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
                positions.push(x, y, 0);
            }
        }
        
        return positions;
    }
    
    // Interactive mouse force calculation
    updateMouseForce() {
        if (!this.mouse.isDown) {
            this.mouseForce.strength *= 0.95; // Gradual decay
            return;
        }
        
        // Convert mouse coordinates to world space
        const mouseWorld = {
            x: this.mouse.x * 4, // Adjust scale to match particle space
            y: this.mouse.y * 4,
            z: 0
        };
        
        this.mouseForce.x = mouseWorld.x;
        this.mouseForce.y = mouseWorld.y;
        this.mouseForce.strength = this.forceStrength;
    }
    
    // Apply interactive forces to particles
    applyInteractiveForces() {
        if (!this.particles || this.mouseForce.strength < 0.001) return;
        
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            const px = positions[index];
            const py = positions[index + 1];
            const pz = positions[index + 2];
            
            // Calculate distance to mouse
            const dx = this.mouseForce.x - px;
            const dy = this.mouseForce.y - py;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.interactionRadius) {
                const influence = 1 - (distance / this.interactionRadius);
                const forceMultiplier = this.attractionMode ? 1 : -1;
                
                // Apply force
                const force = this.mouseForce.strength * influence * forceMultiplier;
                const forceX = (dx / distance) * force;
                const forceY = (dy / distance) * force;
                
                // Update velocities
                this.particleVelocities[index] += forceX;
                this.particleVelocities[index + 1] += forceY;
                
                // Color feedback based on interaction
                const colorIntensity = influence * 0.3;
                colors[index] = Math.min(1, colors[index] + colorIntensity);
                colors[index + 1] = Math.min(1, colors[index + 1] + colorIntensity * 0.5);
                colors[index + 2] = Math.min(1, colors[index + 2] + colorIntensity * 0.2);
            }
        }
        
        this.particles.geometry.attributes.color.needsUpdate = true;
    }
    
    // Enhanced physics simulation
    applyPhysics() {
        if (!this.particles) return;
        
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Apply gravity
            this.particleVelocities[index] += this.gravity.x;
            this.particleVelocities[index + 1] += this.gravity.y;
            this.particleVelocities[index + 2] += this.gravity.z;
            
            // Apply wind force
            this.particleVelocities[index] += this.windForce.x;
            this.particleVelocities[index + 1] += this.windForce.y;
            this.particleVelocities[index + 2] += this.windForce.z;
            
            // Add turbulence
            const turbX = (Math.random() - 0.5) * this.turbulence;
            const turbY = (Math.random() - 0.5) * this.turbulence;
            const turbZ = (Math.random() - 0.5) * this.turbulence;
            
            this.particleVelocities[index] += turbX;
            this.particleVelocities[index + 1] += turbY;
            this.particleVelocities[index + 2] += turbZ;
            
            // Apply velocity damping
            this.particleVelocities[index] *= 0.98;
            this.particleVelocities[index + 1] *= 0.98;
            this.particleVelocities[index + 2] *= 0.98;
            
            // Update positions
            positions[index] += this.particleVelocities[index];
            positions[index + 1] += this.particleVelocities[index + 1];
            positions[index + 2] += this.particleVelocities[index + 2];
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Color scheme management
    setColorScheme(scheme) {
        if (!this.colorSchemes[scheme] || !this.particles) return;
        
        this.colorScheme = scheme;
        const colors = this.particles.geometry.attributes.color.array;
        const [color1, color2] = this.colorSchemes[scheme];
        
        for (let i = 0; i < this.particleCount; i++) {
            const variation = Math.random();
            const color = variation < 0.6 ? color1 : color2;
            
            colors[i * 3] = color[0] + (Math.random() - 0.5) * 0.2;
            colors[i * 3 + 1] = color[1] + (Math.random() - 0.5) * 0.2;
            colors[i * 3 + 2] = color[2] + (Math.random() - 0.5) * 0.2;
        }
        
        this.particles.geometry.attributes.color.needsUpdate = true;
        console.log(`Color scheme changed to: ${scheme}`);
    }
    
    // Animation control methods
    resetAnimation() {
        if (!this.particles) return;

        this.isAnimating = false;
        this.stateProgress = 0;
        this.globalTime = 0;

        // Reset velocities
        for (let i = 0; i < this.particleVelocities.length; i++) {
            this.particleVelocities[i] = 0;
        }

        // Reset positions to spread
        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] = this.spreadPositions[i * 3];
            positions[i * 3 + 1] = this.spreadPositions[i * 3 + 1];
            positions[i * 3 + 2] = this.spreadPositions[i * 3 + 2];
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
        console.log('Animation reset - ready for organic convergence');

        // Start the organic 5-stage animation sequence
        setTimeout(() => {
            this.startNewAnimationSequence();
        }, 500);
    }
    
    togglePause() {
        this.isAnimating = !this.isAnimating;
        if (this.isAnimating) {
            this.animateState();
        }
        console.log('Animation', this.isAnimating ? 'resumed' : 'paused');
    }
    
    // Smooth camera movement
    updateCamera() {
        if (!this.camera) return;
        
        // Smooth camera interpolation
        this.camera.position.x += (this.cameraTarget.x - this.camera.position.x) * this.cameraSpeed;
        this.camera.position.y += (this.cameraTarget.y - this.camera.position.y) * this.cameraSpeed;
        this.camera.position.z += (this.cameraTarget.z - this.camera.position.z) * this.cameraSpeed;
    }
    
    // Audio reactive functionality
    async initAudio() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaStreamSource(stream);
            
            this.analyser.fftSize = 256;
            this.audioData = new Uint8Array(this.analyser.frequencyBinCount);
            source.connect(this.analyser);
            
            this.audioEnabled = true;
            console.log('Audio reactive mode enabled');
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }
    
    toggleAudio() {
        if (!this.audioEnabled) {
            this.initAudio();
        } else {
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
                this.analyser = null;
                this.audioData = null;
            }
            this.audioEnabled = false;
            console.log('Audio reactive mode disabled');
        }
    }
    
    updateAudioData() {
        if (!this.audioEnabled || !this.analyser) return;
        
        this.analyser.getByteFrequencyData(this.audioData);
        
        // Calculate frequency bands
        const bassEnd = Math.floor(this.audioData.length * 0.1);
        const midEnd = Math.floor(this.audioData.length * 0.5);
        
        this.bassFrequency = 0;
        this.midFrequency = 0;
        this.trebleFrequency = 0;
        
        // Bass frequencies (0-10%)
        for (let i = 0; i < bassEnd; i++) {
            this.bassFrequency += this.audioData[i];
        }
        this.bassFrequency /= bassEnd;
        
        // Mid frequencies (10-50%)
        for (let i = bassEnd; i < midEnd; i++) {
            this.midFrequency += this.audioData[i];
        }
        this.midFrequency /= (midEnd - bassEnd);
        
        // Treble frequencies (50-100%)
        for (let i = midEnd; i < this.audioData.length; i++) {
            this.trebleFrequency += this.audioData[i];
        }
        this.trebleFrequency /= (this.audioData.length - midEnd);
        
        // Normalize values
        this.bassFrequency /= 255;
        this.midFrequency /= 255;
        this.trebleFrequency /= 255;
    }
    
    applyAudioReactive() {
        if (!this.audioEnabled || !this.particles) return;
        
        this.updateAudioData();
        
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // Audio-reactive color modulation
        const bassIntensity = this.bassFrequency * 0.5;
        const midIntensity = this.midFrequency * 0.3;
        const trebleIntensity = this.trebleFrequency * 0.2;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Modulate colors based on frequency bands
            const originalColors = this.colorSchemes[this.colorScheme];
            const color = i % 2 === 0 ? originalColors[0] : originalColors[1];
            
            colors[index] = Math.min(1, color[0] + bassIntensity);
            colors[index + 1] = Math.min(1, color[1] + midIntensity);
            colors[index + 2] = Math.min(1, color[2] + trebleIntensity);
            
            // Size modulation based on overall audio intensity
            const audioIntensity = (this.bassFrequency + this.midFrequency + this.trebleFrequency) / 3;
            sizes[i] = this.particleSizes[i] + audioIntensity * 0.1;
        }
        
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        // Camera shake on bass hits
        if (this.bassFrequency > 0.7) {
            this.cameraTarget.x += (Math.random() - 0.5) * 0.1;
            this.cameraTarget.y += (Math.random() - 0.5) * 0.1;
        }
    }
    
    // Particle emission system
    toggleEmission() {
        this.emissionEnabled = !this.emissionEnabled;
        if (!this.emissionEnabled) {
            this.emissionPoints = [];
        }
        console.log('Particle emission:', this.emissionEnabled ? 'enabled' : 'disabled');
    }
    
    addEmissionPoint(x, y, z) {
        if (this.emissionPoints.length >= 10) return; // Max 10 emission points
        
        this.emissionPoints.push({
            x: x,
            y: y,
            z: z,
            life: 3000, // 3 seconds
            particles: []
        });
    }
    
    updateEmissionSystem() {
        if (!this.emissionEnabled || !this.particles) return;
        
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // Update emission points
        for (let i = this.emissionPoints.length - 1; i >= 0; i--) {
            const point = this.emissionPoints[i];
            point.life -= 16; // ~60fps
            
            if (point.life <= 0) {
                this.emissionPoints.splice(i, 1);
                continue;
            }
            
            // Emit new particles
            if (Math.random() < this.emissionRate / 100) {
                this.emitParticle(point);
            }
            
            // Update emitted particles
            for (let j = point.particles.length - 1; j >= 0; j--) {
                const particle = point.particles[j];
                particle.life -= 16;
                
                if (particle.life <= 0) {
                    point.particles.splice(j, 1);
                    continue;
                }
                
                // Update particle position
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.z += particle.vz;
                
                // Apply gravity
                particle.vy -= 0.002;
                
                // Update visual representation if within particle count
                if (particle.index < this.particleCount) {
                    const index = particle.index * 3;
                    positions[index] = particle.x;
                    positions[index + 1] = particle.y;
                    positions[index + 2] = particle.z;
                    
                    // Fade out over time
                    const alpha = particle.life / 2000;
                    colors[index] *= alpha;
                    colors[index + 1] *= alpha;
                    colors[index + 2] *= alpha;
                    
                    sizes[particle.index] = this.particleSizes[particle.index] * alpha;
                }
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
    }
    
    emitParticle(point) {
        // Find available particle slot
        let availableIndex = -1;
        for (let i = 0; i < this.particleCount; i++) {
            let occupied = false;
            for (const emissionPoint of this.emissionPoints) {
                if (emissionPoint.particles.some(p => p.index === i)) {
                    occupied = true;
                    break;
                }
            }
            if (!occupied) {
                availableIndex = i;
                break;
            }
        }
        
        if (availableIndex === -1) return; // No available slots
        
        const velocity = 0.05;
        const angle = Math.random() * Math.PI * 2;
        const elevation = (Math.random() - 0.5) * Math.PI;
        
        point.particles.push({
            index: availableIndex,
            x: point.x,
            y: point.y,
            z: point.z,
            vx: Math.cos(angle) * Math.cos(elevation) * velocity,
            vy: Math.sin(elevation) * velocity,
            vz: Math.sin(angle) * Math.cos(elevation) * velocity,
            life: 2000 // 2 seconds
        });
    }
    
    // Performance optimization methods
    togglePerformanceMode() {
        this.performanceMode = !this.performanceMode;
        
        if (this.performanceMode) {
            // Reduce particle count and quality for better performance
            this.particleCount = Math.floor(this.particleCount * 0.6);
            this.turbulence *= 0.5;
            this.emissionRate = Math.max(1, this.emissionRate * 0.5);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.8, 1));
        } else {
            // Restore original settings
            this.particleCount = Math.floor(this.particleCount / 0.6);
            this.turbulence *= 2;
            this.emissionRate = Math.min(10, this.emissionRate * 2);
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
        
        console.log('Performance mode:', this.performanceMode ? 'enabled' : 'disabled');
        console.log('Particle count adjusted to:', this.particleCount);
    }
    
    getPerformanceStats() {
        return {
            particleCount: this.particleCount,
            emissionPoints: this.emissionPoints.length,
            audioEnabled: this.audioEnabled,
            performanceMode: this.performanceMode,
            frameCount: this.frameCount
        };
    }
}

// 初始化动画
window.addEventListener('load', () => {
    new ParticleAnimation();
});