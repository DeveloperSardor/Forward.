<template>
  <li class="text-start py-2 mt-2 comment rounded-3">
    <div class="container d-flex">
      <div class="img_content">
        <img :src="comment.user.avatar_path" alt="avatar" class="avatar_channel" />
      </div>
      <div class="text_content ms-3">
        <a style="font-size: small" href="" class="text-light text-decoration-none channel_from_comm">@{{
          comment.user.username }}</a>
        <br />
        <input type="text" class="bg-transparent text-light commentTxt" :value="comment.body" readonly ref="commentTxt"
          @dblclick="editComment" />
      </div>
    </div>
    <div class="d-flex align-items-center justify-content-between">
      <div class="btns w-25 d-flex justify-content-around like_dislike">
        <button class="btn btn-dark" @click="likeCommFunc(comment._id)">
          <i class="fa-solid fa-thumbs-up" :class="likeButtonClass"></i>
          <small class="ms-2">{{
            !likes.length ? 0 : CountFunc(likes.length)
          }}</small>
        </button>
        <button class="btn btn-dark" @click="dislikeCommFunc(comment._id)">
          <i class="fa-solid fa-thumbs-down" :class="dislikeButtonClass"></i>
          <small class="ms-2">{{
            !dislikes.length ? 0 : CountFunc(dislikes.length)
          }}</small>
        </button>
      </div>
      <div class="edit_delete me-2 d-flex w-25 justify-content-between" v-if="user_id == comment.user._id">
        <button class="btn btn-warning px-4 active" @click="editComment" ref="editCom">
          <i class="fa-solid fa-pen-nib" ref="editIcon"></i>
        </button>
        <button class="btn btn-danger px-4" @click="deleteComm">
          <i class="fa-sharp fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </li>
</template>
<script>
import axios from "axios";
import { backendUrl } from "../../../env";
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster()
export default {
  data() {
    return {
      url: backendUrl,
      likes: [],
      dislikes: [],
      likeButtonClass: "text-secondary",
      dislikeButtonClass: "text-secondary",
      user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
      config: {
        headers: {
          token: JSON.parse(localStorage.getItem("userInfo")).token,
        },
      },
    };
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    CountFunc: {
      type: Function,
    },
  },
  mounted() {
    this.likes = this.comment.like != undefined ? this.comment.like : [];
    this.dislikes =
      this.comment.dislike != undefined ? this.comment.dislike : [];

    if (this.likes.includes(this.user_id)) {
      this.likeButtonClass = "text-light";
    } else {
      this.likeButtonClass = "text-secondary";
    }

    if (this.dislikes.includes(this.user_id)) {
      this.dislikeButtonClass = "text-light";
    } else {
      this.dislikeButtonClass = "text-secondary";
    }

  },
  methods: {
    async likeCommFunc(id) {
      if (this.dislikes?.includes(this.user_id)) {
        try {
          let { data } = await axios.delete(
            `${this.url}/comment/dislike/${id}`,
            this.config
          );
          this.dislikes = data.data;
          this.dislikeButtonClass = "text-secondary";
        } catch (error) {
          console.log(error.message);
        }
      }

      try {
        let { data } = await axios.put(
          `${this.url}/comment/add/like/${id}`,
          {},
          this.config
        );
        this.likes = data.data ? data.data : [];
        if (this.likes.includes(this.user_id)) {
          this.likeButtonClass = "text-light";
        } else {
          this.likeButtonClass = "text-secondary";
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async dislikeCommFunc(id) {
      if (this.likes.includes(this.user_id)) {
        try {
          let { data } = await axios.delete(
            `${this.url}/comment/like/${id}`,
            this.config
          );

          this.likes = data.data;
          this.likeButtonClass = "text-secondary";
        } catch (error) {
          console.log(error.message);
        }
      }

      try {
        let { data } = await axios.put(
          `${this.url}/comment/add/dislike/${id}`,
          {},
          this.config
        );

        this.dislikes = data.data ? data.data : [];
        if (this.dislikes.includes(this.user_id)) {
          this.dislikeButtonClass = "text-light";
        } else {
          this.dislikeButtonClass = "text-secondary";
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async editComment() {
      if (this.$refs.editCom.innerHTML == `<i class="fa-solid fa-pen-nib" ref="editIcon"></i>`) {
        this.$refs.commentTxt.removeAttribute("readonly");
        this.$refs.commentTxt.focus();
        this.$refs.editCom.innerText = "Save";
      } else {
        try {
          let { data } = await axios.put(`${this.url}/comment/${this.comment._id}`, {
            body: this.$refs.commentTxt.value
          }, this.config)
          this.comment.body = data.data.body
          this.$emit('NewComment')
        } catch (error) {
          toaster.error(error.message, {
            position: 'top-right'
          })
        }
        this.$refs.commentTxt.setAttribute('readonly', 'readonly')
        this.$refs.editCom.innerHTML = `<i class="fa-solid fa-pen-nib" ref="editIcon"></i>`
      }
    },
    async deleteComm() {
      try {
        const { data } = await axios.delete(`${this.url}/comment/${this.comment._id}`, this.config);
        this.$emit('UpdatedData', data.data)
        toaster.success(`Deleted was successfuly!`)
      } catch (error) {
        toaster.error(error.message)
      }
    }
  },
};
</script>
<style scoped>
.comment {
  border: #ffffff70 solid 1px;
}

.avatar_channel {
  border-radius: 20px;
  width: 35px;
  height: 35px;
  object-fit: contain;
  cursor: pointer;
}

.text_content a:hover {
  text-decoration: underline !important;
}

.commentTxt {
  border: none !important;
  cursor: pointer;
}

.commentTxt:focus {
  box-shadow: none;
  outline: none;
}

.commentTxt:not(:read-only) {
  color: rgb(192, 228, 255) !important;
  font-family: 'Times New Roman', Times, serif;
}
</style>
