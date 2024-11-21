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

const SettingsScreen: React.FC = () => {
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
              <Ionicons name="people-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
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
            <MaterialIcons name="shopping-cart" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Streak on</Text>
            <FontAwesome name="star" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Edit Name</Text>
            <FontAwesome name="edit" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Edit Birthday</Text>
            <FontAwesome name="birthday-cake" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Change Email Address</Text>
            <MaterialIcons name="email" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Restore Purchases</Text>
            <Ionicons name="refresh-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Privacy & Safety Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Privacy & Safety</Text>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Account Privacy</Text>
            <Feather name="lock" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Review Requests</Text>
            <Ionicons name="document-text-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Change Password & Security</Text>
            <Ionicons name="key-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Blocked Accounts</Text>
            <Ionicons name="ban-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>About</Text>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Privacy Policy</Text>
            <MaterialIcons name="privacy-tip" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Terms of Service</Text>
            <Ionicons name="book-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Contact</Text>
            <Feather name="phone" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Rate Us</Text>
            <FontAwesome name="star" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Delete Account Section */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.listItem, styles.deleteAccount]}>
            <Text style={[styles.listText, styles.deleteText]}>
              Delete Account
            </Text>
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listText}>Sign Out</Text>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 35,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    width: width * 0.4,
    alignItems: "center",
  },
  actionText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  listText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteAccount: {
    backgroundColor: "#b00020",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SettingsScreen;
