"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import Cookies from 'js-cookie'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface PerformanceData {
  topic: string
  correct_count: number
  incorrect_count: number
  percentage: number
}

interface DashboardData {
  user_id: number
  overall_performance: PerformanceData[]
}

const defaultDashboardData: DashboardData = {
  user_id: 0,
  overall_performance: [
    { topic: 'No Data', correct_count: 0, incorrect_count: 0, percentage: 0 }
  ]
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>(defaultDashboardData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/user_performance', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          }
        })

        if (response.ok) {
          const data: DashboardData = await response.json()
          setDashboardData(data)
        } else if (response.status === 404) {
          console.log('User data not found. Displaying default dashboard.')
        } else {
          throw new Error('Failed to fetch dashboard data')
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const totalQuestions = dashboardData.overall_performance.reduce(
    (sum, topic) => sum + topic.correct_count + topic.incorrect_count,
    0
  )

  const overallPercentage = dashboardData.overall_performance.length > 0
    ? dashboardData.overall_performance.reduce(
        (sum, topic) => sum + topic.percentage,
        0
      ) / dashboardData.overall_performance.length
    : 0

  const topPerformingTopic = dashboardData.overall_performance.length > 0
    ? [...dashboardData.overall_performance].sort((a, b) => b.percentage - a.percentage)[0]
    : { topic: 'N/A', percentage: 0 }

  const barChartData = {
    labels: dashboardData.overall_performance.map(topic => topic.topic),
    datasets: [
      {
        label: 'Correct Answers',
        data: dashboardData.overall_performance.map(topic => topic.correct_count),
        backgroundColor: 'rgba(52, 211, 153, 0.8)',
      },
      {
        label: 'Incorrect Answers',
        data: dashboardData.overall_performance.map(topic => topic.incorrect_count),
        backgroundColor: 'rgba(248, 113, 113, 0.8)',
      },
    ],
  }

  const doughnutChartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [
          dashboardData.overall_performance.reduce((sum, topic) => sum + topic.correct_count, 0),
          dashboardData.overall_performance.reduce((sum, topic) => sum + topic.incorrect_count, 0),
        ],
        backgroundColor: ['rgba(52, 211, 153, 0.8)', 'rgba(248, 113, 113, 0.8)'],
      },
    ],
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-200 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-emerald-800 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Total Questions Answered</h2>
            <p className="text-2xl font-bold text-emerald-600">{totalQuestions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Overall Performance</h2>
            <p className="text-2xl font-bold text-emerald-600">{overallPercentage.toFixed(2)}%</p>
            <div className="mt-2 h-2 bg-emerald-200 rounded-full">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Top Performing Topic</h2>
            <p className="text-2xl font-bold text-emerald-600">{topPerformingTopic.topic}</p>
            <p className="text-xs text-gray-500">
              {topPerformingTopic.percentage.toFixed(2)}% correct
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500 mb-2">User ID</h2>
            <p className="text-2xl font-bold text-emerald-600">{dashboardData.user_id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-500">Performance by Topic</h2>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                scales: {
                  x: { stacked: true },
                  y: { stacked: true },
                },
              }}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-500">Overall Correct vs Incorrect</h2>
            <Doughnut data={doughnutChartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-500">Detailed Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Topic</th>
                  <th scope="col" className="px-6 py-3">Correct</th>
                  <th scope="col" className="px-6 py-3">Incorrect</th>
                  <th scope="col" className="px-6 py-3">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.overall_performance.map((topic, index) => (
                  <tr key={index} className="bg-white border-b">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {topic.topic}
                    </th>
                    <td className="px-6 py-4">{topic.correct_count}</td>
                    <td className="px-6 py-4">{topic.incorrect_count}</td>
                    <td className="px-6 py-4">{topic.percentage.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard