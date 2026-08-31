import type { IOpportunityRepository, ISavedOpportunityRepository } from "./types";
import type { Opportunity } from "@/types";
import { OPPORTUNITIES_CATALOG } from "@/data/opportunities-catalog";
import { OpportunityService } from "@/services/opportunity-service";
import { isSupabaseConfigured } from "@/lib/supabase";

export class MockOpportunityRepository implements IOpportunityRepository {
  private opportunities: Opportunity[] = [...OPPORTUNITIES_CATALOG];

  async getAll(): Promise<Opportunity[]> {
    return [...this.opportunities];
  }

  async getById(id: string): Promise<Opportunity | null> {
    const found = this.opportunities.find((o) => o.id === id);
    return found ? { ...found } : null;
  }

  async search(filters?: {
    type?: string;
    skills?: string[];
    workMode?: string;
    location?: string;
    query?: string;
  }): Promise<Opportunity[]> {
    return this.opportunities.filter((opp) => {
      if (filters?.type && opp.type.toLowerCase() !== filters.type.toLowerCase()) return false;
      if (filters?.workMode && opp.workMode.toLowerCase() !== filters.workMode.toLowerCase()) return false;
      if (filters?.location && !opp.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesComp = opp.company.toLowerCase().includes(q);
        const matchesSkill = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesComp && !matchesSkill) return false;
      }
      return true;
    });
  }

  async create(opportunity: Omit<Opportunity, "id">): Promise<Opportunity> {
    const newOpp: Opportunity = {
      ...opportunity,
      id: `opp-${Date.now()}`,
    };
    this.opportunities.unshift(newOpp);
    return { ...newOpp };
  }

  async update(id: string, patch: Partial<Opportunity>): Promise<Opportunity> {
    const index = this.opportunities.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Opportunity with ID ${id} not found.`);
    this.opportunities[index] = { ...this.opportunities[index]!, ...patch };
    return { ...this.opportunities[index]! };
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.opportunities.length;
    this.opportunities = this.opportunities.filter((o) => o.id !== id);
    return this.opportunities.length < initialLen;
  }

  async publish(id: string): Promise<boolean> {
    const opp = await this.getById(id);
    if (!opp) return false;
    opp.status = "Published";
    return true;
  }

  async close(id: string): Promise<boolean> {
    const opp = await this.getById(id);
    if (!opp) return false;
    opp.status = "Closed";
    return true;
  }
}

export class MockSavedOpportunityRepository implements ISavedOpportunityRepository {
  private savedIds: Set<string> = new Set(["opp-1", "opp-4"]);

  async getSavedIds(_studentId: string): Promise<string[]> {
    return Array.from(this.savedIds);
  }

  async save(_studentId: string, opportunityId: string): Promise<boolean> {
    this.savedIds.add(opportunityId);
    return true;
  }

  async unsave(_studentId: string, opportunityId: string): Promise<boolean> {
    return this.savedIds.delete(opportunityId);
  }
}

export class SupabaseOpportunityRepository implements IOpportunityRepository {
  private mockFallback = new MockOpportunityRepository();

  async getAll(): Promise<Opportunity[]> {
    if (!isSupabaseConfigured) {
      return this.mockFallback.getAll();
    }
    return OpportunityService.getAllOpportunities();
  }

  async getById(id: string): Promise<Opportunity | null> {
    if (!isSupabaseConfigured || id.startsWith("opp-")) {
      return this.mockFallback.getById(id);
    }
    return OpportunityService.getOpportunityById(id);
  }

  async search(filters?: {
    type?: string;
    skills?: string[];
    workMode?: string;
    location?: string;
    query?: string;
  }): Promise<Opportunity[]> {
    const all = await this.getAll();
    return all.filter((opp) => {
      if (filters?.type && opp.type.toLowerCase() !== filters.type.toLowerCase()) return false;
      if (filters?.workMode && opp.workMode.toLowerCase() !== filters.workMode.toLowerCase()) return false;
      if (filters?.location && !opp.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesComp = opp.company.toLowerCase().includes(q);
        const matchesSkill = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesComp && !matchesSkill) return false;
      }
      return true;
    });
  }

  async create(opportunity: Omit<Opportunity, "id">, companyId?: string, userId?: string): Promise<Opportunity> {
    if (!isSupabaseConfigured) {
      return this.mockFallback.create(opportunity);
    }
    return OpportunityService.createOpportunity(opportunity, companyId || "comp-default", userId);
  }

  async update(id: string, patch: Partial<Opportunity>): Promise<Opportunity> {
    if (!isSupabaseConfigured || id.startsWith("opp-")) {
      return this.mockFallback.update(id, patch);
    }
    return this.mockFallback.update(id, patch);
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || id.startsWith("opp-")) {
      return this.mockFallback.delete(id);
    }
    return this.mockFallback.delete(id);
  }

  async publish(id: string): Promise<boolean> {
    return this.mockFallback.publish(id);
  }

  async close(id: string): Promise<boolean> {
    return this.mockFallback.close(id);
  }
}

export class SupabaseSavedOpportunityRepository implements ISavedOpportunityRepository {
  private mockFallback = new MockSavedOpportunityRepository();

  async getSavedIds(studentId: string): Promise<string[]> {
    if (!isSupabaseConfigured || !studentId) {
      return this.mockFallback.getSavedIds(studentId);
    }
    return OpportunityService.getSavedOpportunityIds(studentId);
  }

  async save(studentId: string, opportunityId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !studentId || opportunityId.startsWith("opp-")) {
      return this.mockFallback.save(studentId, opportunityId);
    }
    return OpportunityService.saveOpportunity(studentId, opportunityId);
  }

  async unsave(studentId: string, opportunityId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !studentId || opportunityId.startsWith("opp-")) {
      return this.mockFallback.unsave(studentId, opportunityId);
    }
    return OpportunityService.unsaveOpportunity(studentId, opportunityId);
  }
}

export const mockOpportunityRepository = new MockOpportunityRepository();
export const opportunityRepository = new SupabaseOpportunityRepository();

export const mockSavedOpportunityRepository = new MockSavedOpportunityRepository();
export const savedOpportunityRepository = new SupabaseSavedOpportunityRepository();
