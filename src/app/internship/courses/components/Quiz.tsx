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

export default function Quiz({ data }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const [quizData, setQuizData] = useState<QuizData & { questions: (Question & { correctAnswer: string; options: string[] })[] }>({ questions: [] });

  useEffect(() => {
    try {
      const parsed: QuizData = JSON.parse(data);
      setQuizData({
        questions: parsed.questions.map((q) => ({
          ...q,
          // Store correct answer before shuffling
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

  const handleAnswer = () => {
    if (!selectedAnswer || isAnswered) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
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
          <span className="text-sm font-medium text-blue-600">
            Score: {score}
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
          value={selectedAnswer || ""}
          onValueChange={!isAnswered ? setSelectedAnswer : undefined}
          className="space-y-3"
        >
          <AnimatePresence mode="wait">
            {currentQuestion.options.map((option, index) => {
              let itemClass = "border-slate-200 hover:bg-slate-50";
              let icon = null;

              if (isAnswered) {
                if (option === currentQuestion.correctAnswer) {
                  itemClass = "border-green-500 bg-green-50 text-green-700";
                  icon = <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />;
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  itemClass = "border-red-500 bg-red-50 text-red-700";
                  icon = <XCircle className="w-5 h-5 text-red-600 ml-auto" />;
                } else {
                  itemClass = "opacity-50";
                }
              } else if (selectedAnswer === option) {
                itemClass = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
              }

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
                      itemClass
                    )}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} className="sr-only" />
                    <span className="text-base font-medium">{option}</span>
                    {icon}
                  </Label>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-end pt-6">
        {!isAnswered ? (
          <Button 
            onClick={handleAnswer} 
            disabled={!selectedAnswer}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            {currentQuestionIndex < quizData.questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
