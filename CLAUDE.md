# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Three.js particle animation project that creates a morphing X logo effect. The animation uses particles to form the shape of an X logo based on image masks and transitions between two different X shapes.

**ENHANCED VERSION**: The project now features an advanced **Multi-Dimensional Emotional Intelligence Transition System** and **Intelligent Device Adaptation System** that significantly improves animation transitions and optimizes performance across all devices:

### Emotional Intelligence System
- **Emotional Transition Engine**: Provides expressive animations with anticipation, excitement, calm, release, and harmony emotional states
- **Intelligent Rhythm Control**: Adapts timing based on particle convergence analysis and energy distribution
- **Multi-Dimensional Interpolator**: Advanced Bézier curves, harmonic blending, and elastic spring interpolations
- **Predictive Transition Preparation**: Pre-warms effects for seamless state transitions
- **Environmental Awareness**: Responds to mouse behavior, window size, and performance state

### Intelligent Device Adaptation System
- **Smart Device Detection**: Automatic hardware analysis, performance benchmarking, and device classification
- **Five-Tier Quality Management**: From minimal to flagship quality presets with real-time adaptive adjustment
- **Mobile Optimization**: Battery-aware modes, enhanced touch interaction, memory pressure handling
- **Performance Monitoring**: Real-time FPS tracking, thermal throttling detection, optimization recommendations
- **Responsive Design**: Automatic scaling, viewport optimization, and power-preference settings

## Development Commands

- **Local Development**: Start a local web server (required for CORS compliance when loading images)
  ```bash
  python -m http.server 8000
  # or
  npx serve .
  # or
  php -S localhost:8000
  ```
- **Debug Mode**: Open browser DevTools to see console logs for image loading status and particle counts
- **Enhanced Controls**: 
  - Use browser console to access advanced transition and device adaptation controls
  - Call `animation.toggleEmotionalResponse()` to enable/disable emotional intelligence
  - Call `animation.setTransitionSmoothnessLevel('ultra')` for maximum quality
  - Call `animation.getTransitionStatus()` to view current enhancement state
  - Call `animation.logDeviceCapabilities()` to view device analysis and optimization
  - Call `animation.setQualityLevel('high')` to manually set quality level
  - Call `animation.getEnhancedStatus()` for comprehensive system status
- **Image Assets**: The animation requires `pic1.png` and `pic2.png` files in the root directory

## Project Structure

- `index.html` - Main HTML file with Three.js scene container and UI
- `particle-animation.js` - Core `ParticleAnimation` class with all animation logic and enhanced transition systems
- `pic1.png` / `pic2.png` - Image masks that define particle shapes (replaces screenshot files)

## Architecture Deep Dive

The `ParticleAnimation` class follows a state-driven architecture enhanced with emotional intelligence and intelligent device adaptation:

### Intelligent Device Adaptation Architecture

1. **Device Intelligence** (`DeviceIntelligence`):
   - Analyzes hardware characteristics, screen size, and WebGL capabilities
   - Runs performance benchmarks to validate device classification
   - Provides device scoring algorithm (0-100) for quality determination
   - Detects mobile devices, tablets, and low-power modes

2. **Quality Manager** (`QualityManager`):
   - Manages five quality presets from minimal to flagship
   - Implements real-time adaptive quality adjustment based on FPS
   - Provides mobile-specific quality mapping for battery optimization
   - Controls particle count, effects complexity, and update frequency

3. **Mobile Optimizer** (`MobileOptimizer`):
   - Battery API integration for automatic power saving modes
   - Enhanced touch handling with gesture recognition
   - Page visibility API for background animation pausing
   - Memory pressure monitoring and cleanup

4. **Performance Monitor** (`PerformanceMonitor`):
   - Real-time FPS tracking and frame time analysis
   - Thermal throttling detection and baseline performance comparison
   - Optimization recommendations based on performance metrics
   - Adaptive performance level classification

### Enhanced Transition System Architecture

1. **Emotional Transition Engine** (`EmotionalTransitionEngine`):
   - Calculates emotional intensity based on animation state and particle behavior
   - Provides 5 emotional states: anticipation, excitement, calm, release, harmony
   - Modulates easing functions for expressive movement
   - Applies emotional color and motion influences

2. **Intelligent Rhythm Controller** (`IntelligentRhythmController`):
   - Analyzes particle convergence state and energy distribution
   - Calculates adaptive duration multipliers for responsive timing
   - Provides breathing rhythm parameters based on emotional state
   - Maintains rhythm history for trend analysis

3. **Multi-Dimensional Interpolator** (`MultiDimensionalInterpolator`):
   - Advanced Bézier interpolation with dynamic control points
   - Harmonic color blending with frequency components
   - Elastic spring interpolation with overshoot
   - Exponential flow for energy-like properties
   - Tension control based on emotional state

4. **Predictive Transition Preparation** (`PredictiveTransitionPrep`):
   - Pre-warms effects for next animation stage
   - Smooth activation with preparation thresholds
   - Reduces visual discontinuities between states
   - Manages preparation intensity for various effect types

5. **Environmental Awareness** (`EnvironmentalAwareness`):
   - Tracks mouse behavior, velocity, and acceleration
   - Monitors window state and performance metrics
   - Calculates adaptive response intensity
   - Provides environmental motion modifiers

### Core Animation States (Enhanced)

1. **Initialization Phase** (`init()`):
   - Sets up Three.js scene, camera, renderer with WebGL
   - Loads both image assets sequentially 
   - Extracts particle positions from image pixel data
   - Creates BufferGeometry with position and color attributes
   - **NEW**: Initializes all enhancement systems

2. **CONVERGING** (汇聚阶段) - Enhanced with Emotional Intelligence:
   - **Adaptive Duration**: Based on convergence analysis
   - **Emotional Easing**: Anticipation → Excitement → Harmony progression
   - **Multi-dimensional Interpolation**: Advanced Bézier paths with emotional modulation
   - **Environmental Responsiveness**: Mouse and performance-based adjustments

3. **X_BREATHING** (呼吸阶段) - Enhanced with Intelligent Rhythm:
   - **Adaptive Breathing Parameters**: Emotional state-driven rhythm
   - **Harmonic Balance**: Breathing amplitude based on particle harmony
   - **Environmental Scaling**: Responsive to window size and performance
   - **Predictive Trail Pre-warming**: Smooth preparation for activation

4. **ACTIVATION** (激活阶段) - Enhanced Neural Network Approach:
   - **Emotional Color Transitions**: Breathing → Activation color flow
   - **Predictive Effect Management**: Trail system smooth activation
   - **Cinematic Enhancement**: Camera shake and god rays with emotional timing

5. **MORPHING** (变形阶段) - Enhanced Multi-dimensional Transformation:
   - **Advanced Path Calculation**: Multi-dimensional interpolation
   - **Emotional Transformation Flow**: Anticipation → Excitement → Release progression
   - **Environmental Adaptation**: Performance-based quality adjustments

6. **DISSIPATING** (消散阶段) - Enhanced Environmental Awareness:
   - **Adaptive Dissipation**: Environmental response-based effects
   - **Emotional Release**: Sophisticated release → calm transition

### Enhanced Technical Features

- **Transition Coordination**: Unified control system for all enhancements
- **Real-time Adaptation**: Performance and environmental response
- **Emotional Color Modulation**: Dynamic color shifts based on emotional state
- **Advanced Particle Physics**: Energy state tracking and analysis
- **Predictive Systems**: Pre-warming and smooth activation
- **Debug Interface**: Console commands for real-time adjustment

### Usage Examples

```javascript
// Access the animation instance (available globally after initialization)

// === Emotional Intelligence Controls ===
// Enable emotional intelligence
animation.toggleEmotionalResponse();

// Set ultra-smooth transitions
animation.setTransitionSmoothnessLevel('ultra');

// Enable all transition enhancements
animation.toggleAdaptiveTiming();
animation.togglePredictivePreparation();
animation.toggleEnvironmentalAdaptation();

// === Device Adaptation Controls ===
// View device capabilities and current settings
animation.logDeviceCapabilities();

// Manual quality control
animation.setQualityLevel('high'); // 'minimal', 'low', 'medium', 'high', 'flagship'

// Toggle adaptive quality adjustment
animation.toggleAdaptiveQuality();

// Mobile-specific controls
animation.enablePowerSavingMode();
animation.disablePowerSavingMode();

// === Status and Monitoring ===
// Check transition status
console.log(animation.getTransitionStatus());

// Get comprehensive system status
console.log(animation.getEnhancedStatus());

// Performance statistics
console.log(animation.getPerformanceStats());

// Run device benchmark
const benchmark = animation.benchmarkDevice();

// Debug mode for development
animation.toggleDebugMode();
```

## Key Technical Details

- **Particle Count**: Dynamic based on extracted positions (typically 2000-8000 particles)
- **Memory Management**: Reuses geometry buffers, only updates position attributes
- **Fallback Handling**: Creates manual X-shape if image extraction fails
- **Array Synchronization**: Pads shorter position arrays with randomized duplicates
- **Performance**: Uses requestAnimationFrame with efficient BufferGeometry updates
- **Enhanced Easing**: 5 emotional easing functions plus advanced physics-based curves
- **Environmental Response**: Mouse tracking, window size, and performance adaptation
- **Emotional Intelligence**: Real-time emotional state calculation and application