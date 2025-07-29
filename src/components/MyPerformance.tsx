
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Award, BookOpen, TrendingUp, Clock } from 'lucide-react';

interface MyPerformanceProps {
  user: any;
}

const MyPerformance: React.FC<MyPerformanceProps> = ({ user }) => {
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    coursesCompleted: 0,
    coursesInProgress: 0,
    avgProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMyPerformance();
  }, [user]);

  const loadMyPerformance = async () => {
    try {
      const { data: performance, error } = await supabase
        .from('user_performance')
        .select(`
          *,
          courses:course_id (course_title, track_type)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setPerformanceData(performance || []);

      // Calculate stats
      const totalPoints = performance?.reduce((sum, p) => sum + (p.points || 0), 0) || 0;
      const coursesCompleted = performance?.filter(p => p.progress === 100).length || 0;
      const coursesInProgress = performance?.filter(p => p.progress > 0 && p.progress < 100).length || 0;
      const avgProgress = performance?.length > 0 
        ? Math.round(performance.reduce((sum, p) => sum + (p.progress || 0), 0) / performance.length)
        : 0;

      setStats({
        totalPoints,
        coursesCompleted,
        coursesInProgress,
        avgProgress
      });
    } catch (error) {
      console.error('Error loading performance data:', error);
      toast({
        title: "Error",
        description: "Failed to load your performance data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading your performance...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">My Performance</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg border">
          <div className="flex items-center">
            <Award className="h-6 md:h-8 w-6 md:w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-xl md:text-2xl font-bold">{stats.totalPoints}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg border">
          <div className="flex items-center">
            <BookOpen className="h-6 md:h-8 w-6 md:w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl md:text-2xl font-bold">{stats.coursesCompleted}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg border">
          <div className="flex items-center">
            <Clock className="h-6 md:h-8 w-6 md:w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-xl md:text-2xl font-bold">{stats.coursesInProgress}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg border">
          <div className="flex items-center">
            <TrendingUp className="h-6 md:h-8 w-6 md:w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Avg. Progress</p>
              <p className="text-xl md:text-2xl font-bold">{stats.avgProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 md:p-6 border-b">
          <h3 className="text-lg font-semibold">Course Progress</h3>
        </div>
        {performanceData.length > 0 ? (
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {performanceData.map((perf) => (
                <div key={perf.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 space-y-2 md:space-y-0">
                    <div>
                      <h4 className="font-medium">{perf.courses?.course_title}</h4>
                      <p className="text-sm text-gray-600">{perf.courses?.track_type}</p>
                    </div>
                    <div className="flex flex-col md:text-right">
                      <p className="font-semibold text-green-600">{perf.points || 0} points</p>
                      <p className="text-sm text-gray-600">{perf.total_interactions || 0} interactions</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{perf.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${perf.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-500 space-y-1 md:space-y-0">
                    <span>Last session: {new Date(perf.updated_at).toLocaleDateString()}</span>
                    {perf.progress === 100 && (
                      <span className="text-green-600 font-medium">✓ Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No performance data available yet.</p>
            <p className="text-sm mt-2">Start a course to see your progress here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPerformance;
