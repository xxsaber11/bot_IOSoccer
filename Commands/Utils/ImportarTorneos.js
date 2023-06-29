const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('importar-torneos')
    .setDescription('Obtendremos la lista actualizada de los torneos')
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    // Función para capturar los torneos por temporada
    async function capturarTorneosPorTemporada(temporada) {
      try {
        // Construir la URL con la temporada como variable
        const url = `https://iosoccer-sa.bid/torneos/t${temporada}`;

        // Realizar la solicitud HTTP a la URL
        const response = await axios.get(url);
        const html = response.data;

        // Cargar el HTML en Cheerio
        const $ = cheerio.load(html);

        // Filtrar los elementos y extraer los nombres de los torneos
        const torneoElements = $('.w-full.font-heading.text-xl.font-bold.uppercase.text-neutral-600');
        const torneos = torneoElements
          .map((_, element) => {
            const text = $(element).text().trim();
            return text;
          })
          .get();

        console.log(`Se importaron de la temporada ${temporada} estos Torneos: `, torneos);

        // Guardar los torneos en un archivo JSON por temporada
        const torneosJSON = JSON.stringify(torneos);
        fs.writeFileSync(`ListasDeTorneos/Torneos_Temporada${temporada}.json`, torneosJSON);

        return torneos;
      } catch (error) {
        console.error(`Error al capturar los torneos de la temporada ${temporada}:`);
        return [];
      }
    }

    // Función para capturar todos los torneos
    async function capturarTodosLosTorneos() {
      let temporada = 0;
      const torneosTotales = [];

      while (true) {
        temporada++;

        try {
          const torneosTemporada = await capturarTorneosPorTemporada(temporada);

          if (torneosTemporada.length === 0) {
            break;
          }

          torneosTotales.push(...torneosTemporada);
        } catch (error) {
          console.error(`Error al capturar los torneos de la temporada ${temporada}:`);
        }
      }

      // Guardar todos los torneos en un solo archivo JSON
      const torneosJSON = JSON.stringify(torneosTotales);
      fs.writeFileSync(`ListasDeTorneos/Torneos_TodasLasTemporadas.json`, torneosJSON);

      console.log('Se ha completado la importación de torneos');
    }

    await interaction.reply('Iniciando importación de torneos...');
    await capturarTodosLosTorneos();
    await interaction.editReply('Se han importado todos los torneos.');
  },
};
