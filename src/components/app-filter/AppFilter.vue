<template> 
  <div class="btn-group p-4 mt-0 w-75 mx-auto">
    <button
    class="text-capitalize"
      v-for="btn in filterButtons"
      :key="btn.category_name"
      :class="filter == btn.category_name ? 'btn  btn-light' : 'btn  btn-dark' "
     @click="filterByCategory(btn.category_name)"
    >{{ btn.category_name }}</button>
  </div>
</template>
<script>
import axios from "axios";
import { backendUrl } from "../../../env";
export default {
  props: {
 
    
  },
  data() {
    return {
      filter: "All",
      filterButtons: [],
      url : backendUrl,
      config : {headers : {token : JSON.parse(localStorage.getItem('userInfo')).token}}
    };
  },
  methods: {
    async filterByCategory(filter){
      this.filter = filter
      this.$emit('CategoryFilter', this.filter)
    }
  },
  
  async mounted() {
    try {
      const { data } = await axios.get(`${this.url}/categories`, {
        headers: {
          token: JSON.parse(localStorage.getItem("userInfo")).token
        }
      });
    await data.data?.unshift({category_name : 'All'})
      this.filterButtons = data.data;
    } catch (error) {
      console.log(error.message);
    }
  }
};
</script>
<style scoped>
.btn-group {
  z-index: 4;
  position: fixed;
  left: 23%;
  top: 6.7%;
}
.btn-group button{
  padding: .5rem;
  border-radius: 14px;
  border: 0.7px solid #fff;
}
</style>