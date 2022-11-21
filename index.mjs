import fs from 'node:fs'
import * as cheerio from 'cheerio'
import { gotScraping } from 'got-scraping'
import { parseDocument } from 'htmlparser2'
import xlsx from 'json-as-xlsx'

async function main() {
  const { body } = await gotScraping(
    'https://en.wikipedia.org/wiki/List_of_tz_database_time_zones'
  )

  const $ = cheerio.load(parseDocument(body), null, false)
  const table = $('table.wikitable').first()
  const rows = table.find('tr')
  const data = []

  for (const row of rows) {
    const rowData = {}
    const cells = $(row).find('td')
    rowData.tzName = $(cells[1]).text().trim()

    if (rowData.tzName) {
      rowData.stdOffset = $(cells[4]).text().trim()
      rowData.dstOffset = $(cells[5]).text().trim()
      rowData.stdAbbrev = $(cells[6]).text().trim()
      rowData.dstAbbrev =
        $(cells[6]).attr('colspan') === '2' ? '' : $(cells[7]).text().trim()
      data.push(rowData)
    }
  }

  await writeData(data)
}

async function writeData(data) {
  fs.writeFileSync('./tzdata.json', JSON.stringify(data, null, 2))

  const config = [
    {
      sheet: 'Timezones',
      columns: [
        { label: 'Timezone Name', value: 'tzName' },
        { label: 'STD Offset', value: 'stdOffset' },
        { label: 'DST Offset', value: 'dstOffset' },
        { label: 'STD Abbrev', value: 'stdAbbrev' },
        { label: 'DST Abbrev', value: 'dstAbbrev' }
      ],
      content: data
    }
  ]

  const settings = {
    fileName: 'tzdata'
  }

  await xlsx(config, settings)
}

try {
  await main()
  console.log('Done')
} catch (error) {
  console.error(error)
}
