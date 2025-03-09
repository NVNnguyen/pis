import FollowProfile from "@/components/public/FollowProfile";
import TabBar from "@/components/public/TabBar/TabBar";
import { useTheme } from "@/contexts/ThemeContext";
import { getMyUserId } from "@/hooks/getMyUserID";
import { useDebounce } from "@/hooks/useDebounce ";
import useSearchUsers from "@/hooks/useSearchUsers";
import FollowProfileSkeleton from "@/Loading/FollowProfileSkeleton";
import useFollowStore from "@/stores/useFollowStore";
import {
  buttonFontsize,
  fontWeight,
  text12FontSize,
  textFontSize,
  textPostFontSize,
  titleFontsize,
} from "@/styles/stylePrimary";
import { darkThemeInput, grey, lightThemeInput } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
const SearchScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [searchText, setSearchText] = useState("");
  const debouncedText = useDebounce(searchText, 500);
  const userId = Number(getMyUserId());
  const { search, isSearchLoading, searchError } = useSearchUsers(
    debouncedText,
    userId
  );
  return (
    <View style={styles.container}>
      <>
        <Text style={styles.search}>Search</Text>
        <View style={styles.searchContainer}>
          <AntDesign
            name="search1"
            size={width * 0.05}
            color={grey}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={() => setSearchText("")}>
            {searchText.length > 0 && (
              <MaterialIcons
                name="clear"
                size={buttonFontsize}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
                style={styles.clearIcon}
              />
            )}
          </TouchableOpacity>
        </View>
        {searchText.length > 0 && (
          <Text style={styles.searchTxt}>Search for "{searchText}"</Text>
        )}
      </>
      {isSearchLoading ? (
        <FlatList
          data={[...Array(6)]}
          keyExtractor={(_, index) => `skeleton-${index}`}
          renderItem={() => <FollowProfileSkeleton />}
        />
      ) : (
        <FlatList
          data={search}
          keyExtractor={(item) => item?.userId.toString()}
          renderItem={({ item }) => (
            <FollowProfile {...item} isFollow={item.follow} />
          )}
        />
      )}
      <TabBar />
    </View>
  );
};
const getStyles = (isDarkMode: any) => {
  return StyleSheet.create({
    container: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      flex: 1,
      paddingHorizontal: width * 0.01,
    },
    tabBarContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    tabBarBtn: {
      paddingVertical: height * 0.01,
    },
    tabBarTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
    },
    searchContainer: {
      flexDirection: "row",
      backgroundColor: isDarkMode ? darkThemeInput : lightThemeInput,
      width: "100%",
      height: height * 0.04,
      borderRadius: 10,
      alignItems: "center",
      marginVertical: height * 0.02,
    },
    searchIcon: {
      marginLeft: width * 0.02,
    },
    searchInput: {
      fontSize: text12FontSize,
      marginLeft: width * 0.03,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      flex: 1,
    },
    search: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontWeight: fontWeight,
      fontSize: buttonFontsize,
    },
    clearIcon: {
      marginRight: width * 0.01,
    },
    searchTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontWeight: fontWeight,
      fontSize: textPostFontSize,
      marginBottom: height * 0.02,
    },
  });
};
export default SearchScreen;
