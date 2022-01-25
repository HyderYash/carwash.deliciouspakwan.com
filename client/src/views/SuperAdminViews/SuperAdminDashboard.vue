<template>
  <div>
    <ShowShopkeepersList @showAddCategorySnack="showAddCategorySnack" />

    <!-- ADD CATEGORY SNACKBAR -->
    <v-snackbar
      v-model="openAddCategorySnack"
      timeout="5000"
      left
      color="success"
    >
      {{ openAddCategorySnackText }}
    </v-snackbar>
    <!-- ADD CATEGORY SNACKBAR -->
  </div>
</template>
<script>
import * as common from "../../utils/Common";
import ShowShopkeepersList from "./SuperAdminComponents/ShowShopkeepersList.vue";
export default {
  name: "AdminDashboard",
  components: {
    ShowShopkeepersList,
  },
  data: () => ({
    openAddCategorySnack: false,
    openAddCategorySnackText: "",
  }),
  methods: {
    showAddCategorySnack(msg) {
      this.openAddCategorySnack = true;
      this.openAddCategorySnackText = msg;
    },
  },
  beforeCreate() {
    common.cLog(this.$options.name, "beforeCreate");
  },
  created() {
    common.cLog(this.$options.name, "created");
  },
  beforeMount() {
    common.cLog(this.$options.name, "beforeMount");
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
