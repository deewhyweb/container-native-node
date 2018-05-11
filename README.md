oc adm policy add-scc-to-user privileged -z default -n nodeservice
oc create -f node-service.yaml
oc apply -f <(istioctl kube-inject -f node-service.yaml)



docker tag 5570cfc4dd3e deewhyweb/node-service:latest
MacBook-Pro-6:node-service philiphayes$ docker push deewhyweb/node-service:latest