<template>
    <div class="my_profile   p-5">
        <p class="fs-4  mt-3 ">Profile Settings
            <i class="fa-solid fa-gear py-1"></i>
        </p>
        <div class="container  ">
            <div class="row contents_wrp border pt-2">
                <div class="col-8  p-3">
                    <div class="header_txt d-flex align-items-center">
                        <hr class="bg-light w-50">
                        <p class="px-3 font-monospace">Settings</p>
                        <hr class="bg-light w-50">
                    </div>
                    <div class="d-flex flex-column align-items-center details">
                        <label for="first_name">
                            firstname
                            <i class="fa-solid fa-arrow-right text-white"></i>
                            <input type="text" :value="userData?.firstname" @input="e => firstname = e.target.value">
                        </label>
                        <label for="last_name">
                            lastname
                            <i class="fa-solid fa-arrow-right text-danger"></i>
                            <input type="text" :value="userData?.lastname" @input="e => lastname = e.target.value">
                        </label>
                        <label for="username">
                            username
                            <i class="fa-solid fa-arrow-right text-info"></i>
                            <input type="text" :value="userData?.username" @input="e => username = e.target.value">
                        </label>
                        <label for="email">
                            email
                            <i class="fa-solid fa-arrow-right text-success"></i>
                            <input type="text" :value="userData?.email" @input="e => email = e.target.value">
                        </label>
                        <label for="password">
                            password
                            <i class="fa-solid fa-arrow-right text-warning"></i>
                            <input type="text" :value="userData?.password" @input="e => password = e.target.value">
                        </label>
                        <label for="gender">
                            gender
                            <i class="fa-solid fa-arrow-right text-secondary"></i>
                            <select name="gender" id="" class="p-1 rounded w-50" @change="e => gender = e.target.value">
                                <option value="male" selected>{{ userData?.gender }}</option>
                                <option value="female">{{ userData?.gender?.toLowerCase() == 'male' ? 'female' : "male" }}
                                </option>
                            </select>
                        </label>
                        <label for="info">
                            info
                            <i class="fa-solid fa-arrow-right text-primary"></i>
                            <textarea name="" id="" cols="30" rows="10" class="info ms-4"
                                @input="e => info = e.target.value" :value="info">

                        </textarea>
                        </label>
                    </div>
                </div>
                <div class="col-4  p-3 avatar_content d-flex flex-column justify-content-center align-items-center">
                    <p class="text-light avatar_txt">My Profile Avatar</p>
                    <img :src="userData?.avatar_path" alt="avatar" class="w-50 p-3 img img-fluid">
                    <hr class="w-50 mx-auto">
                    <button class="btn btn-secondary">
                        <label class="custom-upload">
                            <span class="file-name rounded-3  text-center p-1">
                                <div class="spinner-border" role="status" v-if="isAvaLoading">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <small v-if="!isAvaLoading"> Update Ava</small>

                            </span>
                            <input type="file" id="uploadContentInput" ref="avaInp" accept="image/*" class="d-none"
                                @change="e => uploadAva(e.target.files[0])" />
                        </label>
                    </button>
                </div>
                <div class="footer px-4 border-top py-3 d-flex justify-content-between align-items-center">
                    <button class="btn btn-secondary" @click="cancel">Cancel</button>
                    <button class="btn btn-primary" @click="updateUserDataHandler">
                        <div class="spinner-border" role="status" v-if="sendLoading">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <small v-if="!sendLoading">Send</small>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { createToaster } from '@meforma/vue-toaster';
import { backendUrl } from '../../env';
import axios from 'axios';
const toaster = createToaster()
export default {
    data() {
        return {
            userDataFromLocalStorage: JSON.parse(localStorage.getItem("userInfo")),
            url: backendUrl,
            config: {
                headers: { token: JSON.parse(localStorage.getItem('userInfo'))?.token }
            },
            userData: {},
            lastname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            gender: '',
            info: '',
            avatar_path: '',
            isAvaLoading: false,
            sendLoading: false
        };
    },
    mounted() {
        this.getUserData()
    },
    methods: {
        async uploadAva(pics) {
            this.isAvaLoading = true
            let type = pics.type.substring(pics.type.length - 3)
            if (pics && type == 'mp4') {
                return toaster.error("you can not upload mp4 file!", {
                    position: "top-right",
                });
            }
            if (pics && (type == 'png' || 'jpg' || 'svg')) {
                const fileData = new FormData();
                fileData.append('file', pics)
                fileData.append("upload_preset", "chat-app");
                try {
                    let { data } = await axios.post(`https://api.cloudinary.com/v1_1/roadsidecoder/image/upload`, fileData)
                    this.avatar_path = data.url
                    this.isAvaLoading = false
                } catch (error) {
                    toaster.error(error.message)
                    this.isAvaLoading = false
                }
            }

        },
        async getUserData() {
            try {
                this.sendLoading = true

                let { data } = await axios.get(`${this.url}/users/${this.userDataFromLocalStorage?._id}`, this.config)
                if (data.success) {
                    this.userData = data.data
                    this.firstname = this.userData?.firstname,
                        this.lastname = this.userData?.lastname,
                        this.username = this.userData?.username,
                        this.email = this.userData?.email,
                        this.password = this.userData?.password,
                        this.gender = this.userData?.gender,
                        this.info = this.userData?.info,
                        this.avatar_path = this.userData?.avatar_path
                    this.sendLoading = false
                } else {
                    return this.sendLoading = false
                }
            } catch (error) {
                toaster.error(error.message)
                this.sendLoading = false
            }
        },

        cancel() {
            this.$router.push('/')
        },
        async updateUserDataHandler() {

            if (!this.firstname && !this.lastname && !this.username && !this.email && !this.password && !this.gender && !this.info && !this.avatar_path) {
                return toaster.error(`you haven't changed yet!`)
            }
            try {
                let { data } = await axios.put(`${this.url}/profile/edit`,
                    {
                        firstname: this.firstname,
                        lastname: this.lastname,
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        gender: this.gender,
                        info: this.info,
                        avatar_path: this.avatar_path
                    }, this.config)
                if (data.success) {
                    let token = this.userDataFromLocalStorage?.token
                    data.data.token  = token
                    localStorage.setItem('userInfo', JSON.stringify(data.data))
                    this.getUserData()
                    toaster.success(`Updated was successfuly!`)
                } else {
                    console.log(`Error Occured!`);
                }
            } catch (error) {
                toaster.error(error.message)
            }
        }
    }
};
</script>
<style scoped>
.contents_wrp:hover {
    box-shadow: rgba(100, 100, 111, 0.2) 10px 7px 29px 10px;
}

.contents_wrp {
    transition: .4s ease;
    border-radius: 7px;
    border: 0.6px solid #616161 !important;
}

.my_profile {
    margin-top: 2.5rem;
}

.avatar_content img {
    border-radius: 30%;
}

.avatar_txt {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.details label {
    font-family: Georgia, 'Times New Roman', Times, serif;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .5rem;
    margin: 0.2rem;
}

.details label input {
    border-radius: 20px;
    outline: none !important;
    box-shadow: none !important;
    min-width: 140px;
}

.details label .info {
    width: 250px;
    height: 60px;
    border-radius: 9px;
    outline: none !important;
    box-shadow: none !important;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: #666666 #f2f2f2;
}
</style>
