import { MutableRefObject, useEffect, useState } from 'react';
// import $api from './app/api.js';
import './App.css';
import axios from 'axios';
import { Suspense, useRef } from "react";
import { Canvas, ThreeEvent, useFrame } from "react-three-fiber";
import { OrbitControls, CameraControls, useGLTF, Environment, Html } from "@react-three/drei";
import * as three from "three";
import { randInt } from 'three/src/math/MathUtils.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import { useProgress } from '@react-three/drei'

function Loader() {
  const { progress } = useProgress()
  console.log(progress)
  return <div>{progress} % loaded</div>
}


const Cube = ({ data, index, cameraref, geometry }: { data: any, index: number, cameraref: any, geometry: three.BufferGeometry }) => {
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

const Element = ({ data, dateState }: { data: any[], dateState: Date }) => {
  return (
    <div className='element-wrapper'>
      <Scene data={data} dateState={dateState}/>
    </div>
  )
}

const Scene = ({ data }: { data: any[], dateState: Date }) => {
  const cameraControlsRef = useRef<CameraControls | null>(null)
  const [selected, setSelected] = useState<any>(null)
  const { nodes } = useGLTF(`asteroids.gltf`, true) as any
  let dateNow = new Date()
  console.log(dateNow)
  function handleMenuClick(event: any) {
    const targetId = (event.target as HTMLElement).id;
    const target = data.findIndex((el: any) => el.id === targetId);
    setSelected(target)
    cameraControlsRef.current?.moveTo(target * 4, 0, 0, true)
  }
  // useEffect(() => {
  //   console.log(selected)
  // }, [selected])
  return (
    <div className='scene-container'>

      <Canvas>
        <OrbitControls />
        <Suspense fallback={<Loader />}>
          <pointLight intensity={1.0} position={[2, 1, 5]} />
          {nodes ? data.length > 0 ? data.map((element, index) => { let choise = `rock${randInt(1, 10)}`; return <Cube data={element} key={element.id} index={index} cameraref={cameraControlsRef} geometry={nodes[choise].geometry} /> }) : "" : ""}

          {/* <Element key={index} data={data[key]} date={key} /> */}
        </Suspense>
        <CameraControls
          ref={cameraControlsRef}
          enabled={true}
        />
        <Environment files="space2.hdr" background />
        {selected != null ? selected == 0 ?
          <Html position={[0.1, -2, 0]} >

            <div>
              <p>{data[selected].name}</p>
              <p>{data[selected].id}</p>
            </div>
          </Html>
          :
          <Html position={[selected * 4, -2, 0]} >
            <div>
              <p>{data[selected].name}</p>
              <p>{data[selected].id}</p>
            </div>
          </Html> : ''}
      </Canvas>
      <div className='right-section'>
        <div>
          <input type="datetime-local" id="meeting-time"
            name="meeting-time" value="2018-06-12T19:30"
            min="2018-06-07T00:00" max="2018-06-14T00:00">
          </input>
        </div>
        <ul>
          {data.map((asteroid) => (
            <li key={asteroid.id} className='ast-li' >
              <a onClick={(event) => { handleMenuClick(event) }} id={asteroid.id} className='ast-a'>{asteroid.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function App() {
  const [data, setData] = useState<any>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState({ models: true, data: true });
  async function getInfo() {
    // let nowDate = new Date;
    // let nowDateS = nowDate.toISOString().split('T')[0]
    // let startDate = new Date(nowDate)
    // startDate.setDate(1)
    // let endDate = new Date(nowDate);
    // endDate.setDate(nowDate.getDate() + 1);
    let startDateS = date.toISOString().split('T')[0]
    // let endDateS = endDate.toISOString().split('T')[0];
    await axios({
      method: 'get',
      url: `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDateS}&end_date=${startDateS}&api_key=${import.meta.env.VITE_REACT_API_KEY}`,
    }).then(result => { setData(result.data.near_earth_objects) }).finally(() => { setLoading(prev => ({ ...prev, data: false })); })

  }



  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className='app-wr'>
      <Header />
      {loading.data ? "loading data.."
        : Object.keys(data)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((key, index) =>
            <Element key={index} data={data[key]} dateState={date} />)
      }
      <Footer />
    </div>
  );
}

export default App;