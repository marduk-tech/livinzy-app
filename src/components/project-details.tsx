import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchSlidesByProject } from "../hooks/use-slides";
import { useFetchSpacesByProject } from "../hooks/use-spaces";
import { useFetchProject } from "../hooks/use-projects";
import {
  Carousel,
  Col,
  Drawer,
  Flex,
  Image,
  Modal,
  Row,
  Segmented,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { COLORS, FONTS } from "../styles/style-constants";
import { Slide } from "../interfaces/Slide";
import { Space } from "../interfaces/Space";
import { useFetchFixturesByProject } from "../hooks/use-fixtures";
import { useDevice } from "../libs/device";
import { Fixture } from "../interfaces/Fixture";
import { BorderOuterOutlined } from "@ant-design/icons";
import ZoomedImage from "./common/zoomed-img";
import useParentDimensions from "../hooks/use-parent-dimension";
import { maxDesktopWidth } from "../libs/constants";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams();
  const { isMobile } = useDevice();
  const slidesCarouselRef = useRef(null);
  const { ref, dimensions } = useParentDimensions();

  const { data: projectData, isLoading: projectDataLoading } = useFetchProject(
    projectId!
  );
  const { data: slides, isLoading: slidesLoading } = useFetchSlidesByProject(
    projectId!
  );
  const { data: spaces, isLoading: spacesLoading } = useFetchSpacesByProject(
    projectId!
  );

  const [slidesSortedBySpace, setSlidesSortedBySpace] = useState<Slide[]>();
  const [currentSlide, setCurrentSlide] = useState<Slide>();
  const [fixtureSelected, setFixtureSelected] = useState<Fixture>();

  const [activeSpace, setActiveSpace] = useState<string>();
  const { data: fixtures, isLoading: fixturesLoading } =
    useFetchFixturesByProject(projectId!);

  const onSlideChange = (currentSlide: number) => {
    console.log(currentSlide);
    const slideCurrent = slidesSortedBySpace![currentSlide];
    setCurrentSlide(slideCurrent);
    setActiveSpace(slideCurrent.spaces![0]);
  };

  useEffect(() => {
    if (!slides) {
      return;
    }
    const slidesSorted = slides!.sort((s1: Slide, s2: Slide) =>
      (s2.spaces && s2.spaces.length ? s2.spaces![0] : "").localeCompare(
        s1.spaces && s1.spaces.length ? s1.spaces![0] : ""
      )
    );
    setSlidesSortedBySpace(slidesSorted);
    setCurrentSlide(slidesSorted![0]);
    setActiveSpace(slidesSorted![0].spaces![0]!);
  }, [slides]);

  /**
   * Filters out spaces which are not mapped to any image
   * @param spaces
   * @returns
   */
  const filterZombieSpaces = (spaces: Space[]) => {
    return spaces.filter((s: Space) => {
      return !!slides?.find((slide: Slide) => slide.spaces?.includes(s._id!));
    });
  };

  const renderTabBar: TabsProps["renderTabBar"] = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} style={{ margin: 0, padding: "8" }} />
  );
  /**
   * Displays all spaces in a tabbed layout
   * @returns
   */
  const renderSpaces = () => {
    const validSpaces = filterZombieSpaces(spaces).sort(
      (s1: Space, s2: Space) => s2._id!.localeCompare(s1._id!)
    );
    return validSpaces.map((space: Space) => {
      return (
        <Flex
          vertical
          style={{
            padding: 16,
            margin: 16,
            borderRadius: 16,
            border: "2px solid",
            borderColor: COLORS.borderColor,
          }}
        >
          <Flex vertical gap={16}>
            <Flex align="center" gap={16}>
              <Image
                preview={false}
                src={space.spaceType.icon || "../../gen-room.png"}
                width={60}
              />
              <Flex vertical>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {space.name}
                </Typography.Title>
                {space.cost && (
                  <Typography.Text
                    style={{ margin: 0, fontSize: 20, marginTop: -4, color: COLORS.textColorMedium }}
                  >
                    ₹{space.cost}
                  </Typography.Text>
                )}
              </Flex>
            </Flex>

            {/* <InfoCircleOutlined
                  style={{ color: "white" }}
                ></InfoCircleOutlined> */}
          </Flex>
          <Flex
            gap={16}
            style={{
              borderRadius: 16,
              marginTop: 24,
              overflowX: "scroll",
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
          >
            {slides!
              .filter((s: Slide) => s.spaces!.includes(space!._id!))
              .map((s: Slide) => {
                return (
                  <div>
                    <div
                      style={{
                        backgroundImage: `url(${s!.url})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        borderRadius: 16,
                        width: Math.min(window.innerWidth, 400),
                        height: 300,
                        border: "1px solid",
                        borderColor: COLORS.borderColor,
                        flex: "none",
                      }}
                    ></div>
                  </div>
                );
              })}
          </Flex>
          {renderSpaceFixtures(space._id!)}
        </Flex>
      );
    });
  };

  const renderSpaceFixtures = (spaceId: string) => {
    if (!spaceId) {
      return;
    }
    const spaceSlides = slides?.filter(
      (s: Slide) => s.spaces?.includes(spaceId)
    );
    const uniqueFixturesIds: string[] = [];
    spaceSlides?.forEach((s: Slide) => {
      s.fixtures!.forEach((f: string) => {
        if (!uniqueFixturesIds.includes(f)) {
          uniqueFixturesIds.push(f);
        }
      });
    });

    const spaceFixtures = uniqueFixturesIds.map((f: string) =>
      fixtures.find((fo: Fixture) => fo._id == f)
    );

    return (
      <Flex wrap="wrap" style={{ marginTop: 16 }} gap={16}>
        {spaceFixtures.map((fix: Fixture, index: number) => {
          return (
            <Flex
              style={{
                padding: "8px 0",
                width: `calc(${isMobile ? "50%" : "300px"} - 16px)`,
                cursor: "pointer",
                borderBottomColor: COLORS.borderColor,
              }}
              onClick={() => {
                setFixtureSelected(fix);
              }}
              vertical
            >
              <Typography.Text
                style={{ color: COLORS.textColorLight, fontSize: "70%" }}
              >
                {fix.fixtureType?.fixtureType.toUpperCase()}
              </Typography.Text>
              <Typography.Title level={5} style={{ margin: 0 }}>
                {fix.designName || fix.fixtureType?.fixtureType}
              </Typography.Title>
            </Flex>
          );
        })}
        <Modal
          width={isMobile ? "100%" : 600}
          open={!!fixtureSelected}
          footer={[]}
          onCancel={() => {
            setFixtureSelected(undefined);
          }}
        >
          {fixtureSelected && (
            <Flex vertical>
              <Flex align="center">
                <Typography.Title style={{ margin: 0 }} level={3}>
                  {fixtureSelected?.designName ||
                    fixtureSelected?.fixtureType?.fixtureType}
                </Typography.Title>
              </Flex>
              <Flex
                gap={8}
                style={{
                  padding: "4px 0",
                  marginBottom: 16,
                }}
              >
                <Image
                  height={28}
                  src={
                    spaces.find((s: Space) => s._id == activeSpace).spaceType
                      .icon
                  }
                  preview={false}
                ></Image>
                <Typography.Text>
                  {spaces.find((s: Space) => s._id == activeSpace).name}
                </Typography.Text>
              </Flex>
              <Carousel
                autoplay={true}
                autoplaySpeed={1000}
                style={{ borderRadius: 16 }}
              >
                {slides!
                  .filter((s: Slide) =>
                    s.fixtures!.includes(fixtureSelected!._id!)
                  )
                  .map((s: Slide) => {
                    return fixtureSelected.imageBounds ? (
                      <ZoomedImage
                        imageUrl={s.url}
                        imgHeight={
                          fixtureSelected.imageBounds?.imageSize.height!
                        }
                        imgWidth={fixtureSelected.imageBounds?.imageSize.width}
                        boxStartX={fixtureSelected.imageBounds?.startPoint.x}
                        boxStartY={fixtureSelected.imageBounds?.startPoint.y}
                        boxEndX={fixtureSelected.imageBounds?.endPoint.y}
                        boxEndY={fixtureSelected.imageBounds?.endPoint.y}
                        divWidth={
                          isMobile ? window.innerWidth : dimensions.width
                        }
                        divHeight={300}
                      ></ZoomedImage>
                    ) : (
                      <div>
                        <div
                          style={{
                            backgroundImage: `url(${s!.url})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            borderRadius: 16,
                            width: "100%",
                            height: "300px",
                            border: "1px solid",
                            borderColor: COLORS.borderColor,
                            flex: "none",
                          }}
                        ></div>
                      </div>
                    );
                  })}
              </Carousel>
              <Typography.Text style={{ marginTop: 16, fontSize: 20 }}>
                {fixtureSelected?.description ||
                  fixtureSelected!.fixtureType!.description}
              </Typography.Text>
            </Flex>
          )}
        </Modal>
      </Flex>
    );
  };
  if (
    fixturesLoading ||
    slidesLoading ||
    spacesLoading ||
    projectDataLoading ||
    !projectData
  ) {
    return "Loading..";
  }

  return (
    <Flex
      vertical
      style={{
        maxWidth: isMobile ? "100%" : maxDesktopWidth,
        width: "100%",
        margin: "auto",
      }}
    >
      {/* The header bar including name, one liner, tags */}

      <Carousel
        ref={slidesCarouselRef}
        afterChange={onSlideChange}
        style={{ width: "100%", margin: "auto" }}
      >
        {slidesSortedBySpace &&
          slidesSortedBySpace!.map((sl: Slide) => {
            return (
              <div>
                <div
                  style={{
                    backgroundImage: `url(${sl!.url})`,
                    backgroundPosition: "center",
                    borderRadius: isMobile ? 0 : 16,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: isMobile
                      ? `${window.innerWidth}px`
                      : Math.min(window.innerWidth * 0.58, maxDesktopWidth) /
                        1.33333,
                    border: "1px solid",
                    borderColor: COLORS.borderColor,
                    flex: "none",
                  }}
                ></div>
              </div>
            );
          })}
      </Carousel>

      <Flex vertical style={{ padding: 16 }} gap={8}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {projectData.name}
        </Typography.Title>

        <Flex vertical>
          <Flex gap={8} style={{ marginTop: 16 }}>
            <Image
              src={projectData.designerId.profilePicture}
              width={42}
              height="auto"
              style={{ borderRadius: "50%" }}
              preview={false}
            ></Image>
            <Flex vertical>
              <Typography.Text
                style={{ color: COLORS.textColorLight, fontSize: "70%" }}
              >
                Designed By
              </Typography.Text>
              <Typography.Title level={5} style={{ margin: 0, marginTop: -4 }}>
                {projectData.designerId.designerName}
              </Typography.Title>
            </Flex>
          </Flex>

          <Flex
            vertical
            style={{
              borderBottom: "1px solid",
              borderTop: "1px solid",
              marginTop: 16,
              padding: "16px 0",
              borderBottomColor: COLORS.borderColor,
              borderTopColor: COLORS.borderColor,
            }}
            gap={8}
          >
            <Flex gap={4} style={{ color: COLORS.textColorDark }}>
              {projectData.homeDetails?.homeType.homeType!} ·
              {projectData.homeDetails?.size} sqft
            </Flex>
            {projectData.oneLiner && (
              <Typography.Text
                style={{
                  margin: 0,
                  lineHeight: "120%",
                  color: COLORS.textColorMedium,
                  fontFamily: FONTS.regular
                }}
              >
                {projectData.oneLiner!}
              </Typography.Text>
            )}
          </Flex>
        </Flex>
      </Flex>

      <Flex align="center" style={{ marginTop: 16, padding: 16 }} gap={16}>
        <BorderOuterOutlined style={{ transform: "scale(1.4)" }} />
        <Typography.Title level={3} style={{ margin: 0, marginTop: 0 }}>
          Spaces Designed
        </Typography.Title>
      </Flex>
      {renderSpaces()}
    </Flex>
  );
};

export default ProjectDetails;
