# Portfolio Website & AWS Cloud Resume Challenge

This repository contains the Infrastructure as Code (Terraform) and deployment configurations for my official portfolio website. 

The project was initially architected as a fully serverless deployment on AWS (The Cloud Resume Challenge). To optimize costs after the AWS free tier concluded, I successfully migrated the live production workload to my own self-hosted infrastructure.

🌐 **Live Website:** [barakaberenge.com](https://barakaberenge.com)

---

## 🏗️ Phase 2: Current Architecture (Self-Hosted On-Premises)
The live portfolio is currently hosted on my personal bare-metal infrastructure. This phase focused on network security, hypervisor management, and zero-trust ingress.

* **Hypervisor:** Proxmox VE running Ubuntu Server VMs.
* **Web Server:** Nginx and Gunicorn.
* **Ingress & Security:** Traffic is securely routed via a Cloudflare Zero Trust Tunnel (`cloudflared`). The firewall (`ufw`) explicitly drops all inbound web ports, making the server invisible to the public internet while securely serving the website.
* **Networking:** 5-node Tailscale mesh network for secure remote administration.

---

## ☁️ Phase 1: The AWS Cloud Resume Challenge (Archived)
Initially, this project was built entirely on AWS using Terraform for automated provisioning and GitHub Actions for CI/CD.

### Historical AWS Architecture
* **Frontend:** A responsive HTML/CSS/JS frontend hosted in an Amazon S3 bucket, distributed globally via an Amazon CloudFront CDN.
* **Backend:** A serverless visitor counter triggered by an asynchronous JavaScript `fetch()` request. The request passed through an AWS API Gateway endpoint to an AWS Lambda function (Python 3.12), which updated a persistent counter in an Amazon DynamoDB NoSQL table.
* **Automation:** A GitHub Actions pipeline automatically tested and deployed Terraform updates upon code push.

### Technical Roadblocks Solved in AWS
1. **CORS Pre-flight Issues:** Browsers initially blocked the website from reading data from the API endpoint. I resolved this by updating the Terraform routing configuration from a strict `GET` method to an `ANY` route catchment key, allowing the backend Python script to intercept `OPTIONS` pre-flight requests and respond with the correct Access-Control headers.
2. **CloudFront Edge Caching:** Because CloudFront caches files at edge locations for up to 24 hours, updates to the HTML frontend were not propagating. I resolved this by implementing manual cache invalidations (`/*`) in the deployment pipeline to force immediate cache purges across the CDN.

---

## 💻 Core Technologies Used
* **Infrastructure as Code:** Terraform
* **Cloud Platform (Archived):** AWS (S3, CloudFront, API Gateway, Lambda, DynamoDB)
* **Self-Hosted Infrastructure (Active):** Proxmox VE, Ubuntu Server, Nginx, Cloudflare Tunnels, Tailscale
* **CI/CD & Version Control:** GitHub Actions, Git
* **Languages:** Python 3.12, JavaScript (Fetch API), HTML5, CSS3
