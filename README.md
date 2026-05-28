# AWS Cloud Resume Challenge

This project is a full-stack serverless resume application built on AWS using Infrastructure as Code (Terraform) and automated deployment.

## Live Website

Check out the live resume here: [https://d3itoxd5u4tvw2.cloudfront.net](https://d3itoxd5u4tvw2.cloudfront.net)

---

## The Architecture

[ User Browser ]
│
├───► (HTML/CSS Static Page) ───► [ Amazon CloudFront ] ───► [ AWS S3 Bucket ]
│

└───► (JavaScript Fetch) ───────► [ AWS API Gateway ] ───► [ AWS Lambda ] ───► [ DynamoDB ]

The system breaks down into two core layers:

- **Frontend:** A responsive HTML/CSS resume hosted inside an Amazon S3 bucket, distributed globally via a CloudFront CDN distribution to ensure fast load times.
- **Backend:** A dynamic visitor counter. When the page loads, an asynchronous JavaScript fetch request hits an AWS API Gateway endpoint. This triggers an AWS Lambda function (written in Python 3.12) that increments a visitor count record stored in an Amazon DynamoDB NoSQL table and returns the updated number to the screen.

---

## Problems Solved During Development

Building this project required troubleshooting several core infrastructure roadblocks:

- **CORS Pre-flight Issues:** The browser initially blocked the website from reading data from the API endpoint. I fixed this by updating the Terraform routing configuration from a strict `GET` method to an `ANY` route catchment key. This allowed the backend Python script to successfully capture and respond to browser `OPTIONS` pre-flight requests with the correct access control headers.
- **CloudFront Edge Caching:** Because CloudFront caches files at global edge locations for up to 24 hours, updates made to the frontend HTML file weren't appearing live. I resolved this by adding manual cache invalidations (`/*`) to force immediate updates across the CDN distribution network.

---

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (Fetch API)
- **Infrastructure as Code:** Terraform
- **Compute:** AWS Lambda (Python)
- **API:** AWS API Gateway
- **Storage & CDN:** AWS S3, Amazon CloudFront
- **Database:** Amazon DynamoDB
