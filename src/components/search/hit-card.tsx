import { Flex, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { COLORS, FONTS } from "../../styles/style-constants";

export const ProjectHitsCard: React.FC<Partial<LabelData>> = (hit) => {
  const navigate = useNavigate();

  const randomPrice = (Math.random() * (15 - 8) + 8).toFixed(1);

  return (
    <Flex
      onClick={() => navigate(`/project/${hit.projectId}`)}
      style={{
        width: "100%",
        height: 260,
        cursor: "pointer",
        borderRadius: 12,
        backgroundImage: `url(${hit.slideUrl || "../../img-plchlder.png"})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      vertical
      justify="end"
    >
      <Flex
        style={{
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 10,
        }}
        justify="space-between"
      >
        <div style={{ maxWidth: "80%" }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {hit.spaceName}
          </Typography.Title>
          <Typography.Text
            style={{
              fontSize: "14px",
              color: COLORS.textColorMedium,
              fontFamily: FONTS.regular,
            }}
            color={COLORS.textColorLight}
          >
            {hit.fixtureName}
          </Typography.Text>
        </div>
        <Typography.Text
          style={{
            fontSize: "14px",
            color: COLORS.textColorMedium,
            fontFamily: FONTS.regular,
            flexShrink: 0,
          }}
          color={COLORS.textColorLight}
        >
          ₹{randomPrice}
        </Typography.Text>
      </Flex>
    </Flex>
  );
};
