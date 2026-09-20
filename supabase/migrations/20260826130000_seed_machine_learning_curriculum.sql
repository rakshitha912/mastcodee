UPDATE public.courses
SET title = 'Machine Learning',
    short_description = 'Learn Machine Learning from fundamentals to real-world AI application development with Python, Scikit-learn, deep learning, NLP, and deployment.',
    full_description = 'Learn Machine Learning from the fundamentals to real-world AI application development. This 6-month program covers Python, mathematics and statistics for ML, data preprocessing, exploratory data analysis, supervised and unsupervised learning, feature engineering, model evaluation, ensemble learning, deep learning, NLP, model deployment and end-to-end machine learning projects.',
    level = 'Beginner',
    duration = '6 Months | 24 Weeks',
    published_at = COALESCE(published_at, now())
WHERE slug = 'machine-learning';

INSERT INTO public.course_weeks (course_id, week_number, month_number, title, topics, practical_task, assignment, mini_project, expected_outcome)
SELECT c.id, v.week_number, v.month_number, v.title, v.topics, v.practical_task, v.assignment, v.mini_project, v.expected_outcome
FROM public.courses c
CROSS JOIN (VALUES
(1,1,'Python for Machine Learning',ARRAY['Python introduction','Variables','Data types','Operators','Conditional statements','Loops','Functions','Lists','Dictionaries','Tuples','Sets']::text[],'Build Python programs for basic data processing.',NULL,NULL,'Use Python fundamentals to prepare and manipulate data.'),
(2,1,'Advanced Python',ARRAY['Object-oriented programming','Classes and objects','Modules','Packages','Exception handling','File handling','Lambda functions','List comprehensions','Virtual environments','Git basics']::text[],'Build a Python data-processing application.',NULL,NULL,'Build maintainable Python applications for ML workflows.'),
(3,1,'NumPy & Pandas',ARRAY['NumPy arrays','Indexing and slicing','Mathematical operations','Pandas Series','DataFrames','Reading CSV/Excel files','Filtering','Sorting','GroupBy','Merging datasets']::text[],'Analyze a real-world dataset using Python.',NULL,NULL,'Load, inspect, transform, and analyze datasets.'),
(4,1,'Introduction to Machine Learning',ARRAY['What is Machine Learning?','AI vs ML vs Deep Learning','Types of Machine Learning','Supervised learning','Unsupervised learning','Reinforcement learning','ML workflow','Training data','Testing data','Features and labels']::text[],NULL,NULL,'Build a simple introductory ML prediction model.','Explain the ML workflow and train a first model.'),
(5,2,'Statistics for Machine Learning',ARRAY['Mean','Median','Mode','Variance','Standard deviation','Percentiles','Probability','Distributions','Correlation','Covariance']::text[],'Perform statistical analysis on an ML dataset.',NULL,NULL,'Use statistics to understand distributions and relationships.'),
(6,2,'Mathematics for ML',ARRAY['Linear algebra fundamentals','Vectors','Matrices','Matrix operations','Distance calculations','Functions','Derivatives','Basic calculus concepts','Optimization fundamentals']::text[],'Implement basic mathematical operations using NumPy.',NULL,NULL,'Understand the mathematical ideas behind model training.'),
(7,2,'Data Preprocessing',ARRAY['Data cleaning','Missing values','Duplicate data','Outlier detection','Encoding categorical variables','Feature scaling','Normalization','Standardization','Train/test split']::text[],'Prepare a raw dataset for machine learning.',NULL,NULL,'Create a clean, correctly prepared training dataset.'),
(8,2,'Exploratory Data Analysis',ARRAY['EDA','Data distributions','Correlation analysis','Feature relationships','Matplotlib','Seaborn','Visualization techniques','Finding patterns','Identifying useful features']::text[],NULL,NULL,'Complete EDA and preprocessing on a real-world dataset.','Use EDA to select useful features and identify data quality issues.'),
(9,3,'Linear & Polynomial Regression',ARRAY['Regression fundamentals','Linear regression','Multiple linear regression','Polynomial regression','Cost function','Predictions','Model training']::text[],'Build a House Price Prediction model.',NULL,NULL,'Train regression models and interpret predictions.'),
(10,3,'Classification',ARRAY['Classification concepts','Logistic regression','K-Nearest Neighbors','Decision trees','Classification workflow']::text[],'Build a Customer/Student Classification System.',NULL,NULL,'Solve binary and multiclass classification problems.'),
(11,3,'Advanced Classification',ARRAY['Support Vector Machines','Naive Bayes','Decision tree optimization','Random Forest','Feature importance']::text[],'Compare multiple classification algorithms.',NULL,NULL,'Select and tune classification algorithms for a dataset.'),
(12,3,'Model Evaluation',ARRAY['Accuracy','Precision','Recall','F1-score','Confusion matrix','ROC curve','AUC','Cross-validation','Bias and variance','Overfitting','Underfitting']::text[],NULL,NULL,'Build and evaluate a complete classification system.','Evaluate model quality and diagnose generalization problems.'),
(13,4,'Feature Engineering',ARRAY['Feature selection','Feature extraction','Creating new features','Handling categorical features','Scaling','Transformation','Feature importance','Dimensionality reduction concepts']::text[],'Improve an existing ML model using feature engineering.',NULL,NULL,'Create stronger features and improve model performance.'),
(14,4,'Ensemble Learning',ARRAY['Ensemble learning concepts','Bagging','Boosting','Random Forest','Gradient Boosting','AdaBoost','XGBoost introduction','Model comparison']::text[],NULL,'Build an ensemble-based prediction model.',NULL,'Combine models and compare ensemble strategies.'),
(15,4,'Unsupervised Learning',ARRAY['Clustering','K-Means','Hierarchical clustering','DBSCAN','Cluster evaluation','Customer segmentation']::text[],'Build a Customer Segmentation System.',NULL,NULL,'Discover groups and patterns without labeled data.'),
(16,4,'Dimensionality Reduction',ARRAY['Why dimensionality reduction?','PCA','Feature reduction','Visualization of high-dimensional data','Selecting useful features']::text[],NULL,NULL,'Perform PCA and clustering on a real dataset.','Reduce complex feature spaces while retaining useful information.'),
(17,5,'Neural Network Fundamentals',ARRAY['Introduction to neural networks','Artificial neurons','Layers','Activation functions','Forward propagation','Loss functions','Backpropagation','Gradient descent']::text[],'Build a basic neural network.',NULL,NULL,'Explain and train a basic neural network.'),
(18,5,'TensorFlow / PyTorch',ARRAY['Deep learning frameworks','Dataset preparation','Model creation','Training','Validation','Loss monitoring','Model evaluation']::text[],NULL,'Build a neural network classification model.',NULL,'Use a deep learning framework to train and validate a model.'),
(19,5,'Computer Vision',ARRAY['Image data','Image preprocessing','CNN fundamentals','Convolution','Pooling','Image classification','Data augmentation']::text[],NULL,NULL,'Build an image classification model.','Prepare image data and build a CNN-based classifier.'),
(20,5,'Natural Language Processing',ARRAY['Introduction to NLP','Text preprocessing','Tokenization','Stop words','Stemming','Lemmatization','TF-IDF','Text classification','Sentiment analysis']::text[],NULL,'Build a sentiment analysis system.',NULL,'Transform text into features and classify language data.'),
(21,6,'Machine Learning Deployment',ARRAY['Saving ML models','Pickle/joblib','Flask/FastAPI','Creating prediction APIs','Connecting frontend with ML model','API testing']::text[],'Deploy an ML model through an API.',NULL,NULL,'Expose a trained model through a tested prediction service.'),
(22,6,'MLOps & Production Basics',ARRAY['ML project structure','Git/GitHub','Model versioning','Data versioning concepts','Docker','Environment management','Monitoring basics','Model performance tracking']::text[],'Containerize an ML application using Docker.',NULL,NULL,'Package ML work for repeatable, monitored delivery.'),
(23,6,'End-to-End Machine Learning Capstone',ARRAY['Problem Definition','Data Collection','Data Cleaning','EDA','Feature Engineering','Model Training','Evaluation','Optimization','Deployment']::text[],NULL,'Develop a complete project such as churn, fraud, recommendation, segmentation, image, or sentiment analysis.',NULL,'Complete an end-to-end ML project from problem to deployment.'),
(24,6,'Final Project & Career Preparation',ARRAY['Final project completion','Model optimization','API deployment','GitHub documentation','Project presentation','ML interview preparation','Python interview preparation','SQL basics for ML roles','Machine Learning interview questions','Resume preparation','Portfolio preparation','Mock interview','Final evaluation','Certification']::text[],'Present and defend the deployed ML capstone.',NULL,NULL,'Graduate with a documented project, portfolio, interview practice, and certification.')
) AS v(week_number, month_number, title, topics, practical_task, assignment, mini_project, expected_outcome)
WHERE c.slug = 'machine-learning'
ON CONFLICT (course_id, week_number) DO UPDATE SET
  month_number = EXCLUDED.month_number,
  title = EXCLUDED.title,
  topics = EXCLUDED.topics,
  practical_task = EXCLUDED.practical_task,
  assignment = EXCLUDED.assignment,
  mini_project = EXCLUDED.mini_project,
  expected_outcome = EXCLUDED.expected_outcome,
  updated_at = now();
