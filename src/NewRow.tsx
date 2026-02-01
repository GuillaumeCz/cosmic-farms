import { useContext, useEffect, useState } from "react";
import { MapContext, type MapContextType } from "./Providers";
import L, { LatLng } from "leaflet";
import { Form, Input, Button, Space, InputNumber } from "antd";
import { GeoJSON, Polyline, useMapEvents } from "react-leaflet";
import { colorHash, createRow, getBoard, getFarm, getParcel } from "./data";
import { useNavigate, useParams } from "react-router-dom";
import { latLngToFeaturePoint } from "./utils";
import { Board, Farm, Parcel } from "./models";
import FarmElts from "./map/FarmElts";
import ParcelElts from "./map/ParcelElts";
import type { Feature } from "geojson";
import { booleanContains, point, polygon } from "@turf/turf";
import BoardElts from "./map/BoardElts";
import RowElts from "./map/RowElts";

function NewRow() {
  const [farm, setFarm] = useState<Farm>();
  const [parcel, setParcel] = useState<Parcel>();
  const [board, setBoard] = useState<Board>();
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { farmId, parcelId, boardId } = useParams();
  const [points, setPoints] = useState<LatLng[]>([]);
  const [createAnother, setCreateAnother] = useState(false);

  const values = Form.useWatch([], form);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const MarkerAdd = () => {
    useMapEvents({
      click(e) {
        if (board) {
          const figure: Feature = polygon(board.geojson.geometry.coordinates);
          const pt: Feature = point([e.latlng.lng, e.latlng.lat]);
          const isInside = booleanContains(figure, pt);
          if (isInside && points.length < 2) {
            setPoints([...points, e.latlng]);
            form.setFieldValue(`${points.length}-lat`, e.latlng.lat);
            form.setFieldValue(`${points.length}-lng`, e.latlng.lng);
          }
        }
      },
    });
    return <></>;
  };

  useEffect(() => {
    let f, p, b;
    if (farmId && parcelId && boardId) {
      f = getFarm(farmId);
      p = getParcel(farmId, parcelId);
      b = getBoard(farmId, parcelId, boardId);

      if (f && p && b) {
        setFarm(f);
        setParcel(p);
        setBoard(b);

        setViewBounds(b.getLatLngs());
      }
    }
  }, []);

  useEffect(() => {
    setMapChildren(
      <>
        <MarkerAdd />
        {farm && parcel && board && (
          <>
            <FarmElts farms={[farm]} />
            <ParcelElts parcels={[parcel]} />
            <BoardElts boards={[board]} />
            <RowElts rows={board.rows} />
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
  }, [farm, points]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
  }, [form, values]);

  const onFinish = (v: { name: string }) => {
    if (farmId && parcelId && boardId) {
      try {
        createRow(farmId, parcelId, boardId, { ...v, position: points });
        if (createAnother) {
          form.resetFields();
          setPoints([]);
          navigate(
            `/farms/${farmId}/parcels/${parcelId}/boards/${boardId}/new`,
          );
        } else {
          navigate(`/farms/${farmId}/parcels/${parcelId}`);
        }
      } catch (err) {
        console.error("Cannot create row");
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

      <div>New Row</div>

      <Form
        name="create-row"
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
            disabled={points.length === 0 || points.length > 2 || !isFormValid}
          >
            Submit
          </Button>
          <Button
            onClick={() => setCreateAnother(true)}
            disabled={points.length === 0 || points.length > 2 || !isFormValid}
            htmlType="submit"
          >
            Submit and create another
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default NewRow;
