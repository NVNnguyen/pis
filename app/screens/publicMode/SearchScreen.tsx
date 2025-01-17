import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import UserItem from "@/components/public/UserItem"; // Import UserItem
import { Color, fontWeight } from "@/styles/color";
import ModelUnFollow from "@/components/public/ModelUnFollow";
import { useNavigation } from "expo-router";
import { mockUsers } from "@/utils/mockAPI";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserProps {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
}

const { width, height } = Dimensions.get("window");

const SearchScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [isFocus, setIsFocus] = useState(false);

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
  const handleModelVisible = () => {
    setModalVisible(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {!isFocus && (
        <View>
          <Text style={styles.searchText}>Search</Text>
        </View>
      )}
      <View style={styles.searchContainer}>
        {isFocus && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <View style={styles.searchBox}>
          <EvilIcons name="search" size={24} color="grey" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#808080"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </View>
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
        <ModelUnFollow
          selectedUser={selectedUser}
          handleModelVisible={handleModelVisible}
          modalVisible={modalVisible}
          toggleFollow={toggleFollow}
        />
      )}
    </SafeAreaView>
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
    justifyContent: "space-around",
    marginRight: 0,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202020",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    color: Color,
    fontSize: 16,
    paddingVertical: 10,
  },
  searchResult: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchResultText: {
    color: Color,
    fontSize: 16,
    marginLeft: 5,
  },
});

export default SearchScreen;
