import { createInterface } from "readline";

// stdio utils
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = async (question: string): Promise<number> => {
  return new Promise((resolve) => {
    rl.question(question, (a) => resolve(parseInt(a)));
  });
};

// Type of both methods
type RunMethod = (x: number[], a: number[], count: number) => number;
type TestTuple = [number[], number[], number];

const runSimple: RunMethod = (x_, a_, count) => {
  let a, b, c, d, l, m, n, k, p, q, r, s;

  // ax+by+cz+d=0
  // lx+my+nz+k=0
  // px+qy+rz+s=0

  // l1 + l2 + l3 = a0
  (a = 1), (b = 1), (c = 1);
  d = -a_[0];

  // l1 * x[0] + l2 * x[1] + l2 * x[2] = a1
  (l = x_[0]), (m = x_[1]), (n = x_[2]);
  k = -a_[1];

  // l1 * x[0] ^ 2 + l2 * x[1] ^ 2 + l2 * x[2] ^ 2 = a2
  (p = x_[0] * x_[0]), (q = x_[1] * x_[1]), (r = x_[2] * x_[2]);
  s = -a_[2];

  const D = a * m * r + b * p * n + c * l * q - (a * n * q + b * l * r + c * m * p);
  const x = (b * r * k + c * m * s + d * n * q - (b * n * s + c * q * k + d * m * r)) / D;
  const y = (a * n * s + c * p * k + d * l * r - (a * r * k + c * l * s + d * n * p)) / D;
  const z = (a * q * k + b * l * s + d * m * p - (a * m * s + b * p * k + d * l * q)) / D;

  return x * Math.pow(x_[0], count) + y * Math.pow(x_[1], count) + z * Math.pow(x_[2], count);
};

const runRecursive: RunMethod = (x, a, n) => {
  const rek = (a: number[], i: number): number => {
    if (i < 3) {
      return a[i];
    }

    if (i == n + 1) {
      return a[2];
    }

    const k1 = x.reduce((p, c) => p + c, 0);
    const k2 = -(x[0] * x[1] + x[1] * x[2] + x[2] * x[0]);
    const k3 = x.reduce((p, c) => p * c, 1);

    const data = [...a.slice(1, 3), k1 * a[2] + k2 * a[1] + k3 * a[0]];

    return rek(data, i + 1);
  };

  return rek(a, 3);
};

// Helper for simpler output stuff
const getName = (i: number, j: number): string => {
  if (i === 0) {
    return `Unesite prvo rjesenje x_${j} karakteristicne jednadzbe: `;
  }

  return `Unesite vrijednost ${["nultog", "prvog", "drugog"][j]} clana niza a_${j}: `;
};

const TESTS: TestTuple[] = [
  [[2, -3, 4], [3, 3, 29], 7],
  [[-4, 5, 3], [6, -2, 152], 8],
  [[1, 2, 3], [1, 2, 4], 8],
  [[3, 4, -4], [-4, 3, 8], 9],
  [[-1, 1, 4], [2, 3, 9], 11],
  [[3, 2, 1], [-5, 7, 6], 25],
  [[1, 2, 3], [3, 6, 14], 5],
  [[1, 4, -1], [-1, 6, -2], 23],
];

(async () => {
  if (process.env.NODE_ENV !== "test") {
    const a: TestTuple = [[], [], 0];

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        (a[i] as number[]).push(await ask(getName(i, j)));
      }
    }

    a[2] = await ask("Unesite redni broj n trazenog clana niza: ");

    console.log(`Vrijednost n-tog clana niza pomocu formule: ${runSimple(...a)}`);
    console.log(`Vrijednost n-tog clana niza iz rekurzije: ${runRecursive(...a)}`);
    return;
  }

  console.log(
    `Tests: ${TESTS.reduce((val, t, index): number => {
      if (runSimple(...t) !== runRecursive(...t)) {
        console.log(`Test #${index} failed`);
        return val;
      }

      return val + 1;
    }, 0)} / ${TESTS.length}`
  );
})()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
