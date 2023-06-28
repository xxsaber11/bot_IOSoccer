const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("puntuacion")
      .setDescription("te dare las estadisticas del jugador que elijas")
      .addUserOption((option) =>
        option
          .setName(`usuario`)
          .setDescription(`Usuario del que quieres conocer las estadisticas`)
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser(`usuario`);
        const { guild } = interaction;



    },
};