<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="4">
        <v-card outlined style="height: 100%">
          <h1 style="text-align: center; font-size: 1.5rem">Your Car Wash</h1>
          <DailyRoutinePie />
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="8">
        <v-card outlined>
          <EnterTodayRoutine />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import DailyRoutinePie from "./DailyRoutinePie.vue";
import EnterTodayRoutine from "./EnterTodayRoutine.vue";
export default {
  name: "ShowDailyRoutine",
  components: {
    DailyRoutinePie,
    EnterTodayRoutine,
  },
};
</script>
<style scoped></style>
