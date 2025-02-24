export function base64Encode(input) {
    try {
      return btoa(input); 
    } catch (e) {
      console.error("Error during Base64 encoding", e);
      return null;
    }
  }
  
  export function base64Decode(encoded) {
    try {
      return atob(encoded); 
    } catch (e) {
      console.error("Error during Base64 decoding", e);
      return null;
    }
  }
  