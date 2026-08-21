# Formal Verification — Resources

## Primary Sources (for lesson content)

### Textbooks & Courses

- **Software Foundations (Pierce et al.)** — Free interactive Coq textbook, gold standard for learning proof assistants. Start with volume 1 (Logical Foundations). Perfect for intermediate learners who want hands-on practice.
  - https://softwarefoundations.cis.upenn.edu/

- **Principles of Model Checking (Baier & Katoen)** — Comprehensive reference on model checking algorithms, temporal logic, and verification techniques. Dense but authoritative. Graduate level.
  - https://mitpress.mit.edu/9780262026499/principles-of-model-checking/

- **Concrete Semantics with Isabelle/HOL (Nipkow & Klein)** — Free book on programming language semantics and theorem proving. Gentler than Software Foundations, uses Isabelle instead of Coq.
  - http://concrete-semantics.org/

- **The Calculus of Computation (Bradley & Manna)** — Decision procedures, SMT solvers, and program verification. Good bridge between theory and automated tools.
  - https://theory.stanford.edu/~arbrad/

- **MIT 6.826 Principles of Computer Systems (Adam Chlipala)** — Graduate course on building verified systems in Coq. Covers concurrency, distributed systems, storage. Challenging but rewarding.
  - http://adam.chlipala.net/frap/

- **CMU 15-414/814 Bug Catching: Automated Program Verification** — Undergraduate/graduate course on model checking, symbolic execution, and static analysis. Excellent lecture notes.
  - https://www.cs.cmu.edu/~15414/

### Key Papers

- **An Axiomatic Basis for Computer Programming (Hoare, 1969)** — The original Hoare logic paper. Readable and foundational.
  - https://www.cs.cmu.edu/~aldrich/courses/15-819O-13sp/resources/hoare-original.pdf

- **How Amazon Web Services Uses Formal Methods (Newcombe et al., 2015)** — Case study of TLA+ at AWS. Shows real-world impact.
  - https://cacm.acm.org/magazines/2015/4/184701-how-amazon-web-services-uses-formal-methods/

- **seL4: Formal Verification of an OS Kernel (Klein et al., 2009)** — Landmark verified OS kernel. 20 person-years to verify 8,700 lines of C.
  - https://trustworthy.systems/publications/papers/Klein_EHACDEEKNSTW_09.pdf

- **CompCert: A Formally Verified Optimizing Compiler (Leroy, 2009)** — Verified C compiler in Coq. Proves optimizations preserve semantics.
  - https://xavierleroy.org/publi/compcert-CACM.pdf

- **Separation Logic: A Logic for Shared Mutable Data Structures (Reynolds, 2002)** — Foundational paper on separation logic for heap reasoning.
  - https://www.cs.cmu.edu/~jcr/seplogic.pdf

## Supplementary (for engagement)

### Video Lectures & Tutorials

- **Leslie Lamport's TLA+ Video Course** — Creator of TLA+ teaches the language. Quirky style, brilliant content. 10 short videos.
  - https://lamport.azurewebsites.net/video/videos.html

- **Software Foundations Lecture Series** — Companion lectures to the textbook. Covers Coq basics and program verification.
  - https://www.youtube.com/playlist?list=PLre5AT9JnKShBOPeuiD9b-I4XROIJhkIU

- **Hillel Wayne's Practical TLA+** — Pragmatic intro to TLA+ for working programmers. Focuses on real specs, not theory.
  - https://www.hillelwayne.com/post/learntla/
  - https://learntla.com/

- **Formal Verification of Rust Programs (Ralf Jung)** — How separation logic (Iris framework) is used to verify unsafe Rust code.
  - https://www.ralfj.de/blog/

- **Formal Methods in Practice (playlist)** — Industry talks on verification at Google, Amazon, Facebook.
  - https://www.youtube.com/playlist?list=PLvJPQm1xgkEP1L1UGKEqLBtmkJTjJvQ2q

### Interactive Tools & Playgrounds

- **TLA+ Toolbox** — Visual model checker with error trace visualization. Download and install locally.
  - https://lamport.azurewebsites.net/tla/toolbox.html

- **Dafny Online** — Browser-based program verifier. Write code with specs, get instant feedback.
  - https://dafny.org/dafny/OnlineTutorial/guide

- **CoqIDE / VSCode Coq Extension** — Interactive proof development environments for Coq.
  - https://coq.inria.fr/
  - https://marketplace.visualstudio.com/items?itemName=maximedenes.vscoq

- **Lean 4 Playground** — Modern proof assistant with good error messages and tactics. Emerging competitor to Coq.
  - https://leanprover.github.io/

- **SPIN Model Checker** — Classic model checker for concurrent systems. Command-line tool with Promela language.
  - https://spinroot.com/spin/whatispin.html

- **Z3 SMT Solver (online)** — Try SMT solving in your browser. Useful for understanding verification conditions.
  - https://microsoft.github.io/z3guide/

### Code Repositories & Examples

- **TLA+ Examples Repository** — Community-contributed TLA+ specs: Raft, Paxos, blockchain protocols, distributed algorithms.
  - https://github.com/tlaplus/Examples

- **CompCert Verified Compiler** — Full source code of the verified C compiler. 100K lines of Coq.
  - https://github.com/AbsInt/CompCert

- **seL4 Microkernel** — Verified OS kernel. Code, proofs, and documentation.
  - https://github.com/seL4/seL4

- **Verified Software Toolchain (VST)** — Framework for verifying C programs in Coq using separation logic.
  - https://vst.cs.princeton.edu/

- **Iris Project** — Higher-order separation logic framework for Coq. Used to verify Rust and concurrent programs.
  - https://iris-project.org/

- **Dafny Examples** — Verified programs: sorting, binary search, graph algorithms.
  - https://github.com/dafny-lang/dafny/tree/master/Test

### Research Groups & People

- **Leslie Lamport** — Turing Award winner, creator of TLA+, pioneer in distributed systems and temporal logic.
  - https://lamport.azurewebsites.net/

- **Adam Chlipala (MIT)** — Expert in verified systems, author of Certified Programming with Dependent Types.
  - http://adam.chlipala.net/

- **Xavier Leroy (Inria, Collège de France)** — Lead developer of CompCert verified compiler.
  - https://xavierleroy.org/

- **Gernot Heiser (UNSW, seL4)** — Led seL4 microkernel verification, now works on verified OS ecosystems.
  - https://trustworthy.systems/people/gernotheiser/

- **Hillel Wayne** — Formal methods educator, writes practical guides for working programmers.
  - https://www.hillelwayne.com/

- **Ralf Jung (MPI-SWS)** — Developer of Iris separation logic framework, verifies Rust unsafe code.
  - https://www.ralfj.de/

- **Peter O'Hearn (Facebook/UCL)** — Invented separation logic, founded Facebook Infer team.
  - https://research.facebook.com/people/ohearn-peter/

- **K Framework Team (Runtime Verification)** — Formal semantics framework used for blockchain verification.
  - https://runtimeverification.com/

### Industry Applications & Case Studies

- **Amazon Web Services (TLA+)** — Specs for S3, DynamoDB, EBS. Open-source examples and experience reports.
  - https://github.com/aws/tlaplus-workshop

- **Facebook Infer** — Open-source static analyzer using separation logic. Analyzes millions of lines of code.
  - https://fbinfer.com/

- **Microsoft Dafny** — Used in Azure cloud infrastructure. Verified network protocols and cryptography.
  - https://www.microsoft.com/en-us/research/project/dafny-a-language-and-program-verifier-for-functional-correctness/

- **Airbus SCADE Suite** — Model-based development for safety-critical avionics. DO-178C certified.
  - https://www.ansys.com/products/embedded-software/ansys-scade-suite

- **GaloisInc Verified Software** — Military-grade verified software: cryptography, embedded systems, drones.
  - https://galois.com/

- **Runtime Verification** — Blockchain smart contract verification using K framework. Audited major DeFi protocols.
  - https://runtimeverification.com/smartcontract/

### Online Communities

- **TLA+ Google Group** — Active community, Leslie Lamport occasionally answers questions.
  - https://groups.google.com/g/tlaplus

- **Coq Discourse** — Q&A forum for Coq users.
  - https://coq.discourse.group/

- **r/formal_verification subreddit** — Reddit community for formal methods news and discussion.
  - https://www.reddit.com/r/formal_verification/

- **Formal Methods Zulip** — Chat server for formal methods researchers and practitioners.
  - https://coq.zulipchat.com/

## Wild Cards & Unexpected Connections

- **Formal Verification in Game Design** — Can you verify a game is fair? Poker hand probabilities, chess endgames.
  - https://www.hillelwayne.com/post/formally-modeling-regex/

- **Mathematical Components Library (Coq)** — Formalized Four Color Theorem and Feit-Thompson Theorem. Pure math meets proof assistants.
  - https://math-comp.github.io/

- **Verified Cryptography** — EverCrypt and HACL* are verified crypto libraries in F*. Used in Firefox and Linux kernel.
  - https://github.com/project-everest/hacl-star

- **Music and Temporal Logic** — Can you specify musical constraints (chord progressions, rhythm) in LTL?
  - Research paper: "Temporal Logic for Music Composition"

- **Hardware Verification at Intel** — How model checking caught the Pentium FDIV bug would have been found today.
  - https://en.wikipedia.org/wiki/Pentium_FDIV_bug

- **Proof Assistants for Mathematics** — Lean Mathematical Library formalizing undergraduate math, including real analysis and group theory.
  - https://leanprover-community.github.io/mathlib_docs/

- **Verified Machine Learning** — Can neural networks be verified? Adversarial robustness proofs.
  - https://www.sri.inf.ethz.ch/research/plml

- **Quantum Program Verification** — New logics (quantum Hoare logic) for verifying quantum algorithms.
  - https://arxiv.org/abs/1904.07126
