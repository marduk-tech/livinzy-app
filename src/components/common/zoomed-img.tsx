import React from "react";

interface ZoomedImageProps {
  imageUrl: string;
  imgWidth: number;
  imgHeight: number;
  boxStartX: number;
  boxStartY: number;
  boxEndX: number;
  boxEndY: number;
  divWidth: number;
  divHeight: number;
}

const ZoomedImage: React.FC<ZoomedImageProps> = ({
  imageUrl,
  imgWidth,
  imgHeight,
  boxStartX,
  boxStartY,
  boxEndX,
  boxEndY,
  divWidth,
  divHeight,
}) => {
  const boxWidth = boxEndX - boxStartX;
  const boxHeight = boxEndY - boxStartY;

  //   const zoomFactor = Math.max(divWidth / boxWidth, divHeight / boxHeight);
  const zoomFactor = 2.2;
  const backgroundSize = `${imgWidth * zoomFactor}px ${
    imgHeight * zoomFactor
  }px`;
  const centerX = (boxStartX + boxWidth / 2) * zoomFactor;
  const centerY = (boxStartY + boxHeight / 2) * zoomFactor;
  const bgPosX = divWidth / 2 - centerX;
  const bgPosY = divHeight / 2 - centerY;
  const backgroundPosition = `${bgPosX}px ${bgPosY}px`;

  return (
    <div
      style={{
        width: `${divWidth}px`,
        height: `${divHeight}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: backgroundSize,
        backgroundPosition: backgroundPosition,
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    />
  );
};

export default ZoomedImage;
