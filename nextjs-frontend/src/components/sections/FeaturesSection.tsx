import { 
  MapPinIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  CameraIcon, 
  ClockIcon, 
  HeartIcon 
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: MapPinIcon,
    title: 'Heritage Site Discovery',
    description: 'Explore and discover Indonesia\'s rich heritage sites, from ancient temples to traditional villages.',
    color: 'text-primary-600'
  },
  {
    icon: UserGroupIcon,
    title: 'Community Collaboration',
    description: 'Connect with like-minded volunteers and coordinators passionate about heritage preservation.',
    color: 'text-heritage-600'
  },
  {
    icon: AcademicCapIcon,
    title: 'Skill Development',
    description: 'Learn new skills in archaeology, documentation, research, and cultural preservation techniques.',
    color: 'text-cultural-600'
  },
  {
    icon: CameraIcon,
    title: 'Documentation Projects',
    description: 'Participate in documenting heritage sites through photography, videography, and digital archiving.',
    color: 'text-primary-600'
  },
  {
    icon: ClockIcon,
    title: 'Flexible Participation',
    description: 'Choose opportunities that fit your schedule, from weekend projects to long-term commitments.',
    color: 'text-heritage-600'
  },
  {
    icon: HeartIcon,
    title: 'Make an Impact',
    description: 'Contribute to preserving Indonesia\'s cultural legacy and earn recognition for your efforts.',
    color: 'text-cultural-600'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Tresno Boedoyo?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join a platform designed to make heritage preservation accessible, rewarding, and impactful for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-md mb-6`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
