import * as _ from 'lodash'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { shuffleArray, divideCircleIntoPoints } from './utils';

export const getModel = async () => {
  return await makeComboMesh();
}

// create a mesh using multiple scaled and rotated instances of the same input geo
async function makeComboMesh() {
  const mesh = './models/chalk1.obj'
    // console.log('combo obj:', mesh);

    // how many clones should we make?
    // const number = Math.ceil(Math.random()*10)+1;
    const number = 6; // constant for the simple demo
    const distance = .5;
    // arrange them evenly in a circle
    let points = divideCircleIntoPoints(number, distance);
    // shuffle them so they aren't ordered by size
    points = [
      points[0],
      points[2],
      points[5],
      points[4],
      points[1],
      points[3],
    ]

    // load the geo
    const loader = new OBJLoader();
    const obj = await loader.loadAsync(mesh)
    const geo = obj.children[0].geometry;

    let clones = [];
    let targetY = .1;
    // random scale
    // let s = (Math.random()+1)/3;
    let s = 1;
    for (let x=0; x< points.length; x++) {
      let clone = geo.clone();
      clone.scale(s, s, s);
      // this tips the clones outward a bit, away from the center
      clone.lookAt(new THREE.Vector3(points[x].x, targetY, points[x].z));
      // adjust the lookat point and scale a bit for each clone
      targetY += .1;
      s *= .9;
      clones.push(clone)
    }
    let merged = BufferGeometryUtils.mergeGeometries(clones)
    return merged;
}