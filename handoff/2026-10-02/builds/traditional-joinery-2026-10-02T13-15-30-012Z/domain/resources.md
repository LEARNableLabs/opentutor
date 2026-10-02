# Traditional joinery: Japanese and Western wood joints. Resources

## Verification status (read first)
This build had no network access to check links. Only one URL appears below, the Ramage DOI, which came from the research step. Everything else is listed by title and search terms, with no link. A resource moves into a lesson's `resources` array only after its URL has been checked.

- Larsson et al., 'Tsugite: Interactive Design and Fabrication of Wood Joints' (UIST 2020): **pending verification**. No DOI is given here. L33 stays empty until the DOI resolves. If it never does, L33's notes say: 'No verified source for Tsugite in this build.'
- Ise Jingu is **not** a UNESCO World Heritage site. The correct UNESCO source is the 2020 Intangible Cultural Heritage inscription, 'Traditional skills, techniques and knowledge for the conservation and transmission of wooden architecture in Japan'.

## Primary sources (lesson content)
- **R. Bruce Hoadley, _Understanding Wood: A Craftsman's Guide to Wood Technology_ (Taunton Press)**. Covers grain, shrinkage and movement, moisture content, and the reason end grain glues poorly. Backs L1-L4.
- **USDA Forest Products Laboratory, _Wood Handbook: Wood as an Engineering Material_**. This is the authoritative reference for wood properties, moisture and mechanical behaviour. Search: 'Wood Handbook FPL-GTR-190'. Add a link only after the verification gate.
- **Hideo Sato and Yasua Nakahara (tr. Koichi Paul Nii), _The Complete Japanese Joinery_ (Hartley & Marks)**. Gives drawings and assembly sequences for tsugi and shiguchi. Use it as the main reference for the Japanese joint lessons.
- **Kiyosi Seike, _The Art of Japanese Joinery_ (Weatherhill)**. Photographs and cultural context for Japanese joints.
- **Toshio Odate, _Japanese Woodworking Tools: Their Tradition, Spirit and Use_ (Taunton Press)**. Covers the Japanese tool and layout tradition, including pull saws. Use it for the tools module.
- **Michael H. Ramage, Henry C. Burridge, Marta Busse-Wicher et al., 'The wood from the trees: The use of timber in construction', _Renewable and Sustainable Energy Reviews_ (2016)**. DOI: https://doi.org/10.1016/j.rser.2016.09.107. Use it only as a second item in L33, next to a verified Larsson source, and only for the 'engineered timber context' concept. It is not a source for CNC joint design.
- **UNESCO, 2020 Intangible Cultural Heritage inscription: 'Traditional skills, techniques and knowledge for the conservation and transmission of wooden architecture in Japan'**. Search: 'UNESCO intangible cultural heritage wooden architecture Japan 2020'. Add a link only after the verification gate.

## Search directions (no links on purpose)
- Takenaka Carpentry Tools Museum (Kobe), Japanese carpentry tools and joinery exhibits. Search: 'Takenaka Carpentry Tools Museum'. No lesson depends on it.
- Tsugite joint editor (Larsson et al., UIST 2020). Search: 'Tsugite UIST 2020'. Do not link the editor or its GitHub repository.
- Ise Jingu shikinen sengu (the ritual rebuilding every 20 years). Search: 'Ise Jingu shikinen sengu'. Pair it with the UNESCO ICH source above, not with any World Heritage claim.
- Joint-name vocabulary. Search the romanized names: 'koshikake ari tsugi', 'koshikake kama tsugi', 'okkake daisen tsugi', 'kanawa tsugi', 'nagahozo komisen', 'watari ago', 'sampo zashi'.

## Supplementary (engagement)
- **Videos.** Search for Japanese carpenter channels showing tsugi cut and assembled. Search for dovetail and mortise-and-tenon demonstrations by established Western woodworking educators. Treat videos as supplementary only, never as the sole backing for a claim.
- **Hands-on without a workshop.** Paper, foam board, stacked blocks or a simple 3D printer let the student model a joint. Every 3D lesson has a required text fallback in its `notes` field: (a) describe the assembly direction, (b) describe the load path and first failure, (c) sketch an exploded view.
- **People to look up.** Toshio Odate, Kiyosi Seike, Michael Ramage (timber in construction), R. Bruce Hoadley.
- **Unexpected connections.** Draw-bored pegs act as a built-in clamp. Frame-and-panel doors are a wood-movement solution. Interlocking joints show up in puzzle design and in computational fabrication.

## Lesson by lesson

Found by web search; every link was checked.

### Lesson 7: Why do beams fail at the bottom first?
- ▶ [Understanding Stresses in Beams (The Efficient Engineer)](https://www.youtube.com/watch?v=f08Y39UiC-o) — Clear animations show the stress flipping from squeezing at the top to stretching at the bottom, with zero stress along the neutral axis, so you can see why cracks start on the tension face.
- 🕹 [Beam Bending: Interactive Explainer](https://unseel.com/engineering/beam-bending) — You load a beam yourself and watch the compression and tension zones and the neutral axis move, which beats any diagram in a book.
- 📄 [Why Does Concrete Need Reinforcement? (Practical Engineering)](https://practical.engineering/blog/2018/8/1/why-does-concrete-need-reinforcement) — Grady Hillhouse breaks beams and the crack opens at the bottom every time, which explains why builders put steel exactly where wood is also most at risk.
- 📄 [The Mechanical Properties of Wood, Samuel J. Record (Project Gutenberg)](https://www.gutenberg.org/files/12299/12299-h/12299-h.htm) — A free 1914 primary source that sorts real timber beam failures into types, such as 'simple tension' and 'cross-grained tension' on the underside, the way a forester of that era actually saw them.

### Lesson 8: Glue, peg, wedge or nail: what actually holds a joint together?
- ▶ [Butt Joint Strength Test: Nails vs Glues vs Screws](https://www.youtube.com/watch?v=dEVm5Jmvtmc) — Brad nails, framing nails, CA glue, wood glue and screws are each loaded until they break, so you can see which one wins before you form an opinion.
- 📄 [Glue strength testing (Matthias Wandel, woodgears.ca)](https://woodgears.ca/joint_strength/glue.html) — An engineer tests glues on a home-built machine, and the wood often breaks before the glue line does, which upsets the idea that glue is the weak link.
- ▶ [No Nails, No Screws: Japanese Woodworking WARI-KUSABI (割楔)](https://www.youtube.com/watch?v=ugw29gB8HW0) — A split wedge gets driven into a tenon and spreads it inside its hole, so you see a mechanical lock hold the joint with no glue and no metal.
- 📑 [Wood Handbook: Wood as an Engineering Material (USDA Forest Products Laboratory)](https://research.fs.usda.gov/fpl/wood-handbook) — This is the free government reference engineers use, and its Fastenings and Adhesives chapters give real numbers for how nails, bolts and glue carry load.

### Lesson 9: Where does this joint break first?
- ▶ [What I learned from breaking 100 pieces of wood](https://www.youtube.com/watch?v=lpjf5KoqpRQ) — Watching 100 nearly identical sticks each break somewhere different shows that knots and grain often decide where a part fails, not the textbook cross-section.
- 📄 [Testing pocket holes against mortise and tenon and dowel joints (woodgears.ca)](https://woodgears.ca/joint_strength/pockethole.html) — The screw joints bend so far before they break that their 'failure strength' means little for furniture, which teaches you that failure isn't only the moment something snaps.
- 📑 [Capacity of Pegged Mortise and Tenon Joinery (Richard J. Schmidt)](https://ftet.com/sites/default/files/2018-07/miller_report.pdf) — Lab photos show pegs bending, wood crushing, and the 'relish' shearing out behind the peg, a full list of how a real timber joint breaks.

### Lesson 10: Why is the mortise and tenon everywhere?
- ▶ [Drawbore: An Inside Look (Paul Sellers)](https://www.youtube.com/watch?v=iblkJnlmg4w) — Paul Sellers saws a drawbored joint in half so you can see the peg bent into an S-curve, pulling the tenon tight from inside.
- 📄 [Mortise and tenon vs. dowel joints: A strength test (woodgears.ca)](https://woodgears.ca/mortise/strong.html) — A homemade test rig with a bathroom scale gives real numbers: on average the mortise and tenon beat dowels by about 25%, and the photos show bits of the post still stuck to the broken tenons.
- 📄 [Drawboring Resurrected (Popular Woodworking)](https://www.popularwoodworking.com/techniques/drawboring-resurrected/) — It explains how a centuries-old trick made joints that held for generations with no clamps and no glue at all.
- 📄 [Nuki (joinery) (Wikipedia)](https://en.wikipedia.org/wiki/Nuki_(joinery)) — Japan's wedged through-tenon lets a frame flex and soak up earthquake energy without collapsing, a different answer to racking than Western framing gives.

### Lesson 11: Why does a dovetail lock in one direction only?
- ▶ [How to make a Dovetail Joint: The Three Joints (Paul Sellers)](https://www.youtube.com/watch?v=OCYjoj6cfno) — Watching tails and pins cut by hand, then tapped together, makes it obvious why the joint slides together one way and can't pull apart the other.
- ▶ [Dovetail joint vs box joint strength test](https://www.youtube.com/watch?v=cRPgCMmbeyQ) — The dovetail loses to a plain box joint when pulled the 'wrong' way, which shows that its strength depends on direction.
- 📄 [Dovetail vs. box joint strength (woodgears.ca)](https://woodgears.ca/dovetail/strength.html) — The pins sheared off while the glue held, and the author argues that with modern glue, choosing a dovetail just for strength is obsolete, which gives you something to argue about.
- 📄 [Koshikake Ari Tsugi (腰掛蟻継ぎ): Seated Dovetail Splice](https://japanesewoodjoints.com/joint/koshikake-ari-tsugi) — Japanese carpenters use the same flared shape to splice beams end to end, with a seat underneath to carry the weight, so this is the dovetail's lock at building scale.

### Lesson 12: Review: which force does each joint resist, and how does it fail?
- ▶ [What's the Best Wood Joint || Insanely Strong Joinery!](https://www.youtube.com/watch?v=CE147Ow7RmM) — Lots of joints are broken one after another, so you can pause before each break and guess which force it resists and where it will fail.
- 📄 [Wood joint strength testing (woodgears.ca)](https://woodgears.ca/joint_strength/) — One page brings together tests on mortise and tenon, dowel, pocket-hole and screw joints with numbers and failure photos, which makes it a ready-made review sheet.
- 📄 [The Perfection of Traditional Japanese Joinery in Animated Illustrations (Arch2O)](https://www.arch2o.com/perfection-traditional-japanese-joinery-animated-illustrations-gifs/) — Looping animations take complex Japanese joints apart, so you can work out which force each interlocking face is there to resist.
- 🕹 [Tsugite: free interactive software for designing Japanese wood joints (designboom)](https://www.designboom.com/technology/free-interactive-software-easily-complex-japanese-wooden-joints-furniture-04-13-2021/) — University of Tokyo software lets you design your own interlocking joint and checks whether it can actually be assembled and will stay locked.
