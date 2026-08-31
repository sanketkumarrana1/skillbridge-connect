export type NotificationRole = "student" | "industry" | "academician" | "institution" | "all";

export type NotificationType =
  | "assessment_completed"
  | "new_recommendation"
  | "application_received"
  | "application_submitted"
  | "application_viewed"
  | "candidate_shortlisted"
  | "interview_scheduled"
  | "interview_completed"
  | "offer_received"
  | "offer_sent"
  | "offer_accepted"
  | "offer_declined"
  | "certificate_verified"
  | "mentorship_requested"
  | "mentorship_scheduled"
  | "collaboration_updated"
  | "collaboration_outcome_recorded";

export interface PlatformNotification {
  id: string;
  recipientRole: NotificationRole;
  recipientId?: string | undefined;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedEntityId?: string | undefined;
  relatedEntityType?: "opportunity" | "application" | "candidate" | "interview" | "offer" | "collaboration" | "mentorship" | undefined;
  actionUrl?: string | undefined;
}

export class NotificationService {
  public static createEvent(
    data: Omit<PlatformNotification, "id" | "timestamp" | "read">,
  ): PlatformNotification {
    return {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      read: false,
    };
  }

  public static filterByRole(
    notifications: PlatformNotification[],
    role: NotificationRole,
  ): PlatformNotification[] {
    return notifications.filter(
      (n) => n.recipientRole === role || n.recipientRole === "all",
    );
  }
}

export const notificationService = NotificationService;

