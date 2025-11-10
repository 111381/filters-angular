# Filters Angular

A modern Angular application for creating and managing dynamic filters with a beautiful, responsive UI built using Angular 20, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Dynamic Filter Creation**: Build complex filters with multiple criteria
- **Flexible Display Modes**: Support for both modal and inline dialog modes
- **Multiple Filter Types**: 
  - Amount (numeric filters)
  - Title (text-based filters)
  - Date (date-based filters)
- **Conditional Operators**: Various conditions per filter type (equals, greater than, less than, contains, etc.)
- **REST API Integration**: Save and load filters from backend services
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Notifications**: Toast notifications for user feedback
- **TypeScript Type Safety**: Fully typed application with strict mode enabled

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (comes with Node.js)
- **Angular CLI**: v20.x (installed globally)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/111381/filters-angular.git
cd filters-angular
```
### ### 2. Install Dependencies
```
npm install
```
### 3. Configure Environment
The application uses environment files for configuration:
- - Development environment `environment.ts`
- - Production environment `environment.prod.ts`

Update the API endpoint in these files as needed:
```
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  filterServicePath: '/api/filters'
};
```
### 4. Run Development Server
``` bash
npm run dev
```
Navigate to http://localhost:3000/. The application will automatically reload if you change any source files.
The build artifacts will be stored in the dist/ directory.

## 🔧 API Documentation
### FilterRestService
Service for interacting with the backend REST API.
#### Methods
##### `saveFilter(filter: Filter): Promise<Filter>`
Saves a filter to the backend.
**Parameters:**
- `filter`: Filter object to save


##### `getFilters(): Promise<Filter[]>`
Retrieves all filters from the backend.
Returns: Promise resolving to an array of filters
🐛 Troubleshooting
Common Issues
Issue: Application won't start
Ensure Node.js version is 18.x or higher
Delete node_modules and package-lock.json, then run npm install
Issue: API calls failing
Check that the backend API is running
Verify the apiUrl in environment files is correct
Check browser console for CORS errors
Issue: Styles not loading
Clear browser cache
Rebuild the application with npm run build
Check that Tailwind CSS is properly configured
📧 Support
For issues and questions, please open an issue on the GitHub repository.
