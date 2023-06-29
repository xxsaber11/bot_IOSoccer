const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("importar-equipos")
    .setDescription("Obtener la lista actualizada de los equipos")
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

          currentSeason++;
          page = 1; // Reiniciar el número de página para la próxima temporada
          foundTeams.clear(); // Reiniciar los equipos encontrados para la próxima temporada
          continue; // No se encontraron más resultados, continuar con la próxima temporada
        }

        links.each(async function () {
          const teamName = $(this).find("div").text().trim();
          const imageSrc = $(this).find("img.h-6").attr("src");
          const imageAlt = $(this).find("img.h-6").attr("alt");
          foundTeams.add(teamName);
          if (imageSrc && imageAlt) {
            const imageURL = `https://iosoccer-sa.bid${imageSrc}`;
            const imagePath = path.join("ImagenesEquipos", `${teamName}.png`);
            const imageResponse = await axios.get(imageURL, { responseType: "stream" });
            imageResponse.data.pipe(fs.createWriteStream(imagePath));
          }
        });

        page++;
      }

      // Guardar todos los equipos en un archivo JSON
      const listaEquiposTotal = [...foundTeams];
      const listaEquiposTotalJSON = JSON.stringify(listaEquiposTotal, null, 2);
      fs.writeFileSync(`ListasDeEquipos/ListaEquipos_Total.json`, listaEquiposTotalJSON);

      // Generar el mensaje con los equipos encontrados
      const mensajeEquipos = [...foundTeams].join("\n");

      // Editar la respuesta inicial con los resultados finales
      await interaction.editReply({
        content: `Aquí tienes la lista actualizada de los equipos:\n${mensajeEquipos}`,
        // También se ha guardado el archivo JSON con todos los equipos.
        files: [
          ...fs.readdirSync("ListasDeEquipos").map((filename) => `ListasDeEquipos/${filename}`),
          "ListasDeEquipos/ListaEquipos_Total.json",
        ],
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('Ya se importaron todas las temporadas.');
      } else {
        console.error('Ocurrió un error:', error);
      }
    }
  },
};
