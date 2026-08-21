# Epidemiology — Teaching Notes

## Approach

Epidemiology is fundamentally about **detective work** — using incomplete, messy data to make inferences about disease causation and public health action. At the intermediate level, move beyond cookbook formulas to develop **critical reasoning about study design trade-offs and threats to validity**. Emphasize that epidemiology is not pure mathematics or pure biology, but a hybrid discipline that uses quantitative methods to answer biological and public health questions. Make liberal use of **real outbreak case studies** (Legionnaires' disease, cholera in London, recent COVID-19 examples) to ground abstract concepts. Students at this level should be able to critique published studies, not just calculate measures from clean 2x2 tables.

## Common Misconceptions

1. **Incidence and prevalence are interchangeable** — Students use these terms loosely without recognizing the fundamental difference. Incidence measures risk of developing disease; prevalence measures disease burden. Chronic non-lethal diseases (diabetes) have prevalence >> incidence. Acute lethal diseases (rabies) have incidence >> prevalence. Prevalence = incidence × average duration. Use concrete examples: "Why does the prevalence of the common cold at any moment seem low despite everyone getting multiple colds per year?"

2. **Odds ratios are just "different" from risk ratios** — Students memorize that cohorts give RR and case-controls give OR, but don't understand why. The sampling mechanism matters: in case-controls, you fix the number of cases and controls, so you cannot estimate disease risk. But when disease is rare (<10%), OR ≈ RR mathematically. Work through the algebra to show this approximation.

3. **Confounding means any third variable related to exposure and disease** — Many students think smoking is a confounder of the alcohol-liver disease relationship because smokers drink more and smoking harms the liver. But smoking is likely on the causal pathway (alcohol → smoking → liver disease) or shares common causes, not a true confounder. Draw causal diagrams explicitly to distinguish confounders, mediators, colliders, and effect modifiers.

4. **Randomization eliminates all bias** — Students believe RCTs are perfect. In reality, randomization only balances confounding *on average* in *large* samples. RCTs still face selection bias (who volunteers?), information bias (placebo effects, measurement error), and loss to follow-up. They trade external validity for internal validity.

5. **Statistical significance = clinical importance** — Students see p < 0.05 and conclude the finding matters. But with 100,000 subjects, even trivial effects (RR = 1.01) are "significant." Conversely, with 20 subjects, large effects (RR = 3.0) may not be "significant." Always interpret confidence intervals and effect sizes, not just p-values.

6. **High R0 means deadlier disease** — Students conflate transmissibility with severity. Measles has R0 ≈ 15 but low case-fatality rate. Ebola has R0 ≈ 2 but high case-fatality rate. R0 measures secondary infections, not lethality. Pandemic potential depends on both R0 and severity.

7. **Screening always saves lives** — Students assume early detection = better outcomes. Lead-time bias (detecting disease earlier without changing death date makes survival seem longer) and length-time bias (screening catches slow-growing cases that were less likely to kill) create illusion of benefit. Overdiagnosis (detecting "disease" that would never cause symptoms) can harm via unnecessary treatment.

8. **Causation requires a single cause** — Students want one exposure to cause one disease. Most chronic diseases are multifactorial. Smoking, diet, genetics, and occupational exposures all contribute to lung cancer. Hill's criteria emphasize *weight of evidence*, not proof.

9. **Ecological studies = individual-level associations** — Students see countries with high chocolate consumption have more Nobel Prize winners and think chocolate makes people smart. This is the ecological fallacy: country-level associations don't imply individual-level associations. Confounding by wealth, education systems, and culture.

10. **Sensitivity and specificity trade off linearly** — Students think you can just pick a point on the ROC curve. But choosing cutoffs involves values: is a false positive worse than a false negative? For HIV screening, minimize false negatives (high sensitivity). For surgical decision, minimize false positives (high specificity).

## Level Adjustments

### Intermediate (current level)

At intermediate level, assume students have:
- Basic statistics (mean, variance, hypothesis testing, p-values, confidence intervals)
- Scientific literacy (can read a research paper's structure)
- Motivation from real-world health questions

**Emphasize:**
- Study design trade-offs (why choose cohort vs case-control vs RCT?)
- Threats to validity (bias, confounding) with real examples
- Critical appraisal of published studies (journal club approach)
- Hands-on analysis with 2x2 tables and real datasets (NHANES, outbreak data)
- Conceptual understanding over formula memorization
- Causal inference frameworks (Hill's criteria, DAGs) at an intuitive level

**De-emphasize:**
- Advanced statistical methods (regression, survival analysis, mixed models) — introduce conceptually but don't require mastery
- Mathematical proofs (e.g., why OR approximates RR) — show the result, optionally sketch the proof
- Philosophical debates about causation — focus on practical frameworks
- Detailed outbreak investigation protocols — teach principles, not memorize forms

**Avoid:**
- Treating epidemiology as purely mathematical (not just formulas in a vacuum)
- Cookbook approaches (always do X when you see Y)
- Overwhelming with rare study designs (case-cohort, case-crossover)
- Jargon without explanation ("ecologic fallacy" without examples)

### Beginner Adjustments (if needed)

If student struggles, dial back to:
- Focus on descriptive epidemiology and basic measures (prevalence, incidence, rates)
- Use 2x2 tables extensively with simple examples
- Introduce only cohort and case-control designs (skip cross-over, case-cohort, etc.)
- Emphasize association vs causation as a binary (not nuanced frameworks)
- Skip advanced topics (DAGs, effect modification, interaction)
- More guided practice with worked examples

### Advanced Adjustments (if student excels)

If student breezes through:
- Introduce regression modeling (logistic regression for OR, Cox regression for hazard ratios)
- Causal inference deep dive: DAGs, counterfactuals, instrumental variables, propensity scores
- Meta-analysis and systematic review methods
- Infectious disease modeling (SIR/SEIR compartmental models, R0 derivation)
- Effect modification and interaction (statistical vs biological interaction)
- Advanced bias analysis (quantitative bias analysis, sensitivity analysis)
- Real data analysis projects in R or Python

## Rabbit Holes (Fascinating tangents to drop in at the right moment)

1. **John Snow and the Broad Street Pump (1854)** — The founding myth of epidemiology. Snow mapped cholera deaths, identified the contaminated water pump, removed the handle, and ended the outbreak — all before germ theory was accepted. Modern lesson: You don't need to know the mechanism to take public health action. Drop this in when discussing outbreak investigation (lesson 24) or descriptive epidemiology (lesson 1).

2. **Bradford Hill's Smoking and Lung Cancer Study** — The 1950s cohort study of British doctors that definitively linked smoking to lung cancer, despite tobacco industry denial. Introduced the "Bradford Hill criteria" for causation. Use when teaching causal inference (lesson 21) to show how criteria are applied in practice.

3. **Thalidomide Disaster** — A "safe" morning sickness drug caused severe birth defects in 10,000+ babies in the 1950s-60s. Led to modern drug safety regulations and recognition that absence of evidence ≠ evidence of safety. Illustrates the value of case-control studies (rare outcome, quick investigation). Drop in when teaching case-control designs (lesson 7).

4. **The Nurses' Health Study** — Longest-running cohort study (1976-present) with 120,000+ participants, generating thousands of papers on diet, hormones, lifestyle, and disease. Illustrates the power and limitations of observational studies. Mention when teaching cohort studies (lesson 5) or when students ask "why not just do an RCT?"

5. **Vaccine Controversies (MMR-Autism)** — Andrew Wakefield's fraudulent 1998 Lancet paper claimed MMR vaccine caused autism. Retracted, but damage persists. Dozens of high-quality studies found no association. Perfect case study of how bad science spreads, importance of replication, and public health consequences of misinformation. Use when teaching causal inference (lesson 21) or when discussing how to evaluate conflicting studies.

6. **Simpson's Paradox in Berkeley Admissions** — UC Berkeley appeared to discriminate against women in graduate admissions (44% men admitted vs 35% women). But within every department, women had higher or equal admission rates! The paradox arose because women applied to more competitive departments. Stunning example of confounding. Drop in when teaching confounding (lesson 18-19).

7. **Cholera Outbreak in Haiti (2010)** — Genetic sequencing traced cholera strain to UN peacekeepers from Nepal. Combined epidemiologic investigation (descriptive epi, water source mapping) with molecular epidemiology. Shows modern outbreak investigation integrates multiple data sources. Use in infectious disease module (lessons 22-25).

8. **Framingham Heart Study** — The 1948 cohort study that identified risk factors for cardiovascular disease (smoking, hypertension, cholesterol, diabetes). Coined the term "risk factor." Followed 3 generations of participants. Shows how cohort studies establish disease natural history. Mention when teaching cohort design (lesson 5) or attributable risk (lesson 14).

9. **Ignaz Semmelweis and Handwashing (1847)** — Hungarian physician noticed doctors who performed autopsies had higher patient mortality. Implemented handwashing with chlorine, reduced deaths by 90%. Was ridiculed, died in an asylum. Germ theory wasn't accepted for decades. Tragic tale of evidence vs dogma. Use when teaching observational study power (lesson 5) or public health resistance to evidence.

10. **The Typhoid Mary Case (1906)** — Mary Mallon, asymptomatic typhoid carrier, infected 50+ people while working as a cook. Forcibly quarantined. Raises ethical questions: How do you balance individual liberty vs public health? Still relevant for HIV, COVID-19. Drop in during infectious disease module (lessons 22-25) when discussing asymptomatic transmission.

## Difficulty Progression Notes

The curriculum builds in 6 stages:

**Stage 1 (Lessons 1-4): Foundations** — Difficulty 1-2. Gentle introduction to descriptive epidemiology and basic measures. No statistical inference yet, just pattern recognition and counting. Students should feel confident.

**Stage 2 (Lessons 5-10): Study Designs** — Difficulty 2-3. Introduces the core study designs. Conceptually accessible but requires distinguishing temporal sequences (prospective vs retrospective, forward vs backward). Review checkpoint at lesson 6 before deep dive.

**Stage 3 (Lessons 11-15): Measures of Association** — Difficulty 3-4. Relative risk and odds ratio are mathematically simple but conceptually subtle (why OR for case-control?). Confidence intervals require statistical thinking. Review at lesson 13 to consolidate.

**Stage 4 (Lessons 16-21): Bias & Confounding** — Difficulty 4-5. Peak difficulty. Abstract concepts (confounding triangle, counterfactuals) require systems thinking. Selection bias vs information bias vs confounding distinctions are subtle. Causal inference (lesson 21) is the summit. Review at lesson 20 before final push.

**Stage 5 (Lessons 22-25): Infectious Disease Epi** — Difficulty 3-4. Offers a break from abstract confounding concepts. R0 and herd immunity are mathematical but intuitive. Outbreak investigation is concrete and engaging. Contact networks reintroduce complexity.

**Stage 6 (Lessons 26-28): Synthesis** — Difficulty 2-3. Screening brings back sensitivity/specificity from intro stats but applies to epidemiology. Final review (lesson 27) integrates everything. Teach-back (lesson 28) ensures mastery through application.

Early reviews (lessons 6, 13) focus on recall and distinguishing concepts. Later reviews (lessons 20, 27) focus on integration and application.

## Assessment Strategies

### Formative Assessment (during lessons)

1. **Concept checks** — After introducing incidence vs prevalence, ask: "If a disease is highly lethal, is prevalence higher or lower than incidence?" (Lower — people die quickly, reducing prevalent pool.)

2. **Worked examples** — Give a 2x2 table, ask student to calculate RR or OR step-by-step. Check each step (correct cells, correct denominator, correct interpretation).

3. **Case studies** — Present a research abstract, ask: "Is this a cohort or case-control study? How do you know?" Look for key features (sampling frame, temporal direction).

4. **Error analysis** — Show a flawed study design, ask: "What type of bias is present?" Students often learn more from broken examples than perfect ones.

5. **Prediction questions** — "If we increased vaccination coverage from 80% to 90%, would herd immunity threshold change?" Checks understanding of R0 and threshold relationship.

### Summative Assessment (end of modules)

1. **Literature critique** — Provide a published epidemiologic study (cohort or case-control). Ask student to identify: research question, study design, measures of association, potential biases, alternative explanations, and conclusions. This integrates all skills.

2. **Outbreak investigation simulation** — Give outbreak data (epidemic curve, attack rates by exposure). Ask student to: define a case, generate hypotheses, select study design, analyze data, and recommend interventions. Tests application.

3. **Calculation problems** — Provide raw data, ask student to construct 2x2 table, calculate measures (RR, OR, attributable risk), compute confidence intervals, and interpret. Tests quantitative skills.

4. **Concept mapping** — Ask student to draw relationships between: confounding, bias, study design, and causal inference. Tests systems thinking.

5. **Teach-back** — Student explains a concept (e.g., "Why do case-control studies use odds ratios?") in their own words to you or to a hypothetical beginner. Reveals depth of understanding.

### Red Flags (student needs help)

- Confuses prevalence and incidence repeatedly
- Cannot distinguish cohort from case-control after 3+ examples
- Treats all associations as causal
- Calculates measures correctly but cannot interpret them
- Struggles to identify even obvious confounders
- Cannot explain concepts in their own words (only recites definitions)

If these appear, slow down, use more concrete examples, increase worked examples, and delay advanced topics.
