import { ThreeEvent, useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react'
import * as three from "three";

interface AsteroidProps {
  data: any, 
  index: number, 
  cameraref: any,
  geometry: three.BufferGeometry
}

const Asteroid = ({ data, index, cameraref, geometry }: AsteroidProps) => {
    const cube: MutableRefObject<three.Mesh | null> = useRef<three.Mesh | null>(null);
    useFrame(() => {
      cube.current!.rotation.x += 0.001;
    });
    function click(el: ThreeEvent<MouseEvent>) {
      const { x, y, z } = el.eventObject.position
      cameraref.current?.moveTo(x, y, z, true)
    }
    return (
      <mesh ref={cube} scale={[1, 1, 1]} geometry={geometry} position={[index * 4, 0, 0]} onClick={(el) => click(el)}>
        <meshStandardMaterial color={data.is_potentially_hazardous_asteroid ? "red" : "green"} />
      </mesh>
    );
  };
export default Asteroid