import { useState, useEffect } from 'react';
import Card from 'antd/es/card/Card';
import type { Farm } from './types';
import { generateFarms } from './data';
import { Marker, Tooltip } from "react-leaflet";
import Map from './Map';
import { Link } from 'react-router-dom';
import { LatLng } from 'leaflet';
function Farms() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [viewBounds, setViewBounds] = useState<LatLng[]>();

  useEffect(() => {
    const f = generateFarms(2)
    const vb = f.map(({ coordinates }) => coordinates);
    setViewBounds(vb);
    setFarms(generateFarms(2));
  }, []);


  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '100%', margin: '5px' }}>
        {farms && farms.map(f => (
          <Card title={f.name} key={f.id} extra={
            <Link to={`/farms/${f.id}`}>+</Link>
          }>
            <p>{f.owner}</p>
            <p>{f.coordinates.toString()}</p>

          </Card>))
        }
      </div >
      <Map viewBounds={viewBounds}>
        {farms && farms.map(f => (
          <Marker position={f.coordinates} key={`${f.id}-map`}>
            <Tooltip permanent>{f.name}</Tooltip>
          </Marker>
        ))}
      </Map>
    </div >
  )
}

export default Farms
