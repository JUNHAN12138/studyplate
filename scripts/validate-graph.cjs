// Validate graph DFS/BFS
function buildAdj(edges) {
  const adj = {};
  for (const [u, v] of edges) {
    if (!adj[u]) adj[u] = [];
    if (!adj[v]) adj[v] = [];
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}

function dfs(adj, start) {
  const visited = [], stack = [start], seen = new Set([start]);
  while (stack.length) {
    const v = stack.pop();
    visited.push(v);
    for (const u of (adj[v] || []).reverse()) {
      if (!seen.has(u)) { seen.add(u); stack.push(u); }
    }
  }
  return visited;
}

function bfs(adj, start) {
  const visited = [], queue = [start], seen = new Set([start]);
  while (queue.length) {
    const v = queue.shift();
    visited.push(v);
    for (const u of adj[v] || []) {
      if (!seen.has(u)) { seen.add(u); queue.push(u); }
    }
  }
  return visited;
}

const edges = [[0,1],[0,2],[0,3],[1,4],[2,3],[3,5],[4,5]];
const adj = buildAdj(edges);
let passed = 0, failed = 0;

function check(name, result, valid) {
  // Check all nodes visited
  const allNodes = new Set(result);
  if (allNodes.size === 6 && result[0] === 0) { console.log(`✅ ${name}: [${result}]`); passed++; }
  else { console.error(`❌ ${name}: got [${result}], not valid traversal`); failed++; }
}

check('DFS', dfs(adj, 0), null);
check('BFS', bfs(adj, 0), null);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
