import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
import {
  Color,
  fontWeight,
  textFontSize,
  textPostFontSize,
} from "../../../styles/stylePrimary";

const { width, height } = Dimensions.get("window");

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>Susan</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.icon}>
              <Ionicons
                name="people-outline"
                size={width * 0.06}
                color={Color}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Ionicons
                name="settings-outline"
                size={width * 0.06}
                color={Color}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>MI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Create</Text>
          </TouchableOpacity>
        </View>

        {/* Customize Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Customize</Text>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>App Premium</Text>
            <MaterialIcons
              name="shopping-cart"
              size={width * 0.06}
              color={Color}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Streak on</Text>
            <FontAwesome name="star" size={width * 0.06} color={Color} />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Edit Name</Text>
            <FontAwesome name="edit" size={width * 0.06} color={Color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Edit Birthday</Text>
            <FontAwesome
              name="birthday-cake"
              size={width * 0.06}
              color={Color}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Change Email Address</Text>
            <MaterialIcons name="email" size={width * 0.06} color={Color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Restore Purchases</Text>
            <Ionicons
              name="refresh-outline"
              size={width * 0.06}
              color={Color}
            />
          </TouchableOpacity>
        </View>

        {/* Privacy & Safety Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Privacy & Safety</Text>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Account Privacy</Text>
            <Feather name="lock" size={width * 0.06} color={Color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Review Requests</Text>
            <Ionicons
              name="document-text-outline"
              size={width * 0.06}
              color={Color}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Change Password & Security</Text>
            <Ionicons name="key-outline" size={width * 0.06} color={Color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Blocked Accounts</Text>
            <Ionicons name="ban-outline" size={width * 0.06} color={Color} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>About</Text>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Privacy Policy</Text>
            <MaterialIcons
              name="privacy-tip"
              size={width * 0.06}
              color={Color}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Terms of Service</Text>
            <Ionicons name="book-outline" size={width * 0.06} color={Color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Contact</Text>
            <Feather name="phone" size={width * 0.06} color={Color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Rate Us</Text>
            <FontAwesome name="star" size={width * 0.06} color={Color} />
          </TouchableOpacity>
        </View>

        {/* Delete Account Section */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.listItem, styles.deleteAccount]}>
            <Text style={[styles.listText, styles.deleteText]}>
              Delete Account
            </Text>
            <Ionicons name="trash-outline" size={width * 0.06} color={Color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Sign Out</Text>
            <Ionicons
              name="log-out-outline"
              size={width * 0.06}
              color={Color}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.04,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
  },
  profileName: {
    color: Color,
    fontSize: textFontSize,
    fontWeight: fontWeight,
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: width * 0.02,
  },
  sectionTitle: {
    fontSize: textFontSize,
    color: Color,
    fontWeight: fontWeight,
    textAlign: "center",
    marginVertical: height * 0.02,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: height * 0.02,
  },
  actionButton: {
    backgroundColor: "#333",
    paddingVertical: height * 0.02,
    borderRadius: width * 0.03,
    width: width * 0.4,
    alignItems: "center",
  },
  actionText: {
    fontSize: textFontSize,
    color: Color,
    fontWeight: fontWeight,
  },
  section: {
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  sectionHeader: {
    fontSize: textFontSize,
    color: Color,
    fontWeight: fontWeight,
    marginBottom: height * 0.01,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: height * 0.01,
  },
  listText: {
    color: Color,
    fontSize: textFontSize,
  },
  deleteAccount: {
    backgroundColor: "#b00020",
  },
  deleteText: {
    color: Color,
    fontWeight: fontWeight,
  },
});

export default SettingsScreen;
