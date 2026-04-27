export class Complex {
  r: number;
  i: number;
  constructor(r: number, i: number) {
    this.r = r;
    this.i = i;
  }

  static fromAngle(theta: number) {
    return new Complex(Math.cos(theta), Math.sin(theta));
  }

  add(other: Complex) {
    return new Complex(this.r + other.r, this.i + other.i);
  }

  sub(other: Complex) {
    return new Complex(this.r - other.r, this.i - other.i);
  }

  mul(other: Complex) {
    return new Complex(
      this.r * other.r - this.i * other.i,
      this.r * other.i + this.i * other.r
    );
  }

  div(other: Complex) {
    const denom = other.r * other.r + other.i * other.i;
    return new Complex(
      (this.r * other.r + this.i * other.i) / denom,
      (this.i * other.r - this.r * other.i) / denom
    );
  }

  conj() {
    return new Complex(this.r, -this.i);
  }

  abs() {
    return Math.sqrt(this.r * this.r + this.i * this.i);
  }

  arg() {
    return Math.atan2(this.i, this.r);
  }

  sqrt() {
    const r = this.abs();
    const theta = this.arg();
    return new Complex(
      Math.sqrt(r) * Math.cos(theta / 2),
      Math.sqrt(r) * Math.sin(theta / 2)
    );
  }

  pow(n: number) {
    const r = Math.pow(this.abs(), n);
    const theta = this.arg() * n;
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
  }

  // nth roots
  roots(n: number): Complex[] {
    const r = Math.pow(this.abs(), 1 / n);
    const theta = this.arg();
    const roots: Complex[] = [];
    for (let k = 0; k < n; k++) {
      const angle = (theta + 2 * Math.PI * k) / n;
      roots.push(new Complex(r * Math.cos(angle), r * Math.sin(angle)));
    }
    return roots;
  }
}

export function solveCubic(s1: Complex, s2: Complex, s3: Complex): Complex[] {
  // Solve z^3 - s1*z^2 + s2*z - s3 = 0
  // Depressed cubic: x^3 + px + q = 0
  // z = x + s1/3
  const a = s1.mul(new Complex(-1, 0));
  const b = s2;
  const c = s3.mul(new Complex(-1, 0));

  // p = (3*b - a^2) / 3
  const p = b.mul(new Complex(3, 0)).sub(a.mul(a)).div(new Complex(3, 0));
  // q = (2*a^3 - 9*a*b + 27*c) / 27
  const q = a.mul(a).mul(a).mul(new Complex(2, 0))
    .sub(a.mul(b).mul(new Complex(9, 0)))
    .add(c.mul(new Complex(27, 0)))
    .div(new Complex(27, 0));

  // Cardano's formula: x = u + v
  // Δ = (q/2)^2 + (p/3)^3
  const delta = q.div(new Complex(2, 0)).mul(q.div(new Complex(2, 0)))
    .add(p.div(new Complex(3, 0)).mul(p.div(new Complex(3, 0))).mul(p.div(new Complex(3, 0))));

  const sqrtDelta = delta.sqrt();
  
  const minusQOver2 = q.div(new Complex(-2, 0));
  
  const u3 = minusQOver2.add(sqrtDelta);
  const v3 = minusQOver2.sub(sqrtDelta);

  const uRoots = u3.roots(3);
  
  // Find v such that 3uv = -p
  const minusPOver3 = p.div(new Complex(-3, 0));
  
  const roots: Complex[] = uRoots.map(u => {
    let v: Complex;
    if (u.abs() < 1e-10) {
      v = v3.roots(3)[0]; // Technically v = root of v3, but if u=0, p=0?
    } else {
      v = minusPOver3.div(u);
    }
    const x = u.add(v);
    return x.sub(a.div(new Complex(3, 0)));
  });

  return roots;
}

export interface PonceletParams {
  f: Complex;
  g: Complex;
  lambda: Complex;
  A: number;
  B: number;
}

export function getTriangleVertices(params: PonceletParams): Complex[] {
  const { f, g, lambda } = params;
  const fBar = f.conj();
  const gBar = g.conj();

  // s3 = lambda
  const s3 = lambda;
  // s1 = f + g + lambda * fBar * gBar
  const s1 = f.add(g).add(lambda.mul(fBar).mul(gBar));
  // s2 = f * g + lambda * (fBar + gBar)
  const s2 = f.mul(g).add(lambda.mul(fBar.add(gBar)));

  const unitVertices = solveCubic(s1, s2, s3);
  
  // Stretch: L(z) = alpha * z + beta * zBar
  const alpha = (params.A + params.B) / 2;
  const beta = (params.A - params.B) / 2;

  return unitVertices.map(z => {
    // w = alpha * z + beta * conj(z)
    // Since z is on unit circle, conj(z) = 1/z
    return z.mul(new Complex(alpha, 0)).add(z.conj().mul(new Complex(beta, 0)));
  });
}

export function getCircumcenter(a: Complex, b: Complex, c: Complex): Complex {
  // Intersection of perpendicular bisectors
  // Using coordinates: x1, y1 etc.
  const x1 = a.r, y1 = a.i;
  const x2 = b.r, y2 = b.i;
  const x3 = c.r, y3 = c.i;

  const D = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
  const ux = ((x1 * x1 + y1 * y1) * (y2 - y3) + (x2 * x2 + y2 * y2) * (y3 - y1) + (x3 * x3 + y3 * y3) * (y1 - y2)) / D;
  const uy = ((x1 * x1 + y1 * y1) * (x3 - x2) + (x2 * x2 + y2 * y2) * (x1 - x3) + (x3 * x3 + y3 * y3) * (x2 - x1)) / D;

  return new Complex(ux, uy);
}

export function getIncenter(a: Complex, b: Complex, c: Complex): Complex {
  const dBC = b.sub(c).abs();
  const dAC = a.sub(c).abs();
  const dAB = a.sub(b).abs();
  const p = dBC + dAC + dAB;

  return new Complex(
    (dBC * a.r + dAC * b.r + dAB * c.r) / p,
    (dBC * a.i + dAC * b.i + dAB * c.i) / p
  );
}

export function getTriangleProperties(vertices: [Complex, Complex, Complex]) {
  const [a, b, c] = vertices;
  const sideA = b.sub(c).abs();
  const sideB = a.sub(c).abs();
  const sideC = a.sub(b).abs();

  const perimeter = sideA + sideB + sideC;
  const semiPerimeter = perimeter / 2;
  const area = Math.sqrt(
    Math.max(0, semiPerimeter * (semiPerimeter - sideA) * (semiPerimeter - sideB) * (semiPerimeter - sideC))
  );

  return { sideA, sideB, sideC, perimeter, area };
}

export function getTriangleCenters(params: PonceletParams) {
  const vertices = getTriangleVertices(params);
  const [w1, w2, w3] = vertices;

  // G is always the average of vertices
  const G = w1.add(w2).add(w3).div(new Complex(3, 0));

  // H = 3G - 2O
  const O = getCircumcenter(w1, w2, w3);
  const H = G.mul(new Complex(3, 0)).sub(O.mul(new Complex(2, 0)));

  // Incenter I
  const I = getIncenter(w1, w2, w3);

  return { G, H, O, I };
}

export function getCenterLocus(params: PonceletParams, type: 'G' | 'H' | 'O' | 'I') {
  const { f, g, A, B } = params;
  const points: Complex[] = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const lambda = Complex.fromAngle((i / steps) * 2 * Math.PI);
    const centers = getTriangleCenters({ f, g, lambda, A, B });
    points.push(centers[type]);
  }
  return points;
}

export function getInnerConicInfo(f: Complex, g: Complex, A: number, B: number) {
  // Major axis length 2a = |1 - conj(f)*g|
  const majorAxisLength = new Complex(1, 0).sub(f.conj().mul(g)).abs();
  const a_unit = majorAxisLength / 2;
  
  // Distance between foci 2c = |f - g|
  const distFoci = f.sub(g).abs();
  const c_unit = distFoci / 2;
  
  // semi-minor axis b^2 = a^2 - c^2
  const b_unit = Math.sqrt(Math.max(0, a_unit * a_unit - c_unit * c_unit));
  
  const center = f.add(g).div(new Complex(2, 0));
  const angle = g.sub(f).arg();

  const points: Complex[] = [];
  const alpha = (A + B) / 2;
  const beta = (A - B) / 2;

  for (let i = 0; i <= 100; i++) {
    const t = (i / 100) * 2 * Math.PI;
    // Ellipse in local coordinates
    const zLocal = new Complex(a_unit * Math.cos(t), b_unit * Math.sin(t));
    
    // Rotate and shift to unit-circle global coordinates
    const zRot = new Complex(
      zLocal.r * Math.cos(angle) - zLocal.i * Math.sin(angle),
      zLocal.r * Math.sin(angle) + zLocal.i * Math.cos(angle)
    );
    const zUnit = zRot.add(center);
    
    // Apply stretch L(z) = alpha * z + beta * conj(z)
    const w = zUnit.mul(new Complex(alpha, 0)).add(zUnit.conj().mul(new Complex(beta, 0)));
    points.push(w);
  }
  
  return points;
}
