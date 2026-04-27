import { useState } from 'react';

interface TheorySlideshowProps {
  onStateChange: (state: any) => void;
}

const slides = [
  {
    id: 'normalization',
    title: '1. Normalization',
    content: 'Map your geometric configuration to the complex plane C. Normalize the outer conic so that it is the unit circle T: |z| = 1.'
  },
  {
    id: 'inner-conic',
    title: '2. Inner Conic (Caustic)',
    content: 'Identify the foci f and g of the inner conic. The Poncelet condition for n=3 is defined by the semi-major axis 2a = |1 - f*conj(g)|, focal distance c = |f - g|/2, and semi-minor axis b = sqrt(a^2 - c^2).'
  },
  {
    id: 'coefficients',
    title: '3. Coefficients',
    content: 'The vertices are roots of P(z) = z^3 - s1 z^2 + s2 z - s3 = 0. We define s3 = lambda, s1 = f + g + lambda*conj(f)*conj(g), and s2 = fg + lambda(conj(f) + conj(g)).'
  },
  {
    id: 'triangle-centers',
    title: '4. Triangle Centers',
    content: 'Triangle centers can be expressed as a rational function of lambda. For example, the Barycenter G = s1/3 and Orthocenter H = s1.'
  },
  {
    id: 'stretch',
    title: '5. Stretch Transformation',
    content: 'To generalize to a generic ellipse with semi-axes A and B, apply the transformation w = L(z) = alpha*z + beta/z, where alpha = (A+B)/2 and beta = (A-B)/2.'
  }
];

export default function TheorySlideshow({ onStateChange }: TheorySlideshowProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    const nextIndex = Math.min(currentSlideIndex + 1, slides.length - 1);
    setCurrentSlideIndex(nextIndex);
    onStateChange({ slideId: slides[nextIndex].id });
  };

  const handlePrev = () => {
    const prevIndex = Math.max(currentSlideIndex - 1, 0);
    setCurrentSlideIndex(prevIndex);
    onStateChange({ slideId: slides[prevIndex].id });
  };

  return (
    <div className="theory-slideshow">
      <h2>{slides[currentSlideIndex].title}</h2>
      <p>{slides[currentSlideIndex].content}</p>
      <div className="controls">
        <button onClick={handlePrev} disabled={currentSlideIndex === 0}>Prev</button>
        <button onClick={handleNext} disabled={currentSlideIndex === slides.length - 1}>Next</button>
      </div>
    </div>
  );
}
