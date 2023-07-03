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
            const equipoLocal = partido.teams[0];
            const equipoVisitante = partido.teams[1];
            
            const mensaje = `**Partido - ${partido.torneo}**
            Fecha: ${partido.fecha}
            Torneo: ${partido.torneo}
            
            Equipo local:
            Nombre: ${equipoLocal.teamname}
            Goles: ${equipoLocal.score}
            Tiros: ${equipoLocal.statistics.shots}
            Tiros a puerta: ${equipoLocal.statistics.shotsontarget}
            Pases: ${equipoLocal.statistics.passes}
            Pases completados: ${equipoLocal.statistics.passescompleted}
            Faltas: ${equipoLocal.statistics.fouls}
            Tarjetas amarillas: ${equipoLocal.statistics.yellowcards}
            Tarjetas rojas: ${equipoLocal.statistics.redcards}
            Fuera de juego: ${equipoLocal.statistics.offsides}
            Corners: ${equipoLocal.statistics.corners}
            Saques de banda: ${equipoLocal.statistics.throwins}
            Penales: ${equipoLocal.statistics.penalties}
            Tiros libres: ${equipoLocal.statistics.freekicks}
            Faltas recibidas: ${equipoLocal.statistics.foulssuffered}
            Goles encajados: ${equipoLocal.statistics.goalsconceded}
            Intercepciones: ${equipoLocal.statistics.interceptions}
            Autogoles: ${equipoLocal.statistics.owngoals}
            Entradas: ${equipoLocal.statistics.tackles}
            Entradas completadas: ${equipoLocal.statistics.tacklescompleted}
            Atajadas: ${equipoLocal.statistics.saves}
            Atajadas atrapadas: ${equipoLocal.statistics.savescaught}
            Distancia recorrida: ${equipoLocal.statistics.distancecovered}
            Asistencias: ${equipoLocal.statistics.assists}
            Despejes: ${equipoLocal.statistics.goalkicks}
            Pases clave: ${equipoLocal.statistics.keypasses}
            Oportunidades creadas: ${equipoLocal.statistics.chancescreated}
            Segundas asistencias: ${equipoLocal.statistics.secondassists}
            
            Equipo visitante:
            Nombre: ${equipoVisitante.teamname}
            Goles: ${equipoVisitante.score}
            Tiros: ${equipoVisitante.statistics.shots}
            Tiros a puerta: ${equipoVisitante.statistics.shotsontarget}
            Pases: ${equipoVisitante.statistics.passes}
            Pases completados: ${equipoVisitante.statistics.passescompleted}
            Faltas: ${equipoVisitante.statistics.fouls}
            Tarjetas amarillas: ${equipoVisitante.statistics.yellowcards}
            Tarjetas rojas: ${equipoVisitante.statistics.redcards}
            Fuera de juego: ${equipoVisitante.statistics.offsides}
            Corners: ${equipoVisitante.statistics.corners}
            Saques de banda: ${equipoVisitante.statistics.throwins}
            Penales: ${equipoVisitante.statistics.penalties}
            Tiros libres: ${equipoVisitante.statistics.freekicks}
            Faltas recibidas: ${equipoVisitante.statistics.foulssuffered}
            Goles encajados: ${equipoVisitante.statistics.goalsconceded}
            Intercepciones: ${equipoVisitante.statistics.interceptions}
            Autogoles: ${equipoVisitante.statistics.owngoals}
            Entradas: ${equipoVisitante.statistics.tackles}
            Entradas completadas: ${equipoVisitante.statistics.tacklescompleted}
            Atajadas: ${equipoVisitante.statistics.saves}
            Atajadas atrapadas: ${equipoVisitante.statistics.savescaught}
            Distancia recorrida: ${equipoVisitante.statistics.distancecovered}
            Asistencias: ${equipoVisitante.statistics.assists}
            Despejes: ${equipoVisitante.statistics.goalkicks}
            Pases clave: ${equipoVisitante.statistics.keypasses}
            Oportunidades creadas: ${equipoVisitante.statistics.chancescreated}
            Segundas asistencias: ${equipoVisitante.statistics.secondassists}`;
            
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
