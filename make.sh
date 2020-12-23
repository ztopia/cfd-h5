yarn install
yarn run build
git clone https://oauth2:ngADU1tpZM28R1NcjeFS@gitlab.coinidx.pro/app/hqchart_kline.git
cd hqchart_kline/
git checkout feature/cdf-ok-kline
yarn install
yarn run build 
mv dist ../dist/kline
rm -rf hqchart_kline/
cd..
docker build -t registry.cn-hongkong.aliyuncs.com/liteex/cfd-h5:liteex-pro .
docker push registry.cn-hongkong.aliyuncs.com/liteex/cfd-h5:liteex-pro
