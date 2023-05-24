<template>
  <div class="card-wrapper d-flex justify-content-around flex-wrap">
    <ContentListItem v-if="contents?.length" v-for="content in contents" :content="content" :key="content._id" />
  <NotFound v-else/>
  </div>
</template>
<script>
import axios from "axios";
import { backendUrl } from "../../../env";
import ContentListItem from "../content-list-item/ContentListItem.vue";
import NotFound from "../not-found/NotFound.vue";
export default {
  data() {
    return {
      ContentArr: [],
      url: backendUrl,
      config: {
        headers: {
          token: JSON.parse(localStorage.getItem("userInfo")),
        },
      },
      user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
      query: this.$route.query,
    };
  },
  components: {
    ContentListItem,
    NotFound
  },
  props: {
    contents: {
      type: Array,
      required: true
    },
    filter: {
      type: String
    }
  },

  methods: {},
};
</script>
<style scoped>
.card-wrapper {
  width: 90%;
  margin: 2rem auto;
  min-height: 80vh;
}
</style>
