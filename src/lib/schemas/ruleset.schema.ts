import { z } from 'zod';
import {
  ProjectPhaseSchema,
  TechStackSchema,
  TaskCategorySchema,
} from './guardrail.schema';

export const CreateRulesetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Preset name must be at least 2 characters.')
    .max(80, 'Preset name must not exceed 80 characters.'),
  phase: ProjectPhaseSchema.default('mvp'),
  stack: TechStackSchema.default('nextjs'),
  taskCategory: TaskCategorySchema.default('api_route'),
  taskDescription: z
    .string()
    .trim()
    .min(12, 'Task description must be at least 12 characters.')
    .max(1500, 'Task description must not exceed 1500 characters.'),
  targetPath: z.string().trim().max(200).optional(),
  customNotes: z.string().trim().max(1000).optional(),
});
export type CreateRulesetInput = z.infer<typeof CreateRulesetSchema>;

export const UpdateRulesetSchema = CreateRulesetSchema.partial();
export type UpdateRulesetInput = z.infer<typeof UpdateRulesetSchema>;

export interface RulesetItem {
  id: string;
  userId: string;
  name: string;
  phase: z.infer<typeof ProjectPhaseSchema>;
  stack: z.infer<typeof TechStackSchema>;
  taskCategory: z.infer<typeof TaskCategorySchema>;
  taskDescription: string;
  targetPath?: string | null;
  customNotes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
