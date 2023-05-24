<template>
  <aside
    className="d-flex flex-column  p-3 text-white  "
    v-if="$route.meta.keepAlive"
  >
    <a
      href="/"
      className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
    >
      <svg className="bi me-2" width="40" height="32">
        <use xlinkHref="#bootstrap" />
      </svg>
      <span className="fs-4 fw-bold logo_brand">Forward</span>
    </a>
    <hr />
    <ul className="nav nav-pills flex-column mb-auto font-monospace">
      <li className="nav-item" v-for="page in PagesData">
        <RouterLink
          :to="page.path"
          :class="
            this.$route.path == page.path  && !this.$route.query.username ? 'nav-link active' : 
            'nav-link text-white'"
          
        >
          <i :class="page.icon"></i> &nbsp; {{ page.title }}
        </RouterLink>
      </li>
    </ul>
    <hr />
  </aside>
</template>
<script>
import { RouterLink, RouterView } from "vue-router";
import PagesData from "../../datas/pagesData/datas";
export default {
  data() {
    return {
      PagesData,
      username: JSON.parse(localStorage.getItem("userInfo"))?.username,
    };
  },
  methods: {},
};
</script>
<style scoped>
aside {
  height: 100vh;
  width: 20%;
  position: fixed;
  top: 0;
  left: 0;
  border-right: 0.2px solid #ffffffcc;
}
aside .logo_brand {
  font-family: Georgia, "Times New Roman", Times, serif !important;
}
aside ul li {
  margin-top: 1rem;
}
aside ul li a a:active {
  color: #fff !important;
}
</style>
