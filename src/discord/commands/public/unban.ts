import { createCommand } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType, PermissionFlagsBits } from "discord.js";

createCommand({
    name: "unban",
    description: "Comando para banir usuarios😜",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionFlagsBits.BanMembers,
    options: [
        {
            name: "nome",
            description: "Usuario que você quer banir",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    async run(interaction) {
        try {
            const author = interaction.user;

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

            const userInput = interaction.options.getString("nome", true).toLowerCase();
            const bans = await interaction.guild.bans.fetch();
            const bannedUser = bans.find((ban) => {
                return (
                    ban.user.id === userInput ||
                    ban.user.username.toLowerCase() === userInput ||
                    ban.user.tag.toLowerCase() === userInput
                );
            });

            if (!bannedUser) {
                await interaction.reply({
                    flags: ["Ephemeral"],
                    content: "Não encontrei nenhum usuário banido com esse ID ou nome."
                });
                return;
            }
            await interaction.guild.members.unban(bannedUser.user.id);
            await interaction.reply({
                flags: ["Ephemeral"],
                content: `${userInput} foi desbanido com sucesso pelo moderador ${author}`
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