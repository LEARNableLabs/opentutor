# Reinforcement Learning — Concept Map

## Core Concepts (in learning order)

1. **Agent-environment interaction** — The foundational loop: agent observes state, takes action, receives reward, environment transitions
2. **Markov Decision Process (MDP)** — Formal framework for sequential decision making with states, actions, rewards, transition dynamics
3. **Policy** — Mapping from states to actions (deterministic or stochastic)
4. **Return** — Cumulative discounted reward over time. Depends on: agent-environment interaction
5. **Value function** — Expected return from a state (V) or state-action pair (Q). Depends on: policy, return
6. **Bellman equation** — Recursive relationship decomposing value into immediate reward + future value. Depends on: value function, MDP
7. **Optimal policy** — Policy that maximizes expected return. Depends on: policy, value function
8. **Dynamic programming** — Computing optimal values when dynamics are known (policy iteration, value iteration). Depends on: Bellman equation, optimal policy
9. **Monte Carlo methods** — Learning from complete episode samples without knowing dynamics. Depends on: return, sampling
10. **Temporal-difference learning** — Learning from incomplete episodes by bootstrapping. Depends on: Monte Carlo methods, Bellman equation
11. **Q-learning** — Off-policy TD control algorithm learning optimal Q-values. Depends on: temporal-difference learning, action-value functions
12. **SARSA** — On-policy TD control algorithm. Depends on: temporal-difference learning, Q-learning
13. **Exploration-exploitation tradeoff** — Balance between trying new actions and using known good actions
14. **Epsilon-greedy** — Simple exploration strategy. Depends on: exploration-exploitation tradeoff
15. **Multi-armed bandits** — Simplified RL problem with exploration focus. Depends on: exploration-exploitation tradeoff
16. **Upper confidence bounds (UCB)** — Principled exploration using uncertainty. Depends on: multi-armed bandits
17. **Function approximation** — Generalizing to large state spaces using parameterized functions. Depends on: value function
18. **Gradient-based value learning** — Using SGD to learn approximate value functions. Depends on: function approximation, temporal-difference learning
19. **Deep Q-Network (DQN)** — Q-learning with neural networks as function approximators. Depends on: Q-learning, function approximation
20. **Experience replay** — Breaking correlation in training data by sampling from a replay buffer. Depends on: DQN
21. **Target network** — Stabilizing training by freezing the target Q-function. Depends on: DQN
22. **Policy gradient theorem** — Gradient of expected return with respect to policy parameters. Depends on: policy, return
23. **REINFORCE** — Monte Carlo policy gradient algorithm. Depends on: policy gradient theorem, Monte Carlo methods
24. **Actor-critic** — Combining policy gradient (actor) with value function (critic). Depends on: REINFORCE, temporal-difference learning
25. **Advantage function** — Measuring how much better an action is than average. Depends on: actor-critic, value function
26. **Proximal Policy Optimization (PPO)** — Modern policy gradient with trust region constraints. Depends on: actor-critic, advantage function
27. **Reward modeling** — Learning reward functions from preferences (key for RLHF). Depends on: policy optimization
28. **Model-based RL** — Learning dynamics model and using it for planning. Depends on: MDP, value function

## Dependencies

### Foundation Chain
- **MDP** is the mathematical foundation that everything else builds on
- **Bellman equations** are the key insight enabling both planning and learning
- **Value functions** and **policies** are two sides of the same coin (value-based vs. policy-based methods)

### Tabular Learning Progression
- **Dynamic programming** requires knowing the MDP dynamics (model-based)
- **Monte Carlo methods** remove the dynamics requirement but need complete episodes
- **Temporal-difference learning** combines MC sampling with DP bootstrapping (key algorithmic innovation)
- **Q-learning** and **SARSA** are TD control algorithms differing in on-policy vs. off-policy behavior

### Scaling to Large Problems
- **Function approximation** is necessary because tabular methods don't scale
- **DQN** successfully combines Q-learning with deep neural networks using two key tricks: **experience replay** and **target networks**
- These tricks address the instability that arises from combining three challenges (the "deadly triad"): function approximation, bootstrapping, and off-policy learning

### Policy-Based Methods
- **Policy gradient theorem** provides the foundation for directly optimizing policies
- **REINFORCE** is the baseline algorithm but has high variance
- **Actor-critic** reduces variance by using a value function (critic) to guide policy updates (actor)
- **Advantage function** further reduces variance by measuring relative action quality
- **PPO** adds trust region constraints to prevent destructive policy updates

### Exploration Thread
- **Exploration-exploitation tradeoff** is fundamental to all RL
- **Multi-armed bandits** isolate exploration as the core challenge (single-step decision)
- **UCB** and **Thompson sampling** provide principled exploration strategies
- **Epsilon-greedy** is simple and works reasonably well in practice despite being heuristic

### Modern Extensions
- **RLHF** applies RL to language models by learning reward functions from human preferences
- **Model-based RL** attempts to learn world dynamics for more sample-efficient learning
- Both build on the core value-based and policy-based methods

## Bottleneck Concepts

These concepts act as gateways — understanding them unlocks whole families of algorithms:

1. **Bellman equation** — Once you understand recursive value decomposition, you understand both DP and TD learning
2. **Temporal-difference learning** — The key algorithmic innovation. Combines MC and DP; enables Q-learning, SARSA, actor-critic
3. **Function approximation** — Necessary step to scale from gridworlds to real problems. Opens door to deep RL
4. **Policy gradient theorem** — Enables entire family of policy optimization algorithms (REINFORCE, actor-critic, PPO, TRPO)
5. **Exploration-exploitation tradeoff** — Understanding this makes all exploration strategies (epsilon-greedy, UCB, Thompson sampling, intrinsic motivation) variations on a theme

## Mind-Blowing Moments

1. **Q-learning is off-policy** — You can learn optimal behavior while following a different policy. This seems impossible at first!
2. **Temporal-difference learning learns from incomplete data** — You can update your estimate of future value before you've seen the actual return. Bootstrapping your own estimates works.
3. **The policy gradient theorem** — The gradient of expected return simplifies beautifully; you don't need to differentiate through the environment dynamics
4. **Experience replay breaks time** — Shuffling past experiences violates the Markov property but makes training stable. The engineering trick matters as much as the theory.
5. **The deadly triad** — Combining function approximation + bootstrapping + off-policy learning can diverge. DQN works because of careful engineering (replay, target networks), not because theory guarantees convergence.
6. **RLHF** — The same math that trains robots to walk trains language models to be helpful. Reward modeling from preferences is the key bridge.

## Common Misconceptions

1. **RL always needs a simulator** — FALSE. RL can learn from real-world data (offline RL, logged data)
2. **More exploration is always better** — FALSE. Too much exploration prevents convergence; the schedule matters
3. **Optimal policy is deterministic** — FALSE in general. Stochastic policies can be optimal (e.g., rock-paper-scissors)
4. **Q-learning converges to optimal policy** — TRUE for tabular case with proper exploration, FALSE in general with function approximation
5. **Deep RL is just RL + neural networks** — OVERSIMPLIFIED. Needs significant engineering (replay, target networks, reward scaling, etc.)
6. **Policy gradient has no bias** — TRUE for REINFORCE but FALSE for actor-critic (bias-variance tradeoff)
7. **Model-based RL is always more sample-efficient** — FALSE. Model errors compound; model-free can be more robust
8. **SARSA is safer than Q-learning** — GENERALLY TRUE (learns policy it follows), but context-dependent

## Prerequisite Topics

- **Probability and statistics** — needed for: expectations, distributions, Monte Carlo estimation, stochastic policies
- **Linear algebra** — needed for: value iteration (matrix operations), function approximation, neural networks
- **Multivariable calculus** — needed for: gradients in function approximation, policy gradient theorem, backpropagation
- **Optimization** — needed for: gradient descent, SGD, Adam optimizer, convergence analysis
- **Supervised learning basics** — needed for: neural networks, regression, cross-entropy loss (for policy parameterization)
- **Python and NumPy** — needed for: implementing algorithms, working with Gymnasium environments
- **Basic algorithms** — needed for: dynamic programming concepts, search, planning

## Cross-Connections to Other Fields

- **Operations research** — MDPs, dynamic programming, stochastic control
- **Neuroscience** — TD learning models dopamine signals; reward prediction errors in the brain
- **Economics** — Multi-armed bandits for A/B testing, recommendation systems
- **Robotics** — Continuous control, sim-to-real transfer, safety constraints
- **Game theory** — Multi-agent RL, Nash equilibria, self-play
- **Optimal control** — Linear quadratic regulators (LQR), model predictive control (MPC)
- **Psychology** — Behavioral conditioning, operant conditioning, learning theory
- **Cognitive science** — How humans learn from rewards, exploration strategies
