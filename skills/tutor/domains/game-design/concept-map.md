# Game Design — Concept Map

## Core Concepts (in learning order)

1. **MDA Framework** — the three-layer lens for analyzing games: Mechanics → Dynamics → Aesthetics
2. **Designer vs Player Perspective** — designers experience games as M→D→A, players as A→D→M
3. **Mechanics** — the base components: rules, actions, resources, constraints, algorithms
4. **Dynamics** — runtime behavior that emerges from mechanics interacting with player input
5. **Aesthetics** — emotional responses evoked in players (the "fun")
6. **Aesthetics-First Design** — starting with desired player emotion and working backward to mechanics. Depends on: MDA Framework, Designer vs Player Perspective
7. **Action Space** — the set of all possible actions a player can take. Depends on: Mechanics
8. **Meaningful Choices** — decisions with distinct, non-obvious consequences. Depends on: Action Space, Dynamics
9. **Dominant Strategies** — actions that are always optimal, reducing choice. Depends on: Action Space, Meaningful Choices
10. **Resource Economy** — how resources flow, convert, and create scarcity. Depends on: Mechanics
11. **Input vs Output Randomness** — randomness before vs after player decision. Depends on: Mechanics, Meaningful Choices
12. **Emergence** — complex system behavior arising from simple rules. Depends on: Mechanics, Dynamics
13. **Player Agency** — the degree to which player actions meaningfully affect outcomes. Depends on: Dynamics, Meaningful Choices
14. **Feedback Loops** — systems that amplify (positive) or dampen (negative) player advantage. Depends on: Dynamics, Emergence
15. **Runaway Dynamics** — unintended positive feedback loops that break balance. Depends on: Feedback Loops
16. **Risk vs Reward** — trade-offs that create tension in decision-making. Depends on: Meaningful Choices, Resource Economy
17. **Difficulty Curves** — the pacing of challenge escalation. Depends on: Dynamics
18. **The 8 Types of Fun** — sensation, fantasy, narrative, challenge, fellowship, discovery, expression, submission. Depends on: Aesthetics
19. **Sensation** — game as sense-pleasure (graphics, sound, feel). Depends on: Aesthetics
20. **Fantasy** — game as make-believe. Depends on: Aesthetics
21. **Narrative** — game as drama/story. Depends on: Aesthetics
22. **Challenge** — game as obstacle course. Depends on: Aesthetics
23. **Fellowship** — game as social framework. Depends on: Aesthetics
24. **Discovery** — game as uncharted territory. Depends on: Aesthetics
25. **Expression** — game as self-expression. Depends on: Aesthetics
26. **Submission** — game as pastime/flow state. Depends on: Aesthetics
27. **Juice** — exaggerated feedback that makes actions feel satisfying. Depends on: Sensation, Dynamics
28. **Sandbox Design** — mechanics that enable player creativity. Depends on: Expression, Player Agency
29. **Emotional Design** — crafting specific emotional arcs. Depends on: The 8 Types of Fun, Aesthetics-First Design
30. **Social Dynamics** — how multiplayer interaction shapes experience. Depends on: Fellowship, Dynamics
31. **MDA Analysis** — reverse-engineering existing games through the MDA lens. Depends on: all MDA concepts
32. **Ludonarrative Dissonance** — when mechanics contradict aesthetic goals. Depends on: Mechanics, Aesthetics, MDA Analysis
33. **Design Coherence** — alignment between mechanics, dynamics, and aesthetics. Depends on: MDA Framework, MDA Analysis
34. **Playtesting** — observing real players to identify dynamic issues. Depends on: Dynamics, Player Agency
35. **Iteration** — refining design based on playtest feedback. Depends on: Playtesting, MDA Analysis

## Key Dependencies

### Foundational Dependencies
- **MDA Framework** is the root concept — everything else depends on understanding this tripartite structure
- **Designer vs Player Perspective** must be understood early — it explains why analysis differs from creation
- **Mechanics, Dynamics, Aesthetics** as separate concepts must be clear before exploring their interactions

### Critical Bottlenecks
- **Emergence** is a bottleneck — students must grasp how simple mechanics create complex dynamics before they can:
  - Understand feedback loops
  - Predict player behavior
  - Design for specific dynamics
  
- **The 8 Types of Fun** is a bottleneck for aesthetics — students need this taxonomy before they can:
  - Analyze aesthetic goals
  - Design mechanics for specific emotions
  - Critique aesthetic coherence

- **Meaningful Choices** is a bottleneck for mechanics — students must understand what makes choices matter before they can:
  - Design resource economies
  - Balance randomness
  - Create tension

### Integration Dependencies
- **MDA Analysis** requires mastery of all three layers — can't effectively reverse-engineer without understanding mechanics, dynamics, and aesthetics independently
- **Design Coherence** requires understanding how all three layers interact — the capstone concept
- **Ludonarrative Dissonance** requires both mechanics knowledge and aesthetic sensitivity

## Mind-Blowing Moments

1. **The Designer-Player Flip** (Lesson 1) — realizing that designers and players experience the same game in opposite directions (M→D→A vs A→D→M) reframes everything
2. **Emergence from Simplicity** (Lesson 11) — seeing how games like Go or Conway's Game of Life create infinite complexity from tiny rulesets
3. **Ludonarrative Dissonance** (Lesson 26) — recognizing when games undermine themselves (e.g., violent mechanics in a "save the world" narrative)
4. **The Fellowship Paradox** (Lesson 23) — understanding that multiplayer "magic" often comes from mechanics that would bore solo players

## Common Misconceptions

1. **"Aesthetics = graphics"** — Students often confuse visual aesthetics with player experience aesthetics. The MDA framework uses "aesthetics" to mean emotional response, not art style.

2. **"Good mechanics = good game"** — Students focus on mechanics in isolation without considering the dynamics they produce or the aesthetics they serve.

3. **"Randomness = bad design"** — Students think randomness always reduces skill, missing the distinction between input and output randomness.

4. **"Difficulty = challenge aesthetic"** — Students conflate hard games with the challenge aesthetic, missing that challenge is about meaningful obstacles, not frustration.

5. **"Emergence happens automatically"** — Students expect complex dynamics to arise from any mechanics, not understanding that emergence requires careful design.

6. **"Players will play optimally"** — Students design assuming rational actors, not accounting for exploration, expression, or social play.

7. **"Balance = symmetry"** — Students think balanced games must give all players identical options, missing asymmetric balance.

8. **"Feedback loops are bad"** — Students see all positive feedback as "snowballing" without recognizing intentional uses (e.g., Katamari Damacy).

9. **"More mechanics = deeper game"** — Students add complexity without considering if it creates meaningful dynamics.

10. **"Playtesting = finding bugs"** — Students use playtesting for QA instead of observing dynamics and aesthetic responses.

## Prerequisite Topics (External)

- **Basic programming or scripting** — needed for understanding algorithmic mechanics, prototyping
- **Systems thinking** — needed for analyzing dynamics, feedback loops, emergence
- **Diverse game experience** — needed for comparative analysis, recognizing patterns, building intuition
- **Critical analysis skills** — needed for MDA analysis, design critique

## Bottleneck Concepts (Where Students Get Stuck)

1. **Emergence** — students struggle to predict how mechanics combine to create dynamics
2. **Aesthetics-first design** — students are used to adding "fun" at the end, not designing backward from emotion
3. **Meaningful choices** — students confuse quantity of options with quality of decisions
4. **Feedback loops** — students conflate all loops with "snowballing" and miss intentional applications
5. **Ludonarrative dissonance** — students struggle to see when mechanics contradict narrative goals

## Rabbit Holes (Fascinating Tangents)

1. **Game Theory vs Game Design** — how formal game theory (Nash equilibria, zero-sum games) relates but differs from MDA framework (drop in around Lesson 9 on randomness or Lesson 15 on meaningful choices)

2. **Flow Theory (Csikszentmihalyi)** — the psychological basis for "submission" aesthetic and difficulty curves (drop in around Lesson 16 on difficulty or Lesson 19 on satisfaction)

3. **Bartle's Player Types** — achievers, explorers, socializers, killers — an orthogonal taxonomy to the 8 types of fun (drop in around Lesson 18 when introducing aesthetics)

4. **Procedural Rhetoric** — how games make arguments through mechanics (Ian Bogost) — relates to ludonarrative coherence (drop in around Lesson 26)

5. **Economic Systems in Games** — how EVE Online's economy mirrors real markets, WoW's inflation problems (drop in around Lesson 8 on resource economies)

6. **Speedrunning as Unintended Dynamics** — how speedrunners find emergent strategies designers never anticipated (drop in around Lesson 12 on player agency)

7. **The Skinner Box** — behavioral psychology and the ethics of variable reward schedules in games (drop in around Lesson 19 on Candy Crush and sensation/submission)

8. **Metagame Evolution** — how competitive games (Magic: The Gathering, fighting games) evolve over time (drop in around Lesson 12 or 25 on analysis)
