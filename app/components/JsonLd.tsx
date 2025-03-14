import React from 'react'

export const JsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PoseDetector.com',
    description:
      'Cutting-edge AI-powered pose detection for fitness, dance, healthcare, and rehabilitation',
    url: 'https://posedetector.com',
    applicationCategory: 'HealthApplication, FitnessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'PoseDetector Team',
      url: 'https://posedetector.com',
    },
    potentialAction: {
      '@type': 'UseAction',
      target: 'https://posedetector.com',
    },
    featureList: [
      'Real-time pose detection',
      '3D pose tracking',
      'Pose comparison',
      'Pose training',
      'Facing detection',
    ],
    screenshot: 'https://posedetector.com/og-image.svg',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default JsonLd
