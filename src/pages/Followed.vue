<template>
  <div class="followed">
    <h1 class="text-center me-5">
      <i class="fa-solid fa-user-group" style="color: #8080ff">
        <small style="font-size: 1.4rem"> &nbsp; Followed</small></i
      >
    </h1>
    <p class="fs-4 text-center font-monospace mt-5" v-if="!followedUser.length">You haven't followed yet 🤨</p>
    <ul
      class="list-unstyled user_list d-flex flex-column align-items-center rounded justify-content-around container my-3 p-3 w-75 mx-auto"
    >
      <li
        v-for="user in followedUser"
        @click="viewProfile(user)"
        style="cursor: pointer"
        class="list_item border ms-3 my-2 w-100 d-flex align-items-center justify-content-between p-2 rounded-2"
      >
        <div class="left d-flex align-items-center w-75 py-1">
          <img :src="user.avatar_path" alt="avatar" class="avatar_img" />
          <p class="text-secondary username m-1 ms-4">{{ user.username }}</p>
        </div>
        <div class="right w-25 d-flex">
          <button
            class="btn btn-light mx-auto"
            @click="deleteFromFollowed(user._id)"
          >
            Unfollow
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import { createToaster } from "@meforma/vue-toaster";
import { backendUrl } from "../../env";
const toaster = createToaster();

export default {
  name: "Followed",
  data() {
    return {
      url: backendUrl,
      followedUser: [],
      user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
      config: {
        headers: { token: JSON.parse(localStorage.getItem("userInfo")).token },
      },
    };
  },
  mounted() {
    document.title = "Followed",
     this.getFollowed();
  },
  methods: {
    async getFollowed() {
      try {
        let { data } = await axios.get(
          `${this.url}/followed/${this.user_id}`,
          this.config
        );
        this.followedUser = data.data;
      } catch (error) {
        console.log(error.message);
      }
    },
    async deleteFromFollowed(id) {
      let { data } = await axios.delete(
        `${this.url}/followed/${id}`,
        this.config
      );
      if(!data.success){
       return toaster.error(`Not Unfollowed!`)
      }
      toaster.info(`Unfollowed successfuly ✅`)
      this.getFollowed()
    },
    viewProfile(user){
        let username = user?.username.replace(/ /g, '')
        this.$router.push(`/Profile?username=${username}`)
    }
  },
};
</script>
<style>
.followed {
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
