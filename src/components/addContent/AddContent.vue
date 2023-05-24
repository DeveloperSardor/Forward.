<template>
  <!-- Modal -->
  <div class="modal_link w-50 bg-dark border mx-auto p-3 rounded-3" v-if="linkTemplate">
    <div class="top d-flex justify-content-between container">
      <p class="font-monospace">Link For {{ typeC }}</p>
      <span class="close_copy" @click="closeCopy">
        <i class="fa-sharp fa-solid fa-circle-xmark fs-4"></i>
      </span>
    </div>
    <div class="copy d-flex justify-content-between mt-2">
      <RouterLink :to='linkForContent'>http://localhost:5173/#{{ linkForContent }}</RouterLink>
      
      <button class="btn btn-primary" ref="copy_btn" @click="copyLinkFunc">
        Copy
        <i class="fa-solid fa-copy"></i>
      </button>
    </div>
  </div>
  <!-- modal end -->

  <div class="spinner-border" role="status" v-if="addLoading">
    <span class="visually-hidden">Loading...</span>
  </div>

  <form
    class="card mx-auto w-50 p-2"
    :class="open ? 'd-block' : 'd-none'"
    @submit.prevent
  >
    <div class="top d-flex container justify-content-between">
      <p class="fs-4 font-monospace">{{ defaultContentTitle }}</p>
      <button class="btn btn-dark p-2 px-3 close_btn">
        <i class="fa-sharp fa-solid fa-circle-xmark"></i>
      </button>
    </div>
    <div class="body row pt-3">
      <div class="container d-flex justify-content-around align-items-center">
        <div class="col-7 left" @submit.prevent>
          <h3 class="text-center">Info</h3>
          <label for="title">
            <input
              type="text"
              required
              :value="defaultContentTitle"
              class="contentTitle p-2"
              @input="(e) => (defaultContentTitle = e.target.value)"
              maxlength="30"
            />
          </label>
          <label for="description">
            <textarea name="" id="" cols="30" rows="10" class="description" :value="description" @input="e=> description = e.target.value">
            </textarea>
          </label>
        </div>
        <div class="right col-5 p-2" @submit.prevent>
          <img
            :src="contentUrl"
            alt="image"
            v-if="typeContent == 'image'"
            class="content"
          />
          <video
            :src="contentUrl"
            v-else-if="typeContent == 'video'"
            class="content"
            controls
          ></video>
          <select
            required
            class="form-select mt-3"
            placeholder="PLease select Option "
            @change="selectCategory"
          >
            <option value=""></option>
            <option :value="c.category_name" v-for="c in categories">
              {{ c.category_name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="footer mt-2 py-2">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="left d-flex align-items-center">
          <div class="icons d-flex">
            <i class="fa-solid fa-upload"></i>
            <i class="fa-sharp fa-solid fa-high-definition"></i>
            <i class="fa-regular fa-octagon-check"></i>
          </div>
          &nbsp; &nbsp;
          <b class="text-secondary"
            >Verification completed. No violations found.</b
          >
        </div>
        <div class="right">
          <button class="btn btn-primary" type="submit" @click="addNewContent">
            Next
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import { createToaster } from "@meforma/vue-toaster";
import axios from "axios";
const toaster = createToaster();
import { backendUrl } from "../../../env";
export default {
  props: {
    open: {
      type: Boolean,
    },
    contentUrl: {
      type: String,
    },
    typeContent: {
      type: String,
    },
    defaultContentTitle: {
      type: String,
    },
    typeC: {
      type: String,
    },
  },
  data() {
    return {
      description: '',
      linkForContent: '',
      titleValidate: false,
      url: backendUrl,
      config: {
        headers: { token: JSON.parse(localStorage.getItem("userInfo")).token },
      },
      categories: [],
      selectedCatId: null,
      addLoading: false,
      linkTemplate: false,
    };
  },
  async mounted() {
    try {
      let { data } = await axios.get(`${this.url}/categories`, this.config);
      this.categories = data.data;
    } catch (error) {
      console.log(error.message);
    }
  },
  methods: {
    async addNewContent() {
      if (this.selectedCatId) {
        try {
          let { data } = await axios.post(
            `${this.url}/contents`,
            {
              title: this.defaultContentTitle,
              description: this.description,
              content_path: this.contentUrl,
              category_content: this.selectedCatId,
              type_content: this.typeC,
            },
            this.config
          );
          this.linkForContent = `/contents/${data.added_content._id}`;
          this.$emit("OpenFalse", false);
          this.linkTemplate = true;
        } catch (error) {
          toaster.error(error.message);
        }
      } else return;
    },
    selectCategory(e) {
      let categoryFind = this.categories.find(
        (el) => el.category_name == e.target.value
      );
      this.selectedCatId = categoryFind._id;
    },
    closeCopy() {
      this.$router.push("/");
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
  },
};
</script>
<style scoped>
.card {
  background: #282828 !important;
  min-height: 520px;
  word-break: break-all;
  word-wrap: break-word;
}
.card .top {
  border-bottom: 1px solid #606060 !important;
}
.card .top .close_btn {
  height: 35px !important;
}
.card .body .contentTitle,
.card .body .description {
  border: 1px solid #ffffff42 !important;
  margin: 0.6rem;
  border-radius: 7px;
  background: transparent !important;
  color: #fff !important;
  outline: none !important;
}
.card .body .contentTitle:hover,
.card .body .description:hover {
  border: 1px solid #eee !important;
}
.card .body .contentTitle,
.card .body .description:focus {
  border: 1px solid rgba(0, 225, 255, 0.773) !important;
}
.card .body .right .content {
  width: 90%;
  height: 250px;
  border-radius: 16px;
  margin: 1rem, 0.9rem;
}
.card .footer {
  border-top: 1px solid #606060 !important;
}
.card .footer .left .icons {
  color: #3ea6ff !important;
}
.close_copy{
  cursor: pointer;
}
</style>
