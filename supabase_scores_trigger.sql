-- Function to limit the number of scores per user to 5
create or replace function limit_user_scores()
returns trigger
language plpgsql
as $$
begin
  delete from scores where id in (
    select id from scores where user_id = new.user_id order by created_at desc offset 5
  );
  return new;
end;
$$;

-- Trigger to call the function after a new score is inserted
create trigger on_new_score
after insert on scores
for each row
execute function limit_user_scores();
