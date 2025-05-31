"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

// Create Supabase client inside the component to avoid React hooks rules violation
function useSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );
}

const sampleIssues = [
  // Infrastructure Issues
  {
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing damage to vehicles. Located near the intersection with Oak Avenue. Multiple residents have reported tire damage.',
    location: 'Main Street & Oak Avenue',
    cost: 500.00,
    category_id: 1,
    created_by: 'sarah.johnson@email.com',
    status: 'open',
    priority: 'high',
    fixed_by: null,
    likes: 12
  },
  {
    title: 'Broken water main flooding street',
    description: 'Water main burst on Elm Street causing significant flooding and road closure. Water pressure affected in surrounding area.',
    location: 'Elm Street, Block 400',
    cost: 2500.00,
    category_id: 1,
    created_by: 'mike.chen@email.com',
    status: 'open',
    priority: 'high',
    fixed_by: null,
    likes: 25
  },
  {
    title: 'Damaged sidewalk creating trip hazard',
    description: 'Cracked and uneven sidewalk on Pine Avenue. Several elderly residents have nearly fallen.',
    location: 'Pine Avenue, near bus stop',
    cost: 800.00,
    category_id: 1,
    created_by: 'lisa.wong@email.com',
    status: 'claimed',
    priority: 'medium',
    fixed_by: null,
    likes: 8
  },
  {
    title: 'Blocked storm drain causing flooding',
    description: 'Storm drain clogged with debris, causing street flooding during rain. Affects multiple properties.',
    location: 'Pine Street & 2nd Avenue',
    cost: 300.00,
    category_id: 1,
    created_by: 'james.rodriguez@email.com',
    status: 'claimed',
    priority: 'high',
    fixed_by: null,
    likes: 15
  },
  {
    title: 'Broken streetlight creating safety hazard',
    description: 'Streetlight not working on Elm Street, creating dark area at night. Pedestrians feel unsafe.',
    location: 'Elm Street, Block 200',
    cost: 150.00,
    category_id: 1,
    created_by: 'tom.wilson@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 7
  },

  // Safety Issues
  {
    title: 'Broken playground equipment',
    description: 'Swing set has broken chains, potential safety hazard for children. Playground needs immediate attention.',
    location: 'Central Park Playground',
    cost: 200.00,
    category_id: 2,
    created_by: 'emma.davis@email.com',
    status: 'claimed',
    priority: 'high',
    fixed_by: null,
    likes: 18
  },
  {
    title: 'Missing stop sign at intersection',
    description: 'Stop sign was knocked down by vehicle last week. Intersection is now dangerous for pedestrians and drivers.',
    location: 'Oak Street & 3rd Avenue',
    cost: 75.00,
    category_id: 2,
    created_by: 'david.kim@email.com',
    status: 'open',
    priority: 'high',
    fixed_by: null,
    likes: 22
  },
  {
    title: 'Loose handrail on bridge',
    description: 'Handrail on pedestrian bridge is loose and wobbly. Safety concern for bridge users.',
    location: 'Riverside Bridge',
    cost: 120.00,
    category_id: 2,
    created_by: 'maria.garcia@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 6
  },
  {
    title: 'Broken fence around construction site',
    description: 'Fence around active construction site has gaps. Children could access dangerous area.',
    location: 'Downtown Construction Zone',
    cost: 300.00,
    category_id: 2,
    created_by: 'alex.thompson@email.com',
    status: 'resolved',
    priority: 'high',
    fixed_by: null,
    likes: 14
  },

  // Environment Issues
  {
    title: 'Graffiti on community center wall',
    description: 'Large graffiti covering the east wall of the community center building. Inappropriate content visible to children.',
    location: 'Community Center, East Wall',
    cost: 150.00,
    category_id: 3,
    created_by: 'jennifer.lee@email.com',
    status: 'resolved',
    priority: 'low',
    fixed_by: null,
    likes: 6
  },
  {
    title: 'Overflowing trash bins in park',
    description: 'Trash bins in Riverside Park are consistently overflowing. Attracting pests and creating unsanitary conditions.',
    location: 'Riverside Park',
    cost: 50.00,
    category_id: 3,
    created_by: 'robert.brown@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 9
  },
  {
    title: 'Overgrown vegetation blocking sidewalk',
    description: 'Bushes and trees blocking pedestrian walkway. Pedestrians forced to walk in street.',
    location: 'Oak Avenue, Block 300',
    cost: 100.00,
    category_id: 3,
    created_by: 'susan.miller@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 5
  },
  {
    title: 'Illegal dumping in vacant lot',
    description: 'Large appliances and construction debris dumped in vacant lot. Environmental and safety concern.',
    location: 'Vacant lot on Maple Street',
    cost: 400.00,
    category_id: 3,
    created_by: 'carlos.rivera@email.com',
    status: 'claimed',
    priority: 'medium',
    fixed_by: null,
    likes: 11
  },

  // Transportation Issues
  {
    title: 'Broken traffic signal',
    description: 'Traffic light stuck on red, causing significant traffic delays during rush hour.',
    location: 'Main Street & 5th Avenue',
    cost: 800.00,
    category_id: 4,
    created_by: 'nancy.white@email.com',
    status: 'open',
    priority: 'high',
    fixed_by: null,
    likes: 20
  },
  {
    title: 'Faded crosswalk markings',
    description: 'Crosswalk markings at school zone are barely visible. Safety concern for children crossing.',
    location: 'School Zone, Elm Street',
    cost: 200.00,
    category_id: 4,
    created_by: 'kevin.jones@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 13
  },
  {
    title: 'Broken parking meter',
    description: 'Parking meter on Main Street not accepting payment. Causing confusion for drivers.',
    location: 'Main Street, Meter #47',
    cost: 150.00,
    category_id: 4,
    created_by: 'patricia.davis@email.com',
    status: 'claimed',
    priority: 'low',
    fixed_by: null,
    likes: 4
  },

  // Public Services Issues
  {
    title: 'Library heating system broken',
    description: 'Heating system in public library not working. Building too cold for patrons and staff.',
    location: 'Public Library',
    cost: 1200.00,
    category_id: 5,
    created_by: 'michael.wilson@email.com',
    status: 'claimed',
    priority: 'high',
    fixed_by: null,
    likes: 16
  },
  {
    title: 'Post office accessibility ramp damaged',
    description: 'Wheelchair ramp at post office has large crack. Not safe for wheelchair users.',
    location: 'Main Post Office',
    cost: 600.00,
    category_id: 5,
    created_by: 'linda.taylor@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 8
  },

  // Recreation Issues
  {
    title: 'Damaged park bench',
    description: 'Park bench has broken slats and exposed nails. Safety hazard for park visitors.',
    location: 'Riverside Park',
    cost: 75.00,
    category_id: 6,
    created_by: 'steven.anderson@email.com',
    status: 'open',
    priority: 'low',
    fixed_by: null,
    likes: 3
  },
  {
    title: 'Basketball court needs resurfacing',
    description: 'Basketball court surface is cracked and uneven. Players risk injury from poor court conditions.',
    location: 'Community Recreation Center',
    cost: 2000.00,
    category_id: 6,
    created_by: 'michelle.thomas@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 12
  },
  {
    title: 'Broken water fountain in park',
    description: 'Water fountain in Central Park not working. No water source available for park visitors.',
    location: 'Central Park',
    cost: 250.00,
    category_id: 6,
    created_by: 'daniel.jackson@email.com',
    status: 'resolved',
    priority: 'low',
    fixed_by: null,
    likes: 7
  },

  // Housing Issues
  {
    title: 'Abandoned house attracting vandalism',
    description: 'Abandoned house on Maple Street has broken windows and is attracting vandals and pests.',
    location: '123 Maple Street',
    cost: 800.00,
    category_id: 7,
    created_by: 'barbara.martinez@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 10
  },
  {
    title: 'Overgrown yard creating pest problem',
    description: 'Severely overgrown yard attracting rodents and insects. Affecting neighboring properties.',
    location: '456 Oak Street',
    cost: 200.00,
    category_id: 7,
    created_by: 'richard.garcia@email.com',
    status: 'claimed',
    priority: 'medium',
    fixed_by: null,
    likes: 6
  },

  // Other Issues
  {
    title: 'Stray dog pack in neighborhood',
    description: 'Pack of stray dogs roaming residential area. Residents concerned about safety, especially for children.',
    location: 'Pine Street Neighborhood',
    cost: 300.00,
    category_id: 8,
    created_by: 'sarah.rodriguez@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 15
  },
  {
    title: 'Noise complaint - construction hours',
    description: 'Construction work starting before 6 AM, violating city noise ordinance. Disturbing residents sleep.',
    location: 'Downtown Construction Zone',
    cost: 0.00,
    category_id: 8,
    created_by: 'john.smith@email.com',
    status: 'claimed',
    priority: 'low',
    fixed_by: null,
    likes: 8
  },
  {
    title: 'Community garden vandalism',
    description: 'Community garden plots have been vandalized. Plants destroyed and tools stolen.',
    location: 'Community Garden, 5th Street',
    cost: 150.00,
    category_id: 8,
    created_by: 'mary.johnson@email.com',
    status: 'open',
    priority: 'low',
    fixed_by: null,
    likes: 5
  }
];

export default function PopulateDataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [currentCount, setCurrentCount] = useState<number | null>(null);
  const supabase = useSupabase();

  const checkCurrentCount = async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('id', { count: 'exact' });

      if (error) {
        console.error('Error counting issues:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Error checking count:', error);
      return 0;
    }
  };

  const populateData = async () => {
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      // Check current count
      const initialCount = await checkCurrentCount();
      setCurrentCount(initialCount);

      if (initialCount > 0) {
        setStatus('error');
        setMessage(`Table already has ${initialCount} issues. Clear the table first if you want to repopulate.`);
        setIsLoading(false);
        return;
      }

      // Insert sample data
      const { data, error } = await supabase
        .from('issues')
        .insert(sampleIssues);

      if (error) {
        console.error('Error inserting issues:', error);
        setStatus('error');
        setMessage(`Error inserting data: ${error.message}`);
        return;
      }

      // Verify insertion
      const finalCount = await checkCurrentCount();
      setCurrentCount(finalCount);

      setStatus('success');
      setMessage(`Successfully inserted ${sampleIssues.length} issues! Total in database: ${finalCount}`);

    } catch (error) {
      console.error('Unexpected error:', error);
      setStatus('error');
      setMessage(`Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = async () => {
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const { error } = await supabase
        .from('issues')
        .delete()
        .neq('id', 0); // Delete all records

      if (error) {
        console.error('Error clearing issues:', error);
        setStatus('error');
        setMessage(`Error clearing data: ${error.message}`);
        return;
      }

      const finalCount = await checkCurrentCount();
      setCurrentCount(finalCount);

      setStatus('success');
      setMessage(`Successfully cleared all issues! Current count: ${finalCount}`);

    } catch (error) {
      console.error('Unexpected error:', error);
      setStatus('error');
      setMessage(`Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCount = async () => {
    const count = await checkCurrentCount();
    setCurrentCount(count);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Populate Issues Table</CardTitle>
          <p className="text-gray-600">
            Use this admin tool to populate the issues table with sample data for testing.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Current Issues Count</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {currentCount !== null ? currentCount : '?'}
                </p>
              </div>
              <Button variant="outline" onClick={refreshCount}>
                Refresh Count
              </Button>
            </div>
          </div>

          {/* Sample Data Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Sample Data Includes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• {sampleIssues.length} realistic community issues</li>
              <li>• Various categories: Infrastructure, Safety, Environment, Transportation, etc.</li>
              <li>• Different statuses: Open, Claimed, Resolved</li>
              <li>• Different priorities: High, Medium, Low</li>
              <li>• Realistic costs and descriptions</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={populateData} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Populate Sample Data'
              )}
            </Button>

            <Button 
              onClick={clearData} 
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Clear All Data'
              )}
            </Button>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
              status === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <p>{message}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">Instructions:</h3>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Check the current count to see if data already exists</li>
              <li>Click "Populate Sample Data" to insert {sampleIssues.length} sample issues</li>
              <li>Use "Clear All Data" to remove all issues if needed</li>
              <li>Visit the <a href="/issues" className="underline font-medium">Issues Page</a> to see the populated data</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
