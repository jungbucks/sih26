# Bundled web fonts

Paperlogy and Wanted Sans are redistributed unchanged under SIL Open Font License 1.1.
Gowun Dodum and Gowun Batang are subsetted (KS X 1001 Hangul 2,350 + ASCII + common
symbols) and converted to WOFF2 under the same license; neither declares a Reserved Font Name.
The corresponding original copyright and license notices are included here.
No font CDN is used at runtime.

- `Paperlogy-7Bold.woff2`: Paperlogy Bold (700), from
  https://github.com/Freesentation/Paperlogy/blob/8ef35f53b318c7ca914c52b1b382b9a8bad07a61/woff2/Paperlogy-7Bold.woff2
  License: `Paperlogy-OFL.txt`.
- `WantedSansVariable.woff2`: Wanted Sans variable (400–1000), from
  https://github.com/wanteddev/wanted-sans/blob/02c9b822349c188ada95f9e2d90c2ed18f853235/packages/wanted-sans/fonts/webfonts/variable/complete/woff2/WantedSansVariable.woff2
  License: `WantedSans-OFL.txt`.

- `GowunDodum-Regular.woff2`: Gowun Dodum Regular, subset of
  https://github.com/google/fonts/blob/1d0e46c7933245c8180fe83e47917961c913bbdb/ofl/gowundodum/GowunDodum-Regular.ttf
  License: `GowunDodum-OFL.txt`.
- `GowunBatang-Regular.woff2`, `GowunBatang-Bold.woff2`: Gowun Batang Regular/Bold, subsets of
  https://github.com/google/fonts/tree/1d0e46c7933245c8180fe83e47917961c913bbdb/ofl/gowunbatang
  License: `GowunBatang-OFL.txt`.

The exhibition interface uses Paperlogy and Wanted Sans. The design-proposal page
(`design.html`) previews all four. Student works may load these shared fonts by the
relative path `../assets/fonts/<file>` (design revision requests); when the file is
opened offline the browser falls back to a default font and features keep working.
