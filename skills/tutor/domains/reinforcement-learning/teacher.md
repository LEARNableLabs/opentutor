# Reinforcement Learning — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 13 lessons (46%)
- **Socratic questions** — 6 lessons (21%)
- **review and consolidation sessions** — 3 lessons (11%)
- **real-world application challenges** — 3 lessons (11%)
- **curated resource exploration** — 2 lessons (7%)
- **teach-back exercises (student explains)** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 21% accessible (1-2), 39% standard (3), 39% challenging (4-5).

Difficulty peaks:
- Day 9: "How does Q-learning discover optimal actions without following them?" (difficulty 4)
- Day 13: "Can we be optimistic about uncertainty?" (difficulty 4)
- Day 16: "How do we use gradient descent to learn value functions?" (difficulty 4)
- Day 17: "Can we use neural networks as Q-functions?" (difficulty 4)
- Day 18: "Why does DQN need experience replay and target networks?" (difficulty 4)

## Domain Hooks
This field covers reinforcement learning, with applications across theory and practice.

## Common Failure Modes
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
   - The truth: Q-le

## Vocabulary
Key terms for this domain: agent-environment interaction, trial and error, delayed rewards, Markov Decision Processes, states, actions, rewards, transition dynamics, returns, discounting, episodic vs. continuing tasks, policies, value functions, optimal policy, Bellman optimality equation (and 79 more).