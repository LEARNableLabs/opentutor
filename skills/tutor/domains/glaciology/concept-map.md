# Glaciology — Concept Map

## Core Concepts (in learning order)

1. **Glacier definition** — ice masses that flow under their own weight
2. **Ice deformation** — viscous creep of polycrystalline ice
3. **Viscous flow** — non-Newtonian fluid behavior of ice
4. **Ice crystal structure** — hexagonal lattice (ice Ih)
5. **Hydrogen bonding** — molecular interactions determining ice properties
6. **Firn densification** — transformation from snow to ice
7. **Pressure sintering** — mechanism of firn compaction
8. **Air bubble closure** — trapping of atmospheric gases
9. **Geothermal heat flux** — heat from Earth's interior
10. **Surface temperature forcing** — atmospheric temperature boundary condition
11. **Thermal regime** — temperature distribution within ice
12. **Mass balance** — difference between accumulation and ablation. Depends on: accumulation, ablation
13. **Accumulation** — snow/ice gain
14. **Ablation** — ice loss through melting, sublimation, calving
15. **Mass balance measurement** — geodetic and glaciological methods. Depends on: mass balance
16. **Internal deformation** — ice flow via crystal dislocation creep. Depends on: ice deformation, viscous flow
17. **Basal sliding** — glacier motion at the bed. Depends on: thermal regime
18. **Glen's flow law** — constitutive relation for ice rheology. Depends on: viscous flow, internal deformation
19. **Basal thermal regime** — temperature at glacier bed. Depends on: thermal regime, geothermal heat flux
20. **Temperate glaciers** — ice at pressure melting point. Depends on: thermal regime
21. **Polar glaciers** — ice below pressure melting point. Depends on: thermal regime
22. **Glacier surges** — rapid, quasi-periodic advances. Depends on: basal sliding, basal thermal regime
23. **Ice sheets** — continental-scale ice masses. Depends on: glacier definition
24. **Mass conservation** — continuity equation for ice
25. **Momentum balance** — stress equilibrium in ice. Depends on: internal deformation
26. **Stress-strain relations** — Glen's flow law in 3D. Depends on: Glen's flow law
27. **Shallow ice approximation** — reduced stress balance for thin ice. Depends on: momentum balance, stress-strain relations
28. **Ice streams** — fast-flowing corridors within ice sheets. Depends on: ice sheets, basal sliding
29. **Basal lubrication** — water reducing basal friction. Depends on: basal sliding, basal thermal regime
30. **Weak till** — deformable sediment at ice sheet base. Depends on: basal lubrication
31. **Numerical methods** — discretization of ice flow equations
32. **Finite elements** — spatial discretization technique
33. **Ice sheet models** — computational tools (PISM, ISSM, Elmer/Ice). Depends on: numerical methods, finite elements
34. **Marine ice sheet instability** — runaway grounding line retreat. Depends on: ice sheets, ice streams
35. **Grounding line** — transition from grounded to floating ice. Depends on: marine ice sheet instability
36. **Radar altimetry** — satellite elevation measurement (CryoSat)
37. **Laser altimetry** — lidar elevation measurement (ICESat-2)
38. **Ice cores** — cylindrical samples drilled from ice
39. **Paleoclimate proxies** — past climate indicators. Depends on: ice cores
40. **Trapped air bubbles** — atmospheric composition archive. Depends on: air bubble closure, ice cores
41. **Oxygen isotopes** — temperature proxy in ice cores. Depends on: paleoclimate proxies
42. **Deuterium excess** — moisture source proxy. Depends on: paleoclimate proxies
43. **Temperature reconstruction** — inferring past temperatures from proxies. Depends on: oxygen isotopes, deuterium excess
44. **Sea level contribution** — ice sheet mass loss raising sea level. Depends on: mass balance, ice sheets
45. **IPCC projections** — climate model forecasts
46. **Ice-albedo feedback** — positive feedback from surface reflectivity. Depends on: glacier-climate interactions
47. **Elevation-mass balance feedback** — surface lowering increasing melt. Depends on: mass balance, surface temperature forcing
48. **Climate sensitivity** — response magnitude to forcing

## Dependencies

- **Mass balance** requires understanding both accumulation and ablation because it's defined as their difference
- **Basal sliding** depends on thermal regime because sliding only occurs when basal ice is at the pressure melting point
- **Glen's flow law** builds on viscous flow and internal deformation because it quantifies the relationship between stress and strain rate
- **Ice streams** require understanding both ice sheets (spatial context) and basal sliding (physical mechanism) because they are regions of enhanced flow driven by reduced basal friction
- **Marine ice sheet instability** depends on ice sheets and ice streams because the instability arises from the interaction between ice flow, flotation, and grounding line migration
- **Temperature reconstruction** requires oxygen isotopes and deuterium excess because multiple proxies are needed to constrain past temperatures and separate temperature from precipitation source effects
- **Elevation-mass balance feedback** depends on mass balance and surface temperature forcing because surface lowering moves ice into warmer atmospheric layers, increasing ablation

## Bottlenecks

- **Glen's flow law** — understanding non-Newtonian rheology is essential for all subsequent flow modeling
- **Basal thermal regime** — determines whether basal sliding can occur, controlling glacier velocity
- **Shallow ice approximation** — critical for tractable ice sheet modeling; must understand when it's valid
- **Mass balance** — fundamental to predicting glacier response to climate; integrates all forcing

## Common Prerequisite Gaps

- **Vector calculus** — needed for conservation equations and stress tensors
- **Continuum mechanics** — stress, strain, constitutive relations
- **Thermodynamics** — phase transitions, latent heat, conduction
- **Numerical methods** — finite differences, finite elements, stability

## Misconceptions

- **Glaciers don't flow like water** — ice is a viscous solid, not a liquid; flow occurs through crystal deformation
- **Ice isn't always at 0°C** — polar ice can be -30°C internally
- **Mass balance ≠ glacier advance** — a glacier can retreat while gaining mass if dynamics change
- **Ice sheets aren't stable** — marine ice sheet instability can cause rapid collapse
- **Ice cores aren't simple thermometers** — isotope ratios reflect both temperature and moisture source
