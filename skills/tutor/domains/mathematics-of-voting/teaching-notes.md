# Mathematics of Voting and Fair Division — Teaching Notes

## Approach

This topic uniquely combines **constructive algorithms** (fair division protocols) with **impossibility theorems** (Arrow, Gibbard-Satterthwaite), making it both practical and philosophically profound. At the intermediate level, the pedagogy should balance concrete examples with semi-formal proofs. Start with familiar scenarios (elections, splitting pizza) to build intuition, then introduce formal definitions and mathematical rigor. Use interactive tools and simulations heavily — students need to *see* voting paradoxes emerge from simple preference profiles, not just read about them. The topic is inherently engaging because students encounter voting and resource allocation constantly; leverage this by frequently connecting to real-world applications (electoral systems, estate division, game design).

## Common Misconceptions

1. **"The best voting system just needs to be found"** — Students often believe there's a perfect voting method that satisfies all desirable criteria, making Arrow's theorem particularly shocking. Emphasize that Arrow proved this is mathematically impossible, not just hard to find. The theorem shifts the question from "which system is perfect?" to "which trade-offs do we accept?"

2. **"Majority rule is always fair and decisive"** — The Condorcet paradox violates this intuition by showing majority preferences can cycle (A beats B, B beats C, C beats A). Students struggle to accept that transitivity can fail. Use concrete examples with small preference profiles to make the paradox visceral, not abstract.

3. **"Envy-free allocation always exists"** — When learning about fairness criteria, students assume envy-free divisions are always possible, especially after seeing cut-and-choose. Counterexamples with indivisible goods (two people, one car, one bicycle, different valuations) shatter this. Distinguish clearly between existence results for continuous vs discrete cases.

4. **"Cut-and-choose makes both players envy-free"** — This is a subtle error. Cut-and-choose guarantees both players get at least 1/2 their valuation (proportionality), but the cutter might envy the chooser if they cut imperfectly. Only the chooser is guaranteed envy-free. Students conflate proportionality with envy-freeness until forced to work through the definitions precisely.

5. **"Strategic voting is cheating or unethical"** — Students initially view voting dishonestly as morally wrong, but the Gibbard-Satterthwaite theorem shows strategic voting is a mathematical inevitability in all non-dictatorial systems. Reframe it as rational behavior under the rules, not rule-breaking. The ethics question shifts to mechanism design: how do we design systems that align strategic incentives with desired outcomes?

6. **"Equal shares means fair division"** — Students conflate equality (everyone gets 1/n) with fairness (everyone values their share appropriately). Fair division accounts for heterogeneous preferences — equal shares can be deeply unfair if people value items differently. Use examples: dividing a cake half chocolate, half vanilla between someone who only likes chocolate and someone who likes both.

7. **"More complex voting systems are better"** — After learning about plurality's flaws, students sometimes assume complexity correlates with fairness (e.g., Borda count must be better than plurality). But Arrow's theorem shows all systems have flaws, and complexity can reduce transparency and increase manipulation opportunities. Emphasize trade-offs, not hierarchies.

8. **"Pareto efficiency and fairness always align"** — Students expect that allocations that are fair should also be efficient. The tension between envy-freeness and Pareto efficiency is counterintuitive. Use examples where making someone better off requires creating envy, forcing a choice between efficiency and fairness.

## Level Adjustments

### For Intermediate Students (current level)

**Emphasis:**
- Semi-formal proofs (outline Arrow's theorem step-by-step, but don't require full symbolic logic fluency)
- Multiple worked examples for each concept
- Interactive simulations to build intuition before formalism
- Real-world applications to maintain engagement
- Comparative analysis: students should evaluate systems, not just learn them

**Depth:**
- Prove Arrow's theorem at the "theorem roadmap" level (key steps, intuition for why each criterion matters)
- Full execution of Selfridge-Conway protocol with concrete valuations
- Strategic voting examples with specific preference profiles
- Voting power calculations for simple scenarios (3-4 voters)

**Skip:**
- Measure theory for cake cutting (use discrete approximations)
- Full formal logic for Gibbard-Satterthwaite (state theorem, show examples, skip proof)
- Advanced mechanism design (VCG mechanisms, revelation principle)
- Computational complexity results for fair division algorithms

### Adjustments for Beginner Level

**Simplifications:**
- Focus on 2-3 voting systems (plurality, Borda, approval) instead of comprehensive survey
- State Arrow's theorem without proof, show examples of why each criterion is hard
- Only two-player fair division (cut-and-choose, adjusted winner)
- Skip voting power indices
- More visual/interactive, less symbolic

### Adjustments for Advanced Level

**Additions:**
- Full formal proof of Arrow's theorem using symbolic logic
- Measure-theoretic treatment of cake cutting
- Computational complexity of fair division (NP-hardness results)
- Advanced mechanism design (VCG, revelation principle, incentive compatibility)
- Recent research: approximate envy-freeness, online fair division
- Voting power for weighted voting games
- Axiomatic treatment of both voting and division

## Rabbit Holes (Fascinating Connections)

### When to Introduce

- **Game theory and Nash equilibrium** — after strategic voting (lesson 21). Strategic voting is a non-cooperative game; Nash equilibrium characterizes stable strategic profiles. This connects to broader game theory.

- **Computational social choice** — after lesson 25 (applications). Modern research area: algorithms for large-scale voting, complexity of manipulation, AI-driven preference elicitation. Connect to computer science students' interests.

- **Blockchain and decentralized governance** — after voting power (lesson 22). Cryptocurrencies use voting mechanisms (proof of stake, DAO governance). Real-world high-stakes application of these mathematical ideas.

- **Kidney exchange and matching markets** — after fair division (lessons 12-20). Roth's work on market design uses similar algorithmic fairness ideas. Nobel Prize-winning application of mechanism design.

- **Philosophy of democracy** — after Arrow's theorem (lesson 8). What does Arrow's result mean for democratic theory? Is democracy mathematically impossible? Connects to political philosophy.

- **Gerrymandering as a division problem** — after cake cutting (lesson 16-19). Redistricting is cake cutting with strategic manipulation. Highly topical real-world application.

- **Fair machine learning** — after fairness criteria (lesson 13). Algorithmic fairness in ML borrows concepts from fair division (envy-freeness, Pareto efficiency applied to classification, resource allocation in AI systems).

- **Auction theory** — after mechanism design hints (lesson 23). Auctions are mechanism design for resource allocation. Connects to economics and e-commerce.

- **Judgment aggregation** — after voting theory (lessons 1-11). Generalizes voting from candidates to propositions (e.g., jury decisions). Shows impossibility results extend beyond candidate elections.

## Difficulty Progression

The curriculum follows a "peak-valley-peak" structure:

1. **Gentle intro** (lessons 1-5, difficulty 1-2): Build familiarity with voting systems using real-world examples
2. **First peak** (lessons 6-10, difficulty 3-5): Paradoxes and Arrow's theorem (lesson 9 is the hardest: teaching back the proof)
3. **Review valley** (lesson 11, difficulty 2): Consolidate voting theory
4. **Moderate climb** (lessons 12-15, difficulty 2-3): Discrete fair division is more concrete and algorithmic than voting theory
5. **Second peak** (lessons 16-19, difficulty 2-4): Continuous division protocols, efficiency-fairness trade-offs
6. **Review valley** (lesson 20, difficulty 1): Consolidate fair division
7. **Strategic plateau** (lessons 21-23, difficulty 3-4): Strategic behavior in both domains
8. **Applications descent** (lessons 24-25, difficulty 2): Bring it all together with real-world grounding

The two peaks correspond to the conceptual bottlenecks (Arrow's theorem, envy-freeness vs efficiency). Reviews are strategically placed after peaks to consolidate before moving forward.

## Engagement Strategies

- **Use online simulators**: Nicky Case's voting simulator, Spliddit for fair division. Let students experiment with different preference profiles and see paradoxes emerge.

- **Run mock elections**: Create preference profiles for the class (or fictional scenarios), run multiple voting systems, show how winners differ. Make Arrow's theorem personal.

- **Fair division exercises with real items**: Bring in a heterogeneous "cake" (mixed candy, different fruits) and execute Selfridge-Conway live. Physical manipulation makes the protocol memorable.

- **Current events hooks**: Reference recent elections, controversial votes, estate disputes in the news. Students care more when it's relevant.

- **Debate format**: For lesson 24 (electoral systems), have students argue for different voting methods given different societal goals. No single right answer, just trade-offs.

- **Historical context**: Tell stories of Arrow (economics Nobel 1972), Condorcet (French Revolution), Brams (political science applications). Humanize the mathematics.

## Common Sticking Points

1. **Arrow's theorem proof**: The most challenging lesson. Break it into digestible chunks. First pass: understand the theorem statement. Second pass: see why each criterion is reasonable. Third pass: sketch proof structure. Fourth pass: work through details. Don't rush.

2. **Selfridge-Conway protocol**: The execution has many steps and is easy to lose track of. Worked examples with specific valuations are essential. Consider providing a flowchart or visual diagram.

3. **Voting power indices**: The formulas (especially Shapley-Shubik with factorials) can be intimidating. Start with tiny examples (3 voters) and build up. Emphasize the conceptual idea (when are you pivotal?) over computation.

4. **Distinguishing fairness criteria**: Proportionality, envy-freeness, equitability, Pareto efficiency — students confuse these. Create a comparison table and revisit it frequently. Use the same example scenario with different criteria to show how they diverge.
