import { App as AntApp, ConfigProvider } from "antd";

// Global Styles
import "./styles/globals.scss";

import { Router } from "./routes/routes";
import { antTheme } from "./theme/ant-theme";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./libs/react-query/query-client";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antTheme}>
        <AntApp>
          <Router />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
