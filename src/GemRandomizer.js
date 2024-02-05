
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import DeepMat from './mats/DeepMat'
import { getModel } from './getModel'

export function GemRandomizer(config) {
  const [model, setModel] = useState()
  const [depthMap, setDepthMap] = useState()

  async function getDepth() {
    const url = './textures/depth/speckles2.png';
    const map = await new THREE.TextureLoader().loadAsync(url);
    map.wrapT = THREE.RepeatWrapping;
    map.wrapS = THREE.RepeatWrapping;
    map.magFilter = THREE.NearestFilter; // disable gpu-level antialiasing 
    map.repeat.set(2, 2); // adjust the scale along U and V axes (this is further adjusted in the shader)
    return map;
  }

  async function loadAssets() {
    // use Promise.all so we don't set any state before we have all the info at once –
    // this prevents the model from being drawn multiple times with incomplete data every time one of the state values updates
    let model, depth;
    [model, depth] = await Promise.all([getModel(), getDepth()]);
    setModel(model)
    setDepthMap(depth)
  }

  // run on first load
  useEffect(() => {
    loadAssets()
  }, [])

  if (!model) {
    // the async functions haven't returned yet, don't render anything
    return null;
  }

return (
    <>
      <DeepMat {...config} geometry={model} depthMap={depthMap} />
    </>
  )
}
