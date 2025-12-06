"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  q: string;
  a: string[];
}

interface QuizData {
  questions: Question[];
}

interface QuizProps {
  data: string;
}

interface ExtendedQuestion extends Question {
  correctAnswer: string;
  options: string[];
}

interface ExtendedQuizData {
  questions: ExtendedQuestion[];
}

export default function Quiz({ data }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // valid state for storing answers
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const [quizData, setQuizData] = useState<ExtendedQuizData>({ questions: [] });

  useEffect(() => {
    try {
      const parsed: QuizData = JSON.parse(data);
      setQuizData({
        questions: parsed.questions.map((q) => ({
          ...q,
          correctAnswer: q.a[0],
          // Shuffle options
          options: [...q.a].sort(() => Math.random() - 0.5),
        })),
      });
    } catch (e) {
      console.error("Failed to parse quiz data", e);
    }
  }, [data]);

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleOptionSelect = (value: string) => {
    if (showResult) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score and show result
      let calculatedScore = 0;
      quizData.questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
          calculatedScore++;
        }
      });
      setScore(calculatedScore);
      setShowResult(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setShowResult(false);
  };

  if (!quizData.questions.length) {
    return <div className="text-red-500">Error loading quiz data.</div>;
  }

  if (showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Quiz Completed!</CardTitle>
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
          <Button onClick={handleRetake} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retake Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-500">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
          />
        </div>
        <CardTitle className="text-xl mt-4">{currentQuestion.q}</CardTitle>
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
      <CardFooter className="justify-end pt-6">
        <Button 
            onClick={handleNext} 
            disabled={!answers[currentQuestionIndex]}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
            {currentQuestionIndex < quizData.questions.length - 1 ? "Next Question" : "Submit Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
