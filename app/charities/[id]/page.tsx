import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, ArrowLeft, Heart } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { charities } from '@/lib/mock-data'

export default async function CharityProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const charity = charities.find((item) => item.id === id)

  if (!charity) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <Link href="/charities">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to charities
          </Button>
        </Link>

        <Card className="overflow-hidden">
          <div className="h-52 relative">
            <Image 
              src={charity.imageUrl} 
              alt={charity.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>{charity.name}</CardTitle>
              {charity.isSpotlight && (
                <Badge className="bg-primary/90 text-primary-foreground">Spotlight</Badge>
              )}
            </div>
            <CardDescription>{charity.category}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {charity.longDescription ?? charity.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(charity.galleryImages ?? [charity.imageUrl]).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-video rounded-xl overflow-hidden border border-border/50 group"
                >
                  <Image 
                    src={image} 
                    alt={`${charity.name} gallery ${index}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Golf days and charity activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(charity.upcomingEvents ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No events announced yet.</p>
            ) : (
              charity.upcomingEvents?.map((event) => (
                <div key={event.id} className="rounded-lg border border-border/50 p-4">
                  <p className="font-semibold">{event.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
