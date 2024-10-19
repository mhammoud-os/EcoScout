import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home'
import Map from './components/Map';
import Dashboard from './components/Dashboard';

const App = () => {
  const [markers, setMarkers] = useState([]);
  
  const removeMarker = () => {
    // if (markers.length > 0) {
    //   setMarkers(markers.slice(0, markers.length - 1));
    // }
  };

  async function addMarker(position) {
    const randId = Math.floor(Math.random() * 1000000000000000);;
    const newMarker = {
      id:  randId,
      position: position,
      info: `Marker ${randId}`,
    };
    
    
    try {
      const res = await fetch(`http://localhost:3000/markers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMarker),
      });
      fetchServerData();
      return;
  
    } catch (error) {
      console.log(error)
    }
  };

  async function fetchServerData() {
    try {
      const res = await fetch(`http://localhost:3000/markers`);
      const data = await res.json();
  
  
      if (!res.ok) {
        console.log(res);
        return;
      }
      
      console.log(data)
      
      setMarkers(data)
      // return data;
  
    } catch (error) {
      console.log(error)
    }
  };








  return (
    <Router>
      <div>
        <h1 className='text-4xl font-bold flex justify-center p-6'>EcoScout</h1>
        <div className='flex flex-row justify-center p-1 my-2 w-full h-10'>
          <button className='w-40 h-8 bg-gray-200 text-center rounded-lg' onClick={fetchServerData}>Fetch New Data</button>
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
            element={<Map markers={markers} addMarker={addMarker} removeMarker={removeMarker} />}
          />
          <Route path="/dashboard" element={<Dashboard markers={markers} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
