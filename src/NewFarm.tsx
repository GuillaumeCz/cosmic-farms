import { useContext, useEffect, useState } from "react";
import { MapContext, type MapContextType } from "./Providers";
import { LatLng } from "leaflet";
import { Form, Input, Button, InputNumber, Space } from "antd";
import { useMapEvents, Marker } from "react-leaflet";
import { createCFarm } from "./data";
import { useNavigate } from "react-router-dom";

function NewFarm() {
  const defaultValues = new LatLng(44.342956930969336, 3.69883999486035);
  const [farmPosition, setFarmPosition] = useState<LatLng>(defaultValues);
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const values = Form.useWatch([], form);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [lat, setLat] = useState<string | number | null>();
  const [lng, setLng] = useState<string | number | null>();

  const MarkerAdd = () => {
    useMapEvents({
      click(e) {
        setFarmPosition(e.latlng);
        form.setFieldValue("lat", e.latlng.lat);
        form.setFieldValue("lng", e.latlng.lng);
      },
    });
    return <></>;
  };
  useEffect(() => {
    setViewBounds([defaultValues]);
    setMapChildren(
      <>
        <MarkerAdd />
        {farmPosition && <Marker position={farmPosition} />}
      </>,
    );
  }, []);

  useEffect(() => {
    if (lng) {
      setFarmPosition(new LatLng(farmPosition.lat, Number(lng)));
    }
  }, [lng]);
  useEffect(() => {
    if (lat) {
      setFarmPosition(new LatLng(Number(lat), farmPosition.lng));
    }
  }, [lat]);

  useEffect(() => {
    setLat(farmPosition.lat === defaultValues.lat ? null : farmPosition.lat);
    setLng(farmPosition.lng === defaultValues.lng ? null : farmPosition.lng);
    setMapChildren(
      <>
        <MarkerAdd />
        {farmPosition && <Marker position={farmPosition} />}{" "}
      </>,
    );
    setViewBounds([farmPosition]);
  }, [farmPosition]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
  }, [form, values]);

  const onFinish = (v: { owner: string; name: string }) => {
    if (farmPosition) {
      createCFarm({ ...v, position: farmPosition });
      navigate("/farms");
    }
  };

  return (
    <Form
      name="create-farm"
      layout="vertical"
      clearOnDestroy
      form={form}
      onFinish={onFinish}
    >
      <Form.Item label={"Name"} name={"name"} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label={"Owner"} name={"owner"} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <div>
        <Form.Item label="Localisation">
          <Space.Compact>
            <Form.Item name={"lat"} rules={[{ required: true }]}>
              <>
                <p style={{ display: "none" }}>{farmPosition.lat}</p>
                <InputNumber
                  suffix="° N"
                  style={{ width: 200 }}
                  controls={false}
                  placeholder={"Latitude"}
                  value={lat}
                  onChange={(e) => {
                    setLat(e);
                    form.setFieldValue("lat", e);
                  }}
                />
              </>
            </Form.Item>
            <Form.Item name="lng" rules={[{ required: true }]}>
              <>
                <p style={{ display: "none" }}>{farmPosition.lng}</p>
                <InputNumber
                  suffix="°E"
                  style={{ width: 200 }}
                  controls={false}
                  value={lng}
                  placeholder={"Longitude"}
                  onChange={(e) => {
                    setLng(e);
                    form.setFieldValue("lng", e);
                  }}
                />
              </>
            </Form.Item>
          </Space.Compact>
        </Form.Item>
      </div>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!farmPosition || !isFormValid}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default NewFarm;
