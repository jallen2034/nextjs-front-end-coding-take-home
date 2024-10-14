# Front-End JavaScript Coding Challenge

### Message from Jacob:

The original repository for this take-home project utilized Create-React-App, which has been deprecated by the core React team. As a result, 
I opted to build this project using Next.js, MUI, and TypeScript—a more modern stack that aligns closer with my professional experience.

This choice not only allows for improved performance and SEO through server-side rendering, but also provides access to the powerful 
App Router features introduced in Next.js 13. These enhancements facilitate a more efficient data-fetching strategy 
and a seamless user experience in my opinion.

## The Challenge:

I have created an application that serves as a boilerplate for a [Next.js](https://nextjs.org/) project, initialized using [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). The repository includes a `/src/data` directory containing a simplified dataset of MLS real estate transactions in Vancouver.

### Requirements:

- Utilize the provided resale data in `/src/data` (sample Vancouver resale data from 2023, excluding single-family homes).
- Integrate a mapping library to visualize the data on a map. We recommend using [Google Maps](https://cloud.google.com/maps-platform) or [Mapbox](https://www.mapbox.com/), as our data product leverages Mapbox.
- Create a user interface that enables users to interact with, filter, and explore the data.
- Make regular, meaningful commits that clearly reflect the logical progression of your work.

### Getting Started:

#### Installation:

1. Clone the repository to your local machine:
```bash
 git clone https://github.com/your-repo-name/project.git
 cd project
```

2. Install the dependencies:
```bash
npm install
```

#### Mapbox API Key Setup:

In order to use the mapping functionality, you need to set up your Mapbox API key. Follow these steps:

1. Create a `.env` file in the root of the project.
2. Add your Mapbox API key in the `.env` file like this:

```bash
NEXT_PUBLIC_MAPBOX_API_KEY=*your_mapbox_api_key_here*
```
3. The API key will be automatically read from the .env file in the project. 
The key is accessed in the code from apiUtils.ts in the /app folder:

```typescript
const MAPBOX_API_SECRET_KEY: string = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '';

export {
  MAPBOX_API_SECRET_KEY
};
```

### Running the Development Server:
Once your API key is configured, you can start the development server:

```bash
npm run dev
```

### Running a Production Build:
For optimal application performance, I recommended to run the app in production mode. Follow these steps to build and start the app for production:

1. **Build the application**:    Use the following command to create a production-optimized build of the application:
```bash
npm run build
````
This should  generate a `build` directory with optimized assets, including minified JavaScript, CSS, and other files.
2. Start the production build: After building the app, you can start the production server with:

```bash
npm start
```

This will serve the optimized build on your local server, ensuring that the app performs at its best.
- Performance: Running the app in production mode significantly improves load times, performance, and overall user experience.
- Environment: Before doing this, be sure to double check that your environment variables (if any) are correctly configured for the production environment.

### Running the Automated Unit Test Suite with Jest:
To run the unit tests using Jest, use the following command in your terminal:
```bash
npm test
```
This will execute all the unit tests in the project. Upon successful execution, you should see an output similar to the following:

```bash
PASS  src/app/shared-components/property-list/helpers.test.ts (8.478 s)
PASS  src/app/shared-components/filter-data-modal/helpers.test.ts (8.601 s)
PASS  src/app/shared-components/react-mapbox/helper.test.ts (8.777 s)

Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        9.477 s
Ran all test suites.
```
- Test Suites: The number of test files that were executed and passed.
- Tests: The total number of individual test cases that were executed.
- Time: The total amount of time it took to run the automated test suite.

### Building for Production:
To build the app for production:
```bash
npm run build
```



