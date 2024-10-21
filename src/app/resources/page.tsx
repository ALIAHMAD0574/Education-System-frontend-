'use client'

import { useState, useEffect } from 'react'
import { Book, ExternalLink, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Cookies from 'js-cookie'
import withAuth from '../components/ui/withAuth'

interface Resource {
  title: string
  url: string
  content: string
}

interface TopicResources {
  topic: string
  resources: Resource[]
}

interface ApiResponse {
  overall_accuracy: number
  resources: TopicResources[]
}

const RecommendedResources = () => {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedTopics, setExpandedTopics] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/recommend_resources', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch resources')
        }

        const result: ApiResponse = await response.json()
        setData(result)
        // Initialize all topics as expanded
        const initialExpanded = result.resources.reduce((acc, topic) => {
          acc[topic.topic] = true
          return acc
        }, {} as { [key: string]: boolean })
        setExpandedTopics(initialExpanded)
      } catch (err) {
        setError('An error occurred while fetching resources. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const toggleTopic = (topic: string) => {
    setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Book className="h-6 w-6" />
            Recommended Resources
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : data ? (
            <div className="space-y-8">
              <div className="text-center bg-emerald-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Overall Accuracy</h3>
                <p className="text-4xl font-bold text-emerald-600">{data.overall_accuracy.toFixed(2)}%</p>
              </div>
              {data.resources.length > 0 ? (
                data.resources.map((topicResource, index) => (
                  <div key={index} className="border border-emerald-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleTopic(topicResource.topic)}
                      className="w-full text-left bg-emerald-50 p-4 flex justify-between items-center hover:bg-emerald-100 transition-colors duration-200"
                    >
                      <h3 className="text-xl font-semibold text-emerald-700">{topicResource.topic}</h3>
                      {expandedTopics[topicResource.topic] ? (
                        <ChevronUp className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-emerald-500" />
                      )}
                    </button>
                    {expandedTopics[topicResource.topic] && (
                      <ul className="divide-y divide-emerald-100">
                        {topicResource.resources.map((resource, resourceIndex) => (
                          <li key={resourceIndex} className="p-4 hover:bg-emerald-50 transition-colors duration-200">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
                              <h4 className="text-lg font-medium text-emerald-600 mb-2 flex items-center gap-2">
                                {resource.url.split('//')[1].split('/')[0]}
                                <ExternalLink className="h-4 w-4 text-emerald-400" />
                              </h4>
                              <p className="text-gray-600 text-sm line-clamp-3">{resource.content}</p>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No resources to recommend at this time.</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 right-0 bottom-0 animate-pulse bg-emerald-200 rounded-full"></div>
        <div className="absolute top-1 left-1 right-1 bottom-1 animate-pulse bg-emerald-300 rounded-full"></div>
        <div className="absolute top-2 left-2 right-2 bottom-2 animate-pulse bg-emerald-400 rounded-full"></div>
        <div className="absolute top-3 left-3 right-3 bottom-3 animate-pulse bg-emerald-500 rounded-full"></div>
        <div className="absolute top-4 left-4 right-4 bottom-4 bg-white rounded-full flex items-center justify-center">
          <Book className="h-8 w-8 text-emerald-500 animate-bounce" />
        </div>
      </div>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-red-500 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        {message}
      </div>
    </div>
  )
};

export default withAuth(RecommendedResources)
