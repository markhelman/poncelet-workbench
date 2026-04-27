import { describe, it, expect } from 'vitest';
import { Complex, getTriangleProperties } from './math';

describe('getTriangleProperties', () => {
  it('calculates properties for a 3-4-5 triangle', () => {
    const a = new Complex(0, 0);
    const b = new Complex(4, 0);
    const c = new Complex(0, 3);
    
    const props = getTriangleProperties([a, b, c]);
    
    expect(props.sideA).toBeCloseTo(5);
    expect(props.sideB).toBeCloseTo(3);
    expect(props.sideC).toBeCloseTo(4);
    expect(props.perimeter).toBeCloseTo(12);
    expect(props.area).toBeCloseTo(6);
  });

  it('handles degenerate triangles (collinear points)', () => {
    const a = new Complex(0, 0);
    const b = new Complex(5, 0);
    const c = new Complex(10, 0);
    
    const props = getTriangleProperties([a, b, c]);
    
    expect(props.area).toBeCloseTo(0);
    expect(props.perimeter).toBeCloseTo(20);
  });
});
