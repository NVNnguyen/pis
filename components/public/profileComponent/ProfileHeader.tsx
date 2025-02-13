import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import infoAPI from "@/api/userAPI/infoAPI";
import { getUserId } from "@/utils/decodeToken";


const { width, height } = Dimensions.get("window");
interface ProfileProps {
  userPostResponse: {
    id: number;
    username: string;
    avatar: string;
    follow: boolean;
  };
  caption: string;
  images: {
    url: string;
    id: number;
  }[];
  likes: number;
  comments: number;
  type: string;
  like: number;
  createTime: string;
}
const ProfileHeader = ({
  userIdProp,
  setSelectedTab,
}: {
  userIdProp: number;
  setSelectedTab: (tab: "public" | "private") => void;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const [userId, setUserId] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<any>();
  const [follower, setFollower] = useState<number>();
  const [following, setFollowing] = useState<number>();
  const [selectedTab, setTab] = useState<"public" | "private">("public");
  // const [selectedTab, setSelectedTab] = useState<"public" | "private">(
  //   "public"
  // );
  const { isDarkMode } = useTheme();

  const styles = getStyles(isDarkMode, selectedTab);

  useEffect(() => {
    const fetchUserId = async () => {
      await getUserId();
      const decodedToken = await AsyncStorage.getItem("userID");
      setUserId(Number(decodedToken));
      console.log("User ID:", userId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    console.log("useridprop", userIdProp);
    if (!userIdProp) return; // Không gọi API nếu `userIdProp` không tồn tại

    const userInfoApi = async () => {
      try {
        const response = await infoAPI.userInfo(userIdProp);
        if (response?.data) {
          setUserInfo(response?.data);
          console.log("User Info:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    userInfoApi();
  }, [userIdProp]); // Gọi API lại khi `userIdProp` thay đổi
  useEffect(() => {
    console.log("userIdprop", userIdProp);
    if (!userIdProp) return; // Không gọi API nếu `userIdProp` không tồn tại
    const userInfoFollow = async () => {
      try {
        const response = await infoAPI.userFollow(userIdProp);
        if (response?.data) {
          setFollower(response?.data?.followers ?? 0);
          setFollowing(response?.data?.followingNumber);
          console.log("User Info:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    userInfoFollow();
  }, [userIdProp]);
  const toggleFollow = () => {
    setIsModalVisible(false); // Đóng modal
  };
  const handleFollowStatus = () => {
    if (userInfo?.userPostResponse.follow) {
      setIsModalVisible(true); // Hiển thị modal nếu đang "Following"
    } else {
    }
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
  if (selectedTab === "public") {
    useEffect(() => {});
    [];
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{userInfo?.username}</Text>
          <Text style={styles.idName}>{userInfo?.username}</Text>
        </View>
        {/* Avatar */}
        {userInfo?.avatar?.length > 0 && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image
                source={{ uri: userInfo.avatar }}
                style={styles.avatarImg}
              />
            </View>

            {/* {profile.isVerified && (
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" style={styles.verifiedText} />
              </View>
            )} */}
          </View>
        )}
        {userInfo?.avatar?.length === 0 && userId === userIdProp && (
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
        {userInfo?.avatar?.length === 0 && userId === userIdProp && (
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
      {/* {profile.bio.length > 0 && (
        <View style={styles.bio}>
          <Text style={styles.bioContent}>{profile.bio}</Text>
        </View>
      )} */}

      {/* Followers and Link */}
      <View style={styles.followersSection}>
        <TouchableOpacity>
          <Text style={styles.followers}>
            {formatNumber(follower ?? 0)} followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.followers}>
            {formatNumber(following ?? 0)} following
          </Text>
        </TouchableOpacity>
      </View>
      {/* Action Buttons */}
      {userId === userIdProp && (
        <View style={styles.myProfile}>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareProfileButton}>
            <Text style={styles.shareProfileButtonText}>Share profile</Text>
          </TouchableOpacity>
        </View>
      )}
      {userId !== userIdProp && (
        <View
          style={[
            styles.followingSectionButton,
            {
              backgroundColor: getColor(
                userInfo?.follow ?? false,
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
                  color: getColor(
                    userInfo?.follow ?? false,
                    isDarkMode,
                    "text"
                  ),
                },
              ]}
            >
              {userInfo?.follow ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
          {/* ModelUnFollow */}
        </View>
      )}
      <View style={styles.postContainer}>
        {/* Public Posts */}
        <TouchableOpacity
          style={[
            styles.postsBtn,
            selectedTab === "public" && styles.selectedBtn,
          ]}
          onPress={() => setSelectedTab("public")}
        >
          <Text
            style={[
              styles.postsTxt,
              selectedTab === "public" && styles.selectedTxt,
            ]}
          >
            Public posts
          </Text>
        </TouchableOpacity>

        {/* Private Posts */}
        <TouchableOpacity
          style={[
            styles.postsBtn,
            selectedTab === "private" && styles.selectedBtn,
          ]}
          onPress={() => setSelectedTab("private")}
        >
          <Text
            style={[
              styles.postsTxt,
              selectedTab === "private" && styles.selectedTxt,
            ]}
          >
            Private posts
          </Text>
        </TouchableOpacity>
      </View>
      <ModelUnFollow
        selectedUser={{
          id: userInfo?.id ?? 0,
          username: userInfo?.username ?? "",
          avatar: userInfo?.avatar ?? "",
        }}
        handleModelVisible={() => setIsModalVisible(false)} // Đóng modal
        modalVisible={isModalVisible}
        toggleFollow={toggleFollow} // Thay đổi trạng thái following
      />
    </View>
  );
};

const getStyles = (isDarkMode: boolean, selectedTab: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingTop: height * 0.08,
      paddingHorizontal: width * 0.02, // Responsive padding
      borderBottomColor: "#A0A0A0",
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
      flexDirection: "row",
      justifyContent: "space-around",
    },
    followers: {
      fontSize: width * 0.04,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: 5,
      marginLeft: 10,
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
    postContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: width * 0.01,
      marginTop: height * 0.03,
    },
    postsBtn: {
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.05,
      borderBottomWidth: 1,
      borderBottomColor: "transparent",
    },
    postsTxt: {
      fontSize: width * 0.04,
      fontWeight: "bold",
      color: "#A0A0A0", // Màu mặc định là xám
    },
    selectedBtn: {
      borderBottomColor: isDarkMode ? darkTheme.text : lightTheme.text, // Gạch chân khi được chọn
    },
    selectedTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text, // Màu trắng khi được chọn
    },
  });

export default ProfileHeader;
