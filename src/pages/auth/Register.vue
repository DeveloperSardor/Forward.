<template>
  <div class="register">




    
    <div class="container-fluid h-custom">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-md-9 col-lg-6 col-xl-5">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid"
            alt="Sample image" />
        </div>
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <form class="mt-3 form_signup" @submit.prevent @submit="submitHandler">
            <h2 class="font-monospace">Sign up</h2>

            <!-- First name input -->
            <div class="form-outline mb-3 mt-3">
              <input type="text" id="firstname" class="form-control form-control-lg" placeholder="Enter First name"
                @input="(e) => (firstname = e.target.value)" :value="firstname" required />
              <label class="form-label" for="">First name</label>
            </div>

            <!-- Last name input -->
            <div class="form-outline mb-3">
              <input type="text" id="" class="form-control form-control-lg" placeholder="Enter Last name"
                @input="(e) => (lastname = e.target.value)" :value="lastname" required />
              <label class="form-label" for="">Last name</label>
            </div>
            <!-- Channel name input -->
            <div class="form-outline mb-3">
              <input type="text" id="" class="form-control form-control-lg" placeholder="Enter channel"
                @input="(e) => (channel = e.target.value)" :value="channel" required />
              <label class="form-label" for="">Channel name</label>
            </div>
            <!-- Email input -->
            <div class="form-outline mb-4">
              <input type="email" id="form3Example3" class="form-control form-control-lg"
                placeholder="Enter email address" @input="(e) => (email = e.target.value)" :value="email" required />
              <label class="form-label" for="form3Example3">Email address</label>
            </div>
            <!-- Password input -->
            <div class="form-outline mb-4">
              <div class="d-flex">
                <input :type="showPass ? 'text' : 'password'" id="form3Example3" class="form-control form-control-lg"
                  placeholder="Enter password" @input="(e) => (password = e.target.value)" :value="password" required />
                <button type="button" class="btn btn-light" @click="changePassHandler">
                  <i class="fa-solid fa-lock" v-if="showPass == false"></i>
                  <i class="fa-solid fa-lock-open" v-if="showPass"></i>
                </button>
              </div>
              <label class="form-label" for="form3Example3">Password</label>
            </div>
            <div class="d-flex align-items-center">
              <!-- Gender input -->
              <div class="form-outline mb-4 d-flex align-items-center">
                <select required name="gender" id="gender_select" class="p-2 m-2 rounded-3"
                  :on-select="(e) => (gender = e.target.value)" @change="(e) => (gender = e.target.value)"
                  :value="gender">
                  <option value="male" selected>Male</option>
                  <option value="female">Female</option>
                </select>
                <label class="form-label" for="form3Example3">Gender</label>
              </div>
              <div class="form-outline mb-4">
                <label class="custom-upload">
                  <span class="file-name rounded-3 p-3 px-4 border text-center">
                    <i class="fa-solid fa-paperclip"></i>
                  </span>
                  <input type="file" id="avatarInput" accept="image/*" @change="(e) => uploadAva(e.target.files[0])" />
                  <b class="ms-2">Upload your photo</b>
                </label>
              </div>
            </div>

            <div class="text-center text-lg-start pt-2">
              <button type="submit" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem">
                <strong v-if="!loading"> Register</strong>
                <div class="spinner-border" role="status" v-else>
                  <span class="sr-only">Loading...</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createToaster } from "@meforma/vue-toaster";
import axios from "axios";
const toaster = createToaster();
export default {
  data() {
    return {
      loading: false,
      showPass: false,
      firstname: "",
      lastname: "",
      channel: "",
      email: "",
      password: "",
      gender: "",
      avatar_path: "",
    };
  },
  mounted(){
    document.title = 'Forward | Register'
  },
  methods: {
    async submitHandler() {
      this.loading = true;
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const { data } = await axios.post(
          "http://localhost:5000/signup",
          {
            firstname: this.firstname,
            lastname: this.lastname,
            username: this.channel,
            email: this.email,
            password: this.password,
            gender: this.gender,
            avatar_path: this.avatar_path,
          },
          config
        );
        console.log(data);
        if (data.status != 401) {
          toaster.success(`Registration Successful`,
            {
              duration: 3000,
              isClosable: true,
              position: 'top-right'
            })

            data.added_user.token = data.token
            localStorage.setItem('userInfo', JSON.stringify(data.added_user))
            this.loading = false
              this.$router.push('/')
        }else{
          throw new Error(data.message)
        }
      } catch (error) {
        this.loading = false
        toaster.error(`${error.message}`, {
          isClosable: true,
          duration: 3000,
          position: "top-right",
        });
      }
    },
    uploadAva(pics) {
      console.log(pics);
      this.loading = true;
      let avatarInput = document.querySelector("#avatarInput");

       let type = pics.type.substring(pics.type.length - 3);

      if (pics && type == "mp4") {
        return toaster.error("you can not upload mp4 file!", {
          position: "top-right",
        });
      }
      if (pics && (type == 'png' || 'jpg' || 'svg')) {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chat-app");
        fetch("https://api.cloudinary.com/v1_1/roadsidecoder/image/upload", {
          method: "POST",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            this.avatar_path = data.url;
            this.loading = false;
          })
          .catch((err) => {
            toaster.error(`${err.message}`, {
              position: "top-right",
            });
            this.loading = false;
          });
      }
      if (pics && pics.type.split("/")[0] != "image") {
        return toaster.error("you can upload only image file!", {
          position: "top-right",
        });
      }
    },
    changePassHandler() {
      if (this.showPass == true) {
        this.showPass = false;
      } else {
        this.showPass = true;
      }
    },
  },
};
</script>
<style scoped>
div.register {
  padding-bottom: 4rem;
  width: 100%;
  position: fixed !important;
  left: 0% !important;
  top: 0% !important;
}

.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}

.h-custom {
  height: calc(100% - 73px);
}

input[type="file"] {
  display: none;
}

.custom-upload {
  width: 300px;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 2px;
}

@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}
</style>
