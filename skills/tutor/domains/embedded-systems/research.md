# Embedded Systems Design — Research Summary

## Major Subtopics

1. **Hardware Fundamentals**
   - Microcontroller architecture (ARM Cortex-M, AVR, PIC)
   - Memory systems (Flash, SRAM, EEPROM)
   - Clock systems and timing
   - Power modes and management

2. **Hardware-Software Interface**
   - Register-level programming
   - Memory-mapped I/O
   - Bit manipulation and masking
   - Peripheral configuration

3. **I/O and Interfacing**
   - GPIO (digital I/O)
   - Analog interfaces (ADC, DAC, PWM)
   - Sensors and actuators
   - Signal conditioning

4. **Interrupts and Events**
   - Interrupt service routines (ISRs)
   - Priority and nesting
   - Event-driven programming
   - Context switching

5. **Communication Protocols**
   - Serial (UART, SPI, I2C)
   - CAN bus
   - USB
   - Wireless (Bluetooth, WiFi, LoRa)

6. **Real-Time Systems**
   - Timing constraints
   - Schedulers (RTOS basics)
   - Concurrency and synchronization
   - Determinism

7. **Software Design Patterns**
   - State machines
   - Bare-metal vs RTOS
   - Modular architecture
   - HAL (Hardware Abstraction Layer)

8. **Power and Performance**
   - Power budgets
   - Sleep modes
   - Battery-powered design
   - Optimization techniques

9. **Testing and Debugging**
   - JTAG/SWD debugging
   - Logic analyzers
   - Oscilloscopes
   - Unit testing embedded code

10. **System Integration**
    - PCB bring-up
    - Design constraints
    - Reliability and fault tolerance
    - Production considerations

## Key Sources

### Textbooks
- **"Introduction to Embedded Systems" by Lee & Seshia** (UC Berkeley) — formal model-based approach, excellent for intermediate students
- **"Making Embedded Systems" by Elecia White** — practical, industry-focused
- **"Embedded Systems Architecture" by Tammy Noergaard** — comprehensive architectural coverage

### University Courses
- **UC Berkeley EECS 149/249A** — Introduction to Embedded Systems
- **MIT 6.08** — Introduction to EECS via Embedded Systems
- **UT Austin Embedded Systems - Shape the World** — Jonathan Valvano's course on edX

### Online Resources
- **Embedded.fm podcast** — industry professionals discussing real-world embedded systems
- **ARM Cortex-M documentation** — authoritative reference for popular architecture
- **FreeRTOS tutorials** — real-time OS fundamentals
- **Interrupt.memfault.com blog** — modern embedded software engineering practices

## Available Tools and Platforms

- **Development boards**: Arduino, STM32 Nucleo, ESP32, Raspberry Pi Pico, Nordic nRF52
- **Simulators**: QEMU (ARM), Renode, Wokwi (web-based)
- **IDEs**: STM32CubeIDE, PlatformIO, Keil, IAR, Arduino IDE
- **Debugging**: OpenOCD, GDB, Segger J-Link
- **Analysis tools**: PulseView (logic analyzer), WaveForms (oscilloscope)

## Notes for Intermediate Level

Students at this level typically have:
- Programming experience (C preferred, some Python)
- Basic electronics knowledge (voltage, current, digital logic)
- Familiarity with computer architecture concepts

They need to bridge from software-centric thinking to hardware-aware design. Focus on:
- **Why** hardware constraints matter (timing, power, memory)
- **How** to read datasheets and translate to code
- **When** to use different patterns (polling vs interrupts, bare-metal vs RTOS)
- Hands-on practice with real hardware (not just simulation)
