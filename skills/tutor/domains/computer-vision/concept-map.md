# Computer Vision — Concept Map

## Core Concepts (in learning order)

1. **Pixels & color spaces** — how images are represented as arrays of numbers
2. **Camera models** — pinhole camera, lens distortion, calibration. Depends on: pixels
3. **Color transformations** — RGB, HSV, LAB, conversion between spaces. Depends on: pixels
4. **Image statistics** — histograms, quality metrics (PSNR, SSIM). Depends on: pixels
5. **Convolution** — filtering operation, kernels, mathematical foundation. Depends on: pixels
6. **Edge detection** — gradients, Sobel, Canny algorithm. Depends on: convolution
7. **Gaussian filtering** — smoothing, noise reduction, frequency domain. Depends on: convolution
8. **Advanced filtering** — bilateral, non-local means, application-specific filters. Depends on: convolution, edge detection
9. **Corner detection** — Harris detector, eigenvalues, corner response. Depends on: edge detection, gradients
10. **Keypoint descriptors** — SIFT, ORB, rotation/scale invariance. Depends on: corner detection
11. **Feature matching** — descriptor distance, RANSAC, geometric verification. Depends on: keypoint descriptors
12. **Homography** — planar projective transforms, image alignment. Depends on: feature matching
13. **Convolutional neural networks** — learned features, receptive fields, layer hierarchy. Depends on: convolution
14. **Feature hierarchy** — what CNNs learn at each layer. Depends on: CNNs
15. **Regularization techniques** — data augmentation, dropout, batch norm. Depends on: CNNs
16. **Transfer learning** — pre-trained models, fine-tuning, domain adaptation. Depends on: CNNs, regularization
17. **Image pyramids** — multi-scale representation, scale invariance. Depends on: Gaussian filtering
18. **Object localization** — bounding boxes, IoU, regression. Depends on: CNNs
19. **Region proposals** — R-CNN family, RPN, selective search. Depends on: CNNs, localization
20. **Single-shot detection** — YOLO, SSD, anchor boxes. Depends on: CNNs, localization
21. **Stereo vision** — disparity, triangulation, depth from two views. Depends on: camera models, feature matching
22. **Structure from motion** — 3D reconstruction from multiple images, bundle adjustment. Depends on: stereo vision, feature matching
23. **Monocular depth estimation** — depth from single image using CNNs. Depends on: CNNs, stereo vision
24. **System integration** — combining components, pipeline design, optimization. Depends on: all previous concepts

## Dependencies

### Foundation Layer
- **Pixels & color spaces** are the absolute foundation — nothing works without understanding image representation
- **Camera models** build directly on pixels to explain how 3D world becomes 2D image
- **Convolution** is the mathematical engine for both classical filtering and deep learning

### Classical Vision Path
- **Edge detection** requires convolution (gradients are directional filters)
- **Corner detection** requires edge detection (corners are points where gradients change direction)
- **Feature descriptors** (SIFT) require corners and orientation (from gradients)
- **Feature matching** requires descriptors and geometric constraints (RANSAC)
- **Homography** requires matched features and solves for projective transform

### Deep Learning Path
- **CNNs** build on convolution but learn kernels instead of hand-designing them
- **Feature hierarchy** emerges from stacked convolutions with nonlinearity
- **Transfer learning** requires understanding how CNNs learn hierarchical features
- **Object detection** combines CNNs with localization (regression) and classification

### 3D Vision Path
- **Stereo vision** requires camera models (to understand epipolar geometry) and feature matching (to find correspondences)
- **Structure from motion** extends stereo to many views, requires bundle adjustment (optimization)
- **Monocular depth** uses CNNs trained on stereo data to predict depth from single images

### Integration Bottlenecks
- **Convolution** appears in both classical (hand-crafted kernels) and modern (learned filters) approaches — understanding it deeply unlocks both paths
- **Feature matching** is critical for both classical vision (image alignment) and 3D vision (correspondence problem)
- **CNNs** are the foundation for all modern detection, segmentation, and recognition tasks
- **Camera models** are essential for any 3D reasoning or metric measurements

## Prerequisite Topics

- **Linear algebra** — needed for: image transforms, convolution (matrix operations), eigenvalues (corner detection), SVD (bundle adjustment)
- **Calculus** — needed for: gradients (edge detection), optimization (CNN training), derivatives (backpropagation)
- **Python programming** — needed for: implementing algorithms, using OpenCV/PyTorch, experimentation
- **Basic machine learning** — needed for: understanding CNNs, loss functions, optimization, overfitting, evaluation metrics

## Common Learning Bottlenecks

1. **Convolution** — students often confuse the operation with correlation or don't grasp why it's so powerful. Spend extra time here.
2. **Feature matching with RANSAC** — combining descriptor matching (similarity) with geometric constraints (homography) requires thinking at two levels simultaneously.
3. **CNN architecture choices** — when to use which architecture, how depth/width/skip connections affect learning. Requires lots of experimentation.
4. **Stereo correspondence** — the epipolar constraint is geometrically elegant but hard to visualize. Use interactive tools.
5. **Detection vs. segmentation vs. classification** — students confuse these tasks. Clearly distinguish: what's the output? what's the loss function?

## Misconceptions to Address

- "Edge detection finds object boundaries" — edges are brightness changes, not semantic boundaries
- "More layers = better CNN" — diminishing returns, vanishing gradients, computational cost
- "Transfer learning always works" — domain shift can hurt; sometimes training from scratch is better
- "YOLO is always faster than Faster R-CNN" — depends on hardware, batch size, and accuracy requirements
- "Two cameras = perfect depth map" — stereo fails with textureless regions, occlusions, repeated patterns
