mongo <<EOF
use test
db.products.insert({"product_id":2.0,"id":"B000JZ4HQO","title":"Clickart 950 000 - Premier image pack (dvd-rom)","description":"Clickart 950 000 - Premier image pack (dvd-rom)","manufacturer":"Broderbund","price":100.0,"image":"6.jpeg"})
db.reviews.insert({"product_id":2.0,"id":"B000JZ4HQO","title":"Best product I've ever purchased","userId":"Tom Smith"})
db.cart.insert({"product_id":2.0,"id":"B000JZ4HQO","quantity": "1","userId":"Tom Smith"})
EOF