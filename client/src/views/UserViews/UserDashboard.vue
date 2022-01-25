<template>
  <div>
    <ShowDailyRoutine />
    <Subscriptions />
  </div>
</template>
<script>
import ShowDailyRoutine from "./DailyRoutineViews/ShowDailyRoutine.vue";
import Subscriptions from "./SubscriptionsViews/Subscriptions.vue";
export default {
  name: "UserDashboard",
  components: {
    ShowDailyRoutine,
    Subscriptions,
  },
};
</script>
