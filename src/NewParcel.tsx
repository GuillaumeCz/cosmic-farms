import { useContext, useEffect, useState } from "react";
import { MapContext, type MapContextType } from "./Providers";
import L, { LatLng } from "leaflet";
import { Form, Input, Button } from "antd";
import { Tooltip, GeoJSON, Polyline, useMapEvents } from "react-leaflet";
import { createParcel, getFarm } from "./data";
import { useNavigate, useParams } from "react-router-dom";
import type { Farm } from "./types";
import { geoJsonToLatLng, latLngToFeaturePoint } from "./utils";

function NewParcel() {
  const [farm, setFarm] = useState<Farm>();
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { farmId } = useParams();
  const [points, setPoints] = useState<LatLng[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [isValidPolygon, setIsValidPolygon] = useState<boolean>(false);
  const values = Form.useWatch([], form);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const MarkerAdd = () => {
    useMapEvents({
      click(e) {
        if (isEditing) {
          if (points.length >= 1) {
            // If last point less than 15 meters away...
            const p = points[0].distanceTo(e.latlng);
            if (p < 15) {
              setIsEditing(false);
              setPoints([...points, points[0]]);
            }
          }
          if (isEditing) {
            setPoints([...points, e.latlng]);
          }
        }
      },
    });
    return <></>;
  };

  useEffect(() => {
    const first: LatLng = points[0];
    const last: LatLng = points.slice(-1)[0];
    const isValid =
      points.length > 2 && first.lng === last.lng && first.lat === last.lat;
    setIsValidPolygon(isValid);
  }, [points]);
  useEffect(() => {
    let f;
    if (farmId) {
      f = getFarm(farmId);
      if (f) {
        setFarm(f);

        setViewBounds([geoJsonToLatLng(f.coordinates.geometry)]);
      }
    }
  }, []);

  useEffect(() => {
    setMapChildren(
      <>
        <MarkerAdd />
        {farm && (
          <GeoJSON
            data={farm.coordinates}
            key={`${farm.id}`}
            pointToLayer={(_, pos) => L.circleMarker(pos, { radius: 8 })}
            pathOptions={{ color: farm.color }}
          >
            <Tooltip>{farm.name}</Tooltip>{" "}
          </GeoJSON>
        )}
        {points.length > 0 && (
          <>
            {points.map((p, i) => (
              <>
                <GeoJSON
                  data={latLngToFeaturePoint(p)}
                  key={p.toString()}
                  pathOptions={{ color: "#fff" }}
                  pointToLayer={(_, pos) => L.circleMarker(pos, { radius: 8 })}
                  eventHandlers={{
                    click: (e) => {
                      const c = points.filter(
                        (p) => p.lng !== e.latlng.lng && p.lat !== e.latlng.lat,
                      );
                      setPoints(c);
                    },
                  }}
                />
                {i >= 1 && (
                  <>
                    <Polyline
                      key={p.toString() + "-blap"}
                      positions={[points[i - 1], p]}
                    />
                  </>
                )}
              </>
            ))}
          </>
        )}
      </>,
    );
  }, [farm, points]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
  }, [form, values]);

  const onFinish = (v: { name: string }) => {
    if (farmId) {
      createParcel(farmId, { ...v, position: points });
      navigate(`/farms/${farmId}`);
    }
  };

  return (
    <>
      {farm && (
        <>
          {farm.name} - {farm.owner}
        </>
      )}
      {points.length > 0 && (
        <div>
          <Button
            onClick={() => {
              const p = [...points];
              p.pop();
              setPoints(p);
            }}
          >
            Undo
          </Button>
          <Button
            onClick={() => {
              setIsEditing(true);
              setPoints([]);
            }}
          >
            Erase
          </Button>
        </div>
      )}

      <Form
        name="create-parcel"
        layout="vertical"
        clearOnDestroy
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label={"Name"} name={"name"} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isValidPolygon || !isFormValid}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default NewParcel;
