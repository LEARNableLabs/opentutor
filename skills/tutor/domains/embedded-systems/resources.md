# Embedded Systems Design — Resources

## Primary Sources (for lesson content)

### Textbooks

- **"Introduction to Embedded Systems" by Edward A. Lee and Sanjit A. Seshia** (UC Berkeley, 2017)
  - Available free: https://ptolemy.berkeley.edu/books/leeseshia/
  - Formal, model-based approach. Excellent for intermediate students who want rigor.
  - Covers concurrent models, timing, real-time systems.

- **"Making Embedded Systems" by Elecia White** (O'Reilly, 2011)
  - Practical, industry-focused. Great for "how to actually build things."
  - Design patterns, architecture, debugging, optimization.
  - Complements the UC Berkeley text well (theory + practice).

- **"Embedded Systems Architecture" by Tammy Noergaard** (Newnes, 2012)
  - Comprehensive coverage of microcontroller internals, memory, buses, peripherals.
  - More reference than tutorial; use for deep dives.

- **"The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors" by Joseph Yiu** (Newnes, 2013)
  - The authoritative reference for ARM Cortex-M architecture.
  - Detailed but accessible. Use for lessons on interrupts, timers, NVIC.

### University Courses

- **UC Berkeley EECS 149/249A: Introduction to Embedded Systems**
  - Course site: https://ptolemy.berkeley.edu/projects/embedded/
  - Lectures, labs, and the Lee/Seshia textbook.

- **MIT 6.08: Introduction to EECS via Embedded Systems**
  - https://web.mit.edu/6.08/www/
  - Python on ESP32. Less low-level than this curriculum but good for project ideas.

- **UT Austin Embedded Systems - Shape the World**
  - edX course by Jonathan Valvano: https://www.edx.org/course/embedded-systems-shape-the-world-microcontroller-i
  - Hands-on with TM4C microcontroller. Excellent lab exercises.

- **FastBit Embedded Brain Academy**
  - Udemy courses on ARM Cortex-M, STM32, and embedded C.
  - https://www.udemy.com/user/kiran-nayak-2/

### Documentation

- **ARM Cortex-M Architecture Reference Manual**
  - https://developer.arm.com/documentation/ddi0403/latest/
  - Definitive reference for ARM Cortex-M architecture.

- **STM32 Reference Manuals** (example: STM32F1 family)
  - https://www.st.com/resource/en/reference_manual/rm0008-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf
  - Detailed register maps, peripheral descriptions.

- **Microchip AVR Datasheets** (example: ATmega328P)
  - https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48A-PA-88A-PA-168A-PA-328-P-DS-DS40002061B.pdf
  - Classic 8-bit microcontroller used in Arduino Uno.

## Supplementary (for engagement)

### Video Series

- **Embedded Systems Course by Neso Academy**
  - YouTube playlist: https://www.youtube.com/playlist?list=PLBlnK6fEyqRgLLlzdgiTUKULKJPYc0A4q
  - Covers fundamentals, timers, interrupts, communication protocols.

- **DigiKey's Introduction to RTOS**
  - YouTube series by Shawn Hymel: https://www.youtube.com/playlist?list=PLEBQazB0HUyQ4hAPU1cJED6t3DU0h34bz
  - Practical RTOS tutorials with FreeRTOS on ESP32.

- **Microchip University**
  - https://mu.microchip.com/
  - Free training modules on microcontrollers, peripherals, and protocols.

- **Phil's Lab**
  - YouTube channel: https://www.youtube.com/@PhilsLab
  - PCB design, embedded firmware, hardware debugging. Advanced but inspiring.

### Blogs and Articles

- **Interrupt by Memfault**
  - https://interrupt.memfault.com/
  - Modern embedded software engineering. Best practices, debugging, optimization.
  - Must-reads: "Zero to main()", "Cortex-M fault handling", "Reducing firmware size"

- **Embedded Artistry**
  - https://embeddedartistry.com/blog/
  - Patterns, architecture, testing. Focus on code quality.

- **Embedded.com**
  - https://www.embedded.com/
  - Industry news, tutorials, and deep dives.

- **Jack Ganssle's Embedded Muse**
  - http://www.ganssle.com/tem-subunsub.html
  - Newsletter on embedded development. War stories and wisdom.

### Interactive Tools

- **Wokwi**
  - https://wokwi.com/
  - Web-based simulator for Arduino, ESP32, Raspberry Pi Pico, STM32.
  - Instant feedback; no hardware required.

- **Jupyter + matplotlib for data visualization**
  - Plot ADC readings, visualize PWM signals, analyze communication protocol timing.

- **STM32CubeMX**
  - https://www.st.com/en/development-tools/stm32cubemx.html
  - Graphical configuration tool for STM32 peripherals. Generates initialization code.

- **PulseView (sigrok)**
  - https://sigrok.org/wiki/PulseView
  - Open-source logic analyzer software. Works with cheap hardware (Saleae clones, ~$10).

- **Godbolt Compiler Explorer**
  - https://godbolt.org/
  - See what assembly your C code generates. Great for understanding compiler optimization.

### Code Repositories

- **Embedded Artistry's embedded-resources**
  - https://github.com/embedded-artistry/embedded-resources
  - Curated list of embedded tools, libraries, and best practices.

- **Awesome Embedded**
  - https://github.com/nhivp/Awesome-Embedded
  - Comprehensive list of embedded resources, categorized.

- **FreeRTOS Kernel**
  - https://github.com/FreeRTOS/FreeRTOS-Kernel
  - Source code for the most popular embedded RTOS. Read for learning.

- **STM32 HAL Examples**
  - https://github.com/STMicroelectronics/STM32CubeF1
  - Official examples for STM32 peripherals using HAL library.

### Development Boards (Hardware)

- **STM32 Nucleo-F103RB** (~$15)
  - ARM Cortex-M3, integrated ST-Link debugger, Arduino-compatible headers.
  - https://www.st.com/en/evaluation-tools/nucleo-f103rb.html

- **Raspberry Pi Pico** (~$4)
  - ARM Cortex-M0+, dual-core, well-documented C/C++ SDK.
  - https://www.raspberrypi.com/products/raspberry-pi-pico/

- **ESP32 DevKit** (~$10)
  - Dual-core Xtensa, WiFi + Bluetooth, huge community.
  - https://www.espressif.com/en/products/devkits

- **Arduino Nano/Uno** (~$5-25)
  - Classic beginner board. AVR (8-bit) or ARM (Nano 33).
  - https://www.arduino.cc/

### Debugging Tools

- **SEGGER J-Link EDU** (~$20)
  - Professional JTAG/SWD debugger. Educational version for hobbyists.
  - https://www.segger.com/products/debug-probes/j-link/models/j-link-edu/

- **Logic Analyzer (8-channel, ~$10)**
  - Generic Saleae clone. Works with PulseView/sigrok.
  - Search "USB logic analyzer" on AliExpress/Amazon.

- **Oscilloscope (entry-level: ~$50-100)**
  - DSO138 kit or Hantek 2D42. Good enough for digital signals.
  - Or use a sound card + software oscilloscope (Xoscope, Baudline).

## People (to follow/look up)

- **Elecia White** — Author of "Making Embedded Systems", host of Embedded.fm podcast
- **Jack Ganssle** — Embedded systems veteran, author, consultant
- **Chris Gammell** — Electronics educator, The Amp Hour podcast
- **Shawn Hymel** — DigiKey educator, RTOS and TinyML tutorials
- **Phillip Johnston** — Embedded Artistry, code quality advocate
- **François Baldassari** — Memfault co-founder, Interrupt blog
- **Jean Labrosse** — Creator of µC/OS RTOS, embedded education

## Unexpected Connections (for wild cards)

- **Music synthesis** — digital audio on microcontrollers. PWM audio, I2S, DSP. (See: Teensy Audio Library)
- **Retro gaming** — emulate 8-bit consoles on ARM Cortex-M. (See: PicoSystem, Arduboy)
- **Robotics** — motor control, sensor fusion, path planning. Embedded meets control theory.
- **Amateur radio** — SDR (software-defined radio) on microcontrollers. (See: Pocket-SDR)
- **Wearables** — ultra-low-power design, BLE, gesture recognition. (See: TinyML, Arduino Nano 33 BLE)
- **Art installations** — LED matrices, motor choreography, sensor-driven interactivity. (See: FastLED library)
- **Space** — radiation-hardened embedded systems, satellite onboard computers. (See: NASA CORE Flight System)
- **Medical devices** — safety-critical embedded, regulatory compliance. (See: FDA embedded guidance)

## Podcasts

- **Embedded.fm** — Elecia White and Christopher White interview embedded engineers
  - https://embedded.fm/

- **The Amp Hour** — Electronics and embedded news/discussion
  - https://theamphour.com/

- **Embedded** — IoT, embedded Linux, firmware development
  - https://www.embedded.com/podcasts/

## Newsletters and Communities

- **Embedded Muse** — Jack Ganssle's newsletter
  - http://www.ganssle.com/tem-subunsub.html

- **Interrupt newsletter** — Memfault's monthly embedded digest
  - https://interrupt.memfault.com/

- **r/embedded (Reddit)** — Active community for embedded questions and project sharing
  - https://www.reddit.com/r/embedded/

- **Embedded Systems Discord** — Real-time chat for embedded developers
  - Search "embedded systems discord" to find active servers

## Tools and Software

- **STM32CubeIDE** — Free IDE for STM32 (Eclipse-based, integrated debugger)
  - https://www.st.com/en/development-tools/stm32cubeide.html

- **PlatformIO** — Cross-platform IDE for embedded (VSCode extension, supports 100+ boards)
  - https://platformio.org/

- **Keil MDK** — Professional ARM development environment (free version available)
  - https://www.keil.com/

- **QEMU** — Emulator for ARM Cortex-M and other architectures
  - https://www.qemu.org/

- **Renode** — Multi-node embedded system simulator
  - https://renode.io/

- **OpenOCD** — Open On-Chip Debugger (JTAG/SWD interface)
  - https://openocd.org/

## Standards and References

- **I2C Specification** — NXP UM10204
  - https://www.nxp.com/docs/en/user-guide/UM10204.pdf

- **SPI Overview** — Motorola/Freescale
  - https://www.analog.com/en/analog-dialogue/articles/introduction-to-spi-interface.html

- **CAN Specification** — Bosch CAN 2.0
  - https://www.bosch-semiconductors.com/ip-modules/can-ip-modules/can-protocol/

- **USB 2.0 Specification** — USB Implementers Forum
  - https://www.usb.org/document-library/usb-20-specification
