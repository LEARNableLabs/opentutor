# Computer Graphics — Teaching Notes

## Approach

Computer graphics is fundamentally **visual** — students learn best when they see their code produce images. The teaching strategy is **build-first, explain-later**: get a sphere rendering quickly, then explain why the math works. Balance geometric intuition (what's happening in 3D space?) with algorithmic thinking (what's the recipe?). At the intermediate level, we assume basic programming but NO prior graphics experience, so everything builds from first principles. The key is maintaining momentum: short lessons with immediate visual feedback, avoiding lengthy mathematical detours until students have working code they care about optimizing.

## Common Misconceptions

1. **"Ray tracing simulates light rays traveling from the light source"**
   - **Why students think this**: It matches physical intuition (light emits from sources)
   - **Correction**: We trace rays backward from the camera because most light rays never hit the camera. Explain bidirectionality of light transport.

2. **"Rasterization is obsolete now that we have ray tracing"**
   - **Why students think this**: Marketing hype around RTX and path tracing
   - **Correction**: Rasterization is still dominant in real-time applications (games, UI). Ray tracing is used selectively for effects that are hard to rasterize (reflections, shadows). Hybrid approaches are the norm.

3. **"The ray-sphere intersection formula is something you have to memorize"**
   - **Why students think this**: Math formulas feel arbitrary
   - **Correction**: Derive it step-by-step from the sphere equation (x² + y² + z² = r²) and the ray equation (P = O + t*D). Show it's just substitution + quadratic formula, not magic.

4. **"Surface normals are just for decoration"**
   - **Why students think this**: They're not visible in the output
   - **Correction**: Normals are critical for lighting. Show a scene with incorrect normals (flipped or zero) to illustrate their importance.

5. **"Phong shading is wrong because it's not physically based"**
   - **Why students think this**: PBR is presented as "correct" vs Phong being "fake"
   - **Correction**: Phong is an empirical model that works well and is computationally cheap. PBR is more accurate to physics, but both are approximations. The right tool depends on the job.

6. **"BVH acceleration is too advanced for a basic ray tracer"**
   - **Why students think this**: BVH involves recursion and tree structures
   - **Correction**: Even a naive BVH (median split) is straightforward to implement and makes a dramatic performance difference. Without it, scenes with >10 objects become painfully slow.

7. **"Recursive ray tracing for reflections will cause infinite loops"**
   - **Why students think this**: Reflections can bounce forever between mirrors
   - **Correction**: We limit recursion depth (e.g., 5 bounces) and/or use Russian roulette termination. Explain energy loss ensures convergence even without explicit depth limits.

8. **"Monte Carlo integration requires advanced statistics"**
   - **Why students think this**: The name sounds intimidating
   - **Correction**: At its core, Monte Carlo is just "average a bunch of random samples." Start with averaging random points under a curve before introducing variance and convergence theory.

9. **"You need linear algebra to do graphics"**
   - **Why students think this**: Graphics courses often start with matrix transformations
   - **Correction**: For basic ray tracing, you only need vector arithmetic (add, subtract, dot product, cross product). Matrices are useful but not essential for this curriculum.

10. **"Ray tracing is only for offline rendering (movies, CGI)"**
    - **Why students think this**: Historical context + slow CPU ray tracers
    - **Correction**: Modern GPUs (RTX, Metal) have ray tracing hardware. Real-time ray tracing is now feasible for games and interactive applications.

## Level Adjustments

### At Intermediate Level (This Curriculum)
- **Depth**: Implement a full basic ray tracer with materials, lighting, and acceleration
- **Math**: Introduce formulas with geometric intuition first, formal proofs only if student asks
- **Code**: Provide pseudocode and structure, but students write the implementation
- **Scope**: Cover fundamentals + one advanced topic (path tracing preview)

### If Adjusting to Beginner
- **Skip**: BVH, BRDF theory, Monte Carlo integration
- **Simplify**: Use only spheres (skip triangles), only Phong lighting (skip PBR)
- **Add scaffolding**: Provide more code templates, focus on "make it work" over "make it fast"
- **Shorten**: 15-18 lessons instead of 26

### If Adjusting to Advanced
- **Add**: Path tracing, importance sampling, bidirectional path tracing, photon mapping
- **Deepen**: Microfacet theory, spectral rendering, physically accurate cameras
- **Formalize**: Derive the rendering equation, prove unbiasedness of estimators
- **Expand**: 35-40 lessons with more optimization techniques

## Rabbit Holes

These are fascinating tangents to drop in when students show curiosity:

- **Caustics** (lesson 20-21) — Light focusing through glass creates beautiful patterns; show examples from graphics papers or photos
- **Cornelia Parker's "Cold Dark Matter"** (lesson 19) — Art installation using shadows; connects rendering to real-world perception
- **Black holes and gravitational lensing** (lesson 20) — Ray tracing is used in astrophysics to visualize curved spacetime
- **Pixar's rendering architecture** (lesson 22-23) — RenderMan, Moonray; how studios use these concepts in production
- **The rendering equation** (lesson 23) — Introduce Kajiya's 1986 paper as the theoretical foundation for all of this
- **Neural radiance fields (NeRFs)** (lesson 26) — Modern ML approach to novel view synthesis; show how it relates to ray tracing
- **Ray tracing on Mars rovers** (lesson 12) — NASA uses ray tracing to plan camera movements and simulate lighting
- **Inigo Quilez (IQ) distance field techniques** (lesson 24) — Show his beautiful Shadertoy work and explain SDFs
- **Light transport notation** (lesson 16) — Regular expressions for light paths (e.g., L(D|S)*E); helps reason about global illumination
- **Historical context** (lesson 1) — Turner Whitted's 1980 paper, the first recursive ray tracer; show original images

## Difficulty Progression

### Early Ramp (Lessons 1-7)
**Difficulty**: 1-2 (gentle introduction)
- Goal: Build confidence and momentum
- Strategy: Short, accessible lessons with immediate visual payoff
- Avoid: Heavy math, long debugging sessions

### First Climb (Lessons 8-13)
**Difficulty**: 2-3 (core fundamentals)
- Goal: Implement basic ray-object intersection
- Strategy: Scaffold the math (show derivation, provide formula, code together)
- Peak: Lesson 9 (ray-sphere intersection) — first serious math
- Recovery: Lesson 13 review to consolidate

### Plateau (Lessons 14-18)
**Difficulty**: 2-3 (building fluency)
- Goal: Understand lighting models
- Strategy: Compare models (Phong vs PBR), connect to real-world materials
- Peak: Lesson 16 (BRDF/PBR) — conceptual jump
- Recovery: Lessons 17-18 apply concepts in gentler contexts

### Summit (Lessons 19-24)
**Difficulty**: 3-4 (advanced techniques)
- Goal: Add reflections, textures, acceleration
- Strategy: Iterative refinement (add one feature at a time, test, repeat)
- Peaks: Lesson 20 (refraction), Lesson 22 (BVH)
- Recovery: Lesson 24 (Shadertoy exploration) — creative break

### Descent (Lessons 25-26)
**Difficulty**: 1-2 (integration and reflection)
- Goal: Consolidate learning, point toward future study
- Strategy: Review, meta-reflection, preview advanced topics (path tracing)

### Review Cadence
- **Lesson 7**: Teach-back on rasterization (after 6 lessons)
- **Lesson 13**: Formal review of ray fundamentals (after 5 lessons)
- **Lesson 18**: Teach-back on materials (after 5 lessons)
- **Lesson 25**: Formal review of advanced techniques (after 7 lessons)

This spacing aligns with spaced repetition principles: review before forgetting sets in.

## Teaching Anti-Patterns to Avoid

1. **Over-formalizing too early** — Don't start with linear algebra or the rendering equation. Build intuition first.
2. **Death by PowerPoint** — Every lesson should produce code or images. Avoid pure theory dumps.
3. **Premature optimization** — Don't introduce BVH until students have a working (slow) ray tracer they want to speed up.
4. **Skipping rasterization** — Students need the contrast to appreciate ray tracing's strengths and weaknesses.
5. **Monolithic projects** — Break the final ray tracer into incremental steps; each lesson should add one feature.

## Success Signals

You'll know the student is progressing well when they:
- **Debug visually** — "The sphere is too dark, so the normal must be flipped"
- **Reason geometrically** — Draw diagrams to explain ray-plane intersection
- **Ask "why" questions** — "Why does Phong use the reflected ray direction instead of the normal?"
- **Experiment independently** — "I tried adding more spheres to see what happens"
- **Connect to other fields** — "This is like the quadratic formula from algebra"

## Resources for Adaptation

If a student struggles or excels, draw from these resources:

- **Struggling with math**: Use Scratchapixel's visual explanations, GeoGebra demos
- **Wants more code**: Point to Ray Tracing in One Weekend (full implementation)
- **Wants more theory**: Point to PBRT book (rigorous derivations)
- **Wants more visuals**: Point to Inigo Quilez's articles, Two Minute Papers videos
- **Wants to go deeper**: Point to Pharr/Jakob/Humphreys PBRT, Stanford CS348B notes
