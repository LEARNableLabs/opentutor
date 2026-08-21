# Reinforcement Learning — Resources

## Primary Textbooks

### The Bible
- **Reinforcement Learning: An Introduction (2nd Edition)** by Richard S. Sutton and Andrew G. Barto
  - Free PDF: http://incompleteideas.net/book/the-book-2nd.html
  - Why it's essential: The foundational text. Clear, comprehensive, accessible. Covers tabular methods through function approximation and policy gradients.
  - Best for: Intermediate students. Start with chapters 1-8 (tabular methods), then 9-13 (function approximation + policy gradient).
  - Also available: https://web.stanford.edu/class/psych209/Readings/SuttonBartoIPRLBook2ndEd.pdf

### Companion Resources for Sutton & Barto
- **Scott Jeen's Notes, Exercises & Code**: https://enjeeneer.io/posts/2021/04/notes-exercises-and-code-for-sutton-and-bartos-reinforcement-learning-an-introduction-2018/
  - Excellent chapter summaries, exercise solutions, Python implementations
- **GitHub Solutions**: https://github.com/jekyllstein/Reinforcement-Learning-Sutton-Barto-Exercise-Solutions
  - Community-contributed solutions to textbook exercises

### Advanced/Complementary
- **Algorithms for Reinforcement Learning** by Csaba Szepesvári (free): https://sites.ualberta.ca/~szepesva/RLBook.html
  - More mathematically rigorous, shorter (100 pages)
- **Deep Reinforcement Learning** (UC Berkeley course reader) — available through CS 285 course site

## University Courses (with lecture notes & videos)

### Stanford
- **CS234: Reinforcement Learning** (Winter 2026)
  - https://web.stanford.edu/class/cs234/
  - https://online.stanford.edu/courses/cs234-reinforcement-learning
  - Instructor: Emma Brunskill
  - Coverage: Foundations through deep RL, RLHF, practical applications
  - Assignments include implementing RL algorithms and training agents

- **CS224R: Deep Reinforcement Learning**
  - https://cs224r.stanford.edu/
  - https://online.stanford.edu/courses/cs224r-deep-reinforcement-learning
  - Focus: Modern deep RL algorithms (DQN, PPO, SAC, model-based)
  - Practical emphasis on working with high-dimensional observations

### MIT
- **6.7920: Reinforcement Learning**
  - https://web.mit.edu/6.7920/www/
  - Mathematical introduction: MDPs, dynamic programming, Monte Carlo, TD, Q-learning, bandits
  - Strong theoretical foundation with convergence analysis

### UC Berkeley
- **CS 285: Deep Reinforcement Learning**
  - http://rail.eecs.berkeley.edu/deeprlcourse/
  - Instructor: Sergey Levine
  - Focus: Deep RL for robotics and continuous control
  - Covers model-free, model-based, inverse RL, offline RL

### DeepMind x UCL
- **Deep Learning Lecture Series (2020)**: RL module with David Silver
  - Available on YouTube: https://www.youtube.com/watch?v=ISk80iLhdfU&list=PLqYmG7hTraZCDxZ44o4p3N5Anz3lLRVZF
  - David Silver created AlphaGo/AlphaZero

## Interactive Tools & Simulators

### Gymnasium (formerly OpenAI Gym)
- **Official site**: https://gymnasium.farama.org/
- **Getting started tutorial**: https://www.datacamp.com/tutorial/reinforcement-learning-with-gymnasium
- **Practical guide**: https://smythos.com/developers/agent-development/reinforcement-learning-openai-gym/
- The standard interface for RL environments
- Environments: Classic control (CartPole, MountainCar), Atari games, MuJoCo robotics, board games
- Installation: `pip install gymnasium`

### Tutorials for Gym/Gymnasium
- **Intro with RLlib & Colab**: https://www.anyscale.com/blog/an-introduction-to-reinforcement-learning-with-openai-gym-rllib-and-google
  - Hands-on tutorial with runnable code
- **Q-learning from Scratch**: https://www.learndatasci.com/tutorials/reinforcement-q-learning-scratch-python-openai-gym/
  - Implement Q-learning without libraries
- **Visual debugging**: OpenAI Gym VideoRecorder for recording agent behavior

### Specialized Environments
- **MuJoCo**: Physics simulator for continuous control (locomotion, manipulation)
  - Now free! https://mujoco.org/
- **PettingZoo**: Multi-agent RL environments
  - https://pettingzoo.farama.org/
- **Procgen**: Procedurally generated environments for generalization
  - https://github.com/openai/procgen

## Code & Implementations

### Production Libraries
- **Stable Baselines3**: https://stable-baselines3.readthedocs.io/
  - Production-quality implementations of major algorithms (DQN, PPO, A2C, SAC)
  - Best for: Actually training agents that work
  - Easy to use, well-documented

- **RLlib (Ray)**: https://docs.ray.io/en/latest/rllib/index.html
  - Scalable RL library for distributed training
  - Supports many algorithms, integrates with Ray for parallelization

- **CleanRL**: https://github.com/vwxyzjn/cleanrl
  - Single-file implementations of RL algorithms
  - Best for: Learning how algorithms work (no complex abstractions)

### From-Scratch Implementations
- **Lilian Weng's Deep RL Implementations**: https://lilianweng.github.io/posts/2018-05-05-drl-implementation/
  - TensorFlow implementations with detailed explanations
  - Covers DQN variants, policy gradients, actor-critic

- **Spinning Up in Deep RL (OpenAI)**: https://spinningup.openai.com/
  - Educational resource with clean PyTorch implementations
  - Excellent documentation explaining WHY things work

- **GitHub playgrounds**:
  - https://github.com/Saduras/gym-playground
  - Various projects solving Gym environments

## Videos & Visual Learning

### YouTube Channels
- **DeepMind**: Lectures from David Silver, Hado van Hasselt
- **Arxiv Insights**: Conceptual explanations of RL papers
- **Two Minute Papers**: Quick summaries of recent RL research (AlphaGo, Dota 2, etc.)

### Specific Series
- **David Silver's RL Course**: The classic video lecture series (10 lectures)
  - Available on YouTube, pairs with Sutton & Barto textbook
- **Stanford CS234 lectures**: Available through Stanford Online

### Paper Walkthroughs
- **Yannic Kilcher**: Deep dives into RL papers
- **AI Coffee Break**: Accessible explanations of concepts

## Key Papers (in rough learning order)

### Foundations
1. **Playing Atari with Deep Reinforcement Learning** (Mnih et al., 2013) — Original DQN paper
2. **Human-level control through deep reinforcement learning** (Mnih et al., 2015) — Nature DQN paper

### Improvements to DQN
3. **Deep Reinforcement Learning with Double Q-learning** (van Hasselt et al., 2015)
4. **Prioritized Experience Replay** (Schaul et al., 2015)
5. **Dueling Network Architectures** (Wang et al., 2015)
6. **Rainbow: Combining Improvements in Deep RL** (Hessel et al., 2017) — Combines 6 DQN extensions

### Policy Gradients
7. **Policy Gradient Methods for RL** (Sutton et al., 1999) — REINFORCE
8. **Asynchronous Methods for Deep RL** (Mnih et al., 2016) — A3C
9. **Trust Region Policy Optimization** (Schulman et al., 2015) — TRPO
10. **Proximal Policy Optimization** (Schulman et al., 2017) — PPO, the workhorse

### Exploration
11. **UCB algorithms** (Auer et al., 2002) — Multi-armed bandits
12. **Exploration by Random Network Distillation** (Burda et al., 2018) — Intrinsic motivation

### Applications
13. **Mastering the game of Go** (Silver et al., 2016) — AlphaGo
14. **Mastering Chess and Shogi by Self-Play** (Silver et al., 2017) — AlphaZero
15. **Training language models to follow instructions with human feedback** (Ouyang et al., 2022) — InstructGPT / ChatGPT

### Advanced Topics
16. **World Models** (Ha & Schmidhuber, 2018) — Model-based RL
17. **Offline Reinforcement Learning** (Levine et al., 2020) — Tutorial paper

## Blogs & Online Resources

### Technical Blogs
- **Lilian Weng's Blog**: https://lilianweng.github.io/
  - Deep dives on RL topics (policy gradient, exploration, meta-RL)
  - Extremely clear explanations with math and code

- **Andrej Karpathy's Blog**: http://karpathy.github.io/2016/05/31/rl/
  - "Deep Reinforcement Learning: Pong from Pixels" — Classic intro to policy gradients

- **OpenAI Blog**: https://openai.com/research/
  - Papers and articles on recent advances

- **DeepMind Blog**: https://www.deepmind.com/blog
  - Research updates on AlphaGo, AlphaStar, AlphaFold, etc.

### Community Resources
- **r/reinforcementlearning** (Reddit): Active community, paper discussions
- **RL Discord servers**: Real-time help with implementations
- **Arxiv Sanity**: http://www.arxiv-sanity.com/ — Browse RL papers (filter by cs.LG + "reinforcement")

## People to Follow

### Founding Figures
- **Richard Sutton** (University of Alberta) — Co-author of the textbook, temporal-difference learning pioneer
- **Andrew Barto** (UMass Amherst) — Co-author, actor-critic methods
- **Michael Littman** (Brown) — Planning, abstraction in RL

### Modern Research Leaders
- **Sergey Levine** (UC Berkeley) — Deep RL for robotics, offline RL, model-based RL
  - Twitter: @svlevine
- **Pieter Abbeel** (UC Berkeley) — Robotics, imitation learning, meta-learning
  - Twitter: @pabbeel
- **Emma Brunskill** (Stanford) — CS234 instructor, education RL, Bayesian RL
- **Chelsea Finn** (Stanford) — Meta-learning, few-shot learning
  - Twitter: @chelseabfinn

### DeepMind/Google
- **David Silver** — AlphaGo, AlphaZero, general RL theory
- **Demis Hassabis** — DeepMind co-founder
- **Nando de Freitas** — Deep RL, optimization
- **Hado van Hasselt** — Double Q-learning, value-based methods

### OpenAI
- **John Schulman** — PPO, TRPO, policy optimization
- **Ilya Sutskever** — OpenAI co-founder (now at SSI)
- **Dario Amodei** — Safety, RLHF (now at Anthropic)

### Independent Researchers & Educators
- **Lilian Weng** — OpenAI (formerly), excellent blog
  - Twitter: @lilianweng
- **Andrej Karpathy** — Educator, formerly Tesla AI, OpenAI
  - Twitter: @karpathy
- **Yannic Kilcher** — YouTube paper explanations
  - Twitter: @ykilcher

## Unexpected Cross-Discipline Connections

### Neuroscience
- **Dopamine & TD Learning**: Schultz et al. (1997) showed dopamine neurons encode TD prediction errors
  - Paper: "A neural substrate of prediction and reward" (Science)
  - RL math models biological learning in the brain

### Economics & Operations Research
- **Multi-armed Bandits**: Originally studied for clinical trials, A/B testing, ad placement
  - Thompson Sampling (1933) predates modern RL by decades
  - Gittins Index for optimal resource allocation

### Psychology
- **Operant Conditioning**: B.F. Skinner's work on animal learning parallels RL
  - Reward schedules (fixed-ratio, variable-ratio) affect learning
  - Exploration vs. exploitation in animal behavior

### Control Theory
- **LQR (Linear Quadratic Regulator)**: Classical optimal control
  - RL generalizes to nonlinear, unknown dynamics
  - Model Predictive Control (MPC) ~ model-based RL

### Game Theory
- **Nash Equilibria**: Multi-agent RL connects to game theory
  - AlphaStar (Starcraft), OpenAI Five (Dota 2) use self-play
  - Evolutionary game theory ~ population-based training

### Cognitive Science
- **How humans learn**: Humans use TD-like learning, mental simulation (model-based), and hierarchical abstractions
  - Human-AI collaboration: RLHF learns from human preferences

### Ecology
- **Foraging Theory**: Animals optimize exploration-exploitation in foraging
  - Lévy flights, optimal search patterns
  - Patch-leaving problem ~ bandit algorithms

## Tools for Visualization

- **TensorBoard**: Visualize learning curves, hyperparameter sweeps
- **Weights & Biases**: Experiment tracking, compare runs
- **Plotly/Matplotlib**: Custom plots for value functions, policies, trajectories
- **OpenAI Gym VideoRecorder**: Record agent behavior as MP4

## Datasets & Benchmarks

- **Atari 2600 Games**: Standard deep RL benchmark (57 games)
- **MuJoCo Control Suite**: Continuous control tasks (locomotion, manipulation)
- **D4RL**: Offline RL benchmark datasets
  - https://sites.google.com/view/d4rl/home
- **DeepMind Control Suite**: Standardized continuous control tasks
- **NetHack Learning Environment**: Complex, procedural environment
  - https://github.com/facebookresearch/nle

## Recommended Learning Path

### Phase 1: Foundations (Weeks 1-2)
- Read Sutton & Barto Chapters 1-6 (tabular methods)
- Implement value iteration, policy iteration in gridworlds
- Watch David Silver lectures 1-4

### Phase 2: Temporal-Difference Learning (Weeks 3-4)
- Read Sutton & Barto Chapters 6-8 (TD, Q-learning, SARSA)
- Implement Q-learning from scratch on CartPole
- Use https://www.learndatasci.com/tutorials/reinforcement-q-learning-scratch-python-openai-gym/

### Phase 3: Deep RL (Weeks 5-6)
- Read Sutton & Barto Chapters 9-10 (function approximation)
- Read DQN paper (Mnih et al., 2015)
- Use Stable Baselines3 to train DQN on Atari
- Watch Stanford CS224R lectures on deep Q-learning

### Phase 4: Policy Gradients (Weeks 7-8)
- Read Sutton & Barto Chapter 13 (policy gradient)
- Read PPO paper (Schulman et al., 2017)
- Implement REINFORCE on simple environment
- Use Stable Baselines3 PPO on continuous control

### Phase 5: Modern Topics (Weeks 9-10)
- Read InstructGPT paper (RLHF)
- Explore model-based RL (World Models paper)
- Read Spinning Up docs: https://spinningup.openai.com/
- Pick a project: solve a custom environment or reproduce a paper result

## Quick Reference Card

| **Algorithm** | **Type** | **Best For** | **Key Paper** |
|---------------|----------|--------------|---------------|
| Q-Learning | Off-policy value | Tabular, discrete actions | Watkins (1989) |
| SARSA | On-policy value | Safe exploration | Rummery & Niranjan (1994) |
| DQN | Off-policy deep | Discrete actions, pixels | Mnih et al. (2015) |
| REINFORCE | On-policy policy | Simple baseline | Williams (1992) |
| A2C/A3C | On-policy actor-critic | Parallel envs | Mnih et al. (2016) |
| PPO | On-policy actor-critic | General purpose | Schulman et al. (2017) |
| SAC | Off-policy actor-critic | Continuous control | Haarnoja et al. (2018) |
| TD3 | Off-policy actor-critic | Continuous control | Fujimoto et al. (2018) |

**When in doubt, use PPO** — It's the default choice for modern RL.
