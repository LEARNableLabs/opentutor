# Operating System Internals — Concept Map

## Core Concepts (in learning order)

1. **Process abstraction** — the illusion that each program runs alone on the machine
2. **Address space** — isolated memory view for each process
3. **Time-sharing** — multiplexing CPU across processes
4. **Context switch** — saving/restoring process state to switch between processes
5. **Process control block (PCB)** — kernel data structure tracking process state
6. **fork() system call** — creating new processes by cloning. Depends on: process abstraction, PCB
7. **Copy-on-write (COW)** — lazy memory copying for efficiency. Depends on: address space
8. **CPU scheduling algorithms** — FIFO, SJF, round-robin, priority-based. Depends on: time-sharing, context switch
9. **Completely Fair Scheduler (CFS)** — Linux's modern scheduler using virtual runtime. Depends on: CPU scheduling algorithms
10. **Virtual memory** — mapping virtual to physical addresses. Depends on: address space
11. **Paging** — fixed-size memory allocation units. Depends on: virtual memory
12. **Page tables** — data structure for address translation. Depends on: paging
13. **Multi-level page tables** — hierarchical structure for sparse address spaces. Depends on: page tables
14. **Translation Lookaside Buffer (TLB)** — cache for address translations. Depends on: page tables
15. **Page replacement policies** — LRU, clock, working set. Depends on: paging, virtual memory
16. **Kernel memory allocators** — slab, buddy system. Depends on: paging
17. **File descriptors** — process-specific handles to open files
18. **Inodes** — on-disk data structure representing files. Depends on: file systems
19. **Directory structure** — hierarchical organization of files. Depends on: inodes
20. **Hard links vs soft links** — different ways to reference files. Depends on: inodes, directory structure
21. **Journaling** — write-ahead logging for crash consistency. Depends on: file systems
22. **I/O stack** — layers from application to device. Depends on: file descriptors
23. **Device drivers** — kernel modules managing hardware. Depends on: I/O stack
24. **Interrupts** — hardware notifications to CPU. Depends on: I/O stack
25. **Direct Memory Access (DMA)** — device-driven memory transfers. Depends on: interrupts, I/O stack
26. **Race conditions** — bugs from interleaved execution. Depends on: concurrency
27. **Critical sections** — code regions requiring mutual exclusion. Depends on: race conditions
28. **Locks** — synchronization primitive for mutual exclusion. Depends on: critical sections
29. **Spin locks** — busy-waiting locks. Depends on: locks
30. **Hardware atomics** — test-and-set, compare-and-swap. Depends on: spin locks
31. **Condition variables** — waiting for events in concurrent code. Depends on: locks
32. **Monitors** — high-level synchronization construct. Depends on: locks, condition variables
33. **Deadlock** — circular waiting on resources. Depends on: locks
34. **Read-Copy-Update (RCU)** — lockless synchronization for read-heavy workloads. Depends on: locks, memory barriers
35. **Hypervisors** — software creating virtual machines. Depends on: virtualization, privilege levels
36. **Hardware-assisted virtualization** — VT-x/AMD-V extensions. Depends on: hypervisors
37. **Namespaces** — isolation mechanism for containers. Depends on: process abstraction
38. **Control groups (cgroups)** — resource limiting for containers. Depends on: process management
39. **eBPF** — safe kernel extension mechanism. Depends on: kernel architecture, verification

## Dependencies

### Process Management
- **Context switch** requires understanding the process control block because the PCB holds the register state, stack pointer, and page table base that must be saved/restored
- **fork()** builds on process abstraction and PCB because it duplicates both the address space and process metadata
- **Copy-on-write** optimizes fork() by deferring memory copying until writes occur

### Memory Management
- **Multi-level page tables** solve the space problem of single-level tables for 64-bit address spaces
- **TLB** is critical for performance because page table walks would otherwise require multiple memory accesses per address translation
- **Page replacement** only matters when physical memory is overcommitted and swapping is needed

### File Systems
- **Journaling** solves the consistency problem when crashes occur mid-transaction (e.g., during multi-block updates)
- **Directory structure** is implemented using inodes that point to other inodes, creating a directed acyclic graph (with hard links) or tree (without)

### I/O Systems
- **DMA** requires interrupt handling because the device must notify the CPU when the transfer completes
- **Device drivers** abstract hardware details and present uniform interfaces to the rest of the kernel

### Concurrency
- **Condition variables** require locks because they must atomically release the lock and wait for a signal
- **Deadlock** only occurs with locks (or other exclusive resources) when circular wait conditions form
- **RCU** is an advanced alternative to locks for read-heavy scenarios, trading space (multiple versions) for lockless reads

### Virtualization
- **Hardware-assisted virtualization** (VT-x/AMD-V) enables efficient trap-and-emulate by providing a separate privilege level for the guest OS
- **Containers** use namespaces and cgroups instead of full virtualization, sharing the kernel but isolating resources

## Prerequisite Topics

- **C programming** — needed for understanding kernel code, system calls, pointer manipulation
- **Assembly language** — needed for context switch, interrupt handling, hardware atomics
- **Data structures** — needed for page tables (multi-level trees), scheduling (red-black trees), memory allocation (buddy system)
- **Computer architecture** — needed for understanding CPU privilege levels, memory hierarchy, TLBs, cache coherence

## Bottleneck Concepts

These concepts act as gates to later material:

1. **Virtual memory** — almost everything in modern OS design assumes virtual memory (process isolation, shared libraries, memory-mapped I/O)
2. **Page tables** — must understand this before file systems (mmap), concurrency (TLB shootdown), virtualization (nested paging)
3. **Interrupts** — foundational for I/O, scheduling, and real-time systems
4. **Locks** — must understand before tackling advanced synchronization (RCU, lockless algorithms)

## Common Misconceptions

- **"Context switches are just saving registers"** — No, they also involve TLB flushes, cache pollution, and potential page table switches
- **"Virtual memory is just swapping"** — No, it's primarily about isolation and protection; swapping is a consequence of overcommitment
- **"Threads are faster than processes"** — Not always; thread context switches are cheaper, but shared address space creates synchronization overhead
- **"Journaling prevents all data loss"** — No, it ensures file system consistency (metadata), but may not protect user data
- **"Spin locks are always bad"** — No, on multicore systems with short critical sections, spinning avoids expensive context switches
- **"Virtualization adds huge overhead"** — Modern hardware-assisted virtualization has <5% overhead for CPU-bound tasks
