#version 100

precision mediump float;

uniform float u_time;

varying vec4 v_color;

void main() {
    gl_FragColor = v_color * (1.0 + sin(u_time));
}