# Signal Processing — Concept Map

## Core Concepts (in learning order)

1. **Signals** — functions of time (or space) carrying information; can be continuous or discrete
2. **Systems** — operators that transform input signals to output signals
3. **Linearity** — property where system output to sum equals sum of outputs. Depends on: signals
4. **Time-invariance** — property where time-shifting input just time-shifts output. Depends on: signals, systems
5. **LTI Systems** — linear time-invariant systems, the foundation of signal processing. Depends on: linearity, time-invariance
6. **Impulse Response** — system's output to an impulse input; completely characterizes an LTI system. Depends on: LTI systems
7. **Fourier Series** — representation of periodic signals as sums of sinusoids. Depends on: signals
8. **Fourier Transform** — extension to non-periodic signals; maps time to frequency domain. Depends on: Fourier series
9. **Frequency Domain** — representing signals by their frequency content rather than time evolution. Depends on: Fourier transform
10. **DFT (Discrete Fourier Transform)** — discrete version for digital computation. Depends on: Fourier transform
11. **FFT (Fast Fourier Transform)** — efficient algorithm for computing DFT. Depends on: DFT
12. **Spectral Analysis** — examining frequency content of signals. Depends on: frequency domain, FFT
13. **Sampling** — converting continuous signals to discrete by taking values at intervals. Depends on: signals
14. **Nyquist Rate** — minimum sampling rate to avoid information loss. Depends on: sampling, frequency domain
15. **Aliasing** — frequency folding when sampling below Nyquist rate. Depends on: sampling, Nyquist rate
16. **Reconstruction** — recovering continuous signal from samples. Depends on: sampling
17. **Convolution** — operation combining two signals; models LTI system response. Depends on: impulse response, LTI systems
18. **Convolution Theorem** — convolution in time equals multiplication in frequency. Depends on: convolution, Fourier transform
19. **Correlation** — measure of signal similarity; differs from convolution by time reversal. Depends on: convolution
20. **Filters** — systems designed to pass certain frequencies and block others. Depends on: LTI systems, frequency domain
21. **FIR Filters** — finite impulse response filters; always stable. Depends on: filters, impulse response
22. **IIR Filters** — infinite impulse response filters; efficient but can be unstable. Depends on: filters, impulse response
23. **Frequency Response** — filter behavior across all frequencies. Depends on: filters, Fourier transform
24. **Filter Design** — choosing parameters to meet specifications. Depends on: FIR filters, IIR filters, frequency response
25. **Laplace Transform** — generalization of Fourier to complex frequency; handles transients. Depends on: Fourier transform
26. **Z-Transform** — discrete-time analog of Laplace transform. Depends on: Laplace transform, discrete signals
27. **Poles and Zeros** — characteristic frequencies of a transfer function. Depends on: Z-transform, Laplace transform
28. **Stability** — whether system output remains bounded for bounded input. Depends on: poles and zeros
29. **Time-Frequency Analysis** — representing both when and what frequencies occur. Depends on: Fourier transform limitations
30. **STFT (Short-Time Fourier Transform)** — applying Fourier to windowed segments. Depends on: time-frequency analysis
31. **Spectrograms** — visual representation of STFT showing time-frequency evolution. Depends on: STFT
32. **Wavelet Transform** — adaptive time-frequency representation with variable resolution. Depends on: time-frequency analysis

## Dependencies

### Foundational Dependencies
- **LTI Systems** require understanding both linearity and time-invariance because these two properties together enable powerful mathematical analysis techniques
- **Impulse Response** builds on LTI systems because only LTI systems can be fully characterized by their response to a single input
- **Convolution** depends on impulse response because it models how an LTI system's impulse response combines with any input to produce the output

### Fourier Analysis Chain
- **Fourier Transform** extends Fourier series because it generalizes the periodic case to arbitrary signals
- **DFT** depends on Fourier transform because it discretizes both time and frequency for computer implementation
- **FFT** depends on DFT because it's an algorithmic optimization, not a different transform
- **Spectral Analysis** requires FFT in practice because direct DFT computation is too slow for real applications

### Sampling Chain
- **Nyquist Rate** depends on frequency domain understanding because it's fundamentally about preserving frequency content
- **Aliasing** builds on Nyquist rate because it's what happens when you violate the Nyquist criterion
- **Reconstruction** depends on sampling theory because you need to understand what information is preserved in samples

### Transform Theory Chain
- **Laplace Transform** builds on Fourier transform by extending to complex frequencies, handling unstable and transient behaviors
- **Z-Transform** is the discrete-time analog of Laplace transform
- **Poles and Zeros** emerge from these transforms as the characteristic frequencies where the transfer function becomes infinite or zero
- **Stability** depends on pole locations because poles inside the region of convergence ensure bounded outputs

### Time-Frequency Chain
- **STFT** depends on recognizing Fourier's limitations for time-varying signals
- **Spectrograms** are just visual representations of STFT magnitude
- **Wavelet Transform** addresses STFT's fixed resolution limitation with adaptive windowing

### Critical Bottlenecks

These concepts are prerequisites for many later topics and deserve extra attention:

1. **Linearity and Time-Invariance** — without these, almost no analytical tools work
2. **Fourier Transform** — the central pillar; time-frequency duality underlies everything
3. **Convolution** — connects time-domain analysis to system behavior
4. **Convolution Theorem** — the bridge between time and frequency perspectives
5. **Sampling Theorem** — fundamental to all digital signal processing

## Prerequisite Topics

- **Calculus** — needed for Fourier integrals, convolution integrals, transform definitions
- **Linear Algebra** — needed for understanding vector spaces of signals, orthogonality, basis functions
- **Complex Numbers** — needed for Fourier analysis, complex exponentials, transfer functions
- **Probability** — needed for random signals, noise analysis, correlation
- **Programming** — needed for implementing FFT, filters, and analyzing real data

## Common Misconceptions

### About Frequency Domain
Students often think:
- The Fourier transform "creates" frequencies that weren't in the signal → FALSE: it reveals existing frequency content
- Higher sampling rate always means better analysis → FALSE: only up to Nyquist; beyond that adds no information
- Phase is less important than magnitude → FALSE: both are essential; discarding phase destroys information

### About Sampling
- Sampling "loses" information → NUANCED: only if you violate Nyquist; otherwise perfect reconstruction is possible
- Digital is always inferior to analog → FALSE: digital can be mathematically equivalent and practically superior

### About Convolution
- Convolution is just multiplication → FALSE: it's a weighted sliding integral (though it equals multiplication in frequency domain)
- Correlation and convolution are the same → FALSE: correlation doesn't reverse one signal

### About Filters
- FIR is always better than IIR → FALSE: each has tradeoffs (stability vs. efficiency)
- A filter removes frequencies → NUANCED: it attenuates them; perfect removal is impossible
