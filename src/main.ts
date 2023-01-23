import cubeVertexShader from "./cube.vert";
import cubeFragmentShader from "./cube.frag";
import { createCube } from "./mesh";
import { mat4 } from "gl-matrix";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl")!;

// create our program
const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
gl.shaderSource(vertexShader, cubeVertexShader);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(
    `Error creating vertex shader - ${gl.getShaderInfoLog(vertexShader)}`
  );
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
gl.shaderSource(fragmentShader, cubeFragmentShader);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(
      `Error creating vertex shader - ${gl.getShaderInfoLog(fragmentShader)}`
  );
}

const program = gl.createProgram()!;
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const cube = createCube();
const colors = [
    1.0, 0.0, 0.0, 1.0, // red
    0.0, 1.0, 0.0, 1.0, // green
    0.0, 0.0, 1.0, 1.0, // blue
  1.0, 1.0, 0.0, 1.0, // yellow
  1.0, 1.0, 1.0, 1.0, // white
  0.0, 1.0, 1.0, 1.0, // magenta
  1.0, 0.0, 1.0, 1.0, // ??
  0.5, 0.5, 0.5, 1.0, // gray
];

gl.useProgram(program);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
const modelViewMatrixUniformLocation = gl.getUniformLocation(program, 'u_mvpMatrix');

const positionBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const colorBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const indexBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array(cube.indices),
  gl.STATIC_DRAW
);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colorAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const perspectiveMatrix = mat4.create();
mat4.perspective(perspectiveMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

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

function render() {
  mat4.identity(rot);
  mat4.rotate(rot, rot, angle, [1, 0.5, 0.001]);
  
    const transform = mat4.create();
    mat4.multiply(transform, world, rot);

  gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, transform);
  
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

