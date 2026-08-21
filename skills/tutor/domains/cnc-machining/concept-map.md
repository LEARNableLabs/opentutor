# CNC Machining — Concept Map

## Core Concepts (in learning order)

1. **Coordinate systems** — How machines track position in 3D space using X, Y, Z axes
2. **Machine axes** — Linear and rotary motion axes available on the machine
3. **Work offsets** — Setting the machine's reference point relative to the workpiece. Depends on: coordinate systems
4. **G-code** — The programming language that tells CNC machines what to do. Depends on: coordinate systems, machine axes
5. **Modal commands** — G-code commands that stay active until changed
6. **Spindle speed (RPM)** — How fast the cutting tool rotates
7. **Feed rate** — How fast the tool moves through the material. Depends on: spindle speed
8. **Cutting speed** — The surface speed of the tool edge relative to workpiece. Depends on: spindle speed, tool diameter
9. **End mills** — Rotating cutting tools used for milling operations
10. **Tool geometry** — The shape and angles of the cutting edges. Depends on: end mills
11. **Flute count** — Number of cutting edges on a tool. Depends on: tool geometry
12. **Tool materials** — Carbide, HSS, cobalt, ceramic tool substrate materials
13. **Safety** — Machine operation safety procedures and collision avoidance
14. **Collision detection** — Systems to prevent crashes between tool, part, and fixtures
15. **CAM workflow** — The process of turning CAD models into machine toolpaths. Depends on: G-code
16. **Setup** — Defining stock, fixtures, and work coordinate system in CAM. Depends on: work offsets, CAM workflow
17. **Toolpaths** — The calculated motion path of the cutting tool. Depends on: CAM workflow
18. **Post-processing** — Converting generic toolpaths to machine-specific G-code. Depends on: toolpaths, G-code
19. **Facing operations** — Machining a flat surface perpendicular to the spindle axis
20. **Surface finish** — The quality and roughness of the machined surface. Depends on: feed rate, tool geometry
21. **Stepover** — The lateral distance between adjacent tool passes. Depends on: surface finish
22. **2D contour** — Toolpath following the outline of a profile. Depends on: toolpaths
23. **Pocket clearing** — Removing material from an enclosed area. Depends on: toolpaths
24. **Radial vs axial engagement** — How much of the tool is engaged sideways vs down. Depends on: tool geometry
25. **Adaptive clearing** — Toolpath strategy maintaining constant tool engagement. Depends on: radial vs axial engagement
26. **Constant engagement** — Keeping consistent cutting forces by varying tool path. Depends on: cutting forces
27. **Trochoidal milling** — Circular tool motion for deep slotting. Depends on: adaptive clearing
28. **Chip formation** — How material is removed by shearing during cutting
29. **Shear plane** — The zone where material deforms and separates. Depends on: chip formation
30. **Built-up edge** — Material adhering to the tool edge. Depends on: chip formation
31. **Cutting forces** — The mechanical forces acting on the tool during machining. Depends on: chip formation
32. **Material hardness** — Resistance to plastic deformation affecting machinability
33. **Ductility** — Material's ability to deform before fracturing
34. **Machinability** — How easily a material can be cut. Depends on: material hardness, ductility
35. **Tool wear mechanisms** — How cutting tools degrade over time. Depends on: cutting forces
36. **Abrasive wear** — Tool wear from hard particles in the workpiece
37. **Diffusion wear** — Chemical wear at high temperatures
38. **Thermal cracking** — Tool failure from thermal cycling
39. **Material-specific strategies** — Customizing feeds, speeds, and toolpaths for different materials. Depends on: machinability
40. **Chip evacuation** — Removing chips from the cutting zone. Depends on: chip formation, flute count
41. **Tool coatings** — Surface treatments to improve tool life. Depends on: tool wear mechanisms
42. **TiN, TiAlN, AlTiN** — Common tool coating materials. Depends on: tool coatings
43. **Coating selection** — Matching coating to material and operation. Depends on: tool coatings, material-specific strategies
44. **Climb milling** — Cutting direction where chip thickness starts thick. Depends on: cutting forces
45. **Conventional milling** — Cutting direction where chip thickness starts thin. Depends on: cutting forces
46. **Tool deflection** — Bending of the tool under cutting forces. Depends on: cutting forces
47. **3D toolpaths** — Toolpaths moving simultaneously in all three axes. Depends on: toolpaths
48. **Ball mills** — Spherical-end tools for 3D surfacing. Depends on: end mills
49. **Parallel finishing** — 3D strategy with linear passes. Depends on: 3D toolpaths
50. **Scallop height** — Cusps left between passes in 3D machining. Depends on: stepover, ball mills
51. **Multi-axis machining** — Using 4th and 5th axes for complex parts. Depends on: machine axes
52. **Rotary axes** — A and B axes that rotate the part or head. Depends on: machine axes
53. **Simultaneous vs indexed** — Continuous vs positioned multi-axis motion. Depends on: multi-axis machining
54. **High-speed machining** — Strategies using very high spindle speeds and light cuts. Depends on: cutting speed, thermal effects
55. **Thermal effects** — Heat generation and management in cutting. Depends on: cutting forces
56. **Cycle time** — Total time to machine a part. Depends on: feed rate, toolpaths
57. **Tool life** — How long a tool lasts before replacement. Depends on: tool wear mechanisms
58. **Dimensional accuracy** — How closely the part matches design dimensions
59. **Chatter** — Unstable vibration during cutting. Depends on: cutting forces, tool deflection
60. **Material removal rate** — Volume of material removed per time. Depends on: feed rate, depth of cut

## Dependencies

### Foundational dependencies
- **Work offsets require coordinate systems** — You must understand XYZ coordinates before setting work offsets
- **Feed rate depends on spindle speed** — Feeds are meaningless without knowing how fast the tool spins
- **Cutting speed combines spindle speed and tool diameter** — The tool's surface speed determines material interaction

### CAM workflow dependencies
- **Toolpaths require CAM workflow** — Can't generate paths without understanding the CAM process
- **Post-processing depends on toolpaths and G-code** — Must have paths to convert and understand target language
- **Setup requires work offsets** — CAM setup mirrors physical machine setup concepts

### Material science dependencies
- **Cutting forces depend on chip formation** — Understanding how chips form explains force generation
- **Machinability depends on hardness and ductility** — Material properties determine cutting difficulty
- **Tool wear mechanisms depend on cutting forces** — Forces and heat drive all wear modes
- **Material-specific strategies depend on machinability** — Tailor approach to material behavior

### Advanced toolpath dependencies
- **Adaptive clearing depends on radial/axial engagement** — Controlling engagement is the core principle
- **Trochoidal milling builds on adaptive clearing** — Specific implementation of constant engagement
- **3D toolpaths extend 2D concepts** — Same principles applied in three dimensions
- **Multi-axis depends on rotary axes** — Need additional axes before using them

### Optimization dependencies
- **Chatter depends on cutting forces and tool deflection** — Vibration emerges from force-deflection interaction
- **Material removal rate depends on feed and depth** — Optimization requires understanding parameters

## Critical Bottlenecks

These concepts are gateway concepts — students struggling here will struggle downstream:

1. **Coordinate systems** — Everything in CNC is position-based
2. **Feed rate and spindle speed relationship** — Core to all machining parameters
3. **Chip formation** — Foundation for understanding forces, wear, and optimization
4. **Radial vs axial engagement** — Key to modern toolpath strategies
5. **Cutting forces** — Drives tool selection, wear, chatter, everything

## Misconceptions by Concept

- **Coordinate systems** — Students confuse machine coordinates with work coordinates
- **G-code** — Belief that you need to hand-write G-code for modern machining
- **Feed rate** — Thinking faster is always better
- **Tool materials** — Assuming carbide is always the right choice
- **Chip formation** — Thinking chips are "scraped off" rather than sheared
- **Cutting forces** — Underestimating how much force is involved
- **Tool wear** — Thinking wear is purely mechanical friction
- **Adaptive clearing** — Assuming it's just about speed, not tool life
- **Climb vs conventional** — Using one exclusively without understanding trade-offs
- **High-speed machining** — Thinking it's just about going fast

## Learning Order Rationale

1. **Start with fundamentals** — Coordinates, G-code, speeds/feeds, tools
2. **CAM workflow before material science** — Get comfortable making toolpaths first
3. **Material science mid-curriculum** — Once students see toolpaths, they understand why material matters
4. **Advanced toolpaths after fundamentals** — Build on 2D before 3D and multi-axis
5. **Optimization at end** — Requires understanding everything else first

## Prerequisite Topics

- **Basic algebra and trigonometry** — needed for calculating speeds, feeds, and angles
- **3D coordinate systems** — needed for all spatial reasoning in CNC
- **CAD software basics** — needed for reading models and creating setups
- **Basic physics (forces, friction, heat)** — needed for understanding cutting mechanics
