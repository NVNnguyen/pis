import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const ProfileTabBar = () => {
  return (
    <Tabs>
      <Tabs.Screen name="MyPost" options={{ title: "Posts" }} />
      <Tabs.Screen name="Reposts" options={{ title: "Reposts" }} />
    </Tabs>
  );
};
export default ProfileTabBar;
