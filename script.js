const board = document.getElementById('board');
const resultText = document.getElementById('resultText');

let startNode, endNode;

function createCell(row, col) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('data-row', row);
  cell.setAttribute('data-col', col);
  cell.addEventListener('click', () => toggleWall(cell));
  return cell;
}

function createBoard() {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 20; col++) {
      const cell = createCell(row, col);
      board.appendChild(cell);
    }
  }

  
  startNode = document.querySelector('[data-row="0"][data-col="0"]');
  endNode = document.querySelector('[data-row="9"][data-col="19"]');
  startNode.classList.add('start');
  endNode.classList.add('end');
}

function toggleWall(cell) {
  cell.classList.toggle('wall');
}

function resetBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('wall', 'visited', 'path');
  });
  startNode.classList.add('start');
  endNode.classList.add('end');
  resultText.textContent = '';
}

function runBFS() {
  resetBoard();
  const path = findPath(startNode, endNode, 'bfs');
  animatePath(path);
}

function runDFS() {
  resetBoard();
  const path = findPath(startNode, endNode, 'dfs');
  animatePath(path);
}

function getValidNeighbors(node) {
  const row = parseInt(node.dataset.row);
  const col = parseInt(node.dataset.col);
  const neighbors = [];

  
  if (row > 0) {
    const upNode = document.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`);
    if (!upNode.classList.contains('wall')) {
      neighbors.push(upNode);
    }
  }

 
  if (row < 9) {
    const downNode = document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`);
    if (!downNode.classList.contains('wall')) {
      neighbors.push(downNode);
    }
  }

 
  if (col > 0) {
    const leftNode = document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`);
    if (!leftNode.classList.contains('wall')) {
      neighbors.push(leftNode);
    }
  }

 
  if (col < 19) {
    const rightNode = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);
    if (!rightNode.classList.contains('wall')) {
      neighbors.push(rightNode);
    }
  }

  return neighbors;
}

function findPath(startNode, endNode, algorithm) {
  if (algorithm === 'bfs') {
    return bfs(startNode, endNode);
  } else if (algorithm === 'dfs') {
    return dfs(startNode, endNode);
  }
}

function bfs(startNode, endNode) {
  const queue = [[startNode]];
  const visited = new Set();
  visited.add(`${startNode.dataset.row},${startNode.dataset.col}`);
  const parent = new Map();

  while (queue.length > 0) {
    const path = queue.shift();
    const currentNode = path[path.length - 1];

    if (currentNode === endNode) {
      const pathNodes = [];
      let node = endNode;
      while (node !== startNode) {
        pathNodes.unshift(node);
        node = parent.get(node);
      }
      pathNodes.unshift(startNode);
      return pathNodes;
    }

    const neighbors = getValidNeighbors(currentNode);

    for (const neighbor of neighbors) {
      const key = `${neighbor.dataset.row},${neighbor.dataset.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        const newPath = [...path, neighbor];
        queue.push(newPath);
        parent.set(neighbor, currentNode);
      }
    }
  }

  return null;
}

function dfs(startNode, endNode) {
  const stack = [[startNode]];
  const visited = new Set();
  visited.add(`${startNode.dataset.row},${startNode.dataset.col}`);
  const parent = new Map();

  while (stack.length > 0) {
    const path = stack.pop();
    const currentNode = path[path.length - 1];

    if (currentNode === endNode) {
      const pathNodes = [];
      let node = endNode;
      while (node !== startNode) {
        pathNodes.unshift(node);
        node = parent.get(node);
      }
      pathNodes.unshift(startNode);
      return pathNodes;
    }

    const neighbors = getValidNeighbors(currentNode);

    for (const neighbor of neighbors) {
      const key = `${neighbor.dataset.row},${neighbor.dataset.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        const newPath = [...path, neighbor];
        stack.push(newPath);
        parent.set(neighbor, currentNode);
      }
    }
  }

  return null;
}

function visualize() {
  if (!startNode || !endNode) {
    alert("Please set start and end nodes first!");
    return;
  }

  const path = findPath(startNode, endNode, 'bfs');

  if (!path) {
    resultText.textContent = "No path found!";
    return;
  }

  animatePath(path);
}

function animatePath(path) {
  if (!path) {
    resultText.textContent = "No path found!";
    return;
  }

  resultText.textContent = "Path found!";

  for (let i = 0; i < path.length; i++) {
    const node = path[i];

    setTimeout(() => {
      if (node !== startNode && node !== endNode) {
        node.classList.add('visited');
      }

      if (i === path.length - 1) {
        setTimeout(() => {
          for (const pathNode of path) {
            if (pathNode !== startNode && pathNode !== endNode) {
              pathNode.classList.remove('visited');
              pathNode.classList.add('path');
            }
          }
        }, 500);
      }
    }, i * 100);
  }
}
  
window.onload = createBoard;