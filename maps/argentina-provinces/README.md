# Argentina province maps

23州(Ciudad Autónoma de Buenos Airesは除外)を北から南への順(州都・重心の緯度による近似)で並べ、対応する定義ファイル・生成済み地点ファイルをまとめています。

パラメータはメキシコの州別マップと同一です: 1州あたり50地点、田舎率90%狙い(`Buildings100 eq 0 and Roads200 lte 3` に一致する地点を90%、残り10%は制限なし)、トレッカー撮影は Vali のデフォルト挙動により除外。

| # | 州 (Spanish name) | 定義ファイル | 生成済み地点ファイル | GeoGuessrマップ |
|---|---|---|---|---|
| 1 | Jujuy | ar-jujuy.json | ar-jujuy-locations.json | [AR-Jujuy](https://www.geoguessr.com/maps/6a8ce763a0625c9bfee1ffcf) |
| 2 | Salta | ar-salta.json | ar-salta-locations.json | [AR-Salta](https://www.geoguessr.com/maps/6a8ce787a0625c9bfee20032) |
| 3 | Formosa | ar-formosa.json | ar-formosa-locations.json | [AR-Formosa](https://www.geoguessr.com/maps/6a8ce7aa6530d52365d28b63) |
| 4 | Chaco | ar-chaco.json | ar-chaco-locations.json | [AR-Chaco](https://www.geoguessr.com/maps/6a8ce7cde814192766eb0082) |
| 5 | Tucumán | ar-tucuman.json | ar-tucuman-locations.json | [AR-Tucumán](https://www.geoguessr.com/maps/6a8ce7ef045e12a5faa00d56) |
| 6 | Misiones | ar-misiones.json | ar-misiones-locations.json | [AR-Misiones](https://www.geoguessr.com/maps/6a8ce812045e12a5faa00daa) |
| 7 | Santiago del Estero | ar-santiago-del-estero.json | ar-santiago-del-estero-locations.json | [AR-Santiago del Estero](https://www.geoguessr.com/maps/6a8ce8356530d52365d28cd5) |
| 8 | Catamarca | ar-catamarca.json | ar-catamarca-locations.json | [AR-Catamarca](https://www.geoguessr.com/maps/6a8ce858b80d4e504e47abc1) |
| 9 | Corrientes | ar-corrientes.json | ar-corrientes-locations.json | [AR-Corrientes](https://www.geoguessr.com/maps/6a8ce87bf855ba7894145537) |
| 10 | La Rioja | ar-la-rioja.json | ar-la-rioja-locations.json | [AR-La Rioja](https://www.geoguessr.com/maps/6a8ce89ea0625c9bfee20317) |
| 11 | San Juan | ar-san-juan.json | ar-san-juan-locations.json | [AR-San Juan](https://www.geoguessr.com/maps/6a8ce8c16530d52365d28e1f) |
| 12 | Santa Fe | ar-santa-fe.json | ar-santa-fe-locations.json | [AR-Santa Fe](https://www.geoguessr.com/maps/6a8ce8e4e814192766eb0391) |
| 13 | Entre Ríos | ar-entre-rios.json | ar-entre-rios-locations.json | [AR-Entre Ríos](https://www.geoguessr.com/maps/6a8ce9076e7797c24fa42d18) |
| 14 | Córdoba | ar-cordoba.json | ar-cordoba-locations.json | [AR-Córdoba](https://www.geoguessr.com/maps/6a8ce92af855ba7894145705) |
| 15 | San Luis | ar-san-luis.json | ar-san-luis-locations.json | [AR-San Luis](https://www.geoguessr.com/maps/6a8ce94d6e7797c24fa42df8) |
| 16 | Mendoza | ar-mendoza.json | ar-mendoza-locations.json | [AR-Mendoza](https://www.geoguessr.com/maps/6a8ce970a0625c9bfee20505) |
| 17 | Buenos Aires | ar-buenos-aires.json | ar-buenos-aires-locations.json | [AR-Buenos Aires](https://www.geoguessr.com/maps/6a8ce9936e7797c24fa42ec6) |
| 18 | La Pampa | ar-la-pampa.json | ar-la-pampa-locations.json | [AR-La Pampa](https://www.geoguessr.com/maps/6a8ce9b6045e12a5faa0113e) |
| 19 | Neuquén | ar-neuquen.json | ar-neuquen-locations.json | [AR-Neuquén](https://www.geoguessr.com/maps/6a8ce9d8045e12a5faa01194) |
| 20 | Río Negro | ar-rio-negro.json | ar-rio-negro-locations.json | [AR-Río Negro](https://www.geoguessr.com/maps/6a8ce9fb6530d52365d29162) |
| 21 | Chubut | ar-chubut.json | ar-chubut-locations.json | [AR-Chubut](https://www.geoguessr.com/maps/6a8cea1e6e7797c24fa42ffc) |
| 22 | Santa Cruz | ar-santa-cruz.json | ar-santa-cruz-locations.json | [AR-Santa Cruz](https://www.geoguessr.com/maps/6a8cea41f855ba7894145961) |
| 23 | Tierra del Fuego | ar-tierra-del-fuego.json | ar-tierra-del-fuego-locations.json | [AR-Tierra del Fuego](https://www.geoguessr.com/maps/6a8cea64045e12a5faa012b7) |

補足:
- 州は南北に長い(例: Buenos Aires、Río Negro、Chubut、Santa Cruz)ため、厳密な「北から南」というより州都・重心付近の緯度で近似した順番です。境界付近(#10〜#15あたり)は前後する可能性があります。
- Ciudad Autónoma de Buenos Aires(CABA)は完全な都市部で田舎条件にほぼ一致しないため、今回の対象から除外しています。
- 23州すべて目標50/50地点(狙い通り田舎率90%)を達成しています。
