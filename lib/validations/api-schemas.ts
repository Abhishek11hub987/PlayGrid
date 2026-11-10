import { z } from 'zod'

export const gameScoreSchema = z.object({
  gameId: z.string().uuid().or(z.string().min(1)),
  score: z.number().int().min(0).max(10_000_000),
  durationSeconds: z.number().min(1).max(86400),
  signature: z.string().optional(),
  portalId: z.string().uuid().optional(),
})

export const gamePlayEventSchema = z.object({
  gameId: z.string().min(1),
  portalId: z.string().optional(),
  referrer: z.string().optional(),
  deviceType: z.enum(['desktop', 'mobile', 'tablet']).optional(),
})

export const adEventSchema = z.object({
  placementId: z.string().min(1),
  eventType: z.enum(['impression', 'click', 'rewarded_complete', 'interstitial_close']),
  portalId: z.string().optional(),
  gameId: z.string().optional(),
  adProvider: z.string().default('demo'),
  sessionId: z.string().min(1),
})

export const createPortalSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  customDomain: z.string().optional().nullable(),
  themeConfig: z.record(z.string(), z.any()).optional(),
  layoutConfig: z.record(z.string(), z.any()).optional(),
})

export const updatePortalSchema = createPortalSchema.partial().extend({
  isPublished: z.boolean().optional(),
})

export const createGameSchema = z.object({
  title: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(2000),
  instructions: z.string().optional(),
  controlsDescription: z.string().optional(),
  categoryId: z.string().min(1),
  gameUrl: z.string().url().or(z.string().startsWith('/games/')),
  thumbnailUrl: z.string().url().optional(),
  isFeatured: z.boolean().default(false),
  orientation: z.enum(['landscape', 'portrait', 'any']).default('landscape'),
  minAge: z.number().int().min(0).max(18).default(0),
})

