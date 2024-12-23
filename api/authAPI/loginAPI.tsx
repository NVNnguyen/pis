import API from "../index";
interface loginType {
  username: String;
  password: String;
}
// Đăng nhập
export const login = async (credentials: loginType) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
