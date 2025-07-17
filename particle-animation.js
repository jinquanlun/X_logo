// Animation States
const ANIMATION_STATES = {
    INITIAL_SPREAD: 'spread',
    CONVERGING: 'converging', 
    X_BREATHING: 'breathing',
    ACTIVATION: 'activation',
    MORPHING: 'morphing',
    DISSIPATING: 'dissipating'
};

class ParticleAnimation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleCount = 8000;
        
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
        
        // Animation state management
        this.currentState = ANIMATION_STATES.INITIAL_SPREAD;
        this.stateProgress = 0;
        this.globalTime = 0;
        this.isAnimating = false;
        this.loadingComplete = false;
        
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
            // Generate random sphere distribution
            const radius = 8 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            this.spreadPositions.push(x, y, z);
        }
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
        
        // 创建自定义圆形粒子材质
        const vertexShader = `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vSize;
            
            void main() {
                vColor = color;
                vSize = size;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // 设置点的大小，考虑距离衰减 - 更小的缩放
                gl_PointSize = size * 150.0 / -mvPosition.z;
            }
        `;
        
        const fragmentShader = `
            varying vec3 vColor;
            varying float vSize;
            
            void main() {
                // 计算从中心的距离
                vec2 center = gl_PointCoord - vec2(0.5, 0.5);
                float dist = length(center);
                
                // 创建圆形形状 - 平滑边缘
                float alpha = smoothstep(0.5, 0.3, dist);
                
                // 创建径向渐变效果 - 更柔和
                float radialGlow = 1.0 - smoothstep(0.0, 0.45, dist);
                vec3 finalColor = vColor * (0.7 + 0.2 * radialGlow);
                
                // 添加内部光晕效果 - 减少亮度
                float innerGlow = 1.0 - smoothstep(0.0, 0.25, dist);
                finalColor += vec3(innerGlow * 0.15);
                
                gl_FragColor = vec4(finalColor, alpha * 0.7);
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
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
        
        this.isAnimating = true;
        this.currentState = ANIMATION_STATES.CONVERGING;
        this.stateProgress = 0;
        this.globalTime = 0;
        
        console.log('Starting new animation sequence: Converging to X');
        this.animateState();
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
    
    updateConvergingState() {
        const duration = 4000; // Extended for ultra-smooth convergence
        this.stateProgress = Math.min(this.globalTime / duration, 1);
        
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // Multi-phase convergence for maximum elegance
        const phase1Duration = 0.20; // Preparation (0-20%)
        const phase2Duration = 0.85; // Main convergence (20-85%)
        const phase3Duration = 1.0;  // Final alignment (85-100%)
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Current and target positions
            const startX = this.spreadPositions[index];
            const startY = this.spreadPositions[index + 1];
            const startZ = this.spreadPositions[index + 2];
            const endX = this.positions1[index];
            const endY = this.positions1[index + 1];
            const endZ = this.positions1[index + 2];
            
            // Calculate particle characteristics for organic variation
            const distanceToTarget = Math.sqrt(
                (endX - startX) * (endX - startX) + 
                (endY - startY) * (endY - startY) + 
                (endZ - startZ) * (endZ - startZ)
            );
            const normalizedDistance = Math.min(distanceToTarget / 10, 1);
            const particlePhase = this.particlePhases[i];
            const targetDistance = Math.sqrt(endX * endX + endY * endY);
            
            if (this.stateProgress <= phase1Duration) {
                // Phase 1: Preparation - Particles slow down and orient
                const phase1Progress = this.stateProgress / phase1Duration;
                const preparationEase = this.ultraSmoothEasing(phase1Progress);
                
                // Gentle deceleration from random motion
                const decelerationFactor = 1 - preparationEase * 0.3;
                positions[index] = startX;
                positions[index + 1] = startY;
                positions[index + 2] = startZ;
                
                // Subtle color shift to show awakening
                const awakenIntensity = preparationEase * 0.2;
                colors[index] = 0.2 + awakenIntensity;
                colors[index + 1] = 0.2 + awakenIntensity * 0.8;
                colors[index + 2] = 0.6 + awakenIntensity * 0.4;
                
                sizes[i] = this.particleSizes[i] + awakenIntensity * 0.02;
                
            } else if (this.stateProgress <= phase2Duration) {
                // Phase 2: Main Convergence - Organic curved trajectories
                const phase2Progress = (this.stateProgress - phase1Duration) / (phase2Duration - phase1Duration);
                
                // Staggered start times based on distance for wave effect
                const delayFactor = normalizedDistance * 0.3 + (Math.sin(particlePhase) + 1) * 0.1;
                const adjustedProgress = Math.max(0, Math.min(1, (phase2Progress - delayFactor) / (1 - delayFactor * 0.7)));
                
                // Ultra-smooth convergence easing
                const convergenceEase = this.ultraSmoothEasing(adjustedProgress);
                
                // Create elegant curved paths using gravitational attraction simulation
                const attractionStrength = convergenceEase * convergenceEase; // Accelerating attraction
                const directionX = endX - startX;
                const directionY = endY - startY;
                const directionZ = endZ - startZ;
                
                // Add curved trajectory with control points for organic movement
                const midPointX = startX + directionX * 0.5 + Math.sin(particlePhase + Math.PI * 0.5) * distanceToTarget * 0.1;
                const midPointY = startY + directionY * 0.5 + Math.cos(particlePhase + Math.PI * 0.3) * distanceToTarget * 0.1;
                const midPointZ = startZ + directionZ * 0.5 + Math.sin(convergenceEase * Math.PI) * 0.5;
                
                // Quadratic Bézier interpolation for smooth curves
                let currentX, currentY, currentZ;
                if (convergenceEase <= 0.5) {
                    const t = convergenceEase * 2;
                    currentX = THREE.MathUtils.lerp(startX, midPointX, t);
                    currentY = THREE.MathUtils.lerp(startY, midPointY, t);
                    currentZ = THREE.MathUtils.lerp(startZ, midPointZ, t);
                } else {
                    const t = (convergenceEase - 0.5) * 2;
                    currentX = THREE.MathUtils.lerp(midPointX, endX, t);
                    currentY = THREE.MathUtils.lerp(midPointY, endY, t);
                    currentZ = THREE.MathUtils.lerp(midPointZ, endZ, t);
                }
                
                // Add organic flow effects during convergence
                const flowIntensity = Math.sin(convergenceEase * Math.PI) * 0.08 * (1 - convergenceEase);
                const flowAngle = Math.atan2(directionY, directionX) + Math.PI * 0.5;
                const flowX = Math.cos(flowAngle + particlePhase * 0.5) * flowIntensity;
                const flowY = Math.sin(flowAngle + particlePhase * 0.5) * flowIntensity;
                
                positions[index] = currentX + flowX;
                positions[index + 1] = currentY + flowY;
                positions[index + 2] = currentZ;
                
                // Dynamic color transition during convergence
                const convergenceIntensity = Math.sin(convergenceEase * Math.PI) * 0.4;
                const targetColor = i % 2 === 0 ? [0.3, 0.4, 0.9] : [0.5, 0.3, 0.8];
                
                colors[index] = 0.2 + convergenceIntensity + convergenceEase * (targetColor[0] - 0.2) * 0.6;
                colors[index + 1] = 0.2 + convergenceIntensity * 0.8 + convergenceEase * (targetColor[1] - 0.2) * 0.6;
                colors[index + 2] = 0.6 + convergenceIntensity * 0.4 + convergenceEase * (targetColor[2] - 0.6) * 0.6;
                
                // Size variation during convergence
                const sizeVariation = Math.sin(convergenceEase * Math.PI * 2 + particlePhase) * 0.02;
                sizes[i] = this.particleSizes[i] + convergenceIntensity * 0.03 + sizeVariation;
                
            } else {
                // Phase 3: Final Alignment - Perfect positioning
                const phase3Progress = (this.stateProgress - phase2Duration) / (phase3Duration - phase2Duration);
                const alignmentEase = this.ultraSmoothEasing(phase3Progress);
                
                // Perfect final positioning
                positions[index] = endX;
                positions[index + 1] = endY;
                positions[index + 2] = endZ;
                
                // Final color alignment to twilight palette
                const finalColor = i % 2 === 0 ? [0.3, 0.4, 0.9] : [0.5, 0.3, 0.8];
                colors[index] = THREE.MathUtils.lerp(colors[index], finalColor[0], alignmentEase * 0.8);
                colors[index + 1] = THREE.MathUtils.lerp(colors[index + 1], finalColor[1], alignmentEase * 0.8);
                colors[index + 2] = THREE.MathUtils.lerp(colors[index + 2], finalColor[2], alignmentEase * 0.8);
                
                // Size normalization
                sizes[i] = THREE.MathUtils.lerp(sizes[i], this.particleSizes[i], alignmentEase);
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        if (this.stateProgress >= 1) {
            console.log('Ultra-smooth convergence complete, starting breathing phase');
            this.transitionToState(ANIMATION_STATES.X_BREATHING);
        }
    }
    
    updateBreathingState() {
        const duration = 5000; // 5 seconds of breathing
        this.stateProgress = Math.min(this.globalTime / duration, 1);
        
        const positions = this.particles.geometry.attributes.position.array;
        const sizes = this.particles.geometry.attributes.size.array;
        const colors = this.particles.geometry.attributes.color.array;
        
        // Ultra-smooth breathing parameters
        const waveSpeed = 0.0015;  // Even slower for maximum elegance
        const waveIntensity = 0.12;
        const sizeWaveIntensity = 0.04;
        
        // Multiple harmonious wave frequencies
        const primaryWave = this.globalTime * waveSpeed;
        const secondaryWave = this.globalTime * waveSpeed * 1.618; // Golden ratio
        const tertiaryWave = this.globalTime * waveSpeed * 0.618; // Golden ratio complement
        const quaternaryWave = this.globalTime * waveSpeed * 2.618; // Golden ratio squared
        
        // Apply ultra-elegant wave propagation
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Enhanced distance calculations
            const centerX = 0;
            const centerY = 0;
            const particleX = this.positions1[index];
            const particleY = this.positions1[index + 1];
            const distanceFromCenter = Math.sqrt(
                (particleX - centerX) * (particleX - centerX) + 
                (particleY - centerY) * (particleY - centerY)
            );
            
            // Radial and angular components for complex wave patterns
            const radialPhase = distanceFromCenter * 0.6;
            const angularPhase = Math.atan2(particleY, particleX) * 2;
            const individualPhase = this.particlePhases[i];
            
            // Create complex harmonic breathing patterns
            const wave1 = Math.sin(primaryWave + radialPhase + individualPhase);
            const wave2 = Math.sin(secondaryWave + angularPhase + individualPhase * 0.5) * 0.6;
            const wave3 = Math.sin(tertiaryWave + radialPhase * 1.5) * 0.3;
            const wave4 = Math.sin(quaternaryWave + angularPhase * 0.5 + individualPhase * 2) * 0.15;
            
            // Combine waves with ultra-smooth easing
            const combinedWave = wave1 + wave2 + wave3 + wave4;
            const normalizedWave = combinedWave / 2.05;
            const smoothedWave = this.ultraSmoothEasing((normalizedWave + 1) * 0.5) * 2 - 1;
            
            // Distance-based intensity modulation
            const intensityMultiplier = Math.max(0.2, 1 - distanceFromCenter * 0.12);
            const finalIntensity = smoothedWave * waveIntensity * intensityMultiplier;
            
            // Enhanced radial breathing with spiral component
            const angle = Math.atan2(particleY - centerY, particleX - centerX);
            const spiralOffset = Math.sin(primaryWave * 3 + radialPhase) * 0.02;
            const radialX = Math.cos(angle + spiralOffset);
            const radialY = Math.sin(angle + spiralOffset);
            
            // Apply breathing movement with micro-variations
            const microVariationX = Math.sin(individualPhase + primaryWave * 2) * 0.005;
            const microVariationY = Math.cos(individualPhase + primaryWave * 2) * 0.005;
            
            positions[index] = this.positions1[index] + radialX * finalIntensity + microVariationX;
            positions[index + 1] = this.positions1[index + 1] + radialY * finalIntensity + microVariationY;
            positions[index + 2] = this.positions1[index + 2] + finalIntensity * 0.25;
            
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
        
        // Simulate loading complete after breathing
        if (this.stateProgress >= 1) {
            console.log('Ultra-smooth breathing complete, starting activation');
            this.loadingComplete = true;
            this.transitionToState(ANIMATION_STATES.ACTIVATION);
        }
    }
    
    updateActivationState() {
        const duration = 2500; // Extended duration for elegant activation
        this.stateProgress = Math.min(this.globalTime / duration, 1);
        
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // Elegant activation phases
        const phase1Duration = 0.3; // Initial energy surge (0-30%)
        const phase2Duration = 0.6; // Wave propagation (30-90%)
        const phase3Duration = 1.0; // Final stabilization (90-100%)
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Calculate distance from center for radial effects
            const particleX = this.positions1[index];
            const particleY = this.positions1[index + 1];
            const distanceFromCenter = Math.sqrt(particleX * particleX + particleY * particleY);
            const normalizedDistance = Math.min(distanceFromCenter / 4, 1); // Normalize to 0-1
            
            // Radial direction for energy flow
            const angle = Math.atan2(particleY, particleX);
            const radialX = Math.cos(angle);
            const radialY = Math.sin(angle);
            
            if (this.stateProgress <= phase1Duration) {
                // Phase 1: Initial Energy Surge from Center
                const phase1Progress = this.stateProgress / phase1Duration;
                const energySurge = Math.sin(phase1Progress * Math.PI) * 0.8;
                
                // Energy wave travels outward
                const waveRadius = phase1Progress * 5; // Expanding radius
                const waveIntensity = Math.max(0, 1 - Math.abs(distanceFromCenter - waveRadius) * 2);
                
                // Elegant color transition: Twilight -> Bright Purple -> Electric Blue
                const colorIntensity = energySurge * waveIntensity;
                colors[index] = 0.3 + colorIntensity * 0.5; // r: deep purple to bright
                colors[index + 1] = 0.2 + colorIntensity * 0.6; // g: low to medium
                colors[index + 2] = 0.9 + colorIntensity * 0.1; // b: maintain deep blue
                
                // Subtle outward energy movement
                const energyPush = energySurge * waveIntensity * 0.15;
                positions[index] = this.positions1[index] + radialX * energyPush;
                positions[index + 1] = this.positions1[index + 1] + radialY * energyPush;
                positions[index + 2] = this.positions1[index + 2];
                
                // Size pulse with energy wave
                sizes[i] = this.particleSizes[i] + waveIntensity * 0.08;
                
            } else if (this.stateProgress <= phase2Duration) {
                // Phase 2: Elegant Wave Propagation
                const phase2Progress = (this.stateProgress - phase1Duration) / (phase2Duration - phase1Duration);
                
                // Multiple harmonic waves for sophisticated effect
                const fastWave = Math.sin(phase2Progress * Math.PI * 6 + normalizedDistance * 8);
                const mediumWave = Math.sin(phase2Progress * Math.PI * 3 + normalizedDistance * 4) * 0.6;
                const slowWave = Math.sin(phase2Progress * Math.PI * 1.5 + normalizedDistance * 2) * 0.3;
                
                const combinedWave = (fastWave + mediumWave + slowWave) / 1.9;
                const waveIntensity = Math.abs(combinedWave) * (1 - normalizedDistance * 0.3);
                
                // Sophisticated twilight color palette: Deep Purple -> Bright Blue -> Electric Purple
                const twilightPhase = combinedWave * 0.5 + 0.5; // 0 to 1
                const intensity = waveIntensity;
                
                // Create twilight color transitions
                colors[index] = 0.2 + intensity * 0.6 + twilightPhase * 0.3; // r: purple variations
                colors[index + 1] = 0.1 + intensity * 0.4 + Math.sin(twilightPhase * Math.PI) * 0.3; // g: subtle variations
                colors[index + 2] = 0.7 + intensity * 0.3; // b: maintain deep blue base
                
                // Elegant oscillation around X shape
                const oscillationIntensity = waveIntensity * 0.08;
                positions[index] = this.positions1[index] + radialX * oscillationIntensity * Math.sin(phase2Progress * Math.PI * 4);
                positions[index + 1] = this.positions1[index + 1] + radialY * oscillationIntensity * Math.sin(phase2Progress * Math.PI * 4);
                positions[index + 2] = this.positions1[index + 2] + oscillationIntensity * 0.5 * Math.cos(phase2Progress * Math.PI * 4);
                
                // Dynamic size variation
                sizes[i] = this.particleSizes[i] + waveIntensity * 0.1 * Math.sin(phase2Progress * Math.PI * 8);
                
            } else {
                // Phase 3: Elegant Stabilization
                const phase3Progress = (this.stateProgress - phase2Duration) / (phase3Duration - phase2Duration);
                
                // Gradual return to twilight colors with subtle energy remnants
                const energyRemnant = (1 - phase3Progress) * 0.3 * Math.sin(this.globalTime * 0.01 + normalizedDistance * 3);
                const twilightBase = i % 2 === 0 ? 0.6 : 0.4; // Alternate between blue and purple
                
                colors[index] = twilightBase * 0.7 + energyRemnant * 0.3; // r: purple tints
                colors[index + 1] = twilightBase * 0.5 + energyRemnant * 0.2; // g: subtle variations
                colors[index + 2] = 0.8 + energyRemnant * 0.2; // b: maintain deep blue
                
                // Smooth return to original positions
                const returnProgress = this.easeInOutCubic(phase3Progress);
                positions[index] = this.positions1[index];
                positions[index + 1] = this.positions1[index + 1];
                positions[index + 2] = this.positions1[index + 2];
                
                // Size normalization
                sizes[i] = THREE.MathUtils.lerp(
                    this.particleSizes[i] + energyRemnant * 0.02,
                    this.particleSizes[i],
                    returnProgress
                );
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        if (this.stateProgress >= 1) {
            console.log('Elegant activation complete, starting morphing');
            this.transitionToState(ANIMATION_STATES.MORPHING);
        }
    }
    
    updateMorphingState() {
        const duration = 6000; // Extended duration for ultra-smooth morphing
        this.stateProgress = Math.min(this.globalTime / duration, 1);
        
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
            
            // Calculate transformation vectors and distances
            const startX = this.positions1[index];
            const startY = this.positions1[index + 1];
            const startZ = this.positions1[index + 2];
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
        
        if (this.stateProgress >= 1) {
            console.log('Ultra-elegant morphing complete, starting dissipation');
            this.transitionToState(ANIMATION_STATES.DISSIPATING);
        }
    }
    
    // Enhanced easing function for elegant transformations
    elegantEasing(t) {
        // Combination of cubic and sine easing for very smooth, natural movement
        const cubic = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const sine = Math.sin(t * Math.PI * 0.5);
        return (cubic * 0.7 + sine * 0.3); // Blend for optimal elegance
    }
    
    // Ultra-smooth easing for the most elegant transitions
    ultraSmoothEasing(t) {
        // Perfect S-curve with zero velocity at endpoints
        // Uses a combination of smoothstep and improved smoothstep functions
        const smoothstep = t * t * (3 - 2 * t);
        const smootherstep = t * t * t * (t * (t * 6 - 15) + 10);
        
        // Blend for ultimate smoothness
        return smoothstep * 0.3 + smootherstep * 0.7;
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
        const duration = 4000; // 4 seconds to dissipate
        this.stateProgress = Math.min(this.globalTime / duration, 1);
        
        const positions = this.particles.geometry.attributes.position.array;
        const fadeProgress = this.stateProgress;
        
        // Gradually fade and spread particles
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Apply outward velocity
            this.particleVelocities[i * 3] += (Math.random() - 0.5) * 0.01;
            this.particleVelocities[i * 3 + 1] += (Math.random() - 0.5) * 0.01;
            this.particleVelocities[i * 3 + 2] += (Math.random() - 0.5) * 0.01;
            
            positions[index] += this.particleVelocities[i * 3];
            positions[index + 1] += this.particleVelocities[i * 3 + 1];
            positions[index + 2] += this.particleVelocities[i * 3 + 2];
            
            // Fade opacity
            this.particleOpacities[i] = 1 - fadeProgress;
        }
        
        // Update material opacity
        this.particles.material.opacity = 1 - fadeProgress;
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        if (this.stateProgress >= 1) {
            console.log('Animation sequence complete');
            this.isAnimating = false;
        }
    }
    
    transitionToState(newState) {
        this.currentState = newState;
        this.stateProgress = 0;
        this.globalTime = 0;
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
            // Performance optimization - skip some updates in performance mode
            const shouldUpdate = !this.performanceMode || this.frameCount % 2 === 0;
            
            if (shouldUpdate) {
                this.applyInteractiveForces();
                this.applyAudioReactive();
                this.updateEmissionSystem();
            }
            
            // Only apply physics during certain states to avoid interfering with main animation
            if (this.currentState === ANIMATION_STATES.DISSIPATING || 
                !this.isAnimating || 
                this.currentState === ANIMATION_STATES.INITIAL_SPREAD) {
                if (shouldUpdate) {
                    this.applyPhysics();
                }
            }
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
        this.currentState = ANIMATION_STATES.INITIAL_SPREAD;
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
        console.log('Animation reset');
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