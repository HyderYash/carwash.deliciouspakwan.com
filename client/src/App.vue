<template>
  <v-app>
    <!-- <Header v-if="!$route.meta.hideNavbar" /> -->
    <Header :key="Math.random()" />

    <router-view />

    <DebugTable v-if="showDebugTableData" :key="componentKey" />
  </v-app>
</template>

<script>
import Header from "./views/CommonViews/CommonComponents/Header.vue";
import DebugTable from "./views/DebugViews/DebugTable.vue";
import * as common from "./utils/Common";

export default {
  name: "App",
  components: {
    Header,
    DebugTable,
  },
  data() {
    return {
      showDebugTableData: false,
      componentKey: 0,
    };
  },
  methods: {
    showDebugTable() {
      if (
        window.location.search === "?debug=true" ||
        sessionStorage.getItem("debug") === "true"
      ) {
        this.showDebugTableData = true;
      }
    },
    debugComponentKeyChange() {
      this.componentKey += 1;
    },
  },
  beforeCreate() {
    common.cLog(this.$options.name, "beforeCreate");
    common.setQueryParamsInSession(this.$route.query);
  },
  created() {
    common.cLog(this.$options.name, "created");
    this.$root.$refs.App = this;
  },
  beforeMount() {
    common.cLog(this.$options.name, "beforeMount");
    this.isDebugOn = common.isDebugOn();
  },
  mounted() {
    common.cLog(this.$options.name, "mounted");
    this.showDebugTable();
    this.debugComponentKeyChange();
  },
  beforeUpdate() {
    common.cLog(this.$options.name, "beforeUpdate");
  },
  updated() {
    common.cLog(this.$options.name, "updated");
  },
};
</script>

<style></style>
