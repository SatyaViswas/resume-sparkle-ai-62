-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Create policy to allow anonymous uploads 
CREATE POLICY "Allow uploads for anon"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resumes');

-- Create policy to allow users to read their own files
CREATE POLICY "Users can read their own files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes' AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL));

-- Create policy to allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'resumes' AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL));