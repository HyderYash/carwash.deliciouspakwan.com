<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="shopkeeperslist"
      sort-by="calories"
      class="elevation-1"
      :search="search"
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Shopkeepers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
            style="width: 0px"
          ></v-text-field>
          <v-spacer></v-spacer>
          <!--------------------EDIT/ADD SHOPKEEPER------------------------>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Shopkeeper
              </v-btn>
            </template>
            <v-card>
              <form @submit.prevent="saveShopkeepersObj">
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-text-field
                      outlined
                      v-model="editedItem.SK_USER_NAME"
                      label="Username"
                      type="text"
                      required
                    ></v-text-field>
                    <v-text-field
                      outlined
                      v-model="editedItem.SK_DISPLAY_NAME"
                      label="Display Name"
                      type="text"
                      required
                    ></v-text-field>
                    <v-text-field
                      outlined
                      v-model="editedItem.SK_EMAIL"
                      label="Email"
                      type="email"
                      required
                    ></v-text-field>
                    <v-text-field
                      outlined
                      v-model="editedItem.SK_PHONE"
                      label="Phone"
                      type="tel"
                      required
                    ></v-text-field>
                    <v-text-field
                      outlined
                      v-model="editedItem.SK_COUNTRY"
                      label="Country"
                      type="text"
                      required
                    ></v-text-field>

                    <v-text-field
                      outlined
                      v-model="editedItem.SK_STATE"
                      label="State"
                      type="text"
                      required
                    ></v-text-field>

                    <v-text-field
                      outlined
                      v-model="editedItem.SK_CITY"
                      label="City"
                      type="tetx"
                      required
                    ></v-text-field>

                    <v-text-field
                      outlined
                      v-model="editedItem.SK_ADDRESS"
                      label="Address"
                      type="text"
                      required
                    ></v-text-field>
                    <v-text-field
                      outlined
                      v-model="editedItem.SK_PINCODE"
                      label="Pincode"
                      type="number"
                      required
                    ></v-text-field>

                    <v-radio-group v-model="editedItem.USER_STATUS" row>
                      <v-radio label="Active" value="Y"></v-radio>
                      <v-radio label="In Active" value="N"></v-radio>
                    </v-radio-group>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text type="submit"> Save </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-dialog>
          <!--------------------EDIT/ADD SHOPKEEPER------------------------>

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
      <template v-slot:item.USER_STATUS="{ item }">
        <v-chip
          class="ma-2"
          :color="getChipColor(item.USER_STATUS)"
          text-color="white"
        >
          {{ item.USER_STATUS }}
        </v-chip>
      </template>
      <template v-slot:item.SK_PHONE="{ item }">
        <a :href="'tel:' + item.SK_PHONE">{{ item.SK_PHONE }}</a>
      </template>
      <template v-slot:item.SK_EMAIL="{ item }">
        <a :href="'mailto:' + item.SK_EMAIL">{{ item.SK_EMAIL }}</a>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="getItemToBeEditedKey(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="sendCredientialToShopkeeper(item)">
          mdi-email
        </v-icon>
      </template>
      <template v-slot:no-data>
        <p>The Table is Empty. Please insert data with the above Button.</p>
      </template>
    </v-data-table>
    <v-dialog v-model="showNewShopkeeperDetailsDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h5"> Shopkeeper Details </v-card-title>
        <p style="color: red; font-size: 12px; margin-left: 25px">
          Note: Copy this and send this information to the shopkeeper
        </p>
        <v-container>
          <ul>
            <li>
              Username: <strong>{{ newShopKeeperDetails.SK_USER_NAME }}</strong>
            </li>
            <li>
              Display Name:
              <strong>{{ newShopKeeperDetails.SK_DISPLAY_NAME }}</strong>
            </li>
            <li>
              Temporary Password:
              <strong>{{ newShopKeeperDetails.SK_PWD }}</strong>
            </li>
            <li>
              Phone:
              <strong>{{ newShopKeeperDetails.SK_PHONE }}</strong>
            </li>
            <li>
              Email: <strong>{{ newShopKeeperDetails.SK_EMAIL }}</strong>
            </li>
          </ul>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="showNewShopkeeperDetailsDialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import * as common from "../../../utils/Common";
import * as config from "../../../config/config";

export default {
  name: "ShowShopkeepersList",
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
      { text: "Username", value: "SK_USER_NAME" },
      { text: "Display Name", value: "SK_DISPLAY_NAME" },
      { text: "Email", value: "SK_EMAIL" },
      { text: "Phone", value: "SK_PHONE" },
      { text: "Address", value: "SK_ADDRESS" },
      { text: "City", value: "SK_CITY" },
      { text: "State", value: "SK_STATE" },
      { text: "Country", value: "SK_COUNTRY" },
      { text: "Pincode", value: "SK_PINCODE" },
      { text: "Status", value: "USER_STATUS" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    shopkeeperslist: [],
    editedIndex: -1,
    editedItem: {
      SK_USER_NAME: "",
      SK_DISPLAY_NAME: "",
      SK_EMAIL: "",
      SK_PHONE: "",
      SK_ADDRESS: "",
      SK_CITY: "",
      SK_STATE: "",
      SK_COUNTRY: "",
      SK_PINCODE: "",
      USER_STATUS: "",
    },
    defaultItem: {
      SK_USER_NAME: "",
      SK_DISPLAY_NAME: "",
      SK_EMAIL: "",
      SK_PHONE: "",
      SK_ADDRESS: "",
      SK_CITY: "",
      SK_STATE: "",
      SK_COUNTRY: "",
      SK_PINCODE: "",
      USER_STATUS: "",
    },
    newShopKeeperDetails: {},
    itemToBeDeleted: null,
    showNewShopkeeperDetailsDialog: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Add New Shopkeeper"
        : "Edit Shopkeeper Details";
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
    async getShopkeepersList() {
      try {
        this.loading = true;
        const formData = {
          USER_TYPE: common.getLoggedUserInfo("USER_TYPE"),
        };
        await common
          .fetchAPIData(config.GETSHOPKEEPERS_API, formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.shopkeeperslist = json.records;
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
    async addNewShopkepper() {
      try {
        this.loading = true;
        const formData = this.editedItem;
        console.log(formData);
        common
          .fetchAPIData(config.ADDSHOPKEEPER_API, formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.$emit("showAddCategorySnack", json.message);
              this.close();
              this.getShopkeepersList();
              this.newShopKeeperDetails = json.shopkeeper;
              this.showNewShopkeeperDetailsDialog = true;
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
    async editShopkeeper() {
      try {
        this.editedItem["ID"] = this.editedIndex + 1;
        const formData = this.editedItem;
        await common
          .fetchAPIData(config.EDITSHOPKEEPER_API, formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.$emit("showAddCategorySnack", json.message);
              this.close();
              this.getShopkeepersList();
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
              this.getShopkeepersList();
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
      this.editedIndex = this.shopkeeperslist.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      common.cLog("getItemToBeEditedKey function", true);
    },

    sendCredientialToShopkeeper(item) {
      this.editedIndex = this.shopkeeperslist.indexOf(item);
      this.itemToBeDeleted = this.editedIndex + 1;
      this.dialogDelete = true;
      common.cLog("sendCredientialToShopkeeper function", true);
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

    saveShopkeepersObj() {
      if (this.editedIndex > -1) {
        //   WHEN EDITING
        this.editShopkeeper();
      } else {
        //   WHEN ADDING NEW
        this.addNewShopkepper();
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
    this.getShopkeepersList().then(() => {
      common.cLog("getShopkeepersList function completed");
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
.viewaddress {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
