-- Core tender table
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
  estimated_value DECIMAL,
  currency TEXT,
  publication_date TIMESTAMP,
  submission_deadline TIMESTAMP,
  opening_date TIMESTAMP,
  status TEXT,
  source_url TEXT UNIQUE,
  last_updated TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table with hierarchical structure
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT,
  description TEXT,
  icon TEXT,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Tender-Category relationship table
CREATE TABLE IF NOT EXISTS tender_categories (
  tender_id TEXT,
  category_id TEXT,
  PRIMARY KEY (tender_id, category_id),
  FOREIGN KEY (tender_id) REFERENCES tenders(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Documents table
CREATE TABLE IF NOT EXISTS tender_documents (
  id TEXT PRIMARY KEY,
  tender_id TEXT NOT NULL,
  title TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  url TEXT NOT NULL,
  last_updated TIMESTAMP,
  FOREIGN KEY (tender_id) REFERENCES tenders(id)
);

-- Saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  search_query TEXT,
  filters TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_run TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_tenders_submission_deadline;
DROP INDEX IF EXISTS idx_tenders_status;
DROP INDEX IF EXISTS idx_tender_documents_tender_id;
DROP INDEX IF EXISTS idx_notifications_user_id;

-- Create indexes for better performance
CREATE INDEX idx_tenders_submission_deadline ON tenders(submission_deadline);
CREATE INDEX idx_tenders_status ON tenders(status);
CREATE INDEX idx_tender_documents_tender_id ON tender_documents(tender_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Insert default categories
INSERT OR IGNORE INTO tender_categories (id, name, description, icon) VALUES
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
INSERT OR IGNORE INTO scraping_sources (id, name, base_url, status) VALUES
('src_etenders', 'eTenders Malta', 'https://www.etenders.gov.mt', 'active'),
('src_mita', 'MITA Procurement', 'https://procurement.mita.gov.mt', 'active');
