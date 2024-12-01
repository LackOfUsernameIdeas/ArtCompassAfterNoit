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
    path: `${import.meta.env.BASE_URL}app/test`,
    icon: <i className="side-menu__icon bx bx-movie-play"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "Тест",
    badge: "",
    badgetxt: "12",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  },
  {
    menutitle: "CONTACT"
  },
  {
    path: `${import.meta.env.BASE_URL}app/contact`,
    icon: <i className="side-menu__icon bx bx-envelope"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "За Контакт",
    badge: "",
    badgetxt: "12",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  }
];
