-- =============================================================================
-- FEBROS16 PostgreSQL Schema Migration: 001_init.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    content TEXT,
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    author VARCHAR(128) NOT NULL,
    badge VARCHAR(64),
    read_time VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS research_projects (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    research_question TEXT NOT NULL,
    abstract TEXT,
    status VARCHAR(64) DEFAULT 'In Progress',
    objectives JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    sources_count INT DEFAULT 0,
    notes_count INT DEFAULT 0,
    findings_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimization Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_articles_title ON articles (title);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_title ON research_projects (title);
CREATE INDEX IF NOT EXISTS idx_research_created_at ON research_projects (created_at DESC);

-- Seed Initial Categories if empty
INSERT INTO categories (id, name, slug, description, icon) VALUES
    ('education', 'Education', 'education', 'Pedagogical frameworks and digital curricula', 'GraduationCap'),
    ('technology', 'Technology', 'technology', 'Systems architecture and decentralized networks', 'Cpu'),
    ('environment', 'Environment', 'environment', 'Ecological resilience and clean microgrids', 'Trees'),
    ('research', 'Research', 'research', 'Empirical standards and source attribution', 'Microscope'),
    ('opportunities', 'Opportunities', 'opportunities', 'Fellowships, grants, and scholarships', 'Award'),
    ('society', 'Society', 'society', 'Public knowledge and institutional governance', 'Users'),
    ('health', 'Health', 'health', 'Biomedical research summaries and prevention', 'HeartPulse'),
    ('personal-development', 'Personal Development', 'personal-development', 'Deliberate practice and deep work systems', 'Compass')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Articles
INSERT INTO articles (id, title, abstract, author, badge, read_time) VALUES
    ('art-01', 'The Architecture of Autonomous Knowledge Synthesis Systems', 'How verifiable metadata and distributed graph databases ensure that synthetic research assistants remain grounded in primary citations.', 'Febros16 Editorial Board', 'Core Article', '12 min read'),
    ('art-02', 'Decentralized Microgrid Governance and Storage Economics', 'Mathematical modeling of community battery ownership, dynamic pricing thresholds, and municipal resilience metrics under extreme weather.', 'Prof. Ananya Sen, Clean Grid Laboratory', 'Empirical Study', '16 min read'),
    ('art-03', 'Foundations of Systems Programming in Modern Cryptography', 'Memory safety guarantees, constant-time arithmetic primitives, and zero-knowledge proof verification pipeline architectures.', 'Systems Research Collective', 'Technical Reference', '20 min read')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Research Projects
INSERT INTO research_projects (id, title, research_question, abstract, status, tags, sources_count, notes_count, findings_count) VALUES
    ('proj-01', 'Decentralized Identity Standards for Academic Publishing', 'How can cryptographic signatures on public ledgers verify researcher identity without commercial journal monopolies?', 'Evaluating decentralized identifiers (DID) to replace paywalled journal submission systems.', 'In Progress', ARRAY['Cryptography', 'Academic Publishing', 'Open Science'], 18, 42, 7),
    ('proj-02', 'Urban Heat Island Mitigation through Permeable Bioswales', 'What is the comparative cooling efficacy of engineered bioswales versus traditional concrete storm sewers across temperate climates?', 'Ten-year microclimate sensor data measuring surface temperature reductions in dense metropolitan zones.', 'Peer Review', ARRAY['Urban Ecology', 'Civil Engineering', 'Climate Adaptation'], 34, 68, 12)
ON CONFLICT (id) DO NOTHING;
