import { Button, Flex, Typography } from "antd";
import Gallery from "react-photo-gallery";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../components/loader";
import { useFetchSlidesByProject } from "../../hooks/use-slides";
import { useFetchSpacesByProject } from "../../hooks/use-spaces";
import { Slide } from "../../interfaces/Slide";
import { Space } from "../../interfaces/Space";
import { maxDesktopWidth } from "../../libs/constants";
import { useDevice } from "../../libs/device";
import { BackIcon } from "../../libs/icons";
import { COLORS } from "../../styles/style-constants";

export const ProjectImagesPage: React.FC = () => {
  const { projectId } = useParams();
  const { isMobile } = useDevice();
  const navigate = useNavigate();

  const { data: slides, isLoading: slidesLoading } = useFetchSlidesByProject(
    projectId!
  );
  const { data: allSpaces, isLoading: spacesLoading } = useFetchSpacesByProject(
    projectId!
  );

  if (spacesLoading || slidesLoading) {
    return <Loader />;
  }

  if (allSpaces && slides) {
    // Create a mapping of slides by their IDs for quick lookup
    const slidesById = slides.reduce(
      (acc, slide) => {
        acc[slide._id as string] = slide;
        return acc;
      },
      {} as Record<string, (typeof slides)[0]>
    );

    return (
      <Flex
        vertical
        style={{
          maxWidth: isMobile ? "100%" : maxDesktopWidth,
          width: "100%",
          margin: "auto",
          backgroundColor: COLORS.bgColor,
          position: "relative",
        }}
      >
        <Button
          type="link"
          onClick={() => navigate(-1)}
          style={{ position: "fixed", top: 16, left: 16 }}
          icon={<BackIcon />}
        />

        <div style={{ padding: "0px" }}>
          {allSpaces.map((space: Space) => {
            if (space.slides.length === 0) {
              return;
            }

            const projectImages = space.slides
              .filter((s: Slide) => {
                const slide = slidesById[s._id as string];
                return slide && slide.url; // Only keep slides with a valid URL
              })
              .map((s: Slide) => {
                const slide = slidesById[s._id as string];

                return { src: slide.url, width: 4, height: 3 };
              });

            return (
              <div key={space._id} style={{ marginBottom: "20px" }}>
                <Typography.Title level={4}>{space.name}</Typography.Title>
                <Gallery photos={projectImages} />
              </div>
            );
          })}
        </div>
      </Flex>
    );
  }

  return null;
};
