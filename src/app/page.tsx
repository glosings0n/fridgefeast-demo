"use client";

import { useState, useTransition } from "react";
import { ChefHat, CookingPot, Save, Trash2, BookMarked, Loader2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Recipe } from "@/lib/types";
import { createRecipeAction } from "@/app/actions";
import { RecipeCard } from "@/components/recipe-card";

export default function FridgeFeastPage() {
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useLocalStorage<Recipe[]>("savedRecipes", []);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFormSubmit = (formData: FormData) => {
    const ingredients = formData.get("ingredients") as string;
    if (!ingredients) return;

    startTransition(async () => {
      setGeneratedRecipe(null);
      const result = await createRecipeAction(ingredients);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.data) {
        setGeneratedRecipe({ ...result.data, id: Date.now().toString() });
      }
    });
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    if (savedRecipes.some((r) => r.id === recipe.id)) {
       toast({
        variant: "destructive",
        title: "Already Saved",
        description: "This recipe is already in your saved list.",
      });
      return;
    }
    setSavedRecipes([...savedRecipes, recipe]);
    toast({
      title: "Recipe Saved!",
      description: `${recipe.recipeName} has been added to your collection.`,
    });
  };

  const handleDeleteRecipe = (recipeId: string) => {
    setSavedRecipes(savedRecipes.filter((r) => r.id !== recipeId));
     toast({
      title: "Recipe Removed",
      description: "The recipe has been removed from your collection.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">FridgeFeast</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator"><CookingPot className="w-4 h-4 mr-2" />Recipe Generator</TabsTrigger>
            <TabsTrigger value="saved"><BookMarked className="w-4 h-4 mr-2" />Saved Recipes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <Card>
              <CardHeader>
                <CardTitle>What's in your fridge?</CardTitle>
                <CardDescription>Enter the ingredients you have, separated by commas, and we'll whip up a recipe for you.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Ingredients</Label>
                    <Input id="ingredients" name="ingredients" placeholder="e.g., chicken breast, broccoli, garlic, olive oil" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : "Generate Recipe" }
                  </Button>
                </form>

                <div className="mt-8">
                  {isPending && (
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-48 w-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  {generatedRecipe && !isPending && (
                    <RecipeCard 
                      recipe={generatedRecipe} 
                      onSave={() => handleSaveRecipe(generatedRecipe)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="saved">
             <Card>
              <CardHeader>
                <CardTitle>Your Recipe Collection</CardTitle>
                <CardDescription>Here are the delicious recipes you've saved for later.</CardDescription>
              </CardHeader>
              <CardContent>
                {savedRecipes.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {savedRecipes.map((recipe) => (
                      <RecipeCard 
                        key={recipe.id}
                        recipe={recipe} 
                        onDelete={() => handleDeleteRecipe(recipe.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You haven't saved any recipes yet.</p>
                    <p className="text-sm text-muted-foreground">Go to the generator to create and save one!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Powered by AI. Bon Appétit!</p>
      </footer>
    </div>
  );
}
