// ProjectsList.tsx

import { Col, Flex, Row } from "antd";
import React from "react";

import { getHomeMeta } from "../hooks/use-meta";
import { useFetchProjects } from "../hooks/use-projects";
import { Project } from "../interfaces/Project";

import { useDevice } from "../libs/device";
import { ProjectCard } from "./common/project-card";
import { Loader } from "./loader";

const ProjectsList: React.FC = () => {
  const { isMobile } = useDevice();

  const projects = useFetchProjects();
  const homeMeta = getHomeMeta();

  if (projects.isLoading || homeMeta.isLoading) {
    return <Loader />;
  }

  if (projects.isError || homeMeta.isError) {
    return (
      <div>
        Error:{" "}
        {projects.isError
          ? (projects.error as Error).message
          : (homeMeta.error as Error).message}
      </div>
    );
  }

  if (projects.data && homeMeta.data) {
    return (
      <Flex
        justify="center"
        style={{
          width: "100%",
          marginTop: 16,
          padding: `0px ${isMobile ? "20px" : "40px"}`,
        }}
      >
        <Row gutter={[35, 30]} style={{ width: "1200px" }}>
          {projects.data.map((project: Project) => (
            <Col key={project._id} xs={24} md={12} lg={8}>
              <ProjectCard
                project={project}
                homeMeta={homeMeta.data}
                key={project._id}
              />
            </Col>
          ))}
        </Row>
      </Flex>
    );
  }

  return null;
};

export default ProjectsList;
