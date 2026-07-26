export interface OfflineResource {
  id: string;
  type: "lesson_plan" | "worksheet" | "quiz" | "summary" | "activity" | "presentation";
  title: string;
  subject: string;
  grade: string;
  content: any;
  createdAt: string;
  synced: boolean;
}

const OFFLINE_KEY = "arab_teacher_offline_resources_v1";

export const getOfflineResources = (): OfflineResource[] => {
  try {
    const raw = localStorage.getItem(OFFLINE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read offline resources:", err);
    return [];
  }
};

export const saveOfflineResource = (resource: Omit<OfflineResource, "id" | "createdAt" | "synced">): OfflineResource => {
  const current = getOfflineResources();
  
  // Check if resource with same title and type already exists locally to prevent duplicates
  const existingIndex = current.findIndex(r => r.title === resource.title && r.type === resource.type);
  
  const newRes: OfflineResource = {
    ...resource,
    id: existingIndex >= 0 ? current[existingIndex].id : `off_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toLocaleDateString("ar-SA"),
    synced: navigator.onLine
  };

  let updated: OfflineResource[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = newRes;
  } else {
    updated = [newRes, ...current];
  }

  try {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save offline resource:", err);
  }

  return newRes;
};

export const deleteOfflineResource = (id: string): void => {
  const current = getOfflineResources();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete offline resource:", err);
  }
};

export const syncOfflineResourcesWithServer = async (): Promise<number> => {
  if (!navigator.onLine) return 0;

  const current = getOfflineResources();
  const unsynced = current.filter((r) => !r.synced);

  if (unsynced.length === 0) return 0;

  let syncedCount = 0;
  for (const item of unsynced) {
    try {
      const res = await fetch("/api/teacher-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: item.type,
          title: item.title,
          grade: item.grade || "الصف الثامن الأساسي",
          subject: item.subject || "اللغة العربية",
          data: item.content
        })
      });

      if (res.ok) {
        item.synced = true;
        syncedCount++;
      }
    } catch (err) {
      console.error("Sync error for item:", item.id, err);
    }
  }

  try {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to update sync status:", err);
  }

  return syncedCount;
};
