import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchSlidesByProject } from "../hooks/use-slides";
import { useFetchSpacesByProject } from "../hooks/use-spaces";
import { useFetchProject } from "../hooks/use-projects";
import { Flex, Tabs, Typography } from "antd";
import { COLORS } from "../styles/colors";
import { Slide } from "../interfaces/Slide";
import { Space } from "../interfaces/Space";
import { useFetchFixturesByProject } from "../hooks/use-fixtures";
import { Fixture } from "../interfaces/Fixture";

const Project: React.FC = () => {
  const { projectId } = useParams();

  const [selectedSlide, setSelectedSlide] = useState<Slide>();

  const { data: projectData, isLoading: projectDataLoading } = useFetchProject(
    projectId!
  );

  const { data: slides, isLoading: slidesLoading } = useFetchSlidesByProject(
    projectId!
  );
  const { data: spaces, isLoading: spacesLoading } = useFetchSpacesByProject(
    projectId!
  );

  const { data: fixtures, isLoading: fixturesLoading } =
    useFetchFixturesByProject(projectId!);

  useEffect(() => {
    if (!slides || !slides.length) {
      return;
    }
    setSelectedSlide(slides[0]);
  }, [slides]);

  const filterZombieSpaces = (spaces: Space[]) => {
    return spaces.filter((s: Space) => {
      return !!slides?.find((slide: Slide) => slide.spaces?.includes(s._id!));
    });
  };

  const renderSpaceFixtures = (space: Space) => {
    const spaceSlides = slides?.filter(
      (s: Slide) => s.spaces?.includes(space._id!)
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
    <Flex vertical>
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
      {/* All the slides in horizontal scroll container */}
      <Flex
        style={{
          width: "100%",
          overflowX: "scroll",
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */
        }}
        gap={16}
      >
        {slides!.map((slide: Slide) => {
          return (
            <Flex
              style={{
                backgroundImage: `url(${
                  slide.url || "../../img-plchlder.png"
                })`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: 75,
                height: 75,
                borderRadius: 8,
                border: "1px solid",
                borderColor: COLORS.borderColor,
                flex: "none"
              }}
              onClick={() => {
                setSelectedSlide(slide);
              }}
            >
              {" "}
            </Flex>
          );
        })}
      </Flex>
      {/* Main slide */}
      <Flex
        style={{
          backgroundImage: `url(${selectedSlide!.url})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: `${window.innerWidth}px`,
          border: "1px solid",
          marginTop: 24,
          borderColor: COLORS.borderColor,
          flex: "none"
        }}
      >
        {" "}
      </Flex>
      <Tabs
        style={{ padding: 8 }}
        defaultActiveKey="1"
        items={filterZombieSpaces(spaces).map((space: Space) => {
          return {
            key: space._id!,
            label: space.name,
            children: renderSpaceFixtures(space)
          };
        })}
      />
    </Flex>
  );
};

export default Project;
