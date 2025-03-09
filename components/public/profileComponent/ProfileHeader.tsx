import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  AntDesign,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  buttonFontsize,
  fontWeight,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { formatNumber } from "@/utils/formatNumber";
import useImagePickerSelectionOne from "@/hooks/useImagePickerSelectionOne";
import useUserInfo from "@/hooks/useUserInfo";
import useUserFollowInfo from "@/hooks/useUserFollowInfo";
import useProfileActions from "@/hooks/useProfileActions";
import { getMyUserId } from "@/hooks/getMyUserID";
import UnFollowModel from "../Modals/UnFollowModal";
import EditProfileModal from "../Modals/EditProfileModal";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import SettingModel from "../Modals/SettingModal";
import AvatarDetailModal from "../Modals/AvatarDetailModal";
import useFollowStore from "@/stores/useFollowStore";
import { MainStackType } from "@/utils/types/MainStackType";
import useHandleFollow from "@/hooks/useHandleFollow";

const { width, height } = Dimensions.get("window");
type ProfileRouteParams = {
  Profile: {
    userId: string;
    isFollow: boolean;
  };
};

const ProfileHeader = ({
  userIdProp,
  selectedTab,
  setSelectedTab, // Nhận setSelectedTab từ ProfilePublicScreen
}: {
  userIdProp: number;
  selectedTab: string;
  setSelectedTab: (tab: "public" | "private") => void;
}) => {
  const [tab, setTab] = useState<"public" | "private">("public");
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, tab);
  const myUserId = Number(getMyUserId());
  const { userInfo, isUserLoading, userError } = useUserInfo(userIdProp); // Gọi API lại khi `userIdProp` thay đổi
  const { followInfo, isFollowLoading, isFollowError } =
    useUserFollowInfo(userIdProp);

  const route = useRoute<RouteProp<ProfileRouteParams, "Profile">>();
  const initialIsFollow = route?.params?.isFollow || false;
  const [isFollowingState, setIsFollowingState] =
    useState<boolean>(initialIsFollow);

  const { followStore, setFollow, resetFollow } = useFollowStore();

  useEffect(() => {
    if (followInfo) setFollow(followInfo);
  }, [followInfo]);

  const [isVisibleEditModel, setIsVisibleEditModel] = useState<boolean>(false);
  const [isVisibleSettingModel, setIsVisibleSettingModel] =
    useState<boolean>(false);
  const [isVisibleAvatarDetail, setIsVisibleAvatarDetail] =
    useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const {
    isModalVisible,
    setIsModalVisible,
    toggleFollow,
    handleFollowStatus,
  } = useProfileActions(userInfo);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsVisibleSettingModel(true)}>
          <Ionicons
            name="options"
            size={buttonFontsize}
            color={isDarkMode ? darkTheme.text : lightTheme.text}
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDarkMode]);

  const { openPickImage } = useImagePickerSelectionOne();

  const {
    isFollowing,
    responseMessage,
    handleFollowing,
    performFollowAction,
    isLoading,
  } = useHandleFollow({
    userName: userInfo?.username || "",
    following: isFollowingState,
    userId: myUserId,
    friendId: userInfo?.id || 0,
  });

  // 1. Optimistic Update - Đừng đợi API trả về, cập nhật UI ngay lập tức
  const handleFollowOptimistic = () => {
    // Cập nhật UI trước
    setIsFollowingState(!isFollowingState);

    // Cập nhật followers count optimistically
    const newFollowers = isFollowingState
      ? (followStore?.followers || 0) - 1
      : (followStore?.followers || 0) + 1;

    setFollow({
      ...followStore,
      followers: newFollowers,
    });

    // Sau đó gọi API
    performFollowAction();
  }; // 3. Chỉnh sửa useEffect để xử lý lỗi nếu có
  useEffect(() => {
    // Nếu trạng thái từ API trả về khác với UI hiện tại, điều đó có nghĩa là có lỗi xảy ra
    if (isFollowing !== isFollowingState && responseMessage) {
      // Rollback UI state nếu API thất bại
      setIsFollowingState(isFollowing);

      // Rollback follower count
      const correctFollowers = isFollowing
        ? followStore?.followers || 0
        : (followStore?.followers || 0) - 1;

      setFollow({
        ...followStore,
        followers: correctFollowers,
      });

      // Có thể hiển thị thông báo lỗi ở đây
    }
  }, [isFollowing, responseMessage]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {userInfo?.firstName} {userInfo?.lastName}
          </Text>
          <Text style={styles.idName}>{userInfo?.username}</Text>
        </View>
        {/* Avatar */}
        {userInfo?.avatar?.length > 0 && (
          <TouchableOpacity onPress={() => setIsVisibleAvatarDetail(true)}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {userInfo?.avatar?.length > 0 && (
                  <Image
                    source={{ uri: userInfo?.avatar }}
                    style={styles.avatarImg}
                  />
                )}
              </View>
              {followInfo?.followers > 100000 && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" style={styles.verifiedText} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        {userInfo?.avatar == null && myUserId === userIdProp && (
          <View style={styles.avatarIconContainer}>
            <TouchableOpacity style={styles.avatarIcon} onPress={openPickImage}>
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
        {userInfo?.avatar == null && myUserId != userIdProp && (
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
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FollowList", {
              tab: "follower",
              userId: userIdProp,
            })
          }
        >
          <Text style={styles.followers}>
            {formatNumber(followStore?.followers ?? 0)} followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FollowList", {
              tab: "following",
              userId: userIdProp,
            })
          }
        >
          <Text style={styles.followers}>
            {formatNumber(followStore?.followingNumbers ?? 0)} following
          </Text>
        </TouchableOpacity>
      </View>
      {/* Action Buttons */}
      {myUserId === userIdProp && (
        <View style={styles.myProfile}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setIsVisibleEditModel(true)}
          >
            <Text style={styles.editProfileButtonText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareProfileButton}>
            <Text style={styles.shareProfileButtonText}>Share profile</Text>
          </TouchableOpacity>
        </View>
      )}
      {myUserId !== userIdProp && (
        <View style={styles.myProfile}>
          <TouchableOpacity
            onPress={handleFollowOptimistic}
            style={[styles.otherProfile]}
          >
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                {" "}
                <MaterialIcons
                  name={isFollowingState ? "library-add-check" : "library-add"}
                  size={buttonFontsize}
                  color={isDarkMode ? lightTheme.text : darkTheme.text}
                />
                <Text style={styles.followTxt}>
                  {isFollowingState ? "Following" : "Follow"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageCtn}
            onPress={() =>
              navigation.navigate("Messages", { userId: userIdProp })
            }
          >
            <MaterialCommunityIcons
              name="chat"
              size={buttonFontsize}
              color={isDarkMode ? darkTheme.text : lightTheme.text}
            />
            <Text style={styles.shareProfileButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.postContainer}>
        <TouchableOpacity
          style={[
            styles.postsBtn,
            selectedTab === "public" && styles.selectedBtn,
            myUserId !== userInfo?.id && styles.publicContainer,
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
        {myUserId === userInfo?.id && (
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
        )}
      </View>
      <UnFollowModel
        selectedUser={{
          id: userInfo?.id ?? 0,
          username: userInfo?.username ?? "",
          avatar: userInfo?.avatar ?? "",
        }}
        handleModelVisible={() => setIsModalVisible(false)} // Đóng modal
        modalVisible={isModalVisible}
        toggleFollow={toggleFollow} // Thay đổi trạng thái following
      />
      <EditProfileModal
        visible={isVisibleEditModel}
        onClose={() => setIsVisibleEditModel(false)}
        avatar={userInfo?.avatar ?? ""}
        follower={followInfo?.followers ?? 0}
        userIdProp={userIdProp}
        firstName={userInfo?.firstName ?? ""}
        lastName={userInfo?.lastName ?? ""}
        email={userInfo?.email ?? ""}
        birthday={userInfo?.birthday ?? null}
      />
      <SettingModel
        visible={isVisibleSettingModel}
        onClose={() => setIsVisibleSettingModel(false)}
      />
      <AvatarDetailModal
        image={userInfo?.avatar ?? ""}
        visible={isVisibleAvatarDetail}
        onClose={() => setIsVisibleAvatarDetail(false)}
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
      fontSize: buttonFontsize,
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
    otherProfile: {
      flexDirection: "row",
      height: height * 0.045,
      width: width * 0.45,
      borderRadius: 10,
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
    },
    messageCtn: {
      flexDirection: "row",
      height: height * 0.045,
      width: width * 0.45,
      borderRadius: 10,
      justifyContent: "space-evenly",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDarkMode ? darkTheme.text : lightTheme.text,
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
    followTxt: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontSize: textPostFontSize,
    },
    shareProfileButtonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
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
    publicContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    loadingColor: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
  });

export default ProfileHeader;
