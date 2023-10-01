
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { RGBELoader } from 'three-stdlib'
import { EquirectangularReflectionMapping } from 'three';
import * as _ from 'lodash'
import DeepMat from './mats/DeepMat'
import { getModel } from './getModel'
import { randomColor } from 'randomcolor';
import { randomDepth } from './textureUtils'

// flip a coin with a n * 100 percent chance of success
export function roll(chance = .5) {
  return Math.random() < chance;
}

export function GemRandomizer({ gpuTier, config, trigger }) {
  const [mode, setMode] = useState('gem');
  const [statecolor, setColor] = useState('#000000');
  const [model, setModel] = useState()
  const [normalMap, setNormalMap] = useState()
  const [depthMap, setDepthMap] = useState()
  const [envMap, setEnvMap] = useState(useTexture('./textures/colorMap/ice.jpeg'))
  // this sends a trigger to update and reload a material
  const [mattrigger, setMattrigger] = useState()

  async function getDepth() {
    const url = randomDepth();
    const map = await new THREE.TextureLoader().loadAsync(url);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // adjust the scale along U and V axes (this is further adjusted in the shader)
    return map;
  }

  function getEnv() {
    // too many async errors, giving up
    // const url = randomEnv();
    // const map = await useLoader(RGBELoader, url)
    const map = useLoader(RGBELoader, './textures/env/aerodynamics_workshop_1k.hdr')

    map.mapping = EquirectangularReflectionMapping;

    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(2, 2); // adjust the scale along U and V axes
    return map;
  }

  async function getMode() {
    return 'deep'
  }

  async function randomizeAll(mode = null, oldmodel = null) {
    // use Promise.all so we don't set any state before we have all the info at once –
    // this prevents the model from being drawn multiple times with incomplete data every time one of the state values updates
    let model, depth;
    const newcolor = randomColor();
    [model, depth, mode] = await Promise.all([getModel(), getDepth(), getMode()]);
    setModel(model)
    // console.log('mode:', mode);
    setDepthMap(depth)
    // setEnvMap(env) // not worth the trouble
    setMode(mode)
    // trigger material to reload if there's already a mode set
  }

    // watch for triggers from app
  useEffect(() => {
    randomizeAll()
  }, [])

  if (!model) {
    // the async functions haven't returned yet, don't render anything
    return null;
  }

return ( mode &&
    <>

      <directionalLight position={[0, 2, 0]} intensity={10} penumbra={1} distance={2} color={'white'} />
      <DeepMat geometry={model} color={'#e2b9dd'} depthMap={depthMap} envMap={envMap} config={config} castShadow />

    </>
  )
}
