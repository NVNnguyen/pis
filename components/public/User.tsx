import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from "react-native";

interface UserProps {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
}

interface UserItemProps {
  item: UserProps;
  onToggleFollow: (id: string) => void;
  onFollowingPress: (id: string) => void;
}

const { width } = Dimensions.get("window");

const UserItem: React.FC<UserItemProps> = ({
  item,
  onToggleFollow,
  onFollowingPress,
}) => {
  return (
    <View style={styles.userItem}>
      {/* Avatar */}
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      {/* Follow/Following Button */}
      <TouchableOpacity
        style={[
          styles.followButton,
          item.isFollowing ? styles.following : styles.follow,
        ]}
        onPress={() =>
          item.isFollowing ? onFollowingPress(item.id) : onToggleFollow(item.id)
        }
      >
        <Text style={styles.buttonText}>
          {item.isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
  },
  name: {
    color: "#A0A0A0",
    fontSize: width * 0.035,
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  follow: {
    backgroundColor: "#007BFF",
  },
  following: {
    backgroundColor: "#404040",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
  },
});

export default UserItem;
