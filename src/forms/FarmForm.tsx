import { useContext, useEffect, useState } from "react";
import { MapContext, type MapContextType } from "../Providers";
import { LatLng } from "leaflet";
import { Form, Input, Button, InputNumber, Space } from "antd";
import { useMapEvents, Marker } from "react-leaflet";
import { createFarm, getFarm, updateFarm } from "../data";
import { useNavigate, useParams } from "react-router-dom";
import type { Farm } from "../models";
import { geoJsonToLatLng } from "../utils";

const defaultPosition = new LatLng(44.342956930969336, 3.69883999486035);

function FarmForm() {
  const [farmPosition, setFarmPosition] = useState<LatLng>(defaultPosition);
  const { setViewBounds, setMapChildren } = useContext(
    MapContext,
  ) as MapContextType;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const values = Form.useWatch([], form);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [lat, setLat] = useState<string | number | null>();
  const [lng, setLng] = useState<string | number | null>();
  const { farmId } = useParams();
  const [farm, setFarm] = useState<Farm>();
  const [hasChanged, setHasChanged] = useState(false);
  const isUpdate = !!farmId;

  useEffect(() => {
    // is in Edit mode
    if (farmId) {
      const f: Farm | null = getFarm(farmId);
      if (f) {
        setFarm(f);
        setFarmPosition(geoJsonToLatLng(f.geojson.geometry));
      }
    }
  }, []);

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
    farmPosition && setViewBounds([farmPosition]);
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
    setLat(farmPosition.lat === defaultPosition.lat ? null : farmPosition.lat);
    setLng(farmPosition.lng === defaultPosition.lng ? null : farmPosition.lng);
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
    if (farm) {
      const { name, owner, lat, lng } = form.getFieldsValue();
      const farmLatLng = farm.getLatLngs();

      setHasChanged(
        name !== farm.name ||
          owner !== farm.owner ||
          lat !== farmLatLng[0].lat ||
          lng !== farmLatLng[0].lng,
      );
    }
  }, [form, values]);

  const onFinish = (v: {
    owner: string;
    name: string;
    lat: number;
    lng: number;
  }) => {
    if (farmPosition) {
      if (isUpdate) {
        updateFarm(farmId, { ...v, position: farmPosition });
      } else {
        createFarm({ ...v, position: farmPosition });
      }
      navigate("/farms");
    }
  };

  return (
    <Form
      key={farm ? farm.id : "farm-form"}
      name="create-farm"
      layout="vertical"
      clearOnDestroy
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        initialValue={farm && farm.name}
        label={"Name"}
        name={"name"}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={farm && farm.owner}
        label={"Owner"}
        name={"owner"}
        rules={[{ required: true }]}
      >
        <Input defaultValue={farm && farm.owner} />
      </Form.Item>
      <div>
        <Form.Item label="Localisation">
          <Space.Compact>
            <Form.Item
              name={"lat"}
              rules={[{ required: true }]}
              initialValue={farm && farm.geojson.geometry.coordinates[1]}
            >
              <>
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
            <Form.Item
              name="lng"
              rules={[{ required: true }]}
              initialValue={farm && farm.geojson.geometry.coordinates[0]}
            >
              <>
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
          disabled={isUpdate ? !hasChanged : !farmPosition || !isFormValid}
        >
          Submit
        </Button>
        <Button
          disabled={!hasChanged}
          onClick={() => {
            if (farm) {
              const { lat, lng } = farm?.getLatLngs()[0];
              form.setFieldsValue({
                name: farm.name,
                owner: farm.owner,
                lat,
                lng,
              });
              setFarmPosition(geoJsonToLatLng(farm.geojson.geometry));
            }
          }}
        >
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
}

export default FarmForm;
