import { useContext, useEffect, useState } from "react";
import type { Farm, Parcel } from "./types";
import { colorHash, getFarm, getParcel } from "./data";
import { useParams } from "react-router-dom";
import { geometryToLatLng, latLngToFeaturePoint } from "./utils";
import { MapContext, type MapContextType } from "./Providers";
import ParcelElts from "./map/ParcelElts";
import { useMapEvents, GeoJSON, Polyline } from "react-leaflet";
import L, { LatLng, Point } from "leaflet";
import { booleanContains, point, polygon } from "@turf/turf";
import { type Feature } from "geojson";

const NewBoard = () => {
  const [farm, setFarm] = useState<Farm>();
  const [parcel, setParcel] = useState<Parcel>();
  const [points, setPoints] = useState<LatLng[]>([]);
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [isValidPolygon, setIsValidPolygon] = useState<boolean>(false);

  const { farmId, parcelId } = useParams();
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;

  const MarkerAdd = () => {
    useMapEvents({
      click(e) {
        if (parcel) {
          const figure: Feature = polygon(
            parcel.coordinates.geometry.coordinates,
          );
          const pts: Feature = point([e.latlng.lng, e.latlng.lat]);
          const isInside = booleanContains(figure, pts);
          if (isInside) {
            if (points.length > 0 && points[0].distanceTo(e.latlng) < 3) {
              setIsClosed(true);
              setPoints([...points, points[0]]);
            } else {
              if (!isClosed) {
                setIsClosed(false);
                setPoints([...points, e.latlng]);
              }
            }
          }
        }
      },
    });
    return <></>;
  };

  useEffect(() => {
    if (isClosed) {
      const first: LatLng = points[0];
      const last: LatLng = points.slice(-1)[0];
      // checks if first === last
      const isFirstEqualLast =
        points.length > 2 && first.lng === last.lng && first.lat === last.lat;
      // checks if the newly created polygon fits in the parcel
      console.log(points.map((p) => [p.lat, p.lng]));
      const n: Feature = polygon(points.map((p) => [p.lat, p.lng]));

      // const fitsInParcel = polygon(points);
      // setIsValidPolygon(isFirstEqualLast && fitsInParcel);
    }
  }, [isClosed]);

  useEffect(() => {
    let f;
    let p;
    if (farmId && parcelId) {
      f = getFarm(farmId);
      p = getParcel(farmId, parcelId);
      if (f) {
        setFarm(f);
      }
      if (p) {
        setParcel(p);
        setViewBounds(geometryToLatLng(p.coordinates.geometry));
      }
    }
  }, []);

  useEffect(() => {
    setMapChildren(
      <>
        <MarkerAdd />
        {parcel && (
          <>
            <ParcelElts parcels={[parcel]} />
            {points.map((p, i) => {
              return (
                <>
                  <GeoJSON
                    data={latLngToFeaturePoint(p)}
                    key={p.toString()}
                    pathOptions={{ color: colorHash.hex(`${p.lat}${p.lng}`) }}
                    pointToLayer={(_, pos) =>
                      L.circleMarker(pos, { radius: 8 })
                    }
                    eventHandlers={{
                      click: (e) => {
                        const c = points.filter(
                          (r) =>
                            r.lng !== e.latlng.lng && r.lat !== e.latlng.lat,
                        );
                        setPoints(c);
                      },
                    }}
                  />
                  {i >= 1 && (
                    <Polyline
                      key={p.toString() + "-line"}
                      positions={[points[i - 1], p]}
                      pathOptions={{ color: "grey", weight: 1 }}
                    />
                  )}
                </>
              );
            })}
          </>
        )}
      </>,
    );
  }, [parcel, points]);

  return (
    <>
      {farm && (
        <>
          {farm.name} - {farm.owner}{" "}
        </>
      )}
    </>
  );
};

export default NewBoard;
