export const RealtimeTopics = {
  CHAT_MESSAGE_CREATED: "chat.message.created",
  CHAT_CONVERSATION_UPDATED: "chat.conversation.updated",
  REQUEST_CREATED: "request.created",
  ANALYTICS_UPDATED: "analytics.updated",
  USER_ROLE_CHANGED: "user.role.changed",
} as const;

export type RealtimeTopic =
  (typeof RealtimeTopics)[keyof typeof RealtimeTopics];
