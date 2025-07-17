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
            this.particleSizes.push(0.05 + Math.random() * 0.02); // varied sizes
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
        
        // 创建粒子材质 - 优化暮光效果
        const material = new THREE.PointsMaterial({
            size: 0.06, // Slightly larger for better twilight visibility
            vertexColors: true,
            transparent: true,
            opacity: 0.9, // Slight transparency for ethereal effect
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            alphaTest: 0.001 // Better rendering for dark background
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
        const duration = 3000; // 3 seconds to converge
        this.stateProgress = Math.min(this.globalTime / duration, 1);
        
        const easeProgress = this.easeInOutCubic(this.stateProgress);
        const positions = this.particles.geometry.attributes.position.array;
        
        // Converge from spread positions to X shape (positions1)
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            positions[index] = THREE.MathUtils.lerp(
                this.spreadPositions[index],
                this.positions1[index],
                easeProgress
            );
            positions[index + 1] = THREE.MathUtils.lerp(
                this.spreadPositions[index + 1],
                this.positions1[index + 1],
                easeProgress
            );
            positions[index + 2] = THREE.MathUtils.lerp(
                this.spreadPositions[index + 2],
                this.positions1[index + 2],
                easeProgress
            );
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        if (this.stateProgress >= 1) {
            console.log('Convergence complete, starting breathing phase');
            this.transitionToState(ANIMATION_STATES.X_BREATHING);
        }
    }
    
    updateBreathingState() {
        const duration = 5000; // 5 seconds of breathing
        this.stateProgress = Math.min(this.globalTime / duration, 1);
        
        const positions = this.particles.geometry.attributes.position.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // Enhanced wave parameters for elegant breathing
        const waveSpeed = 0.002;  // Slower, more elegant
        const waveIntensity = 0.15;
        const sizeWaveIntensity = 0.03;
        
        // Create multiple wave frequencies for more organic feel
        const primaryWave = this.globalTime * waveSpeed;
        const secondaryWave = this.globalTime * waveSpeed * 1.618; // Golden ratio frequency
        const tertiaryWave = this.globalTime * waveSpeed * 0.5;
        
        // Apply elegant wave propagation
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Calculate distance from center for radial wave effect
            const centerX = 0;
            const centerY = 0;
            const particleX = this.positions1[index];
            const particleY = this.positions1[index + 1];
            const distanceFromCenter = Math.sqrt(
                (particleX - centerX) * (particleX - centerX) + 
                (particleY - centerY) * (particleY - centerY)
            );
            
            // Create radial wave propagation from center outward
            const radialPhase = distanceFromCenter * 0.8; // Wave frequency based on distance
            const individualPhase = this.particlePhases[i];
            
            // Combine multiple wave frequencies for organic movement
            const primaryBreathing = Math.sin(primaryWave + radialPhase + individualPhase);
            const secondaryBreathing = Math.sin(secondaryWave + radialPhase * 0.5) * 0.4;
            const tertiaryBreathing = Math.sin(tertiaryWave + individualPhase * 2) * 0.2;
            
            const combinedWave = primaryBreathing + secondaryBreathing + tertiaryBreathing;
            const normalizedWave = combinedWave / 1.6; // Normalize amplitude
            
            // Apply wave intensity that decreases with distance (stronger at center)
            const intensityMultiplier = Math.max(0.3, 1 - distanceFromCenter * 0.15);
            const finalIntensity = normalizedWave * waveIntensity * intensityMultiplier;
            
            // Calculate radial direction for outward/inward movement
            const angle = Math.atan2(particleY - centerY, particleX - centerX);
            const radialX = Math.cos(angle);
            const radialY = Math.sin(angle);
            
            // Apply elegant radial breathing movement
            positions[index] = this.positions1[index] + radialX * finalIntensity;
            positions[index + 1] = this.positions1[index + 1] + radialY * finalIntensity;
            positions[index + 2] = this.positions1[index + 2] + finalIntensity * 0.3;
            
            // Add size breathing for extra elegance
            const sizeWave = Math.sin(primaryWave + radialPhase * 0.3 + individualPhase) * sizeWaveIntensity;
            sizes[i] = this.particleSizes[i] + sizeWave;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        // Simulate loading complete after breathing
        if (this.stateProgress >= 1) {
            console.log('Loading complete, starting activation');
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
                sizes[i] = this.particleSizes[i] + waveIntensity * 0.04;
                
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
                sizes[i] = this.particleSizes[i] + waveIntensity * 0.05 * Math.sin(phase2Progress * Math.PI * 8);
                
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
        const duration = 4000; // Extended duration for elegant morphing
        this.stateProgress = Math.min(this.globalTime / duration, 1);
        
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // Elegant morphing phases
        const phase1Duration = 0.25; // Preparation phase (0-25%)
        const phase2Duration = 0.75; // Active transformation (25-75%)
        const phase3Duration = 1.0;  // Settlement phase (75-100%)
        
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
            
            // Calculate distance from center for wave effects
            const particleX = (startX + endX) * 0.5; // Average position for center calculation
            const particleY = (startY + endY) * 0.5;
            const distanceFromCenter = Math.sqrt(particleX * particleX + particleY * particleY);
            const normalizedDistance = Math.min(distanceFromCenter / 4, 1);
            
            if (this.stateProgress <= phase1Duration) {
                // Phase 1: Elegant Preparation - Particles gather energy for transformation
                const phase1Progress = this.stateProgress / phase1Duration;
                const preparationIntensity = Math.sin(phase1Progress * Math.PI) * 0.6;
                
                // Subtle anticipation movement - slight compression toward center
                const compressionFactor = preparationIntensity * 0.05;
                const compressionX = startX * (1 - compressionFactor);
                const compressionY = startY * (1 - compressionFactor);
                
                positions[index] = compressionX;
                positions[index + 1] = compressionY;
                positions[index + 2] = startZ;
                
                // Energy gathering color shift: Twilight -> Bright Purple
                const energyGlow = preparationIntensity * 0.4;
                colors[index] = 0.3 + energyGlow * 0.5; // r: purple enhancement
                colors[index + 1] = 0.2 + energyGlow * 0.3; // g: subtle increase
                colors[index + 2] = 0.8 + energyGlow * 0.2; // b: maintain blue base
                
                // Size preparation - slight growth
                sizes[i] = this.particleSizes[i] + preparationIntensity * 0.02;
                
            } else if (this.stateProgress <= phase2Duration) {
                // Phase 2: Active Transformation - Elegant wave-based morphing
                const phase2Progress = (this.stateProgress - phase1Duration) / (phase2Duration - phase1Duration);
                
                // Create staggered wave transformation based on distance and individual timing
                const waveDelay = normalizedDistance * 0.3 + this.particlePhases[i] * 0.1;
                const adjustedProgress = Math.max(0, Math.min(1, (phase2Progress - waveDelay) / (1 - waveDelay)));
                
                // Use adjusted progress directly for natural movement
                
                // Add curved path interpolation for more organic movement
                const curveMidX = (startX + endX) * 0.5 + (Math.random() - 0.5) * transformDistance * 0.2;
                const curveMidY = (startY + endY) * 0.5 + (Math.random() - 0.5) * transformDistance * 0.2;
                const curveMidZ = (startZ + endZ) * 0.5 + Math.sin(adjustedProgress * Math.PI) * 0.3;
                
                // Bezier curve interpolation for smooth, elegant paths
                let currentX, currentY, currentZ;
                if (adjustedProgress <= 0.5) {
                    const t = adjustedProgress * 2;
                    currentX = THREE.MathUtils.lerp(startX, curveMidX, t);
                    currentY = THREE.MathUtils.lerp(startY, curveMidY, t);
                    currentZ = THREE.MathUtils.lerp(startZ, curveMidZ, t);
                } else {
                    const t = (adjustedProgress - 0.5) * 2;
                    currentX = THREE.MathUtils.lerp(curveMidX, endX, t);
                    currentY = THREE.MathUtils.lerp(curveMidY, endY, t);
                    currentZ = THREE.MathUtils.lerp(curveMidZ, endZ, t);
                }
                
                // Add transformation flow effects
                const flowIntensity = Math.sin(adjustedProgress * Math.PI) * 0.1;
                const flowDirection = Math.atan2(deltaY, deltaX);
                const flowX = Math.cos(flowDirection) * flowIntensity;
                const flowY = Math.sin(flowDirection) * flowIntensity;
                
                positions[index] = currentX + flowX;
                positions[index + 1] = currentY + flowY;
                positions[index + 2] = currentZ;
                
                // Dynamic color transformation: Purple -> Electric Blue -> Deep Twilight
                const colorPhase = adjustedProgress * Math.PI;
                const transformationGlow = Math.sin(colorPhase) * 0.4;
                
                if (adjustedProgress <= 0.5) {
                    // Purple to Electric Blue
                    const blueTransition = adjustedProgress * 2;
                    colors[index] = 0.5 - blueTransition * 0.3; // r: reduce purple
                    colors[index + 1] = 0.3 + blueTransition * 0.4; // g: increase for blue
                    colors[index + 2] = 0.8 + blueTransition * 0.2; // b: enhance blue
                } else {
                    // Electric Blue to Deep Twilight
                    const twilightTransition = (adjustedProgress - 0.5) * 2;
                    colors[index] = 0.2 + twilightTransition * 0.4; // r: return to purple
                    colors[index + 1] = 0.7 - twilightTransition * 0.4; // g: reduce for twilight
                    colors[index + 2] = 1.0; // b: maintain deep blue
                }
                
                // Add transformation energy to colors
                colors[index] += transformationGlow * 0.2;
                colors[index + 1] += transformationGlow * 0.15;
                colors[index + 2] += transformationGlow * 0.1;
                
                // Dynamic size during transformation
                const sizeFlow = Math.sin(adjustedProgress * Math.PI * 2) * 0.03;
                sizes[i] = this.particleSizes[i] + transformationGlow * 0.04 + sizeFlow;
                
            } else {
                // Phase 3: Elegant Settlement - Smooth arrival at final positions
                const phase3Progress = (this.stateProgress - phase2Duration) / (phase3Duration - phase2Duration);
                const settlementEase = this.easeInOutCubic(phase3Progress);
                
                // Final position refinement
                positions[index] = endX;
                positions[index + 1] = endY;
                positions[index + 2] = endZ;
                
                // Gentle color restoration to twilight colors
                const colorRestoration = settlementEase;
                const finalTwilight = i % 2 === 0 ? [0.3, 0.4, 0.9] : [0.5, 0.3, 0.8]; // Alternate blue/purple
                colors[index] = THREE.MathUtils.lerp(colors[index], finalTwilight[0], colorRestoration * 0.6);
                colors[index + 1] = THREE.MathUtils.lerp(colors[index + 1], finalTwilight[1], colorRestoration * 0.6);
                colors[index + 2] = THREE.MathUtils.lerp(colors[index + 2], finalTwilight[2], colorRestoration * 0.6);
                
                // Size normalization
                sizes[i] = THREE.MathUtils.lerp(sizes[i], this.particleSizes[i], settlementEase);
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        if (this.stateProgress >= 1) {
            console.log('Elegant morphing complete, starting dissipation');
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
        document.getElementById('startButton').addEventListener('click', () => {
            this.startNewAnimationSequence();
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 移除旋转，让粒子保持静止直到动画开始
        // if (this.particles) {
        //     this.particles.rotation.z += 0.001;
        // }
        
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
}

// 初始化动画
window.addEventListener('load', () => {
    new ParticleAnimation();
});