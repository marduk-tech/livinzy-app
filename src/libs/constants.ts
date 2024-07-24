export const baseApiUrl = import.meta.env.VITE_API_URL;
export const maxDesktopWidth = 1200;
const isDev = import.meta.env.DEV;

export const LocalStorageKeys = {
  authToken: "authToken",
  user: "user",
};

export const TypesenseCollections = {
  slide_fixtures: isDev ? "dev_slide_fixtures" : "slide_fixtures",
};
