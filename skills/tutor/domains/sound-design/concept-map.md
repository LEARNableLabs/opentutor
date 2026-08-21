# Sound Design for Film and Games — Concept Map

## Core Concepts (in learning order)

1. **Psychoacoustics** — how humans perceive sound, context-dependent hearing
2. **Perception** — subjective experience of sound beyond physical properties
3. **Context-dependent hearing** — same sound interpreted differently based on visual/narrative context
4. **Masking** — how sounds hide each other in the frequency spectrum. Depends on: psychoacoustics
5. **Critical bands** — frequency ranges where masking occurs. Depends on: masking
6. **Mix clarity** — achieving separation in dense mixes. Depends on: masking, critical bands
7. **Spatial audio** — 3D sound positioning and movement. Depends on: psychoacoustics
8. **HRTF** — head-related transfer function for binaural spatialization. Depends on: spatial audio
9. **Binaural recording** — stereo technique that captures spatial cues. Depends on: HRTF, spatial audio
10. **Timbre** — tonal color of a sound. Depends on: perception
11. **Spectral content** — frequency composition determining timbre. Depends on: timbre
12. **Perceived size** — how spectral content creates impression of scale. Depends on: timbre, spectral content
13. **Proximity effect** — bass boost when close-miking. Depends on: psychoacoustics
14. **Polar patterns** — microphone directional sensitivity
15. **Mic placement** — strategic positioning for desired tone. Depends on: proximity effect, polar patterns
16. **Foley recording** — performance recording of sync sound effects
17. **Exaggeration** — making sounds larger than life. Depends on: Foley recording, perceived size
18. **Sync performance** — timing Foley to picture. Depends on: Foley recording
19. **Location sound** — recording audio on set/in the field
20. **Noise reduction** — cleaning unwanted sounds. Depends on: location sound, masking
21. **Microphone selection** — choosing right tool for the job. Depends on: polar patterns, location sound
22. **Creative recording** — experimental capture techniques
23. **Source material** — raw recordings before processing. Depends on: creative recording
24. **Sound design thinking** — conceptual approach to creating new sounds. Depends on: creative recording
25. **Layering** — combining multiple sounds for complexity. Depends on: source material
26. **Phase coherence** — ensuring layered sounds don't cancel. Depends on: layering
27. **Less is more** — restraint in layering for clarity. Depends on: layering, phase coherence, mix clarity
28. **Worldbuilding** — creating sonic environments that tell stories
29. **Ambience design** — background soundscapes. Depends on: worldbuilding, layering
30. **Narrative through sound** — storytelling without dialogue. Depends on: worldbuilding, ambience design
31. **Processing artifacts** — audible side effects of effects
32. **Transparency** — processing without obvious coloration. Depends on: processing artifacts
33. **Creative effects** — intentional processing for artistic effect. Depends on: processing artifacts
34. **Synthesis for SFX** — generating sounds from oscillators. Depends on: spectral content
35. **Procedural audio** — algorithmically generated sound. Depends on: synthesis for SFX
36. **Hybrid approaches** — combining recording and synthesis. Depends on: synthesis for SFX, layering
37. **Interactive audio** — sound that responds to user input
38. **Non-linear media** — content consumed in variable order. Depends on: interactive audio
39. **Technical constraints** — limitations of real-time systems. Depends on: interactive audio
40. **Adaptive music** — music that changes based on gameplay. Depends on: interactive audio
41. **Horizontal re-sequencing** — switching between music sections. Depends on: adaptive music
42. **Vertical layering** — adding/removing music layers. Depends on: adaptive music
43. **Voice management** — controlling simultaneous sound count. Depends on: technical constraints
44. **Priority systems** — deciding which sounds to play. Depends on: voice management
45. **Occlusion** — sounds muffled by obstacles. Depends on: spatial audio, interactive audio
46. **Event-driven design** — sounds triggered by game events. Depends on: interactive audio
47. **Parameter automation** — real-time sound property changes. Depends on: event-driven design
48. **Material systems** — surface-specific sound responses. Depends on: event-driven design
49. **Randomization** — variation in playback. Depends on: procedural audio
50. **Variation containers** — systems managing random selection. Depends on: randomization
51. **Procedural variation** — algorithmic sound variation. Depends on: randomization, procedural audio
52. **Mix translation** — consistency across playback systems
53. **Monitoring** — critical listening environment. Depends on: mix translation
54. **Delivery formats** — final output specifications. Depends on: mix translation
55. **Ducking** — automatic volume reduction. Depends on: mix clarity
56. **Sidechain compression** — compressor triggered by another signal. Depends on: ducking
57. **Frequency carving** — EQ to create space. Depends on: masking, mix clarity
58. **Surround mixing** — multi-channel spatial mixing. Depends on: spatial audio
59. **Object-based audio** — sounds as positioned objects (Atmos). Depends on: surround mixing
60. **Immersive formats** — 3D audio delivery systems. Depends on: surround mixing, object-based audio
61. **Stem organization** — grouping mix elements. Depends on: delivery formats
62. **Deliverables** — final files provided to client. Depends on: stem organization, delivery formats
63. **Professional standards** — industry norms for quality. Depends on: deliverables
64. **Spotting** — planning sound design with collaborators
65. **Collaboration** — working with directors, editors, composers. Depends on: spotting
66. **Creative brief** — defining sound design approach. Depends on: spotting, sound design thinking

## Dependencies

### Recording Depends on Perception
Understanding psychoacoustics informs all recording decisions. You can't capture "size" without knowing what spectral content creates that perception.

### Layering Requires Phase Awareness
Multiple recordings combined without phase coherence create a thinner, weaker result than a single clean source.

### Game Audio Requires Film Audio Fundamentals
Interactive implementation builds on traditional sound design skills. You must master recording and editorial before tackling adaptive systems.

### Adaptive Music Requires Understanding Musical Structure
Horizontal re-sequencing only works if you understand song sections. Vertical layering requires orchestration knowledge.

### Mixing Requires Complete Sound Design Pipeline
You can't mix well without understanding how sounds were recorded, layered, and processed. The mix reveals all upstream decisions.

### Professional Practice Integrates All Skills
Spotting sessions require you to think about recording logistics, technical constraints, creative approaches, and delivery requirements simultaneously.

## Prerequisite Topics

- **Basic audio editing** — needed for: all recording and editorial concepts
- **DAW fundamentals** — needed for: layering, processing, mixing, stem organization
- **Basic music theory or audio production** — needed for: adaptive music, frequency concepts, mix balance

## Conceptual Bottlenecks

### Masking
Critical for both sound design (layering decisions) and mixing (frequency carving). Students who don't grasp this struggle with clarity.

### Interactive vs. Linear Thinking
Film sound designers often struggle with game audio because they think in fixed timelines. The mental model shift to event-driven, probabilistic sound is challenging.

### Phase Coherence
Invisible to beginners but responsible for most "why does my layered sound sound worse?" problems.

### Mix Translation
Students often mix only on their favorite monitors/headphones and are shocked when it falls apart elsewhere.

## Common Misconceptions

1. **"More layers = better sound"** — Phase issues and masking make this false. Depends on understanding: layering, phase coherence, less is more
2. **"Recording is just hitting record"** — Mic selection and placement are 80% of the result. Depends on understanding: microphone selection, proximity effect, polar patterns
3. **"Game audio is just film audio in a game engine"** — Interactive audio requires fundamentally different design approaches. Depends on understanding: interactive audio, non-linear media, event-driven design
4. **"Loudness = impact"** — Dynamics and context create impact more than volume. Depends on understanding: perception, context-dependent hearing
5. **"Synthesis can't sound realistic"** — Hybrid approaches and good synthesis technique rival recordings. Depends on understanding: synthesis for SFX, hybrid approaches
6. **"You need expensive gear to make professional sound"** — Technique and creativity matter far more than gear. Depends on understanding: sound design thinking, creative recording
7. **"Ambience is just background noise"** — Ambience is active worldbuilding and storytelling. Depends on understanding: worldbuilding, narrative through sound

## Learning Path Visualization

```
Perception & Acoustics
        ↓
Recording Techniques ← (microphone knowledge)
        ↓
Sound Editorial ← (layering, processing)
        ↓
     ╱      ╲
Film Mix    Game Implementation ← (middleware, interactive systems)
     ╲      ╱
  Professional Practice
```

## Cross-Domain Connections

- **Music production** — compression, EQ, and mixing techniques transfer directly
- **Game development** — understanding game engines and programming concepts helps with implementation
- **Film production** — knowledge of editorial and post workflows essential for collaboration
- **Acoustics** — room treatment and recording environment design
- **Psychology** — understanding narrative and emotional manipulation through sound
