# Computer Graphics — Rendering and Ray Tracing
## Research Summary

### Major Subtopics

1. **Rendering Fundamentals** — Color theory, coordinate systems, viewing transformations, the rendering equation
2. **Rasterization** — Traditional pipeline, scanline rendering, Z-buffering, clipping
3. **Ray Tracing Core** — Ray-object intersection (spheres, planes, triangles), camera models, image formation
4. **Lighting Models** — Phong shading, physically-based rendering (PBR), BRDFs, global illumination
5. **Advanced Ray Tracing** — Shadows, reflections, refraction, indirect lighting, Monte Carlo integration
6. **Materials and Textures** — Texture mapping, normal mapping, procedural textures, material models (diffuse, specular, dielectric, metal)
7. **Acceleration Structures** — Bounding volume hierarchies (BVH), spatial partitioning, performance optimization
8. **Advanced Topics** — Path tracing, photon mapping, ambient occlusion, depth of field, motion blur

### Key Sources

**Canonical Textbooks:**
- *Physically Based Rendering: From Theory to Implementation* (Pharr, Jakob, Humphreys) — industry standard, covers theory and implementation
- *Fundamentals of Computer Graphics* (Marschner & Shirley) — comprehensive intro to all topics
- *Real-Time Rendering* (Akenine-Möller et al.) — covers both rasterization and modern techniques

**Online Courses:**
- MIT 6.837 Computer Graphics (OpenCourseWare) — strong fundamentals
- Stanford CS348B: Image Synthesis Techniques — graduate-level rendering
- Carnegie Mellon 15-462/662 Computer Graphics — excellent balance of theory and practice

**Interactive Learning:**
- *Ray Tracing in One Weekend* series (Peter Shirley) — hands-on, code-first approach
- Scratchapixel — detailed tutorials with interactive examples
- Shadertoy — community shaders, live experimentation
- LearnOpenGL — excellent for rasterization foundations

**Research & References:**
- The Graphics Codex (Morgan McGuire) — concise reference encyclopedia
- SIGGRAPH course notes — cutting-edge techniques
- pbrt-v3/v4 source code — reference implementation

### Available Resources

**Free Online Materials:**
- Ray Tracing in One Weekend: https://raytracing.github.io/
- Scratchapixel: https://www.scratchapixel.com/
- PBRT online edition: https://www.pbr-book.org/
- LearnOpenGL: https://learnopengl.com/
- The Graphics Codex: https://graphicscodex.com/

**University Courses (with lecture notes/slides):**
- MIT OCW 6.837: https://ocw.mit.edu/courses/6-837-computer-graphics-fall-2012/
- Stanford CS348B: https://graphics.stanford.edu/courses/cs348b/
- Carnegie Mellon 15-462: http://15462.courses.cs.cmu.edu/

**Interactive Tools:**
- Shadertoy: https://www.shadertoy.com/
- GeoGebra for 3D geometry: https://www.geogebra.org/3d
- WebGL sandboxes: https://webglfundamentals.org/

**Video Content:**
- Two Minute Papers (YouTube) — research paper explanations
- The Cherno's OpenGL series — practical implementation
- Sebastian Lague's ray tracing series — intuitive explanations

**Code Repositories:**
- pbrt-v3: https://github.com/mmp/pbrt-v3
- Ray Tracing in One Weekend code: https://github.com/RayTracing/raytracing.github.io
- tinyraytracer: https://github.com/ssloy/tinyraytracer

### Pedagogical Notes

**For Intermediate Level:**
- Assumes basic programming (loops, functions, vectors)
- Assumes high school math (algebra, basic trig)
- Does NOT assume prior linear algebra (will introduce as needed)
- Does NOT assume calculus (will keep integration intuitive)

**Learning Approach:**
- Start with intuition (what ray tracing IS) before implementation
- Build incrementally (start with simple sphere, add complexity)
- Balance theory and practice (understand why, then code it)
- Visual feedback is critical (render images frequently)
- Compare rasterization vs ray tracing to build mental models

**Common Entry Points:**
- Many students come from game dev → leverage rasterization familiarity
- Some come from pure math → emphasize geometric intuition
- Some come from physics → connect to optics and light transport
