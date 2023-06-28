const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("equipo")
      .setDescription("te dare las estadisticas del equipo que elijas")
      .addUserOption((option) =>
        option
          .setName(`equipo`)
          .setDescription(`Equipo del que quieres conocer las estadisticas`)
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser(`equipo`);
        const { guild } = interaction;



    },
};