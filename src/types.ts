import { mat4 } from "gl-matrix";

interface Types {
    vec4: Float32Array;
    vec3: Float32Array;
    float: number;
    mat4: mat4;
}

export type ShaderType = keyof Types;
export type ShaderValue<A extends ShaderType> = Types[A];

interface Shader<U> {
    source: string;
    name: string;
    uniforms: {
        [key in keyof U]: ShaderType;
    };
}

export interface VertexShader<U, A> extends Shader<U> {
    attributes: {
        [key in keyof A]: ShaderType;
    };
}

export interface FragmentShader<U> extends Shader<U> {}
