# Computer Graphics — Concept Map

## Core Concepts (in learning order)

1. **Image Formation** — How numbers become pixels on a screen
2. **Color Spaces** — RGB, gamma correction, color representation
3. **Coordinate Systems** — World space, camera space, screen space, transformations between them
4. **Camera Model** — Mathematical description of a virtual camera (viewport, FOV, projection)
5. **Rasterization** — Converting 3D geometry to 2D pixels via scanline/triangle pipeline. Depends on: Coordinate Systems, Camera Model
6. **Ray** — Parametric line equation (origin + t * direction). Depends on: Coordinate Systems
7. **Ray Generation** — Casting rays from camera through each pixel. Depends on: Camera Model, Ray
8. **Ray-Object Intersection** — Testing if/where a ray hits geometry (spheres, planes, triangles). Depends on: Ray
9. **Hit Record** — Tracking intersection data (t-value, point, normal). Depends on: Ray-Object Intersection
10. **Surface Normal** — Vector perpendicular to surface at hit point, critical for lighting. Depends on: Hit Record
11. **Shading** — Computing pixel color based on material and lighting. Depends on: Surface Normal
12. **Diffuse Reflection** — Lambertian/matte surfaces that scatter light equally in all directions. Depends on: Shading, Surface Normal
13. **Specular Reflection** — Mirror-like reflections with highlights. Depends on: Shading, Surface Normal
14. **Phong Model** — Ambient + Diffuse + Specular lighting approximation. Depends on: Diffuse Reflection, Specular Reflection
15. **BRDF (Bidirectional Reflectance Distribution Function)** — How light scatters off a surface mathematically. Depends on: Shading
16. **Physically Based Rendering (PBR)** — Realistic material models based on physics. Depends on: BRDF
17. **Material Models** — Conductor vs dielectric, roughness, metallic workflow. Depends on: PBR
18. **Shadow Rays** — Testing occlusion between hit point and light source. Depends on: Ray-Object Intersection
19. **Recursive Rays** — Tracing reflection/refraction rays from hit points. Depends on: Ray-Object Intersection, Specular Reflection
20. **Refraction** — Light bending through transparent materials (Snell's law). Depends on: Recursive Rays
21. **Texture Mapping** — Applying images or patterns to surfaces via UV coordinates. Depends on: Hit Record
22. **Procedural Textures** — Generating patterns mathematically instead of from images. Depends on: Texture Mapping
23. **Bounding Volumes** — Enclosing geometry in simple shapes for fast rejection testing. Depends on: Ray-Object Intersection
24. **BVH (Bounding Volume Hierarchy)** — Tree structure for accelerating intersection tests. Depends on: Bounding Volumes
25. **Monte Carlo Integration** — Using random sampling to approximate integrals (e.g., area lights, global illumination). Depends on: Shading
26. **Path Tracing** — Following random light paths for global illumination. Depends on: Monte Carlo Integration, Recursive Rays

## Dependencies

### Critical Path
The core dependency chain for basic ray tracing:
**Camera Model → Ray Generation → Ray-Object Intersection → Hit Record → Surface Normal → Shading**

Without this chain, you cannot render anything meaningful.

### Lighting Dependencies
- **Phong Model** requires understanding both diffuse and specular separately
- **PBR** builds on BRDF theory, which generalizes the Phong model
- **Shadow Rays** are just ray-object intersection applied to occlusion testing
- **Material Models** depend on PBR framework

### Advanced Technique Dependencies
- **Recursive Rays** require solid understanding of ray-object intersection (same algorithm, different context)
- **Refraction** extends recursive rays with Snell's law and total internal reflection
- **BVH** is an optimization of ray-object intersection, not a new concept
- **Path Tracing** combines Monte Carlo + Recursive Rays + PBR

### Texture Dependencies
- **Texture Mapping** requires hit record (UV coordinates computed at intersection)
- **Normal Mapping** modifies surface normals, so depends on understanding normals first
- **Procedural Textures** can bypass UV coordinates but still need hit points

## Bottleneck Concepts

These concepts are prerequisites for many downstream topics:

1. **Surface Normal** — Almost every lighting/shading concept depends on this
2. **Ray-Object Intersection** — Core operation that gets reused for primary rays, shadow rays, reflection rays, etc.
3. **Hit Record** — Data structure that connects geometry to shading
4. **BRDF** — Gateway to understanding realistic materials

## Common Misconceptions

### About Rays
- **Misconception**: Rays are physical objects that travel through the scene
- **Reality**: Rays are mathematical queries we use to sample the scene; they don't "move"

### About Lighting
- **Misconception**: The Phong model is "wrong" because it's not physically based
- **Reality**: Phong is an empirical model that works well for many materials; PBR is more physically accurate but not always necessary

### About Performance
- **Misconception**: Ray tracing is always slower than rasterization
- **Reality**: For certain effects (reflections, shadows), ray tracing can be more efficient; modern hardware (RTX) accelerates it

### About Intersection
- **Misconception**: We need to test every ray against every object
- **Reality**: Acceleration structures (BVH, spatial partitioning) make this logarithmic instead of linear

### About Recursion
- **Misconception**: Recursive rays (reflection/refraction) need to go infinitely deep
- **Reality**: We limit recursion depth (5-10 bounces) or use Russian roulette to terminate paths probabilistically

## Prerequisite Topics

- **Vectors and Vector Arithmetic** — needed for rays, normals, dot products
- **Basic Trigonometry** — needed for reflection, refraction angles
- **Linear Algebra (matrices)** — optional for transformations, but can teach as-needed
- **Basic Programming** — loops, functions, data structures (arrays, classes)

## Learning Sequence Notes

### Why Rasterization First?
Teaching rasterization before ray tracing provides contrast and helps students appreciate why ray tracing exists. It also grounds abstract concepts (coordinate systems, camera) in something they may have seen (games, graphics APIs).

### Why Spheres Before Triangles?
Sphere intersection is simpler (quadratic equation) and provides faster visual feedback. Triangles are more useful but require barycentric coordinates and more bookkeeping.

### When to Introduce Math Formalism?
- Start with **geometric intuition** (what does this do?)
- Show **code implementation** (how do we compute it?)
- Introduce **mathematical formalism** (why does this work?) as students gain confidence

### Difficulty Spikes
- **Lesson 9 (Ray-Sphere Intersection)** — first time solving geometric equations
- **Lesson 16 (BRDF/PBR)** — significant conceptual jump from Phong
- **Lesson 20 (Refraction)** — Snell's law + total internal reflection is tricky
- **Lesson 22 (BVH)** — data structures + recursion + spatial reasoning

Each spike is followed by easier lessons or review to consolidate.
