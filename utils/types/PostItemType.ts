export type PostItemType = {
  userPostResponse: {
    userId: number;
    username: string;
    avatar: string;
    followers: number
    follow: boolean;
  };
  id: number;
  caption: string;
  images: {
    url: string;
    id: number;
  }[];
  likes: number;
  comments: number;
  type: string;
  like: boolean;
  createTime: string;
}