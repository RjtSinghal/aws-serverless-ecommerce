# AWS Serverless E-commerce

A scalable, serverless multi-service e-commerce application built on AWS using microservices architecture.

## Overview

This project demonstrates how to build and deploy a fully serverless backend application on AWS. It showcases modern cloud architecture principles using AWS Lambda, API Gateway, DynamoDB, S3, Cognito, SNS, and event-driven services.

The system is cost-efficient, horizontally scalable, and production-ready with independent microservices that can be deployed and managed separately.

## Project Structure

```
aws-serverless-ecommerce/
├── authService/              # User authentication and authorization
│   ├── handlers/
│   │   ├── signUp.js        # User registration
│   │   ├── signIn.js        # User login
│   │   ├── signOut.js       # User logout
│   │   ├── confirmSignUp.js # Email confirmation
│   │   └── forgotPassword.js # Password reset
│   ├── models/
│   │   └── userModel.js     # User data model
│   └── serverless.yml       # Service config & deployment
│
├── productService/           # Product management
│   ├── handlers/
│   │   ├── getUploadUrl.js        # Generate S3 upload URL
│   │   ├── updateProductImage.js  # Update product image in DB
│   │   ├── getApprovedProducts.js # List approved products
│   │   └── cleanUpProducts.js     # Cleanup old products
│   └── serverless.yml
│
├── categoryService/          # Category management
│   ├── handlers/
│   │   ├── getUploadUrl.js        # Generate S3 upload URL for categories
│   │   ├── updateCategoryImage.js # Update category image
│   │   └── cleanUpCategories.js   # Cleanup old categories
│   └── serverless.yml
│
├── bannerService/            # Banner management
│   ├── handlers/
│   │   ├── uploadBanner.js       # Upload banner image
│   │   └── confirmUpload.js      # Confirm banner upload
│   └── serverless.yml
│
└── orderService/             # Order processing
    ├── handlers/
    │   ├── placeOrder.js    # Create new order
    │   └── getOrders.js     # Get user orders
    └── serverless.yml
```

## Core AWS Services

- **API Gateway** – HTTP/REST API entry point
- **AWS Lambda** – Serverless compute for business logic
- **DynamoDB** – NoSQL database for data storage
- **S3** – Object storage for images and assets
- **Cognito** – User authentication and authorization
- **SNS** – Event notifications
- **SQS** – Queue Service
- **CloudWatch** – Logging and monitoring
- **EventBridge** – Event-driven workflows
- **Serverless Framework** – Infrastructure as Code (IaC)

## Prerequisites

- Node.js 18.x or higher
- AWS Account with appropriate permissions
- AWS CLI configured (`aws configure`)
- Serverless Framework: `npm install -g serverless`

## Key Features

✅ **Microservices Architecture** – Independent, scalable services
✅ **Serverless Compute** – AWS Lambda for automatic scaling
✅ **NoSQL Database** – DynamoDB for flexible data storage
✅ **Image Management** – S3 integration for product/category images
✅ **Authentication** – Cognito for secure user management
✅ **Event-Driven** – SNS/EventBridge for async processing
✅ **Infrastructure as Code** – Serverless Framework deployments
✅ **Production Ready** – Error handling, logging, monitoring

## License

MIT License - See LICENSE file for details

## Author

Rajat Singhal
