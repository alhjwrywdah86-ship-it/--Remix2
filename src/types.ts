export type Language = "ar" | "en";
export type UserRole = "teacher" | "student" | "parent" | "admin" | "supervisor";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  specialization?: string;
  school?: string;
  grade?: string;
  stage?: "المرحلة الأساسية" | "المرحلة الثانوية" | "جميع المراحل";
  experienceYears?: number;
  achievements?: string[];
  savedItemsCount?: number;
}

export interface TeacherProfile {
  name: string;
  specialization: string;
  stage: "المرحلة الأساسية" | "المرحلة الثانوية" | "جميع المراحل";
  grades: string[];
  subjects: string[];
  preferredStrategies: string[];
  prepStyle: "ورقي حسي تفاعلي" | "مختصر مركز" | "تفصيلي شامل";
  school?: string;
  experienceYears?: number;
  achievements?: string[];
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  classroomId?: string;
  homework: number; // Out of 30
  participation: number; // Out of 20
  exam: number; // Out of 50
  finalScore: number; // Out of 100 (automatically computed: homework + participation + exam)
  notes: string;
}

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  subject: string;
  teacherName: string;
  students: Student[];
  createdAt: string;
}

export interface AttendanceEntry {
  studentId: string;
  status: "present" | "absent" | "late";
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  classroomId: string;
  date: string;
  entries: AttendanceEntry[];
  recordedBy: string;
}

export interface OnlineQuiz {
  id: string;
  title: string;
  classroomId: string;
  classroomName: string;
  grade: string;
  subject: string;
  durationMinutes: number;
  questions: ExamQuestion[];
  publishedAt: string;
  isClosed?: boolean;
}

export interface StudentQuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: Record<number, string>;
  submittedAt: string;
  teacherFeedback?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "quiz" | "result" | "system" | "remedial";
  createdAt: string;
  read: boolean;
  targetRole?: UserRole;
}

export interface AIRecommendation {
  id: string;
  targetRole: UserRole;
  title: string;
  summary: string;
  actionItems: string[];
  type: "remedial" | "enrichment" | "methodology";
  createdAt: string;
}

export interface StudentPerformanceAnalysis {
  topPerformers: string[];
  studentsNeedingSupport: string[];
  weaknessAnalysis: string[];
  remedialSuggestions: string[];
  overallClassSummary: string;
}

export interface ExamQuestion {
  type: "mcq" | "true_false" | "essay" | "fill_in" | "ordering" | "matching";
  questionText: string;
  options?: string[];
  matchingPairs?: { item: string; match: string }[];
  correctAnswer: string;
  explanation?: string;
  points?: number;
}

export interface TableOfSpecificationsRow {
  topic: string;
  weight: string;
  cognitiveLevel: string;
  questionNumbers: string;
}

export interface ExamProposal {
  title: string;
  questions: ExamQuestion[];
  answerKeyNotes?: string;
  tableOfSpecifications?: TableOfSpecificationsRow[];
}

export interface InteractiveActivity {
  gameName: string;
  strategy: string;
  description: string;
  environmentalAdaptation: string;
}

export interface MindMapBranch {
  heading: string;
  items: string[];
}

export interface MindMap {
  mainTopic: string;
  branches: MindMapBranch[];
}

export interface LessonPlan {
  title: string;
  metadata: {
    grade: string;
    subject: string;
    duration: string;
    curriculum: string;
    lessonType?: string;
    teachingStrategy?: string;
    studentLevel?: string;
  };
  objectives: string[];
  materials: string[];
  introduction: string[];
  presentationSlides: {
    slideTitle: string;
    slideContent: string[];
  }[];
  teacherActivities?: string[];
  studentActivities?: string[];
  assessment: string[];
  homework: string;
  philosophicalTip: string;
  examProposal?: ExamProposal;
  interactiveActivities?: InteractiveActivity[];
  mindMap?: MindMap;
}

export interface QuestionBankItem {
  id: string;
  grade: string;
  subject: string;
  unit: string;
  topic: string;
  question: ExamQuestion;
  createdAt: string;
}

export interface WorksheetExercise {
  id: string;
  type: string;
  question: string;
  options?: string[];
  answerSpaceLines?: number;
  sampleAnswer?: string;
}

export interface WorksheetData {
  id: string;
  title: string;
  metadata: {
    grade: string;
    subject: string;
    lesson: string;
    unit?: string;
  };
  introduction: string;
  conceptSummary: string;
  workedExamples: {
    problem: string;
    solution: string;
  }[];
  exercises: WorksheetExercise[];
  homeworkTask: string;
  createdAt: string;
}

export interface ClassroomActivityData {
  id: string;
  title: string;
  metadata: {
    grade: string;
    subject: string;
    lesson: string;
    objective: string;
  };
  openingActivity: {
    title: string;
    duration: string;
    description: string;
  };
  groupActivity: {
    title: string;
    duration: string;
    description: string;
    strategy: string;
  };
  teacherRole: string;
  studentRole: string;
  requiredTools: string[];
  assessmentMethod: string;
  createdAt: string;
}

export interface SummaryResult {
  docTitle: string;
  overallSummary: string;
  keyObjectives: string[];
  valuesAndSkills: string[];
  coreConcepts: {
    term: string;
    definition: string;
  }[];
  lessonHooks: string[];
  contemplativeInsight: string;
}

export interface ParentMessage {
  letterSubject: string;
  letterBody: string;
  schoolHomeCooperationTip: string;
}

export interface CurriculumTipResult {
  title: string;
  keyPedagogicalAdvice: string[];
  unpluggedClassroomActivity: string;
  motivationalQuote: string;
}

export interface CurriculumBookData {
  id: string;
  name: string;
  country: string;
  subject: string;
  grade: string;
  term: "الجزء الأول" | "الجزء الثاني" | "دليل المعلم";
  fileType: string;
  size: number;
  uploadedAt: string;
  text?: string;
}

// --- PHASE 5: COMMERCIAL SAAS & ENTERPRISE TYPES ---
export type SubscriptionTier = "free" | "pro_teacher" | "school_enterprise";

export interface SubscriptionPlan {
  id: SubscriptionTier;
  nameAr: string;
  nameEn: string;
  priceMonthlyUSD: number;
  priceYearlyUSD: number;
  aiGenerationsPerMonth: number; // -1 for unlimited
  maxClassrooms: number;
  maxStudentsPerClass: number;
  featuresAr: string[];
  featuresEn: string[];
  popular?: boolean;
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  status: "active" | "canceled" | "expired" | "trial";
  startDate: string;
  expiryDate: string;
  aiCreditsUsedThisMonth: number;
  maxMonthlyCredits: number;
  autoRenew: boolean;
  paymentMethod?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "security";
  category: "ai" | "auth" | "quiz" | "system" | "subscription";
  message: string;
  details?: string;
  ipAddress?: string;
}

export interface SystemBackupPayload {
  exportDate: string;
  version: string;
  appTitle: string;
  author: string;
  data: {
    teacherProfile?: TeacherProfile;
    classrooms?: Classroom[];
    attendanceRecords?: AttendanceRecord[];
    onlineQuizzes?: OnlineQuiz[];
    questionBankItems?: QuestionBankItem[];
    worksheets?: WorksheetData[];
    aiRecommendations?: AIRecommendation[];
    subscription?: UserSubscription;
    educationalMemory?: UserEducationalMemory;
  };
}

// --- PHASE 6: ADVANCED AI LAYER TYPES ---

export interface AITeacherAgentMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  practicalTips?: string[];
  suggestedActivities?: string[];
  assessmentIdeas?: string[];
  pedagogicalStrategy?: string;
  curriculumReferences?: string[];
}

export interface StudentLevelReport {
  studentId: string;
  studentName: string;
  grade: string;
  subject: string;
  overallMasteryPercentage: number;
  masteryLevel: "متميز" | "جيد جداً" | "متوسط" | "يحتاج دعم وتدخل عاجل";
  strengths: string[];
  weaknesses: string[];
  frequentMistakes: string[];
  suggestedRemedialPlanSummary: string;
  recommendedImprovementActivities: string[];
}

export interface RemedialPlanData {
  id: string;
  studentOrGroupName: string;
  grade: string;
  subject: string;
  weakSkill: string;
  severityLevel: "خفيف" | "متوسط" | "شديد";
  remedialGoal: string;
  remedialSteps: string[];
  suggestedActivities: string[];
  practiceExercises: {
    question: string;
    answerKey: string;
  }[];
  progressMetrics: string;
  estimatedDays: number;
  createdAt: string;
}

export interface EssayGradingResult {
  questionText: string;
  modelAnswer: string;
  studentAnswer: string;
  suggestedScore: number;
  maxPoints: number;
  isFullCredit: boolean;
  feedback: string;
  mistakeReason?: string;
  strengths?: string[];
  keywordsFound: string[];
}

export interface SmartSearchResultItem {
  id: string;
  type: "book" | "lesson" | "quiz" | "question";
  title: string;
  subtitle: string;
  snippet: string;
  grade?: string;
  subject?: string;
  relevanceScore?: number;
  metadata?: any;
}

export interface SmartSearchResult {
  query: string;
  aiSummary: string;
  items: SmartSearchResultItem[];
}

export interface UserEducationalMemory {
  teacherId: string;
  subjectsTaught: string[];
  gradesTaught: string[];
  preferredTeachingStyle: string;
  frequentTopics: string[];
  pastPreparationsCount: number;
  studentWeakAreas: Record<string, string[]>;
  updatedAt: string;
}

// --- PHASE 7: INTEGRATED LMS PLATFORM TYPES ---

export interface Assignment {
  id: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  classroomId: string;
  classroomName: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  totalPoints: number;
  attachedFiles?: { name: string; url: string }[];
  externalLinks?: string[];
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionText: string;
  attachedFiles?: { name: string; url: string }[];
  submittedAt: string;
  score?: number;
  status: "pending" | "graded" | "late";
  teacherFeedback?: string;
  aiAnalysis?: {
    strengths: string[];
    commonMistakes: string[];
    suggestedFeedback: string;
  };
}

export interface DailyTrackingEntry {
  id: string;
  studentId: string;
  studentName: string;
  classroomId: string;
  date: string;
  attendance: "present" | "absent" | "late" | "excused";
  participationLevel: "ممتاز" | "جيد جداً" | "متوسط" | "ضعيف";
  homeworkCompleted: boolean;
  notes: string;
  badgeAwarded?: string;
}

export interface ParentProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  linkedStudentIds: string[];
  linkedStudents?: {
    id: string;
    name: string;
    grade: string;
    school: string;
  }[];
}

export interface EducationalMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string; // "all_students", "all_parents", classroomId, or specific userId
  recipientName: string;
  subject: string;
  body: string;
  category: "notice" | "message" | "alert" | "report";
  sentAt: string;
  read: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "academic" | "attendance" | "participation" | "teacher_productivity";
  pointsValue: number;
  unlockedAt?: string;
}

export interface StudentGamificationState {
  studentId: string;
  studentName: string;
  points: number;
  level: number;
  badges: AchievementBadge[];
  history: { date: string; reason: string; pointsChanged: number }[];
}

export interface VirtualClassroomPost {
  id: string;
  classroomId: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  content: string;
  postType: "announcement" | "lesson_material" | "discussion" | "activity";
  attachments?: { name: string; url: string }[];
  likesCount: number;
  comments: { id: string; authorName: string; text: string; createdAt: string }[];
  createdAt: string;
}

export interface SchoolRecord {
  id: string;
  name: string;
  region: string;
  educationalStage: string;
  teachersCount: number;
  studentsCount: number;
  classroomsCount: number;
  principalName: string;
  status: "نشط" | "تحت المراجعة";
}

export interface SystemAdminOverview {
  totalSchools: number;
  totalTeachers: number;
  totalStudents: number;
  totalParents: number;
  totalClassrooms: number;
  totalAssignments: number;
  activeQuizzes: number;
  dailyActiveUsers: number;
  schools: SchoolRecord[];
}



