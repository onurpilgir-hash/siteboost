-- ============================================
-- SiteBoost Manager — Supabase Veritabanı Şeması
-- ============================================
-- Bu SQL'i Supabase Dashboard > SQL Editor'a yapıştır ve çalıştır

-- Uzantıları Aktifleştir
create extension if not exists "uuid-ossp";

-- ============================================
-- REFERANS VERİLERİ
-- ============================================

-- Sektörler
create table if not exists sectors (
  key text primary key,
  label text not null,
  emoji text,
  page_structure jsonb,
  color_palette jsonb,
  tone text,
  special_sections text[]
);

insert into sectors (key, label, emoji) values
  ('dis_klinigi', 'Diş Kliniği', '🦷'),
  ('restoran', 'Restoran / Kafe', '🍽️'),
  ('avukat', 'Avukat / Hukuk Bürosu', '⚖️'),
  ('guzellik_salonu', 'Güzellik Salonu / Kuaför', '💄'),
  ('insaat', 'İnşaat / Müteahhit', '🏗️'),
  ('oto_galeri', 'Oto Galeri', '🚗'),
  ('saglik_klinik', 'Sağlık / Klinik', '🏥'),
  ('otel', 'Otel / Pansiyon', '🏨'),
  ('muhasebe', 'Muhasebe / Mali Müşavir', '📊'),
  ('veteriner', 'Veteriner', '🐾'),
  ('genel', 'Genel İşletme', '🏢')
on conflict (key) do nothing;

-- Türkiye İlleri
create table if not exists cities (
  id serial primary key,
  name text not null unique,
  plate_code integer
);

insert into cities (name, plate_code) values
  ('Adana', 1), ('Adıyaman', 2), ('Afyonkarahisar', 3), ('Ağrı', 4),
  ('Amasya', 5), ('Ankara', 6), ('Antalya', 7), ('Artvin', 8),
  ('Aydın', 9), ('Balıkesir', 10), ('Bilecik', 11), ('Bingöl', 12),
  ('Bitlis', 13), ('Bolu', 14), ('Burdur', 15), ('Bursa', 16),
  ('Çanakkale', 17), ('Çankırı', 18), ('Çorum', 19), ('Denizli', 20),
  ('Diyarbakır', 21), ('Edirne', 22), ('Elazığ', 23), ('Erzincan', 24),
  ('Erzurum', 25), ('Eskişehir', 26), ('Gaziantep', 27), ('Giresun', 28),
  ('Gümüşhane', 29), ('Hakkari', 30), ('Hatay', 31), ('Isparta', 32),
  ('Mersin', 33), ('İstanbul', 34), ('İzmir', 35), ('Kars', 36),
  ('Kastamonu', 37), ('Kayseri', 38), ('Kırklareli', 39), ('Kırşehir', 40),
  ('Kocaeli', 41), ('Konya', 42), ('Kütahya', 43), ('Malatya', 44),
  ('Manisa', 45), ('Kahramanmaraş', 46), ('Mardin', 47), ('Muğla', 48),
  ('Muş', 49), ('Nevşehir', 50), ('Niğde', 51), ('Ordu', 52),
  ('Rize', 53), ('Sakarya', 54), ('Samsun', 55), ('Siirt', 56),
  ('Sinop', 57), ('Sivas', 58), ('Tekirdağ', 59), ('Tokat', 60),
  ('Trabzon', 61), ('Tunceli', 62), ('Şanlıurfa', 63), ('Uşak', 64),
  ('Van', 65), ('Yozgat', 66), ('Zonguldak', 67), ('Aksaray', 68),
  ('Bayburt', 69), ('Karaman', 70), ('Kırıkkale', 71), ('Batman', 72),
  ('Şırnak', 73), ('Bartın', 74), ('Ardahan', 75), ('Iğdır', 76),
  ('Yalova', 77), ('Karabük', 78), ('Kilis', 79), ('Osmaniye', 80),
  ('Düzce', 81)
on conflict (name) do nothing;

-- İstanbul İlçeleri (Örnek — diğer iller için genişletilebilir)
create table if not exists districts (
  id serial primary key,
  city_name text not null,
  name text not null,
  unique(city_name, name)
);

insert into districts (city_name, name) values
  ('İstanbul', 'Adalar'), ('İstanbul', 'Arnavutköy'), ('İstanbul', 'Ataşehir'),
  ('İstanbul', 'Avcılar'), ('İstanbul', 'Bağcılar'), ('İstanbul', 'Bahçelievler'),
  ('İstanbul', 'Bakırköy'), ('İstanbul', 'Başakşehir'), ('İstanbul', 'Bayrampaşa'),
  ('İstanbul', 'Beşiktaş'), ('İstanbul', 'Beykoz'), ('İstanbul', 'Beylikdüzü'),
  ('İstanbul', 'Beyoğlu'), ('İstanbul', 'Büyükçekmece'), ('İstanbul', 'Çatalca'),
  ('İstanbul', 'Çekmeköy'), ('İstanbul', 'Esenler'), ('İstanbul', 'Esenyurt'),
  ('İstanbul', 'Eyüpsultan'), ('İstanbul', 'Fatih'), ('İstanbul', 'Gaziosmanpaşa'),
  ('İstanbul', 'Güngören'), ('İstanbul', 'Kadıköy'), ('İstanbul', 'Kağıthane'),
  ('İstanbul', 'Kartal'), ('İstanbul', 'Küçükçekmece'), ('İstanbul', 'Maltepe'),
  ('İstanbul', 'Pendik'), ('İstanbul', 'Sancaktepe'), ('İstanbul', 'Sarıyer'),
  ('İstanbul', 'Silivri'), ('İstanbul', 'Sultanbeyli'), ('İstanbul', 'Sultangazi'),
  ('İstanbul', 'Şile'), ('İstanbul', 'Şişli'), ('İstanbul', 'Tuzla'),
  ('İstanbul', 'Ümraniye'), ('İstanbul', 'Üsküdar'), ('İstanbul', 'Zeytinburnu'),
  ('Ankara', 'Altındağ'), ('Ankara', 'Çankaya'), ('Ankara', 'Etimesgut'),
  ('Ankara', 'Gölbaşı'), ('Ankara', 'Keçiören'), ('Ankara', 'Mamak'),
  ('Ankara', 'Pursaklar'), ('Ankara', 'Sincan'), ('Ankara', 'Yenimahalle'),
  ('İzmir', 'Balçova'), ('İzmir', 'Bayraklı'), ('İzmir', 'Bornova'),
  ('İzmir', 'Buca'), ('İzmir', 'Gaziemir'), ('İzmir', 'Güzelbahçe'),
  ('İzmir', 'Karabağlar'), ('İzmir', 'Karşıyaka'), ('İzmir', 'Konak'),
  ('İzmir', 'Narlıdere'), ('İzmir', 'Torbalı'), ('İzmir', 'Urla')
on conflict (city_name, name) do nothing;

-- ============================================
-- ANA TABLOLAR
-- ============================================

-- Leadler (Potansiyel Müşteriler)
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Firma Bilgileri
  name text not null,
  website text,
  phone text,
  email text,
  address text,
  city text not null,
  district text,
  sector text references sectors(key),

  -- Google Maps Verileri
  google_rating numeric(2,1),
  google_review_count integer default 0,
  google_maps_url text,
  google_place_id text unique,
  years_open integer,
  has_website boolean default false,

  -- Puanlama
  site_scores jsonb,
  lead_score integer default 0,

  -- CRM Pipeline
  pipeline_stage text default 'new_lead' check (pipeline_stage in (
    'new_lead', 'email_sent', 'email_opened', 'demo_viewed',
    'price_requested', 'meeting', 'payment_received', 'active_customer'
  )),

  -- İlişkili Kayıtlar
  scan_job_id uuid,
  latest_report_id uuid,

  -- Notlar
  notes text,

  -- Arşiv
  is_archived boolean default false,
  archived_reason text  -- 'score_too_high', 'no_response', 'not_interested'
);

-- Güncelleme tarihi otomatik
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

-- Tarama İşleri
create table if not exists scan_jobs (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  status text default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  type text not null check (type in ('auto', 'manual')),

  -- Senaryo 1 için
  city text,
  district text,
  sector text,

  -- Senaryo 2 için
  manual_url text,
  manual_company_name text,

  -- İstatistikler
  total_found integer default 0,
  total_scanned integer default 0,
  total_qualified integer default 0,
  total_skipped integer default 0,

  -- Hata
  error text,
  progress_log jsonb default '[]'
);

create trigger scan_jobs_updated_at
  before update on scan_jobs
  for each row execute function update_updated_at();

-- Site Analizleri
create table if not exists site_analyses (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  lead_id uuid not null references leads(id) on delete cascade,
  scan_job_id uuid references scan_jobs(id),

  -- Puanlar (0-10)
  score_hiz numeric(4,2) default 0,
  score_mobil numeric(4,2) default 0,
  score_seo numeric(4,2) default 0,
  score_ux numeric(4,2) default 0,
  score_icerik numeric(4,2) default 0,
  score_erisilebilirlik numeric(4,2) default 0,
  score_guvenlik numeric(4,2) default 0,
  score_donusum numeric(4,2) default 0,
  score_ab_test numeric(4,2) default 0,
  score_genel numeric(4,2) default 0,

  -- Claude Analizleri
  seo_analysis text,
  content_analysis text,

  -- Admin-Only (Müşteri Görmez)
  improvement_doc text,
  action_plan text,
  competitor_analysis text,
  package_recommendation text,

  -- Tahminler
  estimated_monthly_loss integer,

  -- Ham Veri
  pagespeed_data jsonb,
  axe_results jsonb,
  security_headers jsonb,
  screenshot_url text,

  -- Site Teknik Bilgisi
  page_title text,
  meta_description text,
  has_ssl boolean,
  has_mobile_menu boolean,
  has_contact_form boolean,
  has_whatsapp boolean,
  has_google_analytics boolean,
  has_pixel boolean
);

-- Raporlar (PDF + Demo)
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  lead_id uuid not null references leads(id) on delete cascade,
  analysis_id uuid references site_analyses(id),

  -- PDF
  pdf_url text,
  pdf_generated_at timestamptz,

  -- Demo
  demo_url text,
  demo_token text unique default encode(gen_random_bytes(12), 'hex'),
  demo_expires_at timestamptz default now() + interval '7 days',
  demo_type text check (demo_type in ('improvement', 'new_design_a', 'new_design_b')),

  -- Etkileşim
  is_active boolean default true,
  view_count integer default 0,
  last_viewed_at timestamptz,

  -- Müşteri Seçimi (Senaryo 3)
  customer_choice text check (customer_choice in ('a', 'b', 'both', null)),
  revision_notes text
);

-- Mail Logu
create table if not exists email_log (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  lead_id uuid not null references leads(id) on delete cascade,

  type text not null check (type in (
    'initial', 'followup_day3', 'demo_expiry_day7',
    'package_info', 'last_chance', 'customer_welcome',
    'monthly_report', 'upsell', 'competitor_alert'
  )),
  subject text,
  status text default 'sent' check (status in ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  opened_at timestamptz,
  clicked_at timestamptz,
  resend_id text,
  error text
);

-- Müşteriler (Ödeme Yapmış)
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  lead_id uuid not null unique references leads(id),

  -- Paket
  package_type text not null check (package_type in ('temel', 'standart', 'premium')),
  scenario integer not null check (scenario in (1, 2, 3)),
  setup_fee integer not null,
  monthly_fee integer default 0,

  -- Portal Erişimi (Şifresiz Token)
  portal_token text unique default encode(gen_random_bytes(16), 'hex'),

  -- Site Bilgileri
  site_url text,
  wordpress_admin_url text,
  wordpress_admin_user text,
  wordpress_admin_pass text,  -- Şifreli saklanmalı!
  domain text,
  hosting_provider text,

  -- Abonelik
  subscription_active boolean default true,
  subscription_start_date date default current_date,
  next_payment_date date,
  cancellation_requested boolean default false,
  cancellation_date date,

  -- Referral
  referred_by uuid references customers(id),
  referral_months_free integer default 0
);

-- Yeniden Tarama Zamanlaması
create table if not exists rescan_schedules (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id),
  scheduled_for date not null,
  completed_at timestamptz,
  scan_job_id uuid references scan_jobs(id)
);

-- Sözleşmeler
create table if not exists contracts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  customer_id uuid not null references customers(id),

  contract_url text,
  signed_by_customer boolean default false,
  signed_at timestamptz,
  signature_data text
);

-- Ödemeler
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  customer_id uuid not null references customers(id),

  amount integer not null,  -- Kuruş cinsinden (9900₺ = 990000)
  type text check (type in ('setup', 'monthly', 'extra', 'renewal')),
  status text default 'pending' check (status in ('pending', 'confirmed', 'failed')),
  confirmed_at timestamptz,
  description text,

  -- Fatura
  invoice_url text,
  invoice_number text
);

-- 7/24 Site İzleme
create table if not exists site_monitors (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id),

  -- Son Kontrol
  last_checked_at timestamptz,
  last_status text check (last_status in ('up', 'down', 'slow')),
  last_response_ms integer,

  -- İstatistikler
  uptime_percentage numeric(5,2) default 100,
  total_checks integer default 0,
  total_down_count integer default 0,

  -- Aktif Mi?
  monitoring_active boolean default true
);

-- Müşteri Bilgi Formu (Senaryo 3)
create table if not exists intake_forms (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  form_token text unique default encode(gen_random_bytes(12), 'hex'),
  lead_id uuid references leads(id),

  -- Temel Bilgiler
  business_name text,
  sector text,
  city text,
  district text,
  phone text,
  email text,
  address text,
  working_hours text,

  -- İşletme Detayları
  business_description text,
  years_in_business integer,
  services text[],
  references_list text,

  -- Marka Tercihleri
  has_logo boolean default false,
  brand_colors text,
  example_sites text[],
  goal text check (goal in ('appointment', 'showcase', 'sales')),

  -- Teknik Durum
  has_domain boolean default false,
  domain_name text,
  has_hosting boolean default false,
  hosting_info text,

  -- Fotoğraflar
  photo_urls text[],

  -- Form Durumu
  is_completed boolean default false,
  completed_at timestamptz
);

-- ============================================
-- GÜVENLİK — Row Level Security
-- ============================================

alter table leads enable row level security;
alter table scan_jobs enable row level security;
alter table site_analyses enable row level security;
alter table reports enable row level security;
alter table email_log enable row level security;
alter table customers enable row level security;
alter table payments enable row level security;
alter table site_monitors enable row level security;
alter table intake_forms enable row level security;

-- Service Role tüm tablolara erişebilir (sunucu taraflı kod için)
create policy "Service role full access" on leads
  for all using (auth.role() = 'service_role');
create policy "Service role full access" on scan_jobs
  for all using (auth.role() = 'service_role');
create policy "Service role full access" on site_analyses
  for all using (auth.role() = 'service_role');
create policy "Service role full access" on reports
  for all using (auth.role() = 'service_role');
create policy "Service role full access" on email_log
  for all using (auth.role() = 'service_role');
create policy "Service role full access" on customers
  for all using (auth.role() = 'service_role');
create policy "Service role full access" on payments
  for all using (auth.role() = 'service_role');
create policy "Service role full access" on site_monitors
  for all using (auth.role() = 'service_role');
create policy "Service role full access" on intake_forms
  for all using (auth.role() = 'service_role');

-- Referans tablolar herkese açık (okuma)
alter table sectors enable row level security;
alter table cities enable row level security;
alter table districts enable row level security;

create policy "Public read sectors" on sectors for select using (true);
create policy "Public read cities" on cities for select using (true);
create policy "Public read districts" on districts for select using (true);

-- ============================================
-- STORAGE BUCKET'LARI
-- ============================================
-- Supabase Dashboard > Storage'da manuel oluştur:
-- 1. "reports"  — PDF raporlar (private)
-- 2. "demos"    — Demo site assets (public)
-- 3. "photos"   — Müşteri fotoğrafları (private)
-- 4. "invoices" — Faturalar (private)

-- ============================================
-- İNDEKSLER (Hız İçin)
-- ============================================
create index if not exists idx_leads_pipeline on leads(pipeline_stage);
create index if not exists idx_leads_city_district on leads(city, district);
create index if not exists idx_leads_sector on leads(sector);
create index if not exists idx_leads_scan_job on leads(scan_job_id);
create index if not exists idx_analyses_lead on site_analyses(lead_id);
create index if not exists idx_reports_lead on reports(lead_id);
create index if not exists idx_reports_demo_token on reports(demo_token);
create index if not exists idx_email_log_lead on email_log(lead_id);
create index if not exists idx_customers_portal_token on customers(portal_token);
create index if not exists idx_intake_forms_token on intake_forms(form_token);
