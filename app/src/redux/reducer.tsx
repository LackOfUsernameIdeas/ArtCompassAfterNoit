const initialState = {
  lang: "bg",
  dir: "ltr",
  class: `${import.meta.env.VITE_DEFAULT_THEME}`,
  dataMenuStyles: `${import.meta.env.VITE_DEFAULT_THEME}`,
  dataNavLayout: "horizontal",
  dataHeaderStyles: `${import.meta.env.VITE_DEFAULT_THEME}`,
  dataVerticalStyle: "overlay",
  toggled: "close",
  dataNavStyle: "menu-click",
  horStyle: "",
  dataPageStyle: "modern",
  dataWidth: "fullwidth",
  dataMenuPosition: "fixed",
  dataHeaderPosition: "fixed",
  loader: "disable",
  iconOverlay: "",
  colorPrimaryRgb: "154 17 10",
  colorPrimary: "154 17 10",
  colorSecondaryRgb: "193 46 23",
  colorSecondary: "193 46 23",
  colorTertiaryRgb: "107 21 2",
  colorTertiary: "107 21 2",
  bodyBg: "",
  Light: "",
  darkBg: "",
  inputBorder: "",
  bgImg: "",
  iconText: "",
  body: {
    class: ""
  }
};

export default function reducer(state = initialState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case "ThemeChanger":
      state = {
        ...payload,
        colorPrimaryRgb: payload.class === "dark" ? "175 11 72" : "154 17 10",
        colorPrimary: payload.class === "dark" ? "175 11 72" : "154 17 10",
        colorSecondaryRgb: payload.class === "dark" ? "256 52 12" : "193 46 23",
        colorSecondary: payload.class === "dark" ? "256 52 12" : "193 46 23",
        colorTertiaryRgb: payload.class === "dark" ? "210, 102, 0" : "107 21 2",
        colorTertiary: payload.class === "dark" ? "210, 102, 0" : "107 21 2",
        lang: "bg",
        dir: "ltr",
        dataNavLayout: "horizontal",
        dataVerticalStyle: "overlay",
        toggled: "close",
        dataNavStyle: "menu-click",
        horStyle: "",
        dataPageStyle: "modern",
        dataWidth: "fullwidth",
        dataMenuPosition: "fixed",
        dataHeaderPosition: "fixed",
        loader: "disable",
        iconOverlay: "",
        bodyBg: "",
        Light: "",
        darkBg: "",
        inputBorder: "",
        bgImg: "",
        iconText: "",
        body: {
          class: ""
        }
      };
      return state;

    default:
      return state;
  }
}
