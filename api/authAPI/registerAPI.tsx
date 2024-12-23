import API from "..";

interface registerType {
  username: String;
  emailOrPhone: String;
  password: String;
  reEnterPassword: String;
}

export const register = async (userData: registerType) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register API error:", error);
    throw error;
  }
};
