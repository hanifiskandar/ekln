<template>
  <div class="upload-container">
    <h1>Upload a File</h1>
    
    <!-- Form to upload file -->
    <form @submit.prevent="handleUpload">
      <input type="file" ref="fileInput" @change="handleFileChange" />
      <button type="submit" :disabled="!file">Upload</button>
    </form>

    <!-- Display messages -->
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "landing",
});

import { ref } from 'vue';

const fileInput = ref(null);
const file = ref(null); 
const message = ref(''); 

const handleFileChange = () => {
  const input = fileInput.value; 
  if (input && input.files.length > 0) {
    file.value = input.files[0];
  }
};

const handleUpload = async () => {
  const formData = new FormData();
  formData.append('file', file.value); 

  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

  try {
    const response = await $fetch('/api/dms/upload', {
      method: 'POST',
      body: formData, 
    });

    message.value = response.message || 'File uploaded successfully!';
  } catch (error) {
    console.error('Error uploading file:', error);
    message.value = 'Error uploading file. Please try again.';
  }
};
</script>

<style scoped>
.upload-container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

input[type="file"] {
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.message {
  margin-top: 20px;
  color: green;
}
</style>
