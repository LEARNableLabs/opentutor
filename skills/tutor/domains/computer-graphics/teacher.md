# Computer graphics — rendering and ray tracing — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 10 lessons (38%)
- **Socratic questions** — 6 lessons (23%)
- **real-world application challenges** — 4 lessons (15%)
- **teach-back exercises (student explains)** — 3 lessons (12%)
- **review and consolidation sessions** — 2 lessons (8%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Gentle ramp — heavily front-loaded with accessible material before increasing complexity.

Distribution: 54% accessible (1-2), 31% standard (3), 15% challenging (4-5).

Difficulty peaks:
- Day 16: "How does light actually bounce off surfaces in the real world?" (difficulty 4)
- Day 20: "Why do mirrors and windows work so well with ray tracing?" (difficulty 4)
- Day 22: "Why is ray tracing so slow and how can we speed it up?" (difficulty 4)
- Day 23: "What is Monte Carlo integration and why is it everywhere in rendering?" (difficulty 4)

## Domain Hooks
These are fascinating tangents to drop in when students show curiosity:

- **Caustics** (lesson 20-21) — Light focusing through glass creates beautiful patterns; show examples from graphics papers or photos
- **Cornelia Parker's "Cold Dark Matter"** (lesson 19) — Art installation using shadows; connects rendering to real-world perception
- **Black holes and gravitational lensing** (lesson 20) — Ray tracing is used in astrophysics to visualize curved spacetime
- **Pixar's rendering architecture** (lesson 22-23) — RenderMan, Moonray; how studios use these concepts in production
- **The rendering equation** (lesson 23) — Introduce Kajiya's 1986 paper as the theoretical foundation for all of this
- **Neural radiance fields (NeRFs)** (lesson 26) — Modern ML approach to novel view synthesis; show how it relates to ray tracing
- **Ray tracing on Mars rovers** (lesson 12) — NASA uses ray tracing to plan camera movements and simulate lighting
- **Inigo Quilez (IQ) distance field techniques** (l

## Common Failure Modes
1. **"Ray tracing simulates light rays traveling from the light source"**
   - **Why students think this**: It matches physical intuition (light emits from sources)
   - **Correction**: We trace rays backward from the camera because most light rays never hit the camera. Explain bidirectionality of light transport.

2. **"Rasterization is obsolete now that we have ray tracing"**
   - **Why students think this**: Marketing hype around RTX and path tracing
   - **Correction**: Rasterization is still dominant in real-time applications (games, UI). Ray tracing is used selectively for effects that are hard to rasterize (reflections, shadows). Hybrid approaches are the norm.

3. **"The ray-sphere intersection formula is something you have to memorize"**
   - **Why students think this**: Math formulas feel arbitrary
   - **Correction**: Derive it step-by-step from the sphere equation (x² + y² + z² = r²) and the ray equation (P = O + t*D). Show it's just substitution + quadratic formula, not ma

## Vocabulary
Key terms for this domain: rendering definition, image synthesis, rasterization vs ray tracing, pixels, color spaces (RGB), framebuffer, gamma correction, world space, camera space, screen space, transformations, camera model, field of view, viewport, projection (and 80 more).