import { promises as fs } from 'fs';
import path from 'path';

function factorOverflow(n: number): [number, number, number, number][] {
  let result = new Set<[number, number, number, number]>();

  for (let i = 0; i < Math.min(6, Math.floor(n / 3) + 2); i++) {
    if (i * 3 >= n && i > 0) {
      let val = i * 3;

      result.add([i, 0, 0, val]);

      continue;
    }

    for (let j = 0; j < Math.min(6, Math.floor(n / 5) + 2); j++) {
      let val = i * 3 + j * 5;

      if (val >= n && j > 0) {
        result.add([i, j, 0, val]);
      }

      for (let k = 0; k < Math.min(5 - j + 1, Math.floor(n / 10) + 2); k++) {
        if (j + k > 5) continue;

        let val = i * 3 + j * 5 + k * 10;

        if (val >= n) {
          result.add([i, j, k, val]);
        }
      }
    }
  }

  return Array.from(result);
}

function generateModCombos(): { [key: number]: [number, number, number, number][] } {
  const results: { [key: number]: [number, number, number, number][] } = {};

  let MAX = 10 * 5 + 5 * 3;

  for (let i = 1; i <= MAX; i++) {
    const fact = factorOverflow(i).sort((a, b) => {
      // sort by min values
      return a[3] - b[3] || a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
    });

    // remove entry equal or higher than previous entry
    const filteredFact = fact.filter(
      (fa, i) => fact.findIndex((fb) => fb[0] <= fa[0] && fb[1] <= fa[1] && fb[2] <= fa[2]) === i
    );

    results[i] = filteredFact;
  }

  return results;
}

const combos = generateModCombos();

const fileData = `export const generatedModCombos: { [key: number]: [number, number, number, number][] } = ${JSON.stringify(
  combos
)}`;

fs.writeFile(
  path.resolve(path.join(...['.', 'src', 'generated', 'generated-mod-combos.ts'])),
  fileData
);
