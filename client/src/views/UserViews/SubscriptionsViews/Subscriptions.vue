<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="4">
          <v-card outlined style="height: 100%">
            <ShowCategories
              :showSubLoading="showSubLoading"
              :categories="categories"
              @getSubscriptions="getSubscriptions"
            />
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="8">
          <v-card outlined>
            <AddCategories
              :showAddLoading="showAddLoading"
              :availableCategories="availableCategories"
              @getAvailableSubscriptions="getAvailableSubscriptions"
              @subscribeUserToCategory="subscribeUserToCategory"
              @toggleAddCategoryDialog="toggleAddCategoryDialog"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- ADD CATEGORY HOURS DIALOG -->
    <v-dialog v-model="addCategoryHoursDialog" max-width="600" persistent>
      <AddCategoryHours
        @toggleAddCategoryDialog="toggleAddCategoryDialog"
        :selectedId="selectAvailableCategory"
        @subscribeUserToCategory="subscribeUserToCategory"
        :key="componentKey"
      />
    </v-dialog>
    <!-- ADD CATEGORY HOURS DIALOG -->
  </div>
</template>
<script>
import * as common from "../../../utils/Common";
import ShowCategories from "./ShowCategories.vue";
import AddCategories from "./AddCategories.vue";
import AddCategoryHours from "./AddCategoryHours.vue";
export default {
  name: "Subscriptions",
  components: {
    ShowCategories,
    AddCategories,
    AddCategoryHours,
  },
  data: () => ({
    showSubLoading: false,
    categories: [],
    showAddLoading: false,
    availableCategories: [],
    addCategoryHoursDialog: false,
    selectAvailableCategory: "",
    setCatHours: [],
    componentKey: 0,
  }),
  methods: {
    async getSubscriptions() {
      try {
        this.showSubLoading = true;
        const formData = {
          USER_ID: common.getLoggedUserInfo("ID"),
        };
        await common
          .fetchAPIData("/post/getCategoriesSubscription", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.categories = json.records;
              this.showSubLoading = false;
            }
          })
          .catch((err) => {
            console.log(err);
          });
        common.debugComponentKeyChange(this.$root);
      } catch (err) {
        console.log(err);
      }
    },
    async getAvailableSubscriptions() {
      try {
        this.showSubLoading = true;
        const formData = {
          USER_ID: common.getLoggedUserInfo("ID"),
        };
        await common
          .fetchAPIData("/post/getAvailableSubscriptions", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.availableCategories = json.records;
              this.showSubLoading = false;
            }
          })
          .catch((err) => {
            console.log(err);
          });
        common.debugComponentKeyChange(this.$root);
      } catch (err) {
        console.log(err);
      }
    },
    async subscribeUserToCategory(catId, catHours) {
      try {
        const formData = {
          USER_ID: common.getLoggedUserInfo("ID"),
          CAT_ID: catId,
          CAT_HOURS: catHours,
        };
        await common
          .fetchAPIData("/post/subscribeUserToCategory", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.showAddLoading = true;
              this.addCategoryHoursDialog = false;
              this.getSubscriptions();
              this.getAvailableSubscriptions();
              this.showAddLoading = false;
              this.componentKey += 1;
            }
          })
          .catch((err) => {
            console.log(err);
          });
        common.debugComponentKeyChange(this.$root);
      } catch (err) {
        console.log(err);
      }
    },
    toggleAddCategoryDialog(catId) {
      this.selectAvailableCategory = catId;
      console.log(this.selectAvailableCategory);
      this.addCategoryHoursDialog = !this.addCategoryHoursDialog;
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
<style scoped></style>
