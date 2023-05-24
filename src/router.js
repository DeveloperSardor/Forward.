import { createRouter, createWebHashHistory } from "vue-router";
import Downloads from "./pages/Downloads.vue";
import History from "./pages/History.vue";
import Home from "./pages/Home.vue";
import Followed from "./pages/Followed.vue";
import Followers from "./pages/Followers.vue";
import LikedContent from "./pages/LikedContent.vue";
import Profile from "./pages/Profile.vue";
import Upload from "./pages/fileUpload.vue";
import Login from "./pages/auth/Login.vue";
import Register from "./pages/auth/Register.vue";
import OneContentById from "./pages/OneContentById.vue";
import SearchResult  from './pages/SearchResult.vue'
import MyProfile from './pages/ProfileSettings.vue'
import FAQ from './pages/Faq.vue'
import Ai from './pages/Ai.vue'

const routes = [
  {
    name: "Home",
    component: Home,
    path: "/",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "ai",
    component: Ai,
    path: "/ai", 
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "FAQ",
    component: FAQ,
    path: "/faq",
    meta: {
      keepAlive: true,
    },
  },

  {
    name: "ContentById",
    component: OneContentById,
    path: "/contents/:id",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "SearchResult",
    component: SearchResult,
    path: "/results",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "Downloads",
    component: Downloads,
    path: "/downloads",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "History",
    component: History,
    path: "/history",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "Profile Settings",
    component: MyProfile,
    path: "/profile_settings",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "Liked Content",
    component: LikedContent,
    path: "/likedContent",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "Profile",
    component: Profile,
    path: "/Profile",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "Followed",
    component: Followed,
    path: "/followed",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "Followers",
    component: Followers,
    path: "/followers",
    meta: {
      keepAlive: true,
    },
  },
  {
    name: "Upload",
    component: Upload,
    path: "/upload",
    meta: {
      keepAlive: true,
    },
  },
 
  {
    name: "Login",
    component: Login,
    path: "/login",
    alias: "/login",
    meta: {
      keepAlive: false,
    },
  },
  {
    name: "Register",
    component: Register,
    path: "/register",
    meta: {
      keepAlive: false,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
