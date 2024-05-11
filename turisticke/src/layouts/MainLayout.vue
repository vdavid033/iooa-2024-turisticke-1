<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="text-h6"><b>Turističke atrakcije</b></div>
        </q-toolbar-title>
  <q-toolbar-title>
              <div class="text-h6"><b> Prijavljeni ste kao: </b>{{ userRole }}</div>

          </q-toolbar-title>
        <div>Bad Developers</div>

        <q-btn flat icon="logout" label="ODJAVA" @click="clearLocalStorage" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Izbornik </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { jwtDecode }  from 'jwt-decode'; // Uvoz jwt-decode biblioteke

const linksList = [
  {
    title: "Prijava",
    icon: "login",
    link: "auth",
    target: "_self",
  },
  {
    title: "Sve atrakcije",
    caption: "popis svih atrakcija",
    icon: "favorite",
    link: "/",
    target: "_self",
  },
  {
    title: "Moje atrakcije",
    caption: "popis mojih atrakcija",
    icon: "favorite",
    link: "/index",
    target: "_self",
  },
  {
    title: "Unos atrakcija",
    caption: "unos novih atrakcija",
    icon: "swap_horizontal_circle",
    link: "unos",
    target: "_self",
  },
  {
    title: "Testiranje Axiosa",
    caption: "služi za testiranje Axiosa",
    icon: "swap_horizontal_circle",
    link: "axo",
    target: "_self",
  },
];

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },



  setup() {
    const leftDrawerOpen = ref(false);
    const userRole = ref(""); // Ref za pohranu korisničke uloge

    function clearLocalStorage() {
      localStorage.clear();
      window.location.reload();

      console.log("Local storage is cleared."); // Opcionalno: Poruka u konzoli
    }

    function getUserRole() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole.value = decoded.uloga; // Postavi korisničku ulogu
    } catch (error) {
      console.error('Error decoding token:', error);
      userRole.value = "Niste prijavljeni"; // Ako dođe do greške prilikom dekodiranja tokena
    }
  } else {
    userRole.value = "Niste prijavljeni"; // Ako token ne postoji
  }
}


    // Osvježi korisničku ulogu prilikom inicijalizacije komponente
    onMounted(getUserRole);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      clearLocalStorage,
      userRole, // Dostupno u templateu
    };
  },
});
</script>
