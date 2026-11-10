'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl py-14 space-y-8 animate-fade-in text-white">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Contact PlayGrid</h1>
        <p className="text-white/60 text-sm">
          Inquiries for publisher partnerships, game distribution licenses, or player support.
        </p>
      </div>

      <Card className="border-white/10 bg-surface-900/90 shadow-2xl">
        <CardContent className="p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Delivered</h3>
              <p className="text-xs text-white/60 max-w-sm mx-auto">
                Thank you for reaching out. Our developer relations and support team will respond within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70">Your Name</Label>
                  <Input required placeholder="Jane Doe" className="mt-1" />
                </div>
                <div>
                  <Label className="text-white/70">Email Address</Label>
                  <Input type="email" required placeholder="jane@example.com" className="mt-1" />
                </div>
              </div>

              <div>
                <Label className="text-white/70">Subject / Category</Label>
                <Input required placeholder="e.g. Publisher White-Label Partnership or Game Submission" className="mt-1" />
              </div>

              <div>
                <Label className="text-white/70">Message</Label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us about your organization, portal goals, or technical inquiry..."
                  className="w-full mt-1 rounded-lg border border-white/15 bg-surface-950 px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <Button type="submit" className="w-full gap-2 shadow-lg shadow-brand-500/25">
                <Send className="h-4 w-4" /> Send Message
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

