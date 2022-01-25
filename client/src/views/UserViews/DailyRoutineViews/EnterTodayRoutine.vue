<template>
  <div>
    <v-toolbar dense style="box-shadow: none !important">
      <v-toolbar-title class="toolbarTitle">Today's Routine</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="primary">
        <v-icon left dark> mdi-plus </v-icon>
        Add Task
      </v-btn>
    </v-toolbar>
    <v-list subheader>
      <v-subheader>Upcoming</v-subheader>

      <v-list-item v-for="folder in folders" :key="folder.title">
        <v-list-item-avatar>
          <v-icon class="warning" dark> mdi-clock </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="folder.title"></v-list-item-title>

          <v-list-item-subtitle v-text="folder.subtitle"></v-list-item-subtitle>
        </v-list-item-content>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-action v-bind="attrs" v-on="on">
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-check-circle-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
          <span>Mark as done</span>
        </v-tooltip>
      </v-list-item>

      <v-divider></v-divider>

      <v-subheader>Completed</v-subheader>

      <v-list-item v-for="file in files" :key="file.title">
        <v-list-item-avatar>
          <v-icon :class="file.color" dark v-text="file.icon"></v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="file.title"></v-list-item-title>

          <v-list-item-subtitle
            v-text="'Completed on: ' + file.subtitle"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
export default {
  name: "EnterTodayRoutine",
  data: () => ({
    files: [
      {
        color: "success",
        icon: "mdi-check-circle",
        subtitle: "Jan 20, 2014",
        title: "Vacation itinerary",
      },
      {
        color: "success",
        icon: "mdi-check-circle",
        subtitle: "Jan 10, 2014",
        title: "Kitchen remodel",
      },
    ],
    folders: [
      {
        subtitle: "Due in: Jan 9, 2014",
        title: "Photos",
      },
      {
        subtitle: "Due in: Jan 17, 2014",
        title: "Recipes",
      },
      {
        subtitle: "Due in: Jan 28, 2014",
        title: "Work",
      },
    ],
  }),
};
</script>
<style scoped>
.toolbarTitle {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
