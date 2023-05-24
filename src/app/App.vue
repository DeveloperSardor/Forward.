<template>
  <div class="app">
    <Aside />
    <main>
      <Header />
      <div class="modal_birth mx-auto rounded-2" v-if="isOpenBirthModal">
        <div class="modal_header d-flex align-items-center justify-content-between">
          <p class="fs-4 font-monospace">Select Your Birthdate</p>
          <i class="fa-solid fa-circle-xmark " style="color: #00ffff;"></i>
        </div>
        <form class="modal_body" @submit="sendBirthdate" @submit.prevent>
          <input type="date" required class="rounded" :value="birthdayUser" @input="e => birthdayUser = e.target.value">
        </form>
        <div class="modal_bottom d-flex align-items-center justify-content-between mt-3">
          <button class="btn btn-secondary" type="button">Cancel</button>
          <button class="btn btn-success" type="submit" @click="sendBirthdate">Send</button>
        </div>
      </div>
      <RouterView @sendFile="sendFileHandler" @contentById="contentById" />
    </main>
  </div>
</template>
<script>
import { createToaster } from "@meforma/vue-toaster";
import axios from "axios";
import {backendUrl} from '../../env'
import { RouterView } from "vue-router";
import Aside from "../components/aside/Aside.vue";
import Header from "../components/header/Header.vue";
const toaster = createToaster()
export default {
  data() {
    return {
      fileDatas: {},
      searchContent: "",
      birthdayUser: '',
      isOpenBirthModal: false,
      url: backendUrl,
      user: {},
      user_id: JSON.parse(localStorage.getItem('userInfo'))?._id,
      config: { headers: { token: JSON.parse(localStorage.getItem('userInfo'))?.token } }
    };
  },
  mounted() {
    let userdata = localStorage.getItem("userInfo");
    if (!userdata) {
      this.$router.push("/login");
    }



    // this.getUserData()

  },


 
  components: {
    Aside,
    Header,
  },
  methods: {

    async getUserData() {
      try {
        let { data } = await axios.get(`${this.url}/users/${this.user_id}`, this.config);
        if (data.success) {
          this.user = data.data
          if (!this.user.birth_date) {
            setTimeout(() => {
              console.log(this.isOpenBirthModal);
              this.isOpenBirthModal = true
            }, 4000)
          } else {
            let userMonth = Date(this.user.birth_date).split(' ')[1]
            let userDay = Date(this.user.birth_date).split(' ')[2]
            let nowMonth = Date(new Date()).split(' ')[1]
            let nowDay = Date(new Date()).split(' ')[2]


            if ((userMonth == nowMonth) && (userDay == nowDay)) {
               this.$router.push('/contents/646b3daa6c218fe3f78b25bf')
              
              toaster.success(`Hapy Birthday  ${this.user.firstname} ${this.user.lastname}  `)
            } else {
              return console.log(12);
            }

          }

        } else {
          console.log('error occured');
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    sendFileHandler(obj) {
      this.fileDatas = obj;
    },
    async Congirulation() {
    },
    async sendBirthdate() {
      try {
        let { data } = await axios.post(`${this.url}/add/birthdate`, {
          birth_date: Date(this.birthdayUser)
        }, this.config)
        if (data.success) {
          toaster.success(`Ok`)
          this.isOpenBirthModal = false
        } else {
          toaster.error(`Error Occured!`)
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  },
};
</script>
<style>
body {
  background: #81828f;
  color: #fff;
}

.app {
  display: flex;
  position: relative;
  width: 100%;
}

main {
  color: #fff;
  width: 80%;
  position: absolute;
  right: 0;
}

section {
  min-height: 100vh;
  margin-top: 9rem;
  text-align: center;
}

.modal_birth {
  width: 75%;
  border: 1px solid;
  margin-top: 10rem;
  padding: 2.5rem;
}
</style>
