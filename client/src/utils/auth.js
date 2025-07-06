export const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload.userId; // this needs to be adjusted based on our backend token structure
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};
