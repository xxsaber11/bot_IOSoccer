const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
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
      let foundTeams = [];

      while (true) {
        const url = `https://iosoccer-sa.bid/individuales?page=${page}`;
        const response = await axios.get(url, { timeout: 3000000 });
        const html = response.data;

        // Usar cheerio para buscar los elementos <a> con la clase deseada
        const $ = cheerio.load(html);
        const links = $("a.flex.items-center.justify-center.gap-x-1");

        if (links.length === 0) {
          break; // No se encontraron más resultados, salir del bucle
        }

        links.each(function () {
          const teamName = $(this).find("div").text().trim();
          foundTeams.push(teamName);
        });

        page++;
      }

      // Eliminar duplicados de los equipos encontrados
      const uniqueTeams = [...new Set(foundTeams)];

      // Generar el mensaje con los equipos encontrados
      const mensajeEquipos = uniqueTeams.join("\n");

      // Guardar los equipos en un archivo JSON
      const listaEquipos = JSON.stringify(uniqueTeams, null, 2);
      fs.writeFileSync("ListasDeEquipos/ListaEquipos.json", listaEquipos);
      console.log("Aquí está la lista de equipos: " + listaEquipos);

      // Editar la respuesta inicial con los resultados finales
      await interaction.editReply({
        content: `Aquí tienes la lista actualizada de los equipos:\n${mensajeEquipos}` 
        
        //También se ha guardado en un archivo JSON.`,files: ["ListaEquipos.json"],
      });
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }
  },
};
