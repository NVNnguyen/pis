 export interface ProfileType {
  userPostResponse: {
    id: number;
    username: string;
    avatar: string;
    follow: boolean;
    firstName: string;
    lastName: string;
  };
  caption: string;
  images: {
    url: string;
    id: number;
  }[];
  likes: number;
  comments: number;
  type: string;
  like: number;
  createTime: string;
}