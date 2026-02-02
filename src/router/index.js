import { createRouter, createWebHistory } from "vue-router";

// Auth guard function
const requireAuth = (to, from, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    next();
  } else {
    next("/admin/login");
  }
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/identitas-sekolah",
      name: "IdentitasSekolah",
      component: () => import("../views/IdentitasSekolah.vue"),
    },
    {
      path: "/sejarah",
      name: "Sejarah",
      component: () => import("../views/Sejarah.vue"),
    },
    {
      path: "/akreditasi",
      name: "Akreditasi",
      component: () => import("../views/Akreditasi.vue"),
    },
    {
      path: "/visi-misi",
      name: "VisiMisi",
      component: () => import("../views/VisiMisi.vue"),
    },
    {
      path: "/sarana-prasarana",
      name: "SaranaPrasarana",
      component: () => import("../views/SaranaPrasarana.vue"),
    },
    {
      path: "/berita",
      name: "Berita",
      component: () => import("../views/Berita.vue"),
    },
    {
      path: "/berita/:slug",
      name: "BeritaDetail",
      component: () => import("../views/BeritaDetail.vue"),
    },
    {
      path: "/peserta-didik",
      name: "PesertaDidik",
      component: () => import("../views/PesertaDidik.vue"),
    },
    {
      path: "/guru-tendik",
      name: "GuruTendik",
      component: () => import("../views/GuruTendik.vue"),
    },
    {
      path: "/pd-non-aktif",
      name: "PDNonAktif",
      component: () => import("../views/PDNonAktif.vue"),
    },
    {
      path: "/galeri-foto",
      name: "GaleriFoto",
      component: () => import("../views/GaleriFoto.vue"),
    },
    {
      path: "/galeri-video",
      name: "GaleriVideo",
      component: () => import("../views/GaleriVideo.vue"),
    },
    {
      path: "/hubungi-kami",
      name: "HubungiKami",
      component: () => import("../views/HubungiKami.vue"),
    },
    // Admin routes
    {
      path: "/admin/login",
      name: "AdminLogin",
      component: () => import("../admin/views/Login.vue"),
    },
    {
      path: "/admin",
      redirect: "/admin/dashboard",
      component: () => import("../admin/layouts/AdminLayout.vue"),
      beforeEnter: requireAuth,
      children: [
        {
          path: "dashboard",
          name: "AdminDashboard",
          component: () => import("../admin/views/Dashboard.vue"),
        },
        {
          path: "news",
          name: "AdminNews",
          component: () => import("../admin/views/news/NewsList.vue"),
        },
        {
          path: "news/create",
          name: "AdminNewsCreate",
          component: () => import("../admin/views/news/NewsForm.vue"),
        },
        {
          path: "news/edit/:id",
          name: "AdminNewsEdit",
          component: () => import("../admin/views/news/NewsForm.vue"),
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
