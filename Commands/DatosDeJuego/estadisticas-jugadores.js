const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
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
    const temporada = interaction.options.getInteger("temporada");
    const torneo = interaction.options.getString("torneo");

    const server = {
      name: "IOSoccer",
      iconURL: "C:\Users\sebas\OneDrive\Escritorio\bot_IOSoccer\ImagenesEquipos\Meteors Gaming.png"
    };


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
          return jugadorTorneo && j.torneo.toLowerCase() === jugadorTorneo.toLowerCase();
        });
      }
    
      if (jugadoresFiltrados.length > 0) {
        const mensajesRespuesta = jugadoresFiltrados.map((j) => {
          const equipo = j.team;
          const escudoPath = `ImagenesEquipos/${equipo}.png`;
          const escudoExists = fs.existsSync(escudoPath);
          const escudoAttachment = escudoExists ? { attachment: escudoPath, name: `${equipo}.png` } : null;
          const jugadorProperties = Object.entries(j)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        
          const embed = new EmbedBuilder()
            .setTitle("Estadísticas del jugador")
            .setColor("#ff0000")
            .setTimestamp()
            .setDescription(jugadorProperties)
            .setFooter({ text: "Estadisticas" });
            if (escudoAttachment) {
              embed.setImage(`attachment://${escudoAttachment.filename}`);
            } else {
              embed.setImage("URL de la imagen predeterminada");
            }        
            return { embeds: [embed], files: [escudoAttachment] };
          });
        
        if (mensajesRespuesta.length > 0) {
          await Promise.all(mensajesRespuesta.map((mensaje) => interaction.reply(mensaje)));
        } else {
          await interaction.reply("No se encontraron jugadores con ese nombre en la temporada y torneo especificados.");
        }
      } else {
        await interaction.reply("No se encontraron jugadores con ese nombre en la temporada y torneo especificados.");
      }
    } catch (error) {
      console.error(`Error al leer el archivo ListaJugadores_Temporada${temporada}.json:`, error);
      await interaction.reply("Ocurrió un error al obtener las estadísticas del jugador.");
    }
  }
}
