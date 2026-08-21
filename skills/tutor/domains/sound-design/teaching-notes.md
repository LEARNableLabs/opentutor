# Sound Design for Film and Games — Teaching Notes

## Approach

Sound design is **experiential and iterative** — students learn by doing, failing, and discovering why their first attempt didn't work. At the intermediate level, assume students have basic DAW skills and can record clean audio, but need to develop critical listening, creative problem-solving, and systematic workflow. Emphasize **listening analytically** (identifying why a sound works), **designing with intent** (every sound serves the story), and **working within constraints** (technical limits spark creativity). This topic bridges art and technology — lean into both. Use real-world examples from films and games students know, and encourage experimentation over perfection.

## Common Misconceptions

1. **"More is better" (layering)**
   - **Why students believe this:** They hear complex sounds in pro work and assume it's 10+ layers
   - **Reality:** Professional sound design is often 2-3 carefully chosen layers. More layers = phase issues, mud, and loss of impact
   - **How to correct:** Have them layer 10 sounds, then remove layers one at a time until it sounds best. They'll discover the sweet spot is usually 3-4

2. **"Recording is just technical, design is creative"**
   - **Why students believe this:** Recording feels like following rules (mic placement, gain staging)
   - **Reality:** 80% of great sound design happens at the recording stage. Creative mic choice and placement create the character
   - **How to correct:** Show before/after of the same source with different mics/positions. Let them hear how recording IS design

3. **"Game audio is easier than film because it loops"**
   - **Why students believe this:** They think looping means less content to create
   - **Reality:** Game audio is harder — you need systems that stay interesting for hours, handle edge cases, and adapt in real-time
   - **How to correct:** Have them implement a simple footstep system. They'll discover the complexity quickly

4. **"You need the sound of the real thing to make it sound real"**
   - **Why students believe this:** Literal thinking (car sound = recording a car)
   - **Reality:** Most iconic sounds are synthesized or Frankensteined from unrelated sources. Realism is about perception, not authenticity
   - **How to correct:** Reveal that lightsabers are projector motors + TV interference, dinosaurs are tortoise sex and walrus grunts. Show how lies sound more true

5. **"Compression is for making things loud"**
   - **Why students believe this:** They see compressors on every channel in tutorials
   - **Reality:** Compression shapes dynamics, creates space, and glues elements. Loudness is a side effect
   - **How to correct:** Use sidechain compression to duck music under dialogue. Show how it creates clarity without touching faders

6. **"Mixing is the last step where you balance levels"**
   - **Why students believe this:** Linear thinking from simplified tutorials
   - **Reality:** Mixing starts at recording and continues through every edit decision. Levels are 20% of mixing
   - **How to correct:** Show a rough edit with bad recordings — no amount of mixing saves it. Then show a well-recorded/designed session that mixes itself

7. **"Procedural/synthesis can't sound as good as recordings"**
   - **Why students believe this:** Bad synth presets and lack of experience
   - **Reality:** Synthesis gives you control recordings can't match. Andy Farnell's entire "Designing Sound" book proves this
   - **How to correct:** Demonstrate a synthesized rainstorm with per-drop variation vs. a looped recording. The synth version wins

8. **"Ambience is just room tone you throw in the background"**
   - **Why students believe this:** They focus on foreground elements
   - **Reality:** Ambience is world-building — it establishes location, time, mood, and off-screen space
   - **How to correct:** Play a scene with no ambience, then add layers. Show how ambience creates 3D space and narrative context

9. **"FMOD/Wwise are just complicated audio players"**
   - **Why students believe this:** They see middleware as a delivery mechanism
   - **Reality:** Middleware is a design tool — it enables adaptive behaviors impossible in a DAW
   - **How to correct:** Show adaptive music responding to gameplay intensity. Demonstrate real-time parameter control. Middleware is an instrument

10. **"Professional sound designers have secret techniques"**
    - **Why students believe this:** Mystique of pro work
    - **Reality:** Pros use the same tools and basic techniques. The difference is taste, iteration, and thousands of hours of critical listening
    - **How to correct:** Break down iconic sounds step-by-step. Show the process is simple but the decisions are refined

11. **"Dialogue always goes in the center channel"**
    - **Why students believe this:** Simplified surround mixing tutorials
    - **Reality:** Dialogue follows the character on screen. Off-screen dialogue, phone calls, and stylized moments use the full soundfield
    - **How to correct:** Watch a scene from a Fincher film with isolated dialogue. Show how spatial dialogue enhances storytelling

## Level Adjustments

### For Intermediate Students (this curriculum)

- **Assume:** DAW proficiency, basic recording skills, fundamental audio theory (EQ, compression)
- **Emphasize:** Critical listening development, creative problem-solving, systematic workflow, understanding WHY not just HOW
- **Depth:** Go deeper than "here's how to use this tool" — explain psychoacoustic reasons, show trade-offs, discuss aesthetic choices
- **Projects:** Real-world scenarios (design sound for a short film scene, implement footsteps in Unity, mix a 30-second trailer)
- **Vocabulary:** Use industry terms (ADR, Foley, stems, RMS, LUFS) and expect students to adopt them
- **Complexity:** Introduce middleware, surround mixing, advanced synthesis — they can handle technical depth

### If Adjusting to Beginner

- Start with 10 lessons on DAW basics and recording fundamentals before this curriculum
- Simplify middleware to "Unity audio basics" — skip FMOD/Wwise complexity
- Skip surround/Atmos — focus only on stereo
- Replace synthesis lessons with "finding good source material"
- More step-by-step tutorials, less "figure it out" problem-solving
- Remove jargon or define everything inline

### If Adjusting to Advanced

- Assume middleware proficiency, surround mixing experience, synthesis skills
- Add lessons on: procedural audio programming (Pure Data/Max), advanced spatialization (Ambisonics, binaural rendering), film mixing for Dolby Atmos, building custom DSP
- Projects: Build a full game audio implementation, design and mix a short film from scratch, create a procedural weather system
- Discuss aesthetic philosophy, reference classic sound design (Burtt, Rydstrom, Schafer), analyze award-winning work
- Depth: Technical depth (DSP math, psychoacoustic studies, acoustics modeling)

## Rabbit Holes (Fascinating Connections)

- **Musique concrète and Pierre Schaeffer** — Drop when discussing creative sound design. Show how experimental music pioneered sound design techniques decades before Star Wars
  - When: Lesson 9 (creative recording) or Lesson 13 (synthesis)

- **Walter Murch's "Dense Clarity" concept** — The idea that complexity creates clarity when every element has a distinct space
  - When: Lesson 10 (layering) or Lesson 22 (mixing for clarity)

- **Ben Burtt's Star Wars documentation** — Behind-the-scenes of iconic sound creation (lightsabers, Vader breath, blasters)
  - When: Lesson 9 (creative recording) or as motivation in Lesson 1

- **"Shepard tone" auditory illusion** — Infinitely rising pitch used in Dunkirk, The Dark Knight
  - When: Lesson 1 (psychoacoustics) or Lesson 16 (adaptive music)

- **Video game case studies:** The Last of Us (dynamic music system), Dead Space (no music, all designed sound), Hellblade (binaural audio)
  - When: Lesson 16-19 (game audio implementation)

- **The "Wilhelm Scream"** — Most famous sound effect in film history, used as an inside joke
  - When: Lesson 6 (Foley) or Lesson 25 (spotting) as a fun break

- **Acoustic ecology and R. Murray Schafer** — Treating the world as a musical composition, "soundscape" concept
  - When: Lesson 11 (worldbuilding) — connects sound design to environmental awareness

- **The "uncanny valley" of sound** — When sounds are almost-but-not-quite right, they're worse than obviously fake
  - When: Lesson 12 (natural vs processed) or Lesson 4 (perceived size)

- **Parametric synthesis vs. sampling debate** — Connects to broader creative tool philosophy
  - When: Lesson 13 (synthesis for SFX)

- **The "cocktail party effect"** — Psychoacoustic ability to focus on one sound in a noisy environment
  - When: Lesson 2 (masking) or Lesson 22 (dialogue clarity)

## Difficulty Progression

- **Lessons 1-4:** Difficulty 2-3 — Establishing perceptual foundations. Accessible but conceptually rich
- **Lessons 5-6:** Difficulty 2-3 — Hands-on recording skills. Practical and engaging
- **Lesson 7:** Difficulty 1 — REVIEW to consolidate fundamentals
- **Lessons 8-9:** Difficulty 3-4 — Pushing into creative territory. Challenge increases
- **Lessons 10-13:** Difficulty 3-4 — Peak cognitive load in sound design concepts. Most challenging module
- **Lesson 14:** Difficulty 2 — REVIEW to process design module
- **Lessons 15-19:** Difficulty 2-4 — New domain (game audio), starting accessible then building. Lesson 16 and 18 are peaks (adaptive music, material systems)
- **Lesson 20:** Difficulty 2 — REVIEW interactive concepts before moving to mixing
- **Lessons 21-24:** Difficulty 3-4 — Mixing is technical and aesthetic. Lesson 23 (Atmos) is a peak
- **Lessons 25-26:** Difficulty 2 — Professional practice and final review. Wind down

**Overall arc:** Gentle start → build to first peak (creative design) → review → second peak (game audio) → review → final peak (mixing) → wind down

## Workflow Tips

- **Encourage project-based learning:** Don't just watch tutorials — redesign sound for a YouTube clip, implement audio in a small game prototype
- **Build a personal sound library:** Every lesson is an excuse to record something new and organize it properly
- **Reference heavily:** Watch Sound Works Collection videos, listen to GDC Audio talks, study game audio breakdowns
- **Iterate in public:** Share work for feedback early and often. Sound design improves through critique
- **Use free/affordable tools:** Reaper ($60), FMOD/Wwise (free for learning), Freesound.org, BBC Sound Effects. No excuses
- **Set constraints:** "Design a sci-fi door with only sounds from your kitchen" forces creativity
- **Analyze professionally:** Pick a favorite game or film and try to recreate one sound from scratch. Reverse-engineering teaches more than tutorials

## Collaboration and Communication

Sound designers work in teams — directors, composers, re-recording mixers, game designers, programmers. Emphasize:

- **Articulating creative intent:** "I want this to feel ominous" → specific sonic characteristics
- **Understanding technical constraints:** "Can we have 500 sounds playing at once?" → learning to say no diplomatically
- **Iterating on feedback:** Directors say "make it more whooshy" — decode vague notes into actionable changes
- **File organization and naming:** Professional work requires discipline. Teach metadata, session templates, stem organization

## Assessment Ideas

If the student wants evaluation/feedback points:

1. **Sound design challenge:** Given a 30-second video clip, create full sound design from scratch. Evaluate: creativity, clarity, storytelling, technical quality
2. **Middleware implementation:** Build an adaptive footstep system in FMOD or Wwise that handles 5 surface types. Evaluate: variation, realism, system design
3. **Mix comparison:** Mix a provided session for both film (stereo) and game (interactive). Evaluate: clarity, balance, format-appropriate choices
4. **Listening test:** Identify techniques used in 5 professional sound design examples. Evaluate: critical listening development
5. **Concept explanation:** Explain frequency masking to a beginner. Evaluate: depth of understanding, teaching clarity

## Resources for Going Deeper

- **Books:** "Designing Sound" (Farnell), "The Sound Effects Bible" (Viers), "The Foley Grail" (Ament)
- **Courses:** Berklee Online game audio, Coursera music production
- **Communities:** r/sounddesign, Vi-Control, GANG forums
- **Tools to explore:** Pure Data (procedural audio), Reaktor (synthesis), iZotope RX (dialogue), Soundly (SFX management)
- **Reference material:** Sound Works Collection (YouTube), A Sound Effect tutorials, Designing Sound blog
