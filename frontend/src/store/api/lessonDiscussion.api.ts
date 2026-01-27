  import axiosClient from "@/lib/axiosClient";

  // 1. Get all questions for a lesson
  export const getQuestionsApi = async (lessonId: number) => {
    const response = await axiosClient.get(`/lesson-discussion/${lessonId}/questions`);
    return response.data;
  };

  // 2. Create a question
  export const createQuestionApi = async (lessonId: number, content: string) => {
    const response = await axiosClient.post(`/lesson-discussion/${lessonId}/questions`, { content });
    return response.data;
  };

  // 3. Create an answer
  export const createAnswerApi = async (questionId: number, content: string) => {
    const response = await axiosClient.post(`/lesson-discussion/questions/${questionId}/answers`, { content });
    return response.data;
  };

  // 4. Create a reply
  export const createReplyApi = async (answerId: number, content: string) => {
    const response = await axiosClient.post(`/lesson-discussion/answers/${answerId}/replies`, { content });
    return response.data;
  };

  // 5. Delete a question
  export const deleteQuestionApi = async (id: number) => {
    const response = await axiosClient.delete(`/lesson-discussion/questions/${id}`);
    return response.data;
  };

  // 6. Delete an answer or reply
  export const deleteAnswerApi = async (id: number) => {
    const response = await axiosClient.delete(`/lesson-discussion/answers/${id}`);
    return response.data;
  };

  // 7. Delete my question
  export const deleteMyQuestionApi = async (id: number) => {
    const response = await axiosClient.delete(`/lesson-discussion/my-questions/${id}`);
    return response.data;
  };

  // 8. Delete my answer or reply
  export const deleteMyAnswerApi = async (id: number) => {
    const response = await axiosClient.delete(`/lesson-discussion/my-answers/${id}`);
    return response.data;
  };
