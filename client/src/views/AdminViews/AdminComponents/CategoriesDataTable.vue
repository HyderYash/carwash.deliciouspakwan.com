<template>
  <v-data-table
    :headers="headers"
    :items="categories"
    sort-by="calories"
    class="elevation-1"
    :search="search"
    :loading="loading"
    loading-text="Loading... Please wait"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Categories</v-toolbar-title>
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
              New Category
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
                  v-model="editedItem.CAT_NAME"
                  label="Category Name"
                ></v-text-field>
                <v-textarea
                  outlined
                  v-model="editedItem.CAT_DESC"
                  label="Category Description"
                ></v-textarea>
                <v-radio-group v-model="editedItem.CAT_STATUS" row>
                  <v-radio label="Active" value="Y" color="success"></v-radio>
                  <v-radio label="Inactive" value="N" color="red"></v-radio>
                </v-radio-group>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
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
              <v-btn color="blue darken-1" text @click="deleteCategory"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.CAT_STATUS="{ item }">
      <v-chip :color="getChipColor(item.CAT_STATUS)" dark>
        {{ item.CAT_STATUS }}
      </v-chip>
    </template>
    <template v-slot:item.CAT_NAME="{ item }">
      <span
        v-if="item.CAT_STATUS === 'Y'"
        class="showCatName"
        @click="redirectToSubCategory(item.ID)"
        >{{ item.CAT_NAME }}</span
      >
      <span v-else>{{ item.CAT_NAME }}</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="getItemToBeEditedKey(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="getItemToBeDeletedKey(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <p>The Table is Empty. Please insert data with the above Button.</p>
    </template>
  </v-data-table>
</template>
<script>
import * as common from "../../../utils/Common";

export default {
  name: "CategoriesDataTable",
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    loading: true,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "ID",
      },
      { text: "Category Name", value: "CAT_NAME" },
      { text: "Category Description", value: "CAT_DESC" },
      { text: "Category Status", value: "CAT_STATUS" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    categories: [],
    editedIndex: -1,
    editedItem: {
      CAT_NAME: "",
      CAT_DESC: "",
      CAT_STATUS: "Y",
    },
    defaultItem: {
      CAT_NAME: "",
      CAT_DESC: "",
      CAT_STATUS: "",
    },
    itemToBeDeleted: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add New Category" : "Edit Category";
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
    async getCategories() {
      try {
        this.loading = true;
        await common
          .fetchAPIData("/get/getCategoriesForAdmin", "", "GET")
          .then((json) => {
            if (json.status === "Success") {
              this.categories = json.records;
              this.loading = false;
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
    async addNewCateogry() {
      try {
        this.loading = true;
        const formData = {
          CAT_NAME: this.editedItem.CAT_NAME,
          CAT_DESC: this.editedItem.CAT_DESC,
          CAT_STATUS: this.editedItem.CAT_STATUS,
        };
        common
          .fetchAPIData("/post/addCategory", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.$emit("showAddCategorySnack", json.message);
              this.close();
              this.getCategories();
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
    async editCategory() {
      try {
        const formData = {
          CAT_NAME: this.editedItem.CAT_NAME,
          CAT_DESC: this.editedItem.CAT_DESC,
          CAT_STATUS: this.editedItem.CAT_STATUS,
          ID: this.editedIndex + 1,
        };
        await common
          .fetchAPIData("/post/editCategory", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.$emit("showAddCategorySnack", json.message);
              this.close();
              this.getCategories();
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

    async deleteCategory() {
      try {
        const formData = {
          ID: this.itemToBeDeleted,
        };
        await common
          .fetchAPIData("/post/deleteCategory", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.$emit("showAddCategorySnack", json.message);
              this.closeDelete();
              this.getCategories();
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
    redirectToSubCategory(catID) {
      this.$router.push(`/subcategorydetails/${catID}`);
      common.cLog(catID, true);
    },
    getItemToBeEditedKey(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      common.cLog("getItemToBeEditedKey function", true);
    },

    getItemToBeDeletedKey(item) {
      this.editedIndex = this.categories.indexOf(item);
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
        this.editCategory();
      } else {
        //   WHEN ADDING NEW
        this.addNewCateogry();
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
    this.getCategories().then(() => {
      common.cLog("getCategories function completed");
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
.showCatName {
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
}
</style>
