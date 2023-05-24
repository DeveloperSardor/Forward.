<template>
  <div class="followers">
    <h1 class="text-center me-5">
      <i class="fa-solid fa-user-group" style="color: #8080ff">
        <small style="font-size: 1.4rem"> &nbsp; Followers</small></i
      >
    </h1>
    <p
      class="fs-4 text-center font-monospace mt-5"
      v-if="!followersUser.length"
    >
      {{ idFromQuery ? 'No Followers Yet 😕' : 'You don\'t have followers 🤨' }} 
    </p>
    <ul
      class="list-unstyled user_list d-flex flex-column align-items-center rounded justify-content-around container my-3 p-3 w-75 mx-auto"
    >
      <li
        v-for="user in followersUser"
        @click="viewProfile(user)"
        style="cursor: pointer"
        class="list_item border ms-3 my-2 w-100 d-flex align-items-center justify-content-between p-2 rounded-2"
      >
        <div class="left d-flex align-items-center w-75 py-1">
          <img :src="user.avatar_path" alt="avatar" class="avatar_img" />
          <p class="text-secondary username m-1 ms-4">{{ user.username }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import { backendUrl } from "../../env";
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster();

export default {
  name: "Followers",
  data() {
    return {
      url:backendUrl,
      followersUser: [],
      user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
      idFromQuery  : null, 
      config: {
        headers: { token: JSON.parse(localStorage.getItem("userInfo")).token },
      },
    };
  },
  
  mounted() {
  
    this.idFromQuery = this.$route.query.user_id ? this.$route.query.user_id  : null
    document.title = "Followers"
     this.getFollowers();
  },
  methods: {
    async getFollowers() {
      try {
        let { data } = await axios.get(
          `${this.url}/followers/${this.idFromQuery ? this.idFromQuery : this.user_id}`,
          this.config
        );
        this.followersUser = data.data;
      } catch (error) {
        console.log(error.message);
      }
    },
    viewProfile(user){
        let username = user?.username.replace(/ /g, '')
        this.$router.push(`/Profile?username=${username}`)
    }
  },
};
</script>
<style>
.followers {
  padding: 2.8rem;
  margin-top: 4.5rem;
}

.avatar_img {
  border-radius: 20px;
  width: 40px;
  cursor: pointer;
}
.username {
  cursor: pointer;
}
.username:hover {
  transition: 0.4s ease-in;
  text-decoration: underline;
  color: #fff;
}
.list_item {
  transition: 0.6s ease-in-out;
  border: 0.6px solid blue !important;
}
.list_item:hover {
  background-color: #eceff11c !important;
}
</style>
