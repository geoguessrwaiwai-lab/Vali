# Mexico state maps

32州すべてを北から南への順(州都・重心の緯度による近似)で並べ、対応する定義ファイル・生成済み地点ファイルをまとめています。

各定義ファイルは1州あたり50地点、田舎率90%(`Buildings100 eq 0 and Roads200 lte 3` に一致する地点を90%、残り10%は制限なし)、トレッカー撮影は Vali のデフォルト挙動により除外されています。

| # | 州 (Spanish name) | ISO Code | 定義ファイル | 生成済み地点ファイル |
|---|---|---|---|---|
| 1 | Baja California | MX-BCN | mx-bcn.json | mx-bcn-locations.json |
| 2 | Sonora | MX-SON | mx-son.json | mx-son-locations.json |
| 3 | Chihuahua | MX-CHH | mx-chh.json | mx-chh-locations.json |
| 4 | Coahuila | MX-COA | mx-coa.json | mx-coa-locations.json |
| 5 | Baja California Sur | MX-BCS | mx-bcs.json | mx-bcs-locations.json |
| 6 | Nuevo León | MX-NLE | mx-nle.json | mx-nle-locations.json |
| 7 | Sinaloa | MX-SIN | mx-sin.json | mx-sin-locations.json |
| 8 | Durango | MX-DUR | mx-dur.json | mx-dur-locations.json |
| 9 | Tamaulipas | MX-TAM | mx-tam.json | mx-tam-locations.json |
| 10 | Zacatecas | MX-ZAC | mx-zac.json | mx-zac-locations.json |
| 11 | San Luis Potosí | MX-SLP | mx-slp.json | mx-slp-locations.json |
| 12 | Aguascalientes | MX-AGU | mx-agu.json | mx-agu-locations.json |
| 13 | Nayarit | MX-NAY | mx-nay.json | mx-nay-locations.json |
| 14 | Guanajuato | MX-GUA | mx-gua.json | mx-gua-locations.json |
| 15 | Yucatán | MX-YUC | mx-yuc.json | mx-yuc-locations.json |
| 16 | Jalisco | MX-JAL | mx-jal.json | mx-jal-locations.json |
| 17 | Querétaro | MX-QUE | mx-que.json | mx-que-locations.json |
| 18 | Hidalgo | MX-HID | mx-hid.json | mx-hid-locations.json |
| 19 | Quintana Roo | MX-ROO | mx-roo.json | mx-roo-locations.json |
| 20 | Ciudad de México | MX-CMX | mx-cmx.json | mx-cmx-locations.json |
| 21 | Tlaxcala | MX-TLA | mx-tla.json | mx-tla-locations.json |
| 22 | México (state) | MX-MEX | mx-mex.json | mx-mex-locations.json |
| 23 | Michoacán | MX-MIC | mx-mic.json | mx-mic-locations.json |
| 24 | Colima | MX-COL | mx-col.json | mx-col-locations.json |
| 25 | Veracruz | MX-VER | mx-ver.json | mx-ver-locations.json |
| 26 | Campeche | MX-CAM | mx-cam.json | mx-cam-locations.json |
| 27 | Puebla | MX-PUE | mx-pue.json | mx-pue-locations.json |
| 28 | Morelos | MX-MOR | mx-mor.json | mx-mor-locations.json |
| 29 | Tabasco | MX-TAB | mx-tab.json | mx-tab-locations.json |
| 30 | Guerrero | MX-GRO | mx-gro.json | mx-gro-locations.json |
| 31 | Oaxaca | MX-OAX | mx-oax.json | mx-oax-locations.json |
| 32 | Chiapas | MX-CHP | mx-chp.json | mx-chp-locations.json |

補足: 州は南北に長かったり(例: Baja California Sur、Tamaulipas、Veracruz、Campeche、Quintana Roo)、緯度が近い州同士(例: Yucatán と Jalisco)もあるため、厳密な「北から南」というより州都・重心付近の緯度で近似した順番です。境界付近(#15〜#26あたり)は前後する可能性があります。
