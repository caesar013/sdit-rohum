import { createRouter, createWebHistory } from "vue-router";

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
        component: () => import('../views/PesertaDidik.vue')
    },
    {
      path: "/guru-tendik",
      name: "GuruTendik",
        component: () => import('../views/GuruTendik.vue')
    },
    {
      path: "/pd-non-aktif",
      name: "PDNonAktif",
        component: () => import('../views/PDNonAktif.vue')
    },
    {
      path: "/galeri-foto",
      name: "GaleriFoto",
      //   component: () => import('../views/GaleriFoto.vue')
    },
    {
      path: "/galeri-video",
      name: "GaleriVideo",
      //   component: () => import('../views/GaleriVideo.vue')
    },
    {
      path: "/unduhan",
      name: "Unduhan",
      //   component: () => import('../views/Unduhan.vue')
    },
    {
      path: "/hubungi-kami",
      name: "HubungiKami",
      //   component: () => import('../views/HubungiKami.vue')
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
