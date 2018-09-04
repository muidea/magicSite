
const ToCatalogUnit = (catalogs) => {
  const catalogUnits = []
  for (let idx = 0; idx < catalogs.length;) {
    const val = catalogs[idx]
    catalogUnits.push({ id: val.id, type: 'catalog' })
    idx += 1
  }

  return catalogUnits
}

module.exports = {
  ToCatalogUnit,
}
