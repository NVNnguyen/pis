import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
} from "react-native";

interface FeatureItemProps {
  icon: string;
  text: string;
  description: string;
}

const PremiumScreen: React.FC = () => {
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

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  premiumText: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
  },
  featureContainer: {
    width: "100%",
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  icon: {
    fontSize: 24,
    color: "#fff",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  featureText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  featureDescription: {
    fontSize: 14,
    color: "#aaa",
  },
  upgradeButton: {
    width: width * 0.8,
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  upgradeText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  noThanksText: {
    fontSize: 16,
    color: "#aaa",
    textDecorationLine: "underline",
  },
});

export default PremiumScreen;
