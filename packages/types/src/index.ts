export type Role = "LEADER" | "SERVANT" | "MEMBER";

export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  ministryId: string;
  avatarUrl?: string;
}

export interface Media {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  size: number;
  tags: string[];
  folderId?: string;
  uploadedById: string;
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  mediaIds: string[];
  platform?: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  createdById: string;
}
