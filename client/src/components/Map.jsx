import React, {useState,useContext} from 'react'
import { ClassContext } from '../DataProvider';
import mapStyles from '../mapStyles';

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
  } from "@react-google-maps/api";




const googleApiKey = "AIzaSyAMXu5nDUDL7yUs5RQeU2mIKWi6wnfHb9s"

const mapContainerStyle = {
    height: "60vh",
    width: "80vh"
};

const options = {
    styles:mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
  };

const center = {
    lat: 45.5016889,
    lng: -73.567256,
};


const Map = (props) => {
    const [selectedMcdo,setSelectedMcdo] = useState(null);
    const {data} = useContext(ClassContext);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleApiKey
      });

    if (loadError) return (
        <div className="loading">
            <h1>Error occured while loading Google Maps</h1>
        </div>
    );

    if (!isLoaded) return (
        <div className="loading">
            <h1>Loading Google Maps</h1>
        </div>
    );

    return (
        <>
        <GoogleMap id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
        options={options}>
           {props.userLoc ? <Marker position={{lat:props.userLoc.coords.latitude,lng:props.userLoc.coords.longitude}} zIndex={10000000}/>:null}
            {data.data.length >= 1 ? data.data.map((mcdo,idx)=>{
                return <Marker 
                key={idx} 
                position={{ lat: mcdo.lat, lng: mcdo.lng }}
                icon={!mcdo.unavailable?{
                    url: require("../assets/available.png"),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(30, 30),
                }: {url: require("../assets/unavailable.png"),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(30, 30),}}
                zIndex={999}
            
                onClick={()=>{setSelectedMcdo(mcdo)}}
                >
                </Marker>
            }):null}
            
            {selectedMcdo ? (
            <InfoWindow
                position={{ lat: selectedMcdo.lat, lng: selectedMcdo.lng }}
                onCloseClick={() => {
                setSelectedMcdo(null);
                }}
            >
                <div>
                <h2>Address : {selectedMcdo.name}</h2>
                <div className='sundaeContainer'>
                {!selectedMcdo.unavailable? "All Sundaes are available":selectedMcdo.unavailable.map((item,idx)=>(<p key={idx} className='unavailableSundaes'>{item}</p>))}
                </div>
                </div>
            </InfoWindow>
            ) : null}

        </GoogleMap>
        </>
    )
}


export default Map
