---
title: 配方表
description: 如何创建和管理配方。
slug: paper/dev/recipes
---

配方是一种定义制作特定物品的方式。
它们可以由插件或数据包定义，但在这里我们只讨论插件方面的内容。

## [`ShapedRecipe`](jd:paper:org.bukkit.inventory.ShapedRecipe)

A shaped recipe is a recipe that requires a specific pattern of items in the crafting grid to craft an item.
These are created using a pattern string and a map of characters to items. The pattern strings are 3,
3-character strings that represent the rows of the crafting grid. They can be created as follows:

```java title="TestPlugin.java"
public class TestPlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        NamespacedKey key = new NamespacedKey(this, "WarriorSword");
        ItemStack item = ItemStack.of(Material.DIAMOND_SWORD);

        ShapedRecipe recipe = new ShapedRecipe(key, item);
        recipe.shape(" A ", "AAA", " B ");
        recipe.setIngredient('A', Material.DIAMOND);
        recipe.setIngredient('B', Material.STICK);

        getServer().addRecipe(recipe);
    }
}
```

This recipe would require a diamond sword to be crafted with a diamond in the top row, a stick in
the middle row, and a diamond in the bottom row. The diamond sword would be in the middle column of
the bottom row. The result would look like this in the crafting grid:

```
 A
AAA
 B
```

:::note

You do not need to register the recipe within your plugin's `onEnable` method, You can register it
at any time. However, if you do not register it after the plugin has been enabled and there are
players online, you will need to either resend all the recipes to the players or use the boolean
parameter in the [`addRecipe`](jd:paper:org.bukkit.Server#addRecipe(org.bukkit.inventory.Recipe,boolean))
method to update all players with the new recipe.

:::

:::caution

You cannot use Air as a material in a shaped recipe, this will cause an error.

:::


## [`ShapelessRecipe`](jd:paper:org.bukkit.inventory.ShapelessRecipe)

A shapeless recipe is a recipe that requires a specific number of items in the crafting grid to craft an item.
These are created using a list of items. They can be created as follows:

```java title="TestPlugin.java"
public class TestPlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        NamespacedKey key = new NamespacedKey(this, "WarriorSword");
        ItemStack item = ItemStack.of(Material.DIAMOND_SWORD);

        ShapelessRecipe recipe = new ShapelessRecipe(key, item);
        recipe.addIngredient(3, Material.DIAMOND);
        recipe.addIngredient(2, Material.STICK);

        getServer().addRecipe(recipe);
    }
}
```

This recipe declares that you simply need 3 diamonds and 2 sticks to craft the item, without any specific
orientation of the cross pattern in the crafting grid. This could be crafted in any of the following ways:
```
  DSS   |   SDS   |   S D
  D     |   D     |   D
  D     |   D     |   D S
```
And, any other composition of the 5 items.
