# Behavioral Economics — Teaching Notes

## Approach

Teach **predict, then reveal**. Before naming an effect, have the student answer the classic experimental question themselves (the Linda problem, the Asian disease problem, the Allais choices, $100 today versus $110 tomorrow). Catching their own bias is the most memorable moment this subject offers. Every anomaly lesson must state plainly which rational-model prediction it violates, so the benchmark from Module 1 has to be solid first. Keep the math light: use expected value, the prospect-theory value function, beta-delta and Fehr-Schmidt only, each with a worked numeric example. Build skepticism into the course from the start rather than adding it at the end.

## Common Misconceptions

1. **'Behavioral economics proves people are irrational, so economics is wrong.'** The field keeps the method of modeling choices and changes the assumptions. Present bias and loss aversion are themselves precise, testable models. Stress that neoclassical theory remains the benchmark.
2. **'Risk aversion and loss aversion are the same thing.'** Risk aversion in expected utility comes from a concave utility curve over total wealth. Loss aversion is a kink at a reference point. Correct this with the small-stakes argument: rejecting a 50/50 bet of lose $100 / win $110 is hard to explain with curvature over total wealth, but easy to explain with a kink.
3. **'Any impatience is present bias.'** Exponential discounting is impatient too, but it is consistent. Present bias is specifically about preference reversals as a choice moves closer. Use the 'today vs tomorrow' and 'a year vs a year and a day' pair.
4. **'People who reject low ultimatum offers just don't understand the game.'** Rejections persist when the stakes are explained and real. Frame them as preferences (fairness, punishing unfairness), which Fehr-Schmidt models directly.
5. **'A nudge is anything that changes behavior.'** By Thaler and Sunstein's definition a nudge keeps options open and does not significantly change economic incentives. Mandates, bans and large taxes are not nudges.
6. **'If it's in a famous book, it replicated.'** Ego depletion failed a large multi-lab replication. Strong priming claims have weakened. A field experiment on honesty (Shu et al. 2012) was retracted after evidence of fabricated data. Classic anchoring effects with things like Social Security digits shrink on replication (Maniadis, Tufano and List 2014). Nudge effects in nudge units at scale are much smaller than in published academic trials (DellaVigna and Linos 2022).
7. **'Loss aversion is a fixed constant of 2.'** Estimates vary by context and elicitation method. Some researchers (e.g. Gal and Rucker 2018) argue it is overstated for small or routine stakes. The endowment effect also depends on procedure (Plott and Zeiler 2005). Teach '≈2' as a useful benchmark, not a law.
8. **'Biases cancel out in markets.'** Lesson 31 corrects this: arbitrage is risky and capital-constrained, and some firms profit from keeping consumers naive rather than educating them (Gabaix and Laibson 2006).

## Level Adjustments

The student is intermediate: comfortable with algebra and expected value, no calculus. Introduce notation such as v(x), λ, β, δ, α and Fehr-Schmidt's β with plain-language meanings, and always plug in numbers right away. Skip axiomatic decision theory beyond stating the independence axiom informally for Allais. Skip structural estimation and neuroeconomics. Mention level-k and QRE only in passing. Name primary papers and assign short excerpts (an abstract plus one figure), not full readings. For computation lessons (2, 12, 14, 18, 22), give one worked example and then one exercise with different numbers. When the student is struggling, swap formula exercises for name-the-bias multiple choice. When they are coasting, ask them to critique a study's design or to build a scenario that separates two competing explanations (for example, loss aversion versus status quo bias).

## Evidence Guide (use when the student asks 'is this real?')

- **Robust:** defaults and automatic enrollment, present bias in many field settings, the disposition effect, ultimatum rejections of very unequal splits, framing in many forms, the conjunction fallacy.
- **Real but contested in size or mechanism:** loss aversion magnitude, the endowment effect, the cab-driver income-targeting result (challenged by Farber), anchoring on irrelevant numbers, average nudge effects.
- **Weak or discredited:** ego depletion, many social-priming effects, the retracted 'sign at the top' honesty study.

## Rabbit Holes

- **Capuchin monkeys show loss aversion and reject unequal pay** (Chen, Lakshminarayanan and Santos 2006; Brosnan and de Waal 2003, the cucumber-versus-grape study). Drop this in during lesson 12 or 21 to ask whether these biases are evolved.
- **A psychologist won the economics Nobel.** Kahneman shared the 2002 prize, Tversky having died in 1996. Thaler won in 2017, Simon in 1978 and Shiller in 2013. Good for lesson 4 or the capstone.
- **Odysseus and the sirens** is the original commitment device. Use it in lesson 20, alongside modern apps that make you forfeit money if you skip a goal.
- **Post-9/11 driving deaths** (Gigerenzer 2006): road deaths rose in the months after 9/11 as people drove instead of flying. Gigerenzer's explanation is that fear of flying, an availability effect, caused it. That is an interpretation of an observational pattern, not something the study measured. Use it as the hook for lesson 6 and ask students for other explanations (cost, convenience, security delays).
- **Algorithms as economic agents.** Hartline's 2026 arxiv review asks what replaces 'rationality' when trading bots and pricing algorithms make the decisions. Offer it after lesson 31 to the curious student.
- **Dark patterns and regulation.** Consumer-protection agencies in the US and EU have targeted manipulative cancellation flows and hidden fees. Connect to lesson 32.
- **Code extension:** the R package johnmyleswhite/BehavioralEconomics and Pozzi's Python/Julia structural behavioral-economics notebooks on GitHub. Optional, for a student who wants to fit beta-delta or prospect-theory parameters themselves.
