'use strict'
const path = require('path')
const spdxSet = require('spdx-license-list/simple')
const spdx = require('spdx-license-list/full')

module.exports = function (section) {
  let pkg = require(path.join(process.cwd(), 'package.json'))
  
  if (!spdxSet.has(pkg.license)) {
    throw new Error(`'${pkg.license}' is not a valid value for the 'license' field in package.json. Please set it to an official SPDX value.`)
  }
  let year = (new Date()).getFullYear()
  let licenseName = spdx[pkg.license].name
  let licenseUrl = spdx[pkg.license].url
  let hasThe = licenseName.toLowerCase().startsWith('the')
  section.body = []
  section.body.push('')
  section.body.push(`Copyright ${year} ${pkg.author}.`)
  // I put this ugly logic in here simply because I like The Unlicense a lot.
  section.body.push(`Licensed under ${hasThe ? '' : 'the '}[${licenseName}](${licenseUrl}).`)
  section.body.push('')
  return
}
module.exports.title = 'License'