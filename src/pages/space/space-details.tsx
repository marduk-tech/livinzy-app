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
import { Link, useNavigate, useParams } from "react-router-dom";
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
  BackIcon,
  DesignerIcon,
  DesignerNoteIcon,
  FixtureIcon,
  LikeIcon,
  PhotosIcon,
  RupeesIcon,
} from "../../libs/icons";
import { COLORS, FONTS } from "../../styles/style-constants";
import ZoomedImage from "../../components/common/zoomed-img";
import { SpaceCard } from "../../components/common/space-card";
import { formatCost } from "../../libs/lvnzy-helper";
import Paragraph from "antd/es/typography/Paragraph";

const SpaceDetails: React.FC = () => {
  const { projectId, spaceId } = useParams();
  const { isMobile } = useDevice();
  const slidesCarouselRef = useRef(null);
  const [isCostDialogOpen, setIsCostDialogOpen] = useState(false);
  const navigate = useNavigate();

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

  const [uniqueBrands, setUniqueBrands] = useState<String[]>();

  const onSlideChange = (currentSlide: number) => {
    if (!fixtureSlides || !fixtureSlides.length) {
      return;
    }
    setActiveSlide(currentSlide);
    updateFixtureBoundingBox(fixtureSlides[currentSlide]);
  };

  useEffect(() => {
    if (!spaceData) {
      return;
    }
    setSpaceSlides(spaceData.slides);
  }, [spaceData]);

  useEffect(() => {
    if (!slides) {
      return;
    }
    const fixtureSlidesTemp = slides?.filter((s: Slide) =>
      s.fixtures?.includes(fixtureSelected?._id!)
    );
    setFixtureSlides(fixtureSlidesTemp);
    setActiveSlide(0);
    updateFixtureBoundingBox(fixtureSlidesTemp[0]);
  }, [fixtureSelected]);

  const updateFixtureBoundingBox = (activeSlideObj: Slide) => {
    if (
      activeSlideObj &&
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
    const spaceFixtures = tempSpaceData!.fixtures;

    setSpaceFixtures(spaceFixtures);
    setFixtureSelected(spaceFixtures[0]);

    const brandsArr: string[] = [];
    spaceFixtures.forEach((fix: Fixture) => {
      fix.components.forEach((component: any) => {
        if (component.brand && !brandsArr.includes(component.brand)) {
          brandsArr.push(component.brand);
        }
      });
    });
    setUniqueBrands(brandsArr);
  }, [spaces, fixtures, spaceId]);

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

  const carouselHeight = isMobile ? 400 : Math.min(window.innerHeight) * 0.8;

  const carouselWidth = isMobile
    ? window.innerWidth
    : Math.min(1400, window.innerWidth) - 550;
  return (
    <Flex
      align="center"
      justify="center"
      vertical={isMobile}
      style={{
        maxWidth: isMobile ? "100%" : Math.min(1400, window.innerWidth),
        width: "100%",
        padding: isMobile ? 0 : 16,
        height: isMobile ? "100%" : window.innerHeight - 150,
        margin: "auto",
        paddingTop: isMobile ? 0 : 80,
        overflow: "hidden",
      }}
    >
      {/* The header bar including name, one liner, tags */}

      {/* The carousel for the space */}
      <div
        style={{
          position: "relative",
          borderRadius: isMobile ? 0 : 16,
          width: isMobile ? "100%" : `${carouselWidth}px`,
        }}
      >
        <Carousel
          ref={slidesCarouselRef}
          fade={true}
          autoplay={true}
          afterChange={onSlideChange}
          style={{ width: "100%", margin: "auto" }}
        >
          {fixtureSlides &&
            fixtureSlides!.map((sl: Slide) => {
              if (fixtureBoundingBox) {
                return (
                  <ZoomedImage
                    label={fixtureSelected?.designName}
                    imageUrl={sl.url}
                    boundingBox={fixtureBoundingBox}
                    containerSize={{
                      width: carouselWidth,
                      height: carouselHeight,
                    }}
                  ></ZoomedImage>
                );
              } else {
                return (
                  <div>
                    <div
                      style={{
                        backgroundImage: `url(${sl!.url})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: carouselHeight,
                        border: "1px solid",
                        borderRadius: isMobile ? 0 : 24,
                        borderColor: COLORS.borderColor,
                        flex: "none",
                      }}
                    ></div>
                  </div>
                );
              }
            })}
        </Carousel>

        <Button
          type="link"
          onClick={() => {
            navigate(`/project/${projectId}`);
          }}
          style={{ position: "fixed", top: 16, left: 16 }}
          icon={<BackIcon></BackIcon>}
        ></Button>
        <Button
          type="link"
          style={{ position: "fixed", top: 16, right: 16 }}
          icon={<LikeIcon></LikeIcon>}
        ></Button>

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
      <Flex
        vertical
        style={{
          width: isMobile ? "100%" : "480px",
          height: isMobile ? "auto" : carouselHeight,
          overflowY: "scroll",
          scrollbarWidth: "none",
        }}
      >
        <Flex vertical style={{ padding: "0 16px", marginTop: 16 }} gap={8}>
          {/* Space name & cost*/}
          <Flex align="center">
            <Typography.Title
              level={2}
              style={{ margin: 0, fontFamily: FONTS.bold, marginBottom: 0 }}
            >
              {spaceData.name || spaceData?.spaceType.spaceType}
            </Typography.Title>
            <Typography.Title
              level={5}
              style={{
                margin: 0,
                marginLeft: "auto",
                padding: "4px 8px",
                border: "1px solid",
                borderRadius: 8,
                borderColor: COLORS.textColorMedium,
              }}
            >
               {formatCost(spaceData.cost)}
            </Typography.Title>
          </Flex>

          {/* Meta info */}
          {/* <Flex gap={4}>
          {projectData.homeDetails?.homeType.homeType!} ·{" "}
          {projectData.homeDetails?.size} sqft
        </Flex> */}

          {/* One liner and buttons */}
          <Flex vertical>
            {/* {spaceData.oneLiner && (
            <Typography.Text
              style={{
                margin: 0,
                lineHeight: "120%",

                color: COLORS.textColorMedium,
                fontFamily: FONTS.regular,
              }}
            >
              <Paragraph
                ellipsis={{ rows: 3, expandable: true, symbol: "More" }}
                style={{ color: COLORS.textColorMedium }}
              >
                {spaceData.oneLiner!}
              </Paragraph>
            </Typography.Text>
          )} */}
            <Flex>
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

        {/* Fixtures horizontal list */}
        <Flex vertical style={{ marginTop: 0, padding: 16 }} gap={8}>
          <Typography.Title level={4} style={{ margin: 0, marginTop: 24 }}>
            What's included?
          </Typography.Title>
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
                        borderRadius: 8,
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
                        {fixture.designName}
                      </Typography.Text>
                    </Flex>
                  );
                })
              : null}
          </Flex>
        </Flex>

        {/* Fixture components list */}
        <Typography.Text
          style={{
            margin: 0,
            marginBottom: 0,
            color: COLORS.textColorLight,
            padding: "0 24px",
          }}
        >
          List of materials or accessories
        </Typography.Text>
        <Flex
          gap={24}
          vertical
          style={{
            padding: 16,
            margin: 16,
            marginTop: 8,
            backgroundColor: "white",
            borderRadius: 8,
          }}
        >
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

        <Flex vertical style={{ marginTop: 0, padding: 16 }} gap={8}>
          <Typography.Title level={4} style={{ margin: 0, marginTop: 24 }}>
            Brands Used
          </Typography.Title>
          {uniqueBrands && uniqueBrands.length ? (
            <Flex gap={16} align="center" style={{ flexWrap: "wrap" }}>
              {uniqueBrands.map((brand: String) => (
                <Image
                  style={{
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: COLORS.borderColorDark,
                  }}
                  width={100}
                  src={`/brand-logos/${brand.toLowerCase()}.png`}
                ></Image>
              ))}
            </Flex>
          ) : null}
        </Flex>

        {/* More from this project */}
        <Flex vertical style={{ padding: 16 }}>
          <Typography.Title level={4}>
            More spaces in this design
          </Typography.Title>
          <Flex
            style={{
              whiteSpace: "nowrap",
              overflowX: "scroll",
              width: "100%",
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
            gap={16}
          >
            {" "}
            {validSpaces
              .filter((s: Space) => s._id !== spaceData._id)
              .map((space: Space) => {
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
                    skipFixtures={true}
                  ></SpaceCard>
                );
              })}
          </Flex>
        </Flex>

        {/* Cost Dialog */}
        <Modal
          title="Costing Details"
          open={isCostDialogOpen}
          closable={true}
          onCancel={() => {
            setIsCostDialogOpen(false);
          }}
          footer={() => <></>}
        >
          <Flex vertical style={{ margin: "16px 0" }}>
            <Typography.Text style={{ textTransform: "uppercase" }}>
              Total Cost
            </Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {formatCost(spaceData.cost)}
            </Typography.Title>
          </Flex>
          <div
            style={{
              overflow: "hidden",
              borderRadius: "10px",
              border: "1px solid",
              borderColor: COLORS.borderColorDark,
              boxShadow: "inset 0 0 0 1px black",
            }}
          >
            <table
              style={{
                borderCollapse: "separate",
                borderSpacing: 0,
                width: "100%",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Fixture
                  </th>
                  <th
                    style={{
                      border: "1px solid",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {spaceFixtures!.map((fixture: Fixture, index: number) => {
                  return (
                    <tr key={index}>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {fixture.designName}
                      </td>
                      <td
                        style={{ border: "1px solid black", padding: "8px" }}
                      >{`${formatCost(fixture.cost || 0)}`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Flex style={{ marginTop: 12 }} justify="flex-end">
            <Typography.Text
              style={{
                fontSize: 14,
                marginRight: 8,
                marginLeft: 4,
                color: COLORS.textColorLight,
              }}
            >
              L: Lacs,
            </Typography.Text>
            <Typography.Text
              style={{ fontSize: 14, color: COLORS.textColorLight }}
            >
              K: Thousand
            </Typography.Text>
          </Flex>
        </Modal>
      </Flex>
    </Flex>
  );
};

export default SpaceDetails;
