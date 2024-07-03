import { ThemeConfig } from "antd";
import { COLORS, FONTS } from "../styles/style-constants";

export const antTheme: ThemeConfig = {
  token: {
    colorPrimary: COLORS.primaryColor,
    colorSuccess: COLORS.greenIdentifier,
    colorTextBase: COLORS.textColorDark,
    controlHeight: 50,
    fontFamily: FONTS.primary,
    fontSize: 16,
  },
  components: {
    Tabs: {
      itemActiveColor: COLORS.primaryColor,
      horizontalItemPadding: "24px 8px",
      inkBarColor: "none",
      lineWidth: 0,
      itemColor: COLORS.textColorMedium,
      itemHoverColor: COLORS.textColorDark,
      horizontalItemGutter: 16
    }
  }
};
