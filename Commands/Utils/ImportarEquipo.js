const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("importar-equipos")
    .setDescription("Obtendremos la lista actualizada de los equipos")
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      // Enviar un mensaje inicial indicando que la solicitud está en progreso
      await interaction.deferReply();

      // Realizar la búsqueda en las páginas
      let page = 1;
      let foundTeams = new Set();
      let currentSeason = 0;
      try {
      while (true) {
        const url = `https://iosoccer-sa.bid/individuales/t${currentSeason}?page=${page}`;
        const response = await axios.get(url, { timeout: 90000 });
        const html = response.data;

        // Usar cheerio para buscar los elementos <a> con la clase deseada
        const $ = cheerio.load(html);
        const links = $("a.flex.items-center.justify-center.gap-x-1");

        if (links.length === 0) {

          
          if (foundTeams.size === 0 && currentSeason >= 10) {
            break; // Detener el bucle si no se encontraron equipos en las temporadas 10 en adelante
          }
          await interaction.editReply({
            content: `Se encontraron ${foundTeams.size} equipos en la temporada ${currentSeason}.`
          });
          if (foundTeams.size > 0) {
            // Guardar los equipos de la temporada en un archivo JSON
            const listaEquiposTemporada = [...foundTeams];
            const listaEquiposTemporadaJSON = JSON.stringify(listaEquiposTemporada, null, 2);
            fs.writeFileSync(`ListasDeEquipos/ListaEquipos_Temporada${currentSeason}.json`, listaEquiposTemporadaJSON);
          }
          currentSeason++;
          page = 1; // Reiniciar el número de página para la próxima temporada
          foundTeams.clear(); // Reiniciar los equipos encontrados para la próxima temporada
          continue; // No se encontraron más resultados, continuar con la próxima temporada
        }

        links.each(function () {
          const teamName = $(this).find("div").text().trim();
          foundTeams.add(teamName);
        });

        page++;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('Ya se importaron todas las temporadas.');
      } else {
        console.error('Ocurrió un error:', error);
      }
    }
      // Guardar los equipos de la última temporada en un archivo JSON
      const listaEquiposUltimaTemporada = [...foundTeams];
      const listaEquiposUltimaTemporadaJSON = JSON.stringify(listaEquiposUltimaTemporada, null, 2);
      fs.writeFileSync(`ListasDeEquipos/ListaEquipos_Temporada${currentSeason}.json`, listaEquiposUltimaTemporadaJSON);

      // Generar el mensaje con los equipos encontrados
      const mensajeEquipos = [...foundTeams].join("\n");

      // Guardar todos los equipos en un archivo JSON
      const listaEquiposTotal = [...foundTeams];
      const listaEquiposTotalJSON = JSON.stringify(listaEquiposTotal, null, 2);
      fs.writeFileSync(`ListasDeEquipos/ListaEquipos_Total.json`, listaEquiposTotalJSON);

      // Editar la respuesta inicial con los resultados finales
      await interaction.editReply({
        content: `Aquí tienes la lista actualizada de los equipos:\n${mensajeEquipos}`
        // También se han guardado los archivos JSON por temporada.`, files: ["ListasDeEquipos/ListaEquipos_Temporada*.json", "ListasDeEquipos/ListaEquipos_Total.json"],
      });
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }
  },
};
