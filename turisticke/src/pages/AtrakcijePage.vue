<template>
  <div style="background-color: #229df9">
    <div v-for="post in posts" :key="post.id" class="row q-pa-md">

      <div q-card>

        <q-img :src="post.slika" width="800px" height="600px" position="absolute" top="50%" left="50%"
          transform="translate(-50%, -50%)">
          <div class="absolute-bottom text-subtitle1 text-center">
            <div style="text-transform:uppercase; font-size:50px;">
              {{ post.naziv }}
              <q-icon name="edit" v-if="canEdit(post.id_korisnika)" @click="showEditDialog('naziv', post)" style="cursor: pointer; float: right;"></q-icon>
            </div>
          </div>
        </q-img>
      </div>

      <div class="q-pa-md">
        <div class="q-pa-md items-start q-gutter-xs" style="background-color: black; color: white;">
          <p style="font-size: 20px;">Opis:
            <q-icon name="edit" v-if="canEdit(post.id_korisnika)" @click="showEditDialog('opis', post)" style="cursor: pointer; float: right;"></q-icon>
          </p>

          <div class="post-text">{{ post.opis }}</div>
          <q-separator color="white" />
          <p style="font-size: 20px;">Adresa:
            <q-icon name="edit" v-if="canEdit(post.id_korisnika)" @click="showEditDialog('adresa', post)" style="cursor: pointer; float: right;"></q-icon>
          </p>

          <h7>{{ post.adresa }}</h7>
          <q-separator color="white" />
          <p style="font-size: 20px;">Ocjena:</p>
          <q-rating @click="dodajOcjenu(post.id_atrakcije, post.prosjecna_ocjena)" v-model="post.prosjecna_ocjena"
            :max="5" :readonly="true" size="32px" />

          <q-btn round color="black" icon="delete" style="right: -12px" v-if="canEdit(post.id_korisnika)" @click="deleteOcjena(post.id_atrakcije)" />

          <div class="q-pa-md">
            <q-btn-dropdown color="primary" v-if="canEdit(post.id_korisnika)" label="Promijeni ocjenu">
              <q-list>
                <q-item clickable v-close-popup @click="dodajOcjenu(1, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>1</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="dodajOcjenu(2, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>2</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="dodajOcjenu(3, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>3</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="dodajOcjenu(4, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>4</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="dodajOcjenu(5, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>5</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>

          <q-btn @click="showEditImageDialog(post)" v-if="canEdit(post.id_korisnika)" label="Promijeni sliku" color="primary" style="margin-left: 40px;" />

          <q-separator color="white" />

          <div class="" style="max-width: 400px"></div>

          <p style="font-size: 20px;">Geografska dužina:</p>
          <p style="font-size: 15px;">{{ post.geografska_sirina }}</p>
          <q-separator color="white" />
          <p style="font-size: 20px;">Geografska širina:</p>
          <p style="font-size: 15px;">{{ post.geografska_duzina }}</p>
        </div>
      </div>
    </div>

    
    <div id="mapid" style="height: 500px; margin: 20px;"></div>

    <q-card-section>
      <q-btn class="button" @click="$router.push('/')" label="Natrag na početnu" />
    </q-card-section>
    <q-card-section>
      <q-btn class="button" :to="'/komentari/' + trenutniID" label="Dodaj komentar" v-if="hasToken" />
    </q-card-section>

    <q-separator />

    <div class="q-pa-md row items-start q-gutter-xs">
      <p style="font-size: 25px; color: white">Komentari:</p>
    </div>
    <div class="q-pa-md row items-start q-gutter-xs">
      <p style="font-size: 20px; color: white">Ovdje možete pogledati komentare o atrakciji</p>
    </div>
    
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card v-for="item in comments" :key="item" class="my-card" flat bordered>
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ item.vk_id_korisnika }}
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section horizontal>
          <q-card-section>
            {{ item.Komentar }}
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>

    
    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ editField === 'naziv' ? 'Uredi naziv' : editField === 'opis' ? 'Uredi opis' : 'Uredi adresu' }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="editValue" label="Tekst:" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn flat label="Spremi" @click="saveEdit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    
    <q-dialog v-model="showImageDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Promijeni sliku</div>
        </q-card-section>
        <q-card-section>
          <input type="file" @change="onFileChange" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn flat label="Spremi" @click="saveImage" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { api } from 'boot/axios'
import { useRoute, useRouter } from 'vue-router';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 
import { jwtDecode } from "jwt-decode"; 

const posts = ref([])
const token = localStorage.getItem('token');
let loggedInUserId = 0; 



if (token) {
  const decoded = jwtDecode(token);
  loggedInUserId = decoded.id; 
}
// Adjust this according to your token structure

// Computed property to check if the user can edit
const canEdit = (postCreatorId) => {
  return loggedInUserId === postCreatorId;
};

const comments = ref([])
const route = useRoute()
const router = useRouter()

const showDialog = ref(false)
const showImageDialog = ref(false)
const editField = ref('')
const editValue = ref('')
const currentPost = ref(null)
const newImage = ref(null)

const trenutniID = route.params.id

const hasToken = computed(() => {
  return localStorage.getItem('token') !== null;
});

const getPosts = async () => {
  try {
    const response = await api.get(`/natrakcije/${trenutniID}`);
    posts.value = response.data ? [response.data] : []; 
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
};




const dodajOcjenu = async (ocjena, id) => {
  try {
    console.log('Kliknuli ste na: ', ocjena, " ocjenu");
    console.log("ID: ", id);

    
    const token = localStorage.getItem('token');

    
    const decoded = jwtDecode(token);
    const userId = decoded.id;  

    
    console.log("User ID extracted from token:", userId);

   


    const response = await api.put(`http://localhost:4200/dodajOcjenu/${id}`, {
      prosjecna_ocjena: ocjena,
      id_korisnika: userId  
    }, {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    });

    if (response.status === 403) {
      alert('Unauthorized: You are not authorized to update this rating.');
    } else {
      console.log(response.data);
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
    } else {
      console.log(error);
    }
  }
  getPosts();
}

const deleteOcjena = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    console.log("User ID extracted from token:", userId);

    const response = await api.delete(`http://localhost:4200/obrisi_ocjenu_atrakcije/${id}/${userId}`);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
  getPosts();
}

const showEditDialog = (field, post) => {
  editField.value = field
  currentPost.value = post
  editValue.value = post[field]
  showDialog.value = true
}

const showEditImageDialog = (post) => {
  currentPost.value = post
  showImageDialog.value = true
}

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      newImage.value = reader.result; 
    };
    reader.readAsDataURL(file); 
  }
};



const saveEdit = async () => {
  if (currentPost.value) {
    try {
      const updateData = { [editField.value]: editValue.value }
      const response = await api.put(`http://localhost:4200/updatePost/${currentPost.value.id_atrakcije}`, updateData);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
    getPosts();
  }
}

const saveImage = async () => {
  if (currentPost.value && newImage.value) {
    try {
      const response = await api.put(`http://localhost:4200/updateImage/${currentPost.value.id_atrakcije}`, {
        slika: newImage.value 
      });
      console.log(response.data);
    } catch (error) {
      console.error("Failed to update image:", error);
    }
    getPosts();
  }
};



onMounted(async () => {
  await getPosts();
  await getComments();
  initMap();
});

const getComments = async () => {
  try {
    const response = await api.get(`/komentari/${trenutniID}`);
    comments.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
  }
};


const initMap = () => {
  const map = L.map('mapid').setView([45.9258, 16.0400], 3); 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const icon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/0/619.png',
    iconSize: [15, 30],
    iconAnchor: [9, 30],
    popupAnchor: [-3, -76]
  });

  
  if (posts.value.length > 0) {
    const post = posts.value[0];
    const lat = post.geografska_sirina;
    const lng = post.geografska_duzina;
    const marker = L.marker([lat, lng], { icon }).addTo(map);

    
    map.setView([lat, lng], 13); 
  }

  
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    
  });
}
</script>

<style scoped></style>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 800px
</style>

<style>
.post-text {
  max-width: 620px;
  word-wrap: break-word;
}



.button {
  background-color: black;
  color: white;
}

.button:hover {
  background-color: white;
  color: black;
}

#mapid {
  height: 300px;
}
</style>