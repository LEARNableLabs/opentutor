# Operating System Internals — Teaching Notes

## Approach

Operating systems sit at the intersection of hardware and software, requiring both conceptual understanding and implementation details. At the intermediate level, balance theory with code: introduce mechanisms (how it works) through diagrams and pseudocode, then reinforce with real kernel code (xv6 for clarity, Linux for production complexity). Use a three-layer teaching method: (1) motivation/problem, (2) mechanism/solution, (3) policy/design choices. OS internals are deeply visual — always use diagrams for address translation, state machines for process lifecycle, and timelines for concurrency bugs.

The curriculum alternates between depth-first dives (e.g., multi-level page tables) and breadth-first surveys (e.g., scheduling algorithms) to maintain engagement. Each module ends with a review lesson that synthesizes concepts through tracing exercises (e.g., "trace a fork() from userspace to kernel and back"). Intermediate learners already know programming; focus on the "why" (design trade-offs) not just the "what" (facts).

## Common Misconceptions

1. **"The kernel is just a big program that runs all the time"**
   - **Why students get this wrong**: They don't yet understand privilege levels and mode switching.
   - **How to correct it**: Emphasize that the kernel is event-driven (syscalls, interrupts, exceptions). Show that user code runs most of the time; the kernel is entered only via controlled transitions. Walk through a syscall (e.g., read()) from trap to return, highlighting the mode switch.

2. **"Virtual memory is just about extending RAM with disk"**
   - **Why students get this wrong**: Early exposure to "virtual memory = swap" from introductory courses.
   - **How to correct it**: Reframe virtual memory as primarily about protection and isolation. Swapping is a side benefit of overcommitment, not the main purpose. Show that even systems with infinite RAM use virtual memory for process isolation.

3. **"Page tables waste memory"**
   - **Why students get this wrong**: They calculate (2^20 entries) × (4 bytes) = 4MB per process and think it's huge.
   - **How to correct it**: Introduce multi-level page tables immediately. Show that sparse address spaces only allocate pages for used regions. Compare actual memory usage (a few KB for typical process) vs. the naive single-level calculation.

4. **"Locks are simple: just lock before critical section, unlock after"**
   - **Why students get this wrong**: They haven't encountered the subtleties (deadlock, priority inversion, convoying, lock granularity trade-offs).
   - **How to correct it**: Introduce race conditions first with concrete examples (lost update, non-atomic read-modify-write). Then show that naive locking creates new problems (deadlock). Use the "locks are sharp tools" analogy — powerful but dangerous.

5. **"Interrupts and system calls are the same thing"**
   - **Why students get this wrong**: Both involve traps to kernel mode.
   - **How to correct it**: Distinguish synchronous (syscalls, exceptions) from asynchronous (interrupts). Show that syscalls are predictable and return to the caller, while interrupts are asynchronous and may context-switch to another process. Walk through an interrupt handler that wakes a sleeping process.

6. **"Threads share everything, processes share nothing"**
   - **Why students get this wrong**: Oversimplified mental models from intro courses.
   - **How to correct it**: Show that threads share address space but have separate stacks and registers. Show that processes can share memory (mmap with MAP_SHARED, System V IPC). The real distinction is about default isolation, not absolute separation.

7. **"File systems are just about organizing files into directories"**
   - **Why students get this wrong**: They only see the namespace, not the crash recovery, caching, and I/O scheduling layers.
   - **How to correct it**: Start with the inode layer (actual data/metadata storage), then build up to the namespace layer. Emphasize that the hard problems are consistency (journaling) and performance (block allocation, caching).

8. **"Context switches are cheap because they're just a few instructions"**
   - **Why students get this wrong**: They only count the register save/restore overhead.
   - **How to correct it**: Explain the hidden costs: TLB flush, cache pollution, pipeline stalls. Show microbenchmark results (context switch: ~5μs, but application slowdown can be 10-50x due to cache misses). Introduce the concept of "working set" and why context switches hurt.

## Level Adjustments

### For Intermediate Learners (this curriculum)
- **Assume**: comfort with C pointers, basic data structures, some assembly exposure
- **Emphasize**: mechanisms (how page tables work) and policies (why LRU over FIFO), with real kernel code examples
- **Depth**: full details on core mechanisms (address translation, context switch), survey treatment for advanced topics (RCU, eBPF)
- **Formalism**: informal but precise — use diagrams and code, not formal proofs
- **Examples**: xv6 for clarity (3000 LOC), Linux for production reality (30M LOC)

### Compared to Beginner
- Beginners need more hand-holding on C/assembly, less exposure to kernel code, and more emphasis on high-level abstractions ("processes give isolation") without full details.
- Intermediate learners should read actual kernel code, trace execution through debuggers, and understand performance trade-offs.

### Compared to Advanced
- Advanced learners should implement significant kernel components (full scheduler, page replacement), analyze research papers (SOSP/OSDI), and optimize for real-world workloads.
- Intermediate learners should understand the mechanisms deeply but only implement small pieces (user-space threading library, simple shell).

## Rabbit Holes (Fascinating Connections)

- **"Why is fork() considered a brilliant mistake?"** — Drop this when discussing fork() (lesson 3). Explore how fork() made UNIX design elegant (pipe, I/O redirection) but creates problems for modern systems (Android, containers). Mention that other OSes (Windows) use spawn() instead.

- **"The curious case of the 'futex' — when kernel and userspace share a lock"** — Drop this during the locks lesson (lesson 20). Explain how modern mutexes use atomic operations in userspace for the uncontended case, and only syscall (futex) when there's contention. This is why locks are fast in practice.

- **"Why does Linux have 5 different I/O schedulers?"** — Drop this during I/O lessons (lesson 16). Explore how SSDs killed the old elevator algorithms, leading to new schedulers (mq-deadline, BFQ, Kyber). This shows how hardware changes drive OS evolution.

- **"The TLB flush that cost Google millions"** — Drop this during TLB lessons (lesson 9). Discuss meltdown/spectre mitigations (KPTI) that force TLB flushes on every syscall, causing 5-30% performance regression. Great example of security vs performance trade-offs.

- **"How eBPF is turning Linux into a microkernel... from the inside"** — Drop this in the eBPF lesson (lesson 27). Explore how eBPF allows dynamic kernel extension without kernel modules, and how it's being used for networking (XDP), security (LSM), and observability (bpftrace).

- **"The 'zombie process' and the 'orphan process' — process family drama"** — Drop this early in process lessons (lesson 1-3). Explain wait(), SIGCHLD, and what happens when parent/child die at different times. Use anthropomorphic analogies for engagement.

- **"Why does `rm` not actually delete your file?"** — Drop this during file system lessons (lesson 13-15). Explain inode reference counting, hard links, and how `rm` just removes directory entries. This is why file recovery tools can work.

## Difficulty Progression

### Early Modules (Lessons 1-12): Building Mental Models
- **Difficulty range**: 2-4, mostly 2-3
- **Goal**: establish core abstractions (process, virtual memory)
- **Pattern**: gentle intro (difficulty 2) → mechanism deep-dive (difficulty 3) → advanced variant (difficulty 4) → review (difficulty 2)
- **Pacing**: review every 6 lessons to consolidate

### Middle Modules (Lessons 13-18): Reinforcement
- **Difficulty range**: 2-4, with sustained 3-4
- **Goal**: apply earlier concepts to file systems and I/O
- **Pattern**: assumes comfort with processes and memory, so can move faster
- **Pacing**: review every 6 lessons

### Late Modules (Lessons 19-24): Peak Complexity
- **Difficulty range**: 2-5, with peak difficulty 5 on RCU (lesson 23)
- **Goal**: tackle inherently difficult topics (concurrency, synchronization)
- **Pattern**: build from simple (locks) to advanced (RCU) incrementally
- **Pacing**: review every 6 lessons, critical for preventing overwhelm

### Final Module (Lessons 25-28): Synthesis
- **Difficulty range**: 3-4, ending with teach-back (difficulty 3)
- **Goal**: connect to modern systems (containers, eBPF) and synthesize via teach-back
- **Pattern**: application-focused, less about new mechanisms, more about seeing the full picture
- **Pacing**: teach-back lesson forces active synthesis

### Review Lessons (6, 12, 18, 24)
- Always difficulty 1-2
- Focus on tracing exercises and connecting concepts across lessons
- Student-driven: "What are you still confused about?" not just "Repeat the facts"

## Teaching Tips

- **Use analogies sparingly**: OS analogies (restaurant for scheduling, library for memory) can help initially but break down quickly. Transition to actual mechanisms within 1-2 lessons.
- **Code walkthroughs**: For intermediate students, reading kernel code is essential. Start with xv6 (simple, pedagogical), then show Linux equivalents (production, complex). Use a debugger to step through live code.
- **Hands-on exercises**: Don't just lecture. Give small coding tasks: "Write a user-space threading library" (for context switch), "Implement LRU page replacement" (for memory), "Fix this race condition" (for concurrency).
- **Draw everything**: Address translation, process state machines, lock ordering graphs. Visuals are essential for OS internals.
- **Connect to performance**: Show syscall overhead microbenchmarks, page fault costs, context switch penalties. Make the abstractions concrete with measurements.
