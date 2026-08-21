# Lockpicking — Concept Map

## Core Concepts (in learning order)

1. **Pin tumbler mechanism** — The fundamental security design using spring-loaded pins that must align at the shear line
2. **Shear line** — The boundary between plug and housing where all pins must align for rotation. Depends on: pin tumbler mechanism
3. **Driver and key pins** — Two-part pin system creating the locking mechanism. Depends on: pin tumbler mechanism
4. **Plug rotation** — The mechanical action that engages the locking mechanism when pins are correctly aligned. Depends on: shear line
5. **Binding order** — The sequence in which pins bind due to manufacturing tolerances. Depends on: plug rotation, manufacturing tolerances
6. **Manufacturing tolerances** — Imperfections that create exploitable binding sequences. Depends on: pin tumbler mechanism
7. **Wafer mechanisms** — Alternative lock design using flat wafers instead of pins. Depends on: pin tumbler mechanism
8. **Combination mechanisms** — Rotational security systems requiring a different attack approach. Depends on: mechanical diversity
9. **Security pins** — Modified pin designs (spool, serrated, mushroom) that resist picking. Depends on: driver and key pins
10. **Sidebars** — Additional locking mechanisms requiring multi-dimensional alignment. Depends on: security pins
11. **Tactile feedback** — Physical sensations transmitted through tools indicating pin states. Depends on: binding order
12. **Tension control** — Applied torque that creates binding and enables pin setting. Depends on: tactile feedback
13. **Pin states** — Set, binding, or free conditions during picking. Depends on: tension control, binding order
14. **SPP technique** — Single-pin-picking method for precisely setting individual pins. Depends on: tactile feedback, pin states
15. **Raking techniques** — Speed-oriented methods using rapid motion. Depends on: pin tumbler mechanism
16. **Bump keys** — Specially cut keys that exploit kinetic energy transfer. Depends on: pin tumbler mechanism
17. **Kinetic energy transfer** — Physics principle enabling bumping attacks. Depends on: driver and key pins
18. **Counter-rotation** — Feedback from security pins creating false sets. Depends on: security pins, tactile feedback
19. **False sets** — Deceptive partial unlocks caused by security pins. Depends on: counter-rotation
20. **Disc detainer mechanisms** — Rotating disc-based security requiring specialized tools. Depends on: mechanical diversity
21. **Rotating pins** — Advanced pins that must achieve correct rotation and height. Depends on: security pins
22. **Impressioning** — Creating a working key from lock feedback without opening. Depends on: tactile feedback, binding order
23. **Decoding techniques** — Determining pin depths without disassembly. Depends on: impressioning
24. **Shimming** — Bypassing locking mechanisms via physical gaps. Depends on: mechanical diversity
25. **Latch manipulation** — Attacking the latch rather than the lock. Depends on: attack surface
26. **Threat modeling** — Assessing realistic attack scenarios for a lock installation. Depends on: attack vectors
27. **Attack vectors** — All possible methods for defeating a lock. Depends on: SPP technique, raking techniques, bumping, bypassing
28. **Defense in depth** — Layered security compensating for individual lock vulnerabilities. Depends on: threat modeling
29. **Locksport ethics** — Community standards for responsible practice. Depends on: legal frameworks
30. **Legal frameworks** — Laws governing possession and use of lockpicking tools. Depends on: locksport ethics

## Dependencies

- **Binding order requires manufacturing tolerances** because perfect locks wouldn't have a binding sequence—all pins would bind simultaneously, making picking impossible
- **SPP technique builds on tactile feedback and pin states** because pickers must feel which pin is binding and understand its current state
- **False sets depend on counter-rotation from security pins** because standard pins don't create deceptive feedback
- **Threat modeling requires understanding all attack vectors** because security assessment must account for picking, bumping, bypassing, and destructive entry
- **Rotating pins (Medeco) combine height and rotation requirements** making them significantly harder than standard security pins
- **Defense in depth acknowledges that no single lock is perfect** requiring multiple security layers

## Bottleneck Concepts

**Tactile feedback** is the critical bottleneck for intermediate learners. Without developing sensitivity to pin states through the tools, students cannot progress to SPP or understand security pin behavior. This is the "feel" that separates theory from practice.

**Security pins** represent a major difficulty spike. Students comfortable with standard pins must rebuild their mental model to recognize and respond to counter-rotation and false sets.

**Threat modeling** shifts thinking from "can I pick this?" to "should someone bother picking this?" — essential for security professionals but often overlooked by sport-focused learners.

## Mind-Blowing Moments

1. **First successful SPP** — When tactile feedback suddenly "clicks" and you feel each pin set individually
2. **Recognizing a false set** — Realizing the lock tricked you with a security pin's counter-rotation
3. **Bumping success** — Watching a lock pop open from a sharp tap, violating your intuition about security
4. **Bypass revelation** — Discovering you can open a "pick-resistant" lock in seconds by shimming the latch
5. **Medeco understanding** — Grasping that pins can rotate independently of their height, creating multi-dimensional security
6. **Installation vulnerability** — Realizing a $300 lock in a cheap door frame provides zero real security

## Common Misconceptions

1. **"Expensive locks are secure"** — Price correlates poorly with pick resistance; installation quality and attack surface matter more
2. **"Lockpicking is always quiet and non-destructive"** — Movies lie; real attacks often involve drilling, bumping, or bypassing
3. **"Master locks are practice locks"** — They're also real locks people trust, highlighting the security/cost mismatch
4. **"You need a full pick set"** — 90% of picking uses 2-3 tools; huge sets are mostly marketing
5. **"Security pins make locks unpickable"** — They increase difficulty but remain vulnerable to skilled pickers and other attacks
6. **"Locksport is illegal"** — Legal in most jurisdictions for owned locks; community emphasizes ethical practice
7. **"Digital locks are automatically more secure"** — Often combines weak physical and digital security
8. **"All pins bind in the same order every time"** — Tension direction and amount affect binding order
9. **"Raking is for beginners, SPP for experts"** — Both are tools; context determines the right approach
10. **"If you can't pick it, it's secure"** — Ignores bumping, impressioning, bypassing, and destructive entry

## Prerequisite Topics

- **Basic mechanical understanding** — needed for visualizing internal lock components and motion
- **Patience for tactile skill development** — needed for feedback recognition and SPP technique
- **Access to practice locks** — needed for hands-on skill building (transparent locks helpful but not required)
- **Physics intuition** — needed for understanding kinetic energy transfer, friction, spring forces

## Cross-Discipline Connections

- **Physics** — Energy transfer (bumping), friction (binding), spring dynamics
- **Manufacturing engineering** — Tolerances, quality control, cost-security tradeoffs
- **Security architecture** — Defense in depth, threat modeling, attack surface analysis
- **Game theory** — Attacker-defender dynamics, security economics, vulnerability disclosure
- **Materials science** — Metal properties, hardening techniques, drill resistance
- **Psychology** — Tactile learning, skill acquisition, security theater, trust
- **Legal studies** — Tool possession laws, responsible disclosure, locksmith licensing
- **Competitive sports** — Speed picking, mental preparation, competitive formats
