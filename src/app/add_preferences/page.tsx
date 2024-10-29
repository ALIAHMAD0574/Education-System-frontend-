"use client"

import { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, X, PlusCircle } from 'lucide-react'
import withAuth from '../components/ui/withAuth'
import { useRouter } from 'next/navigation'

interface Topic {
  id: string
  name: string
}

const PreferencesForm = () => {
  const [difficulty, setDifficulty] = useState('')
  const [quizType, setQuizType] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([])
  const [newTopic, setNewTopic] = useState('')
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/gettopics', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()

        if (Array.isArray(data)) {
          setTopics(data)
        } else {
          throw new Error('Fetched data is not an array')
        }
      } catch (error) {
        toast.error(`Failed to load topics: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    fetchTopics()

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTopicDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const addNewTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://127.0.0.1:8000/users/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({ name: newTopic }),
      })
      if (response.ok) {
        const data = await response.json()
        setTopics(prevTopics => [...prevTopics, data])
        setNewTopic('')
        toast.success('Topic added successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || 'Failed to add topic')
      }
    } catch (error) {
      toast.error('Error adding topic')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      difficulty_level: difficulty,
      quiz_format: quizType,
      topics: selectedTopics.map(topic => topic.id),
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/users/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || 'Preferences saved successfully'),
        router.push('/profile')
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || 'Failed to save preferences')
      }
    } catch (error) {
      toast.error('Error saving preferences')
    }
  }

  const toggleTopic = (topic: Topic) => {
    setSelectedTopics(prev =>
      prev.some(t => t.id === topic.id)
        ? prev.filter(t => t.id !== topic.id)
        : [...prev, topic]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-200 p-4 sm:p-6 md:p-8 text-black">
      <ToastContainer position="top-right" autoClose={5000}/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-emerald-600 bg-opacity-90 p-6 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold">Customize Your Quiz Experience</h1>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base">Set your preferences to tailor your learning journey</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty Level</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="quizType" className="block text-sm font-medium text-gray-700">Quiz Type</label>
            <select
              id="quizType"
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="">Select Quiz Type</option>
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="True/False">True/False</option>
            </select>
          </div>

          <div className="space-y-2" ref={dropdownRef}>
            <label htmlFor="topics" className="block text-sm font-medium text-gray-700">Topics</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
                className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <span className="block truncate">
                  {selectedTopics.length > 0 ? `${selectedTopics.length} topic(s) selected` : 'Select Topics'}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </button>

              {isTopicDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center px-4 py-2 hover:bg-emerald-100 cursor-pointer"
                      onClick={() => toggleTopic(topic)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTopics.some(t => t.id === topic.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <label className="ml-3 block text-sm text-gray-700">
                        {topic.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-4 rounded-md shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition-colors duration-200"
          >
            Save Preferences
          </button>
        </form>

        <div className="bg-emerald-50 bg-opacity-70 backdrop-blur-sm p-6 border-t border-emerald-100">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4">Add New Topic</h3>
          <form onSubmit={addNewTopic} className="flex items-center space-x-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Enter new topic"
              required
              className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-white bg-opacity-70 backdrop-blur-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
              type="submit"
            >
              <PlusCircle className="h-6 w-6" />
            </motion.button>
          </form>
        </div>

        <AnimatePresence>
          {(difficulty || quizType || selectedTopics.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-emerald-50 p-6 border-t border-emerald-100"
            >
              <h2 className="text-lg font-semibold text-emerald-800 mb-4">Your Selected Preferences</h2>
              <div className="space-y-2">
                {difficulty && (
                  <p><span className="font-medium">Difficulty:</span> {difficulty}</p>
                )}
                {quizType && (
                  <p><span className="font-medium">Quiz Type:</span> {quizType}</p>
                )}
                {selectedTopics.length > 0 && (
                  <div>
                    <span className="font-medium">Selected Topics:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTopics.map((topic) => (
                        <span key={topic.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {topic.name}
                          <button
                            type="button"
                            onClick={() => toggleTopic(topic)}
                            className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-emerald-400 hover:bg-emerald-200 hover:text-emerald-500 focus:outline-none focus:bg-emerald-500 focus:text-white"
                          >
                            <span className="sr-only">Remove {topic.name}</span>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default withAuth(PreferencesForm)