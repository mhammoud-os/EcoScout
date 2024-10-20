import React from 'react';

const Dashboard = ({ markers }) => {
  return (
    <div>
      <h2 className='text-3xl m-4'>Dashboard</h2>
      <table className='m-4 w-2/3 h-1/2 text-center'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {markers.map((marker) => (
            <tr key={marker.id}>
              <td>{marker.id}</td>
              <td>{marker.lat}</td>
              <td>{marker.lng}</td>
              <td>{marker.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
