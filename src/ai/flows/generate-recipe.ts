'use server';

/**
 * @fileOverview Generates a recipe based on a list of ingredients.
 *
 * - generateRecipe - A function that generates a recipe based on the given ingredients.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The output type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients the user has on hand.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const AdditionalIngredientsSchema = z.object({
  ingredients: z
    .string()
    .describe("A comma-separated list of ingredients that would improve the recipe."),
});

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  instructions: z.string().describe('The instructions for the recipe.'),
  ingredients: z.string().describe('The ingredients for the recipe.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const suggestAdditionalIngredients = ai.defineTool({
  name: 'suggestAdditionalIngredients',
  description: 'Suggests additional ingredients to improve a recipe based on the ingredients already on hand.',
  inputSchema: z.object({
    ingredients: z
      .string()
      .describe('A comma-separated list of ingredients the user has on hand.'),
  }),
  outputSchema: AdditionalIngredientsSchema,
}, async (input) => {
  // TODO: Add actual implementation to suggest ingredients
  return {
    ingredients: `salt, pepper`,
  };
});

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  tools: [suggestAdditionalIngredients],
  prompt: `You are a world-class chef. A user will provide you with a list of ingredients they have on hand, and you will
        generate a recipe using those ingredients.

        Ingredients: {{{ingredients}}}

        Include a list of ingredients and instructions. Use the suggestAdditionalIngredients tool to suggest
        additional ingredients to improve the recipe, if necessary.
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
