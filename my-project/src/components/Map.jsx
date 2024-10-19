import React, { useEffect, useRef } from 'react';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const Map = ({ markers, addMarker, removeMarker }) => {
  const mapRef = useRef(null);

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
            position: marker.position,
            map: map,
            title: marker.info,
          });

          const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${marker.position.lat},${marker.position.lng}`;
          const infoWindowContent = `
            <div>
              <h4>${marker.info}</h4>
              <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </div>
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCPjN2nF6KyVeu0PLIkUQORB2TVTgg2XhA`;
      script.onload = loadMap;
      document.body.appendChild(script);
    }
  }, [markers]);

  // Randomtest addMarker
  const handleAddMarker = () => {
    const newPosition = {
      lat: 40.730610 + Math.random() * 0.01,
      lng: -73.935242 + Math.random() * 0.01,
    };
    addMarker(newPosition);
  };

  return (
    <div>
      <h2 className='text-3xl m-4'>Eco Map</h2>
      <div ref={mapRef} style={containerStyle} />
      <button className='bg-green-400 m-4 h-12 w-40 rounded-lg text-white text-xl' onClick={handleAddMarker}>Add Marker</button>
      <button className='bg-red-400 h-12 w-40 rounded-lg text-white text-xl' onClick={removeMarker}>Remove Marker</button>
    </div>
  );
};

export default Map;
