import React, { useEffect, useRef, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const Map = ({ markers, addMarker, removeMarker, fetchMarkerData }) => {
  const mapRef = useRef(null);
  const [i1, setI1] = useState(null);
  const [i2, setI2] = useState(null);

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


      const renderMarkers = () => {
        markers.forEach((marker) => {
          const googleMarker = new window.google.maps.Marker({
            lat: marker.lat,
            lng: marker.lng,
            map: map,
            title: marker.description,
          });

          const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${marker.lat},${marker.lng}`;
          const infoWindowContent = `
            <div>
              <h4>${marker.info}</h4>
              <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </div>
            <div>Add to my list</div>
          `;

          const infoWindow = new window.google.maps.InfoWindow({
            content: infoWindowContent,
          });

          googleMarker.addListener('click', () => {
            infoWindow.open(map, googleMarker);
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAWlcji8i4XZiiL6WGa2PMg7C-E6yGvFC4`;
      script.onload = loadMap;
      document.body.appendChild(script);
    }
  }, [markers]);

  // Randomtest addMarker
  const handleAddMarker = () => {
    const newPosition = [
      Number(i1), Number(i2)
    ];

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

  return (
    <div>
      <h2 className='text-3xl m-4'>Litter Map</h2>
      <div ref={mapRef} style={containerStyle} />
      
      <div className='flex flex-row w-full m-4'>
        <div className='flex flex-col flex-shrink w-min bg-green-600 rounded-lg p-2 mr-4'>
          <h1 className='text-white font-bold text-xl my-2'>Report Litter</h1>
          <p className='text-white'>Latitude</p>
          <input
            type="text"
            value={i1} 
            onChange={handleI1} 
            placeholder="Enter value" 
            className='w-full h-6 my-2'>
          </input>


          <p className='text-white'>Longitude</p>
          <input
            type="text"
            value={i2} 
            onChange={handleI2} 
            placeholder="Enter value" 
            className='w-full h-6 my-2'>
          </input>



          <button className='bg-green-400 h-12 w-40 rounded-lg text-white text-xl' onClick={handleAddMarker}>Report</button>
        </div>

        <div className='flex flex-col flex-shrink w-min h-min bg-red-600 rounded-lg p-2 mr-4'>
          <h1 className='text-white font-bold text-xl my-2'>Litter Collected</h1>
          <p className='text-white'>Litter Id</p>
          <input
            type="text"
            value={i1} 
            onChange={handleI1} 
            placeholder="Enter value" 
            className='w-full h-6 my-2'>
          </input>

          <button className='bg-red-400 h-12 w-40 rounded-lg text-white text-xl' onClick={removeMarker}>Report</button>
        </div>
      </div>


    </div>
  );
};

export default Map;
