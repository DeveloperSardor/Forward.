import { createApp } from "vue";
import "./style.css";
import App from "./app/App.vue";
import uiComponents from "./ui-component";
import router from "./router";
import Toaster from "@meforma/vue-toaster";


const app = createApp(App);
app.use(router);
app.use(Toaster)
// router.beforeEach((to, from, next)=>{
//     App.data().isLoading = true;
//     setTimeout(()=>{
//      next()
//      App.data().isLoading = false
//     }, 3000)
// })
uiComponents.map((comp) => app.component(comp.name, comp));
app.mount("#root");
