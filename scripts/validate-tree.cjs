// Validate tree traversals
function buildTree() {
  return { val: 8, left: { val: 4, left: { val: 2 }, right: { val: 6 } }, right: { val: 12, left: { val: 10 }, right: { val: 14 } } };
}

function preorder(node, result = []) {
  if (!node) return result;
  result.push(node.val);
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}

function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.val);
  inorder(node.right, result);
  return result;
}

function postorder(node, result = []) {
  if (!node) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.val);
  return result;
}

function levelorder(root) {
  const result = [], queue = [root];
  while (queue.length) { const n = queue.shift(); result.push(n.val); if (n.left) queue.push(n.left); if (n.right) queue.push(n.right); }
  return result;
}

const tree = buildTree();
let passed = 0, failed = 0;

function check(name, result, expected) {
  const r = result.join(','), e = expected.join(',');
  if (r === e) { console.log(`✅ ${name}: [${r}]`); passed++; }
  else { console.error(`❌ ${name}: got [${r}], expected [${e}]`); failed++; }
}

check('Preorder', preorder(tree), [8, 4, 2, 6, 12, 10, 14]);
check('Inorder', inorder(tree), [2, 4, 6, 8, 10, 12, 14]);
check('Postorder', postorder(tree), [2, 6, 4, 10, 14, 12, 8]);
check('Levelorder', levelorder(tree), [8, 4, 12, 2, 6, 10, 14]);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
