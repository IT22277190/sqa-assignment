# PixelSuite Test Microservices Scaffold

This folder is a separate microservice-style path for the PixelSuite-Test project.
It does not replace the current Puppeteer suite in the parent project.

## Layout

- `gateway/` - entry orchestration and shared routing decisions
- `services/artifact-service/` - screenshot and run artifact handling
- `services/fixture-service/` - generated input files and test assets
- `services/result-service/` - pass/fail aggregation and reporting
- `shared/` - common contracts and reusable utilities

## Purpose

The goal is to split responsibilities into small, isolated units so future automation or helper code can be evolved independently.

## Current Status

This is a scaffold only. The parent `test.js` runner in PixelSuite-Test remains the active automation entrypoint.
