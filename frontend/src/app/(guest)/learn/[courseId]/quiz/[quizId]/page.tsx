"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchQuizById } from "@/store/slice/quizSlice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const QuizPage = () => {
  const router = useRouter();
  const { courseId, quizId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { currentQuiz, loading } = useSelector(
    (state: RootState) => state.quiz
  );

  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Lấy quiz từ Redux
  useEffect(() => {
    if (quizId) dispatch(fetchQuizById(Number(quizId)));
  }, [quizId, dispatch]);

  // Xử lý chọn đáp án
  const handleSelect = (questionId: number, optionId: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Chấm điểm trực tiếp ở FE
  const handleSubmit = () => {
    if (!currentQuiz?.questions?.length) return;

    let correctCount = 0;
    currentQuiz.questions.forEach((q: any) => {
      const chosen = answers[q.id];
      const correctOption = q.options?.find((o: any) => o.isCorrect);
      if (chosen && correctOption && chosen === correctOption.id) {
        correctCount++;
      }
    });

    const total = currentQuiz.questions.length;
    const percent = Math.round((correctCount / total) * 100);

    setScore(percent);
    setSubmitted(true);
  };

  // Quay lại bài học
  const handleBack = () => {
    router.push(`/learn/${courseId}`);
  };

  if (loading || !currentQuiz) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" />
        Đang tải bài kiểm tra...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Quay lại bài học</span>
          </Button>

          {submitted && score !== null && (
            <div
              className={`flex items-center gap-2 text-lg font-semibold ${
                score >= 50 ? "text-green-600" : "text-red-600"
              }`}
            >
              {score >= 50 ? <CheckCircle2 /> : <XCircle />}
              <span>{score}%</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {currentQuiz.title}
          </h1>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {currentQuiz.questions?.map((q: any, index: number) => {
            const correctOption = q.options?.find((o: any) => o.isCorrect);
            const userChoice = answers[q.id];

            return (
              <div
                key={q.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm"
              >
                <p className="font-medium text-gray-800 mb-3">
                  {index + 1}. {q.questionText}
                </p>

                <div className="space-y-2">
                  {q.options?.map((option: any) => {
                    const isSelected = userChoice === option.id;
                    const isCorrect = option.isCorrect;
                    const showCorrect =
                      submitted && isCorrect && userChoice !== option.id;
                    const showWrong = submitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelect(q.id, option.id)}
                        disabled={submitted}
                        className={`w-full text-left p-3 rounded-lg border transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        } ${
                          showCorrect
                            ? "border-green-600 bg-green-50 text-green-700"
                            : ""
                        } ${
                          showWrong
                            ? "border-red-600 bg-red-50 text-red-700"
                            : ""
                        }`}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Nộp bài
            </Button>
          </div>
        )}

        {/* Result */}
        {submitted && (
          <div className="text-center pt-6 border-t border-gray-200">
            {score !== null && (
              <p
                className={`text-lg font-medium ${
                  score >= 50 ? "text-green-700" : "text-red-700"
                }`}
              >
                {score >= 50
                  ? "🎉 Chúc mừng! Bạn đã vượt qua bài kiểm tra."
                  : "😢 Bạn chưa đạt yêu cầu, hãy thử lại nhé."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
