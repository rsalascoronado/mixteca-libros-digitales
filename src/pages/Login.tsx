
// Check if email is admin
useEffect(() => {
  setIsAdmin(email.toLowerCase() === 'admin@mixteco.utm.mx'); // Removed reference to adminadmin
}, [email]);
