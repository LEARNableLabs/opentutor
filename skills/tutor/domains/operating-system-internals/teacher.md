# Operating System Internals — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 8 lessons (29%)
- **Socratic questions** — 5 lessons (18%)
- **real-world application challenges** — 5 lessons (18%)
- **curated resource exploration** — 5 lessons (18%)
- **review and consolidation sessions** — 4 lessons (14%)
- **teach-back exercises (student explains)** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 29% accessible (1-2), 39% standard (3), 32% challenging (4-5).

Difficulty peaks:
- Day 5: "How does Linux's Completely Fair Scheduler actually work?" (difficulty 4)
- Day 10: "When physical memory fills up, what gets evicted and why?" (difficulty 4)
- Day 11: "How does the kernel manage its own memory?" (difficulty 4)
- Day 15: "Why is crash consistency the hardest problem in file systems?" (difficulty 4)
- Day 17: "How do modern file systems like ZFS detect and repair silent corruption?" (difficulty 4)

## Domain Hooks
- **"Why is fork() considered a brilliant mistake?"** — Drop this when discussing fork() (lesson 3). Explore how fork() made UNIX design elegant (pipe, I/O redirection) but creates problems for modern systems (Android, containers). Mention that other OSes (Windows) use spawn() instead.

- **"The curious case of the 'futex' — when kernel and userspace share a lock"** — Drop this during the locks lesson (lesson 20). Explain how modern mutexes use atomic operations in userspace for the uncontended case, and only syscall (futex) when there's contention. This is why locks are fast in practice.

- **"Why does Linux have 5 different I/O schedulers?"** — Drop this during I/O lessons (lesson 16). Explore how SSDs killed the old elevator algorithms, leading to new schedulers (mq-deadline, BFQ, Kyber). This shows how hardware changes drive OS evolution.

- **"The TLB flush that cost Google millions"** — Drop this during TLB lessons (lesson 9). Discuss meltdown/spectre mitigations (KPTI) that forc

## Common Failure Modes
1. **"The kernel is just a big program that runs all the time"**
   - **Why students get this wrong**: They don't yet understand privilege levels and mode switching.
   - **How to correct it**: Emphasize that the kernel is event-driven (syscalls, interrupts, exceptions). Show that user code runs most of the time; the kernel is entered only via controlled transitions. Walk through a syscall (e.g., read()) from trap to return, highlighting the mode switch.

2. **"Virtual memory is just about extending RAM with disk"**
   - **Why students get this wrong**: Early exposure to "virtual memory = swap" from introductory courses.
   - **How to correct it**: Reframe virtual memory as primarily about protection and isolation. Swapping is a side benefit of overcommitment, not the main purpose. Show that even systems with infinite RAM use virtual memory for process isolation.

3. **"Page tables waste memory"**
   - **Why students get this wrong**: They calculate (2^20 entries) × (4 bytes) = 4MB per

## Vocabulary
Key terms for this domain: process abstraction, address space, process state, time-sharing, context switch, process control block, fork system call, copy-on-write, parent-child relationships, FIFO, SJF, round-robin, scheduling metrics, CFS, virtual runtime (and 73 more).