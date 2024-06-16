<template>
  <div class="registration-form">
    <h2 class="form-title">Registracija</h2>
    <input type="text" v-model="korisnicko_ime" placeholder="Korisnicko ime" class="input-field">
    <input type="password" v-model="lozinka" placeholder="Lozinka" class="input-field">
    <input type="password" v-model="potvrda_lozinke" placeholder="Potvrdite lozinku" class="input-field">
    <button @click="register" class="submit-btn">Registriraj se</button>
    <br>
    <router-link to="/" class="submit-btn register-btn" style="text-decoration: none;">Odustani</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      korisnicko_ime: '',
      lozinka: '',
      potvrda_lozinke: ''
    };
  },
  methods: {
    register() {
      if (this.lozinka !== this.potvrda_lozinke) {
        alert('Lozinke se ne podudaraju!');
        return;
      }

      axios.post('http://localhost:4200/register', {
        korisnicko_ime: this.korisnicko_ime,
        lozinka: this.lozinka
      })
        .then(response => {
          alert(response.data.message);
          this.$router.push('/auth');
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
}
</script>

<style scoped>
.registration-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #ffffff;
}

.input-field {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>