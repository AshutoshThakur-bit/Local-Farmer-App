// Image URL helper
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://via.placeholder.com/300x200?text=No+Image";
  }
  
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  return `http://localhost:5000${imagePath}`;
};
