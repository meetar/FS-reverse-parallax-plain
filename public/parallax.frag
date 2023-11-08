//  based on https://techbrood.com/threejs/examples/jsm/shaders/ParallaxShader.js

// Parallax Occlusion shaders from
//    http://sunandblackcat.com/tipFullView.php?topicid=28
// No tangent-space transforms logic based on
//   http://mmikkelsen3d.blogspot.sk/2012/02/parallaxpoc-mapping-and-no-tangent.html


uniform float _steps;
uniform float _height;
uniform float _scale;
uniform float _opacity;
uniform sampler2D _texture;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;



vec2 parallaxMap( in vec3 V , in float offset) {

  vec2 texCoordOffset = _height * offset * V.xy / V.z;

  return vUv - texCoordOffset;

}


// this function perturbs UV coordinates based on the parallax mapping technique, which simulates a 3D effect on a 2D surface by displacing texture coordinates.
vec2 perturbUv( vec3 surfPosition, vec3 surfNormal, vec3 viewPosition, float offset ) {
// surfPosition: world-space position of the current point on the surface being rendered.
// surfNormal: world-space normal vector at the current point on the surface.
// viewPosition: world-space position of the camera or viewer.
// offset: offset factor that determines the depth of the parallax effect. It controls how far the texture appears to be displaced.

  // dFdx and dFdy: built-in GLSL functions that calculate the partial derivatives of a variable with respect to the screen-space x and y coordinates, respectively. They are used to compute the rate of change of the texture coordinates in screen space.

  // partial derivatives of the texture coordinates (vUv) with respect to the screen-space x and y coordinates.
  vec2 texDx = dFdx( vUv );
  vec2 texDy = dFdy( vUv );

  // partial derivatives of surfPosition with respect to screen-space x and y coordinates. they represent the change in the world-space position along the x and y axes in screen space.
  vec3 vSigmaX = dFdx( surfPosition );
  vec3 vSigmaY = dFdy( surfPosition );

  // vR1 and vR2: tangent vectors used to build the TBN (tangent, bitangent, normal) matrix, which is used to transform vectors from tangent space to view space.
  vec3 vR1 = cross( vSigmaY, surfNormal );
  vec3 vR2 = cross( surfNormal, vSigmaX );
  // fDet is the determinant of the TBN matrix. It's used as part of the transformation process.
  float fDet = dot( vSigmaX, vR1 );

  // vProjVscr: a 2D vector that contains the projected view vector onto the tangent plane of the surface. it's calculated using the tangent vectors and the view position.
  vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );

  // vProjVtex: a 3D vector that contains the perturbed view vector in texture space. it's calculated by transforming the projected view vector in screen space back into texture space using the partial derivatives of the UV coordinates.
  vec3 vProjVtex;
  vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;
  vProjVtex.z = dot( surfNormal, viewPosition );

  // parallaxMap performs the actual parallax mapping calculation. it takes the perturbed view vector and the offset as arguments to return the new UV coordinates after applying the parallax effect.
  return parallaxMap( vProjVtex , offset);

}

void main() {

  float lum;
  float offset;
  vec4 color;

  for (float i = _steps + 1.; i >= 0.; i--) {
    float percent = (1. / _steps) * i;
    float next = (1. / _steps) * (i + 1.);

    offset = ( percent );
    vec2 mapUv = perturbUv( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ), offset);

    gl_FragColor = vec4(mapUv, 0., 1.);

    lum = texture2D( _texture, mapUv  * _scale ).r; //
    // if the value of the sampled texture is less than the sampling distance, use it --
    // this pulls in dim values from nearby and bright values from further away
    if (lum >= percent && lum < next) {
      color += vec4(lum);
      break;
    }
  }

  gl_FragColor = vec4(color.rgb, 1. * _opacity);
}