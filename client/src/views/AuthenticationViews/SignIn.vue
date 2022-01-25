<template>
  <v-container fluid>
    <v-form
      @submit.prevent="login"
      ref="login_form"
      v-model="login_valid"
      lazy-validation
    >
      <v-text-field
        v-model="login_name"
        :counter="15"
        :rules="login_nameRules"
        label="Name"
        required
        outlined
        prepend-inner-icon="mdi-account"
        autocomplete="on"
      ></v-text-field>

      <v-text-field
        v-model="login_password"
        :counter="15"
        :rules="login_passRules"
        label="Password"
        required
        outlined
        prepend-inner-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
        autocomplete="on"
      ></v-text-field>

      <v-container style="padding: 0px !important">
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="8">
            <v-btn color="info" dark type="submit">
              <v-icon left dark> mdi-login </v-icon>Login
            </v-btn>
          </v-col>
          <v-col cols="6" md="4" class="forgotPasswordContainer">
            <span class="forgotPassword" @click="showForgotPassModal"
              >Forgot Password?</span
            >
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import * as common from "../../utils/Common";
import * as config from "../../config/config";
export default {
  name: "Login",
  data: () => ({
    loading: false,
    showPassword: false,
    login_valid: true,
    login_name: "yash",
    login_password: "yash@1234",
    login_nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 15) || "Name must be less than 15 characters",
    ],
    login_passRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 15) || "Password must be less than 15 characters",
    ],
  }),
  methods: {
    async login() {
      try {
        if (this.$refs.login_form.validate() === false) {
          setTimeout(() => {
            this.resetLoginFormValidation();
          }, 3000);
          return;
        }

        this.loading = true;
        const formData = {
          USER_NAME: this.login_name,
          USER_PASS: this.login_password,
        };
        common
          .fetchAPIData(config.SIGIN_API, formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              sessionStorage.setItem("user_token", json.userData.USER_TOKEN);
              sessionStorage.setItem(
                "user_data",
                JSON.stringify(json.userData)
              );
              this.redirectToDesiredUI(json.userData.USER_TYPE);
            } else {
              this.$emit("showSigInErrorSnack", json.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    },
    resetLoginFormValidation() {
      this.$refs.login_form.resetValidation();
    },
    showForgotPassModal() {
      this.$emit("showForgotPasswordDialog");
    },
    redirectToDesiredUI(userType) {
      if (userType === "U") {
        this.$router.push({
          name: "UserDashboard",
        });
      } else if (userType === "A") {
        this.$router.push({
          name: "AdminDashboard",
        });
      } else {
        this.$router.push({
          name: "SuperAdminDashboard",
        });
      }
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
.forgotPasswordContainer {
  display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
}
.forgotPassword {
  font-size: 14px;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}
</style>
