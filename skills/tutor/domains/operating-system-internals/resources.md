# Operating System Internals — Resources

## Primary Sources (for lesson content)

### Textbooks
- **Operating Systems: Three Easy Pieces (OSTEP)** by Remzi and Andrea Arpaci-Dusseau
  - https://pages.cs.wisc.edu/~remzi/OSTEP/
  - Free online, modern approach, virtualization-first pedagogy
  - Perfect for intermediate learners: conversational tone but technically rigorous
  - Each chapter has homework and projects

- **xv6: A Simple, Unix-like Teaching Operating System**
  - https://pdos.csail.mit.edu/6.828/2021/xv6/book-riscv-rev2.pdf
  - Official book accompanying the xv6 kernel
  - Line-by-line explanations of a real (tiny) OS
  - Best resource for understanding kernel internals through code

- **Operating System Concepts (10th Edition)** by Silberschatz, Galvin, Gagne
  - Classic "dinosaur book", comprehensive reference
  - More formal than OSTEP, better for deep dives on specific topics
  - Strong on concurrency and file systems

- **Modern Operating Systems (4th Edition)** by Andrew Tanenbaum
  - Design principles and case studies (UNIX, Linux, Windows)
  - Good for understanding historical evolution and design trade-offs

### Online Courses & Lecture Notes

- **MIT 6.S081: Operating System Engineering**
  - https://pdos.csail.mit.edu/6.828/2021/schedule.html
  - Full syllabus, lecture notes, and labs using xv6
  - Video lectures available on YouTube
  - Labs are hands-on kernel hacking (system calls, page tables, locks, file systems)

- **Stanford CS140: Operating Systems**
  - http://web.stanford.edu/~ouster/cgi-bin/cs140-spring20/
  - Project-based using Pintos (another teaching OS)
  - Excellent project specs for threads, virtual memory, file systems

- **UC Berkeley CS162: Operating Systems and System Programming**
  - https://cs162.org/
  - Lecture videos, notes, and projects
  - Modern treatment with containers, distributed systems tie-ins

### Linux Kernel Documentation

- **The Linux Kernel Documentation**
  - https://www.kernel.org/doc/html/latest/
  - Official docs for subsystems (memory management, scheduling, file systems)
  - Start with: process management, memory management, locking

- **Linux Kernel Teaching Resources**
  - https://linux-kernel-labs.github.io/refs/heads/master/
  - Structured labs for learning kernel programming
  - Covers modules, processes, interrupts, memory management

## Supplementary (for engagement)

### Videos & Channels

- **MIT 6.S081 Video Lectures (Fall 2021)**
  - https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB
  - Full semester of lectures on OS internals
  - Professor Frans Kaashoek's clear explanations of xv6

- **Computerphile (OS-related videos)**
  - https://www.youtube.com/user/Computerphile
  - Search for: virtual memory, paging, threading, deadlock
  - Accessible 10-15 minute explanations of OS concepts

- **CppCon / Systems Talks**
  - Search YouTube for: "CppCon memory model", "systems programming", "kernel development"
  - Advanced talks on concurrency, memory barriers, lockless algorithms

### Interactive Tools & Simulators

- **QEMU** — CPU emulator for running xv6 and other OSes
  - https://www.qemu.org/
  - Essential for kernel development and experimentation

- **GDB** — debugger for stepping through kernel code
  - https://www.gnu.org/software/gdb/
  - Use with QEMU to debug xv6 or Linux kernel

- **Compiler Explorer (Godbolt)**
  - https://godbolt.org/
  - See how C code compiles to assembly (useful for understanding atomic operations, memory barriers)

- **eBPF Playground**
  - https://ebpf.io/
  - Interactive examples of eBPF programs for tracing and performance analysis

- **OS Dev Wiki**
  - https://wiki.osdev.org/
  - Community resource for OS development from scratch
  - Hardware specs, bootloaders, drivers, tutorials

### Code Repositories

- **xv6 (RISC-V version)**
  - https://github.com/mit-pdos/xv6-riscv
  - ~9000 lines of clean, commented kernel code
  - Start here for understanding OS internals through code

- **Linux Kernel Source**
  - https://github.com/torvalds/linux
  - 30+ million lines, but well-organized
  - Focus on: kernel/, mm/ (memory), fs/ (file systems), net/ (networking)

- **Pintos** — Stanford's teaching OS
  - https://pintos-os.org/
  - Alternative to xv6, more complex but closer to real OS structure

- **Writing a Simple Operating System from Scratch**
  - https://github.com/cfenollosa/os-tutorial
  - Step-by-step tutorial building a toy OS
  - Good for understanding boot process, low-level x86 details

### Articles & Deep Dives

- **LWN.net (Linux Weekly News) — Kernel Section**
  - https://lwn.net/Kernel/
  - In-depth articles on Linux kernel internals
  - Highlights: CFS scheduler, RCU, memory management, eBPF, io_uring

- **The Morning Paper (archived)**
  - https://blog.acolyer.org/
  - Daily summaries of CS research papers, many on OS topics
  - Search for: scheduler, file systems, concurrency, virtualization

- **ACM Queue**
  - https://queue.acm.org/
  - Practitioner-focused systems articles
  - Good for understanding production OS issues

### Tools for Exploration

- **strace** — trace system calls
  - Pre-installed on most Linux systems
  - `strace ls` shows all syscalls ls makes
  - Great for understanding what programs actually do

- **perf** — Linux profiling tool
  - https://perf.wiki.kernel.org/
  - CPU profiling, event counting, tracing
  - `perf stat <program>` shows cache misses, context switches, etc.

- **bpftrace** — high-level tracing language for eBPF
  - https://github.com/iovisor/bpftrace
  - One-liners for complex kernel tracing
  - Example: `bpftrace -e 'tracepoint:syscalls:sys_enter_* { @[probe] = count(); }'`

- **htop** — interactive process viewer
  - https://htop.dev/
  - See processes, threads, CPU/memory usage in real-time

## People (to follow and read)

- **Remzi Arpaci-Dusseau** — OS researcher, OSTEP author, expert on file systems and distributed storage
- **Andrea Arpaci-Dusseau** — OS researcher, OSTEP co-author, expert on reliability and crash consistency
- **Robert Love** — Linux kernel developer, author of "Linux Kernel Development"
- **Jonathan Corbet** — LWN.net editor, deep Linux kernel knowledge
- **Brendan Gregg** — performance expert, eBPF advocate, author of "Systems Performance"
- **Frans Kaashoek** — MIT professor, xv6 creator, distributed systems expert
- **Andrew Tanenbaum** — OS pioneer, MINIX creator, textbook author
- **Linus Torvalds** — Linux creator, benevolent dictator for life (BDFL)

## Unexpected Connections (for wild cards)

- **Operating Systems and Music Synthesis**
  - Real-time audio requires sub-millisecond latency
  - RT-Linux patches, priority inversion, deadline scheduling
  - Great example of where "theory meets practice" fails without real-time OS support

- **File Systems and Databases**
  - Both solve crash consistency with write-ahead logging
  - ZFS uses database techniques (checksums, snapshots, B-trees)
  - SQLite bypasses file system journaling for performance

- **OS Scheduling and Economics**
  - Scheduling algorithms are resource allocation problems
  - Fair queueing theory comes from economics (fair division, mechanism design)
  - CFS uses "virtual runtime" — a currency for CPU time

- **Virtual Memory and Garbage Collection**
  - Both track object liveness (pages vs heap objects)
  - Generational GC inspired by working set theory
  - Mark-and-sweep GC is similar to page replacement policies

- **Concurrency and Quantum Mechanics**
  - Memory consistency models (relaxed, acquire/release) mirror quantum entanglement
  - Happens-before relationships in distributed systems
  - Lamport clocks vs physical time (like relativity)

- **Containers and Biological Cells**
  - Cell membranes = namespaces (selective permeability)
  - Organelles = cgroups (specialized resource pools)
  - DNA = image layers (immutable template + mutations)

## Getting Started (recommended learning path)

1. **Week 1-2**: Read OSTEP chapters on processes and scheduling while reading xv6 code for context switching
2. **Week 3-4**: OSTEP memory management chapters + xv6 page table implementation
3. **Week 5-6**: OSTEP file systems + xv6 file system code + ext4 documentation
4. **Week 7-8**: OSTEP concurrency + xv6 spinlocks + Linux RCU articles
5. **Week 9-10**: MIT 6.S081 labs (pick 2-3 to implement)
6. **Ongoing**: Use strace/perf/bpftrace on your daily programs to see OS internals in action

## Advanced Topics (beyond this curriculum)

- **Distributed Operating Systems** — Google's Borg, Kubernetes as OS
- **Real-Time Operating Systems** — FreeRTOS, RT-Linux, deadline scheduling
- **Microkernel Design** — seL4, MINIX 3, formal verification
- **Operating Systems for New Hardware** — GPUs (CUDA runtime), TPUs, FPGA-based systems
- **Unikernels** — Library OSes that compile app + kernel into single binary
- **Research Frontiers** — persistent memory (PMEM), io_uring, BPF, Rust in kernel
