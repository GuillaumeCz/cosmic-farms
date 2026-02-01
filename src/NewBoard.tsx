import { useContext, useEffect, useState } from "react";
import { MapContext, type MapContextType } from "./Providers";
import L, { LatLng } from "leaflet";
import { Form, Input, Button, Space, InputNumber } from "antd";
import { GeoJSON, Polyline, useMapEvents } from "react-leaflet";
import { colorHash, createBoard, getFarm, getParcel } from "./data";
import { useNavigate, useParams } from "react-router-dom";
import { LatLngsToFeaturePolygon, latLngToFeaturePoint } from "./utils";
import { Farm, Parcel } from "./models";
import FarmElts from "./map/FarmElts";
import ParcelElts from "./map/ParcelElts";
import type { Feature } from "geojson";
import { booleanContains, point, polygon } from "@turf/turf";
import BoardElts from "./map/BoardElts";

function NewBoard() {
  const [farm, setFarm] = useState<Farm>();
  const [parcel, setParcel] = useState<Parcel>();
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { farmId, parcelId } = useParams();
  const [points, setPoints] = useState<LatLng[]>([]);
  const [isValidPolygon, setIsValidPolygon] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState(false);
  const [createAnother, setCreateAnother] = useState(false);

  const values = Form.useWatch([], form);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const MarkerAdd = () => {
    useMapEvents({
      click(e) {
        if (parcel) {
          const figure: Feature = polygon(parcel.geojson.geometry.coordinates);
          const pt: Feature = point([e.latlng.lng, e.latlng.lat]);
          const isInside = booleanContains(figure, pt);
          if (isInside) {
            if (points.length > 0 && points[0].distanceTo(e.latlng) < 3) {
              setIsClosed(true);
              setPoints([...points, points[0]]);
              form.setFieldValue(`${points.length}-lat`, e.latlng.lat);
              form.setFieldValue(`${points.length}-lng`, e.latlng.lng);
            } else {
              if (!isClosed) {
                setPoints([...points, e.latlng]);
                form.setFieldValue(`${points.length}-lat`, e.latlng.lat);
                form.setFieldValue(`${points.length}-lng`, e.latlng.lng);
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
      const firstEqualLast =
        points.length > 2 && first.lng === last.lng && first.lat === last.lat;
      setIsValidPolygon(firstEqualLast);
    }
  }, [isClosed]);

  useEffect(() => {
    let f;
    let p;
    if (farmId && parcelId) {
      f = getFarm(farmId);
      p = getParcel(farmId, parcelId);

      if (f && p) {
        setFarm(f);
        setParcel(p);

        setViewBounds([...p.getLatLngs()]);
      }
    }
  }, []);

  useEffect(() => {
    setMapChildren(
      <>
        <MarkerAdd />
        {farm && parcel && (
          <>
            <FarmElts farms={[farm]} />
            <ParcelElts parcels={[parcel]} />
            <BoardElts boards={parcel.boards} />
          </>
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
    if (farmId && parcelId) {
      try {
        createBoard(farmId, parcelId, { ...v, position: points });
        if (createAnother) {
          form.resetFields();
          setPoints([]);
          navigate(`/farms/${farmId}/parcels/${parcelId}/new`);
        } else {
          navigate(`/farms/${farmId}/parcels/${parcelId}/`);
        }
      } catch (err) {
        console.error("Cannot create board");
      }
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
          <Button
            onClick={() => setCreateAnother(true)}
            disabled={!isValidPolygon || !isFormValid}
            htmlType="submit"
          >
            Submit and create another
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default NewBoard;
