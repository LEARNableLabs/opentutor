## Overall
Revision 2 resolves most round-1 issues: scoped Mayr, 56 single-concept lessons, explicit notation and deterministic checks, six gates with remediation, and a pericyclic ramp. The plan is solid. Remaining issues are mostly minor.

### Coverage
- Minor: 56 lessons at under 25 minutes each is about 23 hours. That is fine for an advanced learner, but say so in the scope.
- Minor: no lesson covers E2 vs SN2 regiochemistry in cyclic systems beyond menthyl. Acceptable.
- Minor: Michael addition of enolates (Robinson annulation) and Claisen/Dieckmann are only implied. Optional rabbit holes.
- Minor: the Heck reaction and Negishi are named in resources, but only Suzuki is taught. G6 uses Negishi as a re-gate, and the plan does not say where a Negishi cycle is taught. Add a one-line note in L49 or L47 that Negishi is a transmetalation variant, so the re-gate is fair.

### Sequencing
- Minor: the concept map is stale. It still uses the old numbering (for example 'Curtin–Hammett (12)', 'SN2 (7)', 'Evidence lessons (35–38)') and cites lesson numbers that no longer match the 56-lesson plan. Renumber it, or builders will wire wrong dependencies.
- Minor: lesson 6 is placed in Module 1 but the plan table labels lesson 6 as 'kinetic vs thermodynamic control (butadiene + HBr)' while the JSON lesson 6 is carbocation stability. The kinetic/thermodynamic butadiene example is then absent from the JSON. Reconcile the two sources. The JSON appears to be authoritative, so state where butadiene + HBr is taught (L27 or L17) or drop it.
- Minor: the G4 gate sits at the start of L38 and L38 is itself the refresher. Say explicitly that G4 is a diagnostic before the lesson, not an outcome of it.
- Minor: the module label for L15–L20 is 'Carbocations: Rearrangements & Alkene Additions'. Hydroboration and peracid epoxidation are concerted, not cationic. Rename the module, for example 'Alkene Additions and Cation Chemistry'.
- Minor: lesson 37 (trapping) is placed in the radical module but depends on benzyne (L32) and radical clocks (L36). That is fine. The evidence module then repeats the idea in L53. Check that L37 and L53 do not overlap.

### Resources
- Minor: several lessons still lean on Wikipedia as the only non-textbook link (L8, L9, L11, L15, L17, L19, L22, L35). Wikipedia is within the 30% cap on a per-lesson basis only if each lesson has at least 3 links. Lessons with 2 to 3 links where 1 is Wikipedia are over 30%. Add one primary or Master Organic Chemistry reaction-page link to those, or accept it as a nit.
- Minor: the Mayr URL is flagged as 'could not be checked'. The fallback instruction is good. Ask the builder to record the check result in resources.md.
- Minor: lesson 54 cites two Science papers (aar5169, aat8603) that are not named in resources.md, and the resources.md Clever Hans line says 'find and verify'. The JSON already has DOIs. The builder must verify that each DOI matches its intended paper (for example 10.1126/science.aar5169 and aat8603 are Segler/Waller-era work, not obviously Clever Hans analyses). Verify before shipping.
- Minor: lesson 2 cites 10.1126/science.218.4574.747. Check it matches the intended Fukui Nobel lecture or paper. Several DOIs are cited from memory and should be spot-checked (L5 ja01607a027, L6 anie.199513931, L38 1.1700523).
- Minor: lessons 11, 19 and 26 have no or only textbook sources. Fine.

### Exercises
- The fixed notation with deterministic checks is a strong fix.
- Minor: check 3 ('no second-row atom above an octet') will wrongly reject legitimate hypervalent S and P species such as sulfoxides, sulfonyl groups, phosphates and oxaphosphetanes in L40. Reword to 'no first-row atom above an octet; hypervalent S/P allowed when drawn in a standard form'.
- Minor: `source -> sink` for a σ bond to a new bond like `C1-O3` is clear. Pericyclic and delocalised arrows (allyl, Wheland) need a convention for arrows that originate at a bond and terminate at an adjacent bond. Add one example.
- Minor: the energy-diagram string notation does not specify how to encode stereochemical or selectivity outcomes in Curtin–Hammett (L14). Add a one-line template.

### Pedagogy and notes alignment
- Minor: the carry-over rule says 'two modules back' for every non-review lesson. Module 3 draws on Module 1, which is fine. Lessons early in a module (for example L8 or L15) can reach back only one module. State the rule for the first lessons of each module explicitly.
- Minor: type labels differ between the plan ('resource-drop' only appears in JSON for L54). The plan intends L54 as a 'resource-drop' with an exercise. Add an explicit critique exercise so it is not a pure reading lesson (the note says every lesson has an exercise).
- Minor: 8 reviews at difficulty 2 to 3 is good. The L56 capstone is the only 5 besides L41. Fine.

### Bias
Well addressed: Fukui, Suzuki, Negishi, Bertozzi, Doyle, Arnold, List/MacMillan, plus green-chemistry framing and the sulfur-mustard ethics. Minor: the 'People to look up' list is still mostly male. Consider adding Dorothy Hodgkin, Mary Lowe Good, or Frances Arnold's co-workers. Optional.

### teacher.md
The teaching notes are clearly domain-specific: fixed notation, deterministic checks, misconceptions, accuracy guardrails and gates all target mechanism writing. Not generic. The notes are truncated in the review copy after misconception 8. Confirm the full misconception list survives in the final file.

### Accuracy spot checks
- Mayr scope, the 5-hexenyl rate (about 2×10^5 s^-1), the vitamin D sequence and the 2013 norbornyl crystal structure are all correct.
- L19 title: 'more substituted carbon in acid' is correct for unsymmetrical epoxides with a tertiary centre, but should say 'when one carbon is tertiary or benzylic'. Minor.
- L10 cites Swain–Scott as doi 10.1021/ja01097a041. Check this resolves to Swain & Scott 1953.

## Verdict
No major structural problems remain. The items above are polish for the builder: renumber the concept map, fix the check-3 wording, verify the DOIs, and reconcile the L6 butadiene example.