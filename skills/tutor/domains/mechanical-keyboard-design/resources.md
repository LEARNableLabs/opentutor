# Mechanical Keyboard Design — Resources

## Primary Sources (for lesson content)

### Comprehensive Guides
- **[Keyboard University](https://keyboard.university/)** — structured learning platform with courses on switches (101-level), mounting styles, stabilizers, and build guides. Excellent for intermediate learners who want organized curriculum-style content.
- **[QMK Firmware Documentation](https://docs.qmk.fm/)** — official docs for QMK firmware. Covers matrix wiring theory, features (layers, tap dance, macros), configuration, flashing, and debugging. Essential reference for all firmware lessons.
- **[Keyboard PCB Design Guide by Ruiqimao](https://github.com/ruiqimao/keyboard-pcb-guide)** — comprehensive step-by-step guide for designing keyboard PCBs in KiCad. Covers schematic, routing, USB-C, footprints, and Gerber generation. Best single resource for PCB design lessons.
- **[Thomas Baart's Mechanical Keyboard Blog](https://thomasbaart.nl/category/mechanical-keyboards/)** — in-depth articles on switch modding, PCB design, hotswap sockets, mounting styles, and build guides. High-quality technical writing for intermediate/advanced learners.

### Switch Resources
- **[Deskthority Wiki](https://deskthority.net/wiki/Main_Page)** — comprehensive database of switch types, force curves, historical keyboards, and technical specifications. Authoritative reference for switch research.
- **[Keychron Switch Guide](https://www.keychron.com/blogs/news/keyboard-switch-guide)** — accessible introduction to switch types, actuation mechanisms, and selection criteria. Good for early switch lessons.
- **[ThereminGoat Switch Reviews](https://www.theremingoat.com/)** — detailed technical reviews of modern switches with force curves, sound tests, and analysis. For students who want deep switch knowledge.

### PCB Design & Electronics
- **[KiCad Documentation](https://www.kicad.org/discover/pcb-design/)** — official KiCad tutorials for schematic design and PCB layout. General PCB knowledge applicable to keyboards.
- **[Ai03's USB-C Guide](https://github.com/ai03-2725/another-keyboard-builder/blob/master/USB-C.md)** — explains USB-C implementation for keyboard PCBs, including CC pins, resistor values, and ESD protection.
- **[How a Matrix Works (QMK Docs)](https://docs.qmk.fm/#/how_a_matrix_works)** — QMK's official explanation of matrix scanning, ghosting, anti-ghosting, and diode placement. Critical for understanding keyboard electronics.

### Firmware & Software
- **[QMK Newbs Guide](https://docs.qmk.fm/#/newbs)** — beginner-friendly introduction to QMK setup, building firmware, and flashing. Start here for students new to QMK.
- **[QMK Feature Documentation](https://docs.qmk.fm/#/features)** — comprehensive reference for layers, tap dance, combos, macros, and advanced features.
- **[VIA Documentation](https://github.com/the-via/via)** — explains VIA's runtime configuration system and how it layers on top of QMK.

### Mechanical Design
- **[Keyboard Mounting Styles (Keyboard University)](https://www.keyboard.university/200-courses/keyboard-mounting-styles-4lpp7)** — explains tray mount, top mount, gasket mount, and other mounting styles with diagrams and acoustic analysis.
- **[Stabilizer Guide (Keyboard University)](https://keyboard.university/guides/build-guides/keyboard-stabilizers-rxnRr)** — comprehensive guide to stabilizer types, installation, and tuning.

## Supplementary (for engagement)

### Video Channels
- **[Taeha Types](https://www.youtube.com/c/TaehaTypes)** — professional keyboard builder. High-end custom builds, switch sound tests, stabilizer tuning, and commission builds. Excellent for visual learners and showcasing best-in-class work.
- **[Switch and Click](https://www.youtube.com/c/SwitchandClick)** — educational channel focused on switch mechanics, modding techniques, and keyboard science. Great supplementary content for technical concepts.
- **[Hipyo Tech](https://www.youtube.com/c/HipyoTech)** — beginner-friendly reviews and tutorials. Good for students starting their keyboard journey.
- **[Andy V Nguyen](https://www.youtube.com/c/AndyVNguyen)** — keyboard builds, switch reviews, and hobby content. Approachable intermediate-level content.

### Interactive Tools
- **[QMK Configurator](https://config.qmk.fm/)** — browser-based keymap editor with visual keyboard layout. No coding required. Essential for introducing firmware concepts.
- **[VIA Web Configurator](https://usevia.app/)** — real-time keyboard configuration tool. Change keymaps without reflashing. Great for demonstrating runtime vs compile-time configuration.
- **[Keyboard Layout Editor](https://www.keyboard-layout-editor.com/)** — web-based tool for designing keyboard layouts. Exports JSON used by other tools. Essential for planning custom layouts.
- **[Plate & Case Builder](https://builder.swillkb.com/)** — generates CAD files for keyboard plates and cases from KLE layouts. Bridges layout design to physical manufacturing.
- **[VIAL Configurator](https://get.vial.today/)** — open-source VIA alternative with additional features. For students interested in open-source tooling.

### Code & Repositories
- **[QMK Firmware](https://github.com/qmk/qmk_firmware)** — main QMK repository with keymaps, boards, and source code. Students fork this for custom builds.
- **[QMK Toolbox](https://github.com/qmk/qmk_toolbox)** — GUI application for flashing firmware. Easier than command-line tools for beginners.
- **[KiCad Libraries for Keyboards](https://github.com/ai03-2725/MX_Alps_Hybrid)** — switch footprints and symbols for KiCad. Essential for PCB design.
- **[Keyboard PCB Examples](https://github.com/topics/keyboard-pcb)** — GitHub topic with open-source keyboard PCB projects. Great for learning from real designs.

### People & Community Figures
- **Taeha Types** — professional custom keyboard builder, YouTuber, streamer. Showcases high-end builds and techniques.
- **ThereminGoat** — switch reviewer and analyst. Technical deep-dives on switch mechanics and manufacturing.
- **ai03** — keyboard designer and PCB engineer. Created influential open-source designs and guides.
- **Thomas Baart** — keyboard designer and writer. Splitkb.com founder, detailed technical blog.
- **Kevinplus** — designer known for innovative mounting systems and acoustics.
- **Wilba** — firmware developer and designer, creator of Wilba.tech boards and contributor to VIA.

### Communities
- **[r/MechanicalKeyboards](https://www.reddit.com/r/MechanicalKeyboards/)** — 1.5M+ member subreddit. Daily discussion, build showcases, Q&A. Most active general keyboard community.
- **[Geekhack Forums](https://geekhack.org/)** — long-running enthusiast forum. Group buys, interest checks, vendor announcements, technical discussions.
- **[Deskthority Forums](https://deskthority.net/viewforum.php?f=7)** — technical forum focused on vintage keyboards and switch analysis.
- **[Keyboard Atelier Discord](https://keyboardatelier.com/discord)** — active Discord server for keyboard design discussions and help.
- **[40% Keyboards Discord](https://discord.gg/40percent)** — focused on small-form-factor keyboards and custom firmware.

## Unexpected Connections (for wild cards)

### Acoustics & Audio Engineering
Keyboard sound tuning shares principles with musical instrument design and room acoustics. Concepts like resonance, dampening, harmonic overtones, and material selection apply directly. Students interested in audio can explore:
- **[Switch sound frequency analysis](https://www.youtube.com/watch?v=WaLNXPVr2J4)** — analyzing switch sounds with spectrograms
- **Case materials and acoustic properties** — aluminum vs brass vs polycarbonate resonance
- **Room acoustics** — how recording environment affects perceived keyboard sound

### Ergonomics & Human Factors
Keyboard design intersects with occupational health, RSI prevention, and biomechanics:
- **Ergonomic keyboard designs** — split keyboards, columnar stagger, tenting
- **OSHA ergonomic guidelines** — proper typing posture and workspace setup
- **Hand anatomy and typing biomechanics** — finger strength, reach, and repetitive strain

### Manufacturing & Supply Chain
The keyboard hobby exposes students to small-batch hardware manufacturing:
- **Group buy economics** — community-funded manufacturing runs
- **PCB fabrication** — MOQ (minimum order quantity), lead times, Chinese vs US manufacturers
- **CNC machining vs 3D printing** — cost/quality tradeoffs for cases
- **Open-source hardware licensing** — sharing designs while maintaining attribution

### Accessibility & Assistive Technology
Custom keyboards enable adaptive input methods for users with disabilities:
- **One-handed keyboards** — mirrored layouts, chorded input
- **Stenography keyboards** — court reporting and live captioning
- **Large-print keycaps** — vision accessibility
- **Programmable macros** — reducing repetitive strain for power users

### Embedded Systems & IoT
QMK firmware development teaches embedded programming concepts applicable to broader IoT:
- **Microcontroller architecture** — AVR vs ARM, register-level programming
- **USB HID protocol** — how devices communicate with host computers
- **Power optimization** — sleep modes, battery management for wireless keyboards
- **Real-time constraints** — scan rate timing and latency budgets

### Art & Industrial Design
Keyboard aesthetics blend function and form:
- **Keycap artisan community** — hand-sculpted resin keycaps as miniature art
- **Colorway design** — color theory applied to keycap sets (GMK, ePBT)
- **Case finishes** — anodizing, powder coating, cerakote, patina
- **Typography** — legend design and font selection for keycaps

## Recommended Learning Path Resources

### For Visual Learners
Focus on: Taeha Types videos, Keyboard Layout Editor, sound test compilations, force curve graphs

### For Hands-On Learners
Focus on: Switch modding guides, macropad kits (SparkFun, Adafruit), QMK Configurator experimentation, breadboard matrix prototyping

### For Analytical Learners
Focus on: QMK documentation, Deskthority wiki, Thomas Baart's technical articles, force curve databases, PCB schematic analysis

### For Social Learners
Focus on: r/MechanicalKeyboards daily threads, Discord communities, build logs on Geekhack, group buy discussions, streamer Q&A sessions

## Tools Students Will Use

### Free Tools
- QMK Configurator (web)
- VIA/VIAL (web or desktop)
- Keyboard Layout Editor (web)
- Plate Builder (web)
- KiCad (desktop, open-source)
- OnShape (web, free tier for public projects)
- FreeCAD (desktop, open-source)

### Hardware (Optional but Recommended)
- Switch tester (12-25 switches) — ~$20-40
- Soldering iron and solder — ~$30-100
- Macropad kit — ~$30-60 (good first project)
- Multimeter — ~$20-50

### Paid Tools (Advanced)
- Fusion 360 (student license free)
- SolidWorks (expensive, industry-standard CAD)
- Custom PCB fabrication (~$5-50 for prototype runs)

## Quick Reference Links

- **Documentation:** https://docs.qmk.fm/
- **Configurator:** https://config.qmk.fm/
- **Layout Editor:** https://keyboard-layout-editor.com/
- **Plate Builder:** https://builder.swillkb.com/
- **PCB Guide:** https://github.com/ruiqimao/keyboard-pcb-guide
- **Learning Platform:** https://keyboard.university/
- **Community:** https://www.reddit.com/r/MechanicalKeyboards/
- **Switch Database:** https://deskthority.net/wiki/Main_Page
