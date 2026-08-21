# Reinforcement Learning — Teaching Notes

## Approach

Reinforcement Learning uniquely combines mathematical theory with hands-on experimentation. At intermediate level, students should BUILD and SEE algorithms work, not just read about them. Start with clean tabular implementations (gridworlds) to build intuition for the math, then scale to deep RL where engineering tricks matter as much as theory. Use the progression: understand the math → implement from scratch → use production libraries → debug when things break. RL is notorious for being finicky, so explicitly teach debugging strategies and develop tolerance for hyperparameter tuning. The field moves fast — connect classical algorithms (Sutton & Barto) to modern applications (RLHF, robotics) to show the through-line.

## Common Misconceptions

1. **"RL is just supervised learning with a different loss function"**
   - Why students think this: Both use neural networks and gradient descent in modern implementations
   - The truth: RL has no fixed dataset, labels come from the agent's own experience, and the distribution shifts as the policy improves. This non-stationarity is fundamental.
   - How to correct: Show how the agent's behavior changes the data it sees. Contrast with supervised learning's i.i.d. assumption.

2. **"The goal is to maximize immediate reward"**
   - Why students think this: Natural greedy intuition
   - The truth: RL maximizes cumulative discounted return, not immediate reward. Sacrifice now for long-term gain.
   - How to correct: Use examples like chess (sacrificing pieces) or investment (saving vs. spending). Show discount factor's effect mathematically.

3. **"Q-learning learns the Q-values for the policy it follows"**
   - Why students think this: Confusing Q-learning with SARSA
   - The truth: Q-learning is OFF-policy — it learns optimal Q-values regardless of the behavior policy. This is its superpower and its curse (enables learning from random exploration but causes instability with function approximation).
   - How to correct: Walk through the update equations side-by-side. Show SARSA uses the next action actually taken, Q-learning uses max over actions.

4. **"More exploration is always better"**
   - Why students think this: Exploration sounds good and prevents local optima
   - The truth: Too much exploration prevents convergence. Need to anneal epsilon over time.
   - How to correct: Show learning curves with constant vs. decaying epsilon. Explain exploration-exploitation schedule.

5. **"DQN is just Q-learning with a neural network"**
   - Why students think this: The algorithm looks similar at high level
   - The truth: Naive combination diverges! DQN requires experience replay and target networks to be stable. The engineering tricks are not optional.
   - How to correct: Show the divergence without these tricks (if time allows). Explain why each trick is necessary (correlation, non-stationarity).

6. **"Policy gradient methods always have zero bias"**
   - Why students think this: REINFORCE uses true Monte Carlo returns
   - The truth: Actor-critic introduces bias by bootstrapping from the critic. Bias-variance tradeoff is everywhere.
   - How to correct: Compare REINFORCE (high variance, no bias) to actor-critic (lower variance, some bias). Show this is a feature, not a bug.

7. **"Model-based RL is strictly better than model-free"**
   - Why students think this: Seems more sample-efficient; why wouldn't you model the world?
   - The truth: Model errors compound. Model-free methods can be more robust when models are inaccurate.
   - How to correct: Show Dyna-Q's planning vs. model-free performance. Discuss sim-to-real gap in robotics.

8. **"RL works well for any sequential decision problem"**
   - Why students think this: RL is general and powerful
   - The truth: RL requires lots of data and careful reward engineering. Often supervised learning or imitation learning is better if you have expert data.
   - How to correct: Discuss when NOT to use RL. Show reward hacking examples. Introduce the field's limitations honestly.

9. **"The Bellman equation is just a definition"**
   - Why students think this: It's presented as an equation to memorize
   - The truth: The Bellman equation is a CONSISTENCY CONDITION. It's the key insight enabling both planning and learning.
   - How to correct: Show how dynamic programming, Monte Carlo, and TD learning all derive from the Bellman equation. It's the unifying principle.

10. **"Discount factor γ is just a hyperparameter to tune"**
    - Why students think this: It appears in equations without deep motivation
    - The truth: γ encodes the agent's time preference and ensures finite returns in infinite-horizon problems. It has economic and mathematical interpretations.
    - How to correct: Show how γ affects planning horizon. Discuss episodic (γ=1 works) vs. continuing tasks (need γ<1).

## Level Adjustments

### For Intermediate Students (this curriculum)
- **Emphasize**: Both theory and implementation. Derive key equations (Bellman, policy gradient theorem) but also code algorithms from scratch.
- **Depth of formalism**: Provide intuition first, then math. Use pseudocode extensively. Prove key results but skip measure-theoretic details.
- **Hands-on balance**: ~40% theory, 60% coding/experimentation. Every major algorithm should be implemented.
- **Topics to include**: Full spectrum from tabular methods to deep RL. Touch on modern topics (RLHF, model-based) without deep dives.
- **Skip**: Measure theory, advanced convergence proofs, exotic exploration methods, multi-agent game theory

### Adjustments for Beginners
- Start with multi-armed bandits (no state, just actions) before MDPs
- Use smaller gridworlds exclusively; avoid deep RL until very comfortable with tabular
- More guided coding (fill-in-the-blank style)
- Skip convergence analysis, just empirical observation
- More visual: plot value functions, policies, learning curves for every algorithm

### Adjustments for Advanced
- Include full convergence proofs (contraction mappings, stochastic approximation theory)
- Deeper on function approximation theory (deadly triad, gradient TD, off-policy divergence)
- Modern deep RL architectures (Rainbow DQN components, PPO implementation details)
- Current research topics: offline RL, world models, hierarchical RL, meta-RL
- Multi-agent RL, game theory connections, Nash equilibria

## Rabbit Holes (When to Go Deep)

### 1. **The Deadly Triad** (Lesson 16-17)
When covering function approximation and DQN, this is the perfect moment to explain why naive combinations diverge. Show Baird's counterexample if student is mathematically inclined. Connect to broader ML theme: theory doesn't always match practice; engineering matters.

### 2. **Neuroscience Connections** (Lesson 8)
When introducing TD learning, mention dopamine and reward prediction errors. TD error ≈ dopamine signal in the brain. This is one of RL's most beautiful cross-disciplinary connections. Schultz et al. (1997) is the classic paper.

### 3. **AlphaGo and Self-Play** (Lesson 23-24)
When covering actor-critic, this is the time to discuss how AlphaGo/AlphaZero work. Self-play as a curriculum. Monte Carlo Tree Search + policy/value networks. Inspires students with what's possible.

### 4. **RLHF and ChatGPT** (Lesson 26)
This lesson IS a rabbit hole by design. Students are motivated by LLMs. Show how RL from human feedback works: collect preferences, train reward model, optimize policy with PPO. Connect to curriculum concepts (reward shaping, policy optimization). InstructGPT paper is accessible.

### 5. **Reward Hacking and AI Safety** (Lesson 25)
When teaching debugging, introduce reward hacking — agent finds unintended ways to maximize reward. CoastRunners boat going in circles collecting powerups. This leads naturally to AI alignment, specification gaming, and why reward design is hard. Deepmind's specification gaming spreadsheet is a great resource.

### 6. **The Exploration Literature** (Lesson 12-13)
Exploration is a deep rabbit hole: count-based, curiosity-driven, intrinsic motivation, information gain, posterior sampling. If student is interested, point to "Never Give Up" (Deepmind) or "Random Network Distillation" (OpenAI). But don't get lost here — epsilon-greedy and UCB are sufficient for this level.

## Difficulty Progression Notes

The curriculum follows this arc:

**Early lessons (1-5): Difficulty 1-2**
- Building foundations: MDPs, returns, policies, Bellman equations
- Mostly conceptual, some light math
- Should feel accessible after prerequisites

**First peak (6-11): Difficulty 3-4**
- Tabular learning algorithms: MC, TD, Q-learning, SARSA
- Real implementation work begins
- Q-learning (Lesson 9) is first peak (difficulty 4) — off-policy concept is subtle

**Valley (12-14): Difficulty 2-3**
- Exploration strategies, review
- Breathing room before function approximation

**Second peak (15-19): Difficulty 3-5**
- Function approximation, DQN, Atari
- Lesson 19 (Train DQN on Atari) is the hardest lesson (difficulty 5) — integration of many concepts plus engineering
- Lesson 16 (gradient-based learning) is difficulty 4 — convergence issues, deadly triad

**Third peak (22-24): Difficulty 4-5**
- Policy gradient methods: REINFORCE, actor-critic, PPO
- Lesson 24 (PPO) is difficulty 5 — sophisticated algorithm, trust region math
- Lesson 22-23 are difficulty 4 — policy gradient theorem is mathematically demanding

**Cooling down (25-28): Difficulty 3-4**
- Applications, debugging, modern topics
- Lesson 27 (model-based RL) is difficulty 4, rest are 3
- Should feel more accessible because building on solid foundation

**Review lessons** (7, 14, 21) are difficulty 2 — scheduled after every 6-7 lessons to consolidate.

## Assessment Strategies

### Formative (during lessons)
1. **Code checkpoints**: Can they implement the algorithm from pseudocode?
2. **Debug challenges**: Give them broken RL code, ask them to identify the bug
3. **Hyperparameter experiments**: "What happens if you set epsilon=0.01 vs. epsilon=0.5?"
4. **Conceptual questions**: "Why does Q-learning use max instead of the actual next action?"
5. **Plot interpretation**: Show learning curve, ask "what's wrong here?"

### Summative (end of curriculum)
1. **From-scratch implementation**: Give them an environment, ask them to solve it with Q-learning or policy gradient (no libraries except NumPy)
2. **Architecture choice**: Given a problem description, justify which RL algorithm to use
3. **Paper reading**: Read a recent deep RL paper (e.g., PPO, Soft Actor-Critic), explain the key ideas
4. **Real-world application**: Propose an RL solution to a real problem (game, robotics, recommendation system)

### Teach-back moments (built into curriculum)
- Lesson 25: "Teach me how you would debug a failing RL training run"
- Can add more: "Explain the difference between on-policy and off-policy to a fellow student"

### Progress indicators
- **Early**: Can explain MDPs, implement value iteration
- **Mid-point**: Can implement Q-learning from scratch, train on simple environments
- **Advanced**: Can use modern libraries (Stable Baselines3, RLlib), debug deep RL, read papers
- **Mastery**: Can choose appropriate algorithms for new problems, propose research directions

## Pacing Notes

- Tabular methods (Lessons 1-14): ~2 weeks. Don't rush these — they build intuition.
- Function approximation + DQN (Lessons 15-21): ~1.5 weeks. Lesson 19 may take 2-3 days.
- Policy optimization (Lessons 22-25): ~1 week. PPO (Lesson 24) is dense.
- Advanced topics (Lessons 26-28): ~0.5 week. Lighter, exploratory.

Total: ~4-5 weeks at 1 lesson/day, or ~8-10 weeks at slower pace with coding projects.

Reviews every ~week keep things from piling up.

## Common Failure Modes & How to Address

1. **Student stuck on math**: RL has dense notation. Provide worked examples, use visual diagrams (state transition graphs, value landscapes), implement in code to build intuition.

2. **Code works on toy problem, fails on harder one**: This is expected! RL is sensitive to scaling. Teach debugging strategies explicitly (Lesson 25). Normalize that hyperparameter tuning is part of the process.

3. **Frustration with training instability**: Deep RL is notoriously unstable. Validate their experience — this is real, not their fault. Explain why (non-stationarity, exploration noise, credit assignment). Teach to use random seeds, average over runs.

4. **Lost in the forest of algorithms**: There are SO many RL algorithms. Provide a taxonomy: value-based (DQN family) vs. policy-based (policy gradient family) vs. actor-critic (combining both). Show the family tree.

5. **Confusing convergence guarantees**: Tabular Q-learning converges (with caveats), but deep Q-learning doesn't have guarantees. Be honest about the gap between theory and practice. RL research is still developing the theory.

## Motivating Examples Throughout

- **Gridworld/Frozen Lake** (Lessons 1-11): Classic, great for intuition
- **CartPole** (Lesson 10): Simple continuous state space
- **Atari** (Lesson 19): Visual deep RL, famous DQN application
- **MuJoCo locomotion** (Lessons 22-24): Continuous control for policy gradients
- **ChatGPT/LLMs** (Lesson 26): Modern motivation, RLHF
- **AlphaGo** (Lessons 23-24): Self-play, combining search + RL
- **Robotic manipulation** (Lesson 27): Model-based RL application

Rotate between games (Atari, board games), robotics (locomotion, manipulation), and NLP (RLHF) to show breadth.
