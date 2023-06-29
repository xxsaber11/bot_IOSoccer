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
    .addIntegerOption((option) =>
      option
        .setName("temporada")
        .setDescription("Número de temporada para filtrar")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("torneo")
        .setDescription("Nombre del torneo para filtrar")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),

  async execute(interaction, client) {
    const jugador = interaction.options.getString("jugador");
    const temporada = interaction.options.getInteger("temporada")
    const torneo = interaction.options.getString("torneo")
    console.log(torneo);
    try {
      const jugadoresData = fs.readFileSync(`ListasDeJugadores/ListaJugadores_Temporada${temporada}.json`, "utf-8");
      const jugadores = JSON.parse(jugadoresData);

      const torneosData = fs.readFileSync(`ListasDeTorneos/Torneos_TodasLasTemporadas.json`, "utf-8");
      const torneos = JSON.parse(torneosData);

      // Filtrar jugadores por el nombre
      let jugadoresFiltrados = jugadores.filter((j) => j.name.toLowerCase().includes(jugador.toLowerCase()));

      // Filtrar jugadores por el nombre del torneo
      if (torneo) {
        jugadoresFiltrados = jugadoresFiltrados.filter((j) => {
          const jugadorTorneo = torneos.find((t) => t && t.toLowerCase() === torneo.toLowerCase());
          console.log("este es el jugador de torneo: "+jugadorTorneo+ "----------------------");
          console.log("este es el torneo: "+torneo+ "----------------------");
          console.log("estos son los torneos: "+torneos+ "----------------------");
          return jugadorTorneo && j.torneo.toLowerCase() === jugadorTorneo.toLowerCase();
        });
      }

      if (jugadoresFiltrados.length > 0) {
        const respuesta = jugadoresFiltrados
          .map((j) => {
            const jugadorProperties = Object.entries(j)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n");
            return `Estadísticas del jugador ${j.name}:\n${jugadorProperties}`;
          })
          .join("\n\n");

        await interaction.reply(respuesta);
      } else {
        await interaction.reply("No se encontraron jugadores con ese nombre en la temporada y torneo especificados.");
      }
    } catch (error) {
      console.error(`Error al leer el archivo ListaJugadores_Temporada${temporada}.json:`, error);
      await interaction.reply("Ocurrió un error al obtener las estadísticas del jugador.");
    }
  },
};
