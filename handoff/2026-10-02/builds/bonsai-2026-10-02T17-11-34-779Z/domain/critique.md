## Major issues

**1. The gate is still defined two ways, even though Revision 3 says it is fixed.**
- The plan defines a 0–3 rubric per scenario (criteria a, b, c), a maximum of 15, and a pass at ≥10/15 with no core scenario scored 0.
- The L20 JSON and teaching-notes.md both define a different gate: pass = cause and mechanism correct in ≥4 of 5 cases and no prescription that would kill the tree.
- These are different tests with different pass logic. The plan requires them to match word for word, and they don't.
- Fix: pick one definition and paste it identically into the plan, teaching-notes.md and the L20 JSON concepts.
- The plan's core scenarios (A. root rot, and so on) also need to match the five cases in the JSON. The truncated plan makes the JSON's 'overwatering, underwatering, light starvation, high-pH chlorosis, winter root damage' list impossible to verify against it.

**2. The Revision 3 claim that the JSON mirrors the per-lesson primary-source table is false.**
- Almost every lesson's resources are Wikipedia URLs.
- The primary sources named in resources.md appear in no lesson's resource list. These are Taiz & Zeiger, Shigo & Marx, Brady & Weil, the EPA Safe Pest Control page and Hagedorn/Crataegus.
- Only L47 (Lovett) and the USDA hardiness map (L19, L36) are real exceptions.
- resources.md itself says Wikipedia is 'not the sole source for any specific claim', yet it is the sole source for L5–L10, L13–L17, L21–L27 and most species lessons.
- Some Wikipedia picks are also poor fits. 'Perched water table' (L13) is a groundwater article, not container perched water. L27 lists generic 'Layering'.
- The plan also promised a Brady & Weil / container-horticulture source for L13, L14 and L16, and the JSON does not include it.

**3. Lesson types and difficulties in the JSON disagree with the plan.**
- The plan has L50 as a teach-back at d4 and L51 at d5. The JSON has L50 as a review at d3 and L51 at d4.
- The capstone is therefore easier than specified.
- The JSON's L51 concepts also omit the plan's required risk register, health-check schedule and hemisphere-anchored calendar.

**4. The dead URL is still present.**
- https://www.walterpall.de/ is in the dead-urls list and still appears in resources.md. Remove it, or replace it with a verified URL.
- The plan said all dead URLs were removed.

**5. HTML-entity artifacts remain.**
- '&amp;' still appears in the L43 concept in the JSON, in teaching-notes.md (rabbit holes) and in resources.md (Taiz &amp; Zeiger, Shigo &amp; Marx, Museum).
- The plan said these were removed.

## Minor issues

- L38 links http://arxiv.org/abs/1305.1737v1. It is flagged as optional and not evidence for bonsai design, but it is a versioned http link and low value. Consider dropping it.
- Misconception 7 ('pinching juniper tips browns foliage') is stated too flatly. Pinching juniper is widely taught and practised, and the real disagreement is about technique and timing. Hedge it and cite a source, such as Hagedorn or Crataegus.
- No teacher.md was provided for review, though the plan says its contents were specified. I could not check whether it is domain-specific.
- Several runs of difficulty 3 remain (L21–L23, L29–L31, L34–L36). The L33→L43→L50 progression is otherwise reasonable.
- Coverage and sequencing are otherwise good. Physiology comes before technique, and the gate at L20 sits after M2 and M3. Winter, IPM and chemical safety are now covered.

## Verdict
The structure is sound. However, the central fixes the revision claims are not actually reflected in the artifacts: gate consistency, per-lesson primary sources, dead URL and entity cleanup, and capstone specification.