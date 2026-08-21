# Game Theory — Teaching Notes

## Approach

Game theory sits at the intersection of mathematics, economics, and strategic thinking. At the intermediate level, emphasize **rigorous conceptual foundations** with **rich applications**. Balance formal definitions (what is Nash equilibrium?) with intuitive understanding (why is mutual best response the right concept?) and computational practice (how do we find equilibria?). Make extensive use of **concrete examples** — the prisoner's dilemma, matching pennies, entry games, auctions — before abstracting to general theorems. Game theory is best learned by **doing**: working through payoff matrices, drawing game trees, computing best responses. The math is accessible (mostly algebra and basic probability), but the conceptual shifts (simultaneous optimization, credible threats, incomplete information) require careful scaffolding.

## Common Misconceptions

1. **"Nash equilibrium is a good outcome"**
   - **Why it happens**: The name "equilibrium" sounds positive, and students confuse individual rationality with collective optimality
   - **How to correct**: Start with the prisoner's dilemma. Emphasize that Nash predicts behavior, it doesn't judge it. The Pareto-superior outcome (both cooperate) is not a Nash equilibrium. Nash is about stability, not optimality.

2. **"Players should always choose their dominant strategy"**
   - **Why it happens**: Dominant strategies are taught first as the "easy case"
   - **How to correct**: Clarify that dominant strategies are rare. Most games have no dominant strategies for any player. Dominant strategy equilibrium is a very special case of Nash equilibrium.

3. **"Mixed strategies are mistakes or confusion"**
   - **Why it happens**: Randomization seems irrational — why not just pick the best option?
   - **How to correct**: Show matching pennies (no pure Nash exists). Emphasize that mixing keeps opponents indifferent, which prevents exploitation. Connect to sports (penalty kicks, poker bluffs) where mixing is obviously rational.

4. **"Backward induction always gives the right answer"**
   - **Why it happens**: Backward induction is algorithmic and works cleanly in perfect information games
   - **How to correct**: Show the centipede game or finitely repeated prisoner's dilemma where backward induction predicts behavior that seems absurd. Discuss the paradox: backward induction relies on common knowledge of rationality, which may fail in practice. Subgame perfection is normative, not always descriptive.

5. **"The folk theorem means cooperation is always possible in repeated games"**
   - **Why it happens**: The folk theorem is powerful and students overgeneralize
   - **How to correct**: Emphasize the conditions: infinite (or indefinite) horizon and sufficiently high discount factor. Show that finite repetition unravels completely via backward induction. The folk theorem is a possibility result, not a prediction.

6. **"In Bayesian games, players learn their type during the game"**
   - **Why it happens**: "Bayesian" suggests updating beliefs, and students know Bayes' rule involves learning
   - **How to correct**: Clarify that types are drawn at the start (ex ante) and held fixed. Bayesian games model initial uncertainty, not dynamic learning. Learning happens in dynamic games with incomplete information (signaling, screening), which come later.

7. **"Game theory only applies to competitive situations"**
   - **Why it happens**: The word "game" and early examples (prisoner's dilemma, zero-sum games) suggest conflict
   - **How to correct**: Show coordination games, bargaining, team production, matching markets. Game theory models any strategic interaction, including pure cooperation (both players want the same outcome but face coordination problems).

8. **"If I find a Nash equilibrium, I've solved the game"**
   - **Why it happens**: Students expect a unique solution like in optimization problems
   - **How to correct**: Show games with multiple Nash equilibria (battle of the sexes, coordination games). Discuss that game theory predicts the set of reasonable outcomes, and equilibrium selection (focal points, cheap talk, evolutionary dynamics) is a separate question.

9. **"Subgame perfection and Nash equilibrium are different solution concepts for different games"**
   - **Why it happens**: They're taught separately and applied to different game forms (extensive vs normal)
   - **How to correct**: Emphasize that subgame perfect equilibrium is a refinement of Nash — every SPE is a Nash equilibrium (in the extensive form representation), but not every Nash is subgame perfect. Same underlying logic (best response), tighter requirements (must be best response in every subgame).

10. **"Game theory assumes people are selfish"**
    - **Why it happens**: Economic applications often use monetary payoffs
    - **How to correct**: Payoff functions can encode anything: altruism, fairness concerns, spite, reputation, warm glow from cooperation. Game theory is about strategic reasoning given preferences, not about what those preferences are. Behavioral game theory studies how actual preferences differ from narrow self-interest.

## Level Adjustments

**Beginner level** would focus on:
- Dominant strategies and iterated elimination only
- Pure strategy Nash equilibrium in 2x2 games
- No extensive form or backward induction
- Applications with simple payoff structures

**Intermediate level** (this curriculum) includes:
- Full Nash equilibrium theory (pure and mixed)
- Extensive form games and subgame perfection
- Repeated games and the folk theorem (intuitive, not rigorous proof)
- Introduction to Bayesian games with simple examples
- Applications: auctions, entry deterrence, collusion
- Computational practice but proofs are optional (e.g., Nash existence theorem stated but not proved)

**Advanced level** would add:
- Rigorous proofs (Nash existence via fixed point theorems)
- Refinements: perfect Bayesian equilibrium, sequential equilibrium, trembling hand
- Mechanism design theory (revelation principle, implementation)
- Matching theory, market design
- Evolutionary game theory with replicator dynamics
- Algorithmic game theory (complexity of equilibrium computation)
- Applications in auction design, bargaining theory, contract theory

**Key differences for intermediate:**
- Formalism level: precise definitions, but proof techniques remain intuitive
- Computational emphasis: finding equilibria matters more than proving existence
- Breadth over depth: cover major solution concepts, don't exhaustively refine them
- Applications drive theory: use real-world examples to motivate every concept

## Rabbit Holes (Fascinating Connections)

1. **Evolutionary game theory and cultural evolution**
   - Drop in: After lesson 25 (evolution plays games)
   - Connection: Evolutionary stable strategies explain animal behavior (hawk-dove games), but also cultural norms, language conventions, and traffic patterns. Equilibrium without conscious optimization.
   - Depth: Show how replicator dynamics naturally select for Nash equilibria. Connect to biology (Maynard Smith) and sociology (norm emergence).

2. **Algorithmic game theory and computational complexity**
   - Drop in: After lesson 9 (computing Nash equilibria)
   - Connection: Finding Nash equilibria is PPAD-complete (roughly as hard as factoring). Even 2-player games can be computationally hard. The theory is elegant, but computation is tough.
   - Depth: Mention Nash's proof is non-constructive (fixed point theorem). Introduce Gambit or other computational tools. Touch on mechanism design for computationally tractable outcomes.

3. **Behavioral game theory and experimental economics**
   - Drop in: After lesson 3 (prisoner's dilemma) and lesson 14 (backward induction paradox)
   - Connection: Real people systematically deviate from Nash predictions: cooperate in one-shot prisoner's dilemma, reject low offers in ultimatum games, don't fully backward induct in centipede games.
   - Depth: Introduce bounded rationality, social preferences (inequity aversion, reciprocity), and level-k reasoning. Reference Vernon Smith, Ernst Fehr, Colin Camerer.

4. **Matching markets and market design**
   - Drop in: After lesson 26 (mechanism design)
   - Connection: Some markets (kidneys, school choice, residency matching) can't use prices. Game theory designs mechanisms for stable matchings.
   - Depth: Gale-Shapley algorithm for stable matching. Roth's work on kidney exchange and school choice. Nobel Prize 2012 (Roth, Shapley).

5. **Voting theory and social choice**
   - Drop in: During lesson 7 (auctions) or lesson 26 (mechanism design)
   - Connection: Voting rules are mechanisms. Arrow's impossibility theorem, Gibbard-Satterthwaite theorem (strategy-proofness is rare). Strategic voting is a game.
   - Depth: Condorcet paradox, median voter theorem, agenda control. Game theory explains why "fair" voting rules are hard to design.

6. **Zero-knowledge proofs and cryptography**
   - Drop in: If student has CS background, after lesson 22 (incomplete information)
   - Connection: Zero-knowledge proofs are repeated games with incomplete information. Prover convinces verifier without revealing the secret.
   - Depth: Very brief intro — this is a deep rabbit hole, but shows game theory in theoretical CS.

## Difficulty Progression Notes

The curriculum follows this difficulty arc:

**Lessons 1-4 (Difficulty 1-2)**: Foundations — Strategic form games, payoff matrices, prisoner's dilemma. Gentle introduction, build intuition before formalism.

**Lessons 5-7 (Difficulty 3)**: Dominant strategies and rationalizability. First conceptual challenge: iterated reasoning about rationality.

**Lessons 8-11 (Difficulty 3-4)**: Nash equilibrium and mixed strategies. **Peak 1**. Mixed strategies (lesson 10-11) are the first major cognitive leap.

**Lesson 12 (Difficulty 2)**: Review. Consolidate strategic form games and Nash equilibrium before moving to extensive form.

**Lessons 13-16 (Difficulty 3-4)**: Sequential games and subgame perfection. **Peak 2**. New game form, backward induction, credible threats. Lesson 14 and 16 are challenging.

**Lesson 17 (Difficulty 2)**: Review. Solidify extensive form games.

**Lessons 18-21 (Difficulty 3-4)**: Repeated games and folk theorem. Moderate difficulty, builds on previous concepts. Folk theorem (lesson 20) is challenging but students have the tools by now.

**Lessons 22-24 (Difficulty 4-5)**: Bayesian games and incomplete information. **Peak 3**. This is the hardest module. Types, beliefs, Bayesian Nash equilibrium (lesson 23) is difficulty 5.

**Lessons 25-26 (Difficulty 3-4)**: Applications and extensions. Still substantial but students are experienced now. Lesson 25 (evolutionary) is more conceptual, lesson 26 (mechanism design) synthesizes previous work.

**Lesson 27 (Difficulty 2)**: Final review. Integrate the strategic worldview, reflect on equilibrium concepts and their applications.

**Key points:**
- Three difficulty peaks: mixed strategies, subgame perfection, Bayesian games
- Reviews (lessons 12, 17, 27) consolidate before and after peaks
- Applications (lessons 3, 7, 11, 15, 21, 24, 25) interspersed to maintain motivation
- Difficulty doesn't monotonically increase — some later lessons (evolutionary, applications) are more accessible because they're conceptual rather than technical

## Assessment Strategies

**Formative (during lessons):**
- **Best response calculations**: Given a strategy profile, is it a Nash equilibrium? What's your best response to their strategy?
- **Equilibrium finding**: Solve 2x2 and 3x3 games for Nash equilibria (pure and mixed)
- **Game tree solving**: Draw the tree, mark subgames, use backward induction
- **Interpretation questions**: Why is this an equilibrium? Is this threat credible? Would cooperation be sustainable?
- **Teach-back exercises** (lessons 4, 26): Student formulates a scenario as a game or designs a mechanism

**Summative (module reviews):**
- **Multi-step problems**: Analyze a scenario from multiple angles (normal form, extensive form, repeated, incomplete information)
- **Comparative analysis**: How does the equilibrium change if we repeat the game? If information is incomplete?
- **Application design**: Given a real-world scenario (auction, negotiation, market entry), model it as a game and predict outcomes

**Red flags (student needs help):**
- Confusing Nash equilibrium with Pareto optimality
- Unable to set up best response correspondences
- Thinking backward induction "doesn't make sense" (may need to revisit sequential rationality)
- Treating mixed strategies as mistakes rather than rational choices
- Confusing types (incomplete information) with moves (extensive form)

**Green flags (student is thriving):**
- Spotting strategic interactions in news/daily life
- Asking about refinements ("What if players don't fully trust each other's rationality?")
- Connecting to mechanism design ("Could we change the rules to fix this?")
- Noticing when theory and experiments diverge (behavioral game theory)
- Exploring computational tools (Gambit, GTE)

**Progression criteria:**
- By lesson 12: confidently find Nash equilibria in simple strategic games
- By lesson 17: solve finite perfect-information games via backward induction
- By lesson 21: understand folk theorem intuitively (conditions + implications)
- By lesson 24: analyze simple Bayesian games (symmetric information structures)
- By lesson 27: articulate the strategic worldview, recognize game-theoretic structures in applications
