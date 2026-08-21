# Climate Science — Modeling and Feedbacks: Teaching Notes

## Approach

Climate science sits at the intersection of physics, computation, and real-world urgency. At the intermediate level, the goal is to build physical intuition through simple models (often solvable analytically) before moving to computational implementations. Students should emerge able to construct toy models from first principles AND interpret complex GCM output critically. The topic is inherently visual (energy diagrams, circulation patterns, time series) and benefits from interleaving theory with hands-on coding. Unlike pure physics, climate science requires comfort with uncertainty — models have structural limitations, and students must learn to work with that rather than treating it as failure.

## Common Misconceptions

1. **"The greenhouse effect violates thermodynamics"** — Students sometimes think trapped heat means energy creation. Emphasize that the greenhouse effect slows radiative cooling, maintaining higher equilibrium temperature, not creating energy. The first law still holds.

2. **"Positive feedback means runaway warming"** — Many students conflate positive feedback with instability. Clarify that positive feedback amplifies but doesn't guarantee runaway; negative feedbacks (like blackbody radiation) ultimately stabilize the system. Venus had runaway; Earth has not (yet).

3. **"Climate models predict the future"** — Models project scenarios under assumptions, not predictions. Stress the difference between conditional projections ("if emissions follow pathway X...") and deterministic forecasting.

4. **"Uncertainty means we don't know anything"** — Model spread quantifies what we don't know precisely, but models agree on direction and magnitude within bounds. Teach uncertainty as information, not ignorance.

5. **"Simple models are useless because they're unrealistic"** — Students often dismiss 0D or 1D models as "too simple." Emphasize that simple models isolate mechanisms and build intuition; complexity obscures understanding. Every GCM started as a simple model.

6. **"Albedo is just ice"** — Students fixate on ice-albedo feedback but miss that clouds, vegetation, and aerosols also affect albedo. Present ice-albedo as the clearest example, not the only one.

7. **"The ocean just stores heat passively"** — Students underestimate ocean's active role. The ocean drives circulation, sequesters carbon, and has multi-decadal memory. It's not a heat sponge; it's a dynamical system.

8. **"Parameterization is fudging"** — Students may see parameterization as unscientific cheating. Explain that it's principled approximation based on physical understanding, constrained by observations. All models make trade-offs between resolution and computational cost.

## Level Adjustments

**Intermediate level** (this curriculum):
- Derive simple models analytically, then implement numerically
- Focus on conceptual understanding of feedbacks with quantitative examples
- Introduce GCMs descriptively; students explore existing model output rather than building one from scratch
- Treat differential equations as tools (given the prerequisite), not subjects to master
- Emphasize hands-on Python/Julia exercises: build a 0D model, plot CMIP data, compute feedback parameters

**If student shows advanced preparation:**
- Dive into radiative transfer equations (Schwarzschild, two-stream approximation)
- Explore fluid dynamics more deeply (geostrophic balance, vorticity, potential vorticity)
- Implement a 1D radiative-convective model with multiple layers
- Discuss advanced topics: stochastic parameterization, data assimilation, paleoclimate constraints

**If student struggles:**
- Spend more time on energy balance before feedbacks
- Use more visual/graphical approaches, less algebra
- Provide worked examples of every model derivation
- Focus on qualitative understanding of circulation; skip the math
- Delay or simplify the numerical modeling component

## Rabbit Holes

These are fascinating tangents — deploy strategically to maintain engagement:

1. **Paleoclimate as a natural laboratory** — Past warm periods (PETM, Pliocene) and ice ages constrain climate sensitivity. When discussing feedbacks, mention that we've tested these mechanisms over geological time. Hook: "How do we know feedbacks work the same way in the future? We've seen them operate in the past."

2. **Snowball Earth** — When discussing ice-albedo feedback, introduce the hypothesis that Earth was once completely frozen. This is positive feedback taken to its extreme, saved only by volcanic CO₂ buildup. Dramatic, scientifically rich, and shows feedback limits.

3. **Climate on other planets** — Venus (runaway greenhouse), Mars (lost its atmosphere), Titan (methane cycle). Comparative planetology clarifies Earth's climate by contrast. Useful when students feel bogged down in details: "Here's what happens when you change the parameters."

4. **Geoengineering** — Solar radiation management (stratospheric aerosols) and carbon dioxide removal are controversial but scientifically interesting. Introduce when discussing feedbacks or model projections. Forces students to think about intentional climate modification and its risks.

5. **Chaos and predictability** — Weather is chaotic (sensitive to initial conditions); climate is not (statistics of attractors). This distinction confuses students and is a great entry to dynamical systems thinking. Relevant when discussing model validation.

6. **The Keeling Curve story** — Charles David Keeling's CO₂ measurements at Mauna Loa are iconic. The seasonal cycle (photosynthesis) riding on an exponential trend (fossil fuels) is visually striking and historically important. Use when discussing carbon cycle or observations.

## Difficulty Progression

- **Lessons 1-6** (Difficulty 1-3): Build foundation with energy balance. Start intuitive, introduce math gradually. Students derive equilibrium temperature — satisfying early win.
- **Lessons 7-13** (Difficulty 2-4): Feedback mechanisms are conceptually challenging. Ice-albedo is intuitive; water vapor requires thermodynamics; clouds are genuinely hard. Peak difficulty at lesson 11 (quantifying feedbacks).
- **Lessons 14-19** (Difficulty 2-4): Circulation is visual and concrete but requires new vocabulary. AMOC tipping point (lesson 17) is a difficulty peak. Review at lesson 19 consolidates.
- **Lessons 20-25** (Difficulty 3-4): Modeling is hands-on, which helps, but discretization and parameterization are conceptually demanding. Lesson 21 (build your own model) is challenging but rewarding. Review at lesson 25 ensures coding skills solidify.
- **Lessons 26-28** (Difficulty 3-4): Model evaluation requires statistical thinking and dealing with uncertainty. Lesson 27 (model spread) is peak difficulty for this module. Final lesson ties everything to real-world application — motivating, medium difficulty.

## Assessment Strategies

1. **Derive and solve a 0D energy balance model** — Can the student start from "energy in = energy out" and arrive at T = f(S, α, ε)? Tests foundational understanding.

2. **Diagnose feedback from data** — Given a temperature time series and forcing, compute feedback parameter. Tests quantitative reasoning.

3. **Build a simple climate model** — Implement a numerical 0D or 1D model in code. Tests both physics and programming.

4. **Interpret GCM output** — Given CMIP ensemble data, explain model spread, identify outliers, assess uncertainty. Tests critical reading of model results.

5. **Explain a climate mechanism to a non-expert** — Teach-back exercises (lessons 5, 12, 21) force synthesis and reveal gaps.

6. **Scenario analysis** — Given an emissions pathway, use a simple model to project temperature. Discuss assumptions and uncertainties. Tests systems thinking.

7. **Misconception debugging** — Present a common misconception (e.g., "greenhouse effect violates thermodynamics") and ask the student to explain what's wrong and how to correct it. Tests depth of understanding.

Avoid: Multiple choice, rote formula memorization. This topic is about physical reasoning and computational thinking, not fact recall.
