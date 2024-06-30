// ProjectsList.tsx

import React from "react";
import { useFetchProjects } from "../hooks/use-projects";
import { Project } from "../interfaces/Project";
import { Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { useDevice } from "../libs/device";

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();

  const { data: projects, isLoading, isError, error } = useFetchProjects();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <Flex
      justify="center"
      style={{ width: "100%", marginTop: 16 }}
      wrap="wrap"
      gap={16}
    >
      {projects?.map((project: Project) => (
        <Flex
          vertical
          key={project._id}
          style={{
            width: isMobile ? "100%" : 350
          }}
          onClick={() => {
            navigate(`/project/${project._id}`);
          }}
        >
          <Flex
            style={{
              cursor: "pointer",
              width: "100%",
              borderRadius: 8,
              height: 250,
              backgroundImage: `url(${
                project.previewImageUrl || "../../img-plchlder.png"
              })`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              position: "relative"
            }}
          >
            <Flex
              style={{
                position: "absolute",
                padding: 8,
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
                fontWeight: "bold",
                bottom: 0,
                width: "100%",
                backgroundColor: "white"
              }}
            >
              {project.name}
            </Flex>
          </Flex>

          <br />
        </Flex>
      ))}
    </Flex>
  );
};

export default ProjectsList;
