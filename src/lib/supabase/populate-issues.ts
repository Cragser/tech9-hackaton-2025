import { supabase } from '../../../app/ssr/client';

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
    fixed_by: 2,
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
    fixed_by: 3,
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
    fixed_by: 1,
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
    fixed_by: 4,
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
    fixed_by: 5,
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
    fixed_by: 6,
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
    fixed_by: 7,
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
    fixed_by: 8,
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
    fixed_by: 9,
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
    fixed_by: 10,
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
    fixed_by: 11,
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

export async function populateIssuesTable() {
  try {
    console.log('Starting to populate issues table...');
    
    // Check if data already exists
    const { data: existingData, error: checkError } = await supabase
      .from('issues')
      .select('id', { count: 'exact' });

    if (checkError) {
      console.error('Error checking existing data:', checkError);
      throw checkError;
    }

    const existingCount = existingData?.length || 0;
    console.log(`Found ${existingCount} existing issues`);

    if (existingCount > 0) {
      console.warn('Issues table already has data. Skipping population.');
      return {
        success: false,
        message: `Table already has ${existingCount} issues. Clear the table first if you want to repopulate.`,
        count: existingCount
      };
    }

    // Insert all issues
    const { data, error } = await supabase
      .from('issues')
      .insert(sampleIssues);

    if (error) {
      console.error('Error inserting issues:', error);
      throw error;
    }

    console.log(`Successfully inserted ${sampleIssues.length} issues!`);
    
    // Verify the data was inserted
    const { data: finalData, error: countError } = await supabase
      .from('issues')
      .select('id', { count: 'exact' });

    if (countError) {
      console.error('Error counting final issues:', countError);
    }

    const finalCount = finalData?.length || 0;
    console.log(`Total issues in database: ${finalCount}`);

    return {
      success: true,
      message: `Successfully inserted ${sampleIssues.length} issues!`,
      count: finalCount
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      message: `Error: ${error}`,
      count: 0
    };
  }
}

export async function clearIssuesTable() {
  try {
    console.log('Clearing issues table...');
    
    const { error } = await supabase
      .from('issues')
      .delete()
      .neq('id', 0); // Delete all records

    if (error) {
      console.error('Error clearing issues:', error);
      throw error;
    }

    console.log('Successfully cleared all issues!');
    
    return {
      success: true,
      message: 'Successfully cleared all issues!',
      count: 0
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      message: `Error: ${error}`,
      count: 0
    };
  }
}

export async function getIssuesCount() {
  try {
    const { data, error } = await supabase
      .from('issues')
      .select('id', { count: 'exact' });

    if (error) {
      console.error('Error counting issues:', error);
      throw error;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting count:', error);
    return 0;
  }
}
