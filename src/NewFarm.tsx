import { useContext, useEffect, useState } from "react";
import { MapContext, type MapContextType } from "./Providers";
import { LatLng } from "leaflet";
import { Form, Input, Button } from "antd";
import { useMapEvents, Marker } from "react-leaflet";
import { createFarm } from "./data";
import { useNavigate } from "react-router-dom";

function NewFarm() {
  const [farmPosition, setFarmPosition] = useState<LatLng | null>(null);
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const values = Form.useWatch([], form);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const MarkerAdd = () => {
    useMapEvents({
      click(e) {
        setFarmPosition(e.latlng);
      },
    });
    return <></>;
  };
  useEffect(() => {
    setViewBounds([new LatLng(44.342956930969336, 3.69883999486035)]);
    setMapChildren(
      <>
        <MarkerAdd />
        {farmPosition && <Marker position={farmPosition} />}{" "}
      </>,
    );
  }, []);

  useEffect(() => {
    setMapChildren(
      <>
        <MarkerAdd />
        {farmPosition && <Marker position={farmPosition} />}{" "}
      </>,
    );
  }, [farmPosition]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
  }, [form, values]);

  const onFinish = (v: { owner: string; name: string }) => {
    if (farmPosition) {
      createFarm({ ...v, position: farmPosition });
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
      <Form.Item label={null}>
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
