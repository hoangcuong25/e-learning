export enum ReportTargetType {
  POST = "POST",
  POST_COMMENT = "POST_COMMENT",
  COURSE = "COURSE",
  USER = "USER",
}

export enum ReportReason {
  SPAM = "SPAM",
  HARASSMENT = "HARASSMENT",
  INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT",
  HATE_SPEECH = "HATE_SPEECH",
  SCAM = "SCAM",
  OTHER = "OTHER",
}

export enum ReportStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export const ReportReasonTranslation: Record<ReportReason, string> = {
  [ReportReason.SPAM]: "Spam",
  [ReportReason.HARASSMENT]: "Quấy rối",
  [ReportReason.INAPPROPRIATE_CONTENT]: "Nội dung không phù hợp",
  [ReportReason.HATE_SPEECH]: "Ngôn từ thù ghét",
  [ReportReason.SCAM]: "Lừa đảo",
  [ReportReason.OTHER]: "Khác",
};

export const ReportStatusTranslation: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: "Chờ xử lý",
  [ReportStatus.RESOLVED]: "Đã giải quyết",
  [ReportStatus.REJECTED]: "Đã từ chối",
};
