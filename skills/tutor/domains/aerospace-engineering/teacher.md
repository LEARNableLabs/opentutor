# Aerospace Engineering — Flight and Propulsion — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 13 lessons (38%)
- **Socratic questions** — 8 lessons (24%)
- **real-world application challenges** — 5 lessons (15%)
- **review and consolidation sessions** — 4 lessons (12%)
- **teach-back exercises (student explains)** — 3 lessons (9%)
- **curated resource exploration** — 1 lessons (3%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 47% accessible (1-2), 41% standard (3), 12% challenging (4-5).

Difficulty peaks:
- Day 16: "What happens when airflow reaches the speed of sound?" (difficulty 4)
- Day 17: "How do nozzles accelerate flow to supersonic speeds?" (difficulty 4)
- Day 26: "Why can't turbojets fly at Mach 5?" (difficulty 4)
- Day 30: "How do you optimize a rocket nozzle for altitude?" (difficulty 4)

## Domain Hooks
1. **Winglets and induced drag reduction** — Drop this when discussing induced drag (lesson 8). Show how winglets disrupt the wingtip vortex rollup, effectively increasing aspect ratio. Connect to biomimicry: birds' split wingtip feathers serve the same function. Calculate the fuel savings for commercial aircraft (3-5% reduction in drag). This rabbit hole touches on optimization (winglet height vs. weight penalty), flow control, and the economics of aircraft operation.

2. **The sound barrier myth** — Drop this during shock wave discussion (lesson 16). Explain that the "sound barrier" isn't a physical barrier but a region of peak drag near Mach 1 due to mixed subsonic/supersonic flow. Show the drag-rise curve and explain why early pilots thought it was unsurmountable. Mention Chuck Yeager and the X-1. This connects aerodynamics to history and dispels a common pop-science misconception.

3. **Bumblebee flight and unsteady aerodynamics** — Drop this after discussing stall and conventiona

## Common Failure Modes
1. **"Lift comes from Bernoulli's equation"** — Students latch onto the "faster flow = lower pressure" explanation but miss that circulation is the fundamental mechanism. They can't explain *why* the flow is faster over the top, leading to circular reasoning. Correct by teaching the Kutta condition and bound vortex model first, then show Bernoulli as a consequence. Emphasize that Bernoulli alone can't predict the circulation strength.

2. **"Air pushes the wing up from below"** — The "skipping stone" or "deflection" explanation makes students think lift is primarily from impact pressure on the lower surface. In reality, 2/3 to 3/4 of lift comes from suction on the upper surface. Correct by showing pressure distributions and asking: "Where is the pressure furthest from atmospheric?" Use CFD visualizations to show the strong suction peak.

3. **"Higher Mach number always means stronger shocks"** — Students think shock strength scales monotonically with Mach number, but shock angle, body 

## Vocabulary
Key terms for this domain: continuum assumption, fluid properties, flow visualization, conservation laws, continuity equation, Euler equations, viscosity, no-slip condition, Reynolds number, boundary layers, flow separation, adverse pressure gradient, circulation, vorticity, Kutta-Joukowski theorem (and 87 more).