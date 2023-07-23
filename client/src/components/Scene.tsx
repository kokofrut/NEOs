import { CameraControls, Environment, Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { RepeatedState } from "../App";
import { Suspense, useRef, useState } from "react";
import { Canvas } from "react-three-fiber";
import { useDateStore } from "../app/dateStore";
import Asteroid from "./Asteroid";

function Loader() {
  const { progress } = useProgress()
  return <div>{progress} % loaded</div>
}


const Scene = ({ data, getInfo, setLoading }: RepeatedState) => {
  const cameraControlsRef = useRef<CameraControls | null>(null)
  const formatDate = useDateStore((state) => state.formatDate)

  const [date, setDate] = useState<string | undefined>(formatDate)
  const [selected, setSelected] = useState<any>(null)

  const { nodes } = useGLTF(`asteroids.gltf`, true) as any
  const changeDate = useDateStore((state) => state.setCurrDate)

  let ids: number[] = data.map((el: any) => el.id % 10 + 1)
  function dateHandler(event: any) {
    setDate(event.target.value)
    changeDate(new Date(event.target.value))
    getInfo(event.target.value)
    setLoading(prev => ({ ...prev, data: true }))
  }
  function handleMenuClick(event: any) {
    const targetId = (event.target as HTMLElement).id;
    const target = data.findIndex((el: any) => el.id === targetId);
    setSelected(target)
    cameraControlsRef.current?.moveTo(target * 4, 0, 0, true)
  }
  return (
    <div className='scene-container'>

      <Canvas>
        <OrbitControls />
        <Suspense fallback={<Loader />}>
          <pointLight intensity={1.0} position={[2, 1, 5]} />
          {nodes ? data.length > 0 ? data.map((element: any, index: number) => {
            return <Asteroid data={element} key={element.id} index={index} cameraref={cameraControlsRef} geometry={nodes[`rock${ids[index]}`].geometry} />
          }) : "" : ""}
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
        <div className='search-cnt'>
          <h1>Search for date</h1>
          <input type="date" id="asteroids-day"
            name="asteroids-day" value={date}
            onChange={e => { dateHandler(e) }}>
          </input>
        </div>
        <div className="list-ast">
          <h1>List of asteroids</h1>
          <ul>
            {data.map((asteroid: any) => (
              <li key={asteroid.id} className='ast-li' >
                <a onClick={(event) => { handleMenuClick(event) }} id={asteroid.id} className='ast-a'>{asteroid.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Scene