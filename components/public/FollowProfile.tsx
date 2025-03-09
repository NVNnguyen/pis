import { useTheme } from "@/contexts/ThemeContext";
import { getMyUserId } from "@/hooks/getMyUserID";
import useHandleFollow from "@/hooks/useHandleFollow";
import {
  fontWeight,
  text10FontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { darkThemeInput, lightThemeInput } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { MainStackType } from "@/utils/types/MainStackType";
import { MaterialIcons } from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
interface FollowProfileProp {
  userId: number;
  username: string;
  avatar: string;
  followers: number;
  firstName: string;
  lastName: string;
  isFollow: boolean;
}

const { width, height } = Dimensions.get("window");
const FollowProfile = (userFollowers: FollowProfileProp) => {
  const { isDarkMode } = useTheme();
  const styles = getStyle(isDarkMode);
  const myUserId = Number(getMyUserId());
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const { isFollowing, responseMessage, handleFollowing } = useHandleFollow({
    userName: userFollowers?.username || "",
    following: userFollowers?.isFollow || false,
    userId: myUserId,
    friendId: userFollowers?.userId || 0,
  });
  const route =
    useRoute<RouteProp<{ params: { tab: string; userId: number } }>>();
  const userId = route?.params?.userId;
  console.log("userID: ", userId);
  return (
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", {
              userId: userFollowers.userId,
              isFollow: userFollowers.isFollow,
            })
          }
        >
          {userFollowers?.avatar != null && (
            <Image
              source={{ uri: userFollowers.avatar }}
              style={styles.avatar}
            />
          )}
          {userFollowers?.avatar == null && (
            <Image
              source={require("@/assets/images/userAvatar.png")}
              style={styles.avatar}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        <View style={styles.userRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                userId: userFollowers.userId,
                isFollow: userFollowers.isFollow,
              })
            }
          >
            <View style={styles.fullNameContainer}>
              <Text style={styles.fullNameTxt}>
                {userFollowers?.firstName} {userFollowers?.lastName}
              </Text>
              {userFollowers.followers > 100000 && (
                <MaterialIcons name="verified" style={styles.verifiedText} />
              )}
            </View>

            <Text style={styles.username}>{userFollowers?.username}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {myUserId === userId && (
        <>
          {!isFollowing && (
            <TouchableOpacity
              onPress={handleFollowing}
              style={styles.followBtn}
            >
              <Text style={styles.followTxt}>Follow</Text>
            </TouchableOpacity>
          )}
          {isFollowing && (
            <TouchableOpacity
              onPress={handleFollowing}
              style={styles.followingBtn}
            >
              <Text style={styles.followingTxt}>Following</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {myUserId !== userId && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", {
              userId: userFollowers.userId,
              isFollow: userFollowers.isFollow,
            })
          }
          style={styles.followBtn}
        >
          <Text style={styles.followTxt}>Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyle = (isDarkMode: any) => {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: height * 0.01,
    },
    avatarContainer: {
      position: "relative",
      marginRight: width * 0.03,
    },
    avatar: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: (width * 0.1) / 2,
    },
    followBtn: {
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      width: width * 0.2,
      height: height * 0.03,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
    },
    followTxt: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontSize: text10FontSize,
      fontWeight: fontWeight,
    },
    followingBtn: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      width: width * 0.22,
      height: height * 0.03,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: isDarkMode ? lightThemeInput : darkThemeInput,
    },
    followingTxt: {
      color: isDarkMode ? lightThemeInput : darkThemeInput,
    },
    userInfo: {
      flex: 1,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    fullNameContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    fullNameTxt: {
      fontWeight: fontWeight,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      marginRight: width * 0.008,
    },
    username: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      marginRight: width * 0.008,
    },
    verifiedText: {
      color: "#1da1f2",
      fontSize: textPostFontSize,
      marginRight: width * 0.008,
    },
    time: {
      color: "#A0A0A0",
      fontSize: text10FontSize,
    },
    caption: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
    },
    imageContainer: {
      flexDirection: "row",
      marginTop: 10,
    },
    image: {
      width: width * 0.6,
      height: height * 0.35,
      borderRadius: 10,
      marginRight: width * 0.02,
    },
    footer: {
      flexDirection: "row",
      marginTop: height * 0.01,
    },
    iconContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 20,
    },
    iconText: {
      marginLeft: width * 0.005,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
    },
  });
};
export default FollowProfile;
