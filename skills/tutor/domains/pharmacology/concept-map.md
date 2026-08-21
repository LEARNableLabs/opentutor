# Pharmacology — Concept Map

## Core Concepts (in learning order)

1. **Drug definition** — substances that alter biological function with therapeutic or toxic effects
2. **Therapeutic index** — ratio of toxic dose to effective dose; safety margin. Depends on: 1
3. **Molecular recognition** — specific binding between drug and biological target. Depends on: 1
4. **Agonists & antagonists** — drugs that activate vs. block receptors. Depends on: 3
5. **Dose-response curves** — relationship between drug concentration and effect. Depends on: 4
6. **EC50 & Emax** — potency and maximum efficacy measures. Depends on: 5
7. **Absorption** — drug entry into bloodstream from administration site
8. **Bioavailability** — fraction of drug reaching systemic circulation. Depends on: 7
9. **First-pass metabolism** — hepatic drug breakdown before systemic circulation. Depends on: 7, 8
10. **Distribution** — drug movement from blood to tissues. Depends on: 8
11. **Volume of distribution** — extent of drug distribution in body. Depends on: 10
12. **Blood-brain barrier** — selective permeability limiting CNS drug access. Depends on: 10
13. **Metabolism** — enzymatic drug transformation, mainly hepatic. Depends on: 9
14. **CYP450 enzymes** — major drug-metabolizing enzyme family. Depends on: 13
15. **Phase I & II reactions** — oxidation/reduction vs. conjugation. Depends on: 13, 14
16. **Prodrugs** — inactive compounds activated by metabolism. Depends on: 13
17. **Excretion** — drug removal from body (renal, biliary)
18. **Half-life** — time for drug concentration to decrease by 50%. Depends on: 17
19. **Clearance** — volume of plasma cleared per unit time. Depends on: 17, 18
20. **Steady-state concentration** — equilibrium between intake and elimination. Depends on: 18, 19
21. **Loading & maintenance doses** — dosing strategies for therapeutic levels. Depends on: 20
22. **ADME integration** — combined pharmacokinetic processes. Depends on: 7-21
23. **Drug targets** — receptors, enzymes, ion channels, transporters. Depends on: 3
24. **Signal transduction** — molecular cascade from receptor activation to cellular response. Depends on: 23
25. **GPCRs** — G-protein coupled receptors; major drug target class. Depends on: 23, 24
26. **Second messengers** — intracellular signaling molecules (cAMP, Ca2+). Depends on: 24, 25
27. **Receptor subtypes** — variations within receptor families conferring selectivity. Depends on: 23
28. **Adrenergic receptors** — α and β subtypes mediating sympathetic effects. Depends on: 27
29. **Tolerance & desensitization** — reduced response with repeated exposure. Depends on: 24
30. **Receptor downregulation** — decreased receptor expression. Depends on: 29
31. **Binding affinity (Kd)** — equilibrium dissociation constant measuring receptor-drug interaction. Depends on: 3, 23
32. **Potency vs. efficacy** — dose needed vs. maximum effect achievable. Depends on: 6, 31
33. **Competitive vs. non-competitive binding** — reversible vs. irreversible antagonism. Depends on: 4, 31
34. **PK/PD integration** — linking drug concentration to pharmacological effect. Depends on: 22, 32
35. **COX inhibition** — mechanism of NSAIDs blocking prostaglandin synthesis. Depends on: 23
36. **Selective toxicity** — targeting pathogens while sparing host. Depends on: 2, 23
37. **Bacterial cell wall synthesis inhibition** — antibiotic mechanism. Depends on: 36
38. **SSRIs** — selective serotonin reuptake inhibitors for depression. Depends on: 23, 27
39. **Neuroplasticity** — neural adaptation underlying delayed antidepressant effects. Depends on: 38
40. **GABA receptors** — inhibitory neurotransmitter receptors; anesthetic targets. Depends on: 23, 27
41. **Cancer cell targeting** — exploiting differences between malignant and normal cells. Depends on: 36
42. **Cytotoxic mechanisms** — cell-killing strategies in chemotherapy. Depends on: 41
43. **Monoclonal antibodies** — engineered proteins targeting specific antigens. Depends on: 23
44. **Biologics vs. small molecules** — large vs. small drug molecular weight classes. Depends on: 43
45. **Pharmacogenomics** — genetic variation affecting drug response. Depends on: 14, 22
46. **CYP450 polymorphisms** — genetic variants altering drug metabolism. Depends on: 14, 45
47. **Personalized medicine** — tailoring therapy to individual genetics. Depends on: 45, 46
48. **Drug-drug interactions** — pharmacokinetic or pharmacodynamic interference. Depends on: 13, 14, 34
49. **Enzyme induction/inhibition** — altered CYP450 activity by co-administered drugs. Depends on: 14, 48
50. **Drug resistance** — decreased drug effectiveness through genetic/adaptive changes. Depends on: 29, 36
51. **Drug discovery pipeline** — stages from target ID to market approval
52. **Clinical trials** — phased human testing for safety and efficacy. Depends on: 51
53. **FDA approval** — regulatory review and authorization. Depends on: 52

## Dependencies

### Foundational Chain
- **Molecular recognition (3)** is the basis for all **drug-target interactions (23)**, which determine **specificity** and **selectivity**
- Understanding **agonists/antagonists (4)** requires knowing **molecular recognition (3)**
- **Dose-response curves (5)** emerge from **agonist/antagonist** activity and lead to quantitative measures like **EC50 (6)**

### Pharmacokinetics Chain
- **Absorption (7) → Bioavailability (8) → Distribution (10) → Metabolism (13) → Excretion (17)** forms the core ADME pathway
- **First-pass metabolism (9)** directly reduces **bioavailability (8)**
- **Half-life (18)** depends on both **metabolism (13)** and **excretion (17)** rates
- **Steady-state (20)** can only be understood after grasping **half-life (18)** and **clearance (19)**
- **Dosing strategies (21)** apply **steady-state** principles

### Pharmacodynamics Chain
- **Drug targets (23)** are the molecular basis for **signal transduction (24)**
- **Receptor subtypes (27)** explain drug **selectivity** and clinical specificity
- **Tolerance (29)** mechanisms include **receptor downregulation (30)** and **desensitization**
- **Binding affinity (31)** determines both **potency (32)** and influences **competitive binding (33)**

### Integration Points
- **PK/PD integration (34)** requires mastery of both **ADME (22)** and **dose-response concepts (32)**
- **Drug-drug interactions (48)** can occur at PK level (via **CYP450 inhibition/induction (49)**) or PD level (additive effects)
- **Pharmacogenomics (45)** primarily affects **CYP450 activity (46)**, altering **ADME (22)**

### Clinical Application Bottlenecks
- **Selective toxicity (36)** is the critical concept for understanding **antibiotics (37)**, **anticancer drugs (41-42)**, and therapeutic index
- **Receptor subtype selectivity (27)** explains why **beta-blockers (28)** affect heart > lungs, why **SSRIs (38)** target serotonin specifically
- **Biologics (43-44)** require understanding both **molecular recognition (3)** and **pharmacokinetics** (different PK than small molecules)

## Prerequisite Topics

- **Basic chemistry** — needed for: molecular recognition (3), drug-receptor binding (31), metabolism reactions (15)
- **Cell biology** — needed for: drug targets (23), signal transduction (24), membrane transport (10, 12)
- **Human physiology** — needed for: organ-specific drug effects, clinical context for all drug classes (35-44)
- **Basic statistics** — needed for: dose-response curves (5), EC50 calculations (6), clinical trial interpretation (52)

## Common Conceptual Bottlenecks

1. **PK/PD separation** — students often confuse "how much drug is there" (PK) with "what is the drug doing" (PD)
2. **Potency vs. efficacy** — conflating these leads to misunderstanding drug comparisons
3. **Steady-state** — takes ~5 half-lives to reach; loading doses bypass this wait
4. **First-pass effect** — explains why oral doses ≠ IV doses for same drug
5. **Competitive antagonism** — surmountable with higher agonist dose vs. non-competitive (insurmountable)
6. **Therapeutic index** — narrow index drugs (digoxin, warfarin) require monitoring; wide index (penicillin) safer
