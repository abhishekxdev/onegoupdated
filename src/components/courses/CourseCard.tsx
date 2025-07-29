
import React from 'react';
import { Play, CheckCircle, Clock, TestTube, Users, Crown, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: any;
  status: string;
  progress: any;
  user: any;
  onStartSession: (course: any) => void;
  onTestCourse?: (course: any) => void;
  onAssignCourse?: (course: any) => void;
  hoveredAssign?: string | null;
  onAssignHover?: (courseId: string | null) => void;
  showAdminActions?: boolean;
  onReadCourse?: (course: any) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  status,
  progress,
  user,
  onStartSession,
  onTestCourse,
  onAssignCourse,
  hoveredAssign,
  onAssignHover,
  showAdminActions = true
  onReadCourse
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Play className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Review';
      case 'in-progress':
        return 'Continue';
      default:
        return 'Start';
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-2">{course.course_title}</h4>
          <p className="text-gray-600 text-sm">{course.track_type}</p>
        </div>
        {getStatusIcon(status)}
      </div>
      
      {progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="font-medium">{progress.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress || 0}%` }}
            />
          </div>
          {progress.total_interactions > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {progress.total_interactions} interactions completed
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{getStatusText(status)}</span>
          <div className="flex space-x-2">
            {onReadCourse && (
              <button
                onClick={() => onReadCourse(course)}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              >
                <BookOpen className="h-4 w-4" />
                <span>Read</span>
              </button>
            )}
            <button
              onClick={() => onStartSession(course)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                status === 'completed' 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : status === 'in-progress'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              <Play className="h-4 w-4" />
              <span>{getButtonText(status)}</span>
            </button>
          </div>
        </div>
        
        {showAdminActions && user.role === 'Admin' && onTestCourse && onAssignCourse && (
          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => onTestCourse(course)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
            >
              <TestTube className="h-3 w-3" />
              <span>Test</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => onAssignCourse(course)}
                onMouseEnter={() => user.plan === 'Free' && onAssignHover && onAssignHover(course.id)}
                onMouseLeave={() => onAssignHover && onAssignHover(null)}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
                  user.plan === 'Free' 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                <Users className="h-3 w-3" />
                <span>Assign</span>
                {user.plan === 'Free' && <Crown className="h-3 w-3" />}
              </button>
              
              {hoveredAssign === course.id && user.plan === 'Free' && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                  Upgrade Account
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
