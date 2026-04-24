"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { charities } from "@/lib/mock-data"

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[!@#$%^&*]/.test(p) },
]

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
    handicap: "",
    homeClub: "",
    selectedCharityId: charities[0]?.id ?? "",
    charityPercentage: "10",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      setStep(2)
      return
    }

    if (!isCharitySelectionValid) {
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    router.push("/subscription")
  }

  const charityPercentage = Number(formData.charityPercentage || "0")
  const isCharitySelectionValid =
    !!formData.selectedCharityId && charityPercentage >= 10

  const passwordStrength = passwordRequirements.filter((req) => 
    req.test(formData.password)
  ).length

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/">
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-primary">IMPACT</span>
                <span className="text-foreground">GOLF</span>
              </h1>
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div className={`w-12 h-1 rounded-full transition-colors ${
              step > 1 ? "bg-primary" : "bg-border"
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
            }`}>
              2
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {step === 1 ? "Create your account" : "Golf profile"}
            </h2>
            <p className="text-muted-foreground">
              {step === 1 
                ? "Start your journey to impactful golf" 
                : "Tell us about your game"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">First name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="pl-10 h-12 bg-card border-border focus:border-primary focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-12 bg-card border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 h-12 bg-card border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selectedCharity" className="text-foreground">
                    Select Charity
                  </Label>
                  <Select
                    value={formData.selectedCharityId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, selectedCharityId: value })
                    }
                  >
                    <SelectTrigger className="h-12 bg-card border-border focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Choose a charity" />
                    </SelectTrigger>
                    <SelectContent>
                      {charities.map((charity) => (
                        <SelectItem key={charity.id} value={charity.id}>
                          {charity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    You can change your charity later from your dashboard.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charityPercentage" className="text-foreground">
                    Charity Contribution %
                  </Label>
                  <Input
                    id="charityPercentage"
                    type="number"
                    min="10"
                    max="100"
                    value={formData.charityPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, charityPercentage: e.target.value })
                    }
                    className="h-12 bg-card border-border focus:border-primary focus:ring-primary"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum contribution is 10% of your subscription fee. You can voluntarily increase this amount.
                  </p>
                  {charityPercentage > 0 && charityPercentage < 10 && (
                    <p className="text-xs text-destructive">
                      Contribution must be at least 10%.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 h-12 bg-card border-border focus:border-primary focus:ring-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3 pt-2"
                    >
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              passwordStrength >= level
                                ? passwordStrength <= 2
                                  ? "bg-red-500"
                                  : passwordStrength === 3
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                                : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {passwordRequirements.map((req, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 text-xs transition-colors ${
                              req.test(formData.password)
                                ? "text-green-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            <Check className={`w-3 h-3 ${
                              req.test(formData.password) ? "opacity-100" : "opacity-30"
                            }`} />
                            {req.label}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, agreeToTerms: checked as boolean })
                    }
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
                    required
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="handicap" className="text-foreground">
                    Current Handicap Index
                  </Label>
                  <Input
                    id="handicap"
                    type="number"
                    step="0.1"
                    min="0"
                    max="54"
                    placeholder="e.g., 12.4"
                    value={formData.handicap}
                    onChange={(e) => setFormData({ ...formData, handicap: e.target.value })}
                    className="h-12 bg-card border-border focus:border-primary focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank if you don&apos;t have an official handicap
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeClub" className="text-foreground">
                    Home Golf Club
                  </Label>
                  <Input
                    id="homeClub"
                    placeholder="e.g., Pebble Beach Golf Links"
                    value={formData.homeClub}
                    onChange={(e) => setFormData({ ...formData, homeClub: e.target.value })}
                    className="h-12 bg-card border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <h4 className="font-semibold text-foreground mb-2">What happens next?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Choose your subscription tier
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Select your charity to support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Start submitting scores to win
                    </li>
                  </ul>
                </div>
              </>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 border-border bg-card hover:bg-card/80 text-foreground"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (step === 1 && !formData.agreeToTerms) ||
                  (step === 2 && !isCharitySelectionValid)
                }
                className={`h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base ${
                  step === 1 ? "w-full" : "flex-1"
                }`}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                ) : (
                  <>
                    {step === 1 ? "Continue" : "Create account"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {step === 1 && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          )}
        </motion.div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-accent/20 via-background to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent" />
        
        {/* Animated elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-foreground"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-block mb-12">
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="text-primary">IMPACT</span>
                <span className="text-foreground">GOLF</span>
              </h1>
            </Link>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Play & Win</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your rolling 5 scores for a chance to win from our weekly prize pool.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Give Back</h3>
                  <p className="text-sm text-muted-foreground">
                    A portion of every subscription goes directly to your chosen charity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Join Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with golfers who share your passion for the game and giving.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-card/50 backdrop-blur border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-card"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">+12,000 golfers</span>
              </div>
              <p className="text-sm text-foreground italic">
                &quot;Impact Golf has transformed how I approach every round. Knowing my game helps 
                others makes every shot more meaningful.&quot;
              </p>
              <p className="text-xs text-muted-foreground mt-2">- Michael R., Pro Member</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
