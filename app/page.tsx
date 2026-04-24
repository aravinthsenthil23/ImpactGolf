"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Heart,
  Users,
  ArrowRight,
  Check,
  Star,
  TrendingUp,
  Shield,
  Zap,
  ChevronDown,
} from "lucide-react";
import { charities as directoryCharities } from "@/lib/mock-data";

const stats = [
  { label: "Active Members", value: "12,500+", icon: Users },
  { label: "Charity Donations", value: "$2.4M", icon: Heart },
  { label: "Prizes Awarded", value: "$1.8M", icon: Trophy },
  { label: "Lives Reached", value: "85,000+", icon: Zap },
];

const features = [
  {
    icon: Heart,
    title: "Rolling 5 Scores",
    description:
      "Submit your best 5 Stableford scores. Your numbers are generated from your actual golf performance.",
  },
  {
    icon: Trophy,
    title: "Weekly Prize Draws",
    description:
      "Match your numbers with the weekly draw for a chance to win from a growing prize pool split 40/35/25.",
  },
  {
    icon: Heart,
    title: "Charity Impact",
    description:
      "Choose how much of your subscription goes to charity. Select from verified golf and community causes.",
  },
  {
    icon: Shield,
    title: "Verified Winners",
    description:
      "Transparent winner verification with proof uploads. Every payout is tracked and validated.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: 9.99,
    features: [
      "1 draw entry per week",
      "Basic score tracking",
      "Choose 1 charity",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 19.99,
    popular: true,
    features: [
      "3 draw entries per week",
      "Advanced analytics",
      "Choose 3 charities",
      "Priority support",
      "Exclusive member events",
    ],
  },
  {
    name: "Elite",
    price: 39.99,
    features: [
      "Unlimited draw entries",
      "Premium analytics suite",
      "All charities unlocked",
      "24/7 VIP support",
      "VIP tournament access",
      "Personal account manager",
    ],
  },
];

const faqs = [
  {
    question: "How does the draw work?",
    answer:
      "Your 5 most recent Stableford scores become your draw numbers. Each week, we draw 5 numbers and match them against all participants. Match 3, 4, or all 5 to win from the prize pool split 40/35/25.",
  },
  {
    question: "How do I submit my scores?",
    answer:
      "Simply enter your Stableford points after each round. Scores range from 1-45 points. Your oldest score is automatically replaced when you add a new one (FIFO system).",
  },
  {
    question: "How does charity giving work?",
    answer:
      "You choose what percentage of your subscription goes to charity (10-50%). Select from our verified partner charities and track your impact in real-time.",
  },
  {
    question: "How are winners verified?",
    answer:
      "Winners must upload proof of their scores (scorecards, app screenshots) within 7 days. Our admin team verifies each claim before releasing payouts.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const spotlightCharities = directoryCharities.filter((charity) => charity.isSpotlight);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Impact Golf
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#charities"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Charities
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-foreground">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Subscribe Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Give-first memberships with reward upside
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
                Put Real-World{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Impact First
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                Join a modern membership where your subscription supports verified causes,
                your participation unlocks reward draws, and every month you can track exactly
                where your contribution went.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
                  >
                    Subscribe & Start Impact
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg border-border text-foreground hover:bg-muted/70 transition-colors"
                  >
                    See How It Works
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What You Do, How You Win, Why It Matters
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple three-step process that transforms your golf game into
              charitable impact and prize opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Submit Your Scores",
                description:
                  "Enter your Stableford scores after each round. Your 5 most recent scores become your draw numbers.",
                icon: TrendingUp,
              },
              {
                step: 2,
                title: "Choose Your Impact",
                description:
                  "Select how much of your subscription supports charity and pick from verified causes you care about.",
                icon: Heart,
              },
              {
                step: 3,
                title: "Win & Give Back",
                description:
                  "Match your numbers in weekly draws to win prizes while your subscription supports golf charities.",
                icon: Trophy,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-background border border-border rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Play & Win
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete platform designed for golfers who want to compete, win,
              and make a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Charities Section */}
      <section id="charities" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Charity Impact Network
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your subscription directly supports verified golf and community
              charities making real impact.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Spotlight Charity
            </h3>
            {spotlightCharities.slice(0, 1).map((charity) => (
              <div
                key={charity.id}
                className="bg-background border border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-primary font-semibold mb-1">Featured</p>
                    <h4 className="text-2xl font-bold text-foreground">{charity.name}</h4>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                      {charity.description}
                    </p>
                  </div>
                  <Link href={`/charities/${charity.id}`}>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {directoryCharities.slice(0, 4).map((charity, index) => (
              <motion.div
                key={charity.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{charity.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {charity.category}
                </p>
                <div className="text-lg font-bold text-accent">
                  ${new Intl.NumberFormat('en-US').format(charity.totalRaised)} raised
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/charities">
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-muted/70"
              >
                Explore All Charities
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with any tier and upgrade anytime. All plans include charity
              giving and draw entries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-card border rounded-2xl p-8 ${
                  tier.popular
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}

                <h3 className="text-xl font-bold text-foreground mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <Button
                    className={`w-full h-12 ${
                      tier.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-card border border-border hover:bg-muted text-foreground"
                    }`}
                  >
                    Subscribe
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about Impact Golf.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-background border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-3xl p-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of golfers who are winning prizes and supporting
              great causes every week.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-10 text-lg"
              >
                Subscribe Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Impact Golf</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2026 Impact Golf. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
