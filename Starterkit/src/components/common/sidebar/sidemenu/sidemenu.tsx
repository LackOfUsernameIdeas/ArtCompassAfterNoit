export const MENUITEMS = [
  {
    menutitle: "MAIN"
  },
  {
    path: `${import.meta.env.BASE_URL}app/home`,
    icon: <i className="side-menu__icon bx bx-home"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "Начало",
    badge: "",
    badgetxt: "12",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  },
  {
    path: `${import.meta.env.BASE_URL}app/recommendations`,
    icon: <i className="side-menu__icon bx bx-movie-play"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "Нови Препоръки",
    badge: "",
    badgetxt: "12",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  },

  {
    menutitle: "WEB APPS"
  }

  // {
  //   title: "Падащо меню",
  //   icon: <i className="bx bx-layer side-menu__icon"></i>,
  //   type: "sub",
  //   selected: false,
  //   active: false,
  //   children: [
  //     {
  //       path: "#",
  //       title: "Подменю 1",
  //       type: "empty",
  //       active: false,
  //       selected: false
  //     },
  //     {
  //       title: "Подменю 2",
  //       type: "sub",
  //       selected: false,
  //       active: false,
  //       children: [
  //         {
  //           path: "#",
  //           title: "Подменю 2.1",
  //           type: "empty",
  //           active: false,
  //           selected: false
  //         },
  //         {
  //           path: "#",
  //           title: "Подменю 2.2",
  //           type: "empty",
  //           active: false,
  //           selected: false
  //         }
  //       ]
  //     }
  //   ]
  // }
];
