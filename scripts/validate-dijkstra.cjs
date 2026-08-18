// Validate Dijkstra shortest path
function dijkstra(nodes, edges, start) {
  const dist = {};
  for (const n of nodes) dist[n] = n === start ? 0 : Infinity;
  const unvisited = new Set(nodes);

  while (unvisited.size > 0) {
    let u = null, minD = Infinity;
    for (const id of unvisited) {
      if (dist[id] < minD) { minD = dist[id]; u = id; }
    }
    if (u === null || dist[u] === Infinity) break;
    unvisited.delete(u);

    for (const [from, to, w] of edges) {
      let neighbor = null;
      if (from === u) neighbor = to;
      else if (to === u) neighbor = from;
      else continue;
      if (!unvisited.has(neighbor)) continue;
      const alt = dist[u] + w;
      if (alt < dist[neighbor]) dist[neighbor] = alt;
    }
  }
  return dist;
}

const nodes = [0, 1, 2, 3, 4, 5];
const edges = [
  [0, 1, 2], [0, 2, 4], [1, 3, 1], [1, 2, 1],
  [2, 4, 3], [3, 5, 5], [4, 5, 1], [3, 4, 2],
];

const dist = dijkstra(nodes, edges, 0);
let passed = 0, failed = 0;

function check(name, result, expected) {
  if (result === expected) { console.log(`✅ ${name}: ${result}`); passed++; }
  else { console.error(`❌ ${name}: got ${result}, expected ${expected}`); failed++; }
}

check('dist[0]', dist[0], 0);
check('dist[1]', dist[1], 2);
check('dist[2]', dist[2], 3);
check('dist[3]', dist[3], 3);
check('dist[4]', dist[4], 5);
check('dist[5]', dist[5], 6);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
