# Generative and Computational Art — Concept Map

## Core Concepts (in learning order)

1. **Pseudorandomness** — controlled chance using seeded random number generators
2. **Perlin noise** — coherent, natural-looking randomness over space and time. Depends on: pseudorandomness
3. **Noise fields** — using noise to drive motion and position. Depends on: Perlin noise
4. **Constraints and parameters** — defining design spaces for generative systems. Depends on: pseudorandomness, noise
5. **Probability distributions** — weighted randomness for aesthetic control. Depends on: pseudorandomness
6. **Grid systems** — modular composition using tessellation
7. **Variation within constraint** — breaking regularity while maintaining structure. Depends on: grid systems, pseudorandomness
8. **Recursion** — self-referential functions that create complexity from simplicity
9. **Fractals** — self-similar structures. Depends on: recursion
10. **Recursive subdivision** — dividing space recursively (BSP trees, Mondrian). Depends on: recursion
11. **Symmetry operations** — reflection, rotation, translation for pattern generation
12. **Space-filling curves** — algorithmic paths that fill 2D space. Depends on: recursion
13. **Easing and interpolation** — smooth transitions for organic motion
14. **Particle systems** — collections of objects following individual rules. Depends on: easing
15. **Vectors and forces** — physics simulation using Newton's laws. Depends on: particle systems
16. **Flow fields** — vector fields that guide particle motion. Depends on: Perlin noise, vectors and forces
17. **Feedback loops** — accumulation and decay over time. Depends on: particle systems
18. **Color spaces** — RGB, HSL, LAB and their perceptual differences
19. **Color interpolation** — moving smoothly between colors. Depends on: color spaces, easing
20. **Palette generation** — algorithmic color harmony. Depends on: color spaces
21. **Pixel manipulation** — treating images as data arrays. Depends on: color spaces
22. **Dithering** — creating tone through pattern. Depends on: pixel manipulation
23. **Autonomous agents** — entities with steering behaviors. Depends on: vectors and forces
24. **Flocking** — emergent group behavior. Depends on: autonomous agents
25. **L-systems** — formal grammars for plant-like growth. Depends on: recursion
26. **Cellular automata** — grid-based rule systems (Game of Life). Depends on: grid systems
27. **Long-form generative systems** — designing infinite variation spaces. Depends on: parameters, all prior concepts
28. **Generative art history** — lineage from pioneers to contemporary practice

## Dependencies

### Foundation Dependencies
- **Perlin noise** requires understanding **pseudorandomness** because noise is built on random number generation but adds spatial/temporal coherence
- **Noise fields** build on **Perlin noise** by applying it to vector fields that drive motion
- **Probability distributions** require **pseudorandomness** because they shape how random values are selected
- **Variation within constraint** depends on both **grid systems** (structure) and **pseudorandomness** (breaking it)

### Structural Dependencies
- **Fractals** require **recursion** because self-similarity is expressed through self-referential functions
- **Recursive subdivision** uses **recursion** to partition space hierarchically
- **Space-filling curves** are typically defined **recursively**

### Motion Dependencies
- **Particle systems** build on **easing** to create organic motion paths
- **Vectors and forces** extend **particle systems** by adding physics
- **Flow fields** combine **Perlin noise** (for smooth field generation) with **vectors and forces** (for particle steering)
- **Feedback loops** require **particle systems** as the base for trails and accumulation

### Color Dependencies
- **Color interpolation** needs both **color spaces** (to know where colors live) and **easing** (to move smoothly)
- **Palette generation** depends on **color spaces** to create harmonious combinations
- **Pixel manipulation** requires understanding **color spaces** to work with raw pixel data
- **Dithering** builds on **pixel manipulation** techniques

### Advanced Systems Dependencies
- **Autonomous agents** extend **vectors and forces** with steering behaviors
- **Flocking** is an emergent property of **autonomous agents** following local rules
- **L-systems** use **recursion** to apply rewrite rules over generations
- **Cellular automata** apply rules to **grid systems**
- **Long-form generative systems** synthesize **parameters**, **constraints**, and nearly all prior concepts

## Prerequisite Topics

- **Basic programming** — needed for control flow, functions, arrays, object-oriented thinking
- **Coordinate systems** — needed for positioning, transformations, spatial reasoning
- **Algebra and trigonometry** — needed for angles, circles, sine/cosine for motion, vector math
- **Processing or p5.js basics** — needed for setup/draw loop, basic shapes, colors

## Learning Bottlenecks

1. **Vectors and vector math** — many students struggle with the abstraction of direction + magnitude. Critical for motion, forces, and agents.
2. **Recursion** — requires mental model shift. Essential for fractals, L-systems, space-filling curves.
3. **Color space transformations** — RGB is intuitive but limiting; HSL/LAB unlock better palette control but require learning new mental models.
4. **Parameter space design** — transitioning from "one sketch" to "infinite variations" requires systems thinking.

## Common Misconceptions

- **"Random is always better"** — students often overuse randomness when constraints would be more expressive
- **"More detail = better"** — complexity should serve a purpose; sometimes simplicity is more powerful
- **"Physics must be accurate"** — simulations can be aesthetically driven, not scientifically precise
- **"Grids are boring"** — grids are a starting point; variation within constraint is where artistry emerges
- **"Generative art is automatic"** — curation and parameter tuning are core creative acts

## Concept Clusters for Review

- **Randomness cluster**: pseudorandomness, noise, distributions, constraints
- **Structure cluster**: grids, recursion, symmetry, subdivision
- **Motion cluster**: easing, particles, forces, flow fields, feedback
- **Color cluster**: color spaces, interpolation, palettes, pixels, dithering
- **Emergence cluster**: agents, flocking, L-systems, cellular automata
