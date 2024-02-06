  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    // set uv varying
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    // set viewPosition varying – this is the position in view space
    vViewPosition = mvPosition.xyz;

    // calculate normal in view space and set normal varying
    vNormal = normalize(normalMatrix * normal);

    // set vertex positions
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }