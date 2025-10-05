import { useState, useEffect } from 'react';
import Card from 'antd/es/card/Card';
import type { Farm } from './types';
import { getFarm } from './data';
import { Polygon, Tooltip } from "react-leaflet";
import Map from './Map';
import { Link, useParams } from 'react-router-dom';
import { LatLng } from 'leaflet';
function Parcels() {
  const { farmId } = useParams();
  const [farm, setFarm] = useState<Farm | null>(null)
  const [viewBounds, setViewBounds] = useState<LatLng[]>()

  useEffect(() => {
    let f;
    if (farmId) {
      f = getFarm(farmId);
      setFarm(f)
    }

    if (f && f.parcels) {
      const vb = f.parcels
        .map(({ coordinates }) => coordinates)
        .reduce((acc, cur) => [...acc, ...cur], [])
      setViewBounds(vb);
    }

  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '100%', margin: '5px' }}>
        {farm && (
          <>
            {farm.name}
            {farm.parcels.map(p => (
              <Card title={p.name} key={p.id} extra={
                <Link to={`/farms/${farm.id}/parcels/${p.id}`}>+</Link>
              }>
                <ul>
                  {p.coordinates.map((c, i) => <li key={c.toString() + i}>{c.toString()}</li>)}
                </ul>
              </Card>))
            }
          </>
        )}
      </div >
      <Map viewBounds={viewBounds}>
        {farm && farm.parcels.length > 0 && farm.parcels.map(p => (
          <Polygon pathOptions={{ color: 'red' }} positions={p.coordinates} key={`${farm.id}-${p.id}`}>
            <Tooltip permanent>{p.name}</Tooltip>
          </Polygon>
        ))}
      </Map>
    </div >
  )
}

export default Parcels;
