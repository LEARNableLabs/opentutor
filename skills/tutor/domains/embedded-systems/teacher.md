# Embedded Systems Design — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 9 lessons (36%)
- **Socratic questions** — 6 lessons (24%)
- **real-world application challenges** — 4 lessons (16%)
- **review and consolidation sessions** — 3 lessons (12%)
- **teach-back exercises (student explains)** — 2 lessons (8%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 36% accessible (1-2), 44% standard (3), 20% challenging (4-5).

Difficulty peaks:
- Day 11: "What should you never do inside an ISR?" (difficulty 4)
- Day 17: "How do you build a sensor network that survives noise?" (difficulty 4)
- Day 18: "When should you use DMA instead of the CPU?" (difficulty 4)
- Day 22: "When is bare-metal not enough?" (difficulty 4)
- Day 25: "What separates a prototype from a product?" (difficulty 4)

## Domain Hooks
This field covers embedded systems design, with applications across theory and practice.

## Common Failure Modes
1. **"I can just use libraries and ignore the hardware"** — Students treat embedded like application programming. Counter: show a case where a library hides a critical timing or power issue. Teach when abstraction helps vs hurts.

2. **"More features = better microcontroller"** — Students want the biggest chip. Counter: real constraints (cost, power, board space) often dictate minimal viable hardware. Show tradeoff analysis.

3. **"Interrupts are always the right answer"** — Coming from event-driven software, students overuse interrupts. Counter: show interrupt overhead, priority inversion, and cases where polling is cleaner (e.g., tight ADC sampling loop).

4. **"volatile means thread-safe"** — Students think volatile prevents race conditions. Counter: demonstrate that volatile only prevents compiler optimization; show a real race condition and how to fix it (atomic operations, critical sections).

5. **"PWM duty cycle = exact voltage"** — Students expect PWM at 50% duty to give exact

## Vocabulary
Key terms for this domain: microcontroller architecture, peripherals, memory-mapped I/O, memory constraints, Flash vs SRAM, memory layout, registers, bit manipulation, volatile keyword, datasheets, register maps, electrical characteristics, memory, GPIO, output configuration (and 57 more).