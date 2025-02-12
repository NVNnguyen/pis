import { darkTheme, lightTheme } from "@/utils/themes";
import { useTheme } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const EnterOtpScreen = () => {
  const { dark: isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.container}>
      <Text>Enter OTP</Text>
      <View>
        <TextInput style={styles.input} />
        <TextInput style={styles.input} />
        <TextInput style={styles.input} />
        <TextInput style={styles.input} />
        <TextInput style={styles.input} />
        <TextInput style={styles.input} />
      </View>
    </View>
  );
};
const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    text: {},
    input: {
      borderWidth: 1,
      borderColor: "#A0A0A0",
    },
  });
export default EnterOtpScreen;
