"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchQuizById } from "@/store/slice/course/quizSlice";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Trophy, 
  AlertCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    if (quizId) dispatch(fetchQuizById(Number(quizId)));
  }, [quizId, dispatch]);

  const handleSelect = (questionId: number, optionId: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    router.push(`/learn/${courseId}`);
  };

  if (loading || !currentQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-xl shadow-indigo-600/5">
           <Loader2 className="animate-spin" size={32} />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Initializing Assessment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 py-12 px-4 md:px-8 lg:py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header & Progress */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-8 px-2">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="group flex items-center gap-4 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Back to learning</span>
          </motion.button>

          <AnimatePresence>
            {submitted && score !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-4 px-6 py-3 rounded-2xl shadow-xl transition-all ${
                  score >= 50 ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-rose-500 text-white shadow-rose-500/20"
                }`}
              >
                {score >= 50 ? <Trophy size={20} /> : <AlertCircle size={20} />}
                <span className="text-xl font-black tracking-tighter">Your Score: {score}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Quiz Intro */}
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100">
              <Zap size={14} fill="currentColor" />
              Interactive Lab
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
             {currentQuiz.title}
           </h1>
           <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">
              <span className="flex items-center gap-2"><HelpCircle size={14} /> {currentQuiz.questions?.length} Questions</span>
              <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
              <span className="flex items-center gap-2"><Clock size={14} /> No Time Limit</span>
           </div>
        </div>

        {/* Results Banner */}
        <AnimatePresence>
           {submitted && (
              <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl text-center space-y-8 relative overflow-hidden group"
              >
                 <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 opacity-5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                 
                 <div className="relative z-10 space-y-6">
                    <div className={`w-24 h-24 mx-auto rounded-[2.5rem] flex items-center justify-center transition-all ${
                      score && score >= 50 ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    }`}>
                       {score && score >= 50 ? <Trophy size={48} /> : <AlertCircle size={48} />}
                    </div>
                    
                    <div className="space-y-2">
                       <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                          {score && score >= 50 ? "Challenge Completed!" : "Keep Practicing!"}
                       </h2>
                       <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                          {score && score >= 50 
                            ? "Great job! You've mastered this assessment with a score of " + score + "%." 
                            : "Don't give up. Review the material and try the assessment again to improve your score."}
                       </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                       <button 
                         onClick={() => { setSubmitted(false); setAnswers({}); }}
                         className="h-14 px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl uppercase tracking-widest text-[10px] transition-all"
                       >
                         Retake Exam
                       </button>
                       <button 
                         onClick={handleBack}
                         className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px] transition-all"
                       >
                         Continue Learning
                       </button>
                    </div>
                 </div>
              </motion.div>
           )}
        </AnimatePresence>

        {/* Questions Area */}
        <div className="space-y-8 pb-20">
          {currentQuiz.questions?.map((q: any, index: number) => {
            const userChoice = answers[q.id];

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-10 group hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                   <div className="w-12 h-12 bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl transition-colors shrink-0">
                      {index + 1}
                   </div>
                   <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight pt-1 leading-tight">
                     {q.questionText}
                   </h2>
                </div>

                <div className="grid gap-4">
                  {q.options?.map((option: any) => {
                    const isSelected = userChoice === option.id;
                    const isCorrect = option.isCorrect;
                    const showCorrect = submitted && isCorrect;
                    const showWrong = submitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelect(q.id, option.id)}
                        disabled={submitted}
                        className={`
                          w-full p-6 text-left rounded-3xl border text-sm font-bold tracking-tight transition-all relative overflow-hidden group/option
                          ${isSelected 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                            : "bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30"}
                          ${showCorrect ? "!bg-emerald-500 !border-emerald-500 !text-white !shadow-emerald-500/20 translate-x-1" : ""}
                          ${showWrong ? "!bg-rose-500 !border-rose-500 !text-white !shadow-rose-500/20" : ""}
                        `}
                      >
                         <div className="flex items-center justify-between gap-4 relative z-10">
                            <span>{option.text}</span>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                               isSelected ? "bg-white/20 border-white/40" : "bg-white border-slate-100"
                            }`}>
                               {showCorrect ? <CheckCircle2 size={16} /> : showWrong ? <XCircle size={16} /> : isSelected ? <div className="w-2.5 h-2.5 bg-white rounded-full" /> : null}
                            </div>
                         </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submit Action */}
        {!submitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sticky bottom-8 z-50 flex justify-center"
          >
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < (currentQuiz?.questions?.length || 0)}
              className="h-16 px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-full shadow-2xl shadow-indigo-600/40 uppercase tracking-widest text-[11px] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Finish Assessment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};


export default QuizPage;
