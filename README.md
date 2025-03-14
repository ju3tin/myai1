# My Pose

My Pose is an AI-powered rehabilitation and fitness platform that uses advanced pose detection to guide users through exercises with real-time feedback.

## Technology Stack

### Frontend

- **Next.js 14** (App Router) - React framework for building the web application
- **TypeScript** - Type-safe JavaScript for improved developer experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Radix UI** - Unstyled, accessible UI components
- **Shadcn UI** - Component library built on top of Radix UI

### AI & Computer Vision

- **TensorFlow.js** - JavaScript library for machine learning
- **MediaPipe** - Framework for building multimodal ML pipelines
- **BlazePose** - Real-time pose detection model

### Package Management

- **pnpm** - Fast, disk space efficient package manager

## Pose Detection Model

This project uses the BlazePose model from MediaPipe through TensorFlow.js for real-time human pose detection.

### Model Details

- **Model**: BlazePose (via TensorFlow.js pose-detection API)
- **Type**: Full body pose detection model
- **Runtime**: MediaPipe
- **Features**:
  - Detects 33 key body landmarks
  - Supports 3D pose detection (x, y, z coordinates)
  - Real-time performance on browser
  - High accuracy with low computational requirements

### Implementation

The pose detection is implemented using the following approach:

1. **Model Initialization**:

   ```typescript
   const model = poseDetection.SupportedModels.BlazePose
   const detectorConfig: poseDetection.BlazePoseMediaPipeModelConfig = {
     runtime: 'mediapipe',
     modelType: 'full',
     solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
     enableSmoothing: true,
   }
   const detector = await poseDetection.createDetector(model, detectorConfig)
   ```

2. **Pose Normalization**:
   The detected poses are normalized to account for different body orientations, making the pose comparison more robust.

3. **Similarity Calculation**:
   Multiple strategies are used to calculate the similarity between poses:

   - Key Angles: Comparing angles between key body joints
   - Relative Angles: Comparing the relative angles between body segments
   - Invariant Features: Using position-invariant features for comparison

4. **Visualization**:
   Detected poses are visualized on a canvas overlay with:
   - Color-coded keypoints
   - Connecting lines for the skeleton
   - 3D visualization capabilities

## Features

- **Real-time Pose Detection**: Analyze user movements through webcam
- **Exercise Guidance**: Visual feedback on correct form
- **Pose Comparison**: Compare user's pose with reference poses
- **3D Visualization**: View poses with depth information
- **Performance Metrics**: Track FPS and detection accuracy

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/my-pose.git
   cd my-pose
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

- `app/`: Main application code (Next.js App Router)
  - `components/`: Reusable React components
    - `pose-detection/`: Components for pose detection functionality
    - `pose-detection-3d/`: Components for 3D pose visualization
    - `ui/`: UI components built with Radix and Shadcn
  - `contexts/`: React contexts for state management
  - `lib/`: Utility functions and helpers
    - `poseDrawing.ts`: Functions for drawing poses on canvas
    - `normPose.ts`: Pose normalization utilities
    - `simPose.ts`: Pose similarity calculation
    - `squatDetection.ts`: Exercise-specific detection logic
  - `page.tsx`: Main page component
  - `layout.tsx`: Root layout component
- `public/`: Static assets including reference pose images

## Available Scripts

- `pnpm dev`: Run development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run linter
- `pnpm lint:fix`: Fix linting issues
- `pnpm fix`: Run linter and prettier

## License

This project is licensed under the MIT License.
