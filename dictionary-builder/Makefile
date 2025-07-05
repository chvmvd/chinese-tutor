install:
	npm ci

prepare:
	mkdir -p data
	mkdir -p dictionaries

# CC-CEDICT
update-cccedict: prepare
	curl -o data/cc_cedict.txt.gz https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz
	gunzip data/cc_cedict.txt.gz
	mkdir -p dictionaries/cc_cedict
	npx tsx src/convert-cccedict.ts
	npx tsx src/update-version-file.ts

# Unihan
update-unihan: prepare
	curl -o data/unihan.zip https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
	unzip data/unihan.zip -d data/unihan
	mkdir -p dictionaries/unihan
	npx tsx src/convert-unihan.ts
	npx tsx src/update-version-file.ts

# Wiktionary
update-wiktionary-chinese: prepare
	curl -o data/wiktionary-chinese.jsonl.gz https://kaikki.org/dictionary/downloads/zh/zh-extract.jsonl.gz
	gunzip data/wiktionary-chinese.jsonl.gz
	mkdir -p dictionaries/wiktionary
	npx tsx src/convert-wiktionary-chinese.ts
	npx tsx src/update-version-file.ts

# Wiktionary
update-wiktionary-english: prepare
	curl -o data/wiktionary-english.jsonl.gz https://kaikki.org/dictionary/raw-wiktextract-data.jsonl.gz
	gunzip data/wiktionary-english.jsonl.gz
	mkdir -p dictionaries/wiktionary
	npx tsx src/convert-wiktionary-english.ts
	npx tsx src/update-version-file.ts

# Wiktionary
update-wiktionary-japanese: prepare
	curl -o data/wiktionary-japanese.jsonl.gz https://kaikki.org/dictionary/downloads/ja/ja-extract.jsonl.gz
	gunzip data/wiktionary-japanese.jsonl.gz
	mkdir -p dictionaries/wiktionary
	npx tsx src/convert-wiktionary-japanese.ts
	npx tsx src/update-version-file.ts

# Tatoeba
update-tatoeba: prepare
	curl -o data/tatoeba-chinese-sentences.tar.bz2 https://downloads.tatoeba.org/exports/sentences.tar.bz2
	bunzip2 data/tatoeba-chinese-sentences.tar.bz2
	curl -o data/tatoeba-sentences-base.tar.bz2 https://downloads.tatoeba.org/exports/sentences_base.tar.bz2
	bunzip2 data/tatoeba-sentences-base.tar.bz2
	curl -o data/tatoeba-sentences-with-audio.tar.bz2 https://downloads.tatoeba.org/exports/sentences_with_audio.tar.bz2
	tar -xjf data/tatoeba-sentences-with-audio.tar.bz2
	mkdir -p dictionaries/tatoeba
	npx tsx src/convert-tatoeba.ts
	npx tsx src/update-version-file.ts

all: install update-cccedict update-unihan

clean:
	rm -rf node_modules
	rm -rf data
	rm -rf dictionaries
