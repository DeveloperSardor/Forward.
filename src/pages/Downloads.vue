<template>
  <div class="downloads">
    <form action="" class="w-75 mx-auto p-3" v-if="contentLink" @submit.prevent>
      <input type="text" class="p-1 rounded-2 w-75" :value="contentLink" readonly />
      <div class="handler bg-transparent border-none" v-if="downloadShow">
        <img :src="contentById.content_path" alt="rasm" v-if="contentById.type_content == 'photo'" height="200px"
          class="content" />
        <video :src="contentById.content_path" v-if="contentById.type_content == 'video'" height="200px"
          class="content"></video>
      </div>
      <div class="btns mt-5 d-flex justify-content-between">
        <a href="#" @click.prevent="
          clickedDownload({
            url: contentById.content_path,
            label: contentById.content_path,
          })
          " download><button class="btn btn-success">Download Your Desktop</button></a>
        <button class="btn btn-warning" @click="downloadHandler">
          Download 
        </button>
      </div>
    </form>
    <div class="downloaded_contents mt-5 ">
      <div class="top d-flex container justify-content-between align-items-center w-75">
        <h2 class="text-center fs-3">Downloaded Contents <i class="fas fa-download text-primary"></i></h2>
        <button class="fs-5 text-end float-end btn btn-light text-center font-monospace" @click="clearDownloads"
          v-if="downloadedContents.length"><i class="fa-solid fa-shield-halved" style="color: #ff0000">
          <br /><small style="font-size: 8px">clear &dbkarow; all</small></i
        ></button>
      </div>
      <div class="container mt-3 d-flex flex-wrap justify-content-around align-items-center">
        <div class="spinner-border" role="status" v-if="isLoading">
          <span class="visually-hidden">Loading...</span>
        </div>


        <NotFound v-if="!downloadedContents.length && !contentLink" />


        <Card class="card bg-transparent p-3" v-for="content in downloadedContents">
          <img :src="content.content.content_path" alt="photo" class="content mx-auto"
            v-if="content.content.type_content == 'photo'" @click="watchContent(content.content._id)" />
          <video :src="content.content.content_path" class="content mx-auto ratio ratio-16x9"
            v-if="content.content.type_content == 'video'" @click="watchContent(content.content._id)"></video>
          <video :src="content.content.content_path" class="content mx-auto"
            v-if="content.content.type_content == 'story'" @click="watchContent(content.content._id)"></video>
          <div class="card_body mt-3 d-flex justify-content-around">
            <div class="img_content left">
              <img :src="content.user.avatar_path" alt="avatar" class="avatar_img" @click="viewProfile" />
            </div>
            <div class="center" style="line-height: 1rem">
              <p class="fs-5" style="font-weight: 600">
                {{
                  (content.content.title =
                    content.content.title.length > 12
                      ? content.content.title.slice(0, 12) + "..."
                      : content.content.title)
                }}
              </p>
              <p class="text-secondary username" @click="viewProfile(content.user)">{{ content.user.username }}</p>
              <p class="viewers text-secondary">{{ CountFunc(content.content.viewers?.length) }} viewers</p>
            </div>
            <div class="right dropdown show">
              <i class="fa-solid fa-ellipsis-vertical option" type="button" data-bs-toggle="dropdown"
                aria-expanded="false"></i>
              <ul class="dropdown-menu $zindex-dropdown p-2 px-3 rounded-3 text-light">
                <li class="del_hstr" @click="deleteFromDownloads(content.content._id)">
                  delete from histories &nbsp;
                  <i class="fa-regular fa-trash-can"></i>
                </li>
                <li class="share" @click="ShareContentHandler">
                  share &nbsp; <i class="fa-solid fa-share"></i>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <!-- share start -->

      <div :class="shareBoxDisplay ? 'd-block' : 'd-none'" class="share_content border py-4 p-3 rounded-2 w-75 bg-ligth">
        <div class="top d-flex justify-content-between container">
          <p class="font-monospace">Share</p>
          <span class="close_copy" @click="closeCopy">
            <i class="fa-sharp fa-solid fa-circle-xmark fs-4"></i>
          </span>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-next btn-info ms-3 mb-3" :class="backSocial ? 'd-block' : 'd-none'">
            <i class="fa-sharp fa-solid fa-hand-point-right text-light"></i>
          </button>
          <ul ref="socials" class="socials d-flex list-unstyled align-items-center justify-content-around container">
            <a :href="s.link + copyLink" target="_blank" v-for="s in socials.slice(startNumS, limit)"
              class="text-decoration-none text-light">
              <i :class="s.icon"></i>
              <br />
              <small class="font-monospace">{{ s.name }}</small>
            </a>
          </ul>
          <button class="btn btn-next btn-info ms-3 mb-3" @click="nextSocial">
            <i class="fa-sharp fa-solid fa-hand-point-right text-light"></i>
          </button>
        </div>
        <div class="copy d-flex justify-content-between mt-2">
          <input type="text" class="bg-transparent text-light" style="border: none; width: 70%; padding: 0.2rem"
            :value="copyLink" />
          <button class="btn btn-primary" ref="copy_btn" @click="copyLinkFunc">
            Copy
            <i class="fa-solid fa-copy"></i>
          </button>
        </div>
      </div>
      <!--  share end-->
    </div>
  </div>
</template>



<script >
import axios, { Axios } from "axios";
import { createToaster } from "@meforma/vue-toaster";
import { socials } from "../datas/socials/datas";
import { backendUrl } from "../../env";
import LikedContent from "./LikedContent.vue";
import NotFound from "../components/not-found/NotFound.vue";

const toaster = createToaster();
export default {
  name: "Downloads",
  data() {
    return {
      contentLink: "",
      downloadedContents: [],
      loaderBtn: false,
      isLoading: false,
      url: backendUrl,
      config: {
        headers: {
          token: JSON.parse(localStorage.getItem("userInfo")).token,
        },
      },
      downloadShow: true,
      contentById: {},
      copyLink: `http://localhost:5173/#${this.$route.path}`,
      socials: socials.slice(0, 5),
      backSocial: false,
      startNumS: 0,
      totalPage: 0,
      limit: 3,
      user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
      shareBoxDisplay: false,
    };
  },
  async mounted() {
    document.title = "Downloads";
    this.GetDownloads();
    this.GeyDownloadById()
    this.totalPage = socials.length;
  },
  watch: {
    page() {
      console.log(this.contentLink);
    }
  },
  methods: {
    async GetDownloads() {
      try {
        this.isLoading = true;
        let config = {
          headers: {
            token: JSON.parse(localStorage.getItem("userInfo")).token,
          },
        };
        let { data } = await axios.get(`${this.url}/downloads`, config);
        this.isLoading = false;
        this.downloadedContents = data.data;
      }
      catch (error) {
        console.log(error.message);
        this.isLoading = false;
      }
    },
    async GeyDownloadById() {
      let { id } = this.$route.query;
      this.contentLink = id;
      try {
        let { data } = await axios.get(`${this.url}/contents/${id}`, {
          headers: {
            token: JSON.parse(localStorage.getItem("userInfo")).token,
          },
        });
        this.contentById = data.data;
      }
      catch (error) {
        console.log(error.message);
      }
    },
    async downloadHandler() {
      this.downloadShow = false;
      try {
        let { data } = await axios.put(`${this.url}/contents/download/${this.contentLink}`, {}, this.config);
        this.contentLink = "";

          let x = this.downloadedContents.map(el => {
            let is = el._id == data.data._id
            if (is) {
            return   toaster.error(`This Video Already Downloaded!`)
            } else {
              if (data.success) {
                toaster.success(`${data.message}`, {
                  position: "top-right",
                });
              }
            }
          })
          this.GetDownloads()


       
      }
      catch (error) {
        toaster.error(`${error.message}`, {
          position: "top-right",
        });
      }
    },
    watchContent(id) {
      this.$router.push(`/contents/${id}`);
    },
    async clickedDownload({ url, label }) {
      const response = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/jpg" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = label;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    CountFunc(number) {
      if (number >= 1000000) {
        number = (number / 1000000).toFixed(1) + "m";
      }
      else if (number >= 1000) {
        number = (number / 1000).toFixed(1) + "k";
      }
      return number;
    },
    copyLinkFunc() {
      try {
        navigator.clipboard.writeText(this.copyLink);
        this.$refs.copy_btn.textContent = "Copied!";
        setTimeout(() => {
          this.$refs.copy_btn.innerHTML =
            "Copy <i class=\"fa-solid fa-copy\"></i>";
        }, 1100);
      }
      catch (error) {
        console.log(error.message);
      }
    },
    ShareContentHandler() {
      if (this.shareBoxDisplay) {
        this.shareBoxDisplay = false;
      }
      else {
        this.shareBoxDisplay = true;
      }
    },
    closeCopy() {
      this.shareBoxDisplay = false;
    },
    nextSocial() {
      this.startNumS = this.startNumS + this.limit;
      this.limit = this.limit + this.limit;
      if (this.limit > this.totalPage) {
        this.startNumS = 0;
        this.limit = 3;
      }
      if (this.startNumS > 0) {
        this.backSocial = true;
      }
      else {
        this.backSocial = false;
      }
    },
    async clearDownloads() {
      try {
        let { data } = await axios.delete(`${this.url}/downloads/clear/all`, this.config);
        this.downloadedContents = data.data;
      }
      catch (error) {
        toaster.error(error.message);
        console.log(error.message);
      }
    },
    async deleteFromDownloads(id) {
      try {
        let { data } = await axios.delete(`${this.url}/downloads/${id}`, this.config);
        if (data.success == true) {
          toaster.success(`Deleted!`);
          this.GetDownloads();
        }
        else {
          toaster.error(`Not Deleted, Please try again!`);
        }
      }
      catch (error) {
        toaster.error(error.message);
      }
    },
    viewProfile(user){
      let username = user?.username.replace(/ /g, '');
      this.$router.push(`/Profile?username=${username}`)
    },
  },
  components: { NotFound }
};
</script>


<style scoped>
.downloads {
  transform: translateY(5rem);
  min-height: 120vh;
  word-wrap: break-word;
  word-break: break-all;
}

.share_content {
  z-index: 999;
  width: 50% !important;
  top: 25%;
  left: 30%;
  position: fixed;
  background: #212121 !important;
}


.handler {
  margin-top: 3rem;
  width: 230px !important;
  height: 250px;
}
.avatar_img, .username {
  cursor: pointer;
  transition: .3s ease-in;
}
 .username:hover {
 text-decoration: underline;
 color: antiquewhite !important; 
}

.handler video,
.handler img {
  width: 90% !important;
  height: 95% !important;
}
</style>
