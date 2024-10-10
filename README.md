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

### Building for Production:
To build the app for production:
```bash
npm run build
```



