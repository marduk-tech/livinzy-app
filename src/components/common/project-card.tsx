import { Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeMeta } from "../../interfaces/Meta";
import { Project } from "../../interfaces/Project";
import { useDevice } from "../../libs/device";
import { COLORS } from "../../styles/style-constants";

interface ProjectCardProps {
  project: Project;
  homeMeta: HomeMeta[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();

  const randomPrice = (Math.random() * (15 - 8) + 8).toFixed(1);

  return (
    <Flex
      vertical
      style={{
        width: "100%",
        cursor: "pointer",
      }}
      onClick={() => {
        navigate(`/project/${project._id}`);
      }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: 15,
          height: 300,

          backgroundImage: `url(${
            project.previewImageUrl || "../../img-plchlder.png"
          })`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <Flex
        style={{ width: "100%", marginTop: 15, padding: "0px 10px" }}
        vertical
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          {project.name}
        </Typography.Title>

        <Flex
          style={{ marginTop: 5 }}
          gap={7}
          color={COLORS.textColorLight}
          align="center"
        >
          {project.homeDetails?.homeType?.homeType && (
            <>
              <DescText text={project.homeDetails?.homeType?.homeType} />
            </>
          )}

          {project.homeDetails?.homeType?.homeType &&
            project.homeDetails?.size && (
              <>
                <SeparatorDot />
              </>
            )}

          {project.homeDetails?.size && (
            <>
              <DescText text={`${project.homeDetails?.size}sqft`} />
            </>
          )}

          <SeparatorDot />
          <DescText text={`₹${randomPrice}Lacs`} />
        </Flex>
      </Flex>
    </Flex>
  );
};

function DescText({ text }: { text: string }) {
  return (
    <Typography.Text
      style={{ fontSize: "14px", opacity: "80%" }}
      color={COLORS.textColorLight}
    >
      {text}
    </Typography.Text>
  );
}

function SeparatorDot() {
  return (
    <span
      style={{
        width: 3,
        height: 3,
        backgroundColor: COLORS.textColorLight,
      }}
    ></span>
  );
}
