import Image from "next/image";
import { Save, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: (recipe: Recipe) => void;
  onDelete?: (recipeId: string) => void;
}

export function RecipeCard({ recipe, onSave, onDelete }: RecipeCardProps) {
  const formatList = (text: string) => {
    return text.split(',').map(item => item.trim()).filter(Boolean);
  }

  const recipeIngredients = formatList(recipe.ingredients);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{recipe.recipeName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="relative aspect-video w-full">
            <Image
                src={`https://placehold.co/600x400.png`}
                alt={recipe.recipeName}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                data-ai-hint="food recipe"
            />
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {recipeIngredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary">{ingredient}</Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-2">Instructions</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {recipe.instructions}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {onSave && (
          <Button onClick={() => onSave(recipe)} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Recipe
          </Button>
        )}
        {onDelete && (
          <Button onClick={() => onDelete(recipe.id)} variant="destructive" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Recipe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
