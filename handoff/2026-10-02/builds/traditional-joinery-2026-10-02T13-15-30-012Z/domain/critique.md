## Overall
Revision 3 resolves the prior points. The plan is honest about unverified sources, the splice difficulty ramp is fixed (3→3→4→5), and the Ise/UNESCO accuracy error is corrected. Remaining issues are minor.

## Findings

**Coverage / exit criteria (minor)**
- Exit criterion 2 asks for an exploded-view sketch of every core joint, but frame-and-panel (L14), basic dado, and the sampo zashi get only a text fallback or no explicit sketch task. L14 is a real-world lesson with no sketch step. Add a one-line sketch prompt to L14 notes.
- Japanese tool lessons (L16-18) have no `assembly direction` or joint tie-in. This is acceptable.

**Sequencing (minor)**
- L7 (bending and shear) is difficulty 3, directly after the difficulty-1 review at L6. This is fine.
- L29 (difficulty 4) compares Western and Japanese solutions but follows a difficulty-5 lesson (L28). The drop is natural.
- The `wood movement` retest in L29 and L35 is listed in the concept tags in the teaching notes but not in the plan's tag list (2, 6, 12, 14). The two documents disagree slightly. Align them.

**Resources (minor, known limitation)**
- Every `resources` array is empty because there was no network access. This is stated openly and gated, so it is not a defect in the plan. The builder should still resolve the Wood Handbook, UNESCO and Larsson links where possible. L1 notes cite FPL-GTR-190, while the plan text says FPL-GTR-282. This is an inconsistency, so the builder should pick one after verifying.
- The Ramage year is given as 2016 in resources.md and 2017 in the L33 notes. Fix this to one value.

**Format table (minor)**
- The type counts are internally consistent: 16+5+5+3+6 = 35. Note that the plan lists 16 mini-lessons by number, and the list is correct.

**Pedagogy / bias (minor)**
- The comparison is balanced across the two traditions. Japanese joints are not romanised, and misconception 4 is explicitly addressed.
- The JSON `level` field says `beginner` while `student_level` says `intermediate`. Reconcile them.

**teacher.md (ok)**
The teaching notes are domain-specific: misconceptions, retest tags and rabbit holes are all joinery-specific.

## Verdict
No major issues remain. The items above are minor consistency fixes and can be handled during the build.