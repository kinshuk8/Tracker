"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  q: string;
  a: string[];
}

interface QuizProps {
  data: string;
  contentId: number;
  initialAttempts: number;
  currentBestScore?: number;
}

interface ExtendedQuestion extends Question {
  correctAnswer: string;
  options: string[];
}

interface ExtendedQuizData {
  questions: ExtendedQuestion[];
}


import { submitQuiz } from "../actions";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function Quiz({ data, contentId, initialAttempts, currentBestScore }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); 
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Track attempts locally to update UI immediately
  const [attempts, setAttempts] = useState(initialAttempts);
  const [bestScore, setBestScore] = useState<number | undefined>(currentBestScore);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3 attempts max
  const maxAttempts = 3;
  const isLocked = attempts >= maxAttempts;

  const [quizData, setQuizData] = useState<ExtendedQuizData>({ questions: [] });

  useEffect(() => {
    try {
      const parsed = JSON.parse(data);
      // Handle both formats:
      // 1. { questions: [{ q, a }] } (Legacy/Expected originally)
      // 2. [{ question, options, answer }] (Actual DB format)
      
      let questions: ExtendedQuestion[] = [];

      if (Array.isArray(parsed)) {
        // Handle format 2
        questions = parsed.map((item: any) => ({
          q: item.question,
          a: item.options,
          correctAnswer: item.answer,
          options: [...item.options].sort(() => Math.random() - 0.5),
        }));
      } else if (parsed.questions) {
        // Handle format 1
        questions = parsed.questions.map((q: any) => ({
          ...q,
          correctAnswer: q.a[0],
          options: [...q.a].sort(() => Math.random() - 0.5),
        }));
      }

      setQuizData({ questions });
    } catch (e) {
      console.error("Failed to parse quiz data", e);
    }
  }, [data]);

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleOptionSelect = (value: string) => {
    if (showResult || isSubmitting) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Logic for submission
      if (isLocked) return;
      setIsSubmitting(true);

      let calculatedScore = 0;
      quizData.questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
          calculatedScore++;
        }
      });
      setScore(calculatedScore);
      
      try {
          // Submit to server
          const passed = true; // Assuming any completion counts as 'passed' for now? Or strict pass? 
          // Requirement: "until user has completed... even with test... can't go to next". 
          // Usually means attempt made. But strict pass might be better. Let's assume completion = attempt made for flow, but maybe verify passes?
          // Let's pass 'passed=true' for now to mark progress, but score matters.
          
          const result = await submitQuiz(contentId, calculatedScore, quizData.questions.length, true);
          
          if (result.success) {
              setAttempts(result.attempts || attempts + 1);
              setBestScore(result.bestScore !== null ? result.bestScore : undefined);
              toast.success("Quiz submitted successfully!");
          } else {
              toast.error(result.error || "Failed to submit quiz");
          }
      } catch (e) {
          console.error(e);
          toast.error("Something went wrong");
      } finally {
          setIsSubmitting(false);
          setShowResult(true);
      }
    }
  };

  const handleRetake = () => {
    if (isLocked) return;
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setShowResult(false);
  };

  if (!quizData.questions.length) {
    return <div className="text-red-500">Error loading quiz data.</div>;
  }
  
  // Locked State (Start Screen) if no attempts left and result not shown
  if (isLocked && !showResult) {
      return (
        <Card className="w-full max-w-2xl mx-auto mt-8 border-yellow-200 bg-yellow-50">
             <CardContent className="flex flex-col items-center justify-center p-12 text-center text-yellow-800">
                 <Lock className="w-12 h-12 mb-4 opacity-50" />
                 <h2 className="text-2xl font-bold mb-2">Maximum Attempts Reached</h2>
                 <p className="text-lg mb-4">You have used all {maxAttempts} attempts for this quiz.</p>
                 <div className="bg-white/50 px-6 py-3 rounded-lg border border-yellow-200">
                     <span className="text-sm font-semibold uppercase tracking-wider text-yellow-700">Best Score</span>
                     <div className="text-3xl font-bold">{bestScore ?? 0} / {quizData.questions.length}</div>
                 </div>
             </CardContent>
        </Card>
      );
  }

  if (showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Quiz Completed!</CardTitle>
          <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
             <div>Attempts: <span className="font-bold text-slate-900">{attempts} / {maxAttempts}</span></div>
             <div>Best Score: <span className="font-bold text-green-600">{bestScore ?? score}</span></div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="text-6xl font-bold text-blue-600">
            {Math.round((score / quizData.questions.length) * 100)}%
          </div>
          <p className="text-lg text-slate-600">
            You scored {score} out of {quizData.questions.length}
          </p>
          
          <div className="w-full space-y-4 mt-4">
             {quizData.questions.map((q, index) => {
                 const userAnswer = answers[index];
                 const isCorrect = userAnswer === q.correctAnswer;
                 return (
                     <div key={index} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <p className="font-medium mb-2">{index + 1}. {q.q}</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className={cn("flex items-center gap-2", isCorrect ? "text-green-600" : "text-red-600")}>
                                {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                Your answer: {userAnswer || "Skipped"}
                            </span>
                            {!isCorrect && <span className="text-green-600">Correct: {q.correctAnswer}</span>}
                        </div>
                     </div>
                 );
             })}
          </div>

        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={handleRetake} className="gap-2" disabled={isLocked}>
            {isLocked ? <Lock className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
            {isLocked ? "No Attempts Left" : "Retake Quiz"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
          />
      </div>
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-500">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </span>
          <div className="flex items-center gap-3 text-xs font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">
              <span>Attempts: {attempts}/{maxAttempts}</span>
              {bestScore !== undefined && <span>Best: {bestScore}</span>}
          </div>
        </div>
        <CardTitle className="text-xl mt-2">{currentQuestion.q}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={answers[currentQuestionIndex] || ""}
          onValueChange={handleOptionSelect}
          className="space-y-3"
        >
          <AnimatePresence mode="wait">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestionIndex] === option;
              
              return (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Label
                    htmlFor={`option-${index}`}
                    className={cn(
                      "flex items-center p-4 rounded-lg border cursor-pointer transition-all",
                      isSelected 
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" 
                        : "border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} className="sr-only" />
                    <span className="text-base font-medium">{option}</span>
                  </Label>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-end pt-6 bg-slate-50/50">
        <Button 
            onClick={handleNext} 
            disabled={!answers[currentQuestionIndex] || isSubmitting}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
        >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (currentQuestionIndex < quizData.questions.length - 1 ? "Next Question" : "Submit Quiz")}
        </Button>
      </CardFooter>
    </Card>
  );
}
