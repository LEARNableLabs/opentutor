# Oncology — Teaching Notes

## Approach

Oncology sits at the intersection of molecular biology, clinical medicine, and evolutionary theory. At the **intermediate level**, the goal is to build mechanistic understanding rather than memorizing facts. Use the **"hallmarks of cancer"** framework (Hanahan & Weinberg) as the organizing scaffold — it provides a conceptual map that students can hang details on.

**Key pedagogical principles:**
1. **Mechanisms over facts** — Always explain WHY (e.g., "why do tumor suppressors require two hits?" not just "they require two hits")
2. **Clinical grounding** — Connect every concept to treatment implications. Students engage more when they see real-world relevance
3. **Evolutionary thinking** — Frame cancer as an evolving population, not a static disease. This is crucial for understanding resistance
4. **Data literacy** — Use real cancer genomics databases (COSMIC, cBioPortal) to make abstract concepts concrete
5. **Visual emphasis** — Cancer biology is inherently spatial (metastasis, angiogenesis). Use diagrams liberally

## Common Misconceptions

### 1. "Cancer is caused by a single gene mutation"
**Why students think this:** Pop-culture (e.g., "the cancer gene") and simplified news coverage oversell single-gene stories like BRCA.

**How to correct:** Emphasize multistep carcinogenesis from lesson 3 onward. Show real tumor mutation data from COSMIC — most solid tumors have 50+ mutations. Distinguish driver (4-7) from passenger mutations. Use colorectal cancer as a clear example (APC → KRAS → TP53 sequence).

### 2. "Tumors are homogeneous — all cells are the same"
**Why students think this:** Textbooks often show simplified diagrams with uniform tumor masses. Lack of exposure to single-cell sequencing data.

**How to correct:** Introduce heterogeneity early (lesson 5 when showing COSMIC data) and return to it in lesson 20. Show branching phylogenetic trees of tumor evolution. Explain how heterogeneity → resistance by providing a pool of variants under selection.

### 3. "Chemotherapy is just poison with no selectivity"
**Why students think this:** Oversimplified explanations + focus on side effects in patient education.

**How to correct:** Explain therapeutic index in lesson 12. Show that chemo exploits faster division rates in cancer cells. Compare to antibiotics (selective toxicity). Acknowledge imperfect selectivity but frame as targeting a real difference, not indiscriminate killing.

### 4. "Targeted therapy will cure cancer"
**Why students think this:** Hype around precision medicine + dramatic early responses to drugs like Gleevec.

**How to correct:** Emphasize in lesson 15 that "targeted" means mechanism-specific, not magic bullet. Introduce resistance upfront — show Gleevec resistance curves in CML. Frame targeted therapy as "buying time" and combination approaches as the future.

### 5. "Immunotherapy boosts the immune system to fight cancer"
**Why students think this:** Loose language in popular media ("supercharge your immune system").

**How to correct:** Use precise mechanism in lesson 16. Checkpoint inhibitors don't boost — they remove brakes (PD-1/PD-L1 blockade). CAR-T doesn't boost — it redirects specificity. Avoid vague terms like "strengthen" or "enhance." Show actual binding diagrams of PD-1 and CTLA-4 interactions.

### 6. "Metastasis happens when the tumor gets big enough to 'spread'"
**Why students think this:** Intuitive but wrong mechanistic model. Lack of understanding of EMT and the metastatic cascade.

**How to correct:** Teach metastasis as a selective, multi-step process (lesson 9). Emphasize that dissemination happens early but most cells fail to colonize. Use Stephen Paget's "seed and soil" metaphor. Show data on dormancy — metastatic cells can hide for years.

### 7. "Drug resistance means the drug stops binding"
**Why students think this:** Overgeneralization from antibiotic resistance mechanisms.

**How to correct:** Show the diversity of resistance mechanisms in lesson 19: target mutation (yes, binding), bypass pathways (new route), drug efflux, apoptosis evasion. Emphasize that resistance is often NOT about drug-target binding but about rewiring survival pathways.

### 8. "Cancer cells grow faster than normal cells"
**Why students think this:** Logical inference from "uncontrolled growth."

**How to correct:** Show that many cancers divide SLOWER than normal gut/skin cells. The problem is NOT speed but FAILURE TO STOP. Cancer cells ignore stop signals (loss of contact inhibition, ignore senescence). Frame cancer as "immortal" not "fast."

### 9. "Radiation kills cells instantly on contact"
**Why students think this:** Dramatic depictions in media.

**How to correct:** Teach in lesson 14 that radiation causes DNA damage, but cells die later when they attempt mitosis with damaged chromosomes. Explain fractionation — multiple small doses allow normal tissue repair between sessions. Show that radioresistance is partly due to slow-growing tumors (they don't divide often).

### 10. "We can't cure cancer because it's too complex"
**Why students think this:** Defeatist framing in news + awareness of treatment failures.

**How to correct:** Reframe complexity as solvable through combination approaches. Show curative examples: pediatric ALL (90% cure rate), Hodgkin lymphoma, testicular cancer, early-stage melanoma with checkpoint inhibitors. Emphasize that "cancer" is 200+ diseases — some are very treatable. Avoid both false hope AND nihilism.

## Level Adjustments

### For intermediate students (this curriculum)
- **Include:** Molecular mechanisms (e.g., RAS/RAF/MEK pathway for targeted therapy), real genomic data, basic clinical trial logic
- **Skip:** Deep protein structural biology, advanced pharmacokinetics, statistical trial design math
- **Depth of formalism:** Show pathways and gene names but don't require memorizing all components. Focus on logic flow

### If students are stronger (advanced)
- Add lessons on specific cancer types (NSCLC, breast, melanoma) with genetic subtypes
- Include pharmacodynamics and drug dosing
- Add lessons on cancer metabolism (Warburg effect, glutamine addiction)
- Introduce computational approaches to biomarker discovery
- Go deeper on single-cell sequencing and spatial transcriptomics

### If students are weaker (beginner)
- Add a "cell biology refresher" lesson before lesson 1
- Split lesson 3 (multistep carcinogenesis) into two parts
- Add more guided practice with databases (lesson 5)
- Simplify immunotherapy to just checkpoint inhibitors (skip CAR-T)
- Remove lesson 22 (adaptive therapy) — requires strong evolutionary thinking

## Rabbit Holes (fascinating connections to drop in)

### Cancer and Evolution
**When:** Lesson 19-22 (resistance and recurrence)  
**What:** Frame cancer as a within-body evolutionary process. Introduce Pepper et al.'s work on adaptive therapy for prostate cancer — dosing to maintain competition, not eradication. Blow students' minds with the idea that "curing cancer might mean never trying to cure it."

### Peto's Paradox
**When:** Lesson 1 or 2 (cancer basics)  
**What:** If cancer is just random mutation accumulation, why don't whales get cancer at 1000× human rates? (More cells × longer life = more mutations.) Answer: evolved tumor suppression mechanisms like TP53 duplications in elephants. Great hook for evolutionary medicine.

### Cancer in the Wild
**When:** Lesson 7 (hallmarks)  
**What:** Transmissible cancers exist: Tasmanian devil facial tumor disease, canine transmissible venereal tumor. These are contagious cancer CELLS, not viruses. Shows cancer can escape individual hosts in rare cases.

### The Warburg Effect
**When:** Lesson 8 or 9 (tumor microenvironment)  
**What:** Cancer cells use inefficient glycolysis even with oxygen present. Why? Supports rapid biosynthesis for division. Connects to FDG-PET imaging (detects glucose uptake). Opens door to metabolic therapy concepts.

### Why Cancer Rates Rise with Age
**When:** Lesson 5 (multistep carcinogenesis)  
**What:** Not just mutation accumulation — also declining immune surveillance, tissue damage, stem cell exhaustion. Connects to emerging interest in senolytics and "anti-aging" cancer prevention.

### Gleevec / Imatinib Success Story
**When:** Lesson 15 (targeted therapy)  
**What:** CML was a death sentence, now patients live normal lifespans. First proof that targeted therapy works. BUT: show resistance emergence curves to set up lesson 19. Complete success story undermined by evolution.

### Cancer Vaccines — Why So Hard?
**When:** Lesson 16 (immunotherapy)  
**What:** Cancer cells are SELF, not foreign. Vaccines work for infections (foreign antigens) but cancer antigens are mostly self-proteins. Explain why therapeutic vaccines mostly fail while checkpoint inhibitors succeed (different mechanisms).

### Liquid Biopsies as Cancer's "Check Engine Light"
**When:** Lesson 21 (minimal residual disease)  
**What:** ctDNA detection sensitivity is now down to parts-per-million. Can predict relapse months before scans show anything. Future: real-time monitoring of resistance mutations to switch drugs preemptively.

### Oligometastatic Disease
**When:** Lesson 9 (metastasis)  
**What:** Patients with 1-5 metastases (not widespread) can sometimes be cured with aggressive local therapy (surgery + radiation). Challenges dogma that "metastatic = incurable."

### Cancer in Space
**When:** Lesson 16 (radiation therapy or immune evasion)  
**What:** Cosmic radiation increases cancer risk for astronauts. DNA damage rates in deep space are huge. Connects to radiation biology and challenges of long-duration spaceflight.

## Difficulty Progression

### Phase 1: Foundation (Lessons 1-6)
**Difficulty:** 2-3 average  
**Why:** Building core vocabulary and mental models. Concepts are challenging but no prior knowledge assumed. Lesson 3 (multistep carcinogenesis) and 5 (genomic data) are difficulty peaks here.

### Phase 2: Tumor Biology (Lessons 7-11)
**Difficulty:** 2-3 average  
**Why:** Hallmarks framework (lesson 7) provides scaffolding. Lessons build naturally on each other. Teach-back (lesson 11) is difficulty 2 — consolidation, not new concepts.

### Phase 3: Treatment (Lessons 12-18)
**Difficulty:** 3 average with peak at 4 (lesson 16)  
**Why:** More concepts to integrate. Immunotherapy (lesson 16) is hardest — requires synthesizing immune evasion + clinical applications. Resource-drop (lesson 18) is difficulty 3 because interpreting NCCN guidelines requires clinical thinking.

### Phase 4: Resistance (Lessons 19-22)
**Difficulty:** 4 average — **HARDEST SECTION**  
**Why:** Requires evolutionary thinking + deep understanding of all prior concepts. Clonal evolution (lesson 21) and adaptive therapy (lesson 22) are both difficulty 4. This is where students "level up" from knowledge to insight.

### Phase 5: Clinical Integration (Lessons 23-26)
**Difficulty:** 2-3 average  
**Why:** Stepping back from molecular details to clinical application. Easier cognitively but requires synthesis. Teach-back (lesson 26) is difficulty 3 — applying everything to a real case.

### Review Lessons (6, 13, 20)
**Difficulty:** 1-2  
**Why:** Designed as consolidation points, not new learning. Spaced ~7 lessons apart to maximize retention via testing effect.

## Pacing Recommendations

- **Typical pace:** 26 lessons = 5-6 weeks at 5 lessons/week
- **Fast track:** 3.5-4 weeks (combine review lessons with adjacent lessons if student is breezing through)
- **Slow track:** 6-8 weeks (split difficult lessons like 3, 16, 19, 22 into two sessions)

**Key checkpoints:**
- After lesson 6 review: student should fluently explain oncogenes vs tumor suppressors
- After lesson 13 review: student should connect hallmarks to treatment strategies
- After lesson 20 review: student should grasp why resistance is inevitable without prompting

## Assessment Opportunities

- **Lesson 5:** Have student explore COSMIC for a specific cancer (e.g., lung adenocarcinoma) and identify most common driver mutations
- **Lesson 11:** Teach-back to a non-scientist — tests if student can simplify without losing accuracy
- **Lesson 18:** Compare two NCCN treatment algorithms for different cancer stages — tests clinical reasoning
- **Lesson 26:** Final case integration — give a patient profile and have student design treatment rationale

## Common Student Questions (and how to answer)

**"Why don't we just kill all cancer cells?"**  
→ Therapeutic index (lesson 12). At doses that kill all cancer, you'd kill the patient. Cancer cells are YOUR cells with mutations — hard to target without collateral damage.

**"If immunotherapy works so well, why isn't it used for everything?"**  
→ Only 20-40% respond in most cancers. We don't fully understand why. "Cold" tumors (no immune infiltration) don't respond. Active research area.

**"Can cancer be prevented?"**  
→ Some cancers yes (HPV vaccine → cervical cancer, smoking cessation → lung cancer). Most? No single intervention. Focus on early detection where prevention isn't possible.

**"What's the difference between benign and malignant?"**  
→ Benign tumors don't invade or metastasize. Malignant tumors do. Key difference is acquisition of invasion/metastasis hallmarks (lesson 7-9).

**"Will we cure cancer in my lifetime?"**  
→ Reframe: we're already curing SOME cancers. Others we're turning into chronic diseases (CML with Gleevec). "Cancer" is 200+ diseases — some will be cured, others managed. Combination immunotherapy + targeted therapy shows promise for solid tumors that were death sentences a decade ago.
