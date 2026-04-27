import { describe, it, expect } from 'vitest';
import { MILESTONES } from './milestones';

describe('MILESTONES', () => {
  it('should have the required milestones', () => {
    const ids = MILESTONES.map(m => m.id);
    expect(ids).toContain('equilateral');
    expect(ids).toContain('concentric');
    expect(ids).toContain('bicentric');
  });

  it('each milestone should have valid params', () => {
    MILESTONES.forEach(m => {
      expect(typeof m.params.fx).toBe('number');
      expect(typeof m.params.fy).toBe('number');
      expect(typeof m.params.gx).toBe('number');
      expect(typeof m.params.gy).toBe('number');
    });
  });

  it('concentric case should have f = -g', () => {
    const concentric = MILESTONES.find(m => m.id === 'concentric');
    expect(concentric).toBeDefined();
    if (concentric) {
      expect(concentric.params.fx).toBeCloseTo(-concentric.params.gx);
      expect(concentric.params.fy).toBeCloseTo(-concentric.params.gy);
    }
  });

  it('bicentric case should have f = g', () => {
    const bicentric = MILESTONES.find(m => m.id === 'bicentric');
    expect(bicentric).toBeDefined();
    if (bicentric) {
      expect(bicentric.params.fx).toBeCloseTo(bicentric.params.gx);
      expect(bicentric.params.fy).toBeCloseTo(bicentric.params.gy);
    }
  });
});
