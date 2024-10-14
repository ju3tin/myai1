# RehabMotion

RehabMotion is an AI-powered rehabilitation exercise platform that uses pose detection to guide users through their exercises.

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- React
- TensorFlow.js
- Tailwind CSS
- Radix UI
- Shadcn UI

## Features

- Real-time pose detection using webcam
- Exercise guidance and feedback
- User-friendly interface

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/rehabmotion.git
   cd rehabmotion
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Contains the main application code
  - `components/`: Reusable React components
  - `lib/`: Utility functions and helpers
  - `page.tsx`: Main page component
  - `layout.tsx`: Root layout component
- `public/`: Static assets

## Available Scripts

In the project directory, you can run:

- `pnpm dev`: Runs the app in development mode
- `pnpm build`: Builds the app for production
- `pnpm start`: Runs the built app in production mode
- `pnpm lint`: Runs the linter
- `pnpm format`: Formats the code using Prettier

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
