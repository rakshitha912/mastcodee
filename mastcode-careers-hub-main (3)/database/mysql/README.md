# MastCode MySQL Database

Database name: `mastcode_careers_hub`

Import locally with XAMPP MySQL:

```sh
C:\xampp\mysql\bin\mysql.exe -u root < database\mysql\schema.sql
```

If the project path contains spaces, use MySQL `source` from PowerShell:

```sh
& 'C:\xampp\mysql\bin\mysql.exe' -u root --default-character-set=utf8mb4 -e "source C:/xampp/htdocs/mastcode-careers-hub-main (3)/database/mysql/schema.sql"
```

## Form Storage Pattern

Every form submission creates one row in `form_submissions`. That row stores shared metadata:

- `form_type_id`
- `status_id`
- `public_reference`
- `full_name`
- `email`
- `phone`
- source/audit fields

Then the same submission is stored in the matching specific form table:

- `job_application_forms`
- `career_counselling_forms`
- `placement_assistance_forms`
- `institution_partnership_forms`
- `website_development_forms`
- `digital_marketing_forms`
- `contact_enquiry_forms`
- `course_registration_forms`
- `chatbot_lead_forms`

Resume and document metadata belongs in `uploaded_files`; store the physical files on disk or object storage, not directly in MySQL.

## Example Insert

```sql
START TRANSACTION;

INSERT INTO form_submissions (
  form_type_id,
  status_id,
  public_reference,
  full_name,
  email,
  phone,
  source_page
)
SELECT
  ft.id,
  fs.id,
  UUID(),
  'Example Candidate',
  'candidate@example.com',
  '+91 9876543210',
  '/internships/ai-ml-intern'
FROM form_types ft
JOIN form_submission_statuses fs ON fs.code = 'new'
WHERE ft.code = 'internship_application';

SET @submission_id = LAST_INSERT_ID();

INSERT INTO job_application_forms (
  form_submission_id,
  position_type,
  position_slug,
  position_title,
  current_location,
  highest_qualification,
  skills
) VALUES (
  @submission_id,
  'internship',
  'ai-ml-intern',
  'AI/ML Intern',
  'Bangalore',
  'B.Tech',
  'Python, Machine Learning, SQL'
);

COMMIT;
```

