const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const { config } = require("process");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("estadisticas")
    .setDescription("Te daré las estadísticas del jugador que elijas")
    .addStringOption((option) =>
      option
        .setName("jugador")
        .setDescription("Nombre del jugador para filtrar")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("temporada")
        .setDescription("Número de temporada para filtrar")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),

  async execute(interaction, client) {
    const jugador = interaction.options.getString("jugador");
    const temporada = interaction.options.getInteger("temporada");

    try {
      const jugadoresData = fs.readFileSync(`ListasDeJugadores/ListaJugadores_Temporada${temporada}.json`, "utf-8");
      const jugadores = JSON.parse(jugadoresData);

      // Filtrar jugadores por el nombre
      const jugadoresFiltrados = jugadores.filter((j) => j.name.toLowerCase().includes(jugador.toLowerCase()));

      if (jugadoresFiltrados.length > 0) {
        const respuesta = jugadoresFiltrados.map((j) => {
          const jugadorProperties = Object.entries(j).map(([key, value]) => `${key}: ${value}`).join("\n");
          return `Estadísticas del jugador ${j.name}:\n${jugadorProperties}`;
        }).join("\n\n");

        await interaction.reply(respuesta);
      } else {
        await interaction.reply("No se encontraron jugadores con ese nombre en la temporada especificada.");
      }
    } catch (error) {
      console.error(`Error al leer el archivo ListaJugadores_Temporada${temporada}.json:`, error);
      await interaction.reply("Ocurrió un error al obtener las estadísticas del jugador.");
    }
  },
};
