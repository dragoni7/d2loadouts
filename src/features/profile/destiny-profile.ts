import {
  BUCKET_HASH,
  COLLECTIBLE_OWNED,
  EMPTY_ASPECT,
  EMPTY_FRAGMENT,
  EMPTY_MANIFEST_PLUG,
  PRIMARY_STATS,
  SOCKET_HASH,
  STAT_HASH,
  SUBCLASS_PLUG_SETS,
} from '../../lib/bungie_api/constants';
import { getProfileDataRequest } from '../../lib/bungie_api/requests';
import { db } from '../../store/db';
import {
  Character,
  CharacterClass,
  DamageType,
  DestinyArmor,
  Emblem,
  Plug,
  ProfileData,
  Subclass,
} from '../../types/d2l-types';
import { getCharacterClass, modReverseDict } from './util';

export async function getProfileData(): Promise<ProfileData> {
  const profile: ProfileData = {
    characters: [],
  };

  const response = await getProfileDataRequest();

  if (response.data.Response) {
    const itemComponents = response.data.Response.itemComponents;
    const profileInventory = response.data.Response.profileInventory.data.items;
    const characterInventories = response.data.Response.characterInventories.data;
    const characterEquipment = response.data.Response.characterEquipment.data;
    const characterData = response.data.Response.characters.data;
    const profilePlugSets = response.data.Response.profilePlugSets.data.plugs;
    const profileCollectibles = response.data.Response.profileCollectibles.data.collectibles;

    for (const key in characterData) {
      const characterClass = getCharacterClass(characterData[key].classHash);
      const plugSets = response.data.Response.characterPlugSets.data[key].plugs;

      const character: Character = {
        id: characterData[key].characterId,
        class: characterClass,
        armor: {
          helmet: [],
          arms: [],
          legs: [],
          chest: [],
          classItem: [],
        },
        subclasses: {},
        equippedLoadout: {
          helmet: {
            intellect: 0,
            discipline: 0,
            resilience: 0,
            mobility: 0,
            strength: 0,
            recovery: 0,
            instanceHash: '',
            itemHash: '',
            artifice: undefined,
            masterwork: false,
            exotic: undefined,
            class: undefined,
            type: '',
            socket: undefined,
            location: 0,
            icon: '',
            name: '',
          },
          gauntlets: {
            intellect: 0,
            discipline: 0,
            resilience: 0,
            mobility: 0,
            strength: 0,
            recovery: 0,
            instanceHash: '',
            itemHash: '',
            artifice: undefined,
            masterwork: false,
            exotic: undefined,
            class: undefined,
            type: '',
            socket: undefined,
            location: 0,
            icon: '',
            name: '',
          },
          chestArmor: {
            intellect: 0,
            discipline: 0,
            resilience: 0,
            mobility: 0,
            strength: 0,
            recovery: 0,
            instanceHash: '',
            itemHash: '',
            artifice: undefined,
            masterwork: false,
            exotic: undefined,
            class: undefined,
            type: '',
            socket: undefined,
            location: 0,
            icon: '',
            name: '',
          },
          legArmor: {
            intellect: 0,
            discipline: 0,
            resilience: 0,
            mobility: 0,
            strength: 0,
            recovery: 0,
            instanceHash: '',
            itemHash: '',
            artifice: undefined,
            masterwork: false,
            exotic: undefined,
            class: undefined,
            type: '',
            socket: undefined,
            location: 0,
            icon: '',
            name: '',
          },
          classArmor: {
            intellect: 0,
            discipline: 0,
            resilience: 0,
            mobility: 0,
            strength: 0,
            recovery: 0,
            instanceHash: '',
            itemHash: '',
            artifice: undefined,
            masterwork: false,
            exotic: undefined,
            class: undefined,
            type: '',
            socket: undefined,
            location: 0,
            icon: '',
            name: '',
          },
          helmetMods: {
            0: {
              itemHash: 1980618587,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            1: {
              itemHash: 1078080765,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            2: {
              itemHash: 1078080765,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            3: {
              itemHash: 1078080765,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            11: {
              itemHash: 4173924323,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
          },
          gauntletMods: {
            0: {
              itemHash: 1980618587,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            1: {
              itemHash: 3820147479,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            2: {
              itemHash: 3820147479,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            3: {
              itemHash: 3820147479,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            11: {
              itemHash: 4173924323,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
          },
          chestArmorMods: {
            0: {
              itemHash: 1980618587,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            1: {
              itemHash: 1803434835,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            2: {
              itemHash: 1803434835,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            3: {
              itemHash: 1803434835,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            11: {
              itemHash: 4173924323,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
          },
          legArmorMods: {
            0: {
              itemHash: 1980618587,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            1: {
              itemHash: 2269836811,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            2: {
              itemHash: 2269836811,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            3: {
              itemHash: 2269836811,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            11: {
              itemHash: 4173924323,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
          },
          classArmorMods: {
            0: {
              itemHash: 1980618587,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            1: {
              itemHash: 3200810407,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            2: {
              itemHash: 3200810407,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            3: {
              itemHash: 3200810407,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
            11: {
              itemHash: 4173924323,
              perkName: '',
              perkDescription: '',
              perkIcon: '',
              category: 0,
              isOwned: false,
              name: '',
              icon: '',
            },
          },
          characterId: characterData[key].characterId,
          subclassConfig: {
            subclass: {
              instanceId: '',
              screenshot: '',
              damageType: 0,
              isOwned: false,
              class: '',
              itemHash: 0,
              name: '',
              icon: '',
            },
            damageType: 1,
            super: { 0: EMPTY_MANIFEST_PLUG },
            aspects: { 5: EMPTY_ASPECT, 6: EMPTY_ASPECT },
            fragments: {
              7: EMPTY_FRAGMENT,
              8: EMPTY_FRAGMENT,
              9: EMPTY_FRAGMENT,
              10: EMPTY_FRAGMENT,
              11: EMPTY_FRAGMENT,
            },
            classAbility: { 1: null },
            meleeAbility: { 3: null },
            movementAbility: { 2: null },
            grenade: { 4: null },
          },
          requiredStatMods: [],
        },
      };

      // iterate character's equipped items
      for (const item of characterEquipment[key].items) {
        switch (item.bucketHash) {
          case BUCKET_HASH.EMBLEM: {
            const emblemDef = await db.manifestEmblemDef
              .where('itemHash')
              .equals(item.itemHash)
              .first();

            if (emblemDef) {
              const emblem: Emblem = {
                secondaryOverlay: emblemDef.secondaryOverlay,
                secondarySpecial: emblemDef.secondarySpecial,
              };

              character.emblem = emblem;
            }

            continue;
          }

          case BUCKET_HASH.SUBCLASS: {
            const subclassQuery = db.manifestSubclass.where('itemHash').equals(item.itemHash);

            await subclassQuery.modify({ isOwned: true });

            const subclass = await subclassQuery.first();

            if (subclass) {
              const s: Subclass = {
                instanceId: item.itemInstanceId,
                itemHash: subclass.itemHash,
                damageType: subclass.damageType,
                name: subclass.name,
                class: subclass.class,
                icon: subclass.icon,
                screenshot: subclass.icon,
                isOwned: subclass.isOwned,
              };
              character.subclasses[subclass.damageType] = s;

              // set equipped loadout subclass config
              character.equippedLoadout.subclassConfig.subclass = s;
              character.equippedLoadout.subclassConfig.damageType =
                subclass.damageType as DamageType;
              const subclassSockets = itemComponents.sockets.data[item.itemInstanceId]?.sockets;

              /*if (subclassSockets) {
                character.equippedLoadout.subclassConfig.classAbility = {
                  plugItemHash: subclassSockets[0].plugHash,
                  socketArrayType: 0,
                  socketIndex: 1,
                };
                character.equippedLoadout.subclassConfig.movementAbility = {
                  plugItemHash: subclassSockets[1].plugHash,
                  socketArrayType: 0,
                  socketIndex: 2,
                };
                character.equippedLoadout.subclassConfig.super = {
                  plugItemHash: subclassSockets[2].plugHash,
                  socketArrayType: 0,
                  socketIndex: 0,
                };
                character.equippedLoadout.subclassConfig.meleeAbility = {
                  plugItemHash: subclassSockets[3].plugHash,
                  socketArrayType: 0,
                  socketIndex: 3,
                };
                character.equippedLoadout.subclassConfig.grenade = {
                  plugItemHash: subclassSockets[4].plugHash,
                  socketArrayType: 0,
                  socketIndex: 4,
                };

                if (character.equippedLoadout.subclassConfig.damageType === DAMAGE_TYPE.KINETIC) {
                  character.equippedLoadout.subclassConfig.aspects = [
                    {
                      plugItemHash: subclassSockets[7].plugHash,
                      socketArrayType: 0,
                      socketIndex: 7,
                    },
                    {
                      plugItemHash: subclassSockets[8].plugHash,
                      socketArrayType: 0,
                      socketIndex: 8,
                    },
                  ];

                  character.equippedLoadout.subclassConfig.fragments = subclassSockets
                    .slice(9, subclassSockets.length)
                    .map((p: any, index: number): Plug => {
                      return {
                        plugItemHash: p.plugHash,
                        socketArrayType: 0,
                        socketIndex: 9 + index,
                      };
                    });
                } else {
                  character.equippedLoadout.subclassConfig.aspects = [
                    {
                      plugItemHash: subclassSockets[5].plugHash,
                      socketArrayType: 0,
                      socketIndex: 5,
                    },
                    {
                      plugItemHash: subclassSockets[6].plugHash,
                      socketArrayType: 0,
                      socketIndex: 6,
                    },
                  ];

                  character.equippedLoadout.subclassConfig.fragments = subclassSockets
                    .slice(7, subclassSockets.length)
                    .map((p: any, index: number): Plug => {
                      return {
                        plugItemHash: p.plugHash,
                        socketArrayType: 7 + 0,
                        socketIndex: index,
                      };
                    });
                }
              }*/
            }
            continue;
          }

          case BUCKET_HASH.HELMET: {
            const helmet = await buildDestinyArmor(itemComponents, item, character.class, 'helmet');
            character.armor.helmet.push(helmet);
            character.equippedLoadout.helmet = helmet;
            continue;
          }

          case BUCKET_HASH.GAUNTLETS: {
            const arms = await buildDestinyArmor(itemComponents, item, character.class, 'arms');
            character.armor.arms.push(arms);
            character.equippedLoadout.gauntlets = arms;
            continue;
          }

          case BUCKET_HASH.CHEST_ARMOR: {
            const chest = await buildDestinyArmor(itemComponents, item, character.class, 'chest');
            character.armor.chest.push(chest);
            character.equippedLoadout.chestArmor = chest;
            continue;
          }

          case BUCKET_HASH.LEG_ARMOR: {
            const legs = await buildDestinyArmor(itemComponents, item, character.class, 'legs');
            character.armor.legs.push(legs);
            character.equippedLoadout.legArmor = legs;
            continue;
          }

          case BUCKET_HASH.CLASS_ARMOR: {
            const classItem = await buildDestinyArmor(
              itemComponents,
              item,
              character.class,
              'class'
            );
            character.armor.classItem.push(classItem);
            character.equippedLoadout.classArmor = classItem;
            continue;
          }
        }
      }

      // iterate character's inventory
      for (const item of characterInventories[key].items) {
        switch (item.bucketHash) {
          case BUCKET_HASH.SUBCLASS: {
            const subclassQuery = db.manifestSubclass.where('itemHash').equals(item.itemHash);

            await subclassQuery.modify({ isOwned: true });

            const subclass = await subclassQuery.first();

            if (subclass) {
              character.subclasses[subclass.damageType] = {
                instanceId: item.itemInstanceId,
                itemHash: subclass.itemHash,
                damageType: subclass.damageType,
                name: subclass.name,
                class: subclass.class,
                icon: subclass.icon,
                screenshot: subclass.icon,
                isOwned: subclass.isOwned,
              };
            }
            continue;
          }

          case BUCKET_HASH.HELMET: {
            character.armor.helmet.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'helmet')
            );
            continue;
          }

          case BUCKET_HASH.GAUNTLETS: {
            character.armor.arms.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'arms')
            );
            continue;
          }

          case BUCKET_HASH.CHEST_ARMOR: {
            character.armor.chest.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'chest')
            );
            continue;
          }

          case BUCKET_HASH.LEG_ARMOR: {
            character.armor.legs.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'legs')
            );
            continue;
          }

          case BUCKET_HASH.CLASS_ARMOR: {
            character.armor.classItem.push(
              await buildDestinyArmor(itemComponents, item, character.class, 'class')
            );
            continue;
          }
        }
      }

      // check character plugs for stasis grenade state
      if (plugSets[SUBCLASS_PLUG_SETS.GRENADES.STASIS]) {
        for (const plug of plugSets[SUBCLASS_PLUG_SETS.GRENADES.STASIS]) {
          await db.manifestSubclassModDef
            .where('itemHash')
            .equals(plug.plugItemHash)
            .modify({ isOwned: true });
        }
      }

      profile.characters.push(character);
    }

    // iterate profile inventory

    for (const item of profileInventory) {
      const itemInstance = itemComponents.instances.data[item.itemInstanceId];

      if (
        itemInstance &&
        itemInstance.primaryStat &&
        itemInstance.primaryStat.statHash === PRIMARY_STATS.DEFENSE
      ) {
        const stats = itemComponents.stats.data[item.itemInstanceId].stats;
        const sockets = itemComponents.sockets.data[item.itemInstanceId]?.sockets;

        const destinyArmor: DestinyArmor = {
          intellect: stats[STAT_HASH.INTELLECT]?.value || 0,
          discipline: stats[STAT_HASH.DISCIPLINE]?.value || 0,
          resilience: stats[STAT_HASH.RESILIENCE]?.value || 0,
          mobility: stats[STAT_HASH.MOBILITY]?.value || 0,
          strength: stats[STAT_HASH.STRENGTH]?.value || 0,
          recovery: stats[STAT_HASH.RECOVERY]?.value || 0,
          instanceHash: item.itemInstanceId,
          masterwork: itemInstance?.energy && itemInstance.energy.energyCapacity === 10,
          itemHash: item.itemHash,
          location: item.location,
          icon: '',
          name: '',
          type: '',
        };

        stripModStats(sockets, destinyArmor);
        setArtificeState(sockets, destinyArmor);

        const armorDef = await db.manifestArmorDef
          .where('itemHash')
          .equals(Number(destinyArmor.itemHash))
          .first();

        if (armorDef) {
          // determine required class
          destinyArmor.class = armorDef.class as CharacterClass;
          // determine armor slot
          destinyArmor.type = armorDef.slot;
          // determine if exotic
          destinyArmor.exotic = armorDef.isExotic;
          // get name
          destinyArmor.name = armorDef.name;
          // get icon
          destinyArmor.icon = armorDef.icon;
        }

        let target = profile.characters.filter((c) => c.class === destinyArmor.class);

        for (const character of target) {
          switch (destinyArmor.type) {
            case 'helmet': {
              character.armor.helmet.push(destinyArmor);
              continue;
            }
            case 'arms': {
              character.armor.arms.push(destinyArmor);
              continue;
            }
            case 'chest': {
              character.armor.chest.push(destinyArmor);
              continue;
            }
            case 'legs': {
              character.armor.legs.push(destinyArmor);
              continue;
            }
            case 'class': {
              character.armor.classItem.push(destinyArmor);
              continue;
            }
          }
        }
      }
    }

    // iterate profile plugs
    let abilityPlugSets: number[] = [
      SUBCLASS_PLUG_SETS.FRAGMENTS.ARC,
      SUBCLASS_PLUG_SETS.FRAGMENTS.SOLAR,
      SUBCLASS_PLUG_SETS.FRAGMENTS.VOID,
      SUBCLASS_PLUG_SETS.FRAGMENTS.STASIS,
      SUBCLASS_PLUG_SETS.FRAGMENTS.STRAND,
      SUBCLASS_PLUG_SETS.FRAGMENTS.PRISMATIC,

      SUBCLASS_PLUG_SETS.GRENADES.ARC,
      SUBCLASS_PLUG_SETS.GRENADES.SOLAR,
      SUBCLASS_PLUG_SETS.GRENADES.VOID,
      SUBCLASS_PLUG_SETS.GRENADES.STASIS,
      SUBCLASS_PLUG_SETS.GRENADES.STRAND,
      SUBCLASS_PLUG_SETS.GRENADES.PRISMATIC_HUNTER,
      SUBCLASS_PLUG_SETS.GRENADES.PRISMATIC_WARLOCK,

      SUBCLASS_PLUG_SETS.ASPECTS.HUNTER.ARC,
      SUBCLASS_PLUG_SETS.ASPECTS.HUNTER.VOID,
      SUBCLASS_PLUG_SETS.ASPECTS.HUNTER.SOLAR,
      SUBCLASS_PLUG_SETS.ASPECTS.HUNTER.PRISMATIC,

      SUBCLASS_PLUG_SETS.ASPECTS.TITAN.ARC,
      SUBCLASS_PLUG_SETS.ASPECTS.TITAN.VOID,
      SUBCLASS_PLUG_SETS.ASPECTS.TITAN.SOLAR,

      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.ARC,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.VOID,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.SOLAR,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.STASIS,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.STRAND,
      SUBCLASS_PLUG_SETS.ASPECTS.WARLOCK.PRISMATIC,

      SUBCLASS_PLUG_SETS.SUPERS.HUNTER.ARC,
      SUBCLASS_PLUG_SETS.SUPERS.HUNTER.VOID,
      SUBCLASS_PLUG_SETS.SUPERS.HUNTER.SOLAR,
      SUBCLASS_PLUG_SETS.SUPERS.HUNTER.PRISMATIC,

      SUBCLASS_PLUG_SETS.SUPERS.TITAN.ARC,
      SUBCLASS_PLUG_SETS.SUPERS.TITAN.VOID,
      SUBCLASS_PLUG_SETS.SUPERS.TITAN.SOLAR,

      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.ARC,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.VOID,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.SOLAR,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.STASIS,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.STRAND,
      SUBCLASS_PLUG_SETS.SUPERS.WARLOCK.PRISMATIC,

      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.HUNTER.ARC,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.HUNTER.VOID,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.HUNTER.SOLAR,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.HUNTER.PRISMATIC,

      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.TITAN.ARC,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.TITAN.VOID,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.TITAN.SOLAR,

      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.ARC,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.VOID,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.SOLAR,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.STASIS,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.STRAND,
      SUBCLASS_PLUG_SETS.MELEE_ABILITIES.WARLOCK.PRISMATIC,
    ];

    for (const key of abilityPlugSets) {
      if (profilePlugSets[key]) {
        for (const plug of profilePlugSets[key]) {
          if (plug.enabled) {
            await db.manifestSubclassModDef
              .where('itemHash')
              .equals(plug.plugItemHash)
              .modify({ isOwned: true });
          }
        }
      }
    }

    // iterate profile collectibles
    for (const collectible in profileCollectibles) {
      const exoticCollectable = await db.manifestExoticArmorCollection
        .where('collectibleHash')
        .equals(Number(collectible))
        .first();

      if (
        exoticCollectable &&
        COLLECTIBLE_OWNED.includes(Number(profileCollectibles[collectible].state))
      ) {
        await db.manifestExoticArmorCollection
          .where('collectibleHash')
          .equals(Number(collectible))
          .modify({ isOwned: true });
      }

      const armorModDef = await db.manifestArmorModDef
        .where('collectibleHash')
        .equals(Number(collectible))
        .first();

      if (
        armorModDef &&
        COLLECTIBLE_OWNED.includes(Number(profileCollectibles[collectible].state))
      ) {
        await db.manifestArmorModDef
          .where('collectibleHash')
          .equals(Number(collectible))
          .modify({ isOwned: true });
      }
    }

    // iterate character collectibles
    // use any character's collectibles since it shares
    const characterCollectibles =
      response.data.Response.characterCollectibles.data[profile.characters[0].id].collectibles;

    for (const collectible in characterCollectibles) {
      const exoticCollectable = await db.manifestExoticArmorCollection
        .where('collectibleHash')
        .equals(Number(collectible))
        .first();

      if (
        exoticCollectable &&
        COLLECTIBLE_OWNED.includes(Number(characterCollectibles[collectible].state))
      ) {
        db.manifestExoticArmorCollection
          .where('collectibleHash')
          .equals(Number(collectible))
          .modify({ isOwned: true });
      }
    }
  } else {
    console.log('Could not get response');
  }

  return profile;
}

async function buildDestinyArmor(
  itemComponents: any,
  item: any,
  characterClass: CharacterClass,
  armorSlot: string
): Promise<DestinyArmor> {
  const itemInstance = itemComponents.instances.data[item.itemInstanceId];
  const stats = itemComponents.stats.data[item.itemInstanceId].stats;
  const sockets = itemComponents.sockets.data[item.itemInstanceId]?.sockets;

  const destinyArmor: DestinyArmor = {
    intellect: stats[STAT_HASH.INTELLECT]?.value || 0,
    discipline: stats[STAT_HASH.DISCIPLINE]?.value || 0,
    resilience: stats[STAT_HASH.RESILIENCE]?.value || 0,
    mobility: stats[STAT_HASH.MOBILITY]?.value || 0,
    strength: stats[STAT_HASH.STRENGTH]?.value || 0,
    recovery: stats[STAT_HASH.RECOVERY]?.value || 0,
    instanceHash: item.itemInstanceId,
    masterwork: itemInstance?.energy && itemInstance.energy.energyCapacity === 10,
    itemHash: item.itemHash,
    location: item.location,
    type: armorSlot,
    icon: '',
    name: '',
    class: characterClass,
  };

  stripModStats(sockets, destinyArmor);
  setArtificeState(sockets, destinyArmor);

  const armorDef = await db.manifestArmorDef
    .where('itemHash')
    .equals(Number(destinyArmor.itemHash))
    .first();

  if (armorDef) {
    // determine if exotic
    destinyArmor.exotic = armorDef.isExotic;
    // get name
    destinyArmor.name = armorDef.name;
    // get icon
    destinyArmor.icon = armorDef.icon;
  }

  return destinyArmor;
}

function stripModStats(sockets: any, destinyArmor: DestinyArmor) {
  if (sockets) {
    for (const key in modReverseDict) {
      if (sockets.some((mod: any) => mod.plugHash === Number(key))) {
        modReverseDict[key](destinyArmor);
      }
    }
  }
}

function setArtificeState(sockets: any, destinyArmor: DestinyArmor) {
  if (sockets) {
    destinyArmor.artifice = sockets.some(
      (mod: any) =>
        mod.plugHash === SOCKET_HASH.ARTIFICE_ARMOR ||
        mod.plugHash === SOCKET_HASH.UNLOCKED_ARTIFICE_ARMOR
    );
  }
}
