import type { MenuProps } from "antd";
import { Image, Layout } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem;
}

export const DashboardLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header style={{ padding: 8, background: "transparent" }}>
          <Image
            src="../../logo-name.png"
            style={{ height: 35, width: "auto" }}
          ></Image>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
