"use client"

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { motion } from 'framer-motion'
import withAuth from '../components/ui/withAuth'


interface QuizQuestion {
    question: string
    options: string[]
    correct: string
    topic: string
}

const QuizComponent = () => {

    const [quiz, setQuiz] = useState<QuizQuestion[]>([])
    const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([])
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchQuiz()
    }, [])

    const fetchQuiz = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/generate-quiz', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch quiz')
            }

            const data = await response.json()
            setQuiz(data.quiz)
            setSelectedAnswers(new Array(data.quiz.length).fill(null))
            setLoading(false)
        } catch (err) {
            setError('Failed to load quiz. Please try again.')
            setLoading(false)
        }
    }


    const handleNewQuiz = async () => {
        // Reset the state to initial values
        setQuiz([]);
        setSelectedAnswers([]);
        setScore(0);
        setShowResults(false);
        setLoading(true); // Set loading to true before fetching a new quiz

        // Fetch the new quiz
        await fetchQuiz();
    };


    const handleAnswer = (questionIndex: number, answer: string) => {
        setSelectedAnswers(prev => {
            const newAnswers = [...prev]
            newAnswers[questionIndex] = answer
            return newAnswers
        })
    }

    const handleSubmit = async () => {
        let newScore = 0;
        const inputData = quiz.map((question, index) => ({
            topic: question.topic,
            is_correct: selectedAnswers[index] === question.correct ? 'true' : 'false',
        }));

        // Calculate the score
        quiz.forEach((question, index) => {
            if (selectedAnswers[index] === question.correct) {
                newScore++;
            }
        });

        setScore(newScore);
        setShowResults(true);

        // Send the performance data to the backend
        try {
            const response = await fetch('http://127.0.0.1:8000/users/track_performance', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData), // Send the payload
            });

            if (!response.ok) {
                throw new Error('Failed to track performance');
            }

            // Optionally, you can handle the response if needed
            const result = await response.json();
            console.log('Performance tracked successfully:', result);
        } catch (err) {
            console.error('Error tracking performance:', err);
            // Handle error (e.g., show a notification to the user)
        }
    };


    const handleRetakeQuiz = () => {
        setSelectedAnswers(new Array(quiz.length).fill(null))
        setShowResults(false)
        setScore(0)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-100 to-emerald-200">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.5, 1],
                        repeat: Infinity,
                    }}
                    className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
                />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-100 to-emerald-200">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <p className="text-red-500 text-center">{error}</p>
                    <button
                        onClick={fetchQuiz}
                        className="mt-4 w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600 transition duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-200 p-4 sm:p-6 md:p-8 flex items-center justify-center text-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden transform-none !transform-none !rotate-0"
                style={{ transform: 'none', rotate: '0deg' }}
            >
                <div className="bg-emerald-600 p-6 text-white">
                    <h1 className="text-2xl sm:text-3xl font-bold">QuizPro Challenge</h1>
                    <p className="mt-2 text-emerald-100 text-sm sm:text-base">Test your knowledge across various topics</p>
                </div>

                <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {showResults ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-emerald-700">Quiz Results</h2>
                            <p className="text-xl text-center">
                                You scored <span className="font-bold text-emerald-600">{score}</span> out of <span className="font-bold">{quiz.length}</span>
                            </p>
                            <div className="space-y-4">
                                {quiz.map((question, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium text-gray-800">{question.question}</p>
                                        <p className="mt-2 text-sm">
                                            Your answer:
                                            <span className={selectedAnswers[index] === question.correct ? "text-green-600 font-medium ml-1" : "text-red-600 font-medium ml-1"}>
                                                {selectedAnswers[index]}
                                            </span>
                                        </p>
                                        {selectedAnswers[index] !== question.correct && (
                                            <p className="mt-1 text-sm text-green-600">
                                                Correct answer: <span className="font-medium">{question.correct}</span>
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={handleRetakeQuiz}
                                    className="bg-emerald-500 text-white py-2 px-6 rounded-full hover:bg-emerald-600 transition duration-200"
                                >
                                    Retake Quiz
                                </button>
                                <button
                                    onClick={handleNewQuiz} // Use the new handler
                                    className="bg-yellow-500 text-white py-2 px-6 rounded-full hover:bg-yellow-600 transition duration-200"
                                >
                                    New Quiz
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {quiz.map((question, questionIndex) => (
                                <div key={questionIndex} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                    <h2 className="text-lg font-semibold mb-2">Question {questionIndex + 1}</h2>
                                    <p className="text-gray-600 mb-1">Topic: {question.topic}</p>
                                    <p className="text-gray-800 mb-4">{question.question}</p>
                                    <div className="space-y-2">
                                        {question.options.map((option, optionIndex) => (
                                            <label key={optionIndex} className="flex items-center space-x-2 p-2 rounded hover:bg-emerald-50 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`question-${questionIndex}`}
                                                    value={option}
                                                    checked={selectedAnswers[questionIndex] === option}
                                                    onChange={() => handleAnswer(questionIndex, option)}
                                                    className="form-radio h-4 w-4 text-emerald-600"
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={handleSubmit}
                                disabled={selectedAnswers.some(answer => answer === null)}
                                className={`w-full py-3 px-6 rounded-full text-white font-semibold transition duration-200 ${selectedAnswers.some(answer => answer === null)
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-yellow-500 hover:bg-yellow-600'
                                    }`}
                            >
                                Submit Quiz
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
};

export default withAuth(QuizComponent)
