# Lead Research AI - Lead Generation & Outreach Platform

An enterprise-grade lead research and outreach platform built with NestJS, MongoDB, React, and AI technologies.

## Overview

Lead Research AI is a comprehensive platform that helps businesses identify, qualify, and engage with potential customers using the power of AI. The platform automates the lead generation process by extracting LinkedIn profiles based on Ideal Customer Profiles (ICPs), analyzing leads for qualification, and sending personalized email campaigns.

## Features

### Lead Generation

- **ICP Creation**: Define your Ideal Customer Profile with our AI-powered wizard
- **LinkedIn Lead Generation**: Extract LinkedIn profiles based on your ICP
- **Multi-Provider Support**: Connect with different data providers (LinkedIn, Apollo, Hunter)
- **AI-Powered Qualification**: AI analyzes profiles to determine best match for your ICP
- **Proxy Rotation**: Enterprise-grade proxy management to avoid rate limiting

### 3. Content Aggregation Engine
- Multi-platform scraping (LinkedIn, Twitter, Instagram, blogs)
- YouTube integration for video content

### 4. AI-Powered Analysis
- Topic extraction and sentiment analysis
- Engagement scoring and content summarization
- Personalized insights for sales outreach

### 5. Sales Automation Tools
- AI-powered cold email generation
- Campaign sequencing with A/B testing
- Performance analytics

- **Multi-Stage Campaigns**: Create email sequences with optimal timing
- **AI-Generated Content**: Let AI write personalized emails based on lead information
- **Advanced Email Tracking**: Track opens, clicks, and replies with precision
- **Anti-Spam Technology**: Ensure delivery to inbox with our advanced deliverability tools

### Analytics & Insights

### Frontend
- Next.js with TypeScript
- Shadcn UI components
- Recharts for data visualization
- React Query for data fetching

### Backend
- NestJS with TypeScript
- MongoDB for content storage
- Redis for caching and job queues

The application consists of:

- **Backend**: NestJS with MongoDB (Mongoose) and Bull queue for background processing
- **Frontend**: React with TypeScript and Material UI (not included in this repository)
- **AI Integration**: OpenAI API for content generation and lead analysis
- **Email Delivery**: Integration with SendGrid or other email service providers
- **Tracking System**: Custom pixel and link tracking infrastructure

## Requirements

- Node.js 18+
- MongoDB 5+
- Redis for job processing
- OpenAI API key for AI features

## Getting Started

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
# Database
MONGODB_URI=mongodb://localhost:27017/lead_research_ai

# Redis (for Bull queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# API
PORT=3001
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Email Tracking
EMAIL_TRACKING_DOMAIN=https://track.yourdomain.com
APP_DOMAIN=https://app.yourdomain.com

# Email Provider
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run start:dev

# Build for production
npm run build
```

## Project Structure

The project follows a modular architecture, with each feature in its own NestJS module:

- **Leads Module**: Manages lead data and operations
- **Campaigns Module**: Handles campaign management
- **LinkedIn Module**: Manages LinkedIn lead generation
- **Emails Module**: Handles email campaign creation and tracking
- **AI Module**: Provides AI services for content generation and analysis
- **Auth Module**: Handles authentication and authorization

## APIs

The platform exposes RESTful APIs for all functionality, documented with Swagger at `/api-docs`.

## License

Proprietary - All rights reserved.

## Roadmap

Future development plans include:

- **Chrome Extension**: Extract leads directly from LinkedIn with a browser extension
- **Advanced Analytics Dashboard**: Gain deeper insights into campaign performance
- **AI-Powered Lead Scoring**: Automatically score and prioritize leads
- **Integration Ecosystem**: Connect with CRM systems, marketing automation platforms, and more 
