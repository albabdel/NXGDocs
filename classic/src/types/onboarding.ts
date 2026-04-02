/**
 * Onboarding Types for Getting Started Guided Flow
 * Static help center implementation - no backend required
 */

export enum StepStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    BLOCKED = 'blocked'
}

export enum StepType {
    ACTION = 'action',           // Click to navigate or perform task
    CONFIRMATION = 'confirmation', // Manual checkmark confirmation
    VALIDATION = 'validation'     // Auto-check based on criteria
}

export enum UserRole {
    ADMIN = 'admin',
    OPERATOR = 'operator',
    INSTALLER = 'installer',
    MANAGER = 'manager'
}

export enum SystemHealthStatus {
    OK = 'ok',
    WARNING = 'warning',
    BLOCKED = 'blocked'
}

export interface LearningContent {
    videoId?: string;           // YouTube video ID
    videoSrc?: string;          // Direct video source or Cloudinary ID
    title?: string;
    description?: string;
    diagram?: string;           // Path to diagram image
    tips?: string[];
    warnings?: string[];
}

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    type: StepType;
    roles: UserRole[];          // Which roles can see this step
    roleSpecificTitle?: Partial<Record<UserRole, string>>; // Different titles per role
    status?: StepStatus;        // Runtime status
    actionLink?: string;        // Link for ACTION type
    learningContent?: LearningContent;
}

export interface OnboardingPhase {
    id: string;
    title: string;
    description: string;
    steps: OnboardingStep[];
    unlocked?: boolean;         // Runtime unlock status
}

export interface SystemHealthItem {
    id: string;
    name: string;
    status: SystemHealthStatus;
    lastChecked?: string;       // Display only (e.g., "2 mins ago")
    message: string;            // Why it matters
    linkedStepId?: string;      // Link back to setup step
}

export interface OnboardingState {
    completedSteps: string[];   // Array of step IDs
    activePhaseId?: string;     // Currently expanded phase
    activeStepId?: string;      // Currently active step
}

export interface NextAction {
    text: string;
    link?: string;
    onClick?: () => void;
}
