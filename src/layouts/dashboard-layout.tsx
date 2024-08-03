import type { MenuProps } from "antd";
import { Button, Flex, Image, Layout } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";
import { useUser } from "../hooks/use-user";

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
    label,
  } as MenuItem;
}

export const DashboardLayout: React.FC = () => {
  const { user, isLoading, isError, error } = useUser();
  const { logout } = useAuth();

  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header style={{ padding: "8px 24px", background: "transparent" }}>
          <Flex align="center" justify="space-between">
            <Image
              src="../../logo-name.png"
              style={{ height: 35, width: "auto" }}
            ></Image>
            {user && !isLoading && user.mobile ? (
              <Button
                size="small"
                onClick={() => {
                  logout.mutate();
                  navigate("/auth/login");
                }}
              >
                Logout
              </Button>
            ) : (
              <Button size="small" onClick={() => navigate("/auth/login")}>
                Login
              </Button>
            )}
          </Flex>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
