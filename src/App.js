import * as _ from 'lodash'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene.js'
import { Center } from '@react-three/drei'
import { Leva, useControls } from 'leva'

export const parallaxcontrols = {
  _height: { value: 1, min: 0.1, max: 10, step: .01 },
  _steps: { value: 8, min: 0, max: 100, step: 1 },
  _scale: { value: 4, min: 1, max: 10, step: .01 },
  rotate: true
}

export function App() {

  const queryParameters = new URLSearchParams(window.location.search)
  const ui = queryParameters.get("ui")

  const config = ui ? useControls(parallaxcontrols) : null

  return (
    <>
    {ui ? <Leva
      titleBar={false}
    /> : null}

    <div style={{height: '100%', zIndex: 0, }}>

    <Canvas camera={{ position: [5, 3, -10], zoom: 4, near: 1, far: 1000 }} >

    <Center>
      {/* put everything into a component inside Canvas, to avoid the R3F Hooks warning - this provides the Canvas context */}
      <Scene config={config} />
    </Center>
    </Canvas>
  </div>
  </>
)
}
