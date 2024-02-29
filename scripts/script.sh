mkdir -p ../app/assets/data
curl -o ../app/assets/data/cc_cedict.txt.gz https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz && gunzip ../app/assets/data/cc_cedict.txt.gz
curl -o ../app/assets/data/makemeahanzi_dictionary.txt https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt
curl -o ../app/assets/data/makemeahanzi_graphics.txt https://raw.githubusercontent.com/skishore/makemeahanzi/master/graphics.txt
yarn install
yarn tsc
yarn node ./dist/createCcCedictJSONData.js
yarn node ./dist/createMakeMeAHanziJSONData.js
