import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  Animated,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import { backgroundColor, Color } from "@/styles/stylePrimary";
import PublicOrPrivate from "@/components/genaral/PublicOrPrivate";
import { getMyUserId } from "@/hooks/getMyUserID";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackType } from "@/utils/types/MainStackType";
import CapTure from "@/components/private/Capture";

const { width, height } = Dimensions.get("window");

const PrivateModeScreen = () => {
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const myUserId = getMyUserId() ?? 0;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showAlternate, setShowAlternate] = useState(false);
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Show alternate screen when scrolled past a threshold
        if (offsetY > height * 0.3) {
          setShowAlternate(true);
        } else {
          setShowAlternate(false);
        }
      },
    }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile", { userId: myUserId })}
        >
          <FontAwesome name="user-circle-o" size={24} color="#fff" />
        </TouchableOpacity>
        <PublicOrPrivate />
        <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
          <MaterialCommunityIcons
            name="chat"
            size={height * 0.03}
            color={"#fff"}
          />
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        onScroll={handleScroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Show either the Capture component or the AlternateScreen based on scroll position */}
        <View style={{ height: height * 0.9 }}>
          {!showAlternate && <CapTure />}
        </View>

        {/* This is an invisible view that allows scrolling to trigger the screen change */}
        <View style={{ height: height * 0.5 }} />
      </Animated.ScrollView>

      {/* Scroll indicator */}
      {!showAlternate && (
        <View style={styles.scrollIndicator}>
          <Text style={styles.scrollText}>Scroll down for more</Text>
          <FontAwesome name="angle-down" size={20} color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.04,
  },
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  scrollContainer: {
    minHeight: height * 1.5,
  },
  scrollIndicator: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    opacity: 0.7,
  },
  scrollText: {
    color: "#fff",
    marginBottom: 5,
  },
  // Alternate screen styles
  alternateScreen: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: backgroundColor,
  },
  alternateTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: height * 0.03,
    textAlign: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: height * 0.04,
  },
  featureButton: {
    alignItems: "center",
    padding: width * 0.03,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    width: width * 0.25,
  },
  featureText: {
    color: "#fff",
    marginTop: 8,
  },
  recentActivityContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: width * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: height * 0.02,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    paddingBottom: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  activityIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.03,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: "#fff",
    fontSize: width * 0.035,
  },
  activityTime: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: width * 0.03,
    marginTop: 4,
  },
});

export default PrivateModeScreen;
