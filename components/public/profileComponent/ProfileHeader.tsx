import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import ModelUnFollow from "../ModelUnFollow";
import { fontWeight } from "@/styles/color";
import { formatNumber } from "@/utils/formatNmber";

const { width, height } = Dimensions.get("window");

const ProfileHeader = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const [profile, setProfile] = useState({
    name: "Lê Trung Thành",
    id: "erikthanh_",
    bio: "booking@officialerik.com",
    followers: 302000,
    youtube: "youtube/viF5dsRX5kE",
    avatar: "",
    isFollowing: true,
    isVerified: false,
    isMyProfile: false,
  });

  const handleFollowStatus = () => {
    if (profile.isFollowing) {
      setIsModalVisible(true); // Hiển thị modal nếu đang "Following"
    } else {
      setProfile((prevProfile) => ({
        ...prevProfile,
        isFollowing: !profile.isFollowing, // Thay đổi trạng thái thành "Following"
      }));
    }
  };

  const toggleFollow = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      isFollowing: false, // Chuyển trạng thái thành "Unfollow"
    }));
    setIsModalVisible(false); // Đóng modal
  };
  const getColor = (
    isFollowing: boolean,
    isDarkMode: boolean,
    type: "text" | "background"
  ) => {
    if (isFollowing) {
      return isDarkMode
        ? type === "text"
          ? darkTheme.text
          : darkTheme.background
        : type === "text"
        ? lightTheme.text
        : lightTheme.background;
    } else {
      return isDarkMode
        ? type === "text"
          ? lightTheme.text
          : lightTheme.background
        : type === "text"
        ? darkTheme.text
        : darkTheme.background;
    }
  };

  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.idName}>{profile.id}</Text>
        </View>
        {/* Avatar */}
        {profile.avatar.length > 0 && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatarImg}
              />
            </View>

            {profile.isVerified && (
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" style={styles.verifiedText} />
              </View>
            )}
          </View>
        )}
        {profile.avatar.length == 0 && profile.isMyProfile && (
          <View style={styles.avatarIconContainer}>
            <TouchableOpacity style={styles.avatarIcon}>
              <AntDesign
                name="adduser"
                size={height * 0.04}
                color={
                  isDarkMode ? lightTheme.background : darkTheme.background
                }
              />
            </TouchableOpacity>
          </View>
        )}
        {profile.avatar.length == 0 && !profile.isMyProfile && (
          <View style={styles.noAvatarContainer}>
            <TouchableOpacity style={styles.avatarIcon}>
              <FontAwesome6
                style={styles.noAvatar}
                name="user-large"
                size={height * 0.05}
                color="#757575"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Contact Details */}
      {profile.bio.length > 0 && (
        <View style={styles.bio}>
          <Text style={styles.bioContent}>{profile.bio}</Text>
        </View>
      )}

      {/* Followers and Link */}
      <View style={styles.followersSection}>
        <TouchableOpacity>
          <Text style={styles.followers}>
            {formatNumber(profile.followers)} followers
          </Text>
        </TouchableOpacity>
      </View>
      {/* Action Buttons */}
      {profile.isMyProfile && (
        <View style={styles.myProfile}>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareProfileButton}>
            <Text style={styles.shareProfileButtonText}>Share profile</Text>
          </TouchableOpacity>
        </View>
      )}
      {!profile.isMyProfile && (
        <View
          style={[
            styles.followingSectionButton,
            {
              backgroundColor: getColor(
                profile.isFollowing,
                isDarkMode,
                "background"
              ),
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleFollowStatus}
            style={[styles.followingButton]}
          >
            <Text
              style={[
                styles.followingButtonText,
                {
                  color: getColor(profile.isFollowing, isDarkMode, "text"),
                },
              ]}
            >
              {profile.isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
          {/* ModelUnFollow */}
        </View>
      )}
      <ModelUnFollow
        selectedUser={{
          id: profile.id,
          username: profile.name,
          avatar: profile.avatar,
        }}
        handleModelVisible={() => setIsModalVisible(false)} // Đóng modal
        modalVisible={isModalVisible}
        toggleFollow={toggleFollow} // Thay đổi trạng thái following
      />
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingTop: height * 0.08,
      paddingHorizontal: width * 0.02, // Responsive padding
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: height * 0.07, // Fixed height for the header
    },
    profileInfo: {
      flex: 1,
      marginRight: 10,
      justifyContent: "center", // Center align the name and id vertically
    },
    name: {
      fontSize: width * 0.06, // Responsive font size
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    idName: {
      fontSize: width * 0.04,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginVertical: 5,
    },
    bio: {
      marginTop: height * 0.015,
    },
    bioContent: {
      fontSize: width * 0.035,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginTop: 2,
    },
    avatarContainer: {
      paddingLeft: 5,
    },
    avatar: {
      width: height * 0.07, // Same height as the header
      height: height * 0.07,
      position: "relative",
      borderRadius: (height * 0.07) / 2, // Sửa thành giá trị số
    },
    avatarImg: {
      width: "100%", // Cover the entire container
      height: "100%",
      borderRadius: (height * 0.07) / 2, // Sửa thành giá trị số
      resizeMode: "cover",
    },
    avatarIconContainer: {
      backgroundColor: isDarkMode ? "#222222" : "#EEEEEE",
      width: height * 0.07, // Same height as the header
      height: height * 0.07,
      borderRadius: (height * 0.07) / 2, // Sửa thành giá trị số
    },
    avatarIcon: {
      width: "100%", // Cover the entire container
      height: "100%",
      borderRadius: (height * 0.07) / 2, // Sửa thành giá trị số
      resizeMode: "cover",
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    addUserIcon: {
      color: isDarkMode ? lightTheme.background : darkTheme.background,
    },
    noAvatarContainer: {
      backgroundColor: "#EEEEEE",
      width: height * 0.07, // Same height as the header
      height: height * 0.07,
      borderRadius: (height * 0.07) / 2, // Sửa thành giá trị số
      overflow: "hidden",
    },
    noAvatar: {
      marginTop: height * 0.02,
    },
    verifiedBadge: {
      position: "absolute",
      width: width * 0.06, // Badge size relative to screen width
      height: width * 0.06,
      borderRadius: width * 0.03, // Sửa thành giá trị số
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      justifyContent: "center",
      alignItems: "center",
      bottom: 1,
    },
    verifiedText: {
      color: "#1da1f2",
      fontSize: 24,
    },
    followersSection: {
      marginTop: height * 0.015,
    },
    followers: {
      fontSize: width * 0.04,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: 5,
    },
    followingSectionButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: height * 0.03,
      borderWidth: 1,
      borderColor: "#555555",
      borderRadius: 10,
    },
    followingButton: {
      flex: 1,
      padding: height * 0.02,
      marginHorizontal: width * 0.02,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    followingButtonText: {
      fontSize: width * 0.04,
      fontWeight: fontWeight,
    },
    myProfile: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: height * 0.03,
    },
    editProfileButton: {
      height: height * 0.045,
      width: width * 0.45,
      borderRadius: 10,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      borderColor: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    editProfileButtonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    shareProfileButton: {
      height: height * 0.045,
      width: width * 0.45,
      borderRadius: 10,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      borderColor: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    shareProfileButtonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });

export default ProfileHeader;
