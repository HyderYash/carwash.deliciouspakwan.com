<template>
  <div>
    <v-app-bar color="deep-purple accent-4" dense dark>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="isUserLoggedIn"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Car Wash </v-toolbar-title>
      <div v-if="isDebugOn">
        <v-spacer></v-spacer>
        <v-chip class="ma-2" right color="red" text-color="white">
          Debug On
        </v-chip>
      </div>

      <v-spacer></v-spacer>
      <div v-if="isUserLoggedIn">
        <router-link
          v-if="userData.USER_TYPE === 'U'"
          to="/dashboard"
          exact
          class="noHrefDec"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon>mdi-home</v-icon>
              </v-btn>
            </template>

            <span>Home</span>
          </v-tooltip>
        </router-link>
        <router-link
          v-else-if="userData.USER_TYPE === 'A'"
          to="/admindashboard"
          exact
          class="noHrefDec"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon>mdi-home</v-icon>
              </v-btn>
            </template>

            <span>Home</span>
          </v-tooltip>
        </router-link>

        <router-link v-else to="/superadmindashboard" exact class="noHrefDec">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon>mdi-home</v-icon>
              </v-btn>
            </template>

            <span>Home</span>
          </v-tooltip>
        </router-link>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="logoutUser">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
          <span>Logout</span>
        </v-tooltip>
      </div>
    </v-app-bar>
    <div v-if="isUserLoggedIn">
      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list-item>
          <v-list-item-avatar :color="currentColor">
            <span class="white--text text-h5" v-if="userType === 'SA'">{{
              userData.USER_DISPLAY_NAME.charAt(0)
            }}</span>
            <span class="white--text text-h5" v-else>{{
              userData.SK_DISPLAY_NAME.charAt(0)
            }}</span>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-if="userType === 'SA'">{{
              userData.USER_DISPLAY_NAME
            }}</v-list-item-title>
            <v-list-item-title v-else>{{
              userData.SK_DISPLAY_NAME
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item link>
            <div v-if="userType === 'U'">
              <router-link to="/dashboard" class="disableRouterLinkStyle">
                <v-list-item-icon>
                  <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="listTitleFont"
                    >Dashboard</v-list-item-title
                  >
                </v-list-item-content>
              </router-link>
            </div>
            <div v-else-if="userType === 'A'">
              <router-link to="/admindashboard" class="disableRouterLinkStyle">
                <v-list-item-icon>
                  <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="listTitleFont"
                    >Dashboard</v-list-item-title
                  >
                </v-list-item-content>
              </router-link>
            </div>
            <div v-else>
              <router-link
                to="/superadmindashboard"
                class="disableRouterLinkStyle"
              >
                <v-list-item-icon>
                  <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="listTitleFont"
                    >Dashboard</v-list-item-title
                  >
                </v-list-item-content>
              </router-link>
            </div>
          </v-list-item>
          <v-list-item link>
            <router-link to="/changepassword" class="disableRouterLinkStyle">
              <v-list-item-icon>
                <v-icon>mdi-lock</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="listTitleFont"
                  >Change Password</v-list-item-title
                >
              </v-list-item-content>
            </router-link>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<script>
import * as common from "../../../utils/Common";
export default {
  name: "Header",
  data() {
    return {
      drawer: null,
      userData: common.getLoggedUserInfo(),
      userType: common.getLoggedUserInfo("USER_TYPE"),
      isDebugOn: "",
      isUserLoggedIn: common.isUserLogged(),
      colors: [
        "red",
        "blue",
        "green",
        "indigo",
        "purple",
        "teal",
        "orange",
        "brown",
        "deep-orange",
        "blue-grey",
        "cyan",
      ],
      currentColor: "",
    };
  },
  methods: {
    logoutUser() {
      common.logoutUserAndClearSession();
    },
    randomColors() {
      this.currentColor =
        this.colors[Math.floor(Math.random() * this.colors.length)];
    },
  },
  // ---------------------------------------------
  beforeCreate() {
    common.cLog(this.$options.name, "beforeCreate");
    common.setQueryParamsInSession(this.$route.query);
  },
  created() {
    this.randomColors();
    common.cLog(this.$options.name, "created");
  },
  beforeMount() {
    common.cLog(this.$options.name, "beforeMount");
    this.isDebugOn = common.isDebugOn();
  },
  mounted() {
    common.cLog(this.$options.name, "mounted");
  },
  beforeUpdate() {
    common.cLog(this.$options.name, "beforeUpdate");
  },
  updated() {
    common.cLog(this.$options.name, "updated");
  },
  beforeDestroy() {
    common.cLog(this.$options.name, "beforeDestroy");
  },
  destroyed() {
    common.cLog(this.$options.name, "destroyed");
  },
};
</script>
<style scoped>
.disableRouterLinkStyle {
  text-decoration: none !important;
  color: inherit !important;
  display: flex;
}
.listTitleFont {
  font-size: 14px !important;
}
.noHrefDec {
  text-decoration: none !important;
  color: inherit !important;
}
</style>
