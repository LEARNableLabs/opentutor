# Control Theory — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 11 lessons (37%)
- **real-world application challenges** — 5 lessons (17%)
- **teach-back exercises (student explains)** — 5 lessons (17%)
- **Socratic questions** — 5 lessons (17%)
- **review and consolidation sessions** — 4 lessons (13%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 43% accessible (1-2), 30% standard (3), 27% challenging (4-5).

Difficulty peaks:
- Day 14: "Why does the root locus look like that?" (difficulty 4)
- Day 15: "Can you find the gain that makes this system critically damped?" (difficulty 4)
- Day 20: "What does the Nyquist plot reveal about stability?" (difficulty 4)
- Day 25: "When do you need lead or lag compensation?" (difficulty 4)
- Day 27: "What makes a system controllable or observable?" (difficulty 4)

## Domain Hooks
1. **Nyquist's stability criterion and complex analysis**
   - Drop in lesson 18 or when discussing frequency methods
   - Connection: Argument principle from complex analysis; why encirclements count poles
   - Leads to: Beautiful connection between control theory and pure mathematics

2. **Optimal control and the Riccati equation**
   - Drop in lesson 26-28 when discussing state feedback
   - Connection: What if we chose poles to minimize a cost function instead of arbitrarily?
   - Leads to: LQR, Kalman filtering, the separation principle's optimality

3. **Passivity theory and energy-based control**
   - Drop in lesson 15-17 when discussing frequency response
   - Connection: Frequency response phase tells you about energy flow; passive systems store/dissipate but don't generate energy
   - Leads to: Lyapunov stability, port-Hamiltonian systems, power-preserving interconnections

4. **The duality between controllability and observability**
   - Drop in lesson 25 when introducing bo

## Common Failure Modes
1. **"Higher gain always improves performance"**
   - **Why students think this**: More gain reduces error more quickly
   - **The reality**: High gain reduces stability margins and amplifies noise; there's always a tradeoff
   - **How to correct**: Show root locus or Bode plot demonstrating gain-driven instability; use real examples like aggressive drone control that oscillates

2. **"Complex poles mean the system is unstable"**
   - **Why students think this**: They confuse oscillatory behavior with instability
   - **The reality**: Complex poles in the left half-plane are perfectly stable; imaginary component determines oscillation frequency
   - **How to correct**: Plot time responses showing stable oscillation vs. growing oscillation; emphasize real part determines stability

3. **"Poles and roots are different things"**
   - **Why students think this**: Terminology varies (poles of transfer function, roots of characteristic equation, eigenvalues of A matrix)
   - **The reality**:

## Vocabulary
Key terms for this domain: dynamic systems, input-output behavior, modeling philosophy, transfer functions, Laplace domain, poles and zeros, feedback loops, open-loop vs closed-loop, disturbance rejection, physical modeling, linearization, block diagrams, time constants, exponential response, settling time (and 76 more).