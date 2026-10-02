# Competitive Rock Climbing: Route Reading and Training Science (Curriculum Plan, Revision 3)

## Source of Truth (fixes Critic Major 1)
The lesson table in this plan is the only canonical lesson list. Regenerate curriculum.json in full from it. Do not patch the existing JSON. The following files are derived from this table: concept-map.md, the extended list in teaching-notes.md, and teacher.md. A field in any other file that disagrees with this table is a bug.

Every lesson reference in every file uses the lesson numbers in this table. The concept map's separate concept-numbering scheme is retired.

## Scope
**In scope:**
- IFSC competition formats and scoring. Boulder and lead are covered in depth; speed is covered only at overview level.
- Competition movement vocabulary.
- Route reading and setter intent, including women's and paraclimbing setting.
- Performance determinants, forearm physiology and critical force (CF).
- Finger health.
- Training design on two tracks: Track A uses a hangboard; Track B uses climbing-based loading for adolescents, people new to structured training, and anyone without hangboard clearance.
- Common injuries and when to refer to a professional.
- Low energy availability, REDs (Relative Energy Deficiency in Sport) and athlete welfare.
- Competition-day performance.

**Out of scope:**
- Speed-climbing technique in detail.
- Outdoor, trad and alpine climbing.
- Rope and belay instruction.
- Medical diagnosis or rehabilitation prescription.
- Nutrition prescription.
- Any body-weight or body-composition targets (hard rule).

**Who it is for:** student_level is intermediate (climbs indoors regularly). The only maths prerequisite is high-school algebra: slope, intercept and averaging.

## Lesson Table (canonical, 38 lessons)
Ext = extended lesson, about 6-8 min instead of 3-5. In the JSON this is the field "extended": true. Reviews are lessons 9, 15, 20, 22 (gate), 27, 34 and 38. They are never more than 7 lessons apart.

| # | Module | Title | Type | d | Ext | Key concepts / build notes |
|---|---|---|---|---|---|---|
| 1 | M1 Competition Landscape | What actually decides a climbing competition? | mini-lesson | 2 | | Boulder, lead and speed disciplines; Olympic and World Cup structure. Check the current season format before delivery. |
| 2 | M1 | How is a boulder round scored, and why did the rules change? | question | 2 | | Tops, zones and attempts; the current IFSC points-based scoring. Sources are the IFSC rulebook and official explainers ONLY. Do NOT use Giles, Mermier or Saul here (avoids overlap with lesson 16). |
| 3 | M1 | Watch a final: what is the setter asking? | resource-drop | 2 | | First guided viewing. IFSC-CLIP-SLOT. Introduces the footage rubric. |
| 4 | M1 | Lead and speed: heights, plus scores, isolation, observation | real-world | 2 | | Lead scoring; isolation and observation period; speed overview only. |
| 5 | M2 Movement Vocabulary | Crimp, sloper, pinch, pocket, volume: what each hold demands | mini-lesson | 2 | | Hold types and grip positions. A Wikipedia glossary is linked as a supplementary resource only. |
| 6 | M2 | Feet first: heel hooks, toe hooks, drop knees, flags | question | 2 | | Footwork and body positioning. Wikipedia glossary as a supplementary resource only. |
| 7 | M2 | Why do comp boulders make you jump? | real-world | 3 | | Dynos, coordination moves, run-and-jump, paddle. |
| 8 | M2 | Where is your centre of mass, and why does it matter? | mini-lesson | 3 | | Centre of mass, force direction on holds, static vs dynamic movement. |
| 9 | M2 | Teach it back: name and explain every move in one clip | review | 2 | | Spaced review of lessons 5-8. IFSC-CLIP-SLOT. |
| 10 | M3 Route Reading | How do elite climbers read a route before touching it? | mini-lesson | 3 | | Expertise in route preview, chunking, visual inspection research. |
| 11 | M3 | Route preview: sequence, rests, clips | real-world | 3 | | Sequence planning, rest identification, clip positions. |
| 12 | M3 | Read this boulder before anyone climbs it | question | 3 | | Prediction task with IFSC-CLIP-SLOT. The student writes predictions that are SAVED as the lesson 12 answer key for reuse in lesson 20. |
| 13 | M3 | Pacing under the clock: on-sight lead and boulder rotations | mini-lesson | 4 | yes | Lead pacing, boulder rotation time management, attempt economy. The resource is the on-sight lead physiological-responses paper. Check whether it supports the pacing claims; label any unsupported claim 'practitioner knowledge'. IFSC-CLIP-SLOT. |
| 14 | M3 | Setter intent: what is this problem testing, and how do women's and paraclimbing setting differ? | real-world | 4 | yes | Setter intent; style categories (power, coordination, balance); women's setting; paraclimbing categories and adapted setting. IFSC-CLIP-SLOT plus a Wikipedia glossary (supplementary). |
| 15 | M3 | Pause and predict: a full round | review | 3 | yes | Pause-and-predict review of lessons 10-14 using IFSC-CLIP-SLOT. |
| 16 | M4 Physiology of Performance | What actually predicts climbing performance? | mini-lesson | 3 | | Determinants reviews: Giles 2006, Mermier 2000, Saul 2019. Misconception 4 (single-factor explanations of performance) is taught HERE and nowhere else. |
| 17 | M4 | Why does your forearm pump? | mini-lesson | 4 | yes | Intermittent contractions, blood-flow occlusion, forearm oxygenation, recovery on rests. |
| 18 | M4 | Critical force: the line between sustainable and not | mini-lesson | 4 | yes | Intro to the CF model F = CF + W'/t (equivalently F·t = CF·t + W'). Includes a WORKED EXAMPLE, see the Maths section. |
| 19 | M4 | Fit your own critical-force line | question | 5 | yes | The concepts field must state the formula F = CF + W'/t and the linear form impulse = CF·t + W'. Find the slope (CF) and intercept (W') from 3 data points by hand. The data set is pre-filled; collecting the student's own data is optional and must not use maximal hangs. |
| 20 | M4 | Re-read lesson 12 with a physiologist's eyes | review | 3 | | REUSES the lesson 12 clip (same IFSC-CLIP-SLOT ID listed in resources) and the student's saved lesson 12 answer key. The student marks where pump, rests and CF limits change their original read. |
| 21 | M4 | Fingers aren't muscles: tendons, pulleys and slow adaptation | mini-lesson | 4 | yes | Pulley anatomy, tendon adaptation timescales vs muscle, adolescent growth plates. |
| 22 | M4 | Gate: can you explain the risk before you load it? | teach-back | 3 | | Safety gate. Must be passed before lesson 23. A fail routes the student to Track B. |
| 23 | M5 Training Design | Hangboard protocols: what the evidence says (Track A) | resource-drop | 4 | yes | Max hangs vs repeaters, edge depth, protocol comparison studies. Track A only. |
| 24 | M5 | Limit bouldering, rate of force development and the campus board | mini-lesson | 4 | yes | Max strength vs rate of force development (RFD). Campus board restricted to experienced adults. |
| 25 | M5 | Endurance and pump tolerance: ARC, intervals, 4x4s | real-world | 3 | | Aerobic base, interval design, links back to CF (lessons 18-19). |
| 26 | M5 | Track B: loading fingers through climbing alone | mini-lesson | 3 | | Climbing-based progression. Label 'no direct evidence' wherever there is no direct study, and cite a source wherever one is found. |
| 27 | M5 | Review: strength, endurance and the two tracks | review | 3 | | Spaced review of lessons 16-26. |
| 28 | M5 | Antagonists and shoulders: the strength nobody sees on the wall | question | 3 | yes | Antagonist and shoulder strength, posture, injury-prevention rationale. |
| 29 | M5 | Periodisation: peaking for a competition season | mini-lesson | 4 | yes | Training blocks, tapering, aligning the training calendar with the competition calendar. |
| 30 | M5 | Monitoring load and recovery | real-world | 4 | yes | Session RPE (rating of perceived exertion), training logs, sleep, warning signs. |
| 31 | M5 | Design a 6-week block for a target competition | teach-back | 5 | yes | Synthesis of determinants (16), CF (18-19), setter intent (14) and the student's track (Track A or B, 22-26). |
| 32 | M6 Injury, Health and Welfare | The climbing injury map: pulleys, growth plates, shoulders | mini-lesson | 3 | | Injury epidemiology. Includes adolescent and women-specific data where it exists. |
| 33 | M6 | Returning to climbing, and when to see a professional | real-world | 3 | | Return-to-climbing principles and referral thresholds. No rehab prescription. |
| 34 | M6 | Review: load, injury and recovery | review | 2 | | Spaced review of lessons 21-33. |
| 35 | M6 | Energy availability and REDs: why this course sets no weight targets | mini-lesson | 4 | | Low energy availability, REDs, sex-specific considerations. The concepts text MUST pair the REDs sources (IOC 2023 consensus, IFSC health policy) with the explicit no-weight-targets rule. |
| 36 | M7 Competition Performance | Competition day: warm-up, isolation and nerves | real-world | 3 | | CASE STUDY of one documented elite athlete's competition-day routine, from a verified interview or footage. The student annotates the routine. |
| 37 | M7 | After the fall: attempt strategy and resetting | question | 3 | | CASE EXERCISE: a scored boulder-round scenario (time left, attempts, current points). The student chooses an attempt strategy and justifies it. |
| 38 | M7 | Capstone: read a full final and prescribe training | review | 5 | yes | IFSC-CLIP-SLOT. The student reads the round with the footage rubric, then writes a training block for an athlete based on it. |

## Fixes from Critique (checklist for the builder)
1. **Plan vs JSON mismatch:** the table above is canonical, and the JSON is regenerated from it.
   - Setter intent and women's/paraclimbing setting are restored as lesson 14.
   - Boulder rotation content moves into lesson 13.
   - Lesson 18 = mini-lesson, lesson 19 = question, lesson 23 = resource-drop.
   - Lesson 17 = d4, extended.
   - Lesson 24 = limit bouldering/RFD/campus, lesson 25 = endurance (pump, ARC), lesson 26 = Track B, lesson 28 = antagonists.
2. **Concept map:** relabel every dependency using lesson numbers (see Dependencies below), and add setter intent (lesson 14).
3. **Extended field:** add "extended": true to the JSON. Extended lessons are 13, 14, 15, 17, 18, 19, 21, 23, 24, 28, 29, 30, 31 and 38. teaching-notes.md must list exactly these.
4. **Lesson 19 difficulty spike:** lesson 18 carries a worked numeric example, and lesson 19 states the formula in its concepts field. Lesson 19 uses pre-filled data, so the d5 rating reflects reasoning, not new maths.
5. **Lesson 20 reuse:** lesson 20's resources list the same clip-slot ID as lesson 12, and its concepts include 'compare against the saved lesson 12 answer key'.
6. **Minor items:**
   - Saul 2019 is added to resources.md.
   - Lesson 2 drops the determinants reviews.
   - Misconception 4 is taught only in lesson 16.
   - Clip slots go in the JSON for lessons 3, 9, 12, 13, 14, 15, 20 and 38.
   - Wikipedia stays supplementary for lessons 5, 6 and 14.
   - Lesson 13 gets an evidence check on its source.
   - Lesson 26 gets 'no direct evidence' labels.
   - The lesson 35 concepts text carries the no-weight-targets rule.
   - Lessons 36 and 37 get a case study and a case exercise.

## Dependencies (lesson-numbered, for concept-map.md)
- Hold types (5) and footwork (6) come before the move-naming review (9) and route preview (11).
- Centre of mass (8) comes before setter intent (14), because style categories are defined by body-position demands.
- Rest identification (11) does NOT require CF (18). Lesson 20 later adds a physiological reason to the rest choices made in lesson 11.
- Pacing (13) requires route preview (11). It uses pump (17) only qualitatively, as a forward reference.
- Setter intent (14) requires hold types (5), movement (6-8) and preview (10-12).
- CF (18) requires pump physiology (17). Fitting the CF line (19) requires the CF model (18).
- The lesson 20 review requires lessons 12, 17 and 18.
- Hangboarding (23) and campus-board training (24) require finger anatomy (21) AND a pass at the gate (22).
- Endurance training (25) requires CF (18-19).
- Plan design (31) requires determinants (16), CF (18-19), setter intent (14), the student's track (22-26) and periodisation (29).
- Injury (32) builds on finger anatomy (21). REDs (35) stands alone but is referenced by load monitoring (30).

## Maths (high-school algebra only)
Lessons 18 and 19 are the only quantitative lessons.

**Lesson 18 worked example** (simplified teaching numbers, NOT normative data):
- The data: 40 kg is held for 30 s, 30 kg for 90 s and 27 kg for 225 s.
- Impulse (load × time) for each: 1200, 2700 and 6075 kg·s.
- The slope between the first two points is (2700 − 1200) / (90 − 30) = 25. So CF = 25 kg.
- The intercept is W' = 1200 − 25 × 30 = 450 kg·s.
- Check with the third point: 25 × 225 + 450 = 6075. It fits.

The lesson states plainly that real CF tests use intermittent contractions (e.g. 7 s on, 3 s off) with all-out efforts.

**Lesson 19:** the same method on a new pre-filled data set. The student answers 'what does CF tell you about where to rest on a route?' This links forward to lesson 20.

## Pedagogical Decisions
- **Intuition and footage first, then formalism.** Each concept is shown on a real comp clip before it gets a mechanism. Physiology comes after route reading, so the student has a reason to care about it.
- **Evidence labels** on every training and injury claim: strong / moderate / practitioner knowledge / no direct evidence.
- **Safety guardrails:**
  - The lesson 22 gate comes before any finger-loading prescription.
  - Track B is the default for adolescents or anyone without clearance.
  - Nothing replaces a medical professional.
- **No weight targets, ever.** Weight and body composition are discussed only as welfare and REDs risk, never as a performance lever.
- **Inclusive coverage:** women-specific data appears in lessons 14, 32 and 35, paraclimbing in lesson 14, and adolescents in lessons 21, 22, 26 and 32.

## Resource Strategy
- **research.md is not usable.** Its API results are off-topic: Lake et al. on machine learning, heritage regimes, tourism climate, service robots. Do NOT cite any of them. All domain sources come from the verification protocol below.
- **Verification protocol:**
  - Every citation must be confirmed via DOI or publisher page before delivery.
  - A Google Scholar search link is an acceptable fallback, but each lesson needs at least one non-search resource where one exists.
  - Unverifiable claims get downgraded to 'practitioner knowledge'.
- **Core literature** (verify each one):
  - Giles et al. 2006, The physiology of rock climbing (Sports Medicine).
  - Mermier et al. 2000, determinants of sport-climbing performance (British Journal of Sports Medicine).
  - Saul et al. 2019, Determinants for success in climbing: a systematic review (Journal of Exercise Science & Fitness). Newly added to resources.md.
  - CF all-out test papers (Giles and colleagues).
  - Hangboard protocol comparisons (López-Rivera and colleagues).
  - Schöffl and colleagues on pulley and growth-plate injuries.
  - IOC 2023 REDs consensus (Mountjoy et al.).
  - IFSC rules and medical/health policies.
- **IFSC-CLIP-SLOT placeholders:** each goes into the JSON resources as 'IFSC-CLIP-SLOT-<lesson>: <description> — verify on official IFSC channel before delivery'. Slots are needed for lessons 3, 9, 12, 13, 14, 15 and 38. Lesson 20 reuses SLOT-12.
- **Resource mix:** each module needs at least one video or interactive item, not only papers.
- **Known Gaps** (copy into resources.md AND teacher.md):
  - Few RCTs (randomised controlled trials) on climbing-only finger loading (affects lesson 26).
  - Limited women-specific and adolescent training data.
  - Paraclimbing performance research is sparse.
  - Pacing evidence is mostly observational or practitioner knowledge (affects lesson 13).
  - Competition rules change seasonally.

## Exercise Strategy
- **Format:** mixed. Multiple choice for vocabulary and scoring (lessons 2, 5, 6); free text for reading, physiology reasoning and plan design.
- **Footage rubric** (copy into teacher.md):
  - Predictions are written BEFORE viewing.
  - Each prediction is scored 0-2 on four criteria: crux identification, sequence/beta, rest and shake positions, and the setter-intent hypothesis.
  - The student then compares the score against the actual climb.
  - Used in lessons 3, 9, 12, 15, 20 and 38.
- **Other exercise types:**
  - Quantitative: lessons 18 and 19.
  - Teach-back: the gate (22) and plan design (31).
  - Case studies: lessons 36 and 37.
  - Capstone: lesson 38.

## teacher.md Requirements
Copy word for word: the evidence labels, the safety guardrails, the no-weight-targets rule, the footage rubric, and the Known Gaps list.

Also add a 'Recheck rules each season' note: before delivering lessons 1, 2, 4, 13 and 37, confirm the current IFSC rulebook (scoring, round timings, Olympic programme), because these change between seasons.

## Pacing
- 38 lessons across 7 modules.
- The difficulty curve is gentle across lessons 1-12 (d2-3), rises in lessons 13-14 (d4), peaks at lesson 19 (d5), and is followed by consolidation (20, 22).
- Lessons 23-31 run at a sustained d4 and end at d5 (31). Lessons 32-37 ease back to d3-4, and the course ends on the capstone (38, d5).
- 14 lessons are extended.
- At one lesson per weekday, the course takes about 8 weeks.