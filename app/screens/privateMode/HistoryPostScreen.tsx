import postsAPI from "@/api/postsAPI";
import Photo from "@/components/private/Photo";
import Voice from "@/components/private/Voice";
import BlockUserModal from "@/components/public/Modals/BlockUserModal";
import SettingModalPrivate from "@/components/public/Modals/SettingModalPrivate";
import MediaModal from "@/components/public/Modals/MediaModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useMyUserId } from "@/hooks/useMyUserId";
import useProfileInformation from "@/hooks/useProfileInformation";
import {
  buttonFontsize,
  fontWeight,
  textFontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { primaryColor } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { MainStackType } from "@/utils/types/MainStackType";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  ActivityIndicator,
  Modal,
} from "react-native";
import useUserInfo from "@/hooks/useUserInfo";
import useGenerateAndUploadQR from "@/hooks/useGenerateAndUploadQR";
const { width, height } = Dimensions.get("window");
const HistoryPostScreen = () => {
  const [activeTab, setActiveTab] = useState<"photo" | "voice">("photo");
  const route = useRoute<RouteProp<MainStackType, "HistoryPost">>();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NavigationProp<MainStackType, "Messages">>();
  const styles = getStyles(isDarkMode, width);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [isVisibleSettingModel, setIsVisibleSettingModel] =
    useState<boolean>(false);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const myUserId = Number(useMyUserId());

  const { profileInformation, isProfileDetailLoading, postProfileError } =
    useProfileInformation(myUserId, route?.params?.userId);

  const {
    data: privatePosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postPrivate", route?.params?.userId],
    queryFn: () => postsAPI.postsPrivate(route?.params?.userId),
    enabled: !!route?.params?.userId,
  });

  const photoPosts = useMemo(
    () =>
      (privatePosts?.data || []).filter((item: any) => item.type === "Image"),
    [privatePosts]
  );

  const voicePosts = useMemo(
    () =>
      (privatePosts?.data || []).filter((item: any) => item.type === "Voice"),
    [privatePosts]
  );

  const ITEM_MARGIN = 4;
  const NUM_COLUMNS = 3;
  const ITEM_SIZE = (width - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  const handlePhotoPress = (index: number) => {
    setSelectedMediaIndex(index);
    setMediaModalVisible(true);
  };

  const handleVoicePress = (index: number) => {
    setSelectedMediaIndex(index);
    setMediaModalVisible(true);
  };

  const renderPhotoItem = ({ item, index }: any) => (
    <TouchableOpacity
      style={{ width: ITEM_SIZE, height: ITEM_SIZE, margin: ITEM_MARGIN }}
      onPress={() => handlePhotoPress(index)}
    >
      <Photo {...item} size={ITEM_SIZE} />
    </TouchableOpacity>
  );

  const renderVoiceItem = ({ item, index }: any) => (
    <TouchableOpacity
      style={{ width: ITEM_SIZE, height: ITEM_SIZE, margin: ITEM_MARGIN }}
      onPress={() => handleVoicePress(index)}
    >
      <Voice {...item} size={ITEM_SIZE} />
    </TouchableOpacity>
  );

  // ✅ Animation State for Button Color
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const animatedBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#0078D7", "#0099BC", "#2D7D9A"],
  });

  useLayoutEffect(() => {
    if (myUserId === route?.params?.userId) {
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
  }, [myUserId, isDarkMode, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {isImageLoading && (
            <ActivityIndicator
              style={styles.profileImage}
              color={isDarkMode ? lightTheme.text : darkTheme.text}
            />
          )}
          {profileInformation?.avatar ? (
            <Image
              source={{ uri: profileInformation?.avatar }}
              style={styles.profileImage}
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
            />
          ) : (
            <Image
              source={require("@/assets/images/userAvatar.png")}
              style={styles.profileImage}
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
            />
          )}
        </View>
        <Text style={styles.profileName}>{profileInformation?.username}</Text>
        <View style={styles.friendBadge}>
          {myUserId !== route?.params?.userId && (
            <TouchableOpacity
              style={styles.iconFriend}
              onPress={() => setIsVisibleModal(true)}
            >
              <View style={styles.icon}>
                <FontAwesome5
                  name="user-check"
                  size={textPostFontSize}
                  color={isDarkMode ? lightTheme.text : darkTheme.text}
                />
              </View>

              <Text style={styles.friendBadgeText}>
                {myUserId !== route?.params?.userId && "Friend"}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={styles.friendBadgeText}>
            {myUserId === route?.params?.userId && "You"}
          </Text>
        </View>

        {myUserId !== route?.params?.userId && (
          <TouchableOpacity
            style={styles.msgContainer}
            onPress={() =>
              navigation.navigate("Messages", { userId: route?.params?.userId })
            }
          >
            <Animated.View
              style={[
                styles.msgBackground,
                { backgroundColor: animatedBackgroundColor },
              ]}
            >
              <MaterialCommunityIcons
                name="chat"
                size={buttonFontsize}
                color={isDarkMode ? lightTheme.text : darkTheme.text}
              />
              <Text style={styles.msgText}>Message</Text>
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.tabContainer}>
        {["photo", "voice"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "photo" ? "Photo" : "Voice"}
            </Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "photo" ? (
        <FlatList
          key="photo"
          data={photoPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPhotoItem}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ padding: ITEM_MARGIN }}
          ListEmptyComponent={
            <Text style={styles.noPostTxt}>Not post yet!</Text>
          }
        />
      ) : (
        <FlatList
          key="voice"
          data={voicePosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVoiceItem}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ padding: ITEM_MARGIN }}
          ListEmptyComponent={
            <Text style={styles.noPostTxt}>Not post yet!</Text>
          }
        />
      )}

      {/* Block User Modal */}
      <BlockUserModal
        visible={isVisibleModal}
        onClose={() => setIsVisibleModal(false)}
        username={profileInformation?.username}
        myUserId={myUserId}
        userId={route?.params?.userId}
      />

      {/* Settings Modal */}
      <SettingModalPrivate
        visible={isVisibleSettingModel}
        onClose={() => setIsVisibleSettingModel(false)}
        userId={route?.params?.userId}
      />

      {/* Media Modal for Photos and Voice */}
      <MediaModal
        visible={mediaModalVisible}
        onClose={() => setMediaModalVisible(false)}
        mediaType={activeTab}
        mediaItems={activeTab === "photo" ? photoPosts : voicePosts}
        initialIndex={selectedMediaIndex}
      />
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean, width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    profileHeader: {
      alignItems: "center",
      marginBottom: width * 0.04,
      paddingTop: width * 0.05,
    },
    profileImageContainer: {
      width: width * 0.18,
      height: width * 0.18,
      borderRadius: width * 0.09,
      overflow: "hidden",
      marginBottom: width * 0.02,
      backgroundColor: isDarkMode
        ? lightTheme.background
        : lightTheme.background,
    },
    profileImage: {
      width: "100%",
      height: "100%",
    },
    profileName: {
      fontSize: textPostFontSize,
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: width * 0.01,
    },
    iconFriend: {
      flexDirection: "row",
    },
    icon: { marginRight: width * 0.01 },
    friendBadge: {
      backgroundColor: isDarkMode ? darkTheme.text : lightTheme.text,
      paddingHorizontal: width * 0.03,
      paddingVertical: width * 0.01,
      borderRadius: 15,
      flexDirection: "row",
      alignItems: "center",
    },
    friendBadgeText: {
      fontSize: textPostFontSize,
      fontWeight: fontWeight,
      color: isDarkMode ? lightTheme.text : darkTheme.text,
    },
    divider: {
      height: 1,
      backgroundColor: "#333",
      marginVertical: width * 0.04,
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: width * 0.02,
    },
    tabButton: {
      marginHorizontal: width * 0.05,
      paddingVertical: width * 0.02,
      position: "relative",
    },
    tabText: {
      color: "#888",
      fontSize: width * 0.04,
      fontWeight: "500",
    },
    activeTabText: {
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    activeTabIndicator: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: isDarkMode ? darkTheme.text : lightTheme.text,
      borderRadius: 1,
    },
    msgContainer: {
      marginTop: height * 0.01,
    },
    msgBackground: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: width * 0.02,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: primaryColor,
    },
    msgText: {
      fontSize: textFontSize,
      marginLeft: 5,
    },
    imgLoader: {
      position: "absolute",
      zIndex: 1,
    },
    noPostTxt: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.05,
      fontWeight: fontWeight,
      marginTop: height * 0.2,
    },
  });

export default HistoryPostScreen;
