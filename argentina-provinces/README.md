# Argentina province maps

23州(Ciudad Autónoma de Buenos Airesは除外)を北から南への順(州都・重心の緯度による近似)で並べ、対応する定義ファイル・生成済み地点ファイルをまとめています。

パラメータはメキシコの州別マップと同一です: 1州あたり50地点、田舎率90%狙い(`Buildings100 eq 0 and Roads200 lte 3` に一致する地点を90%、残り10%は制限なし)、トレッカー撮影は Vali のデフォルト挙動により除外。

| # | 州 (Spanish name) | 定義ファイル | 生成済み地点ファイル |
|---|---|---|---|
| 1 | Jujuy | ar-jujuy.json | ar-jujuy-locations.json |
| 2 | Salta | ar-salta.json | ar-salta-locations.json |
| 3 | Formosa | ar-formosa.json | ar-formosa-locations.json |
| 4 | Chaco | ar-chaco.json | ar-chaco-locations.json |
| 5 | Tucumán | ar-tucuman.json | ar-tucuman-locations.json |
| 6 | Misiones | ar-misiones.json | ar-misiones-locations.json |
| 7 | Santiago del Estero | ar-santiago-del-estero.json | ar-santiago-del-estero-locations.json |
| 8 | Catamarca | ar-catamarca.json | ar-catamarca-locations.json |
| 9 | Corrientes | ar-corrientes.json | ar-corrientes-locations.json |
| 10 | La Rioja | ar-la-rioja.json | ar-la-rioja-locations.json |
| 11 | San Juan | ar-san-juan.json | ar-san-juan-locations.json |
| 12 | Santa Fe | ar-santa-fe.json | ar-santa-fe-locations.json |
| 13 | Entre Ríos | ar-entre-rios.json | ar-entre-rios-locations.json |
| 14 | Córdoba | ar-cordoba.json | ar-cordoba-locations.json |
| 15 | San Luis | ar-san-luis.json | ar-san-luis-locations.json |
| 16 | Mendoza | ar-mendoza.json | ar-mendoza-locations.json |
| 17 | Buenos Aires | ar-buenos-aires.json | ar-buenos-aires-locations.json |
| 18 | La Pampa | ar-la-pampa.json | ar-la-pampa-locations.json |
| 19 | Neuquén | ar-neuquen.json | ar-neuquen-locations.json |
| 20 | Río Negro | ar-rio-negro.json | ar-rio-negro-locations.json |
| 21 | Chubut | ar-chubut.json | ar-chubut-locations.json |
| 22 | Santa Cruz | ar-santa-cruz.json | ar-santa-cruz-locations.json |
| 23 | Tierra del Fuego | ar-tierra-del-fuego.json | ar-tierra-del-fuego-locations.json |

補足:
- 州は南北に長い(例: Buenos Aires、Río Negro、Chubut、Santa Cruz)ため、厳密な「北から南」というより州都・重心付近の緯度で近似した順番です。境界付近(#10〜#15あたり)は前後する可能性があります。
- Ciudad Autónoma de Buenos Aires(CABA)は完全な都市部で田舎条件にほぼ一致しないため、今回の対象から除外しています。
- 23州すべて目標50/50地点(狙い通り田舎率90%)を達成しています。
