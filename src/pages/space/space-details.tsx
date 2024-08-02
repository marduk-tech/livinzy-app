import { ArrowRightOutlined, BorderOuterOutlined } from "@ant-design/icons";
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
import { useFetchFixturesByProject } from "../../hooks/use-fixtures";
import useParentDimensions from "../../hooks/use-parent-dimension";
import { useFetchProject } from "../../hooks/use-projects";
import { useFetchSlidesByProject } from "../../hooks/use-slides";
import { useFetchSpacesByProject } from "../../hooks/use-spaces";
import {
  BoundingBox,
  Fixture,
  FixtureImageBounds,
} from "../../interfaces/Fixture";
import { Slide } from "../../interfaces/Slide";
import { Space } from "../../interfaces/Space";
import { maxDesktopWidth } from "../../libs/constants";
import { useDevice } from "../../libs/device";
import {
  DesignerIcon,
  DesignerNoteIcon,
  FixtureIcon,
  PhotosIcon,
  RupeesIcon,
} from "../../libs/icons";
import { COLORS, FONTS } from "../../styles/style-constants";
import ZoomedImage from "../../components/common/zoomed-img";
import { SpaceCard } from "../../components/common/space-card";

const SpaceDetails: React.FC = () => {
  const { projectId, spaceId } = useParams();
  const { isMobile } = useDevice();
  const slidesCarouselRef = useRef(null);
  const { ref, dimensions } = useParentDimensions();
  const [isCostDialogOpen, setIsCostDialogOpen] = useState(false);

  const { data: projectData, isLoading: projectDataLoading } = useFetchProject(
    projectId!
  );
  const { data: slides, isLoading: slidesLoading } = useFetchSlidesByProject(
    projectId!
  );
  const { data: spaces, isLoading: spacesLoading } = useFetchSpacesByProject(
    projectId!
  );

  const [spaceSlides, setSpaceSlides] = useState<Slide[]>();
  const [fixtureSlides, setFixtureSlides] = useState<Slide[]>();

  const [spaceFixtures, setSpaceFixtures] = useState<Fixture[]>();
  const [fixtureSelected, setFixtureSelected] = useState<Fixture>();
  const [activeSlide, setActiveSlide] = useState(0);

  const [fixtureBoundingBox, setFixtureBoundingBox] = useState<BoundingBox>();

  const [spaceData, setSpaceData] = useState<Space>();

  const { data: fixtures, isLoading: fixturesLoading } =
    useFetchFixturesByProject(projectId!);

  const onSlideChange = (currentSlide: number) => {
    setActiveSlide(currentSlide);
    updateFixtureBoundingBox();
  };

  /**
   * Set fixtures for the space
   */
  useEffect(() => {
    if (!slides || !fixtures) {
      return;
    }

    const spaceSlides = slides?.filter(
      (s: Slide) => s.spaces?.includes(spaceId!)
    );
    setSpaceSlides(spaceSlides);
    const uniqueFixturesIds: string[] = [];
    spaceSlides?.forEach((s: Slide) => {
      s.fixtures!.forEach((f: string) => {
        if (!uniqueFixturesIds.includes(f)) {
          uniqueFixturesIds.push(f);
        }
      });
    });
  }, [slides, fixtures]);

  useEffect(() => {
    if (!slides) {
      return;
    }
    const fixtureSlidesTemp = slides?.filter(
      (s: Slide) => s.fixtures?.includes(fixtureSelected?._id!)
    );
    setFixtureSlides(fixtureSlidesTemp);
    setActiveSlide(0);
    updateFixtureBoundingBox();
  }, [fixtureSelected]);

  const updateFixtureBoundingBox = () => {
    if (!fixtureSlides || !fixtureSlides.length) {
      return;
    }
    const activeSlideObj = fixtureSlides[activeSlide];
    if (
      activeSlideObj.fixturesMapping &&
      activeSlideObj.fixturesMapping.length
    ) {
      const fixtureImageMapping = activeSlideObj.fixturesMapping.find(
        (mapping: FixtureImageBounds) =>
          mapping.fixtureId == fixtureSelected?._id
      );
      if (fixtureImageMapping) {
        setFixtureBoundingBox(fixtureImageMapping?.boundingBox);
      } else {
        setFixtureBoundingBox(undefined);
      }
    }
  };

  /**
   *
   */

  useEffect(() => {
    if (!spaces || !fixtures) {
      return;
    }

    const tempSpaceData = spaces.find((space: Space) => space._id == spaceId);
    setSpaceData(tempSpaceData);
    const spaceFixtures = tempSpaceData!.fixtures.map((f: string) =>
      fixtures.find((fix: Fixture) => fix._id == f)
    );

    setSpaceFixtures(spaceFixtures);
    setFixtureSelected(spaceFixtures[0]);
  }, [spaces, fixtures]);

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

  if (
    !spaceData ||
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
      {/* The header bar including name, one liner, tags */}

      <Flex vertical style={{ padding: 16 }} gap={8}>
        {/* Space name */}
        <Typography.Title
          level={2}
          style={{ margin: 0, fontFamily: FONTS.bold }}
        >
          {spaceData.name || spaceData?.spaceType.spaceType}
        </Typography.Title>

        {/* Meta info */}
        <Flex gap={4}>
          {projectData.homeDetails?.homeType.homeType!} ·{" "}
          {projectData.homeDetails?.size} sqft
        </Flex>

        {/* One liner and buttons */}
        <Flex vertical>
          {projectData.oneLiner && (
            <Typography.Text
              style={{
                margin: 0,
                lineHeight: "120%",

                color: COLORS.textColorMedium,
                fontFamily: FONTS.regular,
              }}
            >
              {projectData.oneLiner.substring(0, 100)!}
            </Typography.Text>
          )}
          <Flex style={{ marginTop: 16 }}>
            <Button
              icon={<RupeesIcon></RupeesIcon>}
              type="link"
              onClick={() => {
                setIsCostDialogOpen(true);
              }}
              style={{
                padding: 0,
                paddingRight: 16,
                height: 32,
                color: COLORS.textColorDark,
              }}
            >
              Cost
            </Button>
            <Button
              icon={<RupeesIcon></RupeesIcon>}
              type="link"
              style={{
                padding: 0,
                paddingRight: 16,
                height: 32,
                color: COLORS.textColorDark,
              }}
            >
              Photos
            </Button>
            <Button
              icon={<DesignerIcon></DesignerIcon>}
              type="link"
              style={{
                padding: 0,
                paddingRight: 16,
                height: 32,
                color: COLORS.textColorDark,
              }}
            >
              Designer Info
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* The carousel for the space */}
      <div style={{ position: "relative" }}>
        <Carousel
          autoplay={false}
          autoplaySpeed={5000}
          speed={1000}
          ref={slidesCarouselRef}
          fade={true}
          afterChange={onSlideChange}
          style={{ width: "100%", margin: "auto" }}
        >
          {spaceSlides &&
            spaceSlides!.map((sl: Slide) => {
              const divWidth = isMobile
                ? window.innerWidth
                : Math.min(window.innerWidth * 0.58, maxDesktopWidth);

              const divHeight = isMobile ? divWidth : divWidth / 1.33333;
              if (fixtureBoundingBox) {
                return (
                  <ZoomedImage
                    label={fixtureSelected?.designName}
                    imageUrl={sl.url}
                    boundingBox={fixtureBoundingBox}
                    containerSize={{ width: divWidth, height: divHeight }}
                  ></ZoomedImage>
                );
              } else
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

        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 15,
          }}
        >
          <Link to={`/project/${projectId}/images`}>
            <Button size="small" type="default">
              {/* {activeSlide + 1} /{" "} */}
              {/* Add additional 1 to account for preview image */}
              {/* {spaceSlides?.length && spaceSlides.length + 1}{" "} */}
              <PhotosIcon />
            </Button>
          </Link>
        </div>
      </div>

      {/* Fixtures horizontal list */}
      <Flex vertical style={{ marginTop: 16, padding: 16 }} gap={8}>
        <Flex
          style={{
            overflowX: "scroll",
            width: "100%",
            whiteSpace: "nowrap",
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
        >
          {spaceFixtures && spaceFixtures.length
            ? spaceFixtures.map((fixture: Fixture) => {
                return (
                  <Flex
                    gap={8}
                    style={{
                      marginRight: 8,
                      padding: "8px 16px",
                      backgroundColor:
                        fixtureSelected?._id == fixture._id
                          ? COLORS.primaryColor
                          : "white",

                      border: "2px solid",
                      borderColor: COLORS.borderColor,
                      borderRadius: 32,
                    }}
                    onClick={() => {
                      setFixtureSelected(fixture);
                    }}
                  >
                    <Typography.Text
                      style={{
                        margin: 0,
                        fontSize: 18,
                        color:
                          fixtureSelected?._id == fixture._id
                            ? "white"
                            : COLORS.textColorDark,
                      }}
                    >
                      {fixture.fixtureType?.fixtureType!}
                    </Typography.Text>
                  </Flex>
                );
              })
            : null}
        </Flex>
      </Flex>

      <Flex style={{padding: "0px 24px", marginTop: 16}}>
        
      </Flex>

      <Flex
        gap={24}
        vertical
        style={{
          padding: 16,
          margin: 16,
          backgroundColor: "white",
          borderRadius: 16,
        }}
      >
        <Typography.Title level={3} style={{margin: 0, marginBottom: 0}}>
              {fixtureSelected?.designName}
        </Typography.Title>
        {fixtureSelected && fixtureSelected.components
          ? fixtureSelected!.components.map((component: any) => {
              return (
                <Flex align="center" gap={24}>
                  <Image
                    src={`/icons/${component.workType}.png`}
                    width={40}
                    height={40}
                  ></Image>
                  <Flex vertical style={{ width: "calc(100% - 64px)" }}>
                    <Typography.Text
                      style={{
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      {component.commonName}
                    </Typography.Text>
                    <Typography.Text
                      style={{
                        lineHeight: "100%",
                        color: COLORS.textColorLight,
                      }}
                    >
                      {component.oneLiner}
                    </Typography.Text>
                  </Flex>
                </Flex>
              );
            })
          : null}
      </Flex>

      {/* More from this project */}
      <Flex vertical style={{ padding: 16 }}>
        <Typography.Title level={4}>More from this project</Typography.Title>
        <Flex
          style={{
            whiteSpace: "nowrap",
            overflowX: "scroll",
            width: "100%",
          }}
          gap={16}
        >
          {" "}
          {validSpaces.map((space: Space) => {
            const spaceSlides = slides!.filter((s: Slide) =>
              s.spaces!.includes(space!._id!)
            );

            return (
              <SpaceCard
                cardWidth={175}
                space={space}
                slides={spaceSlides}
                projectId={projectId!}
                fixtures={fixtures}
              ></SpaceCard>
            );
          })}
        </Flex>
      </Flex>

      <Modal title="Cost Details" open={isCostDialogOpen} footer={() => <></>}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </Flex>
  );
};

export default SpaceDetails;
