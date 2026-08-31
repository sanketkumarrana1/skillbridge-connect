import type { ICollaborationRepository } from "./types";
import type { CollaborationRecord, CollaborationLifecycle } from "@/types";
import { INITIAL_COLLABORATIONS } from "@/data/academician-catalog";

export class MockCollaborationRepository implements ICollaborationRepository {
  private collaborations: CollaborationRecord[] = [...INITIAL_COLLABORATIONS];

  async getAll(): Promise<CollaborationRecord[]> {
    return [...this.collaborations];
  }

  async getById(id: string): Promise<CollaborationRecord | null> {
    const found = this.collaborations.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  async create(collab: Omit<CollaborationRecord, "id">): Promise<CollaborationRecord> {
    const newRecord: CollaborationRecord = {
      ...collab,
      id: `collab-${Date.now()}`,
    };
    this.collaborations.unshift(newRecord);
    return { ...newRecord };
  }

  async updateStatus(
    id: string,
    status: CollaborationLifecycle,
  ): Promise<CollaborationRecord | null> {
    const index = this.collaborations.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.collaborations[index] = { ...this.collaborations[index]!, status };
    return { ...this.collaborations[index]! };
  }
}

export const mockCollaborationRepository = new MockCollaborationRepository();

