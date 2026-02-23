import axiosClient from "@/lib/axiosClient";

export const explainTermApi = async (term: string) => {
  const res = await axiosClient.post("/ai/term", {
    term,
    userLevel: "Beginner",
    field: "General IT",
  });

  return res.data;
};
