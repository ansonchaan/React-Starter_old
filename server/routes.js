import Home from "../src/page/home";
import Projects from "../src/page/projects";
import ProjectSingle from "../src/page/single/project";

const routes = [
  {
    path: "/(en|zh)/",
    exact: true,
    component: [Home],
    key: "homeData"
  },
  {
    path: "/(en|zh)/projects/",
    exact: true,
    component: [Projects],
    key: "projectsData"
  },
  {
    path: "/(en|zh)/project/(.+)",
    exact: false,
    component: [ProjectSingle],
    key: "projectSingleData"
  }
];

export default routes;
