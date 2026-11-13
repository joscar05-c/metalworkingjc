-- =============================================================================
-- METAL WORKING JC - ESQUEMA DE BASE DE DATOS Y POLÍTICAS RLS (SUPABASE)
-- Compatible con PostgreSQL 15+ y Supabase Data API
-- =============================================================================

-- 1. Tabla de Configuración General y Hero (Singleton id = 1)
create table if not exists public.site_settings (
  id bigint primary key default 1 check (id = 1),
  brand_name text not null default 'Metal Working',
  brand_subname text not null default 'JC',
  hero_badge text not null default 'Taller de Alta Precisión',
  hero_title_start text not null default 'Precisión',
  hero_title_highlight text not null default 'Milimétrica',
  hero_title_end text not null default 'en Cada Pieza',
  hero_description text not null default 'Fabricación industrial de piezas personalizadas, reparación de componentes y mecanizado CNC con los más altos estándares de tolerancia.',
  hero_image_url text,
  tolerance_value text not null default '0.005',
  tolerance_unit text not null default 'mm',
  tolerance_label text not null default 'Tolerancia Máxima',
  contact_heading text not null default 'Solicite su Cotización',
  contact_description text not null default 'Nuestro equipo técnico revisará sus planos y requerimientos para enviarle una propuesta detallada en menos de 24 horas.',
  address_line1 text not null default 'Jr. Los Girasoles 220',
  address_line2 text not null default 'Rioja, San Martín, Perú',
  phone_display text not null default '+51 927885314',
  whatsapp_number text not null default '51927885314',
  email_technical text not null default 'pizangojosec@gmail.com',
  copyright_text text not null default '© 2026 Metal Working JC. Todos los derechos reservados.',
  updated_at timestamptz not null default now()
);

-- 2. Tabla de Estadísticas de Experiencia
create table if not exists public.experience_stats (
  id bigint generated always as identity primary key,
  stat_value text not null,
  stat_label text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists experience_stats_order_idx
  on public.experience_stats (is_active, display_order);

-- 3. Tabla de Servicios de Mecanizado
create table if not exists public.services (
  id bigint generated always as identity primary key,
  title text not null,
  short_description text not null,
  technical_details text,
  icon_main text not null default 'precision_manufacturing',
  icon_background text not null default 'settings',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists services_order_idx
  on public.services (is_active, display_order);

-- 4. Tabla de Galería de Precisión
create table if not exists public.gallery_items (
  id bigint generated always as identity primary key,
  title text not null,
  badge_text text,
  image_url text not null,
  grid_span text not null default 'normal' check (grid_span in ('normal', 'destacado-grande', 'destacado-ancho')),
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_items_order_idx
  on public.gallery_items (is_active, display_order);

-- 5. Tabla de Solicitudes de Cotización (Contacto + Modal)
create table if not exists public.quote_requests (
  id bigint generated always as identity primary key,
  client_name text not null,
  company_name text,
  email text,
  phone text,
  project_details text not null,
  source text not null default 'contacto' check (source in ('contacto', 'modal', 'servicio')),
  status text not null default 'pendiente' check (status in ('pendiente', 'en_revision', 'cotizado', 'archivado')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create index if not exists quote_requests_status_created_idx
  on public.quote_requests (status, created_at desc);

-- =============================================================================
-- PERMISOS EXPLÍCITOS DATA API Y ROW LEVEL SECURITY (RLS)
-- Siguiendo las reglas de supabase y supabase-postgres-best-practices
-- =============================================================================

grant usage on schema public to anon, authenticated;

grant select on public.site_settings, public.experience_stats, public.services, public.gallery_items to anon, authenticated;
grant insert, update, delete on public.site_settings, public.experience_stats, public.services, public.gallery_items to authenticated;

grant insert on public.quote_requests to anon, authenticated;
grant select, update, delete on public.quote_requests to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

alter table public.site_settings enable row level security;
alter table public.experience_stats enable row level security;
alter table public.services enable row level security;
alter table public.gallery_items enable row level security;
alter table public.quote_requests enable row level security;

-- Políticas para site_settings
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select to anon, authenticated
  using (true);

drop policy if exists "site_settings_admin_insert" on public.site_settings;
create policy "site_settings_admin_insert" on public.site_settings
  for insert to authenticated
  with check ((select auth.uid()) is not null);

drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update" on public.site_settings
  for update to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Políticas para experience_stats
drop policy if exists "experience_stats_public_read" on public.experience_stats;
create policy "experience_stats_public_read" on public.experience_stats
  for select to anon, authenticated
  using (is_active = true or (select auth.uid()) is not null);

drop policy if exists "experience_stats_admin_write" on public.experience_stats;
create policy "experience_stats_admin_write" on public.experience_stats
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Políticas para services
drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services
  for select to anon, authenticated
  using (is_active = true or (select auth.uid()) is not null);

drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Políticas para gallery_items
drop policy if exists "gallery_items_public_read" on public.gallery_items;
create policy "gallery_items_public_read" on public.gallery_items
  for select to anon, authenticated
  using (is_active = true or (select auth.uid()) is not null);

drop policy if exists "gallery_items_admin_write" on public.gallery_items;
create policy "gallery_items_admin_write" on public.gallery_items
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Políticas para quote_requests (cualquier visitante puede enviar cotización; solo admin lee/edita)
drop policy if exists "quote_requests_public_insert" on public.quote_requests;
create policy "quote_requests_public_insert" on public.quote_requests
  for insert to anon, authenticated
  with check (length(trim(client_name)) > 0 and length(trim(project_details)) > 0);

drop policy if exists "quote_requests_admin_select" on public.quote_requests;
create policy "quote_requests_admin_select" on public.quote_requests
  for select to authenticated
  using ((select auth.uid()) is not null);

drop policy if exists "quote_requests_admin_update" on public.quote_requests;
create policy "quote_requests_admin_update" on public.quote_requests
  for update to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "quote_requests_admin_delete" on public.quote_requests;
create policy "quote_requests_admin_delete" on public.quote_requests
  for delete to authenticated
  using ((select auth.uid()) is not null);

-- =============================================================================
-- BUCKET DE STORAGE PARA IMÁGENES DEL SITIO (mwjc-media)
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('mwjc-media', 'mwjc-media', true)
on conflict (id) do nothing;

drop policy if exists "mwjc_media_public_read" on storage.objects;
create policy "mwjc_media_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'mwjc-media');

drop policy if exists "mwjc_media_admin_insert" on storage.objects;
create policy "mwjc_media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'mwjc-media' and (select auth.uid()) is not null);

drop policy if exists "mwjc_media_admin_update" on storage.objects;
create policy "mwjc_media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'mwjc-media' and (select auth.uid()) is not null)
  with check (bucket_id = 'mwjc-media' and (select auth.uid()) is not null);

drop policy if exists "mwjc_media_admin_delete" on storage.objects;
create policy "mwjc_media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'mwjc-media' and (select auth.uid()) is not null);

-- =============================================================================
-- DATOS SEMILLA INICIALES (IDÉNTICOS A LA LANDING ORIGINAL)
-- =============================================================================

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

insert into public.experience_stats (stat_value, stat_label, display_order, is_active)
select * from (values
  ('20+', 'Años de Experiencia', 1, true),
  ('15+', 'Máquinas Especializadas', 2, true),
  ('10+', 'Técnicos Expertos', 3, true)
) as seed(stat_value, stat_label, display_order, is_active)
where not exists (select 1 from public.experience_stats);

insert into public.services (title, short_description, technical_details, icon_main, icon_background, display_order, is_active)
select * from (values
  (
    'Torneado CNC',
    'Mecanizado de precisión para ejes, casquillos y piezas cilíndricas con acabados de alta calidad.',
    'Tolerancias de hasta ±0.005 mm en aceros inoxidables, aceros al carbono, bronce, aluminio y polímeros de ingeniería. Producción unitaria y por lotes.',
    'precision_manufacturing',
    'settings',
    1,
    true
  ),
  (
    'Fresado',
    'Cortes y formas complejas en 3 y 4 ejes para componentes que requieren exactitud geométrica.',
    'Fabricación de engranajes rectos y helicoidales, chaveteros, matrices, bridas especiales y carcasas industriales bajo plano o muestra física.',
    'architecture',
    'grid_on',
    2,
    true
  ),
  (
    'Rectificado',
    'Acabados perfectos para superficies planas y cilíndricas, garantizando paralelismo.',
    'Rectificado tangencial y cilíndrico de alta precisión para recuperar ejes desgastados, asientos de rodamientos y superficies de sellado crítico.',
    'texture',
    'blur_on',
    3,
    true
  ),
  (
    'Taladrado y Roscado',
    'Perforaciones axiales exactas y creación de roscas internas o externas.',
    'Roscas métricas, Whitworth, NPT, Acme y trapezoidales de potencia para husillos, espárragos de alta resistencia y acoples hidráulicos.',
    'construction',
    'handyman',
    4,
    true
  )
) as seed(title, short_description, technical_details, icon_main, icon_background, display_order, is_active)
where not exists (select 1 from public.services);



insert into public.gallery_items (title, badge_text, image_url, grid_span, display_order, is_active)
select * from (values
  ('Ensamblaje Técnico', 'Ensamblaje Técnico', '/images/galeria1.jpg', 'destacado-grande', 1, true),
  ('Pieza de precisión', null, '/images/galeria2.jpg', 'normal', 2, true),
  ('Herramientas', null, '/images/galeria3.jpg', 'normal', 3, true),
  ('Acabado Espejo', 'Acabado Espejo', '/images/galeria4.jpg', 'destacado-ancho', 4, true)
) as seed(title, badge_text, image_url, grid_span, display_order, is_active)
where not exists (select 1 from public.gallery_items);

update public.site_settings
set hero_image_url = '/images/HERO2.jpg'
where id = 1 and (hero_image_url is null or hero_image_url like '/src/assets/%');


-- Permitir subida pública de planos de clientes únicamente en la carpeta blueprints/ del bucket mwjc-media
drop policy if exists "mwjc_media_public_blueprints_insert" on storage.objects;
create policy "mwjc_media_public_blueprints_insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'mwjc-media' and (storage.foldername(name))[1] = 'blueprints');
