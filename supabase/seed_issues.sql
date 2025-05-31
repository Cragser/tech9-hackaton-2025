-- First, let's create categories if they don't exist
INSERT INTO category (id, name, description) VALUES
(1, 'Infrastructure', 'Roads, bridges, utilities, and public infrastructure'),
(2, 'Safety', 'Public safety concerns and hazards'),
(3, 'Environment', 'Environmental issues, cleanliness, and beautification'),
(4, 'Transportation', 'Traffic, parking, and transportation-related issues'),
(5, 'Public Services', 'Government services and public facilities'),
(6, 'Recreation', 'Parks, playgrounds, and recreational facilities'),
(7, 'Housing', 'Housing-related community issues'),
(8, 'Other', 'Miscellaneous community concerns')
ON CONFLICT (id) DO NOTHING;

-- Insert comprehensive sample issues data
INSERT INTO issues (title, description, location, cost, category_id, created_by, status, priority, fixed_by, likes, created_at) VALUES

-- Infrastructure Issues
('Large pothole on Main Street', 'Deep pothole causing damage to vehicles. Located near the intersection with Oak Avenue. Multiple residents have reported tire damage.', 'Main Street & Oak Avenue', 500.00, 1, 'sarah.johnson@email.com', 'open', 'high', NULL, 12, '2024-01-15 10:30:00+00'),
('Broken water main flooding street', 'Water main burst on Elm Street causing significant flooding and road closure. Water pressure affected in surrounding area.', 'Elm Street, Block 400', 2500.00, 1, 'mike.chen@email.com', 'open', 'high', NULL, 25, '2024-01-20 08:15:00+00'),
('Damaged sidewalk creating trip hazard', 'Cracked and uneven sidewalk on Pine Avenue. Several elderly residents have nearly fallen.', 'Pine Avenue, near bus stop', 800.00, 1, 'lisa.wong@email.com', 'claimed', 'medium', 2, 8, '2024-01-18 14:20:00+00'),
('Blocked storm drain causing flooding', 'Storm drain clogged with debris, causing street flooding during rain. Affects multiple properties.', 'Pine Street & 2nd Avenue', 300.00, 1, 'james.rodriguez@email.com', 'claimed', 'high', 3, 15, '2024-01-12 16:45:00+00'),
('Broken streetlight creating safety hazard', 'Streetlight not working on Elm Street, creating dark area at night. Pedestrians feel unsafe.', 'Elm Street, Block 200', 150.00, 1, 'tom.wilson@email.com', 'open', 'medium', NULL, 7, '2024-01-19 19:30:00+00'),

-- Safety Issues
('Broken playground equipment', 'Swing set has broken chains, potential safety hazard for children. Playground needs immediate attention.', 'Central Park Playground', 200.00, 2, 'emma.davis@email.com', 'claimed', 'high', 1, 18, '2024-01-14 11:00:00+00'),
('Missing stop sign at intersection', 'Stop sign was knocked down by vehicle last week. Intersection is now dangerous for pedestrians and drivers.', 'Oak Street & 3rd Avenue', 75.00, 2, 'david.kim@email.com', 'open', 'high', NULL, 22, '2024-01-21 07:45:00+00'),
('Loose handrail on bridge', 'Handrail on pedestrian bridge is loose and wobbly. Safety concern for bridge users.', 'Riverside Bridge', 120.00, 2, 'maria.garcia@email.com', 'open', 'medium', NULL, 6, '2024-01-17 13:15:00+00'),
('Broken fence around construction site', 'Fence around active construction site has gaps. Children could access dangerous area.', 'Downtown Construction Zone', 300.00, 2, 'alex.thompson@email.com', 'resolved', 'high', 4, 14, '2024-01-10 09:20:00+00'),

-- Environment Issues
('Graffiti on community center wall', 'Large graffiti covering the east wall of the community center building. Inappropriate content visible to children.', 'Community Center, East Wall', 150.00, 3, 'jennifer.lee@email.com', 'resolved', 'low', 5, 6, '2024-01-12 15:30:00+00'),
('Overflowing trash bins in park', 'Trash bins in Riverside Park are consistently overflowing. Attracting pests and creating unsanitary conditions.', 'Riverside Park', 50.00, 3, 'robert.brown@email.com', 'open', 'medium', NULL, 9, '2024-01-22 12:00:00+00'),
('Overgrown vegetation blocking sidewalk', 'Bushes and trees blocking pedestrian walkway. Pedestrians forced to walk in street.', 'Oak Avenue, Block 300', 100.00, 3, 'susan.miller@email.com', 'open', 'medium', NULL, 5, '2024-01-16 10:45:00+00'),
('Illegal dumping in vacant lot', 'Large appliances and construction debris dumped in vacant lot. Environmental and safety concern.', 'Vacant lot on Maple Street', 400.00, 3, 'carlos.rivera@email.com', 'claimed', 'medium', 6, 11, '2024-01-13 16:20:00+00'),

-- Transportation Issues
('Broken traffic signal', 'Traffic light stuck on red, causing significant traffic delays during rush hour.', 'Main Street & 5th Avenue', 800.00, 4, 'nancy.white@email.com', 'open', 'high', NULL, 20, '2024-01-23 08:30:00+00'),
('Faded crosswalk markings', 'Crosswalk markings at school zone are barely visible. Safety concern for children crossing.', 'School Zone, Elm Street', 200.00, 4, 'kevin.jones@email.com', 'open', 'medium', NULL, 13, '2024-01-19 07:15:00+00'),
('Broken parking meter', 'Parking meter on Main Street not accepting payment. Causing confusion for drivers.', 'Main Street, Meter #47', 150.00, 4, 'patricia.davis@email.com', 'claimed', 'low', 7, 4, '2024-01-18 14:45:00+00'),

-- Public Services Issues
('Library heating system broken', 'Heating system in public library not working. Building too cold for patrons and staff.', 'Public Library', 1200.00, 5, 'michael.wilson@email.com', 'claimed', 'high', 8, 16, '2024-01-11 09:00:00+00'),
('Post office accessibility ramp damaged', 'Wheelchair ramp at post office has large crack. Not safe for wheelchair users.', 'Main Post Office', 600.00, 5, 'linda.taylor@email.com', 'open', 'medium', NULL, 8, '2024-01-20 11:30:00+00'),

-- Recreation Issues
('Damaged park bench', 'Park bench has broken slats and exposed nails. Safety hazard for park visitors.', 'Riverside Park', 75.00, 6, 'steven.anderson@email.com', 'open', 'low', NULL, 3, '2024-01-21 15:20:00+00'),
('Basketball court needs resurfacing', 'Basketball court surface is cracked and uneven. Players risk injury from poor court conditions.', 'Community Recreation Center', 2000.00, 6, 'michelle.thomas@email.com', 'open', 'medium', NULL, 12, '2024-01-14 16:00:00+00'),
('Broken water fountain in park', 'Water fountain in Central Park not working. No water source available for park visitors.', 'Central Park', 250.00, 6, 'daniel.jackson@email.com', 'resolved', 'low', 9, 7, '2024-01-09 12:30:00+00'),

-- Housing Issues
('Abandoned house attracting vandalism', 'Abandoned house on Maple Street has broken windows and is attracting vandals and pests.', '123 Maple Street', 800.00, 7, 'barbara.martinez@email.com', 'open', 'medium', NULL, 10, '2024-01-17 18:00:00+00'),
('Overgrown yard creating pest problem', 'Severely overgrown yard attracting rodents and insects. Affecting neighboring properties.', '456 Oak Street', 200.00, 7, 'richard.garcia@email.com', 'claimed', 'medium', 10, 6, '2024-01-15 13:45:00+00'),

-- Other Issues
('Stray dog pack in neighborhood', 'Pack of stray dogs roaming residential area. Residents concerned about safety, especially for children.', 'Pine Street Neighborhood', 300.00, 8, 'sarah.rodriguez@email.com', 'open', 'medium', NULL, 15, '2024-01-22 17:30:00+00'),
('Noise complaint - construction hours', 'Construction work starting before 6 AM, violating city noise ordinance. Disturbing residents sleep.', 'Downtown Construction Zone', 0.00, 8, 'john.smith@email.com', 'claimed', 'low', 11, 8, '2024-01-20 06:00:00+00'),
('Community garden vandalism', 'Community garden plots have been vandalized. Plants destroyed and tools stolen.', 'Community Garden, 5th Street', 150.00, 8, 'mary.johnson@email.com', 'open', 'low', NULL, 5, '2024-01-18 08:20:00+00');
