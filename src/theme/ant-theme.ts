import { ThemeConfig } from "antd";
import { COLORS } from "../styles/colors";

export const antTheme: ThemeConfig = {
  token: {
    colorPrimary: COLORS.primaryColor,
    colorSuccess: COLORS.greenIdentifier,
    colorTextBase: COLORS.textColorDark,
    controlHeight: 50,
    fontFamily: "Archivo",
    fontSize: 18
  },
  components: {
    Tabs: {
      itemActiveColor: COLORS.primaryColor,
      horizontalItemPadding: "24px 8px",
      inkBarColor: "none",
      lineWidth: 0,
      horizontalItemGutter: 16
    }
  }
};
