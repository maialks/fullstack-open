import axios from 'axios';
const baseUrl = `${import.meta.env.VITE_BACKEND_URL || '/api'}/auth`;

const login = async (credentials) => {
  const res = await axios.post(baseUrl, credentials);
  return res.data;
};

const logout = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  await axios.delete(`${baseUrl}/logout`, config);
};

export default { login, logout };
