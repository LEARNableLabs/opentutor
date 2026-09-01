/**
 * Simulated student profiles for end-to-end trajectory testing.
 *
 * Each student has a profile (USER.md content), a topic, and a
 * response generator that produces answers matching their personality.
 */

export const STUDENTS = {
  alex: {
    name: 'Alex',
    slug: 'auction-theory',
    profile: `# Student Profile

## Identity
- **Name:** Alex
- **What to call them:** Alex
- **Timezone:** America/New_York
- **Educational level:** undergrad

## Learning Style
- **Prefers:** examples-first
- **Modality:** visual
- **Pace:** slow — lots of repetition
- **Depth:** intuition-focused

## Preferences
- **Tone:** casual
- **Humor:** yes, light humor helps
- **Feedback style:** gentle — guide me there
- **Session length:** short — 3-5 min

## Context
First-year econ student, never seen auction theory formally. Curious but easily overwhelmed by math.`,

    behavior: {
      accuracy: 0.5,
      answerLength: 'short',
      asksQuestions: true,
      usesReasoning: false,
      skipRate: 0.1,
    },

    generateAnswer(step, lessonPlan, _history) {
      if (Math.random() < this.behavior.skipRate) return 'idk';
      const templates = {
        retrieval: [
          'Hmm, I think it was about bidding strategies?',
          'Something about how auctions work differently?',
          'Not sure, remind me?',
        ],
        diagnostic: [
          'I guess the higher price wins?',
          'Maybe because people bid more when they see others bidding?',
          'Is it about supply and demand?',
        ],
        followUp: [
          'Oh wait, so they\'re actually the same? That\'s weird',
          'Because the bidder adjusts their strategy?',
          'I\'m not sure I get it. Can you give an example?',
        ],
        application: [
          'I\'d use the English auction because it feels more transparent',
          'Sealed bid? No wait, English. Because you can see what others do',
          'Hmm, I think sealed bid but I\'m guessing',
        ],
        scaffolding: [
          'Oh, like when you\'re on eBay?',
          'So the price goes up until one person is left?',
          'That makes more sense with the example',
        ],
        teachBack: [
          'Ok so basically there are four types and they\'re kinda equivalent under certain conditions?',
          'It\'s about how information changes strategy',
          'The format matters because of what you can see',
        ],
      };
      const pool = templates[step] || templates.diagnostic;
      return pool[Math.floor(Math.random() * pool.length)];
    },
  },

  priya: {
    name: 'Priya',
    slug: 'quantum-computing',
    profile: `# Student Profile

## Identity
- **Name:** Priya
- **What to call them:** Priya
- **Timezone:** Asia/Kolkata
- **Educational level:** PhD

## Learning Style
- **Prefers:** theory-first
- **Modality:** reading
- **Pace:** fast — skip basics
- **Depth:** rigorous-formal

## Preferences
- **Tone:** semi-formal
- **Humor:** neutral
- **Feedback style:** direct — tell me I'm wrong
- **Session length:** medium — 5-10 min

## Context
PhD in physics, transitioning to quantum computing. Strong math background, wants to understand the CS/information theory side.`,

    behavior: {
      accuracy: 0.9,
      answerLength: 'long',
      asksQuestions: false,
      usesReasoning: true,
      skipRate: 0,
    },

    generateAnswer(step) {
      const templates = {
        retrieval: [
          'A qubit is a two-level quantum system that can exist in superposition of |0⟩ and |1⟩ states, giving exponential state space growth with n qubits. It matters because this is the fundamental resource for quantum speedup.',
          'The Hadamard gate creates equal superposition from a computational basis state. It\'s the quantum analog of a coin flip but with interference.',
        ],
        diagnostic: [
          'I\'d say it\'s because quantum parallelism lets you evaluate a function on all inputs simultaneously, but the challenge is extracting useful information because measurement collapses the state.',
          'The key insight is that entanglement allows correlations between qubits that have no classical analog, which is what makes protocols like teleportation possible.',
        ],
        followUp: [
          'Yes, this connects to the distinction between BQP and BPP — the quantum speedup isn\'t universal, it requires problems with structure that quantum algorithms can exploit, like the periodicity in Shor\'s algorithm.',
          'The connection to information theory is through Holevo\'s theorem — you can\'t extract more than n classical bits from n qubits, so the advantage must come from the computation, not the communication.',
        ],
        application: [
          'For the key distribution problem, I\'d use BB84 because it leverages the no-cloning theorem — any eavesdropper must measure and therefore disturb the quantum state, which is detectable through error rate analysis on the public channel.',
          'I\'d choose the variational quantum eigensolver because it\'s a hybrid classical-quantum approach that\'s more robust to noise than pure quantum algorithms, making it practical on NISQ devices.',
        ],
      };
      const pool = templates[step] || templates.diagnostic;
      return pool[Math.floor(Math.random() * pool.length)];
    },
  },

  marcus: {
    name: 'Marcus',
    slug: 'game-theory',
    profile: `# Student Profile

## Identity
- **Name:** Marcus
- **What to call them:** Marcus
- **Timezone:** Europe/London
- **Educational level:** professional

## Learning Style
- **Prefers:** mixed
- **Modality:** verbal
- **Pace:** steady — build foundations
- **Depth:** practical-applied

## Preferences
- **Tone:** casual
- **Humor:** yes, light humor helps
- **Feedback style:** Socratic — ask me questions
- **Session length:** medium — 5-10 min

## Context
Product manager at a tech company. Learning game theory to make better strategic decisions. Some days motivated, some days barely shows up.`,

    behavior: {
      accuracy: 0.6,
      answerLength: 'medium',
      asksQuestions: false,
      usesReasoning: true,
      skipRate: 0.2,
    },

    generateAnswer(step) {
      if (Math.random() < this.behavior.skipRate) return 'skip';
      if (Math.random() < 0.3) return 'not sure about this one';

      const templates = {
        retrieval: [
          'Nash equilibrium is when nobody wants to change what they\'re doing because everyone else is doing their best too',
          'Something about dominant strategies... where one option is always better?',
          'I remember it vaguely but couldn\'t explain it well',
        ],
        diagnostic: [
          'I think it\'s because both players would defect since they can\'t trust the other to cooperate',
          'Is this the prisoner thing? Where being selfish is individually rational but collectively bad?',
          'Because the payoff matrix makes defection dominant?',
        ],
        followUp: [
          'Oh right, because in repeated games you can punish defection, so cooperation becomes rational. Like tit-for-tat',
          'I see the connection to pricing — if competitors keep undercutting, everyone loses',
          'Not sure how this connects actually',
        ],
        application: [
          'For the pricing decision I\'d signal willingness to cooperate first, then match whatever the competitor does. Kind of like tit-for-tat',
          'I\'d probably just undercut slightly and hope they don\'t notice? That\'s probably not the right answer',
          'Set the price based on costs plus margin and ignore competitors — wait, that ignores the game theory',
        ],
      };
      const pool = templates[step] || templates.diagnostic;
      return pool[Math.floor(Math.random() * pool.length)];
    },
  },

  sofia: {
    name: 'Sofia',
    slug: 'differential-geometry',
    profile: `# Student Profile

## Identity
- **Name:** Sofia
- **What to call them:** Sofia
- **Timezone:** America/Los_Angeles
- **Educational level:** self-taught

## Learning Style
- **Prefers:** examples-first
- **Modality:** visual
- **Pace:** steady — build foundations
- **Depth:** intuition-focused

## Preferences
- **Tone:** casual
- **Humor:** yes, light humor helps
- **Feedback style:** Socratic — ask me questions
- **Session length:** long — 10-20 min

## Context
Self-taught programmer interested in the math behind computer graphics and general relativity. Comfortable with calculus, learning linear algebra alongside.`,

    behavior: {
      accuracy: 0.65,
      answerLength: 'medium',
      asksQuestions: true,
      usesReasoning: true,
      skipRate: 0.05,
      goesDeeper: true,
    },

    generateAnswer(step) {
      if (Math.random() < 0.15) return 'go deeper';

      const templates = {
        retrieval: [
          'A manifold is like a surface that looks flat if you zoom in close enough, right? Like how the Earth looks flat locally',
          'Tangent vectors are like arrows attached to a point on a surface that show which direction you could move',
        ],
        diagnostic: [
          'Is it like how you can\'t flatten a sphere without stretching? The curvature is the thing that tells you how much it deviates from flat?',
          'I think the connection is the metric tensor — it\'s what lets you measure distances on curved surfaces',
        ],
        followUp: [
          'So the Christoffel symbols are basically telling you how coordinates change as you move? Like GPS correction for curved space?',
          'Wait, so parallel transport means carrying a vector along a path without turning it, but the curvature makes it rotate anyway? That\'s wild',
        ],
        application: [
          'For the game physics, I\'d use the metric tensor to compute geodesics — shortest paths on the terrain mesh. Because characters should walk along the surface naturally, not through it. The curvature affects the path they take.',
          'In the renderer, I\'d compute surface normals from the first fundamental form, then use the Gauss map to figure out how light reflects. The curvature determines whether you see a highlight or a shadow.',
        ],
      };
      const pool = templates[step] || templates.diagnostic;
      return pool[Math.floor(Math.random() * pool.length)];
    },
  },

  yuki: {
    name: 'Yuki',
    slug: 'category-theory',
    profile: `# Student Profile

## Identity
- **Name:** Yuki
- **What to call them:** Yuki
- **Timezone:** Asia/Tokyo
- **Educational level:** grad

## Learning Style
- **Prefers:** theory-first
- **Modality:** reading
- **Pace:** fast — skip basics
- **Depth:** rigorous-formal

## Preferences
- **Tone:** formal
- **Humor:** no, keep it dry
- **Feedback style:** direct — tell me I'm wrong
- **Session length:** short — 3-5 min

## Context
Math grad student. Studying category theory for algebraic topology research. Already knows basic algebra and topology. Wants the formal treatment, not analogies.`,

    behavior: {
      accuracy: 0.8,
      answerLength: 'short',
      asksQuestions: false,
      usesReasoning: true,
      skipRate: 0,
    },

    generateAnswer(step) {
      const templates = {
        retrieval: [
          'A functor is a structure-preserving map between categories — maps objects to objects, morphisms to morphisms, preserves identity and composition.',
          'Natural transformations are morphisms between functors that commute with the functor action.',
        ],
        diagnostic: [
          'The Yoneda lemma says the functor Hom(A,-) determines A up to isomorphism. So objects are determined by their relationships.',
          'Adjunctions capture the notion of optimal solutions — left adjoint is free construction, right adjoint is forgetful.',
        ],
        followUp: [
          'The connection to topology is via the nerve functor from Cat to sSet, which is right adjoint to the fundamental category functor.',
          'Yes, this generalizes to enriched categories where hom-sets become objects in a monoidal category.',
        ],
        application: [
          'The colimit of the diagram computes the pushout, which glues the two spaces along their common subspace. Universal property gives uniqueness.',
          'Apply the adjoint functor theorem — check that the functor preserves limits and use the solution set condition.',
        ],
      };
      const pool = templates[step] || templates.diagnostic;
      return pool[Math.floor(Math.random() * pool.length)];
    },
  },
};

export const STUDENT_LIST = Object.keys(STUDENTS);
