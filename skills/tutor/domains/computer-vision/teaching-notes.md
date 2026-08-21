# Computer Vision — Teaching Notes

## Approach

Computer vision sits at the intersection of mathematics, engineering, and perception — it's both rigorous and deeply intuitive. At the intermediate level, balance formalism with hands-on experimentation: show the math behind edge detection, then have students implement it and see what breaks on real images. Emphasize the "why" behind design choices (why Gaussian blur before Canny? why do CNNs need pooling?) rather than just the "how." The field has shifted dramatically toward deep learning, but classical techniques still matter for debugging, understanding failure modes, and building intuition about what networks might learn. Use visualization heavily — computer vision is a visual field, so every concept should have a corresponding image or animation.

## Common Misconceptions

1. **"Convolution is just sliding a window"** — Students miss that it's a mathematical operation with specific properties (linearity, shift-invariance) that make it powerful for both filtering and learning. Correct by showing frequency domain interpretation and how these properties enable efficient computation and learning.

2. **"Edge detection finds objects"** — Students think edges = object boundaries, but edges are just brightness gradients. A texture-rich object has many edges; a smooth object has few. Correct by showing images where edges don't correspond to semantics (wood grain, shadows) and vice versa (camouflaged objects).

3. **"More data always improves deep learning"** — Students assume more training images = better accuracy. Reality: diminishing returns, class imbalance, distribution shift, annotation quality all matter. Correct by showing examples where careful data curation beats brute-force collection.

4. **"CNNs learn like humans"** — Students anthropomorphize networks ("it recognized the cat"). CNNs learn correlations in training data, not semantic understanding. Correct by showing adversarial examples and texture bias experiments.

5. **"Transfer learning is a shortcut"** — Students think pre-trained models are magic. Reality: they encode ImageNet biases, struggle with domain shift, and require careful fine-tuning. Correct by showing when transfer learning fails (medical images, satellite imagery, specialized domains).

6. **"Stereo vision gives perfect depth"** — Students expect two cameras to solve depth estimation completely. Reality: correspondence problem is hard (occlusions, textureless regions, repeated patterns). Correct by showing failure cases and introducing monocular depth as a learned alternative.

7. **"Bigger CNNs are always better"** — Students default to using ResNet-152 or the latest giant model. Reality: overfitting on small datasets, computational cost, diminishing returns. Correct by showing accuracy vs. parameters plots and teaching model selection criteria.

8. **"Object detection is just classification + localization"** — Students miss that detection requires handling variable numbers of objects, scale variation, and class imbalance. Correct by walking through what happens when you naively apply a classifier at every position and scale.

9. **"Color doesn't matter, convert to grayscale"** — Students think grayscale simplifies without loss. Reality: color is informative for many tasks (skin detection, vegetation, traffic lights). Correct by showing tasks where color is essential vs. where it's noise.

10. **"Feature matching requires identical viewpoints"** — Students expect SIFT to match any two views of an object. Reality: large viewpoint changes break local descriptors. Correct by showing the limits of invariance and introducing learned features that can handle wider baselines.

## Level Adjustments

### For Intermediate Students (current level)

- **Emphasis**: Balance classical foundations (filtering, features) with modern deep learning. Students should understand both worlds and when to use each.
- **Math depth**: Show the key equations (convolution, gradient, loss functions) but don't derive from first principles. Focus on intuition and implementation.
- **Implementation**: Heavy hands-on work with OpenCV and PyTorch/TensorFlow. Students should code core algorithms, not just call library functions.
- **Formalism**: Use clear notation but skip proofs. Reference papers for details but focus on concepts.
- **Projects**: Real-world tasks (face detection, image search, basic 3D reconstruction) that combine multiple techniques.

### If Student Were Beginner

- Skip or simplify: camera geometry, homography, RANSAC, bundle adjustment, CNN architecture details
- More time on: basic filtering, color spaces, simple classification, using pre-trained models
- Less math, more visual intuition
- Focus on applications over algorithms

### If Student Were Advanced

- Add: variational methods, optimization theory, multiple view geometry proofs, generative models (GANs, diffusion)
- Deeper math: derive backpropagation, understand loss landscape, prove geometric relationships
- Research papers: read and critique recent CVPR/ICCV papers
- Implement state-of-the-art: vision transformers, self-supervised learning, neural radiance fields

## Rabbit Holes (when to introduce them)

- **Fourier analysis of images** — after covering convolution and Gaussian filtering. Show that convolution is multiplication in frequency domain; this explains why Gaussian is special (separable, no ringing).

- **Adversarial examples** — after CNN training. Show that adding imperceptible noise can fool networks; this reveals what CNNs actually learn (texture bias, non-robust features).

- **Attention mechanisms and Vision Transformers** — after covering standard CNNs. Show how self-attention can replace convolution; this is the cutting edge as of 2026.

- **Optical flow and motion** — after covering feature matching. Show that flow is a dense correspondence field; connects to video understanding and tracking.

- **Image formation physics** — after camera models. Show how light reflects, how sensors work, why some things are hard to capture (shiny objects, transparent materials).

- **Self-supervised learning** — after transfer learning. Show how to train without labels using pretext tasks (rotation prediction, colorization, contrastive learning).

- **3D representations beyond point clouds** — after structure from motion. Introduce meshes, voxels, implicit functions (NeRF) for more advanced 3D reasoning.

- **Semantic vs. instance segmentation** — after object detection. Show the progression from boxes to pixel-level understanding.

## Pacing and Difficulty Progression

### Early Lessons (1-9): Build Foundations
- Start gentle (difficulty 1-2) with image fundamentals and basic filtering
- Introduce convolution carefully — this is a bottleneck concept
- Review at lesson 8 to consolidate filtering skills
- Avoid deep learning until foundations are solid

### Middle Lessons (10-18): Ramp Up Complexity
- Difficulty peaks at 3-4 (SIFT, RANSAC, CNN training)
- Alternate between challenging concepts and applications
- Two review days (13, 18) to prevent overload
- Balance classical (features) and modern (CNNs) approaches

### Advanced Lessons (19-27): Push Boundaries
- Sustained difficulty 3-4 (detection architectures, 3D vision)
- Real-world applications to maintain motivation
- Review at 23 and 27 before module transitions
- Connect concepts across modules (e.g., how CNNs change detection)

### Integration (28): Synthesis
- Difficulty drops to 3 for teach-back
- Student explains how to combine all techniques into a working system
- Reinforces that CV is about solving problems, not just understanding algorithms

## Delivery Tips

- **Use visualization**: Every algorithm should have a visual demo. Show edge detection on real images, visualize CNN features, animate stereo correspondence.
- **Code alongside**: Don't just show pseudocode — implement key algorithms in Jupyter notebooks and let students modify parameters to see effects.
- **Compare approaches**: When introducing CNNs, show the same task (edge detection, feature detection) done with classical and learned methods. Discuss tradeoffs.
- **Debug together**: When something fails (feature matching on textureless images, overfitting on small datasets), diagnose why and explore solutions.
- **Connect to applications**: Each concept should link to a real use case (face recognition, autonomous driving, medical imaging, AR/VR, robotics).
- **Progressive disclosure**: Introduce simplified versions first, then add complexity. E.g., binary edge detection → multi-scale edges → learned edge detection.
