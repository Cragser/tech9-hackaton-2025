-- Insert sample issues data for testing
INSERT INTO issues (title, description, location, cost, category_id, created_by, status, priority, likes) VALUES
('Large pothole on Main Street', 'Deep pothole causing damage to vehicles. Located near the intersection with Oak Avenue.', 'Main Street & Oak Avenue', 500.00, 1, 'Sarah Johnson', 'open', 'high', 12),
('Broken playground equipment', 'Swing set has broken chains, potential safety hazard for children.', 'Central Park', 200.00, 2, 'Mike Chen', 'claimed', 'medium', 9),
('Graffiti on community center wall', 'Large graffiti covering the east wall of the community center building.', 'Community Center', 50.00, 3, 'Lisa Wong', 'resolved', 'low', 6),
('Broken streetlight', 'Streetlight not working on Elm Street, creating dark area at night.', 'Elm Street', 150.00, 2, 'Tom Wilson', 'open', 'medium', 7),
('Damaged park bench', 'Park bench has broken slats and exposed nails, safety hazard.', 'Riverside Park', 75.00, 6, 'Emma Davis', 'open', 'low', 3),
('Blocked storm drain', 'Storm drain clogged with debris, causing flooding during rain.', 'Pine Street', 300.00, 1, 'James Rodriguez', 'claimed', 'high', 15),
('Overgrown vegetation blocking sidewalk', 'Bushes and trees blocking pedestrian walkway.', 'Oak Avenue', 100.00, 3, 'Maria Garcia', 'open', 'medium', 5),
('Broken traffic signal', 'Traffic light stuck on red, causing traffic delays.', 'Main & 5th Street', 800.00, 4, 'David Kim', 'open', 'high', 20);
