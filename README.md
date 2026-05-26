# AWS Serverless Cloud Resume Challenge

## 🚀 Live Production Demo
You can view my live, globally distributed cloud resume here: [d3itoxd5u4tvw2.cloudfront.net](https://d3itoxd5u4tvw2.cloudfront.net)

## 🏗️ Technical Architecture
This project is built completely on a serverless microservice architecture using AWS best practices for high availability and security:



* **Frontend Hosting:** Static HTML/CSS assets hosted securely within **Amazon S3**.
* **Global Content Delivery:** **Amazon CloudFront CDN** configured with **Origin Access Control (OAC)** to enforce private bucket security policies and encrypt global traffic via SSL/TLS.
* **Compute Tier:** **AWS Lambda** executing a serverless Python 3.12 script using tailored IAM access roles.
* **Database Tier:** **Amazon DynamoDB** scaling on-demand to handle atomic integer updates for the visitor count.
* **API Management:** **AWS API Gateway (HTTP API)** exposing a public `/getcount` route with custom Cross-Origin Resource Sharing (CORS) rules.

## 🛠️ Key Troubleshoots & Engineering Gains
1. **CORS Optimization:** Resolved browser-level security blocks by explicitly structuring allowable origins (`*`), headers (`content-type`), and methods (`GET`, `OPTIONS`) at the API Gateway layer.
2. **CDN Cache Invalidation:** Implemented programmatic edge mutations utilizing wildcard invalidations (`/*`) to force worldwide node propagation upon content modification.