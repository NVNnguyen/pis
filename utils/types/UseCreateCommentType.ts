export type UseCreateCommentType = {
  file?: { uri: string } | null;
  postId: number;
  parentCommentId?: number | null;
  userId: number;
  content: string;
  type?: "Voice" | "Image" | "Text";
}