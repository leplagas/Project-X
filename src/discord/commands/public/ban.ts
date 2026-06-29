import { createCommand } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType, PermissionFlagsBits } from "discord.js";

createCommand({
    name: "ban",
    description: "Comando para banir usuarios😜",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionFlagsBits.BanMembers,
    options: [
        {
            name: "nome",
            description: "Usuario que você quer banir",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    async run(interaction) {
        try {
            const author = interaction.user;
            const user = interaction.options.getUser("nome", true);
            if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
                await interaction.reply({
                    flags: ["Ephemeral"],
                    content: `${author}, você não tem permissão para executar essa ação💔`
                });
                return;
            } else if (!interaction.appPermissions.has(PermissionFlagsBits.BanMembers)) {
                await interaction.reply({
                    flags: ["Ephemeral"],
                    content: "Eu não tenho permissão apra executar essa ação😢"
                });
                return;
            } else if (!interaction.inCachedGuild) {
                await interaction.reply({
                    flags: ["Ephemeral"],
                    content: "Você deve estar dentro de um servidor para utilizar esse comando💕"
                });
                return;
            }
            const ban = await interaction.guild.members.ban(user);
            await interaction.reply({
                flags: ["Ephemeral"],
                content: `${ban} foi banido com sucesso pelo modrador ${author}`
            });
            return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message)
            } else {
                console.error(`Um erro inexperado aconteceu: ${error}`)
            }
        }
        }
});