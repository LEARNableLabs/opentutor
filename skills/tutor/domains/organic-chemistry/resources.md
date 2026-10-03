# Organic Chemistry — Reaction Mechanisms — Resources

## Primary Sources (for lesson content)

- **Clayden, Greeves & Warren, _Organic Chemistry_ (2nd ed., Oxford University Press)**: the main text. It is mechanism-first and has the arrow-pushing rigor this curriculum needs. Every lesson should cite a specific chapter.
- **Grossman, _The Art of Writing Reasonable Organic Reaction Mechanisms_ (2nd ed., Springer)**: a problem-driven text on what makes a mechanism reasonable. Use it for the exercises in the polar, radical and pericyclic modules.
- **Anslyn & Dougherty, _Modern Physical Organic Chemistry_ (University Science Books)**: the source for the energy-surface, Hammond, Curtin–Hammett, KIE, Hammett and linear free-energy lessons.
- **Fleming, _Molecular Orbitals and Organic Chemical Reactions_ (Wiley)**: the reference for the FMO, Diels–Alder, 1,3-dipolar and Woodward–Hoffmann lessons.
- **Reich, Organic Chemistry Data (pKa tables, NMR, reaction data)**: https://organicchemistrydata.org/ . Use it for pKa-based acid/base and leaving-group reasoning.

## Primary Literature (evidence lessons, ML lessons, nucleophilicity and cross-coupling)

- Mayr & Patz, "Scales of Nucleophilicity and Electrophilicity: A System for Ordering Polar Organic and Organometallic Reactions", _Angew. Chem. Int. Ed. Engl._ 1994, 33, 938. https://doi.org/10.1002/anie.199409381
- Mayr, Kempf & Ofial, "π-Nucleophilicity in Carbon–Carbon Bond-Forming Reactions", _Acc. Chem. Res._ 2003, 36, 66. https://doi.org/10.1021/ar020094c
- **Mayr's Database of Reactivity Parameters** (N, s_N, E): https://www.cup.lmu.de/oc/mayr/reaktionsdatenbank2/ . Use this one URL in lessons 10 and 29 and here. Check that it is live before shipping, and fall back to `/reaktionsdatenbank/` only if it is not. Mayr's equation covers nucleophiles reacting with carbocations, Michael acceptors and other π-electrophiles. It does not cover SN2 at sp3 carbon, where Swain–Scott n applies.
- Miyaura & Suzuki, "Palladium-Catalyzed Cross-Coupling Reactions of Organoboron Compounds", _Chem. Rev._ 1995, 95, 2457. https://doi.org/10.1021/cr00039a007
- Schwaller et al., "Molecular Transformer: A Model for Uncertainty-Calibrated Chemical Reaction Prediction", _ACS Cent. Sci._ 2019, 5, 1572. https://doi.org/10.1021/acscentsci.9b00576
- Wei, Duvenaud & Aspuru-Guzik, "Neural networks for the prediction organic chemistry reactions" (2016). http://arxiv.org/abs/1608.06296
- Baranwal & Vyas, "ChemPro: A Progressive Chemistry Benchmark for Large Language Models" (2026). http://arxiv.org/abs/2602.03108
- Clever Hans and dataset-bias analyses of reaction-prediction models (lesson 54): find the exact papers by literature search and verify the DOI before citing. Do not cite from memory.

## Supplementary (for engagement)

- **Master Organic Chemistry** (James Ashenhurst): https://www.masterorganicchemistry.com/ . It has clear, mechanism-by-mechanism write-ups. Link to the specific reaction page for the lesson, not the homepage.
- **Nobel Prize summaries** (context for the people and ideas in the curriculum):
  - 1981, Fukui and Hoffmann (FMO and orbital symmetry): https://www.nobelprize.org/prizes/chemistry/1981/summary/
  - 2010, Heck, Negishi and Suzuki (Pd cross-coupling): https://www.nobelprize.org/prizes/chemistry/2010/summary/
  - 2018, Arnold (directed evolution; enzymatic carbene transfer is a rabbit hole): https://www.nobelprize.org/prizes/chemistry/2018/summary/
  - 2021, List and MacMillan (enamine and iminium organocatalysis): https://www.nobelprize.org/prizes/chemistry/2021/summary/
  - 2022, Bertozzi, Meldal and Sharpless (click and bioorthogonal chemistry): https://www.nobelprize.org/prizes/chemistry/2022/summary/
- **Wikipedia** (a quick orientation, no more than about 30% of any lesson's links):
  - Baldwin's rules: https://en.wikipedia.org/wiki/Baldwin%27s_rules
  - Woodward–Hoffmann rules: https://en.wikipedia.org/wiki/Woodward%E2%80%93Hoffmann_rules
  - Hammett equation: https://en.wikipedia.org/wiki/Hammett_equation
  - Curtin–Hammett principle: https://en.wikipedia.org/wiki/Curtin%E2%80%93Hammett_principle
- **ChemTube3D** and **MIT OCW 5.12**: link only to a specific mechanism animation or lecture page that the builder has verified for the lesson. If no such page exists, drop the link. Do not link course or home pages.

## People to look up

Herbert Mayr, Roald Hoffmann, Kenichi Fukui, Robert Burns Woodward, Jack Baldwin, Louis Hammett, Akira Suzuki, Ei-ichi Negishi, Rolf Huisgen, Carolyn Bertozzi, Abigail Doyle, Frances Arnold, Benjamin List, David MacMillan.

## Unexpected connections

- Sulfur mustard (lesson 16): its aziridinium/episulfonium chemistry led to nitrogen-mustard chemotherapy. Teach it with its historical and ethical context.
- Vitamin D (lesson 44): a photochemical 6π conrotatory ring opening followed by a thermal antarafacial [1,7]-H shift.
- Chorismate mutase (lesson 45): an enzyme-catalysed [3,3] sigmatropic rearrangement.
- Thiolase and fatty-acid synthase (lesson 28): the biological Claisen condensation.
- Ibrutinib's acrylamide warhead (lesson 29): a Michael acceptor used in covalent drug design.
- Lanosterol cyclisation (review 20): a cation cascade in one enzyme step.

## Lesson by lesson

Found by web search; every link was checked.

### Lesson 1: Where do the electrons actually go — and how do we write it down unambiguously?
- ▶ [Why Most People Mess Up Curved Arrows in Organic Chemistry (Organic Chemistry with Victor)](https://www.youtube.com/watch?v=nx44QhGY-S0) — It is built around the arrow mistakes that cost exam marks, so you learn the rules by seeing exactly how they get broken.
- ▶ [Curve Arrow Notation – Electron Pushing Arrows (The Organic Chemistry Tutor)](https://www.youtube.com/watch?v=UVpizSVIBX0) — A quick run of worked examples where every arrow goes from a lone pair or bond to a sink, and you check each one by tracking the formal charges.
- 📄 [The iconic curly arrow (Chemistry World)](https://www.chemistryworld.com/feature/the-iconic-curly-arrow/3004840.article) — The curly arrow was invented in 1922 to solve one puzzle: why butadiene and bromine give only 1,2- and 1,4-products. This is the story of how it became chemistry's shared language.

### Lesson 2: Why does a nucleophile attack exactly where it does? HOMO meets LUMO
- ▶ [Introduction to HOMO LUMO Interactions in Organic Chemistry (Organic Chemistry with Victor)](https://www.youtube.com/watch?v=v-B52CDasX8) — After this you can treat 'nucleophile' and 'electrophile' as a filled orbital meeting an empty one, which predicts where the attack happens.
- ▶ [SN2 Displacements. Why are they called "backside attacks"? (Kevin Burgess)](https://www.youtube.com/watch?v=ctzv5o4RGXE) — A research chemist explains that backside attack is not a rule to memorise: it is simply where the big lobe of σ* is.
- 📄 [Reactivity in Chemistry: Carbonyl molecular orbitals (Chris Schaller, CSB/SJU)](https://employees.csbsju.edu/cschaller/Reactivity/Carbonyl/COMO.htm) — It draws the carbonyl π* LUMO, and the picture shows why nucleophiles go for the carbon and not the more electronegative oxygen.
- 📄 [Bürgi–Dunitz angle (Wikipedia)](https://en.wikipedia.org/wiki/B%C3%BCrgi%E2%80%93Dunitz_angle) — Crystal structures from the 1970s showed nucleophiles come in at about 107°, not 90°. It is a measurable fingerprint of orbital overlap.

### Lesson 3: Why is pKa the single most useful number when writing a mechanism?
- ▶ [Using pKa values to predict the position of equilibrium (Khan Academy Organic Chemistry)](https://www.youtube.com/watch?v=ve5hfX3ywk0) — With two pKa values and no memorised reactions, you can tell which way a proton transfer will go.
- 📄 [What Makes a Good Leaving Group? (Master Organic Chemistry)](https://www.masterorganicchemistry.com/?p=1474) — It shows that a pKa table doubles as a leaving-group ranking, and why fluoride is the famous exception.
- 📑 [Evans pKa Table (Ripin & Evans)](https://www.chem.tamu.edu/rgroup/begley/Organic%20Chemistry%20Tools/evans_pKa_table.pdf) — Many working synthetic chemists keep this table pinned above their desks. Look at how many pKa units lie between acids you thought were similar.
- 🕹 [Bordwell pKa Table (Hans Reich, organicchemistrydata.org)](https://organicchemistrydata.org/hansreich/resources/pka/) — A searchable database of real DMSO pKa values, handy for checking whether the base in your mechanism can actually do the deprotonation you drew.

### Lesson 4: Is that bump on the energy diagram a transition state or an intermediate — and which step sets the rate?
- ▶ [Transition states and intermediates (Roxi Hulet)](https://www.youtube.com/watch?v=-DqG1GUtjUs) — It focuses on one test: a valley holds a species you could in principle catch, while a peak is never more than a fleeting moment.
- ▶ [Multistep reaction energy profiles (Khan Academy)](https://www.khanacademy.org/science/chemistry/chem-kinetics/arrhenius-equation/v/multistep-reaction-energy-profiles) — It shows how to read the rate-determining step straight off a multi-hump energy diagram and connect it to the rate law.
- 📄 [Nobel Prize in Chemistry 1999: Ahmed Zewail, femtochemistry (press release)](https://www.nobelprize.org/prizes/chemistry/1999/press-release/) — Transition states were thought impossible to observe until Zewail's femtosecond lasers caught bonds in the act of breaking.

### Lesson 5: Why does a transition state look like whichever neighbour is closest in energy?
- ▶ [The Hammond Postulate (Michael Evans)](https://www.youtube.com/watch?v=dpBEPksr0xU) — A university lecturer explains the one idea that lets you guess what an unobservable transition state looks like.
- 📄 [Hammond's Postulate (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2011/09/28/hammonds-postulate) — It boils the postulate down to a drawing rule you can use right away: put the hump next to whichever species is higher in energy.
- ▶ [The Hammond Postulate and Selectivity (BiochemFAST)](https://www.youtube.com/watch?v=nNubeKtLGBI) — It explains a real puzzle: bromine radicals are much pickier than chlorine radicals, and the late transition state is the reason.

### Lesson 6: Why is a tertiary carbocation comfortable while a primary one barely exists?
- ▶ [Why Are Tertiary Carbocations Stable? Understanding Hyperconjugation (ChemComplete)](https://www.youtube.com/watch?v=ZRp4F6ktSB0) — It replaces the vague 'alkyl groups donate electrons' with the actual picture: C–H σ bonds leaking electron density into the empty p orbital.
- 📄 [3 Factors That Stabilize Carbocations (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2011/03/11/3-factors-that-stabilize-carbocations/) — It sorts carbocation stability into three checks (substitution, adjacent π bonds, adjacent lone pairs) that you can run on any cation you write.
- 📑 [George Olah Nobel Lecture: My Search for Carbocations and Their Role in Chemistry](https://www.nobelprize.org/prizes/chemistry/1994/olah/lecture/) — Olah describes using 'magic acid' to make carbocations last long enough to study by NMR, after decades in which they could only be inferred.
- 📄 [Crystal structure of the nonclassical 2-norbornyl cation ends 50-year controversy (ScienceDaily)](https://sciencedaily.com/releases/2013/07/130709124000.htm) — Two Nobel laureates fought for decades over one carbocation's structure, and a crystal grown at 40 K finally settled it.

### Lesson 7: Can you write a charge-balanced mechanism and its energy diagram from scratch?
- ▶ [Curve Arrow Notation - Electron Pushing Arrows (The Organic Chemistry Tutor)](https://www.youtube.com/watch?v=UVpizSVIBX0) — It drills one rule (arrows start at electrons, never at atoms or charges), and that rule is what keeps a mechanism you write from scratch charge-balanced.
- ▶ [Hammond Postulate - A tool for reaction mechanisms (Organic Chemistry Explained!)](https://www.youtube.com/watch?v=Et0Y7z-sLUg) — It treats Hammond as a tool you use: once you know which side of the hill is higher, you can guess what an unseen transition state looks like.
- 📄 [Hammond's Postulate (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2011/09/28/hammonds-postulate) — It boils the postulate down to one sketching rule: put the hump closest to whichever species is highest in energy, so your energy diagrams stop being guesswork.
- 📄 [Predicting Acid-Base Reactions from pKa Values (LibreTexts)](https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_(Morsch_et_al.)/02%3A_Polar_Covalent_Bonds_Acids_and_Bases/2.08%3A_Predicting_Acid-Base_Reactions_from_pKa_Values) — Keq = 10^ΔpKa means a pKa table tells you how far a proton-transfer step goes before you draw a single arrow.

### Lesson 8: Why does SN2 turn a molecule inside out?
- ▶ [Sn2 mechanism: stereospecificity (Khan Academy Organic Chemistry)](https://www.youtube.com/watch?v=eaQyzkAZGjM) — It follows one chiral carbon from start to finish, so you can see that going R to S is forced by the geometry and is not a naming trick.
- 🕹 [The SN2 Reaction: animation (Reusch, Michigan State)](https://www2.chemistry.msu.edu/faculty/reusch/VirtTxtJml/sn2mov.htm) — In this animation you watch the three substituents snap through a flat transition state like an umbrella in a gale.
- 📄 [The SN2 Mechanism (Master Organic Chemistry)](https://www.masterorganicchemistry.com/?p=5333) — It connects the 180° approach to the reactivity order methyl > 1° > 2° >> 3°, so steric hindrance at the back of the carbon explains both the inversion and the rate trend.

### Lesson 9: Why does SN1 scramble stereochemistry — but rarely completely?
- ▶ [7.2c Racemization in SN1 Reactions (Chad's Prep)](https://www.youtube.com/watch?v=f8ZitqJOMcM) — A short, clear look at why a flat carbocation should give a 50:50 mix, which sets up why real reactions don't.
- ▶ [Intimate Ion Pair - Racemic Mixtures - SN1 Reaction (The Organic Chemistry Tutor)](https://www.youtube.com/watch?v=5EJ5-uZufZ8) — It shows the departing leaving group lingering on one face and blocking it, which is where the extra inversion product comes from.
- 📄 [11.4 The SN1 Reaction (OpenStax via NC State)](https://ncstate.pressbooks.pub/organicchem/chapter/the-sn1-reaction/) — It gives real numbers (usually 0–20% excess inversion) and tells how Saul Winstein explained them with ion pairs, so 'rarely completely' has data behind it.
- 📄 [Grunwald–Winstein equation (Wikipedia)](https://en.wikipedia.org/wiki/Grunwald%E2%80%93Winstein_equation) — It shows how chemists turned 'how good is this solvent at pulling ions apart?' into a single number, Y, measured from how fast tert-butyl chloride falls apart.

### Lesson 10: Can one number predict how fast a nucleophile reacts — and where does that number stop working?
- ▶ [Basicity vs Nucleophilicity - Steric Hindrance (The Organic Chemistry Tutor)](https://www.youtube.com/watch?v=3vyeQ8DC_D8) — tert-Butoxide is a strong base but a poor nucleophile, a quick case of the two rankings coming apart.
- ▶ [Science Talks Lecture 159: Do General Nucleophilicity Scales Exist? (ACS Productions)](https://www.youtube.com/watch?v=s0PVmUT5G4s) — A lecture on the very question this lesson asks: can one nucleophilicity number work everywhere? It is longer than a typical explainer.
- 🕹 [Mayr's Database of Reactivity Parameters (LMU München)](https://www.cup.lmu.de/oc/mayr/reaktionsdatenbank2/) — Look up N, s_N and E for more than a thousand nucleophiles and hundreds of electrophiles, plug them into log k = s_N(N + E), and predict a rate constant yourself.
- 📑 [A Quantitative Approach to Nucleophilic Organocatalysis (Mayr et al., Beilstein J. Org. Chem. 2012, open access)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3458771) — It states the equation's accuracy openly (within a factor of 10–100 across 40 orders of magnitude) and names where it breaks: concerted pericyclic reactions and reactions that need general base catalysis.

### Lesson 11: Why must the E2 hydrogen be antiperiplanar — and what does a cyclohexane chair do to that?
- ▶ [7.7c The Stereospecificity of E2 Reactions: Anti periplanar (Chad's Prep)](https://www.youtube.com/watch?v=FZKTSHLh84I) — It shows why the C–H and C–X bonds have to line up anti, and why one diastereomer gives only E and the other only Z.
- 🕹 [Stereospecific E2 eliminations from menthol diastereomers: Jmol models (University of Liverpool)](https://www.liverpool.ac.uk/~ngreeves/ltfdemo/jmol/E2Menthyl.html) — Flip the chair yourself and see that menthyl chloride has to push all three groups axial before it can eliminate.
- 📄 [11.9 The E2 Reaction and Cyclohexane Conformation (OpenStax)](https://openstax.org/books/organic-chemistry/pages/11-9-the-e2-reaction-and-cyclohexane-conformation) — Neomenthyl chloride eliminates 200 times faster than its isomer and gives a different alkene, purely because of which chair it prefers to sit in.
- 📄 [The E2 Reaction and Cyclohexane Rings (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2012/10/18/the-e2-reaction-and-cyclohexane-rings/) — It works through cases where the trans-diaxial requirement beats Zaitsev's rule, so the 'wrong' alkene becomes predictable.

### Lesson 12: Who chooses between Zaitsev and Hofmann — the base, the leaving group or the mechanism?
- ▶ [Zaitsev vs Hoffman's Product - E2 Elimination Reactions (The Organic Chemistry Tutor)](https://www.youtube.com/watch?v=bTS-mINzs2U) — Swap ethoxide for tert-butoxide and the major product changes, a clean test of whether the base is the one choosing.
- ▶ [E2 Exceptions: Why Zaitsev Fails (Chemistry in a Nutshell)](https://www.youtube.com/watch?v=sN1PFc2xkYU) — A short clip on the cases where the textbook 'most substituted alkene' answer turns out wrong.
- 📄 [The Hofmann Elimination (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2017/10/18/the-hofmann-elimination/) — Here the leaving group (a bulky trialkylammonium), not the base, pushes the reaction to the less substituted alkene, the other suspect in this lesson's question.
- 📄 [E1cB-elimination reaction (Wikipedia)](https://en.wikipedia.org/wiki/E1cB-elimination_reaction) — When the β-H is acidic and the leaving group is poor, the carbanion forms first, so the mechanism itself can decide which alkene you get.

### Lesson 13: SN1, SN2, E1, E2 or E1cB — can you call it in under a minute and justify it?
- ▶ [SN1/SN2/E1/E2: Don't Guess, *Know* Which Mechanism!](https://www.youtube.com/watch?v=N2ppCPP8B1I) — It treats the four-way choice as reasoning you can defend instead of a flowchart to memorize, which is exactly what you need to call it in under a minute.
- ▶ [SN2 SN1 E1 E2 Reaction Mechanisms Made Easy! (The Organic Chemistry Tutor)](https://www.youtube.com/watch?v=hz-fSXifP9w) — It ends with one compact chart that predicts the major product from any alkyl halide and set of conditions, and you can test yourself against it.
- ▶ [Elimination from Saturated Carbon – E1, E2 and E1cB](https://www.youtube.com/watch?v=2KYa-PnBWfU) — Most decision guides leave out the fifth option; this one shows E1cB as the case where the carbanion forms first and the leaving group goes last.
- 📄 [Deciding SN1/SN2/E1/E2 (2): The Nucleophile/Base (Master Organic Chemistry)](https://www.masterorganicchemistry.com/?p=6762) — It shows that one question, charged or neutral, cuts the four mechanisms down to two, and then shows the tricky cases where that shortcut fails.

### Lesson 14: If the less stable conformer reacts faster, which product wins?
- ▶ [Alternative Reaction Pathways: The Curtin Hammett Principle](https://www.youtube.com/watch?v=FaJgvdb9YyI) — It works through the surprising result that the conformer you can barely detect can still give the main product, and shows why.
- ▶ [Curtin–Hammett Principle Explained with Animation](https://www.youtube.com/watch?v=5DAapo9JDFY) — The animated energy diagram lets you watch the product ratio follow the gap between the two transition states while ignoring which conformer is more populated.
- 📄 [Curtin–Hammett principle (Wikipedia)](https://en.wikipedia.org/wiki/Curtin%E2%80%93Hammett_principle) — It covers all three cases (the major conformer reacts faster, both react at the same rate, or the minor conformer wins) with real examples, so you can turn a ΔΔG‡ into a product ratio yourself.
- 📑 [Investigating the diastereoselective synthesis of a macrocycle under Curtin–Hammett control](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11023033/) — This open-access paper shows chemists using the principle on purpose to choose which diastereomer of a ring they make, not just using it to explain results afterwards.

### Lesson 15: Why would a carbocation move a methyl group — and how does the pinacol rearrangement exploit that?
- ▶ [An Introduction To Carbocation Rearrangements (1,2-hydride shifts & 1,2-methyl shifts)](https://www.youtube.com/watch?v=BfJR9zUYfY8) — It shows the carbocation moving a hydride or methyl one carbon over just to sit on a more substituted, more stable carbon, which is the whole Wagner–Meerwein idea.
- ▶ [Pinacol Rearrangement: Complete Mechanism & Step-by-Step Practice Problems](https://www.youtube.com/watch?v=CIhApQUSF10) — It walks through practice problems on choosing which OH leaves and which group moves, which is where migratory aptitude decides the answer.
- 📄 [The Pinacol Rearrangement (Master Organic Chemistry)](https://masterorganicchemistry.com/2023/01/10/pinacol-rearrangement) — It shows that the shift happens because the new cation is stabilised by the oxygen next to it, which gives every atom a full octet, so the outcome is driven by thermodynamics.
- 📑 [Recent development and applications of semipinacol rearrangement reactions (Chemical Science, open access)](https://pubs.rsc.org/en/content/articlehtml/2021/sc/d1sc02386a) — Skim the figures to see the same 1,2-shift used to build hard quaternary carbon centres in natural product synthesis today.

### Lesson 16: How can a sulfur atom two carbons away turn an alkyl chloride into a weapon — and the idea behind the first chemotherapy?
- ▶ [Mustard Gas: From WW1 to Chemotherapy](https://www.youtube.com/watch?v=4ejrFUZnrwA) — It follows one molecule from the trenches of the First World War to the first cancer drug, and the reason behind both is the sulfur or nitrogen atom two carbons from the chloride.
- 📄 [Anchimeric Assistance (Neighboring Group Participation) (Nathan Bauld, UT Austin)](https://research.cm.utexas.edu/nbauld/Anchimeric.htm) — It sets out the two signs of neighbouring-group participation: a huge rate boost and an unexpected retention of configuration caused by two inversions in a row.
- ▶ [Excellent visualization of SNi mechanism (also neighboring group participation, chemistry animation)](https://www.youtube.com/watch?v=o7IMMB2AcfA) — The animation lets you see the internal attack form the three-membered ring and then watch the outside nucleophile open it from the back.
- 📄 [Doubted molecular structure confirmed (FAU Erlangen, on the 2-norbornyl cation)](https://www.nat.fau.eu/2013/07/12/doubted-molecular-structure-confirmed/) — Two Nobel laureates, Olah and Brown, argued in public for decades over the nonclassical ion until a crystal structure measured at −233 °C settled it in 2013.

### Lesson 17: Why do Br2 and Hg(OAc)2 add anti — and why don't they rearrange?
- ▶ [Why Do Alkene Halogenations Always Proceed with 'Anti' Stereochemistry?](https://www.youtube.com/watch?v=1bWZR__InTQ) — It answers the 'why' directly: the bridged bromonium ion blocks one face of the molecule, so bromide can only attack from the back.
- ▶ [Oxymercuration-Demercuration Mechanism – Organic Chemistry](https://www.youtube.com/watch?v=7yDAm0R9Xvo) — It shows how the mercurinium bridge gives Markovnikov water addition without carbocation rearrangements, the problem that spoils simple acid-catalysed hydration.
- 📄 [Oxymercuration (LibreTexts, Purdue Chem 266)](https://chem.libretexts.org/Courses/Purdue/Purdue%3A_Chem_26605%3A_Organic_Chemistry_II_(Lipton)/Chapter_11.__Addition_to_pi_Systems/11.1%3A_Electrophilic_Addition/11.1.2_Electrophilic_Addition_to_Alkenes/11.1.2.3%3A_Oxymercuration) — It puts the mercurinium ion next to the halonium ion so you can see that one three-membered-ring idea explains anti addition, regiochemistry and the lack of rearrangement.

### Lesson 18: How does hydroboration put the OH on the 'wrong' carbon, syn?
- ▶ [Hydroboration Oxidation Mechanism of Alkenes – BH3, THF, H2O2, OH-](https://www.youtube.com/watch?v=Ux9BEDgfZBg) — It follows the full sequence from the four-centre addition to the B→O migration step that keeps the stereochemistry, so you can see where 'syn' and 'anti-Markovnikov' each come from.
- 📄 [Hydroboration-Oxidation of Alkenes (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2013/03/28/hydroboration/) — It explains why the OH ends up on the less substituted carbon: boron adds there for both steric and electronic reasons, and a concerted step leaves no carbocation to rearrange.
- 📑 [From Little Acorns to Tall Oaks – from Boranes through Organoboranes (H.C. Brown, Nobel Lecture 1979)](https://www.nobelprize.org/prizes/chemistry/1979/brown/lecture/) — In his own words, the discoverer tells how a curiosity about boron hydrides grew into one of the most used reactions in synthesis.

### Lesson 19: Why does an epoxide open at the more substituted carbon in acid but the less substituted one in base?
- ▶ [13.6 Ring Opening of Epoxides (Chad's Prep)](https://www.youtube.com/watch?v=j4yPeJI9gn0) — Chad puts the acid and base openings next to each other on the same epoxide, so you watch the nucleophile switch carbons and the reason for it is easy to see.
- ▶ [Alkene Epoxidation Reaction Mechanism - Peroxy Acid MCPBA](https://www.youtube.com/watch?v=k-RKOC9olL0) — In one concerted step, a peracid passes an oxygen atom to an alkene and moves several bonds at once, which shows why the alkene's geometry carries over unchanged into the epoxide.
- 📄 [Opening of Epoxides With Acid (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2015/02/02/opening-of-epoxides-with-acid/) — It explains the 'more substituted carbon' rule as a tug-of-war, with SN1 and SN2 character pulling against each other, and compares it to bromonium-ion openings you already know.
- 📄 [Opening of Epoxides: Acidic versus Basic Conditions (LibreTexts)](https://chem.libretexts.org/Courses/Nassau_Community_College/Organic_Chemistry_I_and_II/08%3A_Reactions_of_Alkenes/8.14%3A_Opening_of_Epoxides_-_Acidic_versus_Basic_Conditions) — This free open-textbook page shows why the acid-side rule only flips cleanly when one carbon is tertiary, a detail many summaries leave out.

### Lesson 20: How does one enzyme fold a linear chain into four rings? Reviewing cations through the lanosterol cascade
- ▶ [Hydride Shift vs Methyl Shift - Carbocation Rearrangement](https://www.youtube.com/watch?v=k4JX32SK21c) — A quick review of 1,2-shifts, which the lanosterol enzyme performs four times in a row (two hydride shifts and two methyl shifts) after it closes the rings.
- 📄 [27.7 Biosynthesis of Steroids (OpenStax Organic Chemistry)](https://openstax.org/books/organic-chemistry/pages/27-7-biosynthesis-of-steroids) — It draws every arrow of the oxidosqualene-to-lanosterol cascade, so you can check your carbocation reasoning one step at a time against a free textbook.
- 🕹 [Human Oxidosqualene Cyclase structure 1W6K (RCSB PDB)](https://rcsb.org/structure/1w6k) — You can turn the real enzyme around in 3D and look at the closed pocket where aromatic side chains hold the cations steady during the cascade.
- 📄 [Lanosterol synthase (Wikipedia)](https://en.wikipedia.org/wiki/Lanosterol_synthase) — It describes this as one of the most complex reactions any known enzyme performs: four alkylations and four shifts in a single active site, with the substrate first squeezing through a narrow channel to get in.

### Lesson 21: Why do nucleophiles hit a carbonyl at about 107°, not 90°?
- ▶ [Burgi Dunitz Trajectory: Basic concept and application in Aldol-type condensation](https://www.youtube.com/watch?v=U0UvgnbeCqA) — It applies the approach angle to real aldol stereochemistry, so the angle stops being trivia and starts predicting products.
- 📄 [Bürgi–Dunitz angle (Wikipedia)](https://en.wikipedia.org/wiki/B%C3%BCrgi%E2%80%93Dunitz_angle) — The angle was not worked out from theory. Bürgi and Dunitz measured it from crystal structures, treating them as frozen snapshots of an amine partway through attacking a carbonyl.
- 📄 [The Bürgi–Dunitz angle revisited: a mystery? (Henry Rzepa's blog)](https://www.ch.imperial.ac.uk/rzepa/blog/?p=14016) — A computational chemist re-runs the original crystal-database search in public and finds that the textbook number is less settled than it looks.
- 📑 [Unraveling the Bürgi-Dunitz Angle with Precision: A Two-Dimensional Energy Decomposition Analysis](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10601473/) — This open-access paper shows that π* overlap is only part of the answer: Pauli repulsion and the strain of bending the carbonyl also set the ~107° angle.

### Lesson 22: Why can NaBH4 sit in methanol when a Grignard can't survive a drop of water?
- ▶ [19.8 Hydride Reduction Reactions (Chad's Prep)](https://www.youtube.com/watch?v=xSyO_lBJPDE) — It explains how NaBH4 and LiAlH4 differ in reactivity using bond polarity, which is also why only the gentler one tolerates methanol.
- ▶ [Why do we make Grignard Reagents in Ether (why not water?)](https://www.youtube.com/watch?v=4CaAuyDpRpE) — It frames the problem as a pKa comparison: a carbanion with a pKa near 50 meets water at about 16, and the carbanion loses immediately.
- 📄 [19.7 Nucleophilic Addition of Hydride and Grignard Reagents (OpenStax)](https://openstax.org/books/organic-chemistry/pages/19-7-nucleophilic-addition-of-hydride-and-grignard-reagents-alcohol-formation) — It shows hydride and Grignard additions side by side, including the Mg2+ activation step and the separate workup protonation, so the parallel mechanisms are easy to compare.
- 📄 [Water Tames Grignard and Organolithium Reagents (ChemistryViews)](https://chemistryviews.org/?p=38971) — This is a surprise result: under the right conditions, Grignard and organolithium chemistry can run in water, against the 'never a drop of water' rule this lesson starts from.

### Lesson 23: Why does an acetal need acid to form and acid to fall apart — and why do sugars prefer an axial OR?
- ▶ [19.4a Formation of Hemiacetals and Acetals (Chad's Prep)](https://www.youtube.com/watch?v=rmhcAMDUXwM) — Chad tracks every proton on and off through the oxocarbenium ion, and once you see that bookkeeping, hydrolysis is just the same steps run backwards.
- ▶ [16.05 Anomers, Mutarotation, and the Anomeric Effect](https://www.youtube.com/watch?v=FTK_X7ZmteQ) — It goes from glucose rings opening and closing in solution to the odd fact that an OR group on a sugar often prefers the crowded axial position.
- 📄 [Anomeric effect (Wikipedia)](https://en.wikipedia.org/wiki/Anomeric_effect) — It sets out the competing explanations, hyperconjugation versus dipole and electrostatic arguments, and shows the textbook story is still argued over.
- 📄 [Anomeric effect cannot be explained by hyperconjugation alone (Chemistry World)](https://www.chemistryworld.com/news/anomeric-effect-cannot-be-explained-by-hyperconjugation-alone/4022751.article) — A news piece on new quantum calculations that challenge the n→σ* explanation you are likely being taught right now.

### Lesson 24: Why does a primary amine give an imine but a secondary amine an enamine — and why did that win a Nobel Prize?
- ▶ [19.6b Addition of Secondary Amines: Enamine Formation (Chad's Prep)](https://www.youtube.com/watch?v=TvtRgoJxqLc) — It shows why the reaction changes course: once the nitrogen has no N–H left to lose, the iminium sheds a proton from carbon instead, and that gives an enamine.
- 📄 [Popular information: Nobel Prize in Chemistry 2021 (NobelPrize.org)](https://www.nobelprize.org/prizes/chemistry/2021/popular-information/) — The Nobel committee's own plain-language account of how a small organic molecule like proline, working through an enamine, became a tool for making one mirror-image form selectively.
- ▶ [Interview with 2021 Nobel laureate Benjamin List about Asymmetric Organocatalysis](https://www.youtube.com/watch?v=3R6-jPWyidw) — List describes how a 'maybe this is stupid' experiment with proline led to a Nobel Prize, which makes enamine catalysis feel like a discovery rather than a list of reagents.
- 📄 [Enamines (Master Organic Chemistry)](https://masterorganicchemistry.com/?p=3771) — It shows enamines acting as milder, neutral stand-ins for enolates in alkylations, which is the reactivity that organocatalysis builds on.

### Lesson 25: How does aspirin permanently switch off an enzyme? Acyl transfer in action
- ▶ [Aspirin - mechanism of action, acetylsalicylic acid action mechanism](https://www.youtube.com/watch?v=VJr1LvRx3hk) — It shows the acetyl group leaving the drug and staying on the enzyme for good, so you see why one pill affects a platelet for the rest of its life.
- ▶ [Nucleophilic Acyl Substitution 3: Leaving Group Ability and pKa](https://www.youtube.com/watch?v=6KlUPoGHVBg) — It turns the reactivity order of acyl compounds into one rule you can work out from pKa: the weaker the base that leaves, the faster the reaction.
- 🕹 [Visualizing Inhibition of Cyclooxygenase by Aspirin (CSU San Marcos, JSmol)](https://public.csusm.edu/jayasinghe/visualizing-inhibition-of-cyclooxygenase-by-aspirin.html) — You can rotate the real COX-1 structure yourself and find the serine that aspirin acetylates inside the channel where arachidonic acid would normally bind.
- 📄 [A Brief History of Aspirin (Smithsonian)](https://www.smithsonianmag.com/smart-news/brief-history-aspirin-180964329/) — It covers 4,000 years from Sumerian willow bark to a Bayer chemist who acetylated salicylic acid to make it gentler on the stomach, without knowing he had built an enzyme-acetylating reagent.

### Lesson 26: Addition or substitution — when does the tetrahedral intermediate collapse, and which way?
- ▶ [The mechanism for nucleophilic acyl substitution](https://www.youtube.com/watch?v=_M7deYMHYkA) — It slows down the moment the tetrahedral intermediate forms, so you can see that which group gets kicked out decides the product.
- 📄 [Nucleophilic Addition / Elimination in the Reactions of Acyl Chlorides (Chemguide)](https://chemguide.co.uk/mechanisms/addelim/whatis.html) — It uses the clearest arrow-pushing of any free site to show why an acyl chloride collapses toward substitution while an aldehyde stops at addition.
- 📄 [Nucleophilic Acyl Substitution Reactions (Penn State open text)](https://psu.pb.unizin.org/ch220/chapter/nucleophilic-acyl-substitution-reactions/) — It puts the acid-catalysed and base-promoted routes side by side, which makes the proton bookkeeping a checklist you can check yourself against.

### Lesson 27: Why does LDA at −78 °C choose a different enolate than NaOEt at room temperature?
- ▶ [Enolate Chemistry - Kinetic vs Thermodynamic Enolate Control](https://www.youtube.com/watch?v=0inUP3alKOY) — It shows how base, temperature and time each push the same ketone to deprotonate on different sides.
- ▶ [11.06 Bases for Enolate Formation](https://www.youtube.com/watch?v=QSDL22_EhrA) — It compares pKa values to show why NaOEt only makes a small equilibrium amount of enolate while LDA converts the ketone completely, and why that difference matters for control.
- 📄 [Henry Rzepa's blog: kinetic vs thermodynamic enolisation](https://www.ch.imperial.ac.uk/rzepa/blog/?p=11512) — A computational chemist calculates the two transition states and the two enolates, so the textbook rule becomes real energy numbers.
- 📄 [Aldol Reactions (Reusch Virtual Textbook)](https://organicchemistrydata.org/reusch/virtualtext/aldol-reactions/) — It explains the trick behind the directed aldol: add the ketone slowly to excess LDA at −78 °C so the ketone never gets the chance to react with itself.

### Lesson 28: How does your body build fatty acids with a textbook Claisen condensation?
- ▶ [13.03 Mechanism of the Claisen Condensation](https://www.youtube.com/watch?v=u4Dpo8OuRAM) — It shows that every step is reversible except the last deprotonation, and that step is what makes the reaction go.
- ▶ [Biosynthesis of Fatty Acids](https://www.youtube.com/watch?v=UUsG5oguR5E) — It has a timestamped section on malonyl-ACP condensation where CO₂ loss, not a strong base, generates the enolate, and this is how your liver does a Claisen at pH 7.
- 📄 [Claisen Condensation (Soderberg, Organic Chemistry with a Biological Emphasis)](https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Book%3A_Organic_Chemistry_with_a_Biological_Emphasis_v2.0_(Soderberg)/13%3A_Reactions_at_the_-Carbon_Part_II/13.04%3A_Claisen_Condensation) — It puts the flask reaction, thiolase, fatty-acid synthase and the retro-Claisen that burns fat on one page, so you see they are all the same mechanism.

### Lesson 29: Why does an acrylamide warhead find one cysteine in a kinase? Conjugate addition
- ▶ [Michael addition reaction; 1,2 vs 1,4 Addition](https://www.youtube.com/watch?v=CdiDzwz4cCM) — It works through the basic question for an enone (attack the carbonyl carbon or the β-carbon?) with hard and soft nucleophiles side by side.
- 🕹 [Mayr's Database of Reactivity Parameters (LMU Munich)](https://www.cup.lmu.de/oc/mayr/reaktionsdatenbank2/) — You can look up the actual E value of methyl acrylate or cyclopentenone and estimate the reaction rate with any nucleophile using log k = sN(N + E).
- 📄 [Covalent drugs just got a new 'spring-loaded' warhead (Chemistry World)](https://www.chemistryworld.com/news/covalent-drugs-just-got-a-new-spring-loaded-warhead/4023989.article) — It explains why most covalent drugs use acrylamides to target cysteine, and what goes wrong when an acrylamide bonds to the wrong residue.
- 📑 [Mechanism of covalent binding of ibrutinib to Bruton's tyrosine kinase revealed by QM/MM calculations (Chem. Sci. 2021, open access)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8097726) — The textbook thiol Michael addition turns out to start with a proton transfer to the warhead and finish with a slow keto–enol tautomerisation, and you can follow the figures even without the computational detail.

### Lesson 30: Why does benzene substitute instead of adding?
- ▶ [Electrophilic aromatic substitution mechanism: nitration and acylation of benzene](https://www.youtube.com/watch?v=NtLzBzAGjnM) — It goes from making NO₂⁺ in mixed acid to the σ-complex to losing a proton, which is the full story of why the ring gives up H⁺ instead of adding a nucleophile.
- 📄 [Arenium ion (Wikipedia)](https://en.wikipedia.org/wiki/Arenium_ion) — The Wheland intermediate isn't only a drawing: chemists have crystallised benzenium salts that are stable to 150 °C and measured their bond lengths by X-ray crystallography.
- 📑 [Mechanism and regioselectivity of electrophilic aromatic nitration in solution: the validity of the transition state approach (open access)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5735206/) — It shows that nitration passes through a π-complex and an oriented complex before reaching the σ-complex, and which step is slowest depends on whether the ring is activated or deactivated.

### Lesson 31: Why does –OMe direct ortho/para and –NO2 meta — and where do halogens fit?
- ▶ [More EAS – Electron Donating and Withdrawing Groups: Crash Course Organic Chemistry #38](https://www.youtube.com/watch?v=geIhhMml1W8) — Crash Course's quick pace and clear visuals show that one idea, how well each group stabilises the σ-complex, accounts for both the –OMe and –NO2 results.
- 📄 [Why Are Halogens Ortho-, Para- Directors? (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2018/03/05/why-are-halogens-ortho-para-directors/) — It takes on the oddest group on the list, halogens that slow the ring down but still send electrophiles ortho/para, and shows how the inductive and resonance effects split the work between them.
- ▶ [Halogens are deactivating yet ortho,para directing in electrophilic aromatic substitution](https://www.youtube.com/watch?v=19XyR3EFw9k) — A short video on just the halogen anomaly, so you can test your understanding on the hardest case alone.
- 📑 [Typical Electron-Withdrawing Groups Are ortho, meta-Directors Rather than meta-Directors in Electrophilic Aromatic Substitution](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12053944/) — This open-access paper argues that the textbook 'meta director' label is incomplete, which shows that the rules you just learned are still being tested.

### Lesson 32: How can a nucleophile replace an aryl halide in two completely different ways?
- ▶ [Nucleophilic Aromatic Substitution Reaction Mechanism – Meisenheimer Complex & Benzyne Intermediate](https://www.youtube.com/watch?v=IaplvqRJL1I) — It puts both routes side by side, addition–elimination and elimination–addition, so you can see how one aryl halide ends up as the same product by two very different paths.
- 📄 [Established intermediate in nucleophilic aromatic substitution found to be a rare exception rather than the rule (Chemistry World)](https://chemistryworld.com/news/textbook-aromatic-substitution-mechanism-overthrown/3009288.article) — A news story about a textbook mechanism being overturned: the Meisenheimer complex you just drew may not form in most SNAr reactions.
- 📑 [Kwan, Zeng, Besser & Jacobsen – Concerted nucleophilic aromatic substitutions (Nature Chemistry 2018, open access)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6105541/) — This is the primary paper behind that story; the abstract and figures show how tiny 12C/13C isotope effects were used to tell a one-step reaction from a two-step one.

### Lesson 33: Why does Cl· attack almost any C–H while Br· picks the tertiary one?
- ▶ [10.2 Free Radical Chlorination vs Bromination](https://www.youtube.com/watch?v=07vXkQvN-Ss) — A short side-by-side comparison of Cl· and Br· that shows why the fast, careless radical gives a mixture while the slow, choosy one goes for the tertiary C–H.
- 📄 [Selectivity in Free Radical Reactions (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2013/10/31/selectivity-in-free-radical-reactions/) — The real numbers make the point: chlorination prefers secondary C–H by about 3.6 to 1, bromination by about 97 to 1, and the article uses the Hammond postulate to explain the gap.
- 🕹 [Hammond's Postulate and Selectivity in Free Radical Halogenation (Wolfram Demonstrations)](https://demonstrations.wolfram.com/HammondsPostulateAndSelectivityInFreeRadicalHalogenation/) — You can drag the energy diagrams yourself and watch an early transition state hide the difference between 1° and 3° radicals while a late one makes it large.

### Lesson 34: Polar or radical? Aromatic or carbonyl? Can you sort a mixed set before drawing a single arrow?
- 🕹 [Interactive Organic Mechanisms (University of Oxford)](https://vrchemistry.chem.ox.ac.uk/iom/default.html) — You place the curly arrows yourself across many reaction types, which is the best practice for deciding whether a reaction is polar or radical before you commit.
- 🕹 [OrgChem101 – Organic Mechanisms: Mastering the Arrows (uOttawa, free)](https://orgchem101.uottawa.ca/) — A free module from uOttawa that has been studied in the classroom: students showed measurable gains in mechanism reasoning after about an hour.
- ▶ [Introduction to Radical Reactions/Mechanisms in Organic Chemistry](https://www.youtube.com/watch?v=o-mHSTqwwzg) — It contrasts fishhook arrows with full arrows and the conditions that give a radical away (light, peroxides, NBS), so you have a checklist for sorting a mixed set.

### Lesson 35: Why does HBr add anti-Markovnikov with peroxides — and how does NBS brominate an allylic C–H?
- 📄 [Free-Radical Addition of HBr to Alkenes with ROOR (Master Organic Chemistry)](https://www.masterorganicchemistry.com/2013/04/12/addition-hbr-alkenes-roor-peroxides-free-radical/) — It explains why the product is 'anti-Markovnikov' even though the reaction still forms the most stable intermediate; only the atom that adds first has changed.
- ▶ [Radical Addition of HBr to Alkenes](https://www.youtube.com/watch?v=Mkdfv1oagdw) — Watching the full chain drawn out shows how a trace of peroxide reverses the regiochemistry of the whole reaction.
- ▶ [10.4 Allylic and Benzylic Bromination Using NBS](https://www.youtube.com/watch?v=Qx4BDOjVvIw) — It explains how NBS works as a slow-release source that keeps Br2 too dilute to add across the alkene, so allylic substitution wins.
- 📄 [Morris S. Kharasch (Wikipedia)](https://en.wikipedia.org/wiki/Morris_S._Kharasch) — The history behind the reaction: Kharasch traced the strange HBr results to stray peroxides in 1933, and rival chemists blamed the solvent instead.

### Lesson 36: Why does a 5-hexenyl radical close to a five-membered ring, and how can that be used as a stopwatch?
- 📄 [Radical clock (Wikipedia)](https://en.wikipedia.org/wiki/Radical_clock) — It shows how a 5-hexenyl radical that closes its ring about 2×10^5 times a second can be used as a stopwatch to time other radical reactions.
- ▶ [The Baldwin Rules: Insights in Advanced Organic Chemistry 20](https://www.youtube.com/watch?v=72EDMowgess) — It explains in terms of orbital geometry why the radical closes to the five-membered ring (5-exo-trig) instead of the less strained-looking six-membered ring.
- 📑 [Generation of Alkyl Radicals: From the Tyranny of Tin to the Photon Democracy (open access review)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8009483/) — The title alone is the hook: an open-access review on how chemists escaped toxic Bu3SnH, from silanes to visible-light photoredox catalysis.
- 📄 [Tris(trimethylsilyl)silane (TTMSS) – Organic Chemistry Portal](https://www.organic-chemistry.org/chemicals/reductions/tris%28trimethylsilyl%29silane-ttmss.shtm) — It explains why TTMSS can stand in for tin: its Si–H bond strength (79 kcal/mol) is close to Sn–H (74 kcal/mol), so it can run the same chain without tin's toxicity.
