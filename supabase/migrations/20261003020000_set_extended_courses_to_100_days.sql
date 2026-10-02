UPDATE public.courses
SET duration = '100 Days'
WHERE slug IN (
  'python-programming',
  'full-stack-development',
  'data-analysis',
  'data-analytics',
  'machine-learning',
  'artificial-intelligence',
  'cloud-computing',
  'web-development',
  'sql-database-management'
);