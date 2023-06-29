const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const fs = require("fs");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("torneos")
      .setDescription("te dare los torneos de la temporada que elijas")
      .addIntegerOption((option) =>
        option
          .setName("temporada")
          .setDescription("¿De qué temporada te gustaría conocer los torneos?")
          .setRequired(false)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),
  
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
      const temporada = interaction.options.getInteger("temporada") || 1;
      const torneosData = fs.readFileSync(`ListasDeTorneos/Torneos_Temporada${temporada}.json`, "utf-8");
      const torneos = JSON.parse(torneosData);
  
      // Generar el mensaje con los torneos
      const mensajeTorneos = torneos.join("\n");
      // Enviar el mensaje al chat
      await interaction.channel.send(mensajeTorneos);
      
      await interaction.reply("Aquí tienes los torneos de la temporada seleccionada.");
    },
  };
  