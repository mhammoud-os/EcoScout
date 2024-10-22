import { FaLeaf } from "react-icons/fa";
import { IoReloadCircle } from "react-icons/io5";


import { useEffect } from 'react';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Map from './components/Map';
import Dashboard from './components/Dashboard';

const App = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetchMarkerData();
  });

  setTimeout(() => {
    fetchMarkerData()
    console.log("refresh")
  }, 60000);


  async function removeMarker(id) {
    const newMarker = {
      id: id,
    };

    try {
      const res = await fetch(`http://localhost:3000/REMOVE`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMarker),
      });
      //fetchMarkerData();
      return;

    } catch (error) {
      console.log("ERRROR :)")
      console.log(error)
    }
  };

  async function addMarker(position) {
    const randId = Math.floor(Math.random() * 1000000000000000);;
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
        body: JSON.stringify(newMarker),
      });
      fetchMarkerData();
      return;

    } catch (error) {
      console.log(error)
    }
  };

  async function fetchMarkerData() {
    try {
      const res = await fetch(`http://localhost:3000/markers`);
      const data = await res.json();
  
  
      if (!res.ok) {
        console.log(res);
        return;
      }
      
      console.log(data)
      console.log(markers)

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
  
    } catch (error) {
      console.log(error)
    }
  };








  return (
    <Router>
      <div className="h-full w-full">
        <h1 className='text-4xl font-bold flex justify-center p-6'><FaLeaf color="green" className="mx-2"/>EcoScout</h1>

        <nav className='flex flex-row justify-around p-4 align-middle'>
          <Link to="/" className="bg-green-600 p-1 rounded-lg text-white font-bold">Map</Link>
          <Link to="/dashboard" className="bg-green-600 p-1 rounded-lg text-white font-bold">Dashboard</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<Map markers={markers} addMarker={addMarker} removeMarker={removeMarker} fetchMarkerData={fetchMarkerData}/>}
          />
          <Route path="/dashboard" element={<Dashboard markers={markers} />} />
        </Routes>
      </div>
      <div className="flex flex-row justify-center p-2 h-full">
        <button onClick={fetchMarkerData} className="flex flex-row rounded-xl">
          <IoReloadCircle color="green" size={50} />
          <h1 className="text-xl font-bold pt-2.5 px-2">Fetch Data</h1>
        </button>

      </div>
    </Router>
  );
};

export default App;
