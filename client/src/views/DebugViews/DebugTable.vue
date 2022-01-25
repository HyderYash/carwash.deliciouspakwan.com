<template>
  <v-simple-table dense class="debugTable">
    <template v-slot:default>
      <thead>
        <tr class="debugTableTr">
          <th class="text-left">ID</th>
          <th class="text-left">Debug Information</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in debugInfo" :key="item.id">
          <td>{{ index }}</td>
          <td>{{ item.data }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import * as common from "../../utils/Common";

export default {
  name: "DebugTable",
  data() {
    return {
      debugInfo: common.returnStoredDebugInfo(),
    };
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
.debugTable {
  background: beige !important;
  border: 1px solid lightpink !important;
}
.debugTableTr {
  background: lightpink !important;
}
</style>
