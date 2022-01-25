<template>
  <v-stepper v-model="stepNum" vertical>
    <v-stepper-step :complete="stepNum > 1" step="1">
      Enter Credentials
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-form
        ref="credentialForm_valid"
        v-model="credentialForm_valid"
        lazy-validation
      >
        <v-text-field
          v-model="signup_name"
          :counter="15"
          :rules="signup_nameRules"
          label="Username"
          required
          outlined
          prepend-inner-icon="mdi-account"
          style="margin-top: 5px"
        ></v-text-field>
        <div
          v-if="showUsernameError === true"
          style="margin-bottom: 12px; margin-top: -12px; margin-left: 12px"
        >
          <span class="errorMsg">{{ showUsernameMsg }}</span>
          <br />
        </div>

        <v-text-field
          v-model="signup_dpName"
          :counter="15"
          :rules="signup_dpNameRules"
          label="Display Name"
          required
          outlined
          prepend-inner-icon="mdi-account"
        ></v-text-field>

        <v-text-field
          v-model="signup_email"
          :rules="signup_emailRules"
          label="Email"
          required
          outlined
          type="email"
          prepend-inner-icon="mdi-email"
        ></v-text-field>
        <v-btn color="primary" @click="getCredentialsAndSendTempPass">
          Submit
        </v-btn>
      </v-form>
    </v-stepper-content>

    <v-stepper-step :complete="stepNum > 2" step="2">
      {{ signUpEmailMsg }}
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card
        color="grey lighten-1"
        class="mb-12"
        height="200px"
        style="display: flex; justify-content: center; align-items: center"
      >
        <div v-if="signUpEmailStatus === 'Success'">
          <v-avatar color="success" size="80">
            <v-icon dark size="55"> mdi-check </v-icon>
          </v-avatar>
        </div>
        <div v-if="signUpEmailStatus === 'Failed'">
          <v-avatar color="error" size="80">
            <v-icon dark size="55"> mdi-alert </v-icon>
          </v-avatar>
        </div>
      </v-card>
      <v-btn color="primary" @click="stepNum = 3"> Ok </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="stepNum > 3" step="3">
      Enter the Temporary password
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-form
        ref="passwordForm_valid"
        v-model="passwordForm_valid"
        lazy-validation
      >
        <v-text-field
          v-model="signup_password"
          :counter="15"
          :rules="signup_passRules"
          label="Password"
          required
          outlined
          prepend-inner-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          style="margin-top: 5px"
        ></v-text-field>
        <div v-if="showPassError === true">
          <span class="errorMsg">{{ showPassMsg }}</span>
          <br />
        </div>
        <v-btn color="primary" @click="checkPasswordOfUser"> Submit </v-btn>
      </v-form>
    </v-stepper-content>

    <v-stepper-step step="4"> {{ passFormMsg }} </v-stepper-step>
    <v-stepper-content step="4">
      <v-card
        color="grey lighten-1"
        class="mb-12"
        height="200px"
        style="display: flex; justify-content: center; align-items: center"
      >
        <div v-if="passFormStatus === 'Success'">
          <v-avatar color="success" size="80">
            <v-icon dark size="55"> mdi-check </v-icon>
          </v-avatar>
        </div>
        <div v-if="passFormStatus === 'Failed'">
          <v-avatar color="error" size="80">
            <v-icon dark size="55"> mdi-alert </v-icon>
          </v-avatar>
        </div>
      </v-card>
      <v-btn color="primary" @click="switchToSignInForm"> SignIn </v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import * as common from "../../utils/Common";
export default {
  name: "SignUp",
  data: () => ({
    stepNum: 1,
    showPassword: false,
    showConfirmPassword: false,
    credentialForm_valid: true,
    passwordForm_valid: true,
    signup_name: "",
    signup_nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 15) || "Name must be less than 15 characters",
    ],
    signup_dpName: "",
    signup_dpNameRules: [
      (v) => !!v || "Display Name is required",
      (v) =>
        (v && v.length <= 15) || "Display Name must be less than 15 characters",
    ],
    signup_email: "",
    signup_emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    signup_password: "",
    signup_passRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 15) || "Password must be less than 15 characters",
    ],
    signup_confirmPassword: "",
    signUpEmailStatus: "",
    signUpEmailMsg: "Confirmation",
    passFormStatus: "",
    passFormMsg: "Status",
    showPassError: false,
    showPassMsg: "",
    showUsernameError: false,
    showUsernameMsg: "",
  }),
  methods: {
    resetCredentialFormValidation() {
      this.$refs.credentialForm_valid.resetValidation();
    },
    resetPassFormValidation() {
      this.$refs.passwordForm_valid.resetValidation();
    },
    async getCredentialsAndSendTempPass() {
      try {
        if (this.$refs.credentialForm_valid.validate() === false) {
          setTimeout(() => {
            this.resetCredentialFormValidation();
          }, 3000);
          return;
        }
        const formData = {
          USER_NAME: this.signup_name,
          DISPLAY_NAME: this.signup_dpName,
          USER_EMAIL: this.signup_email,
        };
        common
          .fetchAPIData("/post/getcredentialsandsendtemppass", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              sessionStorage.setItem("userData", JSON.stringify(json.userData));
              this.stepNum = 2;
              this.signUpEmailStatus = json.status;
              this.signUpEmailMsg = json.message;
            } else {
              this.showUsernameError = true;
              this.showUsernameMsg = json.message;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    },
    async checkPasswordOfUser() {
      try {
        if (this.$refs.passwordForm_valid.validate() === false) {
          setTimeout(() => {
            this.resetPassFormValidation();
          }, 3000);
          return;
        }
        const { USER_NAME, USER_EMAIL, USER_PWD, USER_DISPLAY_NAME } =
          JSON.parse(sessionStorage.getItem("userData"));
        const formData = {
          USER_FE_PASS: this.signup_password,
          USER_NAME: USER_NAME,
          USER_EMAIL: USER_EMAIL,
          USER_PWD: USER_PWD,
          USER_DISPLAY_NAME: USER_DISPLAY_NAME,
        };
        common
          .fetchAPIData("/post/checkpasswordofuser", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.stepNum = 4;
              this.passFormStatus = json.status;
              this.passFormMsg = json.message;
            } else {
              this.showPassError = true;
              this.showPassMsg = json.message;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    },
    switchToSignInForm() {
      sessionStorage.clear();
      this.$emit("setCrTab", "0");
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
.errorMsg {
  color: red;
  font-size: 12px;
  font-weight: bold;
}
</style>
