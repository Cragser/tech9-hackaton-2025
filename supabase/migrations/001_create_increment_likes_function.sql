-- Create a function to increment likes for an issue
CREATE OR REPLACE FUNCTION increment_likes(issue_id bigint)
RETURNS void AS $$
BEGIN
  UPDATE issues 
  SET likes = likes + 1 
  WHERE id = issue_id;
END;
$$ LANGUAGE plpgsql;
