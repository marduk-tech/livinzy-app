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
import {
  DesignerIcon,
  RupeesIcon,
} from "../libs/icons";
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

  /**
   * Displays all spaces in a tabbed layout
   * @returns
   */
  const renderSpaces = (validSpaces: Space[]) => {
    return (
      <Flex style={{ flexWrap: "wrap", margin: "auto", padding: 8, width: "100%" }} gap={12}>
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

  return (
    <Flex
      vertical={isMobile}
      style={{
        maxWidth: isMobile ? "100%" : maxDesktopWidth,
        width: "100%",
        margin: "auto",
        backgroundColor: COLORS.bgColor,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: isMobile ? "100%": "50%" }}>
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
                    ? "200px"
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
                        ? `200px`
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

      <Flex vertical>
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
            <Flex vertical gap={5}>
              <Typography.Title level={2} style={{ margin: 0 }}>
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
              borderBottomColor: COLORS.borderColorDark,
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

            <Flex style={{ marginTop: 8 }}>
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

          {renderSpaces(validSpaces)}
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
        </Modal>
      </Flex>
    </Flex>
  );
};

export default ProjectDetails;
