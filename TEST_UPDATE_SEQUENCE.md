# QA Execution Report: Playwright Resize Automation

## Project Overview

This report documents the end-to-end test engineering and stabilization process for the Pixels Suite Resize workflow, automated using Playwright with TypeScript.

Scope of validation:

1. Application load and tool accessibility.
2. Functional resize behavior using dimension inputs.
3. Aspect ratio lock behavior under input changes.

Target system:

1. Application: https://www.pixelssuite.com/
2. Workflow under test: Resize tool (SPA module)
3. Automation stack: Playwright Test runner, Chromium project profile

## Objective

Achieve deterministic and repeatable passing execution for all three Resize test cases in resize.spec.ts, with artifact generation for QA evidence.

## Test Case Matrix

| Test Case ID | Test Case Name | Business Purpose | Core Automation Steps | Assertions | Evidence |
|---|---|---|---|---|---|
| TC-01 | Verify resize tool loads | Validate that the SPA shell and Resize module are reachable and ready for interaction | Navigate to home URL, transition state by clicking Resize card/button, verify module readiness | Page title matches Pixels pattern | screenshots/01_app_load.png |
| TC-02 | Upload image and resize via input fields | Validate functional image resize using explicit width and height controls | Upload test-image.jpg, wait for canvas rendering, disable Keep Aspect when active, update width and height controls | Canvas width attribute updated to expected value | screenshots/02_resize_inputs.png |
| TC-03 | Verify Keep Aspect Ratio functionality | Validate dependent field recalculation when aspect lock is active | Upload image, ensure Keep Aspect is checked, capture baseline height, update width, trigger re-computation | Height value changes from baseline due to aspect lock logic | screenshots/03_aspect_ratio.png |

## Timeline of Changes and Technical Rationale

1. Initial Playwright suite bootstrap
1. Created a three-test baseline suite with screenshot capture.
2. Early assumptions were based on generic DOM controls and a drag-handle model.
3. This provided a functional starting point but did not yet reflect live DOM behavior.

2. Project scaffolding and runtime configuration
1. Added package.json, Playwright config, and output folders.
2. Established Chromium as the default execution project for predictable browser behavior.
3. Standardized artifact paths for repeatable evidence collection.

3. TypeScript environment hardening
1. Added tsconfig and aligned compiler settings with Playwright runtime expectations.
2. Prevented configuration drift and type-resolution issues during local runs.

4. Documentation and reproducibility improvements
1. Added README instructions for dependency install, browser install, and test execution.
2. Reduced onboarding friction and improved execution consistency.

5. Repository governance and branch workflow
1. Initialized version control and established main and dev branches.
2. Published both branches to remote for traceable QA iteration history.

6. Real-DOM adaptation for live Resize module
1. Replaced initial assumptions after observing production behavior.
2. Key findings:
1. Render target is a canvas, not a traditional resizable div.
2. Controls become available only after file upload.
3. Original drag-handle concept is not applicable in the rendered UI.
3. Refactored tests to use upload-gated interactions and canvas assertions.

7. Test asset dependency resolution
1. Added test-image.jpg at workspace root.
2. This unblocked setInputFiles and ensured precondition satisfaction for controls injection.

8. Recovery from file state regression
1. Restored missing automation files and removed duplicated code blocks.
2. Eliminated duplicate identifier failures and restored stable test discovery.

9. Single Page Application routing and state management fix
1. Root cause: direct navigation to /resize did not reliably initialize the Resize module state in the SPA.
2. Impact: beforeEach waited for controls that never materialized, causing timeouts.
3. Resolution:
1. Navigate to base URL.
2. Transition state through user-equivalent interaction by clicking the Resize entry point.
3. Gate progression on Select files visibility to confirm module readiness.

10. Semantic locator correction for numeric controls
1. Root cause: width and height inputs are numeric fields exposed as ARIA spinbutton, not textbox.
2. Impact: getByRole with textbox failed DOM traversal and caused control lookup timeouts.
3. Resolution: replaced textbox role queries with spinbutton role queries in Feature 2 and Feature 3.
4. Rationale: role-based semantic locators aligned with accessibility tree are more stable than brittle attribute assumptions.

## Challenges and Solutions

### 1. SPA Routing and Module Readiness

Challenge:

1. Deep-link navigation to /resize did not always hydrate the expected component tree.

Solution:

1. Implemented state-aware navigation through the base route.
2. Clicked the Resize entry control to trigger intended route/state transition.
3. Added readiness assertion for Select files before test actions.

### 2. Missing Stable IDs and Attribute-Based Targeting

Challenge:

1. Core controls lacked dependable id or name attributes in the live DOM.

Solution:

1. Adopted semantic locators using getByRole.
2. Relied on accessible names and ARIA roles to reduce selector fragility.

### 3. Dynamic Canvas Rendering Model

Challenge:

1. Output rendering occurred in canvas, invalidating element-size CSS assertions used in generic resize widgets.

Solution:

1. Shifted validation to canvas-relevant attributes and behavior checks.
2. Replaced drag-handle validation with aspect-ratio logic validation consistent with actual UI capabilities.

### 4. File Upload as Functional Precondition

Challenge:

1. Resize controls were not injected into the DOM until an image was uploaded.

Solution:

1. Added explicit file upload step in functional tests.
2. Enforced existence of test-image.jpg in the workspace root.

## Final Execution Status

Execution command:

1. npx playwright test resize.spec.ts --project=chromium

Result:

1. 3 passed
2. All test cases completed successfully.

## Current Outcome

The Resize automation suite is stable, fully passing, and producing screenshot artifacts in the screenshots directory as QA evidence.
