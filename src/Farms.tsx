import { useState, useEffect } from 'react';
import Card from 'antd/es/card/Card';
import type { Farm } from './types';
import { Marker, Tooltip } from "react-leaflet";
import Map from './Map';
import { Link, useNavigate } from 'react-router-dom';
import { LatLng } from 'leaflet';
import { defaultFarms } from './data';

import './Farms.css';
import BaseContent from './BaseContent';

function Farms() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [viewBounds, setViewBounds] = useState<LatLng[]>();

  const navigate = useNavigate();

  useEffect(() => {
    const f = defaultFarms;
    setViewBounds(f.map(({ coordinates }) => coordinates));
    setFarms(f);
  }, []);

  return (
    <BaseContent>
      <>
        <div className='farms-list'>
          {farms && farms.map(f => (
            <Card title={f.name} key={f.id} extra={
              <Link to={`/farms/${f.id}`}>+</Link>
            }>
              <p>{f.owner}</p>
              <p>Number of parcels: {f.parcels.length}</p>
            </Card>))
          }
        </div >
        <Map viewBounds={viewBounds}>
          {farms && farms.map(f => (
            <Marker
              eventHandlers={{ click: () => navigate(`/farms/${f.id}`) }}
              position={f.coordinates}
              key={`${f.id}-map`}>
              <Tooltip>{f.name}</Tooltip>
            </Marker>
          ))}
        </Map>
      </>
    </BaseContent>
  )
}

export default Farms
