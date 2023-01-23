import { FragmentShader, ShaderType, ShaderValue, VertexShader } from "./types";
import { mat4 } from "gl-matrix";

export function createProgram<
  U1 extends { [key: string]: ShaderType },
  A extends { [key: string]: ShaderType },
  U2 extends { [key: string]: ShaderType }
>(vertex: VertexShader<U1, A>, fragment: FragmentShader<U2>) {
  let program: WebGLProgram | null = null;

  function getProgram(gl: WebGLRenderingContext) {
    if (!program) {
      const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
      gl.shaderSource(vertexShader, vertex.source);
      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error(
          `Error creating vertex shader - ${gl.getShaderInfoLog(vertexShader)}`
        );
      }

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fragmentShader, fragment.source);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error(
          `Error creating vertex shader - ${gl.getShaderInfoLog(
            fragmentShader
          )}`
        );
      }

      program = gl.createProgram()!;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
    }

    return program;
  }

  return function (
    gl: WebGLRenderingContext,
    options: {
      attributes?: {
        [key in keyof A]?: ShaderValue<A[key]>;
      };
      uniforms?: {
        [key in keyof (U1 | U2)]?: ShaderValue<(U1 | U2)[key]>;
      };
    }
  ) {
    const p = getProgram(gl)!;

    gl.useProgram(p);

    const attrs = options.attributes;
    if (attrs) {
      Object.keys(attrs).forEach((attributeName) => {
        const location = gl.getAttribLocation(p, attributeName);

        switch (vertex.attributes[attributeName]) {
          case "vec4": {
            const buffer = gl.createBuffer()!;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              attrs[attributeName] as Float32Array,
              gl.STATIC_DRAW
            );
            gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(location);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            break;
          }
          case "vec3": {
            const buffer = gl.createBuffer()!;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              attrs[attributeName] as Float32Array,
              gl.STATIC_DRAW
            );
            gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(location);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            break;
          }
        }
      });
    }

    const uniforms = options.uniforms;
    if (uniforms) {
      Object.keys(uniforms).forEach((uniformName) => {
        const location = gl.getUniformLocation(p, uniformName);

        switch (
          vertex.uniforms[uniformName] ||
          fragment.uniforms[uniformName]
        ) {
          case "vec4": {
            gl.uniform4fv(location, uniforms[uniformName] as Float32Array);
            break;
          }
          case "vec3": {
            gl.uniform3fv(location, uniforms[uniformName] as Float32Array);
            break;
          }
          case "float": {
            gl.uniform1f(location, uniforms[uniformName] as number);
            break;
          }
          case "mat4": {
            gl.uniformMatrix4fv(location, false, uniforms[uniformName] as mat4);
            break;
          }
        }
      });
    }
  };
}
