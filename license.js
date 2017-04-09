'use strict'
const path = require('path')
const spdxSet = require('spdx-license-list/simple')
const spdx = require('spdx-license-list/full')
const normalizeData = require('normalize-package-data')

module.exports = function (sections, pluginOptions = {}) {
  let long = Boolean(pluginOptions.long)
  let pkg = require(path.join(process.cwd(), 'package.json'))
  normalizeData(pkg)
  if (!spdxSet.has(pkg.license)) {
    throw new Error(`'${pkg.license}' is not a valid value for the 'license' field in package.json. Please set it to an official SPDX value.`)
  }
  let year = (new Date()).getFullYear()
  let licenseName = spdx[pkg.license].name
  let licenseUrl = spdx[pkg.license].url
  // I put this ugly logic in here simply because I like The Unlicense a lot.
  let hasThe = licenseName.toLowerCase().startsWith('the')
  let licenseText = long ? spdx[pkg.license].licenseText : `Licensed under ${hasThe ? '' : 'the '}[${licenseName}](${licenseUrl}).`
  let licenseSectionText = `## License

Copyright ${year} ${pkg.author.name}.
${licenseText}
`
  // Update existing license section
  for (let i in sections) {
    if (sections[i].match(/^#{1,2}\s*License/i)) {
      sections[i] = licenseSectionText
      return sections
    }
  }
  // or append one to the end
  sections.push(licenseSectionText)
  return sections
}
