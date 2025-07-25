export interface User {
  id: string;
  email: string;
  role: 'VOLUNTEER' | 'COORDINATOR' | 'ADMIN';
  volunteer?: VolunteerProfile;
  coordinator?: CoordinatorProfile;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  languages: string[];
  bio?: string;
  profilePicture?: string;
  skills: Skill[];
  achievements: Achievement[];
  participations: OpportunityParticipation[];
}

export interface CoordinatorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department: string;
  bio?: string;
  opportunities: Opportunity[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  category: string;
  volunteerId: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'FIELD_WORK' | 'RESEARCH' | 'DOCUMENTATION' | 'EDUCATION' | 'MAINTENANCE';
  status: 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  location: string;
  startDate: string;
  endDate?: string;
  maxParticipants?: number;
  requiredSkills: string[];
  coordinatorId: string;
  coordinator?: CoordinatorProfile;
  participations: OpportunityParticipation[];
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityParticipation {
  id: string;
  opportunityId: string;
  volunteerId: string;
  status: 'APPLIED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  appliedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  feedback?: string;
  volunteer?: VolunteerProfile;
  opportunity?: Opportunity;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'PARTICIPATION' | 'LEADERSHIP' | 'EXPERTISE' | 'MILESTONE';
  earnedAt: string;
  volunteerId: string;
  opportunityId?: string;
  tokenId?: string;
  tokenContract?: string;
  volunteer?: VolunteerProfile;
  opportunity?: Opportunity;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'VOLUNTEER' | 'COORDINATOR';
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string; // For coordinators
  dateOfBirth?: string; // For volunteers
  nationality?: string; // For volunteers
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  totalOpportunities: number;
  activeOpportunities: number;
  totalVolunteers: number;
  totalAchievements: number;
  userParticipations?: number;
  userAchievements?: number;
}

// Museum-related types
export interface Museum {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  description?: string;
  floorPlanImage?: string;
  floorPlanWidth?: number;
  floorPlanHeight?: number;
  openingHours?: string;
  contactInfo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  artifacts?: Artifact[];
  tours?: Tour[];
}

export interface Artifact {
  id: string;
  museumId: string;
  name: string;
  description: string;
  category: ArtifactCategory;
  origin?: string;
  period?: string;
  materials: string[];
  significance?: string;
  talkingPoints: string[];
  images: string[];
  xPosition: number;
  yPosition: number;
  floor: number;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
  museum?: Museum;
  tourStops?: TourStop[];
}

export type ArtifactCategory = 
  | 'SCULPTURE'
  | 'PAINTING'
  | 'TEXTILE'
  | 'POTTERY'
  | 'JEWELRY'
  | 'WEAPON'
  | 'MANUSCRIPT'
  | 'RELIGIOUS_OBJECT'
  | 'ARCHAEOLOGICAL_FIND'
  | 'TRADITIONAL_TOOL'
  | 'INTERACTIVE_DISPLAY'
  | 'MULTIMEDIA';

export interface Tour {
  id: string;
  museumId: string;
  guideId: string;
  title: string;
  description?: string;
  estimatedDuration: number;
  maxParticipants?: number;
  startTime: string;
  endTime?: string;
  status: TourStatus;
  startPointX?: number;
  startPointY?: number;
  endPointX?: number;
  endPointY?: number;
  optimizedPath?: any;
  aiNarrative?: string;
  createdAt: string;
  updatedAt: string;
  museum?: Museum;
  guide?: User;
  stops?: TourStop[];
}

export type TourStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface TourStop {
  id: string;
  tourId: string;
  artifactId: string;
  stopOrder: number;
  estimatedTime?: number;
  customNotes?: string;
  aiTransition?: string;
  createdAt: string;
  updatedAt: string;
  tour?: Tour;
  artifact?: Artifact;
}
