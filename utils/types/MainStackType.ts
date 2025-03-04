export type MainStackType = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    PrivateMode: undefined;
    PublicMode: undefined;
    Search: undefined;
    Profile: { userId: number }; // Profile có id
    TabBar: undefined;
    Comments: {  userId: number, postId: number; };
    ChatList: undefined;
    Messages: { userId: number };
    Loading: undefined;
    Otp: {email: string}
    ResetPassword: {email: string}
    PostDetails: {userId: number, postId: number; }
    FollowList: {tab: string};
  };