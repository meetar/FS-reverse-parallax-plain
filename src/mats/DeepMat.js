import * as THREE from 'three'
import ParallaxMaterial from './ParallaxMaterial';
import { simpleControls } from '../utils'
import { Center } from '@react-three/drei';

// a material with inner depths
export default function DeepMat({color, geometry, normalMap, depthMap, texture, ...props}) {

  const parallaxConfig = {
    _steps: 8,
    _height: 1,
    _scale: 4,
    _displacement: 0,
    opacity: 1,
  }

  return (
    <>
      <Center position={[0, 0, 0]}>
        <mesh geometry={geometry} >
          <ParallaxMaterial
            config={{...parallaxConfig}}
            texture={depthMap}
          />
        </mesh>
        </Center>
    </>
  )
}
