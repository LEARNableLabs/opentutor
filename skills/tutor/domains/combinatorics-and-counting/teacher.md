# Combinatorics and counting — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 11 lessons (41%)
- **Socratic questions** — 5 lessons (19%)
- **real-world application challenges** — 4 lessons (15%)
- **review and consolidation sessions** — 4 lessons (15%)
- **teach-back exercises (student explains)** — 3 lessons (11%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 41% accessible (1-2), 30% standard (3), 30% challenging (4-5).

Difficulty peaks:
- Day 11: "Can you choose with repetition allowed?" (difficulty 4)
- Day 15: "Why are derangements harder to count than permutations?" (difficulty 4)
- Day 20: "Why do we multiply generating functions?" (difficulty 4)
- Day 21: "How do recurrence relations become equations?" (difficulty 4)
- Day 22: "Can generating functions solve Fibonacci-style problems?" (difficulty 4)

## Domain Hooks
- **Ramsey theory** — after pigeonhole principle (lesson 13), mention that Ramsey numbers R(m,n) ask "how large must a graph be to guarantee either a clique of size m or an independent set of size n?" This is a vast generalization of pigeonhole.

- **Inclusion-exclusion and probability** — after derangements (lesson 15), connect to the matching problem and surprise probability (chance a random permutation is a derangement approaches 1/e as n → ∞)

- **Catalan numbers in computer science** — after lesson 25, show how Catalan numbers count binary search trees, stack-sortable permutations, and non-crossing partitions; this motivates the recursion structurally

- **Graph enumeration and Cayley's formula** — in lesson 27, drop the fact that there are n^(n-2) labeled trees on n vertices (Cayley's formula); this can be proved by bijection or by the matrix-tree theorem (advanced rabbit hole)

- **Generating functions and partition theory** — after exponential generating functions (lesson 23), 

## Common Failure Modes
1. **"Permutations are always n!"** — Students forget about partial permutations (n choose k, then arrange) and permutations with repetition. Correct by always asking: "Are we arranging all n items or selecting k of them? Are all items distinct?"

2. **"Order matters in combinations"** — Some students compute C(n,k) but then try to arrange the result. Correct by emphasizing that choosing {A,B,C} and {C,A,B} is the same selection; combinations already account for all orderings.

3. **"Stars and bars works for any distribution problem"** — Students misapply it when objects are distinguishable or when there are upper bounds on bins. Correct by stressing the exact scenario: indistinguishable objects, no upper limits.

4. **"Inclusion-exclusion is just A ∪ B = A + B - A ∩ B"** — Students don't generalize the pattern to three or more sets and get the signs wrong. Correct by showing the pattern: include singletons, exclude pairs, include triples, etc.

5. **"Generating functions are just form

## Vocabulary
Key terms for this domain: multiplication principle, counting sequences, decision trees, addition principle, disjoint cases, case analysis, bijections, one-to-one correspondence, counting by matching, complement counting, overcounting, subtraction principle, isomorphic problems, problem transformation, abstraction (and 66 more).