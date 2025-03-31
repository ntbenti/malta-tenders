-- Create tender categories table
CREATE TABLE IF NOT EXISTS tender_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_category_id TEXT,
  icon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_category_id) REFERENCES tender_categories(id)
);

-- Create tenders table
CREATE TABLE IF NOT EXISTS tenders (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  summary TEXT,
  contracting_authority TEXT NOT NULL,
  published_on_behalf_of TEXT,
  procurement_type TEXT,
  procedure_type TEXT,
  cpv_codes TEXT,
  estimated_value NUMERIC,
  currency TEXT,
  publication_date TIMESTAMP,
  submission_deadline TIMESTAMP,
  opening_date TIMESTAMP,
  status TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  last_updated TIMESTAMP NOT NULL
);

-- Create tender documents table
CREATE TABLE IF NOT EXISTS tender_documents (
  id TEXT PRIMARY KEY,
  tender_id TEXT NOT NULL,
  title TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  url TEXT NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  FOREIGN KEY (tender_id) REFERENCES tenders(id)
);

-- Create tender category mappings table
CREATE TABLE IF NOT EXISTS tender_category_mappings (
  tender_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  PRIMARY KEY (tender_id, category_id),
  FOREIGN KEY (tender_id) REFERENCES tenders(id),
  FOREIGN KEY (category_id) REFERENCES tender_categories(id)
);

-- Create scraping sources table
CREATE TABLE IF NOT EXISTS scraping_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  status TEXT NOT NULL,
  last_scraped TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create scraping logs table
CREATE TABLE IF NOT EXISTS scraping_logs (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  status TEXT NOT NULL,
  tenders_added INTEGER,
  tenders_updated INTEGER,
  error_message TEXT,
  FOREIGN KEY (source_id) REFERENCES scraping_sources(id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  preferences TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  read_status BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default categories
INSERT INTO tender_categories (id, name, description, icon) VALUES
('cat_construction', 'Construction & Infrastructure', 'Building, renovation, and infrastructure projects', 'building'),
('cat_healthcare', 'Healthcare & Medical', 'Medical equipment, pharmaceuticals, and healthcare services', 'medical'),
('cat_it', 'IT & Technology', 'Software, hardware, and IT services', 'computer'),
('cat_education', 'Education & Training', 'Educational services, training, and related supplies', 'school'),
('cat_transport', 'Transport & Logistics', 'Vehicles, transportation services, and logistics', 'truck'),
('cat_energy', 'Energy & Utilities', 'Energy production, distribution, and related services', 'energy'),
('cat_environment', 'Environment & Sustainability', 'Environmental services, waste management, and sustainability', 'leaf'),
('cat_financial', 'Financial & Consulting', 'Financial services, consulting, and advisory', 'chart'),
('cat_security', 'Security & Defense', 'Security equipment, services, and defense', 'shield'),
('cat_social', 'Social & Community', 'Social services, community projects, and welfare', 'people');

-- Insert scraping sources
INSERT INTO scraping_sources (id, name, base_url, status) VALUES
('src_etenders', 'eTenders Malta', 'https://www.etenders.gov.mt', 'active'),
('src_mita', 'MITA Procurement', 'https://procurement.mita.gov.mt', 'active');
