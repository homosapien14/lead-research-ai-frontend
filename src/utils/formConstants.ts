import { countries } from 'countries-list';
import { Option } from '@/components/ui/simple-multi-select';

// Convert countries data to options format
export const LOCATION_OPTIONS: Option[] = Object.entries(countries).map(([code, country]) => ({
    label: country.name,
    value: code.toLowerCase(),
})).sort((a, b) => a.label.localeCompare(b.label));

export const INDUSTRY_OPTIONS: Option[] = [
    { label: 'Marketing Services', value: 'marketing_services' },
    { label: 'Technology', value: 'technology' },
    { label: 'SaaS', value: 'saas' },
    { label: 'Digital Marketing', value: 'digital_marketing' },
    { label: 'AI & Machine Learning', value: 'ai_ml' },
    { label: 'Consulting', value: 'consulting' },
    { label: 'Advertising', value: 'advertising' },
    { label: 'Marketing Technology', value: 'martech' },
    { label: 'Software Development', value: 'software_development' },
    { label: 'Data Analytics', value: 'data_analytics' },
];

export const COMPANY_SIZE_OPTIONS: Option[] = [
    { label: '1-10 employees', value: '1_10' },
    { label: '11-50 employees', value: '11_50' },
    { label: '51-200 employees', value: '51_200' },
    { label: '201-500 employees', value: '201_500' },
    { label: '501-1000 employees', value: '501_1000' },
    { label: '1001-5000 employees', value: '1001_5000' },
    { label: '5000+ employees', value: '5000_plus' },
];

export const SENIORITY_OPTIONS: Option[] = [
    // Executive Level
    { label: 'CEO/Founder', value: 'ceo_founder' },
    { label: 'CTO/CIO', value: 'cto_cio' },
    { label: 'CMO', value: 'cmo' },
    { label: 'CFO', value: 'cfo' },
    { label: 'COO', value: 'coo' },
    { label: 'Other C-Level', value: 'other_c_level' },
    
    // Senior Management
    { label: 'President', value: 'president' },
    { label: 'EVP/SVP', value: 'evp_svp' },
    { label: 'VP', value: 'vp' },
    { label: 'Head of Department', value: 'head_of_department' },
    
    // Middle Management
    { label: 'Senior Director', value: 'senior_director' },
    { label: 'Director', value: 'director' },
    { label: 'Senior Manager', value: 'senior_manager' },
    { label: 'Manager', value: 'manager' },
    { label: 'Team Lead', value: 'team_lead' },
    
    // Professional Level
    { label: 'Senior Professional', value: 'senior_professional' },
    { label: 'Mid-Level Professional', value: 'mid_level_professional' },
    { label: 'Junior Professional', value: 'junior_professional' },
    
    // Specialist Level
    { label: 'Senior Specialist', value: 'senior_specialist' },
    { label: 'Specialist', value: 'specialist' },
    { label: 'Associate', value: 'associate' },
    
    // Entry Level
    { label: 'Entry Level', value: 'entry_level' },
    { label: 'Intern', value: 'intern' },
    { label: 'Graduate Trainee', value: 'graduate_trainee' }
];

export const JOB_FUNCTION_OPTIONS: Option[] = [
    { label: 'Executive', value: 'executive' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Product', value: 'product' },
    { label: 'Technology', value: 'technology' },
    { label: 'Sales', value: 'sales' },
    { label: 'Operations', value: 'operations' },
];

export const CERTIFICATION_OPTIONS: Option[] = [
    { label: 'AWS Certified', value: 'aws_certified' },
    { label: 'Google Cloud Certified', value: 'gcp_certified' },
    { label: 'Microsoft Azure Certified', value: 'azure_certified' },
    { label: 'AI/ML Certifications', value: 'ai_ml_certified' },
    { label: 'Project Management (PMP)', value: 'pmp' },
    { label: 'Scrum Master', value: 'scrum_master' },
    { label: 'CISSP', value: 'cissp' },
    { label: 'CompTIA+', value: 'comptia' }
];

export const TECHNOLOGY_STACK_OPTIONS: Option[] = [
    // Frontend Technologies
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Vue.js', value: 'vuejs' },
    { label: 'Next.js', value: 'nextjs' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'HTML/CSS', value: 'html_css' },
    { label: 'Tailwind CSS', value: 'tailwind' },
    
    // Backend Technologies
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C#/.NET', value: 'dotnet' },
    { label: 'Ruby on Rails', value: 'rails' },
    { label: 'PHP', value: 'php' },
    { label: 'Go', value: 'golang' },
    { label: 'Rust', value: 'rust' },
    
    // Cloud Platforms
    { label: 'AWS', value: 'aws' },
    { label: 'Azure', value: 'azure' },
    { label: 'Google Cloud', value: 'gcp' },
    { label: 'DigitalOcean', value: 'digitalocean' },
    { label: 'Heroku', value: 'heroku' },
    { label: 'Vercel', value: 'vercel' },
    
    // Databases
    { label: 'MongoDB', value: 'mongodb' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'MySQL', value: 'mysql' },
    { label: 'Redis', value: 'redis' },
    { label: 'Elasticsearch', value: 'elasticsearch' },
    { label: 'DynamoDB', value: 'dynamodb' },
    
    // DevOps & Infrastructure
    { label: 'Docker', value: 'docker' },
    { label: 'Kubernetes', value: 'kubernetes' },
    { label: 'Jenkins', value: 'jenkins' },
    { label: 'GitLab CI', value: 'gitlab_ci' },
    { label: 'GitHub Actions', value: 'github_actions' },
    { label: 'Terraform', value: 'terraform' },
    { label: 'Ansible', value: 'ansible' },
    
    // AI/ML Technologies
    { label: 'TensorFlow', value: 'tensorflow' },
    { label: 'PyTorch', value: 'pytorch' },
    { label: 'scikit-learn', value: 'scikit_learn' },
    { label: 'OpenAI API', value: 'openai_api' },
    { label: 'Hugging Face', value: 'hugging_face' },
    
    // Mobile Development
    { label: 'React Native', value: 'react_native' },
    { label: 'Flutter', value: 'flutter' },
    { label: 'iOS/Swift', value: 'ios_swift' },
    { label: 'Android/Kotlin', value: 'android_kotlin' },
    
    // Testing & Monitoring
    { label: 'Jest', value: 'jest' },
    { label: 'Cypress', value: 'cypress' },
    { label: 'Selenium', value: 'selenium' },
    { label: 'Grafana', value: 'grafana' },
    { label: 'Prometheus', value: 'prometheus' },
    { label: 'New Relic', value: 'new_relic' }
];

export const COMMUNICATION_CHANNEL_OPTIONS: Option[] = [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Video Call', value: 'video_call' },
    { label: 'In-person', value: 'in_person' },
]; 