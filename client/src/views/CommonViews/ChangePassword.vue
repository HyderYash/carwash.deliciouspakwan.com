<template>
  <v-container style="margin-top: 3rem">
    <v-card class="mx-auto my-auto" width="600">
      <v-card-title class="cardTitleCss"> Change Password </v-card-title>
      <v-stepper v-model="stepNum" vertical>
        <v-stepper-step :complete="stepNum > 1" step="1">
          Enter current password
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-form
            ref="prevPassForm_valid"
            v-model="prevPassForm_valid"
            lazy-validation
            @submit.prevent="checkUserWithThisPass"
          >
            <v-text-field
              v-model="user_prevPass"
              :counter="15"
              :rules="user_prevPassRules"
              label="Password"
              required
              outlined
              prepend-inner-icon="mdi-lock"
              :append-icon="showPrevPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPrevPassword ? 'text' : 'password'"
              @click:append="showPrevPassword = !showPrevPassword"
              style="margin-top: 5px"
            ></v-text-field>
            <div v-if="showPrevPassError === true">
              <span class="errorMsg">{{ showPrevPassMsg }}</span>
              <br />
            </div>
            <v-btn color="primary" type="submit"> Submit </v-btn>
          </v-form>
        </v-stepper-content>

        <v-stepper-step :complete="stepNum > 2" step="2">
          Change Password
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-form ref="passForm_valid" v-model="passForm_valid" lazy-validation>
            <v-text-field
              v-model="user_pass"
              :counter="15"
              :rules="user_passRules"
              label="Password"
              required
              outlined
              prepend-inner-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              style="margin-top: 5px"
            ></v-text-field>

            <v-text-field
              v-model="user_confirmPass"
              :counter="15"
              :rules="[
                !!user_confirmPass || 'Confirm Password is required',
                user_pass === user_confirmPass ||
                  'The password confirmation does not match.',
              ]"
              label="Confirm Password"
              required
              outlined
              prepend-inner-icon="mdi-lock"
              :append-icon="showConfirmPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showConfirmPass ? 'text' : 'password'"
              @click:append="showConfirmPass = !showConfirmPass"
            ></v-text-field>

            <v-btn color="primary" @click="changePassword"> Submit </v-btn>
          </v-form>
        </v-stepper-content>
      </v-stepper>
    </v-card>
    <!-- LOGOUT DIALOG -->
    <v-dialog v-model="showLogoutModal" max-width="410" persistent>
      <v-card>
        <v-card-title class="text-h5">
          Your password has been changed successfuly...
        </v-card-title>

        <v-card-text>
          Click OK to logout and then login again with your new password.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="logoutAndCloseModal">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- LOGOUT DIALOG -->
  </v-container>
</template>
<script>
import * as common from "../../utils/Common";
import * as config from "../../config/config";
export default {
  name: "ChangePassword",
  data: () => ({
    stepNum: 1,
    showPrevPassword: false,
    prevPassForm_valid: true,
    passForm_valid: true,
    user_prevPass: "",
    user_prevPassRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 15) || "Password must be less than 15 characters",
    ],
    showPrevPassError: false,
    showPrevPassMsg: "",
    user_pass: "",
    user_passRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 15) || "Password must be less than 15 characters",
    ],
    showPassword: false,
    user_confirmPass: "",
    showConfirmPass: false,
    userName: JSON.parse(sessionStorage.getItem("user_data")).USER_NAME,
    userId: "",
    showLogoutModal: false,
  }),
  methods: {
    async checkUserWithThisPass() {
      try {
        if (this.$refs.prevPassForm_valid.validate() === false) {
          setTimeout(() => {
            this.$refs.prevPassForm_valid.resetValidation();
          }, 3000);
          return;
        }
        const formData = {
          PREV_PASS: this.user_prevPass,
          USER_NAME: this.userName,
        };
        common
          .fetchAPIData(config.CHECKUSERWITHPASS_API, formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.stepNum = 2;
              this.userId = json.userId;
            } else {
              this.showPrevPassError = true;
              this.showPrevPassMsg = json.message;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    },
    async changePassword() {
      try {
        if (this.$refs.passForm_valid.validate() === false) {
          setTimeout(() => {
            this.$refs.passForm_valid.resetValidation();
          }, 3000);
          return;
        }
        const formData = {
          USER_PASS: this.user_pass,
          USER_ID: this.userId,
          USER_NAME: common.getLoggedUserInfo("USER_NAME"),
        };
        common
          .fetchAPIData(config.CHANGEPASSWORD_API, formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.showLogoutModal = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    },
    logoutAndCloseModal() {
      common.logoutUserAndClearSession();
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
<style scoped>
.cardTitleCss {
  background: #6200ea !important;
  color: white;
}
.errorMsg {
  color: red;
  font-size: 12px;
  font-weight: bold;
}
</style>
