import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Score {
    discipline: Discipline;
    date: string;
    shooterName: string;
    distance: bigint;
    scoreValue: bigint;
}
export interface UserProfile {
    name: string;
}
export enum Discipline {
    Rifle = "Rifle",
    Pistol = "Pistol"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdminByPrincipal(adminPrincipal: Principal): Promise<void>;
    addScore(id: string, shooterName: string, discipline: Discipline, distance: bigint, scoreValue: bigint, date: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteScore(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getScores(): Promise<Array<Score>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantAdminRole(target: Principal): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
