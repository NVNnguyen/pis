import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
} from "react-native";
import { Color } from "../../../styles/stylePrimary";

interface FeatureItemProps {
  icon: string;
  text: string;
  description: string;
}

const PremiumScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>So much fun!</Text>
      <Text style={styles.premiumText}>Premium</Text>

      <View style={styles.featureContainer}>
        <FeatureItem
          icon="🚫"
          text="No more ads!"
          description="Never see ads in History!"
        />
        <FeatureItem
          icon="📈"
          text="Vbooster"
          description="Boosting your views!"
        />
        <FeatureItem
          icon="🖼️"
          text="Upload from your album"
          description="Share memories from your library"
        />
        <FeatureItem
          icon="🎤"
          text="Send longer voice records"
          description="More voicetime, more understanding."
        />
      </View>

      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={handleUpgradePress}
      >
        <Text style={styles.upgradeText}>Upgrade To Premium</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNoThanksPress}>
        <Text style={styles.noThanksText}>No Thanks!</Text>
      </TouchableOpacity>
    </View>
  );
};

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  text,
  description,
}) => (
  <View style={styles.featureItem}>
    <Text style={styles.icon}>{icon}</Text>
    <View style={styles.textContainer}>
      <Text style={styles.featureText}>{text}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const handleUpgradePress = (event?: GestureResponderEvent): void => {
  console.log("Upgrade button pressed!");
};

const handleNoThanksPress = (event?: GestureResponderEvent): void => {
  console.log("No Thanks button pressed!");
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
  },
  header: {
    fontSize: width * 0.06,
    color: Color,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  premiumText: {
    fontSize: width * 0.09,
    color: Color,
    fontWeight: "bold",
    marginBottom: height * 0.03,
  },
  featureContainer: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    padding: width * 0.04,
    marginVertical: height * 0.01,
    borderRadius: width * 0.03,
  },
  icon: {
    fontSize: width * 0.07,
    color: Color,
    marginRight: width * 0.04,
  },
  textContainer: {
    flex: 1,
  },
  featureText: {
    fontSize: width * 0.045,
    color: Color,
    fontWeight: "bold",
  },
  featureDescription: {
    fontSize: width * 0.035,
    color: "#aaa",
  },
  upgradeButton: {
    width: "80%",
    paddingVertical: height * 0.02,
    backgroundColor: "#333",
    borderRadius: width * 0.03,
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  upgradeText: {
    fontSize: width * 0.045,
    color: Color,
    fontWeight: "bold",
  },
  noThanksText: {
    fontSize: width * 0.045,
    color: "#aaa",
    textDecorationLine: "underline",
  },
});

export default PremiumScreen;
