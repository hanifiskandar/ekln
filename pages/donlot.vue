<template>
  <div class="file-list">
    <h1>Files in MinIO Bucket</h1>
    <div v-if="files.length === 0">No files found.</div>
    <ul v-else>
      <li v-for="file in files" :key="file">
        <button @click="downloadFile(file)">{{ file }}</button>
      </li>
    </ul>
    <img v-if="fileUrl" :src="fileUrl" alt="MinIO File" />
    <div v-else>
      <p>Loading file...</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "landing",
})

import { ref, onMounted } from "vue";

const files = ref([]);
const fileUrl = ref(null);

// Fetch the list of files when the page is mounted
const fetchFiles = async () => {
  try {
    const response = await $fetch("/api/dms/list-files");
    console.log('list',response)
    files.value = response.files || [];
  } catch (error) {
    console.error("Error fetching files:", error);
  }
};

const donlotFile = async () => {
  try {
    const Url = '/api/dms/signed-url';
    console.log('URL', Url);
    const response = await useFetch(Url);
    console.log('Full response:', response);

    // Access the data correctly by using `.value`
    const data = response.data.value;  // Unwrap the reactive `data` object
    console.log('data url', data?.url);  // Log the URL if available

    if (data?.url) {
      fileUrl.value = data.url;  // Assign the URL to `fileUrl` if it exists
    } else {
      console.error('No URL in response');
    }
  } catch (error) {
    console.error('Error fetching signed URL:', error);
  }
}

// Function to handle file download
const downloadFile = async (filename) => {
  try {
    const fileUrl = `/api/dms/get/signed-url/internship/${filename}`;
    console.log("fileUrl", fileUrl);

    const response = await $fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Error fetching the file");
    }

    // Read the response as an array buffer (binary data)
    const buffer = await response.arrayBuffer();

    // Create a Blob from the binary data
    const blob = new Blob([buffer], { type: "application/octet-stream" });

    // Create an anchor tag to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

onMounted(async () => {
  
  fetchFiles();
  donlotFile()
});
</script>

<style scoped>
.file-list {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
