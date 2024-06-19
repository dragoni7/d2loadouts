import itertools
import json

# Load the dataset from the file
file_path = "armor_dataset.json"
with open(file_path, "r") as file:
    dataset = json.load(file)

# Assume there is only a single class item
class_item = dataset["ClassItem"]


# Function to compute the maximum possible value for each stat
def compute_max_possible_stats(dataset, class_item):
    max_stats = {
        "Intellect": 0,
        "Resilience": 0,
        "Discipline": 0,
        "Recovery": 0,
        "Mobility": 0,
        "Strength": 0
    }

    for category in ["Helmets", "Arms", "Chests", "Legs"]:
        for stat in max_stats:
            max_stats[stat] += max(item["Stats"][stat] for item in dataset[category])

    # Add the stats from the single class item
    for stat in max_stats:
        max_stats[stat] += class_item["Stats"][stat]

    return max_stats


# Function to calculate the total stat sum and total stat values
def calculate_stats(helmet, arm, chest, leg, class_item):
    total_stats = {
        "Intellect": 0,
        "Resilience": 0,
        "Discipline": 0,
        "Recovery": 0,
        "Mobility": 0,
        "Strength": 0
    }

    for item in [helmet, arm, chest, leg, class_item]:
        for stat in total_stats:
            total_stats[stat] += item["Stats"][stat]

    total_stat_sum = sum(total_stats.values())
    stats_tuple = tuple(total_stats.values())
    return helmet["ItemInstance"], arm["ItemInstance"], chest["ItemInstance"], leg["ItemInstance"], class_item[
        "ItemInstance"], total_stat_sum, total_stats, stats_tuple


# Function to check for quad hundred state
def is_quad_hundred(dataset, class_item):
    permutations = []
    for helmet, arm, chest, leg in itertools.product(dataset["Helmets"], dataset["Arms"], dataset["Chests"],
                                                     dataset["Legs"]):
        _, _, _, _, _, _, total_stats, _ = calculate_stats(helmet, arm, chest, leg, class_item)
        if sum(1 for stat in total_stats.values() if stat >= 100) >= 4:
            stats_100 = [stat for stat in total_stats if total_stats[stat] >= 100]
            permutations.append((
                                helmet["ItemInstance"], arm["ItemInstance"], chest["ItemInstance"], leg["ItemInstance"],
                                class_item["ItemInstance"], total_stats, stats_100))
    return permutations if permutations else False


# Function to check for triple hundred state
def is_triple_hundred(dataset, class_item):
    permutations = []
    for helmet, arm, chest, leg in itertools.product(dataset["Helmets"], dataset["Arms"], dataset["Chests"],
                                                     dataset["Legs"]):
        _, _, _, _, _, _, total_stats, _ = calculate_stats(helmet, arm, chest, leg, class_item)
        if sum(1 for stat in total_stats.values() if stat >= 100) >= 3:
            stats_100 = [stat for stat in total_stats if total_stats[stat] >= 100]
            permutations.append((
                                helmet["ItemInstance"], arm["ItemInstance"], chest["ItemInstance"], leg["ItemInstance"],
                                class_item["ItemInstance"], total_stats, stats_100))
    return permutations if permutations else False


# Compute the maximum possible stats
max_possible_stats = compute_max_possible_stats(dataset, class_item)

# Check if specific total maximums for multiple stats are possible
desired_max_stats = {
    "Intellect": 340,
    "Resilience": 100,
    "Discipline": 90,
    "Recovery": 80,
    "Mobility": 70,
    "Strength": 60
}

possible_stats = {stat: max_possible_stats[stat] >= desired_max for stat, desired_max in desired_max_stats.items()}

print("Maximum possible stats:", max_possible_stats)
print("Desired maximum stats:", desired_max_stats)
print("Are the desired maximums possible?", possible_stats)

# Check for quad hundred and triple hundred states
quad_hundred_permutations = is_quad_hundred(dataset, class_item)
triple_hundred_permutations = is_triple_hundred(dataset, class_item)

# Print and save the permutations if they exist
if quad_hundred_permutations:
    print("Quad hundred permutations:")
    for permutation in quad_hundred_permutations:
        print("Items:", permutation[:5])
        print("Stats:", permutation[5])
        print("Stats at 100:", permutation[6])

    output_file_path_quad = "armor_quad_hundred_permutations.json"
    with open(output_file_path_quad, "w") as file:
        json.dump(quad_hundred_permutations, file)

if triple_hundred_permutations:
    print("Triple hundred permutations:")
    for permutation in triple_hundred_permutations:
        print("Items:", permutation[:5])
        print("Stats:", permutation[5])
        print("Stats at 100:", permutation[6])

    output_file_path_triple = "armor_triple_hundred_permutations.json"
    with open(output_file_path_triple, "w") as file:
        json.dump(triple_hundred_permutations, file)

print(f"4x permutations: {len(quad_hundred_permutations) if quad_hundred_permutations else 0}")
print(f"3x permutations: {len(triple_hundred_permutations) if triple_hundred_permutations else 0}")