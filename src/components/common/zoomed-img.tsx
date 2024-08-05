// ZoomedImg.tsx
import { Typography } from "antd";
import React from "react";
import { COLORS } from "../../styles/style-constants";
import { useDevice } from "../../libs/device";

interface Point {
  x: number;
  y: number;
}

interface BoundingBox {
  startPoint: Point;
  endPoint: Point;
  imageSize: { width: number; height: number };
}

interface ZoomedImgProps {
  label?: string;
  imageUrl: string;
  boundingBox: BoundingBox;
  containerSize: { width: number; height: number };
}

const ZoomedImg: React.FC<ZoomedImgProps> = ({
  label,
  imageUrl,
  boundingBox,
  containerSize,
}) => {
  const { startPoint, endPoint, imageSize } = boundingBox;
  const { width: containerWidth, height: containerHeight } = containerSize;

  const { isMobile } = useDevice();
  // Calculate center of the bounding box
  const centerX = (startPoint.x + endPoint.x) / 2;
  const centerY = (startPoint.y + endPoint.y) / 2;

  // Calculate the background position to focus on the center of the bounding box
  const backgroundPosX = ((endPoint.x / imageSize.width) * 100).toFixed(2);
  const backgroundPosY = ((endPoint.y / imageSize.height) * 100).toFixed(2);

  return (
    <div
      style={{
        width: containerSize.width,
        height: containerSize.height,
      }}
    >
      <div
        className="zoom-animation"
        style={{
          border: "1px solid",
          borderRadius: isMobile ? 0 : 24,
          borderColor: COLORS.borderColor,
          width: containerSize.width,
          height: containerSize.height,
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: `${backgroundPosX}% ${backgroundPosY}%`,
          backgroundSize: "cover",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            backgroundRepeat: "no-repeat",
            backgroundImage: "url('/pointer.png')",
            top: `${((centerY / imageSize.height) * containerHeight).toFixed(2)}px`,
            left: `${((centerX / imageSize.width) * containerWidth).toFixed(2)}px`,
            width: "32px",
            backgroundSize: "cover",
            height: "32px",
            borderRadius: "50%",
            animation: "blink 2s infinite",
          }}
        ></div>
      </div>
      {/* {label && (
        <Typography.Text
          style={{
            position: "absolute",
            top: `10%`,
            left: `10%`,
            padding: 8,
            fontSize: 24,
            backgroundColor: "rgba(255,255,255,0.7)",
          }}
        >
          {label}
        </Typography.Text>
      )} */}
    </div>
  );
};

export default ZoomedImg;
