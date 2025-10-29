import type { ChatInputCommandInteraction } from "discord.js";

/**
 * /random — returns a random integer between min and max (inclusive).
 * Validates min <= max and replies ephemerally on invalid input.
 */
export const randomCommand = {
    name: "random",
    description: "Replies with a random number between min and max (inclusive)",
    options: [
        {
            type: 4, // INTEGER TYPE
            name: "min",
            description: "The minimum number to generate a random number between",
            required: true
        },
        {
            type: 4, // INTEGER TYPE
            name: "max",
            description: "The maximum number to generate a random number between",
            required: true
        }
    ]
};

/** Handles /random interactions. */
export async function handleRandom(interaction: ChatInputCommandInteraction) {
    const min = interaction.options.getInteger("min", true);
    const max = interaction.options.getInteger("max", true);

    if (min > max) {
        await interaction.reply({ content: "min must be <= max.", ephemeral: true });
        return;
    }

    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    await interaction.reply({ content: `Your random number between ${min} and ${max}: ${result}!!!`, ephemeral: true });
}