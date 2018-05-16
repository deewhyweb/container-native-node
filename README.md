oc adm policy add-scc-to-user privileged -z default -n nodeservice
oc create configmap mongo-initdb --from-file=mongodb/seed.sh
oc create -f mongodb.yaml
oc apply -f <(istioctl kube-inject -f node-service.yaml)

docker login -p 0JY7I635phG_KwJpugYOSC9FWtwvIL1hTzvheoHOJk0 docker-registry-default.router.default.svc.cluster.local


docker tag 5570cfc4dd3e deewhyweb/node-service:latest
MacBook-Pro-6:node-service philiphayes$ docker push deewhyweb/node-service:latest


docker build --rm -f Dockerfile -t node-service:latest .
docker tag 0ab4f236f9ca docker-registry-default.router.default.svc.cluster.local/samplenode/node-service:latest

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/node-service:latest .


docker tag 78e0b31fd5e8 docker-registry-default.router.default.svc.cluster.local/samplenode/gw:latest

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/gw:latest .

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/reviews:latest .

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/cart:latest .


istioctl create -f ./http-fault.yaml
istioctl delete -f ./http-fault.yaml
