import { Button, Flex, Typography } from "antd";
import { useEffect, useState } from "react";
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
import { getMockImg } from "../../libs/lvnzy-helper";

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

  const [hasScrolled, setHasScrolled] = useState(false);

  const scrollToSpace = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 100);

      setHasScrolled(true);
    }
  };

  useEffect(() => {
    if (
      !slidesLoading &&
      !spacesLoading &&
      allSpaces &&
      slides &&
      !hasScrolled
    ) {
      // extract the space id from the URL hash
      const hash = window.location.hash;
      if (hash) {
        const spaceId = hash.substring(1);
        scrollToSpace(spaceId);
      }
    }
  }, [slidesLoading, spacesLoading, allSpaces, slides, hasScrolled]);

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
          paddingTop: 40,
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
              return null;
            }

            const spaceSlides = space.slides
              .filter((s: Slide) => {
                const slide = slidesById[s._id as string];
                return slide && slide.url; // Only keep slides with a valid URL
              })
              .map((s: Slide) => {
                const slide = slidesById[s._id as string];
                const mockImg = getMockImg(slide.url);
                return { src: slide.url, width: mockImg.width, height: mockImg.height };
              });

            return (
              <div
                id={space._id}
                key={space._id}
                style={{ marginBottom: "20px", padding: "0 24px" }}
              >
                <Typography.Title level={4}>{space.name}</Typography.Title>
                <Gallery margin={4} photos={spaceSlides} />
              </div>
            );
          })}
        </div>
      </Flex>
    );
  }

  return null;
};
