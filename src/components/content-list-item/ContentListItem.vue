<template >
  <Card  id="contentItem" >
    <img :src="content.content_path" :alt="content.title" v-if="content.type_content == 'photo'" class="content mx-auto" @click="contentById(content._id)">
    <video :src="content.content_path" v-else-if="content.type_content == 'video'" class="content content mx-auto ratio ratio-16x9" ref="video" @click="contentById(content._id)"></video>
    <!-- story -->
    <video  :src="content.content_path" v-if="content.type_content=='story' && content.content_path.slice(content.content_path.length -3) == 'mp4'" @click="contentById(content._id)" ></video>
    <img :src="content.content_path" v-if="content.type_content=='story' && content.content_path.slice(content.content_path.length -3) != 'mp4' " @click="contentById(content._id)"  alt="story">    
    <!--  -->
    <div class="card_body mt-3 d-flex justify-content-around">
          <div class="img_content left">
            <img
              :src="content.user.avatar_path"
              alt="avatar"
              class="avatar_img"
              @click="viewProfile"
            />
          </div>
          <div class="center" style="line-height: 0.6rem">
            <p class="fs-5" style="font-weight: 600">
              {{
                (content.title =
                  content.title.length > 12
                    ? content.title.slice(0, 12) + "..."
                    : content.title)
              }}
            </p>
            <p class="text-secondary username" @click="viewProfile">{{ content.user.username }}</p>
          </div>
          <br>
        </div>
        <div class="date_viewers  mx-auto text-secondary">
         {{ CountFunc( content.viewers.length) }} viewers
        </div>
  </Card>
</template>
<script>
import axios from 'axios';

export default {
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
    }
  },
  mounted(){
    
  },
  methods: {
    async contentById(id) {
      this.$router.push(`contents/${id}`)
    },
     viewProfile(){
      let username = this.content.user?.username.replace(/ /g, '');
      this.$router.push(`/Profile?username=${username}`)
    },
    CountFunc(number) {
      if (number >= 1000000) {
        number = (number / 1000000).toFixed(1) + "m";
      } else if (number >= 1000) {
        number = (number / 1000).toFixed(1) + "k";
      }
      return number;
    },
  },
};
</script>
<style scoped>

.date_viewers{
  margin-top: -.2rem;
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