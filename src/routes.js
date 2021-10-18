import Login from "./views/Login.vue";
import NotFound from "./views/404.vue";
import Home from "./views/Home.vue";
import Main from "./views/Main.vue";
import Table from "./views/nav1/Table.vue";
import Form from "./views/nav1/Form.vue";
import User from "./views/nav1/User.vue";
import Page1 from "./views/nav2/Page1.vue";
import Page2 from "./views/nav2/Page2.vue";
import Page3 from "./views/nav3/Page3.vue";
import echarts from "./views/charts/echarts.vue";

let routes = [
  {
    path: "/login",
    component: Login,
    name: "",
    hidden: true,
  },
  {
    path: "/404",
    component: NotFound,
    name: "",
    hidden: true,
  },
  //{ path: '/main', component: Main },
  {
    path: "/",
    component: Home,
    name: "用户管理",
    iconCls: "el-icon-message", //图标样式class
    children: [
      { path: "/main", component: Main, name: "主页", hidden: true },
      { path: "/table", component: Table, name: "用户信息" },
      { path: "/form", component: Form, name: "角色管理" }
      
    ],
  },
  {
    path: "/",
    component: Home,
    name: "",
    iconCls: "fa fa-address-card",
    leaf: true, //只有一个节点
    children: [{ path: "/page3", component: Page3, name: "页面3" }],
  },
  {
    path: "*",
    hidden: true,
    redirect: { path: "/404" },
  },
];

export default routes;
