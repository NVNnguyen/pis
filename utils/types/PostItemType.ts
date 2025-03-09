export type PostItemType = {
  userPostResponse: {
    likes: number;
    comments: number;
    like: boolean;
    userId: number;
    username: string;
    avatar: string;
    followers: number
    isFollow: boolean ;
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