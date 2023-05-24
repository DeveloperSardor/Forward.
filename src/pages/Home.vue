<template>
  <section id="home">
    <AppFilter @CategoryFilter="UpdateContentData" />

    <ContentList :contents="ContentData" :filter="filter" />
    <div class="spinner-border" role="status" v-if="isLoading">
      <span class="visually-hidden">Loading...</span>
    </div>

  </section>
</template>
<script>
import { createToaster } from "@meforma/vue-toaster";
import { backendUrl } from "../../env";
import Aside from "../components/aside/Aside.vue";
import AppFilter from "../components/app-filter/AppFilter.vue";
import Header from "../components/header/Header.vue";
import ContentList from "../components/content/ContentList.vue";

import axios from "axios";
const toaster = createToaster()
export default {
  name: "Home",
  data() {
    return {
      filter: "All",
      ContentData: [],
      url: backendUrl,
      isLoading: false,
      userData : JSON.parse(localStorage.getItem('userInfo')),
      searchTxt: '',
      config: {
        headers: { token: JSON.parse(localStorage.getItem("userInfo")).token },
      },
    };
  },
  components: {
    Aside,
    Header,
    AppFilter,
    ContentList
  },
  async mounted() {
    document.title = 'Forward'
    this.searchTxt = this.$route.query?.search;
    this.getData()
  },

  methods: {
    async getData(){
  
        this.isLoading = true
      try {
        let { data } = await axios.get(`${this.url}/contents`, this.config)
        this.ContentData = data.data 
        this.isLoading = false
      } catch (error) {
        console.log(error.message);
        this.isLoading = false
      }
    
    },
    async UpdateContentData(filter) {
      this.isLoading = true
      this.filter = filter
      try {
        let { data } = await axios.get(
          `${this.url}/categories?category=${filter}`,
          this.config
        );
        this.ContentData = await data.data;
        this.isLoading = false
      } catch (error) {
        console.log(error.message);
        this.isLoading = false
      }
    },


  },
};
</script>

<style>
section {
  min-height: 100vh;
}

.app_filter {
  position: fixed;
  top: 10%;

  width: 90%;
  z-index: 99999;
  height: 5rem;
  display: flex;
  align-items: center;
  background: #000;
}

#home .activeCtg {
  background: #00000018 !important;
}
</style>
