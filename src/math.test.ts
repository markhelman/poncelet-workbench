import { describe, it, expect } from 'vitest';
import { Complex, getTriangleProperties } from './math';

describe('getTriangleProperties', () => {
  it('calculates properties correctly for a 3-4-5 triangle', () => {
    const vertices = [
      new Complex(0, 0),
      new Complex(4, 0),
      new Complex(0, 3)
    ];
    
    const { sideA, sideB, sideC, perimeter, area } = getTriangleProperties(vertices);
    
    expect(sideA).toBeCloseTo(5); // distance between (4,0) and (0,3)
    expect(sideB).toBeCloseTo(3); // distance between (0,0) and (0,3)
    expect(sideC).toBeCloseTo(4); // distance between (0,0) and (4,0)
    expect(perimeter).toBeCloseTo(12);
    expect(area).toBeCloseTo(6);
  });
});
