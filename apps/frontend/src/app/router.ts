import { useMeStore } from "@/entities/user";
import AppLayout from "@/shared/layouts/AppLayout.vue";
import EmptyLayout from "@/shared/layouts/EmptyLayout.vue";
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const AuthPage = () => import("@/pages/auth/AuthPage.vue");
const DashboardPage = () => import("@/pages/dashboard/DashboardPage.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/auth",
    component: EmptyLayout,
    children: [
      {
        path: "",
        name: "auth",
        component: AuthPage,
      },
    ],
  },
  {
    path: "",
    component: AppLayout,
    children: [
      {
        path: "",
        component: DashboardPage,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const store = useMeStore();
  if (to.name !== "auth" && !store.isAuthenticated) {
    return { name: "auth" };
  }
});
