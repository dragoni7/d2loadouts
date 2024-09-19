# D2loadouts.com

D2loadout is a Destiny 2 application that allows players to seamlessly create, optimize, equip, save, and share their builds. The goal of D2loadout is to remove the hassle of using multiple tools to achieve their build goals or use their favorite streamers' loadouts. The table of contents includes a section for users and a section for developers. The user section covers all the features and what you can do with D2loadout. Join our Discord to request features and stay updated!

# Reporting Bugs

Please search the existing issues and closed issues before reporting a bug. If the bug doesn't exist, report the issue and include steps to replicate it if possible.

## Table of Contents: User Section

- [Character Selection](#character-selection)
- [Find Optimal Armor Combination](#find-optimal-armor-combination)
- [Select Exotic](#select-exotic)
- [Exotic Class Item Search](#exotic-class-item-search)
- [Subclass Modification](#subclass-modification)
- [Select Optimal Build](#select-optimal-build)
- [Equip Armor Mods](#equip-armor-mods)
- [Equip Loadout](#equip-loadout)
- [Save in Game](#save-in-game)
- [Share Loadout](#share-loadout)
- [How to Use Loadout Link](#how-to-use-loadout-link)

## Table of Contents: Developer Section

- [License](#license)

## Character Selection

<details>
  <summary>Click to expand Character Selection</summary>

![Character Selection](./public/assets/Char_Select.gif)

D2loadout allows you to access your character and their respective inventories. Your characters will appear in the header component.

</details>

## Find Optimal Armor Combination

<details>
  <summary>Click to expand Find Optimal Armor Combination</summary>

![Optimal Armor Combination](./public/assets/Optimal_armor.gif)

This feature allows you to select your desired stats. The tool triggers an algorithm that returns the best possible armor combination to fulfill those stats. It also accounts for the bonuses and penalties from selected fragments to provide an accurate armor combination.

</details>

## Select Exotic

<details>
  <summary>Click to expand Select Exotic</summary>

![Exotic Selection](./public/assets/Exotic_select.gif)

The exotic selection feature allows you to search for or find the exotic needed for your build. Use the search bar or scroll to find the desired exotic. If the exotic is not owned, it will be greyed out.

</details>

## Exotic Class Item Search

<details>
  <summary>Click to expand Exotic Class Item Search</summary>

![Exotic Class Item Search](./public/assets/Exotic_class_item.gif)

The exotic selector feature also allows you to search or select a specific roll of an exotic class item in your inventory. When you select the class item, the dropdown will update with all your owned class items. When selected, the class item will be used for combinations and later when you equip your loadout.

</details>

## Subclass Modification

<details>
  <summary>Click to expand Subclass Modification</summary>

![Subclass Modification](./public/assets/Subclass_mod.gif)

We designed the user interface to resemble the in-game interface to make the tool more familiar to players. Like in the game, you can select your desired supers, aspects, fragments, etc. The feature dynamically adjusts to provide the correct number of fragment slots and includes the bonuses and penalties from these fragments in the armor combination.

</details>

## Select Optimal Build

<details>
  <summary>Click to expand Select Optimal Build</summary>

![Select Optimal Build](./public/assets/select_optimal_build.gif)

This list includes the top 30,000 armor combinations based on the best total stat tier. It automatically sorts the combinations based on the lowest number of mods used. The cards include the armor pieces, total stats, mods used, and their counts. To select a desired combination, simply click on the combination you like. This will transfer you to the armor modification page, and the selected mods will automatically transfer to the armor customization page.

</details>

## Equip Armor Mods

<details>
  <summary>Click to expand Equip Armor Mods</summary>

![Equip Armor Mods](./public/assets/armor_customization.gif)

This feature allows you to equip armor mods and modify your abilities into the selected armor combination. At the top, the required mods needed to reach the desired stats are highlighted in red. You can simply click on the mods to auto-equip them, or you can manually modify or omit any stat mods if they interfere with the rest of your build.

</details>

## Equip Loadout

<details>
  <summary>Click to expand Equip Loadout</summary>

![Equip Loadout](./public/assets/equiploadout.gif)

After modifying your armor mods and abilities, click on the "Equip Loadout" button to equip your loadout. If your inventory is full or your armor pieces are in the vault, don’t worry! This feature will automatically pull armor from the vault and move items around to ensure your build is equipped. After you click "Equip Loadout," an animation will indicate which slot is being modified, followed by feedback showing the success or failure of equipping armor pieces, mods, and abilities.

</details>

## Save in Game

<details>
  <summary>Click to expand Save in Game</summary>

![Save Loadout](./public/assets/saveloadout.gif)

After equipping your loadout, you can save it in the game. This feature allows you to select the name, icon, and color for your saved loadout. It will override existing loadouts if you choose, or you can save it in an empty slot.

</details>

## Share Loadout

<details>
  <summary>Click to expand Share Loadout</summary>

![Share Loadout](./public/assets/shareloadout.gif)

This feature makes sharing loadouts seamless and removes the hassle of sharing builds with friends, clanmates, or followers.

1. Rank the stats based on priority. For example, if the build requires 100 resilience but mobility doesn't matter, set resilience as the top priority and mobility as the lowest. This allows us to find the ideal armor pieces from the receiving user's armor pool, so they don’t have to manually find armor for their build.
2. Once you've ranked the stats based on priority, generate the link and share it with others!

</details>

## How to Use Loadout Link

<details>
  <summary>Click to expand How to Use Loadout Link</summary>

![How to Use Loadout Link](./public/assets/use_shareloadout_link.png)

When you receive a loadout link, simply click on it. This will automatically take you to D2loadouts, where it will find an armor set that matches the shared link. If you have better armor, it will find a better build. If you have worse armor, it will find armor as close as possible to the shared link, prioritizing the most important stats. After the page loads, it will take you to the armor modification screen where you can make final tweaks or just equip the shared loadout!

</details>
