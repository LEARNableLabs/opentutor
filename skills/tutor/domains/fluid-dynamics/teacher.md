# Fluid Dynamics — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 11 lessons (39%)
- **Socratic questions** — 5 lessons (18%)
- **review and consolidation sessions** — 4 lessons (14%)
- **real-world application challenges** — 4 lessons (14%)
- **teach-back exercises (student explains)** — 2 lessons (7%)
- **curated resource exploration** — 2 lessons (7%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 43% accessible (1-2), 36% standard (3), 21% challenging (4-5).

Difficulty peaks:
- Day 7: "What are the Navier-Stokes equations really saying?" (difficulty 4)
- Day 10: "How do we derive momentum conservation for a fluid element?" (difficulty 4)
- Day 14: "How do we build complex flows from simple building blocks?" (difficulty 4)
- Day 19: "How do we simplify Navier-Stokes for thin boundary layers?" (difficulty 4)
- Day 26: "Why is turbulence still an unsolved problem?" (difficulty 4)

## Domain Hooks
- **Kelvin's circulation theorem** — circulation is conserved following a fluid loop (inviscid, barotropic). Leads to starting vortices, wingtip vortices, and the Kutta condition for lift. Drop in during lesson 9 (vorticity).

- **Kármán vortex street** — alternating vortices shed from cylinders in flow. Beautiful, ubiquitous (flags flapping, bridges collapsing), and connects to instability. Show video during lesson 15 or 20.

- **Coanda effect** — jets attach to nearby curved surfaces due to entrainment and pressure gradients. Explains some lift mechanisms, wall-hugging flows. Bring up during boundary layer or real-world lessons.

- **Why airplanes fly** — surprisingly contentious! Standard "longer path" explanation is wrong. Correct explanation involves circulation, Kutta condition, and starting vortex (or momentum deflection for simpler version). Great for lesson 20 or as a capstone discussion.

- **Reynolds' original 1883 experiment** — visualizing laminar-to-turbulent transition w

## Common Failure Modes
1. **"Pressure is force"** — Students often confuse pressure (force per unit area, a field variable) with the net force on an object. Pressure acts normal to surfaces; net force requires integration over the entire surface. Use Bernoulli's equation to show pressure changes along streamlines.

2. **"High velocity means low pressure everywhere"** — Bernoulli's equation is misapplied. It only relates pressure and velocity *along the same streamline* in steady, inviscid, incompressible flow. It doesn't compare different streamlines, and it fails when viscosity or unsteadiness matters. Airfoil lift requires careful application.

3. **"Streamlines and pathlines are the same thing"** — True only in steady flow. In unsteady flow, streamlines (instantaneous flow direction) change with time, while pathlines (particle trajectories) trace historical paths. Show an example like oscillating flow to distinguish them.

4. **"Turbulence is just randomness"** — Turbulence is deterministic chaos, not whi

## Vocabulary
Key terms for this domain: continuum hypothesis, fluid properties, length scales, Lagrangian description, Eulerian description, material derivative, streamlines, pathlines, streaklines, steady flow, convective acceleration, local acceleration, conservation of mass, continuity equation, incompressibility (and 74 more).