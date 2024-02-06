import { GemRandomizer } from './GemRandomizer.js'
import { OrbitControls } from '@react-three/drei'

export default function Scene(config) {

  const rotate = config.config?.rotate || true;
  return (
    <>
      <GemRandomizer {...config} />
      <OrbitControls autoRotate={rotate} autoRotateSpeed={-1} zoomSpeed={.5} dampingFactor={0.3} enableZoom={true} enableRotate={true} enablePan={false} />
    </>
  )
}