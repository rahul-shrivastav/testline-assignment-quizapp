import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/Card";
import { Button } from "./components/Button.jsx";
import { motion } from "framer-motion";
import { FaPlay, FaCheckCircle } from "react-icons/fa";
import jsondata from './../ques.json'

export default function App() {
	const [fetchedData, setfetchedData] = useState(null);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [selectedOption, setSelectedOption] = useState(null);
	const [score, setScore] = useState(0);
	const [quizFinished, setQuizFinished] = useState(false);
	const [startQuiz, setStartQuiz] = useState(false);
	const [error, setError] = useState("");
	const [apiError, setApiError] = useState(true);
	
	useEffect( () => {
		const helper = async() =>{
			try {
				const res =  await fetch("https://api.jsonserve.com/Uw5CrX")
				const data = await res.json()
				
				setfetchedData(data)
				setApiError(false)
			} 
			catch (error) {
				setfetchedData(jsondata)
			}
		}
		helper();

	}, []);
	
	let questions = [];

	if (fetchedData){
		// console.log(fetchedData.questions)
		fetchedData.questions.forEach((q) =>{
			let obj = {};
			obj.question = q.description;
			obj.options = [];
			q.options.forEach((opt) => {
				obj.options.push(opt.description)
				if (opt.is_correct){
					obj.answer = opt.description;
				}
			})
			questions.push(obj)
		})
	}

	const accuracy = questions.length > 0 ? ((score / questions.length) * 100).toFixed(2) : 0;

	const handleOptionClick = (option) => {
		setSelectedOption(option);
		setError("");
	};

	const handleNextQuestion = () => {
		if (!selectedOption) {
			setError("Please select an option before proceeding.");
			return;
		}
		if (selectedOption === questions[currentQuestion].answer) {
			setScore(score + 1);
		}
		if (currentQuestion + 1 < questions.length) {
			setCurrentQuestion(currentQuestion + 1);
			setSelectedOption(null);
			setError("");
		} else {
			setQuizFinished(true);
		}
	};

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-6">

			{(apiError && !startQuiz) && <div className=" h-12 text-center text-[13px] font-bold scale-[0.8] p-3 w-2xs flex items-center justify-center text-sm absolute right-4 bottom-4 animate-pulse border-2 border-red-600 text-white bg-red-600 rounded-md">Error in API endpoint , Data fetched from locally stored JSON</div>}
			{!startQuiz ? (
				
				<motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>
					<Card className="w-full max-w-xl p-10 shadow-3xl rounded-3xl bg-white text-center border-4 border-yellow-400">
						<motion.div initial={{ scale: 0.9 }} animate={{ scale: 1.1 }} transition={{ yoyo: Infinity, duration: 0.8 }}>
							<FaPlay className="text-8xl text-yellow-500 mx-auto drop-shadow-lg" />
						</motion.div>
						<h1 className="text-4xl font-extrabold mt-6 text-gray-800">Welcome to the Ultimate Quiz!</h1>
						<p className="text-xl mt-4 text-gray-700">Are you ready to challenge yourself?</p>
						
						<Button onClick={() => setStartQuiz(true)} className="mt-8 w-full text-xl py-4 bg-yellow-500 hover:bg-yellow-600 transition-transform transform hover:scale-105">Start Quiz</Button>
					</Card>
				</motion.div>
			) : (
				<Card className="w-full max-w-[50vw] p-10 shadow-3xl rounded-3xl bg-white border-4 border-yellow-400 h-max-[90vh]">
					{quizFinished ? (
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="text-center">
							<motion.div initial={{ scale: 0.8 }} animate={{ scale: 1.2 }} transition={{ yoyo: Infinity, duration: 0.6 }}>
								<FaCheckCircle className="text-8xl text-green-500 mx-auto drop-shadow-lg" />
							</motion.div>
							<h1 className="text-4xl font-bold mt-6">Quiz Completed!</h1>
							<p className="text-2xl mt-4">Your Score: {score} / {questions.length}</p>
							<p className="text-xl mt-2">Accuracy: {accuracy}%</p>
							<Button onClick={() => {
								setCurrentQuestion(0);
								setScore(0);
								setQuizFinished(false);
								setStartQuiz(false);
							}} className="mt-8 w-full text-xl py-4 bg-green-500 hover:bg-green-600 transition-transform transform hover:scale-105">Restart</Button>
						</motion.div>
					) : (
						<div className="">
							<motion.h2
								key={currentQuestion}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className="text-3xl font-bold text-center text-gray-800"
							>
								{questions[currentQuestion].question}
							</motion.h2>
							<CardContent className="mt-6 grid grid-cols-2 gap-6 ">
								{questions[currentQuestion].options.map((option, index) => (
									<motion.button
										key={index}
										onClick={() => handleOptionClick(option)}
										className={`py-6 px-8 text-xl rounded-3xl font-semibold shadow-lg transition-transform transform hover:scale-110 border-4 border-gray-300 ${
											selectedOption === option ? "bg-yellow-500 text-white border-yellow-700" : "bg-gray-100 hover:bg-yellow-300"
										}`}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
									>
										{option}
									</motion.button>
								))}
							</CardContent>
							{error && <p className="text-red-500 text-lg text-center mt-4">{error}</p>}
							<Button onClick={handleNextQuestion} className="mt-8 w-full text-xl py-4 bg-yellow-500 hover:bg-yellow-600 transition-transform transform hover:scale-105">Next</Button>
						</div>
					)}
				</Card>
			)}
		</motion.div>
	);
}

