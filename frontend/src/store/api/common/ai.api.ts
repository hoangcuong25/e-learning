import axiosClient from "@/lib/axiosClient";

export const explainTermApi = async (term: string) => {
  const res = await axiosClient.post("/ai/term", {
    term,
    userLevel: "Beginner",
    field: "General IT",
  });

  return res.data;
};

export const chatLessonApi = async (data: {
  question: string;
  lessonId: number;
}): Promise<{ answer: string; hasContext: boolean }> => {
  const response = await axiosClient.post("/ai/chat-lesson", data);
  return response.data.data;
};
