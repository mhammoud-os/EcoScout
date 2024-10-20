import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home'
import Map from './components/Map';
import Dashboard from './components/Dashboard';

const App = () => {
  const [markers, setMarkers] = useState([]);

  setTimeout(() => {
    fetchMarkerData()
    console.log("refresh")
  }, 60000);


  const removeMarker = () => {
    // if (markers.length > 0) {
    //   setMarkers(markers.slice(0, markers.length - 1));
    // }
  };

  async function addMarker(position) {
    const newMarker = {
      lat: position[0],
      lng: position[1],
      info: `Marker: `,
    };

    try {
      const res = await fetch(`http://localhost:3000/ADD`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        lat: 1,
        lng: 2,
        body: JSON.stringify(newMarker),
      });
      fetchMarkerData();
      return;

    } catch (error) {
      console.log("ERRROR :)")
      console.log(error)
    }
  };

  async function fetchMarkerData() {
    try {
      const res = await fetch(`http://localhost:3000/markers`);
      const data = await res.json();

      console.log("HI")
      if (!res.ok) {
        console.log(res);
        return;
      }

      console.log(data)

      if (markers.length !== data.length) {
        console.log('len')
        setMarkers(data)
      } else {
        for (let i = 0; i < markers.length; i++) {
          if (markers[i].id !== data[i].id) {
            console.log('for')
            setMarkers(data)
            break;
          }
        }
      }
      console.log(markers)

    } catch (error) {

      console.log("ERRROR :(")
      console.log(error)
    }
  };








  return (
      <Router>
        <div>
          <h1 className='text-4xl font-bold flex justify-center p-6'>EcoScout</h1>
          <div className='flex flex-row justify-center p-1 my-2 w-full h-10'>
            <button className='w-40 h-8 bg-gray-200 text-center rounded-lg' onClick={fetchMarkerData}>Fetch New Data</button>
          </div>

          <nav className='flex flex-row justify-around p-4 bg-gray-200 align-middle'>
            <Link to="/">Home</Link>
            <Link to="/map">Map</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
          <Routes>
            <Route
                path="/"
                element={<Home />}
            />
            <Route
                path="/map"
                element={<Map markers={markers} addMarker={addMarker} removeMarker={removeMarker} fetchMarkerData={fetchMarkerData}/>}
            />
            <Route path="/dashboard" element={<Dashboard markers={markers} />} />
          </Routes>
        </div>
      </Router>
  );
};
export default App;