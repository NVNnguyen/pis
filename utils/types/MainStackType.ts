export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    FriendMode: undefined;
    PublicMode: undefined;
    Search: undefined;
    ProfilePublic: { userId: number }; // Profile có id
    TabBar: undefined;
    Comments: { id: number; userId: number };
    ChatList: undefined;
    Messages: { userId: number };
    Loading: undefined;
    Otp: {email: string}
    ResetPassword: {email: string}
  };