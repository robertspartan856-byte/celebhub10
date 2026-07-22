import { randomUUID } from "crypto";

export type AppRole = "user" | "admin";

export type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: AppRole;
  createdAt: string;
};

export type ApplicationStatus = "submitted" | "approved" | "rejected";

export type ApplicationRecord = {
  id: string;
  name: string;
  email: string;
  celebrity: string;
  tier: string;
  notes: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
};

export const inMemoryUsers: StoredUser[] = [];
export const inMemoryApplications: ApplicationRecord[] = [];

export function createStoredUser(input: Omit<StoredUser, "id" | "createdAt">): StoredUser {
  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
}

export function createApplicationRecord(input: Omit<ApplicationRecord, "id" | "submittedAt">): ApplicationRecord {
  return {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    ...input,
  };
}
