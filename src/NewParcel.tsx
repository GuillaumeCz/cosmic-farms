import { useContext, useEffect, useState } from "react";
import { MapContext, type MapContextType } from "./Providers";
import L, { LatLng } from "leaflet";
import { Form, Input, Button, Space, InputNumber } from "antd";
import { Tooltip, GeoJSON, Polyline, useMapEvents } from "react-leaflet";
import { colorHash, createParcel, getFarm } from "./data";
import { useNavigate, useParams } from "react-router-dom";
import type { Farm } from "./types";
import {
  geoJsonToLatLng,
  LatLngsToFeaturePolygon,
  latLngToFeaturePoint,
} from "./utils";

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
            if (p < 30) {
              setIsEditing(false);
              setPoints([...points, points[0]]);
            }
          }
          if (isEditing) {
            form.setFieldValue(`${points.length}-lat`, e.latlng.lat);
            form.setFieldValue(`${points.length}-lng`, e.latlng.lng);
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
        {isValidPolygon && (
          <>
            <GeoJSON
              key={points.reduce((acc, cur) => (acc += cur), "")}
              data={LatLngsToFeaturePolygon(points)}
              pathOptions={{ color: "grey", weight: 0.4 }}
            />
          </>
        )}
        {points.length > 0 && (
          <>
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
                  ></GeoJSON>
                  {!isValidPolygon && i >= 1 && (
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
  }, [farm, points, isValidPolygon]);

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
        <Form.Item label="points">
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
              {isValidPolygon ? "Valid" : "Not valid"}
            </div>
          )}
          {points.length > 0 &&
            points.map((p, i) => {
              const isLast = i === points.length - 1;
              const isSameAsFirst =
                p.lat === points[0].lat && p.lng === points[0].lng;
              const isException = isLast && isSameAsFirst;

              return (
                <>
                  <Space.Compact>
                    <Form.Item
                      key={p + "" + i}
                      name={`${i}-lat`}
                      rules={[{ required: true }]}
                    >
                      <>
                        <p style={{ display: "none" }}>{p.lat}</p>
                        <InputNumber
                          suffix="° N"
                          style={{ width: 200 }}
                          controls={false}
                          placeholder={"Latitude"}
                          value={isException ? points[0].lat : p.lat}
                          disabled={i !== 0 && isException}
                          onChange={(e) => {
                            if (e) {
                              const pts = [...points];
                              if (isException) {
                                pts[0].lat = e;
                                pts[-1].lat = e;
                              } else {
                                pts[i].lat = e;
                              }
                              setPoints(pts);
                              form.setFieldValue(`${i}-lat`, e);
                            }
                          }}
                        />
                      </>
                    </Form.Item>
                    <Form.Item name={`${i}-lng`} rules={[{ required: true }]}>
                      <>
                        <p style={{ display: "none" }}>{p.lng}</p>
                        <InputNumber
                          suffix="°E"
                          style={{ width: 200 }}
                          controls={false}
                          value={
                            i !== 0 && isSameAsFirst && isLast
                              ? points[0].lng
                              : p.lng
                          }
                          disabled={i !== 0 && isSameAsFirst && isLast}
                          placeholder={"Longitude"}
                          onChange={(e) => {
                            if (e) {
                              const p = [...points];
                              p[i].lng = e;
                              setPoints(p);
                              form.setFieldValue(`${i}-lng`, e);
                            }
                          }}
                        />
                      </>
                    </Form.Item>
                    <div
                      className="color"
                      style={{
                        background: colorHash.hex(`${p.lat}${p.lng}`),
                      }}
                    ></div>
                  </Space.Compact>
                </>
              );
            })}
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
