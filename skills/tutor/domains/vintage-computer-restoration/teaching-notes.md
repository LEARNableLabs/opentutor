# Vintage Computer Restoration — Teaching Notes

## Approach

Vintage computer restoration is **hands-on forensics meets engineering**. The pedagogy centers on developing diagnostic intuition through pattern recognition, not rote memorization. At intermediate level, students should already understand basic electronics, so focus on **synthesis**: combining visual inspection, electrical testing, and historical knowledge to solve novel problems. The field is highly visual and tactile — encourage students to photograph their work, maintain restoration logs, and contribute findings to community wikis. Safety is paramount: drills on power-on protocols and high-voltage procedures before any risky work. Unlike theoretical CS, restoration is immediate and unforgiving: mistakes can destroy irreplaceable hardware or cause injury.

## Common Misconceptions

### 1. "Vintage computers are simple because they're old"
**Why students believe this:** Early machines have fewer transistors, simpler architectures, visible components.

**Why it's wrong:** Simplicity in design doesn't mean easy diagnosis. Lack of modern error reporting, custom chips with no datasheets, and degraded components make troubleshooting harder than modern systems. A 1982 Commodore 64 has more failure modes than a 2020 MacBook.

**How to correct:** Lesson 10 (POST process) illustrates how minimal diagnostic feedback makes systematic testing essential. Emphasize that "simple" means "fewer tools to help you" not "easier to fix."

### 2. "Capacitors either work or they're dead"
**Why students believe this:** Digital mindset, LEDs are on/off, motors spin or don't.

**Why it's wrong:** Capacitors degrade gradually. A cap at 50% capacitance and 10x normal ESR can cause intermittent boots, strange glitches, or partial functionality. Systems can appear to "work" while being on the verge of failure.

**How to correct:** Lessons 5-6 (ESR and recapping) show the spectrum of capacitor failure. Use oscilloscope captures of ripple voltage to visualize degradation. Teach ESR testing as preventive diagnosis, not just post-mortem.

### 3. "If the schematic says 5V, I should see exactly 5.00V"
**Why students believe this:** Precision culture of modern electronics, ±1% tolerance parts.

**Why it's wrong:** Vintage regulation was ±5% or worse; load conditions matter; voltage drop across connectors is significant. A 4.85V rail under load may be perfectly healthy for a 1980s system.

**How to correct:** Lesson 7 (voltage regulation) teaches acceptable ranges per era. Show real-world measurements from working systems. Emphasize that specs are guidelines from 40+ years ago when manufacturing tolerances were wider.

### 4. "I can skip the isolation transformer for low-voltage systems"
**Why students believe this:** "It's only 5V DC internally, the AC is inside the power supply."

**Why it's wrong:** Ground faults in the PSU or monitor can energize chassis; two-prong power cords lack grounding; metal cases become shock hazards. Ground loops can also damage sensitive CMOS chips.

**How to correct:** Lesson 2 (power-on safety) includes real-world shock hazards. Mandate isolation transformers for ALL AC-powered work. Share community stories of injuries (anonymized).

### 5. "This chip is vintage, so it must be rare and fragile"
**Why students believe this:** Reverence for old technology, survivorship bias (only rare machines get restored).

**Why it's wrong:** Common chips (6502, Z80, 74-series logic) are abundant and robust. Rare chips (custom ASICs, PALs) need protection, but most through-hole ICs are durable. ESD and handling matter more than age.

**How to correct:** Lesson 12 (IC socket replacement) distinguishes common vs rare parts. Teach that respect for hardware doesn't mean timidity — competent handling is the best preservation.

### 6. "Battery corrosion means the board is ruined"
**Why students believe this:** Dramatic photos of green/white crust eating through traces, "totaled" declarations on forums.

**Why it's wrong:** Corrosion is progressive. Caught early, vinegar neutralization and trace repair can fully recover a board. Even severe damage is often repairable with wire wrapping and patience.

**How to correct:** Lesson 14 (battery corrosion) shows before/after case studies. Emphasize chemistry (alkaline damage is reversible if stopped). The key is neutralization before water/IPA cleaning (which spreads the alkaline residue).

### 7. "I should use the highest-grade capacitors available"
**Why students believe this:** Enthusiast culture, "audiophile" cap myths, more expensive = better.

**Why it's wrong:** Modern low-ESR electrolytics are already overspec for vintage computers. Exotic types (solid polymer, tantalum) can have wrong characteristics (ESR too low breaks regulation loops; tantalum shorts catastrophically on overvoltage). Worse, expensive parts tempt students to rush learning with money.

**How to correct:** Lesson 6 (recapping) specifies Nichicon, Panasonic, or Rubycon as quality-sufficient. Teach that matching original electrical characteristics matters more than brand prestige. Save money for tools (ESR meter, variac).

### 8. "Emulation is just as good as restoration"
**Why students believe this:** Perfect emulation exists for many platforms; software preservation is easier.

**Why it's wrong:** This isn't wrong, it's orthogonal. Emulation preserves software; restoration preserves hardware and the embodied experience. Both are valid, but physical restoration offers hands-on engineering learning that emulation doesn't.

**How to correct:** Lesson 27 (restoration ethics) frames them as complementary. Emulation helps identify software issues vs hardware; disk imaging (lesson 21) bridges both worlds.

## Level Adjustments

### For Beginners (below intermediate)
- **Add:** Prerequisite module on basic electronics (Ohm's law, voltage dividers, capacitor function)
- **Add:** Soldering practice lessons (through-hole, desoldering, SMD basics)
- **Slow down:** Lessons 11-13 (board repair) need more scaffolding; break trace repair into multiple lessons
- **Simplify:** Skip SMD recapping (lesson 24); focus on through-hole platforms (Commodore 64, Apple II)
- **Safety:** More repetition on lessons 2, 17; require supervision for first power-on and CRT work

### For Advanced (above intermediate)
- **Skip:** Lessons 1-4 (assessment) can be brief review
- **Accelerate:** Combine lessons 5-9 (power supply) into condensed troubleshooting guide
- **Expand:** Lesson 13 (ROM) → add PAL/GAL programming, FPGA reverse engineering
- **Expand:** Lesson 18 (video) → deep dive on RGB modding, sync-on-green, component video
- **Add:** Custom replacement boards (replica ROMs, modern PSU boards, accelerators)
- **Add:** Oscilloscope-based debugging (clock signal analysis, data bus probing)
- **Platform depth:** Pick one platform and go chip-level (DRAM repair, custom chip troubleshooting)

### Formalism Notes
- **Minimal theory:** No formal circuit analysis or differential equations. All electronics is hands-on troubleshooting.
- **Historical context:** Include brief platform history (why the Amiga had SMD caps, why Commodore PSUs fail) but don't digress into computer history as a topic.
- **Community standards:** Teach current best practices from VCFed, Console5 wikis, not outdated service manual advice.

## Rabbit Holes

### When signal integrity becomes RF engineering
**When to drop this:** Lesson 18 (composite video), for students interested in RGB mods or HDMI upscaling.
**Connection:** Video timing at 15kHz is radio frequency. Impedance matching, termination, and cable quality suddenly matter. Leads to learning about 75Ω coax, ground loops, and sync signal degradation. Can spiral into building custom cable harnesses and SCART breakout boards.

### The chip shortage archaeology project
**When to drop this:** Lesson 13 (ROM burning), when students ask about unobtainable parts.
**Connection:** Rare chips (SID 6581, CIAs, custom gate arrays) are extinct or expensive. This opens FPGA replacement territory — MIST, SiDi, replacement boards like Boing!Kit. Connects vintage restoration to modern FPGA design and HDL. Can become a full separate topic (hardware emulation at the chip level).

### Keyboard switches as cultural artifacts
**When to drop this:** Lesson 22 (keyboard restoration), for students who geek out on tactile feel.
**Connection:** Alps SKCM, buckling spring, beam spring — each has a collector community, design philosophy, and restoration technique. Leads to switch modding, spring swapping, custom foam mods. Connects to modern mechanical keyboard hobby but with vintage parts.

### The demo scene as quality validation
**When to drop this:** Lesson 23 (review), when students have a "working" system but wonder if it's truly healthy.
**Connection:** Demo scene productions push hardware to the limit — they're better stress tests than games. A C64 running "Edge of Disgrace" exercises sprites, rasters, music, and disk I/O simultaneously. If the demo glitches, something is still wrong. Leads students to discover cracktros, disk magazines, and competitive optimization as culture.

### Retro computing as climate history
**When to drop this:** Lesson 3 (corrosion patterns), when discussing geographic failure rates.
**Connection:** Machines from humid climates (Florida, tropics) have worse corrosion; desert machines have dry-rot plastic. This connects to material science (polymer degradation), geography, and even climate change (modern humidity patterns differ from 1980s). Can lead to discussions of storage conditions and archival environments.

### Power supply archaeology: linear vs switching
**When to drop this:** Lesson 8 or 9 (Commodore PSU / power review), when students ask why designs changed.
**Connection:** Early computers used linear regulators (heavy, inefficient, simple). 1980s switched to SMPS (light, efficient, complex). This mirrors history of power electronics, patent wars (Bob Widlar, Ray Holt), and energy crisis impacts on design. Connects to modern server PSU design and efficiency standards.

### The tantalum capacitor disaster
**When to drop this:** Lesson 6 (recapping), if students ask about tantalum vs electrolytic.
**Connection:** Tantalum caps are reliable until they short — then they ignite. Amiga accelerator boards, early PC motherboards with tantalum failures teach failure-mode-aware design. Leads to discussions of safety-critical design, aerospace applications, and modern alternatives (polymer electrolytics).

### Disk imaging as digital forensics
**When to drop this:** Lesson 21 (flux transition reading), for students interested in software preservation.
**Connection:** KryoFlux and Greaseweazle capture raw magnetic flux — enables recovery of copy-protected disks, damaged sectors, even forensic analysis of write patterns. Connects to Copy Protection Museum, software piracy history, and modern digital forensics techniques. Can become a side quest into cracking old games or preserving weird disk formats.

## Difficulty Progression

### Arc Design
The curriculum follows a **three-peak structure**:

1. **Peak 1 (Lessons 5-8): Power Supply** — difficulty 3-4. First major technical challenge. Recapping requires desoldering confidence; ESR testing is abstract; voltage regulation combines theory and practice. Review at lesson 9 consolidates assessment and power concepts.

2. **Plateau (Lessons 10-16): Board Repair** — sustained difficulty 3-4. POST diagnosis is detective work; trace repair is finicky; ROM burning is new tool complexity. Ends with Review (lesson 16) to consolidate.

3. **Peak 2 (Lessons 17-18): CRT Safety and Video** — difficulty 2-4 spike. Lesson 17 is high-consequence (safety) but conceptually easy (follow protocol). Lesson 18 is low-consequence but cognitively hard (analog video signals).

4. **Recovery (Lessons 19-23): Storage/Peripherals** — difficulty 2-3. Practical, satisfying work. Build confidence. Ends with Review (lesson 23).

5. **Peak 3 (Lessons 24-26): Platform-Specific** — difficulty 4. Combines all prior skills in real-world complexity. Amiga SMD caps are dexterity-challenging; Mac analog boards are high-stakes; ISA conflicts are abstract troubleshooting.

6. **Denouement (Lessons 27-28): Preservation** — difficulty 2. Reflection, ethics, future paths. Low technical load, high synthesis.

### Why This Shape
- Early difficulty (lessons 1-4) stays low to build confidence and emphasize safety before students have invested ego.
- Power supply (peak 1) is the most common real-world repair — front-loading it means students can immediately apply learning.
- Review lessons (9, 16, 23) prevent cognitive overload and enable spaced repetition at regular intervals.
- Platform-specific (peak 3) comes late because students need broad foundation before specializing.
- CRT safety (lesson 17) is isolated as difficulty-2 because it's procedural, not conceptual. But it's placed mid-curriculum when students have hands-on confidence and will take safety seriously (not dismiss it as "beginner stuff").

### Adaptation Triggers
- If student struggles on lesson 6 (recapping), insert extra practice: "recap a junk PSU before touching the real one."
- If student breezes through lessons 10-14 (board repair), telescope them and expand lesson 13 → add GAL/PAL programming.
- If student has platform preference (e.g., only wants to restore Amigas), reorder: move lesson 24 earlier, make it the sustained project.
