<template>
  <div>
    <input type="email" v-model="email" placeholder="Email">
    <input type="password" v-model="password" placeholder="Password">
    <button @click="register">Register</button>
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
    register() {
      axios.post('http://localhost:4200/register', {
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
