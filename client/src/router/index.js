import Vue from "vue";
import VueRouter from "vue-router";
// AUTHENTICATIONVIEWS IMPORT
import LoginHome from "../views/AuthenticationViews/LoginHome.vue";

// USERVIEWS IMPORTS
import UserDashboard from "../views/UserViews/UserDashboard.vue";

// ADMINVIEWS IMPORTS
import AdminDashboard from "../views/AdminViews/AdminDashboard.vue";
import SubCategoryDetails from "../views/AdminViews/SubCategoryDetails.vue";

// SUPERADMINVIEWS IMPORTS
import SuperAdminDashboard from "../views/SuperAdminViews/SuperAdminDashboard.vue";

// COMMONVIEWS IMPORTS
import ChangePassword from "../views/CommonViews/ChangePassword.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LoginHome",
    component: LoginHome,
  },
  {
    path: "/dashboard",
    name: "UserDashboard",
    component: UserDashboard,
  },
  {
    path: "/admindashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
  },
  {
    path: "/superadmindashboard",
    name: "SuperAdminDashboard",
    component: SuperAdminDashboard,
  },
  {
    path: "/changepassword",
    name: "ChangePassword",
    component: ChangePassword,
  },
  {
    path: "/subcategorydetails/:id",
    name: "SubCategoryDetails",
    component: SubCategoryDetails,
  },
];
const router = new VueRouter({
  routes,
  mode: "history",
});

// Executes before going to each route
router.beforeEach((to, from, next) => {
  var isAuthenticated = false;
  if (sessionStorage.getItem("user_token")) {
    isAuthenticated = true;
  }
  if (isAuthenticated) {
    if (to.name === "LoginHome") {
      if (JSON.parse(sessionStorage.getItem("user_data")).USER_TYPE === "U") {
        next({ name: "UserDashboard" });
      } else if (
        JSON.parse(sessionStorage.getItem("user_data")).USER_TYPE === "A"
      ) {
        next({ name: "AdminDashboard" });
      } else {
        next({ name: "SuperAdminDashboard" });
      }
    } else {
      next();
    }
  }
  if (to.name !== "LoginHome" && !isAuthenticated) {
    next({ name: "LoginHome" });
  } else {
    next();
  }
});
export default router;
