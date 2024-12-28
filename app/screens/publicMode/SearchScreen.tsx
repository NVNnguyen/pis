import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import UserItem from "@/components/public/UserItem"; // Import UserItem
import { Color, fontWeight } from "@/styles/color";

interface UserProps {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
}

const { width, height } = Dimensions.get("window");

const SearchScreen: React.FC = () => {
  const mockUsers: UserProps[] = [
    {
      id: "1",
      username: "trttanh_",
      name: "Tu Anh",
      avatar: "https://via.placeholder.com/40",
      isFollowing: false,
    },
    {
      id: "1",
      username: "trttanh_",
      name: "Tu Anh",
      avatar: "https://via.placeholder.com/40",
      isFollowing: false,
    },
    {
      id: "1",
      username: "trttanh_",
      name: "Tu Anh",
      avatar: "https://via.placeholder.com/40",
      isFollowing: false,
    },
    {
      id: "1",
      username: "trttanh_",
      name: "Tu Anh",
      avatar: "https://via.placeholder.com/40",
      isFollowing: false,
    },
    {
      id: "1",
      username: "trttanh_",
      name: "Tu Anh",
      avatar: "https://via.placeholder.com/40",
      isFollowing: false,
    },
    {
      id: "1",
      username: "trttanh_",
      name: "Tu Anh",
      avatar: "https://via.placeholder.com/40",
      isFollowing: false,
    },
    {
      id: "2",
      username: "trtt.mgr0204",
      name: "Яюта Еиомото",
      avatar: "https://via.placeholder.com/40",
      isFollowing: false,
    },
    {
      id: "3",
      username: "trt.tanjil",
      name: "Tanjil Rahman",
      avatar: "https://via.placeholder.com/40",
      isFollowing: false,
    },
    {
      id: "4",
      username: "trtt87",
      name: "Simone Gaspari",
      avatar: "https://via.placeholder.com/40",
      isFollowing: false,
    },
    {
      id: "5",
      username: "vanessaaraujo_trtt",
      name: "Vanessa Araujo",
      avatar: "https://via.placeholder.com/40",
      isFollowing: true,
    },
  ];

  const [users, setUsers] = useState<UserProps[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const toggleFollow = (id: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
    setModalVisible(false);
  };

  const handleFollowingPress = (id: string) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user || null);
    setModalVisible(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.searchText}>Search</Text>

      <View style={styles.searchContainer}>
        <EvilIcons name="search" size={24} color="grey" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#808080"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView>
        {search.length > 0 && (
          <View style={styles.searchResult}>
            <EvilIcons name="search" size={24} color="grey" />
            <Text style={styles.searchResultText}>Search for "{search}"</Text>
          </View>
        )}

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserItem
              item={item}
              onToggleFollow={toggleFollow}
              onFollowingPress={handleFollowingPress}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      {selectedUser && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Image
                source={{ uri: selectedUser.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.modalText}>
                Unfollow {selectedUser.username}?
              </Text>
              <TouchableOpacity
                style={[styles.modalButton, styles.unfollowButton]}
                onPress={() => toggleFollow(selectedUser.id)}
              >
                <Text style={styles.modalButtonText}>Unfollow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
  },
  searchText: {
    color: Color,
    fontSize: 30,
    fontWeight: fontWeight,
    marginBottom: height * 0.02,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202020",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 10,
  },
  searchResult: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchResultText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#202020",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  modalText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  unfollowButton: {
    backgroundColor: "#FF3B30",
  },
  cancelButton: {
    backgroundColor: "#404040",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default SearchScreen;
