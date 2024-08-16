import { Modal, Typography } from "antd";
import { FixtureComponent } from "../interfaces/Fixture";
import { Loader } from "./loader";

interface ComponentInfoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedComponent: FixtureComponent | undefined;
  isLoading: boolean;
}

export const ComponentInfoModal: React.FC<ComponentInfoProps> = ({
  open,
  setOpen,
  isLoading,
  selectedComponent,
}) => {
  if (!selectedComponent) {
    return null;
  }

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          {selectedComponent.commonName}
        </Typography.Title>
      }
      open={open}
      onCancel={handleCancel}
      footer={false}
    >
      {isLoading && <Loader />}

      <>
        <Typography.Title level={4}>
          {selectedComponent.genDetails?.brandDescription.title}
        </Typography.Title>
        <Typography.Text>
          {selectedComponent.genDetails?.brandDescription.description}
        </Typography.Text>
      </>

      {selectedComponent.genDetails?.benefitUsages.map((b) => {
        return (
          <>
            <Typography.Title level={4}>{b.title}</Typography.Title>
            <Typography.Text>{b.description}</Typography.Text>
          </>
        );
      })}
    </Modal>
  );
};
