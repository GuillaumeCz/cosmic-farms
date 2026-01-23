import { Modal, Form, Input } from "antd";
import { type Dispatch } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const FarmModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) => {
  const [form] = Form.useForm();
  return (
    <>
      <Modal
        destroyOnHidden
        title={"New farm"}
        open={isOpen}
        onOk={() => {
          setIsOpen(false);
        }}
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        onCancel={() => setIsOpen(false)}
        modalRender={(dom) => (
          <>
            <Form
              name="create-farm"
              layout="vertical"
              form={form}
              initialValues={{ modifier: "public" }}
              clearOnDestroy
              onFinish={(values) => console.log("finish", values)}
            >
              {dom}
            </Form>
          </>
        )}
      >
        <Form.Item label={"Name"} name={"name"} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label={"Owner"} name={"owner"} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <MapContainer
          center={[44.3502628, 3.6953171]}
          maxZoom={26}
          zoom={13}
          id="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
        {/* <Map /> */}
      </Modal>
    </>
  );
};

export default FarmModal;
