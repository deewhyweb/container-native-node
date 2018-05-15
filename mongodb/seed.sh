mongo <<EOF
use test
db.products.insert({"product_id":2.0,"id":"B000JZ4HQO","title":"Clickart 950 000 - Premier image pack (dvd-rom)","description":"Clickart 950 000 - Premier image pack (dvd-rom)","manufacturer":"Broderbund","price":100.0,"image":"6.jpeg"})
EOF