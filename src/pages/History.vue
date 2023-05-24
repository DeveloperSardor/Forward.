<template>
  <section class="history">
    <div class="top d-flex justify-content-between align-items-center w-75 mx-auto">
      <h2 class="font-monospace fs-3">Histories <i class="fa-sharp fa-solid fa-clock-rotate-left" style="color: #0000ff;"></i></h2>
      <button class="btn btn-light" @click="clearAllHistories" v-if="historyContents?.length">
        <i class="fa-solid fa-shield-halved" style="color: #ff0000">
          <br /><small style="font-size: 8px">clear &dbkarow; all</small></i
        >
      </button>
    </div>


    <div class="container mt-3 history_content d-flex justify-content-around align-items-center flex-wrap"
      ref="history_con">
      <div class="spinner-border" role="status" v-if="isLoading">
        <span class="visually-hidden">Loading...</span>
      </div>
      <NotFound v-if="!historyContents?.length"/>
      <Card class="card bg-transparent p-3" v-for="content in historyContents">
        <img :src="content.content.content_path" alt="photo" class="content mx-auto"
          v-if="content.content.type_content == 'photo'" @click="watchContent(content.content._id)" />
        <video :src="content.content.content_path" class="content mx-auto ratio ratio-16x9"
          v-if="content.content.type_content == 'video'" @click="watchContent(content.content._id)"></video>
        <video :src="content.content.content_path" class="content mx-auto" v-if="content.content.type_content == 'story'"
          @click="watchContent(content.content._id)"></video>
        <div class="card_body mt-3 d-flex justify-content-around">
          <div class="img_content left">
            <img :src="content.user.avatar_path" @click="viewProfile(content?.user)" alt="avatar" class="avatar_img" />
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
            <p class="text-secondary username" @click="viewProfile(content?.user)">{{ content.user.username }}</p>
            <p class="viewers text-secondary">{{ CountFunc(content.content.viewers?.length) }} viewers</p>
          </div>
          <div class="right dropdown show">
            <i class="fa-solid fa-ellipsis-vertical option" type="button" data-bs-toggle="dropdown"
              aria-expanded="false"></i>
            <ul class="dropdown-menu $zindex-dropdown p-2 px-3 rounded-3 text-light">
              <li class="del_hstr" @click="deleteFromHistory(content.content._id)">
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
  </section>
</template>
<script>
import axios from "axios";
import { backendUrl } from "../../env";
import { createToaster } from "@meforma/vue-toaster";
import { socials } from "../datas/socials/datas";
import NotFound from "../components/not-found/NotFound.vue";
const toaster = createToaster();
export default {
  name: "History",
  data() {
    return {
      url: backendUrl,
      historyContents: [],
      isLoading: false,
      copyLink: `http://localhost:5173/#${this.$route.path}`,
      socials: socials.slice(0, 5),
      backSocial: false,
      startNumS: 0,
      totalPage: 0,
      limit: 3,
      user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
      shareBoxDisplay: false,
      config: {
        headers: {
          token: JSON.parse(localStorage.getItem("userInfo")).token,
        },
      },
    };
  },
  async mounted() {
    document.title = "Histories";
        this.totalPage = socials.length;
        this.getData();
    },
    watch: {
        page() {
            this.getData();
        },
    },
    methods: {
        async getData() {
            try {
                this.isLoading = true;
                let { data } = await axios.get(`${this.url}/histories`, this.config);
                this.historyContents = data.data;
                this.isLoading = false;
            }
            catch (error) {
                this.isLoading = false;
            }
        },
        watchContent(id) {
            this.$router.push(`/contents/${id}`);
        },
        async clearAllHistories() {
            try {
                let { data } = await axios.delete(`${this.url}/histories/clear/all`, this.config);
                this.historyContents = data.data;
            }
            catch (error) {
                toaster.error(error.message);
                console.log(error.message);
            }
        },
        async deleteFromHistory(id) {
            try {
                let { data } = await axios.delete(`${this.url}/histories/${id}`, this.config);
                if (data.success == true) {
                    toaster.success(`Deleted!`);
                    this.getData();
                }
                else {
                    toaster.error(`Not Deleted, Please try again!`);
                }
            }
            catch (error) {
                toaster.error(error.message);
            }
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
        viewProfile(user){
      let username =user?.username.replace(/ /g, '');
      this.$router.push(`/Profile?username=${username}`)
    },
    },
    components: { NotFound }
};
</script>
<style scoped>
.yet {
  transform: translateY(4rem);
}

.socials {
  transform: translateX(0.4rem) !important;
  max-width: 75% !important;
  overflow: hidden;
}

.socials a {
  transform: translateX(1.5rem);
  min-width: 30% !important;
}

.share_content {
  z-index: 999;
  width: 50% !important;
  top: 25%;
  left: 30%;
  position: fixed;
  background: #212121 !important;
}

.filter_bg {
  filter: blur(10px);
}

.close_copy {
  cursor: pointer;
}
.avatar_img, .username {
  cursor: pointer;
  transition: .3s ease-in;
}
 .username:hover {
 text-decoration: underline;
 color: antiquewhite !important; 
}
</style>
