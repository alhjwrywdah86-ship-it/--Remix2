export type Language = "ar" | "en";

export interface TeacherProfile {
  name: string;
  specialization: string;
  stage: "المرحلة الأساسية" | "المرحلة الثانوية" | "جميع المراحل";
  grades: string[];
  subjects: string[];
  preferredStrategies: string[];
  prepStyle: "ورقي حسي تفاعلي" | "مختصر مركز" | "تفصيلي شامل";
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  homework: number; // Out of 30
  participation: number; // Out of 20
  exam: number; // Out of 50
  finalScore: number; // Out of 100 (automatically computed: homework + participation + exam)
  notes: string;
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

