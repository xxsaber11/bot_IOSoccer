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
      // Obtener el histórico de jugadores
      const responseHistorico = await axios.get("https://iosoccer-sa.bid/api/jugadores");
      const jugadoresHistorico = responseHistorico.data;

      // Almacenar el histórico de jugadores en un JSON
      const jugadoresHistoricoJSON = JSON.stringify(jugadoresHistorico);

      // Guardar el contenido del histórico en el archivo ListaJugadores_Historico.json
      fs.writeFileSync("ListasDeJugadores/ListaJugadores_Historico.json", jugadoresHistoricoJSON);

      // Mostrar el histórico completo en el chat
      await interaction.reply("Histórico completo de jugadores:", { files: ["ListaJugadores_Historico.json"] });

      let temporada = 0;
      let jugadoresTemporada = [];
      let jugadoresTemporadaJSON = "";

      // Obtener jugadores por temporada y generar JSON por temporada hasta que el resultado sea vacío
      while (true) {
        const response = await axios.get(`https://iosoccer-sa.bid/api/jugadores/t${temporada}`);
        jugadoresTemporada = response.data;

        if (jugadoresTemporada.length === 0) {
          break; // Salir del bucle si no hay más jugadores en la temporada
        }

        // Almacenar jugadores de la temporada en un JSON
        jugadoresTemporadaJSON = JSON.stringify(jugadoresTemporada);

        // Guardar el contenido en el archivo correspondiente a la temporada
        fs.writeFileSync(`ListasDeJugadores/ListaJugadores_Temporada${temporada}.json`, jugadoresTemporadaJSON);

        // Incrementar el número de temporada
        temporada++;
      }

      await interaction.followUp("Se han generado los JSON por temporada.");
    } catch (error) {
      console.error("Error al obtener los jugadores:", error);
      await interaction.reply("Ocurrió un error al obtener los jugadores del equipo.");
    }
  },
};
