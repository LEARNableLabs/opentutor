# Computer Vision — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 8 lessons (26%)
- **Socratic questions** — 7 lessons (23%)
- **real-world application challenges** — 5 lessons (16%)
- **review and consolidation sessions** — 5 lessons (16%)
- **teach-back exercises (student explains)** — 4 lessons (13%)
- **curated resource exploration** — 2 lessons (6%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 35% accessible (1-2), 39% standard (3), 26% challenging (4-5).

Difficulty peaks:
- Day 11: "Why do we need rotation-invariant features?" (difficulty 4)
- Day 12: "Can you match images from different viewpoints?" (difficulty 4)
- Day 16: "How do you train on millions of images without overfitting?" (difficulty 4)
- Day 21: "What's the difference between R-CNN, Fast R-CNN, and Faster R-CNN?" (difficulty 4)
- Day 22: "How does YOLO detect objects in real-time?" (difficulty 4)

## Domain Hooks
- **Fourier analysis of images** — after covering convolution and Gaussian filtering. Show that convolution is multiplication in frequency domain; this explains why Gaussian is special (separable, no ringing).

- **Adversarial examples** — after CNN training. Show that adding imperceptible noise can fool networks; this reveals what CNNs actually learn (texture bias, non-robust features).

- **Attention mechanisms and Vision Transformers** — after covering standard CNNs. Show how self-attention can replace convolution; this is the cutting edge as of 2026.

- **Optical flow and motion** — after covering feature matching. Show that flow is a dense correspondence field; connects to video understanding and tracking.

- **Image formation physics** — after camera models. Show how light reflects, how sensors work, why some things are hard to capture (shiny objects, transparent materials).

- **Self-supervised learning** — after transfer learning. Show how to train without labels using pretext 

## Common Failure Modes
1. **"Convolution is just sliding a window"** — Students miss that it's a mathematical operation with specific properties (linearity, shift-invariance) that make it powerful for both filtering and learning. Correct by showing frequency domain interpretation and how these properties enable efficient computation and learning.

2. **"Edge detection finds objects"** — Students think edges = object boundaries, but edges are just brightness gradients. A texture-rich object has many edges; a smooth object has few. Correct by showing images where edges don't correspond to semantics (wood grain, shadows) and vice versa (camouflaged objects).

3. **"More data always improves deep learning"** — Students assume more training images = better accuracy. Reality: diminishing returns, class imbalance, distribution shift, annotation quality all matter. Correct by showing examples where careful data curation beats brute-force collection.

4. **"CNNs learn like humans"** — Students anthropomorphize networ

## Vocabulary
Key terms for this domain: pixels, color spaces, image arrays, camera models, lens distortion, calibration, color transformations, HSV, LAB color space, image statistics, histograms, quality metrics, PSNR, convolution, kernels (and 81 more).