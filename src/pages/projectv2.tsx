import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchSlidesByProject } from "../hooks/use-slides";
import { useFetchSpacesByProject } from "../hooks/use-spaces";
import { useFetchProject } from "../hooks/use-projects";
import { Carousel, Col, Flex, Row, Tabs, Typography } from "antd";
import { COLORS } from "../styles/colors";
import { Slide } from "../interfaces/Slide";
import { Space } from "../interfaces/Space";
import { useFetchFixturesByProject } from "../hooks/use-fixtures";
import { useDevice } from "../libs/device";
import { Fixture } from "../interfaces/Fixture";
import { InfoCircleOutlined } from "@ant-design/icons";

const ProjectV2: React.FC = () => {
  const { projectId } = useParams();
  const { isMobile } = useDevice();
  const slidesCarouselRef = useRef(null);

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

  const [activeTab, setActiveTab] = useState<string>();
  const { data: fixtures, isLoading: fixturesLoading } =
    useFetchFixturesByProject(projectId!);

  const onSlideChange = (currentSlide: number) => {
    console.log(currentSlide);
    const slideCurrent = slidesSortedBySpace![currentSlide];
    setCurrentSlide(slideCurrent);
    setActiveTab(slideCurrent.spaces![0]);
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
    setActiveTab(slidesSorted![0].spaces![0]!);
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
        defaultActiveKey={validSpaces[0]._id}
        activeKey={activeTab}
        onChange={(activeKey: string) => {
          const activeSlidePosition = slidesSortedBySpace!
            .map((s: Slide) => (s.spaces && s.spaces.length ? s.spaces[0] : ""))
            .indexOf(activeKey);
          (slidesCarouselRef.current! as any).goTo(activeSlidePosition);
        }}
        items={validSpaces.map((space: Space) => {
          return {
            key: space._id!,
            label: (
              <Typography.Text style={{ padding: 8 }}>
                {space.name}
              </Typography.Text>
            ),
            children: space.cost ? (
              <Flex
                gap={16}
                style={{
                  backgroundColor: COLORS.textColorDark,
                  padding: "16px 24px"
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ color: "white", margin: 0 }}
                >
                  ₹{space.cost}
                </Typography.Title>
                <InfoCircleOutlined
                  style={{ color: "white" }}
                ></InfoCircleOutlined>
              </Flex>
            ) : null
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
          padding: "4px 16px"
        }}
      >
        {info}
      </Flex>
    );
  };

  const renderSpaceFixtures = () => {
    if (!activeTab) {
      return;
    }
    const spaceSlides = slides?.filter(
      (s: Slide) => s.spaces?.includes(activeTab)
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

    return spaceFixtures.map((fix: Fixture, index: number) => {
      return (
        <Flex style={{ padding: 16 }} align="center" gap={16}>
          <Flex
            align="center"
            justify="center"
            style={{
              borderRadius: "50%",
              border: "1px solid",
              borderColor: COLORS.textColorDark,
              textAlign: "center",
              width: 30,
              height: 30
            }}
          >
            <Typography.Text>{index + 1}</Typography.Text>
          </Flex>
          <Typography.Text>
            {fix.designName || fix.fixtureType?.fixtureType}
          </Typography.Text>
        </Flex>
      );
    });
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
        maxWidth: isMobile ? "100%" : 1200,
        width: "100%",
        margin: "auto"
      }}
    >
      {/* The header bar including name, one liner, tags */}
      <Flex vertical style={{ padding: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {projectData.name}
        </Typography.Title>
        <Typography.Text style={{ margin: 0 }}>
          Efforless elegance meets clean lines in a modern minimalist haven.
        </Typography.Text>
        <Flex style={{ marginTop: 16 }} gap={8}>
          {renderProjectInfoTag(projectData.homeDetails?.homeType.homeType!)}
          {renderProjectInfoTag(`${projectData.homeDetails?.size} sqft`)}
        </Flex>
      </Flex>
      <Row>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Carousel
            ref={slidesCarouselRef}
            afterChange={onSlideChange}
            style={{ width: "97%", margin: "auto" }}
          >
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
                        borderRadius: 16,
                        width: "100%",
                        height: isMobile
                          ? `${window.innerWidth}px`
                          : Math.min(window.innerWidth * 0.66666, 1200) /
                            1.33333,
                        border: "1px solid",
                        borderColor: COLORS.borderColor,
                        flex: "none"
                      }}
                    ></div>
                  </div>
                );
              })}
          </Carousel>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          {renderSpaceTabs()}
          {renderSpaceFixtures()}
        </Col>
      </Row>
    </Flex>
  );
};

export default ProjectV2;
