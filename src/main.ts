import cubeVertexShader from "./cubeVert";
import cubeFragmentShader from "./cubeFrag";
import { createCube } from "./mesh";
import { mat4 } from "gl-matrix";
import { createProgram } from "./program";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl")!;

const program = createProgram(cubeVertexShader, cubeFragmentShader);

const cube = createCube();
const colors = [
  1.0,
  0.0,
  0.0,
  1.0, // red
  0.0,
  1.0,
  0.0,
  1.0, // green
  0.0,
  0.0,
  1.0,
  1.0, // blue
  1.0,
  1.0,
  0.0,
  1.0, // yellow
  1.0,
  1.0,
  1.0,
  1.0, // white
  0.0,
  1.0,
  1.0,
  1.0, // magenta
  1.0,
  0.0,
  1.0,
  1.0, // ??
  0.5,
  0.5,
  0.5,
  1.0, // gray
];

program(gl, {
  attributes: {
    a_position: new Float32Array(cube.vertices),
    a_color: new Float32Array(colors),
  },
});

const indexBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array(cube.indices),
  gl.STATIC_DRAW
);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

const perspectiveMatrix = mat4.create();
mat4.perspective(
  perspectiveMatrix,
  45,
  canvas.width / canvas.height,
  0.1,
  100.0
);

const cameraMatrix = mat4.create();
mat4.lookAt(cameraMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);

const inverseCameraMatrix = mat4.create();
mat4.invert(inverseCameraMatrix, cameraMatrix);

const world = mat4.create();
mat4.multiply(world, perspectiveMatrix, inverseCameraMatrix);

let angle = 0;
const rot = mat4.create();

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 1);

gl.enable(gl.DEPTH_TEST);

const start = Date.now();

function render() {
  mat4.identity(rot);
  mat4.rotate(rot, rot, angle, [1, 0.5, 0.001]);

  const transform = mat4.create();
  mat4.multiply(transform, world, rot);

  program(gl, {
    uniforms: {
      u_time: (Date.now() - start) / 1000,
      u_mvpMatrix: transform,
    },
  });

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0);
}

function frame() {
  angle += 0.01;

  render();
  requestAnimationFrame(frame);
}

frame();
