export type SendMessageType = {
    conversationId: number;
    file: { uri: string }|"";
    senderId: number;
    content: string;
    type?: "Voice" | "Image" | "Text";
    userId: number
}