import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CornerCase {
    id: bigint;
    description: string;
    scenario: string;
}
export interface Bug {
    id: bigint;
    description: string;
    severity: Severity;
}
export interface TestCase {
    id: bigint;
    description: string;
    steps: string;
}
export interface Website {
    id: bigint;
    url: string;
    testCases: Array<TestCase>;
    title: string;
    owner: Principal;
    bugs: Array<Bug>;
    cornerCases: Array<CornerCase>;
}
export interface UserProfile {
    name: string;
}
export enum Severity {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBug(websiteId: bigint, description: string, severity: Severity): Promise<void>;
    addCornerCase(websiteId: bigint, description: string, scenario: string): Promise<void>;
    addTestCase(websiteId: bigint, description: string, steps: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBug(websiteId: bigint, bugId: bigint): Promise<void>;
    deleteCornerCase(websiteId: bigint, cornerCaseId: bigint): Promise<void>;
    deleteTestCase(websiteId: bigint, testCaseId: bigint): Promise<void>;
    generateWebsiteTestingData(url: string, title: string): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWebsite(websiteId: bigint): Promise<Website | null>;
    getWebsitesByUser(): Promise<Array<Website>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBug(websiteId: bigint, bugId: bigint, description: string, severity: Severity): Promise<void>;
    updateCornerCase(websiteId: bigint, cornerCaseId: bigint, description: string, scenario: string): Promise<void>;
    updateTestCase(websiteId: bigint, testCaseId: bigint, description: string, steps: string): Promise<void>;
}
