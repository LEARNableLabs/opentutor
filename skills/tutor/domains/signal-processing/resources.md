# Signal Processing — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Oppenheim, A. V., & Willsky, A. S. (1997). *Signals and Systems* (2nd ed.)** — The classic undergraduate text, covers continuous and discrete-time signals with exceptional clarity. Best for conceptual foundations. Strong on Fourier analysis and LTI systems.

- **Oppenheim, A. V., & Schafer, R. W. (2009). *Discrete-Time Signal Processing* (3rd ed.)** — The canonical graduate-level text. Comprehensive, rigorous, and practical. Covers everything from DFT to advanced filter design. Used worldwide in graduate programs.

- **Proakis, J. G., & Manolakis, D. G. (2006). *Digital Signal Processing* (4th ed.)** — More application-oriented than Oppenheim. Excellent for implementation details and practical algorithms. Good companion for engineering applications.

- **Smith, S. W. (1997). *The Scientist and Engineer's Guide to Digital Signal Processing*** — Free online book at http://www.dspguide.com/. Very accessible, minimal math prerequisites, excellent for intuition. Perfect supplementary reading.

### University Courses

- **MIT OpenCourseWare 6.003: Signals and Systems** — https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/
  - Alan Oppenheim's legendary undergraduate lectures
  - Video lectures, lecture notes, problem sets, exams all freely available
  - Covers continuous and discrete-time systems, Fourier analysis, sampling, filtering
  - **Best for**: Foundational concepts, seeing how a master teacher explains complex ideas

- **MIT OpenCourseWare 6.341: Discrete-Time Signal Processing** — https://ocw.mit.edu/courses/6-341-discrete-time-signal-processing-fall-2005/
  - Graduate-level treatment of digital signal processing
  - Covers filter design, DFT/FFT, multirate processing, filter banks
  - **Best for**: Advanced students wanting depth on discrete-time methods

- **Coursera: Digital Signal Processing (EPFL)** — https://www.coursera.org/learn/dsp
  - Modern, interactive course with programming exercises
  - Uses Python and MATLAB
  - **Best for**: Hands-on implementation and practical skills

- **Stanford EE261: The Fourier Transform and Its Applications**
  - Available through Stanford Engineering Everywhere
  - Focus on Fourier methods across engineering disciplines
  - **Best for**: Deep dive into Fourier theory and applications

## Supplementary (for engagement)

### Videos

- **3Blue1Brown: But what is the Fourier Transform? A visual introduction**
  - https://www.youtube.com/watch?v=spUNpyF58BY
  - Stunning visual explanation of Fourier analysis
  - **Use for**: Building intuition about frequency decomposition
  - **Best moment**: The winding frequency visualization

- **3Blue1Brown: Fourier Transform playlist**
  - https://www.youtube.com/playlist?list=PLZHQObOWTQDNPOjrT6KVlfJuKtYTftqH6
  - Series on Fourier analysis with beautiful animations
  - **Use for**: Visual learners struggling with abstract concepts

- **MIT 6.003 Lecture Videos** (via MIT OCW)
  - Full semester of Oppenheim lectures
  - **Use for**: Seeing concepts taught by a master educator

### Interactive Tools

- **SciPy Signal Processing Documentation** — https://docs.scipy.org/doc/scipy/reference/signal.html
  - Reference for Python implementations
  - Includes examples for filtering, spectral analysis, FFT, filter design
  - **Use for**: Every programming exercise

- **MATLAB Signal Processing Toolbox** — https://www.mathworks.com/products/signal.html
  - Industry-standard tools (commercial, but trial available)
  - Extensive documentation and examples
  - **Use for**: Professional-level implementations

- **GNU Octave** — https://www.gnu.org/software/octave/
  - Free, MATLAB-compatible environment
  - **Use for**: Students without MATLAB access

- **Seeing Theory** — https://seeing-theory.brown.edu/
  - Interactive visualizations of probability and statistics
  - **Use for**: Understanding random signals and noise

- **Desmos** — https://www.desmos.com/calculator
  - Browser-based graphing calculator
  - **Use for**: Quick plots of signal transformations, exploring waveforms

### Code and Notebooks

- **SciPy Signal Processing Tutorial** — https://docs.scipy.org/doc/scipy/tutorial/signal.html
  - Worked examples in Python
  - Covers filtering, spectral analysis, wavelet transforms
  - **Use for**: Template code for common tasks

- **Think DSP** — https://github.com/AllenDowney/ThinkDSP
  - Free book with Jupyter notebooks
  - Hands-on, code-first approach
  - **Use for**: Computational exercises and exploratory learning

- **Physical Audio Signal Processing** (Julius O. Smith III) — https://ccrma.stanford.edu/~jos/pasp/
  - Free online book focused on audio applications
  - **Use for**: Audio-specific signal processing (filters, effects, synthesis)

### People to Follow

- **Alan V. Oppenheim** (MIT) — Author of canonical texts, pioneer in discrete-time signal processing
- **Ronald W. Schafer** (Georgia Tech) — Co-author with Oppenheim, major contributions to speech processing
- **J. O. Smith III** (Stanford/CCRMA) — Audio signal processing, beautiful online books and tools
- **Barbara Shinn-Cunningham** (CMU) — Auditory neuroscience and signal processing
- **Thomas Quatieri** (MIT Lincoln Lab) — Speech signal processing

### Unexpected Connections

- **Music and Audio** — Almost every concept has an audible manifestation. Fourier series → harmonics, filters → equalizers, STFT → spectrograms of speech, convolution → reverb. Use music examples constantly—students can *hear* frequency content.

- **Image Processing** — 2D signals! FFT for image compression (JPEG uses DCT, a Fourier relative), convolution for edge detection and blurring, wavelets for multi-resolution analysis. Show a 2D FFT of an image.

- **Quantum Mechanics** — The time-frequency uncertainty principle is mathematically identical to Heisenberg uncertainty. Wave functions are signals; probability amplitudes are Fourier transforms.

- **Neuroscience** — Brain signals (EEG, fMRI) are analyzed with signal processing. Spike trains, oscillations, coherence analysis. The brain itself implements something like a filterbank (cochlea).

- **Seismology** — Earthquake signals, filtering for event detection, frequency content reveals earth structure. Convolution models wave propagation.

- **Finance** — Time series analysis, spectral analysis of price data, filtering noise from signals. (Caveat: markets aren't stationary, so Fourier has limits here—good teaching moment.)

## Tools and Software

### Python Libraries
- **NumPy** — https://numpy.org/ — array operations, FFT
- **SciPy** — https://scipy.org/ — signal processing functions
- **Matplotlib** — https://matplotlib.org/ — plotting
- **Librosa** — https://librosa.org/ — audio analysis

### MATLAB Alternatives (Free)
- **GNU Octave** — https://www.gnu.org/software/octave/
- **Scilab** — https://www.scilab.org/

### Audio Tools
- **Audacity** — https://www.audacityteam.org/ — audio editor with spectrogram view
- **Sonic Visualiser** — https://www.sonicvisualiser.org/ — advanced audio analysis

### Online Signal Processing
- **WolframAlpha** — https://www.wolframalpha.com/ — quick Fourier transforms, filter responses
- **WebFFT** — various browser-based FFT tools for exploring real-time analysis

## Further Topics (beyond intermediate)

For students who finish strong and want more:

- **Adaptive Filtering** — filters that adjust parameters in real-time (LMS, RLS algorithms)
- **Multirate Signal Processing** — decimation, interpolation, polyphase filters
- **Statistical Signal Processing** — optimal filtering (Wiener, Kalman), detection theory
- **Wavelets and Filter Banks** — deeper dive into multi-resolution analysis
- **Spectral Estimation** — parametric methods (AR, ARMA), periodogram averaging
- **Communication Theory** — modulation, demodulation, matched filtering, equalization

## Historical Notes

Understanding how these ideas developed can deepen appreciation:

- **Joseph Fourier** (1822) — *Théorie analytique de la chaleur*, introduced Fourier series for heat equation
- **Harry Nyquist** (1928) — sampling theorem foundations in telegraphy
- **Claude Shannon** (1949) — formalized sampling theorem, information theory connections
- **Cooley & Tukey** (1965) — FFT algorithm (though Gauss discovered it first in 1805!)
- **Mallat** (1989) — multiresolution analysis and modern wavelet theory

Knowing that the FFT was "rediscovered" in the computer age after Gauss used it for asteroid orbit calculations is a great story for showing that math transcends applications.
