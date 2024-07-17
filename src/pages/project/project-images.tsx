import { Flex } from "antd";
import React from "react";
import Gallery from "react-photo-gallery";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/loader";
import { useFetchSlidesByProject } from "../../hooks/use-slides";
import { maxDesktopWidth } from "../../libs/constants";
import { useDevice } from "../../libs/device";
import { COLORS } from "../../styles/style-constants";

export const ProjectImagesPage: React.FC = () => {
  const { projectId } = useParams();
  const { isMobile } = useDevice();

  const { data: slides, isLoading: slidesLoading } = useFetchSlidesByProject(
    projectId!
  );

  if (slidesLoading) {
    return <Loader />;
  }

  if (slides) {
    const projectImages = slides.map((slide) => {
      return {
        src: slide.url,
        width: 4,
        height: 3,
      };
    });

    return (
      <Flex
        vertical
        style={{
          maxWidth: isMobile ? "100%" : maxDesktopWidth,
          width: "100%",
          margin: "auto",
          backgroundColor: COLORS.bgColor,
        }}
      >
        <div style={{ padding: "40px 0px" }}>
          <Gallery photos={projectImages} />
        </div>
      </Flex>
    );
  }
};
