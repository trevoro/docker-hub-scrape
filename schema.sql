create table records (
  id int generated always as identity,
  created_at timestamp with time zone not null default now(),
  body jsonb
);
