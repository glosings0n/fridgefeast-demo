"use server";

import { generateRecipe } from "@/ai/flows/generate-recipe";
import type { GenerateRecipeOutput } from "@/ai/flows/generate-recipe";

export async function createRecipeAction(
  ingredients: string
): Promise<{ data: GenerateRecipeOutput | null; error: string | null }> {
  if (!ingredients) {
    return { data: null, error: "Please enter some ingredients." };
  }

  try {
    const recipe = await generateRecipe({ ingredients });
    return { data: recipe, error: null };
  } catch (e) {
    console.error(e);
    // Provide a more user-friendly error message
    return { data: null, error: "Failed to generate recipe. The ingredients might not be suitable for a recipe. Please try again with different ingredients." };
  }
}
