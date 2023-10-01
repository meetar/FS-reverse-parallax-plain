import { useEffect } from 'react'
import * as THREE from 'three'
import { EquirectangularReflectionMapping } from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei'
import ParallaxMaterial from './ParallaxMaterial';
import { parallaxcontrols } from './parallaxcontrols';
import { randomizeLevaControls, simpleControls, roundValue, roundToNearest } from '../utils'
import { deepControls } from './deepControls';
import { Center, Resize } from '@react-three/drei';

// a material with inner depths
export default function DeepMat({config, color, geometry, normalMap, depthMap, envMap, texture, ...props}) {
  
  function randomizeDeep() {
    const controls = randomizeLevaControls(deepControls);

    // tune these
    controls.transmission.value = 1 - ( controls.transmission.value / 2 );
    controls.opacity.value = 1 - ( controls.opacity.value / 2 );
    controls.roughness.value = controls.roughness.value / 2;

    // round these off to their nearest 'step' value, or Leva will barf
    roundValue(controls.transmission)
    roundValue(controls.opacity)
    roundValue(controls.roughness)
    return controls;
  }

  const deepConfig = simpleControls(deepControls);
  const parallaxConfig = simpleControls(parallaxcontrols);

  deepConfig._displacement = -.01;

  envMap.mapping = EquirectangularReflectionMapping; 
  envMap.wrapT = THREE.RepeatWrapping;
  envMap.wrapS = THREE.RepeatWrapping;
  
  depthMap.wrapT = THREE.RepeatWrapping;
  depthMap.wrapS = THREE.RepeatWrapping;
  depthMap.repeat.set(2, 2); // adjust the scale along U and V axes

  return (
    <>
      <Center position={[0, 0, 0]}>
      <mesh scale={1} renderOrder={0} geometry={geometry} transparent={true} castShadow >
        <MeshTransmissionMaterial {...parallaxConfig} {...deepConfig} {...config}
          color={color}
          // normalMap={normalMap}
          envMap={envMap}
          // clearcoatNormalMap={normalMap}
          // clearcoatNormalScale={new THREE.Vector2(.03,.03)}
          side={THREE.DoubleSide}
        />
        </mesh>
        <mesh scale={.99} renderOrder={1} geometry={geometry} >
          <ParallaxMaterial
          config={{...config, ...parallaxConfig, ...deepConfig}}
          texture={depthMap}
          color={color} // TODO: is the parallaxMaterial color being used?
          isShaderMaterial
          opacity={config.opacity}
          // transparent={true}
          />
        </mesh>
        </Center>
    </>
  )
}
