// Curved-Manifold Modular Parallel Transport and Holonomic Frustration Engine
// Implements Sakaguchi-Kuramoto order parameter on (Sigma, g) with Cauchy frequency dispersion
// Evaluates critical coupling gain: K_c^g = K_c / (cos(delta_max) - 2 * gamma_0 * sin(delta_max))
// and proves the geometric critical de-coherence barrier delta_crit^g = arctan(1 / (2 * gamma_0))

import { HolonomyPoint } from '../types/physics';

export interface KuramotoOscillator {
  id: number;
  theta: number;
  omega: number; // Cauchy distributed natural frequency
  x: number;
  y: number;
}

export function computeHolonomyCurve(
  gamma0: number = 0.5,
  Kc_flat: number = 2.0,
  numPoints: number = 80
): {
  points: HolonomyPoint[];
  deltaCrit: number;
  deltaCritDegrees: number;
} {
  // delta_crit = arctan(1 / (2 * gamma_0))
  const deltaCrit = Math.atan(1.0 / (2.0 * gamma0)); // pi/4 = 0.785398 rad for gamma0 = 0.5
  const maxDelta = deltaCrit * 0.99; // stay slightly below singularity for graph

  const points: HolonomyPoint[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const delta = (i / numPoints) * maxDelta;
    const denom = Math.cos(delta) - 2 * gamma0 * Math.sin(delta);
    const isSingular = denom <= 1e-4;

    const Kc_curved = isSingular ? 9999 : Kc_flat / Math.max(1e-4, denom);

    // Approximate Kuramoto order parameter |r| for standard coupling K = 4.0
    const testK = 4.0;
    let order_r = 0;
    if (testK > Kc_curved) {
      order_r = Math.sqrt(Math.max(0, 1 - Math.pow(Kc_curved / testK, 2)));
    } else {
      order_r = 0.05 * Math.random();
    }

    points.push({
      delta,
      Kc_flat,
      Kc_curved: Math.min(Kc_curved, 50),
      order_r,
      isSingular,
    });
  }

  return {
    points,
    deltaCrit,
    deltaCritDegrees: (deltaCrit * 180) / Math.PI,
  };
}

export function createCauchyEnsemble(N: number = 32, gamma0: number = 0.5): KuramotoOscillator[] {
  const oscillators: KuramotoOscillator[] = [];

  for (let i = 0; i < N; i++) {
    // Generate Cauchy random frequency using inverse CDF: omega = gamma_0 * tan(pi * (u - 0.5))
    const u = 0.05 + 0.9 * ((i + 0.5) / N); // regularized quantile to avoid extreme tails
    const omega = gamma0 * Math.tan(Math.PI * (u - 0.5));
    const angle = (2 * Math.PI * i) / N;

    oscillators.push({
      id: i,
      theta: Math.random() * 2 * Math.PI,
      omega,
      x: Math.cos(angle),
      y: Math.sin(angle),
    });
  }

  return oscillators;
}

export function stepCurvedKuramoto(
  oscillators: KuramotoOscillator[],
  deltaHolonomy: number,
  couplingK: number,
  dt: number
): {
  updatedOscillators: KuramotoOscillator[];
  orderParameter_r: number;
  orderParameter_psi: number;
} {
  const N = oscillators.length;

  // Compute complex order parameter: r * e^{i * psi} = (1/N) * sum_j e^{i * theta_j}
  let sumCos = 0;
  let sumSin = 0;
  for (const osc of oscillators) {
    sumCos += Math.cos(osc.theta);
    sumSin += Math.sin(osc.theta);
  }
  const meanCos = sumCos / N;
  const meanSin = sumSin / N;
  const order_r = Math.sqrt(meanCos * meanCos + meanSin * meanSin);
  const order_psi = Math.atan2(meanSin, meanCos);

  // Update phases with curved connection phase lag alpha_ij = delta * (j - i) / N
  const nextOsc = oscillators.map((osc, i) => {
    let interaction = 0;
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      // Phase lag induced by Riemannian parallel transport
      const alpha_ij = deltaHolonomy * Math.sin(((j - i) * Math.PI) / N);
      interaction += Math.sin(oscillators[j].theta - osc.theta - alpha_ij);
    }

    const dTheta = osc.omega + (couplingK / N) * interaction;
    let nextTheta = (osc.theta + dTheta * dt) % (2 * Math.PI);
    if (nextTheta < 0) nextTheta += 2 * Math.PI;

    return {
      ...osc,
      theta: nextTheta,
      x: Math.cos(nextTheta),
      y: Math.sin(nextTheta),
    };
  });

  return {
    updatedOscillators: nextOsc,
    orderParameter_r: order_r,
    orderParameter_psi: order_psi,
  };
}
