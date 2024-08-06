import {
  ArrowRightOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Carousel,
  Col,
  Drawer,
  Flex,
  Image,
  message,
  Modal,
  Popover,
  Row,
  Segmented,
  Spin,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetchFixturesByProject } from "../hooks/use-fixtures";
import useParentDimensions from "../hooks/use-parent-dimension";
import { useFetchProject } from "../hooks/use-projects";
import { useFetchSlidesByProject } from "../hooks/use-slides";
import { useFetchSpacesByProject } from "../hooks/use-spaces";
import { useUser } from "../hooks/use-user";
import { Fixture } from "../interfaces/Fixture";
import { Slide } from "../interfaces/Slide";
import { Space } from "../interfaces/Space";
import { maxDesktopWidth } from "../libs/constants";
import { useDevice } from "../libs/device";
import { DesignerIcon, HighlightsIcon, RupeesIcon, SpacesIcon } from "../libs/icons";
import { queryKeys } from "../libs/react-query/constants";
import { queryClient } from "../libs/react-query/query-client";
import { COLORS, FONTS } from "../styles/style-constants";
import ZoomedImage from "./common/zoomed-img";
import { SpaceCard } from "./common/space-card";
import Paragraph from "antd/es/typography/Paragraph";
import { formatCost } from "../libs/lvnzy-helper";

const randomPrice = (Math.random() * (15 - 8) + 8).toFixed(1);

const ProjectDetails: React.FC = () => {
  const navigate = useNavigate();

  const { projectId } = useParams();
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

  const { useUpdateUser, user } = useUser();
  const updateUserMutation = useUpdateUser();

  const [slidesSortedBySpace, setSlidesSortedBySpace] = useState<Slide[]>();
  const [currentSlide, setCurrentSlide] = useState<Slide>();
  const [fixtureSelected, setFixtureSelected] = useState<Fixture>();
  const [activeSlide, setActiveSlide] = useState(0);

  const [activeSpace, setActiveSpace] = useState<string>();
  const { data: fixtures, isLoading: fixturesLoading } =
    useFetchFixturesByProject(projectId!);

  const [highlightedFixtures, setHighlightedFixtures] = useState<Fixture[]>();

  const onSlideChange = (currentSlide: number) => {
    console.log(currentSlide);
    const slideCurrent = slidesSortedBySpace![currentSlide];
    setCurrentSlide(slideCurrent);
    setActiveSlide(currentSlide);
  };

  const getFixtureSlideUrl = (fixtureId: string) => {
    const slide = slides?.find((slide: Slide) =>
      slide.fixtures?.includes(fixtureId)
    );
    return slide ? slide.url : "";
  };

  useEffect(() => {
    if (!projectData || !fixtures) {
      return;
    }

    if (projectData.highlights && projectData.highlights.fixtureHighlights) {
      setHighlightedFixtures(
        fixtures.filter((fix: Fixture) =>
          projectData.highlights?.fixtureHighlights?.includes(fix._id!)
        )
      );
    }
  }, [fixtures, projectData]);

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

  /**
   * Displays all spaces in a tabbed layout
   * @returns
   */
  const renderSpaces = (validSpaces: Space[]) => {
    return (
      <Flex
        style={{ flexWrap: "wrap", margin: "auto", width: "100%" }}
        gap={12}
      >
        {" "}
        {validSpaces.map((space: Space) => {
          return (
            <SpaceCard
              space={space}
              slides={space.slides}
              projectId={projectId!}
              fixtures={fixtures}
            ></SpaceCard>
          );
        })}
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

  const validSpaces = filterZombieSpaces(spaces).sort((s1: Space, s2: Space) =>
    s2._id!.localeCompare(s1._id!)
  );

  const handleFavToggle = async () => {
    if (!user) {
      return navigate("/auth/login");
    }

    const { _id, favoriteProjects = [] } = user;

    const updatedFavProjects = favoriteProjects.includes(projectId as string)
      ? favoriteProjects.filter((id) => id.toString() !== projectId)
      : [...favoriteProjects, projectId];

    try {
      await updateUserMutation.mutateAsync({
        id: _id,
        data: {
          favoriteProjects: updatedFavProjects as string[],
        },
      });
    } catch (error) {
      message.error("Please try again later");
    }

    await queryClient.invalidateQueries({
      queryKey: [queryKeys.user],
    });
  };

  const carouselHeight = isMobile ? 200 : Math.min(window.innerHeight) * 0.8;
  return (
    <Flex
      vertical={isMobile}
      align="center"
      justify="center"
      gap={16}
      style={{
        maxWidth: isMobile ? "100%" : Math.min(1400, window.innerWidth),
        width: "100%",
        padding: isMobile ? 0 : 16,
        height: isMobile ? "100%" : window.innerHeight - 150,
        margin: "auto",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          borderRadius: isMobile ? 0 : 16,
          position: "relative",
          width: isMobile
            ? "100%"
            : `calc(${Math.min(1400, window.innerWidth)}px - 550px)`,
        }}
      >
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
                  height: carouselHeight,
                  border: "1px solid",
                  borderRadius: isMobile ? 0 : 24,
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
                      borderRadius: isMobile ? 0 : 24,
                      height: isMobile ? `200px` : carouselHeight,
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
          width: isMobile ? "100%" : "480px",
          height: isMobile ? "auto" : carouselHeight,
          overflowY: "scroll",
          scrollbarWidth: "none",
          paddingBottom: 16
        }}
      >
        {/* The header bar including name, one liner, tags */}
        <Flex
          vertical
          style={{
            padding: 16,
            paddingTop: 24,
          }}
          gap={12}
        >
          <Flex justify="space-between">
            <Flex vertical gap={5} style={{ width: "100%" }}>
              <Flex align="center">
                <Typography.Title level={2} style={{ margin: 0 }}>
                  {projectData.name}
                </Typography.Title>
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                    marginLeft: "auto",
                    padding: 8,
                    border: "1px solid",
                    borderRadius: 8,
                    borderColor: COLORS.textColorMedium,
                  }}
                >
                  {formatCost(
                    spaces.reduce((accumulator: number, space: Space) => {
                      return accumulator + (space.cost || 0);
                    }, 0)
                  )}
                </Typography.Title>
              </Flex>
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

            {/* <Typography.Title
            level={4}
            style={{ margin: 0 }}
          >{`₹${randomPrice} L`}</Typography.Title> */}
          </Flex>

          <Flex
            vertical
            style={{
              paddingBottom: 24,
              borderBottom: "1px solid",
              borderBottomColor: COLORS.borderColor,
            }}
          >
            {projectData.oneLiner && (
              <Paragraph
                ellipsis={{ rows: 3, expandable: true, symbol: "More" }}
                style={{ color: COLORS.textColorMedium }}
              >
                {projectData.oneLiner!}
              </Paragraph>
            )}

            <Flex style={{ marginTop: 8 }} gap={8}>
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
                Cost Details
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
        {/* Project Highlights */}
        <Flex
          vertical
          style={{
            margin: "0 24px",
            paddingBottom: 24,
            borderBottom: "1px solid",
            borderBottomColor: COLORS.borderColor,
          }}
          gap={24}
        >
          <Flex gap={8} align="center" style={{margin: "0", marginTop: 24}}>
            <HighlightsIcon></HighlightsIcon>
            <Typography.Title level={4} style={{margin: 0}}>
            Highlights of this project
            </Typography.Title>
          </Flex>
          {highlightedFixtures && highlightedFixtures.length
            ? highlightedFixtures.map((fix: Fixture, index: number) => {
                return (
                  <Flex gap={16} align="center">
                    <Flex style={{ height: 60, width: 60 }}>
                      <Image
                        preview={false}
                        src={getFixtureSlideUrl(fix._id!)}
                        width={60}
                        style={{ opacity: 0.8, borderRadius: 8 }}
                        height={60}
                      ></Image>
                    </Flex>
                    <Flex vertical>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {fix.designName}
                      </Typography.Title>
                      <Typography.Text
                        style={{
                          color: COLORS.textColorLight,
                          lineHeight: "120%",
                        }}
                      >
                        {fix.description}
                      </Typography.Text>
                    </Flex>
                  </Flex>
                );
              })
            : null}
        </Flex>
        <Flex vertical style={{ padding: "0 16px" }}>
          <Flex gap={8} align="center" style={{margin: "24px 0", marginTop: 40}}>
            <SpacesIcon></SpacesIcon>
            <Typography.Title level={4} style={{margin: 0}}>
              All spaces in this design
            </Typography.Title>
          </Flex>
          {renderSpaces(validSpaces)}
        </Flex>
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
              {formatCost(
                spaces.reduce((accumulator: number, space: Space) => {
                  return accumulator + (space.cost || 0);
                }, 0)
              )}
            </Typography.Title>
          </Flex>
          <div
            style={{
              overflow: "hidden",
              borderRadius: "10px",
              border: "1px solid",
              boxShadow: "inset 0 0 0 1px black",
              borderColor: COLORS.borderColorDark,
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
                    Space
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
                {spaces!.map((space: Space, index: number) => {
                  return (
                    <tr key={index}>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {space.name}
                      </td>
                      <td
                        style={{ border: "1px solid black", padding: "8px" }}
                      >{`${formatCost(space.cost || 0)}`}</td>
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

export default ProjectDetails;
