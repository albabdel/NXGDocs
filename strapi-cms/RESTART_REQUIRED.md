# Strapi API Routes Setup - RESTART REQUIRED

The following files have been created to expose the Category and Documentation Article APIs:

## Category API
- `src/api/category/routes/category.js` - Route definitions
- `src/api/category/controllers/category.js` - Controller (handles requests)
- `src/api/category/services/category.js` - Service (business logic)

## Documentation Article API
- `src/api/documentation-article/routes/documentation-article.js` - Route definitions
- `src/api/documentation-article/controllers/documentation-article.js` - Controller
- `src/api/documentation-article/services/documentation-article.js` - Service

## IMPORTANT: Restart Required
**You MUST restart the Strapi server for these changes to take effect.**

1. Stop the current server: `Ctrl+C` in the terminal running `npm run develop`
2. Restart: `npm run develop`
3. The API endpoints will then be available at:
   - `GET http://localhost:1337/api/categories`
   - `GET http://localhost:1337/api/documentation-articles`
