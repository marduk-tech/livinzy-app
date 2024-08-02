// ZoomedImg.tsx
import { Typography } from "antd";
import React from "react";
import { COLORS } from "../../styles/style-constants";

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
        position: "relative",
      }}
    >
      <div
        className="zoom-animation"
        style={{
          width: containerSize.width,
          height: containerSize.height,
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: `${backgroundPosX}% ${backgroundPosY}%`,
          backgroundSize: "cover",
          position: "relative",
          animation: "zoom-animation 7s infinite ease-in-out",
        }}
      ></div>
      {label && (
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
      )}
      {/* <div  style={{
            position: "absolute",
            top: `${((centerY / imageSize.height) * 80).toFixed(2)}%`,
            left: `${((centerX / imageSize.width) * 80).toFixed(2)}%`,
            backgroundColor: COLORS.primaryColor,
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            animation: "blink 1s infinite"
          }}></div> */}
    </div>
  );
};

export default ZoomedImg;
