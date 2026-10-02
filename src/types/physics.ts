// Physics & Mathematical Types for Finite-Dimensional Modular Theory V6.5

export interface Body3D {
  id: number;
  name: string;
  mass: number; // M_sun or normalized
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  radius: number;
  trail: [number, number, number][];
}

export interface ContactState {
  t: number;
  tau: number;
  bodies: Body3D[];
  S_entropy: number; // Macroscopic action entropy S
  M_total: number;
  Hawking_power: number; // P_Hawking
  Gamma_diss: number; // P_Hawking / (M c^2)
  E_shadow: number; // Shadow Hamiltonian energy
  E_0: number; // Initial energy
  dE_rel: number; // |Delta E / E_0|
  conformal_scale: number; // e^{-\int \Gamma d\tau}
  flux_balance_error: number;
  stepCount: number;
}

export interface PadePole {
  m: number;
  lambda_0: number;
  weight: number;
  lambda_t?: number;
  decayRate?: number; // gamma_m = lambda_m / tau_0
  stateY?: number;
}

export type AutomatonState = 'S0' | 'S1' | 'S2' | 'S3' | 'S4';

export interface AutomatonStatus {
  currentState: AutomatonState;
  stateName: string;
  description: string;
  H_ratio: number; // Hysteresis ratio [2.5, 8.0)
  r_current: number; // Radius relative to M
  r_isco: number; // ISCO radius = 6 M
  islandFormed: boolean;
  chatterCount: number;
  transitionHistory: {
    from: AutomatonState;
    to: AutomatonState;
    reason: string;
    time: number;
  }[];
  pageCurvePoint: {
    t: number;
    S_hawking: number;
    S_island: number;
    S_actual: number;
  };
}

export interface WaveformPoint {
  t: number;
  h_plus: number;
  h_cross: number;
  h_memory: number; // Christodoulou permanent offset
  q_soft: number; // BMS soft hair zero-mode shift
  phase: number;
}

export interface PetzTestResult {
  fidelity: number;
  dpiLeft: number; // D(rho || sigma) - D(E(rho) || E(sigma))
  dpiRightLog: number; // -ln F
  dpiRightLinear: number; // 1 - F
  satisfied: boolean;
  channelName: string;
  pNoise: number;
}

export interface HolonomyPoint {
  delta: number; // Loop holonomy Omega_ijk
  Kc_flat: number; // Standard Kuramoto critical gain
  Kc_curved: number; // K_c^g = K_c / (cos(delta) - 2*gamma_0*sin(delta))
  order_r: number; // Order parameter |r|
  isSingular: boolean;
}

export interface MPSRegressionResult {
  N_qubits: number;
  chi_bond: number;
  spectrum: { k: number; xi: number; fitted: number }[];
  c0: number;
  c1: number;
  R2: number;
  conformalAgreement: boolean;
}

export interface SSSMatrixPoint {
  energy: number;
  rho0: number;
  tau: number;
  SFF: number; // Spectral Form Factor K(tau)
  linearRamp: number;
  plateau: number;
}

export interface TestCase {
  id: number;
  section: string;
  name: string;
  theoremRef: string;
  description: string;
  condition: string;
  theoreticalLimit: number | string;
  measuredValue: number | string;
  margin: string;
  passed: boolean;
  category: 'Contact Geometry' | 'Memory & BMS' | 'Padé-Laplace' | 'Petz & DPI' | 'Holonomy & Kuramoto' | 'EOB Automata' | 'MPS & SSS Matrix' | 'Thermal Stationarity';
}

export interface BenchmarkScorecardRow {
  metric: string;
  v5: string;
  v6: string;
  v65: string;
  status: 'PASSED' | 'FAILED';
  target: string;
}
