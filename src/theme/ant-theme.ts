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
  }
};
