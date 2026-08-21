# Mechanical Keyboard Design — Research Summary

## Major Subtopics

### 1. Switch Mechanics & Selection
- Switch types: linear, tactile, clicky
- Actuation mechanisms: leaf spring, capacitive, optical
- Force curves and travel distance
- Switch comparison methodology (Cherry MX, Gateron, Kailh, etc.)
- Lubrication and modification

### 2. PCB Design & Electronics
- Matrix scanning fundamentals
- Diode placement and ghosting prevention
- Microcontroller selection (AVR, ARM)
- USB implementation
- KiCad workflow for keyboard PCBs
- Hotswap sockets vs. soldered switches

### 3. Firmware Programming
- QMK firmware architecture
- Keymaps and layers
- Advanced features: tap dance, combos, macros
- VIA/VIAL for runtime configuration
- Flashing and debugging

### 4. Mechanical Design
- Plate materials and mounting styles
- Case design considerations
- Acoustic properties and dampening
- Gasket mount, top mount, bottom mount
- 3D printing vs. CNC machining

### 5. Assembly & Testing
- Soldering techniques for keyboards
- Stabilizer tuning
- Testing and debugging
- Firmware troubleshooting

## Key Sources

### Documentation & Guides
- **QMK Firmware Documentation** (https://docs.qmk.fm/) — comprehensive firmware reference, features guide, and API docs
- **Keyboard University** (https://keyboard.university/) — structured learning platform covering all aspects from switches to firmware
- **Keyboard PCB Design Guide** (https://github.com/ruiqimao/keyboard-pcb-guide) — step-by-step PCB design in KiCad
- **Thomas Baart's Blog** (https://thomasbaart.nl/category/mechanical-keyboards/) — in-depth build guides and design theory
- **Deskthority Wiki** (https://deskthority.net/wiki/Main_Page) — comprehensive switch database and historical reference

### Interactive Tools
- **QMK Configurator** (https://config.qmk.fm/) — browser-based keymap editor
- **VIA** (https://usevia.app/) — real-time keyboard configuration
- **Keyboard Layout Editor** (https://www.keyboard-layout-editor.com/) — layout design and visualization
- **Plate & Case Builder** (https://builder.swillkb.com/) — generates plate CAD files from KLE layouts
- **KiCad** (https://www.kicad.org/) — open-source PCB design suite

### Video Resources
- **Taeha Types** (https://www.youtube.com/c/TaehaTypes) — high-end custom builds, switch comparisons, sound tests
- **Switch and Click** (https://www.youtube.com/c/SwitchandClick) — educational series on keyboard mechanics
- **Hipyo Tech** (https://www.youtube.com/c/HipyoTech) — beginner-friendly tutorials and reviews

### Code Repositories
- **QMK Firmware** (https://github.com/qmk/qmk_firmware) — open-source keyboard firmware
- **VIA** (https://github.com/the-via/via) — configurator application

### Communities
- **r/MechanicalKeyboards** (https://www.reddit.com/r/MechanicalKeyboards/) — active community for all skill levels
- **Geekhack** (https://geekhack.org/) — enthusiast forum with vendor announcements and group buys

## Available Resources

The mechanical keyboard domain has exceptional resources for intermediate learners:
- Strong open-source ecosystem (QMK, KiCad)
- Active maker community with detailed build logs
- Free educational content from hobbyists and manufacturers
- Accessible entry points (QMK Configurator) and deep technical docs
- Visual/tactile learning opportunities (switch testing, sound comparisons)

## Pedagogical Notes

This topic benefits from:
- **Hands-on experimentation** — switch testers, firmware customization
- **Iterative design** — start with configurator tools, progress to KiCad
- **Multi-sensory engagement** — tactile feedback, sound profiles, visual design
- **Real artifacts** — students can build a working keyboard as they learn
- **Strong community** — many rabbit holes for different interests (acoustics, ergonomics, aesthetics)
