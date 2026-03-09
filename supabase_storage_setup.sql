-- Create a bucket for 'avatars'
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Create a bucket for 'thumbnails'
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true);

-- Policy to allow public users to upload avatars (Needed because Admin uses Custom Password)
create policy "Public can upload avatars"
on storage.objects for insert
to public
with check ( bucket_id = 'avatars' );

-- Policy to allow public to view avatars
create policy "Public can view avatars"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

-- Policy to allow public users to upload thumbnails
create policy "Public can upload thumbnails"
on storage.objects for insert
to public
with check ( bucket_id = 'thumbnails' );

-- Policy to allow public to view thumbnails
create policy "Public can view thumbnails"
on storage.objects for select
to public
using ( bucket_id = 'thumbnails' );
