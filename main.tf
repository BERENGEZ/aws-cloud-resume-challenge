# 1. Tell Terraform to connect to AWS
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

#SEVERLESS BACKEND (AWS LAMBDA)

#Automatically zip python code to be uploaded to AWS
data "archive_file" "lambda_zip" {
  type    = "zip"
  source_file = "${path.module}/lambda_function.py"
  output_path = "${path.module}/lambda_function.zip"
}

# Create an IAM Execution Role so Lambda has permission to run
resource "aws_iam_role" "lambda_role" {
  name = "cloud-resume-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Attach a secure security policy giving your Lambda role access to read/write DynamoDB
resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "cloud-resume-lambda-dynamodb-policy"
  description = "Allows Lambda to interact with the DynamoDB counter table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "dynamodb:UpdateItem",
          "dynamodb:GetItem"
        ]
        Resource = aws_dynamodb_table.counter_table.arn
      },
      {
        Effect   = "Allow"
        Action   = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}

# Define the live AWS Lambda Function resource
resource "aws_lambda_function" "counter_lambda" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "cloud-resume-counter-function"
  role             = aws_iam_role.lambda_role.arn
  handler          = "lambda_function.lambda_handler"
  runtime          = "python3.12"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
}

# PUBLIC API ENTRANCE (API GATEWAY)

# Create an HTTP API Gateway mapping entry point
resource "aws_apigatewayv2_api" "lambda_api" {
  name          = "cloud-resume-api"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "OPTIONS"]
    allow_headers = ["content-type"]
  }
}

# Connect the API Gateway route directly to our Lambda backend function
resource "aws_apigatewayv2_integration" "api_lambda_integration" {
  api_id           = aws_apigatewayv2_api.lambda_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.counter_lambda.arn
}

resource "aws_apigatewayv2_route" "api_route" {
  api_id    = aws_apigatewayv2_api.lambda_api.id
  route_key = "GET /counter"
  target    = "integrations/${aws_apigatewayv2_integration.api_lambda_integration.id}"
}

# Create a live environment deployment stage for our API
resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.lambda_api.id
  name        = "$default"
  auto_deploy = true
}

# Give permission to API Gateway to trigger your Lambda function
resource "aws_lambda_permission" "api_gw_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.counter_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.lambda_api.execution_arn}/*/*"
}

# Output your live public API endpoint string straight to your terminal screen
output "api_endpoint" {
  value       = "${aws_apigatewayv2_api.lambda_api.api_endpoint}/counter"
  description = "The public API gateway endpoint URL to fetch your live visitor count"
}