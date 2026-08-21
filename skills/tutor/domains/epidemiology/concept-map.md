# Epidemiology — Concept Map

## Core Concepts (in learning order)

1. **Descriptive Epidemiology** — Characterizing disease patterns by person, place, and time without causal claims
2. **Prevalence** — Proportion of population with disease at a specific time (snapshot)
3. **Incidence** — Proportion of population developing new disease over time (movie). Depends on: understanding of time and counting
4. **Incidence Rate** — Disease occurrence per unit of person-time. Depends on: Incidence, understanding of denominators
5. **Epidemic Curves** — Visual representation of outbreak progression over time. Depends on: Descriptive epidemiology, time patterns
6. **Cohort Studies** — Follow exposed/unexposed groups forward in time to observe disease development
7. **Case-Control Studies** — Compare diseased/non-diseased groups backward in time for exposure differences
8. **Randomized Controlled Trials (RCTs)** — Experimental design with random assignment to exposure/treatment
9. **Cross-Sectional Studies** — Simultaneous measurement of exposure and disease (no temporal sequence)
10. **Relative Risk (RR)** — Ratio of disease risk in exposed vs unexposed. Depends on: Cohort studies, basic probability
11. **Odds Ratio (OR)** — Ratio of odds of exposure in cases vs controls. Depends on: Case-control studies, understanding of odds vs probability
12. **Attributable Risk** — Excess disease burden due to exposure. Depends on: Relative risk, public health perspective
13. **Confidence Intervals** — Range of plausible values for a measure of association. Depends on: Statistical inference, sampling variability
14. **Selection Bias** — Systematic error from how participants are selected or retained. Depends on: Study design fundamentals
15. **Information Bias** — Systematic error from how variables are measured or classified. Depends on: Measurement concepts
16. **Confounding** — Distortion of exposure-disease association by a third variable. Depends on: Understanding of causation, association vs causation
17. **Stratification** — Analyzing associations within subgroups to control confounding. Depends on: Confounding, subgroup analysis
18. **Causal Inference** — Frameworks for determining if associations are causal. Depends on: All bias and confounding concepts
19. **Basic Reproduction Number (R0)** — Average number of secondary infections from one case in susceptible population. Depends on: Transmission concepts
20. **Herd Immunity** — Indirect protection when sufficient population is immune. Depends on: R0, transmission dynamics
21. **Outbreak Investigation** — Systematic process of identifying source and controlling disease spread. Depends on: Descriptive epidemiology, study designs
22. **Contact Networks** — Structure of who interacts with whom affecting transmission. Depends on: R0, transmission heterogeneity
23. **Screening** — Testing asymptomatic populations for early disease detection
24. **Sensitivity** — Proportion of true positives correctly identified. Depends on: 2x2 tables, diagnostic testing
25. **Specificity** — Proportion of true negatives correctly identified. Depends on: 2x2 tables, diagnostic testing
26. **Predictive Values** — Probability of disease given test result. Depends on: Sensitivity, specificity, prevalence (Bayes' theorem)

## Dependencies

- **Incidence vs Prevalence** — Incidence measures new disease; prevalence captures existing disease. Students must understand that prevalence = incidence × duration, and chronic diseases have high prevalence relative to incidence while acute diseases have similar prevalence and incidence.

- **Study Design determines Measure** — Cohort studies allow calculation of relative risk because you follow people forward and observe who develops disease. Case-control studies require odds ratios because you sample based on disease status and look backward at exposure. This is the most critical dependency in epidemiology.

- **Confounding requires Causation** — Students cannot understand confounding without first grasping the difference between association and causation. A confounder must be: (1) associated with exposure, (2) an independent risk factor for disease, (3) not on the causal pathway.

- **Bias threatens Validity** — Selection bias affects who enters/remains in study (external/internal validity). Information bias affects how accurately variables are measured. Students must see these as distinct threats before learning how to control them.

- **Causal Inference builds on Everything** — Hill's criteria, counterfactual thinking, and directed acyclic graphs (DAGs) synthesize all prior concepts. Cannot attempt causal inference without solid grounding in study designs, measures of association, bias, and confounding.

- **R0 determines Epidemic Threshold** — Herd immunity threshold = 1 - (1/R0). If R0 = 2, need 50% immune. If R0 = 10 (measles), need 90% immune. This mathematical relationship is fundamental to vaccination policy.

- **Screening depends on Disease Prevalence** — Positive predictive value = (sensitivity × prevalence) / [(sensitivity × prevalence) + (1 - specificity) × (1 - prevalence)]. Low prevalence dramatically reduces PPV even with high sensitivity/specificity. This is why we don't screen for rare diseases.

## Bottleneck Concepts

These concepts, if not mastered, will block progress on everything downstream:

1. **Incidence vs Prevalence** — If students confuse these, they cannot understand study designs, measures of association, or screening test interpretation.

2. **Association vs Causation** — Critical for understanding confounding, bias, and causal inference. Many students believe correlation implies causation and must unlearn this.

3. **Odds Ratio vs Relative Risk** — Students struggle with when to use OR vs RR and under what conditions OR approximates RR (rare disease assumption). Without this, cannot interpret case-control studies.

4. **Confounding Triangle** — The three-way relationship (exposure ← confounder → disease) is abstract. Students often mistake mediators or effect modifiers for confounders.

5. **Person-Time** — Essential for incidence rates but conceptually difficult. Students struggle with why denominators change when people leave the study or develop disease.

## Mind-Blowing Moments

- **Simpson's Paradox** — An association can reverse direction when you stratify by a confounder. The pooled data shows exposure is protective, but within every subgroup it's harmful (or vice versa). Shatters naive interpretation of associations.

- **Screening Paradox** — Screening can make survival appear better without actually reducing mortality (lead-time bias, length-time bias). You "detect" disease earlier but don't change death date, creating illusion of benefit.

- **Herd Immunity Math** — Vaccinating 95% of a population protects the unvaccinated 5% more than vaccinating 80% protects the vaccinated 80%. Network effects dominate individual effects.

- **Rare Disease Assumption** — In case-control studies, the odds ratio approximates the relative risk when disease is rare (<10%). This non-obvious mathematical fact justifies the entire case-control methodology.

- **Ecological Fallacy** — Associations at the population level can be opposite of individual-level associations. Countries with higher chocolate consumption have more Nobel laureates, but eating chocolate doesn't make you smarter.

## Common Misconceptions

1. **Prevalence = Severity** — Students think high prevalence means serious disease. Actually, prevalence = incidence × duration, so chronic non-lethal diseases (common cold survivors, diabetes) have higher prevalence than deadly acute diseases (Ebola).

2. **Case-Control = Retrospective Cohort** — Students confuse retrospective cohort (follow exposed/unexposed backward in time) with case-control (sample on disease status). Key difference: sampling frame.

3. **Relative Risk > 1 means Large Effect** — RR = 1.5 sounds modest, but if baseline risk is 40%, it increases to 60% (huge). If baseline is 0.001%, it increases to 0.0015% (negligible). Absolute risk matters.

4. **Statistical Significance = Importance** — p < 0.05 doesn't mean clinically meaningful. With large sample, tiny meaningless effects are "significant." With small sample, large effects may not be "significant."

5. **Confounding = Correlation** — Students think any variable correlated with exposure and disease is a confounder. Must not be on causal pathway (mediators) or effect modifiers.

6. **R0 is Fixed** — Students treat R0 as a property of the pathogen. Actually, R0 depends on population density, behavior, environment. COVID-19 R0 was ~2.5 initially but varied widely by setting.

7. **High Sensitivity = Good Test** — Students want both sensitivity and specificity to be 100%. There's always a tradeoff (ROC curve). Screening tests prioritize sensitivity; confirmatory tests prioritize specificity.

## Prerequisite Topics

- **Probability and Statistics** — Understanding of probability, conditional probability, Bayes' theorem needed for predictive values, sensitivity/specificity
- **Hypothesis Testing** — p-values, confidence intervals, type I/II errors needed for interpreting associations
- **Basic Biology** — Disease mechanisms, infectious vs chronic disease, immune system for understanding epidemiological patterns
- **Scientific Method** — Observation, hypothesis, testing, controls needed to understand study designs and causal inference

## Downstream Topics

After mastering epidemiology, students are prepared for:

- **Biostatistics** — Regression modeling, survival analysis, longitudinal data analysis
- **Public Health Policy** — Evidence-based interventions, health disparities, program evaluation
- **Clinical Research** — Clinical trials design, diagnostic test evaluation, systematic reviews
- **Environmental Health** — Exposure assessment, dose-response modeling, risk assessment
- **Infectious Disease Modeling** — Compartmental models (SIR/SEIR), stochastic transmission, phylodynamics
- **Causal Inference** — Directed acyclic graphs (DAGs), instrumental variables, propensity scores, difference-in-differences
