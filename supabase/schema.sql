-- =====================================================================
-- 宠物领养平台 - Supabase 数据库 Schema
-- 请在 Supabase 控制台的 SQL Editor 中执行此脚本
-- =====================================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. 宠物表
-- =====================================================================
CREATE TABLE IF NOT EXISTS pets (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL UNIQUE,
  breed                 TEXT NOT NULL,
  age                   TEXT NOT NULL,
  gender                TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  weight                TEXT NOT NULL,
  distance              TEXT NOT NULL,
  image                 TEXT NOT NULL,
  images                TEXT[] NOT NULL DEFAULT '{}',
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  health_vaccination    BOOLEAN NOT NULL DEFAULT FALSE,
  health_sterilization  BOOLEAN NOT NULL DEFAULT FALSE,
  health_deworming      BOOLEAN NOT NULL DEFAULT FALSE,
  health_description    TEXT NOT NULL DEFAULT '',
  story                 TEXT NOT NULL DEFAULT '',
  category              TEXT NOT NULL CHECK (category IN ('dog', 'cat', 'small')),
  is_available          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 2. 救助站表
-- =====================================================================
CREATE TABLE IF NOT EXISTS rescue_stations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  distance    TEXT NOT NULL,
  status      TEXT NOT NULL,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  image       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 3. 常见问题表
-- =====================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question    TEXT NOT NULL UNIQUE,
  answer      TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 4. 领养申请表
-- =====================================================================
CREATE TABLE IF NOT EXISTS adoption_applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id          UUID REFERENCES pets(id) ON DELETE SET NULL,
  pet_name        TEXT NOT NULL,
  pet_image       TEXT NOT NULL,
  breed           TEXT NOT NULL,
  age             TEXT NOT NULL,
  applicant_name  TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT NOT NULL,
  housing_type    TEXT NOT NULL CHECK (housing_type IN ('apt', 'house')),
  experience      TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  progress        INTEGER NOT NULL DEFAULT 33,
  user_session    TEXT NOT NULL,
  location        TEXT NOT NULL DEFAULT '上海',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 5. 收藏表
-- =====================================================================
CREATE TABLE IF NOT EXISTS favorites (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id        UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_session  TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(pet_id, user_session)
);

-- =====================================================================
-- Row Level Security（RLS）策略 - 开放给服务端访问
-- 使用 service_role key 的后端可绕过 RLS
-- =====================================================================
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rescue_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取宠物、救助站、FAQ
CREATE POLICY "Public read pets" ON pets FOR SELECT USING (true);
CREATE POLICY "Public read stations" ON rescue_stations FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);

-- 申请和收藏只能读取自己会话的数据（通过 service_role 后端处理）
CREATE POLICY "Service role full access applications" ON adoption_applications USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access favorites" ON favorites USING (true) WITH CHECK (true);
