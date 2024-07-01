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
import { COLORS } from "../styles/colors";
import { Slide } from "../interfaces/Slide";
import { Space } from "../interfaces/Space";
import { useFetchFixturesByProject } from "../hooks/use-fixtures";
import { useDevice } from "../libs/device";
import { Fixture } from "../interfaces/Fixture";
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
  const renderSpaceTabs = () => {
    const validSpaces = filterZombieSpaces(spaces).sort(
      (s1: Space, s2: Space) => s2._id!.localeCompare(s1._id!)
    );
    return (
      <Tabs
        renderTabBar={renderTabBar}
        defaultActiveKey={validSpaces[0]._id}
        activeKey={activeSpace}
        onChange={(activeKey: string) => {
          const activeSlidePosition = slidesSortedBySpace!
            .map((s: Slide) => (s.spaces && s.spaces.length ? s.spaces[0] : ""))
            .indexOf(activeKey);
          (slidesCarouselRef.current! as any).goTo(activeSlidePosition);
        }}
        items={validSpaces.map((space: Space) => {
          return {
            key: space._id!,
            label: space.name.toUpperCase(),
            children: space.cost ? (
              <Flex vertical>
                <Flex
                  gap={16}
                  style={{
                    backgroundColor: COLORS.textColorDark,
                    padding: "16px 24px",
                  }}
                >
                  <Flex vertical>
                    <Typography.Text
                      style={{ color: COLORS.textColorLight, fontSize: "70%" }}
                    >
                      Approx Cost
                    </Typography.Text>
                    <Typography.Title
                      level={4}
                      style={{ color: "white", margin: 0 }}
                    >
                      ₹{space.cost}
                    </Typography.Title>
                  </Flex>
                  {/* <InfoCircleOutlined
                  style={{ color: "white" }}
                ></InfoCircleOutlined> */}
                </Flex>
                {renderSpaceFixtures()}
              </Flex>
            ) : null,
          };
        })}
      />
    );
  };

  /**
   * Tag info for a project
   * @param info
   * @returns
   */
  const renderProjectInfoTag = (info: string) => {
    return (
      <Flex
        style={{
          border: "2px solid",
          borderColor: COLORS.textColorDark,
          borderRadius: 16,
          padding: "4px 16px",
        }}
      >
        {info}
      </Flex>
    );
  };

  const renderSpaceFixtures = () => {
    if (!activeSpace) {
      return;
    }
    const spaceSlides = slides?.filter(
      (s: Slide) => s.spaces?.includes(activeSpace)
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
      <Flex vertical ref={ref}>
        {spaceFixtures.map((fix: Fixture, index: number) => {
          return (
            <Flex
              style={{
                padding: "16px 0",
                backgroundColor: COLORS.bgColor,
                cursor: "pointer",
                width: "90%",
                margin: "auto",
                marginTop: 16,
                borderBottom: "1px solid",
                borderColor: COLORS.borderColor,
              }}
              align="center"
              gap={16}
              onClick={() => {
                setFixtureSelected(fix);
              }}
            >
              <Flex
                align="center"
                justify="center"
                style={{
                  textAlign: "center",
                  width: 45,
                  backgroundColor: COLORS.bgColorDark,
                  borderRadius: 8,
                  height: 45,
                }}
              >
                <Typography.Text style={{ fontSize: 24, color: "white" }}>
                  {index + 1}
                </Typography.Text>
              </Flex>
              <Flex vertical>
                <Typography.Text
                  style={{ color: COLORS.textColorLight, fontSize: "70%" }}
                >
                  {fix.fixtureType?.fixtureType.toUpperCase()}
                </Typography.Text>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {fix.designName || fix.fixtureType?.fixtureType}
                </Typography.Title>
              </Flex>
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
                ></Image>
                <Typography.Text>
                  {spaces.find((s: Space) => s._id == activeSpace).name}
                </Typography.Text>
              </Flex>
              <Carousel style={{ borderRadius: 16 }}>
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
        {/* <Drawer
          title=""
          placement={isMobile ? "bottom" : "right"}
          size="large"
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: isMobile ? 16 : 0,
            borderBottomLeftRadius: isMobile ? 0 : 16,
            boxShadow: "0 0 8px #ccc",
          }}
          styles={{
            body: {
              padding: 16,
            },
            header: {
              display: "none",
            },
          }}
          onClose={() => {
            setFixtureSelected(undefined);
          }}
          open={!!fixtureSelected}
          getContainer={false}
        >
          {fixtureSelected && (
            <Flex vertical>
              <Flex align="center">
                <Typography.Title style={{ margin: 0 }} level={3}>
                  {fixtureSelected?.designName ||
                    fixtureSelected?.fixtureType?.fixtureType}
                </Typography.Title>
                <CloseCircleOutlined
                  onClick={() => {
                    setFixtureSelected(undefined);
                  }}
                  style={{ marginLeft: "auto", fontSize: 24 }}
                ></CloseCircleOutlined>
              </Flex>
              <Flex
                align="center"
                justify="center"
                gap={8}
                style={{
                  padding: "4px 0",
                  borderRadius: 8,
                  backgroundColor: COLORS.bgColor,
                  border: "1px solid",
                  margin: "16px 0",
                  width: 200,
                  borderColor: COLORS.borderColorDark,
                }}
              >
                <Image
                  height={28}
                  src={
                    spaces.find((s: Space) => s._id == activeSpace).spaceType
                      .icon
                  }
                ></Image>
                <Typography.Text>
                  {spaces.find((s: Space) => s._id == activeSpace).name}
                </Typography.Text>
              </Flex>
              <Carousel style={{ borderRadius: 16 }}>
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
        </Drawer> */}
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
      <Flex vertical style={{ padding: 16 }} gap={8}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {projectData.name}
        </Typography.Title>
        {/* <Typography.Text
          style={{
            margin: 0,
            color: COLORS.textColorMedium,
            lineHeight: "100%",
          }}
        >
          Efforless elegance meets clean lines in a modern minimalist haven.
        </Typography.Text>
         */}

        <Flex vertical={isMobile} gap={8}>
          <Flex gap={8}>
            <Image
              src={projectData.designerId.profilePicture}
              width={42}
              height="auto"
              style={{ borderRadius: "50%" }}
            ></Image>
            <Flex vertical>
              <Typography.Text
                style={{ color: COLORS.textColorLight, fontSize: "70%" }}
              >
                Designed By
              </Typography.Text>
              <Typography.Title level={5} style={{ margin: 0 }}>
                Harmonia Interiors
              </Typography.Title>
            </Flex>
          </Flex>
          <Flex gap={4}>
            {renderProjectInfoTag(projectData.homeDetails?.homeType.homeType!)}
            {renderProjectInfoTag(`${projectData.homeDetails?.size} sqft`)}
          </Flex>
        </Flex>
      </Flex>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
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
                          : Math.min(
                              window.innerWidth * 0.58,
                              maxDesktopWidth
                            ) / 1.33333,
                        border: "1px solid",
                        borderColor: COLORS.borderColor,
                        flex: "none",
                      }}
                    ></div>
                  </div>
                );
              })}
          </Carousel>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={8}
          lg={8}
          xl={8}
          style={{
            padding: 0,
            border: isMobile ? 0 : "2px solid",
            borderRadius: 16,
            borderColor: COLORS.borderColor,
          }}
        >
          {renderSpaceTabs()}
        </Col>
      </Row>
    </Flex>
  );
};

export default ProjectDetails;
