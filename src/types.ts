export type Language = "ar" | "en";

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

export interface ExamQuestion {
  type: "mcq" | "true_false" | "essay";
  questionText: string;
  options?: string[];
  correctAnswer: string;
}

export interface ExamProposal {
  title: string;
  questions: ExamQuestion[];
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
  };
  objectives: string[];
  materials: string[];
  introduction: string[];
  presentationSlides: {
    slideTitle: string;
    slideContent: string[];
  }[];
  assessment: string[];
  homework: string;
  philosophicalTip: string;
  examProposal?: ExamProposal;
  interactiveActivities?: InteractiveActivity[];
  mindMap?: MindMap;
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
