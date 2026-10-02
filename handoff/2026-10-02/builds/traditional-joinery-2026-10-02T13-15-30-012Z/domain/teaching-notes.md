# Traditional Joinery — Teaching Notes

## Approach

This is a spatial, mechanical topic, so teach it model-first. Every joint lesson asks the same three questions: what load does it carry, which way does it go together, and where does it break? The student has no workshop, so paper or foam models and exploded-view sketches stand in for cutting wood. Each 3D lesson has a text fallback in three steps: (a) parts, (b) assembly and failure, (c) sketch. Use it whenever no verified visual is available. Keep the mechanics qualitative: load paths and failure modes, not calculations.

## Common Misconceptions

1. **'Wood shrinks evenly in all directions.'** Students picture wood like metal. Correct this with the grain: movement along the length is tiny, while movement across the grain is large and differs between radial and tangential directions. Point to a cracked tabletop or a floating panel.
2. **'Glue makes any joint strong.'** End-grain glue joints are weak because glue needs long-grain to long-grain contact. Show that good joints create long-grain glue surfaces or rely on a mechanical lock instead.
3. **'A dovetail can't come apart.'** It locks against pulling in one direction only and slides apart freely along its assembly path. Have the student find that path on their model.
4. **'Japanese joinery never uses glue or nails, so it's stronger.'** That overgeneralizes a tradition and confuses method with strength. Pegs, wedges and mechanical locks are used, and strength depends on the joint and its load.
5. **'Pull saws are better, full stop.'** The tension and thin-blade mechanics are documented, but the history of why the pull stroke became standard is not settled. Keep the two apart.
6. **'Traditional joints make buildings earthquake-proof.'** This is contested. Performance depends on the whole structure. Treat it as an exercise in evidence, not a fact (see L31's qualitative label).
7. **'Ise Jingu is a UNESCO World Heritage site.'** It is not. The UNESCO link is the 2020 Intangible Cultural Heritage inscription for traditional wooden-architecture skills in Japan.

## Level Adjustments

The student is intermediate but the topic is beginner-level, so expect fast uptake of the vocabulary and push on reasoning. Ask 'why here and not there?', make them predict the failure point before you reveal it, and give the assembly order for every joint. Use the Japanese terms alongside a plain-English gloss each time until L25, then use the terms alone. Skip workshop technique, safety, finishing and numeric engineering. Recurring tags to retest: `failure modes` (L9–14, 20–23, 25–30, 35), `bending and shear` (L7, 22, 26, 29), `wood movement` (L2, 3, 6, 14, 29, 35) and `sketching` (L15, 18, 24, 34, plus step (c) of every 3D fallback).

Delivery mix (counted from the final JSON): mini-lesson 16, question 5, real-world 5, review 6, teach-back 3, resource-drop 0. Total 35.

## Source Status

No lesson's `resources` array has a URL in this build. Nothing could be checked against the verification gate here (no network access). Anchors to verify and add: the USDA FPL Wood Handbook (FPL-GTR-190), the UNESCO ICH 2020 inscription, and Larsson et al. 2020 Tsugite (DOI pending verification). Until then, use the search directions in each lesson's `notes`. The Ramage et al. paper must not be the only source for L33.

## Rabbit Holes

- **Ise's 20-year cycle as a way to pass down skill.** Each rebuild trains the next generation. Drop this in at L32, or at L17 when a student asks how hand-tool skill survives.
- **Computational joint design.** Interactive tools now check whether a joint can be assembled and send it straight to a CNC milling machine (search: Tsugite UIST 2020; do not link the editor). Drop this in at L33 or after L28's assembly-order puzzle.
- **Joints that 'give' on purpose.** The idea of a connection that deforms instead of snapping links to how engineers think about ductility in steel and concrete. Use it at L31.
- **Dovetails as a signature.** Pin spacing and angle can date and attribute antique furniture. Use it at L11 or L15.