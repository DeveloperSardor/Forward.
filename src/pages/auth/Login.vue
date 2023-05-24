<template>
  <div class="vh-100  login ">
    <!-- modal start -->


    <!-- Модальное окно -->
    <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content text-dark">
          <div class="modal-header">
            <h5 class="modal-title text-dark fw-bold" id="confirmModalLabel">Confirm Code</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <form class="modal-body w-75 mx-auto">
            <div class="code-container mx-auto d-flex justify-content-around">
              <input type="number" placeholder="0" class="code" min="0" max="9" :maxlength="1" required>
              <input type="number" placeholder="0" class="code" min="0" max="9" :maxlength="1" required>
              <input type="number" placeholder="0" class="code" min="0" max="9" :maxlength="1" required>
              <input type="number" placeholder="0" class="code" min="0" max="9" :maxlength="1" required>
            </div>
          </form>
          <div class="modal-footer">
            <button class="btn btn-primary mx-auto p-2 px-5 verify_btn" @click="sendVerifyCode">Verify</button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal end -->

    <div class="container-fluid h-custom">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-md-9 col-lg-6 col-xl-5">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid"
            alt="Sample image">
        </div>
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <form>
            <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
              <p class="lead fw-normal mb-0 me-3">Sign in with</p>
              <button type="button" class="btn btn-primary btn-floating mx-1">
                <i class="fab fa-facebook-f"></i>
              </button>

              <button type="button" class="btn btn-primary btn-floating mx-1">
                <i class="fab fa-twitter"></i>
              </button>

              <button type="button" class="btn btn-primary btn-floating mx-1">
                <i class="fab fa-linkedin-in"></i>
              </button>
            </div>

            <div class="divider d-flex align-items-center my-4">
              <p class="text-center fw-bold mx-3 mb-0">Or</p>
            </div>

            <!-- Email input -->
            <div class="form-outline mb-4">
              <input type="email" id="form3Example3" class="form-control form-control-lg"
                placeholder="Enter email address" @input="e => email = e.target.value" :value="email" />
              <label class="form-label" for="form3Example3">Email address</label>
            </div>

            <!-- Password input -->
            <div class="form-outline mb-3">
              <div class="d-flex">
                <input id="form3Example4" class="form-control form-control-lg" placeholder="Enter password"
                  :type="showPass ? 'text' : 'password'" @input="e => password = e.target.value" :value="password" ref="pass" />
                <button type="button" class="btn btn-light" @click="changePasswordHandler">
                  <i class="fa-solid fa-lock" v-if="showPass == false"></i>
                  <i class="fa-solid fa-lock-open" v-if="showPass"></i>
                </button>
              </div>
              <label class="form-label" for="form3Example4">Password</label>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <!-- Checkbox -->
              <div class="form-check mb-0">
                <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                <label class="form-check-label" for="form2Example3">
                  Remember me
                </label>
              </div>
              <a href="#!" class="text-body">Forgot password?</a>
            </div>

            <div class="text-center text-lg-start mt-4 pt-2">
              <button type="button" class="btn btn-primary px-4 py-2" data-bs-toggle="modal" id="login_btn"
                data-bs-target="#confirmModal" @click="submitHandler">
                <strong v-if="!loading">Login</strong>
                <div class="spinner-border" role="status" v-else>
                  <span class="sr-only">Loading...</span>
                </div>
              </button>
              <p class="small fw-bold mt-2 pt-1 mb-0">Don't have an account? &nbsp;
                <RouterLink to="/register" class="link-primary">
                  Register
                </RouterLink>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>

  </div>
</template>
<script>



import { RouterView } from 'vue-router';
import { createToaster } from '@meforma/vue-toaster';
import axios from 'axios';

const toaster = createToaster();
export default {
  name: "Login",
  mounted() {
  

    document.title = 'Forward | Login'



    // console.log(this.confirmCode);

    const inputs = document.querySelectorAll('.code')
    inputs.forEach((input, index) => {
      input.dataset.index = index;
      input.addEventListener('paste', this.handleOtpaste)
      input.addEventListener('keyup', this.handleOtp)
    })

  },
  data() {
    return {
      email: '',
      password: "",
      loading: false,
      confirmCode: 0,
      showPass: false,
    }
  },
  methods: {

    changePasswordHandler() {
      
      if (this.showPass == true) {
        this.showPass = false;
      } else {
        this.showPass = true;
      }
    },

    async submitHandler() {
      this.loading = true
      if (!this.email || !this.password) {
        toaster.error(`Please Fill all the Fields!`, {
          duration: 4000,
          isClosable: true,
          position: "top-right"
        })
        this.loading = false
        return
      }
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.post('http://localhost:5000/login', {
          email: this.email,
          password: this.password
        }, config)

        if (await data.status != 401) {
          toaster.success(`${data.message}`, {
            duration: 3000,
            isClosable: true,
            position: "top-right"
          })
          data.user.token = data.token;
          localStorage.setItem('userInfo', JSON.stringify(data.user))
          this.loading = false

        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        toaster.error('Error Occured', {
          duration: 3000,
          isClosable: true,
          position: "top-right"
        })
        this.loading = false
      }



    },


    async sendVerifyCode() {
      this.loading = true
      if (this.confirmCode == 0) {
        toaster.error(`You are not entered code !`, {
          position: "top-right"
        })
        this.loading = false
        return
      }
      
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }


        const { data } =await  axios.post('http://localhost:5000/pass/code', 
        {
          pass: this.confirmCode
        }, 
        config
        )
      
console.log(await data);

        if (await data.status != 400) {
          toaster.success(`${data.message}`, {
            position: "top-right"
          })
          this.loading = false
          this.$router.push('/')
        } else {
          this.loading = false
          throw new Error(`${data.message}`)
        }


      } catch (error) {
        toaster.error(`${error.message}`, {
          position: "top-right"
        })
        this.loading = false
      }
    },


    handleOtpaste(e) {
      const data = e.clipboardData.getData('text')
      const value = data.split('')
      const inputs = document.querySelectorAll('.code')
      if (value.length === inputs.length) {
        inputs.forEach((inp, idx) => (inp.value = value[idx]))
        this.submit()
      }
    },
    handleOtp(e) {
      const input = e.target;
      const value = input.value;
      input.value = '';
      input.value = value ? value[0] : ""

      let fieldIndex = input.dataset.index;
      if (value.length > 0 && fieldIndex < input.length - 1) {
        input.nextELementSibling.focus()
      }

      if (e.key === 'Backspace' && fieldIndex > 0) {
        input.previosElementSibling.focus()
      }

      const inputs = document.querySelectorAll('.code')

      if (fieldIndex == inputs.length - 1) {
        this.submit()
      }

    },
    submit() {
      const inputs = document.querySelectorAll('.code')
      let otp = ''
      inputs.forEach(input => {
        otp += input.value
        input.disabled = true
        input.classList.add('disabled')
      })
      this.confirmCode = otp;
    }
  }
}
</script>
<style >
div.login {
  z-index: 99999;
  width: 95%;
  /* transform: translateX(-6rem); */
}

.code {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  border: 1px solid #eee;
  font-size: 30px;
  font-family: 'Lato', sans-serif;
  width: 75px;
  height: 80px;
  text-align: center;
  font-weight: 300;
}

.disabled {
  opacity: 0.5;
}

@media (max-height : 600px) {
  .code-container {
    flex-wrap: wrap;
  }

  .code {
    caret-color: transparent;
    font-size: 24px;
    height: 50px;
    max-width: 50px;
    font-size: bold;
  }
}


.code::-webkit-outer-spin-button,
.code::-webkit-inner-spin-button {
  -webkit-appearance: none;
}


.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}

.h-custom {
  height: calc(100% - 73px);
}

@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}

.code:valid {
  border-color: #9861c2;
  box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.25);
}
</style>