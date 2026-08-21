# Mechanical Keyboard Design — Teaching Notes

## Approach

Mechanical keyboard design is **tactile, iterative, and multi-disciplinary** — students learn best by building real artifacts (even small ones like macropads) rather than pure theory. At the intermediate level, assume students have basic electronics and programming knowledge but no keyboard-specific experience. The teaching arc moves from **experiential** (feeling different switches) to **analytical** (force curves, matrix math) to **creative** (custom firmware, personal design choices). This topic has exceptional visual and hands-on learning opportunities — use sound tests, switch testers, interactive tools, and incremental builds to maintain engagement.

Key pedagogical principles:
- **Start tactile, end analytical** — begin with switch feel before force curve physics
- **Build early and often** — students should create working artifacts (simple keymaps, macropad PCB) before tackling full keyboard complexity
- **Use tools as scaffolding** — QMK Configurator before keymap.c editing; Keyboard Layout Editor before KiCad routing
- **Embrace personal preference** — keyboard design has no single "correct" answer; teach decision frameworks, not dogma

## Common Misconceptions

### 1. "Mechanical keyboards are just about switches"
**Why students think this:** Marketing focuses heavily on switch specs and RGB lighting.

**Reality:** Switch choice matters, but mounting style, case material, stabilizer tuning, and firmware customization have equal or greater impact on typing experience.

**How to correct:** Early lessons emphasize the **system** — show how a premium switch in a poorly-designed case sounds worse than a budget switch in a well-tuned build.

### 2. "Matrix scanning is complicated and slow"
**Why students think this:** The row-column abstraction seems indirect compared to "one wire per key."

**Reality:** Modern matrix scanning is extremely fast (<1ms for full scan) and necessary for reasonable GPIO counts. The complexity is in understanding the concept, not the performance impact.

**How to correct:** Use concrete math — "100 keys direct = 100 GPIO pins (impossible). 10x10 matrix = 20 pins (easy)." Show actual scan rates with QMK debug output.

### 3. "You need to understand PCB design to build a custom keyboard"
**Why students think this:** Community showcases custom PCB builds prominently.

**Reality:** Many excellent keyboards use off-the-shelf PCBs with custom firmware, plates, and cases. PCB design is one specialization, not a prerequisite.

**How to correct:** Show the **spectrum of customization** — firmware-only mods (easiest), case/plate swaps, full PCB design (hardest). Let students choose their depth.

### 4. "Hotswap is always better than soldered"
**Why students think this:** Hotswap enables easy experimentation with switch types.

**Reality:** Hotswap sockets add thickness, cost, and potential points of failure. Soldered connections are more durable and reliable. The choice depends on use case.

**How to correct:** Teach **tradeoffs** — hotswap for experimentation and future-proofing, soldered for final production builds and ultra-thin designs.

### 5. "Clicky switches are the loudest"
**Why students think this:** Clicky switches have an audible mechanism (click bar or jacket).

**Reality:** Acoustic properties depend more on case resonance, mounting style, and keycap material than switch type. A silent linear in a hollow case can be louder than clickies in a dampened case.

**How to correct:** Use **sound test videos** comparing identical switches in different cases. Teach acoustic principles (resonance, dampening, materials).

### 6. "VIA and QMK are competing firmware options"
**Why students think this:** They're often presented as alternatives in keyboard specs.

**Reality:** VIA is a runtime configurator layer **on top of** QMK firmware. A keyboard runs QMK and optionally supports VIA for easier keymap changes without reflashing.

**How to correct:** Clarify the **stack** — QMK is firmware (runs on keyboard), VIA is a configuration tool (runs on computer), VIAL is an open-source VIA alternative.

### 7. "Auto-routers can design keyboard PCBs"
**Why students think this:** Auto-routing works for many PCB types.

**Reality:** Keyboard PCBs have very specific constraints (switch footprint spacing, minimal vias under switches, aesthetic trace layouts) that auto-routers handle poorly. Manual routing is standard practice.

**How to correct:** Show examples of auto-routed keyboard PCBs (messy, impractical) vs well-routed manual designs. Teach routing as a **craft skill**, not just engineering.

### 8. "More actuation force = better for typing/gaming"
**Why students think this:** Marketing around "precision" and "control" with heavy switches.

**Reality:** Actuation force is highly personal. Heavy switches can cause finger fatigue; light switches can cause accidental presses. Optimal force depends on typing style, hand strength, and use case.

**How to correct:** Emphasize **experimentation** with switch testers. Teach the concept of "sweet spot" based on individual biomechanics.

### 9. "You need expensive CAD software for case design"
**Why students think this:** Professional keyboard makers use SolidWorks or Fusion 360.

**Reality:** FreeCAD, OnShape (free tier), and even simple plate generators (swillkb.com) are sufficient for many projects. 3D printing makes custom cases accessible without CNC machining.

**How to correct:** Provide **free/accessible tool paths** — plate generator → 3D printed case → laser-cut acrylic → CNC aluminum (progression from free to expensive).

### 10. "Firmware programming requires deep C knowledge"
**Why students think this:** QMK is written in C and has complex architecture.

**Reality:** Basic keymap customization requires minimal C knowledge — mostly editing arrays and calling provided functions. Only advanced customization (custom behaviors, low-level optimizations) needs real C programming.

**How to correct:** Start with **QMK Configurator** (zero code), then simple keymap.c editing (arrays, keycodes), then custom functions (actual C programming). Show the learning gradient.

## Level Adjustments

### For Beginners (stepping down from intermediate)
- Start with pre-built keyboard firmware customization before any hardware
- Use QMK Configurator exclusively — avoid command line and local builds initially
- Focus on switch selection and typing experience rather than PCB design
- Skip PCB routing details; use macropad kits with pre-made PCBs
- Emphasize assembly and tuning over design from scratch

### For Intermediate (this curriculum)
- Balance theory and practice — understand matrix math but also route a simple PCB
- Introduce command-line QMK builds but provide safety rails (step-by-step guides)
- Teach PCB design with KiCad for a simple macropad (4x4 or smaller)
- Cover firmware debugging and customization beyond just keymaps
- Expect students to make design decisions and justify tradeoffs

### For Advanced (stepping up from intermediate)
- Deep dive into QMK architecture — how matrix scanning works at register level
- PCB design for complex layouts (split keyboards, ergo layouts) with advanced features (RGB, OLED, rotary encoders)
- Optimize firmware for latency — USB polling rate tuning, debounce algorithm selection
- Case design with CAD and understanding of materials/manufacturing (CNC, injection molding)
- Explore alternative firmware (ZMK for wireless, custom from scratch)

## Rabbit Holes

These are fascinating tangents to drop in when students show curiosity or need enrichment:

### 1. Hall Effect and Magnetic Switches
**When to introduce:** After lesson 2 (force curves) when discussing actuation mechanisms.

**Why it's interesting:** Contactless magnetic actuation with adjustable actuation points and potential for analog input (pressure-sensitive keys).

**Resources:** Wooting keyboard demos, analog input applications in gaming.

### 2. Split Keyboards and Ergonomics
**When to introduce:** After lesson 6 (matrix wiring) — split keyboards use two separate matrices with I2C/serial communication.

**Why it's interesting:** Opens discussion of RSI, ergonomics, columnar stagger vs row stagger, tenting, and human factors design.

**Resources:** Ergodox, Corne, Dactyl manuform builds; OSHA ergonomic guidelines.

### 3. Audio Feedback and Speaker Integration
**When to introduce:** After lesson 17 (QMK architecture) when discussing firmware features.

**Why it's interesting:** QMK supports audio output for click feedback, melodies, and accessibility. Connects to audio synthesis and piezo driver circuits.

**Resources:** QMK audio feature documentation, Planck keyboard speaker builds.

### 4. Wireless and Battery Management
**When to introduce:** After lesson 26 (firmware optimization) when discussing power consumption.

**Why it's interesting:** ZMK firmware for wireless builds, Bluetooth vs 2.4GHz tradeoffs, battery chemistry and charging circuits, power budgets.

**Resources:** ZMK firmware docs, nice!nano microcontroller, wireless keyboard build guides.

### 5. Keycap Design and Manufacturing
**When to introduce:** After lesson 27 (mounting styles) when discussing materials and acoustics.

**Why it's interesting:** Injection molding, doubleshot vs dye-sub, keycap profiles (Cherry, SA, DSA, XDA), legends and fonts, ABS vs PBT acoustics.

**Resources:** Keycap manufacturing videos, custom keycap group buys, 3D printed artisan keycaps.

### 6. Force Curve Measurement and Switch Testing
**When to introduce:** After lesson 2 (force curves) for students interested in quantitative analysis.

**Why it's interesting:** Building force curve measurement rigs with load cells and Arduinos, plotting force curves, comparing manufacturing consistency.

**Resources:** Input Club force curve database, DIY switch tester builds on GitHub.

### 7. Analog Input and Chorded Keyboards
**When to introduce:** After lesson 23 (tap dance & combos) when discussing alternative input methods.

**Why it's interesting:** Stenography, chorded input (multiple simultaneous keys), analog keyboards with pressure sensitivity, accessibility applications.

**Resources:** Plover stenography software, Charachorder, pressure-sensitive gaming keyboards.

### 8. Open-Source Hardware and Group Buys
**When to introduce:** After lesson 15 (designing a macropad PCB) when students consider manufacturing.

**Why it's interesting:** Keyboard community economics, group buy model, open-source PCB licensing, production at scale (MOQ, lead times, supply chain).

**Resources:** GeekHack group buy forums, open-source keyboard GitHub repos, small-batch PCB manufacturing guides.

## Difficulty Progression

### Early Lessons (1-10): Foundations — Difficulty 1-3
**Arc:** Tactile experimentation → conceptual understanding → applied electronics

- Start accessible (feeling switches, comparing types) — difficulty 2
- Introduce analytical concepts (force curves, matrix math) — difficulty 3
- Build confidence with hands-on (switch modding) before abstract electronics
- First review at lesson 9 to consolidate switch and scanning concepts

### Mid Lessons (11-21): Technical Skills — Difficulty 2-4
**Arc:** PCB design challenge → firmware empowerment

- PCB routing (lesson 12) is first major difficulty peak — difficulty 4
- Macropad design (lesson 15) is second peak — difficulty 4, but scaffolded by previous routing knowledge
- Firmware section starts easier (lessons 17-18, difficulty 2) to give students a "win" after PCB intensity
- Debugging (lesson 21, difficulty 3) before review ensures students can handle problems

### Late Lessons (22-31): Synthesis & Mastery — Difficulty 1-5
**Arc:** Integration → optimization → capstone

- Review at lesson 22 before advanced firmware to consolidate learning
- Advanced firmware features (lessons 23-26) build from difficulty 2 to 4 (optimization peak)
- Mechanical design (lessons 27-29) moderate difficulty (2-3) — largely conceptual
- Final review (lesson 30, difficulty 1) before capstone
- Capstone project (lesson 31, difficulty 5) — full integration, highest challenge, most rewarding

### Review Placement Strategy
- **Lesson 9:** After switch fundamentals and matrix scanning (first major concepts)
- **Lesson 16:** After PCB design section (hardest technical content)
- **Lesson 22:** Before advanced firmware (mid-curriculum consolidation)
- **Lesson 30:** Before capstone (pre-integration review)

### Type Distribution
The curriculum uses all 6 types to maintain engagement:
- **mini-lesson** (14 lessons) — core content delivery
- **question** (6 lessons) — problem-driven learning
- **real-world** (4 lessons) — application and context
- **teach-back** (3 lessons) — active demonstration of understanding
- **review** (4 lessons) — spaced repetition and consolidation
- **resource-drop** (1 lesson) — tool introduction (KiCad)

This variety ensures students aren't just consuming content but actively applying, teaching back, and connecting to real use cases.
