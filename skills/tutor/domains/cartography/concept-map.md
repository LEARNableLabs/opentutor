# Cartography — Concept Map

## Core Concepts (in learning order)

1. **Map as Representation** — Maps are selective abstractions of reality, not objective truth
2. **Coordinate Systems** — Mathematical frameworks for locating positions on Earth's surface
3. **Datums and Ellipsoids** — Reference surfaces that approximate Earth's shape
4. **Scale** — The ratio between distances on a map and reality
5. **Cartographic Generalization** — Simplification and selection of features based on scale and purpose
6. **The Projection Problem** — The impossibility of flattening a sphere without distortion. Depends on: Coordinate Systems
7. **Developable Surfaces** — Cylinders, cones, and planes used to create projections. Depends on: The Projection Problem
8. **Distortion Properties** — Every projection distorts area, shape, distance, or direction differently. Depends on: The Projection Problem
9. **Tissot's Indicatrix** — Visual method for showing distortion patterns. Depends on: Distortion Properties
10. **Projection Selection** — Choosing projections based on purpose, extent, and acceptable distortion. Depends on: Distortion Properties, Tissot's Indicatrix
11. **Visual Hierarchy** — Organizing map elements so readers know what to look at first
12. **Figure-Ground Relationship** — Ensuring features pop out from the background
13. **Cartographic Typography** — Using typefaces and placement to communicate information. Depends on: Visual Hierarchy
14. **Color Theory in Maps** — Using color to encode information while maintaining readability. Depends on: Visual Hierarchy
15. **Symbolization** — Visual marks that represent geographic features. Depends on: Visual Hierarchy
16. **Thematic Mapping** — Maps designed to show patterns in data, not just locations
17. **Data Types in Cartography** — Nominal, ordinal, interval, ratio data require different visual approaches. Depends on: Thematic Mapping
18. **Visual Variables** — Bertin's semiology: position, size, shape, value, color, orientation, texture. Depends on: Symbolization, Thematic Mapping
19. **Choropleth Maps** — Shading areas by data values. Depends on: Thematic Mapping, Color Theory in Maps
20. **Classification Schemes** — How to group continuous data into categories. Depends on: Choropleth Maps
21. **Proportional Symbols** — Sizing symbols by data magnitude. Depends on: Thematic Mapping, Visual Variables
22. **Perceptual Scaling** — Adjusting symbol sizes for how humans perceive area. Depends on: Proportional Symbols
23. **Multivariate Mapping** — Showing multiple data dimensions on one map. Depends on: Visual Variables, Thematic Mapping
24. **Map Power and Politics** — How maps reflect and shape worldviews. Depends on: Map as Representation
25. **Persuasive Cartography** — Using design choices to influence interpretation. Depends on: All design concepts
26. **Web Mapping** — Interactive, dynamic maps enabled by digital platforms. Depends on: Projection Selection, Thematic Mapping

## Dependencies

### Foundational Dependencies
- **Projection Selection** requires understanding **Distortion Properties** and **Tissot's Indicatrix** because you can't choose an appropriate projection without knowing what each one distorts
- **Cartographic Generalization** requires understanding **Scale** because what you include depends on how zoomed in you are
- **The Projection Problem** requires understanding **Coordinate Systems** because projections transform 3D coordinates to 2D planes

### Design Dependencies
- **Cartographic Typography**, **Color Theory**, and **Symbolization** all require understanding **Visual Hierarchy** because they're tools for building hierarchy
- **Figure-Ground Relationship** is foundational to all other design principles because readers can't parse a map if they can't distinguish foreground from background

### Thematic Mapping Dependencies
- **Classification Schemes** requires understanding **Choropleth Maps** because classification is specifically about how to bin data for choropleth visualization
- **Perceptual Scaling** requires understanding **Proportional Symbols** because it's a correction to naive proportional symbol sizing
- **Multivariate Mapping** requires understanding **Visual Variables** because you need to know which visual channels can be combined without interference

### Critical Dependencies
- **Persuasive Cartography** requires understanding all design concepts (hierarchy, color, symbolization, projection selection) because manipulation works by exploiting these tools
- **Map Power and Politics** builds on **Map as Representation** because recognizing political dimensions requires first understanding that all maps are selective

## Bottleneck Concepts

These concepts are difficult to grasp but unlock large parts of the curriculum:

1. **The Projection Problem** — Until students viscerally understand that you *cannot* flatten a sphere without distortion, projection choices seem arbitrary. This is the gateway to half the curriculum.

2. **Visual Hierarchy** — This is the foundation of all design. Students who don't grasp hierarchy will struggle with every subsequent design lesson.

3. **Data Types and Visual Variables** — Mapping data to visual channels systematically (not just "make it look good") is a conceptual leap. This unlocks effective thematic mapping.

4. **Map as Representation (Deeper Understanding)** — The shift from "maps show reality" to "maps construct reality" often happens late. Once it clicks, critical cartography makes sense.

## Mind-Blowing Moments

Points where students' worldview shifts:

1. **Greenland is Tiny** — Seeing Tissot indicatrices and realizing Greenland is actually 1/14th the size it appears on Web Mercator
2. **There is No "Right" Projection** — The moment of accepting that *every* projection sacrifices something
3. **Choropleth Maps Can Lie** — Discovering the MAUP and realizing election maps are shaped by boundary choices
4. **Maps Have Always Been Political** — Recognizing that even "neutral" maps make power-laden choices

## Common Misconceptions

1. **"Projections are just different ways to draw the same thing"** — Ignores that each projection emphasizes different properties
2. **"The Mercator projection is wrong/bad"** — It's not wrong, it's conformal; it's just misused
3. **"Bigger symbols mean more important"** — Confuses perceptual salience with data magnitude
4. **"Color is just decorative"** — Color carries information and must be chosen systematically
5. **"GIS makes you a cartographer"** — Knowing tools doesn't mean understanding design principles
6. **"Maps are objective"** — Every map embodies choices about what to show, how to show it, and from whose perspective
7. **"You can show everything if you zoom in enough"** — Generalization is always necessary; at some point data becomes noise

## Prerequisite Topics

- **Basic Geography** — Understanding continents, countries, latitude/longitude (needed for: all map reading)
- **Coordinate Geometry** — Cartesian coordinates, basic trigonometry (needed for: coordinate systems, projections)
- **Visual Design Basics** — Concepts of contrast, alignment, repetition, proximity (needed for: cartographic design)
- **Data Literacy** — Understanding variables, distributions, categories vs. quantities (needed for: thematic mapping)
- **Basic Statistics** — Mean, median, quartiles, distributions (needed for: classification schemes)

## Exit Capabilities

After completing this curriculum, students can:

1. **Analyze** any map for projection choice, design quality, and potential bias
2. **Select** appropriate projections for different mapping purposes
3. **Design** clear, effective thematic maps using visual hierarchy and appropriate symbolization
4. **Critique** maps from both aesthetic and ethical perspectives
5. **Understand** the technical foundations (coordinate systems, datums, scale) underlying modern mapping
6. **Recognize** how maps shape perception and are used persuasively
7. **Use** modern digital tools (GIS, web mapping) with cartographic sophistication
