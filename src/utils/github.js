/**
 * Utility for interacting with the GitHub API
 */

const GITHUB_API_URL = "https://api.github.com";

const getHeaders = (pat) => ({
  "Authorization": `Bearer ${pat}`,
  "Accept": "application/vnd.github.v3+json",
  "Content-Type": "application/json",
});

/**
 * Fetch a file from the repository
 */
export const fetchFileContent = async (pat, owner, repo, path) => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`, {
      method: 'GET',
      headers: getHeaders(pat)
    });
    
    if (!response.ok) {
      if (response.status === 404) return null; // File doesn't exist
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Decode base64 content
    // Note: atob doesn't handle UTF-8 properly, so we use a more robust decoding method
    const base64 = data.content.replace(/\n/g, "");
    const binString = atob(base64);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    const textDecoder = new TextDecoder('utf-8');
    const content = textDecoder.decode(bytes);
    
    return {
      content,
      sha: data.sha
    };
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};

/**
 * Encode string to base64 with proper UTF-8 support
 */
const encodeBase64 = (str) => {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) =>
    String.fromCharCode(byte)
  ).join("");
  return btoa(binString);
};

/**
 * Update or create a file in the repository
 */
export const updateFileContent = async (pat, owner, repo, path, content, sha, message, isBase64 = false) => {
  try {
    const base64Content = isBase64 ? content : encodeBase64(content);
    
    const body = {
      message,
      content: base64Content,
    };
    
    // Include sha if updating an existing file
    if (sha) {
      body.sha = sha;
    }
    
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: getHeaders(pat),
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
};

/**
 * Upload an image file to the repository
 */
export const uploadImage = async (pat, owner, repo, file, path) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        // Get base64 string without the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Content = reader.result.split(',')[1];
        
        // First check if file already exists to get its SHA
        let sha = null;
        try {
          const existingFile = await fetchFileContent(pat, owner, repo, path);
          if (existingFile) {
            sha = existingFile.sha;
          }
        } catch {
          // File might not exist, which is fine
        }
        
        const result = await updateFileContent(
          pat, 
          owner, 
          repo, 
          path, 
          base64Content, 
          sha, 
          `Upload image: ${path}`,
          true // isBase64
        );
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    
    reader.readAsDataURL(file);
  });
};
