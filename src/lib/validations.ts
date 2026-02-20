import { z } from "zod";

export const pairingSchema = z.object({
  pairing_code: z
    .string()
    .min(4, "Parkopplingskoden är för kort")
    .max(10, "Parkopplingskoden är för lång")
    .regex(/^[A-Z0-9]+$/i, "Ogiltig parkopplingskod"),
  device_name: z.string().max(50, "Enhetsnamnet är för långt").optional(),
});

export const usageSchema = z.object({
  date: z.string().date().optional(),
  total_sek: z.number().min(0, "Kostnad kan inte vara negativ").optional(),
  interactions: z
    .number()
    .int()
    .min(0, "Antal interaktioner kan inte vara negativt")
    .optional(),
});
