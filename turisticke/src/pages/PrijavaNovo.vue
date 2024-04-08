<template>
  <div class="registration-form">
      <h2 class="form-title">Prijava</h2> <!-- Dodajemo naslov forme -->
    <input type="email" v-model="email" placeholder="Email" class="input-field">
    <input type="password" v-model="password" placeholder="Password" class="input-field">
    <button @click="prijava" class="submit-btn">Prijava</button>
    <br>
        <router-link to="/registracijaputanja" class="submit-btn register-btn">Registracija</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    prijava() {
      axios.post('http://localhost:4200/login', {
        email: this.email,
        password: this.password
      })
      .then(response => {
        alert(response.data.message);
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
