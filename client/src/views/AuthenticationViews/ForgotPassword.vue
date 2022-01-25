<template>
  <div>
    <v-stepper
      v-model="myData.stepNum"
      vertical
      style="padding-bottom: 0px !important"
    >
      <v-stepper-step :complete="myData.stepNum > 1" step="1">
        Enter your Username
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form
          ref="userNameForm_valid"
          v-model="myData.userNameForm_valid"
          lazy-validation
          @submit.prevent="checkUsernameInDB"
        >
          <v-text-field
            v-model="myData.username"
            :counter="15"
            :rules="myData.userNameRules"
            label="Username"
            required
            outlined
            prepend-inner-icon="mdi-account"
            autocomplete="on"
            style="margin-top: 5px"
          ></v-text-field>
          <div v-if="myData.userNameErr !== ''">
            <span class="errorMsg">{{ myData.userNameErr }}</span>
            <br />
          </div>

          <v-btn color="primary" style="margin-top: 5px" type="submit">
            Submit
          </v-btn>
        </v-form>
      </v-stepper-content>

      <v-stepper-step :complete="myData.stepNum > 2" step="2">
        Enter the OTP sent to your email
      </v-stepper-step>

      <v-stepper-content step="2">
        <div class="position-relative" style="max-width: 300px">
          <v-otp-input
            v-model="myData.otp"
            :disabled="myData.loading"
            @finish="onFinishWritingOTP"
            ref="otpInput"
          ></v-otp-input>
          <v-overlay absolute :value="myData.loading">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-overlay>
        </div>
        <div v-if="myData.otpErr !== ''">
          <span class="errorMsg">{{ myData.otpErr }}</span>
          <br />
        </div>
        <v-btn color="primary" @click="checkUsernameInDB"> Resend OTP </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="myData.stepNum > 3" step="3">
        Change Password
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-form
          ref="passForm_valid"
          v-model="myData.passForm_valid"
          lazy-validation
        >
          <v-text-field
            v-model="myData.fp_password"
            :counter="15"
            :rules="myData.fp_passRules"
            label="Password"
            required
            outlined
            prepend-inner-icon="mdi-lock"
            :append-icon="myData.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="myData.showPassword ? 'text' : 'password'"
            @click:append="myData.showPassword = !myData.showPassword"
            style="margin-top: 5px"
          ></v-text-field>

          <v-text-field
            v-model="myData.fp_confirmPassword"
            :counter="15"
            :rules="[
              !!myData.fp_confirmPassword || 'Confirm Password is required',
              myData.fp_password === myData.fp_confirmPassword ||
                'The password confirmation does not match.',
            ]"
            label="Confirm Password"
            required
            outlined
            prepend-inner-icon="mdi-lock"
            :append-icon="
              myData.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'
            "
            :type="myData.showConfirmPassword ? 'text' : 'password'"
            @click:append="
              myData.showConfirmPassword = !myData.showConfirmPassword
            "
          ></v-text-field>
          <v-btn color="primary" @click="changePassword"> Submit </v-btn>
        </v-form>
      </v-stepper-content>

      <v-stepper-step step="4"> {{ myData.forgotPassMsg }} </v-stepper-step>
      <v-stepper-content step="4">
        <v-card
          color="grey lighten-1"
          class="mb-12"
          height="200px"
          style="display: flex; justify-content: center; align-items: center"
        >
          <div v-if="myData.forgotPassStatus === 'Success'">
            <v-avatar color="success" size="80">
              <v-icon dark size="55"> mdi-check </v-icon>
            </v-avatar>
          </div>
          <div v-if="myData.forgotPassStatus === 'Failed'">
            <v-avatar color="error" size="80">
              <v-icon dark size="55"> mdi-alert </v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-stepper-content>
      <v-container fluid style="margin-top: 20px; display: flex; float: right">
        <v-btn
          color="error"
          style="text-align: center"
          @click="closeForgotPassModal"
          ><v-icon left> mdi-close </v-icon>CLOSE</v-btn
        >
      </v-container>
    </v-stepper>
  </div>
</template>
<script>
import * as common from "../../utils/Common";
import * as config from "../../config/config";
export default {
  name: "ForgotPassword",
  data: () => ({
    myData: {
      stepNum: 1,
      username: "",
      userNameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 15) || "Name must be less than 15 characters",
      ],
      userNameForm_valid: true,
      passForm_valid: true,
      userId: "",
      userNameErr: "",
      otp: "",
      otpErr: "",
      loading: false,
      fp_password: "",
      fp_passRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length <= 15) || "Password must be less than 15 characters",
      ],
      fp_confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      forgotPassStatus: "",
      forgotPassMsg: "Password Status",
    },
    myDataCopy: {},
  }),
  methods: {
    checkUsernameInDB() {
      if (this.$refs.userNameForm_valid.validate() === false) {
        return;
      }
      const formData = {
        USER_NAME: this.myData.username,
      };
      common
        .fetchAPIData(config.CHECKUSERNAMEINDBANDSENDOTP_API, formData, "POST")
        .then((json) => {
          if (json.status === "Success") {
            this.myData.userId = json.userID;
            this.myData.stepNum = 2;
          } else {
            this.myData.userNameErr = json.message;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onFinishWritingOTP() {
      this.loading = true;
      const formData = {
        USER_ID: this.myData.userId,
        USER_OTP: this.myData.otp,
        USER_NAME: this.myData.username,
      };
      common
        .fetchAPIData(config.VERIFYOTP_API, formData, "POST")
        .then((json) => {
          if (json.status === "Success") {
            this.myData.stepNum = 3;
            this.myData.otp = "";
          } else {
            this.myData.otpErr = json.message;
            this.myData.otp = "";
          }
          this.myData.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.myData.loading = false;
        });
    },
    changePassword() {
      if (this.$refs.passForm_valid.validate() === false) {
        setTimeout(() => {
          this.$refs.passForm_valid.resetValidation();
        }, 3000);
        return;
      }
      const formData = {
        USER_PASS: this.myData.fp_password,
        USER_ID: this.myData.userId,
        USER_NAME: this.myData.username,
      };
      common
        .fetchAPIData(config.CHANGEPASSWORD_API, formData, "POST")
        .then((json) => {
          if (json.status === "Success") {
            this.myData.forgotPassStatus = json.status;
            this.myData.forgotPassMsg = json.message;
            this.myData.stepNum = 4;
          } else {
            this.myData.forgotPassStatus = json.status;
            this.myData.forgotPassMsg = json.message;
            this.myData.stepNum = 4;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async closeForgotPassModal() {
      // MAIN DATA
      await this.setDataToInitial();
      // AFTER CLEANUP
      this.$emit("closeForgotPasswordDialog");
    },
    async setDataToInitial() {
      try {
        this.myData = { ...this.myDataCopy };
      } catch (err) {
        console.log(err);
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
    this.myDataCopy = { ...this.myData };
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
