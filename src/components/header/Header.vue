<template>
  <header className="d-flex  text-light" v-if="$route.meta.keepAlive">
    <form className="form-search d-flex  px-5 ms-5  p-2 " @submit="searchHandler" @submit.prevent>
      <div className="search d-flex ">
        <input type="text" className="form-control" placeholder="Search..."
          @input="(e) => (searchValue = e.target.value)" v-model="searchValue" />
        <button className="px-2 search_btn btn-light" @click="searchHandler">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <button className="ms-3 voice_btn rounded-3 px-3 btn-light" type="button" @click="startSpeechRecognition">
        <i class="fa-solid fa-microphone"></i>
      </button>
    </form>

    <div className="d-flex right_content align-items-center list-unstyled  py-2">
      <li class="dropdown user-drop">
        <button className="btn border text-light dropdown-toggle" type="button" data-bs-toggle="dropdown"
          aria-expanded="false">
          <i class="fa-solid fa-video"></i>
        </button>
        <ul class="dropdown-menu $zindex-dropdown">
          <li title="Add Content">
            <router-link to="/upload?type=video" class="dropdown-item">Video 📹</router-link>
          </li>
          <li>
            <router-link to="/upload?type=story" class="dropdown-item">Story 📝</router-link>
          </li>
          <li>
            <router-link to="/upload?type=photo" class="dropdown-item">Photo 📷</router-link>
          </li>
        </ul>
      </li>

      <button className="btn border  text-light">
        <i className="fas fa-bell"></i>
      </button>

      <button className="btn border text-light ">
        <i class="fa-brands fa-facebook-messenger"></i>
      </button>

      <li class="dropdown user-drop">
        <button class="btn border text-light dropdown-toggle" type="button" data-bs-toggle="dropdown"
          aria-expanded="false">
          <img :src="avatar_path" alt="" class="rounded-2 avatar_img" />
        </button>
        <ul class="dropdown-menu $zindex-dropdown">
          <li>
            <router-link to="/profile_settings" class="dropdown-item">My Profile</router-link>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click="handleLogout">Logout &nbsp; <i
                class="fa-solid fa-right-from-bracket"></i></a>
          </li>
          <li>
            <router-link to="/faq" class="dropdown-item">
              FAQ &nbsp;
              <i class="fa-solid fa-question"></i>
            </router-link>
          </li>
        </ul>
      </li>
    </div>
  </header>
</template>
<script>
import { createToaster } from "@meforma/vue-toaster";
import { backendUrl } from "../../../env";
import axios from "axios";
const toaster = createToaster();
export default {
  data() {
    return {
      searchValue: "",
      url: backendUrl,
      transcript: '',
      config: {
        headers: { token: JSON.parse(localStorage.getItem("userInfo"))?.token },
      },
      avatar_path: JSON.parse(localStorage.getItem("userInfo"))
        ? JSON.parse(localStorage.getItem("userInfo")).avatar_path
        : "https://yandex.ru/images/search?text=user+img&img_url=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fsocial-messaging-ui-color-shapes%2F128%2Fuser-male-circle-blue-1024.png&pos=2&rpt=simage&stype=image&lr=10335&parent-reqid=1683734857714385-16131994820728973250-balancer-l7leveler-kubr-yp-sas-137-BAL-4514&source=serp",
      };
  },
  
 
  methods: {
    async searchHandler() {
      if (!this.searchValue) {
        return;
      }
      window.location.reload()
      this.$router.push({
        path: "/results",
        query: { search: this.searchValue.trim() },
      });
    },

    handleLogout() {
      localStorage.removeItem("userInfo");
    },
    startSpeechRecognition() {
      // check the browser support of Web Speech API
      if (!("webkitSpeechRecognition" in window)) {
        toaster.error("Your browser doesn't support Web Speech API");
        return;
      }
      const recognition = new window.webkitSpeechRecognition();
      // set continuous mode to recognize multiple speech
      recognition.continuous = true;
      recognition.interimResults = true;

      // handle recognition events
      recognition.onstart = (event) => {
        console.log("Speech Recognition Starts", event);
      };

      recognition.onresult = (event) => {
        let finalResult = "";
        let interimResult = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalResult += event.results[i][0].transcript;
          } else {
            interimResult += event.results[i][0].transcript;
          }
        }
        this.transcript = finalResult + interimResult;
        if (!this.transcript) {
          return
        }

        this.$router.push({
          path: '/results',
          query: { search: this.transcript }
        })

      };

      recognition.onend = (event) => {
        console.log("Speech Recognition Ends", event);
        recognition.stop();
      };

      // start speech recognition
      recognition.start();
    },
  },

};
</script>
<style>
header {
  background: 81828f;
  z-index: 9999;
  padding: 0.6rem;
  height: 70px;
  position: fixed;
  top: 0;
  width: 100%;
  border-bottom: 0.4px solid #ffffffcc;
}

header .form-search {
  width: 40%;
}

header .right_content {
  width: 35%;
}

header .form-search input {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  width: 400px !important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  column-gap: #333;
}

header .search_btn {
  border-top-right-radius: 9px;
  border-bottom-right-radius: 8px;
}

header .voice_btn {
  transition: all ease;
}

header .voice_btn:hover {
  transform: scale(0.9);
}

header .right_content {
  padding-left: 10rem;
}

header .right_content button {
  margin-left: 1.5rem;
  transition: 0.5s ease all;
}

header .avatar_img {
  width: 25px !important;
}

</style>
