const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

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
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),

  async execute(interaction, client) {
    const jugador = interaction.options.getString("jugador");

    try {
      const jugadoresData = fs.readFileSync("ListaJugadores.json", "utf-8");
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
        await interaction.reply("No se encontraron jugadores con ese nombre.");
      }
    } catch (error) {
      console.error("Error al leer el archivo ListaJugadores.json:", error);
      await interaction.reply("Ocurrió un error al obtener las estadísticas del jugador.");
    }
  },
};
