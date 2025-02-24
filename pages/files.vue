<template>
  <div class="file-list">
    <h1>Files in MinIO Bucket</h1>
    <div v-if="files.length === 0">No files found.</div>
    <ul v-else>
      <li v-for="file in files" :key="file">
        <button @click="downloadFile(file)">{{ file }}</button>
      </li>
    </ul>
    <div id="content"></div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "landing",
});

import { ref, onMounted } from "vue";

const files = ref([]);

const fetchFiles = async () => {
  try {
    const response = await $fetch("/api/dms/list-files");
    files.value = response.files || [];
  } catch (error) {
    console.error("Error fetching files:", error);
  }
};

const downloadFile = async (filename) => {
  try {
    const encodedFilename = encodeURIComponent(filename);
    const fileUrl = `/api/dms/get/${encodedFilename}`;
    console.log("fileUrl", fileUrl);

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Error fetching the file");
    }

    const buffer = await response.arrayBuffer();

    const blob = new Blob([buffer], {
      type: response.headers.get("Content-Type"),
    });

    const blobUrl = URL.createObjectURL(blob);

    const fileExtension = filename.split(".").pop().toLowerCase();
    const fileType = response.headers.get("Content-Type");

    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (fileType && fileType.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = blobUrl;
      img.style.maxWidth = "100%"; 
      img.style.maxHeight = "100%"; 
      contentDiv.appendChild(img); 
    } else if (fileType === "application/pdf") {
      const iframe = document.createElement("iframe");
      iframe.src = blobUrl;
      iframe.style.width = "100%";
      iframe.style.height = "600px"; 
      contentDiv.appendChild(iframe); 
    } else if (fileType && fileType.startsWith("video/")) {
      const video = document.createElement("video");
      video.src = blobUrl;
      video.controls = true; 
      video.style.maxWidth = "100%"; 
      contentDiv.appendChild(video);
    } else {
      console.error("Unsupported file type for preview");
      const message = document.createElement("p");
      message.textContent = "Unsupported file type for preview.";
      contentDiv.appendChild(message);
    }

    // const fileUrl = `/api/dms/get/${filename}`;
    // console.log("fileUrl", fileUrl);

    // const response = await fetch(fileUrl);
    // if (!response.ok) {
    //   throw new Error("Error fetching the file");
    // }

    // // Read the response as an array buffer (binary data)
    // const buffer = await response.arrayBuffer();

    // // Create a Blob from the binary data
    // const blob = new Blob([buffer], { type: "application/octet-stream" });

    // // Create an anchor tag to trigger the download
    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(blob);
    // link.download = filename;
    // link.click();
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

onMounted(() => {
  fetchFiles();
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
