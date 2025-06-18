terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "movie_app_frontend" {
  bucket = "movie-app-frontend-${random_id.suffix.hex}"

  tags = {
    Project = "movie-app"
  }
}

resource "aws_s3_bucket_website_configuration" "movie_app_frontend" {
  bucket = aws_s3_bucket.movie_app_frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    suffix = "index.html"
  }

  routing_rule {
    condition {
      http_error_code_returned_equals = "404"
    }
    redirect {
      replace_key_with = "index.html"
    }
  }
}

resource "aws_s3_bucket_acl" "movie_app_frontend" {
  depends_on = [
    aws_s3_bucket_ownership_controls.movie_app_frontend,
    aws_s3_bucket_public_access_block.movie_app_frontend,
  ]

  bucket     = aws_s3_bucket.movie_app_frontend.id
  acl        = "public-read"
}

resource "aws_s3_bucket_ownership_controls" "movie_app_frontend" {
  bucket = aws_s3_bucket.movie_app_frontend.id
  
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "movie_app_frontend" {
  bucket = aws_s3_bucket.movie_app_frontend.id
  block_public_acls   = false
  block_public_policy = false
  ignore_public_acls  = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "public_read" {
  statement {
    actions   = ["s3:GetObject"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    resources = ["${aws_s3_bucket.movie_app_frontend.arn}/*"]
    effect    = "Allow"
  }
}

resource "aws_s3_bucket_policy" "movie_app_frontend" {
  bucket = aws_s3_bucket.movie_app_frontend.id
  policy = data.aws_iam_policy_document.public_read.json
}

output "bucket_name" {
  value = aws_s3_bucket.movie_app_frontend.bucket
}

output "website_url" {
  value = aws_s3_bucket_website_configuration.movie_app_frontend.website_endpoint
}
