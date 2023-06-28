const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const axios = require("axios");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jugadores")
    .setDescription("Obtendremos la lista actualizada de los jugadores")
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const equipo = interaction.options.getUser(`equipo`);
    const { guild } = interaction;

    try {
      const response = await axios.get("https://iosoccer-sa.bid/api/jugadores/t11");
      const jugadores = response.data;

      // Almacenar jugadores en un JSON
      const jugadoresJSON = JSON.stringify(jugadores);

      // Guardar el contenido en el archivo ListaJugadores.json
      fs.writeFileSync("ListaJugadores.json", jugadoresJSON);

      // Mostrar la lista completa en el chat
      await interaction.reply("Lista completa de jugadores del equipo:", { files: ["ListaJugadores.json"] });

    } catch (error) {
      console.error("Error al obtener los jugadores:", error);
      await interaction.reply("Ocurrió un error al obtener los jugadores del equipo.");
    }
  },
};
