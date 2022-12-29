export const authHeader = () => {
  const localstorageUser = localStorage.getItem("user");
  if (!localstorageUser) {
    return {};
  }
  const user = JSON.parse(localstorageUser);
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
}