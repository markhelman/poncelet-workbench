export interface Milestone {
  id: string;
  title: string;
  description: string;
  params: {
    fx: number;
    fy: number;
    gx: number;
    gy: number;
  };
}

export const MILESTONES: Milestone[] = [
  {
    id: 'equilateral',
    title: 'Equilateral Case',
    description: 'When both foci are at the origin (f=g=0), the triangle is always equilateral.',
    params: { fx: 0, fy: 0, gx: 0, gy: 0 }
  },
  {
    id: 'concentric',
    title: 'Concentric Case',
    description: 'Set f = -g. The barycenter G remains at the origin throughout the rotation.',
    params: { fx: 0.3, fy: 0, gx: -0.3, gy: 0 }
  },
  {
    id: 'bicentric',
    title: 'Bicentric Case',
    description: 'When f = g, the caustic is a circle. The incenter locus is also a circle.',
    params: { fx: 0.3, fy: 0, gx: 0.3, gy: 0 }
  },
  {
    id: 'confocal-horizontal',
    title: 'Confocal Horizontal',
    description: 'Foci spread along the x-axis. Observe the elliptical loci of G and H.',
    params: { fx: 0.5, fy: 0, gx: 0, gy: 0 }
  },
  {
    id: 'vertical-alignment',
    title: 'Vertical Alignment',
    description: 'Foci aligned vertically. The loci rotate by 90 degrees.',
    params: { fx: 0, fy: 0.4, gx: 0, gy: -0.2 }
  }
];
