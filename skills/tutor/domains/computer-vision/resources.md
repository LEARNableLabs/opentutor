# Computer Vision — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Computer Vision: Algorithms and Applications (2nd Edition)** by Richard Szeliski
  - URL: http://szeliski.org/Book/
  - Coverage: Comprehensive survey from image formation to 3D reconstruction, deep learning, and applications
  - Why it's excellent for intermediate learners: Free online, modern (covers both classical and deep learning), practical emphasis with real-world examples, accessible writing style
  - Best chapters for this curriculum: 2 (Image Formation), 3 (Image Processing), 4 (Feature Detection), 5 (Segmentation), 6 (Recognition), 11 (Stereo), 12 (3D Reconstruction)

- **Multiple View Geometry in Computer Vision (2nd Edition)** by Richard Hartley and Andrew Zisserman
  - Coverage: Deep treatment of 3D vision, camera geometry, reconstruction
  - Why useful: The definitive reference for stereo vision and structure from motion (lessons 24-26)
  - Note: More mathematically rigorous; use selectively for 3D modules

- **Deep Learning for Computer Vision** by Rajalingappaa Shanmugamani
  - Coverage: CNNs, architectures, transfer learning, object detection, segmentation
  - Why useful: Practical guide to implementing modern CV with PyTorch and Keras
  - Best for: Lessons 14-23 on deep learning and detection

### Online Courses

- **Stanford CS231n: Convolutional Neural Networks for Visual Recognition**
  - URL: http://cs231n.stanford.edu/
  - Format: Full lecture notes, assignments, video lectures (YouTube)
  - Coverage: CNN fundamentals, training, architectures, detection, segmentation
  - Why it's the gold standard: Industry-leading course, excellent explanations, practical assignments
  - Use for: Lessons 14-23, especially CNN training and object detection

- **MIT 6.801/6.866: Advanced Computer Vision**
  - URL: http://people.csail.mit.edu/torralba/courses/6.870/6.870.cv.html
  - Coverage: Classical techniques, recognition, scene understanding
  - Why useful: Strong theoretical foundations, connects perception to cognition
  - Use for: Supplementary depth on classical methods (lessons 1-13)

- **First Principles of Computer Vision** (Columbia University)
  - URL: https://www.youtube.com/channel/UCf0WB91t8Ky6AuYcQV0CcLw
  - Format: YouTube lecture series by Shree Nayar
  - Coverage: Deep conceptual explanations of cameras, lighting, geometry, imaging
  - Why exceptional: Best intuition-building resource; explains the "why" behind every technique
  - Use for: Lessons 1-2 (cameras), 24-26 (3D vision)

## Supplementary Resources

### Video Content

- **3Blue1Brown: Neural Networks Series**
  - URL: https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi
  - Why: Best visual intuition for how neural networks learn
  - Use for: Lessons 14-16 to build CNN intuition

- **Stanford CS231n Lecture Videos** (2017 version)
  - URL: https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv
  - Full course lectures by Fei-Fei Li, Justin Johnson, Serena Yeung
  - Use for: Lessons 14-23 as primary video resource

- **Two Minute Papers** (Computer Vision episodes)
  - URL: https://www.youtube.com/c/K%C3%A1rolyZsolnai
  - Why: Engaging summaries of cutting-edge research papers
  - Use for: "Wild card" moments, showing state-of-the-art results

### Interactive Tools & Visualizations

- **OpenCV Tutorials**
  - URL: https://docs.opencv.org/master/d9/df8/tutorial_root.html
  - Format: Hands-on Python tutorials with code samples
  - Coverage: All basic CV operations (filtering, edge detection, features, camera calibration, stereo)
  - Why essential: Standard library for CV; students must learn this
  - Use for: Implementation exercises in lessons 1-13, 24-26

- **PyImageSearch Tutorials**
  - URL: https://pyimagesearch.com/
  - Format: Blog-style tutorials with complete code
  - Coverage: Practical CV projects (face detection, object tracking, deep learning deployment)
  - Why valuable: Production-ready code, real-world focus, excellent explanations
  - Use for: Project ideas and implementation guidance

- **Distill.pub Feature Visualization**
  - URL: https://distill.pub/2017/feature-visualization/
  - Why: Interactive visualization of what CNNs learn at each layer
  - Use for: Lesson 15 (what CNNs learn)

- **TensorFlow Playground**
  - URL: https://playground.tensorflow.org/
  - Why: Interactive neural network visualization (not CV-specific but helpful for understanding training)
  - Use for: Lesson 16 (training dynamics)

- **Setosa.io Image Kernels**
  - URL: http://setosa.io/ev/image-kernels/
  - Why: Interactive demo of convolution with different kernels
  - Use for: Lesson 5 (convolution fundamentals)

### Code & Implementation

- **PyTorch Tutorials (Vision)**
  - URL: https://pytorch.org/tutorials/#image-and-video
  - Format: Official tutorials with runnable code
  - Coverage: CNN training, transfer learning, fine-tuning
  - Use for: Lessons 14-23 implementation

- **TorchVision Models**
  - URL: https://pytorch.org/vision/stable/models.html
  - Why: Pre-trained models for transfer learning
  - Use for: Lesson 17 (transfer learning)

- **Detectron2** (Facebook AI Research)
  - URL: https://github.com/facebookresearch/detectron2
  - Why: State-of-the-art object detection and segmentation library
  - Use for: Lessons 19-23 (object detection)

- **OpenCV GitHub Repository**
  - URL: https://github.com/opencv/opencv
  - Why: Source code for all classical CV algorithms
  - Use for: Understanding implementation details

### Papers & Research

- **Papers With Code: Computer Vision**
  - URL: https://paperswithcode.com/area/computer-vision
  - Why: Leaderboards, paper implementations, benchmarks for all CV tasks
  - Use throughout: Find state-of-the-art methods and implementations

- **Arxiv Sanity Preserver** (computer vision tag)
  - URL: http://www.arxiv-sanity.com/
  - Why: Browse recent CV papers with better interface than raw arXiv
  - Use for: Staying current with research

- **CVPR, ICCV, ECCV Open Access**
  - URLs: 
    - CVPR: https://openaccess.thecvf.com/CVPR2026
    - ICCV: https://openaccess.thecvf.com/ICCV2025
  - Why: Open access to top-tier CV conference papers
  - Use for: Advanced students wanting to explore cutting edge

### People to Follow

- **Fei-Fei Li** (Stanford) — ImageNet creator, AI/CV pioneer
- **Yann LeCun** (Meta/NYU) — CNN pioneer, deep learning leader
- **Jitendra Malik** (UC Berkeley) — Object recognition, segmentation
- **Kaiming He** (MIT/Meta) — ResNet, detection architectures
- **Antonio Torralba** (MIT) — Scene understanding, context
- **Alexei Efros** (UC Berkeley) — Computational photography, graphics + vision
- **Shree Nayar** (Columbia) — Computational imaging, First Principles series

## Domain-Specific Applications

### Medical Imaging
- **Grand Challenges in Biomedical Image Analysis**
  - URL: https://grand-challenge.org/
  - Why: Real medical imaging datasets and competitions

### Autonomous Driving
- **Waymo Open Dataset**
  - URL: https://waymo.com/open/
  - Why: Real self-driving car sensor data (camera, lidar)

- **KITTI Vision Benchmark**
  - URL: http://www.cvlibs.net/datasets/kitti/
  - Why: Standard benchmark for stereo, optical flow, odometry

### Face Recognition
- **Face Recognition Resources**
  - OpenCV Face Detection: https://docs.opencv.org/master/d2/d99/tutorial_js_face_detection.html
  - FaceNet paper and implementations
  - Why: Widely applicable, good teaching examples

### Augmented Reality
- **ARCore/ARKit Documentation**
  - Why: Shows CV in production (SLAM, tracking, plane detection)
  - Use for: Real-world application examples

## Datasets for Practice

- **ImageNet** — Large-scale image classification (1000 classes)
  - URL: http://www.image-net.org/
- **COCO** — Object detection, segmentation, captioning
  - URL: https://cocodataset.org/
- **Pascal VOC** — Classic detection/segmentation benchmark
  - URL: http://host.robots.ox.ac.uk/pascal/VOC/
- **Cityscapes** — Urban scene understanding
  - URL: https://www.cityscapes-dataset.com/
- **Places365** — Scene recognition
  - URL: http://places2.csail.mit.edu/

## Tools & Libraries

### Essential
- **OpenCV** — Classical CV algorithms (Python, C++)
- **PyTorch** / **TensorFlow** — Deep learning frameworks
- **NumPy** / **SciPy** — Numerical computing
- **Matplotlib** / **Seaborn** — Visualization
- **PIL/Pillow** — Image I/O and basic processing

### Specialized
- **scikit-image** — Python image processing library
- **Detectron2** — Object detection and segmentation
- **MediaPipe** — Real-time perception pipelines (Google)
- **COLMAP** — Structure from motion and MVS
- **Open3D** — 3D data processing

## Unexpected Connections (for wild cards)

- **Art and computer vision** — How GANs create art, neural style transfer, deep dream
  - URL: https://experiments.withgoogle.com/collection/arts-culture
- **Biology and vision** — How animal vision works vs. computer vision (fovea, saccades, attention)
- **Photography** — Computational photography, HDR, focus stacking, panoramas
- **Gaming** — Real-time rendering, DLSS (deep learning super sampling), neural radiance caching
- **Astronomy** — Image stacking, deconvolution, detecting exoplanets
- **Archaeology** — 3D reconstruction of artifacts and sites from photos
