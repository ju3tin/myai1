import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://posedetector.com'

  // 主要页面路径
  const routes = [
    '',
    '/pose-detection',
    '/pose-detection-3d',
    '/pose-tracking',
    '/pose-comparison',
    '/mp-pose-detection',
    '/facing-detection',
    '/pose-training',
  ]

  // 当前日期，用于 lastModified
  const date = new Date()

  // 生成 sitemap 条目
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: date,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  })) as MetadataRoute.Sitemap
}
