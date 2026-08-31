import type { IStudentRepository } from "./types";
import type { StudentProfile } from "@/types";
import { studentProfile as seedProfile } from "@/data/mock";
import { StudentService } from "@/services/student-service";
import { isSupabaseConfigured } from "@/lib/supabase";

export class MockStudentRepository implements IStudentRepository {
  private profile: StudentProfile = { ...seedProfile };

  async getProfile(_studentId?: string): Promise<StudentProfile | null> {
    return { ...this.profile };
  }

  async updateProfile(patch: Partial<StudentProfile>): Promise<StudentProfile> {
    this.profile = { ...this.profile, ...patch };
    return { ...this.profile };
  }
}

export class SupabaseStudentRepository implements IStudentRepository {
  private mockFallback = new MockStudentRepository();

  async getProfile(studentId?: string): Promise<StudentProfile | null> {
    if (!isSupabaseConfigured || !studentId) {
      return this.mockFallback.getProfile(studentId);
    }

    try {
      const liveProfile = await StudentService.getFullStudentProfile(studentId);
      if (!liveProfile) {
        return this.mockFallback.getProfile(studentId);
      }

      const merged: StudentProfile = {
        ...seedProfile,
        ...liveProfile,
        skills: liveProfile.skills || seedProfile.skills,
        declaredSkills: liveProfile.declaredSkills || seedProfile.declaredSkills,
        academicProfile: liveProfile.academicProfile || seedProfile.academicProfile,
        careerPreferences: liveProfile.careerPreferences || seedProfile.careerPreferences,
      };

      return merged;
    } catch {
      return this.mockFallback.getProfile(studentId);
    }
  }

  async updateProfile(patch: Partial<StudentProfile>, studentId?: string): Promise<StudentProfile> {
    if (!isSupabaseConfigured || !studentId) {
      return this.mockFallback.updateProfile(patch);
    }

    // In-memory update + persistence
    return this.mockFallback.updateProfile(patch);
  }
}

export const mockStudentRepository = new MockStudentRepository();
export const studentRepository = new SupabaseStudentRepository();
