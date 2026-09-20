CREATE DATABASE IF NOT EXISTS mastcode_careers_hub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mastcode_careers_hub;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS form_types (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_form_types_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS form_submission_statuses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(60) NOT NULL,
  label VARCHAR(120) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_form_submission_statuses_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS form_submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_type_id BIGINT UNSIGNED NOT NULL,
  status_id BIGINT UNSIGNED NOT NULL,
  public_reference CHAR(36) NOT NULL,
  full_name VARCHAR(190) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NULL,
  source_page VARCHAR(255) NULL,
  ip_address VARBINARY(16) NULL,
  user_agent VARCHAR(500) NULL,
  internal_notes TEXT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_form_submissions_public_reference (public_reference),
  KEY idx_form_submissions_type_status (form_type_id, status_id),
  KEY idx_form_submissions_email (email),
  KEY idx_form_submissions_submitted_at (submitted_at),
  CONSTRAINT fk_form_submissions_form_type
    FOREIGN KEY (form_type_id) REFERENCES form_types (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_form_submissions_status
    FOREIGN KEY (status_id) REFERENCES form_submission_statuses (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS uploaded_files (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  file_role VARCHAR(60) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_path VARCHAR(500) NOT NULL,
  mime_type VARCHAR(160) NOT NULL,
  size_bytes BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_uploaded_files_submission (form_submission_id),
  CONSTRAINT fk_uploaded_files_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_application_forms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  position_type ENUM('job', 'internship') NOT NULL,
  position_id CHAR(36) NULL,
  position_slug VARCHAR(180) NULL,
  position_title VARCHAR(190) NOT NULL,
  current_location VARCHAR(190) NULL,
  highest_qualification VARCHAR(190) NULL,
  skills TEXT NULL,
  experience VARCHAR(120) NULL,
  linkedin_url VARCHAR(255) NULL,
  github_url VARCHAR(255) NULL,
  portfolio_url VARCHAR(255) NULL,
  cover_letter TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_job_application_submission (form_submission_id),
  KEY idx_job_application_position (position_type, position_slug),
  CONSTRAINT fk_job_application_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS career_counselling_forms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  qualification VARCHAR(190) NOT NULL,
  institution VARCHAR(190) NULL,
  career_stage VARCHAR(80) NULL,
  area_of_interest VARCHAR(190) NULL,
  confusion TEXT NULL,
  goals TEXT NULL,
  preferred_mode ENUM('Online', 'Offline') NULL,
  preferred_date DATE NULL,
  additional_message TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_career_counselling_submission (form_submission_id),
  CONSTRAINT fk_career_counselling_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS placement_assistance_forms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  current_location VARCHAR(190) NOT NULL,
  highest_qualification VARCHAR(190) NOT NULL,
  institution VARCHAR(190) NULL,
  graduation_year VARCHAR(20) NOT NULL,
  skills TEXT NOT NULL,
  experience VARCHAR(120) NULL,
  preferred_job_role VARCHAR(190) NOT NULL,
  preferred_work_location VARCHAR(190) NULL,
  linkedin_url VARCHAR(255) NULL,
  portfolio_url VARCHAR(255) NULL,
  additional_information TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_placement_assistance_submission (form_submission_id),
  CONSTRAINT fk_placement_assistance_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS institution_partnership_forms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  institution_name VARCHAR(190) NOT NULL,
  contact_person VARCHAR(190) NOT NULL,
  designation VARCHAR(120) NOT NULL,
  institution_location VARCHAR(190) NOT NULL,
  institution_type VARCHAR(80) NULL,
  number_of_students VARCHAR(80) NULL,
  areas_of_interest TEXT NULL,
  preferred_collaboration TEXT NULL,
  requirements_message TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_institution_partnership_submission (form_submission_id),
  CONSTRAINT fk_institution_partnership_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS website_development_forms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  company_name VARCHAR(190) NOT NULL,
  existing_website_url VARCHAR(255) NULL,
  website_type VARCHAR(120) NULL,
  project_type ENUM('New Website', 'Website Enhancement') NULL,
  required_features TEXT NULL,
  estimated_budget VARCHAR(120) NULL,
  project_description TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_website_development_submission (form_submission_id),
  CONSTRAINT fk_website_development_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS digital_marketing_forms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  company_name VARCHAR(190) NOT NULL,
  industry VARCHAR(160) NOT NULL,
  website_url VARCHAR(255) NULL,
  social_links TEXT NULL,
  services_required VARCHAR(120) NULL,
  business_goals TEXT NULL,
  target_audience TEXT NULL,
  estimated_monthly_budget VARCHAR(120) NULL,
  additional_requirements TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_digital_marketing_submission (form_submission_id),
  CONSTRAINT fk_digital_marketing_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_enquiry_forms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  subject VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_contact_enquiry_submission (form_submission_id),
  CONSTRAINT fk_contact_enquiry_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_registration_forms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  course_id CHAR(36) NULL,
  course_slug VARCHAR(180) NULL,
  course_title VARCHAR(190) NOT NULL,
  qualification VARCHAR(190) NULL,
  experience_level VARCHAR(120) NULL,
  learning_goal TEXT NULL,
  preferred_batch VARCHAR(120) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_course_registration_submission (form_submission_id),
  KEY idx_course_registration_course (course_slug),
  CONSTRAINT fk_course_registration_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chatbot_lead_forms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  interested_service VARCHAR(120) NOT NULL,
  conversation_topic VARCHAR(160) NULL,
  message TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_chatbot_lead_submission (form_submission_id),
  CONSTRAINT fk_chatbot_lead_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS form_submission_status_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  form_submission_id BIGINT UNSIGNED NOT NULL,
  old_status_id BIGINT UNSIGNED NULL,
  new_status_id BIGINT UNSIGNED NOT NULL,
  note TEXT NULL,
  changed_by VARCHAR(190) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_form_status_history_submission (form_submission_id),
  CONSTRAINT fk_form_status_history_submission
    FOREIGN KEY (form_submission_id) REFERENCES form_submissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_form_status_history_old_status
    FOREIGN KEY (old_status_id) REFERENCES form_submission_statuses (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_form_status_history_new_status
    FOREIGN KEY (new_status_id) REFERENCES form_submission_statuses (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO form_submission_statuses (code, label, display_order) VALUES
  ('new', 'New', 10),
  ('contacted', 'Contacted', 20),
  ('in_progress', 'In Progress', 30),
  ('under_review', 'Under Review', 40),
  ('shortlisted', 'Shortlisted', 50),
  ('interview_scheduled', 'Interview Scheduled', 60),
  ('selected', 'Selected', 70),
  ('rejected', 'Rejected', 80),
  ('completed', 'Completed', 90),
  ('withdrawn', 'Withdrawn', 100)
ON DUPLICATE KEY UPDATE
  label = VALUES(label),
  display_order = VALUES(display_order);

INSERT INTO form_types (code, name, description) VALUES
  ('job_application', 'Job Application', 'Applications submitted for full-time, part-time, contract, freelance, or other job roles.'),
  ('internship_application', 'Internship Application', 'Applications submitted for MastCode internship openings.'),
  ('career_counselling', 'Career Counselling', 'Career counselling and guidance requests.'),
  ('placement_assistance', 'Placement Assistance', 'Candidate registrations for placement assistance.'),
  ('institution_partnership', 'Institution Partnership', 'Partnership enquiries from schools, colleges, universities, and institutions.'),
  ('website_development', 'Website Development', 'Website development or website enhancement consultation requests.'),
  ('digital_marketing', 'Digital Marketing', 'Digital marketing consultation requests.'),
  ('contact_enquiry', 'Contact Enquiry', 'General contact page enquiries and messages.'),
  ('course_registration', 'Course Registration', 'Course enquiry or registration forms.'),
  ('chatbot_lead', 'Chatbot Lead', 'Leads captured from the MastCode AI chatbot.')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  is_active = 1;

