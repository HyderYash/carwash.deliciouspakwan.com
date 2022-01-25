<template>
  <div>
    <v-container style="margin-top: 3rem">
      <v-card class="mx-auto my-auto" width="400">
        <v-tabs background-color="deep-purple accent-4" centered dark>
          <v-tabs-slider />
          <v-tab> LOGIN </v-tab>

          <!-- LOGIN FORM -->
          <v-tab-item>
            <SignIn
              @showSigInErrorSnack="showSigInErrorSnack"
              @showForgotPasswordDialog="showForgotPasswordDialog"
            />
          </v-tab-item>
          <!-- LOGIN FORM -->
        </v-tabs>
      </v-card>
    </v-container>

    <!-- SIGNIN ERROR SNACKBAR -->
    <v-snackbar v-model="openSigInErrorSnack" timeout="5000" left color="error">
      {{ showSigInErrorSnackText }}
    </v-snackbar>
    <!-- SIGNIN ERROR SNACKBAR -->

    <!-- FORGOT PASSWORD DIALOG -->
    <v-dialog v-model="forgotPasswordDialog" max-width="600" persistent>
      <ForgotPassword
        @closeForgotPasswordDialog="closeForgotPasswordDialog"
        :key="forgotPassCompKey"
      />
    </v-dialog>
    <!-- FORGOT PASSWORD DIALOG -->
  </div>
</template>

<script>
import * as common from "../../utils/Common";
import SignIn from "./SignIn.vue";
import ForgotPassword from "./ForgotPassword.vue";

export default {
  name: "Login",
  components: {
    SignIn,
    ForgotPassword,
  },
  data: () => ({
    openSigInErrorSnack: false,
    showSigInErrorSnackText: "",
    forgotPasswordDialog: false,
    forgotPassCompKey: 1,
  }),
  methods: {
    setCurrentTabToLogin(newVal) {
      this.currentTab = newVal;
    },
    showSigInErrorSnack(msg) {
      this.openSigInErrorSnack = true;
      this.showSigInErrorSnackText = msg;
    },
    showForgotPasswordDialog() {
      this.forgotPassCompKey += 1;
      this.forgotPasswordDialog = true;
    },
    closeForgotPasswordDialog() {
      this.forgotPasswordDialog = false;
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
