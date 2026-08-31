# Computational complexity — P, NP, and beyond — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 9 lessons (27%)
- **Socratic questions** — 5 lessons (15%)
- **teach-back exercises (student explains)** — 5 lessons (15%)
- **review and consolidation sessions** — 5 lessons (15%)
- **curated resource exploration** — 5 lessons (15%)
- **real-world application challenges** — 4 lessons (12%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 39% accessible (1-2), 36% standard (3), 24% challenging (4-5).

Difficulty peaks:
- Day 15: "Why is SAT the hardest problem in NP?" (difficulty 4)
- Day 16: "Can you reduce 3SAT to CLIQUE?" (difficulty 4)
- Day 18: "How do you prove a new problem is NP-complete?" (difficulty 4)
- Day 19: "Can you show that SUBSET-SUM is NP-complete?" (difficulty 4)
- Day 23: "Why do games lead to harder complexity classes?" (difficulty 4)

## Domain Hooks
- **Cryptography depends on complexity** — Modern encryption assumes P ≠ NP and the hardness of specific problems (factoring, discrete log). Drop this when discussing P vs NP implications. If P = NP, all public-key cryptography collapses.

- **SAT solvers are shockingly effective** — Despite NP-completeness, modern SAT solvers handle millions of variables. This is a living example of "worst-case ≠ average-case." Mention CDCL algorithms and the SAT competition.

- **The complexity zoo has 500+ classes** — Show https://complexityzoo.net/ as a wild card. Classes like NEXPTIME, PP, BQP, PH, IP, #P, AM, and more. Complexity theory is vast.

- **Quantum computing and BQP** — Shor's algorithm breaks factoring (upends RSA) but probably doesn't solve NP-complete problems. BQP vs NP is open and fascinating.

- **Natural proofs barrier** — Why is proving P ≠ NP so hard? Razborov-Rudich showed that a broad class of techniques can't work. Similarly, relativization (Baker-Gill-Solovay) and algebriza

## Common Failure Modes
1. **"NP means exponential time"** — Students conflate NP with intractability. Correction: NP is about polynomial-time *verification*, not solution time. Point out that P ⊆ NP, so many NP problems are actually easy. NP-*complete* problems are believed hard, but even that's unproven.

2. **"NP-complete problems are impossible to solve"** — Students think NP-completeness means "give up." Correction: We solve NP-complete problems daily (SAT solvers, optimization tools). NP-completeness describes worst-case hardness; many instances are tractable via heuristics, approximation, or special structure.

3. **"If we reduce A to B, then A is harder than B"** — The reduction direction is counterintuitive. Correction: Reducing A to B means "B is at least as hard as A" (you're using B to solve A). Use the mantra: "If I can solve the target (B), I can solve the source (A)."

4. **"P vs NP is about whether NP problems can be solved quickly"** — Vague formulation. Correction: P vs NP asks whether every

## Vocabulary
Key terms for this domain: Turing machines, Church-Turing thesis, computational models, time complexity, space complexity, asymptotic analysis, polynomial vs exponential growth, efficient algorithms, problem size, decision problems, languages, encoding schemes, complexity classes, P definition, closure properties (and 82 more).