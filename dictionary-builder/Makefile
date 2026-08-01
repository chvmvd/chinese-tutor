install:
	npm ci

# CC-CEDICT
download-cc-cedict:
	mkdir -p data
	curl -o data/cc-cedict.txt.gz https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz
	gunzip data/cc-cedict.txt.gz

generate-cc-cedict:
	rm -f output/cc-cedict/cc-cedict.db
	mkdir -p output/cc-cedict
	npx drizzle-kit push --config=drizzle-cc-cedict.config.ts
	npx tsx scripts/generate-cc-cedict-database.ts
	npx tsx scripts/generate-cc-cedict-license.ts
	npx tsx scripts/generate-version-file.ts

# Unihan
download-unihan:
	mkdir -p data
	curl -o data/unihan.zip https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
	unzip data/unihan.zip -d data/unihan

generate-unihan:
	rm -f output/unihan/unihan.db
	mkdir -p output/unihan
	npx drizzle-kit push --config=drizzle-unihan.config.ts
	npx tsx scripts/generate-unihan-database.ts
	npx tsx scripts/generate-unihan-license.ts
	npx tsx scripts/generate-version-file.ts

# Chinese Wiktionary
download-wiktionary-chinese:
	mkdir -p data
	curl -o data/wiktionary-chinese.jsonl.gz https://kaikki.org/dictionary/downloads/zh/zh-extract.jsonl.gz
	gunzip data/wiktionary-chinese.jsonl.gz

generate-wiktionary-chinese:
	rm -f output/wiktionary/wiktionary-chinese.db
	mkdir -p output/wiktionary
	npx drizzle-kit push --config=drizzle-wiktionary-chinese.config.ts
	npx tsx scripts/generate-wiktionary-chinese-database.ts
	npx tsx scripts/generate-wiktionary-license.ts
	npx tsx scripts/generate-version-file.ts

# English Wiktionary
download-wiktionary-english:
	mkdir -p data
	curl -o data/wiktionary-english.jsonl.gz https://kaikki.org/dictionary/raw-wiktextract-data.jsonl.gz
	gunzip data/wiktionary-english.jsonl.gz

generate-wiktionary-english:
	rm -f output/wiktionary/wiktionary-english.db
	mkdir -p output/wiktionary
	npx drizzle-kit push --config=drizzle-wiktionary-english.config.ts
	npx tsx scripts/generate-wiktionary-english-database.ts
	npx tsx scripts/generate-wiktionary-license.ts
	npx tsx scripts/generate-version-file.ts

# Japanese Wiktionary
download-wiktionary-japanese:
	mkdir -p data
	curl -o data/wiktionary-japanese.jsonl.gz https://kaikki.org/dictionary/downloads/ja/ja-extract.jsonl.gz
	gunzip data/wiktionary-japanese.jsonl.gz

generate-wiktionary-japanese:
	rm -f output/wiktionary/wiktionary-japanese.db
	mkdir -p output/wiktionary
	npx drizzle-kit push --config=drizzle-wiktionary-japanese.config.ts
	npx tsx scripts/generate-wiktionary-japanese-database.ts
	npx tsx scripts/generate-wiktionary-license.ts
	npx tsx scripts/generate-version-file.ts

# Tatoeba
download-tatoeba:
	mkdir -p data
	curl -o data/tatoeba-sentences.tar.bz2 https://downloads.tatoeba.org/exports/sentences.tar.bz2
	bunzip2 data/tatoeba-sentences.tar.bz2
	curl -o data/tatoeba-sentences-base.tar.bz2 https://downloads.tatoeba.org/exports/sentences_base.tar.bz2
	bunzip2 data/tatoeba-sentences-base.tar.bz2
	curl -o data/tatoeba-sentences-with-audio.tar.bz2 https://downloads.tatoeba.org/exports/sentences_with_audio.tar.bz2
	tar -xjf data/tatoeba-sentences-with-audio.tar.bz2

generate-tatoeba:
	rm -f output/tatoeba/tatoeba.db
	mkdir -p output/tatoeba
	npx drizzle-kit push --config=drizzle-tatoeba.config.ts
	npx tsx scripts/generate-tatoeba-database.ts
	npx tsx scripts/generate-tatoeba-license.ts
	npx tsx scripts/generate-version-file.ts

# Make Me a Hanzi
download-make-me-a-hanzi:
	mkdir -p data
	curl -o data/make-me-a-hanzi.jsonl https://raw.githubusercontent.com/skishore/makemeahanzi/refs/heads/master/graphics.txt

generate-make-me-a-hanzi:
	rm -f output/make-me-a-hanzi/make-me-a-hanzi.db
	mkdir -p output/make-me-a-hanzi
	npx drizzle-kit push --config=drizzle-make-me-a-hanzi.config.ts
	npx tsx scripts/generate-make-me-a-hanzi-database.ts
	npx tsx scripts/generate-make-me-a-hanzi-license.ts
	npx tsx scripts/generate-version-file.ts

# MoeDict
download-moedict:
	mkdir -p data
	curl -o data/moedict.json https://raw.githubusercontent.com/g0v/moedict-data/refs/heads/master/dict-revised.json

generate-moedict:
	rm -f output/moedict/moedict.db
	mkdir -p output/moedict
	npx drizzle-kit push --config=drizzle-moedict.config.ts
	npx tsx scripts/generate-moedict-database.ts
	npx tsx scripts/generate-moedict-license.ts
	npx tsx scripts/generate-version-file.ts

# HSK
download-hsk:
	mkdir -p data/hsk
	curl -o data/hsk/character.txt https://raw.githubusercontent.com/elkmovie/hsk30/refs/heads/main/charlist.txt
	curl -o data/hsk/word.txt https://raw.githubusercontent.com/elkmovie/hsk30/refs/heads/main/wordlist.txt

generate-hsk:
	rm -f output/hsk/hsk.db
	mkdir -p output/hsk
	npx drizzle-kit push --config=drizzle-hsk.config.ts
	npx tsx scripts/generate-hsk-database.ts
	npx tsx scripts/generate-hsk-license.ts
	npx tsx scripts/generate-version-file.ts

all: \
	install \
	download-cc-cedict \
	generate-cc-cedict \
	download-unihan \
	generate-unihan \
	download-wiktionary-chinese \
	generate-wiktionary-chinese \
	download-wiktionary-english \
	generate-wiktionary-english \
	download-wiktionary-japanese \
	generate-wiktionary-japanese \
	download-tatoeba \
	generate-tatoeba \
	download-make-me-a-hanzi \
	generate-make-me-a-hanzi \
	download-moedict \
	generate-moedict \
	download-hsk \
	generate-hsk

clean:
	rm -rf node_modules
	rm -rf data
	rm -rf output
