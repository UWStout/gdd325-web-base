precision mediump float;

uniform vec2 blur;
uniform sampler2D uSampler;

varying vec2 outTexCoord;
varying vec4 outTint;

vec4 BlurX(vec2 TexCord) {
  vec4 sum = vec4(0.0);

  sum += texture2D(uSampler, vec2(TexCord.x - 4.0*blur.x, TexCord.y)) * 0.05;
  sum += texture2D(uSampler, vec2(TexCord.x - 3.0*blur.x, TexCord.y)) * 0.09;
  sum += texture2D(uSampler, vec2(TexCord.x - 2.0*blur.x, TexCord.y)) * 0.12;
  sum += texture2D(uSampler, vec2(TexCord.x - blur.x, TexCord.y)) * 0.15;
  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y)) * 0.16;
  sum += texture2D(uSampler, vec2(TexCord.x + blur.x, TexCord.y)) * 0.15;
  sum += texture2D(uSampler, vec2(TexCord.x + 2.0*blur.x, TexCord.y)) * 0.12;
  sum += texture2D(uSampler, vec2(TexCord.x + 3.0*blur.x, TexCord.y)) * 0.09;
  sum += texture2D(uSampler, vec2(TexCord.x + 4.0*blur.x, TexCord.y)) * 0.05;
  
  return sum;
}

vec4 BlurY(vec2 TexCord) {
  vec4 sum = vec4(0.0);

  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y - 4.0*blur.y)) * 0.05;
  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y - 3.0*blur.y)) * 0.09;
  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y - 2.0*blur.y)) * 0.12;
  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y - blur.y)) * 0.15;
  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y)) * 0.16;
  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y + blur.y)) * 0.15;
  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y + 2.0*blur.y)) * 0.12;
  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y + 3.0*blur.y)) * 0.09;
  sum += texture2D(uSampler, vec2(TexCord.x, TexCord.y + 4.0*blur.y)) * 0.05;

  return sum;            
}

void main(void) {
  vec4 sum = vec4(0.0);
  sum = ((BlurX(outTexCoord) * 0.5) + (BlurY(outTexCoord) * 0.5));
  gl_FragColor = sum;
}
