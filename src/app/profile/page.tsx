'use client'

import { useState, useEffect } from 'react'
import { User, Book, MapPin, Phone, Mail, GraduationCap } from 'lucide-react'
import Cookies from 'js-cookie'
import withAuth from '../components/ui/withAuth'

interface Topic {
  id: number
  name: string
}

interface UserProfile {
  first_name: string
  last_name: string
  email: string
  address: string
  phone_number: string
  education: string
  selected_topics: Topic[]
}

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/profile', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-200 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            User Profile
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <ProfileSkeleton />
          ) : profile ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">{profile.first_name} {profile.last_name}</h2>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-5 w-5 text-emerald-500" />
                    {profile.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    {profile.address}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-5 w-5 text-emerald-500" />
                    {profile.phone_number}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="h-5 w-5 text-emerald-500" />
                    {profile.education}
                  </p>
                </div>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Book className="h-5 w-5 text-emerald-500" />
                  Selected Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.selected_topics.map((topic) => (
                    <span key={topic.id} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium hover:bg-emerald-200 transition-colors duration-300">
                      {topic.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">Failed to load profile. Please try again later.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-[250px] bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-4 w-[300px] bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-[250px] bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 w-[150px] bg-gray-200 rounded animate-pulse"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
};

export default withAuth(UserProfile)