<template>
  <section>
    <addContent :open ="isOpenAddContent" :contentUrl=" contentUrl" :typeContent = "typeContent" :defaultContentTitle="contentTitle" :typeC= "type_content" @OpenFalse="OpenFalse"/>
    <div class="fileUploadModal py-5 mx-auto rounded-2 w-50" ref="uploadFile" :class="isOpenUploadModal ? 'd-block' : 'd-none'">
      <div class="header d-flex align-items-center justify-content-between container pb-1">
        <p class="fs-4 font-monospace">{{ type_content }}</p>
        <button ref="closeUpl" class="btn btn-dark p-2 px-3">
          <i class="fa-sharp fa-solid fa-circle-xmark"></i>
        </button>
      </div>
      <div class="body mt-3 p-5">
        <label class="custom-upload">
          <span class="file-name rounded-4 bg-dark text-center p-4 py-4 pt-5">
            <i class="fa-solid fa-cloud-arrow-up uploadIcon" ref="uploadIcon" :class="uploading ? 'uploading' : ''"></i>
          </span>
          <input type="file" id="uploadContentInput" accept="image/*" @change="uploadFile" />
        </label>
        <div class="text mt-5">
          <p style="
              font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
                'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            ">
            Drag and drop files here or click the button below to select them on
            your computer. <br />

            <b class="text-secondary" style="
                font-family: 'Lucida Sans', 'Lucida Sans Regular',
                  'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
                  sans-serif;
              ">Until you publish the video, access to them will be limited.</b>
          </p>
        </div>
        <label class="mt-3">
          <button class="btn btn-info font-monospace">
            {{ loading ? "loading..." : "Send" }}
          </button>
        </label>
      </div>
      <div class="modal-bottom mt-3">
        <p class="footer_text text-secondary">
          By uploading a video, you agree to the Forward<b class="text-info procedure">
            Terms of Service</b>
          and <b class="text-info procedure">Community Guidelines</b>.
          <br />
          You also agree to respect the copyrights and privacy of other users'
          data. Read more…
        </p>
      </div>
    </div>
  </section>
</template>
<script>
import { createToaster } from '@meforma/vue-toaster';
import axios from 'axios';
import addContent from '../components/addContent/AddContent.vue'
const toaster = createToaster()
export default {
  name: "Upload",
   components : {
    addContent
   },
  data() {
    return {
      loading: false,
      type_content: this.$route.query.type,
      uploading: false,
      contentUrl: '',
      contentTitle : '',
      isOpenUploadModal : true,
      isOpenAddContent : false,
      typeContent : null
    };
  },
  mounted() {
    
    this.type_content = this.$route.query.type
  },
  methods: {
   async  uploadFile(e) {
      let [file] = e.target.files;
      let type_file = file.type.split('/')[0]
      if (file == undefined) {
        return;
      }


      if (this.type_content.toLocaleLowerCase() == 'photo') {
        if (type_file != 'image') {
          return toaster.error(`Photo Content must me image file!`)
        }
      }
      if (this.type_content.toLocaleLowerCase() == 'video') {
        if (type_file != 'video') {
          return toaster.error(`VIdeo Content must me video file!`)
        }
      }
      if (this.type_content.toLocaleLowerCase() == 'story') {
        if (type_file != 'video' && type_file != 'image') {
          return toaster.error(`Story Content must me video or image file!`)
        }
      }

      try {

        this.loading = true
        this.uploading = true;
        const fileData = new FormData();
        fileData.append("file", file);
        fileData.append("upload_preset", "chat-app");
        fileData.append("cloud_name", "roadsidecoder");
       let {data} = await  axios.post(`https://api.cloudinary.com/v1_1/roadsidecoder/${type_file}/upload`, fileData)
           this.typeContent = data.resource_type
           this.contentUrl = data.url;
           this.contentTitle = file.name.slice(0, file.name.indexOf('.'))
             this.loading = false
            this.uploading = false
            this.isOpenUploadModal = false
            this.isOpenAddContent = true
            toaster.warning(`Please do not refresh the page!`, {position : 'top-right'})
      } catch (error) {
        toaster.error(error.message)
        this.loading = false
        this.uploading = false
      }


      if (file)
        try {

        } catch (error) {
          toaster.error(error.message)
        }
    },
    OpenFalse(boolean){
     this.isOpenAddContent = boolean
    }
  }
}


</script>

<style scoped>
.fileUploadModal {
  position: fixed;
  background: #282828 !important;
  transform: translateY(-3rem);
  left: 32%;
}

input[type="file"] {
  display: none;
}

.header {
  border-bottom: 1px solid #434343;
}

.body .file-name {
  cursor: pointer;
}

@keyframes sendFileAnimation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: translateY(-1rem);
  }
}

.body .uploadIcon {
  font-size: 3.7rem !important;
  transform: translateY(0.4rem);
}

.uploading {
  animation: sendFileAnimation 1s infinite linear;
}
</style>
