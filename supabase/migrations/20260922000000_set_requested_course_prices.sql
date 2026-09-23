UPDATE public.courses
SET price = 3000,
    discount_price = 3000
WHERE slug IN (
  'full-stack-development',
  'machine-learning',
  'python-programming',
  'artificial-intelligence',
  'cloud-computing',
  'data-analytics',
  'web-development'
);