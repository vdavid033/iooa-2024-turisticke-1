<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <div class="text-h6"><b>Turističke atrakcije</b></div>
        </q-toolbar-title>
        <q-toolbar-title>
          <div class="text-h6"><b>Prijavljeni ste kao:</b>{{ userRole }}</div>
        </q-toolbar-title>
        <q-btn flat icon="logout" label="ODJAVA" v-if="tokenExists" @click="clearLocalStorage" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Izbornik</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { jwtDecode } from 'jwt-decode';

const linksList = [
  {
    title: "Prijava",
    icon: "login",
    link: "auth",
    target: "_self",
    requiresAuth: false,
    hideOnAuth: true,  // Dodan novi atribut za skrivanje na autentikaciji
  },
  {
    title: "Sve atrakcije",
    caption: "popis svih atrakcija",
    icon: "favorite",
    link: "/",
    target: "_self",
    requiresAuth: false,
    hideOnAuth: false,  // Atribut za uvjetno skrivanje
  },
  {
    title: "Moje atrakcije",
    caption: "popis mojih atrakcija",
    icon: "favorite",
    link: "/index",
    target: "_self",
    requiresAuth: true,
    hideOnAuth: false,
  },
  {
    title: "Unos atrakcija",
    caption: "unos novih atrakcija",
    icon: "swap_horizontal_circle",
    link: "unos",
    target: "_self",
    requiresAuth: true,
    hideOnAuth: false,
  },
];

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const userRole = ref("");
    const tokenExists = ref(false);

    function clearLocalStorage() {
      localStorage.clear();
      window.location.reload();
    }

    function getUserRole() {
      const token = localStorage.getItem('token');
      tokenExists.value = !!token;
      if (token) {
        try {
          const decoded = jwtDecode(token);
          userRole.value = decoded.uloga;
        } catch (error) {
          console.error('Error decoding token:', error);
          userRole.value = "Niste prijavljeni";
        }
      } else {
        userRole.value = "Niste prijavljeni";
      }
    }

    const filteredLinks = computed(() => {
      return linksList.filter(link => {
        if (link.requiresAuth && !tokenExists.value) return false;
        if (link.hideOnAuth && tokenExists.value) return false;
        return true;
      });
    });

    onMounted(getUserRole);

    return {
      essentialLinks: filteredLinks,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      clearLocalStorage,
      userRole,
      tokenExists,
    };
  },
});
</script>
