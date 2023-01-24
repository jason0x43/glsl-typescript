#version 100

precision mediump float;

attribute vec3 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;

uniform mat4 u_mvpMatrix;
uniform mat4 u_modelMatrix;

varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_position;

void main() {
    gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
    v_color = a_color;
    v_normal = (u_modelMatrix * vec4(a_normal, 0.0)).xyz;
    v_position = (u_modelMatrix * vec4(a_position, 1.0)).xyz;
}