<script>
import * as common from "../../../utils/Common";
import { Pie } from "vue-chartjs";
export default {
  extends: Pie,
  async mounted() {
    await this.getSubscriptions();
    this.categories.forEach((cat) => {
      // LABELS
      this.labels.push(cat.CAT_NAME);
      // BACKGROUND COLORS
      this.dataArr.push(cat.CAT_HOURS);
      // DATA ARRAY
      this.bgColors.push(this.getRandomColor());
    });
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            backgroundColor: this.bgColors,
            data: this.dataArr,
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false }
    );
  },
  data() {
    return {
      categories: [],
      labels: [],
      dataArr: [],
      bgColors: [],
    };
  },
  methods: {
    getRandomColor() {
      var letters = "BCDEF".split("");
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    },
    async getSubscriptions() {
      try {
        this.showSubLoading = true;
        const formData = {
          USER_ID: common.getLoggedUserInfo("ID"),
        };
        await common
          .fetchAPIData("/post/getCategoriesSubscription", formData, "POST")
          .then((json) => {
            if (json.status === "Success") {
              this.categories = json.records;
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
  },
};
</script>
