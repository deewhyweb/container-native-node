oc adm policy add-scc-to-user privileged -z default -n nodeservice
oc create configmap mongo-initdb --from-file=mongodb/seed.sh
oc create -f mongodb.yaml
oc apply -f <(istioctl kube-inject -f node-service.yaml)



docker tag 5570cfc4dd3e deewhyweb/node-service:latest
MacBook-Pro-6:node-service philiphayes$ docker push deewhyweb/node-service:latest


docker build --rm -f Dockerfile -t node-service:latest .
docker tag 0ab4f236f9ca docker-registry-default.router.default.svc.cluster.local/samplenode/node-service:latest

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/node-service:latest .


docker tag 78e0b31fd5e8 docker-registry-default.router.default.svc.cluster.local/samplenode/gw:latest

docker build --rm -f Dockerfile -t docker-registry-default.router.default.svc.cluster.local/samplenode/gw:latest .


