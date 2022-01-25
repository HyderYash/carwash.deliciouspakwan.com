<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="subCategories"
      sort-by="calories"
      class="elevation-1"
      :search="search"
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <router-link to="/admindashboard" exact class="catName">
            <v-toolbar-title>{{ setCatName }}</v-toolbar-title>
          </router-link>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
            style="width: 0px"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Sub Category
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-text-field
                    outlined
                    v-model="editedItem.SUB_CAT_NAME"
                    label="Sub Category Name"
                  ></v-text-field>
                  <v-textarea
                    outlined
                    v-model="editedItem.SUB_CAT_DESC"
                    label="Sub Category Description"
                  ></v-textarea>
                  <v-radio-group v-model="editedItem.SUB_CAT_STATUS" row>
                    <v-radio label="Active" value="Y" color="success"></v-radio>
                    <v-radio label="Inactive" value="N" color="red"></v-radio>
                  </v-radio-group>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteSubCategory"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.SUB_CAT_STATUS="{ item }">
        <v-chip :color="getChipColor(item.SUB_CAT_STATUS)" dark>
          {{ item.SUB_CAT_STATUS }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="getItemToBeEditedKey(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="getItemToBeDeletedKey(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <p>
          <b
            >There is no sub category for this category... Please insert sub
            category with the "New Item" Button</b
          >
        </p>
      </template>
    </v-data-table>
    <!-- ADD CATEGORY SNACKBAR -->
    <v-snackbar v-model="showSnackbar" timeout="5000" left color="success">
      {{ snackbarMessage }}
    </v-snackbar>
    <!-- ADD CATEGORY SNACKBAR -->
  </div>
</template>
<script>
import * as common from "../../utils/Common";

export default {
  name: "SubCategoryDetails",
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    loading: true,
    showSnackbar: false,
    snackbarMessage: "",
    headers: [
      {
        text: "ID",
        align: "start",
        value: "ID",
      },
      { text: "Sub Category Name", value: "SUB_CAT_NAME" },
      { text: "Sub Category Description", value: "SUB_CAT_DESC" },
      { text: "Sub Category Status", value: "SUB_CAT_STATUS" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    subCategories: [],
    editedIndex: -1,
    editedItem: {
      SUB_CAT_NAME: "",
      SUB_CAT_DESC: "",
      SUB_CAT_STATUS: "Y",
    },
    defaultItem: {
      SUB_CAT_NAME: "",
      SUB_CAT_DESC: "",
      SUB_CAT_STATUS: "",
    },
    itemToBeDeleted: null,
    setCatName: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Add New Sub Category"
        : "Edit Sub Category";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    async getSubCategories() {
      try {
        this.loading = true;
        this.loading = true;
        const formData = {
          CAT_ID: this.$route.params.id,
        };
        common
          .fetchAPIData("/post/getSubCategoriesForAdmin", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.setCatName = json.CAT_NAME;
              this.subCategories = json.records;
              this.loading = false;
              common.cLog(JSON.stringify(json, undefined, 4));
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
    async addNewSubCategory() {
      try {
        this.loading = true;
        const formData = {
          CAT_ID: this.$route.params.id,
          SUB_CAT_NAME: this.editedItem.SUB_CAT_NAME,
          SUB_CAT_DESC: this.editedItem.SUB_CAT_DESC,
          SUB_CAT_STATUS: this.editedItem.SUB_CAT_STATUS,
        };
        common
          .fetchAPIData("/post/addSubCategory", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.showSnackbar = true;
              this.snackbarMessage = json.message;
              this.close();
              this.getSubCategories();
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
    async editSubCategory() {
      try {
        const formData = {
          SUB_CAT_NAME: this.editedItem.SUB_CAT_NAME,
          SUB_CAT_DESC: this.editedItem.SUB_CAT_DESC,
          SUB_CAT_STATUS: this.editedItem.SUB_CAT_STATUS,
          ID: this.editedIndex + 1,
        };
        await common
          .fetchAPIData("/post/editSubCategory", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.showSnackbar = true;
              this.snackbarMessage = json.message;
              this.close();
              this.getSubCategories();
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

    async deleteSubCategory() {
      try {
        const formData = {
          ID: this.itemToBeDeleted,
        };
        await common
          .fetchAPIData("/post/deleteSubCategory", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.showSnackbar = true;
              this.snackbarMessage = json.message;
              this.closeDelete();
              this.getSubCategories();
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
    getItemToBeEditedKey(item) {
      this.editedIndex = this.subCategories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      common.cLog("getItemToBeEditedKey function", true);
    },

    getItemToBeDeletedKey(item) {
      this.editedIndex = this.subCategories.indexOf(item);
      this.itemToBeDeleted = this.editedIndex + 1;
      this.dialogDelete = true;
      common.cLog("getItemToBeDeletedKey function", true);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        //   WHEN EDITING
        this.editSubCategory();
      } else {
        //   WHEN ADDING NEW
        this.addNewSubCategory();
      }
      this.close();
    },
    getChipColor(status) {
      if (status === "Y") return "success";
      else return "red";
    },
  },
  beforeCreate() {
    common.cLog(this.$options.name, "beforeCreate");
  },
  created() {
    this.getSubCategories().then(() => {
      common.cLog("getSubCategories function completed");
    });
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

<style scoped>
.catName {
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
  color: black;
}
</style>
