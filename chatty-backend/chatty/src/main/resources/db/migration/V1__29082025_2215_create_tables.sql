CREATE TABLE IF NOT EXISTS public.users
(
    id bigserial primary key,
    email text not null,
    password_hash text not null,
    subscription text
);

CREATE TABLE IF NOT EXISTS public.chats
(
    id bigserial primary key,
    user_id bigint not null references users(id),
    title text,
    archived boolean default false
);

CREATE TABLE IF NOT EXISTS public.messages
(
    id bigserial primary key,
    chat_id bigserial not null references chats(id),
    role text not null,
    content text not null,
    created_at timestamp default now()
);