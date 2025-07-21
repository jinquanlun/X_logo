// 5-Stage Organic Animation System - Sophisticated and Soulful
const ANIMATION_STATES = {
    CONVERGING: 'converging',      // Stage 1: Particle Convergence to X
    X_BREATHING: 'breathing',      // Stage 2: Particle Breathing
    ACTIVATION: 'activation',      // Stage 3: Particle Activation
    MORPHING: 'morphing',         // Stage 4: Particle Transformation
    DISSIPATING: 'dissipating'    // Stage 5: Particle Dissipation
};

// === INTELLIGENT DEVICE ADAPTATION SYSTEM ===

// Device Intelligence - Smart device detection and analysis
class DeviceIntelligence {
    constructor() {
        this.deviceProfile = this.analyzeDevice();
        this.performanceBenchmark = null;
        this.runQuickBenchmark();
    }

    analyzeDevice() {
        const profile = {
            // Basic device info
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            devicePixelRatio: window.devicePixelRatio || 1,
            
            // Screen characteristics
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            
            // Device type detection
            isMobile: this.detectMobile(),
            isTablet: this.detectTablet(),
            isDesktop: !this.detectMobile() && !this.detectTablet(),
            
            // Hardware estimates
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            memoryEstimate: this.estimateMemory(),
            
            // Network info
            connectionType: this.getConnectionType(),
            
            // Browser capabilities
            webglSupport: this.checkWebGLSupport(),
            touchSupport: 'ontouchstart' in window,
            
            // Power characteristics
            batteryAPI: 'getBattery' in navigator,
            lowPowerMode: this.detectLowPowerMode()
        };

        profile.deviceClass = this.classifyDevice(profile);
        return profile;
    }

    detectMobile() {
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const screenSize = window.screen.width < 768;
        const touchOnly = 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches;
        return mobileRegex.test(navigator.userAgent) || screenSize || touchOnly;
    }

    detectTablet() {
        const tabletRegex = /iPad|Android.*(?!.*Mobile)/i;
        const screenSize = window.screen.width >= 768 && window.screen.width < 1024;
        return tabletRegex.test(navigator.userAgent) || screenSize;
    }

    estimateMemory() {
        // Estimate based on device characteristics
        if (navigator.deviceMemory) return navigator.deviceMemory;
        
        const { devicePixelRatio, hardwareConcurrency } = this.deviceProfile || {};
        const screenPixels = window.screen.width * window.screen.height;
        
        // Heuristic estimation
        if (screenPixels > 2000000 && hardwareConcurrency >= 8) return 8; // High-end
        if (screenPixels > 1000000 && hardwareConcurrency >= 4) return 4; // Mid-range
        if (hardwareConcurrency >= 2) return 2; // Low-end
        return 1; // Very low-end
    }

    getConnectionType() {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return { effectiveType: 'unknown' };
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (!gl) return { supported: false };

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return {
                supported: true,
                version: gl.getParameter(gl.VERSION),
                renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
                vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE)
            };
        } catch (e) {
            return { supported: false, error: e.message };
        }
    }

    detectLowPowerMode() {
        // Detect various indicators of low power mode
        const indicators = [
            window.devicePixelRatio < 2 && this.detectMobile(),
            navigator.hardwareConcurrency <= 2,
            window.screen.width * window.screen.height < 800000
        ];
        return indicators.filter(Boolean).length >= 2;
    }

    classifyDevice(profile) {
        const score = this.calculateDeviceScore(profile);
        
        if (score >= 90) return 'flagship'; // Top-tier devices
        if (score >= 70) return 'high'; // High-end devices
        if (score >= 50) return 'medium'; // Mid-range devices
        if (score >= 30) return 'low'; // Low-end devices
        return 'minimal'; // Very low-end devices
    }

    calculateDeviceScore(profile) {
        let score = 0;
        
        // Base device type scoring
        if (profile.isDesktop) score += 40;
        else if (profile.isTablet) score += 25;
        else if (profile.isMobile) score += 15;
        
        // Hardware scoring
        score += Math.min(profile.hardwareConcurrency * 5, 25);
        score += Math.min(profile.memoryEstimate * 5, 20);
        
        // Screen scoring
        const screenPixels = profile.screenWidth * profile.screenHeight;
        if (screenPixels > 2000000) score += 15;
        else if (screenPixels > 1000000) score += 10;
        else if (screenPixels > 500000) score += 5;
        
        // WebGL support
        if (profile.webglSupport.supported) score += 10;
        
        // Pixel ratio (can indicate device quality)
        if (profile.devicePixelRatio >= 3) score += 5;
        else if (profile.devicePixelRatio >= 2) score += 3;
        
        return Math.min(score, 100);
    }

    runQuickBenchmark() {
        // Quick performance benchmark to validate device classification
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const gl = canvas.getContext('webgl');
        
        if (!gl) {
            this.performanceBenchmark = { score: 0, reliable: false };
            return;
        }

        const startTime = performance.now();
        
        // Simple rendering test
        const vertices = new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]);
        
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        // Simple vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `);
        gl.compileShader(vertexShader);
        
        // Simple fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `);
        gl.compileShader(fragmentShader);
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        
        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        // Render test
        for (let i = 0; i < 100; i++) {
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        gl.finish();
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        this.performanceBenchmark = {
            renderTime,
            score: Math.max(0, 100 - renderTime * 2), // Convert to 0-100 score
            reliable: true
        };
        
        console.log(`📊 Device benchmark: ${renderTime.toFixed(2)}ms (Score: ${this.performanceBenchmark.score.toFixed(1)})`);
    }

    getOptimalConfig() {
        const { deviceClass } = this.deviceProfile;
        const benchmark = this.performanceBenchmark?.score || 50;
        
        // Adjust device class based on benchmark if needed
        let adjustedClass = deviceClass;
        if (benchmark < 30 && deviceClass !== 'minimal') {
            adjustedClass = this.downgradeClass(deviceClass);
        } else if (benchmark > 80 && deviceClass !== 'flagship') {
            adjustedClass = this.upgradeClass(deviceClass);
        }
        
        return {
            deviceClass: adjustedClass,
            profile: this.deviceProfile,
            benchmark: this.performanceBenchmark
        };
    }

    downgradeClass(currentClass) {
        const classes = ['minimal', 'low', 'medium', 'high', 'flagship'];
        const currentIndex = classes.indexOf(currentClass);
        return classes[Math.max(0, currentIndex - 1)];
    }

    upgradeClass(currentClass) {
        const classes = ['minimal', 'low', 'medium', 'high', 'flagship'];
        const currentIndex = classes.indexOf(currentClass);
        return classes[Math.min(classes.length - 1, currentIndex + 1)];
    }
}

// Quality Manager - Intelligent quality level management
class QualityManager {
    constructor(deviceConfig) {
        this.deviceConfig = deviceConfig;
        this.currentQuality = this.determineInitialQuality();
        this.qualityPresets = this.defineQualityPresets();
        this.adaptiveSettings = {
            enabled: true,
            targetFPS: this.getTargetFPS(),
            fpsHistory: [],
            lastAdjustment: 0,
            adjustmentCooldown: 2000 // 2 seconds between adjustments
        };
    }

    defineQualityPresets() {
        return {
            flagship: {
                particleCount: 2500,
                particleSize: 1.0,
                trailLength: 20,
                updateFrequency: 1, // Every frame
                renderScale: 1.0,
                antialiasing: true,
                complexShaders: true,
                godRaysIntensity: 0.8,
                emotionalResponseLevel: 'ultra',
                environmentalAdaptation: true,
                additiveBlending: true,
                depthTesting: true
            },
            high: {
                particleCount: 2000,
                particleSize: 0.9,
                trailLength: 15,
                updateFrequency: 1,
                renderScale: 1.0,
                antialiasing: true,
                complexShaders: true,
                godRaysIntensity: 0.6,
                emotionalResponseLevel: 'high',
                environmentalAdaptation: true,
                additiveBlending: true,
                depthTesting: true
            },
            medium: {
                particleCount: 1500,
                particleSize: 0.8,
                trailLength: 10,
                updateFrequency: 1,
                renderScale: 0.9,
                antialiasing: true,
                complexShaders: false,
                godRaysIntensity: 0.4,
                emotionalResponseLevel: 'medium',
                environmentalAdaptation: false,
                additiveBlending: true,
                depthTesting: false
            },
            low: {
                particleCount: 1000,
                particleSize: 0.7,
                trailLength: 8,
                updateFrequency: 2, // Every 2 frames
                renderScale: 0.8,
                antialiasing: false,
                complexShaders: false,
                godRaysIntensity: 0.2,
                emotionalResponseLevel: 'basic',
                environmentalAdaptation: false,
                additiveBlending: false,
                depthTesting: false
            },
            minimal: {
                particleCount: 600,
                particleSize: 0.6,
                trailLength: 5,
                updateFrequency: 3, // Every 3 frames
                renderScale: 0.7,
                antialiasing: false,
                complexShaders: false,
                godRaysIntensity: 0.0,
                emotionalResponseLevel: 'disabled',
                environmentalAdaptation: false,
                additiveBlending: false,
                depthTesting: false
            }
        };
    }

    determineInitialQuality() {
        const { deviceClass, profile } = this.deviceConfig;
        
        // Force lower quality on mobile devices for battery life
        if (profile.isMobile) {
            const mobileMapping = {
                'flagship': 'high',
                'high': 'medium',
                'medium': 'low',
                'low': 'minimal',
                'minimal': 'minimal'
            };
            return mobileMapping[deviceClass] || 'minimal';
        }
        
        return deviceClass;
    }

    getTargetFPS() {
        if (this.deviceConfig.profile.isMobile) return 30; // Mobile target
        return 60; // Desktop target
    }

    getCurrentSettings() {
        return this.qualityPresets[this.currentQuality];
    }

    adjustQualityBasedOnPerformance(currentFPS) {
        if (!this.adaptiveSettings.enabled) return false;
        
        const now = performance.now();
        if (now - this.adaptiveSettings.lastAdjustment < this.adaptiveSettings.adjustmentCooldown) {
            return false;
        }
        
        this.adaptiveSettings.fpsHistory.push(currentFPS);
        if (this.adaptiveSettings.fpsHistory.length > 10) {
            this.adaptiveSettings.fpsHistory.shift();
        }
        
        if (this.adaptiveSettings.fpsHistory.length < 5) return false;
        
        const avgFPS = this.adaptiveSettings.fpsHistory.reduce((a, b) => a + b) / this.adaptiveSettings.fpsHistory.length;
        const targetFPS = this.adaptiveSettings.targetFPS;
        
        let qualityChanged = false;
        
        // Downgrade if performance is poor
        if (avgFPS < targetFPS * 0.8) {
            const newQuality = this.downgradeQuality();
            if (newQuality !== this.currentQuality) {
                console.log(`📉 Quality downgraded: ${this.currentQuality} → ${newQuality} (FPS: ${avgFPS.toFixed(1)})`);
                this.currentQuality = newQuality;
                qualityChanged = true;
            }
        }
        // Upgrade if performance is good and we're not at max quality
        else if (avgFPS > targetFPS * 1.1 && this.currentQuality !== 'flagship') {
            const newQuality = this.upgradeQuality();
            if (newQuality !== this.currentQuality) {
                console.log(`📈 Quality upgraded: ${this.currentQuality} → ${newQuality} (FPS: ${avgFPS.toFixed(1)})`);
                this.currentQuality = newQuality;
                qualityChanged = true;
            }
        }
        
        if (qualityChanged) {
            this.adaptiveSettings.lastAdjustment = now;
            this.adaptiveSettings.fpsHistory = []; // Reset history after adjustment
        }
        
        return qualityChanged;
    }

    downgradeQuality() {
        const levels = ['minimal', 'low', 'medium', 'high', 'flagship'];
        const currentIndex = levels.indexOf(this.currentQuality);
        return levels[Math.max(0, currentIndex - 1)];
    }

    upgradeQuality() {
        const levels = ['minimal', 'low', 'medium', 'high', 'flagship'];
        const currentIndex = levels.indexOf(this.currentQuality);
        return levels[Math.min(levels.length - 1, currentIndex + 1)];
    }

    forceQuality(quality) {
        if (this.qualityPresets[quality]) {
            console.log(`🎛️ Quality manually set to: ${quality}`);
            this.currentQuality = quality;
            return true;
        }
        return false;
    }

    toggleAdaptiveQuality() {
        this.adaptiveSettings.enabled = !this.adaptiveSettings.enabled;
        console.log(`🔄 Adaptive quality: ${this.adaptiveSettings.enabled ? 'enabled' : 'disabled'}`);
        return this.adaptiveSettings.enabled;
    }
}

// Mobile Optimizer - Specialized mobile device optimizations
class MobileOptimizer {
    constructor(deviceProfile) {
        this.deviceProfile = deviceProfile;
        this.isActive = deviceProfile.isMobile || deviceProfile.isTablet;
        this.touchState = {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            velocity: { x: 0, y: 0 },
            lastTime: 0
        };
        this.batteryOptimization = {
            enabled: false,
            lowBatteryThreshold: 0.2,
            backgroundPaused: false
        };
        
        if (this.isActive) {
            this.initializeMobileOptimizations();
        }
    }

    initializeMobileOptimizations() {
        // Battery API integration
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.setupBatteryOptimization(battery);
            });
        }
        
        // Page visibility API for background optimization
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Enhanced touch handling
        this.setupEnhancedTouchHandling();
        
        // Orientation change handling
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 100);
        });
        
        // Memory pressure handling
        this.setupMemoryPressureHandling();
    }

    setupBatteryOptimization(battery) {
        const checkBatteryStatus = () => {
            const batteryLevel = battery.level;
            const isCharging = battery.charging;
            
            if (batteryLevel < this.batteryOptimization.lowBatteryThreshold && !isCharging) {
                if (!this.batteryOptimization.enabled) {
                    console.log('🔋 Low battery detected, enabling power saving mode');
                    this.enablePowerSavingMode();
                }
            } else if (this.batteryOptimization.enabled && (batteryLevel > 0.5 || isCharging)) {
                console.log('🔋 Battery level restored, disabling power saving mode');
                this.disablePowerSavingMode();
            }
        };
        
        // Check immediately and on battery events
        checkBatteryStatus();
        battery.addEventListener('levelchange', checkBatteryStatus);
        battery.addEventListener('chargingchange', checkBatteryStatus);
    }

    enablePowerSavingMode() {
        this.batteryOptimization.enabled = true;
        // This will be used by the animation system to reduce effects
        console.log('📱 Power saving mode activated');
    }

    disablePowerSavingMode() {
        this.batteryOptimization.enabled = false;
        console.log('📱 Power saving mode deactivated');
    }

    setupEnhancedTouchHandling() {
        let touchStartTime = 0;
        
        // Passive touch listeners for better performance
        document.addEventListener('touchstart', (e) => {
            this.touchState.active = true;
            this.touchState.startX = e.touches[0].clientX;
            this.touchState.startY = e.touches[0].clientY;
            this.touchState.currentX = this.touchState.startX;
            this.touchState.currentY = this.touchState.startY;
            this.touchState.lastTime = performance.now();
            touchStartTime = this.touchState.lastTime;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (this.touchState.active) {
                const now = performance.now();
                const deltaTime = now - this.touchState.lastTime;
                
                const newX = e.touches[0].clientX;
                const newY = e.touches[0].clientY;
                
                // Calculate velocity
                if (deltaTime > 0) {
                    this.touchState.velocity.x = (newX - this.touchState.currentX) / deltaTime;
                    this.touchState.velocity.y = (newY - this.touchState.currentY) / deltaTime;
                }
                
                this.touchState.currentX = newX;
                this.touchState.currentY = newY;
                this.touchState.lastTime = now;
                
                // Prevent default to avoid scrolling
                if (this.shouldPreventDefault(e)) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            const touchDuration = performance.now() - touchStartTime;
            const distance = Math.sqrt(
                Math.pow(this.touchState.currentX - this.touchState.startX, 2) +
                Math.pow(this.touchState.currentY - this.touchState.startY, 2)
            );
            
            // Detect gesture types
            if (touchDuration < 200 && distance < 10) {
                this.handleTap(this.touchState.currentX, this.touchState.currentY);
            } else if (distance > 50) {
                this.handleSwipe(
                    this.touchState.startX, this.touchState.startY,
                    this.touchState.currentX, this.touchState.currentY,
                    this.touchState.velocity
                );
            }
            
            this.touchState.active = false;
            this.touchState.velocity = { x: 0, y: 0 };
        }, { passive: true });
    }

    shouldPreventDefault(e) {
        // Prevent default for touches in the animation area
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            return (
                touch.clientX >= rect.left &&
                touch.clientX <= rect.right &&
                touch.clientY >= rect.top &&
                touch.clientY <= rect.bottom
            );
        }
        return false;
    }

    handleTap(x, y) {
        // Convert to normalized coordinates
        const normalizedX = (x / window.innerWidth) * 2 - 1;
        const normalizedY = -(y / window.innerHeight) * 2 + 1;
        
        console.log(`👆 Tap detected at (${normalizedX.toFixed(2)}, ${normalizedY.toFixed(2)})`);
        // This will be used by the animation system for interaction
    }

    handleSwipe(startX, startY, endX, endY, velocity) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        console.log(`👉 Swipe detected: distance=${distance.toFixed(0)}, angle=${(angle * 180 / Math.PI).toFixed(0)}°`);
        // This will be used by the animation system for gestural interaction
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.batteryOptimization.backgroundPaused = true;
            console.log('📱 App backgrounded, pausing intensive operations');
        } else {
            this.batteryOptimization.backgroundPaused = false;
            console.log('📱 App foregrounded, resuming operations');
        }
    }

    handleOrientationChange() {
        console.log('📱 Orientation changed, recalculating layout');
        // Trigger resize and recalculation
        window.dispatchEvent(new Event('resize'));
    }

    setupMemoryPressureHandling() {
        // Monitor for memory pressure indicators
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                const memoryPressure = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
                
                if (memoryPressure > 0.8) {
                    console.log('📱 High memory pressure detected, triggering cleanup');
                    this.triggerMemoryCleanup();
                }
            }, 5000);
        }
    }

    triggerMemoryCleanup() {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clear any cached data
        console.log('🗑️ Memory cleanup triggered');
    }

    getMobileOptimizedSettings() {
        if (!this.isActive) return {};
        
        const baseOptimizations = {
            reducedParticleCount: true,
            simplifiedShaders: true,
            reducedUpdateFrequency: true,
            disableComplexEffects: true
        };
        
        if (this.batteryOptimization.enabled) {
            return {
                ...baseOptimizations,
                ultraLowPower: true,
                reducedFrameRate: true,
                minimalistEffects: true
            };
        }
        
        if (this.batteryOptimization.backgroundPaused) {
            return {
                ...baseOptimizations,
                pauseAnimation: true
            };
        }
        
        return baseOptimizations;
    }

    getTouchState() {
        return { ...this.touchState };
    }

    getPowerSavingState() {
        return {
            enabled: this.batteryOptimization.enabled,
            backgroundPaused: this.batteryOptimization.backgroundPaused
        };
    }
}

// Performance Monitor - Real-time performance tracking and optimization
class PerformanceMonitor {
    constructor(targetFPS = 60) {
        this.targetFPS = targetFPS;
        this.frameData = {
            times: [],
            maxSamples: 60,
            currentFPS: 0,
            averageFPS: 0,
            minFPS: Infinity,
            maxFPS: 0
        };
        this.performanceMetrics = {
            renderTime: 0,
            updateTime: 0,
            totalTime: 0,
            gpuTime: 0
        };
        this.lastFrameTime = performance.now();
        this.adaptiveSettings = {
            enabled: true,
            aggressive: false,
            smoothingFactor: 0.95
        };
        this.thermalState = {
            throttleDetected: false,
            baselinePerformance: null,
            degradationThreshold: 0.7
        };
    }

    recordFrame() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;
        
        // Record frame time
        this.frameData.times.push(deltaTime);
        if (this.frameData.times.length > this.frameData.maxSamples) {
            this.frameData.times.shift();
        }
        
        // Calculate FPS metrics
        this.calculateFPSMetrics();
        
        // Detect thermal throttling
        this.detectThermalThrottling();
        
        return {
            fps: this.frameData.currentFPS,
            frameTime: deltaTime
        };
    }

    calculateFPSMetrics() {
        if (this.frameData.times.length === 0) return;
        
        const recent = this.frameData.times.slice(-10);
        const avgFrameTime = recent.reduce((a, b) => a + b) / recent.length;
        this.frameData.currentFPS = 1000 / avgFrameTime;
        
        // Overall average
        const totalAvg = this.frameData.times.reduce((a, b) => a + b) / this.frameData.times.length;
        this.frameData.averageFPS = 1000 / totalAvg;
        
        // Min/Max tracking
        this.frameData.minFPS = Math.min(this.frameData.minFPS, this.frameData.currentFPS);
        this.frameData.maxFPS = Math.max(this.frameData.maxFPS, this.frameData.currentFPS);
    }

    detectThermalThrottling() {
        // Establish baseline if not set
        if (!this.thermalState.baselinePerformance && this.frameData.times.length >= 30) {
            this.thermalState.baselinePerformance = this.frameData.averageFPS;
            console.log(`🌡️ Baseline performance established: ${this.thermalState.baselinePerformance.toFixed(1)} FPS`);
            return;
        }
        
        // Check for throttling
        if (this.thermalState.baselinePerformance) {
            const performanceRatio = this.frameData.averageFPS / this.thermalState.baselinePerformance;
            
            if (performanceRatio < this.thermalState.degradationThreshold && !this.thermalState.throttleDetected) {
                this.thermalState.throttleDetected = true;
                console.log(`🌡️ Thermal throttling detected (${(performanceRatio * 100).toFixed(1)}% of baseline)`);
            } else if (performanceRatio > 0.9 && this.thermalState.throttleDetected) {
                this.thermalState.throttleDetected = false;
                console.log('🌡️ Thermal throttling resolved');
            }
        }
    }

    startFrameTiming() {
        this.performanceMetrics.frameStartTime = performance.now();
    }

    endFrameTiming() {
        if (this.performanceMetrics.frameStartTime) {
            this.performanceMetrics.totalTime = performance.now() - this.performanceMetrics.frameStartTime;
        }
    }

    recordRenderTime(time) {
        this.performanceMetrics.renderTime = time;
    }

    recordUpdateTime(time) {
        this.performanceMetrics.updateTime = time;
    }

    getPerformanceState() {
        const performanceLevel = this.classifyPerformance();
        
        return {
            fps: {
                current: this.frameData.currentFPS,
                average: this.frameData.averageFPS,
                min: this.frameData.minFPS,
                max: this.frameData.maxFPS,
                target: this.targetFPS
            },
            timing: { ...this.performanceMetrics },
            level: performanceLevel,
            thermal: { ...this.thermalState },
            adaptive: { ...this.adaptiveSettings }
        };
    }

    classifyPerformance() {
        const fpsRatio = this.frameData.currentFPS / this.targetFPS;
        
        if (fpsRatio >= 0.95) return 'excellent';
        if (fpsRatio >= 0.80) return 'good';
        if (fpsRatio >= 0.60) return 'fair';
        if (fpsRatio >= 0.40) return 'poor';
        return 'critical';
    }

    getOptimizationRecommendations() {
        const state = this.getPerformanceState();
        const recommendations = [];
        
        if (state.level === 'critical' || state.level === 'poor') {
            recommendations.push('reduce_particle_count');
            recommendations.push('disable_complex_effects');
            recommendations.push('reduce_update_frequency');
        }
        
        if (state.level === 'fair') {
            recommendations.push('simplify_shaders');
            recommendations.push('reduce_quality');
        }
        
        if (state.thermal.throttleDetected) {
            recommendations.push('thermal_management');
            recommendations.push('reduce_all_effects');
        }
        
        return recommendations;
    }

    shouldReduceQuality() {
        return this.frameData.currentFPS < this.targetFPS * 0.8 || this.thermalState.throttleDetected;
    }

    shouldIncreaseQuality() {
        return this.frameData.currentFPS > this.targetFPS * 1.1 && !this.thermalState.throttleDetected;
    }

    reset() {
        this.frameData.times = [];
        this.frameData.minFPS = Infinity;
        this.frameData.maxFPS = 0;
        this.thermalState.baselinePerformance = null;
        this.thermalState.throttleDetected = false;
        console.log('📊 Performance metrics reset');
    }
}

// === END INTELLIGENT DEVICE ADAPTATION SYSTEM ===

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
    },

    // ENHANCED: Emotional easing functions for expressive transitions
    emotionalEasing: {
        // Anticipation - builds tension before release
        anticipation: (t, intensity = 1.0) => {
            const anticipationPhase = Math.min(t * 1.5, 1);
            const releasePhase = Math.max(0, (t - 0.7) / 0.3);
            
            if (t < 0.7) {
                // Build tension with slight backward movement
                return t * 0.7 - Math.sin(anticipationPhase * Math.PI * 2) * 0.1 * intensity;
            } else {
                // Explosive release
                return 0.49 + organicEasing.springDamped(releasePhase) * 0.51;
            }
        },

        // Excitement - rapid energetic movement with overshoot
        excitement: (t, intensity = 1.0) => {
            const baseProgress = organicEasing.ultraSmooth(t);
            const excitement = Math.sin(t * Math.PI * 6) * Math.exp(-t * 3) * 0.15 * intensity;
            const overshoot = t > 0.8 ? Math.sin((t - 0.8) * Math.PI * 5) * 0.05 * intensity : 0;
            return Math.min(1, baseProgress + excitement + overshoot);
        },

        // Calm - serene, flowing movement like water
        calm: (t, intensity = 1.0) => {
            const primary = organicEasing.liquidFlow(t);
            const gentleWave = Math.sin(t * Math.PI * 1.5) * 0.03 * intensity;
            return primary + gentleWave;
        },

        // Release - gradual buildup followed by satisfying release
        release: (t, intensity = 1.0) => {
            if (t < 0.6) {
                // Gradual buildup
                const buildupT = t / 0.6;
                return Math.pow(buildupT, 3) * 0.6;
            } else {
                // Satisfying release
                const releaseT = (t - 0.6) / 0.4;
                return 0.6 + organicEasing.organicBounce(releaseT) * 0.4;
            }
        },

        // Harmony - balanced, musical progression
        harmony: (t, intensity = 1.0) => {
            const base = organicEasing.ultraSmooth(t);
            const harmonicSeries = (
                Math.sin(t * Math.PI * 2) * 0.05 +
                Math.sin(t * Math.PI * 4) * 0.025 +
                Math.sin(t * Math.PI * 8) * 0.0125
            ) * intensity;
            return base + harmonicSeries;
        }
    }
};

// ENHANCED: Emotional Transition Engine for expressive animation transitions
class EmotionalTransitionEngine {
    constructor() {
        this.emotionalStates = {
            anticipation: { intensity: 0, target: 0, decay: 0.95 },
            excitement: { intensity: 0, target: 0, decay: 0.9 },
            calm: { intensity: 0, target: 0, decay: 0.98 },
            release: { intensity: 0, target: 0, decay: 0.92 },
            harmony: { intensity: 0, target: 0, decay: 0.96 }
        };
        
        this.currentDominantEmotion = 'calm';
        this.emotionalBlendWeights = {};
        this.transitionHistory = [];
        this.maxHistoryLength = 10;
    }

    // Calculate emotional intensity based on animation state and particle behavior
    calculateEmotionalIntensity(animationState, stateProgress, particleEnergy) {
        let targetEmotions = {};

        switch (animationState) {
            case ANIMATION_STATES.CONVERGING:
                if (stateProgress < 0.3) {
                    targetEmotions.anticipation = 0.8;
                    targetEmotions.calm = 0.2;
                } else if (stateProgress < 0.7) {
                    targetEmotions.excitement = 0.6;
                    targetEmotions.anticipation = 0.4;
                } else {
                    targetEmotions.harmony = 0.7;
                    targetEmotions.calm = 0.3;
                }
                break;

            case ANIMATION_STATES.X_BREATHING:
                targetEmotions.calm = 0.9;
                targetEmotions.harmony = 0.1;
                break;

            case ANIMATION_STATES.ACTIVATION:
                if (stateProgress < 0.5) {
                    targetEmotions.anticipation = 0.9;
                    targetEmotions.excitement = 0.1;
                } else {
                    targetEmotions.excitement = 0.8;
                    targetEmotions.release = 0.2;
                }
                break;

            case ANIMATION_STATES.MORPHING:
                if (stateProgress < 0.2) {
                    targetEmotions.anticipation = 0.7;
                    targetEmotions.excitement = 0.3;
                } else if (stateProgress < 0.8) {
                    targetEmotions.excitement = 0.6;
                    targetEmotions.harmony = 0.4;
                } else {
                    targetEmotions.release = 0.5;
                    targetEmotions.calm = 0.5;
                }
                break;

            case ANIMATION_STATES.DISSIPATING:
                targetEmotions.release = 0.8;
                targetEmotions.calm = 0.2;
                break;
        }

        // Update emotional states smoothly
        for (const emotion in this.emotionalStates) {
            const state = this.emotionalStates[emotion];
            state.target = targetEmotions[emotion] || 0;
            
            // Smooth interpolation towards target
            const diff = state.target - state.intensity;
            state.intensity += diff * 0.1; // Smooth transition speed
            
            // Apply decay
            state.intensity *= state.decay;
        }

        // Calculate dominant emotion
        this.updateDominantEmotion();
        
        return this.emotionalStates;
    }

    updateDominantEmotion() {
        let maxIntensity = 0;
        let dominantEmotion = 'calm';

        for (const emotion in this.emotionalStates) {
            if (this.emotionalStates[emotion].intensity > maxIntensity) {
                maxIntensity = this.emotionalStates[emotion].intensity;
                dominantEmotion = emotion;
            }
        }

        if (dominantEmotion !== this.currentDominantEmotion) {
            this.transitionHistory.push({
                from: this.currentDominantEmotion,
                to: dominantEmotion,
                timestamp: performance.now(),
                intensity: maxIntensity
            });

            if (this.transitionHistory.length > this.maxHistoryLength) {
                this.transitionHistory.shift();
            }
        }

        this.currentDominantEmotion = dominantEmotion;
    }

    // Modulate easing function based on current emotional state
    modulateEasingWithEmotion(baseEasing, t, particleIndex = 0) {
        let result = baseEasing(t);
        
        // Apply emotional modulation
        for (const emotion in this.emotionalStates) {
            const intensity = this.emotionalStates[emotion].intensity;
            if (intensity > 0.01) {
                const emotionalEasing = organicEasing.emotionalEasing[emotion];
                if (emotionalEasing) {
                    const emotionalResult = emotionalEasing(t, intensity);
                    result = result * (1 - intensity) + emotionalResult * intensity;
                }
            }
        }

        return Math.max(0, Math.min(1, result));
    }

    // Get emotional color modulation
    getEmotionalColorModulation() {
        const modulation = { r: 1, g: 1, b: 1 };
        
        // Apply color shifts based on dominant emotion
        switch (this.currentDominantEmotion) {
            case 'anticipation':
                modulation.r = 1.1;
                modulation.g = 0.95;
                modulation.b = 1.05;
                break;
            case 'excitement':
                modulation.r = 1.2;
                modulation.g = 1.1;
                modulation.b = 0.9;
                break;
            case 'calm':
                modulation.r = 0.95;
                modulation.g = 1.0;
                modulation.b = 1.1;
                break;
            case 'release':
                modulation.r = 1.0;
                modulation.g = 1.1;
                modulation.b = 1.15;
                break;
            case 'harmony':
                modulation.r = 1.05;
                modulation.g = 1.05;
                modulation.b = 1.05;
                break;
        }

        // Scale by dominant emotion intensity
        const intensity = this.emotionalStates[this.currentDominantEmotion].intensity;
        const scale = 1 + (intensity - 1) * 0.3;
        
        return {
            r: 1 + (modulation.r - 1) * scale,
            g: 1 + (modulation.g - 1) * scale,
            b: 1 + (modulation.b - 1) * scale
        };
    }

    // Get emotional motion influence
    getEmotionalMotionInfluence(particleIndex) {
        const influence = { amplitude: 1, frequency: 1, phase: 0 };
        const dominantIntensity = this.emotionalStates[this.currentDominantEmotion].intensity;

        switch (this.currentDominantEmotion) {
            case 'anticipation':
                influence.amplitude = 1 + dominantIntensity * 0.2;
                influence.frequency = 1 + dominantIntensity * 0.5;
                influence.phase = particleIndex * 0.1;
                break;
            case 'excitement':
                influence.amplitude = 1 + dominantIntensity * 0.8;
                influence.frequency = 1 + dominantIntensity * 2.0;
                influence.phase = particleIndex * 0.2;
                break;
            case 'calm':
                influence.amplitude = 1 - dominantIntensity * 0.3;
                influence.frequency = 1 - dominantIntensity * 0.4;
                influence.phase = particleIndex * 0.05;
                break;
            case 'release':
                influence.amplitude = 1 + dominantIntensity * 0.6;
                influence.frequency = 1 - dominantIntensity * 0.2;
                influence.phase = particleIndex * 0.15;
                break;
            case 'harmony':
                influence.amplitude = 1 + Math.sin(particleIndex * 0.1) * dominantIntensity * 0.3;
                influence.frequency = 1 + Math.cos(particleIndex * 0.08) * dominantIntensity * 0.4;
                influence.phase = particleIndex * 0.12;
                break;
        }

        return influence;
    }
}

// ENHANCED: Intelligent Rhythm Control for adaptive timing
class IntelligentRhythmController {
    constructor() {
        this.convergenceAnalyzer = {
            lastAnalysis: 0,
            analysisInterval: 100, // ms
            convergenceRate: 0,
            energyDistribution: 0,
            harmonicBalance: 0
        };
        
        this.adaptiveTimings = {
            convergingMultiplier: 1.0,
            breathingMultiplier: 1.0,
            activationMultiplier: 1.0,
            morphingMultiplier: 1.0,
            dissipatingMultiplier: 1.0
        };
        
        this.rhythmHistory = [];
        this.maxRhythmHistory = 20;
    }

    // Analyze particle convergence state and energy distribution
    analyzeConvergenceState(positions, targetPositions, currentState) {
        const now = performance.now();
        if (now - this.convergenceAnalyzer.lastAnalysis < this.convergenceAnalyzer.analysisInterval) {
            return this.convergenceAnalyzer;
        }

        const particleCount = positions.length / 3;
        let totalDistance = 0;
        let energyVariance = 0;
        let harmonicSum = 0;

        // Calculate convergence metrics
        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;
            const dx = positions[index] - targetPositions[index];
            const dy = positions[index + 1] - targetPositions[index + 1];
            const dz = positions[index + 2] - targetPositions[index + 2];
            
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            totalDistance += distance;
            
            // Calculate energy distribution
            const energy = dx * dx + dy * dy + dz * dz;
            energyVariance += energy;
            
            // Calculate harmonic patterns
            const angle = Math.atan2(dy, dx);
            harmonicSum += Math.sin(angle * 4) + Math.cos(angle * 6);
        }

        // Update convergence analyzer
        this.convergenceAnalyzer.convergenceRate = 1 - (totalDistance / (particleCount * 10)); // Normalized
        this.convergenceAnalyzer.energyDistribution = energyVariance / particleCount;
        this.convergenceAnalyzer.harmonicBalance = harmonicSum / particleCount;
        this.convergenceAnalyzer.lastAnalysis = now;

        // Store rhythm history
        this.rhythmHistory.push({
            timestamp: now,
            convergenceRate: this.convergenceAnalyzer.convergenceRate,
            energyDistribution: this.convergenceAnalyzer.energyDistribution,
            state: currentState
        });

        if (this.rhythmHistory.length > this.maxRhythmHistory) {
            this.rhythmHistory.shift();
        }

        return this.convergenceAnalyzer;
    }

    // Calculate adaptive duration multipliers based on analysis
    calculateAdaptiveDuration(baseState, stateProgress) {
        const analysis = this.convergenceAnalyzer;
        
        switch (baseState) {
            case ANIMATION_STATES.CONVERGING:
                // Faster convergence if particles are naturally coming together
                if (analysis.convergenceRate > 0.8) {
                    this.adaptiveTimings.convergingMultiplier = 0.8;
                } else if (analysis.convergenceRate < 0.3) {
                    this.adaptiveTimings.convergingMultiplier = 1.3;
                } else {
                    this.adaptiveTimings.convergingMultiplier = 1.0;
                }
                break;

            case ANIMATION_STATES.X_BREATHING:
                // Adjust breathing based on harmony
                const harmonyLevel = Math.abs(analysis.harmonicBalance);
                this.adaptiveTimings.breathingMultiplier = 0.8 + harmonyLevel * 0.4;
                break;

            case ANIMATION_STATES.ACTIVATION:
                // Quick activation if energy is already high
                if (analysis.energyDistribution > 5) {
                    this.adaptiveTimings.activationMultiplier = 0.7;
                } else {
                    this.adaptiveTimings.activationMultiplier = 1.0;
                }
                break;

            case ANIMATION_STATES.MORPHING:
                // Smooth morphing based on convergence history
                const avgConvergence = this.getAverageConvergence();
                this.adaptiveTimings.morphingMultiplier = 0.8 + (1 - avgConvergence) * 0.4;
                break;

            case ANIMATION_STATES.DISSIPATING:
                // Graceful dissipation based on energy
                this.adaptiveTimings.dissipatingMultiplier = 1.0 + analysis.energyDistribution * 0.1;
                break;
        }

        return this.adaptiveTimings[this.getTimingKey(baseState)];
    }

    getTimingKey(state) {
        const mapping = {
            [ANIMATION_STATES.CONVERGING]: 'convergingMultiplier',
            [ANIMATION_STATES.X_BREATHING]: 'breathingMultiplier',
            [ANIMATION_STATES.ACTIVATION]: 'activationMultiplier',
            [ANIMATION_STATES.MORPHING]: 'morphingMultiplier',
            [ANIMATION_STATES.DISSIPATING]: 'dissipatingMultiplier'
        };
        return mapping[state] || 'convergingMultiplier';
    }

    getAverageConvergence() {
        if (this.rhythmHistory.length === 0) return 0.5;
        
        const sum = this.rhythmHistory.reduce((acc, entry) => acc + entry.convergenceRate, 0);
        return sum / this.rhythmHistory.length;
    }

    // Get breathing rhythm parameters
    getBreathingRhythm(globalTime, emotionalState) {
        const baseFrequency = 0.002;
        const emotionalModifier = emotionalState === 'calm' ? 0.8 : 
                                emotionalState === 'excitement' ? 1.5 : 1.0;
        
        return {
            frequency: baseFrequency * emotionalModifier * this.adaptiveTimings.breathingMultiplier,
            amplitude: 0.05 * this.adaptiveTimings.breathingMultiplier,
            phase: globalTime * baseFrequency * emotionalModifier
        };
    }
}

// ENHANCED: Multi-Dimensional Interpolator for advanced path calculations
class MultiDimensionalInterpolator {
    constructor() {
        this.tensionControl = {
            position: 0.5,
            color: 0.3,
            size: 0.7,
            energy: 0.4
        };
        
        this.interpolationMethods = {
            position: 'advancedBezier',
            color: 'harmonicBlend',
            size: 'elasticSpring',
            energy: 'exponentialFlow'
        };
    }

    // Advanced multi-dimensional interpolation
    interpolateMultiDimensional(start, end, progress, dimensions, particleIndex = 0) {
        const result = {};
        
        for (const dim of dimensions) {
            switch (this.interpolationMethods[dim]) {
                case 'advancedBezier':
                    result[dim] = this.advancedBezierInterpolation(start[dim], end[dim], progress, particleIndex);
                    break;
                case 'harmonicBlend':
                    result[dim] = this.harmonicColorBlend(start[dim], end[dim], progress, particleIndex);
                    break;
                case 'elasticSpring':
                    result[dim] = this.elasticSpringInterpolation(start[dim], end[dim], progress, particleIndex);
                    break;
                case 'exponentialFlow':
                    result[dim] = this.exponentialFlowInterpolation(start[dim], end[dim], progress, particleIndex);
                    break;
                default:
                    result[dim] = this.linearInterpolation(start[dim], end[dim], progress);
            }
        }
        
        return result;
    }

    // Advanced Bezier with dynamic control points
    advancedBezierInterpolation(start, end, progress, particleIndex) {
        if (typeof start === 'object' && start.x !== undefined) {
            // Vector interpolation
            const tension = this.tensionControl.position;
            const particlePhase = (particleIndex * 0.1) % (Math.PI * 2);
            
            // Dynamic control points based on particle characteristics
            const cp1Offset = {
                x: Math.sin(particlePhase) * tension * 0.5,
                y: Math.cos(particlePhase) * tension * 0.5,
                z: Math.sin(particlePhase * 1.5) * tension * 0.3
            };
            
            const cp2Offset = {
                x: Math.cos(particlePhase + Math.PI) * tension * 0.3,
                y: Math.sin(particlePhase + Math.PI) * tension * 0.3,
                z: Math.cos(particlePhase * 0.7) * tension * 0.2
            };
            
            const cp1 = {
                x: start.x + (end.x - start.x) * 0.33 + cp1Offset.x,
                y: start.y + (end.y - start.y) * 0.33 + cp1Offset.y,
                z: start.z + (end.z - start.z) * 0.33 + cp1Offset.z
            };
            
            const cp2 = {
                x: start.x + (end.x - start.x) * 0.67 + cp2Offset.x,
                y: start.y + (end.y - start.y) * 0.67 + cp2Offset.y,
                z: start.z + (end.z - start.z) * 0.67 + cp2Offset.z
            };
            
            return this.cubicBezierVector(start, cp1, cp2, end, progress);
        } else {
            // Scalar interpolation
            return start + (end - start) * organicEasing.ultraSmooth(progress);
        }
    }

    // Harmonic color blending with frequency components
    harmonicColorBlend(startColor, endColor, progress, particleIndex) {
        if (!startColor || !endColor) return startColor || endColor;
        
        const baseProgress = organicEasing.ultraSmooth(progress);
        const particlePhase = particleIndex * 0.05;
        
        // Add harmonic components for richer color transitions
        const harmonic1 = Math.sin(progress * Math.PI * 2 + particlePhase) * 0.05;
        const harmonic2 = Math.sin(progress * Math.PI * 4 + particlePhase * 1.5) * 0.025;
        const harmonic3 = Math.sin(progress * Math.PI * 8 + particlePhase * 2) * 0.0125;
        
        const harmonicProgress = Math.max(0, Math.min(1, 
            baseProgress + harmonic1 + harmonic2 + harmonic3
        ));
        
        if (typeof startColor === 'object') {
            return {
                r: startColor.r + (endColor.r - startColor.r) * harmonicProgress,
                g: startColor.g + (endColor.g - startColor.g) * harmonicProgress,
                b: startColor.b + (endColor.b - startColor.b) * harmonicProgress
            };
        } else {
            return startColor + (endColor - startColor) * harmonicProgress;
        }
    }

    // Elastic spring interpolation with overshoot
    elasticSpringInterpolation(start, end, progress, particleIndex) {
        const tension = this.tensionControl.size;
        const damping = 0.7;
        const frequency = 1.5 + (particleIndex % 10) * 0.1;
        
        if (progress < 0.7) {
            // Main movement
            const adjustedProgress = progress / 0.7;
            const springProgress = organicEasing.springDamped(adjustedProgress, tension, damping);
            return start + (end - start) * springProgress;
        } else {
            // Elastic settle
            const settleProgress = (progress - 0.7) / 0.3;
            const elasticComponent = Math.exp(-settleProgress * 5) * 
                                   Math.sin(settleProgress * Math.PI * frequency) * 0.1;
            
            return end + (end - start) * elasticComponent;
        }
    }

    // Exponential flow for energy-like properties
    exponentialFlowInterpolation(start, end, progress, particleIndex) {
        const flowRate = this.tensionControl.energy;
        const particleVariation = 1 + (particleIndex % 7) * 0.05;
        
        // Exponential approach to target
        const exponentialProgress = 1 - Math.exp(-progress * 4 * flowRate * particleVariation);
        
        // Add flow turbulence
        const turbulence = Math.sin(progress * Math.PI * 3 + particleIndex * 0.1) * 
                          Math.exp(-progress * 2) * 0.05;
        
        const finalProgress = Math.max(0, Math.min(1, exponentialProgress + turbulence));
        
        return start + (end - start) * finalProgress;
    }

    // Linear fallback
    linearInterpolation(start, end, progress) {
        if (typeof start === 'object') {
            return {
                x: start.x + (end.x - start.x) * progress,
                y: start.y + (end.y - start.y) * progress,
                z: start.z + (end.z - start.z) * progress
            };
        } else {
            return start + (end - start) * progress;
        }
    }

    // Cubic Bezier vector interpolation
    cubicBezierVector(p0, p1, p2, p3, t) {
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

    // Update tension based on emotional state
    updateTensionFromEmotion(emotionalState) {
        switch (emotionalState) {
            case 'anticipation':
                this.tensionControl.position = 0.8;
                this.tensionControl.color = 0.6;
                break;
            case 'excitement':
                this.tensionControl.position = 1.2;
                this.tensionControl.size = 1.0;
                break;
            case 'calm':
                this.tensionControl.position = 0.3;
                this.tensionControl.color = 0.2;
                break;
            case 'release':
                this.tensionControl.position = 0.6;
                this.tensionControl.energy = 0.8;
                break;
            case 'harmony':
                this.tensionControl.position = 0.5;
                this.tensionControl.color = 0.4;
                this.tensionControl.size = 0.7;
                this.tensionControl.energy = 0.5;
                break;
        }
    }
}

// ENHANCED: Predictive Transition Preparation System
class PredictiveTransitionPrep {
    constructor() {
        this.nextStagePreparation = {
            effectsPreWarmed: false,
            colorTransitionReady: false,
            positionBuffersReady: false,
            timingOptimized: false
        };
        
        this.preparationThresholds = {
            [ANIMATION_STATES.CONVERGING]: 0.65,    // Start earlier for smoother transition
            [ANIMATION_STATES.X_BREATHING]: 0.80,   // Slightly earlier
            [ANIMATION_STATES.ACTIVATION]: 0.70,    // Adjusted for better flow
            [ANIMATION_STATES.MORPHING]: 0.75,      // Earlier preparation
            [ANIMATION_STATES.DISSIPATING]: 0.85    // Earlier for graceful ending
        };
        
        this.preWarmingIntensity = 0.0;
        this.preparationStartTime = 0;
    }

    // Check if we should start preparing for next stage
    shouldStartPreparation(currentState, stateProgress) {
        const threshold = this.preparationThresholds[currentState] || 0.8;
        return stateProgress >= threshold && !this.nextStagePreparation.effectsPreWarmed;
    }

    // Prepare effects for the next animation stage - ENHANCED with smooth intensity progression
    preWarmNextStageEffects(currentState, nextState, stateProgress) {
        if (!this.shouldStartPreparation(currentState, stateProgress)) {
            return;
        }

        const threshold = this.preparationThresholds[currentState];
        const rawProgress = (stateProgress - threshold) / (1 - threshold);
        
        // Enhanced smooth progression with minimum base intensity
        const smoothProgress = this.smoothstepIntensity(Math.max(0, rawProgress));
        const baseIntensity = 0.05; // Minimum base intensity to avoid zero
        const enhancedIntensity = baseIntensity + smoothProgress * 0.25; // Maximum 0.3 total
        
        this.preWarmingIntensity = Math.min(enhancedIntensity, 0.3);

        switch (nextState) {
            case ANIMATION_STATES.X_BREATHING:
                this.preWarmBreathing(smoothProgress, enhancedIntensity);
                break;
            case ANIMATION_STATES.ACTIVATION:
                this.preWarmActivation(smoothProgress, enhancedIntensity);
                break;
            case ANIMATION_STATES.MORPHING:
                this.preWarmMorphing(smoothProgress, enhancedIntensity);
                break;
            case ANIMATION_STATES.DISSIPATING:
                this.preWarmDissipation(smoothProgress, enhancedIntensity);
                break;
        }

        this.nextStagePreparation.effectsPreWarmed = true;
    }

    // Enhanced smoothstep function for natural intensity progression
    smoothstepIntensity(t) {
        // Classic smoothstep: 3t² - 2t³
        return t * t * (3 - 2 * t);
    }

    // Pre-warm breathing effects - ENHANCED with smooth intensity progression
    preWarmBreathing(smoothProgress, enhancedIntensity) {
        // Enhanced breathing rhythm preparation with guaranteed minimum
        const minIntensity = 0.02; // Minimum breathing preparation
        const maxIntensity = 0.15; // Maximum breathing preparation
        
        this.breathingPreWarmIntensity = minIntensity + smoothProgress * (maxIntensity - minIntensity);
        
        // Log with more detail for debugging
        console.log(`🫁 Pre-warming breathing effects - Progress: ${smoothProgress.toFixed(3)}, Intensity: ${this.breathingPreWarmIntensity.toFixed(3)}`);
    }

    // Pre-warm activation effects - ENHANCED
    preWarmActivation(smoothProgress, enhancedIntensity) {
        // Enhanced energy accumulation preparation
        const minIntensity = 0.03;
        const maxIntensity = 0.25;
        
        this.activationPreWarmIntensity = minIntensity + smoothProgress * (maxIntensity - minIntensity);
        console.log(`⚡ Pre-warming activation effects - Progress: ${smoothProgress.toFixed(3)}, Intensity: ${this.activationPreWarmIntensity.toFixed(3)}`);
    }

    // Pre-warm morphing effects - ENHANCED
    preWarmMorphing(smoothProgress, enhancedIntensity) {
        // Enhanced morphing path calculation preparation
        const minIntensity = 0.02;
        const maxIntensity = 0.20;
        
        this.morphingPreWarmIntensity = minIntensity + smoothProgress * (maxIntensity - minIntensity);
        console.log(`🔄 Pre-warming morphing effects - Progress: ${smoothProgress.toFixed(3)}, Intensity: ${this.morphingPreWarmIntensity.toFixed(3)}`);
    }

    // Pre-warm dissipation effects - ENHANCED
    preWarmDissipation(smoothProgress, enhancedIntensity) {
        // Enhanced dissipation energy preparation
        const minIntensity = 0.04;
        const maxIntensity = 0.30;
        
        this.dissipationPreWarmIntensity = minIntensity + smoothProgress * (maxIntensity - minIntensity);
        console.log(`💨 Pre-warming dissipation effects - Progress: ${smoothProgress.toFixed(3)}, Intensity: ${this.dissipationPreWarmIntensity.toFixed(3)}`);
    }

    // Reset preparation state for new cycle
    resetPreparation() {
        this.nextStagePreparation = {
            effectsPreWarmed: false,
            colorTransitionReady: false,
            positionBuffersReady: false,
            timingOptimized: false
        };
        
        this.preWarmingIntensity = 0.0;
        this.breathingPreWarmIntensity = 0.0;
        this.activationPreWarmIntensity = 0.0;
        this.morphingPreWarmIntensity = 0.0;
        this.dissipationPreWarmIntensity = 0.0;
    }

    // Get current pre-warming intensity for specific effect
    getPreWarmIntensity(effectType) {
        switch (effectType) {
            case 'breathing': return this.breathingPreWarmIntensity || 0;
            case 'activation': return this.activationPreWarmIntensity || 0;
            case 'morphing': return this.morphingPreWarmIntensity || 0;
            case 'dissipation': return this.dissipationPreWarmIntensity || 0;
            default: return this.preWarmingIntensity;
        }
    }
}

// ENHANCED: Environmental Awareness System
class EnvironmentalAwareness {
    constructor() {
        this.mouseState = {
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            acceleration: { x: 0, y: 0 },
            lastUpdate: 0,
            isActive: false,
            activityLevel: 0
        };
        
        this.windowState = {
            width: window.innerWidth,
            height: window.innerHeight,
            aspectRatio: window.innerWidth / window.innerHeight,
            size: 'medium'
        };
        
        this.performanceState = {
            frameRate: 60,
            averageFrameTime: 16.67,
            loadLevel: 'normal'
        };
        
        this.environmentalInfluence = {
            transitionSpeed: 1.0,
            effectIntensity: 1.0,
            detailLevel: 1.0,
            responsiveness: 1.0
        };
        
        this.lastFrameTime = performance.now();
        this.frameTimeHistory = [];
        this.maxFrameHistory = 30;
    }

    // Update mouse behavior analysis
    updateMouseBehavior(mouseX, mouseY) {
        const now = performance.now();
        const deltaTime = now - this.mouseState.lastUpdate;
        
        if (deltaTime > 0) {
            // Calculate velocity
            const deltaX = mouseX - this.mouseState.position.x;
            const deltaY = mouseY - this.mouseState.position.y;
            
            const newVelocityX = deltaX / deltaTime * 1000; // pixels per second
            const newVelocityY = deltaY / deltaTime * 1000;
            
            // Calculate acceleration
            const accelX = (newVelocityX - this.mouseState.velocity.x) / deltaTime * 1000;
            const accelY = (newVelocityY - this.mouseState.velocity.y) / deltaTime * 1000;
            
            // Update mouse state
            this.mouseState.position = { x: mouseX, y: mouseY };
            this.mouseState.velocity = { x: newVelocityX, y: newVelocityY };
            this.mouseState.acceleration = { x: accelX, y: accelY };
            this.mouseState.lastUpdate = now;
            
            // Calculate activity level
            const speed = Math.sqrt(newVelocityX * newVelocityX + newVelocityY * newVelocityY);
            this.mouseState.activityLevel = Math.min(speed / 1000, 2.0); // Normalized activity
            this.mouseState.isActive = speed > 50; // Active if moving faster than 50 px/s
        }
    }

    // Update window state analysis
    updateWindowState() {
        this.windowState.width = window.innerWidth;
        this.windowState.height = window.innerHeight;
        this.windowState.aspectRatio = this.windowState.width / this.windowState.height;
        
        // Categorize window size
        const area = this.windowState.width * this.windowState.height;
        if (area < 500000) { // < 500k pixels
            this.windowState.size = 'small';
        } else if (area < 1500000) { // < 1.5M pixels
            this.windowState.size = 'medium';
        } else {
            this.windowState.size = 'large';
        }
    }

    // Update performance analysis
    updatePerformanceState() {
        const now = performance.now();
        const frameTime = now - this.lastFrameTime;
        
        this.frameTimeHistory.push(frameTime);
        if (this.frameTimeHistory.length > this.maxFrameHistory) {
            this.frameTimeHistory.shift();
        }
        
        // Calculate average frame time
        const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0);
        this.performanceState.averageFrameTime = sum / this.frameTimeHistory.length;
        this.performanceState.frameRate = 1000 / this.performanceState.averageFrameTime;
        
        // Determine load level
        if (this.performanceState.frameRate > 55) {
            this.performanceState.loadLevel = 'light';
        } else if (this.performanceState.frameRate > 40) {
            this.performanceState.loadLevel = 'normal';
        } else if (this.performanceState.frameRate > 25) {
            this.performanceState.loadLevel = 'heavy';
        } else {
            this.performanceState.loadLevel = 'critical';
        }
        
        this.lastFrameTime = now;
    }

    // Calculate adaptive response intensity
    calculateAdaptiveResponseIntensity() {
        // Mouse activity influence
        const mouseInfluence = Math.min(this.mouseState.activityLevel, 1.0);
        
        // Window size influence
        const sizeInfluence = this.windowState.size === 'large' ? 1.2 : 
                             this.windowState.size === 'small' ? 0.8 : 1.0;
        
        // Performance influence
        const perfInfluence = this.performanceState.loadLevel === 'light' ? 1.1 :
                             this.performanceState.loadLevel === 'heavy' ? 0.7 :
                             this.performanceState.loadLevel === 'critical' ? 0.5 : 1.0;
        
        // Update environmental influence
        this.environmentalInfluence.transitionSpeed = perfInfluence * (1 + mouseInfluence * 0.2);
        this.environmentalInfluence.effectIntensity = sizeInfluence * perfInfluence * (1 + mouseInfluence * 0.3);
        this.environmentalInfluence.detailLevel = perfInfluence;
        this.environmentalInfluence.responsiveness = mouseInfluence * perfInfluence;
        
        return this.environmentalInfluence;
    }

    // Get environmental motion modifier
    getEnvironmentalMotionModifier(particleIndex) {
        const baseModifier = {
            amplitude: 1.0,
            frequency: 1.0,
            phase: 0.0,
            damping: 1.0
        };
        
        // Mouse proximity influence
        if (this.mouseState.isActive) {
            const mouseProximity = this.calculateMouseProximityInfluence(particleIndex);
            baseModifier.amplitude *= (1 + mouseProximity * 0.3);
            baseModifier.frequency *= (1 + mouseProximity * 0.2);
            baseModifier.phase += mouseProximity * Math.PI * 0.5;
        }
        
        // Window aspect ratio influence
        if (this.windowState.aspectRatio > 2.0 || this.windowState.aspectRatio < 0.5) {
            // Extreme aspect ratios
            baseModifier.amplitude *= 0.8;
            baseModifier.frequency *= 1.2;
        }
        
        // Performance-based damping
        if (this.performanceState.loadLevel === 'heavy' || this.performanceState.loadLevel === 'critical') {
            baseModifier.damping *= 0.7; // Reduce motion complexity
        }
        
        return baseModifier;
    }

    // Calculate mouse proximity influence for a particle
    calculateMouseProximityInfluence(particleIndex) {
        // This is a simplified calculation - in actual implementation,
        // you'd need access to particle positions
        const normalizedIndex = particleIndex / 1000; // Assume ~1000 particles
        const proximityFactor = Math.abs(this.mouseState.position.x / window.innerWidth - normalizedIndex);
        return Math.max(0, 1 - proximityFactor * 2); // 0 to 1 influence
    }

    // Get current environmental state summary
    getEnvironmentalState() {
        return {
            mouse: this.mouseState,
            window: this.windowState,
            performance: this.performanceState,
            influence: this.environmentalInfluence
        };
    }
}

// Simplified organic curve generation - replaced by elegant spiral convergence path

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

// Fluid dynamics system - simplified for performance

class ParticleAnimation {
    constructor() {
        // === INTELLIGENT DEVICE ADAPTATION INITIALIZATION ===
        console.log('🚀 Initializing intelligent device adaptation system...');
        this.deviceIntelligence = new DeviceIntelligence();
        
        // Get optimal configuration based on device analysis
        const deviceConfig = this.deviceIntelligence.getOptimalConfig();
        console.log(`📱 Device class: ${deviceConfig.deviceClass}`);
        console.log(`💻 Device type: ${deviceConfig.profile.isMobile ? 'Mobile' : deviceConfig.profile.isTablet ? 'Tablet' : 'Desktop'}`);
        
        // Initialize intelligent systems
        this.qualityManager = new QualityManager(deviceConfig);
        this.mobileOptimizer = new MobileOptimizer(deviceConfig.profile);
        this.performanceMonitor = new PerformanceMonitor(this.qualityManager.getTargetFPS());
        
        // Get current quality settings
        const qualitySettings = this.qualityManager.getCurrentSettings();
        console.log(`⚙️ Quality level: ${this.qualityManager.currentQuality}`);
        console.log(`🎯 Target FPS: ${this.qualityManager.getTargetFPS()}`);
        console.log(`🎨 Particle count: ${qualitySettings.particleCount}`);
        
        // === CORE ANIMATION SYSTEM ===
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleCount = qualitySettings.particleCount; // Dynamic based on device
        
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
        
        // Interactive controls - Enhanced for mobile
        this.mouse = { x: 0, y: 0, isDown: false };
        this.mouseForce = { x: 0, y: 0, strength: 0 };
        this.attractionMode = false;
        this.interactionRadius = deviceConfig.profile.isMobile ? 3.0 : 2.0; // Larger on mobile
        this.forceStrength = deviceConfig.profile.isMobile ? 0.03 : 0.02;
        
        // Physics enhancement - Adaptive
        this.gravity = { x: 0, y: 0, z: 0 };
        this.windForce = { x: 0, y: 0, z: 0 };
        this.turbulence = qualitySettings.complexShaders ? 0.005 : 0.003;
        
        // Camera controls
        this.cameraTarget = { x: 0, y: 0, z: 5 };
        this.cameraSpeed = 0.05;
        this.zoomLevel = 1.0;
        
        // Audio reactive features - Disabled on low-end devices
        this.audioContext = null;
        this.analyser = null;
        this.audioData = null;
        this.audioEnabled = qualitySettings.complexShaders; // Only enable on capable devices
        this.bassFrequency = 0;
        this.midFrequency = 0;
        this.trebleFrequency = 0;
        
        // Particle emission system - Adaptive
        this.emissionPoints = [];
        this.maxEmissionParticles = Math.floor(qualitySettings.particleCount * 0.25);
        this.emissionRate = qualitySettings.updateFrequency === 1 ? 5 : 3;
        this.emissionEnabled = false;
        
        // Performance optimization - Now intelligent
        this.frameCount = 0;
        this.qualityLevel = this.qualityManager.currentQuality;
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
        this.particleEnergies = [];    // Individual energy level
        this.particleLifePhases = [];  // Individual life cycle phases
        this.particleNoiseOffsets = [];// Individual noise offsets for organic motion
        this.particleFluidVelocities = []; // Fluid dynamics velocities
        this.particleNeighbors = [];   // Nearby particles for interaction
        this.particleTemperatures = [];// Individual temperature for heat-based motion
        this.particleMasses = [];      // Individual masses for physics
        this.particleFrictions = [];   // Individual friction coefficients
        this.particleSpringConstants = []; // Individual spring constants
        this.particleOrganicSeeds = []; // Multiple seeds for different organic behaviors
        
        // Epic Enhancement: Energy Trail System
        this.particleTrails = [];      // Trail history for each particle
        this.trailLength = 15;         // Number of trail points per particle
        this.trailFadeSpeed = 0.95;    // Trail alpha decay rate
        this.enableTrails = false;     // Trail system toggle
        this.trailIntensity = 0.0;     // Trail intensity for smooth transitions
        this.trailPrewarm = false;     // Pre-warming trails for smooth activation
        
        // Epic Enhancement: Cinematic Camera System  
        this.cameraShake = { intensity: 0, duration: 0, time: 0 };
        this.dynamicFOV = 75;          // Field of view for dramatic effect
        this.depthOfField = { focus: 5, blur: 0 };
        
        // Epic Enhancement: Volumetric God Rays
        this.godRays = { intensity: 0, angle: 0, active: false };
        this.lightBeams = [];          // Light beam effect arrays
        
        // Epic Enhancement: Mouse Magnetism System
        this.mousePosition = { x: 0, y: 0, z: 0 };
        this.mouseMagnetism = { enabled: false, strength: 0.3, radius: 2.0 };
        this.setupMouseInteraction();
        
        // Epic Enhancement: Procedural Audio System (DISABLED)
        this.audioSystem = {
            enabled: false,
            context: null,
            oscillators: [],
            gainNodes: [],
            masterGain: null
        };
        // this.initializeAudioSystem(); // Audio system disabled
        
        // ENHANCED: Advanced Transition Enhancement Systems
        this.emotionalEngine = new EmotionalTransitionEngine();
        this.rhythmController = new IntelligentRhythmController();
        this.multiInterpolator = new MultiDimensionalInterpolator();
        this.predictivePrep = new PredictiveTransitionPrep();
        this.environmentalAwareness = new EnvironmentalAwareness();
        
        // Enhanced transition coordination
        this.transitionCoordinator = {
            lastStateTransition: 0,
            smoothnessLevel: 'ultra', // 'basic', 'smooth', 'ultra'
            adaptiveTimingEnabled: true,
            emotionalResponseEnabled: true,
            predictivePreparationEnabled: true,
            environmentalAdaptationEnabled: true,
            debugMode: false
        };
        
        // Advanced particle energy tracking for enhanced transitions
        this.particleEnergyState = {
            averageEnergy: 0,
            energyDistribution: 0,
            harmonicBalance: 0,
            convergenceRate: 0,
            lastUpdate: 0
        };
        
        console.log('🎨 Advanced Transition Enhancement System initialized with emotional intelligence!');
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.loadImages();
        this.setupEventListeners();
        this.animate();
    }
    
    createScene() {
        // === INTELLIGENT SCENE CREATION ===
        const qualitySettings = this.qualityManager.getCurrentSettings();
        const deviceProfile = this.deviceIntelligence.deviceProfile;
        
        console.log('🎬 Creating optimized scene for device...');
        
        // 创建场景
        this.scene = new THREE.Scene();
        
        // 创建相机 - Adaptive FOV for mobile
        const fov = deviceProfile.isMobile ? 80 : 75; // Wider FOV on mobile for better view
        this.camera = new THREE.PerspectiveCamera(
            fov, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = deviceProfile.isMobile ? 6 : 5; // Slightly further back on mobile
        
        // 创建渲染器 - Intelligent quality settings
        const rendererOptions = {
            antialias: qualitySettings.antialiasing,
            alpha: true,
            powerPreference: deviceProfile.isMobile ? 'low-power' : 'high-performance',
            precision: qualitySettings.complexShaders ? 'highp' : 'mediump',
            stencil: false, // Disable stencil buffer for better performance
            depth: qualitySettings.depthTesting
        };
        
        this.renderer = new THREE.WebGLRenderer(rendererOptions);
        
        // Set size with intelligent scaling
        const renderScale = qualitySettings.renderScale;
        const scaledWidth = Math.floor(window.innerWidth * renderScale);
        const scaledHeight = Math.floor(window.innerHeight * renderScale);
        
        this.renderer.setSize(scaledWidth, scaledHeight);
        this.renderer.domElement.style.width = window.innerWidth + 'px';
        this.renderer.domElement.style.height = window.innerHeight + 'px';
        
        // Intelligent pixel ratio setting
        const maxPixelRatio = deviceProfile.isMobile ? 2 : window.devicePixelRatio;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
        
        this.renderer.setClearColor(0x000000);
        
        // Additional mobile optimizations
        if (deviceProfile.isMobile) {
            this.renderer.shadowMap.enabled = false; // Disable shadows on mobile
            this.renderer.sortObjects = false; // Disable sorting for better performance
        }
        
        document.getElementById('canvasContainer').appendChild(this.renderer.domElement);
        
        console.log(`🎨 Renderer created: ${scaledWidth}x${scaledHeight} (scale: ${renderScale})`);
        console.log(`📐 Pixel ratio: ${this.renderer.getPixelRatio()}`);
        console.log(`✨ Antialiasing: ${qualitySettings.antialiasing ? 'enabled' : 'disabled'}`);
        console.log(`🔧 Power preference: ${rendererOptions.powerPreference}`);
        
        // ENHANCED: 处理窗口大小调整 with environmental awareness
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            
            // Update environmental awareness with new window state
            if (this.transitionCoordinator.environmentalAdaptationEnabled) {
                this.environmentalAwareness.updateWindowState();
            }
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
    
    initializeElegantParticleProperties() {
        // Initialize simplified particle properties for elegant performance
        this.particleSeeds = [];
        this.particlePhases = [];
        this.particleTrails = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            // Simple but elegant particle variation
            this.particleSeeds.push(Math.random());
            this.particlePhases.push(Math.random() * Math.PI * 2);
            
            // Initialize epic trail system
            this.particleTrails.push([]);
        }
    }
    
    // Epic Enhancement: Update Energy Trail System
    updateEnergyTrails() {
        if ((!this.enableTrails && !this.trailPrewarm) || !this.particles) return;
        
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            const currentPos = {
                x: positions[index],
                y: positions[index + 1],
                z: positions[index + 2],
                time: this.globalTime
            };
            
            // Add current position to trail
            this.particleTrails[i].unshift(currentPos);
            
            // Limit trail length
            if (this.particleTrails[i].length > this.trailLength) {
                this.particleTrails[i].pop();
            }
            
            // Update trail alpha values
            for (let j = 0; j < this.particleTrails[i].length; j++) {
                const trailPoint = this.particleTrails[i][j];
                const alpha = Math.pow(this.trailFadeSpeed, j);
                trailPoint.alpha = alpha;
            }
        }
    }
    
    // Epic Enhancement: Cinematic Camera Effects
    updateCinematicCamera() {
        if (!this.camera) return;
        
        // Camera shake during activation
        if (this.cameraShake.intensity > 0) {
            const shakeAmount = this.cameraShake.intensity * 0.02;
            this.camera.position.x += (Math.random() - 0.5) * shakeAmount;
            this.camera.position.y += (Math.random() - 0.5) * shakeAmount;
            
            this.cameraShake.time += 16;
            if (this.cameraShake.time >= this.cameraShake.duration) {
                this.cameraShake.intensity = 0;
            }
        }
        
        // Dynamic FOV based on animation state
        let targetFOV = 75;
        if (this.currentState === ANIMATION_STATES.ACTIVATION) {
            targetFOV = 85; // Wider FOV for dramatic effect
        } else if (this.currentState === ANIMATION_STATES.DISSIPATING) {
            targetFOV = 65; // Narrower FOV for focus
        }
        
        this.camera.fov += (targetFOV - this.camera.fov) * 0.02;
        this.camera.updateProjectionMatrix();
    }
    
    // Epic Enhancement: Trigger Camera Shake
    triggerCameraShake(intensity = 1.0, duration = 500) {
        this.cameraShake.intensity = intensity;
        this.cameraShake.duration = duration;
        this.cameraShake.time = 0;
    }

    // Epic Enhancement: Create Volumetric God Ray System
    createGodRaySystem() {
        const rayCount = 8;
        const rayGeometry = new THREE.PlaneGeometry(0.1, 6);
        const rayMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        this.godRayMeshes = [];
        for (let i = 0; i < rayCount; i++) {
            const ray = new THREE.Mesh(rayGeometry, rayMaterial.clone());
            ray.position.set(0, 0, 0);
            ray.rotation.z = (i / rayCount) * Math.PI * 2;
            ray.visible = false;
            this.scene.add(ray);
            this.godRayMeshes.push(ray);
        }
    }

    // Epic Enhancement: Create Trail System Geometry  
    createTrailSystem() {
        // Create trail line geometries
        this.trailMeshes = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            const trailGeometry = new THREE.BufferGeometry();
            const trailPositions = new Float32Array(this.trailLength * 3);
            const trailColors = new Float32Array(this.trailLength * 3);
            
            trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
            trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
            
            const trailMaterial = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            
            const trailLine = new THREE.Line(trailGeometry, trailMaterial);
            trailLine.visible = false;
            this.scene.add(trailLine);
            this.trailMeshes.push(trailLine);
        }
    }

    // Epic Enhancement: Update God Ray Visual Effects (OPTIMIZED)
    updateGodRayVisuals() {
        if (!this.godRayMeshes) return;
        
        this.godRayMeshes.forEach((ray, index) => {
            if (this.godRays.active) {
                ray.visible = true;
                // Much more subtle opacity
                ray.material.opacity = this.godRays.intensity * 0.08; // Reduced from 0.3 to 0.08
                ray.rotation.z = (index / this.godRayMeshes.length) * Math.PI * 2 + this.godRays.angle;
            
                // More subtle colors - softer tones
                const rayColor = index % 2 === 0 ? 
                    new THREE.Color(0.8, 0.5, 0.2) :  // Softer orange
                    new THREE.Color(0.3, 0.5, 0.8);   // Softer blue
                ray.material.color = rayColor;
            } else {
                ray.visible = false;
            }
        });
    }

        // Epic Enhancement: Update Trail Visual Effects (ENHANCED)
    updateTrailVisuals() {
        const shouldShowTrails = (this.enableTrails || this.trailPrewarm) && this.trailIntensity > 0.01;
        if (!shouldShowTrails || !this.trailMeshes) return;
        
        for (let i = 0; i < this.particleCount && i < this.trailMeshes.length; i++) {
            const trail = this.particleTrails[i];
            const trailMesh = this.trailMeshes[i];
            
            if (trail.length > 1 && this.trailIntensity > 0.01) {
                trailMesh.visible = true;
                
                const positions = trailMesh.geometry.attributes.position.array;
                const colors = trailMesh.geometry.attributes.color.array;
                
                // Calculate target position for consistent color calculation
                const targetPos = {
                    x: this.positions1[i * 3],
                    y: this.positions1[i * 3 + 1],
                    z: this.positions1[i * 3 + 2]
                };
                
                // Update trail positions and colors
                for (let j = 0; j < this.trailLength; j++) {
                    if (j < trail.length) {
                        const point = trail[j];
                        positions[j * 3] = point.x;
                        positions[j * 3 + 1] = point.y;
                        positions[j * 3 + 2] = point.z;
                        
                        // Use the same gradient color calculation as particles
                        const baseColor = this.calculateXShapeGradientColor(1.0, i, targetPos);
                        
                        // Calculate trail fade based on position in trail
                        const trailAlpha = point.alpha || (1 - j / this.trailLength);
                        
                        // Apply trail intensity for smooth transitions
                        const finalAlpha = trailAlpha * this.trailIntensity;
                        
                        // Slightly enhance colors for trail visibility
                        colors[j * 3] = baseColor.r * (0.8 + finalAlpha * 0.4);     
                        colors[j * 3 + 1] = baseColor.g * (0.8 + finalAlpha * 0.4); 
                        colors[j * 3 + 2] = baseColor.b * (0.8 + finalAlpha * 0.4); 
                    } else {
                        // Empty positions for unused trail points
                        positions[j * 3] = 0;
                        positions[j * 3 + 1] = 0;
                        positions[j * 3 + 2] = 0;
                        colors[j * 3] = 0;
                        colors[j * 3 + 1] = 0;
                        colors[j * 3 + 2] = 0;
                    }
                }
                
                trailMesh.geometry.attributes.position.needsUpdate = true;
                trailMesh.geometry.attributes.color.needsUpdate = true;
                trailMesh.geometry.setDrawRange(0, Math.min(trail.length, this.trailLength));
            } else {
                trailMesh.visible = false;
            }
        }
    }

    // Epic Enhancement: Setup Mouse Interaction
    setupMouseInteraction() {
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('mousemove', (event) => {
                if (!this.camera || !this.renderer) return;
                
                // Convert mouse coordinates to 3D space
                const rect = this.renderer.domElement.getBoundingClientRect();
                const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                
                // Project mouse position to 3D space
                const vector = new THREE.Vector3(mouseX, mouseY, 0);
                vector.unproject(this.camera);
                
                const direction = vector.sub(this.camera.position).normalize();
                const distance = -this.camera.position.z / direction.z;
                
                this.mousePosition.x = this.camera.position.x + direction.x * distance;
                this.mousePosition.y = this.camera.position.y + direction.y * distance;
                this.mousePosition.z = 0;
            });
        }
    }

    // Epic Enhancement: Apply Mouse Magnetism to Particles
    applyMouseMagnetism(positions) {
        if (!this.mouseMagnetism.enabled || !positions) return;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            const px = positions[index];
            const py = positions[index + 1];
            const pz = positions[index + 2];
            
            // Calculate distance to mouse
            const dx = this.mousePosition.x - px;
            const dy = this.mousePosition.y - py;
            const dz = this.mousePosition.z - pz;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // Apply magnetism if within radius
            if (distance < this.mouseMagnetism.radius && distance > 0.1) {
                const force = this.mouseMagnetism.strength * (1 - distance / this.mouseMagnetism.radius);
                const normalizedForce = force * 0.02; // Scale down the effect
                
                positions[index] += dx / distance * normalizedForce;
                positions[index + 1] += dy / distance * normalizedForce;
                positions[index + 2] += dz / distance * normalizedForce;
            }
                 }
     }

    // Epic Enhancement: Initialize Procedural Audio System (DISABLED)
    initializeAudioSystem() {
        // Audio system completely disabled to avoid browser autoplay issues
        console.log('🔇 Audio system disabled - focusing on visual effects only');
    }

    // Epic Enhancement: Generate Ambient Tones Based on Particle Energy (DISABLED)
    updateProceduralAudio() {
        // Audio system completely disabled
        return;
    }

    // Epic Enhancement: Create Ambient Tone Oscillators (DISABLED)
    createAmbientTones(baseFreq) {
        // Audio system completely disabled
        return;
    }

    // Epic Enhancement: Update Ambient Tone Parameters (DISABLED)
    updateAmbientTones(frequency, energy) {
        // Audio system completely disabled
        return;
        }

    // Epic Enhancement: Stop Procedural Audio (DISABLED)
    stopProceduralAudio() {
        // Audio system completely disabled
        return;
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
    
    // Complex fluid and thermal systems - removed for elegant simplicity
    
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
        
        // Generate spread positions and initialize elegant properties
        this.generateSpreadPositions();
        this.initializeElegantParticleProperties();
        
        // Initialize basic particle properties
        this.particleVelocities = [];
        this.particleSizes = [];
        this.particleOpacities = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particleVelocities.push(0, 0, 0); // vx, vy, vz
            this.particleSizes.push(0.3 + Math.random() * 0.2); // elegant sizes
            this.particleOpacities.push(1.0);
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
            
            // 设置粒子颜色 - 预览蓝橙渐变色彩 (低强度版本)
            const targetPos = {
                x: this.positions1[i * 3],
                y: this.positions1[i * 3 + 1],
                z: this.positions1[i * 3 + 2]
            };
            const previewColor = this.calculateXShapeGradientColor(0.2, i, targetPos); // Low energy preview
            colors[i * 3] = previewColor.r;
            colors[i * 3 + 1] = previewColor.g;
            colors[i * 3 + 2] = previewColor.b;
            
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
                
                // === 使用JavaScript计算的渐变颜色 ===
                // 直接使用从vertex shader传递的颜色
                vec3 baseColor = vColor;

                // 添加轻微的时间变化增强视觉效果
                float timeEnhancement = sin(time * 0.3 + vPosition.x * 1.5) * 0.08 + 1.0;
                baseColor *= timeEnhancement;

                // 轻微的速度颜色效果
                float velocityInfluence = length(vVelocity) * 0.2;
                if (velocityInfluence > 0.2) {
                    vec3 velocityColor = mix(baseColor, vec3(1.0, 0.98, 0.95), velocityInfluence * 0.15);
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
        
        // Epic Enhancement: Create God Ray System
        this.createGodRaySystem();
        
        // Epic Enhancement: Create Trail System Geometry
        this.createTrailSystem();
        
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
    
    // Stage 1: Ultra-Elegant Particle Convergence to X Shape - ENHANCED WITH EMOTIONAL INTELLIGENCE
    updateConvergingState() {
        // ENHANCED: Calculate adaptive duration based on convergence analysis
        const baseDuration = STAGE_DURATIONS.CONVERGING;
        let adaptiveDuration = baseDuration;
        
        if (this.transitionCoordinator.adaptiveTimingEnabled) {
            const targetPositions = this.positions1;
            const currentPositions = this.particles.geometry.attributes.position.array;
            this.rhythmController.analyzeConvergenceState(currentPositions, targetPositions, this.currentState);
            const timingMultiplier = this.rhythmController.calculateAdaptiveDuration(this.currentState, this.stateProgress);
            adaptiveDuration = baseDuration * timingMultiplier;
        }
        
        const phaseTime = this.globalTime - (this.phaseStartTime || 0);
        this.stateProgress = Math.min(phaseTime / adaptiveDuration, 1);

        // ENHANCED: Update emotional state and environmental awareness
        if (this.transitionCoordinator.emotionalResponseEnabled) {
            this.updateParticleEnergyState();
            this.emotionalEngine.calculateEmotionalIntensity(
                this.currentState, 
                this.stateProgress, 
                this.particleEnergyState.averageEnergy
            );
        }
        
        if (this.transitionCoordinator.environmentalAdaptationEnabled) {
            this.environmentalAwareness.updatePerformanceState();
            this.environmentalAwareness.calculateAdaptiveResponseIntensity();
        }

        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;

        // ENHANCED: Adaptive wave pattern based on emotional state and environment
        const environmentalInfluence = this.environmentalAwareness.environmentalInfluence;
        const baseWaveSpeed = 3.0 * environmentalInfluence.transitionSpeed;
        const wavePhase = this.stateProgress * baseWaveSpeed;

        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;

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

            // Calculate particle's distance from center for wave-based timing
            const centerDistance = Math.sqrt(start.x * start.x + start.y * start.y);
            const normalizedDistance = Math.min(centerDistance / 8, 1);

            // ENHANCED: Adaptive wave delay based on environmental awareness
            const baseWaveDelay = normalizedDistance * 0.3;
            const environmentalModifier = this.environmentalAwareness.getEnvironmentalMotionModifier(i);
            const adaptiveWaveDelay = baseWaveDelay * environmentalModifier.damping;
            
            const waveProgress = Math.max(0, Math.min(1, (this.stateProgress - adaptiveWaveDelay) / (1 - adaptiveWaveDelay * 0.8)));
            
            // ENHANCED: Emotional easing for expressive movement
            let smoothProgress;
            if (this.transitionCoordinator.emotionalResponseEnabled) {
                // Use emotional engine to modulate the easing
                const baseEasing = this.elegantSigmoidEasing;
                smoothProgress = this.emotionalEngine.modulateEasingWithEmotion(baseEasing, waveProgress, i);
                
                // Update interpolator tension based on current emotional state
                this.multiInterpolator.updateTensionFromEmotion(this.emotionalEngine.currentDominantEmotion);
            } else {
                smoothProgress = this.elegantSigmoidEasing(waveProgress);
            }

            // ENHANCED: Advanced multi-dimensional interpolation for position, color, and size
            let spiralPath, finalColor, sizeEvolution;
            
            if (this.transitionCoordinator.smoothnessLevel === 'ultra' && this.multiInterpolator) {
                // Use advanced multi-dimensional interpolation
                const interpolationResult = this.multiInterpolator.interpolateMultiDimensional(
                    { position: start, color: null, size: 0.2, energy: 0 },
                    { position: target, color: null, size: 1.0, energy: 1.0 },
                    smoothProgress,
                    ['position', 'size', 'energy'],
                    i
                );
                
                spiralPath = interpolationResult.position;
                sizeEvolution = interpolationResult.size;
                
                // Enhanced color calculation with emotional modulation
                const baseGradientColor = this.calculateXShapeGradientColor(smoothProgress, i, target);
                if (this.transitionCoordinator.emotionalResponseEnabled) {
                    const emotionalModulation = this.emotionalEngine.getEmotionalColorModulation();
                    finalColor = {
                        r: baseGradientColor.r * emotionalModulation.r,
                        g: baseGradientColor.g * emotionalModulation.g,
                        b: baseGradientColor.b * emotionalModulation.b
                    };
                } else {
                    finalColor = baseGradientColor;
                }
                
            } else {
                // Fallback to original spiral path calculation
                spiralPath = this.calculateSpiralConvergencePath(start, target, smoothProgress, i);
                finalColor = this.calculateXShapeGradientColor(smoothProgress, i, target);
                sizeEvolution = this.calculateElegantSizeEvolution(smoothProgress);
            }

            // Apply the calculated position
            positions[index] = spiralPath.x;
            positions[index + 1] = spiralPath.y;
            positions[index + 2] = spiralPath.z;

            // Apply enhanced colors
            colors[index] = finalColor.r;
            colors[index + 1] = finalColor.g;
            colors[index + 2] = finalColor.b;

            // Apply enhanced size with environmental scaling
            const environmentalScale = this.environmentalAwareness.environmentalInfluence.effectIntensity;
            sizes[i] = this.particleSizes[i] * sizeEvolution * environmentalScale;
        }

        // Update geometry
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;

        // ENHANCED: Predictive transition preparation for next stage
        if (this.transitionCoordinator.predictivePreparationEnabled) {
            this.predictivePrep.preWarmNextStageEffects(
                this.currentState, 
                ANIMATION_STATES.X_BREATHING, 
                this.stateProgress
            );
        }

        // Perfect completion detection with energy stabilization phase
        if (this.stateProgress >= 1.0) {
            if (this.currentState === ANIMATION_STATES.CONVERGING) {
                const emotionalState = this.emotionalEngine.currentDominantEmotion;
                const preWarmIntensity = this.predictivePrep.getPreWarmIntensity('breathing');
                const convergenceRate = this.particleEnergyState.convergenceRate;
                
                console.log(`🎯 Ultra-elegant convergence complete with perfect harmony!`);
                console.log(`   └─ Emotional state: ${emotionalState}`);
                console.log(`   └─ Pre-warm intensity: ${preWarmIntensity.toFixed(3)}`);
                console.log(`   └─ Convergence rate: ${convergenceRate.toFixed(3)}`);
                console.log(`🔄 Initiating seamless transition to breathing phase...`);
                
                this.transitionToState(ANIMATION_STATES.X_BREATHING);
            }
        }
    }

    // Elegant sigmoid-based easing for natural motion
    elegantSigmoidEasing(t) {
        // Enhanced sigmoid function for ultra-smooth acceleration/deceleration
        const steepness = 6; // Controls the steepness of the S-curve
        const shifted = (t - 0.5) * steepness;
        return 1 / (1 + Math.exp(-shifted));
    }

    // Calculate spiral convergence path using polar coordinates
    calculateSpiralConvergencePath(start, target, progress, particleIndex) {
        // Convert to polar coordinates for spiral calculation
        const startAngle = Math.atan2(start.y, start.x);
        const targetAngle = Math.atan2(target.y, target.x);
        const startRadius = Math.sqrt(start.x * start.x + start.y * start.y);
        const targetRadius = Math.sqrt(target.x * target.x + target.y * target.y);

        // Create elegant spiral path with minimal angular change
        const spiralTurns = 0.25; // Quarter turn maximum for elegance
        const spiralOffset = (particleIndex * 0.1) % (Math.PI * 2); // Individual spiral offset
        
        // Interpolate angle with gentle spiral
        const angleSpiral = startAngle + (targetAngle - startAngle) * progress + 
                           Math.sin(progress * Math.PI) * spiralTurns + spiralOffset * (1 - progress);
        
        // Smooth radius interpolation with slight inward curve
        const radiusProgress = this.elegantSigmoidEasing(progress);
        const currentRadius = startRadius + (targetRadius - startRadius) * radiusProgress;
        
        // Add subtle inward pull for magnetic effect
        const magneticPull = Math.sin(progress * Math.PI) * 0.15 * startRadius;
        const finalRadius = currentRadius - magneticPull;

        // Convert back to cartesian coordinates
        const x = finalRadius * Math.cos(angleSpiral);
        const y = finalRadius * Math.sin(angleSpiral);
        
        // Z interpolation with gentle wave
        const z = start.z + (target.z - start.z) * progress + 
                 Math.sin(progress * Math.PI * 2) * 0.1 * (1 - progress);

        return { x, y, z };
    }

    // Calculate beautiful blue-to-orange X-shape gradient color
    calculateXShapeGradientColor(progress, particleIndex, targetPosition) {
        // Calculate distance from X center (0,0) to create radial gradient
        const centerDistance = Math.sqrt(targetPosition.x * targetPosition.x + targetPosition.y * targetPosition.y);
        const maxDistance = 4; // Maximum distance in the X shape
        const normalizedDistance = Math.min(centerDistance / maxDistance, 1);
        
        // Energy awakening progression
        const energyIntensity = this.elegantSigmoidEasing(progress);
        
        // Blue to Orange gradient based on distance from center
        // Center (distance 0): Warm Orange/Gold
        // Outer (distance 1): Deep Blue
        
        // Orange/Gold color (center)
        const centerColor = {
            r: 1.0,   // Full red
            g: 0.65,  // Rich orange-gold
            b: 0.0    // No blue
        };
        
        // Deep Blue color (outer)
        const outerColor = {
            r: 0.1,   // Minimal red
            g: 0.2,   // Some green for depth
            b: 0.8    // Strong blue
        };
        
        // Smooth gradient interpolation
        const gradientT = Math.pow(normalizedDistance, 0.7); // Slight curve for more natural distribution
        
        const baseR = centerColor.r + (outerColor.r - centerColor.r) * gradientT;
        const baseG = centerColor.g + (outerColor.g - centerColor.g) * gradientT;
        const baseB = centerColor.b + (outerColor.b - centerColor.b) * gradientT;
        
        // Apply energy intensity for awakening effect
        const finalR = baseR * (0.3 + energyIntensity * 0.7);
        const finalG = baseG * (0.3 + energyIntensity * 0.7);
        const finalB = baseB * (0.3 + energyIntensity * 0.7);
        
        // Add slight particle variation for organic feel
        const variation = Math.sin(particleIndex * 0.15) * 0.05;
        
        return {
            r: Math.max(0.05, Math.min(1.0, finalR + variation)),
            g: Math.max(0.05, Math.min(1.0, finalG + variation * 0.5)),
            b: Math.max(0.1, Math.min(1.0, finalB + variation * 0.3))
        };
    }

    // Calculate elegant size evolution with natural growth
    calculateElegantSizeEvolution(progress) {
        // Natural growth curve - slow start, quick middle, gentle end
        const growthCurve = this.elegantSigmoidEasing(progress);
        
        // Start small, grow to natural size
        const minSize = 0.2;
        const maxSize = 1.0;
        
        return minSize + (maxSize - minSize) * growthCurve;
    }

    // HSL to RGB conversion helper
    hslToRgb(h, s, l) {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;
        if (h < 1/6) { r = c; g = x; b = 0; }
        else if (h < 2/6) { r = x; g = c; b = 0; }
        else if (h < 3/6) { r = 0; g = c; b = x; }
        else if (h < 4/6) { r = 0; g = x; b = c; }
        else if (h < 5/6) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        return {
            r: Math.max(0.05, Math.min(1.0, r + m)),
            g: Math.max(0.05, Math.min(1.0, g + m)),
            b: Math.max(0.2, Math.min(1.0, b + m)) // Maintain twilight blue base
        };
    }

    // ENHANCED: Update particle energy state for intelligent transitions
    updateParticleEnergyState() {
        if (!this.particles) return;
        
        const positions = this.particles.geometry.attributes.position.array;
        const particleCount = this.particleCount;
        
        let totalEnergy = 0;
        let energyVariance = 0;
        let harmonicSum = 0;
        let convergenceSum = 0;
        
        // Calculate various energy metrics
        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;
            const x = positions[index];
            const y = positions[index + 1];
            const z = positions[index + 2];
            
            // Energy based on distance from center
            const energy = x * x + y * y + z * z;
            totalEnergy += energy;
            
            // Variance for distribution analysis
            energyVariance += energy * energy;
            
            // Harmonic analysis for rhythm detection
            const angle = Math.atan2(y, x);
            harmonicSum += Math.sin(angle * 4) + Math.cos(angle * 6);
            
            // Convergence rate (if target positions exist)
            if (this.positions1.length > 0) {
                const targetX = this.positions1[index];
                const targetY = this.positions1[index + 1];
                const targetZ = this.positions1[index + 2];
                const distance = Math.sqrt(
                    (x - targetX) * (x - targetX) + 
                    (y - targetY) * (y - targetY) + 
                    (z - targetZ) * (z - targetZ)
                );
                convergenceSum += distance;
            }
        }
        
        // Update energy state
        this.particleEnergyState.averageEnergy = totalEnergy / particleCount;
        this.particleEnergyState.energyDistribution = energyVariance / particleCount;
        this.particleEnergyState.harmonicBalance = harmonicSum / particleCount;
        this.particleEnergyState.convergenceRate = 1 - (convergenceSum / (particleCount * 10));
        this.particleEnergyState.lastUpdate = performance.now();
    }

    // Stage 2: Seamless Elegant Particle Breathing - Living X Shape - ENHANCED WITH INTELLIGENT RHYTHM
    updateBreathingState() {
        // ENHANCED: Log breathing phase initiation with pre-warm status (only once)
        if (this.stateProgress === 0 && !this.breathingInitLogged) {
            const preWarmIntensity = this.predictivePrep.getPreWarmIntensity('breathing');
            console.log(`🫁 Breathing phase initiated with pre-warm intensity: ${preWarmIntensity.toFixed(3)}`);
            this.breathingInitLogged = true;
        }
        
        // ENHANCED: Adaptive duration and rhythm control
        const baseDuration = STAGE_DURATIONS.X_BREATHING;
        let adaptiveDuration = baseDuration;
        
        if (this.transitionCoordinator.adaptiveTimingEnabled) {
            const timingMultiplier = this.rhythmController.calculateAdaptiveDuration(this.currentState, this.stateProgress);
            adaptiveDuration = baseDuration * timingMultiplier;
        }
        
        const phaseTime = this.globalTime - (this.phaseStartTime || 0);
        this.stateProgress = Math.min(phaseTime / adaptiveDuration, 1);
        
        // ENHANCED: Update emotional and environmental state
        if (this.transitionCoordinator.emotionalResponseEnabled) {
            this.updateParticleEnergyState();
            this.emotionalEngine.calculateEmotionalIntensity(
                this.currentState, 
                this.stateProgress, 
                this.particleEnergyState.averageEnergy
            );
        }
        
        const positions = this.particles.geometry.attributes.position.array;
        const sizes = this.particles.geometry.attributes.size.array;
        const colors = this.particles.geometry.attributes.color.array;
        
        // ENHANCED: Receive and apply pre-warming from previous stage for seamless transition
        const preWarmIntensity = this.predictivePrep.getPreWarmIntensity('breathing');
        const hasPreWarm = preWarmIntensity > 0.01;
        
        // Enhanced three-phase breathing with pre-warm integration
        const correctionPhase = hasPreWarm ? 0.08 : 0.15;  // Shorter correction if pre-warmed
        const blendPhase = hasPreWarm ? 0.18 : 0.25;       // Faster blend-in if pre-warmed
        const breathingPhase = 1.0;                        // Full breathing (18-100% or 25-100%)
        
        // ENHANCED: Intelligent breathing rhythm with pre-warm boost
        let breathingParams;
        if (this.transitionCoordinator.emotionalResponseEnabled) {
            breathingParams = this.rhythmController.getBreathingRhythm(
                this.globalTime, 
                this.emotionalEngine.currentDominantEmotion
            );
        } else {
            // Fallback to original breathing parameters
            breathingParams = {
                frequency: 0.002,
                amplitude: 0.05,
                phase: this.globalTime * 0.002
            };
        }
        
        // Apply pre-warm boost to breathing parameters for smoother transition
        if (hasPreWarm) {
            breathingParams.amplitude *= (1 + preWarmIntensity * 2); // Boost amplitude
            breathingParams.frequency *= (1 + preWarmIntensity * 0.5); // Slightly boost frequency
            console.log(`🌊 Applying pre-warm boost to breathing - Amplitude boost: ${(preWarmIntensity * 2).toFixed(3)}`);
        }
        
        const breathingTime = breathingParams.phase;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Get captured positions from convergence end
            const capturedX = this.currentPositions.length > 0 ? this.currentPositions[index] : this.positions1[index];
            const capturedY = this.currentPositions.length > 0 ? this.currentPositions[index + 1] : this.positions1[index + 1];
            const capturedZ = this.currentPositions.length > 0 ? this.currentPositions[index + 2] : this.positions1[index + 2];
            
            // Target perfect X positions
            const targetX = this.positions1[index];
            const targetY = this.positions1[index + 1];
            const targetZ = this.positions1[index + 2];
            
            let finalX, finalY, finalZ;
            
            if (this.stateProgress <= correctionPhase) {
                // Phase 1: Gentle position correction to perfect X alignment
                const correctionProgress = this.stateProgress / correctionPhase;
                const smoothCorrection = this.elegantSigmoidEasing(correctionProgress);
                
                finalX = capturedX + (targetX - capturedX) * smoothCorrection;
                finalY = capturedY + (targetY - capturedY) * smoothCorrection;
                finalZ = capturedZ + (targetZ - capturedZ) * smoothCorrection;
                
            } else if (this.stateProgress <= blendPhase) {
                // Phase 2: Breathing animation blend-in
                const blendProgress = (this.stateProgress - correctionPhase) / (blendPhase - correctionPhase);
                const breathingBlend = this.elegantSigmoidEasing(blendProgress);
            
                // Calculate breathing parameters
                const centerDistance = Math.sqrt(targetX * targetX + targetY * targetY);
                const normalizedDistance = Math.min(centerDistance / 4, 1);
                const angle = Math.atan2(targetY, targetX);
            
                // Gentle breathing wave
                const breathingWave = Math.sin(breathingTime + normalizedDistance * 0.5);
                const breathingIntensity = 0.05 * breathingBlend; // Gradual breathing introduction
                
                // Radial breathing movement
                const radialMovement = breathingWave * breathingIntensity * normalizedDistance;
                const breathingX = Math.cos(angle) * radialMovement;
                const breathingY = Math.sin(angle) * radialMovement;
                const breathingZ = breathingWave * breathingIntensity * 0.3;
                
                finalX = targetX + breathingX;
                finalY = targetY + breathingY;
                finalZ = targetZ + breathingZ;
                
            } else {
                // Phase 3: Full breathing cycle
                const centerDistance = Math.sqrt(targetX * targetX + targetY * targetY);
                const normalizedDistance = Math.min(centerDistance / 4, 1);
                const angle = Math.atan2(targetY, targetX);
                
                // Full breathing wave
                const breathingWave = Math.sin(breathingTime + normalizedDistance * 0.5);
                const breathingIntensity = 0.05; // Full breathing movement
                
                // Radial breathing movement
                const radialMovement = breathingWave * breathingIntensity * normalizedDistance;
                const breathingX = Math.cos(angle) * radialMovement;
                const breathingY = Math.sin(angle) * radialMovement;
                const breathingZ = breathingWave * breathingIntensity * 0.3;
                
                finalX = targetX + breathingX;
                finalY = targetY + breathingY;
                finalZ = targetZ + breathingZ;
            }
            
            // Apply calculated positions
            positions[index] = finalX;
            positions[index + 1] = finalY;
            positions[index + 2] = finalZ;
            
            // ENHANCED: Intelligent synchronized breathing with emotional modulation
            const breathingWave = Math.sin(breathingTime + Math.sqrt(targetX * targetX + targetY * targetY) / 8);
            const sizeBlend = this.stateProgress > blendPhase ? 1.0 : Math.max(0, (this.stateProgress - correctionPhase) / (blendPhase - correctionPhase));
            
            // Apply adaptive breathing amplitude
            const adaptiveAmplitude = breathingParams.amplitude * (1 + this.particleEnergyState.harmonicBalance * 0.2);
            const sizePulse = Math.abs(breathingWave) * adaptiveAmplitude * sizeBlend;
            
            // Environmental scaling for responsive breathing
            const environmentalScale = this.environmentalAwareness.environmentalInfluence.effectIntensity;
            sizes[i] = this.particleSizes[i] + sizePulse * environmentalScale;
            
            // ENHANCED: Emotional color breathing with sophisticated modulation
            const colorPulse = Math.abs(breathingWave) * adaptiveAmplitude * 2 * sizeBlend;
            const targetPos = { x: targetX, y: targetY, z: targetZ };
            let baseColor = this.calculateXShapeGradientColor(1.0, i, targetPos); // Full energy for settled state
            
            // Apply emotional color modulation
            if (this.transitionCoordinator.emotionalResponseEnabled) {
                const emotionalModulation = this.emotionalEngine.getEmotionalColorModulation();
                baseColor = {
                    r: baseColor.r * emotionalModulation.r,
                    g: baseColor.g * emotionalModulation.g,
                    b: baseColor.b * emotionalModulation.b
                };
            }
            
            colors[index] = Math.min(1.0, baseColor.r + colorPulse);
            colors[index + 1] = Math.min(1.0, baseColor.g + colorPulse * 0.7);
            colors[index + 2] = Math.min(1.0, baseColor.b + colorPulse * 0.5);
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        
        // ENHANCED: Enhanced trail pre-warming with predictive preparation
        if (this.stateProgress >= 0.75 && !this.trailPrewarm) {
            this.trailPrewarm = true;
            this.trailIntensity = 0.0;
            console.log('🎯 Pre-warming trail system for smooth activation');
        }
        
        // Update trail pre-warming intensity with emotional modulation and breathing preparation
        if (this.trailPrewarm) {
            const baseIntensity = Math.min((this.stateProgress - 0.75) / 0.25, 0.3);
            const emotionalBoost = this.transitionCoordinator.emotionalResponseEnabled ? 
                this.emotionalEngine.emotionalStates.anticipation.intensity * 0.1 : 0;
            
            // Add breathing preparation influence for smoother transition
            const breathingPrep = this.predictivePrep.getPreWarmIntensity('breathing');
            this.trailIntensity = baseIntensity + emotionalBoost + breathingPrep * 0.5;
        }

        // ENHANCED: Predictive preparation for activation stage
        if (this.transitionCoordinator.predictivePreparationEnabled) {
            this.predictivePrep.preWarmNextStageEffects(
                this.currentState, 
                ANIMATION_STATES.ACTIVATION, 
                this.stateProgress
            );
        }

        // Perfect completion transition with emotional awareness
        if (this.stateProgress >= 1.0) {
            if (this.currentState === ANIMATION_STATES.X_BREATHING) {
                const emotionalState = this.emotionalEngine.currentDominantEmotion;
                const breathingHarmony = this.particleEnergyState.harmonicBalance;
                console.log(`🫁 Seamless breathing complete with perfect harmony - Emotional: ${emotionalState}, Harmony: ${breathingHarmony.toFixed(3)}`);
                this.loadingComplete = true;
                this.transitionToState(ANIMATION_STATES.ACTIVATION);
            }
        }
    }
    
    // Stage 3: Epic Particle Activation - Energizing the X with Cinematic Effects
    updateActivationState() {
        const duration = STAGE_DURATIONS.ACTIVATION;
        const phaseTime = this.globalTime - (this.phaseStartTime || 0);
        this.stateProgress = Math.min(phaseTime / duration, 1);

        // Epic Enhancement: Smooth trail activation from pre-warmed state
        if (!this.enableTrails && this.stateProgress > 0.0) {
            this.enableTrails = true;
            console.log('🔥 Epic energy trails smoothly activated from pre-warm!');
        }
        
        // Enhanced trail intensity with breathing transition continuity
        if (this.trailPrewarm) {
            // Continue from pre-warm intensity and enhance gradually
            this.trailIntensity = 0.3 + (this.stateProgress * 0.7); // From pre-warm 0.3 to full 1.0
        } else {
            // Fallback for direct activation
            this.trailIntensity = Math.min(this.stateProgress / 0.2, 1.0);
        }

        // Epic Enhancement: Trigger camera shake at peak activation
        if (this.stateProgress > 0.6 && this.stateProgress < 0.65 && this.cameraShake.intensity === 0) {
            this.triggerCameraShake(2.0, 800);
            console.log('📹 Cinematic camera shake triggered!');
        }

        // Epic Enhancement: Activate god rays during mid-activation (REDUCED INTENSITY)
        if (this.stateProgress > 0.4) {
            this.godRays.active = true;
            this.godRays.intensity = Math.sin((this.stateProgress - 0.4) * Math.PI / 0.6) * 0.2; // Reduced from 0.8 to 0.2
            this.godRays.angle += 0.01; // Slower rotation
        }

        // 初始化激活种子（仅在第一次运行时）
        if (!this.activationSeeds) {
            this.initializeActivationSeeds();
        }

        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const sizes = this.particles.geometry.attributes.size.array;
        
        // 三阶段神经网络式激活系统
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // 获取基础位置
            const baseX = this.currentPositions.length > 0 ? this.currentPositions[index] : this.positions1[index];
            const baseY = this.currentPositions.length > 0 ? this.currentPositions[index + 1] : this.positions1[index + 1];
            const baseZ = this.currentPositions.length > 0 ? this.currentPositions[index + 2] : this.positions1[index + 2];
            
            // 计算激活阶段和强度
            const activationData = this.calculateActivationPhase(i, this.stateProgress);
            const { phase, intensity, localProgress } = activationData;
            
            // Enhanced color transition from breathing to activation
            let finalColor;
            if (this.stateProgress < 0.25) {
                // Smooth transition from breathing phase colors
                const transitionProgress = this.stateProgress / 0.25;
                const breathingColor = this.calculateXShapeGradientColor(1.0, i, { x: baseX, y: baseY, z: baseZ });
                const activationColor = this.getActivationColor(phase, intensity, localProgress);
                
                // Elegant blend with sigmoid easing
                const blendFactor = this.elegantSigmoidEasing(transitionProgress);
                finalColor = {
                    r: breathingColor.r + (activationColor.r - breathingColor.r) * blendFactor,
                    g: breathingColor.g + (activationColor.g - breathingColor.g) * blendFactor,
                    b: breathingColor.b + (activationColor.b - breathingColor.b) * blendFactor
                };
            } else {
                // Pure activation colors after smooth transition
                finalColor = this.getActivationColor(phase, intensity, localProgress);
            }
            
            colors[index] = finalColor.r;
            colors[index + 1] = finalColor.g;
            colors[index + 2] = finalColor.b;
            
            // 神经连接式的位置调整
            let positionOffset = { x: 0, y: 0, z: 0 };
            if (phase >= 2 && intensity > 0.1) {
                // 轻微向最近种子的吸引，然后回归
                const attraction = this.calculateNeuralAttraction(baseX, baseY, baseZ, localProgress);
                positionOffset.x = attraction.x * intensity * 0.05;
                positionOffset.y = attraction.y * intensity * 0.05;
                positionOffset.z = attraction.z * intensity * 0.03;
            }
            
            positions[index] = baseX + positionOffset.x;
            positions[index + 1] = baseY + positionOffset.y;
            positions[index + 2] = baseZ + positionOffset.z;
            
            // 脉冲式大小变化
            const sizePulse = this.calculateActivationSizePulse(phase, intensity, localProgress);
            sizes[i] = this.particleSizes[i] * (1 + sizePulse);
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        if (this.stateProgress >= 0.98) {
            if (this.currentState === ANIMATION_STATES.ACTIVATION) {
                console.log('Neural activation complete, starting morphing');
                this.transitionToState(ANIMATION_STATES.MORPHING);
            }
        }
    }

    // 初始化激活种子系统
    initializeActivationSeeds() {
        this.activationSeeds = [];
        const seedCount = 6; // 6个均匀分布的种子
        
        // 使用确定性随机选择种子，确保分布均匀
        for (let i = 0; i < seedCount; i++) {
            const angle = (i / seedCount) * Math.PI * 2;
            const radius = 1 + Math.sin(i * 2.3) * 0.5; // 轻微的半径变化
            
            // 找到最接近这个理想位置的粒子
            let bestParticleIndex = 0;
            let minDistance = Infinity;
            
            const targetX = Math.cos(angle) * radius;
            const targetY = Math.sin(angle) * radius;
            
            for (let j = 0; j < this.particleCount; j++) {
                const px = this.positions1[j * 3];
                const py = this.positions1[j * 3 + 1];
                const distance = Math.sqrt((px - targetX) * (px - targetX) + (py - targetY) * (py - targetY));
                
                if (distance < minDistance) {
                    minDistance = distance;
                    bestParticleIndex = j;
                }
            }
            
            this.activationSeeds.push({
                particleIndex: bestParticleIndex,
                x: this.positions1[bestParticleIndex * 3],
                y: this.positions1[bestParticleIndex * 3 + 1],
                z: this.positions1[bestParticleIndex * 3 + 2],
                activationDelay: i * 0.03 // 种子激活的轻微延迟
            });
        }
        
        // 预计算每个粒子到种子的最短距离
        this.particleToSeedDistance = new Array(this.particleCount);
        for (let i = 0; i < this.particleCount; i++) {
            const px = this.positions1[i * 3];
            const py = this.positions1[i * 3 + 1];
            const pz = this.positions1[i * 3 + 2];
            
            let minDistance = Infinity;
            let closestSeedIndex = 0;
            
            this.activationSeeds.forEach((seed, seedIndex) => {
                const distance = Math.sqrt(
                    (px - seed.x) * (px - seed.x) + 
                    (py - seed.y) * (py - seed.y) + 
                    (pz - seed.z) * (pz - seed.z)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    closestSeedIndex = seedIndex;
                }
            });
            
            this.particleToSeedDistance[i] = {
                distance: minDistance,
                seedIndex: closestSeedIndex
            };
        }
    }

    // 计算粒子的激活阶段和强度
    calculateActivationPhase(particleIndex, globalProgress) {
        const seedData = this.activationSeeds[this.particleToSeedDistance[particleIndex].seedIndex];
        const distance = this.particleToSeedDistance[particleIndex].distance;
        
        // 三个阶段的时间分配
        const phase1End = 0.25;   // 种子激活
        const phase2End = 0.75;   // 能量传播
        const phase3End = 1.0;    // 共振稳定
        
        // 传播延迟基于距离
        const propagationDelay = Math.min(distance / 3.0, 0.4);
        const isSeed = this.activationSeeds.some(seed => seed.particleIndex === particleIndex);
        
        let phase = 0;
        let intensity = 0;
        let localProgress = 0;
        
        if (globalProgress <= phase1End) {
            // 阶段1：种子激活
            phase = 1;
            if (isSeed) {
                const seedDelay = seedData.activationDelay;
                localProgress = Math.max(0, (globalProgress - seedDelay) / (phase1End - seedDelay));
                intensity = this.elegantEasing(Math.min(localProgress * 2, 1));
            }
        } else if (globalProgress <= phase2End) {
            // 阶段2：能量传播
            phase = 2;
            const phase2Progress = (globalProgress - phase1End) / (phase2End - phase1End);
            const adjustedProgress = Math.max(0, phase2Progress - propagationDelay);
            localProgress = Math.min(adjustedProgress * 1.5, 1);
            intensity = this.elegantEasing(localProgress);
        } else {
            // 阶段3：共振稳定
            phase = 3;
            localProgress = (globalProgress - phase2End) / (phase3End - phase2End);
            intensity = 0.8 + Math.sin(localProgress * Math.PI * 4 + particleIndex * 0.1) * 0.2;
        }
        
        return { phase, intensity, localProgress };
    }

    // 获取激活阶段对应的颜色
    getActivationColor(phase, intensity, localProgress) {
        let r, g, b;
        
        switch (phase) {
            case 1: // 种子激活：深蓝到电蓝
                r = 0.1 + intensity * 0.3;
                g = 0.1 + intensity * 0.4;
                b = 0.6 + intensity * 0.4;
                break;
                
            case 2: // 能量传播：电蓝到青蓝到白光脉冲
                if (localProgress < 0.7) {
                    const subProgress = localProgress / 0.7;
                    r = 0.2 + subProgress * 0.4;
                    g = 0.3 + subProgress * 0.5;
                    b = 0.8 + subProgress * 0.2;
                } else {
                    // 白光脉冲
                    const pulseProgress = (localProgress - 0.7) / 0.3;
                    const pulseIntensity = Math.sin(pulseProgress * Math.PI);
                    r = 0.6 + pulseIntensity * 0.4;
                    g = 0.7 + pulseIntensity * 0.3;
                    b = 1.0;
                }
                break;
                
            case 3: // 共振稳定：稳定亮蓝
                const stabilityPulse = Math.sin(localProgress * Math.PI * 3) * 0.1;
                r = 0.4 + stabilityPulse;
                g = 0.6 + stabilityPulse * 0.5;
                b = 0.95 + stabilityPulse * 0.05;
                break;
                
            default:
                r = 0.2;
                g = 0.2;
                b = 0.7;
        }
        
        return { r: Math.min(r * intensity, 1), g: Math.min(g * intensity, 1), b: Math.min(b * intensity, 1) };
    }

    // 计算神经连接式的位置吸引
    calculateNeuralAttraction(x, y, z, localProgress) {
        const closestSeed = this.activationSeeds[this.particleToSeedDistance[this.findParticleIndex(x, y, z)].seedIndex];
        
        const dx = closestSeed.x - x;
        const dy = closestSeed.y - y;
        const dz = closestSeed.z - z;
        
        // 先吸引后回归的效果
        const attractionPhase = localProgress < 0.6 ? localProgress / 0.6 : (1 - localProgress) / 0.4;
        const smoothAttraction = this.elegantEasing(attractionPhase);
        
        return {
            x: dx * smoothAttraction,
            y: dy * smoothAttraction,
            z: dz * smoothAttraction
        };
    }

    // 查找粒子索引的辅助函数
    findParticleIndex(x, y, z) {
        for (let i = 0; i < this.particleCount; i++) {
            const px = this.positions1[i * 3];
            const py = this.positions1[i * 3 + 1];
            const pz = this.positions1[i * 3 + 2];
            if (Math.abs(px - x) < 0.001 && Math.abs(py - y) < 0.001 && Math.abs(pz - z) < 0.001) {
                return i;
            }
        }
        return 0;
    }

    // 计算激活阶段的大小脉冲
    calculateActivationSizePulse(phase, intensity, localProgress) {
        switch (phase) {
            case 1: // 种子激活：快速增大
                return intensity * 0.15;
                
            case 2: // 能量传播：脉冲式变化
                const pulseFreq = 3;
                const pulse = Math.sin(localProgress * Math.PI * pulseFreq) * 0.1;
                return intensity * (0.1 + pulse);
                
            case 3: // 共振稳定：同步脉动
                const syncPulse = Math.sin(localProgress * Math.PI * 2) * 0.05;
                return intensity * (0.08 + syncPulse);
                
            default:
                return 0;
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
        
        // ENHANCED: Reset predictive preparation system for new state
        if (this.transitionCoordinator.predictivePreparationEnabled) {
            this.predictivePrep.resetPreparation();
        }
        
        // ENHANCED: Log transition with emotional context
        if (this.transitionCoordinator.emotionalResponseEnabled) {
            const emotionalState = this.emotionalEngine.currentDominantEmotion;
            const emotionalIntensity = this.emotionalEngine.emotionalStates[emotionalState].intensity;
            console.log(`🔄 Transitioning to ${newState} - Emotional: ${emotionalState} (${emotionalIntensity.toFixed(2)})`);
        }
        
        // Track phase start times for continuous transitions
        const currentTime = this.globalTime;
        switch(newState) {
            case ANIMATION_STATES.CONVERGING:
                this.phaseStartTime = currentTime;
                break;
            case ANIMATION_STATES.X_BREATHING:
                this.phaseStartTime = currentTime;
                this.breathingInitLogged = false; // Reset breathing init log flag
                break;
            case ANIMATION_STATES.ACTIVATION:
                this.phaseStartTime = currentTime;
                // 重置激活系统，准备新的激活序列
                this.activationSeeds = null;
                this.particleToSeedDistance = null;
                break;
            case ANIMATION_STATES.MORPHING:
                this.phaseStartTime = currentTime;
                break;
            case ANIMATION_STATES.DISSIPATING:
                this.phaseStartTime = currentTime;
                break;
        }
        
        // ENHANCED: Record transition in coordination system
        this.transitionCoordinator.lastStateTransition = currentTime;
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
        const simpleHint = document.getElementById('simpleHint');
        const canvas = this.renderer.domElement;
        
        startButton.addEventListener('click', () => {
            this.startNewAnimationSequence();
            // 动画开始后显示提示，3秒后自动隐藏
            setTimeout(() => {
                simpleHint.classList.add('visible');
                setTimeout(() => {
                    simpleHint.classList.remove('visible');
                }, 3000);
            }, 1000);
        });
        
        // ENHANCED: Mouse/touch interaction with environmental awareness
        const updateMousePosition = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
            
            // Update environmental awareness with mouse behavior
            if (this.transitionCoordinator.environmentalAdaptationEnabled) {
                this.environmentalAwareness.updateMouseBehavior(clientX, clientY);
            }
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
        
        // 简化的键盘控制
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'r':
                    this.resetAnimation();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // === INTELLIGENT PERFORMANCE MONITORING ===
        this.performanceMonitor.startFrameTiming();
        const frameData = this.performanceMonitor.recordFrame();
        
        this.frameCount++;
        
        // Check for mobile power saving mode
        const mobileSettings = this.mobileOptimizer.getMobileOptimizedSettings();
        if (mobileSettings.pauseAnimation) {
            // Animation paused due to background state
            this.performanceMonitor.endFrameTiming();
            return;
        }
        
        // Adaptive quality adjustment based on performance
        if (this.frameCount % 60 === 0) { // Check every second
            const qualityChanged = this.qualityManager.adjustQualityBasedOnPerformance(frameData.fps);
            if (qualityChanged) {
                this.applyNewQualitySettings();
            }
        }
        
        // Apply interactive forces and physics when particles exist
        if (this.particles) {
            const qualitySettings = this.qualityManager.getCurrentSettings();
            const deviceProfile = this.deviceIntelligence.deviceProfile;
            
            // Update shader uniforms for time-based effects
            if (this.particles.material.uniforms) {
                this.particles.material.uniforms.time.value = performance.now() * 0.001;
            }
            
            // Epic Enhancement: Update energy trail system (quality dependent)
            if (qualitySettings.trailLength > 0) {
                this.updateEnergyTrails();
            }
            
            // Epic Enhancement: Update visual effects (quality dependent)
            if (qualitySettings.godRaysIntensity > 0) {
                this.updateGodRayVisuals();
            }
            if (qualitySettings.trailLength > 0) {
                this.updateTrailVisuals();
            }
            
            // Epic Enhancement: Apply mouse magnetism during breathing phase (mobile optimized)
            if (this.currentState === ANIMATION_STATES.X_BREATHING) {
                this.mouseMagnetism.enabled = true;
                if (!deviceProfile.isMobile || this.frameCount % 2 === 0) {
                    // Reduce update frequency on mobile
                    this.applyMouseMagnetism(this.particles.geometry.attributes.position.array);
                    this.particles.geometry.attributes.position.needsUpdate = true;
                }
            } else {
                this.mouseMagnetism.enabled = false;
            }
            
            // Epic Enhancement: Update procedural audio (DISABLED on low-end devices)
            // Audio system disabled on low-end devices or power saving mode
            if (this.audioEnabled && !mobileSettings.ultraLowPower) {
                // Audio processing only on capable devices
            }
            
            // Intelligent update frequency based on device capabilities
            const updateFrequency = mobileSettings.ultraLowPower ? 4 : 
                                   mobileSettings.reducedUpdateFrequency ? 3 : 
                                   qualitySettings.updateFrequency;
            const shouldUpdate = this.frameCount % updateFrequency === 0;
            
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
        
        // Epic Enhancement: Update cinematic camera effects
        this.updateCinematicCamera();
        
        // Update camera for smooth movement
        this.updateCamera();
        
        this.renderer.render(this.scene, this.camera);
        
        // === COMPLETE PERFORMANCE MONITORING ===
        this.performanceMonitor.endFrameTiming();
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
        
        // ENHANCED: Clean up all enhancement systems
        this.enableTrails = false;
        this.trailPrewarm = false;
        this.trailIntensity = 0.0;
        this.godRays.active = false;
        this.mouseMagnetism.enabled = false;
        // this.stopProceduralAudio(); // Audio system disabled
        
        // Reset advanced transition systems
        if (this.predictivePrep) {
            this.predictivePrep.resetPreparation();
        }
        
        // Reset particle energy state
        this.particleEnergyState = {
            averageEnergy: 0,
            energyDistribution: 0,
            harmonicBalance: 0,
            convergenceRate: 0,
            lastUpdate: 0
        };
        
        // Hide god rays and trails
        if (this.godRayMeshes) {
            this.godRayMeshes.forEach(ray => ray.visible = false);
        }
        if (this.trailMeshes) {
            this.trailMeshes.forEach(trail => trail.visible = false);
        }
        
        console.log('🎯 Enhanced animation reset - ready for emotionally intelligent convergence!');

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

    // ENHANCED: Advanced transition control methods
    setTransitionSmoothnessLevel(level) {
        if (['basic', 'smooth', 'ultra'].includes(level)) {
            this.transitionCoordinator.smoothnessLevel = level;
            console.log(`🎚️ Transition smoothness set to: ${level}`);
        }
    }

    toggleEmotionalResponse() {
        this.transitionCoordinator.emotionalResponseEnabled = !this.transitionCoordinator.emotionalResponseEnabled;
        console.log(`💭 Emotional response: ${this.transitionCoordinator.emotionalResponseEnabled ? 'enabled' : 'disabled'}`);
    }

    toggleAdaptiveTiming() {
        this.transitionCoordinator.adaptiveTimingEnabled = !this.transitionCoordinator.adaptiveTimingEnabled;
        console.log(`⏱️ Adaptive timing: ${this.transitionCoordinator.adaptiveTimingEnabled ? 'enabled' : 'disabled'}`);
    }

    togglePredictivePreparation() {
        this.transitionCoordinator.predictivePreparationEnabled = !this.transitionCoordinator.predictivePreparationEnabled;
        console.log(`🔮 Predictive preparation: ${this.transitionCoordinator.predictivePreparationEnabled ? 'enabled' : 'disabled'}`);
    }

    toggleEnvironmentalAdaptation() {
        this.transitionCoordinator.environmentalAdaptationEnabled = !this.transitionCoordinator.environmentalAdaptationEnabled;
        console.log(`🌍 Environmental adaptation: ${this.transitionCoordinator.environmentalAdaptationEnabled ? 'enabled' : 'disabled'}`);
    }

    // Get current transition enhancement status
    getTransitionStatus() {
        return {
            smoothnessLevel: this.transitionCoordinator.smoothnessLevel,
            emotionalResponse: this.transitionCoordinator.emotionalResponseEnabled,
            adaptiveTiming: this.transitionCoordinator.adaptiveTimingEnabled,
            predictivePreparation: this.transitionCoordinator.predictivePreparationEnabled,
            environmentalAdaptation: this.transitionCoordinator.environmentalAdaptationEnabled,
            currentEmotion: this.emotionalEngine.currentDominantEmotion,
            emotionalIntensity: this.emotionalEngine.emotionalStates[this.emotionalEngine.currentDominantEmotion]?.intensity || 0,
            particleEnergyState: this.particleEnergyState,
            environmentalState: this.environmentalAwareness.getEnvironmentalState()
        };
    }

    // Debug mode for development
    toggleDebugMode() {
        this.transitionCoordinator.debugMode = !this.transitionCoordinator.debugMode;
        console.log(`🐛 Debug mode: ${this.transitionCoordinator.debugMode ? 'enabled' : 'disabled'}`);
        
        if (this.transitionCoordinator.debugMode) {
            // Log current status
            console.log('Current transition status:', this.getTransitionStatus());
        }
    }

    // === INTELLIGENT DEVICE ADAPTATION METHODS ===

    applyNewQualitySettings() {
        const qualitySettings = this.qualityManager.getCurrentSettings();
        const oldParticleCount = this.particleCount;
        
        console.log(`🔄 Applying new quality settings: ${this.qualityManager.currentQuality}`);
        
        // Update particle count if needed
        if (qualitySettings.particleCount !== oldParticleCount) {
            this.particleCount = qualitySettings.particleCount;
            console.log(`🎨 Particle count adjusted: ${oldParticleCount} → ${this.particleCount}`);
            
            // TODO: Reconstruct particle system with new count
            // For now, just update the reference count
        }
        
        // Update trail settings
        this.trailLength = qualitySettings.trailLength;
        
        // Update emission settings
        this.maxEmissionParticles = Math.floor(qualitySettings.particleCount * 0.25);
        this.emissionRate = qualitySettings.updateFrequency === 1 ? 5 : 3;
        
        // Update turbulence
        this.turbulence = qualitySettings.complexShaders ? 0.005 : 0.003;
        
        // Update god rays intensity
        if (this.godRays) {
            this.godRays.intensity *= qualitySettings.godRaysIntensity / 0.8; // Adjust relative to max
        }
        
        console.log(`✅ Quality settings applied successfully`);
    }

    // Device information methods
    getDeviceInformation() {
        const deviceConfig = this.deviceIntelligence.getOptimalConfig();
        const qualitySettings = this.qualityManager.getCurrentSettings();
        const performanceState = this.performanceMonitor.getPerformanceState();
        const mobileSettings = this.mobileOptimizer.getMobileOptimizedSettings();
        const powerState = this.mobileOptimizer.getPowerSavingState();
        
        return {
            device: {
                class: deviceConfig.deviceClass,
                type: deviceConfig.profile.isMobile ? 'Mobile' : 
                      deviceConfig.profile.isTablet ? 'Tablet' : 'Desktop',
                profile: deviceConfig.profile,
                benchmark: deviceConfig.benchmark
            },
            quality: {
                current: this.qualityManager.currentQuality,
                settings: qualitySettings,
                adaptive: this.qualityManager.adaptiveSettings.enabled
            },
            performance: performanceState,
            mobile: {
                optimizations: mobileSettings,
                powerSaving: powerState,
                touchState: this.mobileOptimizer.getTouchState()
            }
        };
    }

    // Manual quality control
    setQualityLevel(level) {
        if (this.qualityManager.forceQuality(level)) {
            this.applyNewQualitySettings();
            return true;
        }
        return false;
    }

    // Performance control methods
    toggleAdaptiveQuality() {
        return this.qualityManager.toggleAdaptiveQuality();
    }

    resetPerformanceMetrics() {
        this.performanceMonitor.reset();
        console.log('📊 Performance metrics reset');
    }

    // Mobile-specific controls
    enablePowerSavingMode() {
        if (this.mobileOptimizer.isActive) {
            this.mobileOptimizer.enablePowerSavingMode();
            this.setQualityLevel('minimal');
        }
    }

    disablePowerSavingMode() {
        if (this.mobileOptimizer.isActive) {
            this.mobileOptimizer.disablePowerSavingMode();
            // Let adaptive quality determine the best level
        }
    }

    // Performance monitoring
    getPerformanceStats() {
        const baseStats = {
            particleCount: this.particleCount,
            emissionPoints: this.emissionPoints.length,
            audioEnabled: this.audioEnabled,
            performanceMode: this.performanceMode,
            frameCount: this.frameCount
        };
        
        return {
            ...baseStats,
            intelligent: this.getDeviceInformation()
        };
    }

    // Enhanced status reporting
    getEnhancedStatus() {
        const transitionStatus = this.getTransitionStatus();
        const deviceInfo = this.getDeviceInformation();
        
        return {
            animation: {
                currentState: this.currentState,
                stateProgress: this.stateProgress,
                isAnimating: this.isAnimating
            },
            transitions: transitionStatus,
            device: deviceInfo,
            recommendations: this.performanceMonitor.getOptimizationRecommendations()
        };
    }

    // Developer utilities
    benchmarkDevice() {
        console.log('🧪 Running device benchmark...');
        this.deviceIntelligence.runQuickBenchmark();
        return this.deviceIntelligence.performanceBenchmark;
    }

    logDeviceCapabilities() {
        const info = this.getDeviceInformation();
        console.group('📱 Device Capabilities Report');
        console.log('Device Class:', info.device.class);
        console.log('Device Type:', info.device.type);
        console.log('Quality Level:', info.quality.current);
        console.log('Performance:', info.performance.level);
        console.log('Current FPS:', info.performance.fps.current.toFixed(1));
        console.log('Target FPS:', info.performance.fps.target);
        console.log('Particle Count:', info.quality.settings.particleCount);
        console.log('Mobile Optimizations:', info.mobile.optimizations);
        console.groupEnd();
    }
}

// 初始化动画
window.addEventListener('load', () => {
    new ParticleAnimation();
});