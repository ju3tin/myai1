import {
  ArrowRight,
  CheckCircle,
  Activity,
  Zap,
  Brain,
  HeartPulse,
  Plus,
  Minus,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion'
import { Button } from '@/app/components/ui/button'

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Advanced Pose Detection for Better Movement
              </h1>
              <p className="text-xl md:text-2xl text-gray-200">
                Enhance your fitness, dance, healthcare, and rehabilitation with
                our cutting-edge AI-powered pose detection technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-white text-purple-900 hover:bg-gray-100"
                >
                  <Link
                    href="/pose-detection"
                    className="flex items-center gap-2"
                  >
                    Try Now <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-purple-900 hover:bg-gray-100"
                >
                  <Link
                    href="/pose-comparison"
                    className="flex items-center gap-2"
                  >
                    Compare Technologies
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl border border-purple-400/30">
              <Image
                src="/images/hero-pose.svg"
                alt="AI Pose Detection"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cutting-Edge Pose Detection Technologies
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform offers multiple state-of-the-art pose detection
              technologies to suit your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:border-primary/50 transition-all">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">MediaPipe + BlazePose</h3>
              <p className="text-muted-foreground mb-4">
                Google's lightweight solution for real-time pose detection with
                high accuracy and low latency.
              </p>
              <Link
                href="/mp-pose-detection"
                className="text-primary font-medium inline-flex items-center"
              >
                Explore <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:border-primary/50 transition-all">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">TFJS + MoveNet</h3>
              <p className="text-muted-foreground mb-4">
                TensorFlow.js implementation of MoveNet for ultra-fast and
                accurate pose detection in the browser.
              </p>
              <Link
                href="/pose-tracking"
                className="text-primary font-medium inline-flex items-center"
              >
                Explore <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-lg border border-border hover:border-primary/50 transition-all">
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">TFJS + BlazePose</h3>
              <p className="text-muted-foreground mb-4">
                Advanced 3D pose detection with TensorFlow.js implementation of
                BlazePose for detailed movement analysis.
              </p>
              <Link
                href="/pose-detection-3d"
                className="text-primary font-medium inline-flex items-center"
              >
                Explore <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Applications Across Industries
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our pose detection technology powers innovation in fitness,
              healthcare, dance, and more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <HeartPulse className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">
                  Healthcare & Rehabilitation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Monitor patient movements during physical therapy, ensure
                  proper form, and track progress over time with detailed
                  analytics.
                </p>
                <ul className="space-y-2">
                  {[
                    'Remote patient monitoring',
                    'Progress tracking',
                    'Form correction',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Fitness & Training</h3>
                <p className="text-muted-foreground mb-4">
                  Get real-time feedback on exercise form, count repetitions
                  automatically, and optimize your workout routine.
                </p>
                <ul className="space-y-2">
                  {[
                    'Form correction',
                    'Rep counting',
                    'Performance analytics',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Dance & Performance</h3>
                <p className="text-muted-foreground mb-4">
                  Perfect your dance moves with detailed feedback, compare your
                  performance to professionals, and track your improvement.
                </p>
                <ul className="space-y-2">
                  {[
                    'Movement analysis',
                    'Choreography comparison',
                    'Technique improvement',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-pink-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">
                  Research & Development
                </h3>
                <p className="text-muted-foreground mb-4">
                  Compare different pose detection technologies, collect
                  movement data, and develop custom applications.
                </p>
                <ul className="space-y-2">
                  {[
                    'Technology comparison',
                    'Data collection',
                    'Custom application development',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-pink-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Movement Analysis?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Start using our cutting-edge pose detection technology today and
            unlock new possibilities in fitness, healthcare, dance, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-900 hover:bg-gray-100"
            >
              <Link href="/pose-detection" className="flex items-center gap-2">
                Get Started <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/pose-comparison">Compare Technologies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions About Pose Detection
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn more about our pose detection technology and how it can
              benefit you
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="border border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 [&[data-state=open]>div>.plus]:hidden [&[data-state=open]>div>.minus]:block">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-medium text-left">
                      What is pose detection and how does it work?
                    </h3>
                    <div className="flex-shrink-0 ml-4">
                      <Plus className="h-5 w-5 plus" />
                      <Minus className="h-5 w-5 minus hidden" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <p className="text-muted-foreground">
                    Pose detection is an AI-powered computer vision technology
                    that identifies and tracks human body positions and
                    movements in images or videos. Our pose detector uses
                    machine learning models to recognize key body points (like
                    shoulders, elbows, knees) and their relationships. The pose
                    detection process involves several steps: first, detecting a
                    person in the frame; second, identifying key body landmarks;
                    and finally, tracking these points over time to analyze
                    movement. PoseDetector.com offers multiple pose detection
                    technologies including MediaPipe, TensorFlow.js with
                    MoveNet, and BlazePose for different use cases.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 [&[data-state=open]>div>.plus]:hidden [&[data-state=open]>div>.minus]:block">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-medium text-left">
                      What are the differences between the pose detection
                      technologies on PoseDetector.com?
                    </h3>
                    <div className="flex-shrink-0 ml-4">
                      <Plus className="h-5 w-5 plus" />
                      <Minus className="h-5 w-5 minus hidden" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <p className="text-muted-foreground">
                    PoseDetector.com offers three main pose detection
                    technologies:
                  </p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>MediaPipe + BlazePose:</strong> Google's
                        lightweight solution for real-time pose detection with
                        high accuracy and low latency. Ideal for mobile
                        applications and environments with limited computing
                        resources.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>TFJS + MoveNet:</strong> TensorFlow.js
                        implementation of MoveNet for ultra-fast and accurate
                        pose detection in the browser. Great for web
                        applications requiring real-time feedback.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>TFJS + BlazePose:</strong> Advanced 3D pose
                        detection with TensorFlow.js implementation of BlazePose
                        for detailed movement analysis. Best for applications
                        requiring depth perception and complex movement
                        analysis.
                      </span>
                    </li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">
                    Each pose detection technology has its strengths, and you
                    can compare them directly on our platform to determine which
                    best suits your specific needs.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 [&[data-state=open]>div>.plus]:hidden [&[data-state=open]>div>.minus]:block">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-medium text-left">
                      What are the applications of pose detection technology?
                    </h3>
                    <div className="flex-shrink-0 ml-4">
                      <Plus className="h-5 w-5 plus" />
                      <Minus className="h-5 w-5 minus hidden" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <p className="text-muted-foreground">
                    Pose detection technology has numerous applications across
                    various industries:
                  </p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Healthcare & Rehabilitation:</strong> Physical
                        therapists use pose detection to monitor patient
                        movements, ensure proper form, and track recovery
                        progress. Our pose detector helps healthcare
                        professionals provide remote care and personalized
                        treatment plans.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Fitness & Training:</strong> Personal trainers
                        and fitness apps use pose detection to provide real-time
                        form feedback, count repetitions, and create
                        personalized workout plans. PoseDetector.com's
                        technology helps ensure exercises are performed
                        correctly to maximize results and prevent injuries.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Dance & Performance:</strong> Dancers and
                        choreographers use pose detection to analyze movements,
                        compare techniques, and improve performance. Our pose
                        detection tools help perfect complex movements and
                        provide detailed feedback.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Research & Development:</strong> Researchers use
                        pose detection to study human movement, develop new
                        applications, and advance the field of computer vision.
                        PoseDetector.com provides tools for comparing different
                        technologies and collecting movement data.
                      </span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 [&[data-state=open]>div>.plus]:hidden [&[data-state=open]>div>.minus]:block">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-medium text-left">
                      How accurate is the pose detection on PoseDetector.com?
                    </h3>
                    <div className="flex-shrink-0 ml-4">
                      <Plus className="h-5 w-5 plus" />
                      <Minus className="h-5 w-5 minus hidden" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <p className="text-muted-foreground">
                    The accuracy of pose detection on PoseDetector.com varies
                    depending on several factors:
                  </p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Technology Used:</strong> Different pose
                        detection technologies have varying levels of accuracy.
                        For example, our 3D pose detection using TFJS+BlazePose
                        typically provides more detailed results than 2D models.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Lighting and Environment:</strong> Good lighting
                        and a clear background improve pose detection accuracy.
                        Our models are trained to handle various conditions, but
                        optimal environments yield the best results.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Camera Quality:</strong> Higher resolution
                        cameras provide more detailed input for the pose
                        detector, resulting in more accurate detection.
                      </span>
                    </li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">
                    In optimal conditions, our pose detection technologies can
                    achieve accuracy rates of over 90% for key body landmarks.
                    You can compare the accuracy of different pose detection
                    methods directly on our platform using the pose comparison
                    tools.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="border border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 [&[data-state=open]>div>.plus]:hidden [&[data-state=open]>div>.minus]:block">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-medium text-left">
                      Is pose detection processing done locally or in the cloud?
                    </h3>
                    <div className="flex-shrink-0 ml-4">
                      <Plus className="h-5 w-5 plus" />
                      <Minus className="h-5 w-5 minus hidden" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <p className="text-muted-foreground">
                    At PoseDetector.com, all pose detection processing is done
                    locally in your browser. This approach offers several
                    advantages:
                  </p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Privacy:</strong> Your video data never leaves
                        your device, ensuring complete privacy during pose
                        detection sessions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Real-time Performance:</strong> Local processing
                        eliminates network latency, allowing for real-time pose
                        detection feedback.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Offline Capability:</strong> Once loaded, our
                        pose detection tools can work without an internet
                        connection.
                      </span>
                    </li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">
                    Our pose detector uses TensorFlow.js and WebGL to leverage
                    your device's GPU for efficient pose detection processing.
                    This allows for smooth performance even on mobile devices
                    and laptops.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-6"
                className="border border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 [&[data-state=open]>div>.plus]:hidden [&[data-state=open]>div>.minus]:block">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-medium text-left">
                      Can I integrate PoseDetector.com's technology into my own
                      applications?
                    </h3>
                    <div className="flex-shrink-0 ml-4">
                      <Plus className="h-5 w-5 plus" />
                      <Minus className="h-5 w-5 minus hidden" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2">
                  <p className="text-muted-foreground">
                    Yes, PoseDetector.com's pose detection technology is built
                    on open-source libraries that can be integrated into your
                    own applications. Here's how you can use our pose detection
                    capabilities:
                  </p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Open-Source Libraries:</strong> Our pose
                        detection implementations use TensorFlow.js, MediaPipe,
                        and other open-source libraries that you can incorporate
                        into your projects.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Code Examples:</strong> PoseDetector.com
                        provides code examples and implementation guides for
                        different pose detection technologies.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Custom Solutions:</strong> For enterprise needs,
                        we can develop custom pose detection solutions tailored
                        to your specific requirements.
                      </span>
                    </li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">
                    Whether you're building a fitness app, a physical therapy
                    platform, or a dance training tool, our pose detection
                    technology can be adapted to meet your needs. Contact us to
                    discuss integration options and custom development.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}
