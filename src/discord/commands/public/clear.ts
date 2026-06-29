import { createCommand } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType, PermissionFlagsBits } from "discord.js";
createCommand({
    name: "clear",
    description: "Clear command 🧹",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    options: [
        {
            name: "quantidade",
            description: "Quantidade de mensagens a serem apagadas",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    async run(interaction) {
        try {
            const qtd = interaction.options.getNumber("quantidade", true);
            if (qtd < 1 || qtd > 100) {
                await interaction.reply({
                    flags: ["Ephemeral"],
                    content: "Por limitação do discord, coloque um número entre 1 e 100💔"
                });
                return;
            } else if (!interaction.appPermissions.has(PermissionFlagsBits.ManageMessages)) {
                await interaction.reply({
                    flags: ["Ephemeral"],
                    content: "Não tenho permissão para executar essa ação😢"
                });
                return;
            } else if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
                await interaction.reply({
                    flags: ["Ephemeral"],
                    content: "Você não tem permissão pra executar está ação😜"
                });
                return;
            }

            const deletemsg = await interaction.channel?.bulkDelete(qtd, true);
            if (!deletemsg) {
                await interaction.reply({
                    flags: ["Ephemeral"],
                    content: "Desculpe, mas não consegui executar está ação💋"
                });
                return;
            } else if (deletemsg.size <= 0) {
                await interaction.reply({
                    flags: ["Ephemeral"],
                    content: "Nenhuma mensagem foi apagada👍"
                });
                return;
            }

            await interaction.reply({
                flags: ["Ephemeral"],
                content: `${deletemsg?.size ?? 0} mensagens deletadas neste canal!`
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Um erro ocorreu: ${error.message}`);
            } else {
                console.error(`Um erro desconhecido aconteceu: ${error}`);
            }
        }
    }
});
