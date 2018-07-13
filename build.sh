#!/bin/sh

echo 'Compiling...';

env GOOS=linux GOARCH=amd64 go build -o monitor main.go

echo 'Compile success!'
echo 'Packing...'

mkdir tmp
cp monitor tmp/
cp -R conf tmp/
cp -R static tmp/

cd tmp/

cd conf/

mv app_prod.conf app.conf

cd ..

tar -czf ../monitor.tar.gz *

cd ..
rm -rf tmp/

echo 'Pack success!'