import * as THREE from 'three'
import { useLoader } from '@react-three/fiber';

const ParallaxMaterial = ({texture, config}) => {
  const vertexShader = useLoader(THREE.FileLoader, './parallax.vert');
  const fragmentShader = useLoader(THREE.FileLoader, './parallax.frag');

  const uniforms = {
      _displacement: { value: config._displacement },
      _texture: { value: texture },
      _steps: {value: config._steps},
      _height: {value: config._height},
      _scale: {value: config._scale},
      _opacity: {value: config.opacity},
    };

    const args = {uniforms, fragmentShader, vertexShader}
  return (
    <shaderMaterial args={[args]} depthWrite={true} />
  )
}

export default ParallaxMaterial