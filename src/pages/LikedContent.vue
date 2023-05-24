<template>
  <div class="likedContents">
    <div
      class="top d-flex justify-content-between align-items-center w-75 mx-auto"
    >
      <h2 class="font-monospace fs-3">
        Liked Contents <i class="fa-solid fa-heart" style="color: #0000ff"></i>
      </h2>
      <button
        class="btn btn-light"
        @click="clearAllLikes"
        v-if="likedContents?.length"
      >
        <!-- Clear Likes -->
        <i class="fa-solid fa-shield-halved" style="color: #ff0000">
          <br /><small style="font-size: 8px">clear &dbkarow; all</small></i
        >
      </button>
    </div>
    <div
      class="container liked_content d-flex justify-content-around align-items-center flex-wrap"
      ref="liked_con"
    >
      <div class="spinner-border" role="status" v-if="isLoading">
        <span class="visually-hidden">Loading...</span>
      </div>

      <NotFound v-if="!likedContents?.length" />

      <!-- card start-->

      <Card v-for="content in likedContents">
        <img
          :src="content.content.content_path"
          alt="photo"
          class="content mx-auto"
          v-if="content.content.type_content == 'photo'"
          @click="watchContent(content.content._id)"
        />
        <video
          :src="content.content.content_path"
          class="content mx-auto ratio ratio-16x9"
          v-if="content.content.type_content == 'video'"
          @click="watchContent(content.content._id)"
        ></video>
        <video
          :src="content.content.content_path"
          class="content mx-auto"
          v-if="content.content.type_content == 'story'"
          @click="watchContent(content.content._id)"
        ></video>
        <div class="card_body mt-3 d-flex justify-content-around">
          <div class="img_content left">
            <img
              :src="content.user.avatar_path"
              alt="avatar"
              class="avatar_img"
              @click="viewProfile(content?.user)"
            />
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
            <p
              class="text-secondary username"
              @click="viewProfile(content?.user)"
            >
              {{ content.user.username }}
            </p>
            <p class="viewers text-secondary">
              {{ CountFunc(content.content.viewers?.length) }} viewers
            </p>
          </div>
          <div class="right dropdown show">
            <i
              class="fa-solid fa-ellipsis-vertical option"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></i>
            <ul
              class="dropdown-menu $zindex-dropdown p-2 px-3 rounded-3 text-light"
            >
              <li
                class="del_hstr"
                @click="deleteFromLiked(content.content._id)"
              >
                delete from likes &nbsp;
                <i class="fa-regular fa-trash-can"></i>
              </li>
              <li class="share" @click="ShareContentHandler">
                share &nbsp; <i class="fa-solid fa-share"></i>
              </li>
            </ul>
          </div>
        </div>
      </Card>
      <!-- card end -->
    </div>

    <!-- share start -->
    <div
      :class="shareBoxDisplay ? 'd-block' : 'd-none'"
      class="share_content border py-4 p-3 rounded-2 w-75 bg-ligth"
    >
      <div class="top d-flex justify-content-between container">
        <p class="font-monospace">Share</p>
        <span class="close_copy" @click="closeCopy">
          <i class="fa-sharp fa-solid fa-circle-xmark fs-4"></i>
        </span>
      </div>
      <div class="d-flex align-items-center">
        <button
          class="btn btn-next btn-info ms-3 mb-3"
          :class="backSocial ? 'd-block' : 'd-none'"
        >
          <i class="fa-sharp fa-solid fa-hand-point-right text-light"></i>
        </button>
        <ul
          ref="socials"
          class="socials d-flex list-unstyled align-items-center justify-content-around container"
        >
          <a
            :href="s.link + copyLink"
            target="_blank"
            v-for="s in socials.slice(startNumS, limit)"
            class="text-decoration-none text-light"
          >
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
        <input
          type="text"
          class="bg-transparent text-light"
          style="border: none; width: 70%; padding: 0.2rem"
          :value="copyLink"
        />
        <button class="btn btn-primary" ref="copy_btn" @click="copyLinkFunc">
          Copy
          <i class="fa-solid fa-copy"></i>
        </button>
      </div>
    </div>
    <!-- share end -->
  </div>
</template>
<script>
import axios from "axios";
import { backendUrl } from "../../env";
import { socials } from "../datas/socials/datas";
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster();
import NotFound from "../components/not-found/NotFound.vue";
export default {
  name: "Liked Content",
  components: {
    NotFound,
  },
  data() {
    return {
      likedContents: [],
      isLoading: false,
      url: backendUrl,
      user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
      config: {
        headers: { token: JSON.parse(localStorage.getItem("userInfo")).token },
      },
      copyLink: `http://localhost:5173/#${this.$route.path}`,
      socials: socials.slice(0, 5),
      backSocial: false,
      startNumS: 0,
      totalPage: 0,
      limit: 3,
      shareBoxDisplay: false,
    };
  },
  async mounted() {
    document.title = "Liked Contents";
    this.totalPage = socials.length;
    this.getLikedContents();
  },
  methods: {
    async getLikedContents() {
      this.isLoading = true;
      try {
        let { data } = await axios.get(`${this.url}/liked`, this.config);
        if (!data.success) {
          toaster.error(`Error occured`);
        }
        this.likedContents = data.data;
        this.isLoading = false;
      } catch (error) {
        toaster.error(error.message);
        this.isLoading = false;
      }
    },
    async clearAllLikes() {
      try {
        let { data } = await axios.delete(
          `${this.url}/liked/clear/all`,
          this.config
        );
        this.likedContents = data.data;
      } catch (error) {
        toaster.error(error.message);
        console.log(error.message);
      }
    },
    async deleteFromLiked(id) {
      try {
        let { data } = await axios.delete(
          `${this.url}/liked/${id}`,
          this.config
        );
        console.log(data);
        if (data.success == true) {
          toaster.success(`Deleted!`);
          this.getLikedContents();
        } else {
          toaster.error(`Not Deleted, Please try again!`);
        }
      } catch (error) {
        toaster.error(error.message);
      }
    },
    ShareContentHandler() {},
    watchContent(id) {
      this.$router.push(`/contents/${id}`);
    },
    closeCopy() {
      this.shareBoxDisplay = false;
    },
    copyLinkFunc() {
      try {
        navigator.clipboard.writeText(this.copyLink);
        this.$refs.copy_btn.textContent = "Copied!";
        setTimeout(() => {
          this.$refs.copy_btn.innerHTML =
            'Copy <i class="fa-solid fa-copy"></i>';
        }, 1100);
      } catch (error) {
        console.log(error.message);
      }
    },
    CountFunc(number) {
      if (number >= 1000000) {
        number = (number / 1000000).toFixed(1) + "m";
      } else if (number >= 1000) {
        number = (number / 1000).toFixed(1) + "k";
      }
      return number;
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
      } else {
        this.backSocial = false;
      }
    },
    ShareContentHandler() {
      if (this.shareBoxDisplay) {
        this.shareBoxDisplay = false;
      } else {
        this.shareBoxDisplay = true;
      }
    },
    viewProfile(user) {
      let username = user?.username.replace(/ /g, "");
      this.$router.push(`/Profile?username=${username}`);
    },
  },
};
</script>
<style scoped>
.share_content {
  z-index: 999;
  width: 50% !important;
  top: 25%;
  left: 30%;
  position: fixed;
  background: #212121 !important;
}

.page_title {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.likedContents {
  transform: translate(0rem, 6.5rem) !important;
}

.avatar_img,
.username {
  cursor: pointer;
  transition: 0.3s ease-in;
}

.username:hover {
  text-decoration: underline;
  color: antiquewhite !important;
}
</style>
