# Vintage Computer Restoration — Concept Map

## Core Concepts (in learning order)

1. **Safety assessment** — identifying hazards before power-on
2. **Visual inspection** — reading a board's condition from physical clues
3. **Common failure indicators** — what corrosion, burns, bulging caps tell you
4. **Power-on safety protocols** — isolation, current limiting, staged testing
5. **Isolation transformer** — protecting you and the device from ground loops and shorts
6. **Current-limited testing** — detecting shorts before catastrophic failure
7. **Variac usage** — slowly ramping voltage to reform capacitors
8. **Corrosion patterns** — identifying battery leaks, liquid damage, environmental decay
9. **Battery leak damage** — chemistry and neutralization strategies
10. **Triage assessment** — determining project scope and feasibility
11. **Electrolytic capacitor aging** — the #1 cause of vintage computer failure
12. **ESR (equivalent series resistance)** — the key metric for capacitor health
13. **Capacitor plague** — the specific 1990s-2000s manufacturing defect
14. **Recapping procedure** — safely replacing electrolytic capacitors
15. **Capacitor polarity** — critical to avoid reverse installation
16. **ESR testing** — in-circuit and out-of-circuit measurement
17. **Voltage regulation** — ensuring clean, stable power rails
18. **Ripple measurement** — detecting failing filter capacitors
19. **Load vs no-load testing** — diagnosing regulation under realistic conditions
20. **Linear regulator failure** — 7805 and platform-specific regulator issues
21. **POST process** — understanding boot sequence and diagnostics
22. **Beep codes** — interpreting audio error signals
23. **Clock signal verification** — oscillators as a common failure point
24. **Continuity testing** — tracing circuits without schematics
25. **Bodge wires** — field-expedient trace repair
26. **Wire wrapping** — permanent but reversible trace repair
27. **IC socket corrosion** — when the socket is worse than the chip
28. **Desoldering technique** — removing components without pad damage
29. **ROM reading** — extracting data from EPROMs and mask ROMs
30. **EPROM burning** — programming replacement chips
31. **Checksum verification** — validating ROM integrity
32. **Alkaline corrosion chemistry** — understanding what battery leaks do
33. **Neutralization** — stopping corrosion progression
34. **High voltage safety** — CRT and flyback transformer hazards
35. **Anode discharge** — the critical CRT safety procedure
36. **Composite video signals** — understanding analog video encoding
37. **Sync separation** — how vertical and horizontal sync work
38. **Color burst** — the NTSC/PAL color reference signal
39. **Period-correct restoration** — balancing authenticity with practicality
40. **LCD retrofitting** — modern display options for vintage systems
41. **Read/write head alignment** — the finicky art of floppy drive repair
42. **Drive speed calibration** — RPM accuracy for reliable reading
43. **Disk imaging** — preserving data from physical media
44. **Flux transition reading** — low-level magnetic data capture
45. **File system recovery** — extracting data from damaged media
46. **Mechanical keyboard switches** — Alps, Cherry, buckling spring restoration
47. **Foam and foil repairs** — dealing with degraded Commodore keyboards
48. **Amiga capacitor plague** — the platform's infamous SMD cap failures
49. **Surface-mount recapping** — advanced technique for compact boards
50. **Analog board isolation** — Mac-specific high-voltage safety
51. **IRQ and DMA assignment** — PC interrupt and memory conflicts
52. **Base address conflicts** — overlapping I/O space in ISA systems
53. **Reversible modifications** — restoration ethics and preservation
54. **FPGA replacements** — modern alternatives to unobtainable chips

## Dependencies

### Foundation Layer (Lessons 1-4)
- **Safety assessment** is the prerequisite for ALL hands-on work
- **Visual inspection** informs **triage assessment**
- **Common failure indicators** guide **corrosion patterns** and **battery leak damage**
- **Power-on safety protocols** encompass **isolation transformer**, **current-limited testing**, and **variac usage**

### Power Supply Layer (Lessons 5-9)
- **Electrolytic capacitor aging** explains **ESR** and **capacitor plague**
- **ESR testing** is required before and after **recapping procedure**
- **Voltage regulation** and **ripple measurement** both depend on understanding **load vs no-load testing**
- **Linear regulator failure** builds on general **voltage regulation** knowledge
- Review at lesson 9 consolidates assessment and power supply concepts

### Board Repair Layer (Lessons 10-16)
- **POST process** and **beep codes** are entry points to **clock signal verification**
- **Continuity testing** enables **bodge wires** and **wire wrapping**
- **IC socket corrosion** requires **desoldering technique**
- **ROM reading**, **EPROM burning**, and **checksum verification** form a tight cluster
- **Battery leak damage** (from L1-4) connects to **alkaline corrosion chemistry** and **neutralization**
- Review at lesson 16 consolidates board-level troubleshooting

### Display Layer (Lessons 17-19)
- **High voltage safety** and **anode discharge** are independent prerequisites
- **Composite video signals** depends on understanding **sync separation** and **color burst**
- **Period-correct restoration** vs **LCD retrofitting** is a decision point, not a dependency

### Storage/Peripherals Layer (Lessons 20-23)
- **Read/write head alignment** and **drive speed calibration** are parallel troubleshooting paths
- **Disk imaging** builds on **flux transition reading**
- **Flux transition reading** enables **file system recovery**
- **Mechanical keyboard switches** and **foam and foil repairs** are platform-specific branches
- Review at lesson 23 consolidates peripherals and system integration

### Platform-Specific Layer (Lessons 24-26)
- **Amiga capacitor plague** requires **surface-mount recapping** (advanced version of **recapping procedure**)
- **Analog board isolation** builds on **high voltage safety** and **anode discharge**
- **IRQ and DMA assignment** and **base address conflicts** are closely related ISA concepts

### Preservation Layer (Lessons 27-28)
- **Reversible modifications** synthesizes ethics with all prior repair techniques
- **FPGA replacements** represents advanced solutions beyond component-level repair

## Critical Bottlenecks

1. **Power-on safety protocols** (L2) — cannot proceed to ANY powered testing without this
2. **ESR testing** (L6) — blocks effective power supply repair
3. **Desoldering technique** (L12) — required for most component-level repairs
4. **High voltage safety** (L17) — gates all CRT-related work
5. **Flux transition reading** (L21) — essential for software preservation

## Common Misconceptions

### "Just plug it in and see if it works"
- **Where it appears:** Lesson 2 (power-on safety)
- **Why it's dangerous:** Shorted capacitors can destroy transformers, regulators, and chips; fire risk
- **Correct approach:** Staged testing with current limiting and visual inspection first

### "All capacitors are the same"
- **Where it appears:** Lessons 5-6 (recapping)
- **Why it's wrong:** Voltage rating, capacitance value, ESR, and temperature rating all matter; wrong choices cause immediate or delayed failure
- **Correct approach:** Match or exceed original specs; use modern low-ESR parts

### "I'll just solder directly to the chip legs"
- **Where it appears:** Lesson 11 (trace repair)
- **Why it's problematic:** Chips can fail later; difficult to remove; ICs aren't mechanically robust
- **Correct approach:** Use sockets when possible; wire-wrap posts for permanent bodges

### "ROMs never go bad"
- **Where it appears:** Lesson 13 (ROM restoration)
- **Why it's false:** UV erasure (EPROMs), bit rot, radiation damage all occur
- **Correct approach:** Always checksum-verify; keep backups

### "CRTs are safe once unplugged"
- **Where it appears:** Lesson 17 (CRT safety)
- **Why it's deadly:** Anode stores charge for weeks or years; ~25kV potential
- **Correct approach:** Always discharge anode explicitly before working inside

### "Higher voltage is better when reforming caps"
- **Where it appears:** Lesson 7 (variac usage)
- **Why it fails:** Exceeding voltage rating ruptures the cap
- **Correct approach:** Stay at or below rated voltage; time and current matter more

### "Original parts are always superior"
- **Where it appears:** Lesson 27 (restoration ethics)
- **Why it's nuanced:** Original caps WILL fail; some original designs were flawed
- **Correct approach:** Reversible upgrades are ethical; document all changes

## Prerequisite Topics

- **Basic electronics** — needed for: all voltage/current concepts, circuit tracing
- **Soldering (through-hole)** — needed for: recapping, trace repair, socket replacement
- **Multimeter usage** — needed for: voltage testing, continuity, ESR measurement
- **Computer architecture basics** — needed for: POST process, boot sequence, ISA concepts
- **ESD safety** — needed for: all chip handling, board work

## Learning Pathways

### Fast Track (experienced electronics hobbyists)
- Skim lessons 1-4 (review safety)
- Focus on lessons 5-9 (power supplies, most common issue)
- Jump to platform-specific lessons 24-26 as needed

### Methodical Path (recommended for intermediate)
- Follow sequence 1-28
- Pause for hands-on practice after lessons 9, 16, 23
- Deep dive into platform-specific resources between lessons 23-24

### Safety-First Path (beginners, or high-value/rare systems)
- Lessons 1-2 (safety) → practice on junk boards
- Lessons 3-4 (assessment) → apply to target system
- Lessons 5-9 (power) → recap and test
- Stop and seek help if issues persist before proceeding to lessons 10+
