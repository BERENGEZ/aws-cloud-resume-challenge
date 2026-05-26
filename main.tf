# 1. Tell Terraform we are connecting to AWS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# 2. Configure our AWS region destination
provider "aws" {
  region = "eu-north-1"
}

# 3. Define our existing DynamoDB cloud resume counter table
resource "aws_dynamodb_table" "counter_table" {
  name         = "cloud-resume-counter"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
# Define our existing S3 storage bucket
resource "aws_s3_bucket" "resume_bucket" {
  bucket = "baraka-cloud-resume-2026"
}

# Ensure public access remains blocked (AWS Security Best Practice)
resource "aws_s3_bucket_public_access_block" "resume_bucket_block" {
  bucket = aws_s3_bucket.resume_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}