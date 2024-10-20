import React, { useEffect, useRef, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const Map = ({ markers, addMarker, removeMarker, fetchMarkerData }) => {
  const mapRef = useRef(null);
  const [i1, setI1] = useState(null);
  const [i2, setI2] = useState(null);
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12,
        styles: [
          {
            featureType: 'all',
            stylers: [
              { visibility: 'on' }, 
            ],
          },
          {
            featureType: 'road',
            stylers: [
              { visibility: 'on' }, 
              { saturation: -100 },
              { lightness: 20 },
            ],
          },
          {
            featureType: 'water',
            stylers: [
              { visibility: 'on' },
              { color: '#00bfff' }, 
            ],
          },
          {
            featureType: 'landscape',
            stylers: [
              { visibility: 'on' },
              { color: '#f0f0f0' },
            ],
          },
          {
            featureType: 'poi',
            stylers: [
              { visibility: 'off' }, 
            ],
          },
          {
            featureType: 'transit',
            stylers: [
              { visibility: 'off' },
            ],
          },
        ],
      });

      // Render markers on map
      const renderMarkers = () => {
        markers.forEach((marker) => {
          const googleMarker = new window.google.maps.Marker({
            position: marker.position,
            map: map,
            title: marker.info,
          });

          const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${marker.position.lat},${marker.position.lng}`;

          const handleAddToList = () => {
            setMyList((prevList) => [...prevList, marker]);
          };

          const infoWindowContent = `
            <div>
              <h4>${marker.info}</h4>
              <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
              <br />
              <button class='listmarker'>Add to my list</button>
            </div>
          `;

          const infoWindow = new window.google.maps.InfoWindow({
            content: infoWindowContent,
          });

          googleMarker.addListener('click', () => {
            infoWindow.open(map, googleMarker);

            window.google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
              const addToListButton = document.querySelector('.listmarker');
              addToListButton.addEventListener('click', handleAddToList);
            });
          });
        });
      };

      renderMarkers(); // Init render

      // Array listener
      window.google.maps.event.addListenerOnce(map, 'idle', renderMarkers);
    };

    if (window.google) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBztOGvKNV_K2Fdn1KN-of0sPBzozab43g`; 
      script.onload = loadMap;
      document.body.appendChild(script);
    }
  }, [markers]);

  // Randomtest addMarker
  const handleAddMarker = () => {
    const newPosition = {
      lat: Number(i1),
      lng: Number(i2),
    };
    
    if (i1 != null || i2 != null) {
      addMarker(newPosition);
      setI1(null)
      setI1(null)
    }
  };

  const handleI1 = (event) => {
    setI1(event.target.value);
  };

  const handleI2 = (event) => {
    setI2(event.target.value);
  };


  const generateRouteLink = () => {
    if (myList.length < 2) {
      return '';
    }

    const origin = myList[0].position;
    const destination = myList[myList.length - 1].position;
    const waypoints = myList
      .slice(1, -1)
      .map((marker) => `${marker.position.lat},${marker.position.lng}`)
      .join('|');

    const routeLink = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&waypoints=${waypoints}`;
    return routeLink;
  };

  return (
    <div>
      <h2 className='text-3xl m-4'>Litter Locator</h2>
      <div ref={mapRef} style={containerStyle} />
      
      <div className='flex flex-row w-full m-4'>
        <div className='flex flex-col flex-shrink w-min h-min bg-green-600 rounded-lg p-2 mr-4'>
          <h1 className='text-white font-bold text-xl my-2'>Report Litter</h1>
          <p className='text-white'>Latitude</p>
          <input
            type="text"
            value={i1} 
            onChange={(e) => setI1(e.target.value)} 
            placeholder="Enter value" 
            className='w-full h-6 my-2'>
          </input>


          <p className='text-white'>Longitude</p>
          <input
            type="text"
            value={i2} 
            onChange={(e)=> setI2(e.target.value)} 
            placeholder="Enter value" 
            className='w-full h-6 my-2'>
          </input>



          <button className='bg-green-400 h-12 w-40 rounded-lg text-white text-xl' onClick={handleAddMarker}>Report</button>
        </div>
        <div className='flex flex-col flex-shrink w-min h-min bg-red-600 rounded-lg p-2 mr-4'>
          <h1 className='text-white font-bold text-xl my-2'>Collected Litter</h1>
          <p className='text-white'>ID</p>
          <input
            type="text"
            value={i1} 
            onChange={console.log("")} 
            placeholder="Enter value" 
            className='w-full h-6 my-2'>
          </input>

          <button className='bg-red-400 h-12 w-40 rounded-lg text-white text-xl' onClick={() => console.log(myList)}>Submit</button>
        </div>

        <div>
          <div className='flex flex-col w-60 bg-blue-600 rounded-lg p-2'>
            <h1 className='text-white font-bold text-xl my-2'>My List</h1>
            {myList.length > 0 ? (
              <ul className='text-white'>
                {myList.map((marker, index) => (
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${marker.position.lat},${marker.position.lng}`, '_blank')} className="bg-blue-400 my-1 p-1 rounded-lg" key={index}>
                    {marker.info} - ({marker.position.lat}, {marker.position.lng})
                  </button>
                ))}
              </ul>
            ) : (
              <p className='text-white'>No markers added</p>
            )}
          </div>

          {myList.length >= 2 && (
          <button
            onClick={() => window.open(generateRouteLink())}
            target="_blank"
            rel="noopener noreferrer"
            className='bg-blue-500 text-white my-2 py-2 px-4 rounded w-full'
          >
            Get Route
          </button>
          )}
        </div>
        

      </div>
    </div>
  );
};

export default Map;
