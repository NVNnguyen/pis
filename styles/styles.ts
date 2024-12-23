import { StyleSheet, Dimensions } from "react-native";
import { backgroundColor, Color, fontWeight } from "./color";


const { width, height } = Dimensions.get("window");
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    padding: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.08, // Dynamic font size
    color: Color,
    marginBottom: height * 0.02,
    fontWeight: fontWeight,
  },
  label: {
    color: Color,
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    marginBottom: height * 0.01,
    fontSize: width * 0.045,
  },
  input: {
    backgroundColor: "#2C2C2E",
    width: "100%",
    height: height * 0.065,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: Color,
    marginBottom: height * 0.02,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    width: "100%",
    height: height * 0.065,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: height * 0.02,
  },
  inputPassword: {
    flex: 1,
    color: Color,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  checkboxText: {
    color: Color,
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
  },
  button: {
    backgroundColor: "#000",
    width: "100%",
    height: height * 0.065,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: Color,
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#9E9E9E",
    marginBottom: height * 0.03,
    fontSize: width * 0.04,
    textDecorationLine: "underline",
  },
  signInWith: {
    color: "#9E9E9E",
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: height * 0.02,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    padding: width * 0.03,
    paddingHorizontal: width * 0.07,
  },
  socialText: {
    color: Color,
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
  },
  registerText: {
    color: Color,
    fontSize: width * 0.04,
    textDecorationLine: "underline",
  },
});