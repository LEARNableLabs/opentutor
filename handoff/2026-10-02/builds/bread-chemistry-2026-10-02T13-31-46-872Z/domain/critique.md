## Overall
Strong, coherent plan. The timeline-based structure, misconception handling, and defect-diagnosis review approach are well aligned with the stated pedagogy. Issues below are mostly minor; a few are worth fixing.

## Coverage
- **Misconception 'more kneading is always better'** has no clear home. Lesson 8 (overmixing) covers it, but it is not flagged as a confrontation point. Minor.
- **Baker's percentages** are an exit criterion and a stated exercise type, yet they appear only incidentally (L5, L10, L12, L32). No lesson teaches hydration/preferment calculation explicitly, and preferment % is never introduced (L14 mentions preferment only via a Wikipedia link). Add the concept to L5 or L14 so the exit criterion is actually taught.
- **Protein-structure remedial lesson** is a conditional contingency, not in the 32. The plan calls Module 2 the biggest risk, yet L7 (difficulty 4) is the first place cysteine and disulfide bonds are explained in depth. A short 'protein structure refresher' inside L6 or L7 would be cheap insurance.
- **Whole-grain/bran effects** appear in L5 only as a concept tag. Fine at this depth.

## Sequencing
- **Module 4 numbering vs. timeline:** the plan lists 6 modules, but the JSON has 5 distinct module names (Cooling and variations are merged into 'After the Bake & Variations'), and the module names contain the HTML-escaped '&amp;'. Cosmetic, but fix the encoding.
- **Review placement:** the plan says reviews at the end of Modules 2, 3 and 5. The JSON has reviews at L12, L18, L26, plus the capstone L32. That is consistent. However, Module 4 (L19-22) has no review, and L22 is followed immediately by the oven. Minor, since L26 interleaves.
- **Difficulty spike:** L24 to L26 are all 4, and L26 is a review at 4, which is a heavy stretch. L29 and L30 (both 4) then lead into the capstone at 5. Acceptable, but L26 could be dropped to 3.
- **L4 (arabinoxylans, lipids, enzymes) as a 'resource-drop'** at difficulty 3 carries three separate topics, and its content is needed later (L9, L13, L29, L31). Consider making it a mini-lesson so the material is taught rather than dropped.
- **L17 'glutathione from dead yeast'** is advanced for this level (the notes say to skip mechanisms). Fine if kept brief.

## Breadth vs Depth
- 32 lessons at 3-5 minutes each is about 2-2.5 hours. That is ambitious for coverage like the oven-stage trio and the sourdough ecology. L16 (starter ecology) is arguably a rabbit hole, not core.
- L31 bundles improvers, xylanases, anti-staling amylases and Chorleywood in one resource-drop. It is overloaded.

## Resources
- Heavy reliance on Wikipedia and on generic homepage links (kingarthurbaking.com, seriouseats.com, theperfectloaf.com) that are not specific articles. Lesson writers cannot cite a homepage. Replace them with specific article URLs.
- Several lessons have only Wikipedia (L10, L11, L19-22, L28). L21 (gas retention, strain hardening) and L24 (setting) have weak sources for hard claims. Add McGee or Delcour &amp; Hoseney chapter pointers.
- The Wikipedia link for 'Starch_retrogradation' in resources vs. 'Retrogradation_(starch)' in the JSON is inconsistent. Verify that both resolve.
- The Shewry 1995 paper is cited for L7, but it covers general seed storage proteins, so it is a loose fit. The Shewry 2009 'Wheat' DOI is attached to L4. That is a stretch.
- Collins et al. 2004 is a review of extremophilic xylanases, which is a poor fit for baking improvers. Flag it as optional at best, or replace it with a baking-specific xylanase review.
- Videos are not attached to specific lessons.

## Exercises
- Format is sensible: mixed MC and free text, with predict-then-reveal and diagnosis. Free-text answers need rubrics or model answers so grading is consistent. Not specified.
- The L30 celiac link (Wikipedia: Celiac_disease) risks drifting into the medical detail the plan puts out of scope. Keep it to one mention.

## Bias
- Sources are overwhelmingly European/North American wheat-bread tradition. Flatbreads, steamed breads, rice/corn-based and other non-Western traditions are absent. Acceptable for a gluten-focused scope, but a brief mention in L30 or a wild card would balance it.
- Heavy dependence on popular-baker sources (Forkish, Reinhart, Leo) for claims that may be folk wisdom (e.g. autolyse benefits, salt timing). Require validation against McGee or Delcour &amp; Hoseney.

## Pedagogy
- Pedagogical decisions match the lesson list well: predict-then-observe, troubleshooting, and optional experiments are all reflected.
- Lesson types: five teach-backs are absent (only L11, L23 are teach-backs). The plan lists teach-backs as an exercise type, so that is thin but workable.
- Possible factual risk to flag for writers: 'stale bread stales faster in the fridge' is correct (retrogradation peaks around 0-5°C), but the freezer comparison needs careful wording. Gluten 'denaturation' temperatures should be given as ranges, as the notes already say.

## teacher.md
- Teaching notes are strongly domain-specific (misconceptions, models, rabbit holes mapped to lessons). No generic filler. Good.

## Summary
No blocking structural issues. Fix the baker's percentage coverage gap, replace homepage links with specific resources, and consider splitting or upgrading L4 and L31. These are improvements, not blockers.