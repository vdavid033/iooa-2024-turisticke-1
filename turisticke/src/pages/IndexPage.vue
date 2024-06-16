<template>
  <div style="background-color: #229df9">
    <div class="q-pa-md">
        <div class="row justify-center">
          <q-btn label="Sortiraj uzlazno" @click="sortPostsAsc" color="green" class="q-mr-sm" />
          <q-btn label="Sortiraj silazno" @click="sortPostsDesc" color="orange" />
        </div>
      </div>
    <div class="q-pa-md row items-start q-gutter-md">
     

      <!-- Kartice atrakcija -->
      <q-card v-for="post in posts" :key="post.id" class="my-card">
        <q-img :src="post.slika" />

        <q-card-section>
          <q-btn fab color="primary" icon="place" class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)" :to="'/one_atraction/' + post.id_atrakcije" />

          <q-btn fab color="red" icon="delete" class="absolute" style="top: 0px; left: 12px; transform: translateY(-50%)"
            @click="deleteById(post.id_atrakcije)" />

          <div class="myDiv" style="padding: 10px"></div>

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ post.naziv }}</div>
          </div>

          <q-rating v-model="post.prosjecna_ocjena" :max="5" :readonly="true" size="32px" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">{{ post.adresa }}</div>
          <div class="text-caption text-grey">
            {{ post.opis }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { jwtDecode } from "jwt-decode"; // Assume this library is already installed

export default {
  setup() {
    const posts = ref([]);

    const getPosts = async () => {
      try {
        // Retrieve the JWT token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found. Please log in.');
          return;
        }

        // Decode the token to get the user ID
        const decodedToken = jwtDecode(token);
        const id_korisnika = decodedToken.id; // Adjust the field name based on your token structure

        if (!id_korisnika) {
          console.error('User ID missing in the token.');
          return;
        }

        // Create query parameters to send with the request
        const params = new URLSearchParams({ id_korisnika });

        // Make a GET request to the backend to fetch posts, with the user ID in the query string
        const response = await api.get(`atrakcije?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Process the fetched data (e.g., update your state or store)
        posts.value = response.data;

      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };    

    const sortPostsAsc = () => {
      posts.value.sort((a, b) => a.prosjecna_ocjena - b.prosjecna_ocjena);
    };

    const sortPostsDesc = () => {
      posts.value.sort((a, b) => b.prosjecna_ocjena - a.prosjecna_ocjena);
    };


    const deleteById = async (id_atrakcije) => {
      try {
        const confirmation = window.confirm("Jeste li sigurni da želite izbrisati atrakciju?");
        if (!confirmation) {
          return; // If the user cancels, do nothing
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found. Please log in.");
          return;
        }

        // Decode the JWT token to get user details
        const decodedToken = jwtDecode(token);
        const id_korisnika = decodedToken.id;
        const uloga = decodedToken.uloga;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            id_korisnika, // Pass the user ID to the backend
            uloga
          }
        };

        const response = await api.delete(`http://localhost:4200/obrisi_atrakcije/${id_atrakcije}`, config);
        getPosts(); // Refresh the attraction list after deletion
        window.alert("Atrakcija je izbrisana."); // Display success message
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    };


    onMounted(getPosts);

    return { posts, sortPostsAsc, sortPostsDesc, deleteById };
  },
};
</script>

<style>
.bg-blue {
  background-color: #1e90ff;
  color: white;
}

.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
