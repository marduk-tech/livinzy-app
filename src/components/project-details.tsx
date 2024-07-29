import {
  ArrowRightOutlined,
  BorderOuterOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Carousel,
  Col,
  Drawer,
  Flex,
  Image,
  Modal,
  Popover,
  Row,
  Segmented,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchFixturesByProject } from "../hooks/use-fixtures";
import useParentDimensions from "../hooks/use-parent-dimension";
import { useFetchProject } from "../hooks/use-projects";
import { useFetchSlidesByProject } from "../hooks/use-slides";
import { useFetchSpacesByProject } from "../hooks/use-spaces";
import { Fixture } from "../interfaces/Fixture";
import { Slide } from "../interfaces/Slide";
import { Space } from "../interfaces/Space";
import { maxDesktopWidth } from "../libs/constants";
import { useDevice } from "../libs/device";
import { DesignerNoteIcon } from "../libs/icons";
import { COLORS, FONTS } from "../styles/style-constants";
import ZoomedImage from "./common/zoomed-img";

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
  const [activeSlide, setActiveSlide] = useState(0);

  const [activeSpace, setActiveSpace] = useState<string>();
  const { data: fixtures, isLoading: fixturesLoading } =
    useFetchFixturesByProject(projectId!);

  const onSlideChange = (currentSlide: number) => {
    console.log(currentSlide);
    const slideCurrent = slidesSortedBySpace![currentSlide];
    setCurrentSlide(slideCurrent);
    setActiveSlide(currentSlide);
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

  function convertCostToReadableFormat(value: number) {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr"; // Crores
    } else if (value >= 100000) {
      return (value / 100000).toFixed(1).replace(/\.0$/, "") + "L"; // Lakhs
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k"; // Thousands
    }
    return value.toString();
  }

  /**
   * Displays all spaces in a tabbed layout
   * @returns
   */
  const renderSpaces = (validSpaces: Space[]) => {
    return validSpaces.map((space: Space) => {
      const slide = slides!.filter((s: Slide) =>
        s.spaces!.includes(space!._id!)
      )[0];

      return (
        <Col span={12}>
          <Flex vertical>
            <Flex>
              {slide! && (
                <div
                  style={{
                    backgroundImage: `url(${slide!.url})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 16,
                    width: "100%",
                    height: 190,
                    border: "1px solid",
                    borderColor: COLORS.borderColor,
                    flex: "none",
                  }}
                ></div>
              )}
            </Flex>

            <Flex
              gap={4}
              style={{ marginTop: 10, padding: "0px 10px" }}
              vertical
            >
              <Flex justify="space-between">
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {space.name}
                </Typography.Title>

                {space.cost && (
                  <Typography.Text
                    style={{
                      flexShrink: 0,
                      margin: 0,
                      fontFamily: FONTS.regular,
                      fontSize: 18,

                      color: COLORS.textColorMedium,
                    }}
                  >
                    ₹{convertCostToReadableFormat(space.cost)}
                  </Typography.Text>
                )}
              </Flex>

              {renderSpaceFixtures(space._id!)}
            </Flex>
          </Flex>
        </Col>
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

    const spaceFixtures = uniqueFixturesIds
      .map((f: string) => fixtures.find((fo: Fixture) => fo._id == f))
      .filter((f: Fixture) => !!f);

    return (
      <Typography.Text
        style={{
          margin: 0,
          color: COLORS.textColorMedium,
          fontFamily: FONTS.regular,
          fontSize: 14,
        }}
      >
        {spaceFixtures.map((fix: Fixture, index: number) => {
          return `${fix.designName || fix.fixtureType?.fixtureType}${
            spaceFixtures.length === index + 1 ? null : ", "
          }`;
        })}
      </Typography.Text>
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

  const validSpaces = filterZombieSpaces(spaces).sort((s1: Space, s2: Space) =>
    s2._id!.localeCompare(s1._id!)
  );

  const randomPrice = (Math.random() * (15 - 8) + 8).toFixed(1);

  return (
    <Flex
      vertical
      style={{
        maxWidth: isMobile ? "100%" : maxDesktopWidth,
        width: "100%",
        margin: "auto",
        backgroundColor: COLORS.bgColor,
        overflow: "hidden",
      }}
    >
      {/* The header bar including name, one liner, tags */}

      <div style={{ position: "relative" }}>
        <Carousel
          autoplay={true}
          ref={slidesCarouselRef}
          afterChange={onSlideChange}
          style={{ width: "100%", margin: "auto" }}
        >
          {projectData?.previewImageUrl && (
            <div>
              <div
                style={{
                  backgroundImage: `url(${projectData.previewImageUrl})`,
                  backgroundPosition: "center",
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
          )}
          {slidesSortedBySpace &&
            slidesSortedBySpace!.map((sl: Slide) => {
              return (
                <div>
                  <div
                    style={{
                      backgroundImage: `url(${sl!.url})`,
                      backgroundPosition: "center",
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

        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 15,
          }}
        >
          <Link to={`/project/${projectId}/images`}>
            <Button size="small" type="default">
              {activeSlide + 1} /{" "}
              {/* Add additional 1 to account for preview image */}
              {slidesSortedBySpace?.length &&
                slidesSortedBySpace.length + 1}{" "}
              <ArrowRightOutlined style={{ transform: "rotate(-45deg)" }} />
            </Button>
          </Link>
        </div>
      </div>

      <Flex
        vertical
        style={{
          padding: 16,
          paddingTop: 24,
        }}
        gap={12}
      >
        <Flex justify="space-between">
          <Flex vertical gap={5}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {projectData.name}
            </Typography.Title>
            <Flex
              gap={4}
              style={{
                fontSize: 14,
                color: COLORS.textColorMedium,
                fontFamily: FONTS.regular,
              }}
            >
              {projectData.homeDetails?.size} sqft ·{" "}
              {projectData.homeDetails?.homeType.homeType!}
            </Flex>
          </Flex>

          <Typography.Title
            level={4}
            style={{ margin: 0 }}
          >{`₹${randomPrice} L`}</Typography.Title>
        </Flex>

        <Flex
          vertical
          gap={12}
          style={{
            paddingBottom: 24,
            borderBottom: "1px solid",
            borderBottomColor: COLORS.borderColorDark,
          }}
        >
          <Flex vertical gap={8}>
            {projectData.oneLiner && (
              <Typography.Text
                style={{
                  margin: 0,
                  color: COLORS.textColorMedium,
                  fontFamily: FONTS.regular,
                  fontSize: 14,
                }}
              >
                {projectData.oneLiner!}
              </Typography.Text>
            )}
          </Flex>

          <Flex
            justify="space-between"
            align="center"
            style={{ marginTop: 12 }}
          >
            <Flex gap={8} align="center">
              <Image
                src={projectData.designerId.profilePicture}
                width={44}
                height="auto"
                style={{ borderRadius: "50%" }}
                preview={false}
              ></Image>

              <Flex vertical>
                <Typography.Text
                  style={{
                    color: COLORS.textColorMedium,
                    fontSize: 14,
                    fontFamily: FONTS.regular,
                  }}
                >
                  Designed By
                </Typography.Text>

                <Typography.Title
                  level={5}
                  style={{ margin: 0, marginTop: -2 }}
                >
                  {projectData.designerId.designerName}
                </Typography.Title>
              </Flex>
            </Flex>

            <HeartOutlined
              style={{ fontSize: "24px", color: COLORS.primaryColor }}
            />
          </Flex>
        </Flex>
      </Flex>

      {/* <Flex align="center" style={{ marginTop: 16, padding: 16 }} gap={16}>
        <BorderOuterOutlined
          style={{ transform: "scale(1.4)", color: COLORS.textColorMedium }}
        />
        <Typography.Title
          level={4}
          style={{ margin: 0, marginTop: 0, color: COLORS.textColorMedium }}
        >
          Spaces Designed
        </Typography.Title>
      </Flex> */}

      <Row
        gutter={[24, 40]}
        style={{
          padding: 16,
          marginTop: 10,
        }}
      >
        {renderSpaces(validSpaces)}
      </Row>
    </Flex>
  );
};

export default ProjectDetails;

{
  /* <Carousel
          autoplay={true}
          ref={slidesCarouselRef}
          afterChange={onSlideChange}
          style={{ width: "100%", margin: "auto" }}
        >
          {projectData?.previewImageUrl && (
            <div>
              <div
                style={{
                  backgroundImage: `url(${projectData.previewImageUrl})`,
                  backgroundPosition: "center",
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
          )}
          {slidesSortedBySpace &&
            slidesSortedBySpace!.map((sl: Slide) => {
              return (
                <div>
                  <div
                    style={{
                      backgroundImage: `url(${sl!.url})`,
                      backgroundPosition: "center",
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
        </Carousel> */
}

{
  /* <Row >
              {validSpaces.map((space: Space) => {
                return (
                  <Col span={12}>
                    <Flex vertical align="center" style={}>
                      <Image
                        width={80}
                        height={80}
                        src={space.spaceType.icon}
                        style={{ filter: COLORS.textColorMediumFilter }}
                      ></Image>
                      <Typography.Text
                        style={{
                          color: COLORS.textColorMedium,
                          fontSize: "80%",
                        }}
                      >
                        {space.name}
                      </Typography.Text>
                    </Flex>
                  </Col>
                );
              })}
            </Row> */
}
