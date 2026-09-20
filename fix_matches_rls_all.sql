DROP POLICY IF EXISTS "Users can manage their matches" ON public.matches;
CREATE POLICY "Users can manage their matches" 
ON public.matches 
FOR ALL 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);
