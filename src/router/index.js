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
      path: "/prestasi",
      name: "Prestasi",
      component: () => import("../views/Prestasi.vue"),
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
          component: () => import("../admin/views/NewsList.vue"),
        },
        {
          path: "teachers",
          name: "AdminTeachers",
          component: () => import("../admin/views/TeachersList.vue"),
        },
        {
          path: "students",
          name: "AdminStudents",
          component: () => import("../admin/views/StudentsList.vue"),
        },
        {
          path: "alumni",
          name: "AdminAlumni",
          component: () => import("../admin/views/AlumniList.vue"),
        },
        {
          path: "facilities",
          name: "AdminFacilities",
          component: () => import("../admin/views/FacilitiesList.vue"),
        },
        {
          path: "achievements",
          name: "AdminAchievements",
          component: () => import("../admin/views/AchievementsList.vue"),
        },
        {
          path: "photo-albums",
          name: "AdminPhotoAlbums",
          component: () => import("../admin/views/PhotoAlbumsList.vue"),
        },
        {
          path: "videos",
          name: "AdminVideos",
          component: () => import("../admin/views/VideosList.vue"),
        },
        {
          path: "contact",
          name: "AdminContact",
          component: () => import("../admin/views/ContactMessagesList.vue"),
        },
        {
          path: "comments",
          name: "AdminComments",
          component: () => import("../admin/views/NewsCommentsList.vue"),
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
