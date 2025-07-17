import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../configs/firebaseConfig";

const uploadFile = async (file) => {
  console.log(file);
  const storageRef = ref(storage, file.name);
  const response = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(response.ref);
  return downloadURL;
};

/**
 * Upload avatar to Firebase Storage
 * @param {Object} imageAsset - Image asset from expo-image-picker
 * @param {string} userId - User ID for organizing files
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadAvatarToFirebase = async (imageAsset, userId) => {
  try {
    // Convert image to blob
    const response = await fetch(imageAsset.uri);
    const blob = await response.blob();
    
    // Create file name with timestamp to avoid conflicts
    const timestamp = Date.now();
    const fileExtension = imageAsset.type?.split('/')[1] || 'jpg';
    const fileName = `avatar_${userId}_${timestamp}.${fileExtension}`;
    
    // Create reference to Firebase Storage
    const storageRef = ref(storage, `avatars/${fileName}`);
    
    // Upload file
    console.log('Uploading avatar to Firebase...');
    const snapshot = await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Avatar uploaded successfully:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar to Firebase:', error);
    throw new Error('Không thể upload avatar');
  }
};

/**
 * Delete avatar from Firebase Storage
 * @param {string} avatarUrl - Full download URL of the avatar
 * @returns {Promise<void>}
 */
export const deleteAvatarFromFirebase = async (avatarUrl) => {
  try {
    if (!avatarUrl || !avatarUrl.includes('firebase')) {
      return; // Not a Firebase URL, skip deletion
    }
    
    // Extract file path from download URL
    const url = new URL(avatarUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (pathMatch && pathMatch[1]) {
      const filePath = decodeURIComponent(pathMatch[1]);
      const fileRef = ref(storage, filePath);
      
      await deleteObject(fileRef);
      console.log('Old avatar deleted successfully');
    }
  } catch (error) {
    console.error('Error deleting old avatar:', error);
    // Don't throw error here, deletion failure shouldn't block new upload
  }
};

export default uploadFile;