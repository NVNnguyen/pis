import React from "react";
import { FlatList, View } from "react-native";
import PostSkeletonItem from "./PostSkeletonItem";


const PostsSkeleton = ({ count = 5 }: { count?: number }) => {
  const dummyData = Array.from({ length: count }, (_, index) => index.toString());

  return (
    <FlatList
      data={dummyData}
      keyExtractor={(item) => item}
      renderItem={() => <PostSkeletonItem />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default PostsSkeleton;
