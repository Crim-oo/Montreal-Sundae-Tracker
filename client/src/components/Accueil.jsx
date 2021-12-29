import React, {useContext,useState} from 'react'
import Map from './Map'
import { ClassContext } from '../DataProvider'

const Accueil = () => {
    const [userLoc,setUserLoc] = useState(null)
    const {data,updateData} = useContext(ClassContext);

    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(getCoords);
    }
  
    const getCoords = (position) => {
        setUserLoc(position);
      }

    
    const onClick = async() => {
        await updateData();
    }

    if (data.loading) {
        return (
          <div className="loading">
            <h1>Loading Data ...</h1>
          </div>
        );
    }

    else return (
        <div className='mapContainer'>
          <Map userLoc={userLoc}/>
            <div className='refreshContainer'>
                <p>{data.date}</p>
                <button className='refreshBtn' onClick={onClick}>Refresh Data</button>
                <button className='refreshBtn' onClick={getLocation}>Find My location</button>
            </div>          
        </div>
    )
}

export default Accueil
