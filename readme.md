# CI-CMP-Bynder-Middleware

This project is a middleware integration between Bynder and Optimizely CMP (Content Marketing Platform). It facilitates asset management, synchronization, and event handling between the two platforms.

## Table of Contents

- [Use Cases](#use-cases)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Manifest.json](#manifestjson)
- [Manual Testing](#manual-testing)
- [Contributing](#contributing)
- [Author](#author)

---

## Use Cases

The CI-CMP-Bynder-Middleware is designed to streamline integration and synchronization between Bynder and Optimizely CMP. Below are the primary use cases for this middleware:

1. **Asset Flagging and Transfer**  
   Send assets from CMP to Bynder using a field or folder-based flag to categorize and manage assets efficiently.

2. **Task-Based Asset Push**  
   Push assets to Bynder after tasks are completed, either one at a time or in bulk, directly from the CMP library.

3. **Targeted Folder Synchronization**  
   Push assets from CMP to specific Bynder Dam, ensuring proper organization and storage.

4. **Version Control**  
   Always push the latest version of assets from CMP to Bynder, ensuring updates are reflected in the destination.

5. **Field Updates**  
   Update asset fields in Bynder to reflect the latest metadata or changes made in CMP based on mapping.

6. **Real-Time Event Handling**  
   Process asset-related events such as `asset_added`, `asset_modified`, and `asset_removed` to ensure synchronization between CMP and Bynder.

7. **Custom Metadata Mapping**  
   Map metadata fields between CMP and Bynder for seamless integration and enhanced asset categorization.

8. **Tag Synchronization**  
   Synchronize tags between CMP and Bynder to maintain consistency and improve asset discoverability.


---

## Features

- **Webhook Handling**: Processes asset-related events (`asset_added`, `asset_modified`, `asset_removed`) from CMP.
- **Asset Synchronization**: Uploads, updates, and manages assets in Bynder.
- **Field Mapping**: Maps CMP fields to Bynder metadata properties.
- **Tag Management**: Synchronizes tags between CMP and Bynder.
- **Queue Management**: Uses Redis and BullMQ for job queuing and processing.
- **Error Handling**: Centralized error handling with Sentry integration.
- **Sanity Checks**: Validates asset fields and configurations before processing.

---

## Project Structure

    ├── .github
    │ ├──workflows/ # GitHub Actions workflows 
    ├── .vscode/ # VSCode settings 
    ├── src/ # Source code 
    │ ├── config/ # Configuration files 
    │ ├── helper/ # Utility functions and decorators 
    │ ├── middlewares/ # Express middlewares 
    │ ├── modules/ # Core modules for Bynder and CMP 
    │ ├── routes/ # API routes 
    │ └── index.ts # Application entry point 
    ├── .env # Environment variables 
    ├── Dockerfile # Docker configuration 
    ├── Dockerfile.production # Production Docker configuration 
    ├── package.json # Node.js dependencies and scripts 
    ├── tsconfig.json # TypeScript configuration 
    └── README.md # Project documentation

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ci-cmp-bynder-middleware.git
   cd ci-cmp-bynder-middleware
2. Install dependencies:
    ```bash
    npm install
3. Build the project
    ```
    npm run build

---
## Configuration
1. Create a .env file in the root directory. Use .env.example as a reference.
2. Update the environment variables with your credentials and configuration.
---
## Usage
#### Development
Start the development server with hot-reloading:
```
npm run dev
```

#### Production
1. Build the project:
```
npm run build
```

2. Start the server:
```
npm run start
```

#### Docker
Build and run the Docker container:
```
docker build -t ci-cmp-bynder-middleware .
docker run -p 8000:8000 --env-file .env ci-cmp-bynder-middleware
```
---
## Scripts
* ```npm run build```: Compiles the TypeScript code into JavaScript.
* ```npm run start```: Starts the application in production mode.
* ```npm run dev```: Starts the application in development mode with hot-reloading.
* ```npm run lint```: Runs ESLint to check for code quality issues.
* ```npm run lint:fix```: Fixes linting issues automatically.
* `npm run prettier`: Checks code formatting with Prettier.
* `npm run prettier:fix`: Formats code with Prettier.

---
## Environment Variables

The following environment variables are required for the application to function properly:

| Variable                     | Description                                   |
|------------------------------|-----------------------------------------------|
| `NODE_ENV`                   | Application environment (`development`, `production`) |
| `PORT`                       | Port number for the server                   |
| `WEBHOOK_SECRET`             | Secret for verifying webhooks                |
| `APP_CLIENT_ID`              | CMP client ID                                |
| `APP_CLIENT_SECRET`          | CMP client secret                            |
| `ACCESS_TOKEN_BASE_URL`      | CMP access token URL                         |
| `CMP_BASE_URL`               | CMP API base URL                             |
| `BYNDER_BASE_URL`            | Bynder API base URL                          |
| `BYNDER_PERMANENT_ACCESS_TOKEN` | Bynder permanent access token              |
| `REDIS_HOST`                 | Redis host                                   |
| `REDIS_PASSWORD`             | Redis password                               |
| `SENTRY_DSN`                 | Sentry DSN for error tracking                |

Refer to the `.env.example` file for a complete list of environment variables and their expected values.

---

## API Endpoints

### Webhooks

- **POST** `/api/webhooks/cmp`  
  Handles CMP webhook events.

### Mapper

- **POST** `/api/mapper`  
  Processes field and tag mappings.

### Health Check

- **GET** `/`  
  Returns a simple "Hello, TypeScript with Express!" message.

- **GET** `/_status`  
  Returns the application status.

---

## Manifest.json

The `manifest.json` file contains metadata and configuration parameters required for the middleware integration. It defines the application's name, description, parameters, and webhooks.

### Key Fields

- **name**: The name of the middleware application.
- **description**: A brief description of the middleware's purpose.
- **parameters**: Configuration parameters required for the application to function. Each parameter includes:
  - `label`: A human-readable label for the parameter.
  - `type`: The data type of the parameter (e.g., `string`, `json`, `secret`).
  - `required`: Indicates whether the parameter is mandatory.
- **webhooks**: Defines webhook configurations, including:
  - `description`: A description of the webhook's purpose.
  - `secret`: The secret key used to verify webhook requests.
  - `endpoint`: The API endpoint for the webhook.
  - `event_names`: A list of event names the webhook listens to.

### Example Structure

```json
{
  "name": "si-cmp-bynder-middleware",
  "description": "CMP Bynder Middleware Integration",
  "parameters": {
    "ACCESS_TOKEN_BASE_URL": {
      "label": "Access token URL for CMP",
      "type": "string",
      "required": true
    },
    "CMP_BASE_URL": {
      "label": "CMP Base URL for API request",
      "type": "string",
      "required": true
    },
    "BYNDER_BASE_URL": {
      "label": "Bynder Base URL for API request",
      "type": "string",
      "required": true
    },
    "BYNDER_PERMANENT_ACCESS_TOKEN": {
      "label": "Bynder Permanent Access Token",
      "type": "secret",
      "required": true
    },
    "BYNDER_WAITING_ROOM": {
      "label": "Enable Bynder Waiting Room",
      "type": "string",
      "required": true
    },
    "BYNDER_USE_HARD_CODED_META_PROPERTY": {
      "label": "Bynder Use Hardcoded Meta Properties",
      "type": "string",
      "required": true
    },
    "BYNDER_BRAND_ID": {
      "label": "Bynder Brand ID",
      "type": "string",
      "required": true
    },
    "BYNDER_USE_EXTERNAL_TAG": {
      "label": "Bynder Use External Tag",
      "type": "string",
      "required": true
    },
    "_config_field_mapping": {
      "label": "Field Mapping JSON",
      "type": "json",
      "required": true
    },
    "_config_tag_mapping": {
      "label": "Tag Mapping JSON",
      "type": "json",
      "required": true
    },
    "_config_send_indicator": {
      "label": "Send Indicator JSON",
      "type": "json",
      "required": true
    },
    "_config_delete_behavior": {
      "label": "Delete Behavior",
      "type": "string",
      "required": true
    },
    "WEBHOOK_SECRET": {
      "label": "Webhook Secret",
      "type": "secret",
      "required": true
    },
    "SENTRY_DSN": {
      "label": "Sentry DSN",
      "type": "secret",
      "required": true
    },
    "SENTRY_TAG": {
      "label": "Sentry Unique Tag",
      "type": "string",
      "required": true
    },
    "REDIS_HOST": {
      "label": "Redis Host",
      "type": "secret",
      "required": true
    },
    "REDIS_PASSWORD": {
      "label": "Redis Password",
      "type": "secret",
      "required": true
    },
    "QUEUE_NAME": {
      "label": "Queue Name, leave it blank if queue is not needed",
      "type": "string"
    }
  }
}
```
---
## Manual Testing

This section outlines the steps and test cases for manually testing the CI-CMP-Bynder-Middleware integration.

### 1. Uploading an Asset in CMP

#### Test Cases:
1. **Verify asset upload succeeds when all required fields are populated**  
   - **Given**: Asset Destination is set to a value (e.g., Bynder)  
   - **Or**: Folder values are populated if required  
   - **When**: The asset is uploaded in CMP  
   - **Then**: The asset is successfully uploaded to the corresponding 3rd party system  

2. **Verify asset upload fails when Asset Destination is not provided**  
   - **Given**: Asset Destination is empty  
   - **When**: The asset is uploaded in CMP  
   - **Then**: The asset will not upload  

3. **Verify asset upload fails when folder value is required but not provided**  
   - **Given**: Asset Destination requires a folder value  
   - **And**: No folder value is provided  
   - **When**: The asset is uploaded in CMP  
   - **Then**: The asset will not upload  
  

---

### 2. Deleting an Asset in CMP

#### Test Cases:
1. **Verify asset deletion succeeds when Delete Behavior is set to 'Delete'**  
   - **Given**: Delete Behavior is set to 'Delete' in Configuration  
   - **When**: The asset is deleted in CMP  
   - **Then**: The corresponding asset is deleted in the 3rd party system  

2. **Verify asset deletion does not occur when Delete Behavior is not 'Delete'**  
   - **Given**: Delete Behavior is set to 'Retain' or any other value  
   - **When**: The asset is deleted in CMP  
   - **Then**: The asset remains in the 3rd party system  

---

### 3. Updating an Asset’s Field in CMP

#### Test Cases:
1. **Verify asset field updates in 3rd party when correct mapping is provided**  
   - **Given**: The field property value in Configuration has a 1:1 mapping  
   - **When**: The asset field is updated in CMP  
   - **Then**: The corresponding labels/tags/meta-properties are updated in the 3rd party system  

2. **Verify asset field does not update when no mapping is provided**  
   - **Given**: The field property value in Configuration does not contain a mapping  
   - **When**: The asset field is updated in CMP  
   - **Then**: The corresponding field in the 3rd party remains unchanged  

3. **Verify only mapped fields are updated in the 3rd party system**  
   - **Given**: Some fields have a 1:1 mapping and some do not  
   - **When**: Multiple asset fields are updated in CMP  
   - **Then**: Only the mapped fields are updated in the 3rd party system  

---

### 4. Updating an Asset’s Title in CMP

#### Test Cases:
1. **Verify asset title update in 3rd party system**  
   - **Given**: An asset exists in CMP and the 3rd party system  
   - **When**: The asset title is updated in CMP  
   - **Then**: The corresponding asset name is updated in the 3rd party system  

---

### 5. Deleting an Asset in 3rd Party while Keeping in CMP

#### Test Cases:
1. **Verify asset deletion succeeds when Delete Behavior is set to 'Delete'**  
   - **Given**: Delete Behavior is set to 'Delete' in Configuration  
   - **When**: The asset destination field is removed (empty)  
   - **Then**: The corresponding asset is deleted in the 3rd party system  

2. **Verify asset deletion does not occur when Delete Behavior is not 'Delete'**  
   - **Given**: Delete Behavior is set to 'Retain' or any other value  
   - **When**: The asset destination field is removed (empty)  
   - **Then**: The asset remains in the 3rd party system  

---

### 6. Uploading a New Version of an Asset in CMP

#### Test Cases:
1. **Verify new version creation when supported by the 3rd party system**  
   - **Given**: The 3rd party system supports versioning  
   - **When**: A new version of an asset is uploaded in CMP  
   - **Then**: A new version of the asset is created in the 3rd party system  

2. **Verify asset update instead of new version creation when versioning is not supported**  
   - **Given**: The 3rd party system does not support versioning  
   - **When**: A new version of an asset is uploaded in CMP  
   - **Then**: The existing asset in the 3rd party system is updated instead of creating a new version  

3. **Verify error handling when version update fails**  
   - **Given**: A network or API failure occurs during version update  
   - **When**: A new version of an asset is uploaded in CMP  
   - **Then**: The version update process fails gracefully with an appropriate error logged in the console or in the monitoring system  

---

### 7. Uploading Multiple Files at the Same Time

#### Test Cases:
1. **Verify multiple files are uploaded sequentially using a queue**  
   - **Given**: Multiple files are uploaded at the same time  
   - **When**: The upload process starts  
   - **Then**: The files are uploaded one after another in a queue  

2. **Verify upload continues when one file fails**  
   - **Given**: Multiple files are in the queue  
   - **And**: One file fails to upload due to an error  
   - **When**: The upload process continues  
   - **Then**: The remaining files should still be uploaded  

3. **Verify error handling when all file uploads fail**  
   - **Given**: A network or API failure occurs  
   - **When**: Multiple files are uploaded at the same time  
   - **Then**: An appropriate error message is logged in the console or in the monitoring system  
## Contributing

We welcome contributions to the CI-CMP-Bynder-Middleware project! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch:
```
git checkout -b feature-name
```
3. Commit your changes
```
git commit -m "Add feature-name"
```
4. Push to the branch
```
git push origin feature-name
```
5. Open a pull request.

**Guidelines**
- Ensure your code is well-documented and follows the project's coding standards.
- Write clear and concise commit messages.
- Update the documentation if your changes affect it.
- Be respectful and constructive in code reviews and discussions.
Thank you for contributing to the project!
---
## Author

This project is maintained by:

**Bivor Adrito**  
- GitHub: [@bivor-adrito](https://github.com/bivor-adrito)  
- Email: bivor500@gmail.com  

Feel free to reach out for any questions or collaboration opportunities!
