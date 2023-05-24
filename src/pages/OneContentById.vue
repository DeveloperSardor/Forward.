<template>
  <section>
    <div class="spinner-border" role="status" v-if="contentLoader">
      <span class="visually-hidden">Loading...</span>
    </div>
    <NotFound v-if="content == undefined" />
    <div class="content_card text-start p-3" v-else>
      <div class="container">
        <img :src="content.content_path" :alt="content.title" v-if="content.type_content == 'photo'"
          class="content mx-auto">
        <video :src="content.content_path" v-else-if="content.type_content == 'video'"
          class="content content mx-auto ratio ratio-16x9" ref="video" controls autoplay></video>
        <video :src="content.content_path" controls autoplay
          v-if="content.type_content == 'story' && content.content_path.slice(content.content_path.length - 3) == 'mp4'"></video>
        <img :src="content.content_path"
          v-if="content.type_content == 'story' && content.content_path.slice(content.content_path.length - 3) != 'mp4'"
          alt="story">

        <h5 class="content_title mt-4">{{ content?.title }}</h5>
        <div class="card_body mt-3 d-flex align-items-center justify-content-between">
          <ul class="left list-unstyled w-50 d-flex align-items-cemter justify-content-around py-2">
            <li class="d-flex align-items-center px-2">
              <img :src="content?.user?.avatar_path" alt="" class="profile_img" @click="viewProfile(content?.user)" />
              <i v-if="content?.user?.checkMark" class="fa-solid fa-square-check fs-3 ms-3" style="color: #0000ff"></i>
            </li>
            <li style="line-height: 10px; transform: translateY(0.4em)">
              <p @click="viewProfile(content?.user)" class="channel_name">{{ content?.user?.username }}</p>
              <p class="text-secondary followers_txt" @click="viewFollowers(content?.user?._id)">
                {{ userFollowers?.length }} followers
              </p>
            </li>
            <li>
              <button class="btn  py-2 px-4 fw-bold" id="follow_btn" ref="following_btn" :class="ButtonClass"
                @click="following()">
                {{ followTxt }}
              </button>
            </li>
          </ul>
          <ul class="d-flex list-unstyled align-items-center px-2">
            <li class="d-flex p-2 rounded-3 justify-content-around">
              <button class="btn like_btn" ref="like_btn" :class="likeButtonClass" @click="likeHandler">
                <i class="fa-solid fa-thumbs-up"></i>
                {{ CountFunc(like?.length) }}
              </button>
              <button class="btn dislike_btn ms-2" ref="dislike_btn" :class="DislikeButtonClass" @click="DislikeHandler">
                <i class="fa-solid fa-thumbs-down"></i>
                {{ CountFunc(dislike.length) }}
              </button>
            </li>
            <li>
              <button class="btn btn-light donwload_btn" @click="downloadContent">
                <i class="fa-solid fa-download"></i>
              </button>
            </li>
            <li class="ms-2">
              <button class="btn btn-light donwload_btn" @click="ShareContentHandler">
                <i class="fa-solid fa-share"></i>
                share
              </button>
            </li>
          </ul>
        </div>
        <div class="share_content border py-4 p-3 d-none rounded-2 bg-ligth" ref="share_content">
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
            <button class="btn btn-primary" ref="copyBtn" @click="copyLinkFunc">
              Copy
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="info_box rounded-2 py-2">
      <p class="">
        {{ !content.viewers?.length ? 0 : CountFunc(content.viewers?.length) }}
        viewers
      </p>
      <p v-if="content.description">{{ content.description }}</p>
    </div>
    <div class="comments mt-2 rounded-2 py-2">
      <div class="top">
        <p>
          {{ !comments?.length ? 0 : CountFunc(comments?.length) }} comments
        </p>
        <form action="">
          <div class="write d-flex align-items-center w-75 mx-auto">
            <img :src="userAva" alt="avatar" class="profile_img" />
            <input type="text" class="form-control w-50 mx-auto bg-transparent" placeholder="write your comment"
              :value="commentTxt" @focus="focusWriteComment" @input="inputWriteComment" ref="commentInp" />
          </div>
          <div class="btns d-flex w-75 mx-auto mt-3 justify-content-between py-5 px-2 align-items-center d-none"
            ref="sendCommHandler">
            <button class="btn btn-secondary" @click="toggleEmoji" style="height: 55px">
              😀
            </button>

            <ul v-if="emojiesDisplay" class="emojies border d-flex list-unstyled rounded-2 flex-wrap" ref="emojies">
              <li v-for="emoji in Emojies" class="px-2 py-1 rounded-3"
                @click="(e) => (commentTxt += e.target.textContent)">
                <p>{{ emoji }}</p>
              </li>
            </ul>

            <div class="send_or_back p-2 d-flex justify-content-around" style="width: 35%">
              <button class="border-none btn btn-outline-secondary" style="border: none" @click="backFromComm">
                back
              </button>
              <button style="background: #7e848d3e" class="btn btn-secondary" ref="sendCommentBtn" type="button"
                @click="addComment">
                <b v-if="!addCommentLoading"> send</b>
                <div class="spinner-border" role="status" v-if="addCommentLoading">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="comment_content mt-4">
        <ul class="list-unstyled">
          <div class="spinner-border" role="status" v-if="commentLoading">
            <span class="visually-hidden">Loading...</span>
          </div>
          <Comment v-for="c in comments" :comment="c" @NewComment="callbackNewC" :CountFunc="CountFunc"
            @UpdatedData="updatedNewComment" />
          <h3 v-if="!comments.length">No Comment Yet</h3>
        </ul>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import { backendUrl } from "../../env";
import { emojies } from "../datas/emoji/emojis";
import Comment from "../components/comment/Comment.vue";
import { createToaster } from "@meforma/vue-toaster";
import { socials } from "../datas/socials/datas";
import NotFound from "../components/not-found/NotFound.vue";
const toaster = createToaster();
export default {
  name: "ContentById",
  components: {
    Comment,
    NotFound,
  },
  data() {
    return {
      url: backendUrl,
      contentId: this.$route.params.id,
      content: {},
      comments: [],
      followTxt: "Follow",
      userFollowers: [],
      like: [],
      dislike: [],
      likeButtonClass: "btn-light",
      ButtonClass: "btn-light",
      DislikeButtonClass: "btn-light",
      Emojies: emojies,
      commentTxt: "",
      commentLoading: false,
      contentLoader: false,
      addCommentLoading: false,
      userAva: JSON.parse(localStorage.getItem("userInfo")).avatar_path,
      copyLink: `http://localhost:5173/#${this.$route.path}`,
      socials: socials.slice(0, 5),
      backSocial: false,
      startNumS: 0,
      totalPage: 0,
      limit: 3,
      config: {
        headers: { token: JSON.parse(localStorage.getItem("userInfo")).token },
      },
      user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
      emojiesDisplay: false,
    };
  },
  
  async mounted() {
    document.title = this.content.title ? this.content.title : "Forward";
    this.getContentData();

    this.getCommentsData();

    try {
      let { data } = await axios.put(
        `${this.url}/contents/history/${this.contentId}`,
        {},
        this.config
      );
    } catch (error) {
      console.log(error.message);
    }

    try {
      let { data } = await axios.put(
        `${this.url}/contents/viewers/${this.contentId}`,
        {},
        this.config
      );
    } catch (error) {
      console.log(error.message);
    }


    this.totalPage = socials.length;
  },
  methods: {
    viewProfile(user) {
      let username = user?.username.replace(/ /g, '')
      this.$router.push(`/Profile?username=${username}`)
    },
    async getContentData() {
      try {
        this.contentLoader = true;
        const { data } = await axios.get(
          `${this.url}/contents/${this.contentId}`,
          {
            headers: {
              token: JSON.parse(localStorage.getItem("userInfo")).token,
            },
          }
        );

        this.content = data.data;
        this.userFollowers =
          this.content.user.followers != undefined
            ? this.content.user.followers
            : [];

        this.like = this.content.like != undefined ? this.content.like : [];
        this.dislike =
          this.content.dislike != undefined ? this.content.dislike : [];
        this.contentLoader = false;
        if (this.userFollowers.includes(this.user_id)) {
          this.ButtonClass = "btn-light";
          this.followTxt = "Unfollow";
        } else {
          this.ButtonClass = "btn-info";
          this.followTxt = "Follow";
        }

        // 1

        if (this.dislike.includes(this.user_id)) {
          this.DislikeButtonClass = "bg-info";
        } else {
          this.DislikeButtonClass = "btn-light";
        }

        // 2

        if (this.like.includes(this.user_id)) {
          this.likeButtonClass = "btn-info";
        } else {
          this.likeButtonClass = "btn-light";
        }

        if (this.userFollowers.includes(this.user_id)) {
          this.ButtonClass = "btn-light";
        } else {
          this.ButtonClass = "bg-info";
        }
      } catch (error) {
        console.log(error.message);
        this.contentLoader = false;
      }
    },
    async viewFollowers(user_id) {
      this.$router.push(`/Followers?user_id=${user_id}`)
    },
    async getCommentsData() {
      try {
        this.commentLoading = true;
        let { data } = await axios.get(
          `${this.url}/comments?content_id=${this.contentId}`,
          this.config
        );

        this.comments = data.data;
        this.commentLoading = false;
      } catch (error) {
        console.log(error.message);
        this.commentLoading = false;
      }
    },

    callbackNewC() {
      this.getCommentsData();
    },
    async downloadContent() {
      this.$router.push({ path: "/downloads", query: { id: this.contentId } });
    },
    async likeHandler() {
      if (
        this.dislike.includes(JSON.parse(localStorage.getItem("userInfo"))._id)
      ) {
        try {
          let { data } = await axios.delete(
            `${this.url}/contents/dislike/${this.content._id}`,
            this.config
          );
          this.dislike = await data.data;
          this.DislikeButtonClass = "btn-light";
        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      }

      try {
        let { data } = await axios.put(
          `${this.url}/contents/like/${this.content._id}`,
          {},
          this.config
        );
        this.like = data.data ? data.data : [];
        if (this.like.includes(this.user_id)) {
          this.likeButtonClass = "btn-info";
        } else {
          this.likeButtonClass = "btn-light";
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    async DislikeHandler() {
      if (this.like.includes(this.user_id)) {
        try {
          let { data } = await axios.delete(
            `${this.url}/contents/like/${this.content._id}`,
            this.config
          );
          this.like = data.data;
          this.likeButtonClass = "btn-light";
        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      }

      try {
        let { data } = await axios.put(
          `${this.url}/contents/dislike/${this.content._id}`,
          {},
          this.config
        );
        this.dislike = data.data ? data.data : [];

        if (
          this.dislike.includes(
            JSON.parse(localStorage.getItem("userInfo"))._id
          )
        ) {
          this.DislikeButtonClass = "btn-info";
        } else {
          this.DislikeButtonClass = "btn-light";
        }
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
    async following() {
      let { data } = await axios.put(
        `${this.url}/subscribe/channel/${this.content?.user._id}`,
        {},
        this.config
      );
      this.userFollowers = data.data;
      if (this.content.user._id == this.user_id) {
        return toaster.error(`You cannot subscribe to yourself!`);
      }
      if (this.userFollowers?.includes(this.user_id)) {
        this.followTxt = "Unfollow";
        this.ButtonClass = "btn-light";
        toaster.info(`You are successfuly Followed!`);
      } else {
        this.followTxt = "Follow";
        this.ButtonClass = "btn-info";
        toaster.info(`You are successfuly Unfollowed!`);
      }
    },
    focusWriteComment(e) {
      e.target.classList.add("border-light");
      this.$refs.sendCommHandler.classList.remove("d-none");
    },
    inputWriteComment(e) {
      this.commentTxt = e.target.value;
    },
    backFromComm() {
      this.$refs.sendCommHandler.classList.add("d-none");
      this.commentTxt = "";
    },
    toggleEmoji() {
      if (this.emojiesDisplay) {
        this.emojiesDisplay = false;
      } else {
        this.emojiesDisplay = true;
      }
    },

    async addComment() {
      this.emojiesDisplay = false;
      let config = {
        headers: { token: JSON.parse(localStorage.getItem("userInfo")).token },
      };
      this.addCommentLoading = true;

      try {
        let { data } = await axios.post(
          `${this.url}/comment/add`,
          {
            body: this.commentTxt,
            content: this.contentId,
          },
          config
        );

        this.getCommentsData();
        this.addCommentLoading = false;
        this.commentTxt = "";
      } catch (error) {
        toaster.error(`${error.message}`);
        this.addCommentLoading = false;
        this.commentTxt = "";
      }
    },
    updatedNewComment() {
      this.getCommentsData();
    },
    copyLinkFunc() {
      try {
        navigator.clipboard.writeText(this.copyLink);
        this.$refs.copyBtn.textContent = "Copied!";
        setTimeout(() => {
          this.$refs.copyBtn.innerHTML =
            'Copy <i class="fa-solid fa-copy"></i>';
        }, 1100);
      } catch (error) {
        console.log(error.message);
      }
    },
    ShareContentHandler() {
      if (this.$refs.share_content.classList.contains("d-none")) {
        this.$refs.share_content.classList.add("d-block");
        this.$refs.share_content.classList.remove("d-none");
      } else {
        this.$refs.share_content.classList.add("d-none");
        this.$refs.share_content.classList.remove("d-block");
      }
    },
    closeCopy() {
      this.$refs.share_content.classList.add("d-none");
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
  },
};
</script>
<style scoped>
.content_card {
  width: 60%;
}

.channel_name,
.profile_img {
  cursor: pointer;
}

.channel_name:hover {
  text-decoration: underline;
}

.content_card .container img,
.content_card .container video {
  width: 95%;
  height: 320px;
  object-fit: contain;
  border-radius: 9px;
}

.profile_img {
  width: 40px !important;
  height: 40px !important;
  border-radius: 20px !important;
}

.content_title {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
}

.info_box,
.comments {
  width: 60%;
}

.followers_txt {
  cursor: pointer;
}

.followers_txt:hover {
  text-decoration: underline;
}

.comments .write .form-control {
  border: none;
  border-bottom: 1px solid #ffffff79;
  border-radius: 1px;
  color: #fff;
}

.comments .write .form-control:focus {
  outline: none;
  box-shadow: none;
}

.channel_from_comm:hover {
  text-decoration: underline !important;
}

.comment_text {
  font-size: 15px;
  font-weight: 400 !important;
}

.emojies {
  background: #333;
  transform: translateY(-19rem);
  width: 330px;
}

.emojies li {
  cursor: pointer;
}

.emojies li:hover {
  background: #000;
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

.write .btn,
.btns button {
  height: 45px;
}

.btns {
  height: 50px;
}

.like_dislike button {
  height: 35px !important;
}

.comment {
  line-height: 1.4rem;
}

.info_box {
  background: #3f3f3f56;
}

.info_box:hover {
  background: #3f3f3f;
}

.share_content {
  transform: translate(5.5rem, -5rem);
  width: 50% !important;
  background: #212121 !important;
}

.close_copy {
  cursor: pointer;
}

.text-success {
  color: #25d366 !important;
}

/* #0DCAF0 */
</style>
