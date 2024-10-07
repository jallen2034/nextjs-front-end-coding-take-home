# Spark Front-End JavaScript Coding Challenge

### Message from Jacob:

The original repository for this take-home project utilized Create-React-App, which has been deprecated by the core React team. As a result, 
I opted to build this project using Next.js, MUI, and TypeScript—a more modern stack that aligns closer with my professional experience.

This choice not only allows for improved performance and SEO through server-side rendering, but also provides access to the powerful 
App Router features introduced in Next.js 13. These enhancements facilitate a more efficient data-fetching strategy 
and a seamless user experience in my opinion.

## About [Spark](https://spark.re)

At Spark, our mission is to empower the new development industry to sell more homes, faster. As digitization accelerates, we take pride in leading the industry with innovative digital sales, marketing, and management solutions, striving to power every new development transaction.

We are currently seeking a JavaScript front-end developer. This challenge aims to assess your coding style, problem-solving approach, and proficiency in JavaScript.

## The Challenge

I have created an application that serves as a boilerplate for a [Next.js](https://nextjs.org/) project, initialized using [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). The repository includes a `/src/data` directory containing a simplified dataset of MLS real estate transactions in Vancouver.

### Requirements

- Utilize the provided resale data in `/src/data` (sample Vancouver resale data from 2023, excluding single-family homes).
- Integrate a mapping library to visualize the data on a map. We recommend using [Google Maps](https://cloud.google.com/maps-platform) or [Mapbox](https://www.mapbox.com/), as Spark's data product leverages Mapbox.
- Create a user interface that enables users to interact with, filter, and explore the data.
- Make regular, meaningful commits that clearly reflect the logical progression of your work.

### Getting Started

To launch the development server, execute the following command:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
