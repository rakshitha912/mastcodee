-- Course curriculum weeks are editable only by super_admin.
CREATE TABLE IF NOT EXISTS public.course_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  week_number integer NOT NULL CHECK (week_number BETWEEN 1 AND 24),
  month_number integer NOT NULL CHECK (month_number BETWEEN 1 AND 6),
  title text NOT NULL,
  topics text[] NOT NULL DEFAULT '{}',
  practical_task text,
  assignment text,
  mini_project text,
  expected_outcome text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, week_number)
);

CREATE INDEX IF NOT EXISTS course_weeks_course_id_idx ON public.course_weeks(course_id);
GRANT SELECT ON public.course_weeks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_weeks TO authenticated;
GRANT ALL ON public.course_weeks TO service_role;
ALTER TABLE public.course_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads published course weeks" ON public.course_weeks
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = course_weeks.course_id AND courses.status = 'published'
  ));
CREATE POLICY "Super admins manage course weeks" ON public.course_weeks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE TRIGGER course_weeks_updated_at BEFORE UPDATE ON public.course_weeks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

UPDATE public.courses
SET title = 'Data Analysis',
    slug = 'data-analysis',
    short_description = 'Transform raw data into meaningful insights and business decisions with Excel, SQL, Python, Pandas, NumPy and Power BI.',
    full_description = 'Learn how to transform raw data into meaningful insights and business decisions. This 6-month program covers Excel, SQL, Python, NumPy, Pandas, data cleaning, statistics, exploratory data analysis, data visualization, Power BI, dashboards, and real-world analytics projects.',
    category = 'Data',
    level = 'Beginner',
    duration = '6 Months | 24 Weeks',
    published_at = COALESCE(published_at, now())
WHERE slug IN ('data-analytics', 'data-analysis');

INSERT INTO public.courses (title, slug, short_description, full_description, category, level, duration, price, discount_price, status, featured, published_at)
SELECT 'Data Analysis', 'data-analysis',
  'Transform raw data into meaningful insights and business decisions with Excel, SQL, Python, Pandas, NumPy and Power BI.',
  'Learn how to transform raw data into meaningful insights and business decisions. This 6-month program covers Excel, SQL, Python, NumPy, Pandas, data cleaning, statistics, exploratory data analysis, data visualization, Power BI, dashboards, and real-world analytics projects.',
  'Data', 'Beginner', '6 Months | 24 Weeks', 16000, 16000, 'published', false, now()
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE slug = 'data-analysis');

INSERT INTO public.course_weeks (course_id, week_number, month_number, title, topics, practical_task, assignment, mini_project, expected_outcome)
SELECT c.id, w.week_number, w.month_number, w.title, w.topics, w.practical_task, w.assignment, w.mini_project, w.expected_outcome
FROM public.courses c
CROSS JOIN LATERAL jsonb_to_recordset($json$[
  {"week_number":1,"month_number":1,"title":"Introduction to Data Analysis","topics":["What is Data Analysis?","Data Analyst roles and responsibilities","Types of data","Structured vs unstructured data","Data analysis lifecycle","Understanding datasets","Business questions and KPIs"],"practical_task":"Analyze a simple business dataset and identify key questions.","expected_outcome":"Understand the data analysis lifecycle and frame useful business questions."},
  {"week_number":2,"month_number":1,"title":"Excel Fundamentals","topics":["Excel interface","Rows, columns and cells","Data entry","Formatting","Sorting","Filtering","Tables","Basic formulas"],"practical_task":"Create a basic sales analysis spreadsheet.","expected_outcome":"Organize and explore tabular data in Excel."},
  {"week_number":3,"month_number":1,"title":"Excel Functions","topics":["SUM","AVERAGE","COUNT","MIN","MAX","IF","SUMIF","COUNTIF","VLOOKUP","XLOOKUP","INDEX & MATCH"],"practical_task":"Build an employee/sales analysis workbook.","expected_outcome":"Use core Excel functions to answer business questions."},
  {"week_number":4,"month_number":1,"title":"Excel Data Analysis & Visualization","topics":["Pivot Tables","Pivot Charts","Conditional formatting","Data validation","Charts","Interactive reports","Basic dashboard design"],"mini_project":"Build an interactive Excel Sales Dashboard.","expected_outcome":"Create an interactive spreadsheet report with clear KPIs."},
  {"week_number":5,"month_number":2,"title":"SQL Fundamentals","topics":["Introduction to databases","Tables and records","SQL syntax","SELECT","WHERE","ORDER BY","DISTINCT","LIMIT","Aliases"],"practical_task":"Query a customer database.","expected_outcome":"Retrieve and filter relational data with SQL."},
  {"week_number":6,"month_number":2,"title":"SQL Functions & Filtering","topics":["Aggregate functions","COUNT","SUM","AVG","MIN","MAX","GROUP BY","HAVING","CASE statements"],"practical_task":"Analyze sales and customer data using SQL.","expected_outcome":"Summarize data and build conditional business queries."},
  {"week_number":7,"month_number":2,"title":"SQL Joins & Relationships","topics":["Primary keys","Foreign keys","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN","Self joins","Multiple-table analysis"],"mini_project":"Analyze a multi-table business database.","expected_outcome":"Combine related tables for deeper analysis."},
  {"week_number":8,"month_number":2,"title":"Advanced SQL for Data Analysis","topics":["Subqueries","Common Table Expressions","Window functions","ROW_NUMBER","RANK","PARTITION BY","Date functions","String functions"],"assignment":"Build a complete SQL Business Analytics Report.","expected_outcome":"Write advanced, reusable SQL for business reporting."},
  {"week_number":9,"month_number":3,"title":"Python Fundamentals for Analysts","topics":["Python introduction","Environment setup","Variables","Data types","Operators","Conditions","Loops","Functions"],"practical_task":"Solve data-processing problems using Python.","expected_outcome":"Use Python fundamentals to automate analysis tasks."},
  {"week_number":10,"month_number":3,"title":"NumPy","topics":["NumPy introduction","Arrays","Array creation","Indexing","Slicing","Mathematical operations","Statistical functions","Array manipulation"],"practical_task":"Perform numerical analysis using NumPy.","expected_outcome":"Perform efficient numerical calculations with arrays."},
  {"week_number":11,"month_number":3,"title":"Pandas Fundamentals","topics":["Series","DataFrames","Importing datasets","CSV files","Excel files","Selecting rows and columns","Filtering","Sorting"],"practical_task":"Analyze a real-world CSV dataset using Pandas.","expected_outcome":"Load, inspect, filter, and sort real datasets with Pandas."},
  {"week_number":12,"month_number":3,"title":"Pandas Data Manipulation","topics":["GroupBy","Aggregation","Merge","Join","Concatenation","Pivot tables","Data transformation"],"mini_project":"Customer and Sales Data Analysis using Python.","expected_outcome":"Transform multiple datasets into useful analytical results."},
  {"week_number":13,"month_number":4,"title":"Data Cleaning","topics":["Missing values","Duplicate records","Incorrect data types","Data formatting","Handling inconsistent values","Outlier identification","Data validation"],"practical_task":"Clean a raw business dataset.","expected_outcome":"Produce reliable, analysis-ready data."},
  {"week_number":14,"month_number":4,"title":"Exploratory Data Analysis","topics":["What is EDA?","Understanding distributions","Descriptive statistics","Correlation","Trends","Patterns","Relationships between variables"],"practical_task":"Perform complete EDA using Pandas.","expected_outcome":"Discover patterns and relationships in unfamiliar data."},
  {"week_number":15,"month_number":4,"title":"Statistics for Data Analysts","topics":["Mean","Median","Mode","Range","Variance","Standard deviation","Percentiles","Probability fundamentals","Correlation","Basic hypothesis testing"],"practical_task":"Perform statistical analysis on a real dataset.","expected_outcome":"Apply descriptive and introductory inferential statistics."},
  {"week_number":16,"month_number":4,"title":"Advanced EDA Project","topics":["Python","Pandas","NumPy","Statistics","Data cleaning","EDA","Business insights","Actionable recommendations"],"assignment":"Complete an Exploratory Data Analysis project identifying trends, customer behavior, business problems, and recommendations.","expected_outcome":"Turn a cleaned dataset into evidence-based business recommendations."},
  {"week_number":17,"month_number":5,"title":"Matplotlib & Seaborn","topics":["Matplotlib fundamentals","Line charts","Bar charts","Pie charts","Histograms","Scatter plots","Customizing charts","Seaborn introduction","Statistical visualizations"],"practical_task":"Create a professional data visualization report.","expected_outcome":"Communicate findings through effective statistical charts."},
  {"week_number":18,"month_number":5,"title":"Power BI Fundamentals","topics":["Introduction to Power BI","Power BI interface","Importing data","Data sources","Power Query","Data transformation","Data types"],"practical_task":"Import and clean a business dataset in Power BI.","expected_outcome":"Prepare business data for a Power BI report."},
  {"week_number":19,"month_number":5,"title":"Power BI Data Modeling & DAX","topics":["Relationships","Data models","Calculated columns","Measures","DAX fundamentals","CALCULATE","SUM","COUNT","AVERAGE","Time intelligence basics"],"practical_task":"Create a business data model.","expected_outcome":"Build useful measures and relationships for reporting."},
  {"week_number":20,"month_number":5,"title":"Power BI Dashboards","topics":["Dashboard design","Visual selection","Filters","Slicers","Cards","KPIs","Drill-down","Interactive reports","Dashboard storytelling"],"mini_project":"Build an interactive Power BI Business Dashboard.","expected_outcome":"Deliver an interactive dashboard that tells a clear business story."},
  {"week_number":21,"month_number":6,"title":"Advanced Business Analytics","topics":["KPI development","Business metrics","Sales analytics","Customer analytics","Marketing analytics","Financial analytics","Performance analysis","Business decision-making"],"practical_task":"Analyze a company dataset and create business recommendations.","expected_outcome":"Connect analytical findings to business decisions."},
  {"week_number":22,"month_number":6,"title":"End-to-End Data Analytics Project","topics":["Excel","SQL","Python","Pandas","NumPy","Statistics","Power BI","Raw Data → Cleaning → SQL → Python Analysis → Visualization → Power BI Dashboard → Business Insights"],"assignment":"Complete a real-world analytics workflow from raw data to dashboard and recommendations.","expected_outcome":"Execute a complete analytics project across the modern data stack."},
  {"week_number":23,"month_number":6,"title":"Portfolio Project","topics":["Select business problem","Find/prepare dataset","Data cleaning","SQL analysis","Python EDA","Statistical analysis","Visualization","Power BI dashboard","Business recommendations","GitHub documentation"],"mini_project":"Create a complete portfolio-ready analytics project.","expected_outcome":"Publish an analytics project that demonstrates job-ready skills."},
  {"week_number":24,"month_number":6,"title":"Final Presentation & Career Preparation","topics":["Final project completion","Dashboard presentation","Business insights presentation","Portfolio preparation","GitHub project","Resume preparation","Data Analyst interview questions","SQL interview preparation","Excel interview preparation","Power BI interview preparation","Mock interview","Final evaluation","Certification"],"practical_task":"Present the dashboard, business insights, and portfolio project.","expected_outcome":"Complete the program with a defended portfolio, interview practice, and certification."}
]$json$::jsonb) AS w(week_number integer, month_number integer, title text, topics text[], practical_task text, assignment text, mini_project text, expected_outcome text)
WHERE c.slug = 'data-analysis'
ON CONFLICT (course_id, week_number) DO UPDATE SET
  month_number = EXCLUDED.month_number,
  title = EXCLUDED.title,
  topics = EXCLUDED.topics,
  practical_task = EXCLUDED.practical_task,
  assignment = EXCLUDED.assignment,
  mini_project = EXCLUDED.mini_project,
  expected_outcome = EXCLUDED.expected_outcome,
  updated_at = now();
