// Utility functions for managing "My List" in localStorage

const MY_LIST_KEY = 'metflix_my_list';

// Get all items from My List
export const getMyList = () => {
  try {
    const myList = localStorage.getItem(MY_LIST_KEY);
    return myList ? JSON.parse(myList) : [];
  } catch (error) {
    console.error('Error getting My List:', error);
    return [];
  }
};

// Add item to My List
export const addToMyList = (movie) => {
  try {
    const myList = getMyList();
    
    // Check if movie is already in the list
    const isAlreadyAdded = myList.some(item => item.id === movie.id);
    if (isAlreadyAdded) {
      return false; // Already in list
    }
    
    // Add movie to list
    const updatedList = [...myList, movie];
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(updatedList));
    return true; // Successfully added
  } catch (error) {
    console.error('Error adding to My List:', error);
    return false;
  }
};

// Remove item from My List
export const removeFromMyList = (movieId) => {
  try {
    const myList = getMyList();
    const updatedList = myList.filter(item => item.id !== movieId);
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(updatedList));
    return true;
  } catch (error) {
    console.error('Error removing from My List:', error);
    return false;
  }
};

// Check if item is in My List
export const isInMyList = (movieId) => {
  try {
    const myList = getMyList();
    return myList.some(item => item.id === movieId);
  } catch (error) {
    console.error('Error checking My List:', error);
    return false;
  }
};

// Clear My List
export const clearMyList = () => {
  try {
    localStorage.removeItem(MY_LIST_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing My List:', error);
    return false;
  }
};