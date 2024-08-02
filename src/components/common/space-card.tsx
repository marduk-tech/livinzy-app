import { Flex, Typography } from "antd";
import { Space } from "../../interfaces/Space";
import { COLORS, FONTS } from "../../styles/style-constants";
import { useNavigate } from "react-router-dom";
import { Slide } from "../../interfaces/Slide";
import { Fixture } from "../../interfaces/Fixture";
import { useDevice } from "../../libs/device";
import Paragraph from "antd/es/typography/Paragraph";

interface SpaceCardProps {
  projectId: string;
  space: Space;
  fixtures: Fixture[];
  slides: Slide[];
  cardWidth?: number;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  projectId,
  slides,
  fixtures,
  cardWidth,
}) => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();

  function convertCostToReadableFormat(value: number) {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr"; // Crores
    } else if (value >= 100000) {
      return (value / 100000).toFixed(1).replace(/\.0$/, "") + "L"; // Lakhs
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k"; // Thousands
    }
    return value.toString();
  }

  const renderSpaceFixtures = (space: Space) => {
    if (!space) {
      return;
    }

    const spaceFixtures = space.fixtures.map((fixtureId: string) =>
      fixtures.find((f: Fixture) => f._id == fixtureId)
    );

    return (
      // <Typography.Text
      //   style={{
      //     margin: 0,
      //     color: COLORS.textColorMedium,
      //     fontFamily: FONTS.regular,
      //     fontSize: 14,
      //     maxWidth: "100%",
      //     display: "-webkit-box",
      //     WebkitBoxOrient: "vertical",
      //     WebkitLineClamp: 1,
      //     overflow: "hidden",
      //     textOverflow: "ellipsis",
      //   }}
      // >
      //   {spaceFixtures.map((fix, index: number) => {
      //     return `${fix!.designName || fix!.fixtureType?.fixtureType}${
      //       spaceFixtures.length === index + 1 ? null : ", "
      //     }`;
      //   })}
      // </Typography.Text>
      <Paragraph
        ellipsis={{ rows: 2 }}
        style={{ color: COLORS.textColorLight }}
      >
        {spaceFixtures.map((fix, index: number) => {
          return `${fix!.fixtureType?.fixtureType || fix!.fixtureType?.fixtureType}${
            spaceFixtures.length === index + 1 ? "" : ", "
          }`;
        })}
      </Paragraph>
    );
  };

  return (
    <Flex
      vertical
      style={{
        padding: 4,
        borderRadius: 16,
        border: "2px solid",
        borderColor: COLORS.borderColor,
        backgroundColor: "white",
        width: cardWidth || (isMobile ? "45%" : 225),
      }}
    >
      <Flex
        vertical
        gap={16}
        align="flex-start"
        onClick={() => {
          navigate(`/project/${projectId}/space/${space._id}`);
        }}
      >
        <Typography.Text
          style={{
            backgroundImage: `url(${slides[0]!.url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            borderRadius: 16,
            width: "100%",
            height: 190,
            border: "1px solid",
            borderColor: COLORS.borderColor,
            flex: "none",
          }}
        ></Typography.Text>

        <Flex style={{ padding: "0px 10px" }} vertical>
          <Flex justify="space-between">
            <Typography.Title level={5} style={{ margin: 0 }}>
              {space.name}
            </Typography.Title>

            {space.cost && (
              <Typography.Text
                style={{
                  flexShrink: 0,
                  margin: 0,
                  fontSize: 18,

                  color: COLORS.textColorMedium,
                }}
              >
                ₹{convertCostToReadableFormat(space.cost)}
              </Typography.Text>
            )}
          </Flex>

          {renderSpaceFixtures(space)}
        </Flex>
      </Flex>
    </Flex>
  );
};
