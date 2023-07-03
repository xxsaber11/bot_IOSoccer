const { ChatInputCommandInteraction, SlashCommandBuilder, MessageEmbed, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("partido")
    .setDescription("Te mostraré el partido que elijas")
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel)
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID del partido")
        .setRequired(false)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      const id = interaction.options.getString("id");
      const filePath = "./ListasDePartidos/partidos_Recientes.json";

      // Leer el archivo JSON de los partidos recientes
      const matchesString = fs.readFileSync(filePath, "utf8");
      const matches = JSON.parse(matchesString);

      if (matches.length > 0) {
        // Buscar el partido por ID
        const partidoID = id;
        const partido = matches.find((match) => match._id === partidoID);

        if (partido) {
          // Crear la respuesta con las estadísticas del partido
          const mensaje = `**Partido - ${partido.torneo}**
          Fecha: ${partido.fecha}
          Torneo: ${partido.torneo}
          Equipo local: ${partido.teams[0].teamname}
          Goles: ${partido.teams[0].score}
          Tiros: ${partido.teams[0].statistics.shots}
          Tiros a puerta: ${partido.teams[0].statistics.shotsontarget}
          Pases: ${partido.teams[0].statistics.passes}
          Pases completados: ${partido.teams[0].statistics.passescompleted}
          Faltas: ${partido.teams[0].statistics.fouls}`;
          
          console.log("partido:", partido);
          console.log("mensaje:", mensaje);
          
          await interaction.reply(mensaje);
          
        } else {
          console.log("No se encontró un partido con el ID proporcionado.");
          await interaction.reply("No se encontró un partido con el ID proporcionado.");
        }
      } else {
        console.log("No hay partidos recientes para mostrar.");
        await interaction.reply("No hay partidos recientes para mostrar.");
      }
    } catch (error) {
      console.error("Error al obtener los partidos recientes:", error);
      await interaction.reply("Ocurrió un error al obtener los partidos recientes.");
    }
  },
};
