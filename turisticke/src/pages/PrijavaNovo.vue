<template>
  <div class="registration-form">
      <h2 class="form-title">Prijava</h2> <!-- Dodajemo naslov forme -->
    <input type="text" v-model="korisnicko_ime" placeholder="korisnicko_ime" class="input-field">
    <input type="password" v-model="lozinka" placeholder="lozinka" class="input-field">
    <button @click="login" class="submit-btn">Prijava</button>
    <br>
  <router-link to="/registracijaputanja" class="submit-btn register-btn" style="text-decoration: none;">Registracija</router-link>
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
      lozinka: ''
    };
  },
   methods: {
    async login() {
      try {
        const response = await axios.post("http://localhost:4200/prijavi", {
          korisnicko_ime: this.korisnicko_ime,
          lozinka: this.lozinka,
        });

        if (response.data.success) {
          // Save the JWT token to local storage
          localStorage.setItem("token", response.data.token);

        } else {
          // Show error message if login fails
          this.$q.notify({
            color: "negative",
            position: "top",
            message: response.data.message,
            icon: "warning",
          });
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Prijava nije uspjela. Provjerite podatke i pokušajte ponovno.",
          icon: "warning",
        });
      }
    },
  },
};
</script>

<style scoped>
.registration-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #blue;
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