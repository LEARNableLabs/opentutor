# Signal Processing — Research Summary

## Major Subtopics

### 1. Signals and Systems Fundamentals
- Signal classification (continuous vs. discrete, deterministic vs. random)
- System properties (linearity, time-invariance, causality, stability)
- Basic operations (time-shifting, scaling, reversal)

### 2. Fourier Analysis
- Fourier series for periodic signals
- Fourier transform for aperiodic signals
- Discrete Fourier Transform (DFT) and Fast Fourier Transform (FFT)
- Frequency domain representation and interpretation

### 3. Sampling Theory
- Nyquist-Shannon sampling theorem
- Aliasing and anti-aliasing filters
- Reconstruction from samples
- Practical sampling considerations

### 4. Convolution and Correlation
- Linear time-invariant (LTI) systems
- Impulse response and frequency response
- Convolution theorem
- Cross-correlation and autocorrelation

### 5. Filtering
- Filter types (lowpass, highpass, bandpass, bandstop)
- FIR vs. IIR filters
- Filter design methods (windowing, frequency sampling, Butterworth, Chebyshev)
- Analog vs. digital filtering

### 6. Transform Methods
- Laplace transform (continuous-time)
- Z-transform (discrete-time)
- Transfer functions and poles/zeros
- Stability analysis

### 7. Time-Frequency Analysis
- Short-time Fourier transform (STFT)
- Spectrograms
- Wavelet transforms
- Uncertainty principle

### 8. Applications
- Audio processing (equalization, compression, effects)
- Communications (modulation, demodulation)
- Image processing (edge detection, filtering)
- Biomedical signals (ECG, EEG)

## Key Sources

### Textbooks
- **Oppenheim, A. V., & Schafer, R. W.** (2010). *Discrete-Time Signal Processing* (3rd ed.)
  - The canonical graduate textbook, comprehensive and rigorous
  - Strong theoretical foundation with practical examples
  
- **Oppenheim, A. V., & Willsky, A. S.** (1997). *Signals and Systems* (2nd ed.)
  - Undergraduate level, covers both continuous and discrete
  - Excellent conceptual explanations

- **Proakis, J. G., & Manolakis, D. G.** (2006). *Digital Signal Processing* (4th ed.)
  - More application-focused
  - Good for implementation details

### Online Courses
- **MIT OpenCourseWare 6.003**: Signals and Systems
  - https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/
  - Alan Oppenheim's legendary lectures
  
- **MIT OpenCourseWare 6.341**: Discrete-Time Signal Processing
  - https://ocw.mit.edu/courses/6-341-discrete-time-signal-processing-fall-2005/
  - Graduate-level, comprehensive

- **Coursera**: Digital Signal Processing (EPFL)
  - https://www.coursera.org/learn/dsp
  - Interactive, with MATLAB/Python exercises

### Interactive Resources
- **Seeing Theory: Probability Visualizations**
  - https://seeing-theory.brown.edu/
  - Helps with random signal concepts

- **SciPy Signal Processing Documentation**
  - https://docs.scipy.org/doc/scipy/reference/signal.html
  - Practical Python implementation reference

- **DSP Guide by Steven W. Smith**
  - http://www.dspguide.com/
  - Free online book, very accessible

### Video Lectures
- **3Blue1Brown**: Fourier Transform visualizations
  - https://www.youtube.com/watch?v=spUNpyF58BY
  - Beautiful visual intuition

- **Stanford EE261**: The Fourier Transform and Its Applications
  - Available on YouTube and Stanford Engineering Everywhere

### Software Tools
- **MATLAB Signal Processing Toolbox**
  - Industry standard, extensive documentation
  
- **Python**: NumPy, SciPy, matplotlib
  - Open-source alternative
  - scipy.signal module

- **GNU Octave**
  - MATLAB-compatible, free

## Research Quality Assessment

This is a mature, well-established field with excellent educational resources at all levels. The intermediate level should assume:
- Calculus (derivatives, integrals, series)
- Linear algebra (vectors, matrices, eigenvalues)
- Basic probability and statistics
- Some programming experience (for implementations)

The field has strong theoretical foundations (Fourier analysis, linear systems theory) combined with immediate practical applications (audio, communications, biomedical). This makes it ideal for balancing abstract concepts with hands-on exploration.
