# Embedded Systems Design — Concept Map

## Core Concepts (in learning order)

1. **Microcontroller architecture** — integrated processor with memory and peripherals on a single chip
2. **Memory constraints** — understanding Flash, SRAM, and limited memory budgets. Depends on: microcontroller architecture
3. **Registers and bit manipulation** — direct hardware control via memory-mapped I/O. Depends on: microcontroller architecture
4. **Datasheets** — reading and interpreting technical specifications. Depends on: registers and bit manipulation
5. **GPIO (General Purpose I/O)** — digital input/output pins for basic hardware control. Depends on: registers and bit manipulation
6. **Pull-up/pull-down resistors** — input signal conditioning and default states. Depends on: GPIO
7. **Debouncing** — handling mechanical switch noise. Depends on: GPIO
8. **ADC (Analog-to-Digital Converter)** — converting analog signals to digital values. Depends on: GPIO, sampling theory
9. **PWM (Pulse Width Modulation)** — creating analog-like outputs with digital signals. Depends on: GPIO, duty cycle
10. **Interrupts** — asynchronous event handling for responsive systems. Depends on: microcontroller architecture
11. **ISR (Interrupt Service Routine)** — code executed in response to interrupts. Depends on: interrupts
12. **Shared data and atomicity** — protecting data accessed by both ISRs and main code. Depends on: ISR
13. **Hardware timers** — precise timing without blocking the CPU. Depends on: interrupts
14. **UART (Universal Asynchronous Receiver-Transmitter)** — simple serial communication. Depends on: interrupts
15. **SPI (Serial Peripheral Interface)** — synchronous master-slave communication. Depends on: interrupts, clock concepts
16. **I2C (Inter-Integrated Circuit)** — two-wire multi-device bus. Depends on: addressing, master-slave
17. **Error detection (CRC)** — ensuring data integrity in communication. Depends on: communication protocols
18. **DMA (Direct Memory Access)** — hardware-driven data transfer without CPU intervention. Depends on: memory, interrupts
19. **Real-time constraints** — understanding hard and soft deadlines. Depends on: timing, determinism
20. **State machines** — organizing complex behavior in embedded systems. Depends on: control flow
21. **Cooperative scheduling** — running multiple tasks without preemption. Depends on: state machines
22. **RTOS (Real-Time Operating System)** — preemptive scheduling for complex systems. Depends on: interrupts, priority, context switching
23. **Power management** — sleep modes and energy optimization. Depends on: microcontroller architecture, timers
24. **Debugging techniques** — JTAG, SWD, and hardware debugging tools. Depends on: all previous concepts
25. **Reliability and fault tolerance** — designing systems that work in production. Depends on: all previous concepts

## Dependencies

### Hardware Foundation Cluster
- **Registers** require understanding **microcontroller architecture** because registers are the interface to hardware peripherals
- **Datasheets** build on **registers** because they document register maps and configurations
- **Memory constraints** require understanding **architecture** because you need to know where code and data live

### I/O Cluster
- **GPIO** requires **registers** because you configure pins by writing to control registers
- **Pull-up/pull-down** and **debouncing** require **GPIO** because they solve practical input problems
- **ADC** and **PWM** require **GPIO** because they use physical pins, plus timing concepts
- All I/O builds on **datasheets** because you consult them to configure peripherals correctly

### Interrupt Cluster
- **ISRs** require **interrupts** (obviously) but also **registers** to configure interrupt sources
- **Shared data** requires **ISR** knowledge because race conditions appear when ISRs and main code access the same variables
- **Timers** require **interrupts** because timer events trigger ISRs for precise timing

### Communication Cluster
- **UART, SPI, I2C** all require **interrupts** for efficient implementation
- **SPI** and **I2C** require understanding **master-slave** relationships
- **DMA** requires understanding **memory** and **interrupts** to move data efficiently
- **Error detection** builds on **communication protocols** to ensure reliability

### Real-Time and System Design Cluster
- **State machines** are independent but essential for organizing embedded logic
- **Cooperative scheduling** builds on **state machines** to run multiple tasks
- **RTOS** requires understanding **interrupts**, **priority**, and **context switching**
- **Power management** requires **architecture** knowledge (sleep modes) and **timers** (wake sources)
- **Debugging** requires **all previous concepts** to effectively troubleshoot

## Bottleneck Concepts

### Critical Foundations
1. **Registers and bit manipulation** — without this, you can't configure any peripheral
2. **Interrupts** — unlock responsive, efficient embedded systems
3. **Datasheets** — the primary source of truth for all hardware work

### Integration Points
1. **Shared data and atomicity** — common source of subtle bugs
2. **Hardware timers** — enable both timing and advanced peripheral features
3. **State machines** — organize complexity in bare-metal systems

## Common Misconceptions

1. **"Embedded programming is just C programming"** — ignores hardware constraints, timing, and resource limits
2. **"Faster clock = better performance"** — ignores power consumption and real-time determinism
3. **"Interrupts are always better than polling"** — interrupts have overhead; sometimes polling is correct
4. **"You need an RTOS for any non-trivial system"** — many complex systems run bare-metal with good architecture
5. **"volatile solves all concurrency problems"** — volatile only prevents optimization, doesn't guarantee atomicity
6. **"PWM creates a true analog voltage"** — it's a digital signal that averages to an analog level after filtering
7. **"All pins are interchangeable"** — pins have specific alternate functions mapped in hardware
8. **"Debugging embedded systems requires expensive tools"** — good code structure and simple tools (UART, LED) go far

## Prerequisite Topics

- **C programming** — needed for: all concepts (the lingua franca of embedded)
- **Binary and hexadecimal arithmetic** — needed for: registers, bit manipulation, addressing
- **Digital logic** — needed for: GPIO, understanding TTL/CMOS levels, timing diagrams
- **Basic electronics** — needed for: pull-up resistors, power management, signal conditioning
- **Pointers and memory** — needed for: memory-mapped I/O, DMA, understanding the stack

## Learning Pathways

### Path 1: Hardware-First
Start with GPIO → ADC/PWM → build increasingly complex I/O → add interrupts → add communication

### Path 2: Software-First
Start with interrupts and timers → build event-driven patterns → add peripherals as needed

### Path 3: Project-Driven
Pick a concrete project (e.g., temperature logger) → learn concepts as they become necessary

**This curriculum follows Path 1** — it builds hardware intuition first, then adds software sophistication. Best for students with software background who need to develop hardware awareness.
