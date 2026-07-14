/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Criterion {
  id: string;
  name: string;
  score: number; // 1 to 10
  notes?: string; // custom observations, goals, or notes
}

export interface SavedWheel {
  id: string;
  title: string;
  date: string; // ISO string or readable format
  criteria: Criterion[];
  overallNotes?: string;
}

export interface User {
  username: string;
  passwordHash: string; // stored client-side in localStorage for the static app demo
  wheels: SavedWheel[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}
