//  based on https://techbrood.com/threejs/examples/jsm/shaders/ParallaxShader.js

// Parallax Occlusion shaders from
//    https://web.archive.org/web/20190128023901/http://sunandblackcat.com/tipFullView.php?topicid=28
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


// this function perturbs UV coordinates based on the parallax mapping technique, which simulates a 3D effect on a 2D surface by displacing texture coordinates.
vec2 perturbUv( vec3 viewPosition, vec3 surfNormal ) {
// surfNormal: world-space normal vector at the current point on the surface.
// viewPosition: world-space position of the camera.

  // dFdx and dFdy: built-in GLSL functions that calculate the partial derivatives of a variable with respect to the screen-space x and y coordinates, respectively.

  // partial derivatives of the texture coordinates (vUv) with respect to the screen-space x and y coordinates.
  vec2 texDx = dFdx( vUv );
  vec2 texDy = dFdy( vUv );

  // partial derivatives of viewPosition with respect to screen-space x and y coordinates. they represent the change in the world-space position along the x and y axes in screen space.
  vec3 vSigmaX = dFdx( viewPosition );
  vec3 vSigmaY = dFdy( viewPosition );

  // vR1 and vR2: tangent vectors used to build the TBN (tangent, bitangent, normal) matrix, which is used to transform vectors from tangent space to view space.
  vec3 vR1 = cross( vSigmaY, surfNormal );
  vec3 vR2 = cross( surfNormal, vSigmaX );
  // fDet is the determinant of the TBN matrix. It's used as part of the transformation process.
  float fDet = dot( vSigmaX, vR1 );

  // vProjVscr: a 2D vector that contains the projected view vector onto the tangent plane of the surface. it's calculated using the tangent vectors and the view position.
  vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );

  // vProjVtex: the perturbed view vector in texture space. it's calculated by transforming the projected view vector in screen space back into texture space using the partial derivatives of the UV coordinates.
  vec3 vProjVtex;
  vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y; // perturbed view vector in the texture space's XY plane
  vProjVtex.z = dot( surfNormal, viewPosition ); // factor related to the view vector's alignment with the surface normal

  // apply the parallax effect - _height is the maximum distance to perform the perturbation
  vec2 texCoordOffset = _height * vProjVtex.xy / vProjVtex.z;

  // return the maximum uv offset
  return texCoordOffset;
}

void main() {

  float lum;
  vec3 color = vec3(0.);

  // perform the actual parallax mapping calculation. it takes the view position and the surface normal as arguments to return the maximum UV coordinate displacement, after applying the parallax effect.
  vec2 maximumOffset = perturbUv( vViewPosition, normalize( vNormal ));

  // loop starting at the maximum value and stepping down by 1 each time
  for (float i = _steps + 1.; i >= 0.; i--) {
    float percent = (1. / _steps) * i;
    float next = (1. / _steps) * (i + 1.);

    // apply the offset to the UVs in steps, ending with the maximum offset
    vec2 newUv = vUv - maximumOffset * percent;

    // get the brightness of the pixel, in this case by simply taking the r channel's value. this assumes a grayscale teture
    lum = texture2D( _texture, newUv  * _scale ).r; //
    // if the value of the sampled pixel falls within the current step percentage range, use it and stop.
    // this chooses the brightest of the available values
    if (lum >= percent && lum < next) {
      color = vec3(lum);
      break; // exit the loop
    }
  }

  // set the output fragment color
  gl_FragColor = vec4(color, _opacity);
}