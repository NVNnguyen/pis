export type MainStackType = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    PrivateMode: undefined;
    PublicMode: undefined;
    Search: undefined;
    Profile: { userId: number, isFollow: boolean }; // Profile có id
    TabBar: undefined;
    Comments: {  userId: number, postId: number; };
    ChatList: undefined;
    Messages: { userId: number };
    Loading: undefined;
    Otp: {email: string}
    ResetPassword: {email: string}
    PostDetails: {userId: number, postId: number; userName: string }
    FollowList: {tab: string, userId: number};
    HistoryPost: {userId: number, username: string, avatar: string}
  };