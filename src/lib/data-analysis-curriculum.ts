import type { CourseMonth } from "./course-curricula";

export const dataAnalysisCurriculum: CourseMonth[] = [
  {
    month: 1,
    monthName: "Excel & Analytics Fundamentals",
    weeks: [
      { title: "Introduction to Data Analysis", topics: ["What is Data Analysis?", "Data Analyst roles and responsibilities", "Types of data", "Structured vs unstructured data", "Data analysis lifecycle", "Understanding datasets", "Business questions and KPIs"], practicalTask: "Analyze a simple business dataset and identify key questions.", expectedOutcome: "Understand the data analysis lifecycle and frame useful business questions." },
      { title: "Excel Fundamentals", topics: ["Excel interface", "Rows, columns and cells", "Data entry", "Formatting", "Sorting", "Filtering", "Tables", "Basic formulas"], practicalTask: "Create a basic sales analysis spreadsheet.", expectedOutcome: "Organize and explore tabular data in Excel." },
      { title: "Excel Functions", topics: ["SUM", "AVERAGE", "COUNT", "MIN", "MAX", "IF", "SUMIF", "COUNTIF", "VLOOKUP", "XLOOKUP", "INDEX & MATCH"], practicalTask: "Build an employee/sales analysis workbook.", expectedOutcome: "Use core Excel functions to answer business questions." },
      { title: "Excel Data Analysis & Visualization", topics: ["Pivot Tables", "Pivot Charts", "Conditional formatting", "Data validation", "Charts", "Interactive reports", "Basic dashboard design"], miniProject: "Build an interactive Excel Sales Dashboard.", expectedOutcome: "Create an interactive spreadsheet report with clear KPIs." },
    ],
  },
  {
    month: 2,
    monthName: "SQL & Database Analysis",
    weeks: [
      { title: "SQL Fundamentals", topics: ["Introduction to databases", "Tables and records", "SQL syntax", "SELECT", "WHERE", "ORDER BY", "DISTINCT", "LIMIT", "Aliases"], practicalTask: "Query a customer database.", expectedOutcome: "Retrieve and filter relational data with SQL." },
      { title: "SQL Functions & Filtering", topics: ["Aggregate functions", "COUNT", "SUM", "AVG", "MIN", "MAX", "GROUP BY", "HAVING", "CASE statements"], practicalTask: "Analyze sales and customer data using SQL.", expectedOutcome: "Summarize data and build conditional business queries." },
      { title: "SQL Joins & Relationships", topics: ["Primary keys", "Foreign keys", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "Self joins", "Multiple-table analysis"], miniProject: "Analyze a multi-table business database.", expectedOutcome: "Combine related tables for deeper analysis." },
      { title: "Advanced SQL for Data Analysis", topics: ["Subqueries", "Common Table Expressions", "Window functions", "ROW_NUMBER", "RANK", "PARTITION BY", "Date functions", "String functions"], assignment: "Build a complete SQL Business Analytics Report.", expectedOutcome: "Write advanced, reusable SQL for business reporting." },
    ],
  },
  {
    month: 3,
    monthName: "Python + NumPy + Pandas",
    weeks: [
      { title: "Python Fundamentals for Analysts", topics: ["Python introduction", "Environment setup", "Variables", "Data types", "Operators", "Conditions", "Loops", "Functions"], practicalTask: "Solve data-processing problems using Python.", expectedOutcome: "Use Python fundamentals to automate analysis tasks." },
      { title: "NumPy", topics: ["NumPy introduction", "Arrays", "Array creation", "Indexing", "Slicing", "Mathematical operations", "Statistical functions", "Array manipulation"], practicalTask: "Perform numerical analysis using NumPy.", expectedOutcome: "Perform efficient numerical calculations with arrays." },
      { title: "Pandas Fundamentals", topics: ["Series", "DataFrames", "Importing datasets", "CSV files", "Excel files", "Selecting rows and columns", "Filtering", "Sorting"], practicalTask: "Analyze a real-world CSV dataset using Pandas.", expectedOutcome: "Load, inspect, filter, and sort real datasets with Pandas." },
      { title: "Pandas Data Manipulation", topics: ["GroupBy", "Aggregation", "Merge", "Join", "Concatenation", "Pivot tables", "Data transformation"], miniProject: "Customer and Sales Data Analysis using Python.", expectedOutcome: "Transform multiple datasets into useful analytical results." },
    ],
  },
  {
    month: 4,
    monthName: "Data Cleaning, Statistics & EDA",
    weeks: [
      { title: "Data Cleaning", topics: ["Missing values", "Duplicate records", "Incorrect data types", "Data formatting", "Handling inconsistent values", "Outlier identification", "Data validation"], practicalTask: "Clean a raw business dataset.", expectedOutcome: "Produce reliable, analysis-ready data." },
      { title: "Exploratory Data Analysis", topics: ["What is EDA?", "Understanding distributions", "Descriptive statistics", "Correlation", "Trends", "Patterns", "Relationships between variables"], practicalTask: "Perform complete EDA using Pandas.", expectedOutcome: "Discover patterns and relationships in unfamiliar data." },
      { title: "Statistics for Data Analysts", topics: ["Mean", "Median", "Mode", "Range", "Variance", "Standard deviation", "Percentiles", "Probability fundamentals", "Correlation", "Basic hypothesis testing"], practicalTask: "Perform statistical analysis on a real dataset.", expectedOutcome: "Apply descriptive and introductory inferential statistics." },
      { title: "Advanced EDA Project", topics: ["Python", "Pandas", "NumPy", "Statistics", "Data cleaning", "EDA", "Business insights", "Actionable recommendations"], assignment: "Complete an Exploratory Data Analysis project identifying trends, customer behavior, business problems, and recommendations.", expectedOutcome: "Turn a cleaned dataset into evidence-based business recommendations." },
    ],
  },
  {
    month: 5,
    monthName: "Visualization & Power BI",
    weeks: [
      { title: "Matplotlib & Seaborn", topics: ["Matplotlib fundamentals", "Line charts", "Bar charts", "Pie charts", "Histograms", "Scatter plots", "Customizing charts", "Seaborn introduction", "Statistical visualizations"], practicalTask: "Create a professional data visualization report.", expectedOutcome: "Communicate findings through effective statistical charts." },
      { title: "Power BI Fundamentals", topics: ["Introduction to Power BI", "Power BI interface", "Importing data", "Data sources", "Power Query", "Data transformation", "Data types"], practicalTask: "Import and clean a business dataset in Power BI.", expectedOutcome: "Prepare business data for a Power BI report." },
      { title: "Power BI Data Modeling & DAX", topics: ["Relationships", "Data models", "Calculated columns", "Measures", "DAX fundamentals", "CALCULATE", "SUM", "COUNT", "AVERAGE", "Time intelligence basics"], practicalTask: "Create a business data model.", expectedOutcome: "Build useful measures and relationships for reporting." },
      { title: "Power BI Dashboards", topics: ["Dashboard design", "Visual selection", "Filters", "Slicers", "Cards", "KPIs", "Drill-down", "Interactive reports", "Dashboard storytelling"], miniProject: "Build an interactive Power BI Business Dashboard.", expectedOutcome: "Deliver an interactive dashboard that tells a clear business story." },
    ],
  },
  {
    month: 6,
    monthName: "Business Intelligence & Capstone",
    weeks: [
      { title: "Advanced Business Analytics", topics: ["KPI development", "Business metrics", "Sales analytics", "Customer analytics", "Marketing analytics", "Financial analytics", "Performance analysis", "Business decision-making"], practicalTask: "Analyze a company dataset and create business recommendations.", expectedOutcome: "Connect analytical findings to business decisions." },
      { title: "End-to-End Data Analytics Project", topics: ["Excel", "SQL", "Python", "Pandas", "NumPy", "Statistics", "Power BI", "Raw Data → Cleaning → SQL → Python Analysis → Visualization → Power BI Dashboard → Business Insights"], assignment: "Complete a real-world analytics workflow from raw data to dashboard and recommendations.", expectedOutcome: "Execute a complete analytics project across the modern data stack." },
      { title: "Portfolio Project", topics: ["Select business problem", "Find/prepare dataset", "Data cleaning", "SQL analysis", "Python EDA", "Statistical analysis", "Visualization", "Power BI dashboard", "Business recommendations", "GitHub documentation"], miniProject: "Create a complete portfolio-ready analytics project.", expectedOutcome: "Publish an analytics project that demonstrates job-ready skills." },
      { title: "Final Presentation & Career Preparation", topics: ["Final project completion", "Dashboard presentation", "Business insights presentation", "Portfolio preparation", "GitHub project", "Resume preparation", "Data Analyst interview questions", "SQL interview preparation", "Excel interview preparation", "Power BI interview preparation", "Mock interview", "Final evaluation", "Certification"], practicalTask: "Present the dashboard, business insights, and portfolio project.", expectedOutcome: "Complete the program with a defended portfolio, interview practice, and certification." },
    ],
  },
];
