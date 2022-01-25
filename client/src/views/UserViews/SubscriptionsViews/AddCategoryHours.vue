<template>
  <v-card>
    <v-container fluid class="cardHeader">
      <h2>Add Hours</h2>
      <v-btn icon @click="$emit('toggleAddCategoryDialog')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-container>
    <v-container fluid>
      <v-form @submit.prevent="addHoursToCat">
        <v-row>
          <v-col cols="12" sm="12" md="6">
            <p>Log Time</p>
            <v-text-field
              solo
              autofocus
              v-model="enteredTime"
              required
              type="number"
              :error="inputErr"
              :error-messages="inputErrMsg"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <p>Time remaining</p>
            <v-text-field
              label="Solo"
              solo
              readonly
              :value="calculateRemainingTime() + 'h'"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn color="primary" type="submit">
          <v-icon left dark> mdi-clock </v-icon>
          Log Time
        </v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>
<script>
import * as common from "../../../utils/Common";
export default {
  name: "AddCategoryHours",
  props: ["selectedId"],
  data: () => ({
    setCatHours: [],
    totalTimeOfUser: 0,
    remainingTime: 0,
    loggingTime: 0,
    enteredTime: 0,
    inputErr: false,
    inputErrMsg: "",
  }),
  mounted() {
    this.getCatHourStatsOfUser();
  },
  methods: {
    async getCatHourStatsOfUser() {
      try {
        const formData = {
          USER_ID: common.getLoggedUserInfo("ID"),
        };
        await common
          .fetchAPIData("/post/getCatHourStatsOfUser", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.totalTimeOfUser = json.totalCatHours;
              this.setCatHours = json.records;
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
    calculateRemainingTime() {
      return (this.remainingTime = 24 - this.totalTimeOfUser);
    },
    async addHoursToCat() {
      if (this.enteredTime > this.remainingTime || this.enteredTime <= 0) {
        this.inputErr = true;
        this.inputErrMsg = `Cannot enter time more than ${this.remainingTime}h or less than 0`;
        return;
      } else if (this.enteredTime === "" || this.enteredTime === undefined) {
        this.inputErr = true;
        this.inputErrMsg = `Time cannot be empty.`;
        return;
      }
      this.$emit(
        "subscribeUserToCategory",
        this.selectedId,
        parseInt(this.enteredTime)
      );
    },
  },
};
</script>
<style scoped>
.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.showTitleAndTime {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
  padding: 2px;
}
p {
  margin-bottom: 0px !important;
}
.progress-mb {
  margin-bottom: 5px;
}
</style>
