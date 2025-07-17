# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Three.js particle animation project that creates a morphing X logo effect. The animation uses particles to form the shape of an X logo based on image masks and transitions between two different X shapes.

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
- **Image Assets**: The animation requires `pic1.png` and `pic2.png` files in the root directory

## Project Structure

- `index.html` - Main HTML file with Three.js scene container and UI
- `particle-animation.js` - Core `ParticleAnimation` class with all animation logic
- `pic1.png` / `pic2.png` - Image masks that define particle shapes (replaces screenshot files)

## Architecture Deep Dive

The `ParticleAnimation` class follows a state-driven architecture:

1. **Initialization Phase** (`init()`):
   - Sets up Three.js scene, camera, renderer with WebGL
   - Loads both image assets sequentially 
   - Extracts particle positions from image pixel data
   - Creates BufferGeometry with position and color attributes

2. **Image Processing Pipeline** (`extractParticlePositions()`):
   - Converts images to 512x512 canvas for consistent processing
   - Samples pixels with configurable stride (currently 3px spacing)
   - Converts non-transparent pixels (alpha > 50) to 3D coordinates
   - Falls back to programmatic X-shape if insufficient particles detected
   - Normalizes coordinates to [-4, 4] range in 3D space

3. **Animation System**:
   - Dual-state morphing between `positions1` and `positions2` arrays
   - Forward/reverse animations with 3-second duration each
   - Cubic easing function (`easeInOutCubic`) for smooth transitions
   - Uses `THREE.MathUtils.lerp` for position interpolation
   - Auto-loops with 1-second pause between transitions

4. **Rendering Architecture**:
   - Uses `THREE.Points` with `AdditiveBlending` for glow effects
   - BufferAttribute updates trigger GPU memory sync via `needsUpdate`
   - Responsive canvas that adapts to window resize events
   - Fixed particle size (0.05) with vertex-based coloring

## Key Technical Details

- **Particle Count**: Dynamic based on extracted positions (typically 2000-8000 particles)
- **Memory Management**: Reuses geometry buffers, only updates position attributes
- **Fallback Handling**: Creates manual X-shape if image extraction fails
- **Array Synchronization**: Pads shorter position arrays with randomized duplicates
- **Performance**: Uses requestAnimationFrame with efficient BufferGeometry updates