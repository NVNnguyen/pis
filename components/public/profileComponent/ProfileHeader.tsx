"use client";

import React from "react";
import {
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  AntDesign,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { buttonFontsize } from "@/styles/stylePrimary";
import { formatNumber } from "@/utils/formatNumber";
import useImagePickerSelectionOne from "@/hooks/useImagePickerSelectionOne";
import useUserInfo from "@/hooks/useUserInfo";
import useUserFollowInfo from "@/hooks/useUserFollowInfo";
import EditProfileModal from "../Modals/EditProfileModal";
import SettingModal from "../Modals/SettingModal";
import AvatarDetailModal from "../Modals/AvatarDetailModal";
import useFollowStore from "@/stores/useFollowStore";
import {
  type NavigationProp,
  type RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import useHandleFollow from "@/hooks/useHandleFollow";
import type { MainStackType } from "@/utils/types/MainStackType";
import { useMyUserId } from "@/hooks/useMyUserId";
import friendAPI from "@/api/friendAPI";
import BlockUserModal from "../Modals/BlockUserModal";

const { width, height } = Dimensions.get("window");

type ProfileRouteParams = {
  Profile: {
    userId: string;
    isFollow: boolean;
  };
};

// Memoized ProfileHeader
const ProfileHeader = React.memo(
  ({
    userIdProp,
    selectedTab,
    setSelectedTab,
  }: {
    userIdProp: number;
    selectedTab: string;
    setSelectedTab: (tab: "public" | "private") => void;
  }) => {
    const { isDarkMode } = useTheme();
    const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);
    const myUserId = useMyUserId() ?? 0;
    const { userInfo, isUserLoading, userError } = useUserInfo(userIdProp);
    const { followInfo, isFollowLoading, isFollowError } =
      useUserFollowInfo(userIdProp);
    const route = useRoute<RouteProp<ProfileRouteParams, "Profile">>();
    const initialIsFollow = route?.params?.isFollow || false;
    const [isFollowingState, setIsFollowingState] =
      useState<boolean>(initialIsFollow);
    const [isOpenBlockModal, setIsOpenBlockModal] = useState<boolean>(false);
    const { followStore, setFollow } = useFollowStore();

    useEffect(() => {
      if (followInfo) setFollow(followInfo);
    }, [followInfo]);

    const [isVisibleEditModel, setIsVisibleEditModel] =
      useState<boolean>(false);
    const [isVisibleSettingModel, setIsVisibleSettingModel] =
      useState<boolean>(false);
    const [isVisibleAvatarDetail, setIsVisibleAvatarDetail] =
      useState<boolean>(false);

    const navigation = useNavigation<NavigationProp<MainStackType>>();

    useEffect(() => {}, [selectedTab, isVisibleSettingModel]);

    useLayoutEffect(() => {
      if (myUserId === userIdProp) {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress={() => setIsVisibleSettingModel(true)}>
              <Ionicons
                name="options"
                size={buttonFontsize}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
            </TouchableOpacity>
          ),
        });
      }
    }, [myUserId, userIdProp, isDarkMode, navigation]);

    const { openPickImage } = useImagePickerSelectionOne();
    const { isFollowing, responseMessage, performFollowAction, isLoading } =
      useHandleFollow({
        userName: userInfo?.username || "",
        following: isFollowingState,
        userId: myUserId,
        friendId: userInfo?.id || 0,
      });

    const handleFollowOptimistic = useCallback(() => {
      setIsFollowingState((prev) => !prev);
      const newFollowers = isFollowingState
        ? (followStore?.followers || 0) - 1
        : (followStore?.followers || 0) + 1;
      setFollow({ ...followStore, followers: newFollowers });
      performFollowAction();
    }, [isFollowingState, followStore, setFollow, performFollowAction]);

    useEffect(() => {
      if (isFollowing !== isFollowingState && responseMessage) {
        setIsFollowingState(isFollowing);
        const correctFollowers = isFollowing
          ? followStore?.followers || 0
          : (followStore?.followers || 0) - 1;
        setFollow({ ...followStore, followers: correctFollowers });
      }
    }, [
      isFollowing,
      responseMessage,
      isFollowingState,
      followStore,
      setFollow,
    ]);

    const renderLoadingOrContent = useCallback(
      (isLoading: boolean, content: React.ReactNode) => {
        if (isLoading) {
          return (
            <ActivityIndicator
              size="small"
              color={isDarkMode ? darkTheme.text : lightTheme.text}
            />
          );
        }
        return content;
      },
      [isDarkMode]
    );

    // Memoized render sections
    const renderProfileInfo = useMemo(() => {
      return renderLoadingOrContent(
        isUserLoading,
        <>
          <Text style={styles.name}>
            {userInfo?.firstName} {userInfo?.lastName}
          </Text>
          <Text style={styles.idName}>{userInfo?.username}</Text>
        </>
      );
    }, [isUserLoading, userInfo, styles]);

    const renderAvatar = useMemo(() => {
      return renderLoadingOrContent(
        isUserLoading,
        userInfo?.avatar?.length > 0 ? (
          <TouchableOpacity onPress={() => setIsVisibleAvatarDetail(true)}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Image
                  source={{ uri: userInfo?.avatar }}
                  style={styles.avatarImg}
                />
              </View>
              {followInfo?.followers > 100000 && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" style={styles.verifiedText} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ) : myUserId === userIdProp ? (
          <View style={styles.avatarIconContainer}>
            <TouchableOpacity style={styles.avatarIcon} onPress={openPickImage}>
              <AntDesign
                name="adduser"
                size={width * 0.06}
                color={
                  isDarkMode ? lightTheme.background : darkTheme.background
                }
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noAvatarContainer}>
            <TouchableOpacity style={styles.avatarIcon}>
              <FontAwesome6
                style={styles.noAvatar}
                name="user-large"
                size={width * 0.08}
                color="#757575"
              />
            </TouchableOpacity>
          </View>
        )
      );
    }, [
      isUserLoading,
      userInfo,
      followInfo,
      myUserId,
      userIdProp,
      openPickImage,
      styles,
      isDarkMode,
    ]);

    const renderFollowersSection = useMemo(() => {
      return renderLoadingOrContent(
        isFollowLoading,
        <>
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
        </>
      );
    }, [isFollowLoading, followStore, navigation, userIdProp, styles]);

    const renderActionButtons = useMemo(() => {
      if (myUserId === userIdProp) {
        return (
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
        );
      }
      return (
        <View style={styles.myProfile}>
          <TouchableOpacity
            onPress={handleFollowOptimistic}
            style={styles.otherProfile}
          >
            {isLoading ? (
              <ActivityIndicator
                color={isDarkMode ? lightTheme.text : darkTheme.text}
              />
            ) : (
              <>
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
      );
    }, [
      myUserId,
      userIdProp,
      isLoading,
      isFollowingState,
      handleFollowOptimistic,
      navigation,
      styles,
      isDarkMode,
    ]);

    const renderTabSelection = useMemo(() => {
      return (
        <View style={styles.postContainer}>
          <TouchableOpacity
            style={[
              styles.postsBtn,
              selectedTab === "public" && styles.selectedBtn,
              myUserId !== userIdProp && styles.publicContainer,
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
          {myUserId === userIdProp && (
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
      );
    }, [myUserId, userIdProp, selectedTab, setSelectedTab, styles]);

    return (
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>{renderProfileInfo}</View>
          {renderAvatar}
        </View>

        {/* Followers and Link */}
        <View style={styles.followersSection}>{renderFollowersSection}</View>

        {/* Action Buttons */}
        {renderActionButtons}

        {/* Tab Selection */}
        {renderTabSelection}

        {/* Modals */}
        <SettingModal
          visible={isVisibleSettingModel}
          onClose={() => setIsVisibleSettingModel(false)}
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
        <AvatarDetailModal
          image={userInfo?.avatar ?? ""}
          visible={isVisibleAvatarDetail}
          onClose={() => setIsVisibleAvatarDetail(false)}
        />
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Chỉ re-render nếu userIdProp hoặc selectedTab thay đổi
    return (
      prevProps.userIdProp === nextProps.userIdProp &&
      prevProps.selectedTab === nextProps.selectedTab
    );
  }
);

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingTop: height * 0.04,
      paddingHorizontal: width * 0.04,
      borderBottomColor: "#A0A0A0",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: height * 0.02,
    },
    profileInfo: {
      flex: 1,
      marginRight: width * 0.03,
    },
    name: {
      fontSize: width * 0.05,
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.005,
    },
    idName: {
      fontSize: width * 0.035,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    avatarContainer: {
      position: "relative",
    },
    avatar: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: width * 0.1,
      overflow: "hidden",
    },
    avatarImg: {
      width: "100%",
      height: "100%",
    },
    avatarIconContainer: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: width * 0.1,
      backgroundColor: isDarkMode ? "#222222" : "#EEEEEE",
      justifyContent: "center",
      alignItems: "center",
    },
    avatarIcon: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    noAvatarContainer: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: width * 0.1,
      backgroundColor: "#EEEEEE",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    noAvatar: {
      marginTop: width * 0.05,
    },
    verifiedBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: width * 0.02,
      padding: width * 0.005,
    },
    verifiedText: {
      color: "#1da1f2",
      fontSize: width * 0.04,
    },
    followersSection: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: height * 0.02,
    },
    followers: {
      fontSize: width * 0.035,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginRight: width * 0.05,
    },
    myProfile: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: height * 0.02,
    },
    editProfileButton: {
      flex: 1,
      height: height * 0.05,
      borderRadius: width * 0.02,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      borderColor: isDarkMode ? darkTheme.text : lightTheme.text,
      marginRight: width * 0.02,
    },
    editProfileButtonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.035,
    },
    shareProfileButton: {
      flex: 1,
      height: height * 0.05,
      borderRadius: width * 0.02,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      borderColor: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    otherProfile: {
      flex: 1,
      flexDirection: "row",
      height: height * 0.05,
      borderRadius: width * 0.02,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      marginRight: width * 0.02,
    },
    messageCtn: {
      flex: 1,
      flexDirection: "row",
      height: height * 0.05,
      borderRadius: width * 0.02,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    followTxt: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontSize: width * 0.035,
      marginLeft: width * 0.02,
    },
    shareProfileButtonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.035,
    },
    postContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: width * 0.02,
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
      color: "#A0A0A0",
    },
    selectedBtn: {
      borderBottomColor: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    selectedTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    publicContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default ProfileHeader;
