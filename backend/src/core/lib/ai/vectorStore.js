import { getEmbedding } from "./localEmbedding";

export async function search(question, lessonId) {
  const queryEmbedding = await getEmbedding(question);

  const results = vectorDB
    .filter((item) => item.lessonId === lessonId)
    .map((item) => ({
      content: item.content,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }));

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 3);
}
