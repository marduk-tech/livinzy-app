import React from "react";
import { Col, Flex, Image, Input, Row, Typography } from "antd";
import { COLORS } from "../styles/style-constants";
import { maxDesktopWidth } from "../libs/constants";

const pages = [
  {
    bg: "../../landing-bg.png",
    title: (
      <Typography.Title
        style={{
          marginTop: 128,
          padding: "0 24px",
          color: "white",
          fontSize: 58,
        }}
      >
        Take the Next Best Decision For Your Home
      </Typography.Title>
    ),
    subtitle: <Input style={{ width: "300px", marginLeft: 24 }}></Input>,
    image: "",
  },
  {
    title: "",
    subtitle: "",
    image: "",
  },
  {
    title: (
      <Typography.Title
        style={{
          marginTop: 128,
          padding: "0 24px",
          fontSize: 58,
        }}
      >
        Unique Designs.Unique Designers
      </Typography.Title>
    ),
    subtitle: "",
    image: "",
  },
  {
    title: "Accurate Information.",
    subtitle: "",
    image: "",
  },
];

const Home: React.FC = () => {
  const renderSlides = () => {
    return pages.map((page: any) => (
      <Row>
        <Col span={24}>
          <Flex
            vertical
            style={{
              height: "100vh",

              backgroundImage: page.bg
                ? `url(${"../../landing-bg.png"})`
                : "none",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Flex
              vertical
              justify="flex-start"
              style={{ maxWidth: maxDesktopWidth, margin: "0 auto" }}
            >
              {page.title}
              {page.subtitle}
            </Flex>
          </Flex>
        </Col>
      </Row>
    ));
  };

  if (true) {
    return (
      <>
      <Flex
        style={{
          height: 400,
          width: 800,
          backgroundColor: COLORS.primaryColor,
        }}
        align="center"
        justify="center"
      >
        <Input style={{ height: 100, width: 600, borderRadius: 48, fontSize: 28, paddingLeft: 32 }}></Input>
      </Flex>
      <Flex>
      kitchen with island table
      <br/>

spacious and earthly rooms<br/>

Open concept living spaces<br/>

Bright and colorful kids room<br/>

Living room with large sofa set
      </Flex>
      </>

    );
  }

  return (
    <Flex vertical>
      {renderSlides()}
      <Flex
        style={{
          backgroundColor: COLORS.bgColor,
          position: "fixed",
          top: 16,
          left: 15,
        }}
      >
        <Image
          src="../../logo-name.png"
          style={{
            height: 35,
            width: "auto",
          }}
          preview={false}
        ></Image>
      </Flex>
    </Flex>
  );
};

export default Home;
