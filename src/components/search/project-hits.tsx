import { Col, Flex, Row, Typography } from "antd";
import { HitsProps, useHits } from "react-instantsearch";
import { useDevice } from "../../libs/device";
import { ProjectHitsCard } from "./hit-card";

export function ProjectHits(props: HitsProps<LabelData>) {
  const { isMobile } = useDevice();
  const { items, sendEvent } = useHits(props);

  const groupedItems = items.reduce(
    (acc, item) => {
      const spaceId = item.spaceId || "unknown";
      if (!acc[spaceId]) {
        acc[spaceId] = [];
      }
      acc[spaceId].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  return (
    <Flex
      justify="center"
      style={{
        width: "100%",
        marginTop: 16,
        padding: `0px ${isMobile ? "20px" : "40px"}`,
      }}
    >
      {items.length === 0 ? (
        <>
          <Typography.Text>No results found</Typography.Text>
        </>
      ) : (
        <Row gutter={[35, 35]} style={{ width: "1200px" }}>
          {Object.entries(groupedItems).map(([spaceId, hits]) => {
            const spaceName = hits[0].spaceName;
            const slideUrl = hits[0].slideUrl;
            const fixtureName = [
              ...new Set(hits.map((hit) => hit.fixtureName)),
            ].join(", ");
            const projectId = hits[0].projectId;

            return (
              <Col key={spaceId} xs={12} lg={8}>
                <ProjectHitsCard
                  spaceName={spaceName}
                  slideUrl={slideUrl}
                  fixtureName={fixtureName}
                  projectId={projectId}
                />
              </Col>
            );
          })}
        </Row>
      )}
    </Flex>
  );
}
