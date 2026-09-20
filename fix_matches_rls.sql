CREATE POLICY "Users can delete their own matches" 
ON public.matches 
FOR DELETE 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can update their own matches" 
ON public.matches 
FOR UPDATE
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);
