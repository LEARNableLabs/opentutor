## Verdict
Lessons 1-30 broadly match the canonical table. **Lessons 31-38 in curriculum.json do not match it**, and the files derived from it repeat the errors. Revision 3 was supposed to fix exactly this plan-vs-JSON mismatch, and it is still there. The table is now fully visible, so the Build Note's 'reconstructed L32-L38' excuse no longer applies.

## Major issues

### 1. L31-L38 are still reconstructed, not regenerated from the table
| # | Table | JSON |
|---|---|---|
| 31 | teach-back, d5, ext | type `question` |
| 32 | 'The climbing injury map: pulleys, growth plates, shoulders', d3, **not ext** | Different title ('Finger pain or a sore shoulder...'), `extended:true` |
| 33 | 'Returning to climbing, and when to see a professional', real-world, d3, not ext | REDs/'Fuel, not weight' mini-lesson, extended |
| 34 | review of **21-33**, d2 | d3, concepts say **28-33**, adds 'audit the L31 block' |
| 35 | **REDs/energy availability** mini-lesson, d4, not ext | warm-up/observation real-world, d3 |
| 36 | **Case study** of one documented elite athlete's competition-day routine, real-world, d3, not ext | 'Fell on the first go' question, d4, extended |
| 37 | **Case exercise** (scored boulder round: time, attempts, points), question, d3, not ext | Capstone teach-back, d5, extended |
| 38 | **Capstone**, review, d5, **ext**, with a footage rubric and a written training block | 'Final review', d3, **not ext** |

- The M6 module name should be 'M6 Injury, Health and Welfare', not 'M6 Health and Welfare'.
- The M7 module name should be 'M7 Competition Performance', not 'M7 Competition Day'.
- The table requires L33 to cover return-to-climbing principles and referral thresholds with no rehab prescription. That content is missing.
- The table requires L35 to pair the IOC 2023 REDs consensus and the IFSC health policy with the explicit no-weight-targets rule. That content sits in the wrong lesson number (33) and has the wrong difficulty and extended flag.
- L36 requires a verified interview or footage of a real elite athlete. JSON has no case-study resource slot, and the exit criteria never mention it.
- L37 requires a scored scenario exercise. Nothing like that exists in JSON.
- L38 must be the capstone: read the round with the footage rubric, then write a training block. JSON puts a capstone at 37 and a generic review at 38.
- L31 should synthesise setter intent (14), but the JSON concepts omit it.
- **Extended flags:**
  - Wrongly true in JSON: 32, 33, 36, 37.
  - Wrongly false in JSON: 38.
  - The plan's extended set is 13, 14, 15, 17, 18, 19, 21, 23, 24, 28, 29, 30, 31, 38.

### 2. Derived files propagate the wrong numbering
- **teaching-notes.md**
  - The extended list names 32, 33, 36 and 37 and omits 38.
  - The hard rules redirect weight talk to 'L33 (REDs)' and injury referral to 'L32'. By the table these are L35 and L33.
  - The delivery notes 'L32-L33' are wrong for the same reason.
  - The 'Check L31-L38 against the full plan' build note is still present and should be resolved.
  - 'Check the format before L1, L2, L4, L35' now points at the REDs lesson instead of the warm-up lesson. The rule still needs a home for isolation and observation procedures.
- **concept-map.md** claims to use canonical numbers, but L32-L38 are wrong.
  - L33 is listed as REDs, L35 as warm-up, L36 as attempt strategy, L37 as capstone and L38 as final review.
  - The L34 review range and the L37 dependencies are therefore wrong.
  - There is no entry for the L33 return-to-climbing lesson.
- **teacher.md** was not supplied. It must be regenerated from the corrected table, and I could not check whether it is domain-specific.

### 3. Dead URLs are still in use
- `https://www.youtube.com/@sportclimbing` is in the L3 resources and in resources.md (twice). Replace it with a specific IFSC event or video link, or drop it.
- `https://en.wikipedia.org/wiki/Critical_power` is in L18. Replace it with a verified source or drop it.
- The IFSC-CLIP-SLOT guidance leans on the dead YouTube channel, so clip sourcing needs another route (ifsc-climbing.org event pages).

### 4. Safety-routing inconsistency
- L22 concepts say 'pass → Track A eligible, fail → Track B'.
- The plan scope and teaching notes say adolescents, people new to structured training and anyone without hangboard clearance go to Track B.
- As written, an adolescent who passes the gate becomes Track A eligible. Add an explicit override for adolescent, novice and no-clearance students to L22, L23 and L31, and to the concept-map routing.

## Resources (moderate)
- L5 and L6 list only the Wikipedia glossary, and L8 lists only Wikipedia 'Center of mass'. The plan says the glossary is supplementary only and never the sole backing, so these lessons need a primary or practitioner source.
- The L10 and L11 DOI `10.1111/j.1600-0838.2010.01151.x` is not a VERIFY-SLOT and is not described anywhere. Mark it VERIFY-SLOT or remove it. Its identity (a visual-preview study?) is unstated, and the plan forbids unverified citations.
- Giles 2006 (`10.2165/00007256-200636060-00006`) is reused in L17 and L25, although the notes say the determinants reviews are reserved for L16. Cite a pump-specific source in L17 and a CF or training source in L25.
- L24, L28 and L29 hold only a bare 'VERIFY-SLOT: peer-reviewed source...' with no candidate, so effectively there is no resource. Name candidates. L27, L31, L34 and L38 have empty resources (acceptable for reviews, but not for the L31 and L38 synthesis tasks).
- JSON strings contain HTML-escaped `&amp;` (L13, L23). Unescape them.
- resources.md lists the IFSC-CLIP-SLOT lessons as '3, 9, 12, 13, 14, 15'. This omits 7, 11, 20 (reuse of 12), 35-38, and is incomplete.
- resources.md labels the IOC REDs source 'Mountain Rescue / IOC consensus'. Fix the label.

## Checked and fine
- **Maths:** both worked examples are correct (L18: slope 30, W' 600, check 35; L19: impulses 1800/2800/4800, CF 25, W' 800).
- **Lessons 1-30:** these match the table on type, difficulty and extended flag.
- **Review spacing:** reviews fall at 9, 15, 20, 22, 27, 34 and 38, with a maximum gap of 7. This holds only once the table versions of 34 and 38 are restored.
- **Misconception 4:** it is taught only in L16.
- **L12 and L20:** the same clip ID and the saved answer key link them correctly.

## Revision targets
Regenerate curriculum.json L31-L38 and the M6 and M7 module names from the table. Correct the extended flags. Fix teaching-notes.md, concept-map.md and teacher.md numbering. Replace the dead URLs. Add the adolescent and novice override to the gate routing. Strengthen the Wikipedia-only resources and the unidentified DOI.