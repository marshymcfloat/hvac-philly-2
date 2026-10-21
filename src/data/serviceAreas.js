export const serviceAreas = [
  {
    id: 'philadelphia',
    name: 'Philadelphia',
    landmark: 'Philadelphia City Hall',
    communities: 'Center City, Northeast, Northwest & South Philadelphia',
    alt: 'Generated view of Philadelphia City Hall and its clock tower in warm afternoon light'
  },
  {
    id: 'main-line',
    name: 'The Main Line',
    landmark: 'Bryn Mawr College Cloisters',
    communities: 'Ardmore, Bryn Mawr, Wayne, Haverford & Villanova',
    alt: 'Generated view of the stone Cloisters courtyard at Bryn Mawr College'
  },
  {
    id: 'delaware-county',
    name: 'Delaware County',
    landmark: 'Hunting Hill Mansion',
    communities: 'Media, Springfield & Upper Darby',
    alt: 'Generated view of Hunting Hill Mansion at Ridley Creek State Park'
  },
  {
    id: 'montgomery-county',
    name: 'Montgomery County',
    landmark: 'Valley Forge National Memorial Arch',
    communities: 'Jenkintown, Ambler & surrounding communities',
    alt: 'Generated view of the National Memorial Arch at Valley Forge'
  },
  {
    id: 'bucks-county',
    name: 'Bucks County',
    landmark: 'Fonthill Castle',
    communities: 'Heating & cooling for homes and businesses',
    alt: 'Generated view of Fonthill Castle and its distinctive concrete towers in Doylestown'
  },
  {
    id: 'chester-county',
    name: 'Chester County',
    landmark: 'Longwood Gardens',
    communities: 'Heating & cooling for homes and businesses',
    alt: 'Generated view of the Main Fountain Garden and historic conservatory at Longwood Gardens'
  }
].map((area) => ({
  ...area,
  image: `/images/areas/${area.id}.webp`,
  thumbnail: `/images/areas/${area.id}-card.webp`
}))
