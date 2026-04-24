'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, Sparkles, CheckCircle, TrendingUp, Filter } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { charities, charityCategories } from '@/lib/mock-data'
import type { Charity } from '@/lib/types'

function CharityCard({ 
  charity, 
  isSelected, 
  onSelect 
}: { 
  charity: Charity
  isSelected: boolean
  onSelect: (charity: Charity) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card 
        className={cn(
          'relative h-full cursor-pointer transition-all duration-300 overflow-hidden group border-2',
          isSelected 
            ? 'border-accent glow-teal bg-card' 
            : 'border-border/50 bg-card/50 hover:border-accent/50'
        )}
        onClick={() => onSelect(charity)}
      >
        {/* Spotlight Badge */}
        {charity.isSpotlight && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-primary/90 text-primary-foreground gap-1">
              <Sparkles className="h-3 w-3" />
              Spotlight
            </Badge>
          </div>
        )}
        
        {/* Selected Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 z-10"
          >
            <div className="bg-accent text-accent-foreground rounded-full p-1">
              <CheckCircle className="h-4 w-4" />
            </div>
          </motion.div>
        )}

        {/* Charity Image */}
        <div className="h-32 relative overflow-hidden">
          <Image 
            src={charity.imageUrl} 
            alt={charity.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">{charity.name}</CardTitle>
          </div>
          <Badge variant="outline" className="w-fit text-xs border-border/50 text-muted-foreground">
            {charity.category}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CardDescription className="text-sm line-clamp-2">
            {charity.description}
          </CardDescription>

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-accent">
                {charity.impactPercentage}% Impact
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              ${charity.totalRaised.toLocaleString()} raised
            </span>
          </div>
          <Link
            href={`/charities/${charity.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-block"
          >
            <Button variant="outline" size="sm" className="w-full mt-3">
              View Profile
            </Button>
          </Link>
        </CardContent>

        {/* Hover Effect */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 transition-opacity pointer-events-none',
          'group-hover:opacity-100'
        )} />
      </Card>
    </motion.div>
  )
}

export default function CharitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(charities[0])
  const [donationAmount, setDonationAmount] = useState('25')

  const filteredCharities = useMemo(() => {
    return charities.filter(charity => {
      const matchesSearch = charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           charity.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || charity.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const spotlightCharities = filteredCharities.filter(c => c.isSpotlight)
  const regularCharities = filteredCharities.filter(c => !c.isSpotlight)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            <span className="text-gradient">Choose Your Cause</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Select a charity to receive your impact contribution. Your subscription directly supports the causes you care about most.
          </p>
        </motion.div>

        {/* Selected Charity Banner */}
        {selectedCharity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-accent/10 border-accent/30">
              <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Selected Charity</p>
                    <p className="text-lg font-semibold">{selectedCharity.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">{selectedCharity.impactPercentage}%</p>
                    <p className="text-xs text-muted-foreground">of your fee goes here</p>
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Confirm Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mb-8"
        >
          <Card className="bg-card/60 border-border/50">
            <CardHeader>
              <CardTitle>Independent Donation</CardTitle>
              <CardDescription>
                Support a charity directly without linking the donation to gameplay.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-3 md:items-center">
              <Input
                type="number"
                min={1}
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="md:w-48"
              />
              <span className="text-sm text-muted-foreground flex-1">
                Donation target: {selectedCharity?.name ?? 'Select a charity'}
              </span>
              <Button
                disabled={!selectedCharity || Number(donationAmount) <= 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Donate Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search charities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-input border-border text-foreground">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {charityCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Spotlight Section */}
        {spotlightCharities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Featured Charities
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {spotlightCharities.map(charity => (
                  <CharityCard
                    key={charity.id}
                    charity={charity}
                    isSelected={selectedCharity?.id === charity.id}
                    onSelect={setSelectedCharity}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* All Charities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" />
            {spotlightCharities.length > 0 ? 'All Charities' : 'Charities'}
          </h2>
          
          {filteredCharities.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No charities found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {regularCharities.map(charity => (
                  <CharityCard
                    key={charity.id}
                    charity={charity}
                    isSelected={selectedCharity?.id === charity.id}
                    onSelect={setSelectedCharity}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
