# Opal Test App 1

A Node.js application that integrates with the Optimizely Opal Tools SDK to provide authenticated access to Campaign Management Platform (CMP) APIs through intelligent tools.

## Overview

This application serves as a bridge between Opal's AI tools and external marketing platforms, specifically focusing on CMP (Campaign Management Platform) integration. It handles authentication, API calls, and data aggregation while providing a clean interface for Opal tools to access campaign data.

## Features

-   **Opal Tools Integration**: Custom tools registered with the Opal Tools SDK
-   **Authentication Management**: OptiID-based authentication with automatic header generation
-   **CMP API Integration**: Seamless integration with Campaign Management Platform APIs
-   **Paginated Data Handling**: Automatic pagination support for large datasets
-   **Error Handling**: Comprehensive error handling and logging
-   **Modular Architecture**: Clean separation of concerns with organized modules

## Project Structure

```
src/
├── config/
│   ├── config.ts          # Application configuration
│   └── logger.ts          # Logging configuration
├── helper/
│   └── common/
│       └── service.helper.ts  # Base service class with pagination support
├── middlewares/
│   ├── processUncaughtException.ts
│   └── resolveApplicationError.ts
├── modules/
│   ├── cmp/
│   │   ├── services/
│   │   │   └── cmp.service.ts     # CMP API service
│   │   └── utils/
│   │       └── axios.cmp.ts       #  CMP Open API axios 
├── routes/
│   └── app.routes.ts      # Application routes
└── index.ts               # Main application entry point
```

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd opal-test-app-1
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**
   Create a `.env` file with required configurations:

    ```env
    NODE_ENV='development'
    PORT=3000
    CMP_BASE_URL=https://api.cmp.optimizely.com
    ```

4. **Start the application**

    ```bash
    # Development
    npm run dev

    # Production
    npm start
    ```

## Local Development with ngrok

For local development and testing with Opal Tools, you'll need to expose your local server using ngrok to create a publicly accessible tunnel.

### Setup ngrok

1. **Install ngrok**
   ```bash
    download from https://ngrok.com/download
   ```

2. **Create ngrok account and authenticate**
   ```bash
   # Sign up at https://ngrok.com and get your auth token
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

3. **Start ngrok tunnel**
   ```bash
   # In a separate terminal, expose your local server
   ngrok http 3000
   
   ```

4. **Use the ngrok URL**
   - Copy the `https://` forwarding URL from ngrok output
   - Use this URL when configuring your Opal Tools integration
   - Example: `https://abc123.ngrok.io`

## Register your tool to Opal

Once your application is running and exposed via ngrok, you need to register your tools with Optimizely Opal.

### Step-by-step Registration

1. **Copy the ngrok HTTPS link**
   - From your ngrok terminal output, copy the `https://` forwarding URL
   - Example: `https://abc123.ngrok.io`
   - **Important**: Use the HTTPS URL, not HTTP

2. **Navigate to Opal Tools Registry**
   - Go to [Optimizely Opal](https://opal.optimizely.com)
   - Navigate to **Tools Registry** page
   - Click **Add Tool Registry**

3. **Configure Tool Registry**
   - **Registry URL**: `<Enter your ngrok HTTPS URL>/discovery`
   - **Name**: Give your tool registry a descriptive name (e.g., "CMP Tools - Local Dev")
   - **Description**: Optional description of your tools
   - **Authentication**: Configure if your tools require specific authentication

4. **Save and Verify**
   - Click **Save** to register your tools
   - Opal will attempt to discover tools from your endpoint
   - Verify that your `campaign_list_tool` appears in the registry

## Tool Discovery

When you register your ngrok URL, Opal will automatically discover available tools by calling your application's tool discovery endpoint. The Opal Tools SDK handles this automatically.

Your registered tools will appear with:
- **Tool Name**: `campaign_list_tool`

### Testing Your Registered Tools

1. **Navigate to Opal Chat or Workflows**
2. **Invoke your tool** by typing commands like:
   ```
   campaign_list_tool from CMP platform
   ```
3. **Verify results** are returned correctly

## Opal Tools Integration

### Campaign List Tool

The application provides a `campaign_list_tool` that allows Opal to fetch campaigns from marketing platforms:

```typescript
@tool({
    name: 'campaign_list_tool',
    description: 'List all campaigns from a marketing platform',
    authRequirements: {
        provider: 'OptiID',
        scopeBundle: 'scheme',
        required: true,
    },
    parameters: [
        {
            name: 'platform',
            type: ParameterType.String,
            description: 'The marketing platform to fetch campaigns from',
            required: true,
        },
    ],
})
```

### Authentication Flow

1. **Tool Invocation**: User calls the tool through Opal
2. **Authentication**: Opal Tools SDK handles OptiID authentication
3. **Header Generation**: Authentication data is transformed into API headers
4. **API Calls**: Headers are used for authenticated CMP API requests
5. **Data Return**: Campaign data is returned to Opal

### Generated Headers

The application automatically generates the following headers from authentication data:

| Header              | Description                       |
| ------------------- | --------------------------------- |
| `Authorization`     | Bearer token from OptiID          |
| `x-auth-token-type` | Token type identifier (`opti-id`) |
| `x-org-sso-id`      | Organization SSO identifier       |
| `x-request-id`      | Unique request identifier         |
| `Accept`            | Content type (`application/json`) |
| `Accept-Encoding`   | Compression support (`gzip`)      |


## Development

### Adding New Tools

1. Create a new method in `Tools` class
2. Decorate with `@tool()` decorator
3. Define authentication requirements and parameters
4. Implement the tool logic


## Error Handling

The application includes comprehensive error handling:

-   **Global Error Middleware**: Catches and processes uncaught exceptions
-   **Service Error Handler**: Wraps service calls in try-catch blocks
-   **API Error Transformation**: Converts API errors to user-friendly messages
-   **Logging**: Detailed logging of all operations and errors


## Monitoring and Logging

The application includes structured logging for:

-   API request/response cycles
-   Authentication events
-   Error tracking

## Dependencies

### Core Dependencies

-   **Express**: Web framework
-   **@optimizely-opal/opal-tools-sdk**: Opal integration
-   **Axios**: HTTP client
-   **Helmet**: Security middleware
-   **CORS**: Cross-origin support

### Development Dependencies

-   **TypeScript**: Type safety
-   **ts-node**: TypeScript execution
-   **nodemon**: Development server


## Support

For additional support, please contact,

**Bivor Adrito**  
- Email: 
  - bivor.adrito@optimizely.com 
  - bivor500@gmail.com 
- GitHub: [bivor-adrito](https://github.com/bivor-adrito)

