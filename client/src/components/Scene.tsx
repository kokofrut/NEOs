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
  const [selectedAsteroid, setSelectedAsteroid] = useState<any>({id: -1})
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
    // selectedAsteroid.id === -1 ? 
    setSelectedAsteroid(event.target)
    // setSelectedAsteroid({id: -1})
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
        {selected != null ?
          <Html position={[selected * 4 + 0.01, -2, 0]} >
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
        <div className="divider"></div>
        <div className="list-ast">
          <h1>List of asteroids</h1>
          <ul>
            {data.map((asteroid: any) => (
              <li key={asteroid.id} className='ast-li' >
                <a onClick={(event) => { handleMenuClick(event) }} id={asteroid.id} className='ast-a'>{asteroid.name}</a>
                <div
                  id={`details-${asteroid.id}`}
                  className="asteroid-details"
                  style={{ maxHeight: selectedAsteroid.id === asteroid.id ? 400 + 'px' : 0 }}
                >
                  <p>ID: {asteroid.id}</p>
                  <p>Name: {asteroid.name}</p>
                  <p>Close approach: {asteroid.close_approach_data[0].close_approach_date_full.split(' ')[1]}</p>
                  <p>Est diameter: {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toPrecision(2)} - {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toPrecision(2)} km</p>
                  <p style={{backgroundColor: asteroid.is_potentially_hazardous_asteroid ? '#ba000096' : '#2abe2a9c'}}>Potentialy hazardous: {asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Scene