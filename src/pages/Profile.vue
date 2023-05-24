<template>
  <div class="profileUser">
    <NotFound v-if="user == undefined" />
    <div class="container" v-if="user != undefined">
      <div class="header px-5">
        <div class="container">
          <div class="top d-flex justify-content-betwen align-items-center row">
            <div class="col-8 d-flex align-items-center">
              <img
                :src="user.avatar_path"
                alt="channel_image"
                class="rounded-5 channel_img"
              />
              <div class="channel_txt ms-4">
                <p class="fs-3 username">
                  {{ ` ${user.firstname} ${user.lastname} ` }}
                </p>
                <div class="info_txt d-flex align-items-center text-secondary">
                  <p>@{{ user.username }}</p>
                  &nbsp; &nbsp;
                  <p  class="followers_count" @click="viewFollowers">{{ CountFunc(userFollowers.length) }} followers</p>
                  &nbsp; &nbsp;
                  <p>{{ CountFunc(contentsUser?.length) }} contents</p>
                </div>
              </div>
            </div>
            <div class="col-4 d-flex align-items-center">
              <button   v-if="user._id != user_id" class="btn btn-light px-3 pb-1"><i class="fa-sharp fa-regular fa-compass fs-5"></i></button>
              <button class="btn ms-5" :class="followBtnClass" @click="following">
                {{ followTxt }}
              </button>
            </div>
          </div>
          <div class="filter">
            <ul
              class="list-unstyled mx-auto d-flex align-items-center justify-content-around p-2 rounded-3 px-5 text-center"
            >
              <li
                v-for="c in contentCategories"
                @click="updateActiveCategory(c.title)"
                class="px-3 w-25 fw-bold"
                :class="c.title == activeCategory ? 'active' : ''"
              >
                {{ c.title }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- modal delete start -->
      <div class="modal_delete w-50 mx-auto rounded-2 p-4" v-if="modalDelete">
        <div
          class="modal_header d-flex align-items-center justify-content-between"
        >
          <p>Delete {{ selectedContent.type_content }}</p>
          <button
            class="btn btn-outline-secondary"
            @click="closeModal('delete')"
          >
            <i class="fa-sharp fa-solid fa-circle-xmark"></i>
          </button>
        </div>
        <div class="modal_body d-flex justfiy-content-center">
          <input
            type="text"
            :value="selectedContent.title"
            class="rounded"
            readonly
          />
        </div>
        <div
          class="modal_footer mt-4 d-flex align-items-center justify-content-between"
        >
          <button class="btn btn-secondary" @click="closeModal('delete')">
            Cancel
          </button>
          <button class="btn btn-danger" @click="deleteContentHandler">
            Delete
          </button>
        </div>
      </div>

      <!-- modal delete end -->

      <!-- modal edit start -->
      <div class="modal_edit w-75 mx-auto p-3 rounded-2" v-if="modalEdit">
        <div
          class="modal_header d-flex align-items-center justify-content-between"
        >
          <p>Edit {{ selectedContent.type_content }}</p>
          <button class="btn btn-outline-secondary" @click="closeModal('edit')">
            <i class="fa-sharp fa-solid fa-circle-xmark"></i>
          </button>
        </div>
        <div class="modal_body d-flex w-75 justify-content-around py-2 mt-2">
          <label for="title">
            Title &nbsp;
            <input
              type="text"
              class="rounded"
              :value="contentTitle"
              @input="e => contentTitle = e.target.value"
            />
          </label>
          <label for="description">
            Description &nbsp;
            <input
              type="text"
              class="rounded"
              :value="contentDesc"
              @input="e => contentDesc = e.target.value"
            />
          </label>
        </div>
        <div class="modal-footer">
          <button class="btn btn-warning" @click="editContentHandler">
            Edit
          </button>
        </div>
      </div>
      <!-- modal edit end -->




       <div class="about mt-4 w-50 p-4 mx-auto"
       v-if="activeCategory.toLocaleLowerCase() == 'about'"
       >
        <p style="font-family: 15px;" class="m-1 p-2">{{ user.info }}</p>
       </div>






       
      <!-- card wrapper -->
      <div
        class="card-wrapper p-3 d-flex flex-wrap justify-content-around"
          v-if="activeCategory.toLocaleLowerCase() != 'about'"
        ref="card_wrp"
      >
        <div
          v-if="
            !getContents(contentsUser, activeCategory).length &&
            user._id == user_id"
          class=" mt-3 px-3 your_content_null"
        >
          <img
            src="https://www.gstatic.com/youtube/img/channels/empty_channel_dark_illustration.svg"
            alt="salom"
            class="img w-50 mx-auto"
          />
          <p class="fs-4">Upload Your First {{ activeCategory.toLocaleLowerCase() == 'all' ? 'Content' : activeCategory }}</p>
          <p class="text-secondary">
            This is where the videos you upload <br> will be collected.
          </p>
          <button class="btn btn-info ms-5" @click="uploadContent">
            Add {{ activeCategory }}
          </button>
        </div>
        <p
          class="mt-5"
          v-if="!getContents(contentsUser, activeCategory).length && user._id != user_id"
        >
          The author of the channel has not left any
          <b class="text-info">{{
            activeCategory.toLocaleLowerCase() == "all"
              ? "Content"
              : activeCategory
          }}</b>
          yet. 😐
        </p>




        <Card v-for="content in getContents(contentsUser, activeCategory)">
          <img
            :src="content.content_path"
            alt="photo"
            class="content mx-auto"
            v-if="content.type_content == 'photo'"
            @click="watchContent(content._id)"
          />
          <video
            :src="content.content_path"
            class="content mx-auto ratio ratio-16x9"
            v-if="content.type_content == 'video'"
            @click="watchContent(content._id)"
          ></video>
          <video
            :src="content.content_path"
            class="content mx-auto ratio ratio-16x9"
            v-if="content.type_content == 'story'"
            @click="watchContent(content._id)"
          ></video>
          <div class="card_body mt-3 d-flex justify-content-around">
            <div class="img_content left">
              <img :src="user.avatar_path" alt="avatar" class="avatar_img" />
            </div>
            <div class="center" style="line-height: 1rem">
              <p class="fs-5" style="font-weight: 600">
                {{
                  content.title.length > 15
                    ? content.title.slice(0, 15) + "..."
                    : content.title
                }}
              </p>
              <p class="text-secondary">{{ user.username }}</p>
              <p class="viewers text-secondary">
                {{ CountFunc(content.viewers?.length) }} viewers
              </p>
            </div>
            <div class="right dropdown show">
              <i 
               v-if="user.username==userDataFromLocalStorage.username"
                class="fa-solid fa-ellipsis-vertical option"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></i>
              <ul
                class="dropdown-menu $zindex-dropdown p-2 px-3 rounded-3 text-light"
              >
                <li class="del_hstr" @click="deleteContent(content)">
                  delete this {{ content.type_content }} &nbsp;
                  <i class="fa-regular fa-trash-can"></i>
                </li>
                <li class="edit_hstr" @click="updateContent(content)">
                  update this {{ content.type_content }} &nbsp;
                  <i class="fa-solid fa-pen-nib"></i>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import NotFound from "../components/not-found/NotFound.vue";
import { backendUrl } from "../../env";
import { createToaster } from "@meforma/vue-toaster";
import { socials } from "../datas/socials/datas";
import axios from "axios";
import ContentCategory from "../datas/content_category/ContentCategory";
const toaster = createToaster();
export default {
  name: "Profile",
  components: {
    NotFound,
  },
  data() {
    return {
      url: backendUrl,
      config: {
        headers: { token: JSON.parse(localStorage.getItem("userInfo")).token },
      },
      user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
      contentsUser: [],
      usernameFromQuery: null,
      user: {},
      contentCategories: ContentCategory,
      activeCategory: "All",
      copyLink: `http://localhost:5173/#contents/`,
      followBtnClass: "btn-light",
      followTxt: "Follow",
      userFollowers: [],
      userDataFromLocalStorage: JSON.parse(localStorage.getItem("userInfo")),
      modalEdit: false,
      modalDelete: false,
      selectedContent: {},
      contentTitle: "",
      contentDesc: "",
    };
  },
  setup() {},
  mounted() {
    this.usernameFromQuery = this.$route.query.username
    ? this.$route.query.username
    : JSON.parse(localStorage.getItem("userInfo")).username;
    
    document.title = this.usernameFromQuery
      ? this.usernameFromQuery
      : "Your Contents";
    this.getProfileUser();
    this.totalPage = socials.length;
   
  },
  methods: {
    async getProfileUser() {
      try {
        let { data } = await axios.get(
          `${this.url}/channel?username=${this.usernameFromQuery}`,
          this.config
        );
        this.contentsUser = data.data;
        this.user = data.user;
        this.userFollowers = this.user?.followers
      } catch (error) {
        toaster.error(error.message);
      }
      if (this.userFollowers?.includes(this.user_id)) {
        (this.followBtnClass = "btn-outline-secondary"),
          (this.followTxt = "Unfollow");
      } else {
        this.followBtnClass = "btn-light";
        this.followTxt = "Follow";
      }
    },
  
    async updateContent(selectedContent) {
      this.selectedContent = selectedContent;
     this.contentTitle = selectedContent.title
      this.contentDesc = selectedContent.description
      this.modalEdit = true;
    },
    async following() {
      let { data } = await axios.put(
        `${this.url}/subscribe/channel/${this.user?._id}`,
        {},
        this.config
      );
      this.userFollowers = data.data?.length ? data.data : [];
      this.getProfileUser()
      if (this.user._id == this.user_id) {
        return toaster.error(`You cannot subscribe to yourself!`);
      }
      if (this.userFollowers.includes(this.user_id)) {
        (this.followBtnClass = "btn-outline-secondary"),
          (this.followTxt = "Unfollow");
      } else {
        this.followBtnClass = "btn-light";
        this.followTxt = "Follow";
        toaster.info(`You are successfuly Unfollowed!`);
      }
    },
    watchContent(id) {
      this.$router.push(`/contents/${id}`);
    },
    CountFunc(number) {
      if (number >= 1000000) {
        number = (number / 1000000).toFixed(1) + "m";
      } else if (number >= 1000) {
        number = (number / 1000).toFixed(1) + "k";
      }
      return number;
    },
    getContents(arr, filter) {
      if (filter?.toLowerCase() == "all") {
        return arr;
      } else {
        let data = arr.filter(
          (el) => el.type_content.toLowerCase() == filter.toLowerCase()
        );
        arr = data;
        return arr.length ? arr : [];
      }
    },
    updateActiveCategory(category) {
      this.activeCategory = category;
    },
    uploadContent() {
      this.$router.push(`/upload?type=${this.activeCategory}`);
    },
    closeModal(value) {
      switch (value) {
        case "edit":
          this.modalEdit = false;
          break;
        case "delete":
          this.modalDelete = false;
          break;
      }
    },
    async editContentHandler() {
      try {
        if (
          this.contentTitle == this.selectedContent.title &&
          this.contentDesc == this.selectedContent.description
        ) {
          return toaster.warning(`Please Edit!`);
        }
        let { data } = await axios.put(
          `${this.url}/contents/${this.selectedContent?._id}`,
          {
            title: this.contentTitle,
            description: this.contentDesc,
          },
          this.config
        );
        if (data.success) {
          toaster.success(
            `Successfuly Updated ${this.selectedContent.type_content}`
          );
          this.getProfileUser();
        } else {
          return toaster.error(`Not Deleted! Please try again...`);
        }
        this.modalEdit = false;
      } catch (error) {
        toaster.error(error.message);
      }
    },
    deleteContent(selectedContent) {
      this.selectedContent = selectedContent;
      this.modalDelete = true;
    },
    async deleteContentHandler() {
      try {
        let { data } = await axios.delete(
          `${this.url}/contents/${this.selectedContent?._id}`,
          this.config
        );
        if (!data.success) {
          return toaster.error(`Not Deleted! Please try again...`);
        }
        this.modalDelete = false
        toaster.success(
          `${this.selectedContent?.type_content} Deleted was successfuly!`
        );
        this.getProfileUser()
      } catch (error) {
        toaster.error(error.message);
      }
    },
    viewFollowers(){
      this.$router.push(`/Followers?user_id=${this.user?._id}`)
    }
  },
};
</script>
<style scoped>
.header .container {
  border-bottom: 1px solid #7f7f7f !important;
}

.profileUser {
  padding-top: 6rem;
}

.followers_count{
  cursor: pointer;
}
.followers_count:hover{
text-decoration: underline;
}
.modal_edit {
  transform: translateY(-4rem);
  background: #212121;
}

.modal_delete {
  transform: translateY(-4rem);
  background: #212121;
}

.channel_img {
  width: 100px;
  height: 100px;
}

.username {
  text-decoration: none !important;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.active {
  border: none !important;
  border-bottom: 3px solid #7f7f7f !important;
}

.header .filter ul {
  cursor: pointer;
  transform: translateY(1.3rem);
}

.share_content {
  z-index: 999;
  width: 50% !important;
  top: 25%;
  left: 30%;
  position: fixed;
  background: #212121 !important;
}

.your_content_null {
  width: 35%;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
