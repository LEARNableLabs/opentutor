# Computer Graphics — Resources

## Primary Sources (for lesson content)

### Textbooks

**Ray Tracing in One Weekend Series** (Peter Shirley)
- https://raytracing.github.io/
- **What it covers**: Practical ray tracer implementation from scratch (C++)
- **Why it's good for intermediate**: Code-first approach, builds incrementally, no prerequisites beyond basic programming
- **Use for**: Lessons 8-12, 19-20, 22 (core ray tracing and advanced features)

**Scratchapixel**
- https://www.scratchapixel.com/
- **What it covers**: Comprehensive graphics tutorials with math derivations and visual examples
- **Why it's good for intermediate**: Strong geometric intuition, clear explanations, interactive diagrams
- **Use for**: Lessons 1-6, 9-10, 14-15, 21 (foundations, intersections, shading, textures)

**Physically Based Rendering: From Theory to Implementation** (Pharr, Jakob, Humphreys)
- https://www.pbr-book.org/
- **What it covers**: Complete rendering system with full source code (pbrt)
- **Why it's good for intermediate**: Industry-standard reference, readable code, rigorous but accessible
- **Use for**: Lessons 16-17, 22-23 (PBR, BVH, Monte Carlo)

**LearnOpenGL**
- https://learnopengl.com/
- **What it covers**: OpenGL/rasterization fundamentals, modern graphics pipeline
- **Why it's good for intermediate**: Clear tutorials, interactive demos, covers rasterization well
- **Use for**: Lessons 2, 5-6, 14-15, 21 (color, rasterization, basic lighting, textures)

**The Graphics Codex** (Morgan McGuire)
- https://graphicscodex.com/
- **What it covers**: Concise reference encyclopedia of graphics algorithms
- **Why it's good for intermediate**: Quick lookups, visual examples, covers broad topics
- **Use for**: Reference throughout, especially lessons 16-26 (advanced topics)

### University Courses

**MIT 6.837 — Computer Graphics**
- https://ocw.mit.edu/courses/6-837-computer-graphics-fall-2012/
- **Content**: Full course with lecture notes, assignments, slides
- **Use for**: Foundations (coordinate systems, transformations, ray tracing basics)
- **Relevant lectures**: Ray Tracing I & II, Shading, Acceleration Structures

**Stanford CS348B — Image Synthesis Techniques**
- https://graphics.stanford.edu/courses/cs348b/
- **Content**: Graduate-level rendering course
- **Use for**: Advanced topics (path tracing, Monte Carlo, global illumination)
- **Relevant lectures**: Rendering equation, Monte Carlo methods, BRDFs

**Carnegie Mellon 15-462/662 — Computer Graphics**
- http://15462.courses.cs.cmu.edu/
- **Content**: Lecture slides, videos, coding assignments
- **Use for**: Balance of theory and practice
- **Relevant lectures**: Rasterization pipeline, ray tracing, BVH

## Supplementary (for engagement)

### Videos

**Two Minute Papers** (YouTube)
- https://www.youtube.com/c/TwoMinutePapers
- **Content**: Concise explanations of cutting-edge graphics research papers
- **Use for**: "Rabbit hole" moments showing modern techniques (neural rendering, path guiding)
- **Best episodes**: "This is Why Ray Tracing is a BIG Deal", "NVIDIA's AI: Rendering Scenes in Real-Time!"

**The Cherno — OpenGL Series** (YouTube)
- https://www.youtube.com/playlist?list=PLlrATfBNZ98foTJPJ_Ev03o2oq3-GGOS2
- **Content**: Practical OpenGL programming tutorials
- **Use for**: Rasterization implementation details (lesson 6)
- **Best episodes**: "How Rendering Works", "Shaders in OpenGL"

**Sebastian Lague — Ray Tracing Series** (YouTube)
- https://www.youtube.com/watch?v=Qz0KTGYJtUk
- **Content**: Intuitive explanations with Unity implementations
- **Use for**: Visual learners who want to see concepts animated
- **Best episodes**: "Coding Adventure: Ray Tracing", "Coding Adventure: Simulating Fluids"

### Interactive Tools

**Shadertoy**
- https://www.shadertoy.com/
- **Content**: Community-created shaders, live code editor
- **Use for**: Lesson 24 (exploration), inspiration for procedural textures
- **Featured shaders**: "Raymarching Primitives" by Inigo Quilez, "Cornell Box" examples

**WebGL Fundamentals**
- https://webglfundamentals.org/
- **Content**: Interactive WebGL tutorials in the browser
- **Use for**: Students who want browser-based experimentation (no setup)

**GeoGebra 3D**
- https://www.geogebra.org/3d
- **Content**: Interactive 3D geometry tool
- **Use for**: Visualizing ray-plane intersections, surface normals, coordinate systems (lessons 3-4, 9-10)

**Desmos 3D Calculator**
- https://www.desmos.com/3d
- **Content**: 3D graphing calculator
- **Use for**: Plotting ray equations, sphere intersections

### Code Repositories

**pbrt-v3** (Physically Based Rendering source code)
- https://github.com/mmp/pbrt-v3
- **Language**: C++
- **Use for**: Reference implementation of BVH, materials, Monte Carlo sampling
- **Relevant files**: `core/primitive.cpp` (intersection), `accelerators/bvh.cpp`, `integrators/path.cpp`

**Ray Tracing in One Weekend — Source Code**
- https://github.com/RayTracing/raytracing.github.io
- **Language**: C++
- **Use for**: Complete working example to reference while building
- **Relevant branches**: Book 1 (basic), Book 2 (advanced features), Book 3 (path tracing)

**tinyraytracer** (Dmitry V. Sokolov)
- https://github.com/ssloy/tinyraytracer
- **Language**: C++
- **Use for**: Minimal ray tracer in ~300 lines, good for understanding structure
- **Relevant files**: `tinyraytracer.cpp` (entire implementation in one file)

**smallpt** (Kevin Beason)
- http://www.kevinbeason.com/smallpt/
- **Language**: C++ (99 lines)
- **Use for**: Extremely compact path tracer, shows minimal viable implementation
- **Note**: Dense code, use for reference not learning

### Articles & Blogs

**Inigo Quilez's Articles**
- https://iquilezles.org/articles/
- **Content**: Math and rendering techniques (distance functions, procedural textures, noise)
- **Use for**: Lessons 21, 24 (textures, shader exploration)
- **Best articles**: "Raymarching SDFs", "Useful Little Functions"

**Morgan McGuire's Blog**
- https://casual-effects.com/
- **Content**: Graphics research, tools, teaching resources
- **Use for**: Advanced topics, industry perspective

**Peter Shirley's Blog**
- https://psgraphics.blogspot.com/
- **Content**: Insights from the author of Ray Tracing in One Weekend
- **Use for**: Deeper dives into Monte Carlo, sampling, rendering theory

**Matt Pharr's Blog**
- https://pharr.org/matt/blog/
- **Content**: Updates on pbrt, rendering techniques
- **Use for**: Industry context, SIGGRAPH course notes

### Papers (Historical and Foundational)

**"An Improved Illumination Model for Shaded Display"** (Turner Whitted, 1980)
- **Link**: https://dl.acm.org/doi/10.1145/358876.358882
- **Why**: First recursive ray tracer; show original images in lesson 1

**"The Rendering Equation"** (James Kajiya, 1986)
- **Link**: https://dl.acm.org/doi/10.1145/15922.15902
- **Why**: Theoretical foundation for all light transport; introduce in lesson 23

**"Bidirectional Path Tracing"** (Lafortune & Willems, 1993)
- **Link**: http://graphics.stanford.edu/courses/cs348b-03/papers/lafortune-thesis.pdf
- **Why**: Advanced technique preview for lesson 26

## People to Follow

**Researchers & Practitioners**

- **Matt Pharr** (NVIDIA, pbrt author) — Twitter: @pharr, blog: https://pharr.org/matt/
- **Peter Shirley** (NVIDIA, Ray Tracing in One Weekend) — Blog: https://psgraphics.blogspot.com/
- **Morgan McGuire** (Roblox) — Twitter: @CasualEffects, site: https://casual-effects.com/
- **Inigo Quilez** (Shadertoy co-creator) — Twitter: @iquilezles, site: https://iquilezles.org/
- **Wojciech Jarosz** (Dartmouth, Monte Carlo expert) — Site: https://cs.dartmouth.edu/~wjarosz/
- **Tomas Akenine-Möller** (NVIDIA, Real-Time Rendering author) — Publications: http://www.realtimerendering.com/
- **Eric Haines** (NVIDIA, RTR author, ray tracing news) — Blog: http://www.realtimerendering.com/blog/

**Industry Studios**

- **Pixar RenderMan** — https://renderman.pixar.com/ (film rendering)
- **NVIDIA Omniverse** — https://www.nvidia.com/en-us/omniverse/ (real-time path tracing)
- **Chaos V-Ray** — https://www.chaosgroup.com/ (architectural visualization)

## Unexpected Connections (Cross-Discipline)

### Physics
- **Optics and light transport** — Ray tracing is the same math used in lens design
- **Gravitational lensing** — Astrophysics uses ray tracing to visualize black holes and curved spacetime
- **Quantum Monte Carlo** — Similar sampling techniques for quantum systems

### Mathematics
- **Computational geometry** — Ray-object intersection is geometric algorithm design
- **Numerical integration** — Monte Carlo methods appear in statistics, finance, physics
- **Linear algebra** — Transformations, eigenvectors (though we avoid heavy matrix math in this curriculum)

### Art & Film
- **Cornelia Parker's "Cold Dark Matter"** — Art installation exploring shadows and light
- **Pixar's rendering pipeline** — RenderMan, Moonray (open-source path tracer)
- **SIGGRAPH** — Conference bridging graphics research and film/games industry

### Computer Science
- **Data structures** — BVH is a spatial data structure (like KD-trees, octrees)
- **Algorithms** — Ray tracing involves recursion, divide-and-conquer, optimization
- **Parallel computing** — Ray tracing is "embarrassingly parallel" (each pixel independent)

### Gaming
- **Real-time ray tracing** — NVIDIA RTX, DirectX Raytracing (DXR), Vulkan Ray Tracing
- **Hybrid rendering** — Rasterization + selective ray tracing for reflections/shadows (Unreal Engine, Unity)

### Astronomy & Space
- **NASA's JPL** — Uses ray tracing to plan rover camera positioning on Mars
- **Visualization of exoplanets** — Simulating what distant worlds might look like

## Tools for Building

### Development Environments

**C++ (recommended for performance)**
- **Compiler**: GCC, Clang, or MSVC
- **Libraries**: GLM (math), stb_image (image I/O), Dear ImGui (optional UI)
- **Setup**: Follow Ray Tracing in One Weekend setup guide

**Python (recommended for learning)**
- **Libraries**: NumPy (math), Pillow (image I/O), matplotlib (visualization)
- **Advantage**: Faster prototyping, easier debugging, interactive notebooks (Jupyter)

**JavaScript/WebGL (recommended for sharing)**
- **Frameworks**: Three.js (3D engine), GLSL (shader language)
- **Advantage**: Runs in browser, easy to share results
- **Platform**: CodePen, Shadertoy, Observable

### Image Libraries

**stb_image & stb_image_write** (C++)
- https://github.com/nothings/stb
- **Use**: Loading/saving PNG, JPG images

**Pillow** (Python)
- https://pillow.readthedocs.io/
- **Use**: Image manipulation, saving renders

### Math Libraries

**GLM** (OpenGL Mathematics, C++)
- https://glm.g-truc.net/
- **Use**: Vector/matrix operations matching GLSL syntax

**NumPy** (Python)
- https://numpy.org/
- **Use**: Fast array operations, vector math

### Debugging Tools

**RenderDoc**
- https://renderdoc.org/
- **Use**: Graphics debugging (captures GPU state)

**NVIDIA Nsight Graphics**
- https://developer.nvidia.com/nsight-graphics
- **Use**: Profiling, debugging real-time ray tracing

### Visualization

**matplotlib** (Python)
- https://matplotlib.org/
- **Use**: Plotting difficulty curves, convergence graphs

**Plotly** (JavaScript/Python)
- https://plotly.com/
- **Use**: Interactive 3D plots for concept visualization

## Learning Pathways After This Curriculum

### Path 1: Real-Time Ray Tracing
- **Next steps**: Learn DirectX Raytracing (DXR) or Vulkan Ray Tracing
- **Resources**: NVIDIA DXR tutorials, Vulkan Ray Tracing tutorial
- **Project**: Build a real-time hybrid renderer (rasterization + ray-traced reflections)

### Path 2: Advanced Offline Rendering
- **Next steps**: Implement path tracing, photon mapping, bidirectional path tracing
- **Resources**: PBRT book chapters 13-16, Stanford CS348B assignments
- **Project**: Build a production-quality path tracer competing with pbrt

### Path 3: Shader Programming
- **Next steps**: Learn GLSL, HLSL, or Shadertoy techniques
- **Resources**: The Book of Shaders (https://thebookofshaders.com/), IQ's articles
- **Project**: Create procedural art on Shadertoy, demoscene contributions

### Path 4: Graphics Research
- **Next steps**: Read SIGGRAPH papers, implement recent techniques
- **Resources**: SIGGRAPH conference proceedings, replicability stamp papers
- **Project**: Replicate a recent SIGGRAPH paper (neural rendering, light transport)

### Path 5: Game Engine Development
- **Next steps**: Study Unreal Engine or Unity rendering pipelines
- **Resources**: GPU Gems series, Real-Time Rendering book
- **Project**: Build a custom game engine with modern rendering features
