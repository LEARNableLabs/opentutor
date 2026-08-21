# Mechanical Keyboard Design — Concept Map

## Core Concepts (in learning order)

1. **Switch Anatomy** — physical components of a mechanical switch (housing, stem, spring, contacts)
2. **Actuation Mechanisms** — how different switch types generate keypresses (mechanical contact, capacitive, optical)
3. **Tactile Feedback** — how force curves, bumps, and clicks affect typing feel
4. **Switch Modification** — lubing, filming, spring swapping to customize feel
5. **Matrix Wiring** — row-column grid architecture for reducing GPIO requirements. Depends on: Switch Anatomy
6. **Anti-Ghosting** — diode placement to prevent false keypresses. Depends on: Matrix Wiring
7. **Matrix Scanning** — algorithm for reading key states efficiently. Depends on: Matrix Wiring, Anti-Ghosting
8. **Hotswap Sockets** — removable switch mounting vs permanent soldering. Depends on: Switch Anatomy, Matrix Wiring
9. **PCB Layout Requirements** — specific constraints for keyboard PCBs vs general electronics. Depends on: Matrix Wiring, Anti-Ghosting
10. **PCB Routing** — trace layout strategies for matrix connections. Depends on: Matrix Wiring, PCB Layout Requirements
11. **USB Implementation** — USB-C hardware design for keyboards. Depends on: PCB Layout Requirements
12. **KiCad Workflow** — schematic to PCB to Gerber for keyboard designs. Depends on: PCB Layout Requirements, PCB Routing, USB Implementation
13. **QMK Architecture** — firmware structure for turning scans into HID reports. Depends on: Matrix Scanning
14. **Layer System** — multiple keymap layers accessed via layer switching. Depends on: QMK Architecture
15. **Keymap Definition** — defining key layouts in QMK firmware. Depends on: QMK Architecture, Layer System
16. **Flashing & Bootloaders** — uploading firmware to microcontroller. Depends on: Keymap Definition
17. **Firmware Debugging** — troubleshooting hardware vs software issues. Depends on: Matrix Scanning, QMK Architecture, Flashing & Bootloaders
18. **Tap Dance & Combos** — advanced key behaviors based on timing and combinations. Depends on: Keymap Definition
19. **VIA/VIAL** — runtime configuration vs compile-time keymaps. Depends on: QMK Architecture, Keymap Definition
20. **Custom Keycodes** — extending QMK with custom behaviors. Depends on: QMK Architecture, Keymap Definition
21. **Firmware Optimization** — tuning scan rate, debounce, and power. Depends on: Matrix Scanning, QMK Architecture
22. **Mounting Styles** — how case/plate attachment affects acoustics and flex. Depends on: PCB Layout Requirements
23. **Acoustic Properties** — how materials and construction affect sound profile. Depends on: Mounting Styles, Switch Anatomy
24. **Stabilizer Tuning** — modding stabilizers for smooth long keys. Depends on: Switch Anatomy, Mounting Styles
25. **Integrated Design** — combining switch selection, PCB design, firmware, and mechanical design. Depends on: ALL previous concepts

## Dependencies

### Foundation Layer (Concepts 1-4)
- **Switch understanding** is the entry point — students need tactile experience with different switch types before abstract design
- **Force curves** require understanding of basic physics (springs, force, distance) but are mostly experiential
- **Modification** builds hands-on confidence before moving to electronics

### Electronics Layer (Concepts 5-8)
- **Matrix Wiring** is the critical bottleneck — students must understand why keyboards use matrices before PCB design makes sense
- **Anti-Ghosting** directly depends on matrix topology — you can't explain diode placement without the matrix model
- **Matrix Scanning** builds on both wiring and anti-ghosting — the algorithm assumes proper electrical design
- **Hotswap** is a design choice that affects both electrical and mechanical considerations

### PCB Design Layer (Concepts 9-12)
- **PCB Layout** synthesizes matrix concepts into physical board design
- **Routing** is the hardest technical challenge — requires spatial reasoning and electrical knowledge
- **USB Implementation** is relatively independent but necessary for functional boards
- **KiCad Workflow** ties everything together — can't be taught until students know what they're trying to build

### Firmware Layer (Concepts 13-21)
- **QMK Architecture** depends on matrix scanning understanding but is otherwise independent from hardware
- **Layer System** is QMK's killer feature — makes small keyboards practical
- **Keymap, Flashing, Debugging** form a linear progression — write, upload, fix
- **Advanced features** (tap dance, VIA, custom keycodes, optimization) all build on core QMK concepts

### Integration Layer (Concepts 22-25)
- **Mounting & Acoustics** connect mechanical design to user experience
- **Stabilizers** are a specialized mechanical tuning problem
- **Integrated Design** requires synthesizing decisions across all domains — can only be approached after foundational competence in each area

## Prerequisite Topics

- **Basic Electronics** — voltage, current, resistance, Ohm's law — needed for understanding matrix wiring, diodes, USB power
- **Soldering** — through-hole and SMD soldering — needed for assembly and PCB component placement decisions
- **Programming Basics** — variables, functions, conditionals, structs — needed for QMK keymap editing and custom code
- **Command Line** — navigating directories, running build commands — needed for QMK toolchain

## Common Bottlenecks

1. **Matrix Wiring Concept** (Concept 5) — students often struggle with the abstraction of row-column scanning vs direct wiring. Requires deliberate practice with small examples (2x2, 3x3 matrices).

2. **PCB Routing** (Concept 10) — spatial reasoning challenge. Students benefit from starting with small layouts (macropads) before full keyboards.

3. **QMK Build System** (Concept 13) — command-line friction and build errors can demotivate. Start with QMK Configurator (web GUI) before local builds.

4. **Layer Mental Model** (Concept 14) — thinking in multiple simultaneous keymaps is initially confusing. Use concrete examples (40% boards, function keys on layers).

5. **Integration Decisions** (Concept 25) — paradox of choice. Students need guidance on constraining the design space (pick one mounting style, one switch type) for first builds.

## Misconceptions to Address

- **"More switches = better keyboard"** — Quality and tuning matter more than count
- **"Clicky switches are always louder"** — Case acoustics and mounting have larger impact
- **"You need expensive tools to build keyboards"** — Most builds need only soldering iron, screwdriver, and computer
- **"Hotswap is always better"** — Tradeoffs exist (durability, electrical contact, cost)
- **"Matrix scanning is slow"** — Modern scanning is sub-millisecond; bottleneck is usually USB polling
- **"VIA and QMK are different firmware"** — VIA is a runtime configurator for QMK firmware
- **"Routing requires auto-router"** — Manual routing is preferred for keyboards; auto-routers struggle with constraints
- **"All mounting styles are equivalent"** — Gasket, tray, top-mount each have distinct acoustic and flex characteristics
