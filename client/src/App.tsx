import { useEffect, useState } from 'react';
import { useDateStore } from './app/dateStore.js';
import loader from './assets/loader.svg'
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import Scene from './components/Scene.js';
import $api from './app/api.js';

import './App.css';

export interface RepeatedState {
  setLoading: React.Dispatch<React.SetStateAction<{
    models: boolean;
    data: boolean;
  }>>
  getInfo(formatDate?: string): Promise<void>
  data: any | any[]

}

// in case I want to add multiple scenes
const Element = ({ data, getInfo, setLoading }: RepeatedState) => {
  return (
    <div className='element-wrapper'>
      <Scene data={data} getInfo={getInfo} setLoading={setLoading} />
    </div>
  )
}

function App() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState({ models: true, data: true });
  let formattedDate = useDateStore((state) => state.formatDate)
  
  async function getInfo(formatDate?: string) {
    let actualDate = formatDate ? formatDate : formattedDate;
    await $api.get(`feed?start_date=${actualDate}&end_date=${actualDate}&api_key=${import.meta.env.VITE_REACT_API_KEY}`)
    .then(result => { setData(result.data.near_earth_objects) }).finally(() => { setLoading(prev => ({ ...prev, data: false })); })

  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className='app-wr'>
      <Header />
      {loading.data ? <div id="loader-wr"><img src={loader} alt='loader' /></div>
        : Object.keys(data)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((key, index) =>
            <Element key={index} data={data[key]} getInfo={getInfo} setLoading={setLoading} />)
      }
      <Footer />
    </div>
  );
}

export default App;