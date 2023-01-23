// return the vertices and indices of a cube
export function createCube() {
  return {
    vertices: [
      -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
      -1, 1, 1,
    ],
    indices: [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 0, 4, 7, 0, 7, 3, 1, 5, 6, 1, 6, 2, 4,
      5, 1, 4, 1, 0, 3, 2, 6, 3, 6, 7,
    ],
  };
}
