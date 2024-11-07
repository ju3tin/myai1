# RehabMotion Instructions

## Core Features

- Real-time Pose Detection using Webcam
- AI-Powered Rehabilitation Exercise Guidance
- Exercise Performance Tracking
- Interactive User Interface
- Responsive Design for Multiple Devices
- Personalized Exercise Feedback

## Goals & Objectives

- Develop an innovative rehabilitation platform using AI and computer vision
- Provide accurate and real-time exercise form analysis
- Create an intuitive and user-friendly exercise guidance system
- Enable users to perform rehabilitation exercises with confidence
- Leverage advanced pose detection technologies
- Ensure accessibility and ease of use for rehabilitation patients

## Tech Stack & Packages

### Frontend

- Next.js 14 (App Router)
- React 18
- TypeScript
- TensorFlow.js
- Pose Detection Models
- Tailwind CSS
- Radix UI
- Shadcn UI
- Recharts (for potential performance visualization)

### AI & Computer Vision

- MediaPipe Pose Solution
- TensorFlow.js Pose Detection
- WebGL/WebGPU Backend for Performance

### Development Tools

- pnpm (Package Management)
- ESLint
- Prettier
- TypeScript
- PostCSS

## Project Structure

```
rehabmotion/
├── app/
│   ├── components/       # Reusable React components
│   │   ├── ui/           # Shadcn/Radix UI components
│   │   └── pose-detection/ # Pose detection specific components
│   ├── lib/              # Utility functions and helpers
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Global styles and Tailwind configuration
│   └── page.tsx          # Main application page
├── public/               # Static assets
│   └── pose/             # MediaPipe and pose detection assets
└── components.json       # Shadcn UI configuration
```

## Landing Page Components

### Desktop Layout

- Hero Section with Pose Detection Demo
- Feature Highlights
- How It Works Section
- Exercise Categories
- User Testimonials

### Mobile Layout

- Responsive Hero Section
- Collapsible Feature Sections
- Touch-Friendly Exercise Selection

## Color Palette

Based on the `globals.css`, the color scheme uses:

### Primary Colors

- Primary (Chinese Red): `--primary: 0 80% 50%`
- Secondary (Cyan): `--secondary: 180 60% 45%`
- Accent (Gold): `--accent: 48 96% 53%`

### Neutral Colors

- Background: White
- Foreground: Dark Gray
- Muted: Light Gray

## Copywriting

### Headline

- "RehabMotion: AI-Powered Rehabilitation Exercises"
- "Precision Guidance for Your Recovery Journey"

### Subheadlines

- "Real-time Pose Detection"
- "Personalized Exercise Feedback"
- "Professional Rehabilitation at Your Fingertips"

### Call-to-Action Buttons

- "Start Your Rehabilitation"
- "Try Pose Detection"
- "Learn More"
- "View Exercises"

### Feature Descriptions

- "Accurate Form Analysis"
- "Instant Feedback"
- "Adaptive Difficulty Levels"
- "Track Your Progress"

### Error Messages

- "Webcam Access Required"
- "Pose Detection Unavailable"
- "Exercise Not Recognized"
- "Please Adjust Your Position"
