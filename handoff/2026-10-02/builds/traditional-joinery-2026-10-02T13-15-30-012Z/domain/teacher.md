# Traditional joinery: Domain Teaching Config

## Exercise Types
- **Failure prediction:** 'Where does this joint break first, and why?' This is the core exercise, and it appears in every Western and Japanese joint lesson.
- **Exploded-view sketching:** practised at L15, 18, 24 and 34, and in step (c) of every 3D lesson's fallback.
- **Assembly sequence:** give the direction and order of assembly. Some Japanese joints only go together in one order.
- **Joint selection:** 'Lap, bridle or dado for this load?' The student justifies the choice with a load path.
- **Compare and contrast:** a Western and a Japanese solution to the same structural problem (exit criterion 5).
- **Claim sorting:** separate documented fact from tradition or anecdote (pull saws, earthquake performance).
- **Paper or foam modelling** when the student has materials. Otherwise use the text fallback in the lesson's `notes`.
- Hands-on workshop technique and safety are out of scope.

## Exercise Format Preference
**Mixed.** Use multiple choice for vocabulary and force identification (tension, compression, shear, racking). Use free text for failure prediction, joint selection and comparison, where the student must show the load path. Fall back to multiple choice if the student is struggling.

## Resource Types
- Textbooks and the Wood Handbook for material facts. These are the strongest sources.
- Annotated joint drawings and exploded views. They matter more than prose for the 3D lessons.
- Video demonstrations, as supplementary only.
- Peer-reviewed papers for modern practice (computational joint design).
- Every 3D lesson carries a text fallback in `notes`, whether or not a visual is found.

## Resource Status (matches the plan word for word)
- Larsson et al., 'Tsugite: Interactive Design and Fabrication of Wood Joints' (UIST 2020): **pending verification**, not 'done'. The planned DOI could not be verified in this build. L33 stays empty unless the DOI resolves. If it fails, L33's `notes` say: 'No verified source for Tsugite in this build.'
- The Ramage DOI may appear in L33 only as a second item, next to a verified Larsson source, and only for the 'engineered timber context' concept.
- The Takenaka museum and the Tsugite GitHub repository are search directions only. They have no links. No lesson depends on the museum (L17).
- Wood Handbook and UNESCO URLs go into lesson arrays only after they pass the verification gate.
- The Ise Jingu lesson cites the 2020 UNESCO Intangible Cultural Heritage inscription. Ise Jingu is not a UNESCO World Heritage site.
- The earthquake lesson (L31) states its qualitative label in `notes`.

## Difficulty Curve
- Modules run material, then forces, then Western joints, then tools, then Japanese splices, then connections, then context.
- The material lessons (L1-L5) sit at difficulty 2. Difficulty 3 starts with bending and shear (L7), then end-grain glue and joint failure.
- The splice run climbs 3, 3, 4, 5 with no jump larger than 1. Each splice gets its own lesson.
- The hardest content is the three-dimensional assembly logic of the late splices and the shiguchi connections.
- Grain, movement and force vocabulary gate every later lesson. If review lessons 6, 12, 25, 30 or 35 show shaky results, consolidate before moving on.
- `failure modes` is retested in every Western and Japanese joint lesson (9-11, 13, 14, 20-23, 26-29) and in reviews 12, 25, 30 and 35.

## Domain Hooks
- Ise Jingu is rebuilt every 20 years (shikinen sengu), and the skills are passed on through that cycle. UNESCO recognised the techniques in 2020 as intangible cultural heritage.
- Joints that hold without nails or glue.
- A draw-bored peg pulls the tenon tight with no clamp.
- A dovetail locks in one direction only, which is why drawers survive being pulled.
- Old doors use floating panels so the wood can move without cracking.
- Computational design now generates interlocking joints. For L33 the student can search 'Tsugite UIST 2020'. Do not link the editor.

## Common Failure Modes
- Treating wood as isotropic. It is strong along the grain and weak across it, and it moves mostly across the grain.
- Gluing a solid tabletop rigidly across its width, which cracks it as it moves.
- Expecting glue to hold on end grain.
- Confusing a joint's assembly direction with the direction it resists load.
- Naming a joint without stating the load it resists or where it fails first.
- Treating tradition as evidence. Pull-saw superiority and earthquake performance need a documented source or an explicit 'anecdote' label.
- Mixing up Japanese splice names (tsugi) with connection names (shiguchi).
- Skipping the sketch. Retest by asking for an exploded view.

## Vocabulary
- **Use freely:** grain, end grain, tension, compression, shear, racking, mortise, tenon, dovetail, lap, bridle, dado, draw-bore, frame and panel, moisture content, seasoned.
- **Define carefully, with the romanized name:** tsugi (splice), shiguchi (connection), koshikake ari tsugi, koshikake kama tsugi, okkake daisen tsugi, kanawa tsugi, nagahozo, komisen, watari ago, sampo zashi.
- **Avoid:** engineering formulas beyond qualitative load paths, and claims such as 'earthquake-proof' or 'stronger than nails' without a source.
- Give the Japanese term together with a plain-English description the first time it appears.
