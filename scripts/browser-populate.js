// Copy and paste this into your browser console on any page of your app
// Make sure you're on a page where Supabase client is available

// Sample issues data
const sampleIssues = [
  {
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing damage to vehicles. Located near the intersection with Oak Avenue.',
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
    title: 'Broken playground equipment',
    description: 'Swing set has broken chains, potential safety hazard for children.',
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
    title: 'Graffiti on community center wall',
    description: 'Large graffiti covering the east wall of the community center building.',
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
    title: 'Stray dog pack in neighborhood',
    description: 'Pack of stray dogs roaming residential area. Residents concerned about safety.',
    location: 'Pine Street Neighborhood',
    cost: 300.00,
    category_id: 8,
    created_by: 'sarah.rodriguez@email.com',
    status: 'open',
    priority: 'medium',
    fixed_by: null,
    likes: 15
  }
];

// Function to populate issues
async function populateIssues() {
  try {
    // You'll need to import or access the supabase client
    // This assumes you have access to the supabase client in your app
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY
    );

    console.log('Starting to populate issues table...');
    
    // Check if data already exists
    const { data: existingData, error: checkError } = await supabase
      .from('issues')
      .select('id', { count: 'exact' });

    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return;
    }

    const existingCount = existingData?.length || 0;
    console.log(`Found ${existingCount} existing issues`);

    if (existingCount > 0) {
      console.warn('Issues table already has data. Skipping population.');
      console.log(`Table already has ${existingCount} issues.`);
      return;
    }

    // Insert all issues
    const { data, error } = await supabase
      .from('issues')
      .insert(sampleIssues);

    if (error) {
      console.error('Error inserting issues:', error);
      return;
    }

    console.log(`✅ Successfully inserted ${sampleIssues.length} issues!`);
    
    // Verify the data was inserted
    const { data: finalData, error: countError } = await supabase
      .from('issues')
      .select('id', { count: 'exact' });

    if (!countError) {
      const finalCount = finalData?.length || 0;
      console.log(`📊 Total issues in database: ${finalCount}`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the function
console.log('🚀 Starting issues population...');
populateIssues();
